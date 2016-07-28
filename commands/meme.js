const http = require('http');

module.exports = {
  name: 'meme',
  pattern: '((create )?meme (.+)|(see )?memes( templates)?)',
  reply: function(message, match, reply) {
    if (match[3]) {
      let params = match[3].split(';').map(function(value) {
        return encodeURIComponent(value.replace(/^\s+|\s+$/, ''));
      });
      params[1] = params[1] || '_';
      params[2] = params[2] || '_';
      reply(`http://memegen.link/${params.join('/')}.jpg`);
    } else {
      reply('See all [meme templates](http://memegen.link/templates).');
    }
  }
};
