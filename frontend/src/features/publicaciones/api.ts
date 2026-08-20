import { api } from '../../api/client'
import { obtenerToken } from './sesion'
import type {
  DatosPublicacion,
  DatosRegistro,
  Publicacion,
  RespuestaPaginada,
  RespuestaRecurso,
  UsuarioSesion,
} from './types'

/**
 * Igual que `api()`, pero agregando el token de Sanctum guardado por este
 * módulo. Los endpoints de Publicaciones exigen auth:sanctum.
 */
function apiAutenticada<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = obtenerToken()

  return api<T>(path, {
    ...options,
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  })
}

/** POST /api/register — crea la cuenta y devuelve el mismo par token/usuario que el login. */
export async function registrarse(
  datos: DatosRegistro,
): Promise<{ token: string; user: UsuarioSesion }> {
  const respuesta = await api<RespuestaRecurso<{ token: string; user: UsuarioSesion }>>(
    '/register',
    {
      method: 'POST',
      body: JSON.stringify(datos),
    },
  )

  return respuesta.data
}

/** POST /api/login — no requiere token, así que usa `api()` directamente. */
export async function iniciarSesion(
  email: string,
  password: string,
): Promise<{ token: string; user: UsuarioSesion }> {
  const respuesta = await api<RespuestaRecurso<{ token: string; user: UsuarioSesion }>>(
    '/login',
    {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    },
  )

  return respuesta.data
}

/** GET /api/feed — publicaciones de las comunidades a las que pertenece el usuario. */
export function obtenerFeed(pagina = 1): Promise<RespuestaPaginada<Publicacion>> {
  return apiAutenticada<RespuestaPaginada<Publicacion>>(`/feed?page=${pagina}`)
}

/**
 * Convierte el formulario al payload que espera StorePublicacionRequest.
 *
 * Se envía como FormData (no JSON) porque `imagen` es un archivo; los demás
 * campos viajan como texto dentro del mismo cuerpo multipart.
 */
function aPayload(datos: DatosPublicacion): FormData {
  const formData = new FormData()

  formData.append('titulo', datos.titulo)
  formData.append('descripcion', datos.descripcion)
  if (datos.tipo !== '') formData.append('tipo', datos.tipo)
  if (datos.fecha_evento.trim() !== '') formData.append('fecha_evento', datos.fecha_evento)
  if (datos.imagen !== null) formData.append('imagen', datos.imagen)

  return formData
}

/** POST /api/comunidades/{id}/publicaciones */
export async function crearPublicacion(
  comunidadId: number,
  datos: DatosPublicacion,
): Promise<Publicacion> {
  const respuesta = await apiAutenticada<RespuestaRecurso<Publicacion>>(
    `/comunidades/${comunidadId}/publicaciones`,
    {
      method: 'POST',
      body: aPayload(datos),
    },
  )

  return respuesta.data
}
