import { useState } from 'react'
import type { FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ErrorValidacion } from '../../api/client'
import { registrarse } from './api'
import { guardarSesion } from './sesion'
import { REGISTRO_VACIO } from './types'
import type { ErroresValidacion } from '../../api/client'
import type { DatosRegistro } from './types'

/** Pinta los mensajes que el backend devolvió para un campo concreto. */
function ErroresDelCampo({ mensajes }: { mensajes: string[] | undefined }) {
  if (mensajes === undefined || mensajes.length === 0) return null

  return <p className="error-campo">{mensajes.join(' ')}</p>
}

/**
 * Pantalla de registro de una cuenta nueva.
 *
 * Es el complemento de `IniciarSesion`: pega contra POST /api/register, que
 * devuelve el mismo par token/usuario que el login, así que al terminar se
 * guarda la sesión con el mismo mecanismo y se entra directo al feed.
 * Todo el que se registra queda como estudiante; el rol no se elige aquí.
 */
export default function Registrarse() {
  const navegar = useNavigate()
  const [datos, setDatos] = useState<DatosRegistro>(REGISTRO_VACIO)
  const [errores, setErrores] = useState<ErroresValidacion>({})
  const [mensaje, setMensaje] = useState('')
  const [enviando, setEnviando] = useState(false)

  /** Actualiza un campo sin perder el resto del formulario. */
  function cambiar<C extends keyof DatosRegistro>(campo: C, valor: DatosRegistro[C]) {
    setDatos((anteriores) => ({ ...anteriores, [campo]: valor }))
  }

  async function enviar(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault()

    setEnviando(true)
    setMensaje('')
    setErrores({})

    try {
      const { token, user } = await registrarse(datos)
      guardarSesion(token, user)
      navegar('/feed')
    } catch (problema: unknown) {
      if (problema instanceof ErrorValidacion) {
        setMensaje(problema.message)
        setErrores(problema.errors)
      } else {
        setMensaje(
          problema instanceof Error ? problema.message : 'No se pudo crear la cuenta.',
        )
      }

      setEnviando(false)
    }
  }

  return (
    <div className="contenedor-centrado">
      <section>
        <h1>Crea tu cuenta</h1>
        <p className="texto-suave">
          Regístrate para unirte a comunidades y seguir sus anuncios y eventos.
        </p>

        {mensaje !== '' && <p className="alerta-error">{mensaje}</p>}

        <form className="formulario" onSubmit={enviar} noValidate>
          <div className="campo">
            <label htmlFor="name">Nombre</label>
            <input
              id="name"
              className={errores.name ? 'invalido' : undefined}
              value={datos.name}
              onChange={(evento) => cambiar('name', evento.target.value)}
            />
            <ErroresDelCampo mensajes={errores.name} />
          </div>

          <div className="campo">
            <label htmlFor="email">Correo</label>
            <input
              id="email"
              type="email"
              className={errores.email ? 'invalido' : undefined}
              value={datos.email}
              onChange={(evento) => cambiar('email', evento.target.value)}
            />
            <ErroresDelCampo mensajes={errores.email} />
          </div>

          <div className="campo">
            <label htmlFor="password">Contraseña</label>
            <input
              id="password"
              type="password"
              className={errores.password ? 'invalido' : undefined}
              value={datos.password}
              onChange={(evento) => cambiar('password', evento.target.value)}
            />
            <ErroresDelCampo mensajes={errores.password} />
          </div>

          <div className="campo">
            <label htmlFor="password_confirmation">Confirma la contraseña</label>
            <input
              id="password_confirmation"
              type="password"
              className={errores.password ? 'invalido' : undefined}
              value={datos.password_confirmation}
              onChange={(evento) => cambiar('password_confirmation', evento.target.value)}
            />
          </div>

          <button className="boton" type="submit" disabled={enviando}>
            {enviando ? 'Creando cuenta…' : 'Crear cuenta'}
          </button>
        </form>

        <p className="texto-suave">
          ¿Ya tienes cuenta? <Link to="/feed">Inicia sesión</Link>
        </p>
      </section>
    </div>
  )
}
