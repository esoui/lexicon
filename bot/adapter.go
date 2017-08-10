package bot

type Adapter interface {
	Receive() Message
	Reply(Message, string)
}
