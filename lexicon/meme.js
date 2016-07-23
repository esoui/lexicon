const http = require('http');

module.exports = {
  pattern: '((create )?meme (.+?) (.+?); ?(.+)|(see )?memes( templates)?)',
  reply: function(message, match, reply) {
    if (match[3]) {
      const params = [
        encodeURIComponent(match[3]),
        encodeURIComponent(match[4]),
        encodeURIComponent(match[5])
      ];
      reply(`http://memegen.link/${params.join('/')}.jpg`);
    } else {
      reply('See all [meme templates](http://memegen.link/templates).');
    }
  }
};
