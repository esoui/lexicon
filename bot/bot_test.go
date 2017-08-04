package bot

import "testing"

type adapter struct{}

func (a *adapter) Listen(chan *Message)            {}
func (a *adapter) Reply(msg *Message, text string) {}

func TestNew(t *testing.T) {
	a := &adapter{}
	var i interface{} = New(a)
	b, ok := i.(*Bot)
	if !ok {
		t.Error("New() didn't return a bot")
	}
	if b.Handlers == nil {
		t.Error("New() didn't initialize handlers map")
	}
}

func TestBotHandle(t *testing.T) {
	a := &adapter{}
	b := New(a)
	expr := `test`
	handler := func(msg *Message) {}
	b.Handle(expr, handler)
	if len(b.Handlers) != 1 {
		t.Error("Bot.Handle() didn't register new handler")
	}
}
