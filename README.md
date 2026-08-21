# plum.co.uk & plum.uk — for-sale landing page

This page now advertises **both** domains, `plum.co.uk` and `plum.uk`, for sale together or separately. GitHub Pages only lets one repo serve one custom domain, so see **§1a** below for how to get both domains pointing at this content.

## Files
- `index.html` — the page
- `styles.css` / `script.js` — same-origin only, no third-party requests
- `favicon.svg`
- `CNAME` — tells GitHub Pages which custom domain to serve (see §1a for the second domain)

## 1. Push to GitHub Pages
1. Create a repo (e.g. `plum-site`), commit these files to the default branch.
2. Repo → **Settings → Pages** → Source: deploy from branch → `main` / root.
3. Under **Settings → Pages**, tick **Enforce HTTPS** once it's available (GitHub issues a free cert automatically — can take up to ~24h after DNS is pointed).

## 1a. Covering the second domain (plum.uk)

A single GitHub Pages site can only have **one** custom domain in its `CNAME` file, so `plum.co.uk` and `plum.uk` can't both be set as the "Custom domain" on the same repo. Pick one:

**Option A — redirect plum.uk to plum.co.uk (simplest, recommended)**
Keep this repo/site as the one canonical site (`plum.co.uk`, or `www.plum.co.uk` per §2), and make `plum.uk` forward to it:
- If DNS for plum.uk is also at Squarespace, use its built-in **domain forwarding** feature to 301-redirect `plum.uk` → `https://plum.co.uk`.
- Or move `plum.uk`'s nameservers to Cloudflare (free tier) and add a **Redirect Rule** doing the same.
Either way, one page, one place to update, and both domains land visitors on it.

**Option B — serve identical content on both, independently**
Duplicate this repo (e.g. `plum-site-uk`), set its Pages custom domain to `plum.uk`, and point plum.uk's DNS at GitHub Pages the same way as §2 below (same four A records for the apex, or a CNAME for `www`). You'll then be maintaining two copies of the same files — remember to mirror any future edits across both repos.

## 2. Point plum.co.uk (DNS is at Squarespace)
The `CNAME` file in this repo is set to `www.plum.co.uk`. Recommended setup — `www` as the primary, apex redirects to it. (This is the canonical site; see §1a for how `plum.uk` is handled.)

In Squarespace DNS settings for plum.co.uk, add:

| Type  | Host | Value                  |
|-------|------|------------------------|
| CNAME | www  | `<your-username>.github.io.` |
| A     | @    | 185.199.108.153        |
| A     | @    | 185.199.109.153        |
| A     | @    | 185.199.110.153        |
| A     | @    | 185.199.111.153        |

(Those four A records are GitHub Pages' current apex IPs — double-check they haven't changed at https://docs.github.com/pages before adding.)

Then in the repo's **Settings → Pages → Custom domain**, enter `www.plum.co.uk` and save (this writes the CNAME file for you if you'd rather not commit it manually).

If you'd prefer the apex (`plum.co.uk`) as primary instead of `www`, swap the CNAME file's contents to `plum.co.uk` and add a CNAME record for `www` pointing at `plum.co.uk` instead.

## 3. About the security headers

The page's `<meta http-equiv>` tags set a strict Content-Security-Policy, `X-Content-Type-Options`, and a referrer policy — that covers what's possible from inside the HTML.

**GitHub Pages doesn't let you set real HTTP response headers** (no `_headers` file support, no server config access), so a few headers that only work as true HTTP headers — `Strict-Transport-Security`, `X-Frame-Options`, `Permissions-Policy` — can't be added this way. In practice, for a single static page with a mailto link and no forms, no login, and no embeds, the exposure this leaves is minimal — but if you want those headers too, the straightforward fix is to proxy the domain through **Cloudflare** (free tier):

1. Move DNS management for plum.co.uk to Cloudflare (or just add the domain there and update nameservers at Squarespace).
2. Keep the same records pointing at GitHub Pages, but set them to "Proxied" (orange cloud).
3. Add a **Transform Rule** (or a small Worker) that appends the extra headers to every response.

That gets you HSTS, frame-blocking, and permissions-policy at the edge without changing anything in this repo.

## 4. Contact address
The page links to `domain@plum.co.uk`. Make sure that mailbox exists (or forwards somewhere you check) before publishing — Squarespace's domain product includes email forwarding you can set up from the same DNS panel. Since it's on the `.co.uk` domain, it'll keep working even after `plum.uk` is set to redirect (Option A above) or torn down.
