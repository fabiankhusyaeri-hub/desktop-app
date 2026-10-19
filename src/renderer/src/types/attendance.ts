/**
 * Attendance domain types (Module 2 - Attendance, Timesheet & GPS Verification).
 *
 * `AttendanceRecord` is the shape consumed by the view; it is produced by the
 * attendance service so the page never owns raw API payloads.
 */

export type AttendanceStatusType = 'present' | 'late' | 'breach' | 'leave' | 'early' | 'absent'

export type VerificationType = 'match' | 'remote' | 'pending' | 'override' | 'leave' | 'unverified'

export type PunchType = 'clock-in' | 'clock-out'

/** Result of a geofence evaluation, always measured on the server in production. */
export type GeofenceStatus = 'inside' | 'outside' | 'borderline'

export interface GeoPoint {
  lat: number
  lng: number
  /** Horizontal accuracy radius in meters, as reported by the platform. */
  accuracy: number
}

/** An allowed work location. Coordinates are never logged or persisted locally. */
export interface AttendanceSite {
  id: string
  name: string
  lat: number
  lng: number
  radiusMeters: number
}

export interface GeofenceDecision {
  status: GeofenceStatus
  /** Great-circle distance to the site centre, in meters. */
  distanceMeters: number
  radiusMeters: number
  /** True when the fix accuracy is too poor to be trusted for a hard decision. */
  lowConfidence: boolean
}

export interface AttendanceRecord {
  id: string
  name: string
  empId: string
  avatar: string
  department: string
  shiftName: string
  shiftSchedule: string
  checkinTime: string
  checkinMethod: string
  checkinMethodIcon: string
  checkoutTime: string
  duration: string
  statusType: AttendanceStatusType
  statusLabel: string
  locationName: string
  locationDistance: string
  verifType: VerificationType
  verifLabel: string
  verifIcon: string
  // Drawer fields
  coords: { lat: number; lng: number }
  toleranceRadius: string
  varianceDetail: string
  terminalNode: string
  deviceBatterySignal: string
  livenessPassed: boolean
  shaProof: string
  notes: string
}

/** Extra fields the page does not render but the drawer / logic rely on. */
export interface AttendanceRecordDetail {
  /** Authoritative server timestamps, ISO-8601. */
  checkInAt: string | null
  checkOutAt: string | null
  /** Working minutes, used by the export rows. */
  durationMinutes: number
  /** Server-measured distance to the assigned site. */
  distanceMeters: number | null
  accuracyMeters: number | null
  insideFence: boolean | null
  siteId: string | null
  /** `YYYY-MM-DD` of the shift, used by the date scope filter. */
  punchDate: string | null
}

export type AttendanceEntry = AttendanceRecord & AttendanceRecordDetail

export interface AttendanceMeta {
  /** Server generated-at timestamp (ISO-8601). */
  generatedAt: string
  expectedShiftStart: string
  gracePeriodMinutes: number
  totalEmployees: number
  /** Organisation-wide counters shown in the filter summary strip. */
  organizationCounts: {
    present: number
    late: number
    absent: number
    leave: number
  }
  punctualityScore: number
  punctualityTrendPercent: number
  attendanceRatePercent: number
  attendanceRateTrendPercent: number
  avgCheckInLabel: string
  workHoursLogged: number
  workHoursExpected: number
}

export interface AttendanceSnapshot {
  meta: AttendanceMeta
  sites: AttendanceSite[]
  records: AttendanceEntry[]
}

export type DateScope = 'Today' | 'Yesterday' | 'This Week' | 'This Month'

/** Payload sent on a clock-in / clock-out action. */
export interface AttendancePunchPayload {
  employeeId: string
  punchType: PunchType
  /** Display timestamp, `YYYY-MM-DD HH:mm:ss`, derived from the server clock. */
  timestamp: string
  /** Machine-readable form of the same moment. */
  timestampIso: string
  coordinates: { lat: number; lng: number; accuracy: number }
  geofence: GeofenceDecision
  siteId: string | null
  deviceId: string | null
  /** Required by the API contract so a retry cannot create a duplicate punch. */
  idempotencyKey: string
}