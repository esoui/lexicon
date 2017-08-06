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
	response string
	msg Message
}

func (a *adapter) Listen() Message {
	return &message{}
}

func (a *adapter) Reply(msg Message, text string) {
	a.response = text
	a.msg = msg
}

func TestAdapter(t *testing.T) {
	var i interface{} = &adapter{}
	_, ok := i.(Adapter)
	if !ok {
		t.Error("adapter{} doesn't implement Adapter")
	}
}

func TestMessage(t *testing.T) {
	var i interface{} = &message{}
	_, ok := i.(Message)
	if !ok {
		t.Error("message{} doesn't implement Message")
	}
}

func TestNew(t *testing.T) {
	a := &adapter{}
	var i interface{} = New(a)
	b, ok := i.(*Bot)
	if !ok {
		t.Error("New doesn't return a bot")
	}
	if b.adapter != a {
		t.Error("New doesn't set the adpater")
	}
	if b.handlers == nil {
		t.Error("New doesn't initialize handlers map")
	}
}

func TestBotHandle(t *testing.T) {
	a := &adapter{}
	b := New(a)
	expr := `test`
	handler := func(msg Message) {}
	b.Handle(expr, handler)
	if len(b.handlers) < 1 {
		t.Error("Bot.Handle doesn't register new handler")
	}
	if b.handlers[0].re.String() != `(?i)`+expr {
		t.Error("Bot.Handle doesn't add case insensitive flag to the expr")
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
		t.Error("Bot.Receive got the wrong handler")
	}
	b.Receive(&message{text: "handle2"})
	if !handle2 {
		t.Error("Bot.Receive got the wrong handler")
	}
	handle1 = false
	handle2 = false
	b.Receive(&message{text: "any"})
	if !handle1 {
		t.Error("Bot.Receive isn't preserving order")
	}
	if handle2 {
		t.Error("Bot.Receive isn't breaking after first match")
	}
}

func TestBotReply(t *testing.T) {
	a := &adapter{}
	b := New(a)
	msg := &message{}
	response := "test"
	b.Reply(msg, response)
	if a.response != response || a.msg != msg {
		t.Error("Bot.Reply isn't properly calling Adapter.Reply")
	}
}
