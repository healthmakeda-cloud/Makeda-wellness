# Makeda — Wellness PWA (foundation build)

React + Vite PWA foundation for Makeda Hemans' herbal medicine & colon hydrotherapy practice.

## What's in this phase
- Home, About, Services, Contact — content scaffolded from makedah.com, marked with
  `[Replace with...]` placeholders wherever real copy/testimonials/consent text needs to be dropped in
- Client intake — 3-step form (health history → hydrotherapy consent & contraindications → review/submit)
- Members and Vlog — quiet "opening soon" placeholders, nav-ready for the next build phase
- PWA manifest + service worker + icons (installable on iOS/Android/desktop)
- Logo mark (root/branch monoline, forms an "M") used as favicon, app icon, and in nav/footer

## ⚠️ Before this collects real client data
The intake form currently saves submissions to **localStorage** (client's own browser) so the flow can
be demoed end-to-end. That is **not sufficient for real health data** — under UK GDPR, health history and
consent forms are "special category data" and need:
- A real backend (Supabase, matching your other projects, works well here) with encryption at rest
- Access controls so only Makeda/authorised staff can read submissions
- A proper privacy notice and data retention policy on the form itself

Swap the `localStorage` calls in `src/pages/ClientIntake.jsx` (`handleSubmit`) for a Supabase insert once
that's wired up — the form state shape is already flat and ready to map to a table.

## Local development
```
npm install
npm run dev
```

## Deploy (Vercel, under soulart2024-ship-it)
1. Create a new repo, e.g. `soulart2024-ship-it/makeda-wellness`
2. `git init && git add . && git commit -m "Foundation build" && git remote add origin <repo-url> && git push -u origin main`
3. Import the repo in Vercel — framework preset auto-detects as Vite, no config needed
   (build command `npm run build`, output directory `dist`)
4. Add a custom domain once ready

## Next build phases
- Shop (gut test kits, Stripe — same pattern as Heather & Rose / SoulArt Temple)
- Members area with real auth + tiers
- Vlog/video content system
- Swap AI-generated imagery for Makeda's real photography as it comes in
