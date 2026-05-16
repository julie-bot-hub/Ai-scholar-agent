export function findMatchedKeywords(text: string, keywords: string[]): string[] {
  const searchableText = text.toLowerCase()
  return keywords.filter((keyword) => keywordMatches(searchableText, keyword))
}

export function findMissingKeywords(text: string, keywords: string[]): string[] {
  const matched = new Set(findMatchedKeywords(text, keywords))
  return keywords.filter((keyword) => !matched.has(keyword))
}

export function keywordMatches(searchableText: string, keyword: string): boolean {
  const normalizedText = searchableText.toLowerCase()
  const normalizedKeyword = keyword.toLowerCase()

  if (normalizedKeyword === "ai") {
    return /\bai\b/.test(normalizedText) || normalizedText.includes("artificial intelligence")
  }

  return new RegExp(`(?<![a-z0-9])${escapeRegExp(normalizedKeyword)}s?(?![a-z0-9])`).test(
    normalizedText
  )
}

function escapeRegExp(text: string): string {
  return text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
}
