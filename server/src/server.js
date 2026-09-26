import "dotenv/config";
import app from "./app.js";
import { pool } from "./config/database.js";

const port = Number(process.env.PORT || 3001);
const server = app.listen(port, () => console.log(`Dialed API listening on ${port}`));

async function shutDown() {
  server.close();
  await pool.end();
}

process.on("SIGINT", shutDown);
process.on("SIGTERM", shutDown);
