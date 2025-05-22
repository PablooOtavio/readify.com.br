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
      verbose: true,
      migrationsTable: "pgmigrations",
    });
    return migratedMigrations;
  } catch (error) {
    throw new ServiceError(
      "An unexpected error occurred while running migrations",
      error
    );
  } finally {
    await dbClient?.end();
  }
}

async function listPendingMigrations() {
  return await runMigrations({ dryRun: true });
}

async function runPendingMigrations() {
  return await runMigrations({ dryRun: false });
}
const migrator = {
  listPendingMigrations,
  runPendingMigrations,
};
export default migrator;
