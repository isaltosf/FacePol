<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Publicacion extends Model
{
    /**
     * Tipos de publicación permitidos.
     *
     * @var list<string>
     */
    public const TIPOS = [
        'anuncio',
        'evento',
    ];

    protected $table = 'publicaciones';

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'comunidad_id',
        'autor_id',
        'titulo',
        'descripcion',
        'tipo',
        'fecha_evento',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'fecha_evento' => 'datetime',
    ];

    /**
     * Comunidad a la que pertenece la publicación.
     *
     * @return BelongsTo<Comunidad, $this>
     */
    public function comunidad(): BelongsTo
    {
        return $this->belongsTo(Comunidad::class);
    }

    /**
     * Administrador que publicó el anuncio o evento.
     *
     * @return BelongsTo<User, $this>
     */
    public function autor(): BelongsTo
    {
        return $this->belongsTo(User::class, 'autor_id');
    }
}
