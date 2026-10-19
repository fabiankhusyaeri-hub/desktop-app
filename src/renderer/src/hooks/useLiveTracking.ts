/**
 * Live tracking state management (Module 3).
 *
 * Polls the telemetry snapshot on the cadence advertised by the feed (5 s),
 * keeps the selected target, filters the tracker list, and raises a notification
 * whenever a unit newly crosses outside its geofence.
 */

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { LIVE_POLL_MS, buildBreachAlert, fetchLiveSnapshot, withDetectedBreach } from '../services/liveMonitoringService'
import type { BreachAlertEntry, LiveMonitoringSnapshot, TrackedEntity } from '../types/liveMonitoring'

export type TrackerFilter = 'all' | 'inside' | 'outside' | 'flagged'

export type LoadStatus = 'idle' | 'loading' | 'ready' | 'error'

export interface LiveTrackingState {
  snapshot: LiveMonitoringSnapshot | null
  entities: TrackedEntity[]
  filteredEntities: TrackedEntity[]
  breachLog: BreachAlertEntry[]
  /** Breach raised by the most recent poll, surfaced as a toast. */
  latestAlert: BreachAlertEntry | null
  dismissAlert: () => void
  status: LoadStatus
  error: string | null
  msSinceSync: number
  /** Offset between the feed clock and the local clock, used for timestamps. */
  serverOffsetMs: number
  selected: TrackedEntity | null
  selectEntity: (entity: TrackedEntity) => void
  filter: TrackerFilter
  setFilter: (filter: TrackerFilter) => void
  searchQuery: string
  setSearchQuery: (query: string) => void
  refresh: () => Promise<void>
}

export const useLiveTracking = (pollIntervalMs = LIVE_POLL_MS): LiveTrackingState => {
  const [snapshot, setSnapshot] = useState<LiveMonitoringSnapshot | null>(null)
  const [status, setStatus] = useState<LoadStatus>('idle')
  const [error, setError] = useState<string | null>(null)
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [filter, setFilter] = useState<TrackerFilter>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [latestAlert, setLatestAlert] = useState<BreachAlertEntry | null>(null)
  const [msSinceSync, setMsSinceSync] = useState(pollIntervalMs)
  const [serverOffsetMs, setServerOffsetMs] = useState(0)

  const mountedRef = useRef(true)
  const lastSyncRef = useRef(0)
  const offsetRef = useRef(0)
  const knownBreachRef = useRef<Set<string>>(new Set())

  const load = useCallback(async () => {
    try {
      const next = await fetchLiveSnapshot()

      // Measure the feed clock offset once, then keep the local stamp aligned.
      const feedTime = new Date(next.meta.generatedAt).getTime()
      if (offsetRef.current === 0 && !Number.isNaN(feedTime)) {
        offsetRef.current = feedTime - Date.now()
        if (mountedRef.current) setServerOffsetMs(offsetRef.current)
      }

      // A unit that is outside its fence and was not before is a live breach.
      const freshBreaches = next.entities.filter(
        (entity) =>
          entity.geofence.status === 'outside' && !knownBreachRef.current.has(entity.empId)
      )
      if (freshBreaches.length > 0 && snapshot) {
        const alert = buildBreachAlert(
          freshBreaches[0],
          snapshot.sites.find((s) => s.id === freshBreaches[0].siteId),
          next.meta.generatedAt,
          offsetRef.current
        )
        if (mountedRef.current) {
          setSnapshot(withDetectedBreach(next, alert))
          setLatestAlert(alert)
        }
        freshBreaches.forEach((entity) => knownBreachRef.current.add(entity.empId))
      } else {
        freshBreaches.forEach((entity) => knownBreachRef.current.add(entity.empId))
      }

      if (!mountedRef.current) return
      setSnapshot(next)
      lastSyncRef.current = Date.now()
      setMsSinceSync(0)
      setStatus('ready')
      setError(null)
    } catch (err) {
      if (!mountedRef.current) return
      setStatus('error')
      setError(err instanceof Error ? err.message : 'Failed to load telemetry feed')
    }
  }, [snapshot])

  useEffect(() => {
    mountedRef.current = true
    void load()
    return () => {
      mountedRef.current = false
    }
    // Intentionally runs once; `load` is re-created on every poll by design.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

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

  const entities = useMemo(() => snapshot?.entities ?? [], [snapshot])

  const selected = useMemo(
    () => entities.find((e) => e.id === selectedId) ?? entities[0] ?? null,
    [entities, selectedId]
  )

  const filteredEntities = useMemo(() => {
    const query = searchQuery.trim().toLowerCase()
    return entities.filter((entity) => {
      if (filter === 'inside' && entity.statusType !== 'inside') return false
      if (filter === 'outside' && entity.statusType !== 'breach' && entity.statusType !== 'field') return false
      if (filter === 'flagged' && entity.statusType !== 'breach') return false
      if (query) {
        return (
          entity.name.toLowerCase().includes(query) ||
          entity.empId.toLowerCase().includes(query) ||
          entity.role.toLowerCase().includes(query) ||
          entity.dept.toLowerCase().includes(query)
        )
      }
      return true
    })
  }, [entities, filter, searchQuery])

  const selectEntity = useCallback((entity: TrackedEntity) => setSelectedId(entity.id), [])
  const dismissAlert = useCallback(() => setLatestAlert(null), [])

  return {
    snapshot,
    entities,
    filteredEntities,
    breachLog: snapshot?.breachLog ?? [],
    latestAlert,
    dismissAlert,
    status,
    error,
    msSinceSync,
    serverOffsetMs,
    selected,
    selectEntity,
    filter,
    setFilter,
    searchQuery,
    setSearchQuery,
    refresh: load
  }
}