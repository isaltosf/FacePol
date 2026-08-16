import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { actualizarComunidad, obtenerComunidad } from './api'
import FormularioComunidad from './FormularioComunidad'
import type { DatosComunidad } from './types'

/** Pantalla de edición: carga la comunidad y precarga el formulario. */
export default function EditarComunidad() {
  const { id = '' } = useParams()
  const [valoresIniciales, setValoresIniciales] = useState<DatosComunidad | null>(null)
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let vigente = true

    setCargando(true)
    setError('')

    obtenerComunidad(id)
      .then((comunidad) => {
        if (!vigente) return
        setValoresIniciales({
          nombre: comunidad.nombre,
          descripcion: comunidad.descripcion,
          categoria: comunidad.categoria,
          logo: comunidad.logo ?? '',
          administrador_id: String(comunidad.administrador_id),
        })
      })
      .catch((problema: unknown) => {
        if (!vigente) return
        setError(
          problema instanceof Error
            ? problema.message
            : 'No se pudo cargar la comunidad.',
        )
      })
      .finally(() => {
        if (vigente) setCargando(false)
      })

    return () => {
      vigente = false
    }
  }, [id])

  if (cargando) return <p className="aviso">Cargando comunidad…</p>

  if (error !== '' || valoresIniciales === null) {
    return <p className="alerta-error">{error || 'No se pudo cargar la comunidad.'}</p>
  }

  return (
    <FormularioComunidad
      titulo="Editar comunidad"
      textoBoton="Guardar cambios"
      valoresIniciales={valoresIniciales}
      onEnviar={(datos) => actualizarComunidad(id, datos)}
    />
  )
}
