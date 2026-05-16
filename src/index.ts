import { runScholarAgent } from "./agent.js"

async function main() {
  const topic =
    process.argv.slice(2).join(" ") ||
    "AI disclosure and consumer trust in online review platforms"

  console.log(`\nTopic: ${topic}\n`)

  const result = await runScholarAgent(topic)

  console.log("Selected domains:", result.domains)
  console.log("Keywords:", result.keywords.join(", "), "\n")
  console.log("Allowed journals:", result.allowedJournals.slice(0, 10), "\n")
  console.log(`OpenAlex candidates: ${result.candidatesCount}`)
  console.log(`After journal filter: ${result.filteredCount}`)
  console.log("Retrieval attempts:")
  result.retrievalAttempts.forEach((attempt, idx) => {
    console.log(
      `   ${idx + 1}. ${attempt.query} -> ${attempt.candidatesCount} candidates, ${attempt.filteredCount} filtered`
    )
  })

  console.log("\nTop 5 papers:\n")
  result.papers.forEach((paper, idx) => {
    console.log(`${idx + 1}. ${paper.title}`)
    console.log(`   Journal: ${paper.journal}`)
    console.log(`   Year: ${paper.year}`)
    console.log(`   DOI: ${paper.doi}`)
    console.log(`   DOI Valid: ${paper.doiValid}`)
    console.log(`   Access: ${paper.accessStatus}`)
    console.log(`   Citations: ${paper.citedByCount}`)
    console.log(`   Score: ${paper.score.toFixed(3)}`)
    console.log("")
  })

  console.log("Critic review:")
  result.criticFindings.forEach((finding) => {
    console.log(`   ${finding.severity.toUpperCase()}: ${finding.message}`)
  })
  console.log("")

  console.log("Evaluation:")
  console.log(`   Paper Validity Rate: ${result.evaluation.paperValidityRate}`)
  console.log(`   Open Access Rate: ${result.evaluation.openAccessRate}`)
  console.log(`   Average Score: ${result.evaluation.averageScore}`)
  console.log(`   Top K Complete: ${result.evaluation.topKComplete}`)
  console.log("")

  console.log("Baselines:")
  result.baselines.forEach((baseline) => {
    console.log(`   ${baseline.name}`)
    console.log(`   Paper Validity Rate: ${baseline.evaluation.paperValidityRate}`)
    console.log(`   Open Access Rate: ${baseline.evaluation.openAccessRate}`)
    console.log(`   Average Score: ${baseline.evaluation.averageScore}`)
    console.log("")
  })

  console.log(`Report: ${result.reportPath}`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
