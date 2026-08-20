import type { RouteObject } from 'react-router-dom'
import Feed from './Feed'
import FormularioPublicacion from './FormularioPublicacion'
import Registrarse from './Registrarse'

/** Rutas del módulo Publicaciones. */
const rutas: RouteObject[] = [
  { path: 'feed', element: <Feed /> },
  { path: 'comunidades/:id/publicaciones/nueva', element: <FormularioPublicacion /> },
  { path: 'registro', element: <Registrarse /> },
]

export default rutas
