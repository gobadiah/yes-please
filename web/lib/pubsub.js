const Pubsub = require('@google-cloud/pubsub');

export const getTopic = topicName => new Promise((resolve, reject) => {
  const pubsub = Pubsub();
  pubsub.createTopic(topicName, (err, topic) => {
    if (err && err.code === 6) {
      resolve(pubsub.topic(topicName));
    } else if (!err) {
      resolve(topic);
    } else {
      reject(err);
    }
  });
});

export const publish = (topicName, data) => new Promise((resolve, reject) => {
  getTopic(topicName)
    .then((topic) => {
      const publisher = topic.publisher();
      publisher.publish(Buffer.from(JSON.stringify(data)), (err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
});

export const subscribe = (topicName, subscriptionName, handler) => {
  function handleMessage(message) {
    const data = JSON.parse(message.data);
    message.ack();
    handler(data);
  }
  function handleError(err) {
    console.err(err);
  }

  return new Promise((resolve, reject) => {
    getTopic(topicName)
      .then((topic) => {
        topic.createSubscription(subscriptionName, (err, sub) => {
          if (err) {
            reject(err);
            return;
          }
          sub.on('message', handleMessage);
          sub.on('error', handleError);

          resolve(() => {
            sub.removeListener('message', handleMessage);
            sub.removeListener('error', handleError);
          });
        });
      }).catch(err => reject(err));
  });
};
