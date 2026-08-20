import { api } from '../../api/client'
import type {
  Comunidad,
  DatosComunidad,
  RespuestaPaginada,
  RespuestaRecurso,
} from './types'

/**
 * Convierte lo que escribió el usuario en el formulario al formato que espera la
 * API. Se envía como FormData porque `logo` es un archivo; si no se eligió uno
 * nuevo, simplemente no viaja (el backend conserva el logo actual al editar).
 */
function aPayload(datos: DatosComunidad): FormData {
  const formData = new FormData()

  formData.append('nombre', datos.nombre)
  formData.append('descripcion', datos.descripcion)
  if (datos.categoria !== '') formData.append('categoria', datos.categoria)
  if (datos.administrador_id.trim() !== '') {
    formData.append('administrador_id', datos.administrador_id)
  }
  if (datos.logo !== null) formData.append('logo', datos.logo)

  return formData
}

/** GET /api/comunidades — listado paginado, con filtros opcionales. */
export function listarComunidades(
  parametros: URLSearchParams,
): Promise<RespuestaPaginada<Comunidad>> {
  const consulta = parametros.toString()

  return api<RespuestaPaginada<Comunidad>>(
    consulta === '' ? '/comunidades' : `/comunidades?${consulta}`,
  )
}

/** GET /api/comunidades/{id} */
export async function obtenerComunidad(id: string): Promise<Comunidad> {
  const respuesta = await api<RespuestaRecurso<Comunidad>>(`/comunidades/${id}`)

  return respuesta.data
}

/** POST /api/comunidades */
export async function crearComunidad(datos: DatosComunidad): Promise<Comunidad> {
  const respuesta = await api<RespuestaRecurso<Comunidad>>('/comunidades', {
    method: 'POST',
    body: aPayload(datos),
  })

  return respuesta.data
}

/**
 * PUT /api/comunidades/{id}
 *
 * PHP no puebla `$_FILES` en peticiones PUT reales, así que el multipart viaja
 * por POST con el spoofing de método (`_method`) que Laravel reconoce.
 */
export async function actualizarComunidad(
  id: string,
  datos: DatosComunidad,
): Promise<Comunidad> {
  const formData = aPayload(datos)
  formData.append('_method', 'PUT')

  const respuesta = await api<RespuestaRecurso<Comunidad>>(`/comunidades/${id}`, {
    method: 'POST',
    body: formData,
  })

  return respuesta.data
}
