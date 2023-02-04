const corpus = {
  name: "Search Corpus",
  locale: "en-US",
  entities: {
    source: {
      options: {
        addOn: ["add-on", "addon"],
        lua: ["Lua"],
        api: ["API", "game API", "ESO API"],
        esoui: ["ESOUI", "forum"],
        forum: ["game forum", "ESO forum"],
      },
    },
    query: {
      trim: [
        {
          position: "between",
          leftWords: ["for", "search"],
          rightWords: ["in"],
        },
        {
          position: "afterFirst",
          words: ["for", "named"],
        },
      ],
    },
  },
  data: [
    {
      intent: "search",
      utterances: [
        "Search @source for @query",
        "Look for @source named @query",
        "Search for @query in @source",
      ],
      slotFilling: {
        source: {
          mandatory: true,
          question:
            "Where do you want to search? (add-ons, Lua, API, ESOUI or game forums)",
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
      answers: ['Searching {{source}} for "{{query}}": {{url}}'],
    },
  ],
};

export default function (nlp) {
  nlp.addCorpus(corpus);

  nlp.registerActionFunction("handleSearch", async (data, locale) => {
    const source = data.entities.find(
      ({ entity }) => entity === "source"
    )?.utteranceText;
    const query = data.entities.find(
      ({ entity }) => entity === "query"
    )?.utteranceText;

    if (!source || !query) {
      return data;
    }

    const url = new URL("https://google.com/search");
    url.searchParams.set("q", query.trim());
    data.context.url = url.toString();
    return data;
  });
}
