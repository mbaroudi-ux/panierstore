const bcrypt = require("bcryptjs");
const { getPool } = require("./_db");
const querystring = require("querystring");

function readBody(req) {
  return new Promise((resolve) => {
    let data = "";
    req.on("data", (chunk) => {
      data += chunk;
    });
    req.on("end", () => {
      const contentType = req.headers["content-type"] || "";
      if (contentType.includes("application/json")) {
        try {
          resolve(JSON.parse(data || "{}"));
        } catch {
          resolve({});
        }
        return;
      }
      resolve(querystring.parse(data));
    });
  });
}

module.exports = async (req, res) => {
  if (req.method !== "POST") {
    res.writeHead(302, { Location: "/login.html" });
    res.end();
    return;
  }

  const body = req.body || (await readBody(req));
  const { email, password } = body;

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
      res.writeHead(302, { Location: "/index.html" });
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
