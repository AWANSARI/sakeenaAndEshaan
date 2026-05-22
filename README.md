# Sakeena & Eshaan — Wedding Invitation

A mobile-friendly, interactive wedding invitation website built with plain HTML, CSS, and JavaScript. No frameworks, no build step.

## What's inside

- `index.html` — content and structure
- `styles.css` — rich & ornate gold-on-jewel-tone theme, mobile-responsive
- `script.js` — live countdown, scroll animations, Add-to-Calendar (.ics), music toggle
- `vercel.json` — deployment config with sane caching headers

## Share links (one per theme)

Each theme has its own URL so you can send the version you want to specific people.
On these URLs the theme switcher is hidden — guests see only that look.

| URL    | Theme                  | Style                              |
| ------ | ---------------------- | ---------------------------------- |
| `/v1`  | Ivory & Gold           | warm cream + antique gold (default)|
| `/v2`  | Blush & Rose           | soft pink + dusty rose             |
| `/v3`  | Sage Garden            | soft green + olive-gold            |
| `/v4`  | Terracotta & Bronze    | warm sand + bronze + rust          |
| `/v5`  | Lavender & Silver      | soft purple + silver-violet        |
| `/v6`  | Royal Burgundy         | deep burgundy + bright gold        |
| `/v7`  | Emerald & Gold         | deep emerald + bright gold         |
| `/v8`  | Plum & Gold            | royal purple + bright gold         |
| `/v9`  | Midnight & Pearl       | deep navy + champagne              |
| `/v10` | Charcoal & Rose Gold   | modern charcoal + rose gold        |

The root URL `/` shows the theme switcher so you (or anyone) can preview all ten.

For local-dev or static-host fallback (no rewrites), `?v=3` and `?theme=sage`
also work.

## Run locally

Just open `index.html` in a browser, or serve it with any static server:

```bash
# Python 3
python3 -m http.server 8000

# Node
npx serve .
```

Then open <http://localhost:8000>.

## Deploy to Vercel

```bash
# install once
npm i -g vercel

# from this folder
vercel        # follow prompts for first deploy
vercel --prod # deploy to production
```

Or push to GitHub and "Import Project" on vercel.com — Vercel auto-detects this as a static site.

## What still needs your input

These are easy to change directly in `index.html`:

1. **Groom's parents' names** — currently `Mr. & Mrs. Arif Syed` (placeholder). Search for that line and replace.
2. **Nikah venue** — currently `[Masjid Name]` with "details to follow". Search for that block and replace.
3. **Map directions** — the "Get Directions" button currently searches Google Maps for "Kohinoor Banquet Hall". For the exact venue, replace the URL with a specific address or place URL.
4. **Background music** — drop an `.mp3` file at `music.mp3` in this folder. If no file is present, the music button hides itself automatically.

## What you can tweak

- **Colors** — edit the CSS custom properties at the top of `styles.css` (`--gold`, `--bg-maroon`, etc.).
- **Wedding date/time** — change the `WEDDING` constant at the top of `script.js`. The same date drives the countdown and the calendar export.
- **Couple photo** — drop an image in the hero section if you want one; the current design is fully text-based with decorative SVG ornaments.
