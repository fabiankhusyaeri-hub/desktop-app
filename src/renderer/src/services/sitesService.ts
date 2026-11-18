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
  lat: number | null
  lng: number | null
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
  pingMs: raw.ping_ms ?? null,
  lat: typeof raw.lat === 'number' ? raw.lat : null,
  lng: typeof raw.lng === 'number' ? raw.lng : null
})

/** Fetch all geofence sites, empty array when nothing is configured yet. */
export const fetchSites = async (): Promise<SiteRecord[]> => {
  if (!isSupabaseConfigured()) return []
  const rows = await supabaseService.getLocations()
  if (!rows || rows.length === 0) return []
  return rows.map(toSiteRecord)
}

/** Result of a read that distinguishes "server error" from "really empty". */
export interface SitesFetchResult {
  sites: SiteRecord[]
  error: string | null
}

/**
 * Like `fetchSites`, but surfaces the server error instead of degrading to an
 * empty list. Used by Bulk Geofence Sync / post-save refetch so the toast can
 * report a failed read honestly (e.g. the `locations` table is missing).
 */
export const fetchSitesDetailed = async (): Promise<SitesFetchResult> => {
  if (!isSupabaseConfigured()) return { sites: [], error: 'Supabase is not configured.' }
  const { data, error } = await supabaseService.getLocationsDetailed()
  if (error) return { sites: [], error: supabaseError(error).message }
  return { sites: (data ?? []).map(toSiteRecord), error: null }
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

/* ------------------------------------------------------------------ */
/* Create / update (Location page modal + status toggle)               */
/* ------------------------------------------------------------------ */

/** Fields accepted by the Add/Edit modal. `code` is generated when omitted. */
export interface SiteInput {
  code?: string
  name: string
  address: string
  lat: number | null
  lng: number | null
  radiusMeters: number
  status: SiteStatus
}

/** Partial patch for an existing site. */
export interface SitePatch {
  name?: string
  address?: string
  lat?: number | null
  lng?: number | null
  radiusMeters?: number
  status?: SiteStatus
}

/** Extract a `message` from a Supabase/PostgREST error without assuming its shape. */
const supabaseError = (err: unknown): Error => {
  if (err && typeof err === 'object' && 'message' in err) {
    const message = (err as { message: unknown }).message
    if (typeof message === 'string' && message.length > 0) return new Error(message)
  }
  return new Error('Supabase request failed.')
}

/**
 * Generate a system site code such as `LOC-7K2M`.
 * The modal has no code field, so the identifier is derived here (it is a
 * technical id, not business data). The DB unique constraint stays the last
 * line of defence — a collision surfaces as an honest save error.
 */
export const generateSiteCode = (): string => {
  const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  const bytes = new Uint8Array(4)
  crypto.getRandomValues(bytes)
  let out = ''
  for (let i = 0; i < bytes.length; i++) out += alphabet[bytes[i] % alphabet.length]
  return `LOC-${out}`
}

/**
 * Parse a coordinate entered as `37.7749`, `37.7749° N`, or `-122.4194° W`.
 * Hemisphere letters (S/W) flip the sign when the number itself is unsigned.
 * Returns null when no decimal number can be extracted.
 */
export const parseCoordinate = (value: string): number | null => {
  const match = /-?\d+(?:\.\d+)?/.exec(value)
  if (!match) return null
  let num = Number(match[0])
  if (!Number.isFinite(num)) return null
  if (num > 0 && /[SW]\s*$/i.test(value.slice(match.index + match[0].length))) num = -num
  return num
}

/** Format a stored coordinate for the modal inputs, e.g. `37.7749° N`. */
export const formatCoordinate = (value: number | null, axis: 'lat' | 'lng'): string => {
  if (value == null || !Number.isFinite(value)) return ''
  const hemisphere = axis === 'lat' ? (value >= 0 ? 'N' : 'S') : (value >= 0 ? 'E' : 'W')
  return `${Math.abs(value)}° ${hemisphere}`
}

/**
 * Insert a new location. Throws an Error carrying the real server message so
 * the caller can report failures honestly (missing table, RLS denial, ...).
 */
export const createSite = async (input: SiteInput): Promise<SiteRecord> => {
  if (!isSupabaseConfigured()) throw new Error('Supabase is not configured.')
  const { data, error } = await supabaseService.insertLocation({
    code: input.code ?? generateSiteCode(),
    name: input.name,
    address: input.address,
    lat: input.lat,
    lng: input.lng,
    radius_meters: input.radiusMeters,
    status: input.status
  })
  if (error || !data) throw supabaseError(error)
  return toSiteRecord(data)
}

/** Update an existing location. Same honest-error contract as `createSite`. */
export const updateSite = async (id: string, patch: SitePatch): Promise<SiteRecord> => {
  if (!isSupabaseConfigured()) throw new Error('Supabase is not configured.')
  const payload: Record<string, unknown> = {}
  if (patch.name !== undefined) payload.name = patch.name
  if (patch.address !== undefined) payload.address = patch.address
  if (patch.lat !== undefined) payload.lat = patch.lat
  if (patch.lng !== undefined) payload.lng = patch.lng
  if (patch.radiusMeters !== undefined) payload.radius_meters = patch.radiusMeters
  if (patch.status !== undefined) payload.status = patch.status
  const { data, error } = await supabaseService.updateLocation(id, payload)
  if (error || !data) throw supabaseError(error)
  return toSiteRecord(data)
}
