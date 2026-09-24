# Contributing to ReadME Website

ReadME is a community blogging platform built with Next.js. This is the web app — the place where communities share their journey and help others learn from it.

## Before you start

- **Stack**: Next.js 14, React, Tailwind CSS, Supabase (auth + database)
- **Node version**: 18 or newer (`node --version`)
- **Package manager**: npm

## Set up locally

```bash
git clone https://github.com/Flutter-Kanpur/readme_website.git
cd readme_website
npm install
cp .env.example .env.local   # fill in your Supabase keys
npm run dev
```

Open `http://localhost:3000`. The app hot-reloads as you edit files.

If you don't have Supabase keys, ask in the Flutter Kanpur WhatsApp group or open an issue — a maintainer will share test credentials.

## Project structure

```
app/              → Next.js App Router pages
  articles/       → article detail page
  communities/    → community listing and detail
  write/          → article editor
  auth/           → login / register / reset
components/       → shared UI components
app/lib/          → Supabase client, helpers
app/hooks/        → custom React hooks
public/           → static assets
```

## What to pick up

Look for issues labelled **`good first issue`** on GitHub. Good areas to start:

- **UI fixes** — spacing, responsiveness, dark mode inconsistencies
- **Component improvements** — the article editor, community cards, profile page
- **New pages** — help centre, tags page, writers directory
- **Performance** — image optimisation, loading states, skeleton screens
- **Accessibility** — keyboard navigation, ARIA labels, colour contrast

## How to contribute

1. **Star the repo** — [github.com/Flutter-Kanpur/readme_website](https://github.com/Flutter-Kanpur/readme_website) — it helps others find the project
2. **Fork it** — click Fork on GitHub, then clone your fork locally
3. **Pick an issue** — comment on it so others know you're working on it
4. **Create a branch** — branch name: `fix/issue-title` or `feat/feature-name`
5. **Make your change** — keep it focused; one issue per PR
6. **Test it** — run the app locally, check mobile and desktop
7. **Open a PR** — describe what you changed and why, link the issue

```bash
# After forking on GitHub:
git clone https://github.com/<your-username>/readme_website.git
cd readme_website
git checkout -b fix/your-issue-title
# make changes
git commit -m "fix: short description"
git push origin fix/your-issue-title
# open PR on GitHub against Flutter-Kanpur/readme_website
```

## Code style

- Components go in `components/` if used in more than one place
- Use Tailwind classes — avoid inline styles
- Keep components small and focused
- No unused imports or console.log in PRs

## Need help?

Drop a message in the Flutter Kanpur WhatsApp group or comment on the issue. No question is too small.
