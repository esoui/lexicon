package bot

import (
	"testing"
)

type message struct {
}

func (m *message) Sender() string {
	return ""
}

func (m *message) Text() string {
	return ""
}

func TestMessage(t *testing.T) {
	t.SkipNow()
}
