import { DomainKey } from "./journals.js"

export function planResearchTopic(topic: string): {
  keywords: string[]
  domains: DomainKey[]
} {
  const lower = topic.toLowerCase()

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
    lower.includes("ai") ||
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
    .filter((w) => w.length > 2)
    .slice(0, 8)

  return { keywords, domains }
}
