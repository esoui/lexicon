package bot

import (
	"regexp"
)

type Handler func(Message)

type Handle struct {
	re      *regexp.Regexp
	handler Handler
}

type Handles []*Handle
