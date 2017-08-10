package bot

import (
	"regexp"
	"testing"
)

func TestHandler(t *testing.T) {
	var _ Handler = func(b *Bot, m Message, match []string) {}
}

func TestHandle(t *testing.T) {
	var _ *Handle = &Handle{
		re:      regexp.MustCompile(`test`),
		handler: func(b *Bot, m Message, match []string) {},
	}
}

func TestHandles(t *testing.T) {
	var _ Handles = Handles{
		&Handle{
			re:      regexp.MustCompile(`test`),
			handler: func(b *Bot, m Message, match []string) {},
		},
	}
}
