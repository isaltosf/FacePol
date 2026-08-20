<?php

use App\Http\Controllers\PublicacionController;
use App\Http\Middleware\ForceJsonResponse;
use Illuminate\Support\Facades\Route;

// Rutas del módulo Publicaciones (rama feat/publicaciones).
Route::middleware([ForceJsonResponse::class, 'auth:sanctum'])->group(function () {
    // Crear un anuncio o evento dentro de una comunidad (solo el administrador).
    Route::post(
        'comunidades/{comunidadId}/publicaciones',
        [PublicacionController::class, 'store'],
    );

    // Feed cronológico de las comunidades a las que pertenece el estudiante.
    Route::get('feed', [PublicacionController::class, 'feed']);
});
