# spacebowls.at

Static copy of [www.spacebowls.at](https://www.spacebowls.at/), moved off Joomla/YOOtheme.
Plain HTML + the original YOOtheme/UIkit CSS and JS, no build step. Hosted on Cloudflare Pages.

```
*.html            one file per page (URL /bowls -> bowls.html), 404.html
assets/css        theme.css (compiled YOOtheme theme), custom.css
assets/js         uikit, uikit-icons, theme.js, map-leaflet.js, form.js (contact form)
assets/fonts      Barlow / Barlow Condensed (self-hosted, OFL)
assets/vendor     leaflet (map on the home page)
images/           logos, icons, menu PDF; images/slideshow = responsive WebP photos
_headers          cache headers (Cloudflare Pages)
_redirects        old Joomla URLs
scripts/images.mjs  creates WebP sizes for new slideshow photos
```

## Run locally

Requires Node.js 18+.

```bash
npm install
npm start
```

Open http://localhost:3000. Clean URLs (`/bowls`) work the same as in production.

## Deploy (Cloudflare Pages)

One-time setup, ~5 minutes:

1. Create a free account at https://dash.cloudflare.com.
2. **Workers & Pages → Create → Pages → Connect to Git**, pick the GitHub repo `dmytro-mz/spacebowls`.
3. Build settings: Framework preset **None**, build command **empty**, output directory **`/`**. Save and deploy.
4. The site is live at `https://spacebowls.pages.dev` (or the name Cloudflare shows).

After that every `git push` to `main` deploys automatically (~30 s). Branches get preview URLs.

## Contact form

The footer form posts to [Web3Forms](https://web3forms.com), which emails the message to `eat@spacebowls.at`.

1. On https://web3forms.com enter `eat@spacebowls.at` → you receive an access key by email.
2. Put the key into `WEB3FORMS_ACCESS_KEY` in `assets/js/form.js`, commit, push.

The key is public by design (it can only send to that address). Free plan: 250 submissions/month.

## DNS (when switching spacebowls.at to the new site)

Today DNS, web hosting and mail are all at World4You. Mail (`eat@`, `tom@`) stays at World4You — only the web part moves.

Recommended: move DNS to Cloudflare (free; needed for the bare domain `spacebowls.at` on Pages).

1. Cloudflare dashboard → **Add a domain** → `spacebowls.at` → Free plan. Cloudflare imports existing records.
2. Compare with the World4You DNS panel and make sure these exist in Cloudflare (mail records **DNS only**, grey cloud):

   | Type | Name | Value |
   |---|---|---|
   | MX | `spacebowls.at` | `mail.spacebowls.at` (priority 10) |
   | A | `mail` | `81.19.149.36` |
   | TXT | `spacebowls.at` | `v=spf1 mx include:spf.w4ymail.at -all` |
   | TXT | `_dmarc` | `v=DMARC1;p=none;` |

   Plus anything else shown in World4You (DKIM, autoconfig, …).
3. World4You customer area → domain → change nameservers to the two Cloudflare nameservers. Propagation: 1–24 h.
4. Cloudflare Pages project → **Custom domains** → add `www.spacebowls.at` and `spacebowls.at`.
5. Cloudflare → **Rules → Redirect Rules** → redirect `spacebowls.at/*` to `https://www.spacebowls.at/${1}` (301), the canonical address stays `www`.
6. Check the site and send a test mail to/from `eat@spacebowls.at`. Then the World4You web hosting can be downgraded to a domain + mail package.

Alternative without moving DNS: in World4You set `www` as CNAME to `spacebowls.pages.dev` and redirect the bare domain to `www` in World4You. Works, but depends on World4You supporting the apex redirect.

Before going live, update the **Datenschutzerklärung** (`datenschutzerklaerung.html`): hosting is Cloudflare instead of World4You, and the contact form is processed by Web3Forms.

## Editing content

- Prices and dishes: edit the page, e.g. `bowls.html`, search for the dish name.
- New slideshow photo: `npm run images -- ~/Desktop/photo.jpg`, then copy one `<div class="el-item">…</div>` slide block in the page, change the file names, and add one `<li uk-slideshow-item="N">` dot below it.
- Menu PDF: replace `images/Spacebowls_Speisekarte 2 3.pdf` (keep the name or update the link in `index.html`).

## Costs per month

| Item | Cost |
|---|---|
| Cloudflare Pages (hosting, CDN, SSL, unlimited traffic) | €0 |
| Cloudflare DNS | €0 |
| Web3Forms (contact form, ≤250 messages/month) | €0 |
| Domain `spacebowls.at` + mailboxes at World4You (existing contract) | unchanged, ~€2–5 |
| **Website total** | **€0** |
