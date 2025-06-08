import { version as uuidVersion } from "uuid";
import password from "src/models/password.js";
import user from "src/models/user.js";

export function UserValidation(body, { username, email }) {
  expect(body).toEqual({
    id: body.id,
    username: username,
    email: email,
    password: body.password,
    created_at: body.created_at,
    updated_at: body.updated_at,
  });

  expect(uuidVersion(body.id)).toBe(4);
  expect(Date.parse(body.created_at)).not.toBeNaN();
  expect(Date.parse(body.updated_at)).not.toBeNaN();
}
export async function PasswordValidation(username, userPassword) {
  const foundUser = await user.findOneByUsername(username);
  const isPasswordValid = await password.compare(
    userPassword,
    foundUser.password,
  );
  const InvalidPassword = await password.compare(
    "WrongPassword",
    foundUser.password,
  );

  expect(isPasswordValid).toBe(true);
  expect(InvalidPassword).toBe(false);
}
