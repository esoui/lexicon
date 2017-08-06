package shell

import (
	"fmt"
	"github.com/esoui/lexicon/bot"
)

type message struct {
	text string
}

func (m *message) Text() string {
	return m.text
}

func (m *message) Sender() string {
	return "Human"
}

type shell struct {
	name string
}

func New(name string) *shell {
	return &shell{name}
}

func (s *shell) Listen() bot.Message {
	msg := &message{}
	fmt.Print("You: ")
	fmt.Scanln(&msg.text)
	return msg
}

func (s *shell) Reply(msg bot.Message, text string) {
	fmt.Printf("%s: %s\n", s.name, text)
}
