import React, { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './Dashboard.css'
import { useDashboardData } from '../hooks/useDashboardData'
import { downloadCsv } from '../services/exportService'
import { broadcastTemplates, sendBroadcast } from '../services/notificationService'
import {
  SCOPE_LABEL,
  fetchMapPersonnel,
  matchesScope,
  summarizeMap
} from '../services/workforceService'
import type { MapPersonnel, MapScope } from '../services/workforceService'
import {
  formatCount,
  formatDuration,
  formatLongDate,
  formatPercent,
  formatSignedPercent,
  formatTimestamp,
  nowServer
} from '../utils/datetime'
import type {
  AttendanceLogEntry,
  AttendanceStatus,
  DashboardSnapshot,
  GeoStatus,
  WeeklyAttendancePoint
} from '../types/dashboard'

/* ==== Read-only view maps (presentation only, no markup changes) ==== */

const STATUS_LABEL: Record<AttendanceStatus, string> = {
  'on-time': 'On-Time',
  late: 'Late',
  early: 'Early',
  absent: 'Absent',
  'on-leave': 'On Leave'
}

const STATUS_COLOR: Record<AttendanceStatus, string> = {
  'on-time': 'var(--color-primary)',
  late: 'var(--color-secondary)',
  early: 'var(--color-tertiary-container)',
  absent: 'var(--color-outline)',
  'on-leave': 'var(--color-outline)'
}

const STATUS_CHIP_BG: Record<AttendanceStatus, string> = {
  'on-time': 'rgba(58,78,251,0.1)',
  late: 'var(--color-secondary-fixed)',
  early: 'rgba(212,240,41,0.15)',
  absent: 'var(--color-surface-container-high)',
  'on-leave': 'var(--color-surface-container-high)'
}

const GEO_LABEL: Record<GeoStatus, string> = {
  verified: 'Verified',
  outside: 'Outside',
  unverified: 'Unverified'
}

const GEO_ICON: Record<GeoStatus, string> = {
  verified: 'verified',
  outside: 'location_off',
  unverified: 'help'
}

/* ==== Chart geometry (matches the static mockup viewBox 0 0 420 160) ==== */

const PLOT_LEFT = 40
const PLOT_RIGHT = 400
const PLOT_BASELINE = 140
const PLOT_HEIGHT = 110
const ON_TIME_OFFSET = 25
const LATE_OFFSET = 41
const LABEL_OFFSET = 35
const DONUT_RADIUS = 40
const DONUT_CIRCUMFERENCE = 2 * Math.PI * DONUT_RADIUS

const barHeight = (value: number, scaleMax: number): number =>
  scaleMax <= 0 ? 0 : Math.round((value / scaleMax) * PLOT_HEIGHT)

const barBaseY = (value: number, scaleMax: number): number =>
  PLOT_BASELINE - barHeight(value, scaleMax)

const isFuturePoint = (point: WeeklyAttendancePoint, todayKey: string): boolean =>
  point.date > todayKey

const pointFill = (point: WeeklyAttendancePoint, todayKey: string): string => {
  if (point.isNow) return '#3a4efb'
  return isFuturePoint(point, todayKey) ? '#dee0ff' : '#152de4'
}

const pointLateFill = (point: WeeklyAttendancePoint, todayKey: string): string =>
  isFuturePoint(point, todayKey) ? '#dee0ff' : '#3ca9ff'

const Dashboard: React.FC = () => {
  const { data, msSinceSync, serverOffsetMs, refresh } = useDashboardData()

  if (!data) {
    return <div className="page-container" />
  }

  return (
    <DashboardContent
      data={data}
      msSinceSync={msSinceSync}
      serverOffsetMs={serverOffsetMs}
      onRefresh={refresh}
    />
  )
}

/* Separate component so the chart math is memoised away from the render body. */
const DashboardContent: React.FC<{
  data: DashboardSnapshot
  msSinceSync: number
  serverOffsetMs: number
  onRefresh: () => Promise<void>
}> = ({ data, msSinceSync, serverOffsetMs, onRefresh }) => {
  const navigate = useNavigate()
  const panelSearchRef = useRef<HTMLInputElement | null>(null)

  /* ==== Workforce projection for the tactical map ==== */
  const [personnel, setPersonnel] = useState<MapPersonnel[]>([])
  const [selectedId, setSelectedId] = useState<string>('EMP-8821')
  const [scope, setScope] = useState<MapScope>('all')
  const [mapLayer, setMapLayer] = useState<'geofence' | 'heatmap' | 'traffic'>('geofence')
  const [panelTab, setPanelTab] = useState<'all' | 'inside' | 'outside'>('all')
  const [panelSearch, setPanelSearch] = useState('')
  const [zoom, setZoom] = useState(1)
  const [toast, setToast] = useState<string | null>(null)

  /* ==== Broadcast modal ==== */
  const [broadcastOpen, setBroadcastOpen] = useState(false)
  const [broadcastTemplate, setBroadcastTemplate] = useState('tpl-rollcall')
  const [broadcastMessage, setBroadcastMessage] = useState('')
  const [broadcastSeverity, setBroadcastSeverity] = useState<'critical' | 'warning' | 'info'>('critical')
  const [broadcastAudience, setBroadcastAudience] = useState<'all' | 'hq' | 'field'>('all')

  useEffect(() => {
    let active = true
    void fetchMapPersonnel().then((list) => {
      if (active) setPersonnel(list)
    })
    return () => {
      active = false
    }
  }, [])

  const showToast = (message: string): void => {
    setToast(message)
    window.setTimeout(() => setToast(null), 3000)
  }

  /** Pin position, zoomed around the HQ beacon. */
  const pinPosition = (person: MapPersonnel): { left: number; top: number } => {
    const cx = 430
    const cy = 250
    return {
      left: Math.round(cx + (person.position.x - cx) * zoom),
      top: Math.round(cy + (person.position.y - cy) * zoom)
    }
  }

  const scopedPersonnel = useMemo(
    () => personnel.filter((person) => matchesScope(person, scope)),
    [personnel, scope]
  )

  const panelPersonnel = useMemo(() => {
    const query = panelSearch.trim().toLowerCase()
    return scopedPersonnel.filter((person) => {
      if (panelTab === 'inside' && person.state !== 'online') return false
      if (panelTab === 'outside' && person.state !== 'breach' && person.state !== 'field') return false
      if (!query) return true
      return (
        person.name.toLowerCase().includes(query) ||
        person.empId.toLowerCase().includes(query) ||
        person.role.toLowerCase().includes(query)
      )
    })
  }, [scopedPersonnel, panelTab, panelSearch])

  const selectedPerson = useMemo(
    () => personnel.find((person) => person.id === selectedId) ?? scopedPersonnel[0] ?? null,
    [personnel, scopedPersonnel, selectedId]
  )

  const mapSummary = useMemo(() => summarizeMap(scopedPersonnel), [scopedPersonnel])

  const todayKey = formatTimestamp(nowServer(serverOffsetMs)).slice(0, 10)
  const syncSeconds = Math.max(0, Math.round(msSinceSync / 1000))
  const { kpi, geo, meta } = data

  const chartPoints = data.weeklyAttendance
  const chartScaleMax = Math.max(
    1,
    ...chartPoints.flatMap((p) => [p.onTime, p.late])
  )
  const chartSlot = (PLOT_RIGHT - PLOT_LEFT) / Math.max(1, chartPoints.length)

  const donutTotal = data.statusBreakdown.reduce((sum, slice) => sum + slice.value, 0)
  const donutSlices = data.statusBreakdown.map((slice, index) => {
    const consumedBefore = data.statusBreakdown
      .slice(0, index)
      .reduce((sum, item) => sum + item.value, 0)
    const toArc = (value: number): number =>
      donutTotal > 0 ? (value / donutTotal) * DONUT_CIRCUMFERENCE : 0
    return {
      key: slice.key,
      colorToken: slice.colorToken,
      dasharray: `${toArc(slice.value).toFixed(1)} ${(DONUT_CIRCUMFERENCE - toArc(slice.value)).toFixed(1)}`,
      dashoffset: (-toArc(consumedBefore)).toFixed(1)
    }
  })
  const donutPresent = data.statusBreakdown.find((s) => s.key === 'on-time')
  const donutPresentRate =
    donutTotal > 0 && donutPresent ? (donutPresent.value / donutTotal) * 100 : 0

  /** Server-reported roll-up for the completion figure under the bar chart. */
  const avgCompletion = data.attendanceSummary?.averageCompletionPercent ?? 0

  /** Download the day's attendance log as CSV. */
  const handleExportDailyLog = (): void => {
    const filename = downloadCsv(
      'vanguard-daily-log',
      data.attendanceLog.map((row) => ({
        employee_id: row.employeeId,
        name: row.name,
        check_in: formatTimestamp(row.checkInAt, serverOffsetMs),
        status: STATUS_LABEL[row.status],
        gps: GEO_LABEL[row.geoStatus],
        department: row.department,
        location: row.locationLabel,
        work_minutes: row.workDurationMinutes
      }))
    )
    void onRefresh()
    showToast(`Exported ${data.attendanceLog.length} punch records → ${filename}`)
  }

  /** Send the composed broadcast and notify the whole console. */
  const handleBroadcast = async (event: React.FormEvent): Promise<void> => {
    event.preventDefault()
    const message = broadcastMessage.trim() || broadcastTemplates()[0]?.message || ''
    await sendBroadcast({
      templateId: broadcastTemplate,
      message,
      severity: broadcastSeverity,
      audience: broadcastAudience
    })
    setBroadcastOpen(false)
    setBroadcastMessage('')
    showToast('Broadcast alert dispatched to the selected audience')
  }

  const renderLogRow = (emp: AttendanceLogEntry) => (
    <tr key={emp.employeeId}>
      <td>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: '50%',
              background: 'var(--color-primary-fixed)',
              color: 'var(--color-on-primary-fixed)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 700,
              fontSize: 'var(--fs-label-sm)',
              flexShrink: 0
            }}
          >
            {emp.initials}
          </div>
          <div>
            <div
              style={{
                fontWeight: 600,
                fontSize: 'var(--fs-body-sm)',
                color: 'var(--color-on-surface)'
              }}
            >
              {emp.name}
            </div>
            <div style={{ fontSize: 11, color: 'var(--color-outline)' }}>{emp.employeeId}</div>
          </div>
        </div>
      </td>
      <td style={{ fontFamily: 'var(--font-body)', fontFeatureSettings: '"tnum" 1' }}>
        {formatTimestamp(emp.checkInAt, serverOffsetMs)}
      </td>
      <td>
        <span
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 4,
            padding: '2px 8px',
            borderRadius: 'var(--radius-full)',
            background: STATUS_CHIP_BG[emp.status],
            color: STATUS_COLOR[emp.status],
            fontSize: 'var(--fs-label-sm)',
            fontWeight: 600
          }}
        >
          {STATUS_LABEL[emp.status]}
        </span>
      </td>
      <td>
        <span
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 4,
            fontSize: 'var(--fs-label-sm)',
            fontWeight: 600,
            color: emp.geoStatus === 'verified' ? 'var(--color-primary)' : 'var(--color-secondary)'
          }}
        >
          <span className="material-symbols-outlined" style={{ fontSize: 14 }}>
            {GEO_ICON[emp.geoStatus]}
          </span>
          {GEO_LABEL[emp.geoStatus]}
        </span>
      </td>
      <td style={{ color: 'var(--color-on-surface-variant)' }}>{emp.department}</td>
      <td style={{ fontSize: 'var(--fs-body-sm)', color: 'var(--color-on-surface-variant)' }}>
        {emp.locationLabel}
      </td>
      <td
        style={{
          fontFamily: 'var(--font-body)',
          fontFeatureSettings: '"tnum" 1',
          fontWeight: 500
        }}
      >
        {formatDuration(emp.workDurationMinutes)}
      </td>
      <td>
        <button
          className="btn"
          style={{
            padding: '4px 10px',
            background: 'var(--color-surface-container)',
            color: 'var(--color-on-surface)',
            fontSize: 'var(--fs-label-sm)'
          }}
        >
          View
        </button>
      </td>
    </tr>
  )

  return (
    <div className="page-container">
      {toast && (
        <div className="toast-notice">
          <span className="material-symbols-outlined icon-md" style={{color:'var(--color-tertiary-fixed)'}}>
            check_circle
          </span>
          <span>{toast}</span>
        </div>
      )}

      {/* Top Greeting Banner */}
      <div className="dash-banner card">
        <div className="dash-banner-left">
          <div className="dash-banner-title-row">
            <h1 className="dash-title">Good morning, Admin</h1>
            <span className="chip chip-secondary">
              <span className="material-symbols-outlined icon-sm" style={{color:'var(--color-secondary-container)'}}>schedule</span>
              {formatLongDate(nowServer(serverOffsetMs))} &bull; Shift {meta.shift.code} ({meta.shift.start} - {meta.shift.end})
            </span>
          </div>
          <p className="dash-subtitle">
            Here's today's real-time attendance telemetry &amp; distributed workforce deployment.
          </p>
          <div className="dash-filter-chips">
            {(Object.keys(SCOPE_LABEL) as MapScope[]).map((option) => (
              <button
                key={option}
                className={`filter-chip ${scope === option ? 'active' : ''}`}
                type="button"
                onClick={() => {
                  setScope(option)
                  setPanelTab('all')
                }}
              >
                {SCOPE_LABEL[option]}
                {scope === option && <span className="filter-chip-dot" />}
              </button>
            ))}
          </div>
        </div>
        <div className="dash-banner-actions">
          <button className="btn btn-secondary" type="button" onClick={handleExportDailyLog}>
            <span className="material-symbols-outlined icon-sm" style={{color:'var(--color-secondary)'}}>file_download</span>
            Export Daily Log
          </button>
          <button className="btn btn-primary" type="button" onClick={() => setBroadcastOpen(true)}>
            <span className="material-symbols-outlined icon-sm">campaign</span>
            Broadcast Alert
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="dash-kpi-grid">
        <div className="kpi-card card">
          <div className="kpi-card-header">
            <span className="kpi-label">Total Employees</span>
            <div className="kpi-icon-box" style={{background:'var(--color-secondary-fixed)',color:'var(--color-on-secondary-fixed)'}}>
              <span className="material-symbols-outlined icon-md">group</span>
            </div>
          </div>
          <div className="kpi-metric">{formatCount(kpi.totalEmployees.value)}</div>
          <div className="kpi-trend trend-up">
            <span className="material-symbols-outlined icon-sm">trending_up</span>
            {kpi.totalEmployees.delta > 0 ? '+' : ''}
            {formatCount(kpi.totalEmployees.delta)} this month
          </div>
        </div>

        <div className="kpi-card card">
          <div className="kpi-card-header">
            <span className="kpi-label">Present Today</span>
            <div className="kpi-icon-box" style={{background:'var(--color-surface-container-high)',color:'var(--color-primary)'}}>
              <span className="material-symbols-outlined icon-md">check_circle</span>
            </div>
          </div>
          <div className="kpi-metric">{formatCount(kpi.presentToday.value)}</div>
          <div className="kpi-trend-row">
            <span className="chip chip-live" style={{fontSize:'var(--fs-label-sm)'}}>
              <span className="live-dot" style={{width:6,height:6}} />
              {formatPercent(kpi.presentToday.ratePercent, 2)}
            </span>
            <span className="kpi-vs" style={{color:'var(--color-on-surface-variant)'}}>{formatSignedPercent(kpi.presentToday.vsYesterdayPercent)} vs y&apos;day</span>
          </div>
        </div>

        <div className="kpi-card card">
          <div className="kpi-card-header">
            <span className="kpi-label">Late Today</span>
            <div className="kpi-icon-box" style={{background:'var(--color-surface-container)',color:'var(--color-secondary)'}}>
              <span className="material-symbols-outlined icon-md">alarm_on</span>
            </div>
          </div>
          <div className="kpi-metric">{formatCount(kpi.lateToday.value)}</div>
          <div className="kpi-trend" style={{color:'var(--color-secondary)'}}>
            <span className="material-symbols-outlined icon-sm">arrow_drop_down</span>
            {kpi.lateToday.deltaFromYesterday > 0 ? '+' : ''}
            {formatCount(kpi.lateToday.deltaFromYesterday)} from yesterday ({formatPercent(kpi.lateToday.sharePercent)})
          </div>
        </div>

        <div className="kpi-card card">
          <div className="kpi-card-header">
            <span className="kpi-label">Absent Today</span>
            <div className="kpi-icon-box" style={{background:'var(--color-surface-container-highest)',color:'var(--color-outline)'}}>
              <span className="material-symbols-outlined icon-md">person_off</span>
            </div>
          </div>
          <div className="kpi-metric">{formatCount(kpi.absentToday.value)}</div>
          <div className="kpi-sub">{formatCount(kpi.absentToday.approved)} approved, {formatCount(kpi.absentToday.unexcused)} unexcused</div>
        </div>

        <div className="kpi-card card kpi-card-dark">
          <div className="kpi-card-header">
            <span className="kpi-label" style={{color:'var(--color-surface-dim)'}}>Currently Working</span>
            <div className="kpi-icon-box" style={{background:'rgba(255,255,255,0.1)',color:'var(--color-tertiary-fixed)'}}>
              <span className="material-symbols-outlined icon-md">sensors</span>
            </div>
          </div>
          <div className="kpi-metric" style={{color:'var(--color-inverse-on-surface)'}}>{formatCount(kpi.currentlyWorking.value)}</div>
          <div className="kpi-trend-row">
            <span style={{
              display:'inline-flex',alignItems:'center',gap:6,
              padding:'2px 8px',borderRadius:'var(--radius-full)',
              background:'rgba(255,255,255,0.1)',
              color:'var(--color-tertiary-fixed)',
              fontSize:'var(--fs-label-sm)',fontWeight:600
            }}>
              <span className="animate-pulse" style={{
                width:8,height:8,borderRadius:'50%',
                background:'var(--color-tertiary-fixed)',
                display:'inline-block'
              }} />
              {formatCount(kpi.currentlyWorking.value)} Active Now
            </span>
          </div>
        </div>
      </div>

      {/* Main Content: Map + Employee Panel */}
      <div className="dash-main-grid">
        {/* Map Canvas */}
        <div className="dash-map-card card">
          <div className="dash-map-header">
            <div className="dash-map-title-row">
              <h2 className="dash-section-title">Live Employee Monitoring</h2>
              <span className="chip chip-live">
                <span className="live-dot" style={{width:6,height:6}} />
                LIVE
              </span>
            </div>
            <span className="dash-geofence-label chip chip-secondary">
              HQ Geofence Active (Radius {formatCount(geo.geofenceRadiusMeters)}m)
            </span>
            <div className="dash-map-layer-toggle">
              <button
                className={`layer-btn ${mapLayer === 'geofence' ? 'active' : ''}`}
                type="button"
                onClick={() => setMapLayer('geofence')}
              >
                Geofence
              </button>
              <button
                className={`layer-btn ${mapLayer === 'heatmap' ? 'active' : ''}`}
                type="button"
                onClick={() => setMapLayer('heatmap')}
              >
                Heatmap
              </button>
              <button
                className={`layer-btn ${mapLayer === 'traffic' ? 'active' : ''}`}
                type="button"
                onClick={() => setMapLayer('traffic')}
              >
                Traffic
              </button>
            </div>
          </div>

          {/* Map SVG Canvas */}
          <div className="dash-map-canvas">
            <svg className="dash-map-bg" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="map-grid" width="60" height="60" patternUnits="userSpaceOnUse">
                  <path d="M 60 0 L 0 0 0 60" fill="none" stroke="var(--color-surface-container-high)" strokeWidth="0.75" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#map-grid)" />
              <path d="M -50 180 L 900 240" fill="none" stroke="var(--color-surface-variant)" strokeWidth="24" />
              <path d="M 280 -20 L 410 600" fill="none" stroke="var(--color-surface-variant)" strokeWidth="28" />
              <path d="M 120 450 C 300 420, 520 480, 850 380" fill="none" stroke="var(--color-surface-variant)" strokeWidth="18" />
              <path d="M 520 -40 L 590 600" fill="none" stroke="var(--color-surface-container-high)" strokeWidth="14" />
              <polygon points="340,190 480,180 500,280 360,300" fill="#cfe5ff" fillOpacity="0.6" stroke="var(--color-secondary-container)" strokeWidth="2" />
              <polygon points="495,290 560,285 550,350 485,355" fill="#edecff" fillOpacity="0.8" stroke="var(--color-primary-container)" strokeWidth="1.5" />
              <polygon points="260,220 310,215 300,270 250,275" fill="#edecff" fillOpacity="0.7" stroke="var(--color-surface-variant)" strokeWidth="1.5" />
              <circle cx="430" cy="250" r="175" fill="var(--color-secondary-container)" fillOpacity="0.08" stroke="var(--color-primary)" strokeWidth="2" strokeDasharray="8 6" opacity={mapLayer === 'traffic' ? 0.35 : 1} />
              <circle cx="430" cy="250" r="177" fill="none" stroke="var(--color-tertiary-fixed)" strokeWidth="1" strokeDasharray="2 8" opacity="0.6" />

              {/* Density heat layer — drawn from the live personnel positions */}
              {mapLayer === 'heatmap' &&
                personnel.map((person) => (
                  <circle
                    key={`heat-${person.id}`}
                    cx={person.position.x}
                    cy={person.position.y}
                    r="70"
                    fill={person.state === 'breach' ? '#ba1a1a' : 'var(--color-primary)'}
                    fillOpacity="0.18"
                    style={{ filter: 'blur(14px)' }}
                  />
                ))}

              {/* Traffic density overlay along the existing corridors */}
              {mapLayer === 'traffic' && (
                <g>
                  <path d="M -50 180 L 900 240" fill="none" stroke="#ba1a1a" strokeWidth="24" opacity="0.25" />
                  <path d="M 280 -20 L 410 600" fill="none" stroke="#d4f029" strokeWidth="28" opacity="0.22" />
                  <path d="M 120 450 C 300 420, 520 480, 850 380" fill="none" stroke="#d4f029" strokeWidth="18" opacity="0.22" />
                  <path d="M 520 -40 L 590 600" fill="none" stroke="#ba1a1a" strokeWidth="14" opacity="0.25" />
                  <text x="520" y="210" fill="var(--color-error)" fontSize="12" fontWeight="700" textAnchor="middle">Congested</text>
                </g>
              )}
            </svg>

            {/* Telemetry Overlay — clickable filters for the personnel panel */}
            <div className="map-telemetry-overlay">
              <span
                className="map-telemetry-chip"
                style={{
                  background:'var(--color-surface-container-high)',
                  color:'var(--color-primary)',
                  cursor:'pointer',
                  outline: panelTab === 'inside' ? '2px solid var(--color-primary)' : 'none'
                }}
                onClick={() => setPanelTab(panelTab === 'inside' ? 'all' : 'inside')}
                title={`${mapSummary.inside} node(s) currently inside — click to filter`}
              >
                <span style={{width:8,height:8,borderRadius:'50%',background:'var(--color-primary)',display:'inline-block'}} />
                {formatCount(geo.insideGeofence)} Inside Geofence
              </span>
              <span
                className="map-telemetry-chip"
                style={{
                  background:'var(--color-secondary-fixed)',
                  color:'var(--color-on-secondary-fixed)',
                  cursor:'pointer',
                  outline: panelTab === 'outside' ? '2px solid var(--color-secondary)' : 'none'
                }}
                onClick={() => setPanelTab(panelTab === 'outside' ? 'all' : 'outside')}
                title={`${mapSummary.outside} node(s) outside the perimeter — click to filter`}
              >
                <span style={{width:8,height:8,borderRadius:'50%',background:'var(--color-secondary)',display:'inline-block'}} />
                {formatCount(geo.outsidePerimeter)} Outside Perimeter
              </span>
              <span
                className="map-telemetry-chip"
                style={{
                  background:'var(--color-surface-container)',
                  color:'var(--color-on-surface-variant)',
                  cursor:'pointer',
                  outline: panelTab === 'all' && scope === 'all' ? 'none' : '2px solid var(--color-tertiary-fixed-dim)'
                }}
                onClick={() => {
                  setPanelTab('all')
                  setScope('all')
                }}
                title={`${mapSummary.breach} active breach alert(s) in the current scope`}
              >
                <span className="material-symbols-outlined" style={{fontSize:14,color:'var(--color-tertiary-fixed-dim)'}}>verified</span>
                {formatCount(geo.breach)} Breach Alerts
              </span>
            </div>

            {/* Zoom Controls */}
            <div className="map-zoom-controls">
              <button className="map-ctrl-btn" title="Zoom In" type="button" onClick={() => setZoom((z) => Math.min(2, Number((z + 0.25).toFixed(2))))}>
                <span className="material-symbols-outlined icon-sm">add</span>
              </button>
              <div className="map-ctrl-divider" />
              <button className="map-ctrl-btn" title="Zoom Out" type="button" onClick={() => setZoom((z) => Math.max(1, Number((z - 0.25).toFixed(2))))}>
                <span className="material-symbols-outlined icon-sm">remove</span>
              </button>
              <div className="map-ctrl-divider" />
              <button className="map-ctrl-btn" title="Recenter" type="button" onClick={() => { setZoom(1); showToast('Map recentered on Vanguard Central HQ') }}>
                <span className="material-symbols-outlined icon-sm">my_location</span>
              </button>
            </div>

            {/* HQ Beacon */}
            <div className="map-hq-beacon">
              <div className="map-hq-dot" />
              <span className="map-hq-label">HQ HUB</span>
            </div>

            {/* Employee Pins — projected from the live coordinates of each node */}
            {personnel
              .filter((person) => person.state !== 'field')
              .map((person) => {
                const spot = pinPosition(person)
                const isSelected = selectedPerson?.id === person.id
                const inScope = scopedPersonnel.some((p) => p.id === person.id)
                return (
                  <div
                    key={person.id}
                    className={`map-pin ${isSelected ? 'selected' : ''}`}
                    style={{
                      left: spot.left,
                      top: spot.top,
                      opacity: inScope ? 1 : 0.35,
                      cursor: 'pointer'
                    }}
                    onClick={() => setSelectedId(person.id)}
                  >
                    {isSelected && <span className="map-pin-ping animate-ping" />}
                    <div className={`map-pin-avatar ${person.state === 'breach' ? 'outside' : 'primary'}${isSelected ? '' : ' sm'}`}>
                      {person.initials}
                    </div>
                    {isSelected ? (
                      <div className="map-pin-card">
                        <div className="map-pin-card-header">
                          <span style={{color:'var(--color-tertiary-fixed)',fontWeight:700,fontSize:'var(--fs-label-sm)'}}>{person.name}</span>
                          <span style={{fontSize:10,color:'var(--color-surface-dim)'}}>{person.distanceLabel}</span>
                        </div>
                        <div style={{fontSize:11,color:'var(--color-surface-dim)'}}>{person.role} • {person.empId}</div>
                        <div style={{display:'flex',alignItems:'center',gap:4,marginTop:4,fontSize:10,color:'var(--color-on-tertiary-container)'}}>
                          <span style={{width:6,height:6,borderRadius:'50%',background:'var(--color-tertiary-fixed)',display:'inline-block'}} />
                          {person.stateLabel}
                        </div>
                      </div>
                    ) : (
                      <div className="map-pin-tooltip">
                        {person.name} ({person.departmentLabel}) • {person.distanceLabel}
                      </div>
                    )}
                  </div>
                )
              })}
          </div>
        </div>

        {/* Active Employees Panel */}
        <div className="dash-emp-panel card">
          <div className="emp-panel-header">
            <div style={{display:'flex',alignItems:'center',gap:8}}>
              <h2 className="dash-section-title">Active Employees</h2>
              <span style={{
                padding:'2px 8px',borderRadius:'var(--radius-full)',
                background:'var(--color-surface-container)',
                color:'var(--color-primary)',
                fontFamily:'var(--font-body)',fontSize:'var(--fs-label-sm)',fontWeight:600
              }}>87</span>
            </div>
            <button className="icon-btn" type="button" title="Focus Search" onClick={() => panelSearchRef.current?.focus()}>
              <span className="material-symbols-outlined icon-md">tune</span>
            </button>
          </div>

          <div className="relative" style={{position:'relative'}}>
            <span className="material-symbols-outlined" style={{
              position:'absolute',left:12,top:'50%',transform:'translateY(-50%)',
              color:'var(--color-outline)',fontSize:20,pointerEvents:'none'
            }}>search</span>
            <input
              ref={panelSearchRef}
              className="input"
              type="text"
              placeholder="Search employee or ID..."
              style={{paddingLeft:40}}
              value={panelSearch}
              onChange={(e) => setPanelSearch(e.target.value)}
            />
          </div>

          <div className="emp-panel-tabs">
            <button className={`emp-tab ${panelTab === 'all' ? 'active' : ''}`} type="button" onClick={() => setPanelTab('all')}>
              All (87)
            </button>
            <button className={`emp-tab ${panelTab === 'inside' ? 'active' : ''}`} type="button" onClick={() => setPanelTab('inside')}>
              Inside (82)
            </button>
            <button className={`emp-tab ${panelTab === 'outside' ? 'active' : ''}`} type="button" onClick={() => setPanelTab('outside')}>
              Outside (5)
            </button>
          </div>

          {/* Selected Employee Card */}
          <div className="emp-selected-card">
            <div className="emp-selected-header">
              <div style={{display:'flex',alignItems:'center',gap:12}}>
                <img
                  src={selectedPerson?.avatar ?? ''}
                  alt={selectedPerson?.name ?? ''}
                  style={{width:44,height:44,borderRadius:'50%',objectFit:'cover',border:'2px solid var(--color-tertiary-fixed)'}}
                  onError={(e) => { (e.target as HTMLImageElement).style.display='none' }}
                />
                <div>
                  <div style={{fontFamily:'var(--font-heading)',fontSize:'var(--fs-title-md)',fontWeight:700,color:'var(--color-inverse-on-surface)'}}>{selectedPerson?.name ?? '—'}</div>
                  <div style={{fontSize:'var(--fs-body-sm)',color:'var(--color-surface-dim)'}}>{selectedPerson?.role} • {selectedPerson?.empId}</div>
                </div>
              </div>
              <span className="chip chip-live">
                <span className="animate-pulse" style={{width:6,height:6,borderRadius:'50%',background:'var(--color-tertiary-fixed)',display:'inline-block'}} />
                LIVE
              </span>
            </div>

            <div className="emp-selected-grid">
              <div>
                <div className="emp-field-label">Check-in Status</div>
                <div style={{color:'var(--color-tertiary-fixed)',fontWeight:600,fontSize:'var(--fs-label-md)'}}>{selectedPerson?.checkinLabel ?? '—'}</div>
              </div>
              <div>
                <div className="emp-field-label">Distance to HQ</div>
                <div style={{color:'var(--color-inverse-on-surface)',fontFamily:'var(--font-body)',fontWeight:500,fontSize:'var(--fs-label-md)'}}>{selectedPerson ? `${selectedPerson.distanceMeters} meters` : '—'}</div>
              </div>
              <div style={{gridColumn:'1/-1'}}>
                <div className="emp-field-label">Live Position Telemetry</div>
                <div style={{fontSize:'var(--fs-body-sm)',color:'var(--color-surface-dim)'}}>{selectedPerson?.zoneDetail ?? '—'}</div>
              </div>
            </div>

            <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',paddingTop:4}}>
              <span style={{fontSize:'var(--fs-label-sm)',color:'var(--color-surface-dim)',display:'flex',alignItems:'center',gap:4}}>
                <span className="material-symbols-outlined" style={{fontSize:14,color:'var(--color-tertiary-fixed)'}}>sensors</span>
                Pinged 10s ago
              </span>
              <div style={{display:'flex',gap:8}}>
                <button
                  className="btn"
                  style={{padding:'4px 10px',background:'rgba(255,255,255,0.1)',color:'var(--color-inverse-on-surface)',fontSize:'var(--fs-label-sm)'}}
                  type="button"
                  onClick={() => selectedPerson && navigate(`/employees?q=${encodeURIComponent(selectedPerson.empId)}`)}
                >
                  Details
                </button>
                <button
                  className="btn btn-primary-container"
                  style={{padding:'4px 10px',fontSize:'var(--fs-label-sm)'}}
                  type="button"
                  onClick={() => selectedPerson && showToast(`Focused on ${selectedPerson.name} at ${selectedPerson.gps.lat.toFixed(4)}, ${selectedPerson.gps.lng.toFixed(4)}`)}
                >
                  <span className="material-symbols-outlined" style={{fontSize:14}}>my_location</span>
                  Focus
                </button>
              </div>
            </div>
          </div>

          {/* Personnel List */}
          <div className="emp-list">
            {panelPersonnel
              .filter((person) => person.id !== selectedPerson?.id)
              .map((person) => (
                <div
                  key={person.id}
                  className="emp-list-item"
                  onClick={() => setSelectedId(person.id)}
                  title="Show on map"
                >
                  <div style={{display:'flex',alignItems:'center',gap:10,minWidth:0}}>
                    <div className={`emp-list-avatar ${person.state !== 'online' ? 'secondary' : 'primary'}`}>{person.initials}</div>
                    <div style={{minWidth:0}}>
                      <div style={{fontSize:'var(--fs-label-md)',fontWeight:600,color:'var(--color-on-surface)',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{person.name}</div>
                      <div style={{fontSize:11,color: person.state !== 'online' ? 'var(--color-secondary)' : 'var(--color-on-surface-variant)',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{person.department} • {person.checkinLabel}</div>
                    </div>
                  </div>
                  <span className="emp-dist-chip" style={{
                    background: person.state !== 'online' ? 'var(--color-secondary-fixed)' : 'var(--color-surface-container-high)',
                    color: person.state !== 'online' ? 'var(--color-secondary)' : 'var(--color-primary)'
                  }}>{person.distanceLabel}</span>
                </div>
              ))}
          </div>

          <button className="emp-view-all-btn" type="button" onClick={() => navigate('/live-monitoring')}>
            View All 87 Active Telemetries
            <span className="material-symbols-outlined icon-md">arrow_forward</span>
          </button>
        </div>
      </div>

      {/* Analytics Section */}
      <div className="dash-analytics-grid">
        {/* Weekly Attendance Dynamics */}
        <div className="card dash-chart-card">
          <div className="dash-chart-header">
            <div>
              <h3 className="dash-section-title" style={{fontSize:'var(--fs-title-md)'}}>Weekly Attendance Dynamics</h3>
              <p style={{fontSize:'var(--fs-body-sm)',color:'var(--color-on-surface-variant)',marginTop:4}}>Comparative rates across 5 workdays</p>
            </div>
            <div className="dash-chart-period-toggle">
              <button className="period-btn" type="button">Day</button>
              <button className="period-btn active" type="button">Week</button>
              <button className="period-btn" type="button">Month</button>
            </div>
          </div>
          <div className="dash-bar-chart">
            <svg width="100%" height="160" viewBox="0 0 420 160" fill="none">
              <line x1="40" x2="400" y1="20" y2="20" stroke="#edecff" strokeDasharray="4 4" strokeWidth="1" />
              <line x1="40" x2="400" y1="60" y2="60" stroke="#edecff" strokeDasharray="4 4" strokeWidth="1" />
              <line x1="40" x2="400" y1="100" y2="100" stroke="#edecff" strokeDasharray="4 4" strokeWidth="1" />
              <line x1="40" x2="400" y1="140" y2="140" stroke="#dee0ff" strokeWidth="1" />
              {chartPoints.map((point, index) => {
                const slotLeft = PLOT_LEFT + chartSlot * index
                const labelX = slotLeft + LABEL_OFFSET
                return (
                  <React.Fragment key={point.date}>
                    <rect
                      x={slotLeft + ON_TIME_OFFSET}
                      y={barBaseY(point.onTime, chartScaleMax)}
                      width={14}
                      height={barHeight(point.onTime, chartScaleMax)}
                      rx={3}
                      fill={pointFill(point, todayKey)}
                    />
                    <rect
                      x={slotLeft + LATE_OFFSET}
                      y={barBaseY(point.late, chartScaleMax)}
                      width={10}
                      height={barHeight(point.late, chartScaleMax)}
                      rx={2}
                      fill={pointLateFill(point, todayKey)}
                    />
                    {point.isNow && (
                      <circle cx={slotLeft + ON_TIME_OFFSET + 7} cy={30} r={3} fill="#b9d300" />
                    )}
                    <text
                      x={labelX}
                      y={155}
                      textAnchor="middle"
                      fill={point.isNow ? '#161a33' : '#757688'}
                      fontSize="11"
                      fontFamily="Inter"
                      fontWeight={point.isNow ? 600 : 400}
                    >
                      {point.isNow ? `${point.label} (Now)` : point.label}
                    </text>
                  </React.Fragment>
                )
              })}
            </svg>
          </div>
          <div className="dash-chart-legend">
            <div style={{display:'flex',alignItems:'center',gap:16}}>
              <span style={{display:'flex',alignItems:'center',gap:6,fontSize:'var(--fs-label-sm)'}}>
                <span style={{width:12,height:12,borderRadius:2,background:'var(--color-primary)',display:'inline-block'}} />
                On-Time Present
              </span>
              <span style={{display:'flex',alignItems:'center',gap:6,fontSize:'var(--fs-label-sm)',color:'var(--color-on-surface-variant)'}}>
                <span style={{width:12,height:12,borderRadius:2,background:'var(--color-secondary-container)',display:'inline-block'}} />
                Late Arrivals
              </span>
            </div>
            <span style={{fontFamily:'var(--font-body)',fontSize:'var(--fs-label-sm)',color:'var(--color-secondary)',fontWeight:500}}>Avg. {formatPercent(avgCompletion)} Completion</span>
          </div>
        </div>

        {/* Status Donut */}
        <div className="card dash-donut-card">
          <h3 className="dash-section-title" style={{fontSize:'var(--fs-title-md)'}}>Status Breakdown</h3>
          <p style={{fontSize:'var(--fs-body-sm)',color:'var(--color-on-surface-variant)',marginTop:4}}>Daily head-count distribution</p>
          <div className="dash-donut-wrap">
            <svg width="144" height="144" viewBox="0 0 100 100" style={{transform:'rotate(-90deg)'}}>
              <circle cx="50" cy="50" r="40" fill="none" stroke="#f4f2ff" strokeWidth="12" />
              {donutSlices.map((slice) => (
                <circle
                  key={slice.key}
                  cx="50"
                  cy="50"
                  r="40"
                  fill="none"
                  stroke={slice.colorToken}
                  strokeWidth="12"
                  strokeDasharray={slice.dasharray}
                  strokeDashoffset={slice.dashoffset}
                />
              ))}
            </svg>
            <div className="dash-donut-center">
              <span style={{fontFamily:'var(--font-heading)',fontSize:28,fontWeight:700,color:'var(--color-on-surface)',lineHeight:1}}>{formatPercent(donutPresentRate, 1, 'floor')}</span>
              <span style={{fontSize:'var(--fs-label-sm)',textTransform:'uppercase',color:'var(--color-outline)',letterSpacing:'0.05em',marginTop:2}}>Present</span>
            </div>
          </div>
          <div className="dash-donut-legend">
            {data.statusBreakdown.map(r => (
              <div key={r.label} style={{display:'flex',alignItems:'center',justifyContent:'space-between'}}>
                <span style={{display:'flex',alignItems:'center',gap:6,fontSize:'var(--fs-body-sm)',color:'var(--color-on-surface-variant)'}}>
                  <span style={{width:10,height:10,borderRadius:'50%',background:r.colorToken,display:'inline-block'}} />
                  {r.label}
                </span>
                <span style={{fontFamily:'var(--font-body)',fontSize:'var(--fs-label-sm)',fontWeight:600,color:'var(--color-on-surface)',fontFeatureSettings:'"tnum" 1'}}>{formatCount(r.value)}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Shift Coverage */}
        <div className="card dash-shift-card">
          <h3 className="dash-section-title" style={{fontSize:'var(--fs-title-md)'}}>Shift Coverage</h3>
          <p style={{fontSize:'var(--fs-body-sm)',color:'var(--color-on-surface-variant)',marginTop:4}}>Department workforce deployment today</p>
          <div className="dash-shift-list">
            {data.shiftCoverage.map(s => (
              <div key={s.department} className="shift-row">
                <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:4}}>
                  <span style={{fontSize:'var(--fs-body-sm)',color:'var(--color-on-surface)',fontWeight:500}}>{s.department}</span>
                  <span style={{fontFamily:'var(--font-body)',fontSize:'var(--fs-label-sm)',fontWeight:600,color:'var(--color-on-surface)',fontFeatureSettings:'"tnum" 1'}}>{s.present}/{s.total}</span>
                </div>
                <div className="shift-bar-track">
                  <div className="shift-bar-fill" style={{width:`${(s.present/s.total)*100}%`,background:s.colorToken}} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Attendance Table */}
      <div className="card dash-table-card">
        <div style={{padding:'var(--space-md)',display:'flex',alignItems:'center',justifyContent:'space-between'}}>
          <div>
            <h3 className="dash-section-title" style={{fontSize:'var(--fs-title-md)'}}>Today&apos;s Attendance Log</h3>
            <p style={{fontSize:'var(--fs-body-sm)',color:'var(--color-on-surface-variant)',marginTop:2}}>Real-time check-in/out telemetry feed — Last sync: {syncSeconds}s ago</p>
          </div>
          <button className="btn btn-secondary" style={{gap:6}}>
            <span className="material-symbols-outlined icon-sm">file_download</span>
            Export
          </button>
        </div>
        <div style={{overflowX:'auto'}}>
          <table>
            <thead>
              <tr>
                <th>Employee</th>
                <th>Check-in</th>
                <th>Status</th>
                <th>GPS Verified</th>
                <th>Dept</th>
                <th>Location</th>
                <th>Work Duration</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {data.attendanceLog.map(renderLogRow)}
            </tbody>
          </table>
        </div>
      </div>

      {/* Broadcast Alert modal */}
      {broadcastOpen && (
        <div className="emp-modal-backdrop" onClick={() => setBroadcastOpen(false)}>
          <div className="emp-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="emp-modal-header">
              <h3 className="emp-modal-title">Broadcast Alert</h3>
              <button type="button" className="telemetry-tool-btn" onClick={() => setBroadcastOpen(false)}>
                <span className="material-symbols-outlined icon-md">close</span>
              </button>
            </div>
            <form onSubmit={handleBroadcast}>
              <div className="emp-modal-body">
                <div className="emp-form-group">
                  <label className="emp-form-label">Template</label>
                  <select
                    className="emp-form-select"
                    value={broadcastTemplate}
                    onChange={(e) => {
                      setBroadcastTemplate(e.target.value)
                      const found = broadcastTemplates().find((t) => t.id === e.target.value)
                      if (found) {
                        setBroadcastMessage(found.message)
                        setBroadcastSeverity(
                          found.severity === 'critical' ? 'critical' : found.severity === 'warning' ? 'warning' : 'info'
                        )
                      }
                    }}
                  >
                    {broadcastTemplates().map((template) => (
                      <option key={template.id} value={template.id}>
                        {template.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="emp-form-group">
                  <label className="emp-form-label">Message</label>
                  <textarea
                    className="emp-form-input"
                    rows={3}
                    placeholder="Compose the alert broadcast to personnel..."
                    value={broadcastMessage}
                    onChange={(e) => setBroadcastMessage(e.target.value)}
                  />
                </div>

                <div className="emp-form-group">
                  <label className="emp-form-label">Severity</label>
                  <select
                    className="emp-form-select"
                    value={broadcastSeverity}
                    onChange={(e) => setBroadcastSeverity(e.target.value as 'critical' | 'warning' | 'info')}
                  >
                    <option value="critical">Critical — immediate action</option>
                    <option value="warning">Warning — advisory</option>
                    <option value="info">Informational</option>
                  </select>
                </div>

                <div className="emp-form-group">
                  <label className="emp-form-label">Audience</label>
                  <select
                    className="emp-form-select"
                    value={broadcastAudience}
                    onChange={(e) => setBroadcastAudience(e.target.value as 'all' | 'hq' | 'field')}
                  >
                    <option value="all">All personnel (87)</option>
                    <option value="hq">Headquarters only (82)</option>
                    <option value="field">Field units only (5)</option>
                  </select>
                </div>
              </div>

              <div className="emp-modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setBroadcastOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  <span className="material-symbols-outlined icon-sm">campaign</span>
                  Dispatch Alert
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default Dashboard
