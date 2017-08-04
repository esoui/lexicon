package main

import (
	"github.com/esoui/lexicon/bot"
	"github.com/esoui/lexicon/bot/shell"
	"os"
)

func main() {
	a := shell.New("Lexicon")
	b := bot.New(a)

	b.Handle(`hi|hello`, func(msg *bot.Message) {
		b.Reply(msg, "Hi there!")
	})

	b.Handle(`bye|exit`, func(msg *bot.Message) {
		b.Reply(msg, "Goodbye!")
		os.Exit(0)
	})

	b.Listen()
}
