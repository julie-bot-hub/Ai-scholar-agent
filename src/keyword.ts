export function findMatchedKeywords(text: string, keywords: string[]): string[] {
  const searchableText = text.toLowerCase()
  return keywords.filter((keyword) => keywordMatches(searchableText, keyword))
}

export function findMissingKeywords(text: string, keywords: string[]): string[] {
  const matched = new Set(findMatchedKeywords(text, keywords))
  return keywords.filter((keyword) => !matched.has(keyword))
}

export function keywordMatches(searchableText: string, keyword: string): boolean {
  const normalizedKeyword = keyword.toLowerCase()

  if (normalizedKeyword === "ai") {
    return /\bai\b/.test(searchableText) || searchableText.includes("artificial intelligence")
  }

  return new RegExp(`\\b${escapeRegExp(normalizedKeyword)}s?\\b`).test(searchableText)
}

function escapeRegExp(text: string): string {
  return text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
}
