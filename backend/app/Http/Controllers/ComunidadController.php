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
use Illuminate\Support\Facades\Storage;
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
        $datos = $request->validated();

        // El logo viaja como archivo, no como escalar; se guarda en
        // storage/app/public/uploads y solo se persiste la ruta relativa.
        unset($datos['logo']);

        if ($request->hasFile('logo')) {
            $datos['logo'] = $request->file('logo')->store('uploads', 'public');
        }

        $comunidad = Comunidad::create($datos);

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
        $datos = $request->validated();

        // Si no llega un archivo nuevo, se deja el logo actual tal cual (no se
        // manda a null solo porque el campo no viajó en este envío).
        unset($datos['logo']);

        if ($request->hasFile('logo')) {
            // Borra el logo anterior del disco si era un archivo propio (no una
            // URL externa heredada) para no dejar huérfanos en storage/uploads.
            if ($comunidad->logo !== null && ! str_starts_with($comunidad->logo, 'http')) {
                Storage::disk('public')->delete($comunidad->logo);
            }

            $datos['logo'] = $request->file('logo')->store('uploads', 'public');
        }

        $comunidad->update($datos);

        return ComunidadResource::make($comunidad->load('administrador'));
    }
}
