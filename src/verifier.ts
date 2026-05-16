export async function verifyDoi(doi: string | null): Promise<boolean> {
  if (!doi) return false

  const url = `https://api.crossref.org/works/${encodeURIComponent(doi)}`
  const res = await fetch(url, { method: "GET" })
  return res.ok
}
