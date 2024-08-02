<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateUsuariosTable extends Migration
{
    public function up()
    {
        Schema::create('users', function (Blueprint $table) {
            $table->id('id');
            $table->string('name', 100);
            $table->string('lastname', 100);
            $table->string('user', 45);
            $table->string('password', 100);
            $table->string('working_days', 500)->nullable();
            $table->string('state', 45)->nullable();
            $table->unsignedBigInteger('id_rol');
            $table->timestamps();
            // Definir la clave foránea
            $table->foreign('id_rol')
                  ->references('id')
                  ->on('roles'); // Opcional: puede ser 'cascade' si se desea eliminar en cascada
        });
    }

    public function down()
    {
        Schema::dropIfExists('usuarios');
    }
}