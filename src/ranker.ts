import { Paper } from "./openalex.js"
import { AccessStatus } from "./verifier.js"

export type RankedPaper = Paper & {
  doiValid: boolean
  accessStatus: AccessStatus
  score: number
}

export function filterByJournals(papers: Paper[], allowedJournals: string[]): Paper[] {
  const allowed = new Set(allowedJournals.map((j) => normalize(j)))
  return papers.filter((paper) => paper.journal && allowed.has(normalize(paper.journal)))
}

export function rankPapers(
  papers: Array<Paper & { doiValid: boolean; accessStatus: AccessStatus }>
): RankedPaper[] {
  return papers
    .map((paper) => {
      const citationScore = Math.min(paper.citedByCount / 500, 1)
      const recencyScore =
        paper.year ? Math.max(0, 1 - (new Date().getFullYear() - paper.year) / 10) : 0
      const doiScore = paper.doiValid ? 1 : 0
      const accessScore = paper.accessStatus === "open_access" ? 1 : 0

      const score =
        citationScore * 0.35 + recencyScore * 0.2 + doiScore * 0.35 + accessScore * 0.1

      return {
        ...paper,
        score
      }
    })
    .sort((a, b) => b.score - a.score)
}

function normalize(text: string): string {
  return text.toLowerCase().replace(/[^a-z0-9& ]/g, "").replace(/\s+/g, " ").trim()
}
