<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

/**
 * Fuerza que la respuesta sea JSON aunque el cliente no envíe el header
 * "Accept: application/json" (por ejemplo, Postman con la configuración por
 * defecto o un navegador). Sin esto, un 404 o un 422 se renderizarían como
 * página HTML.
 */
class ForceJsonResponse
{
    /**
     * Handle an incoming request.
     *
     * @param  Closure(Request): Response  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $request->headers->set('Accept', 'application/json');

        return $next($request);
    }
}
