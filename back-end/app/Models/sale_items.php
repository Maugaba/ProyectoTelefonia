<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Sale_items extends Model 
{
    protected $table = 'sale_items';

    protected $fillable = [
        'sale_id',
        'product_id',
        'quantity',
        'price',
        'total',
    ];
}
