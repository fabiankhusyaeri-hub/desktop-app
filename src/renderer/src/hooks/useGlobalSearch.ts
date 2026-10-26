/**
 * Global search across the workforce directory.
 *
 * Backs the header search box (⌘K). Results are resolved from the same mock
 * dataset the directory renders, so the ranking matches what the user sees on
 * the Employees page.
 */

import { useCallback, useEffect, useMemo, useRef, useState, type RefObject } from 'react'
import { isSupabaseConfigured, supabaseService } from '../services/supabaseService'
import type { EmployeeEntry } from '../types/employee'

export interface SearchResult {
  employee: EmployeeEntry
  /** Why this row matched, shown as the result subtitle. */
  matchField: 'name' | 'id' | 'email' | 'department' | 'role'
}


let ALL_EMPLOYEES: EmployeeEntry[] = []

const loadEmployees = async (): Promise<void> => {
  if (!isSupabaseConfigured()) return
  const rows = await supabaseService.getEmployees()
  if (!rows) return
  ALL_EMPLOYEES = rows.map((raw: any) => ({
    id: raw.id,
    empId: raw.emp_id ?? raw.id,
    name: raw.name,
    email: raw.email ?? '',
    rfidToken: raw.rfid_token ?? `RFID-${raw.id}`,
    department: raw.department ?? 'IT Engineering',
    role: raw.role ?? 'Field Operator',
    geofence: raw.geofence ?? 'HQ Central Hub',
    attendanceStatus: raw.attendance_status ?? 'present',
    attendanceTime: raw.attendance_time ?? 'Registered Today',
    locationState: raw.location_state ?? 'online',
    locationDetail: raw.location_detail ?? 'Online',
    lastPing: raw.last_ping ?? 'Just now',
    avatar: raw.avatar ?? '',
    gps: raw.gps_lat != null && raw.gps_lng != null
      ? { lat: raw.gps_lat, lng: raw.gps_lng, accuracy: raw.gps_accuracy ?? 5 }
      : null,
    distanceMeters: raw.distance_meters ?? null,
    updatedAt: raw.updated_at ?? new Date().toISOString()
  }))
}

const FIELD_WEIGHT: Record<SearchResult['matchField'], number> = {
  name: 0,
  id: 1,
  email: 2,
  department: 3,
  role: 4
}

const resolveMatch = (employee: EmployeeEntry, query: string): SearchResult | null => {
  const q = query.trim().toLowerCase()
  if (!q) return null

  const candidates: Array<[SearchResult['matchField'], string]> = [
    ['name', employee.name],
    ['id', `${employee.empId} ${employee.rfidToken}`],
    ['email', employee.email],
    ['department', employee.department],
    ['role', employee.role]
  ]

  let best: SearchResult | null = null
  let bestScore = Number.POSITIVE_INFINITY

  candidates.forEach(([field, value]) => {
    const lower = value.toLowerCase()
    if (!lower.includes(q)) return
    // Prefix matches always outrank substring matches.
    const score = FIELD_WEIGHT[field] * 2 + (lower.startsWith(q) ? 0 : 1)
    if (score < bestScore) {
      bestScore = score
      best = { employee, matchField: field }
    }
  })

  return best
}

export interface GlobalSearchState {
  query: string
  setQuery: (value: string) => void
  results: SearchResult[]
  isOpen: boolean
  open: () => void
  close: () => void
  clear: () => void
  /** ⌘K / Ctrl+K toggles the box. */
  shortcutActive: boolean
  inputRef: RefObject<HTMLInputElement>
}

export const useGlobalSearch = (limit = 6): GlobalSearchState => {
  const [query, setQuery] = useState('')
  const [isOpen, setIsOpen] = useState(false)
  const [shortcutActive, setShortcutActive] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const [, forceUpdate] = useState(0)

  useEffect(() => {
    void loadEmployees().then(() => forceUpdate((n) => n + 1))
  }, [])

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent): void => {
      const isShortcut = (event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k'
      if (!isShortcut) return
      event.preventDefault()
      setIsOpen(true)
      setShortcutActive(true)
      window.setTimeout(() => inputRef.current?.focus(), 0)
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [])

  const results = useMemo(() => {
    if (!query.trim()) return []
    return ALL_EMPLOYEES.map((employee) => resolveMatch(employee, query))
      .filter((entry): entry is SearchResult => entry !== null)
      .slice(0, limit)
  }, [query, limit])

  const clear = useCallback(() => {
    setQuery('')
    setIsOpen(false)
  }, [])

  return {
    query,
    setQuery: useCallback((value: string) => {
      setQuery(value)
      setIsOpen(true)
    }, []),
    results,
    isOpen,
    open: useCallback(() => setIsOpen(true), []),
    close: useCallback(() => setIsOpen(false), []),
    clear,
    shortcutActive,
    inputRef
  }
}
