import Mixpanel from 'mixpanel';
import path from 'path';
import fs from 'fs';

const mixpanel = Mixpanel.init(process.env.MIXPANEL_TOKEN);

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

export function parse(message, reply) {
  if (!message || !message.text) return;
  if (message.text.match(/^((lex(icon)?)( h[ea]lp)?|h[ea]lp)\s?$/)) return reply(help);
  let [ ,,text ] = message.text.match(/^lex(icon)?\s(.+)/) || [];
  if (!text) return;

  commands.forEach(function(command) {
    if (!command.pattern) return true;
    const match = text.match(new RegExp('^' + command.pattern, 'i'));
    if (match) {
      mixpanel.track('interaction', { message: text, command: command.name, author: message.fromUser.username });
      command.reply(message, match, reply);
    } else {
      mixpanel.track('interaction', { message: text, command: 'unknown', author: message.fromUser.username });
    }
  });
}

