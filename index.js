const Gitter = require('./gitter');
const Lexicon = require('./lexicon');

const client = new Gitter();

function listenAndReply(roomId) {
  client.readChatMessages(roomId, (message) => {
    if (message.operation === 'create') {
      if (message.model.fromUser.id === process.env.GITTER_LEXICON_USER_ID) return;
      if (!/^@?lex(icon)?/.test(message.model.text)) return;

      Lexicon.parse(message.model.text, (text) => {
        client.sendChatMessage(roomId, `@${message.model.fromUser.username} ${text}`);
      });
    }
  });
}

listenAndReply(process.env.GITTER_ESOUI_ROOM_ID);
