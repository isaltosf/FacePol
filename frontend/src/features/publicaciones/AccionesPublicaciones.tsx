import { Link } from 'react-router-dom'
import { useSesion } from './sesion'

interface Props {
  comunidadId: number
}

/**
 * Punto de extensión del módulo Publicaciones dentro del detalle de una comunidad.
 *
 * Se renderiza junto al botón "Editar" de la comunidad. Si el administrador
 * termina intentando publicar sin serlo, el backend responde 403 y
 * FormularioPublicacion lo muestra ahí mismo.
 */
export default function AccionesPublicaciones({ comunidadId }: Props) {
  const { haySesion } = useSesion()

  if (!haySesion) {
    return (
      <Link className="boton boton-secundario" to="/feed">
        Iniciar sesión para publicar
      </Link>
    )
  }

  return (
    <Link className="boton" to={`/comunidades/${comunidadId}/publicaciones/nueva`}>
      Publicar anuncio o evento
    </Link>
  )
}
