const querystring = require('querystring');

module.exports = {
  pattern: /(search (for )?)?authors? (named )?(.+)/,
  reply: function(message, match, reply) {
    const params = {
      search: match[4],
      author: '',
    };
    const uri = `http://www.esoui.com/downloads/search.php?${querystring.stringify(params)}`;
    reply(`See [author results for "${match[4]}"](${uri})`);
  }
};
