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
use Illuminate\Support\Facades\Storage;
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

        $datos = $request->validated();

        // La imagen viaja aparte (archivo, no en $request->validated() como escalar);
        // se guarda en storage/app/public/uploads y solo se persiste la ruta relativa.
        unset($datos['imagen']);

        if ($request->hasFile('imagen')) {
            $datos['imagen_path'] = $request->file('imagen')->store('uploads', 'public');
        }

        $publicacion = Publicacion::create([
            ...$datos,
            'comunidad_id' => $comunidadId,
            'autor_id' => $user->id,
        ]);

        return PublicacionResource::make($publicacion->load(['comunidad', 'autor']))
            ->response()
            ->setStatusCode(Response::HTTP_CREATED);
    }

    /**
     * Feed cronológico de anuncios y eventos de las comunidades a las que
     * pertenece el estudiante autenticado (membresía en estado "aprobada")
     * más las comunidades que administra, aunque no tenga membresía aprobada
     * en ellas: ser dueño de la comunidad ya implica poder ver lo que publica.
     *
     * GET /api/feed
     */
    public function feed(Request $request): AnonymousResourceCollection
    {
        $userId = $request->user()->id;

        $comunidadIds = Membresia::where('user_id', $userId)
            ->where('estado', 'aprobada')
            ->pluck('comunidad_id')
            ->merge(Comunidad::where('administrador_id', $userId)->pluck('id'));

        $publicaciones = Publicacion::with(['comunidad', 'autor'])
            ->whereIn('comunidad_id', $comunidadIds)
            ->orderByDesc('created_at')
            ->paginate(10)
            ->withQueryString();

        return PublicacionResource::collection($publicaciones);
    }
}
