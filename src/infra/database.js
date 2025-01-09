import { Client } from "pg";

async function query(queryObject) {
  const client = new Client({
    database: process.env.POSTGRES_DB,
    host: process.env.POSTGRES_HOST,
    port: process.env.POSTGRES_PORT,
    user: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    ssl: getSSLValues(),
  });

  let result;

  try {
    await client.connect();
    result = await client.query(queryObject);
  } catch (err) {
    throw new Error(err);
  } finally {
    await client.end();
  }

  return result;
}

export default {
  query: query,
};

function getSSLValues() {
  if (process.env.POSTGRES_CA) {
    return { ca: process.env.POSTGRES_CA };
  }
  return process.env.NODE_ENV === "development" ? false : true;
}
