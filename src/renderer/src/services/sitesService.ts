/**
 * Geofence site directory for the Location page.
 *
 * Sites come from the Supabase `locations` table (docs/supabase-locations-schema.sql).
 * The directory starts empty — operators add their real office sites.
 */
import { supabaseService, isSupabaseConfigured } from './supabaseService'
import { fetchDirectorySnapshot } from './employeeService'

export type SiteStatus = 'active' | 'inactive' | 'dormant'

export interface SiteRecord {
  id: string
  code: string
  name: string
  category: string
  address: string
  zone: string
  icon: string
  staffCount: number
  radiusMeters: number
  status: SiteStatus
  /** ISO-8601, or null when no telemetry has been received yet. */
  lastPingAt: string | null
  pingMs: number | null
}

/** Workforce counters shown on the "Employees Assigned" KPI card. */
export interface WorkforceKpi {
  rostered: number
  onPremises: number
  fieldUnits: number
}

export const emptyWorkforceKpi: WorkforceKpi = { rostered: 0, onPremises: 0, fieldUnits: 0 }

const toSiteRecord = (raw: any): SiteRecord => ({
  id: raw.id,
  code: raw.code ?? '—',
  name: raw.name ?? '—',
  category: raw.category ?? '—',
  address: raw.address ?? '',
  zone: raw.zone ?? '',
  icon: raw.icon ?? 'domain',
  staffCount: raw.staff_count ?? 0,
  radiusMeters: raw.radius_meters ?? 250,
  status: (['active', 'inactive', 'dormant'].includes(raw.status) ? raw.status : 'active') as SiteStatus,
  lastPingAt: raw.last_ping_at ?? null,
  pingMs: raw.ping_ms ?? null
})

/** Fetch all geofence sites, empty array when nothing is configured yet. */
export const fetchSites = async (): Promise<SiteRecord[]> => {
  if (!isSupabaseConfigured()) return []
  const rows = await supabaseService.getLocations()
  if (!rows || rows.length === 0) return []
  return rows.map(toSiteRecord)
}

/** Workforce KPI derived from the employee directory. */
export const fetchWorkforceKpi = async (): Promise<WorkforceKpi> => {
  try {
    const snapshot = await fetchDirectorySnapshot()
    const employees = snapshot?.employees ?? []
    return {
      rostered: employees.length,
      onPremises: employees.filter((e) => e.locationState === 'online').length,
      fieldUnits: employees.filter((e) => e.locationState === 'field').length
    }
  } catch {
    return emptyWorkforceKpi
  }
}

/** `d Hours` + `m` breakdown of the roster per site. */
export const summarizeSites = (sites: SiteRecord[]) => {
  const active = sites.filter((site) => site.status === 'active').length
  const dormant = sites.filter((site) => site.status === 'dormant').length
  const inactive = sites.filter((site) => site.status === 'inactive').length
  return { total: sites.length, active, inactive, dormant }
}

/**
 * Relative day label for the LAST TELEMETRY column, e.g.
 * `Today, 08:30 AM`, `Yesterday, 18:00`, or `Oct 24, 2024`.
 */
export const formatTelemetryStamp = (iso: string | null): string => {
  if (!iso) return '—'
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return '—'
  const now = new Date()
  const dayMs = 86_400_000
  const startOf = (d: Date): Date => new Date(d.getFullYear(), d.getMonth(), d.getDate())
  const days = Math.round((startOf(now).getTime() - startOf(date).getTime()) / dayMs)
  const time = date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })
  const dayLabel =
    days === 0
      ? 'Today'
      : days === 1
      ? 'Yesterday'
      : date.toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })
  return `${dayLabel}, ${time}`
}

/** Secondary line under the telemetry stamp. */
export const telemetryDetail = (site: SiteRecord): string => {
  if (site.status === 'dormant') return 'Dormant Mode'
  if (site.pingMs == null) return 'Sensor Offline'
  return `Ping: ${site.pingMs}ms`
}
