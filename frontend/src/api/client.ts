/**
 * Cliente HTTP compartido por los tres módulos del frontend.
 *
 * Archivo de la base común: no lo edites desde la rama de una feature.
 */

/** URL base de la API; se configura en el archivo .env (ver .env.example). */
const URL_API = import.meta.env.VITE_API_URL ?? 'http://localhost:8000/api'

/** Errores de validación de Laravel: por cada campo, una lista de mensajes. */
export type ErroresValidacion = Record<string, string[]>

/** Error genérico de la API (404, 401, 500, ...). Lleva el código de estado. */
export class ErrorApi extends Error {
  estado: number

  constructor(mensaje: string, estado: number) {
    super(mensaje)
    this.name = 'ErrorApi'
    this.estado = estado
  }
}

/**
 * Error 422 de validación. Además del mensaje general trae el detalle por campo,
 * para poder pintarlo debajo de cada input del formulario.
 */
export class ErrorValidacion extends ErrorApi {
  errors: ErroresValidacion

  constructor(mensaje: string, errors: ErroresValidacion) {
    super(mensaje, 422)
    this.name = 'ErrorValidacion'
    this.errors = errors
  }
}

/** Forma de los cuerpos de error que devuelve Laravel. */
interface CuerpoError {
  message?: string
  errors?: ErroresValidacion
}

/**
 * Hace una petición a la API y devuelve el JSON ya parseado.
 *
 * - Antepone la URL base y envía las cabeceras JSON.
 * - Lanza `ErrorValidacion` si el backend responde 422.
 * - Lanza `ErrorApi` para cualquier otro error.
 *
 * @param path Ruta relativa a la API, por ejemplo `/comunidades?page=2`.
 */
export async function api<T>(path: string, options: RequestInit = {}): Promise<T> {
  const respuesta = await fetch(`${URL_API}${path}`, {
    ...options,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      ...options.headers,
    },
  })

  // Se lee como texto porque una respuesta 204 (o un error del servidor en HTML)
  // no siempre trae un JSON válido.
  const texto = await respuesta.text()
  let cuerpo: unknown = null

  if (texto) {
    try {
      cuerpo = JSON.parse(texto)
    } catch {
      cuerpo = null
    }
  }

  if (respuesta.ok) {
    return cuerpo as T
  }

  const error = (cuerpo ?? {}) as CuerpoError

  if (respuesta.status === 422) {
    throw new ErrorValidacion(
      error.message ?? 'Revisa los datos ingresados.',
      error.errors ?? {},
    )
  }

  throw new ErrorApi(
    error.message ?? `Error ${respuesta.status} al comunicarse con el servidor.`,
    respuesta.status,
  )
}
