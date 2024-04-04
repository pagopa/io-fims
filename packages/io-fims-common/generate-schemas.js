import { zodToJsonSchema } from "zod-to-json-schema";
import prettier from "prettier";
import fs from "node:fs/promises";

import { oidcClientConfigSchema } from "./dist/oidc-client-config.js";

const schema = await prettier.format(
  JSON.stringify(zodToJsonSchema(oidcClientConfigSchema)),
  {
    parser: "json",
  },
);

await fs.writeFile("schemas/oidc-client-config.json", schema, {
  encoding: "utf-8",
});
