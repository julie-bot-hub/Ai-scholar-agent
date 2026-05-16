import { DomainKey } from "./journals.js"

const STOP_WORDS = new Set([
  "and",
  "the",
  "for",
  "with",
  "from",
  "into",
  "about"
])

export function planResearchTopic(topic: string): {
  keywords: string[]
  domains: DomainKey[]
} {
  const lower = topic.toLowerCase()
  const tokens = lower.split(/[^a-z0-9]+/).filter(Boolean)

  const domains: DomainKey[] = []

  if (
    lower.includes("consumer") ||
    lower.includes("review") ||
    lower.includes("brand") ||
    lower.includes("marketing") ||
    lower.includes("advertising")
  ) {
    domains.push("marketing")
  }

  if (
    tokens.includes("ai") ||
    lower.includes("artificial intelligence") ||
    lower.includes("system") ||
    lower.includes("platform") ||
    lower.includes("information") ||
    lower.includes("chatbot")
  ) {
    domains.push("is")
  }

  if (
    lower.includes("organization") ||
    lower.includes("employee") ||
    lower.includes("management") ||
    lower.includes("leadership")
  ) {
    domains.push("management")
  }

  if (domains.length === 0) {
    domains.push("marketing", "is")
  }

  const keywords = topic
    .split(/[,\s]+/)
    .map((w) => w.trim())
    .filter((w) => {
      const lower = w.toLowerCase()
      return (w.length > 2 || lower === "ai") && !STOP_WORDS.has(lower)
    })
    .slice(0, 8)

  return { keywords, domains }
}
