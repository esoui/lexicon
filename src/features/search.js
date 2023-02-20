function createGitHubSearchUrl(query) {
  const url = new URL("https://github.com/esoui/esoui/search");
  url.searchParams.set("q", query);
  return url.toString();
}

function createLuaSearchUrl(query) {
  const url = new URL("http://devdocs.io/lua~5.1/");
  url.hash = `#q=${query}`;
  return url.toString();
}

function createApiSearchUrl(query) {
  const url = new URL("http://wiki.esoui.com/w/index.php?go=1");
  url.searchParams.set("search", query);
  return url.toString();
}

function createAddOnSearchUrl(query) {
  const url = new URL("http://www.esoui.com/downloads/search.php");
  url.searchParams.set("search", query);
  return url.toString();
}

function createAuthorSearchUrl(query) {
  const url = new URL("http://www.esoui.com/forums/memberlist.php?do=getall");
  url.searchParams.set("ausername", query);
  return url.toString();
}

function createForumSearchUrl(query) {
  const url = new URL("http://www.esoui.com/forums/search.php?do=process");
  url.searchParams.set("query", query);
  return url.toString();
}

const corpus = {
  name: "Search Corpus",
  locale: "en-US",
  entities: {
    source: {
      options: {
        github: ["source", "github", "ui code"],
        addOn: ["add-on", "addon"],
        author: ["author", "creator"],
        lua: ["Lua"],
        api: ["api", "wiki"],
        forum: ["forum", "ESOUI"],
      },
    },
    query: {
      trim: [
        {
          position: "between",
          leftWords: ["search", "find", "show"],
          rightWords: ["in"],
        },
        {
          position: "after",
          words: ["named", "with", "by", "for"],
        },
      ],
    },
  },
  data: [
    {
      intent: "search",
      utterances: [
        "I want to search in @source for @query",
        "I would like to search @query in @source",
        "Find @source with @query",
        "Find @source named @query",
        "Find @source by @query",
        "Find @query in @source",
        "Show @source by @query",
        "Show @source with @query",
        "Get @source with @query",
      ],
      slotFilling: {
        source: {
          mandatory: true,
          question:
            "Where do you want to search? (Lua, GitHub, add-on, author, API or forum)",
        },
        query: {
          mandatory: true,
          question: "What is your query?",
        },
      },
      actions: [
        {
          name: "handleSearch",
        },
      ],
      answers: ["{{url}}"],
    },
  ],
};

module.exports = function (nlp) {
  nlp.addCorpus(corpus);

  nlp.registerActionFunction("handleSearch", async (data) => {
    const source = data.entities.find(
      ({ entity }) => entity === "source"
    )?.option;
    const query = data.entities
      .find(({ entity }) => entity === "query")
      ?.utteranceText.trim();

    // Although the entity arealdy is avaiable for interpolation, it isn't trimmed.
    data.context.query = query;

    // And by default it's what the user uttered instead of the canonical name of the entity.
    // data.context.source = source;

    if (source && query) {
      switch (source) {
        case "lua":
          data.context.url = createLuaSearchUrl(query);
          break;
        case "api":
          data.context.url = createApiSearchUrl(query);
          break;
        case "github":
          data.context.url = createGitHubSearchUrl(query);
          break;
        case "addOn":
          data.context.url = createAddOnSearchUrl(query);
          break;
        case "author":
          data.context.url = createAuthorSearchUrl(query);
          break;
        case "forum":
          data.context.url = createForumSearchUrl(query);
          break;
      }
    }

    return data;
  });
};
