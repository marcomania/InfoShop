<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use App\Traits\Userstamps;

class ProductBatch extends Model
{
    use HasFactory;
    use SoftDeletes;
    use Userstamps;

    protected $fillable = [
        'product_id',
        'batch_number',
        'expiry_date', 
        'cost', 
        'price',
        'is_active',
        'is_featured',
        'discount',
        'contact_id',
        'discount_percentage',
    ];
}
