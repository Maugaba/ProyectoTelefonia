<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateRolesTable extends Migration
{
    public function up()
    {
        Schema::create('roles', function (Blueprint $table) {
            $table->id('id');
            $table->string('name', 50);
            $table->string('description', 200)->nullable();
            $table->tinyInteger('v_module')->nullable();
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('roles');
    }
}
