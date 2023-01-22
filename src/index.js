import {
  MatrixClient,
  RustSdkCryptoStorageProvider,
  AutojoinRoomsMixin,
  SimpleFsStorageProvider,
  MatrixAuth,
  MessageEvent,
} from "matrix-bot-sdk";
import minimist from "minimist";
import { dockStart } from "@nlpjs/basic";
import { getGameServerStatus } from "./game-server-status.js";

const dock = await dockStart({
  settings: {
    nlp: {
      log: true,
      languages: ["en"],
      modelFileName: "nlp/model.json",
      corpora: ["nlp/corpus.json"],
      executeActionsBeforeAnswers: true,
    },
  },
  use: ["Basic", "LangEn"],
});

const nlp = dock.get("nlp");

nlp.registerActionFunction("handleDateTime", async (data, locale) => {
  data.context.now = new Date().toLocaleString(locale);
  return data;
});

nlp.registerActionFunction("handleGameStatus", async (data, locale) => {
  try {
    const status = await getGameServerStatus();
    data.context.status = `
      - PTS is ${status.pts}
      - PC/NA is ${status.pc.na}
      - PC/EU is ${status.pc.eu}
      - Xbox/US is ${status.xbox.us}
      - Xbox/EU is ${status.xbox.eu}
      - PS4/US is ${status.ps4.us}
      - PS4/EU is ${status.ps4.eu}
    `;
    return data;
  } catch (err) {
    console.error(err);
    data.context.failed = true;
  }
});

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
const client = new MatrixClient(
  config.homeserverUrl,
  config.accessToken,
  storage,
  crypto
);
AutojoinRoomsMixin.setupOnClient(client);

async function handler(roomId, event) {
  const senderId = await client.getUserId();
  if (event.sender === senderId) {
    return;
  }

  const message = new MessageEvent(event);

  if (message.messageType !== "m.text") {
    return;
  }
  console.log(`Message from ${event.sender} on ${roomId}`);

  const response = await nlp.process("en", message.textBody);
  console.log("Nlp response", response);

  await client.replyNotice(
    roomId,
    event,
    response?.answer ?? "Sorry but I don't understand that."
  );
}
client.on("room.message", handler);

await client.start();

console.log(`Bot started on ${config.homeserverUrl}`);
