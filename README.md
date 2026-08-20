# FacePol

Plataforma web de gestión de comunidades estudiantiles de la ESPOL. Permite consultar el
catálogo de comunidades, solicitar y administrar membresías, y publicar anuncios y eventos
que los miembros aprobados ven en un feed cronológico.

## Estructura del proyecto

```
FacePol/
├── backend/     API REST en Laravel 12 (PHP + MySQL). Modelos, controladores,
│                migraciones, seeders y las rutas bajo el prefijo /api.
└── frontend/    SPA en React + TypeScript con Vite. Consume la API del backend
                 y organiza las pantallas por módulo en src/features/.
```

Cada carpeta tiene su propio `README.md` con la convención de trabajo interna del equipo.

## Requisitos previos

| Herramienta | Versión                                  |
| ----------- | ---------------------------------------- |
| PHP         | 8.2 o superior (probado en 8.4)          |
| Composer    | 2.x                                      |
| MySQL       | 8.0 o superior                           |
| Node.js     | 20.19 o superior (recomendado 22 LTS)    |
| npm         | 10 o superior                            |

## Instalación y ejecución del backend

```bash
cd backend

# 1. Dependencias de PHP
composer install

# 2. Variables de entorno
cp .env.example .env          # Windows: copy .env.example .env
php artisan key:generate

# 3. Crear la base de datos ANTES de migrar y configurar el acceso en .env
#    (ver el detalle debajo de este bloque)

# 4. Tablas + datos de prueba
php artisan migrate --seed

# 5. Servidor de desarrollo
php artisan serve             # http://localhost:8000
```

**La base de datos hay que crearla a mano antes del paso 4.** Laravel crea las tablas, pero
no el esquema que las contiene, así que `php artisan migrate` falla si `facepol` no existe:

```sql
CREATE DATABASE facepol CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

Después, en `backend/.env`, ajusta las variables `DB_*` a tu instalación de MySQL:

| Variable        | Valor por defecto | Qué es                                      |
| --------------- | ----------------- | ------------------------------------------- |
| `DB_CONNECTION` | `mysql`           | Motor de base de datos                       |
| `DB_HOST`       | `127.0.0.1`       | Host del servidor MySQL                      |
| `DB_PORT`       | `3306`            | Puerto de MySQL                              |
| `DB_DATABASE`   | `facepol`         | Nombre de la base creada arriba              |
| `DB_USERNAME`   | `root`            | Usuario de MySQL                             |
| `DB_PASSWORD`   | *(vacío)*         | Contraseña de ese usuario                    |

La API queda servida bajo el prefijo `/api`, es decir `http://localhost:8000/api`.

## Instalación y ejecución del frontend

```bash
cd frontend
npm install
cp .env.example .env          # Windows: copy .env.example .env
npm run dev                   # http://localhost:5173
```

El frontend no trae datos propios: **el backend debe estar corriendo en
`http://localhost:8000`** (paso 5 de la sección anterior) o las pantallas quedarán vacías con
un error de conexión. La única variable de entorno es `VITE_API_URL`, que ya viene apuntando
a `http://localhost:8000/api` en `.env.example`; solo hay que cambiarla si mueves el backend
a otro puerto.

## Usuarios de prueba

Todos los usuarios que crean los seeders tienen la misma contraseña: **`password`**.

| Correo                     | Rol           | Para qué sirve                                     |
| -------------------------- | ------------- | -------------------------------------------------- |
| azambrano@espol.edu.ec     | administrador | Administra el Club de Robótica ESPOL                |
| mflitardo@espol.edu.ec     | administrador | Administra el Capítulo Estudiantil IEEE ESPOL       |
| cmendoza@espol.edu.ec      | estudiante    | Solicitar membresías, ver el feed                   |
| avillafuerte@espol.edu.ec  | estudiante    | Segundo estudiante para probar solicitudes          |

También puedes crear una cuenta nueva desde `/registro` en el frontend o con
`POST /api/register`; toda cuenta creada así queda con el rol `estudiante`.

## Cómo probar la API

Las rutas de **comunidades** son públicas: se pueden llamar directamente desde el navegador o
con `curl`, sin ninguna cabecera especial.

Las rutas de **membresías** y **publicaciones** están protegidas con Laravel Sanctum y exigen
un token. El token se obtiene con `POST /api/login`, enviando `email` y `password`:

```bash
curl -X POST http://localhost:8000/api/login \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -d '{"email":"azambrano@espol.edu.ec","password":"password"}'
```

La respuesta trae el token dentro de `data`:

```json
{
  "data": {
    "token": "1|xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
    "user": { "id": 2, "nombre": "Andrés Zambrano", "email": "azambrano@espol.edu.ec", "rol": "administrador" }
  }
}
```

Ese valor se envía en la cabecera `Authorization` de las rutas protegidas:

```bash
curl http://localhost:8000/api/feed \
  -H "Accept: application/json" \
  -H "Authorization: Bearer 1|xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
```

`POST /api/register` devuelve un token con el mismo formato, así que una cuenta recién creada
queda autenticada de inmediato.

