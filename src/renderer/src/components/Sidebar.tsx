import React, { useState, useSyncExternalStore } from 'react'
import { NavLink, useLocation, useNavigate } from 'react-router-dom'
import './Sidebar.css'
import {
  getSessionUser,
  sessionDurationLabel,
  signOut,
  subscribeSession
} from '../services/userService'
import { getUnreadCount, markAllRead } from '../services/notificationService'

interface NavItem {
  path: string
  icon: string
  label: string
}

const navItems: NavItem[] = [
  { path: '/dashboard',       icon: 'dashboard',   label: 'Dashboard'      },
  { path: '/live-monitoring', icon: 'radar',        label: 'Live Monitoring'},
  { path: '/employees',       icon: 'badge',        label: 'Employees'      },
  { path: '/attendance',      icon: 'how_to_reg',   label: 'Attendance'     },
  { path: '/location',        icon: 'near_me',      label: 'Location'       },
  { path: '/reports',         icon: 'analytics',    label: 'Reports'        },
  { path: '/settings',        icon: 'tune',         label: 'Settings'       },
]

const Sidebar: React.FC = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const user = useSyncExternalStore(subscribeSession, getSessionUser, getSessionUser)
  const [showProfile, setShowProfile] = useState(false)
  const [confirmSignOut, setConfirmSignOut] = useState(false)
  const [toast, setToast] = useState<string | null>(null)
  const unread = getUnreadCount()

  const showToast = (message: string): void => {
    setToast(message)
    window.setTimeout(() => setToast(null), 3000)
  }

  return (
    <aside className="sidebar">
      <div className="sidebar-top">
        {/* Logo */}
        <div className="sidebar-logo">
          <img
            src="https://lh3.googleusercontent.com/aida/AEtjO1UWJ4fBfypplT2TfmlLL_wArhrhdXTTny7jvpx3yzxK4gEz79BpmH78o0Lgk05AZYZC3CkRiKF2hS7RLnQXs7MGZlSEKEFuPIi5WAbSEGDK9xR3BXW2UBzyRApO9M5uiMN0ueH-K3TRn1-wt11Jfvodc_KW6o8mMk85HfVwuw5OSnuIioN2XnOpYugfw8e5fbcYTojG9JEnUFHq8AoO5zVRj0AI9_-H9m0obeTrL6Nz"
            alt="Vanguard FieldOps Logo"
            className="sidebar-logo-img"
            onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
          />
          <div className="sidebar-logo-text">
            <span className="sidebar-logo-name">Vanguard FieldOps</span>
            <span className="sidebar-logo-sub">Enterprise Attendance &amp; Live GPS</span>
          </div>
        </div>

        <div className="sidebar-divider" />

        {/* Nav */}
        <nav className="sidebar-nav">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path ||
              (item.path !== '/' && location.pathname.startsWith(item.path))
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={`sidebar-nav-item ${isActive ? 'active' : ''}`}
              >
                <span className="material-symbols-outlined sidebar-nav-icon">{item.icon}</span>
                <span className="sidebar-nav-label">{item.label}</span>
              </NavLink>
            )
          })}
        </nav>
      </div>

      {/* User Profile */}
      <div className="sidebar-footer">
        {toast && (
          <div className="toast-notice">
            <span className="material-symbols-outlined icon-md" style={{ color: 'var(--color-tertiary-fixed)' }}>
              check_circle
            </span>
            <span>{toast}</span>
          </div>
        )}

        <div className="sidebar-user">
          <img
            src={user?.avatar ?? ''}
            alt={user?.name ?? 'Signed out'}
            className="sidebar-user-avatar"
            onError={(e) => {
              const el = e.target as HTMLImageElement
              el.style.display = 'none'
              const fallback = el.nextElementSibling as HTMLElement
              if (fallback) fallback.style.display = 'flex'
            }}
          />
          <div className="sidebar-user-avatar-fallback" style={{display:'none'}}>SJ</div>
          <div className="sidebar-user-info" onClick={() => setShowProfile(true)} style={{ cursor: 'pointer' }}>
            <span className="sidebar-user-name">{user?.name ?? 'Sarah Jenkins'}</span>
            <span className="sidebar-user-role">{user?.role ?? 'Super Admin / HR Director'}</span>
          </div>
          <div className="sidebar-user-actions">
            <NavLink
              to="/settings"
              className="sidebar-user-action-btn"
              title="Settings"
              onClick={(e) => {
                // Settings is out of scope for this pass — do not navigate away.
                e.preventDefault()
                showToast('Settings module is not enabled in this build')
              }}
            >
              <span className="material-symbols-outlined icon-sm">settings</span>
            </NavLink>
            <button className="sidebar-user-action-btn logout" title="Logout" onClick={() => setConfirmSignOut(true)}>
              <span className="material-symbols-outlined icon-sm">logout</span>
            </button>
          </div>
        </div>
      </div>

      {/* Profile card */}
      {showProfile && user && (
        <div className="emp-modal-backdrop" onClick={() => setShowProfile(false)}>
          <div className="emp-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="emp-modal-header">
              <h3 className="emp-modal-title">Account</h3>
              <button type="button" className="telemetry-tool-btn" onClick={() => setShowProfile(false)}>
                <span className="material-symbols-outlined icon-md">close</span>
              </button>
            </div>
            <div className="emp-modal-body">
              <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                <img
                  src={user.avatar}
                  alt={user.name}
                  style={{ width: 56, height: 56, borderRadius: '50%', objectFit: 'cover' }}
                />
                <div>
                  <h4 style={{ margin: 0, fontSize: 'var(--fs-title-md)', fontWeight: 700 }}>{user.name}</h4>
                  <span style={{ fontSize: 'var(--fs-body-sm)', color: 'var(--color-outline)' }}>{user.email}</span>
                  <div style={{ display: 'flex', gap: 6, marginTop: 4 }}>
                    <span className="telemetry-badge-id">{user.id}</span>
                    <span className="telemetry-dept">{user.department}</span>
                  </div>
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginTop: 10 }}>
                <div style={{ padding: 10, background: 'var(--color-surface-container-low)', borderRadius: 'var(--radius-base)' }}>
                  <span style={{ fontSize: 11, color: 'var(--color-outline)', display: 'block' }}>Role</span>
                  <strong style={{ fontSize: 13 }}>{user.role}</strong>
                </div>
                <div style={{ padding: 10, background: 'var(--color-surface-container-low)', borderRadius: 'var(--radius-base)' }}>
                  <span style={{ fontSize: 11, color: 'var(--color-outline)', display: 'block' }}>Session</span>
                  <strong style={{ fontSize: 13 }}>{sessionDurationLabel()}</strong>
                </div>
                <div style={{ padding: 10, background: 'var(--color-surface-container-low)', borderRadius: 'var(--radius-base)', gridColumn: '1/-1' }}>
                  <span style={{ fontSize: 11, color: 'var(--color-outline)', display: 'block' }}>Permissions</span>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginTop: 4 }}>
                    {user.permissions.map((permission) => (
                      <span key={permission} className="emp-geofence-tag" style={{ fontSize: 11 }}>
                        {permission}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            <div className="emp-modal-footer">
              <button type="button" className="btn btn-secondary" onClick={() => setShowProfile(false)}>
                Close
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => {
                  markAllRead()
                  setShowProfile(false)
                  showToast(`${unread} notification(s) cleared`)
                }}
              >
                <span className="material-symbols-outlined icon-sm">notifications</span>
                Clear Notifications
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Sign out confirmation */}
      {confirmSignOut && (
        <div className="emp-modal-backdrop" onClick={() => setConfirmSignOut(false)}>
          <div className="emp-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="emp-modal-header">
              <h3 className="emp-modal-title">End Session</h3>
              <button type="button" className="telemetry-tool-btn" onClick={() => setConfirmSignOut(false)}>
                <span className="material-symbols-outlined icon-md">close</span>
              </button>
            </div>
            <div className="emp-modal-body">
              <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                <span className="material-symbols-outlined icon-lg" style={{ color: 'var(--color-error)' }}>
                  logout
                </span>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                  <strong>Sign out of Vanguard FieldOps?</strong>
                  <span style={{ fontSize: 'var(--fs-body-sm)', color: 'var(--color-on-surface-variant)' }}>
                    Live telemetry streams will keep recording on the server, but this console will stop
                    receiving updates. Active shift {sessionDurationLabel()}.
                  </span>
                </div>
              </div>
            </div>
            <div className="emp-modal-footer">
              <button type="button" className="btn btn-secondary" onClick={() => setConfirmSignOut(false)}>
                Stay Signed In
              </button>
              <button
                type="button"
                className="btn btn-primary"
                style={{ background: 'var(--color-error)', color: 'var(--color-on-error)' }}
                onClick={() => {
                  signOut()
                  setConfirmSignOut(false)
                  showToast('Session ended — re-authentication required')
                  navigate('/dashboard')
                }}
              >
                <span className="material-symbols-outlined icon-sm">logout</span>
                Sign Out
              </button>
            </div>
          </div>
        </div>
      )}
    </aside>
  )
}

export default Sidebar
