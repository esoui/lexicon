package mock

import (
	"github.com/esoui/lexicon/bot/adapter"
)

type mock struct {
}

func New() *mock {
	return &mock{}
}

func (m *mock) Listen() *adapter.Message {
	return &adapter.Message{}
}

func (m *mock) Reply(msg *adapter.Message, text string) {}
