import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useSesion } from '../publicaciones/sesion'
import { actualizarEstado, obtenerSolicitudes } from './api'
import type { EstadoMembresia, FilaSolicitud } from './types'

export default function PanelSolicitudes() {
  const { id = '' } = useParams()
  const { haySesion } = useSesion()
  const [solicitudes, setSolicitudes] = useState<FilaSolicitud[]>([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState('')
  const [procesando, setProcesando] = useState<number | null>(null)
  const [mensajeAccion, setMensajeAccion] = useState('')

  useEffect(() => {
    let vigente = true
    setCargando(true)
    setError('')

    obtenerSolicitudes(id)
      .then((data) => { if (vigente) setSolicitudes(data) })
      .catch((err: unknown) => {
        if (!vigente) return
        setError(err instanceof Error ? err.message : 'No se pudieron cargar las solicitudes.')
      })
      .finally(() => { if (vigente) setCargando(false) })

    return () => { vigente = false }
  }, [id])

  async function handleAccion(membresiaId: number, estado: EstadoMembresia) {
    setProcesando(membresiaId)
    setMensajeAccion('')

    try {
      const respuesta = await actualizarEstado(membresiaId, estado)
      setMensajeAccion(respuesta.message)
      setSolicitudes((prev) => prev.filter((s) => s.membresia_id !== membresiaId))
    } catch (err) {
      setMensajeAccion(
        err instanceof Error ? err.message : 'Error al procesar la solicitud.',
      )
    } finally {
      setProcesando(null)
    }
  }

  if (!haySesion) {
    return (
      <section>
        <Link to={`/comunidades/${id}`} className="texto-suave">← Volver al detalle</Link>
        <p className="aviso">Debes <Link to="/feed">iniciar sesión</Link> para gestionar solicitudes.</p>
      </section>
    )
  }

  return (
    <section>
      <div className="encabezado-pagina">
        <Link to={`/comunidades/${id}`} className="texto-suave">
          ← Volver al detalle
        </Link>
        <h1 style={{ margin: 0 }}>Solicitudes pendientes</h1>
      </div>

      {mensajeAccion !== '' && (
        <p className="alerta-exito" style={{ marginTop: '0.75rem' }}>
          {mensajeAccion}
        </p>
      )}

      {cargando && <p className="aviso">Cargando solicitudes…</p>}

      {!cargando && error !== '' && (
        <p className="alerta-error">{error}</p>
      )}

      {!cargando && error === '' && solicitudes.length === 0 && (
        <p className="aviso">No hay solicitudes pendientes en esta comunidad.</p>
      )}

      {!cargando && error === '' && solicitudes.length > 0 && (
        <div className="tabla-wrapper">
          <table className="tabla-miembros">
            <thead>
              <tr>
                <th>#</th>
                <th>Nombre</th>
                <th>Correo</th>
                <th>Solicitado el</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {solicitudes.map((fila, i) => {
                const enProceso = procesando === fila.membresia_id
                return (
                  <tr key={fila.membresia_id}>
                    <td>{i + 1}</td>
                    <td>{fila.user.name}</td>
                    <td>{fila.user.email}</td>
                    <td>{new Date(fila.solicitado_en).toLocaleDateString('es-MX')}</td>
                    <td>
                      <div className="tabla-acciones">
                        <button
                          className="boton boton-sm"
                          disabled={enProceso}
                          onClick={() => handleAccion(fila.membresia_id, 'aprobada')}
                        >
                          {enProceso ? '…' : 'Aprobar'}
                        </button>
                        <button
                          className="boton boton-peligro boton-sm"
                          disabled={enProceso}
                          onClick={() => handleAccion(fila.membresia_id, 'rechazada')}
                        >
                          {enProceso ? '…' : 'Rechazar'}
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </section>
  )
}
