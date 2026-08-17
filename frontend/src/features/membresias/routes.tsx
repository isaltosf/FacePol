import type { RouteObject } from 'react-router-dom'
import ListaMiembros from './ListaMiembros'
import PanelSolicitudes from './PanelSolicitudes'

/** Rutas del módulo Membresías. App.tsx ya concatena esta lista. */
const rutas: RouteObject[] = [
  { path: 'comunidades/:id/miembros', element: <ListaMiembros /> },
  { path: 'comunidades/:id/solicitudes', element: <PanelSolicitudes /> },
]

export default rutas
