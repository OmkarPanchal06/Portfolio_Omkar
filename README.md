# Omkar Panchal — Portfolio

A single-page portfolio built around a **live IoT sensor mesh** — an acid-brutalist
night terminal: stroked display type, hard offset shadows, CRT scanlines, and a
clean, professional developer-focused presentation. The design language is an
instrument panel, because the specialisation is the Internet of Things.

**Stack:** Next.js 16 (App Router) · TypeScript · Tailwind CSS v4 · Canvas 2D

---

## Run it

```bash
npm install
npm run dev      # http://localhost:3000 (hot reload)
npm run build    # production build (type-checks too)
npm run start    # serve the production build
npm run lint     # eslint
```

---

## Where to edit things

Everything about the person is in **one place** — no content is hardcoded inside
components:

| File | Contents |
| --- | --- |
| `src/data/profile.ts` | Name, contact, headline, stats, the three pillars, experience, education, achievements, certifications |
| `src/data/projects.ts` | The six featured projects — descriptions, metrics, stack chips, repo links |
| `src/data/skills.ts` | Skill groups with honest 1–5 confidence levels |
| `src/app/globals.css` | Design tokens (palette, fonts, grid backdrop, reveal animation) |
| `public/resume.pdf` | Downloadable résumé (linked from the nav and footer) |
| `public/images/omkar-profile.webp` | Hero portrait (see below) |

Changing a date or swapping a project is a one-line edit in `src/data/`.

---

## Structure

```
src/
├─ app/
│  ├─ layout.tsx          fonts (self-hosted), metadata, <html data-scroll-behavior>, VisitorTracker
│  ├─ page.tsx            composes the sections (Server Component)
│  ├─ globals.css         @theme tokens + global styles
│  ├─ robots.ts           robots.txt route
│  ├─ sitemap.ts          sitemap.xml route
│  ├─ admin/analytics/    private analytics dashboard
│  └─ api/
│     ├─ analytics/track  POST — record a visit
│     ├─ analytics/stats  GET  — aggregated stats (admin only)
│     ├─ admin/login      POST — admin sign-in
│     └─ admin/logout     POST — admin sign-out
├─ components/
│  ├─ hero/sensor-network.tsx   the signature canvas animation
│  ├─ visitor-tracker.tsx       first-party analytics beacon
│  ├─ nav.tsx                   sticky, scroll-spy, mobile sheet
│  ├─ reveal.tsx                IntersectionObserver entrance
│  ├─ section-head.tsx          giant outlined section index
│  ├─ copy-email.tsx            client micro-interaction
│  ├─ footer.tsx
│  ├─ icons.tsx
│  └─ sections/          hero · pillars · projects · skills · path · contact
├─ data/                 single source of truth for content
├─ fonts/                self-hosted woff2 (Inter, Space Grotesk, JetBrains Mono)
└─ lib/
   ├─ cn.ts · accents.ts
   └─ analytics/         storage.ts · auth.ts
```

### Design tokens

Palette lives in `src/app/globals.css` under `@theme`, with the matching hex
values duplicated once in `src/lib/accents.ts` (used for canvas strokes and blur
blobs). Renaming or recolouring means touching those two files only.

| Token | Value | Role |
| --- | --- | --- |
| `signal` | `#c6ff00` acid lime | primary accent |
| `amber` | `#ff6b1a` | project accent, error tone |
| `violet` | `#ff2e97` | project accent, CTA shadow |
| `rose` | `#00e5ff` | project accent, success tone |

Global utilities in the same file: `.u-outline` (stroked display type),
`.brutal` (hard offset-shadow hover), `.led` (blinking indicator),
`.reveal` (scroll entrance), and a fixed CRT scanline overlay on `body::after`.

---

## The hero animation

`src/components/hero/sensor-network.tsx` draws a 76-node mesh on `<canvas>`:

- deterministic seeded layout (looks designed, not random, on every load)
- nodes drift and push away from the cursor; gateway nodes pulse
- telemetry packets travel along edges as a separate list, so the graph can
  redraw without invalidating in-flight packets
- all edges are batched into **one path and one stroke call**
- DPR capped at 2
- the RAF loop stops when the hero scrolls offscreen **or** the tab is hidden
- `prefers-reduced-motion` renders one static frame instead of animating

The HUD counter is plain DOM text updated via `ref`, so it never triggers a
React re-render.

---

## Profile photo

The hero section references `/images/omkar-profile.webp`. To add your photo:

1. Convert your photo to WebP (e.g. with `cwebp` or any image editor).
2. Place it at `public/images/omkar-profile.webp`.
3. Recommended size: 512×512 or larger, square crop.
4. The image is displayed as a circular portrait with a subtle border and
   shadow that matches the dark theme. It appears above the headline on mobile
   and on the right side of the hero on desktop.

If the file is missing the page will still build (Next.js Image will 404 at
runtime) — the hero simply won't show a portrait.

---

## Visitor analytics (private)

First-party, privacy-conscious analytics. Public visitors never see the data.

### Tracking

