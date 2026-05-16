import assert from "node:assert/strict"
import test from "node:test"
import { Paper } from "../src/openalex.js"
import { filterByJournals, rankPapers } from "../src/ranker.js"

const basePaper: Paper = {
  title: "Untitled",
  doi: "10.1000/example",
  year: 2024,
  journal: "Journal of Marketing",
  citedByCount: 10,
  abstract: null,
  authors: [],
  isOpenAccess: true,
  pdfUrl: "https://example.com/paper.pdf",
  landingPageUrl: "https://doi.org/10.1000/example",
  openAlexId: "https://openalex.org/W1"
}

test("filterByJournals normalizes allowed journal names", () => {
  const papers: Paper[] = [
    {
      ...basePaper,
      journal: "Journal of Marketing"
    },
    {
      ...basePaper,
      journal: "Unknown Journal",
      openAlexId: "https://openalex.org/W2"
    }
  ]

  const filtered = filterByJournals(papers, ["Journal of Marketing"])

  assert.equal(filtered.length, 1)
  assert.equal(filtered[0]?.journal, "Journal of Marketing")
})

test("rankPapers gives relevant papers a higher score than irrelevant high-citation papers", () => {
  const papers = [
    {
      ...basePaper,
      title: "Consumers and Artificial Intelligence",
      citedByCount: 100,
      doiValid: true,
      accessStatus: "open_access" as const
    },
    {
      ...basePaper,
      title: "Cryptocurrency exchange rates",
      citedByCount: 2000,
      openAlexId: "https://openalex.org/W2",
      doiValid: true,
      accessStatus: "open_access" as const
    }
  ]

  const ranked = rankPapers(papers, ["AI", "consumer"])

  assert.equal(ranked[0]?.title, "Consumers and Artificial Intelligence")
  assert.equal(ranked[0]?.relevanceScore, 1)
  assert.equal(ranked[1]?.relevanceScore, 0)
})
