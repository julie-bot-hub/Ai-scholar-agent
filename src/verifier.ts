import { Paper } from "./openalex.js"

export type AccessStatus = "open_access" | "requires_institution" | "unavailable"

export async function verifyDoi(doi: string | null): Promise<boolean> {
  if (!doi) return false

  const url = `https://api.crossref.org/works/${encodeURIComponent(doi)}`

  for (let attempt = 0; attempt < 2; attempt += 1) {
    try {
      const res = await fetch(url, { method: "GET" })
      if (res.ok) {
        return true
      }

      if (res.status === 404) {
        return false
      }
    } catch {
      if (attempt === 1) {
        return false
      }
    }

    await delay(500)
  }

  return false
}

export function determineAccessStatus(paper: Paper): AccessStatus {
  if (paper.isOpenAccess && (paper.pdfUrl || paper.landingPageUrl)) {
    return "open_access"
  }

  if (paper.doi || paper.landingPageUrl) {
    return "requires_institution"
  }

  return "unavailable"
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}
