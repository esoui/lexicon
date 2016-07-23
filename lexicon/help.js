module.exports = {
  pattern: 'help',
  reply: function(message, match, reply) {
    const help = `
      Here's what you can ask me:
      - [search ]add-ons \`query\`
      - [search ]authors \`name\`
      - [search ]forums for \`query\`
      - [search ]wiki for \`query\`
      - [search ]source for \`query\`
      - [search ]lua for \`query\`
      - live version
      - pts version
      - joke
      - [create ]meme \`template\`; \`top line\`; \`bottom line\`
      - memes[ templates]
      - help
    `;

    reply(help.replace(/^\s+|\s+$/, '').replace(/\s+\n/, "\n"));
  }
};
