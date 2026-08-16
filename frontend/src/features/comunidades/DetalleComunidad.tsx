import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import AccionesMembresia from '../membresias/AccionesMembresia'
import AccionesPublicaciones from '../publicaciones/AccionesPublicaciones'
import { obtenerComunidad } from './api'
import { ETIQUETAS_CATEGORIA } from './types'
import type { Comunidad } from './types'

/**
 * Detalle de una comunidad.
 *
 * Los miembros y las publicaciones NO se muestran aquí: cada módulo inyecta lo
 * suyo a través de <AccionesMembresia> y <AccionesPublicaciones>.
 */
export default function DetalleComunidad() {
  const { id = '' } = useParams()
  const [comunidad, setComunidad] = useState<Comunidad | null>(null)
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let vigente = true

    setCargando(true)
    setError('')

    obtenerComunidad(id)
      .then((datos) => {
        if (vigente) setComunidad(datos)
      })
      .catch((problema: unknown) => {
        if (!vigente) return
        setError(
          problema instanceof Error
            ? problema.message
            : 'No se pudo cargar la comunidad.',
        )
        setComunidad(null)
      })
      .finally(() => {
        if (vigente) setCargando(false)
      })

    return () => {
      vigente = false
    }
  }, [id])

  if (cargando) return <p className="aviso">Cargando comunidad…</p>

  if (error !== '' || comunidad === null) {
    return (
      <section>
        <p className="alerta-error">{error || 'No se pudo cargar la comunidad.'}</p>
        <Link to="/comunidades">Volver al catálogo</Link>
      </section>
    )
  }

  return (
    <section>
      <div className="encabezado-pagina">
        <Link to="/comunidades" className="texto-suave">
          ← Volver al catálogo
        </Link>
        <Link className="boton" to={`/comunidades/${comunidad.id}/editar`}>
          Editar
        </Link>
      </div>

      <article className="detalle">
        <div className="detalle-cabecera">
          {comunidad.logo !== null && comunidad.logo !== '' ? (
            <img className="detalle-logo" src={comunidad.logo} alt="" />
          ) : (
            <div className="detalle-logo" />
          )}

          <div>
            <h1>{comunidad.nombre}</h1>
            <span className="etiqueta">
              {ETIQUETAS_CATEGORIA[comunidad.categoria] ?? comunidad.categoria}
            </span>
          </div>
        </div>

        <p>{comunidad.descripcion}</p>

        <dl>
          <dt>Administrador</dt>
          <dd>
            {comunidad.administrador
              ? `${comunidad.administrador.nombre} (${comunidad.administrador.email})`
              : `Usuario #${comunidad.administrador_id}`}
          </dd>
        </dl>
      </article>

      {/* Puntos de extensión de los otros dos módulos. */}
      <AccionesMembresia comunidadId={comunidad.id} />
      <AccionesPublicaciones comunidadId={comunidad.id} />
    </section>
  )
}
