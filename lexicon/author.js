const querystring = require('querystring');

module.exports = {
  pattern: '(search (for )?)?(author|user)s? (named )?(.+)',
  reply: function(message, match, reply) {
    const params = {
      ausername: match[5],
      do: 'getall',
    };
    const uri = `http://www.esoui.com/forums/memberlist.php?${querystring.stringify(params)}`;
    reply(`See [author results for "${match[5]}"](${uri})`);
  }
};
