const KEY = 'facepol.darkMode'
const ESCUCHAS = new Set<() => void>()

function prefersDark(): boolean {
  return window.matchMedia('(prefers-color-scheme: dark)').matches
}

function leerAlmacenado(): boolean {
  const v = localStorage.getItem(KEY)
  return v !== null ? v === 'true' : prefersDark()
}

function aplicar(dark: boolean) {
  document.documentElement.setAttribute('data-theme', dark ? 'dark' : 'light')
}

/** Inicializa el tema antes del primer render — llamar en main.tsx. */
export function initDarkMode(): boolean {
  const dark = leerAlmacenado()
  aplicar(dark)
  return dark
}

export function getDarkMode(): boolean {
  return document.documentElement.getAttribute('data-theme') === 'dark'
}

export function setDarkMode(dark: boolean) {
  localStorage.setItem(KEY, String(dark))
  aplicar(dark)
  for (const fn of ESCUCHAS) fn()
}

export function suscribirDarkMode(fn: () => void) {
  ESCUCHAS.add(fn)
  return () => ESCUCHAS.delete(fn)
}
