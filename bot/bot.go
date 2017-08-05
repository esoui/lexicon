package bot

import (
	"github.com/esoui/lexicon/bot/adapter"
	"regexp"
)

type Bot struct {
	adapter  adapter.Adapter
	Handlers map[*regexp.Regexp]func(msg *adapter.Message)
}

func New(a adapter.Adapter) *Bot {
	return &Bot{
		a,
		map[*regexp.Regexp]func(msg *adapter.Message){},
	}
}

func (b *Bot) Handle(expr string, handler func(msg *adapter.Message)) {
	b.Handlers[regexp.MustCompile(`(?i)`+expr)] = handler
}

func (b *Bot) Listen() {
	for {
		msg := b.adapter.Listen()
		for re, handler := range b.Handlers {
			if re.MatchString(msg.Text) {
				handler(msg)
				break
			}
		}
	}
}

func (b *Bot) Reply(msg *adapter.Message, text string) {
	b.adapter.Reply(msg, text)
}
