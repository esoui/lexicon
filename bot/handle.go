package bot

import (
	"regexp"
)

type Handler func(*Bot, Message, []string)

type Handle struct {
	re      *regexp.Regexp
	handler Handler
}

type Handles []*Handle
