const path = require('path');
const fs = require('fs');

const commands = [];
{
  const prefix = path.join(__dirname, 'commands');
  fs.readdir(prefix, (err, files) => {
    files.forEach((file) => {
      const entry = require(path.join(prefix, file));
      commands.push(entry);
    });
  });
}

const help = "Hi, I'm the Lexicon, here's [what I can do](http://wiki.esoui.com/Lexicon).";

function parse(text, reply) {
  let commandNotFound = true;
  commands.forEach(function(command) {
    if (!command.pattern) return true;
    const match = text.toString().match(new RegExp('^' + command.pattern, 'i'));
    if (match) {
      commandNotFound = false;
      command.reply(text, match, reply);
    }
  });
  if (commandNotFound) reply(help);
}

module.exports = { parse };
