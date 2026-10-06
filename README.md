# spacebowls.at

Static copy of [www.spacebowls.at](https://www.spacebowls.at/), moved off Joomla/YOOtheme.
Plain HTML + the original YOOtheme/UIkit CSS and JS, no build step. Hosted on Cloudflare Workers (static assets).

```
public/                  everything that is deployed
  *.html                 one file per page (URL /bowls -> bowls.html), 404.html
  assets/css             theme.css (compiled YOOtheme theme), custom.css
  assets/js              uikit, uikit-icons, theme.js, map-leaflet.js, form.js (contact form)
  assets/fonts           Barlow / Barlow Condensed (self-hosted, OFL)
  assets/vendor          leaflet (map on the home page)
  images/                logos, icons, menu PDF; images/slideshow = responsive WebP photos
  _headers               cache headers
  _redirects             old Joomla URLs
wrangler.jsonc           Cloudflare config: serve ./public as static site
scripts/images.mjs       creates WebP sizes for new slideshow photos
```

## Run locally

Requires Node.js 18+.

```bash
npm install
npm start
```

Open http://localhost:3000. Clean URLs (`/bowls`) work the same as in production.

## Deploy (Cloudflare Workers)

One-time setup, ~5 minutes:

1. Create a free account at https://dash.cloudflare.com.
2. **Workers & Pages → Create → Import a repository**, pick the GitHub repo `dmytro-mz/spacebowls`.
3. Settings: project name `spacebowls`, build command **empty**, deploy command `npx wrangler deploy`,
   preview command `npx wrangler preview`, preview builds on, Cloudflare Access off. Deploy.
4. The site is live at `https://spacebowls.<your-account>.workers.dev`.

After that every `git push` to `main` deploys automatically (~30 s). Other branches get preview URLs.
All settings live in `wrangler.jsonc`; only `public/` is uploaded.

## Contact form

The footer form posts to [Web3Forms](https://web3forms.com), which emails the message to `eat@spacebowls.at`.

1. On https://web3forms.com enter `eat@spacebowls.at` → you receive an access key by email.
2. Put the key into `WEB3FORMS_ACCESS_KEY` in `public/assets/js/form.js`, commit, push.

The key is public by design (it can only send to that address). Free plan: 250 submissions/month.

## Domain

The old site and `spacebowls.at` are managed by the former developer, nobody has the login.
First try to get the domain back (keeps Google ranking, printed menus, links on Google Maps/Lieferando/Wolt
and the mailboxes `eat@` / `tom@`). If that fails, register a new domain.

In both cases DNS has to be on Cloudflare (free): custom domains on Workers only work for domains whose DNS is on Cloudflare.

### Option A: recover spacebowls.at

The legal owner of an `.at` domain is the **holder** (Domaininhaber) registered at nic.at, not the person who built the site.

1. Find the holder: https://www.nic.at/de/whois → `spacebowls.at`. Personal data is hidden; if nothing useful is shown,
   ask nic.at (https://www.nic.at/de/kontakt) who the holder is, as spacebowls GmbH.
2. If the holder is **spacebowls GmbH**: the domain is with World4You (`ns1.world4you.at`). Contact World4You support:
   the company is the domain holder, the account admin left, and you want access to the customer account or a
   provider change (Providerwechsel) to your own new account. Send a current Firmenbuchauszug and an ID of the managing director.
3. If the holder is the **developer personally**: nic.at cannot hand it over without them. Options are a written request
   to the developer or a claim based on company name rights (§ 43 ABGB) — talk to a lawyer.
4. Meanwhile watch the domain: if nobody pays the renewal it expires and is released after a quarantine period.
5. Once you control the domain, move DNS to Cloudflare without breaking mail:

   1. Cloudflare dashboard → **Add a domain** → `spacebowls.at` → Free plan. Cloudflare imports existing records.
   2. Make sure these mail records exist in Cloudflare (**DNS only**, grey cloud), plus anything else in the World4You DNS panel:

      | Type | Name | Value |
      |---|---|---|
      | MX | `spacebowls.at` | `mail.spacebowls.at` (priority 10) |
      | A | `mail` | `81.19.149.36` |
      | TXT | `spacebowls.at` | `v=spf1 mx include:spf.w4ymail.at -all` |
      | TXT | `_dmarc` | `v=DMARC1;p=none;` |

   3. World4You → domain → change nameservers to the two Cloudflare nameservers. Propagation: 1–24 h.
   4. Connect the domain to the site (see "Connect a domain" below).
   5. Send a test mail to/from `eat@spacebowls.at`. Then the World4You web hosting (Joomla) can be cancelled; keep domain + mail.

### Option B: new domain (e.g. space-bowls.at)

`space-bowls.at` looked unregistered on 2026-10-06; check availability at the registrar.

1. Register it at an Austrian registrar (World4You, easyname, …), ~€10–20/year. Cloudflare itself does not sell `.at`.
2. Cloudflare dashboard → **Add a domain** → `space-bowls.at` → Free plan → set the two Cloudflare nameservers at the registrar.
3. Connect the domain to the site (see below).
4. Replace the old domain in the canonical links (one line per page):

   ```bash
   grep -rl "https://www.spacebowls.at/" public | xargs sed -i '' 's#https://www.spacebowls.at/#https://www.space-bowls.at/#g'
   ```

5. Email: `eat@spacebowls.at` keeps working only as long as the old domain does. For a new address, either use
   Cloudflare **Email Routing** (free, forwards e.g. `eat@space-bowls.at` to an existing inbox, receive only) or a mailbox
   package at the registrar (~€1–3/month). Then replace `eat@spacebowls.at` in `public/*.html` (header mail icon),
   create a new Web3Forms key for the new address (see "Contact form"), and update the Impressum/Datenschutz addresses.
6. Update the website link on Google Maps (Google Business Profile), Instagram, Facebook, Lieferando, Wolt and printed menus.

### Connect a domain

1. Workers & Pages → `spacebowls` → **Settings → Domains & Routes → Add → Custom domain** → add `www.<domain>` and `<domain>`.
   Cloudflare creates the DNS records and SSL certificates.
2. Cloudflare → `<domain>` → **Rules → Redirect Rules** → redirect `<domain>/*` to `https://www.<domain>/${1}` (301), so the address is always `www`.

Before going live, update the **Datenschutzerklärung** (`public/datenschutzerklaerung.html`): hosting is Cloudflare instead of World4You, and the contact form is processed by Web3Forms.

## Editing content

- Prices and dishes: edit the page, e.g. `public/bowls.html`, search for the dish name.
- New slideshow photo: `npm run images -- ~/Desktop/photo.jpg`, then copy one `<div class="el-item">…</div>` slide block in the page, change the file names, and add one `<li uk-slideshow-item="N">` dot below it.
- Menu PDF: replace `public/images/Spacebowls_Speisekarte 2 3.pdf` (keep the name or update the link in `public/index.html`).

## Costs per month

| Item | Cost |
|---|---|
| Cloudflare Workers Free (static assets: hosting, CDN, SSL, unlimited requests) | €0 |
| Cloudflare DNS | €0 |
| Web3Forms (contact form, ≤250 messages/month) | €0 |
| Domain: recovered `spacebowls.at` (World4You) or new `.at` domain | ~€1–2 |
| Email: Cloudflare Email Routing (forwarding) / mailbox package | €0 / ~€1–3 |
| **Total** | **~€1–5** |
