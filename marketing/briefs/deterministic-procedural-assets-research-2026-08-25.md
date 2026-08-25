# Research brief: deterministic procedural assets in game pipelines

**Status:** Research complete; do not draft yet.  
**Audience:** Solo game developers and technical artists who need to review a
specific generated variation again later.  
**Reader outcome:** Leave with a compact record format for a reproducible asset
review, and a clear understanding of what that record does *not* guarantee.

## Opportunity

The first useful GenATK topic should establish a narrow, credible workflow
principle rather than describe an unreleased product. “Deterministic procedural
assets” serves this purpose because it concerns a repeatable production task:
identifying and reviewing one variant among many.

This is not a volume-led decision. The domain has no usable Search Console
query history yet. The topic is an intentionally chosen foundational gap that
will be reassessed when real impressions and queries arrive.

## Search intent and differentiation

The likely search result set mixes implementation tutorials, engine-specific
random-number documentation, and generator demonstrations. A GenATK article
must not compete by restating random-seed basics. Its distinct contribution is a
tool-agnostic **asset review record**:

| Field | Why it belongs in the record |
| --- | --- |
| Asset identity | Lets a reviewer discuss one named output. |
| Generator version | Separates a changed generator from changed inputs. |
| Seed and, when relevant, state | Captures the controlled source of variation. |
| Chosen settings | Records deliberate adjustments alongside the seed. |
| Export target | Ties the review to the file actually evaluated. |
| Reviewer and disposition | Preserves the decision and its rationale. |

## Source-backed facts and boundaries

- Godot documents that using a fixed seed yields the same pseudo-random
  sequence; it also distinguishes a generator's seed from its state.
  Source: [Godot random number generation](https://docs.godotengine.org/en/stable/tutorials/math/random_number_generation.html).
- Unreal documents Random Streams as producing the same values from the same
  initial seed, including for consistent distributions in procedural
  environments. Source: [Unreal Random Streams](https://dev.epicgames.com/documentation/unreal-engine/random-streams-in-unreal-engine?lang=en-US).
- These engine facts support repeatability *inside the stated conditions*.
  They do not support claims about visual quality, mesh topology, export
  compatibility, runtime cost, cross-version stability, or commercial
  readiness.

## Original evidence plan

Create a product-safe public research artifact before drafting:

1. A sanitized twelve-variation image gallery from an already-recorded study.
2. A tool-agnostic seed-review worksheet that readers can copy.
3. A methodology card spelling out capture scope, what was checked, and what
   was not checked.
4. A manual reviewer test: choose one gallery item, complete the worksheet,
   and verify that the documented inputs point to the same reviewed item in the
   intended demonstration context.

The artifact must use only public-safe outputs. It must not include product
source, technical architecture, unreleased feature behaviour, roadmap,
performance claims, or private file paths.

## Draft gate

Do not write the article until the four evidence-plan items exist and a human
has approved the public boundaries. If the artifact cannot be independently
understood without revealing product internals, reject this topic or reduce it
to a clearly illustrative worksheet rather than implying a live demo.

## Measurement after publishing

After the final approved page is indexed, inspect Search Console at 28 and 56–90
days for impressions, queries, CTR, and index coverage. Improve the existing
page from actual queries before expanding into closely overlapping articles.
