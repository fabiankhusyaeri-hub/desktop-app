/**
 * Dashboard data source.
 *
 * The view never talks to `fetch` directly: it calls `fetchDashboardSnapshot()`
 * and receives a `DashboardSnapshot`. Data is loaded from Supabase when
 * configured; otherwise an empty snapshot is returned (no mock fallback).
 */

import { apiGet, isApiConfigured } from './apiClient'
import { isSupabaseConfigured, supabaseService } from './supabaseService'
import type { DashboardSnapshot, DataSource } from '../types/dashboard'

export const DASHBOARD_ENDPOINT = '/dashboard/overview'

/** Poll interval for the live feed, in milliseconds. */
export const POLL_INTERVAL_MS = 10_000

const offsetMinutes = (minutes: number): string => {
  const sign = minutes >= 0 ? '+' : '-'
  const abs = Math.abs(minutes)
  const h = String(Math.floor(abs / 60)).padStart(2, '0')
  const m = String(abs % 60).padStart(2, '0')
  return `${sign}${h}:${m}`
}

const emptySnapshot = (): DashboardSnapshot => ({
  kpi: {
    totalEmployees: { value: 0, delta: 0, direction: 'flat' },
    presentToday: { value: 0, ratePercent: 0, vsYesterdayPercent: 0 },
    lateToday: { value: 0, deltaFromYesterday: 0, sharePercent: 0 },
    absentToday: { value: 0, approved: 0, unexcused: 0 },
    currentlyWorking: { value: 0 }
  },
  geo: { insideGeofence: 0, outsidePerimeter: 0, breach: 0, geofenceRadiusMeters: 250 },
  weeklyAttendance: [],
  statusBreakdown: [],
  shiftCoverage: [],
  attendanceLog: [],
  attendanceSummary: { averageCompletionPercent: 0 },
  meta: {
    generatedAt: new Date().toISOString(),
    shift: { code: 'A', start: '08:00', end: '17:00' }
  }
})

const fetchFromSupabase = async (): Promise<DashboardSnapshot> => {
  if (!isSupabaseConfigured()) return emptySnapshot()
  const [employees, attendance] = await Promise.all([
    supabaseService.getEmployees(),
    supabaseService.getAttendance()
  ])
  const snapshot = emptySnapshot()
  const empList = employees ?? []
  const attList = attendance ?? []
  snapshot.kpi.totalEmployees.value = empList.length
  snapshot.kpi.presentToday.value = attList.filter((r: any) => r.is_inside_geofence).length
  snapshot.kpi.absentToday.value = Math.max(0, empList.length - attList.length)
  snapshot.kpi.lateToday.value = attList.filter((r: any) => r.status === 'Late').length
  snapshot.kpi.currentlyWorking.value = attList.filter((r: any) => !r.clock_out).length
  snapshot.geo.insideGeofence = attList.filter((r: any) => r.is_inside_geofence).length
  snapshot.geo.outsidePerimeter = attList.filter((r: any) => !r.is_inside_geofence).length
  snapshot.meta.generatedAt = new Date().toISOString()
  return snapshot
}

/** Which adapter produced the last snapshot - surfaced for debugging only. */
export const activeSource = (): DataSource => (isApiConfigured() ? 'api' : 'mock')

/**
 * Load one dashboard snapshot.
 */
export const fetchDashboardSnapshot = async (): Promise<DashboardSnapshot> => {
  if (isApiConfigured()) return apiGet<DashboardSnapshot>(DASHBOARD_ENDPOINT)
  return fetchFromSupabase()
}

/** Optional broadcast action used by the "Broadcast Alert" button. */
export const broadcastAlert = async (message: string): Promise<void> => {
  if (isApiConfigured()) await apiGet<void>(`/dashboard/broadcast?message=${encodeURIComponent(message)}`)
}

export const toLocalOffsetLabel = (iso: string): string => {
  const match = /([+-])(\d{2}):(\d{2})$/.exec(iso)
  return match ? offsetMinutes(Number(match[2]) * 60 + Number(match[3])) : ''
}