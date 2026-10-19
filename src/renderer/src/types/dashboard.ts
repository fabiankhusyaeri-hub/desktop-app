/**
 * Dashboard domain types (Module 1 - Workforce Overview).
 *
 * The snapshot returned by the service is the single source of truth for every
 * figure rendered on the Dashboard. Nothing here is view-specific, so the same
 * contract can be served by the mock adapter or by the real REST API.
 */

/** Server time as reported by the backend (ISO-8601 with offset). */
export type ServerTimestamp = string

/** Direction of a KPI trend compared to the previous period. */
export type TrendDirection = 'up' | 'down' | 'flat'

/** Attendance classification decided by the server, never by the client. */
export type AttendanceStatus = 'on-time' | 'late' | 'early' | 'absent' | 'on-leave'

/** Result of the geofence check performed on the server. */
export type GeoStatus = 'verified' | 'outside' | 'unverified'

export interface DashboardMeta {
  /** Server generated-at timestamp. Used to compute the client clock offset. */
  generatedAt: ServerTimestamp
  /** Active shift, rendered in the greeting banner. */
  shift: {
    code: string
    start: string
    end: string
  }
}

export interface MetricTrend {
  value: number
  /** Signed delta versus the reference period (e.g. previous month). */
  delta: number
  direction: TrendDirection
}

export interface DashboardKpi {
  totalEmployees: MetricTrend
  presentToday: {
    value: number
    /** Present / total * 100, rounded to 2 decimals by the server. */
    ratePercent: number
    vsYesterdayPercent: number
  }
  lateToday: {
    value: number
    deltaFromYesterday: number
    sharePercent: number
  }
  absentToday: {
    value: number
    approved: number
    unexcused: number
  }
  currentlyWorking: {
    value: number
  }
}

export interface GeoTelemetry {
  insideGeofence: number
  outsidePerimeter: number
  breach: number
  geofenceRadiusMeters: number
}

export interface WeeklyAttendancePoint {
  /** Short axis label, e.g. "Mon". */
  label: string
  /** ISO date (YYYY-MM-DD) so the view can tell past / current / future points. */
  date: string
  onTime: number
  late: number
  /** True for the bucket that contains the current server date. */
  isNow: boolean
}

export interface StatusSlice {
  key: AttendanceStatus
  label: string
  value: number
  /** Design token reference, e.g. "var(--color-primary)". */
  colorToken: string
}

export interface ShiftCoverageRow {
  department: string
  present: number
  total: number
  colorToken: string
}

export interface AttendanceLogEntry {
  id: string
  employeeId: string
  name: string
  /** Pre-computed initials for the avatar bubble. */
  initials: string
  /** ISO-8601 server timestamp of the check-in event. */
  checkInAt: ServerTimestamp
  status: AttendanceStatus
  geoStatus: GeoStatus
  department: string
  locationLabel: string
  /** Working minutes accumulated so far. */
  workDurationMinutes: number
}

export interface DashboardSnapshot {
  meta: DashboardMeta
  kpi: DashboardKpi
  geo: GeoTelemetry
  weeklyAttendance: WeeklyAttendancePoint[]
  statusBreakdown: StatusSlice[]
  shiftCoverage: ShiftCoverageRow[]
  attendanceLog: AttendanceLogEntry[]
  /** Roll-ups reported by the server for the chart cards. */
  attendanceSummary: {
    /** Completion rate across the compared workdays, e.g. 92.4. */
    averageCompletionPercent: number
  }
}

export type DataSource = 'api' | 'mock'