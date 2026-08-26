# Editorial review packet: deterministic procedural assets

**Status:** Private review packet. This is not an approval and cannot publish
anything.

## Candidate

- **Draft:** `apps/site/src/content/learn/deterministic-procedural-assets.md`
- **Reader:** Solo game developers and technical artists reviewing a selected
  generated variation.
- **Reader outcome:** Understand the distinction between identifying a chosen
  variation, reproducing it under stated conditions, and evaluating an export
  for a particular pipeline.
- **Primary query family:** Procedural asset variation for games; supporting
  language includes procedural generation, seeded variation, and game asset
  review.

## Evidence available

| Artifact | What it supports | What it does not support |
| --- | --- | --- |
| Twelve-cottage study | Twelve labeled preview candidates were captured and are visibly distinct. | Mesh quality, budgets, exports, runtime, or commercial readiness. |
| Asset review record | A tool-agnostic checklist for documenting a selected candidate. | Reproduction by itself, or any technical certification. |
| Wayfinder public lab | A public illustration of form, seed, palette, and review identity. | Any GenATK product capability or product output. |
| Public TypeScript specimen | Stable review identity despite settings order. | A generator, a production hash, or an engine integration. |

## Primary sources

- Godot documents that a fixed seed produces the same pseudo-random sequence,
  and explains the distinction between seed and state:
  <https://docs.godotengine.org/en/stable/tutorials/math/random_number_generation.html>
- Unreal documents Random Streams as generating consistent values from an
  initial seed:
  <https://dev.epicgames.com/documentation/en-us/unreal-engine/random-streams-in-unreal-engine>

## Required reviewer decisions

- [ ] The cottage images and capture method are accurately described.
- [ ] “Distinct preview files” is not read as a claim of useful visual
  diversity or game readiness.
- [ ] The Wayfinder and TypeScript specimen are clearly independent,
  illustrative public work.
- [ ] No wording implies product availability, roadmap, mesh/export quality,
  runtime performance, or compatibility.
- [ ] The proposed title and description are useful to a real reader rather
  than merely targeting a keyword.
- [ ] The waitlist CTA is appropriate and not presented as an offer of access.

## Recommendation

Keep the page as a **draft** until the boxes above have been checked by a human.
If approved, create `marketing/reviews/deterministic-procedural-assets.json`
from `marketing/reviews/review.example.json`; only then may the existing
promotion command be considered.
