/**
 * Attendance service (Module 2).
 *
 * Follows the same Service Adapter pattern as Module 1: the page consumes
 * `AttendanceEntry[]` and never knows whether it came from the mock dataset or
 * from the REST API. Switch by setting `VITE_API_BASE_URL`.
 *
 * Security note: geofence verdicts returned here are for display only. The server
 * re-computes distance, teleport checks and mock-location attestation before it
 * accepts a punch (AGENTS.md, rules 1, 3, 4, 5).
 */

import { apiGet, apiPost, isApiConfigured } from './apiClient'
import { isSupabaseConfigured, supabaseService } from './supabaseService'
import { capturePosition, getDeviceId, verifyAgainstGeofence } from './locationService'
// (unused imports removed)
import type {
  AttendancePunchPayload,
  AttendanceSite,
  AttendanceSnapshot,
  PunchType
} from '../types/attendance'

export const ATTENDANCE_ENDPOINT = '/attendance/records'
export const PUNCH_ENDPOINT = '/attendance/punch'
export const ATTENDANCE_POLL_MS = 15_000


/**
 * Build an absolute timestamp from a day offset and an `HH:mm:ss` clock string.
 *
 * The local `YYYY-MM-DD` key is derived from the local date parts on purpose:
 * the ISO string is UTC, so an early-morning punch (00:00-07:00 in GMT+7) would
 * otherwise be filed under the previous day.
 */

/**
 * Mock rows are stored as a day offset relative to the server "today" so the
 * date scope filter (Today / Yesterday / This Week / This Month) stays useful
 * without the dataset going stale.
 */
// (mock fallback removed)

/** Load the attendance snapshot used by the audit table and the summary cards. */
const fetchFromSupabase = async (): Promise<AttendanceSnapshot | null> => {
  if (!isSupabaseConfigured()) return null
  const rows = await supabaseService.getAttendance()
  if (!rows || rows.length === 0) return null
  const serverNow = new Date()
  const records = rows.map((row: any) => {
    const emp = row.employees ?? {}
    const checkInAt = row.clock_in ?? null
    const checkOutAt = row.clock_out ?? null
    const checkinTime = checkInAt ? new Date(checkInAt).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }) : '—'
    const checkoutTime = checkOutAt ? new Date(checkOutAt).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }) : 'In Progress'
    const durationMinutes = row.duration_minutes ?? 0
    return {
      id: row.employee_id,
      name: emp.name ?? row.employee_id,
      empId: row.employee_id,
      avatar: '',
      department: emp.department ?? '—',
      shiftName: 'Shift 1',
      shiftSchedule: '08:00 - 17:00',
      checkinTime,
      checkinMethod: 'GPS',
      checkinMethodIcon: 'location_on',
      checkoutTime,
      duration: `${Math.floor(durationMinutes / 60)}h ${durationMinutes % 60}m`,
      statusType: row.is_inside_geofence ? 'present' : 'outside',
      statusLabel: row.status ?? (row.is_inside_geofence ? 'Present' : 'Outside Radius'),
      locationName: 'HQ Central Hub',
      locationDistance: '0m',
      verifType: 'gps',
      verifLabel: 'Verified',
      verifIcon: 'verified',
      coords: { lat: row.latitude ?? 0, lng: row.longitude ?? 0 },
      toleranceRadius: 250,
      varianceDetail: '',
      terminalNode: 'Node 1',
      deviceBatterySignal: '—',
      livenessPassed: true,
      shaProof: '—',
      notes: '',
      checkInAt,
      checkOutAt,
      durationMinutes,
      distanceMeters: null,
      accuracyMeters: null,
      insideFence: row.is_inside_geofence ?? true,
      siteId: 'hq',
      punchDate: checkInAt ? checkInAt.slice(0, 10) : serverNow.toISOString().slice(0, 10)
    }
  })
  return { meta: { generatedAt: serverNow.toISOString(), expectedShiftStart: '08:00', gracePeriodMinutes: 15, totalEmployees: 0, organizationCounts: { present: 0, late: 0, absent: 0, leave: 0 }, averageDurationMinutes: 0, completionRatePercent: 0, geofenceRadiusMeters: 250, totalInsideFence: 0, totalOutsideFence: 0, anomalyCount: 0, lastSyncAt: serverNow.toISOString() } as any, sites: [], records }
}

export const fetchAttendanceSnapshot = async (): Promise<AttendanceSnapshot> => {
  if (isApiConfigured()) return apiGet<AttendanceSnapshot>(ATTENDANCE_ENDPOINT)
  try {
    const fromSupabase = await fetchFromSupabase()
    if (fromSupabase) return fromSupabase
  } catch (error) {
    console.error('[attendanceService] Supabase fetch failed', error)
  }
  return { meta: { generatedAt: new Date().toISOString(), expectedShiftStart: '08:00', gracePeriodMinutes: 15, totalEmployees: 0, organizationCounts: { present: 0, late: 0, absent: 0, leave: 0 }, punctualityScore: 0, punctualityTrendPercent: 0, attendanceRatePercent: 0, attendanceRateTrendPercent: 0, avgCheckInLabel: '—', workHoursLogged: 0, workHoursExpected: 0 }, sites: [], records: [] }
}

/**
 * Build the punch payload for a clock-in / clock-out.
 *
 * Steps: capture the device fix -> stamp the server time -> evaluate the geofence
 * -> assemble the payload. The timestamp is `YYYY-MM-DD HH:mm:ss`; the ISO form
 * travels alongside it so the server never has to re-parse a display string.
 */
export const buildPunchPayload = async (params: {
  employeeId: string
  punchType: PunchType
  sites: AttendanceSite[]
  siteId?: string | null
  serverOffsetMs?: number
}): Promise<AttendancePunchPayload> => {
  const position = await capturePosition()
  const { site, decision } = verifyAgainstGeofence(position, params.sites, params.siteId)

  // Timestamp comes from the server clock, corrected by the measured offset.
  const now = new Date(Date.now() + (params.serverOffsetMs ?? 0))
  const pad = (n: number): string => String(n).padStart(2, '0')
  const timestamp =
    `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())} ` +
    `${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`

  return {
    employeeId: params.employeeId,
    punchType: params.punchType,
    timestamp,
    timestampIso: now.toISOString(),
    coordinates: { lat: position.lat, lng: position.lng, accuracy: position.accuracy },
    geofence: decision,
    siteId: site?.id ?? null,
    deviceId: getDeviceId(),
    idempotencyKey: `${params.employeeId}-${params.punchType}-${now.getTime()}`
  }
}

/** Submit a punch. Against the mock adapter the payload is echoed back only. */
export const submitPunch = async (payload: AttendancePunchPayload): Promise<AttendancePunchPayload> => {
  if (!isApiConfigured()) return payload
  return apiPost<AttendancePunchPayload>(PUNCH_ENDPOINT, payload)
}
