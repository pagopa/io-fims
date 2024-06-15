import { z } from "zod";

const Link = z.object({ href: z.string() }).passthrough();
const Consent = z
  .object({
    _links: z.object({ abort: Link, consent: Link }).passthrough(),
    redirect: z.object({ display_name: z.string() }).passthrough(),
    service_id: z.string(),
    type: z.literal("consent"),
    user_metadata: z.array(
      z.object({ display_name: z.string(), name: z.string() }).passthrough(),
    ),
  })
  .passthrough();

export const schemas = {
  Consent,
  Link,
};
