<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    protected $fillable = [
        'title',
        'discription',
        'banner_image',
        'price',
        'user_id'
    ];
}
