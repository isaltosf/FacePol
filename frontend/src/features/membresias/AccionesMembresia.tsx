import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ErrorApi, ErrorValidacion } from '../../api/client'
import { useSesion } from '../publicaciones/sesion'
import { solicitarMembresia } from './api'
import { useMiMembresia } from './useMiMembresia'

interface Props {
  comunidadId: string | number
}

/** Mensaje fijo por cada estado ya resuelto (no se puede volver a solicitar). */
const MENSAJE_ESTADO: Record<'pendiente' | 'aprobada' | 'rechazada', string> = {
  pendiente: 'Ya tienes una solicitud pendiente en esta comunidad.',
  aprobada: 'Ya eres miembro de esta comunidad.',
  rechazada: 'Tu solicitud fue rechazada. No puedes volver a solicitar membresía.',
}

/**
 * Solo el botón de "Solicitar unirme" (o el mensaje de tu estado actual).
 * "Ver miembros" y "Panel de solicitudes" viven en el encabezado del detalle
 * de la comunidad, no aquí.
 */
export default function AccionesMembresia({ comunidadId }: Props) {
  const { haySesion } = useSesion()
  const { cargando, esAdministrador, estado, setEstado } = useMiMembresia(comunidadId)
  const [enviando, setEnviando] = useState(false)
  const [exito, setExito] = useState('')
  const [errorGeneral, setErrorGeneral] = useState('')

  async function handleSolicitar() {
    setEnviando(true)
    setExito('')
    setErrorGeneral('')

    try {
      const respuesta = await solicitarMembresia(comunidadId)
      setExito(respuesta.message)
      setEstado('pendiente')
    } catch (err) {
      if (err instanceof ErrorValidacion) {
        const detalles = Object.values(err.errors).flat().join(' ')
        setErrorGeneral(detalles || err.message)
      } else if (err instanceof ErrorApi) {
        setErrorGeneral(err.message)
      } else {
        setErrorGeneral('Error inesperado al enviar la solicitud.')
      }
    } finally {
      setEnviando(false)
    }
  }

  if (!haySesion) {
    return (
      <section className="acciones-membresia">
        <h2 style={{ marginTop: '1.5rem' }}>Membresía</h2>
        <Link className="boton boton-secundario" to="/feed">
          Inicia sesión para solicitar membresía
        </Link>
      </section>
    )
  }

  // El administrador ya "pertenece" a su comunidad: no tiene sentido pedirle
  // que se solicite unirse a sí mismo.
  if (cargando || esAdministrador) return null

  return (
    <section className="acciones-membresia">
      <h2 style={{ marginTop: '1.5rem' }}>Membresía</h2>

      <div className="acciones-membresia-botones">
        {estado === null && (
          <button className="boton" disabled={enviando} onClick={handleSolicitar}>
            {enviando ? 'Enviando…' : 'Solicitar unirme'}
          </button>
        )}

        {estado !== null && <p className="texto-suave">{MENSAJE_ESTADO[estado]}</p>}
      </div>

      {exito !== '' && <p className="alerta-exito">{exito}</p>}
      {errorGeneral !== '' && <p className="alerta-error">{errorGeneral}</p>}
    </section>
  )
}
