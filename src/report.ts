import { mkdir, writeFile } from "node:fs/promises"
import { join } from "node:path"
import { BaselineResult } from "./baseline.js"
import { ComparedPaper } from "./comparator.js"
import { CriticFinding } from "./critic.js"
import { EvaluationSummary } from "./evaluator.js"
import { DomainKey } from "./journals.js"
import type { RetrievalAttempt } from "./agent.js"

export type AgentReportInput = {
  topic: string
  domains: DomainKey[]
  keywords: string[]
  allowedJournals: string[]
  retrievalAttempts: RetrievalAttempt[]
  candidatesCount: number
  filteredCount: number
  papers: ComparedPaper[]
  criticFindings: CriticFinding[]
  evaluation: EvaluationSummary
  baselines: BaselineResult[]
}

export async function writeMarkdownReport(input: AgentReportInput): Promise<string> {
  const reportsDir = join(process.cwd(), "docs", "reports")
  await mkdir(reportsDir, { recursive: true })

  const fileName = `${slugify(input.topic)}.md`
  const filePath = join(reportsDir, fileName)

  await writeFile(filePath, renderMarkdownReport(input), "utf8")
  return filePath
}

function renderMarkdownReport(input: AgentReportInput): string {
  const paperSections =
    input.papers.length > 0
      ? input.papers.map(renderPaper).join("\n")
      : "No verified papers found in the allowed journal universe.\n"

  return `# AI Scholar Agent Report

## Query
- Topic: ${input.topic}
- Domains: ${input.domains.join(", ")}
- Keywords: ${input.keywords.join(", ")}

## Retrieval Log
- OpenAlex candidates: ${input.candidatesCount}
- After journal filter: ${input.filteredCount}
- Allowed journals: ${input.allowedJournals.join("; ")}

## Retrieval Attempts

${input.retrievalAttempts.map(renderRetrievalAttempt).join("\n")}

## Top Papers

${paperSections}
## Critic Review

${input.criticFindings.map(renderCriticFinding).join("\n")}

## Evaluation Summary

${renderEvaluationSummary(input.evaluation)}

## Baseline Comparison

${renderBaselineComparisons(input.baselines, input.evaluation)}`
}

function renderPaper(paper: ComparedPaper, index: number): string {
  return `### ${index + 1}. ${paper.title}
- Journal: ${paper.journal ?? "Unknown"}
- Year: ${paper.year ?? "Unknown"}
- DOI: ${paper.doi ?? "None"}
- DOI valid: ${paper.doiValid}
- Access status: ${paper.accessStatus}
- PDF URL: ${paper.pdfUrl ?? "None"}
- Landing page: ${paper.landingPageUrl ?? "None"}
- Citations: ${paper.citedByCount}
- Relevance score: ${paper.relevanceScore.toFixed(3)}
- Score: ${paper.score.toFixed(3)}
- OpenAlex ID: ${paper.openAlexId}

#### Comparison
- Matched keywords: ${paper.comparison.matchedKeywords.join(", ") || "None"}
- Missing keywords: ${paper.comparison.missingKeywords.join(", ") || "None"}
- Common points:
${paper.comparison.commonPoints.map((point) => `  - ${point}`).join("\n")}
- Differences:
${paper.comparison.differences.map((point) => `  - ${point}`).join("\n")}
- Research gap: ${paper.comparison.researchGap}
`
}

function slugify(text: string): string {
  const slug = text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80)

  return slug || "ai-scholar-agent-report"
}

function renderCriticFinding(finding: CriticFinding): string {
  return `- ${finding.severity.toUpperCase()}: ${finding.message}`
}

function renderRetrievalAttempt(attempt: RetrievalAttempt, index: number): string {
  return `### Attempt ${index + 1}
- Query: ${attempt.query}
- OpenAlex candidates: ${attempt.candidatesCount}
- After journal filter: ${attempt.filteredCount}
`
}

function renderEvaluationSummary(evaluation: EvaluationSummary): string {
  return `- Requested Top K: ${evaluation.requestedTopK}
- Returned count: ${evaluation.returnedCount}
- Top K complete: ${evaluation.topKComplete}
- Paper Validity Rate: ${evaluation.paperValidityRate}
- Open Access Rate: ${evaluation.openAccessRate}
- Average Score: ${evaluation.averageScore}`
}

function renderBaselineComparisons(
  baselines: BaselineResult[],
  proposedEvaluation: EvaluationSummary
): string {
  const baselineSections = baselines.map(renderSingleBaseline).join("\n")

  return `${baselineSections}

### Proposed vs Baselines
- Proposed Paper Validity Rate: ${proposedEvaluation.paperValidityRate}
- Proposed Open Access Rate: ${proposedEvaluation.openAccessRate}
- Proposed Average Score: ${proposedEvaluation.averageScore}
- Interpretation note: Average Score combines topic relevance, citation, recency, DOI validity, and open-access status, with topic relevance weighted most heavily.`
}

function renderSingleBaseline(baseline: BaselineResult): string {
  return `### ${baseline.name}
- Description: ${baseline.description}
- Query: ${baseline.query}
- OpenAlex candidates: ${baseline.candidatesCount}
- Returned count: ${baseline.evaluation.returnedCount}
- Paper Validity Rate: ${baseline.evaluation.paperValidityRate}
- Open Access Rate: ${baseline.evaluation.openAccessRate}
- Average Score: ${baseline.evaluation.averageScore}`
}
