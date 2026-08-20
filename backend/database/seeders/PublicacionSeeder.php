<?php

namespace Database\Seeders;

use App\Models\Comunidad;
use App\Models\Publicacion;
use Illuminate\Database\Seeder;

class PublicacionSeeder extends Seeder
{
    /**
     * Genera anuncios y eventos de ejemplo para las comunidades creadas por
     * ComunidadSeeder, publicados por el administrador de cada una.
     *
     * El seeder es idempotente: usa updateOrCreate contra el título dentro de
     * cada comunidad, así que correrlo dos veces no duplica registros.
     */
    public function run(): void
    {
        $comunidades = Comunidad::with('administrador')->get()->keyBy('nombre');

        if ($comunidades->isEmpty()) {
            return;
        }

        foreach ($this->publicaciones($comunidades) as $datos) {
            Publicacion::updateOrCreate(
                [
                    'comunidad_id' => $datos['comunidad_id'],
                    'titulo' => $datos['titulo'],
                ],
                [
                    'autor_id' => $datos['autor_id'],
                    'descripcion' => $datos['descripcion'],
                    'tipo' => $datos['tipo'],
                    'fecha_evento' => $datos['fecha_evento'],
                ],
            );
        }
    }

    /**
     * @param  \Illuminate\Support\Collection $comunidades  Colección de Comunidad indexada por nombre
     * @return list<array{comunidad_id: int, autor_id: int, titulo: string, descripcion: string, tipo: string, fecha_evento: string|null}>
     */
    private function publicaciones($comunidades): array
    {
        $definiciones = [
            [
                'comunidad' => 'Club de Robótica ESPOL',
                'titulo' => 'Taller abierto de Arduino',
                'descripcion' => 'Sesión práctica de introducción a Arduino para nuevos miembros. No se requiere experiencia previa.',
                'tipo' => 'evento',
                'fecha_evento' => '2026-09-05 15:00:00',
            ],
            [
                'comunidad' => 'Club de Robótica ESPOL',
                'titulo' => 'Convocatoria a la Copa Nacional de Robótica',
                'descripcion' => 'Abrimos inscripciones para el equipo que representará al club en la Copa Nacional de este año.',
                'tipo' => 'anuncio',
                'fecha_evento' => null,
            ],
            [
                'comunidad' => 'Capítulo Estudiantil IEEE ESPOL',
                'titulo' => 'Charla técnica de sistemas embebidos',
                'descripcion' => 'Charla con un ingeniero invitado sobre diseño de sistemas embebidos de bajo consumo.',
                'tipo' => 'evento',
                'fecha_evento' => '2026-08-20 17:00:00',
            ],
            [
                'comunidad' => 'Comunidad de Ciberseguridad Politécnica',
                'titulo' => 'Entrenamiento CTF de fin de semana',
                'descripcion' => 'Práctica grupal resolviendo retos de un CTF pasado, categorías web y criptografía.',
                'tipo' => 'evento',
                'fecha_evento' => '2026-08-16 09:00:00',
            ],
            [
                'comunidad' => 'Club de Debate y Oratoria ESPOL',
                'titulo' => 'Nuevo horario de prácticas',
                'descripcion' => 'A partir de este término las sesiones de práctica se trasladan a los miércoles a las 18:00.',
                'tipo' => 'anuncio',
                'fecha_evento' => null,
            ],
            [
                'comunidad' => 'Ballet Folclórico ESPOL',
                'titulo' => 'Presentación en el Centro de Difusión Cultural',
                'descripcion' => 'Presentación abierta al público con repertorio de costa, sierra y amazonía.',
                'tipo' => 'evento',
                'fecha_evento' => '2026-09-12 19:00:00',
            ],
            [
                'comunidad' => 'Club de Fútbol ESPOL',
                'titulo' => 'Convocatoria a pruebas físicas',
                'descripcion' => 'Se abren pruebas para nuevos integrantes de la selección masculina y femenina.',
                'tipo' => 'anuncio',
                'fecha_evento' => null,
            ],
        ];

        $resultado = [];

        foreach ($definiciones as $d) {
            if (! $comunidades->has($d['comunidad'])) {
                continue;
            }

            $comunidad = $comunidades[$d['comunidad']];

            $resultado[] = [
                'comunidad_id' => $comunidad->id,
                'autor_id' => $comunidad->administrador_id,
                'titulo' => $d['titulo'],
                'descripcion' => $d['descripcion'],
                'tipo' => $d['tipo'],
                'fecha_evento' => $d['fecha_evento'],
            ];
        }

        return $resultado;
    }
}
