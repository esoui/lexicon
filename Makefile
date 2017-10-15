.PHONY: get fmt

default: fmt build

fmt:
	@go fmt ./...

build:
	@go build -o dist/lexicon
