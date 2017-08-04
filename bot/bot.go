package bot

import (
	"regexp"
)

type Bot struct {
	adapter  Adapter
	Handlers map[*regexp.Regexp]func(msg *Message)
}

func New(adapter Adapter) *Bot {
	return &Bot{
		adapter,
		map[*regexp.Regexp]func(msg *Message){},
	}
}

func (b *Bot) Handle(expr string, handler func(msg *Message)) {
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

func (b *Bot) Reply(msg *Message, text string) {
	b.adapter.Reply(msg, text)
}
