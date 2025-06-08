import retry from "async-retry";
import { faker } from "@faker-js/faker";
import database from "src/infra/database";
import migrator from "src/models/migrator";
import user from "src/models/user";
const { username: fakeUsername, email: fakeEmail } = faker.internet;

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

async function createUser(userData = {}) {
  return user.create({
    username: userData.username || fakeUsername().replace(/[_.-]/g, ""),
    email: userData.email || fakeEmail(),
    password: userData.password || "SuperSecurePassword123!@%#@!&@¨(!*@)(#*",
  });
}

const orchestrator = {
  waitForAllServices,
  clearDatabase,
  runMigrations,
  createUser,
};
export default orchestrator;
