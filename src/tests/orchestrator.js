import retry from "async-retry";
import database from "src/infra/database";
import migrator from "src/models/migrator";

async function waitForAllServices() {
  await waitForWebServer();
  async function waitForWebServer() {
    return retry(fetchStatusPage, {
      retries: 100,
      onRetry: (error, attempt) => {
        console.log(
          `Attempt ${attempt} - Failed to fetch Status Page: ${error.message}`,
        );
      },
      minTimeout: 100,
      factor: 1,
      randomize: false,
    });

    async function fetchStatusPage() {
      const response = await fetch("http://localhost:3000/api/v1/status");
      if (response.status !== 200) {
        throw new Error(`HTTP error ${response.status}`);
      }
    }
  }
}

async function clearDatabase() {
  try {
    await database.query("DROP SCHEMA PUBLIC cascade; CREATE SCHEMA PUBLIC;");
  } catch (error) {
    throw new error("Failed to drop schema PUBLIC", error);
  }
}

async function runMigrations() {
  await migrator.runPendingMigrations();
}

const orchestrator = { waitForAllServices, clearDatabase, runMigrations };
export default orchestrator;
