<?php

namespace App\Http\Resources;

use App\Models\Comunidad;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Storage;

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
            // Comunidades antiguas guardaron una URL externa completa; las nuevas
            // guardan la ruta relativa de storage/app/public/uploads.
            'logo' => match (true) {
                $this->logo === null => null,
                str_starts_with($this->logo, 'http') => $this->logo,
                default => Storage::disk('public')->url($this->logo),
            },
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
