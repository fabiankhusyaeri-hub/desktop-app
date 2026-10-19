/**
 * Geospatial helpers: great-circle distance and projection onto the existing
 * tactical SVG frame.
 *
 * Security note: these calculations are for UX feedback only. The server is the
 * only authority that accepts or rejects a punch (see AGENTS.md, rule 1 & 3).
 */

import type { AttendanceSite, GeofenceDecision, GeoPoint } from '../types/attendance'

/** Mean Earth radius (IUGG), in meters. */
const EARTH_RADIUS_M = 6_371_008.8
const METERS_PER_DEGREE_LAT = 110_574
const METERS_PER_DEGREE_LNG_AT_EQUATOR = 111_320

const toRad = (deg: number): number => (deg * Math.PI) / 180

/** Haversine great-circle distance between two coordinates, in meters. */
export const haversineDistance = (
  a: { lat: number; lng: number },
  b: { lat: number; lng: number }
): number => {
  const dLat = toRad(b.lat - a.lat)
  const dLng = toRad(b.lng - a.lng)
  const lat1 = toRad(a.lat)
  const lat2 = toRad(b.lat)
  const h =
    Math.sin(dLat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2
  return 2 * EARTH_RADIUS_M * Math.asin(Math.min(1, Math.sqrt(h)))
}

/**
 * Evaluate a position against an allowed site.
 *
 * The accuracy radius is subtracted from the measured distance so a coarse fix
 * can never be reported as a clean "inside" hit, and a position close to the
 * boundary is flagged `borderline` for manual review instead of auto-accepted.
 */
export const evaluateGeofence = (
  point: GeoPoint,
  site: AttendanceSite,
  /** A fix looser than this is treated as unusable. */
  maxTrustworthyAccuracy = 100
): GeofenceDecision => {
  const distanceMeters = Math.round(haversineDistance(point, site))
  const accuracy = Math.max(0, point.accuracy || 0)
  const insideBuffer = distanceMeters - accuracy
  const lowConfidence = accuracy > maxTrustworthyAccuracy
  const borderline = Math.abs(distanceMeters - site.radiusMeters) <= Math.max(accuracy, 20)

  let status: GeofenceDecision['status'] = 'outside'
  if (insideBuffer <= site.radiusMeters) status = 'inside'
  if (!lowConfidence && borderline) status = 'borderline'

  return { status, distanceMeters, radiusMeters: site.radiusMeters, lowConfidence }
}

/** Descriptor used by the drawer HUD. */
export const geofenceLabel = (decision: GeofenceDecision | null): string => {
  if (!decision) return 'No Punch Recorded'
  if (decision.status === 'inside') return 'Punch Inside Perimeter'
  if (decision.status === 'borderline') return 'Punch On Geofence Boundary'
  return 'Punch Outside Permitted Geofence'
}

export interface MapFrameConfig {
  width: number
  height: number
  centerX: number
  centerY: number
  /** Radius in SVG units of the drawn geofence circle. */
  fenceRadiusPx: number
  /** Keeps the pin inside the frame when the punch is far outside the fence. */
  margin: number
}

/** Frame geometry of the tactical SVG that already exists in the drawer. */
export const DRAWER_MAP_FRAME: MapFrameConfig = {
  width: 500,
  height: 240,
  centerX: 250,
  centerY: 120,
  fenceRadiusPx: 70,
  margin: 24
}

const clamp = (value: number, min: number, max: number): number =>
  Math.min(max, Math.max(min, value))

export interface ProjectedPoint {
  x: number
  y: number
  /** Meters per SVG pixel at this zoom, useful for the "±N m" HUD readout. */
  metersPerPixel: number
  clamped: boolean
  /** Side the pin caption is drawn on, so it is never clipped by the frame. */
  labelSide: 'right' | 'left'
}

/**
 * Project real coordinates into the tactical frame with an equirectangular
 * approximation: local east/north offsets around the site centre, scaled so the
 * geofence radius maps exactly onto the drawn circle.
 */
export const projectToMapFrame = (
  point: GeoPoint,
  site: AttendanceSite,
  frame: MapFrameConfig = DRAWER_MAP_FRAME
): ProjectedPoint => {
  const metersPerPixel = site.radiusMeters / frame.fenceRadiusPx
  const northMeters = (point.lat - site.lat) * METERS_PER_DEGREE_LAT
  const eastMeters =
    (point.lng - site.lng) * METERS_PER_DEGREE_LNG_AT_EQUATOR * Math.cos(toRad(site.lat))

  const rawX = frame.centerX + eastMeters / metersPerPixel
  const rawY = frame.centerY - northMeters / metersPerPixel

  const x = clamp(rawX, frame.margin, frame.width - frame.margin)
  const y = clamp(rawY, frame.margin, frame.height - frame.margin)

  return {
    x,
    y,
    metersPerPixel,
    clamped: x !== rawX || y !== rawY,
    // ~120px is the width of the longest pin caption in the tactical frame.
    labelSide: x > frame.width - 120 ? 'left' : 'right'
  }
}

/** `lat, lng` pair for compact display. */
export const formatCoordinates = (coords: { lat: number; lng: number }): string =>
  `${coords.lat.toFixed(4)}, ${coords.lng.toFixed(4)}`

/** Hemisphere-aware coordinate readout, e.g. `-6.2086° S, 106.8452° E`. */
export const formatGpsCoordinate = (lat: number, lng: number): string =>
  `${Math.abs(lat).toFixed(4)}° ${lat >= 0 ? 'N' : 'S'}, ${Math.abs(lng).toFixed(4)}° ${lng >= 0 ? 'E' : 'W'}`

/** Meters to a short human string: `38m`, `1.2km`. */
export const formatMeters = (meters: number): string =>
  meters >= 1000 ? `${(meters / 1000).toFixed(1)}km` : `${Math.round(meters)}m`