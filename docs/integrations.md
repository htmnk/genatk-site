# Deferred integrations

The repository is intentionally usable without credentials. The default mode for
each external integration is a local fixture so all automation paths can be
tested before launch.

## Search Console

When a domain exists, verify its Search Console property and create an OAuth
credential restricted to `https://www.googleapis.com/auth/webmasters.readonly`.
Store the refresh-token material as GitHub Actions secrets; never commit it.
Replace the guarded mock branch in `tools/seo/gsc-sync.mjs` with the API client
only after a successful read-only manual test. Query finalized data by page and
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

## Analytics

Create a GA4 property only once a real domain exists. Record `waitlist_submit`,
`demo_request`, and `studio_launch` with a stable source/page attribute. Use a
read-only reporting credential for the sync job.

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
