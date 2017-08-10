package main

import (
	"github.com/esoui/lexicon/bot"
	"github.com/esoui/lexicon/bot/gitter"
)

func main() {
	a := gitter.New("Lexicon")
	b := bot.New(a)

	b.Handle(`hi|hello`, func(m bot.Message) {
		b.Reply(m, "Hi there!")
	})

	b.Handle(`(good)?bye|exit`, func(m bot.Message) {
		b.Reply(m, "Goodbye!")
	})

	b.Handle(`.*`, func(m bot.Message) {
		b.Reply(m, "Sorry, I don't know what to say.")
	})

	b.Listen()
}
