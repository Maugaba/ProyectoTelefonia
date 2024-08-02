<?php

use Illuminate\Support\Facades\Route;
use Laravel\Sanctum\Http\Middleware\EnsureFrontendRequestsAreStateful;

Route::post('/login', 'App\Http\Controllers\loginController@login')->name('login');


Route::middleware(['auth:sanctum'])->group(function () {

    Route::get('/logout', 'App\Http\Controllers\loginController@logout')->name('logout');
    

    Route::prefix('users')->group(function () {
        Route::post('/register', 'App\Http\Controllers\loginController@register')->name('register');
        Route::post('/all', 'App\Http\Controllers\usuariosController@get_all')->name('usuarios.all');
        Route::get('/change/{id}', 'App\Http\Controllers\usuariosController@change')->name('usuarios.change');
    });
    
    Route::prefix('roles')->group(function (){
        Route::get('/all', 'App\Http\Controllers\rolesController@get_rol')->name('get.rol');
    });
});