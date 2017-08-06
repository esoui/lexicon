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

type Handler func(msg Message)

type Handlers map[*regexp.Regexp]Handler

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

func (b *Bot) Handle(expr string, handler Handler) {
	re := regexp.MustCompile(`(?i)` + expr)
	b.handlers[re] = handler
}

func (b *Bot) Listen() {
	for {
		b.Receive(b.adapter.Listen())
	}
}

func (b *Bot) Receive(msg Message) {
	for re, handler := range b.handlers {
		if re.MatchString(msg.Text()) {
			handler(msg)
			break
		}
	}
}

func (b *Bot) Reply(msg Message, response string) {
	b.adapter.Reply(msg, response)
}
