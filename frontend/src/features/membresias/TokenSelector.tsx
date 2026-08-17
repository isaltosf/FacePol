import { useState } from 'react'
import { useToken } from './useToken'

/**
 * Panel flotante que permite pegar el Bearer token de Sanctum mientras no
 * existe un flujo de login completo. Visible solo cuando no hay token guardado.
 */
export default function TokenSelector() {
  const { token, setToken } = useToken()
  const [abierto, setAbierto] = useState(!token)
  const [borrador, setBorrador] = useState(token)

  if (!abierto && token) {
    return (
      <div className="token-barra">
        <span className="texto-suave" style={{ fontSize: '0.8rem' }}>
          Token activo: <code>{token.slice(0, 20)}…</code>
        </span>
        <button
          className="boton boton-secundario"
          style={{ fontSize: '0.8rem', padding: '0.2rem 0.6rem' }}
          onClick={() => {
            setToken('')
            setBorrador('')
            setAbierto(true)
          }}
        >
          Cambiar token
        </button>
      </div>
    )
  }

  return (
    <div className="token-panel">
      <p style={{ margin: '0 0 0.5rem', fontWeight: 600 }}>
        Autenticación — Bearer Token (Sanctum)
      </p>
      <p className="texto-suave" style={{ margin: '0 0 0.75rem', fontSize: '0.875rem' }}>
        Pega aquí el token que te devuelve{' '}
        <code>POST /api/login</code>. Se guarda en localStorage.
      </p>
      <div style={{ display: 'flex', gap: '0.5rem' }}>
        <input
          type="text"
          placeholder="Bearer token…"
          value={borrador}
          onChange={(e) => setBorrador(e.target.value)}
          style={{
            flex: 1,
            border: '1px solid var(--color-borde)',
            borderRadius: 'var(--radio)',
            fontSize: '0.9rem',
            padding: '0.45rem 0.6rem',
          }}
        />
        <button
          className="boton"
          disabled={!borrador.trim()}
          onClick={() => {
            setToken(borrador)
            setAbierto(false)
          }}
        >
          Guardar
        </button>
      </div>
    </div>
  )
}
