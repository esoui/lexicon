import Halley from 'halley';
import https from 'https';
import qs from 'querystring';
import * as bot from './bot';

// -
// -
// -

function sendChatMessage(text) {
  const payload = JSON.stringify({ text });
  const options = {
    hostname: 'api.gitter.im',
    port: 443,
    path: `/v1/rooms/${process.env.GITTER_ROOM_ID}/chatMessages`,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(payload),
      'Authorization': `Bearer ${process.env.GITTER_TOKEN}`
    }
  };
  console.log('Send chat message', options);

  const request = https.request(options, function(response) {
    response.on('data', function(chunk) {
      response.setEncoding('utf-8');
      const message = JSON.parse(chunk);
      console.log('Send chat message', message);
    });
  });

  request.on('error', (e) => console.error('Something went wrong', e.message));
  request.write(payload);
  request.end();
}

// -

function updateEyeball(socketId, on) {
  const payload = JSON.stringify({ socketId, on });
  const options = {
    hostname: 'api.gitter.im',
    port: 443,
    path: `/v1/eyeballs`,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(payload),
      'Authorization': `Bearer ${process.env.GITTER_TOKEN}`
    }
  };
  console.log('Set eyeball', options, payload);

  const request = https.request(options, function(response) {
    response.on('data', function(chunk) {
      response.setEncoding('utf-8');
      const message = JSON.parse(chunk);
      console.log('Set eyeball', message);
    });
  });

  request.on('error', (e) => console.error('Something went wrong', e.message));
  request.write(payload);
  request.end();
}

// -
// -
// -

class AuthExt {
  outgoing(message, callback) {
    if (message.channel === '/meta/handshake') {
      message.ext = message.ext || { token: process.env.GITTER_TOKEN };
    }
    callback(message);
  }

  incoming(message, callback) {
    if (message.channel === '/meta/handshake') {
      if (message.successful) {
        console.log('Authorization granted', message);
      } else {
        console.error('Authorization denied', message);
      }
    }
    callback(message);
  }
}

// -
// -
// -

const client = new Halley.Client('https://ws.gitter.im/bayeux');
client.addExtension(new AuthExt());

{
  const uri = `/api/v1/rooms/${process.env.GITTER_ROOM_ID}`;
  client.subscribe(uri).then(() => {
    updateEyeball(client.getClientId(), true);
    process.on('SIGINT', () => updateEyeball(client.getClientId(), false));
  });
}

{
  const uri = `/api/v1/rooms/${process.env.GITTER_ROOM_ID}/chatMessages`;
  const handler = function(message) {
    console.log('Chat message', message);

    if (message.operation === 'create') {
      bot.parse(message.model, (text) => {
        sendChatMessage(`@${message.model.fromUser.username} ${text}`);
      });
    }
  };
  client.subscribe(uri, handler);
}
