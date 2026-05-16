import assert from "node:assert/strict"
import test from "node:test"
import {
  findMatchedKeywords,
  findMissingKeywords,
  keywordMatches
} from "../src/keyword.js"

test("keywordMatches is case-insensitive and expands AI", () => {
  assert.equal(keywordMatches("Artificial Intelligence disclosure study", "AI"), true)
  assert.equal(keywordMatches("AI disclosure study", "ai"), true)
})

test("keywordMatches handles simple plurals and escapes regex characters", () => {
  assert.equal(keywordMatches("Online reviews shape consumer trust", "review"), true)
  assert.equal(keywordMatches("C++ adoption in software teams", "C++"), true)
})

test("keyword matching separates matched and missing keywords", () => {
  const text = "AI disclosure affects consumer reviews."
  const keywords = ["AI", "consumer", "trust"]

  assert.deepEqual(findMatchedKeywords(text, keywords), ["AI", "consumer"])
  assert.deepEqual(findMissingKeywords(text, keywords), ["trust"])
})
