import { api } from '../../api/client'
import type {
  Comunidad,
  DatosComunidad,
  RespuestaPaginada,
  RespuestaRecurso,
} from './types'

/**
 * Convierte lo que escribió el usuario en el formulario al formato que espera la
 * API. Los campos vacíos viajan como null para que Laravel dispare sus mensajes
 * de "campo obligatorio" en lugar de fallar por tipo.
 */
function aPayload(datos: DatosComunidad) {
  return {
    nombre: datos.nombre,
    descripcion: datos.descripcion,
    categoria: datos.categoria === '' ? null : datos.categoria,
    logo: datos.logo.trim() === '' ? null : datos.logo.trim(),
    administrador_id:
      datos.administrador_id.trim() === '' ? null : Number(datos.administrador_id),
  }
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
    body: JSON.stringify(aPayload(datos)),
  })

  return respuesta.data
}

/** PUT /api/comunidades/{id} */
export async function actualizarComunidad(
  id: string,
  datos: DatosComunidad,
): Promise<Comunidad> {
  const respuesta = await api<RespuestaRecurso<Comunidad>>(`/comunidades/${id}`, {
    method: 'PUT',
    body: JSON.stringify(aPayload(datos)),
  })

  return respuesta.data
}
