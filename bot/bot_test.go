package bot

import (
	"github.com/esoui/lexicon/bot/adapter"
	"github.com/esoui/lexicon/bot/mock"
	"testing"
)

func TestNew(t *testing.T) {
	m := mock.New()
	var i interface{} = New(m)
	b, ok := i.(*Bot)
	if !ok {
		t.Error("New() didn't return a bot")
	}
	if b.Handlers == nil {
		t.Error("New() didn't initialize handlers map")
	}
}

func TestBotHandle(t *testing.T) {
	m := mock.New()
	b := New(m)
	expr := `test`
	handler := func(msg *adapter.Message) {}
	b.Handle(expr, handler)
	if len(b.Handlers) != 1 {
		t.Error("Bot.Handle() didn't register new handler")
	}
}
