package gitter

import (
	"github.com/esoui/lexicon/bot"
	"github.com/sromku/go-gitter"
	"log"
	"os"
	"time"
)

type message struct {
	roomID  string
	text    string
	sender  string
	private bool
}

func (m *message) Text() string {
	return m.text
}

func (m *message) Sender() string {
	return m.sender
}

type adapter struct {
	api      *gitter.Gitter
	incoming chan *message
	rooms    map[string]bool
	user     *gitter.User
}

func New() *adapter {
	a := &adapter{
		api:      gitter.New(os.Getenv("GITTER_TOKEN")),
		incoming: make(chan *message),
		rooms:    make(map[string]bool),
	}
	var err error
	a.user, err = a.api.GetUser()
	if err != nil {
		log.Println("Error on getting API user")
	}
	go a.Poll()
	return a
}

func (a *adapter) Poll() {
	for {
		rooms, err := a.api.GetRooms()
		if err != nil {
			log.Println("Error on getting rooms")
		}
		for _, room := range rooms {
			if _, ok := a.rooms[room.ID]; ok {
				continue
			}
			go a.Listen(room.ID, room.OneToOne)
		}
		time.Sleep(time.Second)
	}
}

func (a *adapter) Listen(roomID string, private bool) {
	a.rooms[roomID] = true
	stream := a.api.Stream(roomID)
	go a.api.Listen(stream)
	log.Printf("Listening to Room %s\n", roomID)
	for {
		event := <-stream.Event
		switch e := event.Data.(type) {
		case *gitter.MessageReceived:
			if e.Message.From.ID == a.user.ID {
				continue
			}
			if !private {
				if len(e.Message.Text) < 8 || e.Message.Text[0:8] != "@lexicon" {
					continue
				}
			}
			m := &message{
				sender:  e.Message.From.Username,
				text:    e.Message.Text,
				roomID:  roomID,
				private: private,
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
	if n.private {
		a.api.SendMessage(n.roomID, reply)
	} else {
		a.api.SendMessage(n.roomID, "@"+n.sender+" "+reply)
	}
}
