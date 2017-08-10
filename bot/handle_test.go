package bot

import (
	"regexp"
	"testing"
)

func TestHandler(t *testing.T) {
	var _ Handler = func(m Message) {}
}

func TestHandle(t *testing.T) {
	var _ *Handle = &Handle{
		re:      regexp.MustCompile(`test`),
		handler: func(m Message) {},
	}
}

func TestHandles(t *testing.T) {
	var _ Handles = Handles{
		&Handle{
			re:      regexp.MustCompile(`test`),
			handler: func(m Message) {},
		},
	}
}
