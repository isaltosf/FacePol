<?php

namespace App\Models\Concerns;

use App\Models\Comunidad;
use App\Models\Membresia;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

/**
 * Relaciones del módulo Membresías para el modelo User.
 *
 * Agrega aquí las relaciones de la rama feat/membresias en lugar de editar
 * app/Models/User.php.
 */
trait HasMembresias
{
    public function membresias(): HasMany
    {
        return $this->hasMany(Membresia::class);
    }

    public function comunidadesPertenecientes(): BelongsToMany
    {
        return $this->belongsToMany(Comunidad::class, 'membresias', 'user_id', 'comunidad_id')
            ->wherePivot('estado', 'aprobada')
            ->withPivot('estado')
            ->withTimestamps();
    }
}
