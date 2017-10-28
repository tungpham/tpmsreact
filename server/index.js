require('dotenv').load();
const express = require('express');
const cors = require('cors');
const request = require('request');
const bodyParser = require('body-parser');
const twilio = require('twilio');
const path = require('path');
const middleware = require('./middleware');
const ClientCapability = twilio.jwt.ClientCapability;
const VoiceResponse = twilio.twiml.VoiceResponse;
const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use('/stream/without-parser', (req, res, next) => {
  request({
    url: req.body.url,
    method: req.body.method,
    json: req.body,
    headers: {
      'Content-Type': req.headers['content-type'],
      'Authorization': req.headers['authorization']
    },
    rejectUnauthorized: false,
    strictSSL: false,
  }).pipe(res);
});

app.use(bodyParser.urlencoded({ extended: false }));

app.get('.well-known/acme-challenge/:code', (req, res) => {
  res.send(req.params.code);
});

app.use('/stream', (req, res, next) => {
  request({
    url: req.body.url,
    method: req.body.method,
    form: req.body,
    headers: {
      'Content-Type': req.headers['content-type'],
      'Authorization': req.headers['authorization']
    },
    rejectUnauthorized: false,
    strictSSL: false,
  }).pipe(res);
});


app.post('/call-token', (req, res) => {
  const capability = new ClientCapability({
    accountSid: req.body.accountSId,
    authToken: req.body.authToken,
  });

  const credential = `${req.body.accountSId}:${req.body.authToken}`;

  request.get(`https://${credential}@api.twilio.com/2010-04-01/Accounts/${req.body.accountSId}/Applications.json`, (errors, response, body) => {
    if (response.statusCode === 200) {
      body = JSON.parse(body);
      const firstApp = body.applications[0];
      if (firstApp) {
        capability.addScope(
          new ClientCapability.OutgoingClientScope({
            applicationSid: 'AP3905f8a1ab9a5ca7ec1408affeea932d'
          })
        );
        const token = capability.toJwt();

        // Include token in a JSON response
        return res.json({
          token,
        });
      } else {
        return res.json({
          token: null,
        });
      }
    }
    res.json({
      token: null,
    });
  });
});

// Create TwiML for outbound calls
app.post('/voice', (request, response) => {
  let voiceResponse = new VoiceResponse();
  voiceResponse.dial({
    callerId: request.body.fromNumber,
  }, request.body.To);
  response.type('text/xml');
  response.send(voiceResponse.toString());
});

const isProd = process.env.NODE_ENV === 'production';

if (isProd) {
  middleware.prod(app, {
    outputPath: path.resolve(process.cwd(), 'build'),
    publicPath: '/',
  });
} else {
  const webpackConfig = require('../config/webpack.config.dev');
  middleware.dev(app, webpackConfig);
}


app.listen(3002, function () {
  console.log('TPMS listening on port 3002!')
});