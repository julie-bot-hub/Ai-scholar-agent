export const JOURNALS = {
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
} as const

export type DomainKey = keyof typeof JOURNALS
