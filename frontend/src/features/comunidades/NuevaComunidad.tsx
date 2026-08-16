import { crearComunidad } from './api'
import FormularioComunidad from './FormularioComunidad'
import { DATOS_VACIOS } from './types'

/** Pantalla de creación de una comunidad. */
export default function NuevaComunidad() {
  return (
    <FormularioComunidad
      titulo="Nueva comunidad"
      textoBoton="Crear comunidad"
      valoresIniciales={DATOS_VACIOS}
      onEnviar={crearComunidad}
    />
  )
}
