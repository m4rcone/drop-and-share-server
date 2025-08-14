import { migrate } from "drizzle-orm/node-postgres/migrator";
import db from "../../infra/database/database.js";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { dirname } from "node:path";

export async function runMigrationsService() {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = dirname(__filename);

  const migrationsPath = path.join(
    __dirname,
    "../../infra/database/migrations",
  );

  await migrate(db, {
    migrationsFolder: migrationsPath,
  });
}
