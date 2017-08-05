package shell

import (
	"fmt"
	"github.com/esoui/lexicon/bot/adapter"
)

type shell struct {
	name string
}

func New(name string) *shell {
	return &shell{name}
}

func (s *shell) Listen() *adapter.Message {
	msg := &adapter.Message{}
	fmt.Print("You: ")
	fmt.Scanln(&msg.Text)
	return msg
}
func (s *shell) Reply(msg *adapter.Message, text string) {
	fmt.Printf("%s: %s\n", s.name, text)
}
