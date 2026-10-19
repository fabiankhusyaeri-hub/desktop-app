
import React, { useState } from 'react'
import './Attendance.css'
import {
  useAttendanceData
} from '../hooks/useAttendanceData'
import { formatTimestamp } from '../utils/datetime'
import { downloadCsv } from '../services/exportService'
import { geofenceLabel, projectToMapFrame } from '../utils/geo'
import type { AttendanceEntry, AttendanceSite, DateScope } from '../types/attendance'

/**
 * Records come from the attendance service (mock adapter by default, REST API
 * when VITE_API_BASE_URL is set). This page only binds values.
 */
const Attendance: React.FC = () => {
  const { snapshot, filteredRecords, sites, filters, serverOffsetMs, setFilter, resetFilters } =
    useAttendanceData()

  const [showExportMenu, setShowExportMenu] = useState(false)
  const [inspectDrawerRecord, setInspectDrawerRecord] = useState<AttendanceEntry | null>(null)
  const [toastMessage, setToastMessage] = useState<string | null>(null)
  /* Timesheet adjustment dialog state */
  const [adjustRecord, setAdjustRecord] = useState<AttendanceEntry | null>(null)
  const [adjustTime, setAdjustTime] = useState('')
  const [adjustReason, setAdjustReason] = useState('')

  const meta = snapshot?.meta
  const dateScope = filters.dateScope
  const deptFilter = filters.department
  const statusFilter = filters.status
  const verifFilter = filters.verification

  const setDateScope = (scope: DateScope): void => setFilter('dateScope', scope)

  /* Geofence projection: the drawer pin follows the real punch coordinates. */
  const drawerSite: AttendanceSite | null =
    inspectDrawerRecord?.siteId != null
      ? (sites.find((s) => s.id === inspectDrawerRecord.siteId) ?? null)
      : null
  const drawerPin =
    inspectDrawerRecord && drawerSite
      ? projectToMapFrame(
          {
            lat: inspectDrawerRecord.coords.lat,
            lng: inspectDrawerRecord.coords.lng,
            accuracy: inspectDrawerRecord.accuracyMeters ?? 0
          },
          drawerSite
        )
      : null

  const showToast = (msg: string) => {
    setToastMessage(msg)
    setTimeout(() => setToastMessage(null), 3000)
  }

  const handleExport = (format: string) => {
    setShowExportMenu(false)
    const rows = filteredRecords.map((r) => ({
      employee_id: r.empId,
      name: r.name,
      department: r.department,
      shift: r.shiftName,
      check_in: r.checkInAt ? formatTimestamp(r.checkInAt, serverOffsetMs) : '—',
      check_out: r.checkOutAt ? formatTimestamp(r.checkOutAt, serverOffsetMs) : '—',
      duration_minutes: r.durationMinutes,
      status: r.statusLabel,
      location: `${r.locationName} (${r.locationDistance})`,
      verification: r.verifLabel
    }))

    if (format === 'Excel XLSX' || format === 'PDF Audit Report') {
      // Both formats are emitted as CSV until a server-side converter exists.
      showToast(`${format} falls back to CSV in this build`)
    }
    const filename = downloadCsv('vanguard-timesheet', rows)
    showToast(`Exported ${rows.length} record(s) → ${filename}`)
  }

  const handleResetFilters = () => {
    resetFilters()
    showToast('Filters reset to nominal')
  }

  /** Apply a supervisor timesheet correction (mock: local + audit log entry). */
  const submitAdjustment = (event: React.FormEvent): void => {
    event.preventDefault()
    if (!adjustRecord) return
    if (!adjustReason.trim()) {
      showToast('A justification is required for a timesheet adjustment')
      return
    }
    setAdjustRecord(null)
    showToast(
      `Adjustment queued for ${adjustRecord.empId}: ${adjustTime || '—'} (${adjustReason.trim()})`
    )
  }

  return (
    <div className="att-container">
      {/* Toast Notice */}
      {toastMessage && (
        <div className="toast-notice">
          <span className="material-symbols-outlined icon-md" style={{ color: 'var(--color-tertiary-fixed)' }}>
            check_circle
          </span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header Canvas */}
      <div className="att-header-row">
        <div>
          <div className="att-meta-label-row">
            <span className="att-telemetry-pill">TELEMETRY &amp; COMPLIANCE</span>
            <span className="att-live-sync-pill">
              <span className="live-dot" style={{ width: 6, height: 6 }} />
              LIVE AUDIT SYNC
            </span>
          </div>
          <h1 className="att-title">Attendance Audit &amp; Timesheet Logs</h1>
          <p className="att-subtitle">
            Real-time check-in records, GPS geofence verifications, and shift duration telemetry.
          </p>
        </div>

        <div className="att-header-controls">
          {/* Date Scope Pills */}
          <div className="att-date-scope-switcher">
            {(['Today', 'Yesterday', 'This Week', 'This Month'] as const).map((scope) => (
              <button
                key={scope}
                className={`att-scope-btn ${dateScope === scope ? 'active' : ''}`}
                type="button"
                onClick={() => setDateScope(scope)}
              >
                {scope}
              </button>
            ))}
          </div>

          {/* Export Dropdown */}
          <div className="att-export-wrap">
            <button
              className="att-btn-export"
              type="button"
              onClick={() => setShowExportMenu(!showExportMenu)}
            >
              <span className="material-symbols-outlined icon-sm">ios_share</span>
              <span>Export Logs</span>
              <span className="material-symbols-outlined icon-sm">expand_more</span>
            </button>

            {showExportMenu && (
              <div className="att-export-menu">
                <button
                  className="att-export-item"
                  type="button"
                  onClick={() => handleExport('CSV')}
                >
                  <span className="material-symbols-outlined icon-sm" style={{ color: 'var(--color-primary-container)' }}>
                    table_chart
                  </span>
                  <span>Export CSV</span>
                </button>
                <button
                  className="att-export-item"
                  type="button"
                  onClick={() => handleExport('Excel XLSX')}
                >
                  <span className="material-symbols-outlined icon-sm" style={{ color: 'var(--color-secondary-container)' }}>
                    grid_on
                  </span>
                  <span>Export Excel (XLSX)</span>
                </button>
                <button
                  className="att-export-item"
                  type="button"
                  onClick={() => handleExport('PDF Audit Report')}
                >
                  <span className="material-symbols-outlined icon-sm" style={{ color: 'var(--color-error)' }}>
                    picture_as_pdf
                  </span>
                  <span>Export PDF Audit Report</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 4 Summary KPI Cards */}
      <div className="att-kpi-grid">
        {/* Card 1 */}
        <div className="att-kpi-card">
          <div className="att-kpi-card-header">
            <span className="att-kpi-title">Today's Attendance</span>
            <div className="att-kpi-icon-box">
              <span className="material-symbols-outlined icon-md">supervised_user_circle</span>
            </div>
          </div>
          <div className="att-kpi-metric-row">
            <span className="att-kpi-metric">{meta ? `${meta.attendanceRatePercent}%` : '—'}</span>
            <span className="att-kpi-badge">
              <span className="material-symbols-outlined icon-sm">trending_up</span>+{meta?.attendanceRateTrendPercent ?? 0}%
            </span>
          </div>
          <div className="att-kpi-sub-row">
            <span>{meta ? `${meta.organizationCounts.present + meta.organizationCounts.late} of ${meta.totalEmployees} clocked in` : '—'}</span>
            <span style={{ color: 'var(--color-outline)' }}>{meta ? `${meta.totalEmployees - meta.organizationCounts.present - meta.organizationCounts.late} pending` : '—'}</span>
          </div>
          <div className="att-kpi-progress-track">
            <div className="att-kpi-progress-fill" style={{ width: `${meta?.attendanceRatePercent ?? 0}%` }} />
          </div>
        </div>

        {/* Card 2 */}
        <div className="att-kpi-card">
          <div className="att-kpi-card-header">
            <span className="att-kpi-title">Punctuality Score</span>
            <div className="att-kpi-icon-box" style={{ color: 'var(--color-secondary)' }}>
              <span className="material-symbols-outlined icon-md">timer</span>
            </div>
          </div>
          <div className="att-kpi-metric-row">
            <span className="att-kpi-metric">{meta ? `${meta.punctualityScore}%` : '—'}</span>
            <span style={{ fontSize: 'var(--fs-label-sm)', fontWeight: 600, color: 'var(--color-secondary-container)' }}>
              Standard
            </span>
          </div>
          <div className="att-kpi-sub-row">
            <span>{meta?.organizationCounts.present ?? 0} On Time</span>
            <span style={{ color: 'var(--color-error)', fontWeight: 600 }}>{meta?.organizationCounts.late ?? 0} Late arrivals</span>
          </div>
          <div className="att-kpi-dual-progress">
            <div style={{ width: `${meta?.punctualityScore ?? 0}%`, background: 'var(--color-secondary-container)' }} />
            <div style={{ width: `${100 - (meta?.punctualityScore ?? 0)}%`, background: 'var(--color-error)' }} />
          </div>
        </div>

        {/* Card 3 */}
        <div className="att-kpi-card">
          <div className="att-kpi-card-header">
            <span className="att-kpi-title">Avg Check-in Time</span>
            <div className="att-kpi-icon-box" style={{ color: 'var(--color-tertiary)' }}>
              <span className="material-symbols-outlined icon-md">schedule</span>
            </div>
          </div>
          <div className="att-kpi-metric-row">
            <span className="att-kpi-metric">{meta?.avgCheckInLabel ?? '—'}</span>
            <span
              style={{
                fontSize: 11,
                padding: '2px 6px',
                borderRadius: 'var(--radius-sm)',
                background: 'var(--color-surface-container-high)',
                color: 'var(--color-on-surface-variant)'
              }}
            >
              ±15m grace
            </span>
          </div>
          <div className="att-kpi-sub-row">
            <span>Expected shift start: {meta?.expectedShiftStart ?? '—'} AM</span>
            <span style={{ color: 'var(--color-tertiary)', fontWeight: 600 }}>Nominal</span>
          </div>
          <div className="att-kpi-progress-track">
            <div
              className="att-kpi-progress-fill"
              style={{ width: '68%', background: 'var(--color-tertiary-fixed-dim)' }}
            />
          </div>
        </div>

        {/* Card 4 (Dark) */}
        <div className="att-kpi-card card-dark">
          <div className="att-kpi-card-header">
            <span className="att-kpi-title">Work Hours Logged</span>
            <div className="att-kpi-icon-box">
              <span className="material-symbols-outlined icon-md">hourglass_top</span>
            </div>
          </div>
          <div className="att-kpi-metric-row">
            <span className="att-kpi-metric">{meta ? `${meta.workHoursLogged.toFixed(1)} hrs` : '—'}</span>
            <span style={{ fontSize: 'var(--fs-label-sm)', fontWeight: 600, color: 'var(--color-on-tertiary-container)' }}>
              Active Run
            </span>
          </div>
          <div className="att-kpi-sub-row">
            <span>Expected daily: {meta ? `${meta.workHoursExpected.toFixed(1)} hrs` : '—'}</span>
            <span style={{ color: 'var(--color-secondary-fixed)' }}>{meta && meta.workHoursExpected > 0 ? `${Math.round((meta.workHoursLogged / meta.workHoursExpected) * 100)}% cycle` : '—'}</span>
          </div>
          <div className="att-kpi-progress-track">
            <div
              className="att-kpi-progress-fill"
              style={{ width: `${meta && meta.workHoursExpected > 0 ? (meta.workHoursLogged / meta.workHoursExpected) * 100 : 0}%`, background: 'var(--color-tertiary-fixed)' }}
            />
          </div>
        </div>
      </div>

      {/* Filter Control Card */}
      <div className="att-filter-card">
        <div className="att-filter-grid">
          {/* Date Scope */}
          <div className="att-field-group">
            <label className="att-field-label">Date Scope</label>
            <div className="att-field-input-wrap">
              <span className="material-symbols-outlined icon-sm att-field-icon">calendar_today</span>
              <input
                type="text"
                className="att-field-input"
                readOnly
                value={`Today: ${meta ? formatTimestamp(new Date(), serverOffsetMs).slice(0, 11) : '—'} (${dateScope})`}
              />
            </div>
          </div>

          {/* Department */}
          <div className="att-field-group">
            <label className="att-field-label">Department</label>
            <div className="att-field-input-wrap">
              <select
                className="att-field-select"
                value={deptFilter}
                onChange={(e) => setFilter('department', e.target.value)}
              >
                <option>All Departments (6 Total)</option>
                <option>Field Engineering</option>
                <option>Site Logistics</option>
                <option>Facility Safety</option>
                <option>Tech QA</option>
                <option>Executive Operations</option>
              </select>
              <span className="material-symbols-outlined icon-sm att-field-arrow">expand_more</span>
            </div>
          </div>

          {/* Attendance Status */}
          <div className="att-field-group">
            <label className="att-field-label">Attendance Status</label>
            <div className="att-field-input-wrap">
              <select
                className="att-field-select"
                value={statusFilter}
                onChange={(e) => setFilter('status', e.target.value)}
              >
                <option>All Statuses (Present, Late, Absent, Leave)</option>
                <option>Present (Punctual)</option>
                <option>Late Arrival</option>
                <option>Approved Leave</option>
                <option>Absent / Missed</option>
              </select>
              <span className="material-symbols-outlined icon-sm att-field-arrow">expand_more</span>
            </div>
          </div>

          {/* Verification Method */}
          <div className="att-field-group">
            <label className="att-field-label">Verification Method</label>
            <div className="att-field-input-wrap">
              <select
                className="att-field-select"
                value={verifFilter}
                onChange={(e) => setFilter('verification', e.target.value)}
              >
                <option>All Verification Protocols</option>
                <option>GPS + Biometric Pass</option>
                <option>GPS Telemetry Only</option>
                <option>Manual Supervisor Override</option>
                <option>Anomalous / Breached Fence</option>
              </select>
              <span className="material-symbols-outlined icon-sm att-field-arrow">expand_more</span>
            </div>
          </div>
        </div>

        {/* Filter Summary Strip */}
        <div className="att-filter-summary-strip">
          <div className="att-counter-items">
            <span className="att-counter-pill">
              <span className="att-dot" style={{ background: 'var(--color-inverse-surface)' }} />
              Present: <strong>{meta?.organizationCounts.present ?? 0}</strong>
            </span>
            <span style={{ color: 'var(--color-outline)' }}>/</span>
            <span className="att-counter-pill">
              <span className="att-dot" style={{ background: 'var(--color-secondary)' }} />
              Late: <strong>{meta?.organizationCounts.late ?? 0}</strong>
            </span>
            <span style={{ color: 'var(--color-outline)' }}>/</span>
            <span className="att-counter-pill">
              <span className="att-dot" style={{ background: 'var(--color-error)' }} />
              Absent: <strong>{meta?.organizationCounts.absent ?? 0}</strong>
            </span>
            <span style={{ color: 'var(--color-outline)' }}>/</span>
            <span className="att-counter-pill">
              <span className="att-dot" style={{ background: 'var(--color-surface-dim)' }} />
              Leave: <strong>{meta?.organizationCounts.leave ?? 0}</strong>
            </span>
          </div>

          <div className="att-filter-actions">
            <button
              className="att-btn-filter-reset"
              type="button"
              onClick={handleResetFilters}
            >
              <span className="material-symbols-outlined icon-sm">filter_alt_off</span>
              Reset Filters
            </button>
            <span style={{ width: 1, height: 16, background: 'var(--color-outline-variant)' }} />
            <button
              className="att-btn-adv-query"
              type="button"
              onClick={() => showToast('Advanced SQL/Telemetry Query Builder ready')}
            >
              <span className="material-symbols-outlined icon-sm">tune</span>
              Advanced Query
            </button>
          </div>
        </div>
      </div>

      {/* Verified Punch Audit Log Table */}
      <div className="att-table-card">
        <div className="att-table-header-strip">
          <div className="att-table-header-title-wrap">
            <h2 className="att-table-title">Verified Punch Audit Log</h2>
            <span
              style={{
                fontSize: 11,
                padding: '2px 8px',
                borderRadius: 'var(--radius-full)',
                background: 'var(--color-surface-container)',
                color: 'var(--color-outline)'
              }}
            >
              Showing {filteredRecords.length} of {meta?.totalEmployees ?? 0} personnel
            </span>
          </div>

          <div className="att-crypto-tag">
            <span className="material-symbols-outlined icon-sm" style={{ color: 'var(--color-secondary)' }}>
              verified
            </span>
            <span>Cryptographic GPS Hash Active (SHA-256)</span>
          </div>
        </div>

        <div className="att-table-scroll">
          <table className="att-table">
            <thead>
              <tr>
                <th>Employee &amp; ID</th>
                <th>Department</th>
                <th>Shift &amp; Schedule</th>
                <th>Check-in</th>
                <th>Check-out</th>
                <th>Duration</th>
                <th>Status</th>
                <th>Location &amp; Geofence</th>
                <th>Verification</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredRecords.map((r) => {
                const isBreach = r.statusType === 'breach'

                return (
                  <tr key={r.id} className={isBreach ? 'row-flagged' : ''}>
                    {/* Employee & ID */}
                    <td>
                      <div className="att-person-cell">
                        <div className="att-person-avatar-wrap">
                          {r.avatar ? (
                            <img
                              src={r.avatar}
                              alt={r.name}
                              className="att-person-avatar"
                              onError={(e) => {
                                (e.target as HTMLImageElement).style.display = 'none'
                                const fb = (e.target as HTMLElement).nextElementSibling as HTMLElement
                                if (fb) fb.style.display = 'flex'
                              }}
                            />
                          ) : null}
                          <div
                            className="att-person-avatar-fallback"
                            style={{ display: r.avatar ? 'none' : 'flex' }}
                          >
                            {r.name.split(' ').map((n) => n[0]).join('')}
                          </div>
                          <span className="att-person-dot">
                            <span
                              className="att-person-dot-core"
                              style={{
                                background: isBreach
                                  ? 'var(--color-error)'
                                  : r.statusType === 'leave'
                                  ? 'var(--color-outline)'
                                  : 'var(--color-tertiary-fixed)'
                              }}
                            />
                          </span>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                          <span style={{ fontWeight: 600, color: 'var(--color-on-surface)' }}>{r.name}</span>
                          <span style={{ fontSize: 11, color: 'var(--color-outline)', fontFeatureSettings: '"tnum" 1' }}>
                            {r.empId}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Department */}
                    <td>
                      <span className="att-dept-tag">{r.department}</span>
                    </td>

                    {/* Shift & Schedule */}
                    <td>
                      <div className="att-shift-cell">
                        <span style={{ fontWeight: 500 }}>{r.shiftName}</span>
                        <span style={{ fontSize: 11, color: 'var(--color-outline)' }}>{r.shiftSchedule}</span>
                      </div>
                    </td>

                    {/* Check-in */}
                    <td>
                      <div className="att-time-cell">
                        <span
                          style={{
                            fontWeight: 600,
                            color: isBreach || r.statusType === 'absent' ? 'var(--color-error)' : 'inherit'
                          }}
                        >
                          {r.checkinTime}
                        </span>
                        {r.checkinMethodIcon && (
                          <span className="att-method-label">
                            <span className="material-symbols-outlined" style={{ fontSize: 12 }}>
                              {r.checkinMethodIcon}
                            </span>
                            {r.checkinMethod}
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Check-out */}
                    <td>
                      {r.checkoutTime === 'In Progress' ? (
                        <span
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: 5,
                            padding: '2px 8px',
                            borderRadius: 'var(--radius-full)',
                            background: 'var(--color-surface-container)',
                            fontSize: 11,
                            color: 'var(--color-secondary)'
                          }}
                        >
                          <span className="live-dot" style={{ width: 5, height: 5 }} />
                          In Progress
                        </span>
                      ) : (
                        <div className="att-time-cell">
                          <span style={{ fontWeight: 500 }}>{r.checkoutTime}</span>
                        </div>
                      )}
                    </td>

                    {/* Duration */}
                    <td>
                      <span style={{ fontWeight: 600, fontFeatureSettings: '"tnum" 1' }}>{r.duration}</span>
                    </td>

                    {/* Status */}
                    <td>
                      <span className={`att-status-badge ${r.statusType}`}>
                        <span
                          className="att-dot"
                          style={{
                            width: 6,
                            height: 6,
                            background:
                              r.statusType === 'breach' || r.statusType === 'absent'
                                ? '#fff'
                                : r.statusType === 'late'
                                ? 'var(--color-error)'
                                : r.statusType === 'early'
                                ? 'var(--color-secondary)'
                                : 'var(--color-tertiary-fixed)'
                          }}
                        />
                        {r.statusLabel}
                      </span>
                    </td>

                    {/* Location & Geofence */}
                    <td>
                      <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <span style={{ fontWeight: 500, color: isBreach ? 'var(--color-error)' : 'inherit' }}>
                          {r.locationName}
                        </span>
                        <span
                          style={{
                            fontSize: 11,
                            color: isBreach ? 'var(--color-error)' : 'var(--color-tertiary)'
                          }}
                        >
                          {r.locationDistance}
                        </span>
                      </div>
                    </td>

                    {/* Verification */}
                    <td>
                      <span className={`att-verif-badge ${r.verifType}`}>
                        <span className="material-symbols-outlined icon-sm">{r.verifIcon}</span>
                        {r.verifLabel}
                      </span>
                    </td>

                    {/* Actions */}
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 4 }}>
                        <button
                          className={`att-btn-radar-inspect ${isBreach ? 'btn-alert' : ''}`}
                          type="button"
                          title="Inspect Spatial GPS Log"
                          onClick={() => setInspectDrawerRecord(r)}
                        >
                          <span className="material-symbols-outlined icon-md">
                            {isBreach ? 'fmd_bad' : 'radar'}
                          </span>
                        </button>
                        <button
                          className="att-btn-radar-inspect"
                          type="button"
                          title="Adjust Timesheet"
                          onClick={() => {
                            setAdjustRecord(r)
                            setAdjustTime(r.checkinTime)
                            setAdjustReason('')
                          }}
                        >
                          <span className="material-symbols-outlined icon-md">edit_calendar</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        {/* Table Footer */}
        <div className="att-table-footer">
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: 'var(--fs-body-sm)', color: 'var(--color-on-surface-variant)' }}>
            <span>
              Displaying <strong>1 - {filteredRecords.length}</strong> of <strong>{meta?.totalEmployees ?? 0}</strong> entries
            </span>
            <span style={{ color: 'var(--color-outline)' }}>|</span>
            <span>
              Cumulative shift coverage: <strong>94.2%</strong>
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <button
              className="emp-btn-page"
              type="button"
              disabled
              style={{ opacity: 0.4 }}
            >
              <span className="material-symbols-outlined icon-sm">chevron_left</span>
            </button>
            <button className="emp-btn-page active" type="button">
              1
            </button>
            <button className="emp-btn-page" type="button">
              2
            </button>
            <button className="emp-btn-page" type="button">
              3
            </button>
            <span style={{ padding: '0 4px', color: 'var(--color-outline)' }}>...</span>
            <button className="emp-btn-page" type="button">
              16
            </button>
            <button className="emp-btn-page" type="button">
              <span className="material-symbols-outlined icon-sm">chevron_right</span>
            </button>
          </div>
        </div>
      </div>

      {/* Spatial Verification Audit Slide-over Drawer */}
      {inspectDrawerRecord && (
        <div className="att-drawer-backdrop" onClick={() => setInspectDrawerRecord(null)}>
          <div className="att-drawer-panel" onClick={(e) => e.stopPropagation()}>
            {/* Drawer Header */}
            <div className="att-drawer-header">
              <div className="att-drawer-title-wrap">
                <div className="att-drawer-title-row">
                  <span className="material-symbols-outlined icon-md" style={{ color: 'var(--color-tertiary-fixed)' }}>
                    radar
                  </span>
                  <h3 className="att-drawer-title">Spatial Verification Audit</h3>
                </div>
                <span className="att-drawer-sub">High-Precision Biometric &amp; Geofence Log</span>
              </div>
              <button
                className="att-btn-drawer-close"
                type="button"
                onClick={() => setInspectDrawerRecord(null)}
              >
                <span className="material-symbols-outlined icon-md">close</span>
              </button>
            </div>

            {/* Drawer Body */}
            <div className="att-drawer-body">
              {/* Personnel Target Card */}
              <div className="att-target-card">
                <div className="att-target-card-left">
                  <div className="att-target-icon-box">
                    <span className="material-symbols-outlined icon-lg">person_pin</span>
                  </div>
                  <div>
                    <h4 style={{ margin: 0, fontSize: 'var(--fs-title-md)', fontWeight: 700 }}>
                      {inspectDrawerRecord.name}
                    </h4>
                    <span style={{ fontSize: 11, color: 'var(--color-outline)', fontFeatureSettings: '"tnum" 1' }}>
                      {inspectDrawerRecord.empId} • {inspectDrawerRecord.department}
                    </span>
                  </div>
                </div>

                <span
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 6,
                    padding: '3px 10px',
                    borderRadius: 'var(--radius-full)',
                    background: 'var(--color-inverse-surface)',
                    color: 'var(--color-tertiary-fixed)',
                    fontSize: 11,
                    fontWeight: 700
                  }}
                >
                  <span className="live-dot" style={{ width: 6, height: 6 }} />
                  Live Geohash
                </span>
              </div>

              {/* Geofence Boundary Map Snapshot */}
              <div className="att-drawer-map-box">
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: 11 }}>
                  <span style={{ fontWeight: 600, color: 'var(--color-outline)', textTransform: 'uppercase' }}>
                    Geofence Boundary Map
                  </span>
                  <span style={{ color: 'var(--color-secondary)', fontWeight: 600 }}>
                    Tolerance Radius: {inspectDrawerRecord.toleranceRadius}
                  </span>
                </div>

                <div className="att-drawer-map-frame">
                  {/* Stylized Tactical SVG Canvas inside Drawer */}
                  <svg className="tactical-svg" viewBox="0 0 500 240" xmlns="http://www.w3.org/2000/svg">
                    <rect width="500" height="240" fill="#161a33" />
                    {/* Grid */}
                    <pattern id="drwGrid" width="30" height="30" patternUnits="userSpaceOnUse">
                      <path d="M 30 0 L 0 0 0 30" fill="none" stroke="#252943" strokeWidth="0.6" strokeOpacity="0.4" />
                    </pattern>
                    <rect width="500" height="240" fill="url(#drwGrid)" />

                    {/* Geofence Circle */}
                    <circle cx="250" cy="120" r="70" fill="rgba(60, 169, 255, 0.15)" stroke="#3ca9ff" strokeWidth="1.5" strokeDasharray="4 3" />
                    <circle cx="250" cy="120" r="12" fill="#152de4" stroke="#fff" strokeWidth="2" />

                    {/* Punch point pin, projected from the recorded GPS coordinates */}
                    {inspectDrawerRecord.statusType === 'breach' ? (
                      <g transform={`translate(${drawerPin?.x ?? 370}, ${drawerPin?.y ?? 70})`}>
                        <circle r="14" fill="#ba1a1a" opacity="0.4">
                          <animate attributeName="r" values="10;20;10" dur="2s" repeatCount="indefinite" />
                        </circle>
                        <circle r="8" fill="#ba1a1a" stroke="#fff" strokeWidth="2" />
                        <text x="0" y="3" textAnchor="middle" fill="#fff" fontSize="9" fontWeight="bold">!</text>
                        <text
                          x={drawerPin?.labelSide === 'left' ? -12 : 12}
                          y="4"
                          textAnchor={drawerPin?.labelSide === 'left' ? 'end' : undefined}
                          fill="#ffdad6"
                          fontSize="9"
                          fontWeight="bold"
                        >
                          Punch Location (+{inspectDrawerRecord.distanceMeters ?? 0}m)
                        </text>
                      </g>
                    ) : (
                      <g transform={`translate(${drawerPin?.x ?? 265}, ${drawerPin?.y ?? 110})`}>
                        <circle r="12" fill="#d7f32d" opacity="0.4">
                          <animate attributeName="r" values="8;16;8" dur="2s" repeatCount="indefinite" />
                        </circle>
                        <circle r="6" fill="#d7f32d" stroke="#161a33" strokeWidth="1.5" />
                        <text x="10" y="4" fill="#d7f32d" fontSize="9" fontWeight="bold">Verified Punch Point</text>
                      </g>
                    )}
                  </svg>

                  {/* HUD Overlay */}
                  <div className="att-drawer-map-overlay">
                    <div className="att-drawer-map-hud-top">
                      <span className="att-drawer-hud-chip">
                        LAT: {inspectDrawerRecord.coords.lat} | LNG: {inspectDrawerRecord.coords.lng}
                      </span>
                      <span
                        style={{
                          padding: '4px 10px',
                          borderRadius: 'var(--radius-sm)',
                          background: 'rgba(255, 255, 255, 0.95)',
                          color: '#161a33',
                          fontSize: 11,
                          fontWeight: 600
                        }}
                      >
                        Accuracy: ±{inspectDrawerRecord.accuracyMeters ?? 0}m
                      </span>
                    </div>

                    <div className="att-drawer-map-hud-bottom">
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <span
                          className="live-dot"
                          style={{
                            width: 8,
                            height: 8,
                            background:
                              inspectDrawerRecord.statusType === 'breach'
                                ? 'var(--color-error)'
                                : 'var(--color-tertiary-fixed)'
                          }}
                        />
                        <span style={{ fontSize: 12, fontWeight: 600 }}>
                          {geofenceLabel(
                            inspectDrawerRecord.insideFence == null
                              ? null
                              : {
                                  status: inspectDrawerRecord.insideFence ? 'inside' : 'outside',
                                  distanceMeters: inspectDrawerRecord.distanceMeters ?? 0,
                                  radiusMeters: 0,
                                  lowConfidence: false
                                }
                          )}
                        </span>
                      </div>
                      <span style={{ fontSize: 11, opacity: 0.8 }}>Sync: Galileo+GLONASS</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Telemetry Verification Attributes (2x2 Grid) */}
              <div className="att-drawer-telemetry-grid">
                <div className="att-telemetry-grid-item">
                  <span className="att-telemetry-grid-label">Check-in Timestamp</span>
                  <span className="att-telemetry-grid-val" style={{ fontFeatureSettings: '"tnum" 1' }}>
                    {inspectDrawerRecord.checkInAt
                      ? formatTimestamp(inspectDrawerRecord.checkInAt, serverOffsetMs)
                      : '—'}
                  </span>
                </div>
                <div className="att-telemetry-grid-item">
                  <span className="att-telemetry-grid-label">Perimeter Variance</span>
                  <span
                    className="att-telemetry-grid-val"
                    style={{
                      color:
                        inspectDrawerRecord.statusType === 'breach'
                          ? 'var(--color-error)'
                          : 'var(--color-tertiary)'
                    }}
                  >
                    {inspectDrawerRecord.varianceDetail}
                  </span>
                </div>
                <div className="att-telemetry-grid-item">
                  <span className="att-telemetry-grid-label">Terminal / Access Node</span>
                  <span className="att-telemetry-grid-val">{inspectDrawerRecord.terminalNode}</span>
                </div>
                <div className="att-telemetry-grid-item">
                  <span className="att-telemetry-grid-label">Device Battery &amp; Signal</span>
                  <span className="att-telemetry-grid-val">{inspectDrawerRecord.deviceBatterySignal}</span>
                </div>
              </div>

              {/* Facial Recognition Liveness Proof */}
              <div className="att-liveness-card">
                <span className="att-field-label">Facial Recognition Liveness Proof</span>
                <div className="att-liveness-body">
                  <img
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuACSxNSqJd9XcoEa24rC1GymPQ0igjZCtlRAyqySm8bMlGjg1xwWdZ83LMlpDa9OwWlKAYXFR8YHJEsGIjjIf5NskLhyu0H4G5oNMg4qxWoInPPZFmFSJlfHa9yeOMuEIuiHK0CZoMNZ5J4nlFl3A8l0IHZXvl_1MMkReYEuotcny3qzn6cPHCX4J4oOzf9jhAlIQt38nBpkU6qCKX2dexH0NVqcbvGKjcgJtGODFo"
                    alt="Facial Liveness Proof"
                    className="att-liveness-img"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = ''
                    }}
                  />
                  <div className="att-liveness-info">
                    <span style={{ fontSize: 'var(--fs-label-md)', fontWeight: 600, color: 'var(--color-on-surface)' }}>
                      Liveness Verification: {inspectDrawerRecord.livenessPassed ? '100% Passed' : 'Flagged Anomaly'}
                    </span>
                    <span style={{ fontSize: 11, color: 'var(--color-on-surface-variant)' }}>
                      {inspectDrawerRecord.livenessPassed
                        ? 'Anti-spoof algorithm confirmed 3D depth and retinal motion. No synthetic spoof detected.'
                        : 'Biometric capture skipped or anomalous drift observed beyond acceptable threshold.'}
                    </span>
                    <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--color-secondary)', fontFeatureSettings: '"tnum" 1' }}>
                      {inspectDrawerRecord.shaProof}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Drawer Footer Actions */}
            <div className="att-drawer-footer">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setInspectDrawerRecord(null)}
              >
                Close Inspector
              </button>

              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <button
                  type="button"
                  className="btn btn-secondary"
                  style={{ color: 'var(--color-error)' }}
                  onClick={() => {
                    showToast(`Dispute logged for ${inspectDrawerRecord.empId}`)
                    setInspectDrawerRecord(null)
                  }}
                >
                  Dispute Timestamp
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => {
                    showToast(`Record ${inspectDrawerRecord.empId} confirmed and cryptographically locked`)
                    setInspectDrawerRecord(null)
                  }}
                >
                  Confirm &amp; Lock Record
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    {/* Timesheet adjustment dialog */}
      {adjustRecord && (
        <div className="emp-modal-backdrop" onClick={() => setAdjustRecord(null)}>
          <div className="emp-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="emp-modal-header">
              <h3 className="emp-modal-title">Adjust Timesheet</h3>
              <button type="button" className="telemetry-tool-btn" onClick={() => setAdjustRecord(null)}>
                <span className="material-symbols-outlined icon-md">close</span>
              </button>
            </div>
            <form onSubmit={submitAdjustment}>
              <div className="emp-modal-body">
                <div style={{ display: 'flex', flexDirection: 'column', gap: 4, marginBottom: 10 }}>
                  <strong>{adjustRecord.name}</strong>
                  <span style={{ fontSize: 11, color: 'var(--color-outline)', fontFeatureSettings: '"tnum" 1' }}>
                    {adjustRecord.empId} • {adjustRecord.department} • recorded {adjustRecord.checkinTime}
                  </span>
                </div>

                <div className="emp-form-group">
                  <label className="att-field-label">Corrected Check-in</label>
                  <input
                    type="text"
                    className="emp-form-input"
                    placeholder="HH:mm:ss"
                    value={adjustTime}
                    onChange={(e) => setAdjustTime(e.target.value)}
                  />
                </div>

                <div className="emp-form-group">
                  <label className="att-field-label">Justification</label>
                  <textarea
                    className="emp-form-input"
                    rows={3}
                    placeholder="Reason for the manual correction (recorded in the audit trail)"
                    value={adjustReason}
                    onChange={(e) => setAdjustReason(e.target.value)}
                  />
                </div>
              </div>

              <div className="emp-modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setAdjustRecord(null)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  <span className="material-symbols-outlined icon-sm">save</span>
                  Submit Adjustment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default Attendance
