import { access, readFile } from "node:fs/promises"
import { constants as fsConstants } from "node:fs"
import path from "node:path"
import xlsx from "xlsx"

export type JournalUniverse = Record<"marketing" | "is" | "management", string[]>

const FALLBACK_JOURNALS: JournalUniverse = {
  marketing: [
    "Journal of Marketing Research",
    "Journal of Consumer Research",
    "Marketing Science",
    "Journal of Marketing",
    "Journal of Retailing",
    "Journal of Product Innovation Management",
    "Journal of Consumer Psychology",
    "Journal of the Academy of Marketing Science"
  ],
  is: [
    "MIS Quarterly",
    "Information Systems Research",
    "Journal of Management Information Systems",
    "Information & Management",
    "Decision Support Systems",
    "Journal of AIS"
  ],
  management: [
    "Academy of Management Review",
    "Academy of Management Journal",
    "Administrative Science Quarterly",
    "Strategic Management Journal",
    "Journal of Management",
    "Organization Science"
  ]
}

export const JOURNALS: JournalUniverse = await loadJournalUniverse()

export type DomainKey = keyof JournalUniverse

async function loadJournalUniverse(): Promise<JournalUniverse> {
  const xlsxPath = new URL("../data/journals.xlsx", import.meta.url)
  if (await exists(xlsxPath)) {
    const workbook = xlsx.readFile(path.normalize(xlsxPath.pathname))
    const parsed = parseWorkbook(workbook)
    if (parsed) {
      return parsed
    }
  }

  try {
    const url = new URL("../data/journals.json", import.meta.url)
    const raw = await readFile(url, "utf8")
    const parsed = JSON.parse(raw) as JournalUniverse
    return normalizeJournalUniverse(parsed)
  } catch {
    return FALLBACK_JOURNALS
  }
}

async function exists(url: URL): Promise<boolean> {
  try {
    await access(path.normalize(url.pathname), fsConstants.F_OK)
    return true
  } catch {
    return false
  }
}

function parseWorkbook(workbook: xlsx.WorkBook): JournalUniverse | null {
  const sheetNames = workbook.SheetNames
  const sheetBased = parseSheetBasedUniverse(workbook, sheetNames)
  if (sheetBased) {
    return sheetBased
  }

  const columnBased = parseColumnBasedUniverse(workbook, sheetNames)
  if (columnBased) {
    return columnBased
  }

  return null
}

function parseSheetBasedUniverse(
  workbook: xlsx.WorkBook,
  sheetNames: string[]
): JournalUniverse | null {
  const domains: Partial<Record<keyof JournalUniverse, string[]>> = {}

  for (const domain of Object.keys(FALLBACK_JOURNALS) as Array<keyof JournalUniverse>) {
    const sheetName = sheetNames.find((name) => name.toLowerCase() === domain)
    if (!sheetName) {
      continue
    }

    const rows = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName], {
      header: 1,
      blankrows: false
    }) as unknown as unknown[][]
    const journals = extractJournalNames(rows)
    if (journals.length > 0) {
      domains[domain] = journals
    }
  }

  return hasAllDomains(domains) ? normalizeJournalUniverse(domains as JournalUniverse) : null
}

function parseColumnBasedUniverse(
  workbook: xlsx.WorkBook,
  sheetNames: string[]
): JournalUniverse | null {
  for (const sheetName of sheetNames) {
    const rows = xlsx.utils.sheet_to_json<Record<string, unknown>>(workbook.Sheets[sheetName], {
      blankrows: false
    })

    if (rows.length === 0) {
      continue
    }

    const headers = Object.keys(rows[0] ?? {})
    const hasDomainHeaders = (Object.keys(FALLBACK_JOURNALS) as Array<keyof JournalUniverse>).every(
      (domain) => headers.some((header) => header.toLowerCase() === domain)
    )

    if (!hasDomainHeaders) {
      continue
    }

    const universe = {
      marketing: extractColumn(rows, "marketing"),
      is: extractColumn(rows, "is"),
      management: extractColumn(rows, "management")
    }

    if (hasAllDomains(universe)) {
      return normalizeJournalUniverse(universe)
    }
  }

  return null
}

function extractColumn(rows: Array<Record<string, unknown>>, key: string): string[] {
  const values = rows
    .map((row) => row[key])
    .flatMap((value) => normalizeCell(value))
    .filter(Boolean)

  return unique(values)
}

function extractJournalNames(rows: unknown[][]): string[] {
  const values = rows
    .flatMap((row) => row.slice())
    .flatMap((cell) => normalizeCell(cell))
    .filter(Boolean)

  return unique(values)
}

function normalizeCell(value: unknown): string[] {
  if (typeof value !== "string") {
    return []
  }

  return value
    .split(/[\n,;]/)
    .map((item) => item.trim())
    .filter(Boolean)
}

function unique(values: string[]): string[] {
  return [...new Set(values)]
}

function hasAllDomains(
  universe: Partial<Record<keyof JournalUniverse, string[]>>
): universe is JournalUniverse {
  return Boolean(universe.marketing?.length && universe.is?.length && universe.management?.length)
}

function normalizeJournalUniverse(universe: JournalUniverse): JournalUniverse {
  return {
    marketing: unique(universe.marketing.map((journal) => journal.trim())),
    is: unique(universe.is.map((journal) => journal.trim())),
    management: unique(universe.management.map((journal) => journal.trim()))
  }
}
