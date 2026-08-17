import { useState } from 'react'
import type { FormEvent } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { ErrorValidacion } from '../../api/client'
import { crearPublicacion } from './api'
import { useSesion } from './sesion'
import { DATOS_VACIOS, ETIQUETAS_TIPO, TIPOS_PUBLICACION } from './types'
import type { ErroresValidacion } from '../../api/client'
import type { DatosPublicacion } from './types'

/** Pinta los mensajes que el backend devolvió para un campo concreto. */
function ErroresDelCampo({ mensajes }: { mensajes: string[] | undefined }) {
  if (mensajes === undefined || mensajes.length === 0) return null

  return <p className="error-campo">{mensajes.join(' ')}</p>
}

/**
 * Formulario de creación de un anuncio o evento dentro de una comunidad.
 *
 * El campo fecha_evento solo aparece cuando el tipo elegido es "evento" y
 * pinta el error 422 debajo cuando falta, tal como pide el reparto de tareas.
 * También captura el 403 (usuario que no es administrador de la comunidad).
 */
export default function FormularioPublicacion() {
  const { id = '' } = useParams()
  const navigate = useNavigate()
  const { haySesion } = useSesion()

  const [datos, setDatos] = useState<DatosPublicacion>(DATOS_VACIOS)
  const [errores, setErrores] = useState<ErroresValidacion>({})
  const [errorGeneral, setErrorGeneral] = useState('')
  const [enviando, setEnviando] = useState(false)

  if (!haySesion) {
    return (
      <div className="contenedor-centrado">
        <section>
          <p className="aviso-accion">
            <span>Necesitas iniciar sesión para esta acción.</span>
            <Link className="boton" to="/feed">
              Iniciar sesión
            </Link>
          </p>
        </section>
      </div>
    )
  }

  const comunidadId = Number(id)

  function manejarEnvio(evento: FormEvent) {
    evento.preventDefault()
    setErrores({})
    setErrorGeneral('')
    setEnviando(true)

    crearPublicacion(comunidadId, datos)
      .then(() => navigate(`/comunidades/${comunidadId}`))
      .catch((problema: unknown) => {
        if (problema instanceof ErrorValidacion) {
          setErrores(problema.errors)
          setErrorGeneral(problema.message)
          return
        }

        setErrorGeneral(
          problema instanceof Error
            ? problema.message
            : 'No se pudo publicar. Intenta de nuevo.',
        )
      })
      .finally(() => setEnviando(false))
  }

  return (
    <section>
      <div className="encabezado-pagina">
        <Link to={`/comunidades/${comunidadId}`} className="texto-suave">
          ← Volver a la comunidad
        </Link>
      </div>

      <h1>Publicar anuncio o evento</h1>

      <form className="formulario" onSubmit={manejarEnvio} noValidate>
        <div className="campo">
          <label htmlFor="tipo">Tipo</label>
          <select
            id="tipo"
            className={errores.tipo ? 'invalido' : undefined}
            value={datos.tipo}
            onChange={(e) =>
              setDatos({ ...datos, tipo: e.target.value as DatosPublicacion['tipo'] })
            }
          >
            <option value="">Selecciona un tipo</option>
            {TIPOS_PUBLICACION.map((tipo) => (
              <option key={tipo} value={tipo}>
                {ETIQUETAS_TIPO[tipo]}
              </option>
            ))}
          </select>
          <ErroresDelCampo mensajes={errores.tipo} />
        </div>

        <div className="campo">
          <label htmlFor="titulo">Título</label>
          <input
            id="titulo"
            className={errores.titulo ? 'invalido' : undefined}
            value={datos.titulo}
            onChange={(e) => setDatos({ ...datos, titulo: e.target.value })}
          />
          <ErroresDelCampo mensajes={errores.titulo} />
        </div>

        <div className="campo">
          <label htmlFor="descripcion">Descripción</label>
          <textarea
            id="descripcion"
            className={errores.descripcion ? 'invalido' : undefined}
            value={datos.descripcion}
            onChange={(e) => setDatos({ ...datos, descripcion: e.target.value })}
          />
          <ErroresDelCampo mensajes={errores.descripcion} />
        </div>

        {datos.tipo === 'evento' && (
          <div className="campo">
            <label htmlFor="fecha_evento">Fecha del evento</label>
            <input
              id="fecha_evento"
              type="datetime-local"
              className={errores.fecha_evento ? 'invalido' : undefined}
              value={datos.fecha_evento}
              onChange={(e) => setDatos({ ...datos, fecha_evento: e.target.value })}
            />
            <ErroresDelCampo mensajes={errores.fecha_evento} />
          </div>
        )}

        {errorGeneral !== '' && <p className="alerta-error">{errorGeneral}</p>}

        <div className="acciones-formulario">
          <button className="boton" type="submit" disabled={enviando}>
            {enviando ? 'Publicando…' : 'Publicar'}
          </button>
        </div>
      </form>
    </section>
  )
}
