# Supabase migrations

Run each SQL file once in the [Supabase SQL editor](https://supabase.com/dashboard) for your project. Paste the **SQL contents** of each file (not the file path).

| File | Purpose |
|------|---------|
| `migrations/001_follows.sql` | Follow author — `follows` table + RLS |
| `migrations/002_communities.sql` | Communities, members, `blogs.community_id`, `blog_coauthors`, seed Flutter Kanpur |
| `migrations/003_community_self_join.sql` | ~~Self-join~~ superseded by `006` — do not run if using join requests |
| `migrations/004_blog_covers_bucket.sql` | `blog-covers` storage bucket + upload policies |
| `migrations/005_blog_covers_size_limit.sql` | Raise cover bucket size limit to 10 MB |
| `migrations/006_community_join_requests.sql` | Admin-approved join requests (replaces self-join) |
| `migrations/007_community_logos_bucket.sql` | `community-logos` storage bucket for community icons |

After each migration: **Settings → API → Reload schema**.

## Communities seed

`002_communities.sql` creates **Flutter Kanpur** (`/communities/flutter-kanpur`) and adds the earliest profile as admin.

**Join flow:** Users submit a join request from the community dashboard. Admins approve or reject in the **Requests** tab (contributor or editor role). Run `006_community_join_requests.sql` to enable this (it also removes instant self-join from `003`).
