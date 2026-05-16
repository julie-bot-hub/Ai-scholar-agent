# GitHub Upload Queue

This file tracks local work that is ready to push once GitHub authentication is restored in the working environment.

## Status
- Local branch: `main`
- Remote branch: `origin/main`
- Current issue: command-line `git push` cannot authenticate to GitHub from this environment.
- Recovery command after authentication is fixed: `git push origin main`

## Queued Work
- Critic review checks
  - Adds `src/critic.ts`
  - Adds Critic Review output to console and Markdown reports
  - Adds DOI resolver fallback through `doi.org`
- Retrieval self-correction loop
  - Adds second-pass OpenAlex search when the first pass returns fewer than five allowed-journal papers
  - Records retrieval attempts in Markdown reports
  - Adds Critic warning for ranked papers with no direct keyword overlap
- Evaluation summary
  - Adds basic Paper Validity Rate, Open Access Rate, average score, and Top K completion metrics
  - Adds evaluation output to console and Markdown reports
- File-backed journal universe
  - Moves allowed journals into `data/journals.json` for easier replacement with xlsx-derived data later
  - Keeps a runtime fallback so the app still runs if the file is absent
- Xlsx journal loader
  - Adds `xlsx` support so a `data/journals.xlsx` file can become the primary journal universe input later
  - Preserves JSON and built-in fallbacks for development and recovery
- Xlsx template data
  - Adds a repository-local `data/journals.xlsx` template generated from the current journal universe
  - Makes the xlsx-first loader path exerciseable without any external file
- Documentation refresh
  - Replaces the placeholder README with project usage, pipeline, and data-format guidance
  - Adds a journal universe format guide for future xlsx files
- Direct prompt baseline comparison
  - Adds a direct topic-query baseline alongside keyword-only OpenAlex search
  - Updates console and Markdown report output to show multiple baselines
