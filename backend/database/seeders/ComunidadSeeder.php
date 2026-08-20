<?php

namespace Database\Seeders;

use App\Models\Comunidad;
use App\Models\User;
use Illuminate\Database\Seeder;

class ComunidadSeeder extends Seeder
{
    /**
     * Comunidades de ejemplo de la ESPOL repartidas entre las cuatro categorías.
     *
     * El seeder es idempotente: se apoya en los campos únicos (email del usuario y
     * nombre de la comunidad), así que correrlo dos veces no duplica ni falla.
     */
    public function run(): void
    {
        foreach ($this->comunidades() as $datos) {
            $administrador = User::firstOrCreate(
                ['email' => $datos['admin_email']],
                [
                    'name' => $datos['admin_nombre'],
                    // El cast 'hashed' del modelo User se encarga de encriptarla.
                    'password' => 'password',
                    'rol' => 'administrador',
                ],
            );

            Comunidad::updateOrCreate(
                ['nombre' => $datos['nombre']],
                [
                    'descripcion' => $datos['descripcion'],
                    'categoria' => $datos['categoria'],
                    'logo' => $datos['logo'],
                    'administrador_id' => $administrador->id,
                    'activa' => $datos['activa'],
                ],
            );
        }
    }

    /**
     * @return list<array{nombre: string, descripcion: string, categoria: string, logo: string|null, activa: bool, admin_nombre: string, admin_email: string}>
     */
    private function comunidades(): array
    {
        return [
            [
                'nombre' => 'Club de Robótica ESPOL',
                'descripcion' => 'Diseño y construcción de robots autónomos y de combate. Participamos cada año en la Copa Nacional de Robótica y damos talleres abiertos de Arduino y ROS.',
                'categoria' => 'tecnologica',
                'logo' => 'https://espol.edu.ec/comunidades/robotica.png',
                'activa' => true,
                'admin_nombre' => 'Andrés Zambrano',
                'admin_email' => 'azambrano@espol.edu.ec',
            ],
            [
                'nombre' => 'Capítulo Estudiantil IEEE ESPOL',
                'descripcion' => 'Rama estudiantil del IEEE en la ESPOL. Organizamos charlas técnicas, concursos de programación embebida y visitas industriales para estudiantes de ingeniería eléctrica y electrónica.',
                'categoria' => 'tecnologica',
                'logo' => 'https://espol.edu.ec/comunidades/ieee.png',
                'activa' => true,
                'admin_nombre' => 'María Fernanda Litardo',
                'admin_email' => 'mflitardo@espol.edu.ec',
            ],
            [
                'nombre' => 'Comunidad de Ciberseguridad Politécnica',
                'descripcion' => 'Espacio para practicar seguridad ofensiva y defensiva. Entrenamos para competencias CTF y realizamos auditorías internas de laboratorio con permiso del área de TI.',
                'categoria' => 'tecnologica',
                'logo' => null,
                'activa' => true,
                'admin_nombre' => 'Kevin Moreira',
                'admin_email' => 'kmoreira@espol.edu.ec',
            ],
            [
                'nombre' => 'Sociedad Científica de Ingeniería Civil',
                'descripcion' => 'Grupo académico de la FICT dedicado al estudio de estructuras sismorresistentes y materiales sostenibles. Publicamos un boletín semestral con los proyectos de los miembros.',
                'categoria' => 'academica',
                'logo' => 'https://espol.edu.ec/comunidades/scic.png',
                'activa' => true,
                'admin_nombre' => 'Doménica Vera',
                'admin_email' => 'dvera@espol.edu.ec',
            ],
            [
                'nombre' => 'Club de Debate y Oratoria ESPOL',
                'descripcion' => 'Formación en debate parlamentario británico y comunicación efectiva. Sesiones de práctica los miércoles y participación en torneos interuniversitarios de Guayaquil y Quito.',
                'categoria' => 'academica',
                'logo' => null,
                'activa' => true,
                'admin_nombre' => 'Jorge Luis Cedeño',
                'admin_email' => 'jlcedeno@espol.edu.ec',
            ],
            [
                'nombre' => 'Semillero de Investigación en Biotecnología',
                'descripcion' => 'Semillero del CIBE enfocado en cultivo in vitro y control biológico de plagas en banano y cacao. Abierto a estudiantes de biología, alimentos y química desde tercer semestre.',
                'categoria' => 'academica',
                'logo' => 'https://espol.edu.ec/comunidades/cibe.png',
                'activa' => true,
                'admin_nombre' => 'Paola Intriago',
                'admin_email' => 'pintriago@espol.edu.ec',
            ],
            [
                'nombre' => 'Ballet Folclórico ESPOL',
                'descripcion' => 'Difusión de la danza tradicional ecuatoriana. Representamos a la universidad en festivales nacionales con repertorio de costa, sierra y amazonía. No se requiere experiencia previa.',
                'categoria' => 'cultural',
                'logo' => 'https://espol.edu.ec/comunidades/ballet.png',
                'activa' => true,
                'admin_nombre' => 'Gabriela Alvarado',
                'admin_email' => 'galvarado@espol.edu.ec',
            ],
            [
                'nombre' => 'Club de Teatro Politécnico',
                'descripcion' => 'Montaje de obras cortas y teatro de improvisación. Cada semestre presentamos una temporada en el Centro de Difusión Cultural del campus Gustavo Galindo.',
                'categoria' => 'cultural',
                'logo' => null,
                'activa' => true,
                'admin_nombre' => 'Ricardo Ponce',
                'admin_email' => 'rponce@espol.edu.ec',
            ],
            [
                'nombre' => 'Club de Fútbol ESPOL',
                'descripcion' => 'Selección masculina y femenina de fútbol de la ESPOL. Entrenamientos en la cancha central del campus y participación en la Liga Universitaria del Guayas.',
                'categoria' => 'deportiva',
                'logo' => 'https://espol.edu.ec/comunidades/futbol.png',
                'activa' => true,
                'admin_nombre' => 'Christian Barzola',
                'admin_email' => 'cbarzola@espol.edu.ec',
            ],
            [
                'nombre' => 'Selección de Vóley Politécnico',
                'descripcion' => 'Equipo de voleibol de sala que compite en los Juegos Interfacultades y en torneos universitarios nacionales. Convocatorias abiertas al inicio de cada término académico.',
                'categoria' => 'deportiva',
                'logo' => null,
                'activa' => true,
                'admin_nombre' => 'Nathaly Suárez',
                'admin_email' => 'nsuarez@espol.edu.ec',
            ],
        ];
    }
}
