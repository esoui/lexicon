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
      timestamp: Date.now(),
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
      LogService.debug("MatrixConnector", "Event", roomId, event);

      const senderId = event.sender;

      if (senderId === botId) {
        LogService.debug("MatrixConnector", "Skipping my own message");
        return;
      }

      const message = new MessageEvent(event);

      if (message.timestamp < this.settings.timestamp) {
        LogService.debug("MatrixConnector", "Skipping old event");
        return;
      }

      if (message.messageType !== "m.text") {
        LogService.debug("MatrixConnector", "Skipping non text message event");
        return;
      }

      const extractedText = this.settings.extractMessageText(message.textBody);
      if (!extractedText) {
        LogService.debug(
          "MatrixConnector",
          "Skipping empty or non prefixed message"
        );
        return;
      }

      LogService.info(
        "MatrixConnector",
        "Processing message",
        roomId,
        senderId,
        extractedText
      );

      await this.hear({ extractedText, roomId, event });
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
    LogService.debug("MatrixConnector", "say()", args);

    let text, matrixContext;
    if (typeof args[0] === "string") {
      text = args[0];
      matrixContext = args[1];
    } else if (typeof args[0] === "object") {
      text = args[0].answer || args[0].value || args[0].text;
      matrixContext = args[0].matrixContext || args[1].matrixContext || args[1];
    } else {
      LogService.error(
        "MatrixConnector",
        "Couldn't understand say() arguments",
        args
      );

      return;
    }

    LogService.info("MatrixConnector", "Saying", { text, matrixContext });

    await this.matrixClient.replyHtmlNotice(
      matrixContext.roomId,
      matrixContext.event,
      text || "Sorry, I don't know how to respond to that yet."
    );
  }

  getContext(key) {
    if (!this.contextCache.has(key)) {
      LogService.debug("MatrixConnector", "Context cache miss", key);
      this.contextCache.set(key, {});
    }
    return this.contextCache.get(key);
  }

  async hear({ extractedText, roomId, event }) {
    const id = `${roomId}/${event.sender}`;

    const pipeline = this.container.getPipeline(`${this.settings.tag}.hear`);
    if (pipeline) {
      LogService.debug(
        "MatrixConnector",
        `Running pipeline for "${this.settings.tag}"`
      );

      this.container.runPipeline(
        pipeline,
        {
          message: extractedText,
          channel: this.settings.tag,
          app: this.container.name,
          matrixContext: { roomId, event },
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
        text: extractedText,
        address: { conversation: { id } },
        matrixContext: { roomId, event },
      });
      await bot.process(session);

      return;
    }

    const nlp = this.container.get("nlp");
    if (nlp) {
      LogService.debug("MatrixConnector", "Using nlp pipeline");

      const context = this.getContext(id);
      const result = await nlp.process(
        {
          message: extractedText,
          channel: this.settings.tag,
          app: this.container.name,
        },
        undefined,
        context
      );

      await this.say(result, { roomId, event });
      return;
    }

    LogService.error(
      "MatrixConnector",
      `No pipeline for "${this.settings.tag}"`
    );
  }
}

module.exports = { MatrixConnector };
