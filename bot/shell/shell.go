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

func (s *shell) Receive() bot.Message {
	m := &message{}
	fmt.Print("You: ")
	fmt.Scanln(&m.text)
	return m
}

func (s *shell) Reply(m bot.Message, reply string) {
	fmt.Printf("%s: %s\n", s.name, reply)
}
