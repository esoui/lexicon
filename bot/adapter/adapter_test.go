package adapter

import "testing"

type adapter struct{}

func (a *adapter) Listen() *Message {
    return &Message{}
}

func (a *adapter) Reply(msg *Message, text string) {}

func TestAdapter(t *testing.T) {
	var i interface{} = &adapter{}
	_, ok := i.(Adapter)
	if !ok {
		t.Error("Adapter couldn't be cast")
	}
}
