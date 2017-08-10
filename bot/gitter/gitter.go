package gitter

import (
	"github.com/esoui/lexicon/bot"
	gitter "github.com/sromku/go-gitter"
	"log"
	"os"
)

type message struct {
	room   string
	text   string
	sender string
}

func (m *message) Text() string {
	return m.text
}

func (m *message) Sender() string {
	return m.sender
}

type adapter struct {
	name     string
	api      *gitter.Gitter
	incoming chan *message
	user     *gitter.User
}

func New(name string) *adapter {
	a := &adapter{
		name:     name,
		api:      gitter.New(os.Getenv("GITTER_TOKEN")),
		incoming: make(chan *message),
	}
	var err error
	a.user, err = a.api.GetUser()
	if err != nil {
		log.Println("Error on getting API user")
	}
	go a.Listen("588506b2d73408ce4f45407f")
	return a
}

func (a *adapter) Listen(room string) {
	stream := a.api.Stream(room)
	go a.api.Listen(stream)
	log.Printf("Gitter is now listening to room %s\n", room)
	for {
		event := <-stream.Event
		switch e := event.Data.(type) {
		case *gitter.MessageReceived:
			if e.Message.From.ID == a.user.ID {
				continue
			}
			m := &message{
				sender: e.Message.From.Username,
				text:   e.Message.Text,
				room:   room,
			}
			a.incoming <- m
		case *gitter.GitterConnectionClosed:
			log.Println("Stream connection closed")
			return
		}
	}
}

func (a *adapter) Receive() bot.Message {
	m := <-a.incoming
	log.Printf("Message received %+v\n", m)
	return m
}

func (a *adapter) Reply(m bot.Message, reply string) {
	n, _ := m.(*message)
	a.api.SendMessage(n.room, reply)
}
