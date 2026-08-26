# Foundational research backlog

**Status:** Private planning only. None of these entries is a draft, a queued
article, or a publication decision.

## Selection rule while Search Console is new

Until GenATK has real query impressions, foundational topics may be researched
only when all three are true:

1. There is a recognizable developer problem with a cited source.
2. At least one primary technical source establishes the narrow factual premise.
3. GenATK can add a product-safe original artifact instead of a generic summary.

## 1. A seed is not the whole asset identity

**Reader problem:** A developer can reproduce a seed today but may be unable to
reproduce the same result after changing the generation sequence or a dependent
rule. A Game Development Stack Exchange question describes this as a
post-update “butterfly effect” for seeded procedural content.

**Sources:**

- [Procedural generation, game updates, & butterfly effect](https://gamedev.stackexchange.com/questions/119891/procedural-generation-game-updates-butterfly-effect)
- [Godot: random number generation](https://docs.godotengine.org/en/stable/tutorials/math/random_number_generation.html)
- [Unreal: Random Streams](https://dev.epicgames.com/documentation/unreal-engine/random-streams-in-unreal-engine?lang=en-US)

**Narrow claim boundary:** A fixed seed can reproduce a pseudo-random sequence
within a stated generator context. It does not by itself identify the generator
revision, chosen settings, export, or review decision.

**Original public artifact required:** A copyable, tool-agnostic asset review
record with fields for asset ID, generator revision, seed/state, selected
settings, export target, reviewer, and outcome—plus a methodology card that
states what the record cannot guarantee.

**Decision:** Research brief can be developed after the public-safe worksheet
is technically reviewed. Do not draft the article yet.

## 2. Offline generation is a pipeline choice, not a runtime promise

**Reader problem:** Procedural generation is often discussed as a runtime world
system, but game teams also use it offline to create editable, reviewable static
assets. That distinction changes how teams think about review, exports, and
revision.

**Sources:**

- [Offline versus online procedural generation discussion](https://victoriacity.github.io/csur1/)
- [Procedural city-generation tool: offline versus runtime distinctions](https://www.theseus.fi/bitstream/10024/105312/1/viitanen_henri.pdf)

**Narrow claim boundary:** Offline generation can produce artifacts for review
before runtime, but it does not inherently make them performant, compatible, or
production-ready.

**Original public artifact required:** A concise decision worksheet that asks
whether a task needs runtime variation or a reviewed exported artifact, and
records the resulting review handoff.

**Decision:** Hold. The cited material establishes terminology, but this entry
does not yet satisfy the primary-source requirement and its original worksheet
needs a concrete, public-safe example before it is useful enough to publish.
