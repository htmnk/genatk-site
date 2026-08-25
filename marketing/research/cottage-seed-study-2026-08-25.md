# Research brief: 12-seed procedural asset review study

**Decision date:** 2026-08-25  
**Decision:** Hold the field note until its reusable public artifact is complete.
**Working title:** “What 12 seeded asset variations reveal about procedural review”  
**Status:** Research complete; evidence artifact pending; not published.

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

The angle is potentially defensible because it begins with a public-safe
original artifact: a controlled 12-seed image study. Images alone are not a
useful enough artifact. Before an article can be drafted, the study must be
paired with a tool-agnostic reproducibility worksheet that teaches a developer
how to record, reproduce, and review one chosen variation.

## Search and intent snapshot

| Query family | Observed intent | What the results emphasize | Editorial implication |
| --- | --- | --- | --- |
| `game-ready 3D assets` | Transactional / vendor comparison | Text-to-3D, image-to-3D, asset generation, pricing | Do not target first; no evidence-led differentiation yet. |
| `procedural building generator` | Tool discovery / implementation | Generators, add-ons, demos | Useful supporting vocabulary; future proof needs a usable artifact. |
| `procedural asset variation for games` | Informational / workflow evaluation | Practical discussions of seeded variation and review | Best fit for a visual, methods-first field note. |

Sources captured 2026-08-25: [Alpha3D](https://www.alpha3d.io/ai-3d-for-game-developers), [Ludo](https://ludo.ai/features/3d-generator), [Hyper3D](https://hyper3d.ai/use-cases/game-development), [Sloyd](https://www.sloyd.ai/use-case/game-development), and [a procedural building generator project](https://github.com/outerreaches/blender-building-generator). These sources establish observed market language and intent; they are not used as technical proof for our claims.

## Original evidence record

**Run:** 2026-08-25, one stylized cottage archetype, seeds 00–11.  
**Capture method:** a controlled local capture of one stylized cottage archetype.
**Capture result:** 12 images, one build per image, no capture-run console errors.
**Published derivative:** 12 JPEG previews at 600 × 600 px.  
**Integrity check:** 12 distinct SHA-256 values across 12 published preview files.  
**Repeatability check:** a separate deterministic regression check completed successfully.

The record is intentionally narrow. Unique image hashes establish that published
files differ at the byte level; they do not quantify meaningful visual distance.
A successful deterministic regression check establishes only that the
project's registered checks passed in this environment. It is not an
independent performance, topology, or export certification.

## Claim boundaries

Allowed claims:

- This original run generated and captured twelve labeled visual candidates.
- The capture process recorded no console errors.
- The public preview files differ from one another at the byte level.
- A separate deterministic regression check succeeded.

Prohibited claims without a new artifact:

- “Game-ready,” “production-ready,” or “optimized” for the previews.
- Export compatibility, triangle counts, UV status, collision, draw calls, or runtime performance.
- Market leadership, customer outcomes, or model comparisons.

## Evidence required before this earns a publishable slot

The article remains blocked until all of the following public-safe material is
available and reviewed:

1. A downloadable or copyable seed-review worksheet with fields for asset ID,
   generator version, seed/state, chosen settings, export format, reviewer, and
   review outcome.
2. A small image gallery that labels the twelve variations without exposing
   implementation, source code, unreleased product behaviour, or roadmap.
3. A plain-language methodology and limitations note which distinguishes
   repeatability from compatibility, visual quality, and production readiness.
4. A technical review confirming the worksheet can reproduce a selected output
   in the public demonstration environment, or an explicit statement that the
   worksheet is illustrative rather than executable.

Engine documentation supports the narrow premise: Godot documents that a fixed
seed yields the same pseudo-random sequence, while Unreal documents that a
Random Stream produces the same values from the same initial seed. Those facts
do not prove cross-version, cross-platform, or export-level compatibility, so
the article must not infer them.

Sources: [Godot random number generation](https://docs.godotengine.org/en/stable/tutorials/math/random_number_generation.html) and [Unreal Random Streams](https://dev.epicgames.com/documentation/unreal-engine/random-streams-in-unreal-engine?lang=en-US).

## Why this could earn a publishable slot

Google’s [people-first content guidance](https://developers.google.com/search/docs/fundamentals/creating-helpful-content) recommends material created to help people rather than principally to manipulate rankings. This note can have a specific audience, a review method a reader can reuse, visible original evidence, and explicit limitations. It should be published only after a human verifies that the worksheet, visuals, and wording accurately represent the project.

## Measurement plan after launch

| Window | Signal | Decision |
| --- | --- | --- |
| Pre-deploy | Static SEO and lab performance report | Fix blocking metadata, crawlability, or performance issues. |
| 14 days | Index coverage and impressions in Search Console | Keep only if crawl/index state is healthy; fix technical issues before creating another post. |
| 28 days | Query impressions and landing-page CTR | Improve title/snippet only if impressions exist but CTR is weak. |
| 56–90 days | Engaged sessions, newsletter/waitlist conversion, assisted signups | Keep, update with a second artifact, or stop the topic. |

Search Console data normally matures after a short delay and does not exist for
this undeployed domain. No simulated GSC numbers are used in this brief.
