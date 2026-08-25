# GenATK Content

Private working home for the public-facing content system around an offline,
procedural game-asset SDK. This is deliberately separate from the product source
repository.

GenATK stands for **Generative Asset Toolkit**. The site and its
content may discuss the problem space, but must not reveal product
implementation, roadmap, or other protected material.

## Local commands

```bash
npm install
npm run dev
npm run check
npm run build
```

To see unapproved articles locally without adding them to a normal/public build:

```bash
npm run build:drafts
npm run preview -w @genatk/site -- --host 127.0.0.1
```

`npm run check` runs the disclosure and SEO preflight checks. No content is
generated or published by these commands.

## Content contract

Only `marketing/public-evidence/` is approved for an automated content system.
Do not use product source code or internal documents as prompt context.

Before publishing, a human must approve the content PR. Automation may create
drafts and reports, but it must not merge or deploy new content on its own.
