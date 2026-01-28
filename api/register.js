const bcrypt = require("bcryptjs");
const { getPool } = require("./_db");

module.exports = async (req, res) => {
  if (req.method !== "POST") {
    res.writeHead(302, { Location: "/try-for-free.html" });
    res.end();
    return;
  }

  const { full_name, email, store_name, password } = req.body || {};

  if (!full_name || !email || !store_name || !password) {
    res.writeHead(302, { Location: "/try-for-free.html" });
    res.end();
    return;
  }

  try {
    const password_hash = await bcrypt.hash(password, 10);
    const pool = getPool();
    await pool.execute(
      "INSERT INTO users (full_name, email, store_name, password_hash) VALUES (?, ?, ?, ?)",
      [full_name, email, store_name, password_hash]
    );
    res.writeHead(302, { Location: "/index.html" });
    res.end();
  } catch (error) {
    res.writeHead(302, { Location: "/try-for-free.html" });
    res.end();
  }
};
