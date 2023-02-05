import {
  MatrixClient,
  RustSdkCryptoStorageProvider,
  AutojoinRoomsMixin,
  SimpleFsStorageProvider,
  MatrixAuth,
  MessageEvent,
  MatrixProfile,
} from "matrix-bot-sdk";
import minimist from "minimist";
import LRUCache from "lru-cache";
import { dockStart } from "@nlpjs/basic";

import handleTime from "./features/time.js";
import handleServerStatus from "./features/status.js";
import handleSearch from "./features/search.js";
import handleJoke from "./features/joke.js";
import handlePatchNotes from "./features/patch.js";

const dock = await dockStart({
  settings: {
    nlp: {
      log: true,
      languages: ["en"],
      modelFileName: "storage/model.json",
      executeActionsBeforeAnswers: true,
    },
  },
  use: ["Basic", "LangEn"],
});

const nlp = dock.get("nlp");

handleTime(nlp);
handleServerStatus(nlp);
handleSearch(nlp);
handleJoke(nlp);
handlePatchNotes(nlp);

await nlp.train();

const args = minimist(process.argv.slice(2));
const config = {
  homeserverUrl: args.s,
  accessToken: args.t,
  username: args.u,
  password: args.p,
};

if (!config.homeserverUrl) {
  throw new Error("Missing homeserver URL");
}

if (!config.accessToken) {
  if (!config.username || !config.password) {
    throw new Error("Missing access token or credentials");
  }

  const auth = new MatrixAuth(config.homeserverUrl);
  const client = await auth.passwordLogin(config.username, config.password);
  config.accessToken = client.accessToken;
}

// const storage = new MemoryStorageProvider();
const storage = new SimpleFsStorageProvider("storage/bot.json");
const crypto = new RustSdkCryptoStorageProvider("storage/sled");
const matrix = new MatrixClient(
  config.homeserverUrl,
  config.accessToken,
  storage,
  crypto
);
const botId = await matrix.getUserId();
AutojoinRoomsMixin.setupOnClient(matrix);

const cache = new LRUCache({ max: 20 });

async function getContext(userId) {
  if (!cache.has(userId)) {
    const profile = await matrix.getUserProfile(userId);
    cache.set(userId, { profile: new MatrixProfile(userId, profile) });
  }
  return cache.get(userId);
}

async function handler(roomId, event) {
  const senderId = event.sender;
  if (senderId === botId) {
    return;
  }

  const message = new MessageEvent(event);
  if (message.messageType !== "m.text") {
    return;
  }
  console.log(`Message`, message);

  const context = await getContext(senderId);
  console.log(`Context`, context);

  const response = await nlp.process("en", message.textBody, context);
  console.log("Nlp response", response);

  await matrix.replyNotice(
    roomId,
    event,
    "",
    response?.answer ?? "Sorry but I couldn't understand that."
  );
}
matrix.on("room.message", handler);

await matrix.start();

console.log(`Bot started on ${config.homeserverUrl}`);
