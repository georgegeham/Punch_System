<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Punch extends Model
{

    protected $fillable = [
        'employee_id',
        'location',
        'distance',
        'punch_type',
        'valid',
        'status',
    ];
}
