const Parser = require("rss-parser");

async function getLatestPosts() {
  const parser = new Parser();
  return await parser.parseURL(
    "https://forums.elderscrollsonline.com/en/categories/patch-notes/feed.rss",
  );
}

const corpus = {
  name: "Patch Notes Corpus",
  locale: "en-US",
  data: [
    {
      intent: "patchNotes",
      utterances: ["Patch notes", "Latest updates", "Patches"],
      actions: [
        {
          name: "handlePatchNotes",
        },
      ],
      answers: ["Here are the latest posts in Patch Notes forum: {{feed}}"],
    },
  ],
};

module.exports = function (nlp) {
  nlp.addCorpus(corpus);

  nlp.registerActionFunction("handlePatchNotes", async (data) => {
    try {
      const feed = await getLatestPosts();
      data.context.feed = `
        <ol>
          <li>${feed.items
            .slice(0, 5)
            .map((item) => `<a href="${item.link}">${item.title}</a></li>`)
            .join("</li><li>")}</li>
        </ol>
      `;
    } catch (err) {
      console.error(err);
      data.context.failed = true;
    }
    return data;
  });
};
