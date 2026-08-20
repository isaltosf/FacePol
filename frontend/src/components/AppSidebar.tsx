import { useEffect, useRef, useState } from 'react'
import { useSyncExternalStore } from 'react'
import { NavLink } from 'react-router-dom'
import { Building2, LogOut, Moon, Newspaper, Scale, Sun, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { cerrarSesion, useSesion } from '../features/publicaciones/sesion'
import { getDarkMode, setDarkMode, suscribirDarkMode } from '@/lib/darkMode'

interface AppSidebarProps {
  open: boolean
  collapsed: boolean
  onClose: () => void
}

const navItems = [
  { to: '/comunidades', label: 'Comunidades', icon: Building2 },
  { to: '/feed', label: 'Feed', icon: Newspaper },
]

export default function AppSidebar({ open, collapsed, onClose }: AppSidebarProps) {
  const { usuario, haySesion } = useSesion()
  const darkMode = useSyncExternalStore(suscribirDarkMode, getDarkMode)
  const [menuPerfil, setMenuPerfil] = useState(false)
  const wrapperRef = useRef<HTMLDivElement>(null)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!menuPerfil) return
    function handleClick(e: MouseEvent) {
      const target = e.target as Node
      if (
        wrapperRef.current?.contains(target) === false &&
        menuRef.current?.contains(target) === false
      ) {
        setMenuPerfil(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [menuPerfil])

  const inicial = usuario?.nombre.trim().charAt(0).toUpperCase() ?? '?'

  return (
    <>
      {open && (
        <div className="sidebar-overlay" onClick={onClose} aria-hidden="true" />
      )}

      <aside
        className={cn(
          'sidebar',
          open && 'sidebar-mobile-open',
          collapsed && 'sidebar-collapsed',
        )}
      >
        {/* Header */}
        <div className="sidebar-header">
          <div className="sidebar-brand-icon">
            <Scale size={16} />
          </div>
          {!collapsed && <span className="sidebar-brand">FacePol</span>}
          <button className="sidebar-close-btn" onClick={onClose} aria-label="Cerrar menú">
            <X size={18} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="sidebar-nav" aria-label="Navegación principal">
          {!collapsed && <p className="sidebar-section-label">Menú</p>}
          {navItems.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                cn('sidebar-item', collapsed && 'sidebar-item-collapsed', isActive && 'active')
              }
              onClick={onClose}
              title={collapsed ? label : undefined}
            >
              <Icon size={17} className="sidebar-item-icon" />
              {!collapsed && <span>{label}</span>}
            </NavLink>
          ))}
        </nav>

        {/* Footer / Perfil */}
        <div className="sidebar-footer">
          {haySesion && usuario ? (
            <div
              className={cn('sidebar-perfil-wrapper', collapsed && 'sidebar-perfil-collapsed')}
              ref={wrapperRef}
            >
              {menuPerfil && (
                <div
                  ref={menuRef}
                  className={cn(
                    'sidebar-perfil-menu',
                    collapsed && 'sidebar-perfil-menu-fixed',
                  )}
                >
                  {/* Nombre y email arriba */}
                  <div className="sidebar-perfil-menu-header">
                    <p className="sidebar-perfil-menu-nombre">{usuario.nombre}</p>
                    <p className="sidebar-perfil-menu-email">{usuario.email}</p>
                  </div>

                  <div className="sidebar-perfil-menu-divider" />

                  {/* Toggle dark mode */}
                  <button
                    className="sidebar-perfil-menu-btn sidebar-perfil-menu-btn-neutral"
                    onClick={() => setDarkMode(!darkMode)}
                  >
                    {darkMode ? <Sun size={14} /> : <Moon size={14} />}
                    {darkMode ? 'Modo claro' : 'Modo oscuro'}
                  </button>

                  <div className="sidebar-perfil-menu-divider" />

                  {/* Cerrar sesión */}
                  <button
                    className="sidebar-perfil-menu-btn"
                    onClick={() => { cerrarSesion(); setMenuPerfil(false) }}
                  >
                    <LogOut size={14} />
                    Cerrar sesión
                  </button>
                </div>
              )}

              <button
                className="sidebar-perfil-btn"
                onClick={() => setMenuPerfil((m) => !m)}
                title={collapsed ? usuario.nombre : undefined}
                aria-label="Menú de perfil"
              >
                <div className="sidebar-avatar">{inicial}</div>
                {!collapsed && (
                  <div className="sidebar-perfil-info">
                    <span className="sidebar-perfil-nombre">{usuario.nombre}</span>
                    <span className="sidebar-perfil-email">{usuario.email}</span>
                  </div>
                )}
              </button>
            </div>
          ) : (
            !collapsed && <p className="sidebar-footer-text">FacePol © 2025</p>
          )}
        </div>
      </aside>
    </>
  )
}
