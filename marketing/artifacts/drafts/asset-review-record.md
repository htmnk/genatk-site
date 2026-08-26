# Asset review record

**Status:** Private draft. Illustrative worksheet; not a product demo or a
reproducibility guarantee.

Use one record for each generated candidate that reaches human review. Keep it
with the reviewed export, not only with a preview image.

| Field | Record |
| --- | --- |
| Asset ID | `example-cottage-014` |
| Generator revision | `generator-version-or-commit` |
| Seed | `12345` |
| Generator state, if used | `not-applicable` |
| Chosen settings | `style=stylized; density=medium` |
| Export reviewed | `example-cottage-014.glb` |
| Export date | `YYYY-MM-DD` |
| Reviewer | `name-or-role` |
| Outcome | `approve / revise / reject` |
| Review notes | `Describe the decision, not just the image.` |

## How to use it

1. Assign an asset ID before feedback starts.
2. Record the generator revision alongside the seed; a seed alone is not a
   complete identity after the generator changes.
3. Record selected settings and the exact export reviewed.
4. Capture the human decision and the reason for it.
5. If an output cannot be reproduced, record that result rather than implying
   success.

## What this record does not prove

The worksheet does not certify mesh topology, UVs, collision, runtime cost,
engine import compatibility, visual quality, legal rights, or cross-version
reproducibility. Those require separate checks appropriate to the project.

## Publication gate

Before this becomes public, a human must confirm that the example values,
wording, and any accompanying images reveal no implementation or unreleased
product detail. The public version must be clearly labeled illustrative unless
it includes a separately reviewed, executable demonstration.
