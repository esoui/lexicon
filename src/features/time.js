const corpus = {
  name: "Time Corpus",
  locale: "en-US",
  data: [
    {
      intent: "time",
      utterances: [
        "What time is it?",
        "What is the date?",
        "What day is today?",
        "What month is today?",
      ],
      answers: ["It's {{now}}."],
      actions: [
        {
          name: "handleDateTime",
        },
      ],
    },
  ],
};

module.exports = function (nlp) {
  nlp.addCorpus(corpus);

  nlp.registerActionFunction("handleDateTime", async (data, locale) => {
    data.context.now = new Date().toLocaleString(locale);
    return data;
  });
};
