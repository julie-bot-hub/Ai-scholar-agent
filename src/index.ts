import { JOURNALS } from "./journals.js"
import { planResearchTopic } from "./planner.js"
import { searchOpenAlex } from "./openalex.js"
import { verifyDoi } from "./verifier.js"
import { filterByJournals, rankPapers } from "./ranker.js"

async function main() {
  const topic =
    process.argv.slice(2).join(" ") ||
    "AI disclosure and consumer trust in online review platforms"

  console.log(`\nTopic: ${topic}\n`)

  const plan = planResearchTopic(topic)
  console.log("Selected domains:", plan.domains)
  console.log("Keywords:", plan.keywords.join(", "), "\n")

  const allowedJournals = plan.domains.flatMap((d) => JOURNALS[d])
  console.log("Allowed journals:", allowedJournals.slice(0, 10), "\n")

  const query = plan.keywords.join(" ")
  const candidates = await searchOpenAlex(query)

  console.log(`OpenAlex candidates: ${candidates.length}`)

  const filtered = filterByJournals(candidates, allowedJournals)
  console.log(`After journal filter: ${filtered.length}`)

  const verified = await Promise.all(
    filtered.map(async (paper) => ({
      ...paper,
      doiValid: await verifyDoi(paper.doi)
    }))
  )

  const ranked = rankPapers(verified).slice(0, 5)

  console.log("\nTop 5 papers:\n")
  ranked.forEach((paper, idx) => {
    console.log(`${idx + 1}. ${paper.title}`)
    console.log(`   Journal: ${paper.journal}`)
    console.log(`   Year: ${paper.year}`)
    console.log(`   DOI: ${paper.doi}`)
    console.log(`   DOI Valid: ${paper.doiValid}`)
    console.log(`   Citations: ${paper.citedByCount}`)
    console.log(`   Score: ${paper.score.toFixed(3)}`)
    console.log("")
  })
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
