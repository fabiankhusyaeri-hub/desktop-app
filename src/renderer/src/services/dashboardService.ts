/**
 * Dashboard data source.
 *
 * The view never talks to `fetch` directly: it calls `fetchDashboardSnapshot()`
 * and receives a `DashboardSnapshot`. The adapter is picked at runtime:
 *   - `VITE_API_BASE_URL` set  -> REST endpoint
 *   - otherwise                 -> bundled mock JSON with a lightweight ticker
 *                                 so the "live" behaviour is visible offline.
 */

import mockSnapshot from './mock/dashboard.mock.json'
import { apiGet, isApiConfigured } from './apiClient'
import type { DashboardSnapshot, DataSource } from '../types/dashboard'

export const DASHBOARD_ENDPOINT = '/dashboard/overview'

/** Poll interval for the live feed, in milliseconds. */
export const POLL_INTERVAL_MS = 10_000

let mockState: DashboardSnapshot | null = null

/**
 * Log timestamps are stored as absolute ISO values in the fixture but must read
 * as "today" in the UI: the feed date is re-applied from the current clock.
 */
const stampLogDates = (snapshot: DashboardSnapshot, serverNow: Date): void => {
  const pad = (value: number): string => String(value).padStart(2, '0')
  const dayKey = `${serverNow.getFullYear()}-${pad(serverNow.getMonth() + 1)}-${pad(serverNow.getDate())}`

  snapshot.attendanceLog.forEach((entry) => {
    const clock = entry.checkInAt.slice(11, 19)
    const stamped = `${dayKey}T${clock}`
    entry.checkInAt = Number.isNaN(new Date(stamped).getTime()) ? entry.checkInAt : stamped
  })
}

/** Deep clone so the ticker never mutates the imported JSON module. */
const cloneMock = (): DashboardSnapshot => {
  const snapshot = JSON.parse(JSON.stringify(mockSnapshot)) as DashboardSnapshot
  // Always stamp with the current feed time: the hook measures its clock offset
  // from the very first snapshot, so a stale value here would pin a wrong offset.
  const serverNow = new Date()
  snapshot.meta.generatedAt = serverNow.toISOString()
  stampLogDates(snapshot, serverNow)
  return snapshot
}

const offsetMinutes = (minutes: number): string => {
  const sign = minutes >= 0 ? '+' : '-'
  const abs = Math.abs(minutes)
  const h = String(Math.floor(abs / 60)).padStart(2, '0')
  const m = String(abs % 60).padStart(2, '0')
  return `${sign}${h}:${m}`
}

/**
 * Advance the mock dataset by one tick: bump the live counters, age the work
 * durations, and stamp a fresh `generatedAt` from the machine clock.
 */
const tickMock = (previous: DashboardSnapshot): DashboardSnapshot => {
  const next = cloneMock()
  const drift = Math.floor(Math.random() * 5) - 2 // -2..+2
  const working = Math.max(0, next.kpi.currentlyWorking.value + drift)
  const inside = Math.max(0, next.geo.insideGeofence + drift)
  const outside = Math.max(0, next.geo.outsidePerimeter - drift)

  next.kpi.currentlyWorking.value = working
  next.geo.insideGeofence = inside
  next.geo.outsidePerimeter = outside
  next.attendanceLog = previous.attendanceLog.map((row) => ({
    ...row,
    workDurationMinutes: row.workDurationMinutes + 1
  }))
  next.meta.generatedAt = new Date(Date.now()).toISOString()
  return next
}

const fetchFromMock = (): Promise<DashboardSnapshot> =>
  new Promise((resolve) => {
    setTimeout(() => {
      mockState = mockState ? tickMock(mockState) : cloneMock()
      resolve(JSON.parse(JSON.stringify(mockState)) as DashboardSnapshot)
    }, 150)
  })

/** Which adapter produced the last snapshot - surfaced for debugging only. */
export const activeSource = (): DataSource => (isApiConfigured() ? 'api' : 'mock')

/**
 * Load one dashboard snapshot.
 * Throws `ApiError` when the real backend is unreachable, so the hook can keep
 * the previous snapshot on screen instead of blanking the page.
 */
export const fetchDashboardSnapshot = async (): Promise<DashboardSnapshot> => {
  if (!isApiConfigured()) return fetchFromMock()
  return apiGet<DashboardSnapshot>(DASHBOARD_ENDPOINT)
}

/** Optional broadcast action used by the "Broadcast Alert" button. */
export const broadcastAlert = async (message: string): Promise<void> => {
  if (!isApiConfigured()) return
  await apiGet<void>(`/dashboard/broadcast?message=${encodeURIComponent(message)}`)
}

export const toLocalOffsetLabel = (iso: string): string => {
  const match = /([+-])(\d{2}):(\d{2})$/.exec(iso)
  return match ? offsetMinutes(Number(match[2]) * 60 + Number(match[3])) : ''
}