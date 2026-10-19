/**
 * Device location capture (Geolocation API wrapper).
 *
 * Rules enforced here:
 *  - a fix is requested only while an attendance action is running, never in the
 *    background (AGENTS.md, rule 9);
 *  - the fix is passed straight into the punch payload and is never written to
 *    logs, analytics or local storage (AGENTS.md, "Data dan rahasia");
 *  - a poor-accuracy fix is reported as low confidence instead of being silently
 *    accepted (AGENTS.md, "Hal yang perlu diwaspadai": indoor GPS).
 */

import { evaluateGeofence } from '../utils/geo'
import type { AttendanceSite, GeofenceDecision, GeoPoint } from '../types/attendance'

export interface PositionOptions {
  /** Desired accuracy hint in meters. */
  enableHighAccuracy?: boolean
  /** Hard timeout for the fix request. */
  timeoutMs?: number
  /** Give up after this long without a cached position. */
  maximumAgeMs?: number
}

export interface CapturedPosition extends GeoPoint {
  /** Timestamp reported by the platform, ISO-8601. */
  capturedAt: string
  source: 'geolocation-api'
}

export class GeolocationError extends Error {
  readonly code: number

  constructor(message: string, code: number) {
    super(message)
    this.name = 'GeolocationError'
    this.code = code
  }
}

/** Human readable text for the platform error codes we can act on. */
export const geolocationErrorMessage = (code: number): string => {
  switch (code) {
    case 1:
      return 'Location permission denied. Allow location access to record attendance.'
    case 2:
      return 'Position unavailable. Move to an area with a clearer GPS signal.'
    case 3:
      return 'Location request timed out. Please try again.'
    default:
      return 'Unable to read the device position.'
  }
}

export const isGeolocationSupported = (): boolean =>
  typeof navigator !== 'undefined' && 'geolocation' in navigator

/**
 * Resolve the current device position.
 * Rejects with `GeolocationError` when the platform denies or times out.
 */
export const capturePosition = (options: PositionOptions = {}): Promise<CapturedPosition> => {
  const {
    enableHighAccuracy = true,
    timeoutMs = 10_000,
    maximumAgeMs = 0
  } = options

  if (!isGeolocationSupported()) {
    return Promise.reject(new GeolocationError('Geolocation API is not available', 0))
  }

  return new Promise<CapturedPosition>((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          accuracy: position.coords.accuracy ?? Number.MAX_SAFE_INTEGER,
          capturedAt: new Date(position.timestamp).toISOString(),
          source: 'geolocation-api'
        })
      },
      (error) => {
        reject(new GeolocationError(geolocationErrorMessage(error.code), error.code))
      },
      { enableHighAccuracy, timeout: timeoutMs, maximumAge: maximumAgeMs }
    )
  })
}

/** Pick the site whose centre is closest to the captured position. */
export const nearestSite = (position: GeoPoint, sites: AttendanceSite[]): AttendanceSite | null => {
  if (sites.length === 0) return null
  let best: AttendanceSite | null = null
  let bestDistance = Number.POSITIVE_INFINITY

  for (const site of sites) {
    // Reuse the geofence engine for the distance instead of duplicating maths.
    const decision = evaluateGeofence(position, site)
    if (decision.distanceMeters < bestDistance) {
      bestDistance = decision.distanceMeters
      best = site
    }
  }
  return best
}

/** Evaluate the position against a specific site, or against the nearest one. */
export const verifyAgainstGeofence = (
  position: GeoPoint,
  sites: AttendanceSite[],
  siteId?: string | null
): { decision: GeofenceDecision; site: AttendanceSite | null } => {
  const site = siteId ? (sites.find((s) => s.id === siteId) ?? null) : nearestSite(position, sites)
  if (!site) {
    return {
      site: null,
      decision: { status: 'outside', distanceMeters: Number.MAX_SAFE_INTEGER, radiusMeters: 0, lowConfidence: true }
    }
  }
  return { site, decision: evaluateGeofence(position, site) }
}

/** Stable per-install device identifier sent with every punch. */
export const getDeviceId = (): string | null => {
  try {
    const existing = window.localStorage.getItem('pulsetrack.deviceId')
    if (existing) return existing
    const generated =
      typeof crypto !== 'undefined' && 'randomUUID' in crypto
        ? crypto.randomUUID()
        : `dev-${Date.now()}-${Math.floor(Math.random() * 1e9)}`
    window.localStorage.setItem('pulsetrack.deviceId', generated)
    return generated
  } catch {
    return null
  }
}