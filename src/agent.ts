import { JOURNALS } from "./journals.js"
import { ComparedPaper, comparePapersToTopic } from "./comparator.js"
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
  candidatesCount: number
  filteredCount: number
  papers: ComparedPaper[]
  reportPath: string
}

export async function runScholarAgent(topic: string): Promise<ScholarAgentResult> {
  const plan = planResearchTopic(topic)
  const allowedJournals = plan.domains.flatMap((domain) => JOURNALS[domain])
  const query = plan.keywords.join(" ")

  const candidates = await searchOpenAlex(query)
  const filtered = filterByJournals(candidates, allowedJournals)

  const verified = await Promise.all(
    filtered.map(async (paper) => ({
      ...paper,
      doiValid: await verifyDoi(paper.doi),
      accessStatus: determineAccessStatus(paper)
    }))
  )

  const rankedPapers = rankPapers(verified).slice(0, 5)
  const papers = comparePapersToTopic(rankedPapers, topic, plan.keywords)
  const reportPath = await writeMarkdownReport({
    topic,
    domains: plan.domains,
    keywords: plan.keywords,
    allowedJournals,
    candidatesCount: candidates.length,
    filteredCount: filtered.length,
    papers
  })

  return {
    topic,
    domains: plan.domains,
    keywords: plan.keywords,
    allowedJournals,
    candidatesCount: candidates.length,
    filteredCount: filtered.length,
    papers,
    reportPath
  }
}
