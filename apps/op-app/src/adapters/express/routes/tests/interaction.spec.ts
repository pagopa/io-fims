import { describe, expect, it } from "vitest";

import { parseRedirectDisplayName } from "../interaction.js";

describe("parseRedirectDisplayName", () => {
  it("Throws on invalid redirectDisplayNames", () => {
    expect(() => parseRedirectDisplayName({}, "http://localhost", "it")).throws(
      "redirect_display_name",
    );
    expect(() =>
      parseRedirectDisplayName(
        {
          "http://localhost": { it: "localhost" },
        },
        "http://pagopa.it/callback",
        "it",
      ),
    ).throws("redirect_display_name");
  });
  it.each([
    {
      expected: "Il mio sito web locale",
      lang: "it",
    },
    {
      expected: "My local website",
      lang: "en",
    },
    {
      expected: "Il mio sito web locale",
      lang: "uz",
    },
  ])(
    "Returns the right redirect_display_name for given locale ($lang)",
    ({ expected, lang }) => {
      const redirectUri = "http://localhost";
      const result = parseRedirectDisplayName(
        {
          [redirectUri]: {
            en: "My local website",
            it: "Il mio sito web locale",
          },
        },
        redirectUri,
        lang,
      );
      expect(result).toBe(expected);
    },
  );
});
