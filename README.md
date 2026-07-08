# Makéda Health — Wellness PWA

React + Vite PWA for Makéda Health — herbal medicine & colon hydrotherapy.

## What's new in this version
- **Client intake form** rebuilt around Makéda's real paper forms (contact & GP details,
  categorised health history with contraindication flags, women's health, bowel/diet,
  consent & signature) — submits straight to a Supabase database instead of the browser
- **Back office** at `/admin` — password-protected staff page to review submissions and
  export everything to CSV
- Indigo / terracotta / cream palette matching Makéda Health's existing brand
- Photo placeholders on Home, About and Contact, ready to swap for real photography

## One-time setup: Supabase (the database)

1. Go to [supabase.com](https://supabase.com), sign up/log in, click **New project**
   (do this under Makéda's own account/organisation, since this will hold real client
   health data — not mixed in with your other projects)
2. Once it's created, open the **SQL Editor** (left sidebar) → **New query**
3. Open `supabase/schema.sql` in this project, copy the whole thing, paste it into the
   SQL editor, and click **Run**. This creates the `intake_submissions` table and locks
   it down so the public website can only ever *add* a submission, never read one back.
4. Go to **Project Settings → API**. You'll need three values from this page in the next step:
   - **Project URL**
   - **anon public** key
   - **service_role** key (this one is secret — never put it in the website code or a
     public repo; it only ever goes into Vercel's environment variables, see below)

## One-time setup: environment variables in Vercel

In your Vercel project → **Settings → Environment Variables**, add:

| Name | Value | Notes |
|---|---|---|
| `VITE_SUPABASE_URL` | Project URL | Public — used by the intake form |
| `VITE_SUPABASE_ANON_KEY` | anon public key | Public — used by the intake form |
| `SUPABASE_URL` | Project URL | Server-only — used by `/api` |
| `SUPABASE_SERVICE_ROLE_KEY` | service_role key | **Secret** — server-only, used by `/api` |
| `ADMIN_PASSWORD` | a password you choose | Gate for the `/admin` back office |

After adding these, redeploy (Vercel → Deployments → ⋯ → Redeploy) so the new build picks
them up.

## Using the back office

Visit `yoursite.vercel.app/admin`, sign in with the `ADMIN_PASSWORD` you set above. From
there you can browse every intake submission (anything with a flagged contraindication is
marked), open one for full detail, or click **Export all to CSV** to download everything
as a spreadsheet.

This page isn't linked from the site's navigation on purpose — bookmark the URL.

## Local development
```
npm install
cp .env.example .env.local   # then fill in the VITE_ values
npm run dev
```

## Deploy (Vercel)
Framework preset auto-detects as Vite — build command `npm run build`, output directory
`dist`. The `/api` folder deploys automatically as serverless functions, no extra config.

## Still to do
- Shop (gut test kits, Stripe)
- Members area with real client login (session notes, ongoing plans)
- Vlog/video content
- Swap AI-generated/placeholder imagery for real photography
- Confirm Makéda's legal surname for the About page (currently just "Makéda")
