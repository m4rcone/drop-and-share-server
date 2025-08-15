import { migrate } from "drizzle-orm/node-postgres/migrator";
import db from "../../infra/database/database.js";

export async function runMigrationsService() {
  await migrate(db, {
    migrationsFolder: "./src/infra/database/migrations",
  });
}
