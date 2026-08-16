/** Categorías válidas según el backend (Comunidad::CATEGORIAS). */
export const CATEGORIAS = ['academica', 'cultural', 'deportiva', 'tecnologica'] as const

export type Categoria = (typeof CATEGORIAS)[number]

/** Cómo se muestra cada categoría en pantalla. */
export const ETIQUETAS_CATEGORIA: Record<Categoria, string> = {
  academica: 'Académica',
  cultural: 'Cultural',
  deportiva: 'Deportiva',
  tecnologica: 'Tecnológica',
}

/** Administrador de la comunidad, tal como lo arma ComunidadResource. */
export interface Administrador {
  id: number
  nombre: string
  email: string
}

export interface Comunidad {
  id: number
  nombre: string
  descripcion: string
  categoria: Categoria
  logo: string | null
  activa: boolean
  administrador_id: number
  /** Opcional: el backend solo lo incluye cuando carga la relación. */
  administrador?: Administrador
  created_at: string
  updated_at: string
}

/** Datos que viajan al backend al crear o editar una comunidad. */
export interface DatosComunidad {
  nombre: string
  descripcion: string
  categoria: Categoria | ''
  logo: string
  administrador_id: string
}

/** Formulario en blanco, para la pantalla de creación. */
export const DATOS_VACIOS: DatosComunidad = {
  nombre: '',
  descripcion: '',
  categoria: '',
  logo: '',
  administrador_id: '',
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

/** Respuesta de un listado paginado. */
export interface RespuestaPaginada<T> {
  data: T[]
  meta: MetaPaginacion
}

/** Respuesta de un recurso individual. */
export interface RespuestaRecurso<T> {
  data: T
}
