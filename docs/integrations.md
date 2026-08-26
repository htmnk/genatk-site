# Deferred integrations

The repository is intentionally usable without credentials. The default mode for
each external integration is a local fixture so all automation paths can be
tested before launch.

## Search Console

The site already has a verified Domain property. To enable the live, read-only
sync, create a Google OAuth client and grant only
`https://www.googleapis.com/auth/webmasters.readonly`. Store these GitHub
Actions secrets (never repository files): `GSC_CLIENT_ID`,
`GSC_CLIENT_SECRET`, and `GSC_REFRESH_TOKEN`. Add a repository variable
`GSC_PROPERTY` with the exact Domain-property value `sc-domain:genatk.com`.

To generate the refresh token, create a **Desktop app** OAuth client, set its
ID and secret only in your local shell, then run `npm run seo:gsc-authorize`.
It opens a Google consent URL on a loopback callback and writes the resulting
refresh token to the ignored local `.gsc-refresh-token` file. Do not paste that
token into chat or commit it; copy it directly into the GitHub Actions secret.

`tools/seo/gsc-sync.mjs` uses `GSC_MODE=auto` in scheduled jobs. Until all three
secrets exist it writes an explicit `unconfigured` report with zero rows; it
does not substitute fake fixture data. Once authorized, it reads finalized web
query/page data for the previous 28 days. Query finalized data by page and
query; do not infer daily strategy from preliminary data.

## Topic radar

`npm run seo:topic-radar` has a safe fixture mode locally. The scheduled GitHub
Actions job sets `TOPIC_RADAR_MODE=live` and reads only the public Game
Development Stack Exchange API. It writes a ranked report to
the job workspace and log; it cannot modify the site, content ledger, briefs,
or drafts. GitHub-hosted schedules are best-effort rather than a precise 24/7
daemon, so this is a daily collector, not an autonomous publishing agent.

The collector creates candidate packets from cited developer questions. It does
not provide keyword volume, commercial difficulty, or permission to publish.
Those decisions require Search Console data, a research brief, original
evidence, and human approval.

## Research director

The weekly director runs the GSC sync, topic radar, and
`npm run seo:research-director`. It produces only private scored packets with
the underlying source rows and primary-source register entries. It does not
call an AI model or create content. If the optional `OPENAI_API_KEY` Actions
secret is set, the next step runs `seo:research-synthesis -- --live`; that
analyst sees only the director report and technical-source register, writes an
untrusted private Markdown memo, and has no write path to the site, drafts, or
content ledger. A scheduled GitHub job is a best-effort
batch process, not an always-running agent; each run starts cleanly and exits
after producing its recommendation log.

## Analytics

Create a GA4 property only once a real domain exists. Record `waitlist_submit`,
`demo_request`, and `studio_launch` with a stable source/page attribute. Use a
read-only reporting credential for the sync job.

## Email waitlist

The site contains a dormant Buttondown-ready form. It renders only when the
public build-time variable `PUBLIC_BUTTONDOWN_USERNAME` is set. The form posts
directly to Buttondown's standard embed endpoint; no email addresses pass
through a GenATK database, Worker, or repository secret.

To activate it, create the newsletter in Buttondown, set the variable in the
Cloudflare Pages build environment, and redeploy. Configure Buttondown's
sender-domain DNS records in Cloudflare if sending from `genatk.com`. The
privacy notice already describes this conditional integration. The username is
public; do not add Buttondown API keys to the site or repository.

## Draft model

`tools/seo/draft.mjs` defaults to a local fixture. Set `OPENAI_API_KEY` only as
a GitHub Actions secret or local environment variable. A real request is made
only with the explicit `--live` flag, sends the approved prompt context only,
and uses `store: false`. The output remains an untrusted artifact under
`marketing/drafts/`; it cannot enter the site without a reviewed human edit.

To publish a reviewed draft, create a real `marketing/reviews/<slug>.json` from
the example file and run `npm run content:promote -- --slug <slug> --apply` on a
dedicated branch. Promotion refuses to overwrite an existing article. The normal
PR check then validates the generated public page before it can be merged.

## Deployment

Cloudflare Pages, domain DNS, Search Console verification, and any deployment
token are intentionally deferred until the local content process has produced
reviewed articles.
# Keyword intelligence (free-first)

The weekly research director now ranks public-safe hypotheses from three permitted sources: Google Search Console (already connected), Bing Webmaster Tools exports, and Google Keyword Planner exports. It does not scrape search results or pretend that generated phrases have demand.

1. Keep the existing GSC OAuth credentials as configured.
2. Add and verify `genatk.com` in Bing Webmaster Tools when convenient. Export keyword research data, normalize it as JSON (`{ "rows": [{ "keyword": "…", "monthlySearches": 0, "competition": "unknown" }] }`), then run:
   ```sh
   npm run seo:keyword-import -- --source bing-webmaster-tools --file /absolute/path/to/bing-keywords.json --country US --language en
   npm run seo:keyword-intelligence
   ```
3. Google Keyword Planner exports can be imported directly as downloaded CSV files, including its UTF-16 export format:
   ```sh
   npm run seo:keyword-import -- --source google-keyword-planner --file "/absolute/path/to/Keyword Stats.csv" --country US --language en
   npm run seo:keyword-intelligence
   ```
   Each import updates `keyword-demand-latest.json` and preserves a local market snapshot such as `keyword-demand-us-en.json`. This is intentionally import-first: it avoids Ads API credentials until the volume is worth it.

All imported demand reports are gitignored, private to the local research workflow, and cannot publish content. The weekly report holds every topic until a permitted source supplies demand evidence.
