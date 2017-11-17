const serverless = require('serverless-http');
const express = require('express');
const app = express();

app.post('/mixpanel_sendgrid_event', function(req, res) {
  res.send('Hello World!');
});

module.exports.handler = serverless(app);
