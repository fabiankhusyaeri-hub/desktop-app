/**
 * Attendance analytics for the Reports page.
 *
 * Everything is computed from the Supabase `attendance` log and the employee
 * directory — no fabricated series. When there are no rows for the window the
 * caller receives `hasData: false` and renders empty states.
 *
 * Aggregation follows the selected toolbar preset (`ReportRange`): every KPI,
 * the donut, the daily bars, the department ranking and the log table are
 * scoped to that window. The trend chart keeps its own fixed four-week window
 * because its caption says "during the past 4 weeks".
 */
import { supabaseService, isSupabaseConfigured } from './supabaseService'
import { fetchDirectorySnapshot } from './employeeService'

export interface ReportWeek {
  /** `Oct 21 (Wk 4)` style label. */
  label: string
  /** `Week 1 (Oct 1 - Oct 7)` style label for the axis. */
  axisLabel: string
  present: number
  ratePct: number
  latePct: number
}

export interface DailyBreak {
  day: string
  onTime: number
  late: number
  absent: number
  pct: number
}

export interface DeptRank {
  name: string
  pct: number
}

export interface DonutBreak {
  presentPct: number
  latePct: number
  absentPct: number
  leavePct: number
  total: number
}

export interface LogRow {
  name: string
  email: string
  empId: string
  avatar: string
  initials: string
  department: string
  /** `Oct 28, 2024` */
  dateLabel: string
  /** `Shift Kolam Renang Tirta Mulya (08:00)` secondary line */
  shiftLabel: string
  checkInLabel: string
  checkOutLabel: string
  hoursLabel: string
  status: 'present' | 'late' | 'leave' | 'mismatch'
  siteLabel: string
}

/** Toolbar date presets. Order defines the calendar-button cycle. */
export type ReportRange = 'today' | 'week' | 'month' | 'q3-2024'

export const REPORT_RANGES: readonly ReportRange[] = ['today', 'week', 'month', 'q3-2024']

/** Log table status tabs. */
export type LogTab = 'all' | 'flagged' | 'geofence'

export const LOG_TABS: readonly LogTab[] = ['all', 'flagged', 'geofence']

export interface LogFilters {
  tab: LogTab
  /** Empty string = all departments. */
  dept: string
  /** Free text matched against name, employee ID, department and site. */
  search: string
}

export interface ReportData {
  hasData: boolean
  /** Current employee directory size. */
  rostered: number
  ratePct: number
  /** Signed delta versus the window that precedes the selected one. */
  rateDelta: number
  presentAvg: number
  capPct: number
  activeToday: number
  latePct: number
  lateDelta: number
  flagged: number
  avgMinutes: number | null
  hoursPct: number
  /** Total overtime hours (beyond 8h/day) across the window. */
  overtimeHours: number
  weeks: ReportWeek[]
  daily: DailyBreak[]
  weeklyAvgPct: number
  depts: DeptRank[]
  donut: DonutBreak
  /** Log table rows for the selected window (newest first). */
  logRows: LogRow[]
  /** Avatar chips for the "Active today" row (employees with a photo). */
  avatarChips: { name: string; avatar: string }[]
}

const DAY_LABELS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
const WORK_HOURS_MINUTES = 480 // 8h standard day
const DAY_MS = 86_400_000

const startOfDay = (date: Date): Date => new Date(date.getFullYear(), date.getMonth(), date.getDate())

const fmtShort = (date: Date): string =>
  date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })

const fmtFull = (date: Date): string =>
  date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })

/* ------------------------------------------------------------------ */
/* Range presets                                                       */
/* ------------------------------------------------------------------ */

export interface ReportWindow {
  start: Date
  end: Date
}

/** Inclusive aggregation window for a toolbar preset. */
export const rangeWindow = (range: ReportRange): ReportWindow => {
  const now = new Date()
  switch (range) {
    case 'today':
      return { start: startOfDay(now), end: now }
    case 'week': {
      const offset = (now.getDay() + 6) % 7 // Mon=0
      return { start: startOfDay(new Date(now.getTime() - offset * DAY_MS)), end: now }
    }
    case 'month':
      return { start: startOfDay(new Date(now.getTime() - 29 * DAY_MS)), end: now }
    case 'q3-2024':
      return { start: new Date(2024, 6, 1), end: new Date(2024, 8, 30, 23, 59, 59, 999) }
  }
}

