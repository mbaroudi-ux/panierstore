# Supabase (gratuit) – Configuration rapide

1) Crée un projet sur https://supabase.com
2) Dans Project Settings → API, récupère :
   - SUPABASE_URL
   - SUPABASE_ANON_KEY
3) Dans Vercel → Project → Settings → Environment Variables :
   - SUPABASE_URL
   - SUPABASE_ANON_KEY
4) Redeploy le projet.

## Test
- Essaye Try for free pour créer un compte.
- Puis Log in avec les mêmes identifiants.

Les données `full_name` et `store_name` sont stockées dans `user_metadata` Supabase.
