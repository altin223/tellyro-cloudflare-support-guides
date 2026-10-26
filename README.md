# Tellyro website

Static marketing site for Tellyro (live TV, movies & series), built for Cloudflare Pages. Plain HTML/CSS/JS, so there's no build step.

## Pages

| File | Purpose |
| --- | --- |
| `index.html` | Home: features, pricing, trial form, devices, support, FAQ |
| `installation.html` | Device-by-device installation guides |
| `client.html` | Client Area ("coming soon") |
| `privacy.html`, `terms.html` | Legal pages |

Assets live in `assets/`: `i18n.js` and `legal.js` hold the translations (EN/DE/TR/FR/ES/IT), `help-data.js` holds the installation guide content, and `config.js` holds the public config.

## Run locally

```powershell
powershell -ExecutionPolicy Bypass -File .\serve.ps1
```

Then open http://localhost:8080/ (use `-Port 3000` to change the port). The site has to be served over HTTP. Opening the files directly with `file://` breaks links that start with `/`, such as the ones on `installation.html`.

## Configuration

`assets/config.js` holds public values only:

- `supabaseUrl`, `supabaseAnonKey`, `turnstileSiteKey`: until these are set, the trial form falls back to sending the request through WhatsApp or Telegram. **Never put a Supabase `service_role` key here.**
- `whatsapp`, `telegram`: support links.

Prices, reviews, claims and devices are in the `CFG` object near the top of `index.html`.

## Deploy (Cloudflare Pages)

Connect this repository in Cloudflare Pages with:

- Framework preset: **None**
- Build command: *(empty)*
- Build output directory: `/`

The `_headers` file applies the security headers (CSP and others) on Cloudflare.
