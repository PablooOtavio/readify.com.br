import orchestrator from "src/tests/orchestrator";
import user from "src/models/user";
import { version as uuidVersion } from "uuid";
import password from "src/models/password";

beforeAll(async () => {
  await orchestrator.waitForAllServices();
  await orchestrator.clearDatabase();
  await orchestrator.runMigrations();
});

const createUser = async (userData) => {
  return fetch("http://localhost:3000/api/v1/users", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userData),
  });
};

describe("POST /api/v1/users", () => {
  describe("Anonymous user", () => {
    describe("Create a user", () => {
      test("With unique and valid data", async () => {
        const userData = {
          username: "UniqueUser",
          email: "unique_user@test.com",
          password: "test_password",
        };

        const response = await createUser(userData);

        expect(response.status).toBe(201);

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

        const userInDb = await user.findOneByUsername(userData.username);
        const isPasswordValid = await password.compare(
          userData.password,
          userInDb.password,
        );
        const InvalidPassword = await password.compare(
          "WrongPassword",
          userInDb.password,
        );

        expect(isPasswordValid).toBe(true);
        expect(InvalidPassword).toBe(false);
      });

      test("With duplicated email", async () => {
        const firstUser = {
          username: "user_email1",
          email: "duplicate_email@test.com",
          password: "Password123",
        };

        const secondUser = {
          username: "user_email2",
          email: "Duplicate_Email@test.com", // tests case insensitivity
          password: "Password123",
        };

        const response1 = await createUser(firstUser);
        expect(response1.status).toBe(201);

        const response2 = await createUser(secondUser);

        const responseBody = await response2.json();

        expect(responseBody).toEqual({
          statusCode: 400,
          name: "ValidationError",
          message: "Email already exists.",
          action: "Please, use a different Email.",
        });

        expect(response2.status).toBe(400);
      });

      test("With duplicated username", async () => {
        const firstUser = {
          username: "duplicate_username",
          email: "email1@test.com",
          password: "Password123",
        };

        const secondUser = {
          username: "Duplicate_Username", // tests case insensitivity
          email: "email2@test.com",
          password: "Password123",
        };

        const response1 = await createUser(firstUser);

        expect(response1.status).toBe(201);

        const response2 = await createUser(secondUser);

        const responseBody = await response2.json();

        expect(responseBody).toEqual({
          statusCode: 400,
          name: "ValidationError",
          message: "Username already exists.",
          action: "Please, use a different Username.",
        });

        expect(response2.status).toBe(400);
      });
    });
  });
});
