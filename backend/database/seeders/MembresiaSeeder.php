<?php

namespace Database\Seeders;

use App\Models\Comunidad;
use App\Models\Membresia;
use App\Models\User;
use Illuminate\Database\Seeder;

class MembresiaSeeder extends Seeder
{
    /**
     * Genera solicitudes de membresía realistas entre estudiantes ESPOL y las
     * comunidades creadas por ComunidadSeeder.
     *
     * El seeder es idempotente gracias al unique(['user_id','comunidad_id']) de la
     * tabla y al uso de updateOrCreate.
     */
    public function run(): void
    {
        // Crear estudiantes de prueba si aún no existen.
        $estudiantes = $this->crearEstudiantes();

        // Asignar membresías solo si ya existen comunidades.
        $comunidades = Comunidad::all()->keyBy('nombre');

        if ($comunidades->isEmpty()) {
            return;
        }

        foreach ($this->membresias($estudiantes, $comunidades) as $datos) {
            Membresia::updateOrCreate(
                [
                    'user_id'      => $datos['user_id'],
                    'comunidad_id' => $datos['comunidad_id'],
                ],
                ['estado' => $datos['estado']],
            );
        }
    }

    /** @return array<string, User> */
    private function crearEstudiantes(): array
    {
        $perfil = [
            ['name' => 'Carlos Mendoza',   'email' => 'cmendoza@espol.edu.ec'],
            ['name' => 'Ana Villafuerte',  'email' => 'avillafuerte@espol.edu.ec'],
            ['name' => 'Luis Intriago',    'email' => 'lintriago@espol.edu.ec'],
            ['name' => 'Sofía Quiñónez',   'email' => 'squinonez@espol.edu.ec'],
            ['name' => 'Miguel Ávila',     'email' => 'mavila@espol.edu.ec'],
            ['name' => 'Daniela Herrera',  'email' => 'dherrera@espol.edu.ec'],
            ['name' => 'Pablo Constante',  'email' => 'pconstante@espol.edu.ec'],
        ];

        $resultado = [];
        foreach ($perfil as $p) {
            $user = User::firstOrCreate(
                ['email' => $p['email']],
                ['name' => $p['name'], 'password' => 'password', 'rol' => 'estudiante'],
            );
            $resultado[$p['name']] = $user;
        }

        return $resultado;
    }

    /**
     * @param  array<string, User>            $e  Mapa nombre → User (estudiante)
     * @param  \Illuminate\Support\Collection $c  Colección de Comunidad indexada por nombre
     * @return list<array{user_id: int, comunidad_id: int, estado: string}>
     */
    private function membresias(array $e, $c): array
    {
        $datos = [];

        // --- Membresías aprobadas ------------------------------------------------
        $aprobadas = [
            ['Carlos Mendoza',  'Club de Robótica ESPOL'],
            ['Carlos Mendoza',  'Comunidad de Ciberseguridad Politécnica'],
            ['Ana Villafuerte', 'Ballet Folclórico ESPOL'],
            ['Ana Villafuerte', 'Semillero de Investigación en Biotecnología'],
            ['Luis Intriago',   'Capítulo Estudiantil IEEE ESPOL'],
            ['Luis Intriago',   'Club de Debate y Oratoria ESPOL'],
            ['Sofía Quiñónez',  'Club de Robótica ESPOL'],
            ['Miguel Ávila',    'Club de Fútbol ESPOL'],
            ['Miguel Ávila',    'Selección de Vóley Politécnico'],
            ['Daniela Herrera', 'Club de Teatro Politécnico'],
            ['Pablo Constante', 'Sociedad Científica de Ingeniería Civil'],
        ];

        foreach ($aprobadas as [$nombre, $comunidad]) {
            if (isset($e[$nombre]) && $c->has($comunidad)) {
                $datos[] = ['user_id' => $e[$nombre]->id, 'comunidad_id' => $c[$comunidad]->id, 'estado' => 'aprobada'];
            }
        }

        // --- Solicitudes pendientes -----------------------------------------------
        $pendientes = [
            ['Carlos Mendoza',  'Club de Debate y Oratoria ESPOL'],
            ['Ana Villafuerte', 'Capítulo Estudiantil IEEE ESPOL'],
            ['Sofía Quiñónez',  'Semillero de Investigación en Biotecnología'],
            ['Daniela Herrera', 'Comunidad de Ciberseguridad Politécnica'],
            ['Pablo Constante', 'Club de Fútbol ESPOL'],
        ];

        foreach ($pendientes as [$nombre, $comunidad]) {
            if (isset($e[$nombre]) && $c->has($comunidad)) {
                $datos[] = ['user_id' => $e[$nombre]->id, 'comunidad_id' => $c[$comunidad]->id, 'estado' => 'pendiente'];
            }
        }

        // --- Solicitudes rechazadas -----------------------------------------------
        $rechazadas = [
            ['Luis Intriago',  'Club de Fútbol ESPOL'],
            ['Miguel Ávila',   'Ballet Folclórico ESPOL'],
            ['Pablo Constante', 'Club de Teatro Politécnico'],
        ];

        foreach ($rechazadas as [$nombre, $comunidad]) {
            if (isset($e[$nombre]) && $c->has($comunidad)) {
                $datos[] = ['user_id' => $e[$nombre]->id, 'comunidad_id' => $c[$comunidad]->id, 'estado' => 'rechazada'];
            }
        }

        return $datos;
    }
}
