# Worklog

This file records completed work for the Ai-scholar-agent repository.

## Rules

- Record every completed task before committing.
- Include the date, summary, changed files, verification, and commit SHA when available.
- For the commit that edits this file, use `this commit` instead of a self-referential SHA.
- Push each completed commit to `origin/main`.
- Keep entries concise and factual.

## 2026-05-13

### Repository workflow setup

- Summary: Added a strict Markdown worklog for tracking completed changes.
- Changed files:
  - `WORKLOG.md`
- Verification:
  - Confirmed the working tree was clean before setup.
  - Registered `origin` as `https://github.com/julie-bot-hub/Ai-scholar-agent.git`.
- Commit: this commit

## 2026-05-16

### TypeScript MVP scaffold

- Summary: Added a TypeScript MVP that plans domains from a research topic, searches OpenAlex, filters by allowed journals, verifies DOI availability through Crossref, and ranks candidate papers.
- Changed files:
  - `.gitignore`
  - `package-lock.json`
  - `package.json`
  - `src/index.ts`
  - `src/journals.ts`
  - `src/openalex.ts`
  - `src/planner.ts`
  - `src/ranker.ts`
  - `src/verifier.ts`
  - `tsconfig.json`
- Verification:
  - Ran `npm install`.
  - Ran `npm run dev -- "AI disclosure and consumer trust in online review platforms"`.
- Commit: this commit

### Agent orchestration and tracked report output

- Summary: Added a scholar agent orchestration layer, OpenAlex access metadata, DOI verification retry handling, access status labels, tracked Markdown report output, and TypeScript typechecking.
- Changed files:
  - `.gitignore`
  - `WORKLOG.md`
  - `docs/reports/ai-disclosure-and-consumer-trust-in-online-review-platforms.md`
  - `package-lock.json`
  - `package.json`
  - `src/agent.ts`
  - `src/index.ts`
  - `src/openalex.ts`
  - `src/planner.ts`
  - `src/ranker.ts`
  - `src/report.ts`
  - `src/verifier.ts`
- Verification:
  - Ran `npm install`.
  - Ran `npm run typecheck`.
  - Ran `npm run dev -- "AI disclosure and consumer trust in online review platforms"`.
- Commit: this commit

### Paper comparison report sections

- Summary: Added metadata-based comparison output for each ranked paper, including common points, differences, and a draft research gap.
- Changed files:
  - `WORKLOG.md`
  - `docs/reports/ai-disclosure-and-consumer-trust-in-online-review-platforms.md`
  - `src/agent.ts`
  - `src/comparator.ts`
  - `src/report.ts`
- Verification:
  - Ran `npm run typecheck`.
  - Ran `npm run dev -- "AI disclosure and consumer trust in online review platforms"`.
- Commit: this commit

### Critic review checks

- Summary: Added a Critic Agent module that flags low result count, empty retrieval/filtering, DOI validation failures, and institution-only access needs in the console and Markdown report.
- Changed files:
  - `WORKLOG.md`
  - `docs/reports/ai-disclosure-and-consumer-trust-in-online-review-platforms.md`
  - `src/agent.ts`
  - `src/critic.ts`
  - `src/index.ts`
  - `src/report.ts`
  - `src/verifier.ts`
- Verification:
  - Ran `npm run typecheck`.
  - Ran `npm run dev -- "AI disclosure and consumer trust in online review platforms"`.
- Commit: this commit

### Retrieval self-correction loop

- Summary: Added a second-pass OpenAlex retrieval attempt when the first allowed-journal filter returns fewer than five papers, recorded retrieval attempts in the Markdown report, and expanded Critic checks to flag papers with no direct keyword overlap.
- Changed files:
  - `WORKLOG.md`
  - `docs/reports/ai-disclosure-and-consumer-trust-in-online-review-platforms.md`
  - `src/agent.ts`
  - `src/comparator.ts`
  - `src/critic.ts`
  - `src/index.ts`
  - `src/openalex.ts`
  - `src/report.ts`
- Verification:
  - Ran `npm run typecheck`.
  - Ran `npm run dev -- "AI disclosure and consumer trust in online review platforms"`.
- Commit: this commit

### Evaluation summary output

