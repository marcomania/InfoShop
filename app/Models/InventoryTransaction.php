<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Traits\Userstamps;
use Illuminate\Database\Eloquent\SoftDeletes;

class InventoryTransaction extends Model
{
    use Userstamps;
    use SoftDeletes;

    protected $fillable = [
        'store_id',
        'transaction_type',
        'reason',
        'transaction_date',
        'total',
        'created_by',
    ];
}