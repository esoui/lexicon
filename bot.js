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

const parse = function parse(message, reply) {
  if (!message || !message.text) return;

  let [ prefix,,,input ] = message.text.match(/^lex(icon)?(\s(.+)|\s$|$)/) || [];
  if (!prefix) return;
  if (!input) input = 'help';

  lexicon.forEach(function(entry) {
    if (!entry.pattern) return true;
    const match = input.match(new RegExp('^' + entry.pattern, 'i'));
    if (match) entry.reply(message, match, reply);
  });
};

module.exports = { parse };
