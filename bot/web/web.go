package web

import (
	"encoding/json"
	"github.com/esoui/lexicon/bot"
	"log"
	"net/http"
)

type message struct {
	text   string `json:"text"`
	sender string `json:"sender"`
}

type payload struct {
	Text   string `json:"text"`
	Sender string `json:"sender"`
}

func (m *message) Text() string {
	return m.text
}

func (m *message) Sender() string {
	return m.sender
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
	http.HandleFunc("/message", w.Handler)
	go http.ListenAndServe(":8080", nil)
	log.Print("Web adapter is listening on localhost:8080")
	return w
}

func (w *web) Handler(res http.ResponseWriter, req *http.Request) {
	res.Header().Set("Content-Type", "application/json; charset=utf-8")
	msg := &message{}
	err := json.NewDecoder(req.Body).Decode(msg)
	if err != nil {
		log.Print("Couldn't decode request body")
		res.WriteHeader(http.StatusUnprocessableEntity)
		return
	}
	log.Printf("New incoming message %+v", msg)
	w.incoming <- msg
	err = json.NewEncoder(res).Encode(<-w.outgoing)
	if err != nil {
		log.Print("Couldn't encode response")
		res.WriteHeader(http.StatusUnprocessableEntity)
		return
	}
}

func (w *web) Listen() bot.Message {
	return <-w.incoming
}

func (w *web) Reply(msg bot.Message, text string) {
	w.outgoing <- &message{text: text, sender: w.name}
}
