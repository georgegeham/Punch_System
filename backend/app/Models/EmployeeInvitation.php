<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class EmployeeInvitation extends Model
{
    protected $fillable = [
        'email',
        'token',
        'hr_id',
        'company_id',
        'status'
    ];
}
