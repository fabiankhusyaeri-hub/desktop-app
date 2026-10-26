/**
 * Employee directory & fleet service (Module 4).
 *
 * Same Service Adapter pattern as the previous modules: the mock dataset is used
 * by default and the REST API takes over when `VITE_API_BASE_URL` is set.
 * Search, filters, pagination and the CRUD actions are all served from here so
 * the page stays a pure renderer.
 */

import { apiDelete, apiGet, apiPatch, apiPost, isApiConfigured } from './apiClient'
import { isSupabaseConfigured, supabaseService } from './supabaseService'
import { formatTimestamp } from '../utils/datetime'
import type {
  DirectorySnapshot,
  EmployeeEntry,
  FleetSummary,
  FleetVehicle,
  VehicleStatus
} from '../types/employee'

export const DIRECTORY_ENDPOINT = '/employees'
export const FLEET_ENDPOINT = '/fleet/vehicles'
export const DIRECTORY_POLL_MS = 30_000

export const VEHICLE_STATUS_LABEL: Record<VehicleStatus, string> = {
  moving: 'Moving',
  idling: 'Idling',
  maintenance: 'Maintenance',
  offline: 'Offline'
}

/**
 * Reusable badge modifiers that already exist in Employees.css, so vehicle
 * status reuses the directory design language without adding new CSS.
 */
export const VEHICLE_STATUS_BADGE: Record<VehicleStatus, string> = {
  moving: 'emp-att-badge present',
  idling: 'emp-att-badge field',
  maintenance: 'emp-att-badge leave',
  offline: 'emp-att-badge late'
}

export const VEHICLE_STATUS_STATE: Record<VehicleStatus, string> = {
  moving: 'emp-loc-state online',
  idling: 'emp-loc-state field',
  maintenance: 'emp-loc-state online',
  offline: 'emp-loc-state breach'
}

export const VEHICLE_STATUS_ICON: Record<VehicleStatus, string> = {
  moving: 'navigation',
  idling: 'pause_circle',
  maintenance: 'build',
  offline: 'cloud_off'
}

let cache: DirectorySnapshot | null = null

const clone = (): DirectorySnapshot => ({
  employees: [],
  fleet: [],
  meta: {
    generatedAt: new Date().toISOString(),
    totalHeadcount: 0,
    fullTime: 0,
    contractFleet: 0,
    geofencedPersonnel: 0,
    zoneIntegrityPercent: 0,
    remoteFieldFleet: 0,
    deviceHealthPercent: 0,
    activePings: 0,
    totalDevices: 0,
    verifiedInside: 0,
    perimeterBreaches: 0,
    verifiedShiftPercent: 0,
    heartbeatLatencyMs: 0
  }
})


const fromSupabaseEmployee = (row: any): EmployeeEntry => ({
  id: row.id,
  empId: row.emp_id ?? row.id,
  name: row.name,
  email: row.email ?? '',
  rfidToken: row.rfid_token ?? `RFID-${row.id}`,
  department: row.department ?? 'IT Engineering',
  role: row.role ?? 'Field Operator',
  geofence: row.geofence ?? 'HQ Central Hub',
  attendanceStatus: row.attendance_status ?? 'present',
  attendanceTime: row.attendance_time ?? 'Registered Today',
  locationState: row.location_state ?? 'online',
  locationDetail: row.location_detail ?? 'Online',
  lastPing: row.last_ping ?? 'Just now',
  avatar: row.avatar ?? '',
  gps:
    row.gps_lat != null && row.gps_lng != null
      ? { lat: row.gps_lat, lng: row.gps_lng, accuracy: row.gps_accuracy ?? 5 }
      : null,
  distanceMeters: row.distance_meters ?? null,
  updatedAt: row.updated_at ?? new Date().toISOString()
})

const fetchFromSupabase = async (): Promise<DirectorySnapshot | null> => {
  if (!isSupabaseConfigured()) return null
  const rows = await supabaseService.getEmployees()
  if (!rows || rows.length === 0) return null
  const employees = rows.map(fromSupabaseEmployee)
  if (!cache) cache = clone()
  return {
    ...cache,
    employees,
    meta: { ...cache.meta, generatedAt: new Date().toISOString() }
  }
}


/** Full directory + fleet snapshot used by the page. */
export const fetchDirectorySnapshot = async (): Promise<DirectorySnapshot> => {
  if (isApiConfigured()) return apiGet<DirectorySnapshot>(DIRECTORY_ENDPOINT)
  try {
    const fromSupabase = await fetchFromSupabase()
    if (fromSupabase) return fromSupabase
  } catch (error) {
    console.error('[employeeService] Supabase fetch failed', error)
  }
  // No mock fallback: return empty snapshot.
  if (!cache) cache = clone()
  return JSON.parse(JSON.stringify(cache)) as DirectorySnapshot
}

/** Derive the counters shown in the fleet summary card. */
export const summarizeFleet = (fleet: FleetVehicle[]): FleetSummary => {
  const count = (status: VehicleStatus): number =>
    fleet.filter((vehicle) => vehicle.status === status).length
  const totalFuel = fleet.reduce((sum, vehicle) => sum + vehicle.fuelPercent, 0)
  const totalOdometer = fleet.reduce((sum, vehicle) => sum + vehicle.odometerKm, 0)

  return {
    totalVehicles: fleet.length,
    moving: count('moving'),
    idling: count('idling'),
    maintenance: count('maintenance'),
    offline: count('offline'),
    averageFuelPercent: fleet.length > 0 ? Math.round((totalFuel / fleet.length) * 10) / 10 : 0,
    totalOdometerKm: Math.round(totalOdometer),
    lowFuelCount: fleet.filter((vehicle) => vehicle.fuelPercent < 20).length
  }
}

