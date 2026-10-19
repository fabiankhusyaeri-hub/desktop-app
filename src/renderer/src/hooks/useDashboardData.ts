/**
 * Dashboard state management.
 *
 * Owns the snapshot lifecycle (load -> poll -> replace), keeps the measured
 * server clock offset, and exposes a 1 Hz ticker used by the "last sync" label.
 */

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { POLL_INTERVAL_MS, fetchDashboardSnapshot } from '../services/dashboardService'
import type { DashboardSnapshot } from '../types/dashboard'

export type LoadStatus = 'idle' | 'loading' | 'ready' | 'error'

export interface DashboardState {
  data: DashboardSnapshot | null
  status: LoadStatus
  error: string | null
  /** Milliseconds between the last successful sync and now (1 Hz resolution). */
  msSinceSync: number
  /** Server clock offset measured from the last snapshot. */
  serverOffsetMs: number
  refresh: () => Promise<void>
}

export const useDashboardData = (pollIntervalMs = POLL_INTERVAL_MS): DashboardState => {
  const [data, setData] = useState<DashboardSnapshot | null>(null)
  const [status, setStatus] = useState<LoadStatus>('idle')
  const [error, setError] = useState<string | null>(null)
  const [msSinceSync, setMsSinceSync] = useState<number>(POLL_INTERVAL_MS)
  const [serverOffsetMs, setServerOffsetMs] = useState<number>(0)

  const lastSyncRef = useRef<number>(0)
  const offsetRef = useRef<number>(0)
  const mountedRef = useRef<boolean>(true)

  const load = useCallback(async () => {
    try {
      const snapshot = await fetchDashboardSnapshot()
      const serverTime = new Date(snapshot.meta.generatedAt).getTime()
      // Offset is applied only on the first snapshot: subsequent responses travel
      // in real time, so their latency is already negligible.
      if (offsetRef.current === 0 && !Number.isNaN(serverTime)) {
        offsetRef.current = serverTime - Date.now()
        setServerOffsetMs(offsetRef.current)
      }
      if (!mountedRef.current) return
      setData(snapshot)
      lastSyncRef.current = Date.now()
      setMsSinceSync(0)
      setStatus('ready')
      setError(null)
    } catch (err) {
      if (!mountedRef.current) return
      setStatus('error')
      setError(err instanceof Error ? err.message : 'Failed to load dashboard data')
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

  useEffect(() => {
    const ticker = window.setInterval(() => {
      setMsSinceSync(lastSyncRef.current === 0 ? pollIntervalMs : Date.now() - lastSyncRef.current)
    }, 1000)
    return () => window.clearInterval(ticker)
  }, [pollIntervalMs])

  return useMemo(
    () => ({ data, status, error, msSinceSync, serverOffsetMs, refresh: load }),
    [data, status, error, msSinceSync, serverOffsetMs, load]
  )
}