/** `Nov 16, 2026` for today, `Oct 18 – Nov 16, 2026` for the other presets. */
export const rangeLabelFor = (range: ReportRange, win: ReportWindow = rangeWindow(range)): string =>
  range === 'today'
    ? fmtFull(win.start)
    : `${fmtShort(win.start)} \u2013 ${fmtShort(win.end)}, ${win.end.getFullYear()}`

/** The four Mon–Sun windows ending on the current week, oldest first. */
const weekWindows = (): Array<{ start: Date; end: Date; index: number }> => {
  const now = new Date()
  const offset = (now.getDay() + 6) % 7 // Mon=0
  const thisMonday = startOfDay(new Date(now.getTime() - offset * DAY_MS))
  const windows: Array<{ start: Date; end: Date; index: number }> = []
  for (let i = 3; i >= 0; i -= 1) {
    const start = new Date(thisMonday.getTime() - i * 7 * DAY_MS)
    const end = new Date(start.getTime() + 6 * DAY_MS)
    windows.push({ start, end, index: 4 - i })
  }
  return windows
}

const emptyWeeks = (): ReportWeek[] =>
  weekWindows().map((win) => ({
    label: `${fmtShort(win.start)} (Wk ${win.index})`,
    axisLabel: `Week ${win.index} (${fmtShort(win.start)} - ${fmtShort(win.end)})`,
    present: 0,
    ratePct: 0,
    latePct: 0
  }))

/** Monday–Friday days inside the window (never below 1). */
const workdaysInWindow = (win: ReportWindow): number => {
  const startT = startOfDay(win.start).getTime()
  const endT = startOfDay(win.end).getTime()
  let count = 0
  for (let t = startT; t <= endT; t += DAY_MS) {
    const weekday = new Date(t).getDay()
    if (weekday !== 0 && weekday !== 6) count += 1
  }
  return Math.max(count, 1)
}

/** Weekday indexes (Mon=0 … Sun=6) that occur at least once in the window. */
const coveredWeekdays = (win: ReportWindow): Set<number> => {
  const covered = new Set<number>()
  const startT = startOfDay(win.start).getTime()
  const endT = startOfDay(win.end).getTime()
  for (let t = startT; t <= endT && covered.size < 7; t += DAY_MS) {
    covered.add((new Date(t).getDay() + 6) % 7)
  }
  return covered
}

type PunchKind = 'onTime' | 'late' | 'absent'

const classifyStatus = (status: string | null | undefined): PunchKind => {
  const text = (status ?? '').toLowerCase()
  if (text.includes('late')) return 'late'
  if (text.includes('leave')) return 'absent'
  if (text.includes('outside') || text.includes('radius') || text.includes('absent')) return 'absent'
  return 'onTime'
}

const pct = (numerator: number, denominator: number): number =>
  denominator > 0 ? Math.round((numerator / denominator) * 1000) / 10 : 0

const emptyData = (): ReportData => ({
  hasData: false,
  rostered: 0,
  ratePct: 0,
  rateDelta: 0,
  presentAvg: 0,
  capPct: 0,
  activeToday: 0,
  latePct: 0,
  lateDelta: 0,
  flagged: 0,
  avgMinutes: null,
  hoursPct: 0,
  overtimeHours: 0,
  weeks: emptyWeeks(),
  daily: [],
  weeklyAvgPct: 0,
  depts: [],
  donut: { presentPct: 0, latePct: 0, absentPct: 0, leavePct: 0, total: 0 },
  logRows: [],
  avatarChips: []
})

/** Safe placeholder while the first query is in flight. */
export const createEmptyReportData = (): ReportData => emptyData()

/* ------------------------------------------------------------------ */
/* Log table filtering helpers (shared with the view and the exports)  */
/* ------------------------------------------------------------------ */

const NO_DEPARTMENT_VALUES = new Set(['', '—', '-', 'Unassigned'])

