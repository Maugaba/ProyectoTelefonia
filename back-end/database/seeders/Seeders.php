<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Log;
use App\Models\Users;
use App\Models\roles;

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
            $rol = roles::create([
                'name' => 'Administrador',
                'description' => 'Administrador del sistema',
                'v_module' => 1,
                'created_at' => now(),
                'updated_at' => now(),
            ]);

            Log::info('Rol creado: ' . $rol->id);

            $usuario = Users::create([
                'name' => 'Admin',
                'lastname' => 'Admin',
                'user' => 'admin',
                'password' => bcrypt('admin'), 
                'state' => 'Activo', 
                'id_rol' => $rol->id,
                'created_at' => now(),
                'updated_at' => now(),
            ]);

            Log::info('Usuario creado: ' . $usuario->id);

        } catch (\Exception $e) {
            Log::error('Error seeding database: ' . $e->getMessage());
        }

        Log::info('Seeder completed.');
    }
}

