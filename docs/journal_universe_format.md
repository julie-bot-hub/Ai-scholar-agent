# Journal Universe Format

The agent loads the allowed journal universe in this order:

1. `data/journals.xlsx`
2. `data/journals.json`
3. Built-in fallback data in `src/journals.ts`

## Supported XLSX Layouts

### Sheet per domain

Use one sheet named `marketing`, `is`, or `management`.
Put journal names anywhere in the sheet as plain text cells.

### Single sheet with domain columns

Use one sheet with columns named `marketing`, `is`, and `management`.
Each row may contain a journal name in one or more domain columns.

## Cell Rules

- One journal per cell is preferred.
- Comma-separated or newline-separated journal lists are also accepted.
- Empty cells are ignored.
- Duplicate names are deduplicated after normalization.
