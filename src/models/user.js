import database from "src/infra/database";
import { ValidationError, NotFoundError } from "src/infra/errors";

async function create(data) {
  await validateUniqueData(data.email, data.username);

  const newUser = await runInsertQuery(data);
  return newUser;

  async function runInsertQuery(data) {
    const result = await database.query({
      text: `
    INSERT INTO
        users (username, email, password) 
     VALUES 
        ($1, $2, $3)
        RETURNING *;`,
      values: [data.username, data.email, data.password],
    });

    return result.rows[0];
  }
  async function validateUniqueData(email, username) {
    const { rowCount, rows } = await database.query({
      text: `
        SELECT
          CASE
            WHEN LOWER(email)    = LOWER($1) THEN 'Email'
            WHEN LOWER(username) = LOWER($2) THEN 'Username'
          END AS field
        FROM users
        WHERE LOWER(email)    = LOWER($1)
           OR LOWER(username) = LOWER($2)
        LIMIT 1;
      `,
      values: [email, username],
    });

    if (rowCount > 0) {
      const field = rows[0].field;
      throw new ValidationError({
        message: `${field} already exists.`,
        action: `Please, use a different ${field}.`,
      });
    }
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

const user = {
  create,
  findOneByUsername,
};
export default user;
