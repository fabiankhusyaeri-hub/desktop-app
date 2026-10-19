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

import mockSnapshot from './mock/attendance.mock.json'
import { apiGet, apiPost, isApiConfigured } from './apiClient'
import { capturePosition, getDeviceId, verifyAgainstGeofence } from './locationService'
import { formatDuration } from '../utils/datetime'
import type {
  AttendanceEntry,
  AttendancePunchPayload,
  AttendanceRecord,
  AttendanceSite,
  AttendanceSnapshot,
  AttendanceStatusType,
  GeoPoint,
  PunchType,
  VerificationType
} from '../types/attendance'

export const ATTENDANCE_ENDPOINT = '/attendance/records'
export const PUNCH_ENDPOINT = '/attendance/punch'
export const ATTENDANCE_POLL_MS = 15_000

interface RawRecord {
  dayOffset: number
  empId: string
  name: string
  avatar: string
  department: string
  shiftName: string
  shiftSchedule: string
  clockIn: string | null
  clockOut: string | null
  durationMinutes: number
  checkinDisplay?: string
  checkoutDisplay?: string
  checkinMethod: string
  checkinMethodIcon: string
  statusType: AttendanceStatusType
  statusLabel: string
  siteId: string | null
  locationName?: string
  locationDistance: string
  verifType: VerificationType
  verifLabel: string
  verifIcon: string
  coords: (GeoPoint & { accuracy: number }) | null
  distanceMeters: number | null
  insideFence: boolean | null
  toleranceRadius: string
  varianceDetail: string
  terminalNode: string
  deviceBatterySignal: string
  livenessPassed: boolean
  shaProof: string
  notes: string
}

/**
 * Build an absolute timestamp from a day offset and an `HH:mm:ss` clock string.
 *
 * The local `YYYY-MM-DD` key is derived from the local date parts on purpose:
 * the ISO string is UTC, so an early-morning punch (00:00-07:00 in GMT+7) would
 * otherwise be filed under the previous day.
 */
const composeTimestamp = (
  serverNow: Date,
  dayOffset: number,
  clock: string | null
): { iso: string; dateKey: string } | null => {
  if (!clock) return null
  const date = new Date(serverNow.getTime())
  date.setDate(date.getDate() + dayOffset)
  const [h = '0', m = '0', s = '0'] = clock.split(':')
  date.setHours(Number(h), Number(m), Number(s), 0)

  const pad = (value: number): string => String(value).padStart(2, '0')
  const dateKey = `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`
  return { iso: date.toISOString(), dateKey }
}

const formatClock = (iso: string | null): string => {
  if (!iso) return '—'
  const date = new Date(iso)
  return date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true
  })
}

/**
 * Mock rows are stored as a day offset relative to the server "today" so the
 * date scope filter (Today / Yesterday / This Week / This Month) stays useful
 * without the dataset going stale.
 */
const hydrateMock = (): AttendanceSnapshot => {
  const raw = mockSnapshot as unknown as {
    meta: AttendanceSnapshot['meta']
    sites: AttendanceSite[]
    records: RawRecord[]
  }
  const serverNow = new Date()

  const records: AttendanceEntry[] = raw.records.map((row) => {
    const checkInStamp = composeTimestamp(serverNow, row.dayOffset, row.clockIn)
    const checkOutStamp = composeTimestamp(serverNow, row.dayOffset, row.clockOut)
    const checkInAt = checkInStamp?.iso ?? null
    const checkOutAt = checkOutStamp?.iso ?? null
    // A shift without a punch is filed on the shift day, not on "no date".
    const fallbackKey = (() => {
      const date = new Date(serverNow.getTime())
      date.setDate(date.getDate() + row.dayOffset)
      const pad = (value: number): string => String(value).padStart(2, '0')
      return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`
    })()
    const punchDate = checkInStamp?.dateKey ?? checkOutStamp?.dateKey ?? fallbackKey

    const record: AttendanceRecord = {
      id: row.empId,
      name: row.name,
      empId: row.empId,
      avatar: row.avatar,
      department: row.department,
      shiftName: row.shiftName,
      shiftSchedule: row.shiftSchedule,
      checkinTime: row.checkinDisplay ?? formatClock(checkInAt),
      checkinMethod: row.checkinMethod,
      checkinMethodIcon: row.checkinMethodIcon,
      checkoutTime: row.checkoutDisplay ?? (checkOutAt ? formatClock(checkOutAt) : 'In Progress'),
      duration: formatDuration(row.durationMinutes),
      statusType: row.statusType,
      statusLabel: row.statusLabel,
      locationName:
        row.locationName ??
        (row.siteId ? (raw.sites.find((s) => s.id === row.siteId)?.name ?? 'Unknown Site') : '—'),
      locationDistance: row.locationDistance,
      verifType: row.verifType,
      verifLabel: row.verifLabel,
      verifIcon: row.verifIcon,
      coords: row.coords ? { lat: row.coords.lat, lng: row.coords.lng } : { lat: 0, lng: 0 },
      toleranceRadius: row.toleranceRadius,
      varianceDetail: row.varianceDetail,
      terminalNode: row.terminalNode,
      deviceBatterySignal: row.deviceBatterySignal,
      livenessPassed: row.livenessPassed,
      shaProof: row.shaProof,
      notes: row.notes
    }

    return {
      ...record,
      checkInAt,
      checkOutAt,
      durationMinutes: row.durationMinutes,
      distanceMeters: row.distanceMeters,
      accuracyMeters: row.coords ? row.coords.accuracy : null,
      insideFence: row.insideFence,
      siteId: row.siteId,
      punchDate
    }
  })

  return { meta: { ...raw.meta, generatedAt: serverNow.toISOString() }, sites: raw.sites, records }
}

const fetchFromMock = (): Promise<AttendanceSnapshot> =>
  new Promise((resolve) => {
    setTimeout(() => resolve(hydrateMock()), 150)
  })

/** Load the attendance snapshot used by the audit table and the summary cards. */
export const fetchAttendanceSnapshot = async (): Promise<AttendanceSnapshot> => {
  if (!isApiConfigured()) return fetchFromMock()
  return apiGet<AttendanceSnapshot>(ATTENDANCE_ENDPOINT)
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