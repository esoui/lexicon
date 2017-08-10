package bot

import (
	"regexp"
)

type Bot struct {
	adapter Adapter
	handles Handles
}

func New(adapter Adapter) *Bot {
	return &Bot{
		adapter,
		Handles{},
	}
}

func (b *Bot) Handle(expr string, handler Handler) {
	h := &Handle{
		re:      regexp.MustCompile(`(?i)` + expr),
		handler: handler,
	}
	b.handles = append(b.handles, h)
}

func (b *Bot) Listen() {
	for {
		b.Receive(b.adapter.Receive())
	}
}

func (b *Bot) Receive(m Message) {
	for _, h := range b.handles {
		if match := h.re.FindStringSubmatch(m.Text()); match != nil {
			h.handler(b, m, match)
			break
		}
	}
}

func (b *Bot) Reply(m Message, reply string) {
	b.adapter.Reply(m, reply)
}
