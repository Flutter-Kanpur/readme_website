# Supabase migrations

Run each SQL file once in the [Supabase SQL editor](https://supabase.com/dashboard) for your project.

| File | Purpose |
|------|---------|
| `migrations/001_follows.sql` | Follow author feature — `follows` table + RLS |

After running `001_follows.sql`, follow/unfollow from article detail and profile pages will persist to the database.

If you still see errors, open **Supabase → Settings → API** and click **Reload schema** so PostgREST picks up the new table.
