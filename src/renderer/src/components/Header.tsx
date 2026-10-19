import React, { useEffect, useState, useSyncExternalStore } from 'react'
import { useNavigate } from 'react-router-dom'
import './Header.css'
import { useGlobalSearch } from '../hooks/useGlobalSearch'
import {
  getNotifications,
  markAllRead,
  markRead,
  notificationTime,
  subscribeNotifications
} from '../services/notificationService'
import type { AppNotification, NotificationSeverity } from '../services/notificationService'
import { getSessionUser, signOut, subscribeSession } from '../services/userService'

const SEVERITY_ICON: Record<NotificationSeverity, string> = {
  critical: 'crisis_alert',
  high: 'warning',
  warning: 'campaign',
  medium: 'sensors',
  low: 'check_circle',
  info: 'info'
}

const SEVERITY_COLOR: Record<NotificationSeverity, string> = {
  critical: 'var(--color-error)',
  high: 'var(--color-error)',
  warning: 'var(--color-secondary)',
  medium: 'var(--color-secondary)',
  low: 'var(--color-primary)',
  info: 'var(--color-primary)'
}

const Header: React.FC = () => {
  const navigate = useNavigate()
  const [now, setNow] = useState(new Date())
  const search = useGlobalSearch()
  const [notifOpen, setNotifOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)

  const notifications = useSyncExternalStore(subscribeNotifications, getNotifications, getNotifications)
  const user = useSyncExternalStore(subscribeSession, getSessionUser, getSessionUser)
  const unread = notifications.filter((n) => !n.read).length

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  // Close every transient surface on outside click or route change.
  useEffect(() => {
    const onPointerDown = (event: MouseEvent): void => {
      const target = event.target as HTMLElement
      if (!target.closest('.header-search') && !target.closest('.header-notif-btn') && !target.closest('.att-export-menu')) {
        search.close()
        setNotifOpen(false)
      }
      if (!target.closest('.header-avatar-wrap') && !target.closest('.att-export-menu')) {
        setProfileOpen(false)
      }
    }
    document.addEventListener('mousedown', onPointerDown)
    return () => document.removeEventListener('mousedown', onPointerDown)
  }, [search])

  const formatDate = (d: Date) =>
    d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })

  const formatTime = (d: Date) =>
    d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' })

  const openResult = (employeeId: string): void => {
    search.clear()
    navigate(`/employees?q=${encodeURIComponent(employeeId)}`)
  }

  const handleSignOut = (): void => {
    signOut()
    setProfileOpen(false)
  }

  return (
    <header className="app-header">
      <div className="header-inner">
        {/* Status Indicators */}
        <div className="header-status-group">
          <div className="header-status-pill header-status-online">
            <span className="header-status-dot">
              <span className="header-status-dot-ping animate-ping" />
              <span className="header-status-dot-core" />
            </span>
            <span className="header-status-label">System Online</span>
          </div>
          <div className="header-status-pill header-status-connected">
            <span className="header-status-dot-static connected" />
            <span className="header-status-label">Realtime Connected (10s ago)</span>
          </div>
        </div>

        {/* Right Side */}
        <div className="header-right">
          {/* Search — global employee lookup (⌘K) */}
          <div className="header-search">
            <span className="material-symbols-outlined header-search-icon icon-md">search</span>
            <input
              ref={search.inputRef}
              className="header-search-input"
              type="text"
              placeholder="Search employee, department..."
              value={search.query}
              onChange={(e) => search.setQuery(e.target.value)}
              onFocus={search.open}
              onKeyDown={(e) => {
                if (e.key === 'Escape') search.clear()
                if (e.key === 'Enter' && search.results.length > 0) {
                  openResult(search.results[0].employee.empId)
                }
              }}
            />
            <kbd className="header-search-kbd">⌘K</kbd>

            {/* Result dropdown — reuses the existing export-menu styling */}
            {search.isOpen && search.query.trim().length > 0 && (
              <div className="att-export-menu" style={{ right: 0, top: '100%', zIndex: 60 }}>
                {search.results.length === 0 ? (
                  <div className="att-export-item" style={{ cursor: 'default' }}>
                    <span className="material-symbols-outlined icon-sm" style={{ color: 'var(--color-outline)' }}>
                      search_off
                    </span>
                    <span>No match for “{search.query}”</span>
                  </div>
                ) : (
                  search.results.map((result) => (
                    <button
                      key={result.employee.empId}
                      className="att-export-item"
                      type="button"
                      onClick={() => openResult(result.employee.empId)}
                    >
                      <span className="material-symbols-outlined icon-sm" style={{ color: 'var(--color-primary-container)' }}>
                        person
                      </span>
                      <span style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', lineHeight: 1.25 }}>
                        <span>{result.employee.name}</span>
                        <span style={{ fontSize: 11, color: 'var(--color-outline)' }}>
                          {result.matchField === 'id' ? result.employee.empId : result.employee.role} •{' '}
                          {result.employee.department}
                        </span>
                      </span>
                    </button>
                  ))
                )}
              </div>
            )}
          </div>

          {/* Clock */}
          <div className="header-clock">
            <span className="header-clock-date">{formatDate(now)}</span>
            <span className="header-clock-time font-tabular">{formatTime(now)}</span>
          </div>

          {/* Notifications */}
          <button
            className="header-notif-btn"
            type="button"
            title="Notifications"
            onClick={() => {
              setNotifOpen((prev) => !prev)
              setProfileOpen(false)
            }}
          >
            <span className="material-symbols-outlined icon-md">notifications</span>
            {unread > 0 && (
              <span className="header-notif-badge">
                <span className="animate-ping" style={{
                  position:'absolute', inset:0, borderRadius:'50%',
                  background:'var(--color-error)', opacity:0.75
                }} />
                <span style={{
                  position:'relative', display:'inline-flex',
                  width:8, height:8, borderRadius:'50%',
                  background:'var(--color-error)'
                }} />
              </span>
            )}
          </button>

          {notifOpen && (
            <div className="att-export-menu" style={{ position: 'fixed', right: 190, top: 56, width: 320, zIndex: 60 }}>
              <div style={{ padding: '10px 12px', borderBottom: '1px solid var(--color-outline-variant)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontWeight: 700, fontSize: 'var(--fs-label-md)' }}>Notifications</span>
                <span style={{ fontSize: 11, color: 'var(--color-outline)' }}>{unread} unread</span>
              </div>
              <div style={{ maxHeight: 320, overflowY: 'auto' }}>
                {notifications.map((item: AppNotification) => (
                  <button
                    key={item.id}
                    className="att-export-item"
                    type="button"
                    style={{ opacity: item.read ? 0.6 : 1 }}
                    onClick={() => markRead(item.id)}
                  >
                    <span className="material-symbols-outlined icon-sm" style={{ color: SEVERITY_COLOR[item.severity] }}>
                      {SEVERITY_ICON[item.severity]}
                    </span>
                    <span style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 2, whiteSpace: 'normal' }}>
                      <span style={{ fontWeight: 600 }}>{item.title}</span>
                      <span style={{ fontSize: 11, color: 'var(--color-on-surface-variant)' }}>{item.body}</span>
                      <span style={{ fontSize: 10, color: 'var(--color-outline)', fontFeatureSettings: '"tnum" 1' }}>
                        {notificationTime(item)}
                      </span>
                    </span>
                  </button>
                ))}
              </div>
              <div style={{ padding: 8, borderTop: '1px solid var(--color-outline-variant)' }}>
                <button className="btn btn-secondary" style={{ width: '100%', justifyContent: 'center' }} type="button" onClick={markAllRead}>
                  Mark all as read
                </button>
              </div>
            </div>
          )}

          {/* Avatar */}
          <div
            className="header-avatar-wrap"
            role="button"
            tabIndex={0}
            onClick={() => {
              setProfileOpen((prev) => !prev)
              setNotifOpen(false)
            }}
          >
            <img
              className="header-avatar"
              src={user?.avatar ?? ''}
              alt={user?.name ?? 'Profile'}
              onError={(e) => { (e.target as HTMLImageElement).src = '' }}
            />
            <span className="material-symbols-outlined icon-sm" style={{color:'var(--color-outline)'}}>arrow_drop_down</span>

            {profileOpen && (
              <div className="att-export-menu" style={{ position: 'fixed', right: 24, top: 56, width: 240, zIndex: 60 }}>
                <div style={{ padding: '10px 12px', display: 'flex', flexDirection: 'column', gap: 2, borderBottom: '1px solid var(--color-outline-variant)' }}>
                  <span style={{ fontWeight: 700 }}>{user?.name ?? 'Signed out'}</span>
                  <span style={{ fontSize: 11, color: 'var(--color-outline)' }}>{user?.role ?? '—'}</span>
                  <span style={{ fontSize: 11, color: 'var(--color-on-surface-variant)' }}>{user?.email ?? '—'}</span>
                </div>
                <button className="att-export-item" type="button" onClick={() => { setProfileOpen(false); navigate('/employees') }}>
                  <span className="material-symbols-outlined icon-sm" style={{ color: 'var(--color-primary-container)' }}>badge</span>
                  <span>Employee Directory</span>
                </button>
                <button className="att-export-item" type="button" onClick={handleSignOut}>
                  <span className="material-symbols-outlined icon-sm" style={{ color: 'var(--color-error)' }}>logout</span>
                  <span>Sign out</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header