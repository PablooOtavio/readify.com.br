import { version as uuidVersion } from "uuid";
import password from "src/models/password.js";
import user from "src/models/user.js";

export function UserValidation(body, { username, email }) {
  expect(body).toEqual({
    id: body.id,
    username: username,
    email: email,
    created_at: body.created_at,
    updated_at: body.updated_at,
  });
  expect(uuidVersion(body.id)).toBe(4);
  expect(body.created_at).toBeTruthy();
  expect(body.updated_at).toBeTruthy();
}
export async function PasswordValidation(username, userPassword) {
  const foundUser = await user.findOneByUsername(username);
  const isPasswordValid = await password.compare(
    userPassword,
    foundUser.password
  );
  const InvalidPassword = await password.compare(
    "WrongPassword",
    foundUser.password
  );

  expect(isPasswordValid).toBe(true);
  expect(InvalidPassword).toBe(false);
}
