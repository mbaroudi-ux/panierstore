const { createClient } = require("@supabase/supabase-js");

let client;

function getSupabase() {
  if (!client) {
    const url = process.env.SUPABASE_URL;
    const anonKey = process.env.SUPABASE_ANON_KEY;
    if (!url || !anonKey) {
      throw new Error("SUPABASE_URL or SUPABASE_ANON_KEY is not set");
    }
    client = createClient(url, anonKey);
  }
  return client;
}

module.exports = { getSupabase };
