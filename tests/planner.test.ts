import assert from "node:assert/strict"
import test from "node:test"
import { planResearchTopic } from "../src/planner.js"

test("planResearchTopic selects marketing and IS domains for AI consumer topics", () => {
  const plan = planResearchTopic("AI disclosure and consumer trust in online review platforms")

  assert.deepEqual(plan.domains, ["marketing", "is"])
  assert.deepEqual(plan.keywords, [
    "AI",
    "disclosure",
    "consumer",
    "trust",
    "online",
    "review",
    "platforms"
  ])
})

test("planResearchTopic falls back to marketing and IS when no domain keyword matches", () => {
  const plan = planResearchTopic("blockchain accounting audit")

  assert.deepEqual(plan.domains, ["marketing", "is"])
  assert.deepEqual(plan.keywords, ["blockchain", "accounting", "audit"])
})
