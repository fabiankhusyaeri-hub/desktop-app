/**
 * Workforce projection for the Dashboard tactical map.
 *
 * The map is a fixed tactical frame; personnel are projected onto it from their
 * recorded coordinates. The frame geometry never changes — only the numbers.
 */

import directory from './mock/employees.mock.json'
import { evaluateGeofence } from '../utils/geo'
import type { MapFrameConfig } from '../utils/geo'
import type { EmployeeEntry, LocationState } from '../types/employee'
import type { AttendanceSite } from '../types/attendance'

/** Vanguard Central HQ — the beacon drawn at (430, 250) with a 175px radius. */
export const HQ_SITE: AttendanceSite = {
  id: 'hq',
  name: 'HQ Central Hub',
  lat: -6.209,
  lng: 106.8455,
  radiusMeters: 250
}

/** Frame of the SVG that already exists on the Dashboard. */
export const DASHBOARD_MAP_FRAME: MapFrameConfig = {
  width: 940,
  height: 600,
  centerX: 430,
  centerY: 250,
  fenceRadiusPx: 175,
  margin: 20
}

export type MapScope = 'all' | 'hq' | 'field' | 'shift1'

export interface MapPersonnel {
  id: string
  empId: string
  name: string
  role: string
  department: string
  /** Short department label for compact surfaces (map tooltip). */
  departmentLabel: string
  initials: string
  avatar: string
  state: LocationState
  stateLabel: string
  /** Distance label shown on the map, e.g. `85m HQ` or `410m (Ext)`. */
  distanceLabel: string
  /** Server-reported distance to the assigned site, in meters. */
  distanceMeters: number
  /** Haversine distance to the HQ beacon, recomputed from the coordinates. */
  haversineMeters: number
  gps: { lat: number; lng: number; accuracy: number }
  /** Projected position inside the tactical frame. */
  position: { x: number; y: number }
  shift: 'A' | 'B'
  checkinLabel: string
  zoneDetail: string
}

const SHIFT_A = ['EMP-8821', 'EMP-9014', 'EMP-7742', 'EMP-4412', 'EMP-6320', 'EMP-5519', 'EMP-3108']

const initialsOf = (name: string): string =>
  name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .toUpperCase()

/** Short department label used in the pin tooltip, e.g. `Design`. */
const shortDepartment = (department: string): string => department.split(' & ')[0]

/** `Present - 08:02` -> `Present (08:02)`, separator glyph agnostic. */
const formatCheckin = (attendanceTime: string): string => {
  const [prefix, time] = attendanceTime.split(/(\d{1,2}:\d{2}(?::\d{2})?)/)
  if (!time) return attendanceTime
  const label = prefix.replace(/[^\w\s]/g, '').trim()
  return label ? `${label} (${time})` : `(${time})`
}

const ZONE_DETAIL: Record<string, string> = {
  'HQ Central Hub': 'Working inside office area (Zone 3 • Floor 2)',
  'Field Mobile Unit': 'Assigned field itinerary • client complex',
  'South Hub': 'South regional hub'
}

const buildPersonnel = (employee: EmployeeEntry): MapPersonnel | null => {
  if (!employee.gps) return null

  const decision = evaluateGeofence(employee.gps, HQ_SITE)
  const metersPerPixel = HQ_SITE.radiusMeters / DASHBOARD_MAP_FRAME.fenceRadiusPx
  const north = (employee.gps.lat - HQ_SITE.lat) * 110_574
  const east =
    (employee.gps.lng - HQ_SITE.lng) * 111_320 * Math.cos((HQ_SITE.lat * Math.PI) / 180)
  const clamp = (value: number, min: number, max: number): number => Math.min(max, Math.max(min, value))

  return {
    id: employee.id,
    empId: employee.empId,
    name: employee.name,
    role: employee.role,
    department: employee.department,
    initials: initialsOf(employee.name),
    avatar: employee.avatar,
    state: employee.locationState,
    stateLabel: employee.locationDetail,
    distanceLabel:
      employee.distanceMeters == null
        ? '—'
        : employee.locationState === 'field'
        ? `${(employee.distanceMeters / 1000).toFixed(1)} km`
        : employee.locationState === 'breach'
        ? `${employee.distanceMeters}m (Ext)`
        : `${employee.distanceMeters}m HQ`,
    distanceMeters: employee.distanceMeters ?? decision.distanceMeters,
    haversineMeters: decision.distanceMeters,
    gps: employee.gps,
    position: {
      x: clamp(DASHBOARD_MAP_FRAME.centerX + east / metersPerPixel, DASHBOARD_MAP_FRAME.margin, DASHBOARD_MAP_FRAME.width - DASHBOARD_MAP_FRAME.margin),
      y: clamp(DASHBOARD_MAP_FRAME.centerY - north / metersPerPixel, DASHBOARD_MAP_FRAME.margin, DASHBOARD_MAP_FRAME.height - DASHBOARD_MAP_FRAME.margin)
    },
    shift: SHIFT_A.includes(employee.id) ? 'A' : 'B',
    // "Present - 08:02" -> "Present (08:02)", independent of the separator glyph.
    checkinLabel: formatCheckin(employee.attendanceTime),
    zoneDetail: ZONE_DETAIL[employee.geofence] ?? employee.geofence,
    departmentLabel: shortDepartment(employee.department)
  }
}

const RAW = (directory.employees as unknown[]).map((raw) => raw as EmployeeEntry)

/**
 * Presentation order of the tracker list (matches the published mockup order).
 * Anyone not listed is appended afterwards.
 */
const DISPLAY_ORDER = [
  'EMP-8821',
  'EMP-9014',
  'EMP-7742',
  'EMP-6320',
  'EMP-4412',
  'EMP-5519',
  'EMP-4389'
]

/** All personnel that can be projected on the tactical map. */
export const fetchMapPersonnel = async (): Promise<MapPersonnel[]> => {
  const projected = RAW.map(buildPersonnel).filter((entry): entry is MapPersonnel => entry !== null)
  projected.sort((a, b) => {
    const ai = DISPLAY_ORDER.indexOf(a.id)
    const bi = DISPLAY_ORDER.indexOf(b.id)
    return (ai === -1 ? 99 : ai) - (bi === -1 ? 99 : bi)
  })
  return new Promise((resolve) => setTimeout(() => resolve(projected), 80))
}

export const matchesScope = (person: MapPersonnel, scope: MapScope): boolean => {
  if (scope === 'all') return true
  if (scope === 'hq') return person.state === 'online' || person.state === 'breach'
  if (scope === 'field') return person.state === 'field'
  return person.shift === 'A'
}

export const SCOPE_LABEL: Record<MapScope, string> = {
  all: 'All Departments',
  hq: 'Headquarters (HQ)',
  field: 'On-Field Units',
  shift1: 'Shift 1'
}

/** Counters shown on the clickable telemetry chips above the map. */
export const summarizeMap = (personnel: MapPersonnel[]) => ({
  inside: personnel.filter((p) => p.state === 'online').length,
  outside: personnel.filter((p) => p.state === 'breach' || p.state === 'field').length,
  breach: personnel.filter((p) => p.state === 'breach').length
})