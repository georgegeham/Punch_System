<?php

namespace App\Repositories;

use App\Mail\EmployeeInvitionMail;
use App\Models\EmployeeInvitation;
use App\Models\User;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;

class EmployeeInvitationRepository
{
    protected $employeeRepo;

    public function __construct(EmployeeRepository $employeeRepo)
    {
        $this->employeeRepo = $employeeRepo;
    }
    public function createInvitation($hr, $email)
    {
        $token = Str::random(32);
        $invitation = EmployeeInvitation::create([
            'email' => $email,
            'token' => $token,
            'hr_id' => $hr->id,
            'company_id' => $hr->companies()->first()->id
        ]);

        Mail::to($email)->send(new EmployeeInvitionMail($email, $token));

        return $invitation;
    }

    public function verifyToken($token)
    {
        $invitation = EmployeeInvitation::where('token', $token)->first();
        if (!$invitation) {
            return null;
        }
        if ($invitation->status === 'accepted') {
            throw new \Exception('Token already used');
        }
        return $invitation;
    }

    public function registerEmployee($token, $name, $password)
    {
        $invitation = EmployeeInvitation::where('token', $token)->firstOrFail();

        if ($invitation->status === 'accepted') {
            throw new \Exception('Token already used');
        }

        $employee = $this->employeeRepo->createEmployee([
            'name' => $name,
            'email' => $invitation->email,
            'password' => $password,
            'company_id' => $invitation->company_id
        ]);

        $invitation->status = 'accepted';
        $invitation->save();

        return $employee;
    }
}
