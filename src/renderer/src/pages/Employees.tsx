import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './Employees.css'
import { useEmployeeDirectory } from '../hooks/useEmployeeDirectory'
import {
  VEHICLE_STATUS_BADGE,
  VEHICLE_STATUS_ICON,
  VEHICLE_STATUS_LABEL,
  formatOdometer,
  importEmployeesFromCsv,
  vehicleUpdatedAt
} from '../services/employeeService'
import { downloadCsv } from '../services/exportService'
import { formatGpsCoordinate } from '../utils/geo'
import type { EmployeeEntry, VehicleStatus } from '../types/employee'

const VEHICLE_STATUS_DOT: Record<VehicleStatus, string> = {
  moving: 'var(--color-tertiary-fixed)',
  idling: 'var(--color-secondary-container)',
  maintenance: 'var(--color-outline)',
  offline: 'var(--color-error)'
}

/**
 * Directory and fleet data come from the employee service (mock adapter by
 * default, REST API when VITE_API_BASE_URL is set). This page renders them.
 */
const Employees: React.FC = () => {
  const navigate = useNavigate()
  const {
    meta,
    filteredEmployees,
    pagedEmployees,
    fleet,
    fleetSummary,
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
    addEmployee,
    editEmployee,
    removeEmployee,
    refresh
  } = useEmployeeDirectory()

  const [selectedIds, setSelectedIds] = useState<string[]>(['EMP-8821', 'EMP-9014'])

  // Modals state
  const [showAddModal, setShowAddModal] = useState(false)
  const [showProfileModal, setShowProfileModal] = useState<EmployeeEntry | null>(null)
  const [editingEmployee, setEditingEmployee] = useState<EmployeeEntry | null>(null)
  const [toastMessage, setToastMessage] = useState<string | null>(null)

  // New / Edited Employee Form state
  const [newEmpName, setNewEmpName] = useState('')
  const [newEmpEmail, setNewEmpEmail] = useState('')
  const [newEmpDept, setNewEmpDept] = useState('IT Engineering')
  const [newEmpRole, setNewEmpRole] = useState('')
  const [newEmpZone, setNewEmpZone] = useState('HQ Central Hub')
  const [formError, setFormError] = useState<string | null>(null)

  const showToast = (msg: string) => {
    setToastMessage(msg)
    setTimeout(() => setToastMessage(null), 3000)
  }

  // Handle individual selection
  const toggleSelect = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter((item) => item !== id))
    } else {
      setSelectedIds([...selectedIds, id])
    }
  }

  // Handle select all
  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedIds(filteredEmployees.map((emp) => emp.id))
    } else {
      setSelectedIds([])
    }
  }

  const handleResetFilters = () => {
    resetFilters()
    showToast('Filters reset to default')
  }

  const openCreateModal = () => {
    setEditingEmployee(null)
    setNewEmpName('')
    setNewEmpEmail('')
    setNewEmpDept('IT Engineering')
    setNewEmpRole('')
    setNewEmpZone('HQ Central Hub')
    setFormError(null)
    setShowAddModal(true)
  }

  /** Edit reuses the existing enrollment modal in edit mode. */
  const openEditModal = (employee: EmployeeEntry) => {
    setEditingEmployee(employee)
    setNewEmpName(employee.name)
    setNewEmpEmail(employee.email)
    setNewEmpDept(employee.department)
    setNewEmpRole(employee.role)
    setNewEmpZone(employee.geofence)
    setFormError(null)
    setShowProfileModal(null)
    setShowAddModal(true)
  }

  const handleAddEmployee = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newEmpName.trim()) {
      setFormError('Employee name is required')
      return
    }

    const input = {
      name: newEmpName,
      email: newEmpEmail,
      department: newEmpDept,
      role: newEmpRole || 'Field Operator',
      geofence: newEmpZone
    }

    if (editingEmployee) {
      const updated = await editEmployee(editingEmployee.id, input)
      setShowAddModal(false)
      showToast(
        updated
          ? `Employee ${updated.name} updated successfully!`
          : `Update for ${editingEmployee.empId} failed`
      )
      return
    }

    const record = await addEmployee(input)
    setShowAddModal(false)
    setNewEmpName('')
    setNewEmpEmail('')
    setNewEmpRole('')
    showToast(`Employee ${record.name} added successfully!`)
  }

  /** Delete is wired to the existing selection bar action set. */
  const handleDeleteSelected = async () => {
    const ids = [...selectedIds]
    for (const id of ids) {
      // Sequential so the service stays in sync with the rendered list.
      // eslint-disable-next-line no-await-in-loop
      await removeEmployee(id)
    }
    setSelectedIds([])
    showToast(`${ids.length} employee record(s) removed from the directory`)
  }

  return (
    <div className="emp-container">
      {/* Toast Notice */}
      {toastMessage && (
        <div className="toast-notice">
          <span className="material-symbols-outlined icon-md" style={{ color: 'var(--color-tertiary-fixed)' }}>
            check_circle
          </span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Action & Title Canvas */}
      <div className="emp-title-canvas">
        <div>
          <div className="emp-title-badge-row">
            <span className="emp-ops-pill">
              <span className="live-dot" style={{ width: 6, height: 6 }} />
              Ops Telemetry Live
            </span>
            <span className="emp-sync-id">SYNC-ID: #VF-9041</span>
          </div>
          <h1 className="emp-title">Employee Management Directory</h1>
          <p className="emp-subtitle">
            Manage {meta?.totalHeadcount ?? 0} registered personnel, monitoring permissions, and branch assignments.
          </p>
        </div>

        <div className="emp-top-actions">
          <button
            className="emp-btn-top"
            type="button"
            onClick={() => {
              // The file picker is created on demand so no extra markup is needed.
              const picker = document.createElement('input')
              picker.type = 'file'
              picker.accept = '.csv,text/csv'
              picker.onchange = async () => {
                const file = picker.files?.[0]
                if (!file) return
                const result = await importEmployeesFromCsv(await file.text())
                await refresh()
                showToast(
                  `Imported ${result.imported} employee(s)` +
                    (result.skipped > 0 ? ` • ${result.skipped} row(s) skipped` : '')
                )
              }
              picker.click()
            }}
          >
            <span className="material-symbols-outlined icon-sm">upload_file</span>
            Import CSV
          </button>
          <button
            className="emp-btn-top"
            type="button"
            onClick={() => {
              const filename = downloadCsv(
                'vanguard-roster',
                filteredEmployees.map((emp) => ({
                  employee_id: emp.empId,
                  name: emp.name,
                  email: emp.email,
                  rfid_token: emp.rfidToken,
                  department: emp.department,
                  role: emp.role,
                  geofence: emp.geofence,
                  attendance: emp.attendanceTime,
                  location_state: emp.locationDetail,
                  last_ping: emp.lastPing
                }))
              )
              showToast(`Exported ${filteredEmployees.length} roster row(s) → ${filename}`)
            }}
          >
            <span className="material-symbols-outlined icon-sm">file_download</span>
            Export Roster
          </button>
          <button
            className="emp-btn-top emp-btn-top-primary"
            type="button"
            onClick={openCreateModal}
          >
            <span className="material-symbols-outlined icon-sm">person_add</span>
            Add New Employee
          </button>
        </div>
      </div>

      {/* 4 High-Density Mission Telemetry Summary Cards */}
      <div className="emp-kpi-grid">
        {/* Card 1 */}
        <div className="emp-kpi-card">
          <div className="emp-kpi-header">
            <div>
              <span className="emp-kpi-label">Total Headcount</span>
              <div className="emp-kpi-metric-row">
                <span className="emp-kpi-metric">{meta?.totalHeadcount ?? 0}</span>
                <span className="emp-kpi-unit">Staff Units</span>
              </div>
            </div>
            <div className="emp-kpi-icon-box">
              <span className="material-symbols-outlined icon-lg">badge</span>
            </div>
          </div>
          <div className="emp-kpi-footer-sub">
            <span>{meta?.fullTime ?? 0} Full-time</span>
            <span style={{ color: 'var(--color-outline)' }}>•</span>
            <span>{meta?.contractFleet ?? 0} Contract Fleet</span>
          </div>
        </div>

        {/* Card 2 */}
        <div className="emp-kpi-card">
          <div className="emp-kpi-header">
            <div>
              <span className="emp-kpi-label">Geofenced Personnel</span>
              <div className="emp-kpi-metric-row">
                <span className="emp-kpi-metric">{meta?.geofencedPersonnel ?? 0}</span>
                <span className="emp-kpi-unit" style={{ color: 'var(--color-secondary-container)' }}>
                  Assigned
                </span>
              </div>
            </div>
            <div className="emp-kpi-icon-box" style={{ color: 'var(--color-secondary)' }}>
              <span className="material-symbols-outlined icon-lg">share_location</span>
            </div>
          </div>
          <div className="emp-progress-wrap">
            <div className="emp-progress-label-row">
              <span style={{ color: 'var(--color-on-surface-variant)' }}>Zone Integrity</span>
              <span style={{ color: 'var(--color-primary)', fontWeight: 600 }}>{meta?.zoneIntegrityPercent ?? 0}%</span>
            </div>
            <div className="emp-progress-track">
              <div className="emp-progress-bar" style={{ width: `${meta?.zoneIntegrityPercent ?? 0}%` }} />
            </div>
          </div>
        </div>

        {/* Card 3 */}
        <div className="emp-kpi-card">
          <div className="emp-kpi-header">
            <div>
              <span className="emp-kpi-label">Remote / Field Fleet</span>
              <div className="emp-kpi-metric-row">
                <span className="emp-kpi-metric">{meta?.remoteFieldFleet ?? 0}</span>
                <span className="emp-kpi-unit" style={{ color: 'var(--color-on-surface-variant)' }}>
                  Active Units
                </span>
              </div>
            </div>
            <div className="emp-kpi-icon-box" style={{ color: 'var(--color-secondary-container)' }}>
              <span className="material-symbols-outlined icon-lg">route</span>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 'var(--fs-body-sm)', color: 'var(--color-on-surface-variant)' }}>
            <span className="live-dot" style={{ width: 7, height: 7 }} />
            <span>Mobile GPS Uplink Connected</span>
          </div>
        </div>

        {/* Card 4 (Dark) */}
        <div className="emp-kpi-card card-dark">
          <div className="emp-kpi-header">
            <div>
              <span className="emp-kpi-label">Device Fleet Health</span>
              <div className="emp-kpi-metric-row">
                <span className="emp-kpi-metric">{meta?.deviceHealthPercent ?? 0}%</span>
              </div>
            </div>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 4,
                padding: '4px 8px',
                borderRadius: 'var(--radius-full)',
                background: 'rgba(222, 224, 255, 0.15)',
                color: 'var(--color-tertiary-fixed)',
                fontSize: 11,
                fontWeight: 700
              }}
            >
              <span className="live-dot" style={{ width: 5, height: 5 }} />
              OPTIMAL
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: 'var(--fs-body-sm)', color: 'var(--color-surface-dim)' }}>
            <span>Active Pings (Telemetry)</span>
            <span style={{ color: 'var(--color-tertiary-fixed)', fontWeight: 600 }}>{meta?.activePings ?? 0}/{meta?.totalDevices ?? 0} OK</span>
          </div>
        </div>
      </div>

      {/* Filter Control Bar */}
      <div className="emp-filter-bar">
        <div className="emp-search-wrap">
          <span className="material-symbols-outlined icon-md emp-search-icon">search</span>
          <input
            type="text"
            className="emp-search-input"
            placeholder="Search by employee name, ID, email, or department..."
            value={filters.search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="emp-select-group">
          {/* Department Select */}
          <div className="emp-select-wrap">
            <select
              className="emp-select"
              value={filters.department}
              onChange={(e) => setDepartment(e.target.value)}
            >
              <option>All Departments</option>
              <option>IT Engineering</option>
              <option>Design & Product</option>
              <option>Growth Marketing</option>
              <option>Finance & Control</option>
              <option>HR & People Ops</option>
              <option>Client Ops / Field</option>
              <option>Supply Chain</option>
            </select>
            <span className="material-symbols-outlined icon-sm emp-select-arrow">expand_more</span>
          </div>

          {/* Status Select */}
          <div className="emp-select-wrap">
            <select
              className="emp-select"
              value={filters.status}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option>All Statuses</option>
              <option>Active / On Duty</option>
              <option>Late Arrival</option>
              <option>Outside Zone Breach</option>
              <option>On Approved Leave</option>
            </select>
            <span className="material-symbols-outlined icon-sm emp-select-arrow">expand_more</span>
          </div>

          {/* Zone Select */}
          <div className="emp-select-wrap">
            <select
              className="emp-select"
              value={filters.zone}
              onChange={(e) => setZoneFilter(e.target.value)}
            >
              <option>All Geofence Zones</option>
              <option>HQ Central Hub</option>
              <option>South Hub</option>
              <option>Field Mobile Unit</option>
            </select>
            <span className="material-symbols-outlined icon-sm emp-select-arrow">expand_more</span>
          </div>

          <button
            className="emp-btn-reset-filters"
            type="button"
            title="Reset Filters"
            onClick={handleResetFilters}
          >
            <span className="material-symbols-outlined icon-md">filter_list_off</span>
          </button>
        </div>
      </div>

      {/* Selection Bar (Active State Simulation) */}
      {selectedIds.length > 0 && (
        <div className="emp-selection-bar">
          <div className="emp-selection-left">
            <span className="emp-selection-badge">{selectedIds.length}</span>
            <span style={{ fontSize: 'var(--fs-label-md)', fontWeight: 600 }}>
              Personnel records currently selected
            </span>
          </div>
          <div className="emp-selection-actions">
            <button
              className="emp-btn-selection"
              type="button"
              onClick={() => showToast(`Assigning geofence boundary to ${selectedIds.length} employees`)}
            >
              <span className="material-symbols-outlined icon-sm">share_location</span>
              Assign Geofence
            </button>
            <button
              className="emp-btn-selection"
              type="button"
              onClick={() => showToast(`Exported CSV for ${selectedIds.length} selected employees`)}
            >
              <span className="material-symbols-outlined icon-sm">download</span>
              Export Selected
            </button>
            <button
              className="emp-btn-selection btn-deactivate"
              type="button"
              onClick={handleDeleteSelected}
            >
              <span className="material-symbols-outlined icon-sm">block</span>
              Deactivate
            </button>
          </div>
        </div>
      )}

      {/* Enterprise Workforce Data Table */}
      <div className="emp-table-container">
        <div className="emp-table-wrapper">
          <table className="emp-table">
            <thead>
              <tr>
                <th style={{ width: 44, textAlign: 'center' }}>
                  <input
                    type="checkbox"
                    checked={
                      filteredEmployees.length > 0 &&
                      filteredEmployees.every((emp) => selectedIds.includes(emp.id))
                    }
                    onChange={handleSelectAll}
                    style={{ cursor: 'pointer', accentColor: 'var(--color-primary-container)' }}
                  />
                </th>
                <th>Employee Name</th>
                <th>ID &amp; Telemetry Token</th>
                <th>Dept &amp; Role</th>
                <th>Assigned Geofence</th>
                <th>Today Attendance</th>
                <th>Live Location State</th>
                <th>Last Ping</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {pagedEmployees.map((emp) => {
                const isChecked = selectedIds.includes(emp.id)
                const isBreach = emp.locationState === 'breach'
                const isField = emp.locationState === 'field'
                const isLeave = emp.attendanceStatus === 'leave'

                return (
                  <tr key={emp.id} className={isChecked ? 'row-selected' : ''}>
                    <td style={{ textAlign: 'center' }}>
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => toggleSelect(emp.id)}
                        style={{ cursor: 'pointer', accentColor: 'var(--color-primary-container)' }}
                      />
                    </td>
                    <td>
                      <div className="emp-cell-person">
                        {emp.avatar ? (
                          <img
                            src={emp.avatar}
                            alt={emp.name}
                            className="emp-table-avatar"
                            onError={(e) => {
                              (e.target as HTMLImageElement).style.display = 'none'
                              const fb = (e.target as HTMLElement).nextElementSibling as HTMLElement
                              if (fb) fb.style.display = 'flex'
                            }}
                          />
                        ) : null}
                        <div
                          className="emp-table-avatar-fallback"
                          style={{ display: emp.avatar ? 'none' : 'flex' }}
                        >
                          {emp.name.split(' ').map((n) => n[0]).join('')}
                        </div>
                        <div className="emp-person-meta">
                          <span className="emp-person-name">{emp.name}</span>
                          <span className="emp-person-email">{emp.email}</span>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="emp-cell-token">
                        <span className="emp-token-id">{emp.empId}</span>
                        <span className="emp-token-rfid">{emp.rfidToken}</span>
                      </div>
                    </td>
                    <td>
                      <div className="emp-cell-dept">
                        <span className="emp-dept-title">{emp.department}</span>
                        <span className="emp-role-sub">{emp.role}</span>
                      </div>
                    </td>
                    <td>
                      <span className={`emp-geofence-tag ${isField ? 'field-tag' : ''}`}>
                        <span className="material-symbols-outlined icon-sm" style={{ color: isField ? 'var(--color-secondary-container)' : 'var(--color-primary)' }}>
                          {isField ? 'navigation' : 'corporate_fare'}
                        </span>
                        {emp.geofence}
                      </span>
                    </td>
                    <td>
                      <span className={`emp-att-badge ${emp.attendanceStatus}`}>
                        <span
                          className="live-dot"
                          style={{
                            width: 6,
                            height: 6,
                            display: isLeave ? 'none' : 'inline-flex'
                          }}
                        />
                        {emp.attendanceTime}
                      </span>
                    </td>
                    <td>
                      {isBreach ? (
                        <div className="emp-loc-state breach">
                          <span className="material-symbols-outlined icon-sm">warning</span>
                          {emp.locationDetail}
                        </div>
                      ) : isField ? (
                        <div className="emp-loc-state field">
                          <span className="material-symbols-outlined icon-sm">near_me</span>
                          {emp.locationDetail}
                        </div>
                      ) : isLeave ? (
                        <div className="emp-loc-state leave">
                          <span className="live-dot" style={{ width: 6, height: 6, background: 'var(--color-outline)' }} />
                          {emp.locationDetail}
                        </div>
                      ) : (
                        <div className="emp-loc-state online">
                          <span className="live-dot" style={{ width: 6, height: 6 }} />
                          {emp.locationDetail}
                        </div>
                      )}
                    </td>
                    <td style={{ color: 'var(--color-outline)', fontFeatureSettings: '"tnum" 1' }}>
                      {emp.lastPing}
                    </td>
                    <td>
                      <div className="emp-row-actions">
                        <button
                          className={`emp-btn-action ${isBreach ? 'alert-btn' : 'radar-btn'}`}
                          type="button"
                          title={isBreach ? 'Inspect Breach Radar' : 'Live Radar Track'}
                          onClick={() => navigate('/live-monitoring')}
                        >
                          <span className="material-symbols-outlined icon-md">
                            {isBreach ? 'fmd_bad' : 'radar'}
                          </span>
                        </button>
                        <button
                          className="emp-btn-action"
                          type="button"
                          title="View Profile"
                          onClick={() => setShowProfileModal(emp)}
                        >
                          <span className="material-symbols-outlined icon-md">visibility</span>
                        </button>
                        <button
                          className="emp-btn-action"
                          type="button"
                          title="Edit Employee"
                          onClick={() => openEditModal(emp)}
                        >
                          <span className="material-symbols-outlined icon-md">edit</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        {/* Table Bottom Pagination */}
        <div className="emp-pagination-footer">
          <div className="emp-pag-left">
            <span>
              Showing <strong>{filteredEmployees.length === 0 ? 0 : (currentPage - 1) * rowsPerPage + 1} - {(currentPage - 1) * rowsPerPage + pagedEmployees.length}</strong> of <strong>{meta?.totalHeadcount ?? 0}</strong> employees
            </span>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ color: 'var(--color-outline)' }}>Rows per page:</span>
              <select
                className="emp-pag-select"
                value={String(rowsPerPage)}
                onChange={(e) => setRowsPerPage(Number(e.target.value))}
              >
                <option>8</option>
                <option>10</option>
                <option>25</option>
                <option>50</option>
              </select>
            </div>
          </div>

          <div className="emp-pag-right">
            <button
              className="emp-btn-page"
              type="button"
              disabled={currentPage === 1}
              style={{ opacity: currentPage === 1 ? 0.4 : 1 }}
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            >
              <span className="material-symbols-outlined icon-sm">chevron_left</span>
            </button>
            <button
              className={`emp-btn-page ${currentPage === 1 ? 'active' : ''}`}
              type="button"
              onClick={() => setCurrentPage(1)}
            >
              1
            </button>
            <button
              className={`emp-btn-page ${currentPage === 2 ? 'active' : ''}`}
              type="button"
              onClick={() => setCurrentPage(2)}
              disabled={pageCount < 2}
              style={pageCount < 2 ? { opacity: 0.4 } : undefined}
            >
              2
            </button>
            <button
              className={`emp-btn-page ${currentPage === 3 ? 'active' : ''}`}
              type="button"
              onClick={() => setCurrentPage(3)}
              disabled={pageCount < 3}
              style={pageCount < 3 ? { opacity: 0.4 } : undefined}
            >
              3
            </button>
            <span style={{ padding: '0 4px', color: 'var(--color-outline)' }}>...</span>
            <button
              className="emp-btn-page"
              type="button"
              onClick={() => setCurrentPage(pageCount)}
              disabled={pageCount < 4}
              style={pageCount < 4 ? { opacity: 0.4 } : undefined}
            >
              {pageCount}
            </button>
            <button
              className="emp-btn-page"
              type="button"
              onClick={() => setCurrentPage(Math.min(pageCount, currentPage + 1))}
              disabled={currentPage >= pageCount}
              style={currentPage >= pageCount ? { opacity: 0.4 } : undefined}
            >
              <span className="material-symbols-outlined icon-sm">chevron_right</span>
            </button>
          </div>
        </div>
      </div>

      {/* Fleet Management — rendered with the existing directory classes, no new CSS */}
      <div className="emp-bottom-grid">
        <div className="emp-bottom-card">
          <div className="emp-bottom-header">
            <h3 className="emp-bottom-title">
              <span className="material-symbols-outlined icon-md" style={{ color: 'var(--color-primary)' }}>
                local_shipping
              </span>
              Fleet Status Matrix
            </h3>
            <span style={{ fontSize: 11, fontWeight: 700, padding: '2px 8px', borderRadius: 'var(--radius-sm)', background: 'var(--color-surface-container)', color: 'var(--color-outline)' }}>
              {fleetSummary.totalVehicles} UNITS
            </span>
          </div>
          <p className="emp-bottom-desc">
            {fleetSummary.moving} moving, {fleetSummary.idling} idling, {fleetSummary.maintenance} in maintenance, {fleetSummary.offline} offline across the registered fleet.
          </p>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: 'var(--fs-label-sm)' }}>
            <span style={{ fontWeight: 600, color: 'var(--color-on-surface)' }}>
              {fleetSummary.totalOdometerKm.toLocaleString('en-US')} km fleet mileage
            </span>
            <span style={{ fontWeight: 600, color: fleetSummary.lowFuelCount > 0 ? 'var(--color-error)' : 'var(--color-primary)' }}>
              {fleetSummary.lowFuelCount} Low Fuel
            </span>
          </div>
        </div>

        <div className="emp-bottom-card">
          <div className="emp-bottom-header">
            <h3 className="emp-bottom-title">
              <span className="material-symbols-outlined icon-md" style={{ color: 'var(--color-secondary-container)' }}>
                local_gas_station
              </span>
              Fuel Telemetry Average
            </h3>
            <span className="live-dot" style={{ width: 7, height: 7 }} />
          </div>
          <p className="emp-bottom-desc">
            Average fuel level across all units, sampled from the vehicle telematics feed.
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 'var(--fs-label-sm)' }}>
            <span style={{ fontWeight: 600, color: 'var(--color-on-surface)', fontFamily: 'var(--font-body)', fontFeatureSettings: '"tnum" 1' }}>
              {fleetSummary.averageFuelPercent}%
            </span>
            <div className="emp-progress-track" style={{ flex: 1 }}>
              <div className="emp-progress-bar" style={{ width: `${fleetSummary.averageFuelPercent}%` }} />
            </div>
          </div>
        </div>

        <div className="emp-bottom-card card-dark">
          <div className="emp-bottom-header">
            <h3 className="emp-bottom-title">
              <span className="material-symbols-outlined icon-md" style={{ color: 'var(--color-tertiary-fixed)' }}>
                gps_fixed
              </span>
              Latest Position Fix
            </h3>
            <span style={{ fontSize: 11, fontWeight: 700, padding: '2px 8px', borderRadius: 'var(--radius-sm)', background: 'rgba(215, 243, 45, 0.15)', color: 'var(--color-tertiary-fixed)' }}>
              GPS
            </span>
          </div>
          <p className="emp-bottom-desc">
            {fleet.length > 0
              ? `${fleet[0].plate} reported ${formatGpsCoordinate(fleet[0].gps.lat, fleet[0].gps.lng)} at ${vehicleUpdatedAt(fleet[0])}.`
              : 'No vehicle position received yet.'}
          </p>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: 'var(--fs-label-sm)' }}>
            <span style={{ color: 'var(--color-outline)' }}>Active Telematics Nodes</span>
            <span style={{ fontWeight: 600, color: 'var(--color-tertiary-fixed)' }}>
              {fleet.filter((v) => v.status !== 'offline').length}/{fleet.length}
            </span>
          </div>
        </div>
      </div>

      <div className="emp-table-container">
        <div className="emp-table-wrapper">
          <table className="emp-table">
            <thead>
              <tr>
                <th>Vehicle &amp; Plate</th>
                <th>Status</th>
                <th>Driver</th>
                <th>Fuel Level</th>
                <th>Odometer / Speed</th>
                <th>Assigned Geofence</th>
                <th>Last Known Location</th>
                <th>Location Update</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {fleet.map((vehicle) => (
                <tr key={vehicle.id}>
                  <td>
                    <div className="emp-cell-token">
                      <span className="emp-token-id">{vehicle.plate}</span>
                      <span className="emp-token-rfid">{vehicle.model}</span>
                    </div>
                  </td>
                  <td>
                    <span className={VEHICLE_STATUS_BADGE[vehicle.status]}>
                      <span className="material-symbols-outlined" style={{ fontSize: 12 }}>
                        {VEHICLE_STATUS_ICON[vehicle.status]}
                      </span>
                      {VEHICLE_STATUS_LABEL[vehicle.status]}
                    </span>
                  </td>
                  <td>
                    <div className="emp-cell-dept">
                      <span className="emp-dept-title">{vehicle.driver}</span>
                      <span className="emp-role-sub">{vehicle.id}</span>
                    </div>
                  </td>
                  <td>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 4, minWidth: 96 }}>
                      <span style={{ fontSize: 'var(--fs-label-sm)', fontWeight: 600, color: vehicle.fuelPercent < 20 ? 'var(--color-error)' : 'var(--color-on-surface)', fontFeatureSettings: '"tnum" 1' }}>
                        {vehicle.fuelPercent}%
                      </span>
                      <div className="emp-progress-track">
                        <div
                          className="emp-progress-bar"
                          style={{ width: `${vehicle.fuelPercent}%`, background: vehicle.fuelPercent < 20 ? 'var(--color-error)' : 'var(--color-primary)' }}
                        />
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className="emp-cell-token">
                      <span className="emp-token-id">{formatOdometer(vehicle.odometerKm)}</span>
                      <span className="emp-token-rfid">{vehicle.speedKmh} km/h</span>
                    </div>
                  </td>
                  <td>
                    <span className="emp-geofence-tag">
                      <span className="material-symbols-outlined icon-sm" style={{ color: 'var(--color-primary)' }}>
                        corporate_fare
                      </span>
                      {vehicle.geofence}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      <span className="emp-loc-state online">
                        <span
                          className="live-dot"
                          style={{ width: 6, height: 6, background: VEHICLE_STATUS_DOT[vehicle.status] }}
                        />
                        {vehicle.gps.lat.toFixed(4)}, {vehicle.gps.lng.toFixed(4)}
                      </span>
                      <span style={{ fontSize: 11, color: 'var(--color-outline)', fontFeatureSettings: '"tnum" 1' }}>
                        ±{vehicle.gps.accuracy}m accuracy
                      </span>
                    </div>
                  </td>
                  <td style={{ color: 'var(--color-outline)', fontFeatureSettings: '"tnum" 1' }}>
                    {vehicleUpdatedAt(vehicle)}
                  </td>
                  <td>
                    <div className="emp-row-actions">
                      <button
                        className="emp-btn-action radar-btn"
                        type="button"
                        title="Ping Vehicle Telematics"
                        onClick={() => showToast(`High-frequency GPS ping sent to ${vehicle.plate}`)}
                      >
                        <span className="material-symbols-outlined icon-md">radar</span>
                      </button>
                      <button
                        className={`emp-btn-action ${vehicle.status === 'offline' ? 'alert-btn' : ''}`}
                        type="button"
                        title="View Vehicle Telemetry"
                        onClick={() => showToast(`${vehicle.plate}: ${vehicle.fuelPercent}% fuel, ${vehicle.odometerKm.toLocaleString('en-US')} km, ${VEHICLE_STATUS_LABEL[vehicle.status]}`)}
                      >
                        <span className="material-symbols-outlined icon-md">visibility</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quick Geofence Insights 3 Cards */}
      <div className="emp-bottom-grid">
        <div className="emp-bottom-card">
          <div className="emp-bottom-header">
            <h3 className="emp-bottom-title">
              <span className="material-symbols-outlined icon-md" style={{ color: 'var(--color-primary)' }}>
                security
              </span>
              Zone Verification Status
            </h3>
            <span style={{ fontSize: 11, fontWeight: 700, padding: '2px 8px', borderRadius: 'var(--radius-sm)', background: 'var(--color-surface-container)', color: 'var(--color-outline)' }}>
              LIVE
            </span>
          </div>
          <p className="emp-bottom-desc">
            {meta?.verifiedShiftPercent ?? 0}% of logged shifts are currently verified inside authenticated boundaries.
          </p>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: 'var(--fs-label-sm)' }}>
            <span style={{ fontWeight: 600, color: 'var(--color-on-surface)' }}>{meta?.verifiedInside ?? 0} Verified Inside</span>
            <span style={{ fontWeight: 600, color: 'var(--color-error)' }}>{meta?.perimeterBreaches ?? 0} Perimeter Breaches</span>
          </div>
        </div>

        <div className="emp-bottom-card">
          <div className="emp-bottom-header">
            <h3 className="emp-bottom-title">
              <span className="material-symbols-outlined icon-md" style={{ color: 'var(--color-secondary-container)' }}>
                bolt
              </span>
              Auto-Geofence Sync
            </h3>
            <span className="live-dot" style={{ width: 7, height: 7 }} />
          </div>
          <p className="emp-bottom-desc">
            Sub-second delta checks are executing on Jakarta HQ &amp; Surabaya regional gates.
          </p>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: 'var(--fs-label-sm)' }}>
            <span style={{ color: 'var(--color-outline)' }}>Heartbeat Latency</span>
            <span style={{ fontWeight: 600, color: 'var(--color-on-surface)' }}>{meta?.heartbeatLatencyMs ?? 0}ms avg</span>
          </div>
        </div>

        <div className="emp-bottom-card card-dark">
          <div className="emp-bottom-header">
            <h3 className="emp-bottom-title">
              <span className="material-symbols-outlined icon-md" style={{ color: 'var(--color-tertiary-fixed)' }}>
                emergency
              </span>
              Priority Protocol
            </h3>
            <span style={{ fontSize: 11, fontWeight: 700, padding: '2px 8px', borderRadius: 'var(--radius-sm)', background: 'rgba(215, 243, 45, 0.15)', color: 'var(--color-tertiary-fixed)' }}>
              READY
            </span>
          </div>
          <p className="emp-bottom-desc">
            Broadcast muster roll or instant push-notification alert to all active personnel in case of incident.
          </p>
          <button
            className="emp-btn-rollcall"
            type="button"
            onClick={() => showToast('Muster roll alert broadcasted to all active personnel')}
          >
            <span className="material-symbols-outlined icon-sm" style={{ color: 'var(--color-tertiary-fixed)' }}>
              crisis_alert
            </span>
            Initiate Zone Roll Call
          </button>
        </div>
      </div>

      {/* Add New Employee Modal */}
      {showAddModal && (
        <div className="emp-modal-backdrop" onClick={() => setShowAddModal(false)}>
          <div className="emp-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="emp-modal-header">
              <h3 className="emp-modal-title">{editingEmployee ? 'Edit Employee' : 'Add New Employee'}</h3>
              <button
                type="button"
                className="telemetry-tool-btn"
                onClick={() => setShowAddModal(false)}
              >
                <span className="material-symbols-outlined icon-md">close</span>
              </button>
            </div>

            <form onSubmit={handleAddEmployee}>
              <div className="emp-modal-body">
                <div className="emp-form-group">
                  <label className="emp-form-label">Full Name</label>
                  <input
                    type="text"
                    className="emp-form-input"
                    placeholder="e.g. Hendra Wijaya"
                    required
                    value={newEmpName}
                    onChange={(e) => setNewEmpName(e.target.value)}
                  />
                  {formError && (
                    <span className="emp-form-label" style={{ color: 'var(--color-error)' }}>
                      {formError}
                    </span>
                  )}
                </div>

                <div className="emp-form-group">
                  <label className="emp-form-label">Corporate Email</label>
                  <input
                    type="email"
                    className="emp-form-input"
                    placeholder="h.wijaya@vanguardops.com"
                    value={newEmpEmail}
                    onChange={(e) => setNewEmpEmail(e.target.value)}
                  />
                </div>

                <div className="emp-form-group">
                  <label className="emp-form-label">Department</label>
                  <select
                    className="emp-form-select"
                    value={newEmpDept}
                    onChange={(e) => setNewEmpDept(e.target.value)}
                  >
                    <option>IT Engineering</option>
                    <option>Design & Product</option>
                    <option>Growth Marketing</option>
                    <option>Finance & Control</option>
                    <option>HR & People Ops</option>
                    <option>Client Ops / Field</option>
                    <option>Supply Chain</option>
                  </select>
                </div>

                <div className="emp-form-group">
                  <label className="emp-form-label">Job Role / Title</label>
                  <input
                    type="text"
                    className="emp-form-input"
                    placeholder="e.g. Senior Security Auditor"
                    value={newEmpRole}
                    onChange={(e) => setNewEmpRole(e.target.value)}
                  />
                </div>

                <div className="emp-form-group">
                  <label className="emp-form-label">Assigned Geofence</label>
                  <select
                    className="emp-form-select"
                    value={newEmpZone}
                    onChange={(e) => setNewEmpZone(e.target.value)}
                  >
                    <option>HQ Central Hub</option>
                    <option>South Hub</option>
                    <option>Field Mobile Unit</option>
                  </select>
                </div>
              </div>

              <div className="emp-modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowAddModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingEmployee ? 'Update & Save' : 'Save & Enroll'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Profile Modal */}
      {showProfileModal && (
        <div className="emp-modal-backdrop" onClick={() => setShowProfileModal(null)}>
          <div className="emp-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="emp-modal-header">
              <h3 className="emp-modal-title">Employee Profile</h3>
              <button
                type="button"
                className="telemetry-tool-btn"
                onClick={() => setShowProfileModal(null)}
              >
                <span className="material-symbols-outlined icon-md">close</span>
              </button>
            </div>

            <div className="emp-modal-body">
              <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                {showProfileModal.avatar ? (
                  <img
                    src={showProfileModal.avatar}
                    alt={showProfileModal.name}
                    style={{ width: 56, height: 56, borderRadius: '50%', objectFit: 'cover' }}
                  />
                ) : (
                  <div
                    style={{
                      width: 56,
                      height: 56,
                      borderRadius: '50%',
                      background: 'var(--color-surface-container-high)',
                      color: 'var(--color-primary)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 700,
                      fontSize: 18
                    }}
                  >
                    {showProfileModal.name.split(' ').map((n) => n[0]).join('')}
                  </div>
                )}
                <div>
                  <h4 style={{ margin: 0, fontSize: 'var(--fs-title-md)', fontWeight: 700 }}>
                    {showProfileModal.name}
                  </h4>
                  <span style={{ fontSize: 'var(--fs-body-sm)', color: 'var(--color-outline)' }}>
                    {showProfileModal.email}
                  </span>
                  <div style={{ display: 'flex', gap: 6, marginTop: 4 }}>
                    <span className="telemetry-badge-id">{showProfileModal.empId}</span>
                    <span className="telemetry-dept">{showProfileModal.rfidToken}</span>
                  </div>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginTop: 10 }}>
                <div style={{ padding: 10, background: 'var(--color-surface-container-low)', borderRadius: 'var(--radius-base)' }}>
                  <span style={{ fontSize: 11, color: 'var(--color-outline)', display: 'block' }}>Department</span>
                  <strong style={{ fontSize: 13 }}>{showProfileModal.department}</strong>
                </div>
                <div style={{ padding: 10, background: 'var(--color-surface-container-low)', borderRadius: 'var(--radius-base)' }}>
                  <span style={{ fontSize: 11, color: 'var(--color-outline)', display: 'block' }}>Role</span>
                  <strong style={{ fontSize: 13 }}>{showProfileModal.role}</strong>
                </div>
                <div style={{ padding: 10, background: 'var(--color-surface-container-low)', borderRadius: 'var(--radius-base)' }}>
                  <span style={{ fontSize: 11, color: 'var(--color-outline)', display: 'block' }}>Assigned Zone</span>
                  <strong style={{ fontSize: 13 }}>{showProfileModal.geofence}</strong>
                </div>
                <div style={{ padding: 10, background: 'var(--color-surface-container-low)', borderRadius: 'var(--radius-base)' }}>
                  <span style={{ fontSize: 11, color: 'var(--color-outline)', display: 'block' }}>Live Status</span>
                  <strong style={{ fontSize: 13 }}>{showProfileModal.locationDetail}</strong>
                </div>
              </div>
            </div>

            <div className="emp-modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setShowProfileModal(null)}
              >
                Close
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => {
                  setShowProfileModal(null)
                  navigate('/live-monitoring')
                }}
              >
                <span className="material-symbols-outlined icon-sm">radar</span>
                Track on Radar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Employees
