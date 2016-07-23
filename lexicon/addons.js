const querystring = require('querystring');

module.exports = {
  pattern: '(search for )?add-?ons? (with |named )?(.+)',
  reply: function(message, match, reply) {
    const params = {
      search: match[3],
      title: '',
      description: '',
    };
    const uri = `http://www.esoui.com/downloads/search.php?${querystring.stringify(params)}`;
    reply(`See [add-ons results for "${match[3]}"](${uri})`);
  }
};
