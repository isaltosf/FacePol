# FacePol

API REST en **Laravel 12** para la plataforma de gestión de comunidades estudiantiles de la ESPOL.

Requisitos: PHP >= 8.2, Composer y MySQL.

## Levantar el proyecto

```bash
# 1. Dependencias
composer install

# 2. Variables de entorno
cp .env.example .env        # en Windows: copy .env.example .env
php artisan key:generate

# 3. Configurar MySQL en .env
#    DB_CONNECTION=mysql
#    DB_HOST=127.0.0.1
#    DB_PORT=3306
#    DB_DATABASE=facepol      <- crear esta base de datos antes de migrar
#    DB_USERNAME=root
#    DB_PASSWORD=

# 4. Migraciones + seeders
php artisan migrate --seed

# 5. Servidor de desarrollo (http://localhost:8000)
php artisan serve
```

La API queda bajo el prefijo `/api`.

## Estructura pensada para trabajar en paralelo

Cada módulo tiene sus propios archivos para que las tres ramas no toquen los mismos
ficheros y no haya conflictos de merge:

| Módulo        | Rutas                           | Trait en `User`                          | Seeder               |
| ------------- | ------------------------------- | ---------------------------------------- | -------------------- |
| Comunidades   | `routes/api/comunidades.php`    | `app/Models/Concerns/HasComunidades.php`  | `ComunidadSeeder`    |
| Membresías    | `routes/api/membresias.php`     | `app/Models/Concerns/HasMembresias.php`   | `MembresiaSeeder`    |
| Publicaciones | `routes/api/publicaciones.php`  | `app/Models/Concerns/HasPublicaciones.php`| `PublicacionSeeder`  |

Archivos **cerrados**, no los edites: `routes/api.php`, `app/Models/User.php`,
`database/seeders/DatabaseSeeder.php` y `bootstrap/app.php`.

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

Esqueleto compartido. Incluye:

- Laravel 12 con soporte de API (`php artisan install:api`) y Laravel Sanctum instalado.
- Campo `rol` en `users` (`estudiante` | `administrador`), por defecto `estudiante`.
- Tabla y modelo `Comunidad` (las tablas `membresias` y `publicaciones` dependen de ella
  por clave foránea).

Autenticación: el trait `HasApiTokens` ya está en `User`, pero **todavía no hay endpoints
de login ni rutas protegidas**; eso se activa en una fase posterior.
