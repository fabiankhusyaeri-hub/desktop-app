/**
 * Live monitoring domain types (Module 3 - Live Monitoring & Tactical GPS).
 *
 * Positions are stored as real WGS-84 coordinates and projected onto the
 * tactical SVG at render time. The SVG frame itself never carries data.
 */

import type { AttendanceSite, GeofenceDecision } from './attendance'

export type TrackerStatus = 'inside' | 'breach' | 'field'

export type TrackerKind = 'personnel' | 'fleet'

export type FleetUnitStatus = 'idle' | 'en-route' | 'loading' | 'offline'

export interface GpsFix {
  lat: number
  lng: number
  accuracy: number
}

export interface TimelineStep {
  time: string
  title: string
  detail: string
  dotClass?: string
}

export interface TrackedEntity {
  id: string
  /** Business identifier shown in the UI, e.g. EMP-8821. */
  empId: string
  name: string
  role: string
  dept: string
  avatar: string
  kind: TrackerKind
  /** Distance text reported by the server, e.g. `410m`. */
  distanceLabel: string
  statusType: TrackerStatus
  statusLabel: string
  checkinTime: string
  isTarget?: boolean
  gps: GpsFix
  /** Projected position inside the tactical SVG viewBox (1000 x 700). */
  position: { x: number; y: number }
  accuracyLabel: string
  battery: string
  network: string
  complianceZone: string
  complianceSub: string
  siteId: string
  /** ISO-8601 timestamp of the last position update from this node. */
  updatedAt: string
  geofence: GeofenceDecision
  timeline: TimelineStep[]
}

export interface FleetUnit {
  id: string
  plate: string
  driver: string
  status: FleetUnitStatus
  gps: GpsFix
  siteId: string
  updatedAt: string
}

export interface BreachAlertEntry {
  id: string
  /** Unit id shown in the log, e.g. EMP-7742 or FLEET-03. */
  unitId: string
  entityId: string
  entityName: string
  kind: TrackerKind
  siteId: string
  siteName: string
  distanceMeters: number
  radiusMeters: number
  /** ISO-8601 detection time. */
  detectedAt: string
  /** `YYYY-MM-DD HH:mm:ss`, rendered from the server clock. */
  timestamp: string
  severity: 'high' | 'medium' | 'low'
  detail: string
}

export interface LiveMonitoringMeta {
  /** Server generated-at timestamp. */
  generatedAt: string
  nodesOnline: number
  pollingSeconds: number
  geofenceRadiusMeters: number
  activeGeofences: number
  totalLiveUnits: number
  insideCount: number
  outsideCount: number
  flaggedCount: number
  verifiedFieldCount: number
  liveBreachAlerts: number
  hqCapacityUsed: number
  hqCapacityTotal: number
  fleetEfficiencyPercent: number
  gpsDriftMeters: number
}

export interface LiveMonitoringSnapshot {
  meta: LiveMonitoringMeta
  /** Allowed areas used for the geofence verdicts, shared with Module 2. */
  sites: AttendanceSite[]
  entities: TrackedEntity[]
  fleet: FleetUnit[]
  breachLog: BreachAlertEntry[]
}