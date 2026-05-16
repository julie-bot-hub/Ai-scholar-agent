import { ComparedPaper } from "./comparator.js"

export type CriticSeverity = "info" | "warning" | "error"

export type CriticFinding = {
  severity: CriticSeverity
  message: string
}

export type CriticInput = {
  candidatesCount: number
  filteredCount: number
  papers: ComparedPaper[]
}

export function reviewAgentRun(input: CriticInput): CriticFinding[] {
  const findings: CriticFinding[] = []

  if (input.candidatesCount === 0) {
    findings.push({
      severity: "error",
      message: "OpenAlex returned no candidates. The query should be broadened or rewritten."
    })
  }

  if (input.filteredCount === 0) {
    findings.push({
      severity: "error",
      message: "No candidates survived the allowed-journal filter."
    })
  }

  if (input.papers.length === 0) {
    findings.push({
      severity: "error",
      message: "No ranked papers are available for the final report."
    })
  } else if (input.papers.length < 5) {
    findings.push({
      severity: "warning",
      message: `Only ${input.papers.length} ranked papers were found, fewer than the target Top 5.`
    })
  }

  const invalidDoiCount = input.papers.filter((paper) => !paper.doiValid).length
  if (invalidDoiCount > 0) {
    findings.push({
      severity: "warning",
      message: `${invalidDoiCount} ranked paper(s) did not pass Crossref DOI validation.`
    })
  }

  const requiresInstitutionCount = input.papers.filter(
    (paper) => paper.accessStatus === "requires_institution"
  ).length
  if (requiresInstitutionCount > 0) {
    findings.push({
      severity: "info",
      message: `${requiresInstitutionCount} ranked paper(s) may require institutional access for full text.`
    })
  }

  if (findings.length === 0) {
    findings.push({
      severity: "info",
      message: "No critic issues found in this run."
    })
  }

  return findings
}
