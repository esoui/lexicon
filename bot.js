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
  console.log('message', message);

  if (!message || !message.text) return;
  const [ ,,input ] = message.text.match(/^lex(icon)?\s(.+)/) || [];
  if (!input) return;

  console.log('input', input);

  lexicon.forEach(function(entry) {
    const match = input.match(entry.pattern);
    if (match) entry.reply(message, match, reply);
  });
};

module.exports = { parse };
