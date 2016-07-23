const https = require('https');
const querystring = require('querystring');
const bot = require('./bot');
const heartbeat = " \n";

function reply(to, message) {
  const payload = querystring.stringify({
    text: `@${to} ${message}`
  });

  const options = {
    hostname: 'api.gitter.im',
    port: 443,
    path: `/v1/rooms/${process.env.GITTER_ROOM_ID}/chatMessages`,
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Content-Length': Buffer.byteLength(payload),
      'Authorization': `Bearer ${process.env.GITTER_TOKEN}`
    }
  };

  const request = https.request(options, function(response) {
    response.on('data', function(chunk) {
      const message = chunk.toString();
      console.log(message);
    });
  });

  request.on('error', function(e) {
    console.error('Something went wrong', e.message);
  });

  request.write(payload);

  request.end();
}

function listen() {
  const options = {
    hostname: 'stream.gitter.im',
    port: 443,
    path: `/v1/rooms/${process.env.GITTER_ROOM_ID}/chatMessages`,
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${process.env.GITTER_TOKEN}`
    }
  };

  const request = https.request(options, function(response) {
    response.on('data', function(chunk) {
      response.setEncoding('utf-8');
      if (chunk !== heartbeat) {
        const message = JSON.parse(chunk);
        if (message.error) {
          console.error(message);
        } else {
          bot.parse(message, function(response) {
            reply(message.fromUser.username, response);
          });
        }
      }
    });
  });

  request.on('error', function(e) {
    console.error('Something went wrong', e.message);
  });

  request.end();
}

listen();
