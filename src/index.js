const minimist = require("minimist");
const { dockStart } = require("@nlpjs/basic");

const handleServerStatus = require("./features/status.js");
const handleSearch = require("./features/search.js");
const handleJoke = require("./features/joke.js");
const handlePatchNotes = require("./features/patch.js");

function getConnector(args) {
  switch (args.connector) {
    case "matrix":
      return {
        settings: {
          homeserverUrl: args.h || process.env.HOMESERVER_URL,
          username: args.u || process.env.BOT_USERNAME,
          password: args.p || process.env.BOT_PASSWORD,
          accessToken: args.t || process.env.BOT_ACCESS_TOKEN,
          debug: args.x,
          extractMessageText: (message, profile) => {
            let prefix = `${profile.displayname}:`;
            if (message.indexOf(prefix) === 0) {
              return message.slice(prefix.length).trim();
            } else if (message.indexOf(`${prefix.slice(0, 3)}:`) === 0) {
              return message.slice(4).trim();
            }
          },
        },
        module: {
          className: "MatrixConnector",
          path: "./src/connectors/matrix.js",
        },
      };
    case "console":
      return {
        module: "ConsoleConnector",
        settings: {
          debug: args.x,
        },
      };
    default:
      throw new Error(`Unknown connector "${args.connector}"`);
  }
}

const args = minimist(process.argv.slice(2), {
  string: ["connector"],
  alias: {
    connector: ["c"],
  },
  default: {
    connector: "matrix",
  },
});

const connector = getConnector(args);

(async () => {
  const dock = await dockStart({
    settings: {
      [args.connector]: connector.settings,
      nlp: {
        log: true,
        languages: ["en"],
        modelFileName: "storage/model.json",
        executeActionsBeforeAnswers: true,
      },
    },
    use: ["Basic", "LangEn", connector.module],
  });

  const nlp = dock.get("nlp");

  handleServerStatus(nlp);
  handleSearch(nlp);
  handleJoke(nlp);
  handlePatchNotes(nlp);

  await nlp.train();
})();
