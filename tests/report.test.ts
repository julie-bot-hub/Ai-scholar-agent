import assert from "node:assert/strict"
import test from "node:test"
import { BaselineResult } from "../src/baseline.js"
import { ComparedPaper } from "../src/comparator.js"
import { EvaluationSummary } from "../src/evaluator.js"
import { renderMarkdownReport } from "../src/report.js"

const evaluation: EvaluationSummary = {
  requestedTopK: 5,
  returnedCount: 1,
  paperValidityRate: 1,
  openAccessRate: 1,
  averageScore: 0.8,
  topKComplete: false
}

function makePaper(): ComparedPaper {
  return {
    title: "Consumers and Artificial Intelligence",
    doi: "10.1000/example",
    year: 2024,
    journal: "Journal of Marketing",
    citedByCount: 100,
    abstract: null,
    authors: [],
    isOpenAccess: true,
    pdfUrl: "https://example.com/paper.pdf",
    landingPageUrl: "https://doi.org/10.1000/example",
    openAlexId: "https://openalex.org/W1",
    doiValid: true,
    accessStatus: "open_access",
    relevanceScore: 1,
    score: 0.8,
    comparison: {
      matchedKeywords: ["AI", "consumer"],
      missingKeywords: ["trust"],
      commonPoints: ["The paper directly overlaps with the topic."],
      differences: ["The paper does not explicitly cover trust."],
      researchGap: "Connect AI and consumer response with trust outcomes."
    }
  }
}

function makeBaseline(name: string, averageScore: number): BaselineResult {
  return {
    name,
    description: `${name} description`,
    query: `${name} query`,
    candidatesCount: 20,
    papers: [makePaper()],
    evaluation: {
      ...evaluation,
      averageScore
    }
  }
}

test("renderMarkdownReport renders every baseline and proposed metrics", () => {
  const markdown = renderMarkdownReport({
    topic: "AI disclosure and consumer trust",
    domains: ["marketing", "is"],
    keywords: ["AI", "consumer", "trust"],
    allowedJournals: ["Journal of Marketing", "MIS Quarterly"],
    retrievalAttempts: [
      {
        query: "AI consumer trust",
        candidatesCount: 20,
        filteredCount: 1
      }
    ],
    candidatesCount: 20,
    filteredCount: 1,
    papers: [makePaper()],
    criticFindings: [
      {
        severity: "warning",
        message: "Only one ranked paper was found."
      }
    ],
    evaluation,
    baselines: [
      makeBaseline("Baseline 1: direct LLM-style prompt", 0.3),
      makeBaseline("Baseline 2: keyword-only OpenAlex search", 0.6)
    ]
  })

  assert.match(markdown, /### Baseline 1: direct LLM-style prompt/)
  assert.match(markdown, /### Baseline 2: keyword-only OpenAlex search/)
  assert.match(markdown, /### Proposed vs Baselines/)
  assert.match(markdown, /- Proposed Average Score: 0\.8/)
  assert.match(markdown, /- Average Score: 0\.3/)
  assert.match(markdown, /- Average Score: 0\.6/)
})
