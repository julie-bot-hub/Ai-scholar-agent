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
