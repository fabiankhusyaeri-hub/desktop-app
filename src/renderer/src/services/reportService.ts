/**
 * Attendance analytics for the Reports page.
 *
 * Everything is computed from the Supabase `attendance` log and the employee
 * directory — no fabricated series. When there are no rows for the window the
 * caller receives `hasData: false` and renders empty states.
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
  /** `Shift HQ Central Hub (08:00)` secondary line */
  shiftLabel: string
  checkInLabel: string
  checkOutLabel: string
  hoursLabel: string
  status: 'present' | 'late' | 'leave' | 'mismatch'
  siteLabel: string
}

export interface ReportData {
  hasData: boolean
  /** Current employee directory size. */
  rostered: number
  ratePct: number
  /** Signed week-over-week delta, percentage points. */
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
  deptCount: number
  rangeLabel: string
  /** Log table rows (newest first, up to 5). */
  logRows: LogRow[]
  logCounts: { all: number; late: number; mismatch: number }
  /** Avatar chips for the "Active today" row (employees with a photo). */
  avatarChips: { name: string; avatar: string }[]
}

const DAY_LABELS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
const WORK_HOURS_MINUTES = 480 // 8h standard day

const startOfDay = (date: Date): Date => new Date(date.getFullYear(), date.getMonth(), date.getDate())

const fmtShort = (date: Date): string =>
  date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })

/** The last four Mon–Sun windows, oldest first (chart axis order). */
const weekWindows = (): Array<{ start: Date; end: Date; index: number }> => {
  const now = new Date()
  const offset = (now.getDay() + 6) % 7 // Mon=0
  const thisMonday = startOfDay(new Date(now.getTime() - offset * 86_400_000))
  const windows: Array<{ start: Date; end: Date; index: number }> = []
  for (let i = 3; i >= 0; i -= 1) {
    const start = new Date(thisMonday.getTime() - i * 7 * 86_400_000)
    const end = new Date(start.getTime() + 6 * 86_400_000)
    windows.push({ start, end, index: 4 - i })
  }
  return windows
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
  weeks: [],
  daily: [],
  weeklyAvgPct: 0,
  depts: [],
  donut: { presentPct: 0, latePct: 0, absentPct: 0, leavePct: 0, total: 0 },
  deptCount: 0,
  rangeLabel: '—',
  logRows: [],
  logCounts: { all: 0, late: 0, mismatch: 0 },
  avatarChips: []
})

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

