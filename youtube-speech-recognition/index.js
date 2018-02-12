/**
 * HTTP Cloud Function.
 *
 * @param {Object} req Cloud Function request context.
 * @param {Object} res Cloud Function response context.
 */

const publish = require('./lib/pubsub').publish;

const responseTopic = 'response-topic';

const bucketName = 'yes-please-michael-development';

module.exports.downloadYoutubeVideo = function(event, callback) {
  try {
    const buffer = Buffer.from(event.data.data, 'base64');
    console.log('buffer =', buffer);
    console.log('toString =', buffer.toString());
    console.log('data =', JSON.parse(buffer.toString()));
    const { url } = JSON.parse(buffer.toString());
    console.log('url =', url);
    const speech = require('@google-cloud/speech');
    const base64 = require('base64-stream');
    const projectId = 'yes-please-michael';
    const youtubedl = require('youtube-dl');
    const storage = require('@google-cloud/storage')();
    const bucket = storage.bucket(bucketName);
    const video = youtubedl(url, ['--format=18'], { cwd: __dirname });
    const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;
    const ffmpeg = require('fluent-ffmpeg');
    const uuid = require('uuid/v4')();
    ffmpeg.setFfmpegPath(ffmpegPath);
    const key = `${uuid}.flac`;

    const client = new speech.SpeechClient({
      projectId: projectId,
    });
    const remoteWriteStream = bucket.file(key).createWriteStream();
    video.on('info', function(info) {
      console.log('Download started');
      console.log('filename: ' + info.filename);
      console.log('size: ' + info.size);
    });

    video.on('complete', function(info) {
      console.log('filename: ' + info._filename + ' already downloaded.');
    });
    video.on('end', function() {
      console.log('finished downloading!');
    });
    video.on('error', function(err) {
      console.log('Error downloading', err);
      publish(responseTopic, { url, response: err });
      callback(err);
    });
    const command = ffmpeg()
    .input(video)
    .outputOptions('-vn')
    .outputOptions('-ac 1')
    .outputOptions('-ar 16000')
    .outputOptions('-sample_fmt s16')
    .format('flac')
    .on('start', (commandLine) => {
          console.log('Spawned Ffmpeg with command: ' + commandLine)
       })
    .on('end', () => {
      console.log('file has been converted succesfully:', key)
      setTimeout(function() {
        const audio = {
          uri: `gs://${bucketName}/${key}`,
        };
        const config = {
          encoding: 'FLAC',
          sampleRateHertz: 16000,
          languageCode: 'fr-FR',
        };
        const request = {
          config,
          audio,
        };
        client.longRunningRecognize(request)
          .then((data) => {
            console.log('Sent long running recognize');
            const response = data[0];
            const operation = response;
            return operation.promise();
          }).then((data) => {
            console.log('Operation terminated');
            const response = data[0];
            publish(responseTopic, { url, response });
            callback();
          }).catch((err) => {
            console.log('ERROR:', err);
            publish(responseTopic, { url, response: err });
            callback(err);
          });
        /*
        const file = bucket.file(key);
        file.download(function(err, contents) {
          if (err) {
            console.log('Error while downloading file', err);
            publish(responseTopic, { url, response: err });
            callback(err);
            return;
          }
          const audioBytes = contents.toString('base64');
          // The audio file's encoding, sample rate in hertz, and BCP-47 language code
          const audio = {
            content: audioBytes,
          };
          const config = {
            encoding: 'FLAC',
            sampleRateHertz: 16000,
            languageCode: 'fr-FR',
          };
          const request = {
            audio: audio,
            config: config,
          };
          client
            .recognize(request)
            .then(data => {
              const response = data[0];
              const transcription = response;
              console.log(`Transcription: ${transcription}`);
              publish(responseTopic, { url, response })
              callback();
            })
            .catch(err => {
              console.error('ERROR:', err);
              publish(responseTopic, { url, response: err });
              callback(err);
            });
        });
        */
      }, 1000);
    })
    .on('error', (err, stdout, stderr) => {
      console.log('an error happened: ' + err.message)
      console.log('stdout: ' + stdout)
      console.log('stderr: ' + stderr)
      publish(responseTopic, { url, response: err });
      callback();
    })
    .pipe(remoteWriteStream, {end:true});
  } catch (err) {
    console.log(err);
    publish(responseTopic, { url, response: err });
    callback();
  }
};
