<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Subscription extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'price',
        'interval',
        'description',
        'is_active',
    ];

    /** A subscription can be assigned to many users. */
    public function users()
    {
        return $this->hasMany(User::class);
    }
}
