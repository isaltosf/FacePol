import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ErrorValidacion } from '../../api/client'
import type { ErroresValidacion } from '../../api/client'
import { CATEGORIAS, ETIQUETAS_CATEGORIA } from './types'
import type { Categoria, Comunidad, DatosComunidad } from './types'

/** Pinta los mensajes que el backend devolvió para un campo concreto. */
function ErroresDelCampo({ mensajes }: { mensajes: string[] | undefined }) {
  if (mensajes === undefined || mensajes.length === 0) return null

  return <p className="error-campo">{mensajes.join(' ')}</p>
}

interface Props {
  titulo: string
  textoBoton: string
  valoresIniciales: DatosComunidad
  /** Crear o actualizar; devuelve la comunidad guardada para poder redirigir. */
  onEnviar: (datos: DatosComunidad) => Promise<Comunidad>
}

/**
 * Formulario compartido por las pantallas de crear y editar.
 *
 * Si la API responde 422, el mensaje general se muestra arriba y el detalle de
 * cada campo justo debajo del input correspondiente.
 */
export default function FormularioComunidad({
  titulo,
  textoBoton,
  valoresIniciales,
  onEnviar,
}: Props) {
  const navegar = useNavigate()
  const [datos, setDatos] = useState<DatosComunidad>(valoresIniciales)
  const [errores, setErrores] = useState<ErroresValidacion>({})
  const [mensaje, setMensaje] = useState('')
  const [enviando, setEnviando] = useState(false)

  /** Actualiza un campo sin perder el resto del formulario. */
  function cambiar<C extends keyof DatosComunidad>(campo: C, valor: DatosComunidad[C]) {
    setDatos((anteriores) => ({ ...anteriores, [campo]: valor }))
  }

  async function enviar(evento: React.FormEvent<HTMLFormElement>) {
    evento.preventDefault()

    setEnviando(true)
    setMensaje('')
    setErrores({})

    try {
      const comunidad = await onEnviar(datos)
      navegar(`/comunidades/${comunidad.id}`)
    } catch (problema: unknown) {
      if (problema instanceof ErrorValidacion) {
        setMensaje(problema.message)
        setErrores(problema.errors)
      } else {
        setMensaje(
          problema instanceof Error
            ? problema.message
            : 'No se pudo guardar la comunidad.',
        )
      }

      setEnviando(false)
    }
  }

  return (
    <section>
      <h1>{titulo}</h1>

      {mensaje !== '' && <p className="alerta-error">{mensaje}</p>}

      <form className="formulario" onSubmit={enviar} noValidate>
        <div className="campo">
          <label htmlFor="nombre">Nombre</label>
          <input
            id="nombre"
            className={errores.nombre ? 'invalido' : undefined}
            value={datos.nombre}
            onChange={(evento) => cambiar('nombre', evento.target.value)}
          />
          <ErroresDelCampo mensajes={errores.nombre} />
        </div>

        <div className="campo">
          <label htmlFor="descripcion">Descripción</label>
          <textarea
            id="descripcion"
            className={errores.descripcion ? 'invalido' : undefined}
            value={datos.descripcion}
            onChange={(evento) => cambiar('descripcion', evento.target.value)}
          />
          <ErroresDelCampo mensajes={errores.descripcion} />
        </div>

        <div className="campo">
          <label htmlFor="categoria">Categoría</label>
          <select
            id="categoria"
            className={errores.categoria ? 'invalido' : undefined}
            value={datos.categoria}
            onChange={(evento) =>
              cambiar('categoria', evento.target.value as Categoria | '')
            }
          >
            <option value="">Selecciona una categoría</option>
            {CATEGORIAS.map((valor) => (
              <option key={valor} value={valor}>
                {ETIQUETAS_CATEGORIA[valor]}
              </option>
            ))}
          </select>
          <ErroresDelCampo mensajes={errores.categoria} />
        </div>

        <div className="campo">
          <label htmlFor="logo">Logo (URL)</label>
          <input
            id="logo"
            className={errores.logo ? 'invalido' : undefined}
            placeholder="https://ejemplo.com/logo.png"
            value={datos.logo}
            onChange={(evento) => cambiar('logo', evento.target.value)}
          />
          <ErroresDelCampo mensajes={errores.logo} />
        </div>

        <div className="campo">
          {/* Temporal: mientras no haya login, el administrador se indica a mano. */}
          <label htmlFor="administrador_id">ID del administrador</label>
          <input
            id="administrador_id"
            type="number"
            min="1"
            className={errores.administrador_id ? 'invalido' : undefined}
            value={datos.administrador_id}
            onChange={(evento) => cambiar('administrador_id', evento.target.value)}
          />
          <ErroresDelCampo mensajes={errores.administrador_id} />
        </div>

        <div className="acciones-formulario">
          <button className="boton" type="submit" disabled={enviando}>
            {enviando ? 'Guardando…' : textoBoton}
          </button>
          <button
            className="boton boton-secundario"
            type="button"
            disabled={enviando}
            onClick={() => navegar(-1)}
          >
            Cancelar
          </button>
        </div>
      </form>
    </section>
  )
}
