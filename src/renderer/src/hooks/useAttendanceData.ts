/**
 * Attendance state management (Module 2).
 *
 * Owns the snapshot lifecycle and the filter state. The filter logic that used to
 * live inside the page is kept here so the page only renders.
 */

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { ATTENDANCE_POLL_MS, fetchAttendanceSnapshot } from '../services/attendanceService'
import type { AttendanceEntry, AttendanceSite, AttendanceSnapshot, DateScope } from '../types/attendance'

export const FILTER_ALL_DEPARTMENTS = 'All Departments (6 Total)'
export const FILTER_ALL_STATUSES = 'All Statuses (Present, Late, Absent, Leave)'
export const FILTER_ALL_VERIFICATION = 'All Verification Protocols'

export interface AttendanceFilters {
  dateScope: DateScope
  department: string
  status: string
  verification: string
}

export const DEFAULT_FILTERS: AttendanceFilters = {
  dateScope: 'Today',
  department: FILTER_ALL_DEPARTMENTS,
  status: FILTER_ALL_STATUSES,
  verification: FILTER_ALL_VERIFICATION
}

export type LoadStatus = 'idle' | 'loading' | 'ready' | 'error'

const startOfDay = (date: Date): number =>
  new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime()

const matchesDateScope = (record: AttendanceEntry, scope: DateScope, serverNow: Date): boolean => {
  const reference = startOfDay(serverNow)
  const day = startOfDay(new Date(`${record.punchDate}T00:00:00`))
  const diffDays = Math.round((reference - day) / 86_400_000)

  switch (scope) {
    case 'Today':
      return diffDays === 0
    case 'Yesterday':
      return diffDays === 1
    case 'This Week':
      return diffDays >= 0 && diffDays <= 6
    case 'This Month':
      return diffDays >= 0 && diffDays <= 29
    default:
      return true
  }
}

const matchesStatus = (record: AttendanceEntry, status: string): boolean => {
  if (status === FILTER_ALL_STATUSES) return true
  if (status.startsWith('Present')) return record.statusType === 'present' || record.statusType === 'early'
  if (status.startsWith('Late')) return record.statusType === 'late'
  if (status.startsWith('Approved')) return record.statusType === 'leave'
  if (status.startsWith('Absent')) return record.statusType === 'absent'
  return true
}

const matchesVerification = (record: AttendanceEntry, verification: string): boolean => {
  if (verification === FILTER_ALL_VERIFICATION) return true
  if (verification.includes('GPS + Biometric')) return record.verifType === 'match'
  if (verification.includes('GPS Telemetry Only')) return record.verifType === 'remote'
  if (verification.includes('Manual Supervisor')) return record.verifType === 'override'
  if (verification.includes('Anomalous')) return record.statusType === 'breach'
  return true
}

export interface AttendanceState {
  snapshot: AttendanceSnapshot | null
  records: AttendanceEntry[]
  filteredRecords: AttendanceEntry[]
  sites: AttendanceSite[]
  status: LoadStatus
  error: string | null
  filters: AttendanceFilters
  serverOffsetMs: number
  setFilter: <K extends keyof AttendanceFilters>(key: K, value: AttendanceFilters[K]) => void
  resetFilters: () => void
  refresh: () => Promise<void>
}

export const useAttendanceData = (pollIntervalMs = ATTENDANCE_POLL_MS): AttendanceState => {
  const [snapshot, setSnapshot] = useState<AttendanceSnapshot | null>(null)
  const [status, setStatus] = useState<LoadStatus>('idle')
  const [error, setError] = useState<string | null>(null)
  const [filters, setFilters] = useState<AttendanceFilters>(DEFAULT_FILTERS)
  const [serverOffsetMs, setServerOffsetMs] = useState(0)

  const offsetRef = useRef(0)
  const mountedRef = useRef(true)

  const load = useCallback(async () => {
    try {
      const next = await fetchAttendanceSnapshot()
      const serverTime = new Date(next.meta.generatedAt).getTime()
      if (offsetRef.current === 0 && !Number.isNaN(serverTime)) {
        offsetRef.current = serverTime - Date.now()
        setServerOffsetMs(offsetRef.current)
      }
      if (!mountedRef.current) return
      setSnapshot(next)
      setStatus('ready')
      setError(null)
    } catch (err) {
      if (!mountedRef.current) return
      setStatus('error')
      setError(err instanceof Error ? err.message : 'Failed to load attendance records')
    }
  }, [])

  useEffect(() => {
    mountedRef.current = true
    void load()
    return () => {
      mountedRef.current = false
    }
  }, [load])

  useEffect(() => {
    const poller = window.setInterval(() => {
      void load()
    }, pollIntervalMs)
    return () => window.clearInterval(poller)
  }, [load, pollIntervalMs])

  const setFilter = useCallback(
    <K extends keyof AttendanceFilters>(key: K, value: AttendanceFilters[K]) => {
      setFilters((prev) => ({ ...prev, [key]: value }))
    },
    []
  )

  const resetFilters = useCallback(() => setFilters(DEFAULT_FILTERS), [])

  const filteredRecords = useMemo(() => {
    if (!snapshot) return []
    const serverNow = new Date(Date.now() + offsetRef.current)
    return snapshot.records.filter(
      (record) =>
        matchesDateScope(record, filters.dateScope, serverNow) &&
        (filters.department === FILTER_ALL_DEPARTMENTS ||
          record.department.includes(filters.department)) &&
        matchesStatus(record, filters.status) &&
        matchesVerification(record, filters.verification)
    )
  }, [snapshot, filters])

  return useMemo(
    () => ({
      snapshot,
      records: snapshot?.records ?? [],
      filteredRecords,
      sites: snapshot?.sites ?? [],
      status,
      error,
      filters,
      serverOffsetMs,
      setFilter,
      resetFilters,
      refresh: load
    }),
    [snapshot, filteredRecords, status, error, filters, serverOffsetMs, setFilter, resetFilters, load]
  )
}