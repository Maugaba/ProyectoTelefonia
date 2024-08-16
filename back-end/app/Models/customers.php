<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
class Customers extends Model 
{
    protected $table = 'customers';

    protected $fillable = [
        'name',
        'email',
        'phone',
        'address',
        'state',
    ];
}