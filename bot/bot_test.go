package bot

import (
	"testing"
)

type message struct {
	text string
}

func (m *message) Text() string {
	return m.text
}

func (m *message) Sender() string {
	return ""
}

type adapter struct {
}

func (s *adapter) Listen() Message {
	return &message{}
}

func (s *adapter) Reply(msg Message, text string) {}

func TestNew(t *testing.T) {
	a := &adapter{}
	var i interface{} = New(a)
	b, ok := i.(*Bot)
	if !ok {
		t.Error("New() didn't return a bot")
	}
	if b.handlers == nil {
		t.Error("New() didn't initialize handlers map")
	}
}

func TestBotHandle(t *testing.T) {
	a := &adapter{}
	b := New(a)
	expr := `test`
	handler := func(msg Message) {}
	b.Handle(expr, handler)
	if len(b.handlers) < 1 {
		t.Error("Bot.Handle() didn't register new handler")
	}
}

func TestBotReceive(t *testing.T) {
	a := &adapter{}
	b := New(a)
	handle1 := false
	b.Handle(`handle1|any`, func(msg Message) {
		handle1 = true
	})
	handle2 := false
	b.Handle(`handle2|any`, func(msg Message) {
		handle2 = true
	})
	b.Receive(&message{text: "handle1"})
	if !handle1 || handle2 {
		t.Error("Bot.Receive() got the wrong handler")
	}
	b.Receive(&message{text: "handle2"})
	if !handle2 {
		t.Error("Bot.Receive() got the wrong handler")
	}
	handle1 = false
	handle2 = false
	b.Receive(&message{text: "any"})
	if !handle1 || handle2 {
		t.Error("Bot.Receive() isn't breaking after matching a handler")
	}
}
