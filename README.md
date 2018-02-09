# Yes-please

This project is a prototype for extracting speech from youtube video.

It is comprised of the following :

* `devops` handles the infrastucture, currently using Google Cloud Plaform.
* `youtube-speech-recognition` is a Google Function (a simple node module)
which acts as a worker and process a youtube video into text.
* `web` a [next.js](https://github.com/zeit/next.js/) simple web interface
for interacting with the worker.

Additional files : 

* `.gitignore`
