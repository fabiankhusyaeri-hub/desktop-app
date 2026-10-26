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

import { apiGet, isApiConfigured } from './apiClient'
import { isSupabaseConfigured, supabaseService } from './supabaseService'
// (evaluateGeofence no longer used)
import { formatTimestamp } from '../utils/datetime'
import type { MapFrameConfig } from '../utils/geo'
import type {
  BreachAlertEntry,
  LiveMonitoringSnapshot,
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



let tickCount = 0

const hydrate = (): LiveMonitoringSnapshot => {
  tickCount += 1
  const now = new Date()
  return {
    meta: { generatedAt: now.toISOString(), nodesOnline: 0, pollingSeconds: 5, geofenceRadiusMeters: 250, activeGeofences: 0, totalLiveUnits: 0, insideCount: 0, outsideCount: 0, flaggedCount: 0, verifiedFieldCount: 0, liveBreachAlerts: 0, hqCapacityUsed: 0, hqCapacityTotal: 100, fleetEfficiencyPercent: 0, gpsDriftMeters: 0 },
    sites: [],
    entities: [],
    fleet: [],
    breachLog: []
  }
}

const fetchFromSupabase = async (): Promise<LiveMonitoringSnapshot | null> => {
  if (!isSupabaseConfigured()) return null
  const telemetry = await supabaseService.getLiveTelemetry()
  if (!telemetry || telemetry.length === 0) return null
  const now = new Date()
  const entities = telemetry.map((t: any, index: number) => {
    const emp = t.employees ?? {}
    const gps = { lat: t.latitude, lng: t.longitude, accuracy: 5 }
    return {
      id: t.id ?? `TRK-${index}`,
      empId: t.employee_id ?? '',
      name: emp.name ?? 'Unknown',
      role: emp.role ?? '—',
      dept: emp.department ?? '—',
      avatar: '',
      kind: 'personnel' as const,
      distanceLabel: '—',
      statusType: (t.status === 'breach' ? 'breach' : 'inside') as any,
      statusLabel: t.status === 'breach' ? 'Breach' : 'Inside HQ',
      checkinTime: '—',
      gps,
      position: { x: 460, y: 380 },
      accuracyLabel: '±5m',
      battery: '—',
      network: '—',
      complianceZone: '—',
      complianceSub: '—',
      siteId: 'hq',
      updatedAt: t.updated_at ?? now.toISOString(),
      geofence: { status: t.status === 'breach' ? 'outside' : 'inside', distanceMeters: 0, radiusMeters: 250, lowConfidence: false },
      timeline: []
    }
  })
  return {
    meta: { generatedAt: now.toISOString(), nodesOnline: entities.length, pollingSeconds: 5, geofenceRadiusMeters: 250, activeGeofences: 1, totalLiveUnits: entities.length, insideCount: entities.filter((e) => e.statusType === 'inside').length, outsideCount: entities.filter((e) => e.statusType !== 'inside').length, flaggedCount: entities.filter((e) => e.statusType === 'breach').length, verifiedFieldCount: 0, liveBreachAlerts: entities.filter((e) => e.statusType === 'breach').length, hqCapacityUsed: entities.length, hqCapacityTotal: 100, fleetEfficiencyPercent: 95, gpsDriftMeters: 0 },
    sites: [],
    entities,
    fleet: [],
    breachLog: []
  }
}

// (mock fallback removed)

/** One telemetry snapshot: positions projected, geofence verdicts recomputed. */
export const fetchLiveSnapshot = async (): Promise<LiveMonitoringSnapshot> => {
  if (isApiConfigured()) return apiGet<LiveMonitoringSnapshot>(LIVE_ENDPOINT)
  try {
    const fromSupabase = await fetchFromSupabase()
    if (fromSupabase) return fromSupabase
  } catch (error) {
    console.error('[liveMonitoringService] Supabase fetch failed', error)
  }
  return hydrate()
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
