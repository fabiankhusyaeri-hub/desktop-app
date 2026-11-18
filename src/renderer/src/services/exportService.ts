/**
 * Client-side export helper.
 *
 * Builds the file in memory and triggers a download through a temporary object
 * URL, so no Node/Electron file API is needed and the same code works in a
 * browser. Nothing sensitive (coordinates, tokens) is written to disk here.
 */

export type ExportRow = Record<string, string | number>

const toCsvCell = (value: string | number): string => {
  const text = String(value ?? '')
  return /[",\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text
}

export const rowsToCsv = (rows: ExportRow[]): string => {
  if (rows.length === 0) return ''
  const headers = Object.keys(rows[0])
  const lines = [headers.join(',')]
  rows.forEach((row) => lines.push(headers.map((key) => toCsvCell(row[key])).join(',')))
  return lines.join('\n')
}

const triggerDownload = (filename: string, mime: string, content: string): void => {
  const blob = new Blob([content], { type: `${mime};charset=utf-8;` })
  const url = URL.createObjectURL(blob)
  const anchor = document.createElement('a')
  anchor.href = url
  anchor.download = filename
  document.body.appendChild(anchor)
  anchor.click()
  document.body.removeChild(anchor)
  // Revoke on the next tick so the download has started.
  window.setTimeout(() => URL.revokeObjectURL(url), 1000)
}

const stamp = (): string => {
  const now = new Date()
  const pad = (v: number): string => String(v).padStart(2, '0')
  return (
    `${now.getFullYear()}${pad(now.getMonth() + 1)}${pad(now.getDate())}` +
    `-${pad(now.getHours())}${pad(now.getMinutes())}`
  )
}

export const downloadCsv = (baseName: string, rows: ExportRow[]): string => {
  const filename = `${baseName}-${stamp()}.csv`
  triggerDownload(filename, 'text/csv', rowsToCsv(rows))
  return filename
}

const escapeCell = (value: string | number): string =>
  String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')

/**
 * Excel-compatible workbook written as an HTML table.
 *
 * Excel (and LibreOffice) open `.xls` files that contain a real `<table>`, so
 * no spreadsheet library is needed. Kept as `.xls` — never as `.xlsx`, which
 * would not be a valid OOXML package.
 */
export const rowsToXls = (rows: ExportRow[]): string => {
  if (rows.length === 0) return '<html><body></body></html>'
  const headers = Object.keys(rows[0])
  const head = headers.map((key) => `<th>${escapeCell(key)}</th>`).join('')
  const body = rows
    .map((row) => `<tr>${headers.map((key) => `<td>${escapeCell(row[key])}</td>`).join('')}</tr>`)
    .join('')
  return (
    '<html xmlns:x="urn:schemas-microsoft-com:office:excel">' +
    '<head><meta charset="utf-8"></head>' +
    `<body><table border="1"><thead><tr>${head}</tr></thead><tbody>${body}</tbody></table></body></html>`
  )
}

export const downloadXls = (baseName: string, rows: ExportRow[]): string => {
  const filename = `${baseName}-${stamp()}.xls`
  triggerDownload(filename, 'application/vnd.ms-excel', rowsToXls(rows))
  return filename
}

export const downloadJson = (baseName: string, payload: unknown): string => {
  const filename = `${baseName}-${stamp()}.json`
  triggerDownload(filename, 'application/json', JSON.stringify(payload, null, 2))
  return filename
}

/** Human readable file size, used in the confirmation toast. */
export const describeFile = (rows: ExportRow[]): string => {
  const bytes = new Blob([rowsToCsv(rows)]).size
  return bytes > 1024 ? `${(bytes / 1024).toFixed(1)} KB` : `${bytes} B`
}