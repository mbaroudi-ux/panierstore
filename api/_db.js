const mysql = require("mysql2/promise");

let pool;

function getPool() {
  if (!pool) {
    const url = process.env.DATABASE_URL;
    if (!url) {
      throw new Error("DATABASE_URL is not set");
    }
    pool = mysql.createPool(url);
  }
  return pool;
}

module.exports = { getPool };