- Summary: Added basic evaluation metrics for result validity, open access coverage, average score, and Top K completion; added a GitHub upload queue document for local commits waiting on authentication.
- Changed files:
  - `WORKLOG.md`
  - `docs/github_upload_queue.md`
  - `docs/reports/ai-disclosure-and-consumer-trust-in-online-review-platforms.md`
  - `src/agent.ts`
  - `src/evaluator.ts`
  - `src/index.ts`
  - `src/report.ts`
- Verification:
  - Ran `npm run typecheck`.
  - Ran `npm run dev -- "AI disclosure and consumer trust in online review platforms"`.
- Commit: this commit

### Keyword-only baseline comparison

- Summary: Added a keyword-only OpenAlex baseline and report comparison against the proposed allowed-journal agent workflow.
- Changed files:
  - `WORKLOG.md`
  - `docs/reports/ai-disclosure-and-consumer-trust-in-online-review-platforms.md`
  - `src/agent.ts`
  - `src/baseline.ts`
  - `src/index.ts`
  - `src/report.ts`
- Verification:
  - Ran `npm run typecheck`.
  - Ran `npm run dev -- "AI disclosure and consumer trust in online review platforms"`.
- Commit: this commit

### Relevance-aware ranking

- Summary: Added shared keyword matching utilities, incorporated topic relevance into ranking scores, and excluded zero-relevance papers from final ranked outputs.
- Changed files:
  - `WORKLOG.md`
  - `docs/reports/ai-disclosure-and-consumer-trust-in-online-review-platforms.md`
  - `src/agent.ts`
  - `src/baseline.ts`
  - `src/comparator.ts`
  - `src/keyword.ts`
  - `src/ranker.ts`
  - `src/report.ts`
- Verification:
  - Ran `npm run typecheck`.
  - Ran `npm run dev -- "AI disclosure and consumer trust in online review platforms"`.
- Commit: this commit

### File-backed journal universe

- Summary: Moved the allowed journal universe into `data/journals.json` and loaded it at runtime with a fallback to the built-in list, so the project can later swap in xlsx-derived data without changing the filtering pipeline.
- Changed files:
  - `WORKLOG.md`
  - `data/journals.json`
  - `src/journals.ts`
- Verification:
  - Ran `npm run typecheck`.
  - Ran `npm run dev -- "AI disclosure and consumer trust in online review platforms"`.
- Commit: this commit

### Xlsx journal loader

- Summary: Added `xlsx` support so the journal universe can be loaded from `data/journals.xlsx` first, with JSON and built-in fallback paths preserved for local development.
- Changed files:
  - `WORKLOG.md`
  - `package-lock.json`
  - `package.json`
  - `src/journals.ts`
- Verification:
  - Ran `npm run typecheck`.
  - Ran `npm run dev -- "AI disclosure and consumer trust in online review platforms"`.
- Commit: this commit

### Xlsx template data

- Summary: Added a concrete `data/journals.xlsx` template generated from the current journal universe so the xlsx-first loader can be exercised directly in the repository.
- Changed files:
  - `WORKLOG.md`
  - `data/journals.xlsx`
  - `docs/journal_universe_format.md`
  - `README.md`
- Verification:
  - Ran `npm run dev -- "AI disclosure and consumer trust in online review platforms"`.
- Commit: this commit

### Documentation refresh

- Summary: Replaced the starter README with project-specific run, test, data-format, and pipeline documentation, and added a journal universe format guide for future xlsx updates.
- Changed files:
  - `README.md`
  - `WORKLOG.md`
  - `docs/journal_universe_format.md`
- Verification:
  - Reviewed the updated documentation for the current CLI workflow and data loader format.
- Commit: this commit

### Direct prompt baseline comparison

- Summary: Added a direct topic-query baseline alongside the keyword-only baseline, updated console and Markdown report output to render multiple baselines, and refreshed the generated sample report.
- Changed files:
  - `README.md`
  - `WORKLOG.md`
  - `docs/github_upload_queue.md`
  - `docs/reports/ai-disclosure-and-consumer-trust-in-online-review-platforms.md`
  - `src/agent.ts`
  - `src/baseline.ts`
  - `src/index.ts`
  - `src/report.ts`
- Verification:
  - Ran `npm run typecheck`.
  - Ran `npm test`.
  - Ran `npm run dev -- "AI disclosure and consumer trust in online review platforms"`.
- Commit: this commit
