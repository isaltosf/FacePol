import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useSesion } from '../publicaciones/sesion'
import { obtenerMiembros } from './api'
import type { FilaMiembro } from './types'

export default function ListaMiembros() {
  const { id = '' } = useParams()
  const { haySesion } = useSesion()
  const [miembros, setMiembros] = useState<FilaMiembro[]>([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let vigente = true
    setCargando(true)
    setError('')

    obtenerMiembros(id)
      .then((data) => { if (vigente) setMiembros(data) })
      .catch((err: unknown) => {
        if (!vigente) return
        setError(err instanceof Error ? err.message : 'No se pudieron cargar los miembros.')
      })
      .finally(() => { if (vigente) setCargando(false) })

    return () => { vigente = false }
  }, [id])

  if (!haySesion) {
    return (
      <section>
        <Link to={`/comunidades/${id}`} className="texto-suave">← Volver al detalle</Link>
        <p className="aviso">Debes <Link to="/feed">iniciar sesión</Link> para ver los miembros.</p>
      </section>
    )
  }

  return (
    <section>
      <div className="encabezado-pagina">
        <Link to={`/comunidades/${id}`} className="texto-suave">
          ← Volver al detalle
        </Link>
        <h1 style={{ margin: 0 }}>Miembros aprobados</h1>
      </div>

      {cargando && <p className="aviso">Cargando miembros…</p>}

      {!cargando && error !== '' && (
        <p className="alerta-error">{error}</p>
      )}

      {!cargando && error === '' && miembros.length === 0 && (
        <p className="aviso">Esta comunidad aún no tiene miembros aprobados.</p>
      )}

      {!cargando && error === '' && miembros.length > 0 && (
        <div className="tabla-wrapper">
          <table className="tabla-miembros">
            <thead>
              <tr>
                <th>#</th>
                <th>Nombre</th>
                <th>Correo</th>
                <th>Rol</th>
                <th>Miembro desde</th>
              </tr>
            </thead>
            <tbody>
              {miembros.map((fila, i) => (
                <tr key={fila.membresia_id}>
                  <td>{i + 1}</td>
                  <td>{fila.user.name}</td>
                  <td>{fila.user.email}</td>
                  <td>
                    <span className="etiqueta">{fila.user.rol}</span>
                  </td>
                  <td>{new Date(fila.miembro_desde).toLocaleDateString('es-MX')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  )
}
