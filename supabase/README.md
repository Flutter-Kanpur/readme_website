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
| `migrations/008_community_newsletters.sql` | Monthly community newsletters + opt-in subscribers |
| `migrations/009_community_newsletter_uploads.sql` | Newsletter file attachments + `community-newsletters` storage bucket |
| `migrations/010_community_followers.sql` | Community follow — `community_followers` table + RLS |

After each migration: **Settings → API → Reload schema**.

## Communities seed

`002_communities.sql` creates **Flutter Kanpur** (`/communities/flutter-kanpur`) and adds the earliest profile as admin.

**Join flow:** Users submit a join request from the community dashboard. Admins approve or reject in the **Requests** tab (contributor or editor role). Run `006_community_join_requests.sql` to enable this (it also removes instant self-join from `003`).

## Newsletters

`008_community_newsletters.sql` adds two tables:

- `community_newsletters` — issues written by an admin or editor of the community. Public read; insert/update gated to admins/editors of the community via RLS.
- `community_newsletter_subscribers` — opt-in list. Signed-in users link via `user_id`; guests can subscribe with email only (`user_id` null). One row per `(community_id, email)`.

The community detail page (`/communities/[slug]`) shows a **Subscribe** card and an archive of past issues. Admins/editors get a **Newsletter** tab in the community dashboard to compose new issues and see the subscriber count.

`009_community_newsletter_uploads.sql` adds three optional columns to `community_newsletters` (`file_url`, `file_name`, `file_size_bytes`) plus a `community-newsletters` public storage bucket. From the dashboard, admins/editors can attach a **PDF / PNG / JPEG up to 20 MB**; uploads land at `community-newsletters/{community_id}/...` and are gated to admins/editors via storage RLS. The newsletter detail page renders a download button and an inline PDF preview when the attachment is a PDF. The migration also relaxes `body` to be nullable, with a check constraint that requires either a body or a file — so a community can publish a single PDF as the entire issue, no typed text needed.

No external email provider is wired up yet — newsletters live as a public in-app archive. To send real emails, hook a Supabase Edge Function or a Resend cron job to read new rows from `community_newsletters` and the matching `community_newsletter_subscribers`.
