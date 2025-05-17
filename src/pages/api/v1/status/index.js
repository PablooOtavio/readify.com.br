import database from "src/infra/database.js";
import controller from "src/infra/controller.js";
import { createRouter } from "next-connect";

const router = createRouter();
router.get(getHandler);

export default router.handler(controller.errorHandlers);

async function getHandler(request, response) {
  const databaseName = process.env.POSTGRES_DB;
  const updatedAt = new Date().toISOString();

  const versionResult = await database.query("SHOW server_version;");
  const maxConnectionsResult = await database.query("SHOW max_connections;");
  const openedConnectionsResult = await database.query({
    text: "SELECT count(*)::int FROM pg_stat_activity WHERE datname = $1;",
    values: [databaseName],
  });

  const versionValue = versionResult.rows[0].server_version;
  const maxConnectionsValue = parseInt(
    maxConnectionsResult.rows[0].max_connections
  );
  const openedConnectionsValue = openedConnectionsResult.rows[0].count;

  const responseObject = {
    updated_at: updatedAt,
    dependencies: {
      database: {
        version: versionValue,
        max_connections: maxConnectionsValue,
        opened_connections: openedConnectionsValue,
      },
    },
  };

  response.status(200).send(responseObject);
}
