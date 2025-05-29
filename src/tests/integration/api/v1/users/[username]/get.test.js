import orchestrator from "src/tests/orchestrator";
import { version as uuidVersion } from "uuid";

beforeAll(async () => {
  await orchestrator.waitForAllServices();
  await orchestrator.clearDatabase();
  await orchestrator.runMigrations();
});

const findUser = async (username) => {
  return fetch(`http://localhost:3000/api/v1/users/${username}`);
};
const createUser = async (userData) => {
  return fetch("http://localhost:3000/api/v1/users", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userData),
  });
};

describe("GET/api/v1/users/username", () => {
  describe("Anonymous user", () => {
    test("With exact case match", async () => {
      const userData = {
        username: "exactCase",
        email: "exact_case@test.com",
        password: "test_password",
      };
      await createUser(userData);

      const response = await findUser(userData.username);

      const responseBody = await response.json();

      expect(response.status).toBe(200);

      expect(responseBody).toEqual({
        id: responseBody.id,
        username: userData.username,
        email: userData.email,
        password: responseBody.password,
        created_at: responseBody.created_at,
        updated_at: responseBody.updated_at,
      });

      expect(uuidVersion(responseBody.id)).toBe(4);
      expect(Date.parse(responseBody.created_at)).not.toBeNaN();
      expect(Date.parse(responseBody.updated_at)).not.toBeNaN();
    });

    test("With case mismatch", async () => {
      const userData = {
        username: "caseInsensitive",
        email: "case_insensitive@test.com",
        password: "test_password",
      };
      await createUser(userData);

      const response = await findUser("caseinsensitive");
      expect(response.status).toBe(200);
      const responseBody = await response.json();

      expect(responseBody).toEqual({
        id: responseBody.id,
        username: userData.username,
        email: userData.email,
        password: responseBody.password,
        created_at: responseBody.created_at,
        updated_at: responseBody.updated_at,
      });

      expect(uuidVersion(responseBody.id)).toBe(4);
      expect(Date.parse(responseBody.created_at)).not.toBeNaN();
      expect(Date.parse(responseBody.updated_at)).not.toBeNaN();
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
