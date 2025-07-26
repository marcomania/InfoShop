<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Traits\Userstamps;
use Illuminate\Database\Eloquent\SoftDeletes;

class InventoryItem extends Model
{
    use Userstamps;
    use SoftDeletes;
    
    protected $fillable = [
        'name',
        'batch_number',
        'unit_type',
        'alert_quantity',
        'cost',
        'created_by',
    ];
}