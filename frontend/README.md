# FacePol — Frontend

Interfaz en **React + TypeScript** (Vite) para la API de FacePol.

## Levantar el proyecto

```bash
cd frontend
npm install
cp .env.example .env        # en Windows: copy .env.example .env
npm run dev                 # http://localhost:5173
```

El backend de Laravel debe estar corriendo en `http://localhost:8000`
(`php artisan serve` desde la raíz del repo).

| Variable       | Descripción                | Valor por defecto              |
| -------------- | -------------------------- | ------------------------------ |
| `VITE_API_URL` | URL base de la API REST    | `http://localhost:8000/api`    |

## Estructura pensada para trabajar en paralelo

Igual que en el backend, cada módulo vive en su propia carpeta para que las tres
ramas no toquen los mismos archivos:

```
src/
  api/client.ts                 base común: fetch + manejo de errores 422
  components/Layout.tsx         base común: cabecera y navegación
  index.css                     base común: estilos
  App.tsx                       base común: concatena las rutas de los 3 módulos
  features/
    comunidades/                Alexander
    membresias/                 José
    publicaciones/              Victor
```

Archivos **cerrados**, no los edites desde la rama de tu feature: `src/App.tsx`,
`src/components/Layout.tsx` y `src/api/client.ts`.

- ¿Nueva pantalla? va en el `routes.tsx` de tu feature; `App.tsx` ya lo concatena.
- ¿Necesitas aparecer en el detalle de una comunidad? usa tu componente de
  acciones (`AccionesMembresia.tsx` / `AccionesPublicaciones.tsx`), que la página
  de detalle ya renderiza pasándote el `comunidadId`.

## Comandos

| Comando           | Qué hace                                  |
| ----------------- | ----------------------------------------- |
| `npm run dev`     | Servidor de desarrollo con recarga en vivo |
| `npm run build`   | Chequeo de tipos + build de producción     |
| `npm run preview` | Sirve el build de producción               |
| `npm run lint`    | Linter (oxlint)                            |
