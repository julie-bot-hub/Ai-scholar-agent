export type Paper = {
  title: string
  doi: string | null
  year: number | null
  journal: string | null
  citedByCount: number
  abstract: string | null
  authors: string[]
  openAlexId: string
}

function extractAbstract(invertedIndex?: Record<string, number[]>): string | null {
  if (!invertedIndex) return null

  const entries: Array<[number, string]> = []

  for (const [word, positions] of Object.entries(invertedIndex)) {
    for (const pos of positions) {
      entries.push([pos, word])
    }
  }

  return entries
    .sort((a, b) => a[0] - b[0])
    .map(([, word]) => word)
    .join(" ")
}

export async function searchOpenAlex(query: string): Promise<Paper[]> {
  const url = new URL("https://api.openalex.org/works")
  url.searchParams.set("search", query)
  url.searchParams.set("per-page", "20")
  url.searchParams.set("sort", "cited_by_count:desc")

  const res = await fetch(url.toString())
  if (!res.ok) {
    throw new Error(`OpenAlex request failed: ${res.status}`)
  }

  const data = await res.json()

  return (data.results ?? []).map((item: any) => ({
    title: item.title ?? "",
    doi: item.doi ? String(item.doi).replace("https://doi.org/", "") : null,
    year: item.publication_year ?? null,
    journal: item.primary_location?.source?.display_name ?? null,
    citedByCount: item.cited_by_count ?? 0,
    abstract: extractAbstract(item.abstract_inverted_index),
    authors: (item.authorships ?? []).map((a: any) => a.author?.display_name).filter(Boolean),
    openAlexId: item.id
  }))
}
