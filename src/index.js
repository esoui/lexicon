const minimist = require("minimist");
const { dockStart } = require("@nlpjs/basic");

const handleTime = require("./features/time.js");
const handleServerStatus = require("./features/status.js");
const handleSearch = require("./features/search.js");
const handleJoke = require("./features/joke.js");
const handlePatchNotes = require("./features/patch.js");

function getConnector(args) {
  switch (args.connector) {
    case "matrix":
      return {
        settings: {
          homeserverUrl: args.h,
          username: args.u,
          password: args.p,
          debug: args.x,
          extractMessageText: (message) => {
            if (message.indexOf("lexicon:") > -1) {
              return message.split("lexicon:").pop().trim();
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

  handleTime(nlp);
  handleServerStatus(nlp);
  handleSearch(nlp);
  handleJoke(nlp);
  handlePatchNotes(nlp);

  await nlp.train();
})();
