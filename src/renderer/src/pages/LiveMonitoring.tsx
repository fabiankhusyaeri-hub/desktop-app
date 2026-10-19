import React, { useMemo, useState } from 'react'
import './LiveMonitoring.css'
import { useLiveTracking } from '../hooks/useLiveTracking'
import { formatTimestamp } from '../utils/datetime'
import { formatGpsCoordinate } from '../utils/geo'
import type { TimelineStep, TrackedEntity } from '../types/liveMonitoring'

/**
 * Telemetry comes from the live monitoring service (mock adapter by default,
 * REST API when VITE_API_BASE_URL is set). Marker positions are projected from
 * the returned coordinates; the tactical SVG frame itself is untouched.
 */
const LiveMonitoring: React.FC = () => {
  const {
    snapshot,
    entities,
    filteredEntities,
    breachLog,
    latestAlert,
        msSinceSync,
    serverOffsetMs,
    selected,
    selectEntity,
    filter,
    setFilter,
    searchQuery,
    setSearchQuery,
    refresh
  } = useLiveTracking()

  const [mapStyle, setMapStyle] = useState<'standard' | 'satellite' | 'dark'>('standard')
  const [geofenceOn, setGeofenceOn] = useState(true)
  const [heatmapOn, setHeatmapOn] = useState(false)
  const [audioOn, setAudioOn] = useState(true)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [showRightPanel, setShowRightPanel] = useState(true)
  const [toastMessage, setToastMessage] = useState<string | null>(null)
  const [zoomLevel, setZoomLevel] = useState(1)

  /* Department scope for the tracker stream, cycled from the scope selector. */
  const deptOptions = useMemo(
    () => ['All Departments', ...Array.from(new Set(entities.map((e) => e.dept)))],
    [entities]
  )
  const [deptScope, setDeptScope] = useState('All Departments')

  const cycleDeptScope = (): void => {
    const current = deptOptions.indexOf(deptScope)
    setDeptScope(deptOptions[(current + 1) % deptOptions.length])
  }

  const visibleEntities = useMemo(
    () =>
      filteredEntities.filter((entity) => deptScope === 'All Departments' || entity.dept === deptScope),
    [filteredEntities, deptScope]
  )

  const meta = snapshot?.meta
  const selectedPersonnel = selected

  const showToast = (msg: string) => {
    setToastMessage(msg)
    setTimeout(() => setToastMessage(null), 3000)
  }

  const handleRefresh = () => {
    setIsRefreshing(true)
    void refresh().finally(() => {
      setTimeout(() => {
        setIsRefreshing(false)
        showToast(`Telematics feed refreshed (${meta?.nodesOnline ?? 0} GPS Nodes Synced)`)
      }, 600)
    })
  }

  /** Lookup helper used by the static map markers. */
  const byEmpId = (empId: string): TrackedEntity | undefined =>
    entities.find((entity) => entity.empId === empId)

  /** Activity trail: static checkpoints + live geofence breach entries. */
  const trailFor = (entity: TrackedEntity): TimelineStep[] => {
    const breaches: TimelineStep[] = breachLog
      .filter((entry) => entry.entityId === entity.id)
      .map((entry) => ({
        time: entry.timestamp,
        title: `Geofence Breach � ${entry.unitId}`,
        detail: `${entry.detail} � ${entry.distanceMeters}m outside ${entry.siteName}`,
        dotClass: 'step-4'
      }))
    return [...breaches, ...entity.timeline]
  }

  const syncSeconds = Math.max(0, Math.round(msSinceSync / 1000))

  return (
    <div className="live-mon-container">
      {/* Toast Notice: manual messages plus live geofence breach alerts */}
      {(toastMessage || latestAlert) && (
        <div className="toast-notice">
          <span className="material-symbols-outlined icon-md" style={{ color: 'var(--color-tertiary-fixed)' }}>
            {latestAlert ? 'warning' : 'check_circle'}
          </span>
          <span>
            {latestAlert
              ? `Live Breach Alert • ${latestAlert.unitId} • ${latestAlert.timestamp} • ${latestAlert.distanceMeters}m outside ${latestAlert.siteName}`
              : toastMessage}
          </span>
        </div>
      )}

      {/* Top Telematics Control Sub-Header */}
      <section className="live-mon-subheader">
        <div className="live-mon-sub-left">
          <div className="live-mon-breadcrumb">
            <span className="live-mon-bc-main">Live Monitoring</span>
            <span className="live-mon-bc-sep">/</span>
            <span className="live-mon-bc-current">
              <span className="material-symbols-outlined icon-sm">radar</span>
              Real-Time GPS Tracking
            </span>
          </div>

          <div className="live-mon-divider" />

          {/* Pulse Live Indicator Banner */}
          <div className="live-mon-pulse-pill">
            <span className="live-dot" />
            <span>Connected to GPS Fleet Telematics ({meta?.nodesOnline ?? 0} Nodes Online)</span>
            <span className="dim-sep">•</span>
            <span className="polling-tag">Polling: {meta?.pollingSeconds ?? 0}s</span>
          </div>
        </div>

        {/* Quick Controls Action Pills */}
        <div className="live-mon-sub-actions">
          <div className="live-mon-action-pill">
            <span className="material-symbols-outlined icon-sm" style={{ color: 'var(--color-primary-container)' }}>
              shield
            </span>
            <span>Geofence:</span>
            <strong>Strict ({meta?.geofenceRadiusMeters ?? 0}m) • {meta?.activeGeofences ?? 0} Active</strong>
          </div>

          <button
            className="live-mon-btn-audio"
            type="button"
            onClick={() => {
              setAudioOn(!audioOn)
              showToast(audioOn ? 'Tactical Audio Muted' : 'Tactical Audio: Enabled')
            }}
          >
            <span className="material-symbols-outlined icon-sm" style={{ color: 'var(--color-secondary)' }}>
              {audioOn ? 'volume_up' : 'volume_off'}
            </span>
            <span>Audio: {audioOn ? 'On' : 'Off'}</span>
          </button>

          <button
            className="live-mon-btn-refresh"
            type="button"
            onClick={handleRefresh}
            title="Refresh Feed"
          >
            <span className={`material-symbols-outlined icon-sm ${isRefreshing ? 'rotate-anim' : ''}`}>
              sync
            </span>
            <span>Refresh Feed</span>
          </button>
        </div>
      </section>

      {/* Main 3-Column Tactical Telematics Workspace */}
      <section className="live-mon-workspace">
        {/* LEFT PANEL: Active Trackers List */}
        <aside className="trackers-panel">
          <div className="trackers-header">
            <div className="trackers-title-wrap">
              <h2 className="trackers-title">Active Trackers</h2>
              <span className="live-dot" style={{ width: 9, height: 9 }} />
            </div>
            <span className="trackers-badge-live">{meta?.totalLiveUnits ?? 0} Live</span>
          </div>

          {/* Search Input */}
          <div className="trackers-search-wrap">
            <span className="material-symbols-outlined icon-md trackers-search-icon">search</span>
            <input
              type="text"
              className="trackers-search-input"
              placeholder="Filter by name, ID, role..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Filter Chips */}
          <div className="trackers-filter-chips">
            <button
              className={`trackers-filter-chip ${filter === 'all' ? 'active' : ''}`}
              type="button"
              onClick={() => setFilter('all')}
            >
              All ({meta?.totalLiveUnits ?? 0})
            </button>
            <button
              className={`trackers-filter-chip ${filter === 'inside' ? 'active' : ''}`}
              type="button"
              onClick={() => setFilter('inside')}
            >
              Inside ({meta?.insideCount ?? 0})
            </button>
            <button
              className={`trackers-filter-chip chip-error ${filter === 'outside' ? 'active' : ''}`}
              type="button"
              onClick={() => setFilter('outside')}
            >
              Outside ({meta?.outsideCount ?? 0})
            </button>
            <button
              className={`trackers-filter-chip ${filter === 'flagged' ? 'active' : ''}`}
              type="button"
              onClick={() => setFilter('flagged')}
            >
              Flagged ({meta?.flaggedCount ?? 0})
            </button>
          </div>

          {/* Department Scope Selector — click to cycle the tracker scope */}
          <div className="trackers-scope-selector" onClick={cycleDeptScope} title="Click to switch department scope" style={{ cursor: 'pointer' }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
              <span className="material-symbols-outlined icon-sm">filter_alt</span> Scope:
            </span>
            <span className="trackers-scope-val">
              {deptScope === 'All Departments' ? 'All Departments' : deptScope}{' '}
              <span className="material-symbols-outlined icon-sm">expand_more</span>
            </span>
          </div>

          {/* Tracked Personnel Cards Stream */}
          <div className="trackers-stream">
            {visibleEntities.map((person) => {
              const isSelected = selectedPersonnel?.id === person.id
              const isBreach = person.statusType === 'breach'
              const isField = person.statusType === 'field'

              return (
                <div
                  key={person.id}
                  className={`tracker-card ${isSelected ? 'active' : ''} ${isBreach ? 'breach' : ''} ${isField ? 'field' : ''}`}
                  onClick={() => {
                    selectEntity(person)
                    if (!showRightPanel) setShowRightPanel(true)
                  }}
                >
                  <div className="tracker-card-top">
                    <div className="tracker-card-person">
                      <div className="tracker-avatar-wrap">
                        {person.avatar ? (
                          <img
                            src={person.avatar}
                            alt={person.name}
                            className="tracker-avatar"
                            onError={(e) => {
                              (e.target as HTMLImageElement).style.display = 'none'
                              const fb = (e.target as HTMLElement).nextElementSibling as HTMLElement
                              if (fb) fb.style.display = 'flex'
                            }}
                          />
                        ) : null}
                        <div
                          className="tracker-avatar-fallback"
                          style={{ display: person.avatar ? 'none' : 'flex' }}
                        >
                          {person.name.split(' ').map((n) => n[0]).join('')}
                        </div>
                        <span
                          className={`tracker-avatar-dot ${isBreach ? 'breach' : isField ? 'field' : ''}`}
                        />
                      </div>

                      <div className="tracker-info">
                        <div className="tracker-name-row">
                          <span className="tracker-name">{person.name}</span>
                          <span className="tracker-id">{person.empId}</span>
                        </div>
                        <span className={`tracker-role ${isBreach ? 'text-error' : ''}`}>
                          {person.role}
                        </span>
                      </div>
                    </div>

                    <span
                      className={`tracker-dist ${isBreach ? 'dist-error' : isField ? 'dist-secondary' : ''}`}
                    >
                      {person.distanceLabel}
                    </span>
                  </div>

                  <div className="tracker-card-bottom">
                    <span className="tracker-time">
                      <span className="material-symbols-outlined icon-sm">
                        {isBreach ? 'warning' : isField ? 'verified' : 'login'}
                      </span>
                      {person.checkinTime}
                    </span>

                    {isSelected ? (
                      <span className="tracker-tag-active">Active Target</span>
                    ) : isBreach ? (
                      <span className="tracker-tag-warning">
                        <span className="material-symbols-outlined" style={{ fontSize: 11 }}>warning</span>
                        Breach Alert
                      </span>
                    ) : isField ? (
                      <span className="tracker-tag-secondary">Field Verified</span>
                    ) : (
                      <span className="tracker-status-text">Inside Perimeter</span>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </aside>

        {/* CENTER PANEL: Primary Tactical GIS Map Canvas */}
        <main className="tactical-map-panel">
          {/* Tactical Map Command Bar */}
          <div className="map-cmd-bar">
            {/* Style Switcher */}
            <div className="map-style-switcher">
              <button
                className={`map-style-btn ${mapStyle === 'standard' ? 'active' : ''}`}
                type="button"
                onClick={() => setMapStyle('standard')}
              >
                Standard
              </button>
              <button
                className={`map-style-btn ${mapStyle === 'satellite' ? 'active' : ''}`}
                type="button"
                onClick={() => setMapStyle('satellite')}
              >
                Satellite
              </button>
              <button
                className={`map-style-btn ${mapStyle === 'dark' ? 'active' : ''}`}
                type="button"
                onClick={() => setMapStyle('dark')}
              >
                Dark Grid
              </button>
            </div>

            {/* Layer Quick Toggles */}
            <div className="map-layer-toggles">
              <button
                className={`layer-toggle-btn ${geofenceOn ? 'active' : ''}`}
                type="button"
                onClick={() => setGeofenceOn(!geofenceOn)}
              >
                <span className="material-symbols-outlined icon-sm">fence</span>
                Geofence: {geofenceOn ? 'ON' : 'OFF'}
              </button>
              <button
                className={`layer-toggle-btn ${heatmapOn ? 'active' : ''}`}
                type="button"
                onClick={() => setHeatmapOn(!heatmapOn)}
              >
                <span className="material-symbols-outlined icon-sm" style={{ color: 'var(--color-secondary)' }}>
                  local_fire_department
                </span>
                Heatmap
              </button>
              <button
                className="layer-icon-btn"
                type="button"
                title="Toggle Telemetry Sidebar"
                onClick={() => setShowRightPanel(!showRightPanel)}
              >
                <span className="material-symbols-outlined icon-md">
                  {showRightPanel ? 'dock_to_right' : 'dock_to_right'}
                </span>
              </button>
            </div>
          </div>

          {/* Real Map Canvas with SVG Tactical Visual Overlays (Controlled Height) */}
          <div
            className="tactical-map-canvas"
            style={{
              filter: mapStyle === 'satellite' ? 'contrast(1.1) saturate(1.2)' : 'none'
            }}
          >
            <svg
              className="tactical-svg"
              viewBox="0 0 1000 700"
              preserveAspectRatio="xMidYMid slice"
              xmlns="http://www.w3.org/2000/svg"
              style={{
                transform: `scale(${zoomLevel})`,
                transformOrigin: '460px 380px',
                transition: 'transform 0.3s ease'
              }}
            >
              <defs>
                {/* Map Grid Pattern */}
                <pattern id="tacCityGrid" width="60" height="60" patternUnits="userSpaceOnUse">
                  <path d="M 60 0 L 0 0 0 60" fill="none" stroke="#252943" strokeWidth="0.8" strokeOpacity="0.35" />
                </pattern>
                {/* Radial Glow for Geofence */}
                <radialGradient id="tacGeofenceGlow" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#3ca9ff" stopOpacity="0.28" />
                  <stop offset="85%" stopColor="#3a4efb" stopOpacity="0.12" />
                  <stop offset="100%" stopColor="#152de4" stopOpacity="0.0" />
                </radialGradient>
                {/* Branch Glow */}
                <radialGradient id="tacBranchGlow" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#d4f029" stopOpacity="0.2" />
                  <stop offset="100%" stopColor="#5f6d00" stopOpacity="0.0" />
                </radialGradient>
              </defs>

              {/* Background Surfaces */}
              <rect width="1000" height="700" fill={mapStyle === 'dark' ? '#0d1024' : '#161a33'} />
              <rect width="1000" height="700" fill="url(#tacCityGrid)" />

              {/* Stylized Urban Waterway */}
              <path
                d="M-50,600 C 200,560 320,460 480,390 C 650,330 760,190 950,130 L 1050,140 L 1050,750 L -50,750 Z"
                fill="#003c63"
                opacity="0.35"
              />

              {/* Transit Corridors */}
              <path d="M 0,200 L 1000,300" stroke="#2b2f49" strokeWidth="8" opacity="0.8" />
              <path d="M 0,200 L 1000,300" stroke="#dee0ff" strokeWidth="2" strokeDasharray="8 6" opacity="0.6" />
              <path d="M 280,0 L 460,700" stroke="#2b2f49" strokeWidth="7" opacity="0.8" />
              <path d="M 720,0 L 590,700" stroke="#2b2f49" strokeWidth="6" opacity="0.8" />
              <path d="M 100,470 L 900,470" stroke="#252943" strokeWidth="2.5" opacity="0.9" />
              <path d="M 150,90 L 850,650" stroke="#252943" strokeWidth="2" opacity="0.9" />

              {/* Heatmap overlay simulation if toggled */}
              {heatmapOn && (
                <g opacity="0.45">
                  <circle cx="460" cy="380" r="140" fill="#3ca9ff" filter="blur(25px)" />
                  <circle cx="480" cy="360" r="80" fill="#d7f32d" filter="blur(20px)" />
                  <circle cx="230" cy="270" r="60" fill="#ba1a1a" filter="blur(18px)" />
                </g>
              )}

              {/* North Hub Geofence (150m) */}
              {geofenceOn && (
                <g transform="translate(740, 180)">
                  <circle r="85" fill="url(#tacBranchGlow)" />
                  <circle r="85" fill="none" stroke="#d4f029" strokeWidth="1.5" strokeDasharray="4 4" opacity="0.7" />
                  <rect x="-18" y="-18" width="36" height="36" rx="6" fill="#2b2f49" stroke="#d4f029" strokeWidth="2" />
                  <text x="0" y="4" textAnchor="middle" fill="#d7f32d" fontFamily="Plus Jakarta Sans" fontSize="10" fontWeight="700">HUB-2</text>
                  <text x="0" y="30" textAnchor="middle" fill="#ffffff" fontFamily="Inter" fontSize="11" fontWeight="600" opacity="0.9">North Logistics Hub (150m)</text>
                </g>
              )}

              {/* Vanguard Central HQ Geofence (250m Strict Radius) */}
              {geofenceOn && (
                <g transform="translate(460, 380)">
                  <circle r="180" fill="url(#tacGeofenceGlow)">
                    <animate attributeName="r" values="178;184;178" dur="4s" repeatCount="indefinite" />
                  </circle>
                  <circle r="180" fill="none" stroke="#3ca9ff" strokeWidth="2" strokeDasharray="6 4" opacity="0.8" />
                  <circle r="180" fill="none" stroke="#3a4efb" strokeWidth="1" opacity="0.4" />

                  {/* HQ Station Icon */}
                  <rect x="-24" y="-24" width="48" height="48" rx="10" fill="#152de4" filter="drop-shadow(0 4px 8px rgba(0,0,0,0.5))" />
                  <polygon points="-8,-4 0,-14 8,-4" fill="#ffffff" />
                  <rect x="-7" y="-2" width="14" height="12" fill="#ffffff" />
                  <text x="0" y="40" textAnchor="middle" fill="#ffffff" fontFamily="Plus Jakarta Sans" fontSize="13" fontWeight="700">Vanguard Central HQ</text>
                  <text x="0" y="55" textAnchor="middle" fill="#d7f32d" fontFamily="Inter" fontSize="10" fontWeight="600">STRICT GEOFENCE 250M</text>
                </g>
              )}

              {/* Background In-Bounds Personnel Clusters */}
              <g transform="translate(435, 340)"><circle r="6" fill="#00629e" opacity="0.9" /><circle r="2" fill="#fff" /></g>
              <g transform="translate(460, 440)"><circle r="6" fill="#00629e" opacity="0.9" /><circle r="2" fill="#fff" /></g>
              <g transform="translate(380, 360)"><circle r="6" fill="#00629e" opacity="0.9" /><circle r="2" fill="#fff" /></g>
              <g transform="translate(515, 320)"><circle r="6" fill="#00629e" opacity="0.9" /><circle r="2" fill="#fff" /></g>

              {/* Other personnel nodes — position projected from the live GPS fix */}
              {byEmpId('EMP-6320') && (
                <g
                  transform={`translate(${byEmpId('EMP-6320')?.position.x}, ${byEmpId('EMP-6320')?.position.y})`}
                  style={{ cursor: 'pointer' }}
                  onClick={() => selectEntity(byEmpId('EMP-6320') as TrackedEntity)}
                >
                  <circle r="9" fill="#3a4efb" stroke="#ffffff" strokeWidth="2" />
                  <circle r="3" fill="#ffffff" />
                </g>
              )}

              {byEmpId('EMP-9014') && (
                <g
                  transform={`translate(${byEmpId('EMP-9014')?.position.x}, ${byEmpId('EMP-9014')?.position.y})`}
                  style={{ cursor: 'pointer' }}
                  onClick={() => selectEntity(byEmpId('EMP-9014') as TrackedEntity)}
                >
                  <circle r="9" fill="#3a4efb" stroke="#ffffff" strokeWidth="2" />
                  <circle r="3" fill="#ffffff" />
                </g>
              )}

              {byEmpId('EMP-5519') && (
                <g
                  transform={`translate(${byEmpId('EMP-5519')?.position.x}, ${byEmpId('EMP-5519')?.position.y})`}
                  style={{ cursor: 'pointer' }}
                  onClick={() => selectEntity(byEmpId('EMP-5519') as TrackedEntity)}
                >
                  <circle r="9" fill="#3a4efb" stroke="#ffffff" strokeWidth="2" />
                  <circle r="3" fill="#ffffff" />
                </g>
              )}

              {/* Breached Employee Marker: Dimas Pratama (Outside Geofence) */}
              {byEmpId('EMP-7742') && (
                <g
                  transform={`translate(${byEmpId('EMP-7742')?.position.x}, ${byEmpId('EMP-7742')?.position.y})`}
                  style={{ cursor: 'pointer' }}
                  onClick={() => selectEntity(byEmpId('EMP-7742') as TrackedEntity)}
                >
                  <circle r="18" fill="none" stroke="#ba1a1a" strokeWidth="2" opacity="0.8">
                    <animate attributeName="r" values="14;24;14" dur="2s" repeatCount="indefinite" />
                    <animate attributeName="opacity" values="0.9;0.1;0.9" dur="2s" repeatCount="indefinite" />
                  </circle>
                  <circle r="13" fill="#ba1a1a" stroke="#ffffff" strokeWidth="2" />
                  <text x="0" y="4" textAnchor="middle" fill="#ffffff" fontFamily="Plus Jakarta Sans" fontSize="11" fontWeight="800">!</text>

                  <rect x="18" y="-16" width="130" height="26" rx="4" fill="#2b2f49" stroke="#ba1a1a" strokeWidth="1.5" />
                  <text x="24" y="-3" fill="#ffdad6" fontFamily="Inter" fontSize="10" fontWeight="700">Dimas P. ({byEmpId('EMP-7742')?.distanceLabel} Out)</text>
                  <text x="24" y="6" fill="#ffffff" fontFamily="Inter" fontSize="8" fontWeight="500">Outside Permitted Zone</text>
                </g>
              )}

              {/* Field Agent: Fajar Nugraha (Client Site) */}
              {byEmpId('EMP-4389') && (
                <g
                  transform={`translate(${byEmpId('EMP-4389')?.position.x}, ${byEmpId('EMP-4389')?.position.y})`}
                  style={{ cursor: 'pointer' }}
                  onClick={() => selectEntity(byEmpId('EMP-4389') as TrackedEntity)}
                >
                  <circle r="12" fill="#00629e" stroke="#cfe5ff" strokeWidth="2" />
                  <circle r="4" fill="#d4f029" />
                  <rect x="-60" y="16" width="120" height="20" rx="4" fill="#161a33" stroke="#3ca9ff" strokeWidth="1" opacity="0.9" />
                  <text x="0" y="30" textAnchor="middle" fill="#ffffff" fontFamily="Inter" fontSize="9" fontWeight="600">Fajar N. • Client Visit ({byEmpId('EMP-4389')?.distanceLabel})</text>
                </g>
              )}

              {/* DYNAMIC SELECTED TARGET PIN — position projected from the live GPS fix */}
              {selectedPersonnel && (
                <g transform={`translate(${selectedPersonnel.position.x}, ${selectedPersonnel.position.y})`}>
                {/* Lime Target Radials */}
                <circle r="26" fill="none" stroke="#d7f32d" strokeWidth="2" opacity="0.9">
                  <animate attributeName="r" values="20;34;20" dur="2.2s" repeatCount="indefinite" />
                  <animate attributeName="opacity" values="0.9;0.2;0.9" dur="2.2s" repeatCount="indefinite" />
                </circle>

                {/* Connecting Line if near HQ */}
                {selectedPersonnel.statusType === 'inside' && (
                  <line x1="0" y1="0" x2={460 - selectedPersonnel.position.x} y2={380 - selectedPersonnel.position.y} stroke="#d7f32d" strokeWidth="1.5" strokeDasharray="3 3" opacity="0.75" />
                )}

                {/* Tactical Pin */}
                <circle r="14" fill="#152de4" stroke="#ffffff" strokeWidth="2.5" filter="drop-shadow(0 3px 6px rgba(0,0,0,0.6))" />
                <circle r="5" fill="#d7f32d" />

                {/* Popover Callout */}
                <g transform="translate(-85, -54)">
                  <rect width="170" height="42" rx="8" fill="#161a33" stroke="#3a4efb" strokeWidth="2" filter="drop-shadow(0 6px 14px rgba(0,0,0,0.6))" />
                  <circle cx="20" cy="21" r="10" fill="#3a4efb" />
                  <text x="20" y="25" textAnchor="middle" fill="#ffffff" fontFamily="Inter" fontSize="10" fontWeight="700">
                    {selectedPersonnel.name.split(' ').map((n) => n[0]).join('')}
                  </text>
                  <text x="36" y="18" fill="#ffffff" fontFamily="Plus Jakarta Sans" fontSize="11" fontWeight="700">
                    {selectedPersonnel.name}
                  </text>
                  <text x="36" y="31" fill="#d7f32d" fontFamily="Inter" fontSize="10" fontWeight="600">
                    {selectedPersonnel.distanceLabel} from Base Beacon
                  </text>
                </g>
                </g>
              )}
            </svg>

            {/* Floating Navigation Controls */}
            <div className="map-float-nav">
              <div className="map-zoom-group">
                <button
                  className="map-nav-btn"
                  type="button"
                  title="Zoom In"
                  onClick={() => setZoomLevel((z) => Math.min(1.8, z + 0.15))}
                >
                  <span className="material-symbols-outlined icon-md">add</span>
                </button>
                <div style={{ height: 1, background: 'var(--color-outline-variant)' }} />
                <button
                  className="map-nav-btn"
                  type="button"
                  title="Zoom Out"
                  onClick={() => setZoomLevel((z) => Math.max(0.7, z - 0.15))}
                >
                  <span className="material-symbols-outlined icon-md">remove</span>
                </button>
              </div>

              <button
                className="map-nav-single-btn"
                type="button"
                title="Center Map on Base HQ"
                onClick={() => setZoomLevel(1)}
              >
                <span className="material-symbols-outlined icon-md">my_location</span>
              </button>

              <button
                className="map-nav-single-btn"
                type="button"
                title="Compass Orientation"
                onClick={() => showToast('Orientation locked to True North (360°)')}
              >
                <span className="material-symbols-outlined icon-md" style={{ color: 'var(--color-on-surface)' }}>
                  explore
                </span>
              </button>
            </div>

            {/* Floating Tactical Legend & Slider */}
            <div className="map-float-legend">
              <div className="legend-row-top">
                <span className="legend-title">
                  <span className="material-symbols-outlined icon-sm">adjust</span> Dynamic Boundary
                </span>
                <span style={{ color: '#fff', fontFeatureSettings: '"tnum" 1' }}>{meta?.geofenceRadiusMeters ?? 0}m Active</span>
              </div>
              <div className="legend-progress-bar">
                <div className="legend-progress-fill" style={{ width: '50%' }} />
              </div>
              <div className="legend-indicators">
                <span
                  className="legend-dot-item"
                  onClick={() => setFilter(filter === 'inside' ? 'all' : 'inside')}
                  style={{ cursor: 'pointer', opacity: filter === 'inside' ? 1 : 0.85 }}
                >
                  <span className="legend-dot" style={{ background: 'var(--color-primary-container)' }} />
                  In-HQ ({meta?.insideCount ?? 0})
                </span>
                <span
                  className="legend-dot-item"
                  onClick={() => setFilter(filter === 'flagged' ? 'all' : 'flagged')}
                  style={{ cursor: 'pointer', opacity: filter === 'flagged' ? 1 : 0.85 }}
                >
                  <span className="legend-dot" style={{ background: 'var(--color-error)' }} />
                  Breach ({meta?.liveBreachAlerts ?? 0})
                </span>
                <span
                  className="legend-dot-item"
                  onClick={() => setFilter(filter === 'outside' ? 'all' : 'outside')}
                  style={{ cursor: 'pointer', opacity: filter === 'outside' ? 1 : 0.85 }}
                >
                  <span className="legend-dot" style={{ background: 'var(--color-tertiary-fixed)' }} />
                  Verified ({meta?.verifiedFieldCount ?? 0})
                </span>
              </div>
            </div>

            {/* Bottom Integrated Telemetry Status Strip */}
            <div className="map-bottom-strip">
              <div className="strip-stats">
                <span className="strip-stat-item">
                  <span className="material-symbols-outlined icon-sm" style={{ color: 'var(--color-secondary-container)' }}>
                    domain
                  </span>
                  <span>HQ Capacity: <strong>{meta?.hqCapacityUsed ?? 0} / {meta?.hqCapacityTotal ?? 0}</strong></span>
                </span>
                <span style={{ color: 'var(--color-surface-dim)', opacity: 0.4 }}>•</span>
                <span className="strip-stat-item">
                  <span className="material-symbols-outlined icon-sm" style={{ color: 'var(--color-tertiary-fixed)' }}>
                    speed
                  </span>
                  <span>Fleet Efficiency: <strong>{meta?.fleetEfficiencyPercent ?? 0}%</strong></span>
                </span>
                <span style={{ color: 'var(--color-surface-dim)', opacity: 0.4 }}>•</span>
                <span className="strip-stat-item">
                  <span className="material-symbols-outlined icon-sm" style={{ color: 'var(--color-secondary-fixed)' }}>
                    satellite_alt
                  </span>
                  <span>GPS Drift: <strong>±{meta?.gpsDriftMeters ?? 0}m</strong></span>
                </span>
              </div>

              <div className="strip-sync">
                <span className="live-dot" style={{ width: 6, height: 6 }} />
                <span>Last Sync: {syncSeconds}s ago</span>
              </div>
            </div>
          </div>
        </main>

        {/* RIGHT PANEL: Real-Time Selected Employee Details */}
        {showRightPanel && selectedPersonnel && (
          <aside className="telemetry-panel">
            {/* Header with Tools */}
            <div className="telemetry-header">
              <div className="telemetry-title-wrap">
                <span className="material-symbols-outlined icon-md" style={{ color: 'var(--color-primary-container)' }}>
                  person_pin_circle
                </span>
                <h2 className="telemetry-title">Telemetry Detail</h2>
              </div>
              <div className="telemetry-tools">
                <button
                  className="telemetry-tool-btn"
                  type="button"
                  title="Refresh Node"
                  onClick={() => showToast(`Pinging telemetry node for ${selectedPersonnel.name}`)}
                >
                  <span className="material-symbols-outlined icon-md">refresh</span>
                </button>
                <button
                  className="telemetry-tool-btn"
                  type="button"
                  title="Close Panel"
                  onClick={() => setShowRightPanel(false)}
                >
                  <span className="material-symbols-outlined icon-md">close</span>
                </button>
              </div>
            </div>

            {/* Identity Card Profile */}
            <div className="telemetry-profile-card">
              <div className="telemetry-avatar-wrap">
                {selectedPersonnel.avatar ? (
                  <img
                    src={selectedPersonnel.avatar}
                    alt={selectedPersonnel.name}
                    className="telemetry-avatar"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none'
                      const fb = (e.target as HTMLElement).nextElementSibling as HTMLElement
                      if (fb) fb.style.display = 'flex'
                    }}
                  />
                ) : null}
                <div
                  className="telemetry-avatar-fallback"
                  style={{ display: selectedPersonnel.avatar ? 'none' : 'flex' }}
                >
                  {selectedPersonnel.name.split(' ').map((n) => n[0]).join('')}
                </div>
              </div>

              <div className="telemetry-profile-info">
                <h3 className="telemetry-name">{selectedPersonnel.name}</h3>
                <span className="telemetry-job">{selectedPersonnel.role}</span>
                <div className="telemetry-tags">
                  <span className="telemetry-badge-id">{selectedPersonnel.empId}</span>
                  <span className="telemetry-dept">{selectedPersonnel.dept}</span>
                </div>
              </div>
            </div>

            {/* Realtime Telemetry Feed Blocks */}
            <div className="telemetry-feed-group">
              <h4 className="telemetry-section-label">Realtime Telemetry Feed</h4>

              {/* Attendance Verification Card */}
              <div className="telemetry-card-block">
                <div className="telemetry-block-header">
                  <div className="telemetry-block-header-left">
                    <span className="material-symbols-outlined icon-sm" style={{ color: 'var(--color-primary-container)' }}>
                      how_to_reg
                    </span>
                    <span>Attendance Status</span>
                  </div>
                  <span className="telemetry-block-tag">Present</span>
                </div>
                <div className="telemetry-block-main">Check-in: {selectedPersonnel.checkinTime} WIB</div>
                <div className="telemetry-block-sub">
                  <span className="material-symbols-outlined icon-sm" style={{ color: 'var(--color-primary)' }}>
                    verified
                  </span>
                  Biometric Facial + GPS Verified
                </div>
              </div>

              {/* Perimeter / Geofence Telematics */}
              <div className="telemetry-card-block">
                <div className="telemetry-block-header">
                  <div className="telemetry-block-header-left">
                    <span className="material-symbols-outlined icon-sm" style={{ color: 'var(--color-secondary)' }}>
                      share_location
                    </span>
                    <span>Geofence Compliance</span>
                  </div>
                  <span
                    className={`telemetry-block-tag ${selectedPersonnel.statusType === 'breach' ? 'outside' : 'inside'}`}
                  >
                    {selectedPersonnel.statusType === 'breach' ? 'OUTSIDE PERIMETER' : 'INSIDE PERIMETER'}
                  </span>
                </div>
                <div className="telemetry-block-main">{selectedPersonnel.complianceZone}</div>
                <div className="telemetry-block-sub">{selectedPersonnel.complianceSub}</div>
              </div>

              {/* Coordinates & Accuracy Details Grid */}
              <div className="telemetry-specs-grid">
                <div className="telemetry-spec-item">
                  <span className="spec-label">GPS Coordinate</span>
                  <span className="spec-val font-tabular">
                    {formatGpsCoordinate(selectedPersonnel.gps.lat, selectedPersonnel.gps.lng)}
                    <span style={{ display: 'block', fontSize: 10, color: 'var(--color-outline)' }}>
                      Updated {formatTimestamp(selectedPersonnel.updatedAt, serverOffsetMs)}
                    </span>
                  </span>
                </div>
                <div className="telemetry-spec-item">
                  <span className="spec-label">Accuracy Deviation</span>
                  <span className="spec-val" style={{ color: 'var(--color-secondary)' }}>
                    {selectedPersonnel.accuracyLabel}
                  </span>
                </div>
                <div className="telemetry-spec-item">
                  <span className="spec-label">Device Battery</span>
                  <span className="spec-val">
                    <span className="material-symbols-outlined icon-sm" style={{ color: 'var(--color-tertiary-fixed-dim)' }}>
                      battery_charging_80
                    </span>
                    {selectedPersonnel.battery}
                  </span>
                </div>
                <div className="telemetry-spec-item">
                  <span className="spec-label">Connection</span>
                  <span className="spec-val">
                    <span className="material-symbols-outlined icon-sm" style={{ color: 'var(--color-primary)' }}>
                      5g
                    </span>
                    {selectedPersonnel.network}
                  </span>
                </div>
              </div>
            </div>

            {/* Activity Timeline */}
            <div className="telemetry-feed-group">
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <h4 className="telemetry-section-label">Activity Trail (Today)</h4>
                <span style={{ fontSize: 11, color: 'var(--color-outline)' }}>
                  {trailFor(selectedPersonnel).length} checkpoints
                </span>
              </div>

              <div className="telemetry-timeline">
                <div className="telemetry-timeline-line" />
                {trailFor(selectedPersonnel).map((step, idx) => (
                  <div key={idx} className="timeline-step">
                    <span className={`timeline-dot ${step.dotClass || ''}`} />
                    <div className="timeline-step-row">
                      <span className="timeline-time">{step.time}</span>
                      <span className="timeline-label">{step.title}</span>
                    </div>
                    <span className="timeline-sub">{step.detail}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Dispatch Action Buttons */}
            <div className="telemetry-actions">
              <button
                className="btn-ping-device"
                type="button"
                onClick={() => showToast(`Sent High-Frequency GPS Ping to ${selectedPersonnel.empId}`)}
              >
                <span className="material-symbols-outlined icon-sm">near_me</span>
                <span>Ping Device Location</span>
              </button>

              <div className="telemetry-action-subrow">
                <button
                  className="btn-route"
                  type="button"
                  onClick={() => showToast(`Loaded GPS Breadcrumb Route for ${selectedPersonnel.name}`)}
                >
                  <span className="material-symbols-outlined icon-sm" style={{ color: 'var(--color-primary)' }}>
                    route
                  </span>
                  <span>View Historical Route</span>
                </button>
                <button
                  className="btn-chat"
                  type="button"
                  title="Contact Employee directly"
                  onClick={() => showToast(`Direct intercom opened with ${selectedPersonnel.name}`)}
                >
                  <span className="material-symbols-outlined icon-sm">chat</span>
                </button>
              </div>
            </div>
          </aside>
        )}
      </section>
    </div>
  )
}

export default LiveMonitoring
