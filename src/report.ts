import { mkdir, writeFile } from "node:fs/promises"
import { join } from "node:path"
import { ComparedPaper } from "./comparator.js"
import { CriticFinding } from "./critic.js"
import { DomainKey } from "./journals.js"

export type AgentReportInput = {
  topic: string
  domains: DomainKey[]
  keywords: string[]
  allowedJournals: string[]
  candidatesCount: number
  filteredCount: number
  papers: ComparedPaper[]
  criticFindings: CriticFinding[]
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

## Top Papers

${paperSections}
## Critic Review

${input.criticFindings.map(renderCriticFinding).join("\n")}`
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
- Score: ${paper.score.toFixed(3)}
- OpenAlex ID: ${paper.openAlexId}

#### Comparison
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
