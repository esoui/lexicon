const querystring = require('querystring');

module.exports = {
  name: 'google',
  pattern: '(please )?google (.+)',
  reply: function(message, match, reply) {
    const params = {
      q: match[2],
    };
    const site = match[1] ? 'http://lmgtfy.com/' : 'https://www.google.com/';
    const uri = `${site}?${querystring.stringify(params)}`;
    reply(`See [Google results for "${match[2]}"](${uri})`);
  }
};
