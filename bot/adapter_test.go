package bot

import (
	"testing"
)

type adapter struct{}

func (a *adapter) Receive() Message {
	return &message{}
}

func (a *adapter) Reply(m Message, reply string) {
	n := m.(*message)
	n.reply = reply
}

func TestAdapter(t *testing.T) {
	var i interface{} = &adapter{}
	if _, ok := i.(Adapter); !ok {
		t.Fatal("adapter{} should've been cast successfully")
	}
}
