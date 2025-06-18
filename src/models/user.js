import database from "src/infra/database";
import password from "src/models/password";
import { ValidationError, NotFoundError } from "src/infra/errors";

async function create(data) {
  await validateUniqueEmail(data.email);
  await validateUniqueUsername(data.username);
  data.password = await password.hash(data.password);
  const newUser = await runInsertQuery(data);
  return newUser;

  async function runInsertQuery(data) {
    const result = await database.query({
      text: `
    INSERT INTO
        users (username, email, password) 
    VALUES 
        ($1, $2, $3)
    RETURNING 
        id, username, email, created_at, updated_at;`,
      values: [data.username, data.email, data.password],
    });
    return result.rows[0];
  }
}
async function update(username, userData) {
  const currentUser = await findOneByUsername(username);

  if ("username" in userData) {
    const newUsername = userData.username;
    if (username.toLowerCase() !== newUsername.toLowerCase()) {
      await validateUniqueUsername(newUsername);
    }
  }
  if ("email" in userData) {
    await validateUniqueEmail(userData.email);
  }
  if ("password" in userData) {
    userData.password = password.hash(userData.password);
  }

  const userWithNewData = {
    ...currentUser,
    ...userData,
  };
  const updatedUser = await runUpdateQuery(userWithNewData);
  return updatedUser.rows[0];

  async function runUpdateQuery(userData) {
    const result = await database.query({
      text: `
    UPDATE
        users
    SET
        username = $2,
        email = $3,
        password = $4,
        updated_at = timezone('UTC', now())
    WHERE 
        id = $1
    RETURNING 
        id, username, email, created_at, updated_at;`,
      values: [
        userData.id,
        userData.username,
        userData.email,
        await userData.password,
      ],
    });
    return result;
  }
}

async function findOneByUsername(username) {
  const result = await database.query({
    text: `
    SELECT 
        *
    FROM 
        users 
    WHERE 
        LOWER(username) = LOWER($1);`,
    values: [username],
  });
  if (result.rowCount === 0) {
    throw new NotFoundError({
      message: "User not found.",
      action: "Please, check the username and try again.",
    });
  }
  return result.rows[0];
}

async function validateUniqueUsername(email) {
  const { rowCount } = await database.query({
    text: `
      SELECT username
      FROM users
      WHERE LOWER(username) = LOWER($1)
      LIMIT 1;`,
    values: [email],
  });

  if (rowCount > 0) {
    throw new ValidationError({
      message: "Username already exists.",
      action: "Please, use a different Username.",
    });
  }
}

async function validateUniqueEmail(email) {
  const { rowCount } = await database.query({
    text: `
      SELECT email
      FROM users
      WHERE LOWER(email) = LOWER($1)
      LIMIT 1;`,
    values: [email],
  });

  if (rowCount > 0) {
    throw new ValidationError({
      message: "Email already exists.",
      action: "Please, use a different Email.",
    });
  }
}

const user = {
  create,
  findOneByUsername,
  update,
};
export default user;
