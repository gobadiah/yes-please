const downloadYoutubeVideo = require('./index').downloadYoutubeVideo;

const event = {
  data: {
    data: Buffer.from(JSON.stringify({
      url: 'https://www.youtube.com/watch?v=IGgdQfhGDKo',
    })),
  }
};

downloadYoutubeVideo(event, function() {});
