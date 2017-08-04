package shell

import (
	"fmt"
	"github.com/esoui/lexicon/bot"
)

type adapter struct{}

func New() *adapter {
	return &adapter{}
}

func (a *adapter) Listen() *bot.Message {
	msg := &bot.Message{}
	fmt.Print("You: ")
	fmt.Scanln(&msg.Text)
	return msg
}
func (a *adapter) Reply(msg *bot.Message, text string) {
	fmt.Printf("Bot: %s\n", text)
}
