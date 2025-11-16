<?php

namespace App\Repositories;

use App\Models\User;
use App\Models\Punch;
use App\Models\Company;
use Carbon\Carbon;

class EmployeeRepository
{
    public function createEmployee(array $data): User
    {
        return User::create([
            'name' => $data['name'],
            'email' => $data['email'],
            'password' => bcrypt($data['password']),
            'company_id' => $data['company_id'],
            'role' => $data['role'] ?? 'employee',
        ]);
    }
    public function getAllEmployees($companyId)
    {
        return User::where('company_id', $companyId)
            ->where('role', 'employee')
            ->get();
    }

    public function recordPunch($employee, array $data)
    {
        $company = Company::find($employee->company_id);
        if (!$company) return null;

        $valid = $data['distance'] <= $company->radius ? 'inzone' : 'outzone';

        $punchTime = Carbon::createFromFormat('H:i:s', $data['time']);
        $status = $this->calculateStatus($punchTime, $data['punch_type'], $company);

        return Punch::create([
            'employee_id' => $employee->id,
            'location'    => $data['location'],
            'distance'    => $data['distance'],
            'punch_type'  => $data['punch_type'],
            'valid'       => $valid,
            'status'      => $status,
        ]);
    }

    protected function calculateStatus($punchTime, $punchType, Company $company)
    {
        if (!$company->requires_hours) return 'on_time';

        $startTime = Carbon::createFromFormat('H:i:s', $company->start_time);
        $endTime = Carbon::createFromFormat('H:i:s', $company->end_time);

        if ($punchType === 'punchIn') {
            if ($punchTime->gt($startTime->copy()->addHours(2))) return 'absent';
            if ($punchTime->lt($startTime)) return 'early';
            if ($punchTime->eq($startTime)) return 'on_time';
            return 'late';
        }

        if ($punchTime->lt($endTime)) return 'early_leave';
        if ($punchTime->eq($endTime)) return 'on_time';
        return 'over_time';
    }

    public function getEmployeePunches($companyId)
    {
        return Punch::join('users', 'punches.employee_id', '=', 'users.id')
            ->where('users.company_id', $companyId)
            ->select('punches.*', 'users.name as employee_name', 'users.email as employee_email')
            ->get();
    }
}
