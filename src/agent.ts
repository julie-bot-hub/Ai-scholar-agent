import { JOURNALS } from "./journals.js"
import { ComparedPaper, comparePapersToTopic } from "./comparator.js"
import { CriticFinding, reviewAgentRun } from "./critic.js"
import { EvaluationSummary, evaluateResults } from "./evaluator.js"
import { searchOpenAlex } from "./openalex.js"
import { planResearchTopic } from "./planner.js"
import { filterByJournals, rankPapers } from "./ranker.js"
import { writeMarkdownReport } from "./report.js"
import { determineAccessStatus, verifyDoi } from "./verifier.js"

export type ScholarAgentResult = {
  topic: string
  domains: string[]
  keywords: string[]
  allowedJournals: string[]
  retrievalAttempts: RetrievalAttempt[]
  candidatesCount: number
  filteredCount: number
  papers: ComparedPaper[]
  criticFindings: CriticFinding[]
  evaluation: EvaluationSummary
  reportPath: string
}

export type RetrievalAttempt = {
  query: string
  candidatesCount: number
  filteredCount: number
}

export async function runScholarAgent(topic: string): Promise<ScholarAgentResult> {
  const plan = planResearchTopic(topic)
  const allowedJournals = plan.domains.flatMap((domain) => JOURNALS[domain])
  const primaryQuery = plan.keywords.join(" ")

  const { candidates, filtered, retrievalAttempts } = await retrieveWithCorrection(
    primaryQuery,
    topic,
    allowedJournals
  )

  const verified = await Promise.all(
    filtered.map(async (paper) => ({
      ...paper,
      doiValid: await verifyDoi(paper.doi),
      accessStatus: determineAccessStatus(paper)
    }))
  )

  const rankedPapers = rankPapers(verified).slice(0, 5)
  const papers = comparePapersToTopic(rankedPapers, topic, plan.keywords)
  const criticFindings = reviewAgentRun({
    candidatesCount: candidates.length,
    filteredCount: filtered.length,
    papers
  })
  const evaluation = evaluateResults(papers)
  const reportPath = await writeMarkdownReport({
    topic,
    domains: plan.domains,
    keywords: plan.keywords,
    allowedJournals,
    retrievalAttempts,
    candidatesCount: candidates.length,
    filteredCount: filtered.length,
    papers,
    criticFindings,
    evaluation
  })

  return {
    topic,
    domains: plan.domains,
    keywords: plan.keywords,
    allowedJournals,
    retrievalAttempts,
    candidatesCount: candidates.length,
    filteredCount: filtered.length,
    papers,
    criticFindings,
    evaluation,
    reportPath
  }
}

async function retrieveWithCorrection(
  primaryQuery: string,
  topic: string,
  allowedJournals: string[]
): Promise<{
  candidates: Awaited<ReturnType<typeof searchOpenAlex>>
  filtered: Awaited<ReturnType<typeof searchOpenAlex>>
  retrievalAttempts: RetrievalAttempt[]
}> {
  const retrievalAttempts: RetrievalAttempt[] = []
  const candidates = await searchOpenAlex(primaryQuery, 20)
  let mergedCandidates = candidates
  let filtered = filterByJournals(mergedCandidates, allowedJournals)

  retrievalAttempts.push({
    query: primaryQuery,
    candidatesCount: candidates.length,
    filteredCount: filtered.length
  })

  if (filtered.length < 5 && topic !== primaryQuery) {
    const expandedCandidates = await searchOpenAlex(topic, 50)
    mergedCandidates = mergePapersByOpenAlexId(mergedCandidates, expandedCandidates)
    filtered = filterByJournals(mergedCandidates, allowedJournals)

    retrievalAttempts.push({
      query: topic,
      candidatesCount: expandedCandidates.length,
      filteredCount: filtered.length
    })
  }

  return {
    candidates: mergedCandidates,
    filtered,
    retrievalAttempts
  }
}

function mergePapersByOpenAlexId<T extends { openAlexId: string }>(
  primary: T[],
  secondary: T[]
): T[] {
  const seen = new Set<string>()
  const merged: T[] = []

  for (const paper of [...primary, ...secondary]) {
    if (seen.has(paper.openAlexId)) {
      continue
    }

    seen.add(paper.openAlexId)
    merged.push(paper)
  }

  return merged
}
