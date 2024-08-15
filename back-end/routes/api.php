<?php

use Illuminate\Support\Facades\Route;
use Laravel\Sanctum\Http\Middleware\EnsureFrontendRequestsAreStateful;

Route::post('/login', 'App\Http\Controllers\loginController@login')->name('login');


Route::middleware(['auth:sanctum'])->group(function () {

    Route::get('/logout', 'App\Http\Controllers\loginController@logout')->name('logout');
    

    Route::prefix('users')->group(function () {
        Route::post('/register', 'App\Http\Controllers\usersController@register')->name('register');
        Route::post('/all', 'App\Http\Controllers\usersController@get_all')->name('usuarios.all');
        Route::get('/change/{id}', 'App\Http\Controllers\usersController@change')->name('usuarios.change');
        Route::post('/update/{id}', 'App\Http\Controllers\usersController@update')->name('usuarios.update');
    });
    
    Route::prefix('roles')->group(function (){
        Route::get('/all', 'App\Http\Controllers\rolesController@get_rol')->name('get.rol');
    });

    Route::prefix('suppliers')->group(function () {
        Route::post('/all', 'App\Http\Controllers\suppliersController@get_all')->name('suppliers.all');
        Route::post('/register', 'App\Http\Controllers\suppliersController@register')->name('suppliers.register');
        Route::get('/change/{id}', 'App\Http\Controllers\suppliersController@change')->name('suppliers.change');
        Route::post('/update/{id}', 'App\Http\Controllers\suppliersController@update')->name('suppliers.update');
    });

    Route::prefix('products')->group(function () {
        Route::post('/all', 'App\Http\Controllers\productsController@get_all')->name('products.all');
        Route::post('/register', 'App\Http\Controllers\productsController@register')->name('products.register');
        Route::get('/change/{id}', 'App\Http\Controllers\productsController@change')->name('products.change');
        Route::post('/update/{id}', 'App\Http\Controllers\productsController@update')->name('products.update');
    });
    
    Route::prefix('customers')->group(function () {
        Route::post('/all', 'App\Http\Controllers\customersController@get_all')->name('customers.all');
        Route::post('/register', 'App\Http\Controllers\customersController@register')->name('customers.register');
        Route::get('/change/{id}', 'App\Http\Controllers\customersController@change')->name('customers.change');
        Route::post('/update/{id}', 'App\Http\Controllers\customersController@update')->name('customers.update');
    });

    Route::prefix('sales')->group(function () {
        Route::post('/all', 'App\Http\Controllers\salesController@get_all')->name('sales.all');
        Route::post('/register', 'App\Http\Controllers\salesController@register')->name('sales.register');
        Route::get('/cancel/{id}', 'App\Http\Controllers\salesController@cancel_sale')->name('sales.cancel');
        Route::get('/{id}', 'App\Http\Controllers\SalesController@show')->name('sales.show'); // Cambiado aquí
    });

    Route::prefix('productbatches')->group(function () {
        Route::post('/all', 'App\Http\Controllers\productbatchesController@get_all')->name('productbatches.all');
        Route::post('/register', 'App\Http\Controllers\productbatchesController@register')->name('productbatches.register');
        Route::get('/change/{id}', 'App\Http\Controllers\productbatchesController@change')->name('productbatches.change');
        Route::post('/update/{id}', 'App\Http\Controllers\productbatchesController@update')->name('productbatches.update');
        Route::post('/productbatches/filter', 'App\Http\Controllers\productbatchesController@filter_by_date')->name('productbatches.filter');

    });
    
});