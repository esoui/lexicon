package main

import (
	"github.com/esoui/lexicon/bot"
	"github.com/esoui/lexicon/bot/web"
)

func main() {
	a := web.New("Lexicon")
	b := bot.New(a)

	b.Handle(`hi|hello`, func(msg bot.Message) {
		b.Reply(msg, "Hi there!")
	})

	b.Handle(`(good)?bye|exit`, func(msg bot.Message) {
		b.Reply(msg, "Goodbye!")
	})

	b.Handle(`.*`, func(msg bot.Message) {
		b.Reply(msg, "Sorry, I don't know what to say.")
	})

	b.Listen()
}
