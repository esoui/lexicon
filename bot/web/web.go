package web

import (
	"encoding/json"
	"github.com/esoui/lexicon/bot"
	"log"
	"net/http"
)

type message struct {
	text   string
	sender string
}

func (m *message) Text() string {
	return m.text
}

func (m *message) Sender() string {
	return m.sender
}

type payload struct {
	Text   string `json:"text"`
	Sender string `json:"sender"`
}

func (m *message) MarshalJSON() ([]byte, error) {
	return json.Marshal(payload{
		Text:   m.text,
		Sender: m.sender,
	})
}

func (m *message) UnmarshalJSON(b []byte) error {
	p := &payload{}
	err := json.Unmarshal(b, p)
	if err != nil {
		return err
	}
	m.text = p.Text
	m.sender = p.Sender
	return nil
}

type web struct {
	name     string
	incoming chan *message
	outgoing chan *message
}

func New(name string) *web {
	w := &web{
		name:     name,
		incoming: make(chan *message),
		outgoing: make(chan *message),
	}
	http.HandleFunc("/message", w.HTTPHandler)
	go http.ListenAndServe(":8080", nil)
	log.Print("Web adapter is now listening on :8080")
	return w
}

func (w *web) HTTPHandler(r http.ResponseWriter, req *http.Request) {
	r.Header().Set("Content-Type", "application/json; charset=utf-8")
	m := &message{}
	err := json.NewDecoder(req.Body).Decode(m)
	if err != nil {
		log.Print("Couldn't decode request body")
		r.WriteHeader(http.StatusUnprocessableEntity)
		return
	}
	log.Printf("New incoming message %+v", m)
	w.incoming <- m
	err = json.NewEncoder(r).Encode(<-w.outgoing)
	if err != nil {
		log.Print("Couldn't encode response")
		r.WriteHeader(http.StatusUnprocessableEntity)
		return
	}
}

func (w *web) Receive() bot.Message {
	return <-w.incoming
}

func (w *web) Reply(m bot.Message, reply string) {
	w.outgoing <- &message{text: reply, sender: w.name}
}
