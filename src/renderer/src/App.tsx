import React, { useEffect, useState } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import AppShell from './components/AppShell'
import Dashboard from './pages/Dashboard'
import LiveMonitoring from './pages/LiveMonitoring'
import Employees from './pages/Employees'
import Attendance from './pages/Attendance'
import LocationView from './views/LocationView'
import ReportsView from './views/ReportsView'
import SettingsView from './views/SettingsView'

const App: React.FC = () => {
  const [status, setStatus] = useState<string>('idle')

  useEffect(() => {
    const runSupabaseCheck = async (): Promise<void> => {
      if (!window.supabaseBridge) {
        console.warn('[Supabase] IPC bridge not ready yet')
        return
      }

      try {
        const result = await window.supabaseBridge.testConnection()
        console.log('[Supabase] Connection test:', result)
        setStatus(result.success ? 'connected' : 'failed')
      } catch (error) {
        console.error('[Supabase] Connection test failed:', error)
        setStatus('failed')
      }
    }

    window.__debugSupabaseCheck = runSupabaseCheck
    void runSupabaseCheck()
  }, [])

  const handleLoadEmployees = async (): Promise<void> => {
    if (!window.supabaseBridge) return

    try {
      const result = await window.supabaseBridge.getEmployees()
      console.log('[Supabase] Employees:', result)
      setStatus(result.success ? 'employees-loaded' : 'failed')
    } catch (error) {
      console.error('[Supabase] Load employees failed:', error)
      setStatus('failed')
    }
  }

  return (
    <AppShell>
      <div style={{ display: 'flex', gap: 12, padding: 12, alignItems: 'center' }}>
        <button onClick={handleLoadEmployees}>Load Employees</button>
        <span>Status: {status}</span>
      </div>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/live-monitoring" element={<LiveMonitoring />} />
        <Route path="/employees" element={<Employees />} />
        <Route path="/attendance" element={<Attendance />} />
        <Route path="/location" element={<LocationView />} />
        <Route path="/reports" element={<ReportsView />} />
        <Route path="/settings" element={<SettingsView />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </AppShell>
  )
}

export default App
