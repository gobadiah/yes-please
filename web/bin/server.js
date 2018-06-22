/* eslint-disable no-console */

import path from 'path';
import uuid from 'uuid/v4';

import {
  publish,
  subscribe,
} from '../lib/pubsub';

const app = require('express')();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const next = require('next');
const favicon = require('serve-favicon');

const port = parseInt(process.env.PORT, 10) || 8080;
const dev = process.env.NODE_ENV !== 'production';
const nextApp = next({ dev });
const nextHandler = nextApp.getRequestHandler();

const askTopic = 'ask-topic';
const responseTopic = 'response-topic';
const subscriptionName = `web-server-${uuid()}`;

const db = {};

const handler = (data) => {
  const { url, response } = data;
  if (!url) {
    console.warn('No url in data');
    return;
  }
  if (!response) {
    console.warn('No response in data');
    return;
  }
  if (!db[url]) {
    console.warn(`${url} not in database.`);
    return;
  }
  console.log('Sending response to clients');
  db[url].sockets.forEach(socket => socket.emit('message', response));
  db[url] = {
    sockets: [],
    response,
  };
};

subscribe(responseTopic, subscriptionName, handler)
  .then(() => console.log('Subscribed to', responseTopic))
  .catch(err => console.warn('Error subscribing to', responseTopic, ':', err));

io.on('connection', (socket) => {
  socket.on('message', (url) => {
    console.log('Receiving', url, 'from client', socket.id);
    if (!db[url]) {
      db[url] = {
        sockets: [socket],
        response: undefined,
      };
      publish(askTopic, { url })
        .then(() => console.log('Published', url, 'to', askTopic))
        .catch(err => console.warn('Error publishing', url, 'to', askTopic, ':', err));
    } else if (db[url].response) {
      console.log('Response already available for', url);
      socket.emit('message', db[url].response);
    } else if (db[url].sockets.indexOf(socket) === -1) {
      console.log(url, 'already asked, adding socket to queue for response.');
      db[url].sockets.push(socket);
    } else {
      console.log(url, 'already asked, and socket already in in queue for response.');
    }
  });
});

nextApp.prepare()
  .then(() => {
    app.use(favicon(path.join(__dirname, '../static', 'favicon.ico')));

    app.get('*', nextHandler);

    server.listen(port, (err) => {
      if (err) {
        throw err;
      }
      console.log(`> ready on http://localhost:${port}`);
    });
  });

