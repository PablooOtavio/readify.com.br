import { Client } from "pg";

function getSSLValues() {
  if (process.env.POSTGRES_CA) {
    return { ca: process.env.POSTGRES_CA };
  }
  return process.env.NODE_ENV === "production" ? true : false;
}

class Database {
  constructor() {
    this.getSSLValues = getSSLValues;
  }

  async query(queryObject) {
    let client;

    try {
      client = await this.getNewClient();
      const result = await client.query(queryObject);
      return result;
    } catch (error) {
      console.error("Failed to get a new client to the database", error);
      throw error;
    } finally {
      if (client) {
        await client?.end();
      }
    }
  }

  async getNewClient() {
    const client = new Client({
      database: process.env.POSTGRES_DB,
      host: process.env.POSTGRES_HOST,
      port: process.env.POSTGRES_PORT,
      user: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
      ssl: getSSLValues(),
    });
    await client.connect();
    return client;
  }
}

const database = new Database();
export default database;
