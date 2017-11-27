require('dotenv').load();
const express = require('express');
const cors = require('cors');
const request = require('request');
const bodyParser = require('body-parser');
const twilio = require('twilio');
const path = require('path');
const https = require('https');
const fs = require('fs');
const middleware = require('./middleware');
const ClientCapability = twilio.jwt.ClientCapability;
const VoiceResponse = twilio.twiml.VoiceResponse;
const app = express();

const sockets = {};

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
            applicationSid: 'APe57d5cadca2441d0ae9d1c2660905885'
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

app.post('/message', (req, res) => {
  const clients = sockets[req.body.AccountSid] || [];
  clients.forEach(client => {
    if (typeof client !== 'undefined') {
      client.emit('NEW_MESSAGE', req.body);
      res.json({status: true});
    }
  });
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


const socketHandler = io => {
  io.on('connection', function (socket) {
    console.log('A member connected!');
    if (typeof sockets[socket.handshake.query.AccountSid] !== 'undefined') {
      sockets[socket.handshake.query.AccountSid].push(socket);
    } else {
      sockets[socket.handshake.query.AccountSid] = [socket];
    }
    socket.on('disconnect', () => {
      const index = sockets[socket.handshake.query.AccountSid].indexOf(sockets[socket.handshake.query.AccountSid].find(s => s.id === socket.id));
      sockets[socket.handshake.query.AccountSid].splice(index, 1);
    });
  });
};

if (isProd) {
  const options = {
    key: fs.readFileSync('/etc/letsencrypt/live/tpmsreact.uptind.com/privkey.pem'),
    cert: fs.readFileSync('/etc/letsencrypt/live/tpmsreact.uptind.com/cert.pem'),
    ca: fs.readFileSync('/etc/letsencrypt/live/tpmsreact.uptind.com/chain.pem'),
  };

  const httpsServer = https.createServer(options, app);
  const io = require('socket.io')(httpsServer);
  socketHandler(io);
  httpsServer.listen(3002, '0.0.0.0', () => {
    console.info('==> 🌎  API is running on port %s', app.get('port'), app.get('env'));
  });
} else {
  const server = require('http').Server(app);
  const io = require('socket.io')(server);
  server.listen(3002, function () {
    console.log('TPMS listening on port 3002!')
  });
  socketHandler(io);
}


