async function getGameServerStatus() {
  const resp = await fetch(
    "https://live-services.elderscrollsonline.com/status/realms"
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

export default function (nlp) {
  nlp.addCorpus(corpus);

  nlp.registerActionFunction("handleGameStatus", async (data, locale) => {
    try {
      const status = await getGameServerStatus();
      data.context.status = `
        - PTS is ${status.pts}
        - PC/NA is ${status.pc.na}
        - PC/EU is ${status.pc.eu}
        - Xbox/US is ${status.xbox.us}
        - Xbox/EU is ${status.xbox.eu}
        - PS4/US is ${status.ps4.us}
        - PS4/EU is ${status.ps4.eu}
      `;
    } catch (err) {
      console.error(err);
      data.context.failed = true;
    }
    return data;
  });
}
