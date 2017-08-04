package bot

type Adapter interface {
	Listen() *Message
	Reply(*Message, string)
}
