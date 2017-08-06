package bot

import (
	"regexp"
)

type Message interface {
	Sender() string
	Text() string
}

type Adapter interface {
	Listen() Message
	Reply(Message, string)
}

type Handler struct {
	re      *regexp.Regexp
	handler func(Message)
}

type Handlers []*Handler

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
		b.Receive(b.adapter.Listen())
	}
}

func (b *Bot) Receive(msg Message) {
	for _, h := range b.handlers {
		if h.re.MatchString(msg.Text()) {
			h.handler(msg)
			break
		}
	}
}

func (b *Bot) Reply(msg Message, response string) {
	b.adapter.Reply(msg, response)
}
