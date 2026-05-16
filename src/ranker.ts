import { Paper } from "./openalex.js"
import { findMatchedKeywords } from "./keyword.js"
import { AccessStatus } from "./verifier.js"

export type RankedPaper = Paper & {
  doiValid: boolean
  accessStatus: AccessStatus
  relevanceScore: number
  score: number
}

export function filterByJournals(papers: Paper[], allowedJournals: string[]): Paper[] {
  const allowed = new Set(allowedJournals.map((j) => normalize(j)))
  return papers.filter((paper) => paper.journal && allowed.has(normalize(paper.journal)))
}

export function rankPapers(
  papers: Array<Paper & { doiValid: boolean; accessStatus: AccessStatus }>,
  keywords: string[] = []
): RankedPaper[] {
  return papers
    .map((paper) => {
      const citationScore = Math.min(paper.citedByCount / 500, 1)
      const recencyScore =
        paper.year ? Math.max(0, 1 - (new Date().getFullYear() - paper.year) / 10) : 0
      const doiScore = paper.doiValid ? 1 : 0
      const accessScore = paper.accessStatus === "open_access" ? 1 : 0
      const relevanceScore = calculateRelevanceScore(paper, keywords)

      const score =
        relevanceScore * 0.35 +
        citationScore * 0.25 +
        recencyScore * 0.15 +
        doiScore * 0.15 +
        accessScore * 0.1

      return {
        ...paper,
        relevanceScore,
        score
      }
    })
    .sort((a, b) => b.score - a.score)
}

function normalize(text: string): string {
  return text.toLowerCase().replace(/[^a-z0-9& ]/g, "").replace(/\s+/g, " ").trim()
}

function calculateRelevanceScore(paper: Paper, keywords: string[]): number {
  if (keywords.length === 0) {
    return 0
  }

  const matchedKeywords = findMatchedKeywords(`${paper.title} ${paper.abstract ?? ""}`, keywords)
  return matchedKeywords.length / keywords.length
}
