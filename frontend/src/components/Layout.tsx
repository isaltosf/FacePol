import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import { Menu, PanelLeftClose, PanelLeftOpen } from 'lucide-react'
import AppSidebar from './AppSidebar'

export default function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [collapsed, setCollapsed] = useState(false)

  return (
    <div className="layout-root">
      <AppSidebar
        open={sidebarOpen}
        collapsed={collapsed}
        onClose={() => setSidebarOpen(false)}
      />

      <div className={`sidebar-content-area${collapsed ? ' sidebar-content-collapsed' : ''}`}>
        {/* Desktop top bar */}
        <div className="desktop-topbar">
          <button
            className="sidebar-toggle-btn"
            onClick={() => setCollapsed((c) => !c)}
            aria-label={collapsed ? 'Expandir menú' : 'Colapsar menú'}
            title={collapsed ? 'Expandir menú' : 'Colapsar menú'}
          >
            {collapsed ? <PanelLeftOpen size={18} /> : <PanelLeftClose size={18} />}
          </button>
        </div>

        {/* Mobile top bar */}
        <div className="sidebar-mobile-bar">
          <button
            className="sidebar-menu-btn"
            onClick={() => setSidebarOpen(true)}
            aria-label="Abrir menú"
          >
            <Menu size={22} />
          </button>
          <span className="sidebar-mobile-brand">FacePol</span>
        </div>

        <main className="contenedor principal">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
