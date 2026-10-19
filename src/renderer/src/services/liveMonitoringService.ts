/**
 * Live monitoring service (Module 3).
 *
 * Same Service Adapter pattern as Module 1 and 2: mock dataset by default, REST
 * API when `VITE_API_BASE_URL` is set.
 *
 * Positions arrive as WGS-84 coordinates and are projected onto the tactical
 * SVG (viewBox 1000 x 700) at load time. The frame geometry is unchanged; only
 * the numbers move. Geofence decisions are recomputed from the coordinates with
 * Haversine - the client verdict is advisory, the server stays authoritative.
 */

import mockSnapshot from './mock/liveMonitoring.mock.json'
import { apiGet, isApiConfigured } from './apiClient'
import { evaluateGeofence } from '../utils/geo'
import { formatTimestamp } from '../utils/datetime'
import type { MapFrameConfig } from '../utils/geo'
import type {
  BreachAlertEntry,
  FleetUnit,
  LiveMonitoringSnapshot,
  TimelineStep,
  TrackedEntity
} from '../types/liveMonitoring'
import type { AttendanceSite } from '../types/attendance'

export const LIVE_ENDPOINT = '/live-monitoring/snapshot'
export const LIVE_POLL_MS = 5_000

/** Frame of the tactical SVG that already exists in the page. */
export const TACTICAL_MAP_FRAME: MapFrameConfig = {
  width: 1000,
  height: 700,
  centerX: 460,
  centerY: 380,
  fenceRadiusPx: 180,
  margin: 24
}

interface RawSite extends AttendanceSite {
  frame?: { centerX: number; centerY: number; fenceRadiusPx: number }
}

interface RawEntity {
  id: string
  empId: string
  name: string
  role: string
  dept: string
  avatar: string
  siteId: string
  statusType: TrackedEntity['statusType']
  statusLabel: string
  checkinTime: string
  isTarget?: boolean
  distanceLabel: string
  gps: { lat: number; lng: number; accuracy: number }
  accuracyLabel: string
  battery: string
  network: string
  complianceZone: string
  complianceSub: string
  timeline: TimelineStep[]
}

interface RawBreach {
  id: string
  unitId: string
  entityId: string
  entityName: string
  kind: BreachAlertEntry['kind']
  siteId: string
  distanceMeters: number
  detectedAt: string
  severity: BreachAlertEntry['severity']
  detail: string
}

const frameForSite = (sites: RawSite[], siteId: string): MapFrameConfig => {
  const site = sites.find((s) => s.id === siteId)
  return site
    ? {
        ...TACTICAL_MAP_FRAME,
        centerX: site.frame?.centerX ?? TACTICAL_MAP_FRAME.centerX,
        centerY: site.frame?.centerY ?? TACTICAL_MAP_FRAME.centerY,
        fenceRadiusPx: site.frame?.fenceRadiusPx ?? TACTICAL_MAP_FRAME.fenceRadiusPx
      }
    : TACTICAL_MAP_FRAME
}

const clamp = (value: number, min: number, max: number): number =>
  Math.min(max, Math.max(min, value))

/**
 * Project a WGS-84 fix into the tactical frame. Meters-per-pixel is derived from
 * the site radius and the radius of the drawn fence circle, so the fence always
 * matches its own radius on screen.
 */
const projectCoords = (
  gps: { lat: number; lng: number },
  site: AttendanceSite,
  frame: MapFrameConfig
): { x: number; y: number } => {
  const metersPerPixel = site.radiusMeters / frame.fenceRadiusPx
  const northMeters = (gps.lat - site.lat) * 110_574
  const eastMeters =
    (gps.lng - site.lng) * 111_320 * Math.cos((site.lat * Math.PI) / 180)
  return {
    x: clamp(frame.centerX + eastMeters / metersPerPixel, frame.margin, frame.width - frame.margin),
    y: clamp(frame.centerY - northMeters / metersPerPixel, frame.margin, frame.height - frame.margin)
  }
}

/** Deterministic sub-metre jitter so the feed visibly moves between polls. */
const drift = (seed: number, step: number): number =>
  step <= 1 ? 0 : Math.sin(step * 1.7 + seed * 2.3) * 1.6

let tickCount = 0