En `backend/postman/` hay una colección de Postman con las peticiones del módulo de
comunidades ya armadas, por si prefieres probarlas desde ahí.

## Endpoints

| Método      | Ruta                                    | Auth   | Descripción                                                        | Responsable   |
| ----------- | --------------------------------------- | ------ | ------------------------------------------------------------------ | ------------- |
| `POST`      | `/api/register`                         | Pública | Crea una cuenta de estudiante y devuelve token                      | Equipo        |
| `POST`      | `/api/login`                            | Pública | Devuelve un token de Sanctum                                        | Equipo        |
| `GET`       | `/api/comunidades`                      | Pública | Catálogo; admite los filtros `?q=` y `?categoria=`, combinables     | Andrés Saltos |
| `POST`      | `/api/comunidades`                      | Pública | Crear una comunidad                                                 | Andrés Saltos |
| `GET`       | `/api/comunidades/{id}`                 | Pública | Detalle de una comunidad                                            | Andrés Saltos |
| `PUT/PATCH` | `/api/comunidades/{id}`                 | Pública | Editar una comunidad                                                | Andrés Saltos |
| `POST`      | `/api/comunidades/{id}/membresias`      | Bearer  | Enviar una solicitud de membresía                                   | José Adrián   |
| `PATCH`     | `/api/membresias/{id}`                  | Bearer  | Aprobar o rechazar una solicitud                                    | José Adrián   |
| `GET`       | `/api/comunidades/{id}/miembros`        | Bearer  | Miembros aprobados de la comunidad                                  | José Adrián   |
| `GET`       | `/api/comunidades/{id}/solicitudes`     | Bearer  | Solicitudes pendientes de la comunidad                              | José Adrián   |
| `POST`      | `/api/comunidades/{id}/publicaciones`   | Bearer  | Crear un anuncio o un evento                                        | Victor Morales |
| `GET`       | `/api/feed`                             | Bearer  | Feed cronológico de las comunidades del usuario                     | Victor Morales |

El filtro `categoria` acepta cuatro valores: `academica`, `cultural`, `deportiva` y
`tecnologica`. Se puede combinar con la búsqueda por texto, por ejemplo
`/api/comunidades?q=robot&categoria=tecnologica`.

## Pantallas del frontend

| Ruta                                    | Pantalla                                        | Responsable    |
| --------------------------------------- | ----------------------------------------------- | -------------- |
| `/comunidades`                          | Catálogo de comunidades con búsqueda y filtros   | Andrés Saltos  |
| `/comunidades/nueva`                    | Formulario de creación de una comunidad          | Andrés Saltos  |
| `/comunidades/:id`                      | Detalle de una comunidad                         | Andrés Saltos  |
| `/comunidades/:id/editar`               | Formulario de edición de una comunidad           | Andrés Saltos  |
| `/comunidades/:id/miembros`             | Lista de miembros aprobados                      | José Adrián    |
| `/comunidades/:id/solicitudes`          | Panel de solicitudes pendientes (administrador)  | José Adrián    |
| `/feed`                                 | Feed de anuncios y eventos                       | Victor Morales |
| `/comunidades/:id/publicaciones/nueva`  | Formulario de anuncio o evento                   | Victor Morales |
| `/registro`                             | Registro de una cuenta nueva                     | Equipo         |
| *(dentro de `/feed`)*                   | Inicio de sesión, cuando no hay sesión activa    | Equipo         |

La pantalla de inicio de sesión no tiene ruta propia: se muestra dentro del feed (y de las
pantallas protegidas) mientras no haya una sesión activa, y enlaza a `/registro`.

## Dependencias principales

### Backend

| Paquete             | Versión   | Para qué                                        |
| ------------------- | --------- | ----------------------------------------------- |
| `laravel/framework` | `^12.0`   | Framework de la API                              |
| `laravel/sanctum`   | `^4.0`    | Tokens de autenticación de la API                |
| `laravel/tinker`    | `^2.10.1` | Consola interactiva para inspeccionar la app     |

### Frontend

| Paquete               | Versión    | Para qué                              |
| --------------------- | ---------- | ------------------------------------- |
| `react`               | `^19.2.8`  | Librería de interfaz                   |
| `react-dom`           | `^19.2.8`  | Renderizado de React en el navegador   |
| `react-router-dom`    | `^7.18.2`  | Enrutado de las pantallas              |
| `vite`                | `^8.2.0`   | Servidor de desarrollo y empaquetado   |
| `typescript`          | `~6.0.2`   | Tipado estático                        |
| `@vitejs/plugin-react`| `^6.0.4`   | Soporte de React dentro de Vite        |
| `oxlint`              | `^1.75.0`  | Linter                                 |

## Equipo

| Integrante                        | Módulo        |
| --------------------------------- | ------------- |
| Andrés Alexander Saltos Preciado  | Comunidades   |
| José Andrés Adrián Fierro         | Membresías    |
| Victor Manuel Morales Vásquez     | Publicaciones |
