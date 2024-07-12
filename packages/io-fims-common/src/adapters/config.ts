import { pino } from "pino";
import { ZodError, z } from "zod";

const logger = pino({
  level: "error",
});

export async function loadConfigFromEnvironment<T extends z.ZodTypeAny>(
  schema: T,
  onSuccess: (config: z.TypeOf<T>) => Promise<void>,
) {
  try {
    const config = schema.parse(process.env);
    await onSuccess(config);
  } catch (err) {
    if (err instanceof ZodError) {
      err.issues.forEach((issue) => {
        logger.error({ issue }, "Error parsing environment variable");
      });
    } else if (err instanceof Error) {
      logger.error(
        {
          err,
        },
        err.message,
      );
    } else {
      logger.error(
        {
          err,
        },
        "Unable to start the application due to an unexpected error",
      );
    }
  }
}
