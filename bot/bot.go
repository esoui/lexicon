package bot

import (
	"regexp"
	"fmt"
)

type Message struct {
	Text string
}

type bot struct {
	handlers map[*regexp.Regexp]func(msg *Message)
}

func New() *bot {
	b := bot{}
	b.handlers = map[*regexp.Regexp]func(msg *Message){}
	return &b
}

func (b *bot) Handle(expr string, handler func(msg *Message)) {
	b.handlers[regexp.MustCompile(expr)] = handler
}

func (b *bot) Listen() {
	msg := &Message{}
	for {
		fmt.Scanln(&msg.Text)
		for expr, handler := range b.handlers {
			if expr.MatchString(msg.Text) {
				handler(msg)
				break
			}
		}
	}
}

func (b *bot) Reply(text string) {
	fmt.Println(text)
}
