const querystring = require('querystring');

module.exports = {
  name: 'addon',
  pattern: '(search (for )?)?add-?ons? (with |named )?(.+)',
  reply: function(message, match, reply) {
    const params = {
      search: match[4],
      title: '',
      description: '',
    };
    const uri = `http://www.esoui.com/downloads/search.php?${querystring.stringify(params)}`;
    reply(`See [add-ons results for "${match[3]}"](${uri})`);
  }
};
