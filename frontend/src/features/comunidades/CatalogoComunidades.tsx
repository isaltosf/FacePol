import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { listarComunidades } from './api'
import { CATEGORIAS, ETIQUETAS_CATEGORIA } from './types'
import type { Comunidad, MetaPaginacion } from './types'

/** Recorta la descripción para que todas las tarjetas midan parecido. */
function recortar(texto: string, largo = 120): string {
  return texto.length > largo ? `${texto.slice(0, largo).trimEnd()}…` : texto
}

/**
 * Catálogo de comunidades: búsqueda por texto, filtro por categoría y paginación.
 * Los tres viven en la query string, así que el enlace se puede compartir y los
 * botones de atrás/adelante del navegador funcionan.
 */
export default function CatalogoComunidades() {
  const [parametros, setParametros] = useSearchParams()
  const q = parametros.get('q') ?? ''
  const categoria = parametros.get('categoria') ?? ''
  const consulta = parametros.toString()

  // El input es no controlado por la URL mientras se escribe: solo se sincroniza
  // cuando la query string cambia por fuera (navegación, atrás/adelante).
  const [textoBusqueda, setTextoBusqueda] = useState(q)
  const [comunidades, setComunidades] = useState<Comunidad[]>([])
  const [meta, setMeta] = useState<MetaPaginacion | null>(null)
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    setTextoBusqueda(q)
  }, [q])

  useEffect(() => {
    // Evita que una respuesta lenta pise a otra más reciente.
    let vigente = true

    setCargando(true)
    setError('')

    listarComunidades(new URLSearchParams(consulta))
      .then((respuesta) => {
        if (!vigente) return
        setComunidades(respuesta.data)
        setMeta(respuesta.meta)
      })
      .catch((problema: unknown) => {
        if (!vigente) return
        setError(
          problema instanceof Error
            ? problema.message
            : 'No se pudo cargar el catálogo de comunidades.',
        )
        setComunidades([])
        setMeta(null)
      })
      .finally(() => {
        if (vigente) setCargando(false)
      })

    return () => {
      vigente = false
    }
  }, [consulta])

  /** Aplica búsqueda y categoría a la vez, volviendo siempre a la página 1. */
  function aplicarFiltros(nuevoTexto: string, nuevaCategoria: string) {
    const nuevos = new URLSearchParams()

    if (nuevoTexto.trim() !== '') nuevos.set('q', nuevoTexto.trim())
    if (nuevaCategoria !== '') nuevos.set('categoria', nuevaCategoria)

    setParametros(nuevos)
  }

  /** Cambia de página conservando los filtros activos. */
  function irAPagina(numero: number) {
    const nuevos = new URLSearchParams(parametros)
    nuevos.set('page', String(numero))
    setParametros(nuevos)
  }

  const paginaActual = meta?.current_page ?? 1
  const ultimaPagina = meta?.last_page ?? 1

  return (
    <section>
      <div className="encabezado-pagina">
        <h1>Comunidades</h1>
        <Link className="boton" to="/comunidades/nueva">
          Nueva comunidad
        </Link>
      </div>

      <form
        className="filtros"
        onSubmit={(evento) => {
          evento.preventDefault()
          aplicarFiltros(textoBusqueda, categoria)
        }}
      >
        <input
          type="search"
          placeholder="Buscar por nombre o descripción"
          aria-label="Buscar comunidades"
          value={textoBusqueda}
          onChange={(evento) => setTextoBusqueda(evento.target.value)}
        />

        <select
          aria-label="Filtrar por categoría"
          value={categoria}
          onChange={(evento) => aplicarFiltros(textoBusqueda, evento.target.value)}
        >
          <option value="">Todas las categorías</option>
          {CATEGORIAS.map((valor) => (
            <option key={valor} value={valor}>
              {ETIQUETAS_CATEGORIA[valor]}
            </option>
          ))}
        </select>

        <button className="boton" type="submit">
          Buscar
        </button>
      </form>

      {cargando && <p className="aviso">Cargando comunidades…</p>}

      {!cargando && error !== '' && <p className="alerta-error">{error}</p>}

      {!cargando && error === '' && comunidades.length === 0 && (
        <p className="aviso">No se encontraron comunidades con esos filtros.</p>
      )}

      {!cargando && error === '' && comunidades.length > 0 && (
        <>
          <div className="grid">
            {comunidades.map((comunidad) => (
              <article className="tarjeta" key={comunidad.id}>
                {comunidad.logo !== null && comunidad.logo !== '' ? (
                  <img className="tarjeta-logo" src={comunidad.logo} alt="" />
                ) : (
                  <div className="tarjeta-logo" />
                )}

                <div className="tarjeta-cuerpo">
                  <h3>
                    <Link to={`/comunidades/${comunidad.id}`}>{comunidad.nombre}</Link>
                  </h3>
                  <span className="etiqueta">
                    {ETIQUETAS_CATEGORIA[comunidad.categoria] ?? comunidad.categoria}
                  </span>
                  <p>{recortar(comunidad.descripcion)}</p>
                </div>
              </article>
            ))}
          </div>

          <div className="paginacion">
            <button
              className="boton boton-secundario"
              type="button"
              disabled={paginaActual <= 1}
              onClick={() => irAPagina(paginaActual - 1)}
            >
              Anterior
            </button>

            <span className="texto-suave">
              Página {paginaActual} de {ultimaPagina}
            </span>

            <button
              className="boton boton-secundario"
              type="button"
              disabled={paginaActual >= ultimaPagina}
              onClick={() => irAPagina(paginaActual + 1)}
            >
              Siguiente
            </button>
          </div>
        </>
      )}
    </section>
  )
}
