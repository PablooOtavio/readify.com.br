import database from "src/infra/database.js";
import migrationRunner from "node-pg-migrate";
import { resolve } from "node:path";
import { ServiceError } from "src/infra/errors";

async function runMigrations({ dryRun }) {
  let dbClient;
  try {
    dbClient = await database.getNewClient();
    const migratedMigrations = await migrationRunner({
      dryRun,
      dbClient,
      dir: resolve("src", "infra", "migrations"),
      direction: "up",
      log: () => {},
      migrationsTable: "pgmigrations",
    });
    return migratedMigrations;
  } catch (error) {
    throw new ServiceError(
      "An unexpected error occurred while running migrations",
      error,
    );
  } finally {
    await dbClient?.end();
  }
}

const migrator = {
  listPendingMigrations: async () => runMigrations({ dryRun: true }),
  runPendingMigrations: async () => runMigrations({ dryRun: false }),
};
export default migrator;
