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

  const [ ,,input ] = message.text.match(/^lex(icon)?\s(.+)/) || [];
  if (input === undefined) return;

  lexicon.forEach(function(entry) {
    const match = input.match(new RegExp(entry.pattern, 'i'));
    if (match) entry.reply(message, match, reply);
  });
};

module.exports = { parse };