/** Unique department names present in `rows`, sorted alphabetically. */
export const uniqueDepartments = (rows: LogRow[]): string[] => {
  const seen = new Set<string>()
  for (const row of rows) {
    const name = (row.department ?? '').trim()
    if (NO_DEPARTMENT_VALUES.has(name)) continue
    seen.add(name)
  }
  return Array.from(seen).sort((a, b) => a.localeCompare(b))
}

/** Department + free-text search (everything except the status tab). */
export const filterLogBase = (
  rows: LogRow[],
  filters: Pick<LogFilters, 'dept' | 'search'>
): LogRow[] => {
  const dept = filters.dept.trim()
  const needle = filters.search.trim().toLowerCase()
  return rows.filter((row) => {
    if (dept && row.department !== dept) return false
    if (!needle) return true
    return [row.name, row.empId, row.department, row.siteLabel].some((field) =>
      field.toLowerCase().includes(needle)
    )
  })
}

/** Narrow a base list down to the active status tab. */
export const applyLogTab = (rows: LogRow[], tab: LogTab): LogRow[] => {
  if (tab === 'flagged') return rows.filter((row) => row.status === 'late')
  if (tab === 'geofence') return rows.filter((row) => row.status === 'mismatch')
  return rows
}

/** Department, search and status tab in one pass. */
export const filterLogRows = (rows: LogRow[], filters: LogFilters): LogRow[] =>
  applyLogTab(filterLogBase(rows, filters), filters.tab)

/** Counter badges for the three status tabs, given a dept+search base list. */
export const countLogTabs = (base: LogRow[]): Record<LogTab, number> => ({
  all: base.length,
  flagged: base.filter((row) => row.status === 'late').length,
  geofence: base.filter((row) => row.status === 'mismatch').length
})

/* ------------------------------------------------------------------ */
/* Data loading                                                        */
/* ------------------------------------------------------------------ */

const loadEmployees = async (): Promise<any[]> => {
  try {
    const snapshot = await fetchDirectorySnapshot()
    return snapshot?.employees ?? []
  } catch {
    return []
  }
}

const loadAttendance = async (): Promise<any[]> => {
  if (!isSupabaseConfigured()) return []
  const rows = await supabaseService.getAttendance()
  return Array.isArray(rows) ? rows : []
}

