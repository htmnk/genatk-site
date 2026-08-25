# SEO operating policy

This workflow borrows the durable parts of the Reddit process: use Search
Console before creating a page, decide `CREATE / IMPROVE / REJECT`, gate each
release, verify the live page, and use data to choose `KEEP / ITERATE / REVERT`.
It does **not** treat automation as strategy or publishing volume as a goal.

## Non-negotiable rules

1. Every page has one primary intent in `marketing/content-ledger.json`.
2. Every claim in a draft must trace to `marketing/public-evidence/`.
3. Every published page identifies who wrote/reviewed it and how it was made.
4. The model receives only the public-safe context bundle.
5. A generated draft is never published automatically. It must be checked,
   reviewed, and merged by a human.
6. Do not make query-variant pages, scrape SERPs, rewrite other sources, or use
   “freshness” edits without a substantive reason.

## 2026 research applied here

- Google’s people-first guidance requires an intended audience, first-hand
  expertise or depth, a satisfying answer, clear authorship, and a useful reason
  for content to exist. This motivates the ledger, bylines, evidence contract,
  author page, and `howCreated` metadata.
- Google’s current AI and spam guidance permits AI assistance but identifies
  mass pages without added value as scaled-content abuse. This motivates the
  one-draft-per-week limit and human publication gate.
- Google’s generative-search guidance says not to make a separate page for every
  query variation. This motivates the primary-intent uniqueness gate.
- Article JSON-LD, a canonical URL, sitemap, and robots file help a crawler
  understand the site, but never substitute for useful content. Markup must
  represent visible content exactly.
- Core Web Vitals are tracked at launch: LCP under 2.5 seconds, INP below
  200 milliseconds, and CLS below 0.1 are user-experience targets, not a
  promise of rankings.

## Skill/tool policy

We evaluated `coreyhaines31/marketingskills@seo-audit` as an optional audit
reference: it has high adoption and a large public repository, but it is not an
authority. Official Google documentation overrides it when they differ. We do
not adopt programmatic-SEO automation because it conflicts with this project’s
limited, evidence-led publication policy.

## Decision review

At day 90 after launch, run `npm run seo:measure`. The decision is documented in
`marketing/policies/measurement.json`: continue only with multiple positive
signals; iterate when the right audience is arriving but conversion lags; pause
new production when neither index/query fit nor qualified conversion appears.

