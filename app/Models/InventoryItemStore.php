<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class InventoryItemStore extends Model
{
    protected $fillable = [
        'inventory_item_id',
        'store_id',
        'quantity',
    ];
}