/* ===================== Directory CRUD ===================== */

export interface EmployeeInput {
  name: string
  email: string
  department: string
  role: string
  geofence: string
}

const withGeneratedIds = (input: EmployeeInput): EmployeeEntry => {
  const serial = Math.floor(1000 + Math.random() * 9000)
  return {
    id: `EMP-${serial}`,
    empId: `EMP-${serial}`,
    name: input.name,
    email: input.email || `${input.name.toLowerCase().replace(/\s+/g, '.')}@vanguardops.com`,
    rfidToken: `RFID-${serial}`,
    department: input.department,
    role: input.role || 'Field Operator',
    geofence: input.geofence,
    attendanceStatus: 'present',
    attendanceTime: 'Registered Today',
    locationState: 'online',
    locationDetail: 'Online (Enrolled)',
    lastPing: 'Just now',
    avatar: '',
    gps: null,
    distanceMeters: null,
    updatedAt: new Date().toISOString()
  }
}

export const createEmployee = async (input: EmployeeInput): Promise<EmployeeEntry> => {
  if (!isApiConfigured()) {
    const record = withGeneratedIds(input)
    if (cache) cache = { ...cache, employees: [record, ...cache.employees] }
    return record
  }
  return apiPost<EmployeeEntry>(DIRECTORY_ENDPOINT, input)
}

export const updateEmployee = async (
  id: string,
  input: EmployeeInput
): Promise<EmployeeEntry | null> => {
  if (!isApiConfigured()) {
    if (!cache) return null
    let updated: EmployeeEntry | null = null
    cache = {
      ...cache,
      employees: cache.employees.map((employee) => {
        if (employee.id !== id) return employee
        updated = { ...employee, ...input, updatedAt: new Date().toISOString() }
        return updated
      })
    }
    return updated
  }
  return apiPatch<EmployeeEntry>(`${DIRECTORY_ENDPOINT}/${encodeURIComponent(id)}`, input)
}

export const deleteEmployee = async (id: string): Promise<boolean> => {
  if (!isApiConfigured()) {
    if (!cache) return false
    const before = cache.employees.length
    cache = { ...cache, employees: cache.employees.filter((employee) => employee.id !== id) }
    return cache.employees.length < before
  }
  await apiDelete(`${DIRECTORY_ENDPOINT}/${encodeURIComponent(id)}`)
  return true
}

/**
 * Import a CSV roster. Accepts `name,email,department,role,geofence` columns and
 * reports the rows that could not be parsed instead of silently dropping them.
 */
export const importEmployeesFromCsv = async (
  text: string
): Promise<{ imported: number; skipped: number }> => {
  const lines = text
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
  if (lines.length < 2) return { imported: 0, skipped: 0 }

  const splitRow = (row: string): string[] => {
    const cells: string[] = []
    let current = ''
    let quoted = false
    for (let i = 0; i < row.length; i += 1) {
      const char = row[i]
      if (char === '"') {
        if (quoted && row[i + 1] === '"') {
          current += '"'
          i += 1
        } else {
          quoted = !quoted
        }
      } else if (char === ',' && !quoted) {
        cells.push(current)
        current = ''
      } else {
        current += char
      }
    }
    cells.push(current)
    return cells.map((cell) => cell.trim())
  }

  const header = splitRow(lines[0]).map((cell) => cell.toLowerCase())
  const columnOf = (...names: string[]): number =>
    header.findIndex((cell) => names.some((name) => cell.includes(name)))

  const nameIdx = columnOf('name')
  const emailIdx = columnOf('email')
  const deptIdx = columnOf('department', 'division', 'dept')
  const roleIdx = columnOf('role', 'title', 'position')
  const zoneIdx = columnOf('geofence', 'zone', 'site')

  if (nameIdx === -1) return { imported: 0, skipped: lines.length - 1 }

  let imported = 0
  let skipped = 0
  for (const line of lines.slice(1)) {
    const cells = splitRow(line)
    const name = cells[nameIdx]
    if (!name) {
      skipped += 1
      continue
    }
    // Imported rows are enrolled into the local dataset immediately.
    const record = withGeneratedIds({
      name,
      email: emailIdx >= 0 ? cells[emailIdx] : '',
      department: deptIdx >= 0 && cells[deptIdx] ? cells[deptIdx] : 'IT Engineering',
      role: roleIdx >= 0 ? cells[roleIdx] : 'Field Operator',
      geofence: zoneIdx >= 0 && cells[zoneIdx] ? cells[zoneIdx] : 'HQ Central Hub'
    })
    if (!cache) cache = clone()
    cache = { ...cache, employees: [record, ...cache.employees] }
    imported += 1
  }

  return { imported, skipped }
}

/** `YYYY-MM-DD HH:mm:ss` readout used in the fleet table. */
export const vehicleUpdatedAt = (vehicle: FleetVehicle, offsetMs = 0): string =>
  formatTimestamp(vehicle.updatedAt, offsetMs)

/** Odometer readout, whole kilometres. */
export const formatOdometer = (km: number): string => `${Math.round(km).toLocaleString('en-US')} km`
