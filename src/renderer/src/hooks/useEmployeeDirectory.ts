/**
 * Employee directory & fleet state management (Module 4).
 *
 * Holds the directory snapshot, the filter state (search + three dropdowns),
 * client-side pagination and the CRUD actions. Filtering happens in memory, so
 * typing in the search box updates the table instantly without a reload.
 */

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import {
  DIRECTORY_POLL_MS,
  createEmployee,
  deleteEmployee,
  fetchDirectorySnapshot,
  summarizeFleet,
  updateEmployee
} from '../services/employeeService'
import type { EmployeeInput } from '../services/employeeService'
import type {
  DirectoryMeta,
  EmployeeEntry,
  EmployeeFilters,
  FleetSummary,
  FleetVehicle
} from '../types/employee'

export const ALL_DEPARTMENTS = 'All Departments'
export const ALL_STATUSES = 'All Statuses'
export const ALL_ZONES = 'All Geofence Zones'

export const DEFAULT_FILTERS: EmployeeFilters = {
  search: '',
  department: ALL_DEPARTMENTS,
  status: ALL_STATUSES,
  zone: ALL_ZONES
}

export type LoadStatus = 'idle' | 'loading' | 'ready' | 'error'

export interface DirectoryState {
  meta: DirectoryMeta | null
  employees: EmployeeEntry[]
  filteredEmployees: EmployeeEntry[]
  fleet: FleetVehicle[]
  fleetSummary: FleetSummary
  status: LoadStatus
  error: string | null
  filters: EmployeeFilters
  setSearch: (value: string) => void
  setDepartment: (value: string) => void
  setStatusFilter: (value: string) => void
  setZoneFilter: (value: string) => void
  resetFilters: () => void
  rowsPerPage: number
  setRowsPerPage: (value: number) => void
  currentPage: number
  setCurrentPage: (page: number) => void
  pageCount: number
  pagedEmployees: EmployeeEntry[]
  addEmployee: (input: EmployeeInput) => Promise<EmployeeEntry>
  editEmployee: (id: string, input: EmployeeInput) => Promise<EmployeeEntry | null>
  removeEmployee: (id: string) => Promise<boolean>
  refresh: () => Promise<void>
}

const matchesStatus = (employee: EmployeeEntry, status: string): boolean => {
  if (status === ALL_STATUSES) return true
  if (status === 'Active / On Duty') return employee.locationState === 'online'
  if (status === 'Late Arrival') return employee.attendanceStatus === 'late'
  if (status === 'Outside Zone Breach') return employee.locationState === 'breach'
  if (status === 'On Approved Leave') return employee.attendanceStatus === 'leave'
  return true
}

const matchesZone = (employee: EmployeeEntry, zone: string): boolean => {
  if (zone === ALL_ZONES) return true
  return employee.geofence.toLowerCase().includes(zone.toLowerCase().replace(' complex', ''))
}

const matchesSearch = (employee: EmployeeEntry, rawQuery: string): boolean => {
  const q = rawQuery.trim().toLowerCase()
  if (!q) return true
  return (
    employee.name.toLowerCase().includes(q) ||
    employee.empId.toLowerCase().includes(q) ||
    employee.email.toLowerCase().includes(q) ||
    employee.department.toLowerCase().includes(q) ||
    employee.role.toLowerCase().includes(q)
  )
}

