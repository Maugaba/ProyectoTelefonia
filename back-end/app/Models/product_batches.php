<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
class Product_batches extends Model 
{
    protected $table = 'product_batches';

    protected $fillable = [
        'product_id',
        'batch_number',
        'expiration_date',
        'quantity',
        'state',
    ];
}