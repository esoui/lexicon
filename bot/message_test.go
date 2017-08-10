package bot

import (
	"testing"
)

type message struct {
	text, reply string
}

func (m *message) Sender() string {
	return ""
}

func (m *message) Text() string {
	return m.text
}

func TestMessage(t *testing.T) {
	var i interface{} = &message{}
	if _, ok := i.(Message); !ok {
		t.Fatal("message{} should've been cast successfully")
	}
}
