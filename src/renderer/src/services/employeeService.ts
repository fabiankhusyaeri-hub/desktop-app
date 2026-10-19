/**
 * Employee directory & fleet service (Module 4).
 *
 * Same Service Adapter pattern as the previous modules: the mock dataset is used
 * by default and the REST API takes over when `VITE_API_BASE_URL` is set.
 * Search, filters, pagination and the CRUD actions are all served from here so
 * the page stays a pure renderer.
 */

import mockSnapshot from './mock/employees.mock.json'
import { apiDelete, apiGet, apiPatch, apiPost, isApiConfigured } from './apiClient'
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

const clone = (): DirectorySnapshot =>
  JSON.parse(JSON.stringify(mockSnapshot)) as DirectorySnapshot

/**
 * Vehicle fix times are stored as `HH:mm:ss` on the feed day and composed
 * against the current server clock, so "last update" always reads as today.
 */
const composeVehicleFix = (serverNow: Date, clock: string): string => {
  const [h = '0', m = '0', s = '0'] = clock.split(':')
  const date = new Date(serverNow.getTime())
  date.setHours(Number(h), Number(m), Number(s), 0)
  return date.toISOString()
}

const stampFleet = (fleet: FleetVehicle[], serverNow: Date): FleetVehicle[] =>
  fleet.map((vehicle) => ({
    ...vehicle,
    gps: vehicle.gps,
    updatedAt: composeVehicleFix(serverNow, vehicle.updatedAt)
  }))

/** Lightweight simulation of the vehicle telematics feed between polls. */
const advanceFleet = (previous: FleetVehicle[]): FleetVehicle[] =>
  previous.map((vehicle) => {
    if (vehicle.status === 'offline' || vehicle.status === 'maintenance') return { ...vehicle }

    // Burn fuel and roll the odometer only while the engine is running.
    const running = vehicle.status === 'moving'
    const fuel = Math.max(0, vehicle.fuelPercent - (running ? 0.1 : 0.02))
    const odometer = Math.round((vehicle.odometerKm + (running ? 0.06 : 0)) * 100) / 100
    const speed =
      vehicle.status === 'moving'
        ? Math.max(8, Math.min(78, vehicle.speedKmh + (Math.sin(Date.now() / 20000 + vehicle.odometerKm) * 6)))
        : 0
    return { ...vehicle, fuelPercent: Math.round(fuel * 10) / 10, odometerKm: odometer, speedKmh: Math.round(speed) }
  })

const fetchFromMock = (): Promise<DirectorySnapshot> =>
  new Promise((resolve) => {
    setTimeout(() => {
      const serverNow = new Date()
      if (!cache) cache = clone()
      cache = {
        ...cache,
        meta: { ...cache.meta, generatedAt: serverNow.toISOString() },
        fleet: stampFleet(advanceFleet(cache.fleet), serverNow)
      }
      resolve(JSON.parse(JSON.stringify(cache)) as DirectorySnapshot)
    }, 130)
  })

/** Full directory + fleet snapshot used by the page. */
export const fetchDirectorySnapshot = async (): Promise<DirectorySnapshot> => {
  if (!isApiConfigured()) return fetchFromMock()
  return apiGet<DirectorySnapshot>(DIRECTORY_ENDPOINT)
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