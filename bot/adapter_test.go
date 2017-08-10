package bot

import (
	"testing"
)

type adapter struct{}

func (a *adapter) Receive() Message {
	return &message{}
}

func (a *adapter) Reply(m Message, reply string) {
}

func TestAdapter(t *testing.T) {
	t.SkipNow()
}
