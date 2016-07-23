const fs = require('fs');
const path = require('path');

const lexicon = [];
{
  const directory = path.join(__dirname, 'lexicon');
  fs.readdirSync(directory).forEach(function(file) {
    const entry = require(path.join(directory, file));
    lexicon.push(entry);
  });
}

const help = "Hi, I'm the Lexicon, here's [what I can do](http://wiki.esoui.com/Lexicon).";

const parse = function parse(message, reply) {
  if (!message || !message.text) return;
  if (message.text.match(/^((lex(icon)?)( h[ea]lp)?|h[ea]lp)\s?$/)) return reply(help);
  let [ ,,text ] = message.text.match(/^lex(icon)?\s(.+)/) || [];
  if (!text) return;

  lexicon.forEach(function(entry) {
    if (!entry.pattern) return true;
    const match = text.match(new RegExp('^' + entry.pattern, 'i'));
    if (match) entry.reply(message, match, reply);
  });
};

module.exports = { parse };
