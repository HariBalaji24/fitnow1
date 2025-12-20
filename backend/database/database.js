import dotenv from "dotenv";
import pg from "pg";

dotenv.config(); 

const { Client } = pg;

const db = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

db.connect()
  .then(() => console.log("✅ Connected to PostgreSQL"))
  .catch(err => console.error("❌ Database error:", err));

export {db}