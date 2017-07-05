const Gitter = require('./gitter');
const Lexicon = require('./lexicon');

const client = new Gitter();

const activeRooms = {};

function listenAndReply(roomId) {
  if (activeRooms[roomId]) {
    return;
  } else {
    activeRooms[roomId] = true;
  }

  client.readChatMessages(roomId, (data) => {
    if (data.operation === 'create') {
      if (data.model.fromUser.id === process.env.GITTER_LEXICON_USER_ID) return;

      let prefix = '';
      let message = data.model.text;

      if (roomId === process.env.GITTER_ESOUI_ROOM_ID) {
        const match = message.match(/^@?lex(icon)?(\s(.+)|$)/);
        if (!match) return;
        prefix += `@${data.model.fromUser.username} `;
        message = match[3];
      }

      Lexicon.parse(message, (text) => {
        client.sendChatMessage(roomId, `${prefix}${text}`);
      });
    }
  });
}

client.watchRoomUpdates(process.env.GITTER_LEXICON_USER_ID, (message) => {
  const roomId = message.model.id;
  if (message.operation === 'create' || message.operation === 'patch') {
    if (message.operation === 'create') {
      Lexicon.parse('', (text) => {
        client.sendChatMessage(roomId, text);
      });
    }
    if (activeRooms.indexOf(roomId) < 0) {
      listenAndReply(roomId);
      activeRooms.push(roomId);
    }
  }
});
