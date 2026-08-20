import { useEffect, useState } from 'react'
import { obtenerFeed } from './api'
import IniciarSesion from './IniciarSesion'
import { useSesion } from './sesion'
import { ETIQUETAS_TIPO } from './types'
import type { Publicacion } from './types'

function formatearFecha(iso: string): string {
  return new Date(iso).toLocaleString('es-EC', {
    dateStyle: 'medium',
    timeStyle: 'short',
  })
}

/** Feed cronológico de anuncios y eventos de las comunidades del usuario. */
export default function Feed() {
  const { haySesion } = useSesion()
  const [publicaciones, setPublicaciones] = useState<Publicacion[]>([])
  const [pagina, setPagina] = useState(1)
  const [ultimaPagina, setUltimaPagina] = useState(1)
  const [cargando, setCargando] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!haySesion) return

    let vigente = true
    setCargando(true)
    setError('')

    obtenerFeed(pagina)
      .then((respuesta) => {
        if (!vigente) return
        setPublicaciones(respuesta.data)
        setUltimaPagina(respuesta.meta?.last_page ?? 1)
      })
      .catch((problema: unknown) => {
        if (!vigente) return
        setError(
          problema instanceof Error ? problema.message : 'No se pudo cargar el feed.',
        )
        setPublicaciones([])
      })
      .finally(() => {
        if (vigente) setCargando(false)
      })

    return () => {
      vigente = false
    }
  }, [haySesion, pagina])

  return (
    <section>
      <div className="encabezado-pagina">
        <h1>Feed</h1>
      </div>

      {!haySesion && (
        <IniciarSesion mensaje="Inicia sesión para ver el feed de tus comunidades." />
      )}

      {haySesion && (
        <>
          {cargando && <p className="aviso">Cargando publicaciones…</p>}
          {error !== '' && <p className="alerta-error">{error}</p>}

          {!cargando && error === '' && publicaciones.length === 0 && (
            <p className="aviso">
              Todavía no hay publicaciones de tus comunidades. Únete a una comunidad
              aprobada para verlas aquí.
            </p>
          )}

          <ul className="lista-publicaciones">
            {publicaciones.map((publicacion) => (
              <li key={publicacion.id} className="tarjeta">
                {publicacion.imagen_url !== null && (
                  <img
                    className="imagen-publicacion"
                    src={publicacion.imagen_url}
                    alt={publicacion.titulo}
                  />
                )}

                <div className="tarjeta-cuerpo">
                  <div className="encabezado-pagina">
                    <span className="etiqueta">{ETIQUETAS_TIPO[publicacion.tipo]}</span>
                    <span className="texto-suave">
                      {formatearFecha(publicacion.created_at)}
                    </span>
                  </div>

                  <h2>{publicacion.titulo}</h2>
                  <p>{publicacion.descripcion}</p>

                  <dl>
                    <dt>Comunidad</dt>
                    <dd>{publicacion.comunidad?.nombre ?? `#${publicacion.comunidad_id}`}</dd>

                    {publicacion.tipo === 'evento' && publicacion.fecha_evento !== null && (
                      <>
                        <dt>Fecha del evento</dt>
                        <dd>{formatearFecha(publicacion.fecha_evento)}</dd>
                      </>
                    )}
                  </dl>
                </div>
              </li>
            ))}
          </ul>

          {ultimaPagina > 1 && (
            <div className="paginacion">
              <button
                className="boton"
                disabled={pagina <= 1}
                onClick={() => setPagina((p) => p - 1)}
              >
                Anterior
              </button>
              <span>
                Página {pagina} de {ultimaPagina}
              </span>
              <button
                className="boton"
                disabled={pagina >= ultimaPagina}
                onClick={() => setPagina((p) => p + 1)}
              >
                Siguiente
              </button>
            </div>
          )}
        </>
      )}
    </section>
  )
}
