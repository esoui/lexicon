package help

import (
	"github.com/esoui/lexicon/bot"
)

var Expr = `h[ea]lp|(.*)`

func Handler(b *bot.Bot, m bot.Message, match []string) {
	b.Reply(m, "What can I do you for?")
}
