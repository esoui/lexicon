package search

import (
	"fmt"
	"github.com/esoui/lexicon/bot"
	"net/url"
)

var Expr = `search (forum|add-?on|author|lua|source|google|wiki) (.+)`

func Handler(b *bot.Bot, m bot.Message, match []string) {
	q := url.QueryEscape(match[2])
	switch match[1] {
	case "forum":
		u := `http://www.esoui.com/forums/search.php?do=process&query=` + q
		b.Reply(m, fmt.Sprintf(`See [forum results for "%s"](%s).`, match[2], u))
	case "addon", "add-on":
		u := `http://www.esoui.com/downloads/search.php?search=` + q
		b.Reply(m, fmt.Sprintf(`See [add-on results for "%s"](%s).`, match[2], u))
	case "author":
		u := `http://www.esoui.com/forums/memberlist.php?do=getall&ausername=` + q
		b.Reply(m, fmt.Sprintf(`See [author results for "%s"](%s).`, match[2], u))
	case "lua":
		u := `http://devdocs.io/lua~5.1/#q=` + q
		b.Reply(m, fmt.Sprintf(`See [Lua results for "%s"](%s).`, match[2], u))
	case "source":
		u := `https://github.com/esoui/esoui/search?utf8=✓&type=Code&q=` + q
		b.Reply(m, fmt.Sprintf(`See [source results for "%s"](%s).`, match[2], u))
	case "google":
		u := `https://www.google.com/search?q=` + q
		b.Reply(m, fmt.Sprintf(`See [Google results for "%s"](%s).`, match[2], u))
	case "wiki":
		u := `http://wiki.esoui.com/w/index.php?go=1&search=` + q
		b.Reply(m, fmt.Sprintf(`See [Wiki results for "%s"](%s).`, match[2], u))
	}
}
