<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class Users extends Authenticatable
{
    use HasFactory, Notifiable, HasApiTokens;
    protected $table = 'users';
    protected $fillable = [
        'name',
        'lastname',
        'user',
        'password',
        'working_days',
        'state',       
        'id_rol',
    ];
}