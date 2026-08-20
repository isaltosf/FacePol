<?php

namespace App\Http\Controllers;

use App\Models\Comunidad;
use App\Models\Membresia;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Symfony\Component\HttpFoundation\Response;

class MembresiaController extends Controller
{
    /**
     * POST /api/comunidades/{comunidadId}/membresias
     *
     * Permite a un estudiante enviar una solicitud para unirse a una comunidad.
     * La solicitud queda en estado 'pendiente' hasta que el administrador la gestione.
     */
    public function solicitar(Request $request, int $comunidadId): JsonResponse
    {
        $comunidad = Comunidad::find($comunidadId);

        if (! $comunidad) {
            return response()->json(['message' => 'La comunidad solicitada no existe.'], Response::HTTP_NOT_FOUND);
        }

        if (! $comunidad->activa) {
            return response()->json(['message' => 'No se puede solicitar membresía en una comunidad inactiva.'], Response::HTTP_UNPROCESSABLE_ENTITY);
        }

        $user = $request->user();

        if ($user->rol !== 'estudiante') {
            return response()->json(['message' => 'Solo los estudiantes pueden solicitar membresía en una comunidad.'], Response::HTTP_FORBIDDEN);
        }

        $existe = Membresia::where('user_id', $user->id)
            ->where('comunidad_id', $comunidadId)
            ->first();

        if ($existe) {
            $mensajes = [
                'pendiente' => 'Ya tienes una solicitud pendiente en esta comunidad.',
                'aprobada'  => 'Ya eres miembro aprobado de esta comunidad.',
                'rechazada' => 'Tu solicitud anterior fue rechazada. No puedes volver a solicitar membresía.',
            ];

            return response()->json(
                ['message' => $mensajes[$existe->estado]],
                Response::HTTP_CONFLICT,
            );
        }

        $membresia = Membresia::create([
            'user_id'      => $user->id,
            'comunidad_id' => $comunidadId,
            'estado'       => 'pendiente',
        ]);

        return response()->json([
            'message'   => 'Solicitud de membresía enviada correctamente.',
            'membresia' => $membresia,
        ], Response::HTTP_CREATED);
    }

    /**
     * PATCH /api/membresias/{id}
     *
     * Permite al administrador de la comunidad aprobar o rechazar una solicitud.
     */
    public function actualizarEstado(Request $request, int $id): JsonResponse
    {
        $membresia = Membresia::with('comunidad')->find($id);

        if (! $membresia) {
            return response()->json(['message' => 'La membresía solicitada no existe.'], Response::HTTP_NOT_FOUND);
        }

        $user = $request->user();

        if ($membresia->comunidad->administrador_id !== $user->id) {
            return response()->json(['message' => 'No tienes permiso para gestionar las solicitudes de esta comunidad.'], Response::HTTP_FORBIDDEN);
        }

        $validated = $request->validate([
            'estado' => ['required', Rule::in(['aprobada', 'rechazada'])],
        ]);

        $membresia->update($validated);

        return response()->json([
            'message'   => 'Estado de la membresía actualizado correctamente.',
            'membresia' => $membresia->fresh(),
        ]);
    }

    /**
     * GET /api/comunidades/{comunidadId}/mi-membresia
     *
     * Le dice al frontend cómo se relaciona el usuario autenticado con esta
     * comunidad, para decidir qué botones mostrarle (solicitar / ya es
     * miembro / es el administrador).
     */
    public function miEstado(Request $request, int $comunidadId): JsonResponse
    {
        $comunidad = Comunidad::find($comunidadId);

        if (! $comunidad) {
            return response()->json(['message' => 'La comunidad solicitada no existe.'], Response::HTTP_NOT_FOUND);
        }

        $user = $request->user();

        $membresia = Membresia::where('user_id', $user->id)
            ->where('comunidad_id', $comunidadId)
            ->first();

        return response()->json([
            'data' => [
                'es_administrador' => $comunidad->administrador_id === $user->id,
                'estado' => $membresia?->estado,
            ],
        ]);
    }

    /**
     * GET /api/comunidades/{comunidadId}/miembros
     *
     * Devuelve la lista de usuarios con membresía aprobada en la comunidad,
     * más el administrador (que es miembro de facto aunque no tenga una fila
     * de membresía aprobada).
     */
    public function verMiembros(int $comunidadId): JsonResponse
    {
        $comunidad = Comunidad::with('administrador:id,name,email,rol')->find($comunidadId);

        if (! $comunidad) {
            return response()->json(['message' => 'La comunidad solicitada no existe.'], Response::HTTP_NOT_FOUND);
        }

        $miembros = Membresia::with('user:id,name,email,rol')
            ->where('comunidad_id', $comunidadId)
            ->where('estado', 'aprobada')
            ->where('user_id', '!=', $comunidad->administrador_id)
            ->get()
            ->map(fn (Membresia $m) => [
                'membresia_id' => $m->id,
                'miembro_desde' => $m->updated_at,
                'es_administrador' => false,
                'user' => $m->user,
            ]);

        $filaAdministrador = collect([[
            'membresia_id' => null,
            'miembro_desde' => $comunidad->created_at,
            'es_administrador' => true,
            'user' => $comunidad->administrador,
        ]]);

        return response()->json(['data' => $filaAdministrador->concat($miembros)]);
    }

    /**
     * GET /api/comunidades/{comunidadId}/solicitudes
     *
     * Devuelve las solicitudes pendientes de una comunidad.
     * Restringido al administrador de dicha comunidad.
     */
    public function verSolicitudes(Request $request, int $comunidadId): JsonResponse
    {
        $comunidad = Comunidad::find($comunidadId);

        if (! $comunidad) {
            return response()->json(['message' => 'La comunidad solicitada no existe.'], Response::HTTP_NOT_FOUND);
        }

        $user = $request->user();

        if ($comunidad->administrador_id !== $user->id) {
            return response()->json(['message' => 'Solo el administrador de la comunidad puede ver las solicitudes pendientes.'], Response::HTTP_FORBIDDEN);
        }

        $solicitudes = Membresia::with('user:id,name,email,rol')
            ->where('comunidad_id', $comunidadId)
            ->where('estado', 'pendiente')
            ->orderBy('created_at')
            ->get()
            ->map(fn (Membresia $m) => [
                'membresia_id'     => $m->id,
                'solicitado_en'    => $m->created_at,
                'user'             => $m->user,
            ]);

        return response()->json(['data' => $solicitudes]);
    }
}
