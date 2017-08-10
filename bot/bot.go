package bot

import (
	"regexp"
)

type Bot struct {
	adapter  Adapter
	handlers Handlers
}

func New(adapter Adapter) *Bot {
	return &Bot{
		adapter,
		Handlers{},
	}
}

func (b *Bot) Handle(expr string, handler func(Message)) {
	h := &Handler{
		re:      regexp.MustCompile(`(?i)` + expr),
		handler: handler,
	}
	b.handlers = append(b.handlers, h)
}

func (b *Bot) Listen() {
	for {
		b.Receive(b.adapter.Receive())
	}
}

func (b *Bot) Receive(m Message) {
	for _, h := range b.handlers {
		if h.re.MatchString(m.Text()) {
			h.handler(m)
			break
		}
	}
}

func (b *Bot) Reply(m Message, reply string) {
	b.adapter.Reply(m, reply)
}