export const useEmployeeDirectory = (pollIntervalMs = DIRECTORY_POLL_MS): DirectoryState => {
  const [meta, setMeta] = useState<DirectoryMeta | null>(null)
  const [employees, setEmployees] = useState<EmployeeEntry[]>([])
  const [fleet, setFleet] = useState<FleetVehicle[]>([])
  const [status, setStatus] = useState<LoadStatus>('idle')
  const [error, setError] = useState<string | null>(null)
  const [filters, setFilters] = useState<EmployeeFilters>(DEFAULT_FILTERS)
  const [rowsPerPage, setRowsPerPageState] = useState(10)
  const [currentPage, setCurrentPage] = useState(1)

  const mountedRef = useRef(true)

  const refresh = useCallback(async () => {
    try {
      const snapshot = await fetchDirectorySnapshot()
      if (!mountedRef.current) return
      setMeta(snapshot.meta)
      setEmployees(snapshot.employees)
      setFleet(snapshot.fleet)
      setStatus('ready')
      setError(null)
    } catch (err) {
      if (!mountedRef.current) return
      setStatus('error')
      setError(err instanceof Error ? err.message : 'Failed to load directory')
    }
  }, [])

  useEffect(() => {
    mountedRef.current = true
    void refresh()
    return () => {
      mountedRef.current = false
    }
  }, [refresh])

  useEffect(() => {
    const poller = window.setInterval(() => {
      void refresh()
    }, pollIntervalMs)
    return () => window.clearInterval(poller)
  }, [refresh, pollIntervalMs])

  const filteredEmployees = useMemo(
    () =>
      employees.filter(
        (employee) =>
          matchesSearch(employee, filters.search) &&
          (filters.department === ALL_DEPARTMENTS || employee.department === filters.department) &&
          matchesStatus(employee, filters.status) &&
          matchesZone(employee, filters.zone)
      ),
    [employees, filters]
  )

  const pageCount = Math.max(1, Math.ceil(filteredEmployees.length / rowsPerPage))

  const pagedEmployees = useMemo(() => {
    const start = (currentPage - 1) * rowsPerPage
    return filteredEmployees.slice(start, start + rowsPerPage)
  }, [filteredEmployees, currentPage, rowsPerPage])

  // Keep the page index inside the result set when a filter narrows the list.
  useEffect(() => {
    setCurrentPage((page) => Math.min(page, pageCount))
  }, [pageCount])

  const setSearch = useCallback((value: string) => {
    setFilters((prev) => ({ ...prev, search: value }))
    setCurrentPage(1)
  }, [])

  const patchFilter = useCallback(<K extends keyof EmployeeFilters>(key: K, value: EmployeeFilters[K]) => {
    setFilters((prev) => ({ ...prev, [key]: value }))
    setCurrentPage(1)
  }, [])

  const setDepartment = useCallback((value: string) => patchFilter('department', value), [patchFilter])
  const setStatusFilter = useCallback((value: string) => patchFilter('status', value), [patchFilter])
  const setZoneFilter = useCallback((value: string) => patchFilter('zone', value), [patchFilter])

  const resetFilters = useCallback(() => {
    setFilters(DEFAULT_FILTERS)
    setCurrentPage(1)
  }, [])

  const setRowsPerPage = useCallback((value: number) => {
    setRowsPerPageState(value)
    setCurrentPage(1)
  }, [])

  const addEmployee = useCallback(async (input: EmployeeInput) => {
    const record = await createEmployee(input)
    setEmployees((prev) => [record, ...prev])
    return record
  }, [])

  const editEmployee = useCallback(async (id: string, input: EmployeeInput) => {
    const updated = await updateEmployee(id, input)
    if (updated) {
      setEmployees((prev) => prev.map((employee) => (employee.id === id ? updated : employee)))
    }
    return updated
  }, [])

  const removeEmployee = useCallback(async (id: string) => {
    const removed = await deleteEmployee(id)
    if (removed) {
      setEmployees((prev) => prev.filter((employee) => employee.id !== id))
    }
    return removed
  }, [])

  const fleetSummary = useMemo(() => summarizeFleet(fleet), [fleet])

  return {
    meta,
    employees,
    filteredEmployees,
    fleet,
    fleetSummary,
    status,
    error,
    filters,
    setSearch,
    setDepartment,
    setStatusFilter,
    setZoneFilter,
    resetFilters,
    rowsPerPage,
    setRowsPerPage,
    currentPage,
    setCurrentPage,
    pageCount,
    pagedEmployees,
    addEmployee,
    editEmployee,
    removeEmployee,
    refresh
  }
}