const Halley = require('halley');
const https = require('https');

function onError(error) {
  console.error('--> Somethinh went wrong', error);
}

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
        console.log('--> /meta/handshake', message);
      } else {
        console.error('--> /meta/handshake', message);
      }
    }
    callback(message);
  }
}

class Gitter {
  constructor() {
    this.client = new Halley.Client('https://ws.gitter.im/bayeux');
    this.client.addExtension(new AuthExt());
  }

  subscribe(channel, handler) {
    this.client.subscribe(channel, (message) => {
      console.log(`--> ${channel}`, message);
      handler(message);
    });
  }

  updateEyeball(value) {
    const payload = JSON.stringify({ socketId: this.client.getClientId(), value });
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

    console.log('--> updateEyeball', options);

    const request = https.request(options, function(response) {
      response.on('data', function(chunk) {
        const message = JSON.parse(chunk);
        console.log('--> updateEyeball', message);
      });
      response.setEncoding('utf-8');
    });

    request.on('error', onError);
    request.write(payload);
    request.end();
  }

  watchRoomUpdates(userId, handler) {
    const channel = `/api/v1/user/${userId}/rooms`;
    this.subscribe(channel, handler);
  }

  readChatMessages(roomId, handler) {
    const channel = `/api/v1/rooms/${roomId}/chatMessages`;
    this.subscribe(channel, handler);
  }

  sendChatMessage(roomId, text) {
    const payload = JSON.stringify({ text });
    const options = {
      hostname: 'api.gitter.im',
      port: 443,
      path: `/v1/rooms/${roomId}/chatMessages`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(payload),
        'Authorization': `Bearer ${process.env.GITTER_TOKEN}`
      }
    };

    console.log('--> sendChatMessage', options);

    const request = https.request(options, function(response) {
      response.on('data', function(chunk) {
        const message = JSON.parse(chunk);
        console.log('--> sendChatMessage', message);
      });
      response.setEncoding('utf-8');
    });

    request.on('error', onError);
    request.write(payload);
    request.end();
  }
}

module.exports = Gitter;