`VisitorTracker` (in `layout.tsx`) fires a single `POST /api/analytics/track`
per route change after a 1.5s delay. The server:

- Issues a first-party, httpOnly, `SameSite=Lax` visitor cookie (`op_vid`).
- Deduplicates page views within a 30-minute window per visitor.
- Never stores raw IP addresses or user-agent fingerprints.
- Skips tracking entirely when an admin session cookie is present.

### Dashboard

`/admin/analytics` — protected. Unauthenticated visitors are redirected to a
sign-in form; authenticated non-admins are rejected.

### Admin authentication

Configured via environment variables:

```
ADMIN_USERNAME=admin          # default
ADMIN_PASSWORD=<your password> # required
ADMIN_SESSION_SECRET=<random> # recommended in production (falls back to a dev secret)
```

Sessions are signed HMAC tokens in an httpOnly cookie, verified server-side on
every request. Brute-force attempts are slowed by a 400ms delay.

### Storage

### Storage

Analytics are stored in **Supabase PostgreSQL** (table: `analytics_visits`).

Required environment variables (server-side only):

```
SUPABASE_URL=https://<project-ref>.supabase.co
SUPABASE_SERVICE_ROLE_KEY=<service-role-secret-key>
```

The service-role key bypasses RLS and is used only in server-side API routes.
It must never be exposed to the browser or committed to Git.

### Supabase Setup

1. Create a Supabase project at https://supabase.com
2. Open the SQL Editor and run the contents of `supabase-migration.sql`
3. Copy your project URL and service-role key into `.env.local` (dev) or
   Vercel environment variables (production)
4. The tracking endpoint will automatically write to the `analytics_visits` table

### Schema

```sql
create table if not exists public.analytics_visits (
  id          uuid primary key default gen_random_uuid(),
  visitor_id  text not null,
  path        text not null,
  created_at  timestamptz not null default now(),
  day         date not null
);
```

Indexes: `visitor_id`, `day`, `created_at`, `path`

RLS: enabled with no public policies (only the service role can access).

### Retention

Events older than 90 days are filtered in queries. Use the `cleanup_old_analytics()`
function (in the migration) with pg_cron for automatic cleanup.

---

## Next.js 16 notes

This project runs on Next **16.4.2**, which has breaking changes relative to
v14/15. Things already accounted for:

- **Turbopack is the default bundler** (no `--turbopack` flag; `--webpack` opts out).
- **`new Date()` cannot run at prerender** → `footer.tsx` uses `"use cache"` and
  must be `async`.
- **Smooth anchor scrolling is no longer forced by Next** → `<html>` carries
  `data-scroll-behavior="smooth"`.
- `metadata` only exports from Server Components, which is why `page.tsx` stays a
  server component and every interactive piece is a separate `"use client"` file.
- `next/image`'s `priority` prop is deprecated in v16 (this project uses `priority`
  on the hero portrait and the canvas animation; both are above-the-fold).
- **Cache Components is enabled**, so route handlers must **not** export `runtime`,
  `dynamic`, `revalidate`, `fetchCache` or `dynamicParams`. Dynamic routes force
  request-time reads with `await connection()` from `next/server`.
- **Fonts are self-hosted** via `next/font/local` (woff2 in `src/fonts/`) because
  `next/font/google` fetches from `fonts.gstatic.com` at compile time, which may
  be unreachable in some build environments.
- `AGENTS.md` contains a `<!-- BEGIN:nextjs-agent-files -->` block written by
  `next dev`. Commit it rather than deleting it, or it just reappears.

---

## SEO

- Page title and meta description are set in `layout.tsx`.
- Open Graph and Twitter card metadata are configured.
- `/robots.txt` and `/sitemap.xml` are generated via `src/app/robots.ts` and
  `src/app/sitemap.ts`.
- Heading hierarchy: single `<h1>` in the hero, `<h2>` per section.
- Image alt text: "Omkar Panchal – Developer Profile".

To enable canonical URLs and OG image previews, set `metadataBase` in
`layout.tsx` once the production domain is known.

---

## Security

- No service-role keys or passwords are committed.
- Admin credentials are read from environment variables only.
- Analytics API routes verify the admin session server-side.
- Analytics data is never exposed to unauthenticated users.
- The visitor store file (`data/analytics.json`) is gitignored.
- Input validation on all API routes (name clamping, integer clamping).

---

## Deploy

Push to GitHub, then import into **Vercel** (or any Node host). Set environment
variables:

```
ADMIN_USERNAME=admin
ADMIN_PASSWORD=<your password>
ADMIN_SESSION_SECRET=<long random string>

# For production analytics (Supabase):
SUPABASE_URL=https://<project-ref>.supabase.co
SUPABASE_SERVICE_ROLE_KEY=<service-role-secret-key>
```

Before deploying:
1. Create a Supabase project and run `supabase-migration.sql` in the SQL Editor
2. Set all environment variables in Vercel's project settings
3. Verify the admin dashboard at `/admin/analytics`

Remember to set a custom domain / `metadataBase` once the site has a URL so
Open Graph previews resolve correctly.
