import pg from "pg";
import dotenv from "dotenv";
import { readFileSync } from "node:fs";

const { Pool } = pg;

dotenv.config({ path: new URL("../../.env", import.meta.url) });

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is required. Copy server/.env.example to server/.env and add the Supabase Session pooler URI.");
}

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: Number(process.env.DB_POOL_MAX || (process.env.VERCEL ? 1 : 5)),
  idleTimeoutMillis: 30_000,
  connectionTimeoutMillis: 10_000,
  ssl: {
    ca: readFileSync(
      new URL("../../certs/prod-ca-2021.crt", import.meta.url),
      "utf8",
    ),
    rejectUnauthorized: true,
  },
});

pool.on("error", (error) => console.error("Unexpected database pool error", error));
