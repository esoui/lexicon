[![Go Report Card](https://goreportcard.com/badge/github.com/esoui/lexicon)](https://goreportcard.com/report/github.com/esoui/lexicon)
[![CircleCI](https://circleci.com/gh/esoui/lexicon/tree/master.svg?style=shield)](https://circleci.com/gh/esoui/lexicon/tree/master)
[![codecov](https://codecov.io/gh/esoui/lexicon/branch/master/graph/badge.svg)](https://codecov.io/gh/esoui/lexicon)

# Lexicon

More on http://wiki.esoui.com/Lexicon.

This is the remake of Lexicon in Go, for the Node.js version see [**node** branch](tree/node).

## Setup

```shell
$ make
```

## To-do

- [ ] Listen() loop should have an exit switch or perhaps an event/signaling channel.
- [ ] Broadcast() method.
- [ ] Message will eventually need the concept of Room and if whether it's a private conversation.
- [ ] Make sure the Listen() mechanism can deal with concurrently incoming messages. Although it's the adapter's concern it should be straightforward to make it work nicely.

## Legal

The MIT License © 2016 Arthur Corenzan.
