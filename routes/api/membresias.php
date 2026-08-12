<?php

use App\Http\Controllers\MembresiaController;
use App\Http\Middleware\ForceJsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Route;

// Rutas del módulo Membresías (rama feat/membresias).
Route::middleware([ForceJsonResponse::class, 'auth:sanctum'])->group(function () {
    // Enviar solicitud de membresía a una comunidad (solo estudiantes).
    Route::post(
        'comunidades/{comunidadId}/membresias',
        [MembresiaController::class, 'solicitar'],
    );

    // Aprobar o rechazar una solicitud (solo el administrador de la comunidad).
    Route::patch(
        'membresias/{id}',
        [MembresiaController::class, 'actualizarEstado'],
    );

    // Ver miembros aprobados de una comunidad.
    Route::get(
        'comunidades/{comunidadId}/miembros',
        [MembresiaController::class, 'verMiembros'],
    );

    // Ver solicitudes pendientes de una comunidad (solo el administrador).
    Route::get(
        'comunidades/{comunidadId}/solicitudes',
        [MembresiaController::class, 'verSolicitudes'],
    );
});
