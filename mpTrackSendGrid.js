const serverless = require('serverless-http');

const Mixpanel = require('mixpanel');
const mixpanel = Mixpanel.init(process.env.MIXPANEL_TOKEN);

function handler(event, context, callback) {
  let body = JSON.parse(event.body);
  let eventsTracked = 0;

  body.forEach((sendGridEvent) => {
    mixpanel.track('SendGrid: ' + sendGridEvent.event, sendGridEvent);
    eventsTracked += 1;
  });

  const response = {
    statusCode: 200,
    eventsTracked: eventsTracked
  };

  callback(null, response);
}

module.exports.mixpanel = mixpanel;
module.exports.handler = handler;
