import {
  AccessMetadata,
  accessMetadataSchema,
} from "io-fims-common/domain/access-metadata";
import { FiscalCode } from "io-fims-common/zod-schemas";
import { ulid } from "ulid";
import { z } from "zod";

export const accessSchema = accessMetadataSchema.extend({
  id: z.string().ulid(),
});

export type Access = z.infer<typeof accessSchema>;

export const createAccess = (metadata: AccessMetadata): Access => ({
  id: ulid(),
  ...metadata,
});

export interface AccessRepository {
  create(access: Access): Promise<void>;
  list(fiscalCode: FiscalCode): Promise<Access[]>;
}

export const accessHistoryPageSchema = z.object({
  data: z.array(accessSchema),
  next: z.string().min(1).optional(),
});

export type AccessHistoryPage = z.infer<typeof accessHistoryPageSchema>;

export interface AccessHistoryPageRepository {
  get(
    id: AccessHistoryPage["next"],
    fiscalCode: FiscalCode,
  ): Promise<AccessHistoryPage>;
}
