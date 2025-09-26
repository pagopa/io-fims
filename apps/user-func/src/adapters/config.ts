import { MailerConfig } from "@pagopa/io-functions-commons/dist/src/mailer/index.js";
import * as E from "fp-ts/lib/Either.js";
import { cosmosConfigSchema } from "io-fims-common/adapters/cosmos/config";
import { z } from "zod";

import { envSchema } from "./env.js";

export const storageQueueConfigSchema = z.object({
  accessQueueName: z.string().min(1),
  connectionPrefix: z.string().min(1),
  exportQueueName: z.string().min(1),
  exportQueueUrl: z.string().url(),
  legacyConnectionPrefix: z.string().min(1),
});

export const mailerConfigSchema = z.object({
  MAIL_FROM: z.string().min(1),
  MAILHOG_HOSTNAME: z.string().optional(),
  MAILUP_SECRET: z.string().min(1).optional(),
  MAILUP_USERNAME: z.string().min(1).optional(),
  NODE_ENV: z.string(),
});

export type StorageQueueConfig = z.infer<typeof storageQueueConfigSchema>;

export const configSchema = z.object({
  cosmos: cosmosConfigSchema,
  mailer: mailerConfigSchema.transform((config, ctx): MailerConfig => {
    const mailerConfig = MailerConfig.decode(config);
    if (E.isLeft(mailerConfig)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Invalid mailer configuration",
      });
      return z.NEVER;
    }
    return mailerConfig.right;
  }),
  storageQueue: storageQueueConfigSchema,
});

export type Config = z.infer<typeof configSchema>;

export const configFromEnvironment = envSchema.transform(
  (env): Config =>
    configSchema.parse({
      cosmos: {
        databaseName: env.COSMOS_DBNAME,
        endpoint: env.COSMOS_ENDPOINT,
      },
      mailer: {
        MAIL_FROM: env.MAIL_FROM,
        MAILHOG_HOSTNAME:
          env.NODE_ENV === "development" ? env.MAILHOG_HOSTNAME : undefined,
        MAILUP_SECRET:
          env.NODE_ENV === "production" ? env.MAILUP_SECRET : undefined,
        MAILUP_USERNAME:
          env.NODE_ENV === "production" ? env.MAILUP_USERNAME : undefined,
        NODE_ENV: env.NODE_ENV,
      },
      storageQueue: {
        accessQueueName: env.ACCESS_QUEUE_NAME,
        connectionPrefix: "FIMS_STORAGE",
        exportQueueName: env.EXPORT_QUEUE_NAME,
        exportQueueUrl:
          env.FIMS_STORAGE__queueServiceUri + env.EXPORT_QUEUE_NAME,
        legacyConnectionPrefix: "FIMS_STORAGE_LEGACY",
      },
    }),
);
