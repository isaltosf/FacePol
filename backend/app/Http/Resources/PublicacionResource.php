<?php

namespace App\Http\Resources;

use App\Models\Publicacion;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Storage;

/**
 * @mixin Publicacion
 */
class PublicacionResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'titulo' => $this->titulo,
            'descripcion' => $this->descripcion,
            'tipo' => $this->tipo,
            'fecha_evento' => $this->fecha_evento?->toIso8601String(),
            'imagen_url' => $this->imagen_path ? Storage::disk('public')->url($this->imagen_path) : null,
            'comunidad_id' => $this->comunidad_id,
            'comunidad' => $this->whenLoaded('comunidad', fn () => [
                'id' => $this->comunidad->id,
                'nombre' => $this->comunidad->nombre,
            ]),
            'autor_id' => $this->autor_id,
            'autor' => $this->whenLoaded('autor', fn () => [
                'id' => $this->autor->id,
                'nombre' => $this->autor->name,
            ]),
            'created_at' => $this->created_at?->toIso8601String(),
            'updated_at' => $this->updated_at?->toIso8601String(),
        ];
    }
}
