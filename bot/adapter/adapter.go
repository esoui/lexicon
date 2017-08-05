package adapter

type Message struct {
	Text string
}

type Adapter interface {
	Listen() *Message
	Reply(*Message, string)
}
