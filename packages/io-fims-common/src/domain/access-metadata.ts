import { fiscalCodeSchema } from "@/zod-schemas.js";
import { z } from "zod";

import { redirectDisplayNameSchema } from "./redirect-display-name.js";

export const accessMetadataSchema = z.object({
  fiscalCode: fiscalCodeSchema,
  redirect: z.object({
    displayName: redirectDisplayNameSchema,
    uri: z.string().url(),
  }),
  serviceId: z.string().ulid(),
  timestamp: z.string().datetime(),
});

export type AccessMetadata = z.infer<typeof accessMetadataSchema>;
