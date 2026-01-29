const { getSupabase } = require("./_db");
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
    res.writeHead(302, { Location: "/try-for-free.html" });
    res.end();
    return;
  }

  if (!process.env.SUPABASE_URL || !process.env.SUPABASE_ANON_KEY) {
    res.writeHead(302, { Location: "/try-for-free.html?error=config" });
    res.end();
    return;
  }

  const body = req.body || (await readBody(req));
  const { full_name, email, store_name, password } = body;

  if (!full_name || !email || !store_name || !password) {
    res.writeHead(302, { Location: "/try-for-free.html?error=missing" });
    res.end();
    return;
  }

  try {
    const supabase = getSupabase();
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name,
          store_name
        }
      }
    });

    if (error) {
      const reason = encodeURIComponent(error.message || "signup_failed");
      res.writeHead(302, { Location: `/try-for-free.html?error=signup&reason=${reason}` });
      res.end();
      return;
    }

    res.writeHead(302, { Location: "/index.html" });
    res.end();
  } catch (error) {
    res.writeHead(302, { Location: "/try-for-free.html?error=server" });
    res.end();
  }
};
