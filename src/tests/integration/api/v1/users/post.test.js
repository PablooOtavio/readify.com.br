import {
  UserValidation,
  PasswordValidation,
} from "src/tests/helpers/users.helper";
import orchestrator from "src/tests/orchestrator";

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

        UserValidation(responseBody, {
          username: userData.username,
          email: userData.email,
        });

        await PasswordValidation(userData.username, userData.password);
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

        const resA = await createUser(firstUser);
        expect(resA.status).toBe(201);

        const resB = await createUser(secondUser);

        const responseBody = await resB.json();

        expect(resB.status).toBe(400);
        expect(responseBody).toEqual({
          statusCode: 400,
          name: "ValidationError",
          message: "Email already exists.",
          action: "Please, use a different Email.",
        });
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

        const resA = await createUser(firstUser);

        expect(resA.status).toBe(201);

        const resB = await createUser(secondUser);

        const responseBody = await resB.json();

        expect(resB.status).toBe(400);

        expect(responseBody).toEqual({
          statusCode: 400,
          name: "ValidationError",
          message: "Username already exists.",
          action: "Please, use a different Username.",
        });
      });
    });
  });
});