export const fetchReportData = async (): Promise<ReportData> => {
  if (!isSupabaseConfigured()) return emptyData()

  const [rawAttendance, employees] = await Promise.all([loadAttendance(), loadEmployees()])
  const rostered = employees.length
  const leaveEmployees = employees.filter(
    (employee) => (employee.attendanceStatus ?? employee.attendance_status) === 'leave'
  ).length

  const windows = weekWindows()
  const inWindow = (iso: string | null | undefined, start: Date, end: Date): boolean => {
    if (!iso) return false
    const time = new Date(iso).getTime()
    if (Number.isNaN(time)) return false
    const day = startOfDay(new Date(time)).getTime()
    return day >= startOfDay(start).getTime() && day <= startOfDay(end).getTime()
  }

  const weekStats = windows.map((win) => {
    const rows = rawAttendance.filter((row) => inWindow(row.clock_in, win.start, win.end))
    const onTime = rows.filter((row) => classifyStatus(row.status) === 'onTime').length
    const late = rows.filter((row) => classifyStatus(row.status) === 'late').length
    const expected = Math.max(rostered * 5, 1)
    return {
      win,
      present: rows.length,
      onTime,
      late,
      ratePct: pct(rows.length, rostered > 0 ? expected : 1),
      latePct: pct(late, Math.max(rows.length, 1)),
      leavePct: pct(leaveEmployees, Math.max(rostered, 1)),
      label: `${fmtShort(win.start)} (Wk ${win.index})`,
      axisLabel: `Week ${win.index} (${fmtShort(win.start)} - ${fmtShort(win.end)})`
    }
  })

  /* weekStats is already ordered oldest → newest (Wk 1 → Wk 4). */

  const newest = weekStats[weekStats.length - 1]
  const previous = weekStats[weekStats.length - 2] ?? newest

  const totalLogged = rawAttendance.filter((row) => inWindow(row.clock_in, windows[0].start, windows[3].end))
  const overallLate = totalLogged.filter((row) => classifyStatus(row.status) === 'late').length
  const overallAbsent = totalLogged.filter((row) => classifyStatus(row.status) === 'absent').length
  const overallOnTime = totalLogged.filter((row) => classifyStatus(row.status) === 'onTime').length

  const ratePct = pct(totalLogged.length, rostered > 0 ? rostered * 20 : 1)
  const rateDelta = Math.round((newest.ratePct - previous.ratePct) * 10) / 10
  const workdayCount = 5
  const presentAvg = Math.round((totalLogged.length / Math.max(workdayCount, 1)) * 10) / 10
  const capPct = Math.min(100, pct(totalLogged.length, rostered))

  const todayRows = rawAttendance.filter((row) =>
    inWindow(row.clock_in, startOfDay(new Date()), new Date())
  )

  const flagged = rawAttendance.filter(
    (row) =>
      (row.is_inside_geofence === false ||
        String(row.status ?? '').toLowerCase().includes('outside') ||
        String(row.status ?? '').toLowerCase().includes('late')) &&
      inWindow(row.clock_in, windows[0].start, windows[3].end)
  ).length

  const durations = totalLogged
    .map((row) => row.duration_minutes)
    .filter((minutes): minutes is number => typeof minutes === 'number' && minutes > 0)
  const avgMinutes =
    durations.length > 0
      ? Math.round(durations.reduce((sum, value) => sum + value, 0) / durations.length)
      : null

  /* Mon–Fri breakdown of the newest week. */
  const daily: DailyBreak[] = DAY_LABELS.slice(0, 5).map((day, i) => {
    const weekdayRows = rawAttendance.filter((row) => {
      const time = new Date(row.clock_in ?? '').getTime()
      if (Number.isNaN(time)) return false
      if ((new Date(time).getDay() + 6) % 7 !== i) return false
      return inWindow(row.clock_in, newest.win.start, newest.win.end)
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
  const weeklyAvgPct = loggedWeekdays > 0 ? Math.round((daily.reduce((sum, d) => sum + d.pct, 0) / loggedWeekdays) * 10) / 10 : 0

  /* Department compliance (last 4 weeks). */
  const byDept = new Map<string, { onTime: number; total: number }>()
  for (const row of totalLogged) {
    const department = row.employees?.department ?? 'Unassigned'
    const entry = byDept.get(department) ?? { onTime: 0, total: 0 }
    entry.total += 1
    if (classifyStatus(row.status) === 'onTime') entry.onTime += 1
    byDept.set(department, entry)
  }
  const deptEntries = Array.from(byDept.entries()).filter(
    ([, entry]) => entry.total > 0
  )
  const depts: DeptRank[] = deptEntries
    .map(([name, entry]) => ({ name, pct: pct(entry.onTime, Math.max(entry.total, 1)) }))
    .filter((item) => item.name !== 'Unassigned')
    .sort((a, b) => b.pct - a.pct)
    .slice(0, 5)

  const totalForDonut = totalLogged.length
  const donut: DonutBreak = {
    presentPct: pct(overallOnTime, Math.max(totalForDonut, 1)),
    latePct: pct(overallLate, Math.max(totalForDonut, 1)),
    absentPct: pct(overallAbsent, Math.max(totalForDonut, 1)),
    leavePct: pct(leaveEmployees, Math.max(rostered, 1)),
    total: totalForDonut
  }

  const hasData = totalLogged.length > 0
  const rangeLabel =
    hasData && rostered > 0
      ? `${fmtShort(windows[0].start)} – ${fmtShort(windows[3].end)}, ${windows[3].end.getFullYear()}`
      : '—'

  /* Log table rows — newest first. */
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

  const logRows: LogRow[] = rawAttendance.slice(0, 5).map((row) => {
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
    latePct: pct(overallLate, Math.max(totalLogged.length, 1)),
    lateDelta: Math.round((newest.latePct - previous.latePct) * 10) / 10,
    flagged,
    avgMinutes,
    hoursPct: avgMinutes != null ? Math.round((avgMinutes / WORK_HOURS_MINUTES) * 1000) / 10 : 0,
    overtimeHours:
      durations.reduce((sum, value) => sum + Math.max(0, value - WORK_HOURS_MINUTES), 0) / 60 >= 1
        ? Math.round(durations.reduce((sum, value) => sum + Math.max(0, value - WORK_HOURS_MINUTES), 0) / 60)
        : 0,
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
    deptCount: deptEntries.filter(([name]) => name !== 'Unassigned').length,
    rangeLabel,
    logRows,
    logCounts: {
      all: rawAttendance.length,
      late: rawAttendance.filter((row) => classifyStatus(row.status) === 'late').length,
      mismatch: rawAttendance.filter((row) => row.is_inside_geofence === false).length
    },
    avatarChips: employees
      .filter((employee) => typeof employee.avatar === 'string' && employee.avatar !== '')
      .slice(0, 3)
      .map((employee) => ({ name: employee.name, avatar: employee.avatar }))
  }
}
