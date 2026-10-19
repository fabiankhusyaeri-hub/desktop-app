import React from 'react'
import Sidebar from './Sidebar'
import Header from './Header'
import './AppShell.css'

interface AppShellProps {
  children: React.ReactNode
}

const AppShell: React.FC<AppShellProps> = ({ children }) => {
  return (
    <div className="app-shell">
      <Sidebar />
      <div className="app-content">
        <Header />
        <main className="app-main">
          {children}
        </main>
      </div>
    </div>
  )
}

export default AppShell
