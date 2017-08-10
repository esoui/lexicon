package bot

import (
	"regexp"
	"testing"
)

func TestHandler(t *testing.T) {
	var i interface{} = &Handler{
		re: regexp.MustCompile(`test`),
		handler: func(m Message) {},
	}
	if _, ok := i.(*Handler); !ok {
		t.Fatal("Handler{} should've been cast successfully")
	}
}

func TestHandlers(t *testing.T) {
	var i interface{} = Handlers{
		&Handler{
			re: regexp.MustCompile(`test`),
			handler: func(m Message) {},
		},
	}
	if _, ok := i.(Handlers); !ok {
		t.Fatal("Handlers{} should've been cast successfully")
	}
}
