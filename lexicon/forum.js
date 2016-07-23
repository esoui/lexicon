const querystring = require('querystring');

module.exports = {
  pattern: /(search (in )?)?forums? (for )?(.+)/,
  reply: function(message, match, reply) {
    const params = {
      q: `${match[4]} site:http://www.esoui.com/forums`,
    };
    const uri = `https://www.google.com/?${querystring.stringify(params)}`;
    reply(`See [forum results for "${match[4]}"](${uri})`);
  }
};
