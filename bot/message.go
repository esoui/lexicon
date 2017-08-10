package bot

type Message interface {
	Sender() string
	Text() string
}
