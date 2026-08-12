<?php

namespace App\Http\Controllers;

use App\Http\Requests\StorePublicacionRequest;
use App\Http\Resources\PublicacionResource;
use App\Models\Comunidad;
use App\Models\Membresia;
use App\Models\Publicacion;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Symfony\Component\HttpFoundation\Response;

class PublicacionController extends Controller
{
    /**
     * Crear un anuncio o evento dentro de una comunidad.
     *
     * POST /api/comunidades/{comunidadId}/publicaciones
     *
     * Solo el administrador de la comunidad puede publicar.
     */
    public function store(StorePublicacionRequest $request, int $comunidadId): JsonResponse
    {
        $comunidad = Comunidad::find($comunidadId);

        if (! $comunidad) {
            return response()->json(['message' => 'La comunidad solicitada no existe.'], Response::HTTP_NOT_FOUND);
        }

        $user = $request->user();

        if ($comunidad->administrador_id !== $user->id) {
            return response()->json(
                ['message' => 'Solo el administrador de la comunidad puede publicar anuncios o eventos.'],
                Response::HTTP_FORBIDDEN,
            );
        }

        $publicacion = Publicacion::create([
            ...$request->validated(),
            'comunidad_id' => $comunidadId,
            'autor_id' => $user->id,
        ]);

        return PublicacionResource::make($publicacion->load(['comunidad', 'autor']))
            ->response()
            ->setStatusCode(Response::HTTP_CREATED);
    }

    /**
     * Feed cronológico de anuncios y eventos de las comunidades a las que
     * pertenece el estudiante autenticado (membresía en estado "aprobada").
     *
     * GET /api/feed
     */
    public function feed(Request $request): AnonymousResourceCollection
    {
        $comunidadIds = Membresia::where('user_id', $request->user()->id)
            ->where('estado', 'aprobada')
            ->pluck('comunidad_id');

        $publicaciones = Publicacion::with(['comunidad', 'autor'])
            ->whereIn('comunidad_id', $comunidadIds)
            ->orderByDesc('created_at')
            ->paginate(10)
            ->withQueryString();

        return PublicacionResource::collection($publicaciones);
    }
}
