package bot

import "testing"

func TestNew(t *testing.T) {
	var i interface{} = New()
	b, ok := i.(*Bot)
	if !ok {
		t.Error("New() didn't return a bot")
	}
	if b.Handlers == nil {
		t.Error("New() didn't initialize handlers map")
	}
}

func TestBotHandle(t *testing.T) {
	b := New()
	expr := `test`
	handler := func(msg *Message) {}
	b.Handle(expr, handler)
	if len(b.Handlers) != 1 {
		t.Error("Bot.Handle() didn't register new handler")
	}
}
