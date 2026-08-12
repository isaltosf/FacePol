<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Comunidad extends Model
{
    /**
     * Categorías permitidas para una comunidad.
     *
     * @var list<string>
     */
    public const CATEGORIAS = [
        'academica',
        'cultural',
        'deportiva',
        'tecnologica',
    ];

    /**
     * La tabla asociada al modelo (el plural automático sería "comunidads").
     *
     * @var string
     */
    protected $table = 'comunidades';

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'nombre',
        'descripcion',
        'categoria',
        'logo',
        'administrador_id',
        'activa',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'activa' => 'boolean',
    ];

    /**
     * Valores por defecto del modelo; refleja el default de la migración para que
     * la respuesta de creación ya traiga "activa" y no un null.
     *
     * @var array<string, mixed>
     */
    protected $attributes = [
        'activa' => true,
    ];

    /**
     * Usuario que administra la comunidad.
     *
     * @return BelongsTo<User, $this>
     */
    public function administrador(): BelongsTo
    {
        return $this->belongsTo(User::class, 'administrador_id');
    }
}