export const fetchReportData = async (range: ReportRange = 'month'): Promise<ReportData> => {
  if (!isSupabaseConfigured()) return emptyData()

  const [rawAttendance, employees] = await Promise.all([loadAttendance(), loadEmployees()])
  const rostered = employees.length
  const leaveEmployees = employees.filter(
    (employee) => (employee.attendanceStatus ?? employee.attendance_status) === 'leave'
  ).length

  const win = rangeWindow(range)
  const inWindow = (iso: string | null | undefined, start: Date, end: Date): boolean => {
    if (!iso) return false
    const time = new Date(iso).getTime()
    if (Number.isNaN(time)) return false
    const day = startOfDay(new Date(time)).getTime()
    return day >= startOfDay(start).getTime() && day <= startOfDay(end).getTime()
  }

  /* Rows inside the selected preset window — the source for every module. */
  const windowRows = rawAttendance.filter((row) => inWindow(row.clock_in, win.start, win.end))

  /* The window of equal length that directly precedes the selected one. */
  const spanDays =
    Math.round((startOfDay(win.end).getTime() - startOfDay(win.start).getTime()) / DAY_MS) + 1
  const prevStart = new Date(startOfDay(win.start).getTime() - spanDays * DAY_MS)
  const prevEnd = new Date(startOfDay(win.start).getTime() - 1)
  const previousRows = rawAttendance.filter((row) => inWindow(row.clock_in, prevStart, prevEnd))

  const split = (rows: any[]): { onTime: number; late: number; absent: number } => ({
    onTime: rows.filter((row) => classifyStatus(row.status) === 'onTime').length,
    late: rows.filter((row) => classifyStatus(row.status) === 'late').length,
    absent: rows.filter((row) => classifyStatus(row.status) === 'absent').length
  })

  const current = split(windowRows)
  const previous = split(previousRows)
  const workdays = workdaysInWindow(win)

  const rateOf = (rows: any[]): number =>
    pct(rows.length, rostered > 0 ? rostered * workdays : 1)
  const lateRateOf = (counts: { onTime: number; late: number; absent: number }): number =>
    pct(counts.late, Math.max(counts.late + counts.onTime + counts.absent, 1))

  /* --- Trend chart: fixed four-week window, independent of the preset. --- */
  const windows = weekWindows()
  const weekStats = windows.map((item) => {
    const rows = rawAttendance.filter((row) => inWindow(row.clock_in, item.start, item.end))
    const counts = split(rows)
    const expected = Math.max(rostered * 5, 1)
    return {
      win: item,
      present: rows.length,
      onTime: counts.onTime,
      late: counts.late,
      ratePct: pct(rows.length, rostered > 0 ? expected : 1),
      latePct: pct(counts.late, Math.max(rows.length, 1)),
      label: `${fmtShort(item.start)} (Wk ${item.index})`,
      axisLabel: `Week ${item.index} (${fmtShort(item.start)} - ${fmtShort(item.end)})`
    }
  })

  const ratePct = rateOf(windowRows)
  const rateDelta = Math.round((ratePct - rateOf(previousRows)) * 10) / 10
  const presentAvg = Math.round((windowRows.length / workdays) * 10) / 10
  const capPct = Math.min(100, pct(windowRows.length, rostered))

  const todayRows = rawAttendance.filter((row) =>
    inWindow(row.clock_in, startOfDay(new Date()), new Date())
  )

  const flagged = windowRows.filter(
    (row) =>
      row.is_inside_geofence === false ||
      String(row.status ?? '').toLowerCase().includes('outside') ||
      String(row.status ?? '').toLowerCase().includes('late')
  ).length

  const durations = windowRows
    .map((row) => row.duration_minutes)
    .filter((minutes): minutes is number => typeof minutes === 'number' && minutes > 0)
  const totalOvertimeMinutes = durations.reduce(
    (sum, value) => sum + Math.max(0, value - WORK_HOURS_MINUTES),
    0
  )
  const avgMinutes =
    durations.length > 0
      ? Math.round(durations.reduce((sum, value) => sum + value, 0) / durations.length)
      : null

  /* --- Daily Mon–Fri breakdown over the selected window. --- */
  const covered = coveredWeekdays(win)
  const daily: DailyBreak[] = DAY_LABELS.slice(0, 5).map((day, i) => {
    if (!covered.has(i)) {
      // The window never reaches this weekday — show "—", not a fake absence.
      return { day, onTime: 0, late: 0, absent: 0, pct: 0 }
    }
    const weekdayRows = windowRows.filter((row) => {
      const time = new Date(row.clock_in ?? '').getTime()
      if (Number.isNaN(time)) return false
      return (new Date(time).getDay() + 6) % 7 === i
    })
    const onTime = weekdayRows.filter((row) => classifyStatus(row.status) === 'onTime').length
    const late = weekdayRows.filter((row) => classifyStatus(row.status) === 'late').length
    const logged = weekdayRows.length
    const absent = Math.max(0, rostered - logged)
    return {
      day,
      onTime,
      late,
      absent,
      pct: pct(logged, Math.max(rostered, 1))
    }
  })

  const loggedWeekdays = daily.filter((day) => day.onTime + day.late > 0).length
  const weeklyAvgPct =
    loggedWeekdays > 0 ? Math.round((daily.reduce((sum, d) => sum + d.pct, 0) / loggedWeekdays) * 10) / 10 : 0

  /* --- Department compliance over the selected window. --- */
  const byDept = new Map<string, { onTime: number; total: number }>()
  for (const row of windowRows) {
    const department = row.employees?.department ?? 'Unassigned'
    const entry = byDept.get(department) ?? { onTime: 0, total: 0 }
    entry.total += 1
    if (classifyStatus(row.status) === 'onTime') entry.onTime += 1
    byDept.set(department, entry)
  }
  const deptEntries = Array.from(byDept.entries()).filter(([, entry]) => entry.total > 0)
  const depts: DeptRank[] = deptEntries
    .map(([name, entry]) => ({ name, pct: pct(entry.onTime, Math.max(entry.total, 1)) }))
    .filter((item) => item.name !== 'Unassigned' && item.name !== '—')
    .sort((a, b) => b.pct - a.pct)
    .slice(0, 5)

  const totalForDonut = windowRows.length
  const donut: DonutBreak = {
    presentPct: pct(current.onTime, Math.max(totalForDonut, 1)),
    latePct: pct(current.late, Math.max(totalForDonut, 1)),
    absentPct: pct(current.absent, Math.max(totalForDonut, 1)),
    leavePct: pct(leaveEmployees, Math.max(rostered, 1)),
    total: totalForDonut
  }

  const hasData = windowRows.length > 0

  /* Log table rows — newest first, the full window (the view paginates). */
  const fmtDate = (iso: string | null): string => {
    if (!iso) return '—'
    const date = new Date(iso)
    return Number.isNaN(date.getTime())
      ? '—'
      : date.toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })
  }
  const fmtClock = (iso: string | null): string => {
    if (!iso) return '—'
    const date = new Date(iso)
    return Number.isNaN(date.getTime())
      ? '—'
      : date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })
  }
  const initialsOf = (name: string): string =>
    name
      .split(' ')
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0])
      .join('')
      .toUpperCase()

  const kindOf = (row: any): LogRow['status'] => {
    if (row.is_inside_geofence === false) return 'mismatch'
    if (classifyStatus(row.status) === 'late') return 'late'
    if (classifyStatus(row.status) === 'absent') return 'leave'
    return 'present'
  }

  const logRows: LogRow[] = windowRows.map((row) => {
    const employee = row.employees ?? {}
    const clockIn = row.clock_in ?? null
    const clockOut = row.clock_out ?? null
    const minutes =
      clockIn && clockOut
        ? Math.max(0, Math.round((new Date(clockOut).getTime() - new Date(clockIn).getTime()) / 60_000))
        : (row.duration_minutes ?? null)
    const hours =
      minutes != null && clockIn && clockOut
        ? `${Math.floor(minutes / 60)}h ${String(minutes % 60).padStart(2, '0')}m`
        : '0h 00m'
    const site = employee.geofence ?? '—'
    return {
      name: employee.name ?? '—',
      email: employee.email ?? '',
      empId: employee.emp_id ?? row.employee_id ?? '—',
      avatar: employee.avatar ?? '',
      initials: initialsOf(employee.name ?? '?'),
      department: employee.department ?? '—',
      dateLabel: fmtDate(clockIn),
      shiftLabel: `Shift ${site} (${fmtClock(clockIn)})`,
      checkInLabel: fmtClock(clockIn),
      checkOutLabel: clockOut ? fmtClock(clockOut) : '—',
      hoursLabel: clockOut ? hours : '—',
      status: kindOf(row),
      siteLabel: row.is_inside_geofence === false ? `${site} • Boundary Drift` : `${site} • GPS Verified`
    }
  })

  return {
    hasData,
    rostered,
    ratePct,
    rateDelta,
    presentAvg,
    capPct,
    activeToday: todayRows.length,
    latePct: lateRateOf(current),
    lateDelta: Math.round((lateRateOf(current) - lateRateOf(previous)) * 10) / 10,
    flagged,
    avgMinutes,
    hoursPct: avgMinutes != null ? Math.round((avgMinutes / WORK_HOURS_MINUTES) * 1000) / 10 : 0,
    overtimeHours: totalOvertimeMinutes / 60 >= 1 ? Math.round(totalOvertimeMinutes / 60) : 0,
    weeks: weekStats.map((week) => ({
      label: week.label,
      axisLabel: week.axisLabel,
      present: week.present,
      ratePct: week.ratePct,
      latePct: week.latePct
    })),
    daily,
    weeklyAvgPct,
    depts,
    donut,
    logRows,
    avatarChips: employees
      .filter((employee) => typeof employee.avatar === 'string' && employee.avatar !== '')
      .slice(0, 3)
      .map((employee) => ({ name: employee.name, avatar: employee.avatar }))
  }
}
