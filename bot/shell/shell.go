package shell

import (
	"fmt"
	"github.com/esoui/lexicon/bot"
)

type adapter struct {
	name string
}

func New(name string) *adapter {
	return &adapter{name}
}

func (a *adapter) Listen() *bot.Message {
	msg := &bot.Message{}
	fmt.Print("You: ")
	fmt.Scanln(&msg.Text)
	return msg
}
func (a *adapter) Reply(msg *bot.Message, text string) {
	fmt.Printf("%s: %s\n", a.name, text)
}
