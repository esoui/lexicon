const querystring = require('querystring');

module.exports = {
  pattern: '(search )?wiki (for )?(.+)',
  reply: function(message, match, reply) {
    const params = {
      search: match[3],
      go: 1
    };
    const uri = `http://wiki.esoui.com/w/index.php?${querystring.stringify(params)}`;
    reply(`See [wiki results for "${match[3]}"](${uri})`);
  }
};
