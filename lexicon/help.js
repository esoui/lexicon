module.exports = {
  pattern: 'help',
  reply: function(message, match, reply) {
    reply("Here's what you can ask me: \n- search add-ons ...\n- search author ...\n- search in forums ...\n- search wiki for ...\n- search source for ...\n- search lua for ...\n- joke\n- current version\n- help");
  }
};
