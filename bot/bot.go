package bot

import (
	"fmt"
	"regexp"
)

type Message struct {
	Text string
}

type Bot struct {
	Handlers map[*regexp.Regexp]func(msg *Message)
}

func New() *Bot {
	b := Bot{}
	b.Handlers = map[*regexp.Regexp]func(msg *Message){}
	return &b
}

func (b *Bot) Handle(expr string, handler func(msg *Message)) {
	b.Handlers[regexp.MustCompile(expr)] = handler
}

func (b *Bot) Listen() {
	msg := &Message{}
	for {
		fmt.Scanln(&msg.Text)
		for expr, handler := range b.Handlers {
			if expr.MatchString(msg.Text) {
				handler(msg)
				break
			}
		}
	}
}

func (b *Bot) Reply(text string) {
	fmt.Println(text)
}
