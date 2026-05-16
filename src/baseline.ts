import { ComparedPaper, comparePapersToTopic } from "./comparator.js"
import { evaluateResults, EvaluationSummary } from "./evaluator.js"
import { searchOpenAlex } from "./openalex.js"
import { rankPapers } from "./ranker.js"
import { determineAccessStatus, verifyDoi } from "./verifier.js"

export type BaselineResult = {
  name: string
  description: string
  query: string
  candidatesCount: number
  papers: ComparedPaper[]
  evaluation: EvaluationSummary
}

export async function runDirectPromptBaseline(
  topic: string,
  keywords: string[]
): Promise<BaselineResult> {
  const candidates = await searchOpenAlex(topic, 20)
  const verified = await Promise.all(
    candidates.map(async (paper) => ({
      ...paper,
      doiValid: false,
      accessStatus: determineAccessStatus(paper)
    }))
  )
  const rankedPapers = rankPapers(verified, []).slice(0, 5)
  const papers = comparePapersToTopic(rankedPapers, topic, keywords)

  return {
    name: "Baseline 1: direct LLM-style prompt",
    description: "Single-step topic query without journal filtering or self-correction.",
    query: topic,
    candidatesCount: candidates.length,
    papers,
    evaluation: evaluateResults(papers)
  }
}

export async function runKeywordOnlyBaseline(
  query: string,
  topic: string,
  keywords: string[]
): Promise<BaselineResult> {
  const candidates = await searchOpenAlex(query, 20)
  const verified = await Promise.all(
    candidates.map(async (paper) => ({
      ...paper,
      doiValid: await verifyDoi(paper.doi),
      accessStatus: determineAccessStatus(paper)
    }))
  )
  const rankedPapers = rankPapers(verified, keywords)
    .filter((paper) => paper.relevanceScore > 0)
    .slice(0, 5)
  const papers = comparePapersToTopic(rankedPapers, topic, keywords)

  return {
    name: "Baseline 2: keyword-only OpenAlex search",
    description: "OpenAlex keyword search ranked by citations without allowed-journal filtering.",
    query,
    candidatesCount: candidates.length,
    papers,
    evaluation: evaluateResults(papers)
  }
}
