import { Readable } from "stream";
import { describe, expect, test } from "vitest";

import { getStreamIntoString } from "../access-log-register.js";

describe("Readeable stream conversion", () => {
  test("return a correct string from the readable stream", async () => {
    const testBlob = {
      ipAddress: "127.0.0.1",
      requestParams: {
        client_id: "aClientId",
        redirect_uri: "http://test.test",
        response_type: "code",
      },
      timestamp: 123456789,
      userData: {
        firstName: "aFirstName",
        fiscalCode: "aFiscalCode",
        lastName: "aLastName",
      },
    };

    const readableStream = Readable.from(JSON.stringify(testBlob));
    const convertedString = await getStreamIntoString(readableStream);
    const parsedData = JSON.parse(convertedString);
    expect(parsedData).toStrictEqual(testBlob);
  });
});
