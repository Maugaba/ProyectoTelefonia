<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Log;
use App\Models\Usuarios;
use App\Models\Roles;

class Seeders extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        Log::info('Seeder started...');

        try {
            $rol = Roles::create([
                'nombre' => 'Administrador',
                'descripcion' => 'Administrador del sistema',
                'v_modulo' => 1,
            ]);

            Log::info('Rol creado: ' . $rol->id);

            $usuario = Usuarios::create([
                'nombre' => 'Admin',
                'apellido' => 'Admin',
                'usuario' => 'admin',
                'contraseña' => bcrypt('admin'), 
                'estado' => 'Activo', 
                'id_rol' => $rol->id,
            ]);

            Log::info('Usuario creado: ' . $usuario->id);

        } catch (\Exception $e) {
            Log::error('Error seeding database: ' . $e->getMessage());
        }

        Log::info('Seeder completed.');
    }
}

