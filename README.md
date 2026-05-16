# AI Scholar Agent

AI Scholar Agent is a TypeScript CLI that searches OpenAlex, filters results to a curated journal universe, verifies DOI status through Crossref and `doi.org`, ranks papers with topic relevance, and writes a Markdown report.

## Run

```bash
npm install
npm run dev -- "AI disclosure and consumer trust in online review platforms"
```

## Test

```bash
npm test
npm run typecheck
```

## Data

The journal universe is loaded from `data/journals.xlsx` first when present.
If that file is missing, the app falls back to `data/journals.json`, then to the built-in default list.

Expected workbook layouts:

1. One sheet per domain named `marketing`, `is`, or `management`.
2. Or one sheet with columns named `marketing`, `is`, and `management`.
3. Cells may contain one journal per row or comma/newline separated journal names.

## Output

The main report is written to:

```text
docs/reports/ai-disclosure-and-consumer-trust-in-online-review-platforms.md
```

## Pipeline

1. Planner selects domains and keywords.
2. Journal loader provides the allowed journal universe.
3. OpenAlex retrieves candidates.
4. Retrieval retries with a broader query if the first pass is too small.
5. Verifier checks DOI and access status.
6. Ranker scores papers with topic relevance, citation count, recency, DOI validity, and open access.
7. Comparator creates per-paper common points, differences, and research gaps.
8. Critic flags low-coverage or weak-overlap results.
9. Evaluator summarizes result quality.
10. Baseline comparison contrasts the proposed workflow with keyword-only search.
