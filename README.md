# Harbor — Client Portal

A client-portal SaaS app (Admin Console + Client Portal) built with Next.js, TypeScript, Tailwind, and Prisma/Postgres. Rebuilt from a single-file HTML/JS prototype — see `HANDOFF.md`-style notes in commit history for the original design intent.

## Local development

```bash
cp .env.example .env        # fill in DATABASE_URL, AUTH_SECRET at minimum
docker compose up -d db     # or point DATABASE_URL at any local Postgres
npm install
npx prisma migrate dev
npx prisma db seed
npm run dev
```

Open http://localhost:3000. Sign in at `/admin/login` with `you@yourfirm.com` / `harbor-demo` (every seeded account uses that password), or `/portal/login` with any client contact's email, same password.

## Deploying to Vercel

1. **Import the repo.** On [vercel.com/new](https://vercel.com/new), import this GitHub repo. Framework preset (Next.js) is auto-detected.
2. **Add a Postgres database.** In the project's **Storage** tab → **Create Database** → **Postgres** (Neon-backed). This sets `DATABASE_URL` automatically for you.
3. **Add a Blob store** (for real file uploads — local disk storage doesn't persist on serverless). **Storage** tab → **Create Database** → **Blob**. This sets `BLOB_READ_WRITE_TOKEN` automatically.
4. **Set environment variables** (Project → Settings → Environment Variables):
   - `AUTH_SECRET` — generate one: `openssl rand -base64 32`
   - `STORAGE_DRIVER` = `vercel-blob`
   - `SUPER_ADMIN_EMAIL` / `SUPER_ADMIN_NAME` / `SUPER_ADMIN_PASSWORD` — optional, seeds a real TEAM (highest-privilege) account on top of the demo data
5. **Deploy.** The build (`npm run build`) runs `prisma generate && prisma migrate deploy && next build` automatically — migrations apply on every deploy, so pushing to `main` keeps the schema in sync.
6. **Seed the database once**, from your own machine, pointed at the production `DATABASE_URL` (copy it from the Vercel dashboard into a local `.env.production` or export it inline):
   ```bash
   DATABASE_URL="<production connection string>" npx prisma db seed
   ```
   Re-running the seed script truncates and recreates all demo data — don't run it again once real client data exists.

### What's still local-only / not wired to a real provider

- OAuth SSO (Google/Microsoft) — Credentials (email/password) login works everywhere; real OAuth needs `GOOGLE_CLIENT_ID`/`MICROSOFT_ENTRA_CLIENT_ID` etc. from your own app registrations.
- Admin's internal Messages tab (team channels) — the Client Portal's message thread is real and wired; the Admin side of it is still a placeholder.
