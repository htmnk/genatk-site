# Lab performance record: cottage seed-study article

**Run date:** 2026-08-25  
**URL tested:** `http://127.0.0.1:4321/learn/deterministic-procedural-assets/`  
**Tool:** Lighthouse 13.4.1, local static preview, headless Chrome for Testing.  
**Report artifact:** `marketing/reports/lighthouse-cottage-seed-study.json` (ignored because it is regenerated per run).

| Metric | Result | Threshold | Result |
| --- | ---: | ---: | --- |
| Lighthouse performance | 100 / 100 | No Core Web Vitals threshold | Passed local lab audit |
| Largest Contentful Paint | 0.76 s | ≤ 2.5 s | Pass |
| Cumulative Layout Shift | 0.000 | ≤ 0.1 | Pass |
| Total Blocking Time | 0 ms | Diagnostic only | Pass |
| First Contentful Paint | 0.66 s | Diagnostic only | Pass |
| Speed Index | 0.66 s | Diagnostic only | Pass |

## Important interpretation

LCP and CLS are passing **lab** measurements for this local build. Lighthouse
cannot create a truthful real-user Core Web Vitals result for a pre-launch site,
and this static page has no meaningful interaction in the test run, so INP is
not reported. After deployment, the publishing gate should be: keep the lab
thresholds above, then use Search Console’s Core Web Vitals report or CrUX data
to assess field LCP, CLS, and INP once sufficient traffic exists. Do not label
field CWV as passed before that data exists.

The image grid originally made the local Speed Index slow. The page now uses
600 px JPEG previews (about 0.5 MB total) rather than the original PNG previews
(about 3.0 MB total), while retaining the full 12-seed visual study.

## Re-run

1. Build the review site: `npm run build:drafts`.
2. Serve `apps/site/dist` on port 4321.
3. Run `npm run seo:lighthouse`.

Set `LIGHTHOUSE_URL` to audit a different local or deployed URL.
