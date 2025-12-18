import dotenv from "dotenv";
import pg from "pg";

dotenv.config(); 

const { Client } = pg;

const db = new Client({
  user: process.env.PG_USER,
  host: process.env.PG_HOST,
  database: process.env.PG_DATABASE,
  password: process.env.PG_PASSWORD,
  port: process.env.PG_PORT,
});

db.connect()
  .then(() => console.log("✅ Connected to PostgreSQL"))
  .catch((err) => console.error("❌ Database connection error:", err));

db.on("error", (err) => console.error("⚠️ DB Error:", err));

export {db}