import type { RouteObject } from 'react-router-dom'
import CatalogoComunidades from './CatalogoComunidades'
import DetalleComunidad from './DetalleComunidad'
import EditarComunidad from './EditarComunidad'
import NuevaComunidad from './NuevaComunidad'

/** Rutas del módulo Comunidades. App.tsx concatena esta lista. */
const rutas: RouteObject[] = [
  { path: 'comunidades', element: <CatalogoComunidades /> },
  { path: 'comunidades/nueva', element: <NuevaComunidad /> },
  { path: 'comunidades/:id', element: <DetalleComunidad /> },
  { path: 'comunidades/:id/editar', element: <EditarComunidad /> },
]

export default rutas
