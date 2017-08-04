package main

import (
	"github.com/esoui/lexicon/bot"
)

func main() {
	b := bot.New()
	b.Handle(`hi|hello`, func(msg *bot.Message) {
		b.Reply("Hi there!")
	})
	b.Listen()
}
