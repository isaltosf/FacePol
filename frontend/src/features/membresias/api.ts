import { api } from '../../api/client'
import type { EstadoMembresia, FilaMiembro, FilaSolicitud, RespuestaLista } from './types'

/** Lee el Bearer token almacenado en localStorage. */
function authHeaders(): HeadersInit {
  const token = localStorage.getItem('facepol_token') ?? ''
  return token ? { Authorization: `Bearer ${token}` } : {}
}

/** Wrapper de api() que inyecta la cabecera de autenticación. */
function apiAuth<T>(path: string, options: RequestInit = {}): Promise<T> {
  return api<T>(path, {
    ...options,
    headers: { ...authHeaders(), ...(options.headers as Record<string, string> | undefined) },
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
