<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
class Sales extends Model 
{
    protected $table = 'sales';
    protected $fillable = [
        'customer_id',
        'total_amount',
        'sale_date',
        'notes',
        'state',
    ];
}
