export async function getGameServerStatus() {
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
