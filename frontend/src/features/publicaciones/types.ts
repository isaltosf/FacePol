/** Tipos válidos de publicación, según el backend (Publicacion::TIPOS). */
export const TIPOS_PUBLICACION = ['anuncio', 'evento'] as const

export type TipoPublicacion = (typeof TIPOS_PUBLICACION)[number]

export const ETIQUETAS_TIPO: Record<TipoPublicacion, string> = {
  anuncio: 'Anuncio',
  evento: 'Evento',
}

/** Comunidad resumida, tal como la incluye PublicacionResource. */
export interface ComunidadResumen {
  id: number
  nombre: string
}

/** Autor resumido, tal como lo incluye PublicacionResource. */
export interface AutorResumen {
  id: number
  nombre: string
}

export interface Publicacion {
  id: number
  titulo: string
  descripcion: string
  tipo: TipoPublicacion
  fecha_evento: string | null
  comunidad_id: number
  comunidad?: ComunidadResumen
  autor_id: number
  autor?: AutorResumen
  created_at: string
  updated_at: string
}

/** Datos que viajan al backend al crear una publicación. */
export interface DatosPublicacion {
  titulo: string
  descripcion: string
  tipo: TipoPublicacion | ''
  fecha_evento: string
}

export const DATOS_VACIOS: DatosPublicacion = {
  titulo: '',
  descripcion: '',
  tipo: '',
  fecha_evento: '',
}

/** Bloque "meta" de la paginación de Laravel. */
export interface MetaPaginacion {
  current_page: number
  last_page: number
  per_page: number
  total: number
  from: number | null
  to: number | null
}

/** Respuesta de un listado paginado (feed). */
export interface RespuestaPaginada<T> {
  data: T[]
  meta?: MetaPaginacion
}

/** Respuesta de un recurso individual. */
export interface RespuestaRecurso<T> {
  data: T
}

/** Datos que viajan al backend al registrar una cuenta nueva. */
export interface DatosRegistro {
  name: string
  email: string
  password: string
  password_confirmation: string
}

export const REGISTRO_VACIO: DatosRegistro = {
  name: '',
  email: '',
  password: '',
  password_confirmation: '',
}

/** Usuario autenticado, tal como lo devuelven POST /api/login y POST /api/register. */
export interface UsuarioSesion {
  id: number
  nombre: string
  email: string
  rol: string
}
