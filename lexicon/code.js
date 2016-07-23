const querystring = require('querystring');

module.exports = {
  pattern: /(search (in )?)?(code|source|repo(sitory)?) (for )?(.+)/,
  reply: function(message, match, reply) {
    const params = {
      q: match[6],
      type: 'Code',
      utf8: '✓',
    };
    const uri = `https://github.com/esoui/esoui/search?${querystring.stringify(params)}`;
    reply(`See [${match[3]} results for "${match[6]}"](${uri})`);
  }
};
