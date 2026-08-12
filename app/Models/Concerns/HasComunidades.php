<?php

namespace App\Models\Concerns;

use App\Models\Comunidad;
use Illuminate\Database\Eloquent\Relations\HasMany;

/**
 * Relaciones del módulo Comunidades para el modelo User.
 *
 * Agrega aquí las relaciones de la rama feat/comunidades en lugar de editar
 * app/Models/User.php.
 */
trait HasComunidades
{
    /**
     * Comunidades de las que este usuario es administrador.
     *
     * @return HasMany<Comunidad, $this>
     */
    public function comunidadesAdministradas(): HasMany
    {
        return $this->hasMany(Comunidad::class, 'administrador_id');
    }
}
