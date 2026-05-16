import { ComparedPaper } from "./comparator.js"

export type EvaluationSummary = {
  requestedTopK: number
  returnedCount: number
  paperValidityRate: number
  openAccessRate: number
  averageScore: number
  topKComplete: boolean
}

export function evaluateResults(
  papers: ComparedPaper[],
  requestedTopK = 5
): EvaluationSummary {
  const returnedCount = papers.length

  if (returnedCount === 0) {
    return {
      requestedTopK,
      returnedCount,
      paperValidityRate: 0,
      openAccessRate: 0,
      averageScore: 0,
      topKComplete: false
    }
  }

  const validPaperCount = papers.filter((paper) => paper.doiValid).length
  const openAccessCount = papers.filter((paper) => paper.accessStatus === "open_access").length
  const scoreTotal = papers.reduce((total, paper) => total + paper.score, 0)

  return {
    requestedTopK,
    returnedCount,
    paperValidityRate: roundMetric(validPaperCount / returnedCount),
    openAccessRate: roundMetric(openAccessCount / returnedCount),
    averageScore: roundMetric(scoreTotal / returnedCount),
    topKComplete: returnedCount >= requestedTopK
  }
}

function roundMetric(value: number): number {
  return Number(value.toFixed(3))
}
