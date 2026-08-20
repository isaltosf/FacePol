import { api } from '../../api/client'
import { obtenerToken } from '../publicaciones/sesion'
import type {
  EstadoMembresia,
  FilaMiembro,
  FilaSolicitud,
  MiMembresia,
  RespuestaLista,
} from './types'

/** Wrapper de api() que inyecta el Bearer token de la sesión activa. */
function apiAuth<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = obtenerToken()
  const authHeader: HeadersInit = token ? { Authorization: `Bearer ${token}` } : {}
  return api<T>(path, {
    ...options,
    headers: { ...authHeader, ...(options.headers as Record<string, string> | undefined) },
  })
}

/** POST /api/comunidades/{comunidadId}/membresias */
export async function solicitarMembresia(
  comunidadId: number | string,
): Promise<{ message: string }> {
  return apiAuth<{ message: string }>(`/comunidades/${comunidadId}/membresias`, {
    method: 'POST',
  })
}

/** GET /api/comunidades/{id}/mi-membresia */
export async function obtenerMiMembresia(comunidadId: number | string): Promise<MiMembresia> {
  const respuesta = await apiAuth<{ data: MiMembresia }>(
    `/comunidades/${comunidadId}/mi-membresia`,
  )
  return respuesta.data
}

/** GET /api/comunidades/{id}/miembros */
export async function obtenerMiembros(comunidadId: string): Promise<FilaMiembro[]> {
  const respuesta = await apiAuth<RespuestaLista<FilaMiembro>>(
    `/comunidades/${comunidadId}/miembros`,
  )
  return respuesta.data
}

/** GET /api/comunidades/{id}/solicitudes */
export async function obtenerSolicitudes(comunidadId: string): Promise<FilaSolicitud[]> {
  const respuesta = await apiAuth<RespuestaLista<FilaSolicitud>>(
    `/comunidades/${comunidadId}/solicitudes`,
  )
  return respuesta.data
}

/** PATCH /api/membresias/{id} */
export async function actualizarEstado(
  membresiaId: number,
  estado: EstadoMembresia,
): Promise<{ message: string }> {
  return apiAuth<{ message: string }>(`/membresias/${membresiaId}`, {
    method: 'PATCH',
    body: JSON.stringify({ estado }),
  })
}
