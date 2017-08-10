package status

import (
	"fmt"
	"github.com/esoui/lexicon/bot"
	"io/ioutil"
	"net/http"
	"regexp"
	"strings"
)

var status = map[string]bool{
	"PS4 - EU":  false,
	"PS4 - US":  false,
	"PTS":       false,
	"XBox - US": false,
	"NA":        false,
	"EU":        false,
	"XBox - EU": false,
}

var Expr = `status`

func report() string {
	resp, err := http.Get("https://live-services.elderscrollsonline.com/status/realms")
	if err != nil {
		return "Sorry but I couldn't get server status right now."
	}
	defer resp.Body.Close()
	body, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		return "Sorry but I couldn't get server status right now."
	}
	report := []string{}
	for k, _ := range status {
		match, _ := regexp.Match(fmt.Sprintf(`"The Elder Scrolls Online \(%s\)": "UP"`, k), body)
		if !match {
			report = append(report, k)
		}
		status[k] = match
	}
	switch {
	case len(report) == len(status):
		return "All realms seem to be **down**."
	case len(report) > 1:
		return fmt.Sprintf("The realms **%s** and **%s** seem to be **down**.", strings.Join(report[:len(report)-1], "**, **"), report[len(report)-1])
	case len(report) > 0:
		return fmt.Sprintf("The realms **%s** seems to be **down**.", report[0])
	}
	return "All realms seem to be **up**."
}

func Handler(b *bot.Bot, m bot.Message, match []string) {
	b.Reply(m, report())
}
