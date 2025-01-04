import database from "../../../../infra/database.js";

async function status(request, response) {
  const result = await database.query("SELECT 'Hello, World' as message;");
  console.log(result.rows);
  response.status(200).send("Hello, world!");
}

export default status;
