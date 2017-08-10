package main

import (
	"github.com/esoui/lexicon/bot"
	"github.com/esoui/lexicon/bot/gitter"
	"github.com/esoui/lexicon/lexicon/help"
	"github.com/esoui/lexicon/lexicon/joke"
	"github.com/esoui/lexicon/lexicon/search"
	"github.com/esoui/lexicon/lexicon/status"
)

func main() {
	a := gitter.New("Lexicon")
	b := bot.New(a)
	b.Handle(search.Expr, search.Handler)
	b.Handle(joke.Expr, joke.Handler)
	b.Handle(status.Expr, status.Handler)
	b.Handle(help.Expr, help.Handler)
	b.Listen()
}
