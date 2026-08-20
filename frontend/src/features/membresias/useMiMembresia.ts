import { useEffect, useState } from 'react'
import { useSesion } from '../publicaciones/sesion'
import { obtenerMiMembresia } from './api'
import type { MiMembresia } from './types'

/**
 * Cómo se relaciona el usuario autenticado con una comunidad: si la
 * administra, si ya es miembro, o si tiene una solicitud pendiente/rechazada.
 * Compartido por AccionesMembresia y el encabezado de DetalleComunidad para
 * no duplicar la llamada a GET /mi-membresia.
 */
export function useMiMembresia(comunidadId: string | number) {
  const { haySesion } = useSesion()
  const [miMembresia, setMiMembresia] = useState<MiMembresia | null>(null)
  const [cargando, setCargando] = useState(true)

  useEffect(() => {
    if (!haySesion) {
      setCargando(false)
      return
    }

    let vigente = true
    setCargando(true)

    obtenerMiMembresia(comunidadId)
      .then((datos) => {
        if (vigente) setMiMembresia(datos)
      })
      .catch(() => {
        if (vigente) setMiMembresia(null)
      })
      .finally(() => {
        if (vigente) setCargando(false)
      })

    return () => {
      vigente = false
    }
  }, [haySesion, comunidadId])

  return {
    cargando,
    esAdministrador: miMembresia?.es_administrador ?? false,
    estado: miMembresia?.estado ?? null,
    setEstado: (estado: MiMembresia['estado']) =>
      setMiMembresia((anterior) => ({ es_administrador: anterior?.es_administrador ?? false, estado })),
  }
}
