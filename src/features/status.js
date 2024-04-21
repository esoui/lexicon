async function getGameServerStatus() {
  const resp = await fetch(
    "https://live-services.elderscrollsonline.com/status/realms",
  );
  const json = await resp.json();
  if (json.zos_platform_response.result_message !== "success") {
    throw new Error("Bad result " + JSON.stringify(json));
  }
  return {
    pts: json.zos_platform_response.response["The Elder Scrolls Online (PTS)"],
    pc: {
      na: json.zos_platform_response.response["The Elder Scrolls Online (NA)"],
      eu: json.zos_platform_response.response["The Elder Scrolls Online (EU)"],
    },
    xbox: {
      us: json.zos_platform_response.response[
        "The Elder Scrolls Online (XBox - US)"
      ],
      eu: json.zos_platform_response.response[
        "The Elder Scrolls Online (XBox - EU)"
      ],
    },
    ps4: {
      us: json.zos_platform_response.response[
        "The Elder Scrolls Online (PS4 - US)"
      ],
      eu: json.zos_platform_response.response[
        "The Elder Scrolls Online (PS4 - EU)"
      ],
    },
  };
}

const corpus = {
  name: "Server Status Corpus",
  locale: "en-US",
  data: [
    {
      intent: "status",
      utterances: [
        "What is the game status?",
        "How are the servers?",
        "Is the game down?",
        "Is the game offline?",
        "Are the servers down?",
      ],
      actions: [
        {
          name: "handleGameStatus",
        },
      ],
      answers: ["I checked the game servers: {{status}}"],
    },
  ],
};

module.exports = function (nlp) {
  nlp.addCorpus(corpus);

  nlp.registerActionFunction("handleGameStatus", async (data) => {
    try {
      const status = await getGameServerStatus();
      data.context.status = `
      <table>
        <tbody>
          <tr>
            <td></td>
            <th>PTS</th>
            <th>PC</th>
            <th>Xbox</th>
            <th>PS4</th>
          </tr>
          <tr>
            <th>NA</th>
            <td>${status.pts}</td>
            <td>${status.pc.na}</td>
            <td>${status.xbox.us}</td>
            <td>${status.ps4.us}</td>
          </tr>
          <tr>
            <th>EU</th>
            <td>-</td>
            <td>${status.pc.eu}</td>
            <td>${status.xbox.eu}</td>
            <td>${status.ps4.eu}</td>
          </tr>
        </tbody>
      </table>
      `;
    } catch (err) {
      console.error(err);
      data.context.failed = true;
    }
    return data;
  });
};
