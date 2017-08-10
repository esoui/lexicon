package bot

import (
	"testing"
)

func TestNew(t *testing.T) {
	a := &adapter{}
	var i interface{} = New(a)
	b, ok := i.(*Bot)
	if !ok {
		t.Fatal("New() should've returned a *Bot")
	}
	if b.adapter != a {
		t.Fatal("New() should've had an adapter")
	}
	if b.handlers == nil {
		t.Fatal("New() should've initialized Handlers")
	}
}

func TestBotHandle(t *testing.T) {
	a := &adapter{}
	b := New(a)
	expr := `test`
	handler := func(msg Message) {}
	b.Handle(expr, handler)
	if len(b.handlers) < 1 {
		t.Fatal("Bot.Handle() should've registered a new handler")
	}
	if b.handlers[0].re.String() != `(?i)`+expr {
		t.Fatal("Bot.Handle() should've added case insensitive flag before the expr")
	}
}

func TestBotReceive(t *testing.T) {
	t.SkipNow()
}

func TestBotReply(t *testing.T) {
	t.SkipNow()
}
