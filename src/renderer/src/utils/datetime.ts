/**
 * Date/time helpers for the Dashboard.
 *
 * Rule: attendance timestamps are rendered from the SERVER clock, never from the
 * machine clock. `nowServer()` re-bases `Date.now()` with the offset measured on
 * the last snapshot, so a skewed workstation clock cannot shift displayed times.
 */

const pad = (value: number, length = 2): string => String(value).padStart(length, '0')

/** Current time corrected by the measured server offset. */
export const nowServer = (offsetMs = 0): Date => new Date(Date.now() + offsetMs)

/**
 * Format as `YYYY-MM-DD HH:mm:ss`.
 * Accepts ISO-8601 strings, epoch numbers, or Date instances.
 */
export const formatTimestamp = (
  input: string | number | Date,
  offsetMs = 0
): string => {
  const date = input instanceof Date ? new Date(input.getTime() + offsetMs) : new Date(input)
  if (Number.isNaN(date.getTime())) return '-'
  return (
    `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ` +
    `${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`
  )
}

/** Format as `YYYY-MM-DD` only (used for chart buckets). */
export const formatDateOnly = (input: string | number | Date, offsetMs = 0): string => {
  const date = input instanceof Date ? new Date(input.getTime() + offsetMs) : new Date(input)
  if (Number.isNaN(date.getTime())) return '-'
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`
}

/** Long, human readable date, e.g. `Thursday, October 24, 2024`. */
export const formatLongDate = (input: string | number | Date, offsetMs = 0): string => {
  const date = input instanceof Date ? new Date(input.getTime() + offsetMs) : new Date(input)
  if (Number.isNaN(date.getTime())) return '-'
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  })
}

/** Minutes to `2h 41m`. */
export const formatDuration = (minutes: number): string => {
  const safe = Math.max(0, Math.round(minutes))
  const h = Math.floor(safe / 60)
  const m = safe % 60
  return h > 0 ? `${h}h ${m}m` : `${m}m`
}

/** Percentage with a single decimal, e.g. `92.4%`. */
export const formatPercent = (
  value: number,
  fractionDigits = 1,
  /** `floor` truncates instead of rounding, matching the published mock figures. */
  mode: 'round' | 'floor' = 'round'
): string => {
  const factor = 10 ** fractionDigits
  const adjusted = mode === 'floor' ? Math.floor(value * factor) / factor : value
  return `${adjusted.toFixed(fractionDigits)}%`
}

/** Signed percentage for comparison labels, e.g. `+3.2%`. */
export const formatSignedPercent = (value: number, fractionDigits = 1): string =>
  `${value > 0 ? '+' : ''}${value.toFixed(fractionDigits)}%`

/** Thousands separator for head-count figures. */
export const formatCount = (value: number): string =>
  value.toLocaleString('en-US', { maximumFractionDigits: 0 })

/** Local `YYYY-MM-DD` key used to bucket a date for comparison. */
export const toDateKey = (date: Date): string => formatDateOnly(date)