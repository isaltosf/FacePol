<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreComunidadRequest;
use App\Http\Requests\UpdateComunidadRequest;
use App\Http\Resources\ComunidadResource;
use App\Models\Comunidad;
use Illuminate\Contracts\Database\Eloquent\Builder;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Symfony\Component\HttpFoundation\Response;

class ComunidadController extends Controller
{
    /**
     * Listado de comunidades activas, con filtros opcionales por texto y categoría.
     *
     * GET /api/comunidades?q=robotica&categoria=tecnologica
     */
    public function index(Request $request): AnonymousResourceCollection
    {
        $comunidades = Comunidad::query()
            ->with('administrador')
            ->where('activa', true)
            ->when(
                $request->query('q'),
                // El agrupamiento evita que el orWhere se "escape" del resto de filtros.
                fn (Builder $query, string $q) => $query->where(
                    fn (Builder $grupo) => $grupo
                        ->where('nombre', 'like', "%{$q}%")
                        ->orWhere('descripcion', 'like', "%{$q}%")
                )
            )
            ->when(
                $request->query('categoria'),
                fn (Builder $query, string $categoria) => $query->where('categoria', $categoria)
            )
            ->orderBy('nombre')
            ->paginate(10)
            ->withQueryString();

        return ComunidadResource::collection($comunidades);
    }

    /**
     * Crear una comunidad.
     *
     * POST /api/comunidades
     */
    public function store(StoreComunidadRequest $request): JsonResponse
    {
        $comunidad = Comunidad::create($request->validated());

        return ComunidadResource::make($comunidad->load('administrador'))
            ->response()
            ->setStatusCode(Response::HTTP_CREATED);
    }

    /**
     * Detalle de una comunidad con su administrador (eager loading, sin N+1).
     *
     * GET /api/comunidades/{id}
     */
    public function show(Comunidad $comunidad): ComunidadResource
    {
        return ComunidadResource::make($comunidad->load('administrador'));
    }

    /**
     * Editar una comunidad.
     *
     * PUT /api/comunidades/{id}
     */
    public function update(UpdateComunidadRequest $request, Comunidad $comunidad): ComunidadResource
    {
        $comunidad->update($request->validated());

        return ComunidadResource::make($comunidad->load('administrador'));
    }
}
