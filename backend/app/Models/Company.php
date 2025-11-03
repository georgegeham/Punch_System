<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Company extends Model
{
    use HasFactory;
    protected $fillable=[
        'name',
        'location',
        'area',
        'radius',
        'requires_hours',
        'start_time',
        'end_time',
        'hr_id'
    ];
    public function Hr(){
        return $this->belongsTo(User::class,'hr_id');
    }

    public function employees(){
        return $this->hasMany(User::class,'company_id')->where('role' , 'employee');
    }
}

