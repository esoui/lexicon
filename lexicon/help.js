module.exports = {
  pattern: /help/,
  reply: function(message, match, reply) {
    reply("Here's what I know: \n- search add-ons ...\n- search author ...\n- search in forums ...\n- search wiki for ...\n- search source for ...\n- joke\n- current version\n- help");
  }
};
