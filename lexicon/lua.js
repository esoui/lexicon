const querystring = require('querystring');

module.exports = {
  pattern: /(search )?lua (for )?(.+)/,
  reply: function(message, match, reply) {
    const params = {
      q: match[3]
    };
    const uri = `http://devdocs.io/lua~5.1/#${querystring.stringify(params)}`;
    reply(`See [Lua results for "${match[3]}"](${uri})`);
  }
};
