package main

import (
	"github.com/esoui/lexicon/bot"
	"github.com/esoui/lexicon/bot/shell"
)

func main() {
	a := shell.New()
	b := bot.New(a)
	b.Handle(`hi|hello`, func(msg *bot.Message) {
		b.Reply(msg, "Hi there!")
	})
	b.Listen()
}
