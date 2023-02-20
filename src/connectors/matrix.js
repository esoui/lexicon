const {
  MatrixClient,
  RustSdkCryptoStorageProvider,
  AutojoinRoomsMixin,
  SimpleFsStorageProvider,
  MatrixAuth,
  MessageEvent,
  LogService,
  LogLevel,
  RichConsoleLogger,
} = require("matrix-bot-sdk");
const LRUCache = require("lru-cache");
const { Connector } = require("@nlpjs/connector");
const { join } = require("path");

LogService.setLogger(new RichConsoleLogger());

class MatrixConnector extends Connector {
  async initialize() {
    this.applySettings(this.settings, {
      homeserverUrl: "",
      username: "",
      password: "",
      accessToken: "",
      debug: false,
      storage: "storage",
      maxContext: 20,
      extractMessageText: (message) => message,
    });

    if (this.settings.debug) {
      LogService.setLevel(LogLevel.DEBUG);
    }

    LogService.debug("MatrixConnector", "Final settings", this.settings);

    if (!this.settings.accessToken && this.settings.username) {
      const auth = new MatrixAuth(this.settings.homeserverUrl);
      const login = await auth.passwordLogin(
        this.settings.username,
        this.settings.password
      );
      this.settings.accessToken = login.accessToken;
    } else {
      throw new Error(
        "[MatrixConnector] No access token or username/password provided"
      );
    }

    const storage = new SimpleFsStorageProvider(
      join(this.settings.storage, "bot.json")
    );
    const crypto = new RustSdkCryptoStorageProvider(
      join(this.settings.storage, "sled")
    );
    const matrix = new MatrixClient(
      this.settings.homeserverUrl,
      this.settings.accessToken,
      storage,
      crypto
    );
    const botId = await matrix.getUserId();

    AutojoinRoomsMixin.setupOnClient(matrix);

    const handler = async (roomId, event) => {
      const senderId = event.sender;
      if (senderId === botId) {
        LogService.debug("MatrixConnector", "Shouldn't respond to myself");
        return;
      }

      const message = new MessageEvent(event);
      if (message.messageType !== "m.text") {
        LogService.debug("MatrixConnector", "Event is not a text message");
        return;
      }

      const text = this.settings.extractMessageText(message.textBody);
      if (!text) {
        LogService.debug("MatrixConnector", "Message couldn't be extracted");
        return;
      }

      LogService.info(
        "MatrixConnector",
        `Message received on ${roomId} from ${senderId}`
      );

      const context = this.getContext(roomId, event);
      await this.hear(text, context);
    };
    matrix.on("room.message", handler);
    matrix.start();

    LogService.info(
      "MatrixConnector",
      `Started on ${this.settings.homeserverUrl} as "${this.settings.username}"`
    );

    this.contextCache = new LRUCache({ max: this.settings.maxContext });
    this.matrixClient = matrix;
  }

  async say(...args) {
    LogService.debug("MatrixConnector", "say(", args, ")");

    let text, context;
    if (typeof args[0] === "string") {
      text = args[0];
      context = args[1];
    } else if (typeof args[0] === "object") {
      text = args[0].answer || args[0].value || args[0].text;
      context = args[0].context || args[1].context || args[1];
    }

    if (!text) {
      LogService.error("MatrixConnector", "Invalid arguments for say()", args);
      return;
    }

    await this.matrixClient.replyNotice(
      context.matrix.roomId,
      context.matrix.event,
      "",
      text
    );
  }

  getContext(roomId, event) {
    const key = roomId + "/" + event.sender;
    if (!this.contextCache.has(key)) {
      this.contextCache.set(key, { id: key, matrix: { roomId, event } });
    }
    const context = this.contextCache.get(key);
    context.matrix.event = event;
    return context;
  }

  async hear(text, context) {
    LogService.debug("MatrixConnector", "hear(", text, context, ")");

    const name = `${this.settings.tag}.hear`;

    const pipeline = this.container.getPipeline(name);
    if (pipeline) {
      LogService.debug("MatrixConnector", `Running pipeline ${name}`);

      this.container.runPipeline(
        pipeline,
        {
          message: text,
          channel: this.settings.tag,
          app: this.container.name,
          context,
        },
        this
      );

      return;
    }

    const bot = this.container.get("bot");
    if (bot) {
      LogService.debug("MatrixConnector", "Using bot pipeline");

      const session = this.createSession({
        channelId: this.settings.tag,
        text,
        address: { conversation: context },
      });
      await bot.process(session);

      return;
    }

    const nlp = this.container.get("nlp");
    if (nlp) {
      LogService.debug("MatrixConnector", "Using nlp pipeline");

      const result = await nlp.process(
        {
          message: text,
          channel: this.settings.tag,
          app: this.container.name,
        },
        context
      );
      await this.say(result, context);

      return;
    }

    throw new Error(`There is no pipeline for ${name}`);
  }
}

module.exports = { MatrixConnector };
