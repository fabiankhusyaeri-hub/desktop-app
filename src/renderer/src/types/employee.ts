/**
 * Employee directory & fleet domain types (Module 4).
 */

export type AttendanceState = 'present' | 'late' | 'leave' | 'absent'

export type LocationState = 'online' | 'breach' | 'field' | 'offline'

export interface EmployeeRecord {
  id: string
  name: string
  email: string
  empId: string
  rfidToken: string
  department: string
  role: string
  geofence: string
  attendanceStatus: AttendanceState
  attendanceTime: string
  locationState: LocationState
  locationDetail: string
  lastPing: string
  avatar: string
}

/** Telemetry attached to a directory record, not rendered in the table. */
export interface EmployeeDetail {
  gps: { lat: number; lng: number; accuracy: number } | null
  /** ISO-8601 timestamp of the last device ping. */
  updatedAt: string | null
}

export type EmployeeEntry = EmployeeRecord & EmployeeDetail & {
  /** Distance to the assigned site as reported by the server, in meters. */
  distanceMeters: number | null
}

/* ===================== Fleet ===================== */

export type VehicleStatus = 'moving' | 'idling' | 'maintenance' | 'offline'

export interface FleetVehicle {
  id: string
  plate: string
  model: string
  status: VehicleStatus
  /** Fuel level, 0-100. */
  fuelPercent: number
  odometerKm: number
  speedKmh: number
  driver: string
  driverEmpId: string | null
  geofence: string
  gps: { lat: number; lng: number; accuracy: number }
  /** ISO-8601 timestamp of the last position update. */
  updatedAt: string
  nextServiceKm: number
}

export interface FleetSummary {
  totalVehicles: number
  moving: number
  idling: number
  maintenance: number
  offline: number
  averageFuelPercent: number
  totalOdometerKm: number
  lowFuelCount: number
}

export interface DirectoryMeta {
  generatedAt: string
  totalHeadcount: number
  fullTime: number
  contractFleet: number
  geofencedPersonnel: number
  zoneIntegrityPercent: number
  remoteFieldFleet: number
  deviceHealthPercent: number
  activePings: number
  totalDevices: number
  verifiedInside: number
  perimeterBreaches: number
  verifiedShiftPercent: number
  heartbeatLatencyMs: number
}

export interface DirectorySnapshot {
  meta: DirectoryMeta
  employees: EmployeeEntry[]
  fleet: FleetVehicle[]
}

export interface EmployeeFilters {
  search: string
  department: string
  status: string
  zone: string
}