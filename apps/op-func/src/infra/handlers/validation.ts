import * as t from "io-ts";
import * as z from "zod";

export const IoTsType = <T>(schema: z.ZodSchema<T>) =>
  new t.Type<z.infer<typeof schema>>(
    "FromZodSchemaCodec",
    (u): u is z.infer<typeof schema> => schema.safeParse(u).success,
    (u, ctx) => {
      const result = schema.safeParse(u);
      return result.success ? t.success(result.data) : t.failure(u, ctx);
    },
    (c) => c,
  );
