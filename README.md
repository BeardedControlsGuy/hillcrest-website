# Hillcrest Baptist Church Website

Modern rebuild of [hillcrestbaptist.org](https://hillcrestbaptist.org) — Lebanon, TN.
Static site built with **Astro + Tailwind**, hosted free on **Cloudflare Pages**,
edited by church staff through **Pages CMS**, and tied into **Church Center**
(Planning Center) for giving, registrations, and connection cards.

## ✏️ How to edit the site (church staff)

1. Go to **[app.pagescms.org](https://app.pagescms.org)** and sign in with your email
   (a magic link is sent — no password, no GitHub account needed).
2. Pick what you want to edit from the left menu:
   - **Homepage Announcements** — the banners on the homepage. Toggle "Show on
     homepage" off to retire one. Paste a Church Center registration link into the
     button link to make a Register button.
   - **Featured Events** — big event cards on the Events page.
   - **Worship Times** — service schedule (homepage + footer).
   - **Staff** — add/remove staff, upload photos, edit bios.
   - **Careers** — post open positions.
   - **Site Settings** — phone, email, social links, podcast links, radio text.
3. Click **Save**. The site rebuilds automatically and your change is live in
   about two minutes.

## 🔄 What updates itself

- **Sermons page** — pulls the latest videos from the church YouTube channel
  four times a day. Upload to YouTube and the website follows.
- **Events page** — lists open registrations from Planning Center (requires
  `PCO_APP_ID` / `PCO_SECRET` repo secrets; see below). Register buttons deep-link
  into Church Center, which opens the Church Center app on phones.

## 🧑‍💻 Development

```
npm install
npm run dev        # local dev server
npm run build      # production build to dist/
npm run sync:youtube   # refresh sermon list from YouTube
npm run sync:events    # refresh events from Planning Center (needs PCO_* env)
```

## 🔌 Planning Center events sync (one-time setup)

1. Log in to Planning Center as an admin →
   https://api.planningcenteronline.com/oauth/applications → **New Personal Access Token**.
2. Add the two values as GitHub repo secrets `PCO_APP_ID` and `PCO_SECRET`
   (repo → Settings → Secrets and variables → Actions).
3. The `Content sync` workflow picks them up on its next run. Without them the
   Events page simply shows a "browse in Church Center" button — nothing breaks.

## 🚀 Hosting

Cloudflare Pages, connected to this repo. Build command `npm run build`, output
directory `dist`. Old `.php` URLs are 301-redirected via `public/_redirects`.
