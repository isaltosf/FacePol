<?php

namespace App\Http\Resources;

use App\Models\Comunidad;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @mixin Comunidad
 */
class ComunidadResource extends JsonResource
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
            'nombre' => $this->nombre,
            'descripcion' => $this->descripcion,
            'categoria' => $this->categoria,
            'logo' => $this->logo,
            'activa' => $this->activa,
            'administrador_id' => $this->administrador_id,
            'administrador' => $this->whenLoaded('administrador', fn () => [
                'id' => $this->administrador->id,
                'nombre' => $this->administrador->name,
                'email' => $this->administrador->email,
            ]),
            'created_at' => $this->created_at?->toIso8601String(),
            'updated_at' => $this->updated_at?->toIso8601String(),
        ];
    }
}
