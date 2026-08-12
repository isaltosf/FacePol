<?php

use App\Http\Controllers\ComunidadController;
use App\Http\Middleware\ForceJsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Route;

// Rutas del módulo Comunidades (rama feat/comunidades).
Route::middleware(ForceJsonResponse::class)->group(function () {
    Route::apiResource('comunidades', ComunidadController::class)
        ->only(['index', 'store', 'show', 'update'])
        // Sin esto el parámetro se llamaría {comunidade} y rompería el route model binding.
        ->parameters(['comunidades' => 'comunidad'])
        // El route model binding corre antes que el middleware, así que el 404 se
        // responde aquí explícitamente para que nunca salga como página HTML.
        ->missing(fn (Request $request) => response()->json(
            ['message' => 'La comunidad solicitada no existe.'],
            Response::HTTP_NOT_FOUND,
        ));
});
