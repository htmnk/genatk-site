# GenATK search-growth plan

## Objective

Own the branded query **GenATK** and become a credible result for selected
procedural-generation questions. A first-place result for the brand is a
reasonable near-term target once a live domain is indexed. A first-place result
for broad terms such as `procedural generation` is not a promise; it requires
time, original evidence, and external references.

## Positioning

Use one stable description everywhere:

> GenATK is the Generative Asset Toolkit for deterministic,
> offline-ready game assets.

Keep the site useful before it is promotional. Do not expose private product
implementation, roadmap, source code, or unreleased asset packs.

## Early publishing policy

Start publishing before the product is complete, but do not operate a generic
activity blog or publish speculative product updates. The early objective is to
give the domain a small, useful, internally connected body of durable work—not
to manufacture a false sense of launch readiness.

Use this public structure:

| Route | Purpose |
| --- | --- |
| `/` | GenATK entity, cautious positioning, and links to useful work |
| `/learn/` | Evergreen explainers and technical articles |
| `/guides/` | Actionable checklists and workflows |
| `/research/` | Original artifacts: seed studies, benchmarks, and experiments |
| `/about/` | Editorial method, authorship, and scope |

Do not add a separate `/blog/` route at this stage. `/learn/` is the canonical
home for evergreen articles; adding a parallel route would make the information
architecture weaker without helping discovery.

Until the product shape is public, the home page should make only a stable,
reversible statement such as: “GenATK is exploring deterministic, offline-ready
generation for game assets. Research, methods, and tools in development.” Do
not claim unreleased features, pricing, dates, or implementation details.

## Search targets and pages

| Priority | Query / intent | Page to create or improve | Evidence required |
| --- | --- | --- | --- |
| 1 | `GenATK`, `GenATK Generative Asset Toolkit` | Home, About, Organization schema | Official domain and consistent naming |
| 2 | `deterministic procedural assets` | Existing foundational article | Reproducible public example |
| 2 | `procedural asset generation for games` | Pillar guide | Original benchmark and glossary |
| 3 | `offline procedural asset generation` | Comparison / principles guide | Tested local workflow evidence |
| 3 | `seeded procedural generation` | Practical tutorial | Public seed set and outputs |
| 3 | `procedural generation game asset pipeline` | Pipeline checklist | Tested export/review checklist |

Do not publish pages merely to cover keyword variants. Each page must answer a
different decision or task and link to the related pillar and supporting pages.

## Keyword intelligence loop

Brand ranking validates entity discovery; it does not validate demand. The
research director therefore uses a separate, non-branded opportunity loop:

1. Generate constrained hypotheses from `marketing/policies/keyword-intelligence.json`.
2. Enrich them only with permitted sources: GenATK Search Console, Bing
   Webmaster Tools exports, or Google Keyword Planner exports.
3. Score relevance, observed demand, first-party impressions, and technical
   source coverage. A generated phrase with no demand evidence remains
   `HOLD_FOR_DEMAND_DATA`.
4. Present a private weekly ranked shortlist. A human may choose one item for
   a research brief; the job cannot draft, publish, modify pages, or access
   Forge.

This protects the project from two common failure modes: treating a keyword
tool's volume as a ranking prediction, and writing attractive pages around
phrases that nobody actually uses.

## Mandatory content sequence

No publishable article starts with a draft. Every topic must move through this
sequence, with the resulting artifacts retained in the repository:

1. **Opportunity** — a real reader need from Search Console, a community
   question, or a deliberately chosen foundational gap.
2. **Research brief** — search intent, existing result patterns, primary
   sources, claims that can and cannot be made, and a distinct reader outcome.
3. **Original evidence plan** — the public proof GenATK can add: an experiment,
   seed set, benchmark, worksheet, demo, or tested checklist.
4. **Evidence capture** — create or collect the approved public artifact and
   record its method, limitations, and reproducibility details.
5. **Draft** — write from the brief and evidence, with sources and internal
   links. Automation may assist only at this stage.
6. **Review** — human editorial and technical review of usefulness, claims,
   disclosure, privacy, and product secrecy.
7. **Publish and measure** — merge only the approved article, then review its
   Search Console performance after sufficient data accumulates.

If steps 2–4 do not produce something meaningfully better than an existing
generic explainer, reject the topic rather than publish it.

## 90-day sequence

### Days 0–14: establish the entity

1. Register the chosen domain, deploy the existing site, and set `SITE_URL`.
2. Verify the domain in Google Search Console, submit `/sitemap-index.xml`, and
   connect the existing GSC sync configuration with read-only credentials.
3. Add a clear home-page title, About page, Organization schema, favicon, and
   a public contact channel. Use `GenATK` and the full expansion consistently.
4. Research and approve the first three durable, product-safe briefs before
   drafting any of them:
   - deterministic procedural assets in game pipelines;
   - seeded procedural generation and reproducibility;
   - offline procedural generation: benefits, tradeoffs, and evaluation.
5. Create `/research/` with one original public artifact, such as a seed gallery
   or reproducibility worksheet. Link to and from every relevant article.
6. Draft and publish only the first topic whose research and evidence pass human
   review; then request indexing for the home page, About page, and that
   approved article.

### Days 15–45: build a small topical cluster

1. Publish one substantial evidence-led page every 7–10 days, beginning with
   the target pages above.
2. Produce one original public artifact for each article: seed gallery,
   reproducibility worksheet, benchmark, small interactive demo, or downloadable
   checklist. Original artifacts are the reason others link.
3. Add 3–5 useful internal links from every new page, with natural descriptive
   anchors. Refresh the home page to surface the cluster.
4. Add a concise glossary only when terms are defined by a substantive guide;
   avoid thin dictionary pages.

### Days 46–90: earn references and improve

1. Share the useful artifact—not a generic product announcement—with relevant
   game-dev communities, technical blogs, asset-pipeline discussions, and open
   source projects where participation is appropriate.
2. Publish a transparent methodology page for any benchmarks or comparisons.
3. Each week, review GSC impressions, queries, pages, CTR, index coverage, and
   technical errors. Turn repeated real queries into improvements to existing
   pages before creating more pages.
4. Each month, update pages with new screenshots, evidence, reviewer dates, and
   internal links. Consolidate or noindex anything that remains thin.

## Automation boundaries

The existing pipeline may automate research capture, briefing, draft checks,
static SEO checks, GSC/analytics sync, and performance audits. It must not
auto-publish, auto-comment, buy links, fabricate tests, or use private product
materials as content input. Human approval remains the publishing gate.

## Measures of progress

| Cadence | Measure | Success signal |
| --- | --- | --- |
| Weekly | Brand-index coverage | Home and About indexed for `GenATK` |
| Weekly | Search Console | Impressions and query set grow without indexing errors |
| Monthly | Brand SERP | Official site is the dominant result for `GenATK` |
| Monthly | Topical authority | Non-brand impressions for target questions grow |
| Quarterly | Acquisition quality | Relevant referring domains, returning readers, and email/demo conversions grow |

The main monthly comparison is **branded versus non-branded** visibility.
Branded queries show whether the entity is recognized; non-branded impressions,
clicks, and qualified conversions show whether the work reaches new people.

## What not to do

Do not expect daily AI-generated posts to rank on volume alone. Do not target
the broadest terms first, create doorway pages, or use automated link building.
The compounding advantage is a small library of original, verifiable work that
is more useful than generic summaries.
