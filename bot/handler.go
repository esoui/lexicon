package bot

import (
	"regexp"
)

type Handler struct {
	re      *regexp.Regexp
	handler func(Message)
}

type Handlers []*Handler
