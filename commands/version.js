const https = require('https');

module.exports = {
  name: 'version',
  pattern: "(what('s| is) the )?(current|live|pts) version",
  reply: function(message, match, reply) {
    const branch = match[3] === 'pts' ? 'pts' : 'master';
    https.get(`https://raw.githubusercontent.com/esoui/esoui/${branch}/README.md`, function(response) {
      response.setEncoding('utf-8');
      response.on('data', function(chunk) {
        const version = chunk.match(/Last update: (.+) on/);
        reply(version[1]);
      });
    });
  }
};
