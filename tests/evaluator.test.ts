import assert from "node:assert/strict"
import test from "node:test"
import { ComparedPaper } from "../src/comparator.js"
import { evaluateResults } from "../src/evaluator.js"

function makePaper(overrides: Partial<ComparedPaper> = {}): ComparedPaper {
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
      matchedKeywords: ["AI"],
      missingKeywords: [],
      commonPoints: [],
      differences: [],
      researchGap: ""
    },
    ...overrides
  }
}

test("evaluateResults returns zero metrics for empty results", () => {
  const evaluation = evaluateResults([])

  assert.deepEqual(evaluation, {
    requestedTopK: 5,
    returnedCount: 0,
    paperValidityRate: 0,
    openAccessRate: 0,
    averageScore: 0,
    topKComplete: false
  })
})

test("evaluateResults computes validity, access, average score, and top-k completion", () => {
  const evaluation = evaluateResults([
    makePaper(),
    makePaper({
      doiValid: false,
      accessStatus: "requires_institution",
      score: 0.4,
      openAlexId: "https://openalex.org/W2"
    })
  ], 2)

  assert.equal(evaluation.paperValidityRate, 0.5)
  assert.equal(evaluation.openAccessRate, 0.5)
  assert.equal(evaluation.averageScore, 0.6)
  assert.equal(evaluation.topKComplete, true)
})
