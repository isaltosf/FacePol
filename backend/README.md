# FacePol — Backend

API REST en **Laravel 12** para la plataforma de gestión de comunidades estudiantiles de la ESPOL.

Requisitos: PHP >= 8.2, Composer y MySQL.

## Levantar el proyecto

Los pasos de instalación están en el [README de la raíz del repositorio](../README.md);
todos los comandos de esta carpeta (`composer`, `php artisan`) se corren desde `backend/`.

La API queda bajo el prefijo `/api`.

## Estructura pensada para trabajar en paralelo

Cada módulo tiene sus propios archivos para que las tres ramas no toquen los mismos
ficheros y no haya conflictos de merge:

| Módulo        | Rutas                           | Trait en `User`                          | Seeder               |
| ------------- | ------------------------------- | ---------------------------------------- | -------------------- |
| Comunidades   | `routes/api/comunidades.php`    | `app/Models/Concerns/HasComunidades.php`  | `ComunidadSeeder`    |
| Membresías    | `routes/api/membresias.php`     | `app/Models/Concerns/HasMembresias.php`   | `MembresiaSeeder`    |
| Publicaciones | `routes/api/publicaciones.php`  | `app/Models/Concerns/HasPublicaciones.php`| `PublicacionSeeder`  |

Archivos **cerrados**, no los edites: `routes/api.php`, `routes/api/auth.php`,
`app/Models/User.php`, `database/seeders/DatabaseSeeder.php` y `bootstrap/app.php`.

- ¿Nueva ruta? va en tu archivo de `routes/api/`.
- ¿Nueva relación de `User`? va en tu trait de `app/Models/Concerns/`.
- ¿Datos de prueba? van en tu seeder.

## Convención de ramas

- `main`: rama estable. **Nadie hace push directo a `main`.**
- `feat/comunidades`
- `feat/membresias`
- `feat/publicaciones`

Cada quien trabaja en su rama y la integra a `main` mediante Pull Request con al menos
una revisión de otro integrante. Antes de abrir el PR, actualiza tu rama con `main`:

```bash
git checkout main
git pull origin main
git checkout feat/<tu-modulo>
git merge main
```

Mensajes de commit en formato `tipo(alcance): descripción`, por ejemplo
`feat(comunidades): endpoint de listado`.

## Estado actual

Entrega final. El backend incluye:

- Laravel 12 con soporte de API (`php artisan install:api`) y Laravel Sanctum instalado.
- Campo `rol` en `users` (`estudiante` | `administrador`), por defecto `estudiante`.
- Tabla y modelo `Comunidad`, más `membresias` y `publicaciones`, que dependen de ella
  por clave foránea.
- Los tres módulos con sus endpoints, seeders y validaciones en español.

**Autenticación resuelta.** En `routes/api/auth.php` viven dos rutas públicas:

- `POST /api/register` — crea una cuenta (siempre con rol `estudiante`) y devuelve un token.
- `POST /api/login` — devuelve un token de Sanctum a partir de `email` y `password`.

Ambas devuelven la misma estructura: `data.token` y `data.user`. Ese token se manda en la
cabecera `Authorization: Bearer <token>` y es lo que exigen las rutas protegidas.

**Rutas protegidas con `auth:sanctum`:** todas las de Membresías (`routes/api/membresias.php`)
y las de Publicaciones (`routes/api/publicaciones.php`). Las de Comunidades siguen siendo
públicas.

El detalle de cada endpoint, con su método, su nivel de acceso y su responsable, está en la
tabla del [README de la raíz](../README.md).
