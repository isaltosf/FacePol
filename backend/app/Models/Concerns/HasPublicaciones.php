<?php

namespace App\Models\Concerns;

use App\Models\Publicacion;
use Illuminate\Database\Eloquent\Relations\HasMany;

/**
 * Relaciones del módulo Publicaciones para el modelo User.
 *
 * Agrega aquí las relaciones de la rama feat/publicaciones en lugar de editar
 * app/Models/User.php.
 */
trait HasPublicaciones
{
    /**
     * Publicaciones (anuncios/eventos) creadas por este usuario como administrador.
     *
     * @return HasMany<Publicacion, $this>
     */
    public function publicaciones(): HasMany
    {
        return $this->hasMany(Publicacion::class, 'autor_id');
    }
}
