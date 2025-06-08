import { UserValidation, PasswordValidation } from "src/tests/helpers/users";
import orchestrator from "src/tests/orchestrator";
beforeAll(async () => {
  await orchestrator.waitForAllServices();
  await orchestrator.clearDatabase();
  await orchestrator.runMigrations();
});

const updateUser = async (username, userData) => {
  return fetch(`http://localhost:3000/api/v1/users/${username}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userData),
  });
};

describe("PATCH /api/v1/users", () => {
  describe("Anonymous user", () => {
    describe("Update a user", () => {
      test("With unique username", async () => {
        const createdUser = await orchestrator.createUser();

        const updateData = {
          username: "newUniqueUsername",
        };

        const response = await updateUser(createdUser.username, updateData);
        expect(response.status).toBe(200);

        const responseBody = await response.json();

        UserValidation(responseBody, {
          username: updateData.username,
          email: createdUser.email,
        });
        expect(responseBody.updated_at > responseBody.created_at).toBe(true);
      });

      test("With unique email", async () => {
        const createdUser = await orchestrator.createUser();

        const updateData = {
          email: "new_cool_email@test.com",
        };

        const response = await updateUser(createdUser.username, updateData);
        expect(response.status).toBe(200);

        const responseBody = await response.json();

        UserValidation(responseBody, {
          username: createdUser.username,
          email: updateData.email,
        });
        expect(responseBody.updated_at > responseBody.created_at).toBe(true);
      });

      test("With a new password", async () => {
        const createdUser = await orchestrator.createUser();

        const updateData = {
          password: "UltraSecurePassword!",
        };

        const response = await updateUser(createdUser.username, updateData);
        expect(response.status).toBe(200);

        const responseBody = await response.json();

        UserValidation(responseBody, {
          username: createdUser.username,
          email: createdUser.email,
        });
        expect(responseBody.updated_at > responseBody.created_at).toBe(true);
        await PasswordValidation(createdUser.username, updateData.password);
      });

      test("with a diferent case username", async () => {
        const createdUser = await orchestrator.createUser();

        const username = createdUser.username;
        const updateData = {
          username: username.toUpperCase(),
        };
        const responseponse = await updateUser(
          createdUser.username,
          updateData,
        );
        expect(responseponse.status).toBe(200);

        const responseBody = await responseponse.json();
        UserValidation(responseBody, {
          username: updateData.username,
          email: createdUser.email,
        });
        expect(responseBody.updated_at > responseBody.created_at).toBe(true);
      });

      test("With duplicated username", async () => {
        const firstUser = await orchestrator.createUser();
        const secondUser = await orchestrator.createUser();

        const updateData = {
          username: firstUser.username,
        };

        const responseponse = await updateUser(secondUser.username, updateData);
        expect(responseponse.status).toBe(400);

        const responseBody = await responseponse.json();

        expect(responseBody).toEqual({
          statusCode: 400,
          name: "ValidationError",
          message: "Username already exists.",
          action: "Please, use a different Username.",
        });
      });

      test("With duplicated email", async () => {
        const firstUser = await orchestrator.createUser();
        const secondUser = await orchestrator.createUser();

        const updateData = {
          email: firstUser.email,
        };

        const responseponse = await updateUser(secondUser.username, updateData);
        expect(responseponse.status).toBe(400);

        const responseBody = await responseponse.json();

        expect(responseBody).toEqual({
          statusCode: 400,
          name: "ValidationError",
          message: "Email already exists.",
          action: "Please, use a different Email.",
        });
      });

      test("with nonexistent data", async () => {
        const nonexistentUser = {
          username: "nonexistent_username",
          email: "nonexistent.email@test.com",
          password: "Password123",
        };

        const response = await updateUser(
          nonexistentUser.username,
          nonexistentUser,
        );
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
});