const projectEntity = (
  raw: RawEntity,
  sites: RawSite[],
  index: number,
  step: number
): TrackedEntity => {
  const site = sites.find((s) => s.id === raw.siteId)
  // Nudge the fix by a couple of meters to emulate a live GPS stream.
  const gps = {
    lat: raw.gps.lat + drift(index, step) / 110_574,
    lng:
      raw.gps.lng +
      drift(index + 5, step) / (111_320 * Math.cos((raw.gps.lat * Math.PI) / 180)),
    accuracy: raw.gps.accuracy
  }

  return {
    id: raw.id,
    empId: raw.empId,
    name: raw.name,
    role: raw.role,
    dept: raw.dept,
    avatar: raw.avatar,
    kind: 'personnel',
    distanceLabel: raw.distanceLabel,
    statusType: raw.statusType,
    statusLabel: raw.statusLabel,
    checkinTime: raw.checkinTime,
    isTarget: raw.isTarget,
    gps,
    position: site
      ? projectCoords(gps, site, frameForSite(sites, raw.siteId))
      : { x: TACTICAL_MAP_FRAME.centerX, y: TACTICAL_MAP_FRAME.centerY },
    accuracyLabel: raw.accuracyLabel,
    battery: raw.battery,
    network: raw.network,
    complianceZone: raw.complianceZone,
    complianceSub: raw.complianceSub,
    siteId: raw.siteId,
    updatedAt: new Date().toISOString(),
    geofence: site
      ? evaluateGeofence(gps, site)
      : { status: 'outside', distanceMeters: 0, radiusMeters: 0, lowConfidence: false },
    timeline: raw.timeline
  }
}

const hydrate = (): LiveMonitoringSnapshot => {
  const raw = mockSnapshot as unknown as {
    meta: LiveMonitoringSnapshot['meta']
    sites: RawSite[]
    entities: RawEntity[]
    fleet: FleetUnit[]
    breachLog: RawBreach[]
  }
  tickCount += 1
  const now = new Date()
  // Offsets measured so mock timestamps read as "now" on the client's clock.
  const offsetMs = now.getTime() - new Date(raw.meta.generatedAt).getTime()

  const breachLog: BreachAlertEntry[] = raw.breachLog
    .map((entry) => {
      const site = raw.sites.find((s) => s.id === entry.siteId)
      return {
        ...entry,
        siteName: site?.name ?? 'Unknown Zone',
        radiusMeters: site?.radiusMeters ?? 0,
        timestamp: formatTimestamp(entry.detectedAt, offsetMs)
      }
    })
    .sort((a, b) => b.detectedAt.localeCompare(a.detectedAt))

  return {
    meta: { ...raw.meta, generatedAt: now.toISOString() },
    sites: raw.sites,
    entities: raw.entities.map((entity, index) => projectEntity(entity, raw.sites, index, tickCount)),
    fleet: raw.fleet.map((unit) => ({ ...unit, updatedAt: now.toISOString() })),
    breachLog
  }
}

const fetchFromMock = (): Promise<LiveMonitoringSnapshot> =>
  new Promise((resolve) => {
    setTimeout(() => resolve(hydrate()), 120)
  })

/** One telemetry snapshot: positions projected, geofence verdicts recomputed. */
export const fetchLiveSnapshot = async (): Promise<LiveMonitoringSnapshot> => {
  if (!isApiConfigured()) return fetchFromMock()
  return apiGet<LiveMonitoringSnapshot>(LIVE_ENDPOINT)
}

/** Build a breach entry for a unit that just left its fence. */
export const buildBreachAlert = (
  entity: TrackedEntity,
  site: AttendanceSite | undefined,
  detectedAt: string,
  serverOffsetMs: number
): BreachAlertEntry => ({
  id: `BRH-LIVE-${entity.empId}`,
  unitId: entity.empId,
  entityId: entity.id,
  entityName: entity.name,
  kind: entity.kind,
  siteId: entity.siteId,
  siteName: site?.name ?? 'Unknown Zone',
  distanceMeters: entity.geofence.distanceMeters,
  radiusMeters: entity.geofence.radiusMeters,
  detectedAt,
  timestamp: formatTimestamp(detectedAt, serverOffsetMs),
  severity: 'high',
  detail: `Position left ${site?.name ?? 'assigned'} fence radius`
})

/** Prepend a locally detected breach to the snapshot. */
export const withDetectedBreach = (
  snapshot: LiveMonitoringSnapshot,
  alert: BreachAlertEntry
): LiveMonitoringSnapshot => ({
  ...snapshot,
  meta: { ...snapshot.meta, liveBreachAlerts: snapshot.meta.liveBreachAlerts + 1 },
  breachLog: [alert, ...snapshot.breachLog]
})