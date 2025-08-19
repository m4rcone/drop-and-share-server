import { pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { randomUUID } from "node:crypto";

export const uploads = pgTable("uploads", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => randomUUID()),
  fileName: text("file_name").notNull(),
  remoteKey: text("remote_key").notNull(),
  remoteUrl: text("remote_url").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  expiresAt: timestamp("expires_at").notNull(),
});
