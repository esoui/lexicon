const https = require('https');

module.exports = {
  pattern: /(what('s| is) the)?current version/,
  reply: function(message, match, reply) {
    https.get('https://raw.githubusercontent.com/esoui/esoui/master/README.md', function(response) {
      response.setEncoding('utf-8');
      response.on('data', function(chunk) {
        const version = chunk.match(/Last update: (.+) on/);
        reply(version[1]);
      });
    });
  }
};
