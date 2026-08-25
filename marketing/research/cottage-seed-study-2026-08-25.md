# Research brief: 12-seed procedural asset review study

**Decision date:** 2026-08-25  
**Decision:** Create one evidence-led field note for editorial review.  
**Working title:** “What 12 seeded asset variations reveal about procedural review”  
**Status:** Ready for editorial review; not published.

## Decision summary

The broad commercial query family around “game-ready 3D assets” is not an
appropriate first target. A search snapshot on 2026-08-25 returned vendor pages
from Alpha3D, Ludo, Hyper3D, and Sloyd that frame the task as AI generation and
purchase evaluation. We cannot credibly win that transactional comparison with
an unreleased product or a generic post.

We chose the narrower informational theme **procedural asset variation for
games**, with supporting language such as **procedural game assets**, **seeded
variation**, and **procedural building generator**. The article does not pretend
to have keyword-volume data: no paid keyword database was used and a new domain
has no Search Console history. Zero recorded volume is therefore *unknown*, not
zero demand.

The angle is defensible because it begins with a public-safe original artifact:
a controlled 12-seed image study. It answers a practical question that product
pages commonly skip: how should a developer review variation before claiming an
asset belongs in a production pipeline?

## Search and intent snapshot

| Query family | Observed intent | What the results emphasize | Editorial implication |
| --- | --- | --- | --- |
| `game-ready 3D assets` | Transactional / vendor comparison | Text-to-3D, image-to-3D, asset generation, pricing | Do not target first; no evidence-led differentiation yet. |
| `procedural building generator` | Tool discovery / implementation | Generators, add-ons, demos | Useful supporting vocabulary; future proof needs a usable artifact. |
| `procedural asset variation for games` | Informational / workflow evaluation | Practical discussions of seeded variation and review | Best fit for a visual, methods-first field note. |

Sources captured 2026-08-25: [Alpha3D](https://www.alpha3d.io/ai-3d-for-game-developers), [Ludo](https://ludo.ai/features/3d-generator), [Hyper3D](https://hyper3d.ai/use-cases/game-development), [Sloyd](https://www.sloyd.ai/use-case/game-development), and [a procedural building generator project](https://github.com/outerreaches/blender-building-generator). These sources establish observed market language and intent; they are not used as technical proof for our claims.

## Original evidence record

**Run:** 2026-08-25, one stylized cottage archetype, seeds 00–11.  
**Capture command:** `node tools/shoot.mjs --out /private/tmp/forge-article-seeds --asset cottage --seeds 12`  
**Capture result:** 12 images, 1 build per image, frame 60, 1,800 × 1,800 buffer, 0 console errors.  
**Published derivative:** 12 JPEG previews at 600 × 600 px.  
**Integrity check:** 12 distinct SHA-256 values across 12 published preview files.  
**Repeatability check:** `npm run repro` completed successfully in the Forge workspace.

The record is intentionally narrow. Unique image hashes establish that published
files differ at the byte level; they do not quantify meaningful visual distance.
A successful deterministic regression command establishes only that the
repository’s registered checks passed in this environment. It is not an
independent performance, topology, or export certification.

## Claim boundaries

Allowed claims:

- This original run generated and captured twelve labeled visual candidates.
- The capture command recorded no console errors.
- The public preview files differ from one another at the byte level.
- A separate deterministic regression command succeeded.

Prohibited claims without a new artifact:

- “Game-ready,” “production-ready,” or “optimized” for the previews.
- Export compatibility, triangle counts, UV status, collision, draw calls, or runtime performance.
- Market leadership, customer outcomes, or model comparisons.

## Why this earns a publishable slot

Google’s [people-first content guidance](https://developers.google.com/search/docs/fundamentals/creating-helpful-content) recommends material created to help people rather than principally to manipulate rankings. This note has a specific audience, a review method a reader can reuse, visible original evidence, and explicit limitations. It should be published only after a human verifies that the visuals and wording still accurately represent the project.

## Measurement plan after launch

| Window | Signal | Decision |
| --- | --- | --- |
| Pre-deploy | Static SEO and lab performance report | Fix blocking metadata, crawlability, or performance issues. |
| 14 days | Index coverage and impressions in Search Console | Keep only if crawl/index state is healthy; fix technical issues before creating another post. |
| 28 days | Query impressions and landing-page CTR | Improve title/snippet only if impressions exist but CTR is weak. |
| 56–90 days | Engaged sessions, newsletter/waitlist conversion, assisted signups | Keep, update with a second artifact, or stop the topic. |

Search Console data normally matures after a short delay and does not exist for
this undeployed domain. No simulated GSC numbers are used in this brief.
