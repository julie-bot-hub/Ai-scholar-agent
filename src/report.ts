import { mkdir, writeFile } from "node:fs/promises"
import { join } from "node:path"
import { DomainKey } from "./journals.js"
import { RankedPaper } from "./ranker.js"

export type AgentReportInput = {
  topic: string
  domains: DomainKey[]
  keywords: string[]
  allowedJournals: string[]
  candidatesCount: number
  filteredCount: number
  papers: RankedPaper[]
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

${paperSections}`
}

function renderPaper(paper: RankedPaper, index: number): string {
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
