import { UserValidation } from "src/tests/helpers/users.helper";
import orchestrator from "src/tests/orchestrator";

beforeAll(async () => {
  await orchestrator.waitForAllServices();
  await orchestrator.clearDatabase();
  await orchestrator.runMigrations();
});

const findUser = async (username) => {
  return fetch(`http://localhost:3000/api/v1/users/${username}`);
};

describe("GET/api/v1/users/username", () => {
  describe("Anonymous user", () => {
    test("With exact case match", async () => {
      const createdUser = await orchestrator.createUser();

      const response = await findUser(createdUser.username);
      expect(response.status).toBe(200);

      const responseBody = await response.json();

      UserValidation(responseBody, {
        username: createdUser.username,
        email: createdUser.email,
      });
    });

    test("With case mismatch", async () => {
      const createdUser = await orchestrator.createUser();
      const username = createdUser.username;

      const response = await findUser(username.toUpperCase());
      expect(response.status).toBe(200);

      const responseBody = await response.json();

      UserValidation(responseBody, {
        username: createdUser.username,
        email: createdUser.email,
      });
    });
    test("With nonexistent username", async () => {
      const username = "nonExistentUser";

      const response = await findUser(username);
      expect(response.status).toBe(404);

      const responseBody = await response.json();
      expect(responseBody).toEqual({
        statusCode: 404,
        name: "NotFoundError",
        message: "User not found.",
        action: "Please, check the username and try again.",
      });
    });
  });
});
