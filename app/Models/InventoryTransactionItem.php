<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class InventoryTransactionItem extends Model
{
    protected $fillable = [
        'inventory_transaction_id',
        'inventory_item_id',
        'quantity',
        'cost',
        'transaction_date',
    ];
}