import { BrowserRouter, Navigate, useRoutes } from 'react-router-dom'
import type { RouteObject } from 'react-router-dom'
import Layout from './components/Layout'
import rutasComunidades from './features/comunidades/routes'
import rutasMembresias from './features/membresias/routes'
import rutasPublicaciones from './features/publicaciones/routes'

/*
 * ARCHIVO CERRADO. No lo edites desde la rama de tu feature.
 *
 * Aquí solo se importan y concatenan, una única vez, las listas de rutas de los
 * tres módulos. Cada integrante edita únicamente los archivos de su propia
 * feature (src/features/<modulo>/), incluido su routes.tsx. Así evitamos
 * conflictos de merge entre las tres ramas.
 */

const rutasDeLaApp: RouteObject[] = [
  {
    element: <Layout />,
    children: [
      { index: true, element: <Navigate to="/comunidades" replace /> },
      ...rutasComunidades,
      ...rutasMembresias,
      ...rutasPublicaciones,
      { path: '*', element: <p className="aviso">La página que buscas no existe.</p> },
    ],
  },
]

function Rutas() {
  return useRoutes(rutasDeLaApp)
}

export default function App() {
  return (
    <BrowserRouter>
      <Rutas />
    </BrowserRouter>
  )
}
