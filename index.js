const Gitter = require('./gitter');
const Lexicon = require('./lexicon');

const client = new Gitter();

function listenAndReply(roomId) {
  client.readChatMessages(roomId, (message) => {
    if (message.operation === 'create') {
      if (message.model.fromUser.id === process.env.GITTER_LEXICON_USER_ID) return;

      let prefix = '';

      if (roomId === process.env.GITTER_ESOUI_ROOM_ID) {
        if (!/^@?lex(icon)?/.test(message.model.text)) return;
        prefix += `@${message.model.fromUser.username} `;
      }

      Lexicon.parse(message.model.text, (text) => {
        client.sendChatMessage(roomId, `${prefix}${text}`);
      });
    }
  });
}

const rooms = [];

client.watchRoomUpdates(process.env.GITTER_LEXICON_USER_ID, (message) => {
  const roomId = message.model.id;
  if (message.operation === 'create' || message.operation === 'patch') {
    if (message.operation === 'create') {
      Lexicon.parse('', (text) => {
        client.sendChatMessage(roomId, text);
      });
    }
    if (rooms.indexOf(roomId) < 0) {
      listenAndReply(roomId);
      rooms.push(roomId);
    }
  }
});

// listenAndReply(process.env.GITTER_ESOUI_ROOM_ID);
