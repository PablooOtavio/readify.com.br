import database from "src/infra/database.js";
import migrationRunner from "node-pg-migrate";
import { resolve } from "node:path";
import { createRouter } from "next-connect";
import controller from "src/infra/controller";

const router = createRouter();
router.get(getHandler);
router.post(postHandler);

export default router.handler(controller.errorHandlers);

async function getHandler(request, response) {
  return handleMigration(response, true);
}

async function postHandler(request, response) {
  return handleMigration(response, false);
}

async function handleMigration(response, dryRun) {
  let dbClient;
  try {
    dbClient = await database.getNewClient();
    const migrationsResult = await migrationRunner({
      dbClient: dbClient,
      dryRun: dryRun,
      dir: resolve("src", "infra", "migrations"),
      direction: "up",
      verbose: true,
      migrationsTable: "pgmigrations",
    });

    if (migrationsResult.length > 0 && !dryRun) {
      return response.status(201).send(migrationsResult);
    }

    return response.status(200).send(migrationsResult);
  } finally {
    if (dbClient) {
      await dbClient?.end();
    }
  }
}
