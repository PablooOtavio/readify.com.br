import database from "src/infra/database.js";

async function status(request, response) {
  const result = await database.query("SELECT 'Hello, World' as message;");
  console.log(result.rows);
  response.status(200).send(result);
}

export default status;
