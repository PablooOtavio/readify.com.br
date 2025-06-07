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
        const userData = {
          username: "usernameToUpdate",
          email: "fixedemail@test.com",
          password: "someRandomPasswordidkw",
        };

        const response = await createUser(userData);

        expect(response.status).toBe(201);

        const updatedUserData = {
          username: "newUniqueUsername",
        };

        const updateResponse = await updateUser(
          userData.username,
          updatedUserData,
        );

        const responseBody = await updateResponse.json();

        expect(responseBody).toEqual({
          id: responseBody.id,
          username: updatedUserData.username,
          email: userData.email,
          password: responseBody.password,
          created_at: responseBody.created_at,
          updated_at: responseBody.updated_at,
        });

        expect(uuidVersion(responseBody.id)).toBe(4);
        expect(Date.parse(responseBody.created_at)).not.toBeNaN();
        expect(Date.parse(responseBody.updated_at)).not.toBeNaN();
        expect(responseBody.updated_at > responseBody.created_at).toBe(true);
      });

      test("With unique email", async () => {
        const userData = {
          username: "fixedUsername",
          email: "email_to_update@test.com",
          password: "someRandomPasswordidkw",
        };

        const response = await createUser(userData);

        expect(response.status).toBe(201);

        const updatedUserData = {
          email: "new_cool_email@test.com",
        };

        const updateResponse = await updateUser(
          userData.username,
          updatedUserData,
        );

        const responseBody = await updateResponse.json();

        expect(responseBody).toEqual({
          id: responseBody.id,
          username: userData.username,
          email: updatedUserData.email,
          password: responseBody.password,
          created_at: responseBody.created_at,
          updated_at: responseBody.updated_at,
        });

        expect(uuidVersion(responseBody.id)).toBe(4);
        expect(Date.parse(responseBody.created_at)).not.toBeNaN();
        expect(Date.parse(responseBody.updated_at)).not.toBeNaN();
        expect(responseBody.updated_at > responseBody.created_at).toBe(true);
      });

      test("With a new password", async () => {
        const originalData = {
          username: "fixedUsername2",
          email: "fixed_email@test.com",
          password: "passwordToChange",
        };

        const createRes = await createUser(originalData);
        expect(createRes.status).toBe(201);

        const updatedData = {
          password: "UltraSecurePassword!",
        };

        const patchRes = await updateUser(originalData.username, updatedData);
        const responseBody = await patchRes.json();

        expect(responseBody).toEqual({
          id: responseBody.id,
          username: originalData.username,
          email: originalData.email,
          password: responseBody.password,
          created_at: responseBody.created_at,
          updated_at: responseBody.updated_at,
        });

        const userInDb = await user.findOneByUsername(originalData.username);
        const isPasswordValid = await password.compare(
          updatedData.password,
          userInDb.password,
        );
        const InvalidPassword = await password.compare(
          "WrongPassword",
          userInDb.password,
        );

        expect(isPasswordValid).toBe(true);
        expect(InvalidPassword).toBe(false);
      });

      test("with a diferent case username", async () => {
        const userData = {
          username: "lowercase",
          email: "lower_email@test.com",
          password: "Password123",
        };

        const response = await createUser(userData);
        expect(response.status).toBe(201);

        const updatedUser = {
          username: "LOWERCASE",
        };
        const patchResponse = await updateUser(userData.username, updatedUser);

        expect(patchResponse.status).toBe(200);
        const responseBody = await patchResponse.json();
        expect(responseBody).toEqual({
          id: responseBody.id,
          username: updatedUser.username,
          email: userData.email,
          password: responseBody.password,
          created_at: responseBody.created_at,
          updated_at: responseBody.updated_at,
        });
      });

      test("With duplicated username", async () => {
        const firstUser = {
          username: "original_user",
          email: "original_email@test.com",
          password: "Password123",
        };

        const secondUser = {
          username: "original_userr",
          email: "original.email2@test.com",
          password: "Password123",
        };

        const response1 = await createUser(firstUser);
        expect(response1.status).toBe(201);

        const response2 = await createUser(secondUser);
        expect(response2.status).toBe(201);

        const updatedUser = {
          username: firstUser.username,
        };
        const patchResponse = await updateUser(
          secondUser.username,
          updatedUser,
        );

        expect(patchResponse.status).toBe(400);
        const responseBody = await patchResponse.json();

        expect(responseBody).toEqual({
          statusCode: 400,
          name: "ValidationError",
          message: "Username already exists.",
          action: "Please, use a different Username.",
        });
      });
      test("With duplicated email", async () => {
        const firstUser = {
          username: "repeated_email",
          email: "repeated_email@test.com",
          password: "Password123",
        };

        const secondUser = {
          username: "repeated_email2",
          email: "repeated_email2@test.com",
          password: "Password123",
        };

        const response1 = await createUser(firstUser);
        expect(response1.status).toBe(201);

        const response2 = await createUser(secondUser);
        expect(response2.status).toBe(201);

        const updatedUser = {
          email: firstUser.email,
        };
        const patchResponse = await updateUser(
          secondUser.username,
          updatedUser,
        );

        expect(patchResponse.status).toBe(400);
        const responseBody = await patchResponse.json();

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

        const responseBody = await response.json();
        expect(response.status).toBe(404);

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
