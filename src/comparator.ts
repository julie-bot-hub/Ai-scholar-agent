import { RankedPaper } from "./ranker.js"

export type PaperComparison = {
  commonPoints: string[]
  differences: string[]
  researchGap: string
}

export type ComparedPaper = RankedPaper & {
  comparison: PaperComparison
}

export function comparePapersToTopic(
  papers: RankedPaper[],
  topic: string,
  keywords: string[]
): ComparedPaper[] {
  return papers.map((paper) => ({
    ...paper,
    comparison: comparePaperToTopic(paper, topic, keywords)
  }))
}

function comparePaperToTopic(
  paper: RankedPaper,
  topic: string,
  keywords: string[]
): PaperComparison {
  const searchableText = `${paper.title} ${paper.abstract ?? ""}`.toLowerCase()
  const matchedKeywords = keywords.filter((keyword) => keywordMatches(searchableText, keyword))
  const missingKeywords = keywords.filter(
    (keyword) => !keywordMatches(searchableText, keyword)
  )

  return {
    commonPoints: buildCommonPoints(matchedKeywords, paper),
    differences: buildDifferences(missingKeywords, paper),
    researchGap: buildResearchGap(topic, matchedKeywords, missingKeywords, paper)
  }
}

function keywordMatches(searchableText: string, keyword: string): boolean {
  const normalizedKeyword = keyword.toLowerCase()

  if (normalizedKeyword === "ai") {
    return /\bai\b/.test(searchableText) || searchableText.includes("artificial intelligence")
  }

  return new RegExp(`\\b${escapeRegExp(normalizedKeyword)}\\b`).test(searchableText)
}

function escapeRegExp(text: string): string {
  return text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
}

function buildCommonPoints(keywords: string[], paper: RankedPaper): string[] {
  if (keywords.length === 0) {
    return [
      `The paper is in an allowed target journal (${paper.journal ?? "unknown journal"}).`,
      "The paper passed metadata-based candidate filtering."
    ]
  }

  return [
    `The paper directly overlaps with these topic terms: ${keywords.slice(0, 5).join(", ")}.`,
    `The paper appears in an allowed target journal (${paper.journal ?? "unknown journal"}).`
  ]
}

function buildDifferences(keywords: string[], paper: RankedPaper): string[] {
  const accessNote =
    paper.accessStatus === "open_access"
      ? "The paper is open access, so full-text review is feasible without institutional login."
      : "The paper may require institutional access for full-text review."

  if (keywords.length === 0) {
    return [
      "The current metadata suggests broad topical alignment, but detailed construct-level comparison still requires full-text reading.",
      accessNote
    ]
  }

  return [
    `The paper metadata does not explicitly cover these query terms: ${keywords.slice(0, 5).join(", ")}.`,
    accessNote
  ]
}

function buildResearchGap(
  topic: string,
  matchedKeywords: string[],
  missingKeywords: string[],
  paper: RankedPaper
): string {
  if (missingKeywords.length > 0) {
    return `A useful gap is to connect ${matchedKeywords.slice(0, 3).join(", ") || "the paper's core constructs"} with ${missingKeywords.slice(0, 3).join(", ")} in the context of "${topic}".`
  }

  return `A useful gap is to extend the paper's setting or method to the specific research context: "${topic}".`
}
