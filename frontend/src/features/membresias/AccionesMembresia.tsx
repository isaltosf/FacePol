import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ErrorApi, ErrorValidacion } from '../../api/client'
import { solicitarMembresia } from './api'
import TokenSelector from './TokenSelector'

interface Props {
  comunidadId: string | number
}

export default function AccionesMembresia({ comunidadId }: Props) {
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

  return (
    <section className="acciones-membresia">
      <h2 style={{ marginTop: '1.5rem' }}>Membresía</h2>

      <TokenSelector />

      <div className="acciones-membresia-botones">
        <button
          className="boton"
          disabled={enviando}
          onClick={handleSolicitar}
        >
          {enviando ? 'Enviando…' : 'Solicitar unirme'}
        </button>

        <Link
          className="boton boton-secundario"
          to={`/comunidades/${comunidadId}/miembros`}
        >
          Ver miembros
        </Link>

        <Link
          className="boton boton-secundario"
          to={`/comunidades/${comunidadId}/solicitudes`}
        >
          Panel de solicitudes (admin)
        </Link>
      </div>

      {exito !== '' && (
        <p className="alerta-exito">{exito}</p>
      )}

      {errorGeneral !== '' && (
        <p className="alerta-error">{errorGeneral}</p>
      )}
    </section>
  )
}
