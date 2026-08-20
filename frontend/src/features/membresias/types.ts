/** Usuario tal como lo serializa el backend (columna "name", no "nombre"). */
export interface UsuarioResumen {
  id: number
  name: string
  email: string
  rol: string
}

/** Fila que devuelve GET /api/comunidades/{id}/miembros */
export interface FilaMiembro {
  membresia_id: number | null
  miembro_desde: string
  es_administrador: boolean
  user: UsuarioResumen
}

/** GET /api/comunidades/{id}/mi-membresia */
export interface MiMembresia {
  es_administrador: boolean
  estado: 'pendiente' | 'aprobada' | 'rechazada' | null
}

/** Fila que devuelve GET /api/comunidades/{id}/solicitudes */
export interface FilaSolicitud {
  membresia_id: number
  solicitado_en: string
  user: UsuarioResumen
}

export type EstadoMembresia = 'aprobada' | 'rechazada'

/** Envoltorio genérico de listado. */
export interface RespuestaLista<T> {
  data: T[]
}
