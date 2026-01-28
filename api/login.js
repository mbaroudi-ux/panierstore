const bcrypt = require("bcryptjs");
const { getPool } = require("./_db");

module.exports = async (req, res) => {
  if (req.method !== "POST") {
    res.writeHead(302, { Location: "/login.html" });
    res.end();
    return;
  }

  const { email, password } = req.body || {};

  if (!email || !password) {
    res.writeHead(302, { Location: "/login.html" });
    res.end();
    return;
  }

  try {
    const pool = getPool();
    const [rows] = await pool.execute(
      "SELECT password_hash FROM users WHERE email = ? LIMIT 1",
      [email]
    );

    const user = rows && rows[0];
    if (user && (await bcrypt.compare(password, user.password_hash))) {
      res.writeHead(302, { Location: "/index%20.html" });
      res.end();
      return;
    }

    res.writeHead(302, { Location: "/login.html" });
    res.end();
  } catch (error) {
    res.writeHead(302, { Location: "/login.html" });
    res.end();
  }
};
