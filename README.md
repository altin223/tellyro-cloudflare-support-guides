# Tellyro website

Static marketing site for Tellyro (live TV, movies & series), built for Cloudflare Pages. Plain HTML/CSS/JS, so there's no build step.

## Pages

| File | Purpose |
| --- | --- |
| `index.html` | Home: features, pricing, trial form, devices, support, FAQ |
| `installation.html` | Device-by-device installation guides |
| `order.html` | Purchase / renewal request page, opened from **Choose Plan** and **Renew your plan** in Pricing (`?type=purchase\|renewal&devices=&months=`). It saves a request through the backend's `purchase-request` function; it never takes a payment. |
| `client.html` | Client Area ("coming soon") |
| `privacy.html`, `terms.html` | Legal pages |

Assets live in `assets/`: `i18n.js` and `legal.js` hold the translations (EN/DE/TR/FR/ES/IT), `help-data.js` holds the installation guide content, and `config.js` holds the public config. Photos are in `assets/img/` (responsive WebP); sources and licence notes are in [`assets/img/CREDITS.md`](assets/img/CREDITS.md).

## Installation guide sources

Each app, link and code in `help-data.js` was checked in October 2026 against these official sources. Re-check them before changing a guide.

| Guide | App | Official source |
| --- | --- | --- |
| Fire TV, Android TV | TiviMate (Armobsoft FZE) | [tivimate.com](https://tivimate.com/) publishes Downloader code `272483` and `tivimate.com/apk`. Also on [Google Play](https://play.google.com/store/apps/details?id=ar.tvplayer.tv). |
| Fire TV, Android TV | Downloader (AFTVnews) | [Amazon Appstore](https://www.amazon.com/dp/B01N0BP507), [Google Play](https://play.google.com/store/apps/details?id=com.esaba.downloader). Fire TV menu path from [Amazon's developer docs](https://developer.amazon.com/docs/fire-tv/connecting-adb-to-device.html). |
| Smart TV | BOB Player | [bobplayer.com](https://bobplayer.com/): Samsung, LG webOS and Sony are listed as compatible, playlists are managed with MAC address and Device Key, and there is a 7-day trial. |
| Android phone / tablet | Smarters Pro - Mobile (Tech Smarters) | [Google Play](https://play.google.com/store/apps/details?id=com.smarters.smarterspro), [smarterspro.com](https://www.smarterspro.com/). TiviMate's own listing says it is not optimised for phones or tablets. |
| iPhone / iPad | Smarters Player Lite (WHMCS SMARTERS) | [App Store](https://apps.apple.com/app/smarters-player-lite/id1628995509) |
| Windows | MyIPTV Player (Vbfnet Apps) | [Microsoft Store](https://apps.microsoft.com/detail/9PJJ2NMBF0TR): free, with Xtream Code support |

## Run locally

```powershell
powershell -ExecutionPolicy Bypass -File .\serve.ps1
```

Then open http://localhost:8080/ (use `-Port 3000` to change the port). The site has to be served over HTTP. Opening the files directly with `file://` breaks links that start with `/`, such as the ones on `installation.html`.

## Configuration

`assets/config.js` holds public values only:

- `supabaseUrl`, `supabaseAnonKey`, `turnstileSiteKey`: until these are set, the trial form falls back to sending the request through WhatsApp or Telegram. **Never put a Supabase `service_role` key here.**
- `whatsapp`, `telegram`: support links.

Plan prices are in `assets/plans.js` (used by the pricing section and `order.html`; keep them in sync with the backend's `plans` table, which sets the price that is actually saved). Reviews, claims and devices are in the `CFG` object near the top of `index.html`.

## Deploy (Cloudflare Pages)

Connect this repository in Cloudflare Pages with:

- Framework preset: **None**
- Build command: *(empty)*
- Build output directory: `/`

The `_headers` file applies the security headers (CSP and others) on Cloudflare.
