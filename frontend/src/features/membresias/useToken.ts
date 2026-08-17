import { useCallback, useState } from 'react'

const LLAVE = 'facepol_token'

/** Hook para leer y persistir el Bearer token en localStorage. */
export function useToken() {
  const [token, setTokenState] = useState<string>(
    () => localStorage.getItem(LLAVE) ?? '',
  )

  const setToken = useCallback((valor: string) => {
    const limpio = valor.trim()
    if (limpio) {
      localStorage.setItem(LLAVE, limpio)
    } else {
      localStorage.removeItem(LLAVE)
    }
    setTokenState(limpio)
  }, [])

  return { token, setToken }
}
