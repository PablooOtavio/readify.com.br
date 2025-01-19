import database from "src/infra/database.js";
import migrationRunner from "node-pg-migrate";
import { resolve } from "node:path";

export default async function migrations(request, response) {
  const allowedMethods = ["GET", "POST"];
  const isValidMethod = allowedMethods.includes(request.method);
  const dryRun = request.method === "GET";
  let dbClient = null;

  if (!isValidMethod) {
    return response
      .status(405)
      .json({ error: `Method ${request.method} not allowed` });
  }

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
  } catch (error) {
    console.error(error);
    return response.status(405).end();
  } finally {
    await dbClient.end();
  }
}
