import type { RouteObject } from 'react-router-dom'
import Feed from './Feed'
import FormularioPublicacion from './FormularioPublicacion'

/** Rutas del módulo Publicaciones. */
const rutas: RouteObject[] = [
  { path: 'feed', element: <Feed /> },
  { path: 'comunidades/:id/publicaciones/nueva', element: <FormularioPublicacion /> },
]

export default rutas
