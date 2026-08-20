import { useState } from 'react'
import type { FormEvent } from 'react'
import { iniciarSesion } from './api'
import { guardarSesion } from './sesion'

interface Props {
  /** Texto de contexto sobre por qué se pide iniciar sesión aquí. */
  mensaje?: string
}

/**
 * Formulario mínimo de login, centrado en la página.
 *
 * Mientras el equipo no tenga una pantalla de autenticación compartida (ver el
 * bloqueador de autenticación del punto 2), este módulo pide credenciales aquí
 * mismo para poder obtener el token de Sanctum que exigen sus endpoints.
 * El seeder crea usuarios con contraseña "password" (por ejemplo, el email del
 * administrador de cualquier comunidad del catálogo).
 */
const DOMINIO_VALIDO = '@espol.edu.ec'

function validarEmail(valor: string): string {
  if (valor.trim() === '') return 'El correo es obligatorio.'
  if (!valor.endsWith(DOMINIO_VALIDO)) return `El correo debe tener el formato usuario${DOMINIO_VALIDO}`
  return ''
}

export default function IniciarSesion({ mensaje = 'Necesitas iniciar sesión para esta acción.' }: Props) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errorEmail, setErrorEmail] = useState('')
  const [error, setError] = useState('')
  const [enviando, setEnviando] = useState(false)

  function manejarEnvio(evento: FormEvent) {
    evento.preventDefault()
    setError('')

    const errEmail = validarEmail(email)
    setErrorEmail(errEmail)
    if (errEmail !== '') return

    setEnviando(true)

    iniciarSesion(email, password)
      .then(({ token, user }) => guardarSesion(token, user))
      .catch((problema: unknown) => {
        setError(
          problema instanceof Error ? problema.message : 'No se pudo iniciar sesión.',
        )
      })
      .finally(() => setEnviando(false))
  }

  return (
    <div className="contenedor-centrado">
      <section>
        <h1>Inicia sesión</h1>
        <p className="texto-suave">{mensaje}</p>

        <form className="formulario" onSubmit={manejarEnvio} noValidate>
          <div className="campo">
            <label htmlFor="email">Correo</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value)
                if (errorEmail !== '') setErrorEmail(validarEmail(e.target.value))
              }}
              onBlur={() => setErrorEmail(validarEmail(email))}
              className={errorEmail !== '' ? 'invalido' : ''}
              placeholder={`usuario${DOMINIO_VALIDO}`}
              required
            />
            {errorEmail !== '' && <p className="error-campo">{errorEmail}</p>}
          </div>

          <div className="campo">
            <label htmlFor="password">Contraseña</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {error !== '' && <p className="alerta-error">{error}</p>}

          <button className="boton" type="submit" disabled={enviando}>
            {enviando ? 'Ingresando…' : 'Ingresar'}
          </button>
        </form>
      </section>
    </div>
  )
}
