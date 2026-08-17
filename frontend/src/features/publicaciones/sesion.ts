import { useSyncExternalStore } from 'react'
import type { UsuarioSesion } from './types'

/**
 * Manejo de sesión para el módulo Publicaciones.
 *
 * El proyecto todavía no tiene una pantalla de login compartida (ver el
 * bloqueador de autenticación del punto 2 del reparto de tareas), así que este
 * módulo guarda su propio token en localStorage tras llamar a POST /api/login.
 * Vive solo dentro de esta carpeta: no afecta a los otros módulos.
 */
const CLAVE_TOKEN = 'facepol.publicaciones.token'
const CLAVE_USUARIO = 'facepol.publicaciones.usuario'

type Escucha = () => void
const escuchas = new Set<Escucha>()

function notificar() {
  for (const escucha of escuchas) escucha()
}

export function obtenerToken(): string | null {
  return localStorage.getItem(CLAVE_TOKEN)
}

// useSyncExternalStore exige que getSnapshot devuelva la MISMA referencia
// mientras el valor no cambie (si no, entra en loop de renders). Como el
// usuario vive serializado en localStorage, se cachea el objeto parseado y
// solo se vuelve a leer cuando `notificar()` invalida la caché.
let cacheUsuario: UsuarioSesion | null | undefined

function leerUsuarioDeAlmacenamiento(): UsuarioSesion | null {
  const crudo = localStorage.getItem(CLAVE_USUARIO)
  if (!crudo) return null

  try {
    return JSON.parse(crudo) as UsuarioSesion
  } catch {
    return null
  }
}

export function obtenerUsuario(): UsuarioSesion | null {
  if (cacheUsuario === undefined) {
    cacheUsuario = leerUsuarioDeAlmacenamiento()
  }

  return cacheUsuario
}

export function guardarSesion(token: string, usuario: UsuarioSesion) {
  localStorage.setItem(CLAVE_TOKEN, token)
  localStorage.setItem(CLAVE_USUARIO, JSON.stringify(usuario))
  cacheUsuario = usuario
  notificar()
}

export function cerrarSesion() {
  localStorage.removeItem(CLAVE_TOKEN)
  localStorage.removeItem(CLAVE_USUARIO)
  cacheUsuario = null
  notificar()
}

function suscribirse(escucha: Escucha) {
  escuchas.add(escucha)
  return () => escuchas.delete(escucha)
}

/** Hook reactivo: re-renderiza al iniciar o cerrar sesión. */
export function useSesion() {
  const usuario = useSyncExternalStore(suscribirse, obtenerUsuario)

  return { usuario, haySesion: usuario !== null }
}
