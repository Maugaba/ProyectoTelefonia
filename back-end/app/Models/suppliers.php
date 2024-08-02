<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
class Suppliers extends Model 
{
    protected $table = 'suppliers';
    protected $fillable = [
        'name',
        'contact_name',
        'contact_email',
        'contact_phone',
        'address',
        'state',
    ];
}
