const querystring = require('querystring');

module.exports = {
  name: 'forum',
  pattern: '(search (in )?)?forums? (for )?(.+)',
  reply: function(message, match, reply) {
    const params = {
      query: match[4],
      do: 'process'
    };
    const uri = `http://www.esoui.com/forums/search.php?${querystring.stringify(params)}`;
    reply(`See [forum results for "${match[4]}"](${uri})`);
  }
};
