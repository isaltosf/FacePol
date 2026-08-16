import { NavLink, Outlet } from 'react-router-dom'

/**
 * Cascarón común de la aplicación: cabecera con la navegación principal y el
 * contenido de la ruta activa.
 *
 * Archivo de la base común: no lo edites desde la rama de una feature.
 */
export default function Layout() {
  return (
    <div className="app">
      <header className="cabecera">
        <div className="contenedor cabecera-interior">
          <span className="marca">FacePol</span>
          <nav className="nav">
            <NavLink to="/comunidades">Comunidades</NavLink>
            <NavLink to="/feed">Feed</NavLink>
          </nav>
        </div>
      </header>

      <main className="contenedor principal">
        <Outlet />
      </main>
    </div>
  )
}
