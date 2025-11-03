<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\CompanyController;
use App\Http\Controllers\Employee;
use App\Http\Controllers\EmployeeInvitationController;
use Illuminate\Support\Facades\Route;


Route::post('/register', [AuthController::class, 'register'])->name('register');

Route::post('/login', [AuthController::class, 'login'])->name('login');

Route::get('/employee/invitation/verify', [EmployeeInvitationController::class, 'verify'])->name('employee.invitation.verify');

Route::post('/employee/invitation/register', [EmployeeInvitationController::class, 'register'])->name('employee.invitation.register');

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout'])->name('logout');
    Route::post('/employee/punch', [Employee::class, 'punch'])->name('employee.punch');
    Route::middleware('canHr')->group(function () {
        Route::apiResource('companies', CompanyController::class);
        Route::post('/employee/invite', [EmployeeInvitationController::class, 'invite'])->name('employee.invite');
        Route::get('/employee/punches', [Employee::class, 'EmployeePunches'])->name('employees.punches');
    });
});
