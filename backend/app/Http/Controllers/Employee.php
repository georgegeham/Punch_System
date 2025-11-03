<?php

namespace App\Http\Controllers;

use App\Models\Company;
use App\Models\Punch;
use App\Models\User;
use Illuminate\Http\Request;
use Carbon\Carbon;

class Employee extends Controller
{
    public function getAll(Request $request)
    {
        $employees = User::where('company_id', $request->user()->company_id)->where('role', 'employee')->get();

        return response()->json([
            'status' => 'success',
            'message' => 'Employees fetched successfully',
            'employees' => $employees,
        ], 200);
    }

    public function punch(Request $request)
    {
        $request->validate([
            'location' => 'required',
            'distance' => 'required|numeric',
            'punch_type' => 'required|in:punchIn,punchOut',
            'time' => 'required|date_format:H:i:s',
        ]);

        $companyId = $request->user()->company_id;
        $company = Company::find($companyId);

        if (!$company) {
            return response()->json(['message' => 'Company not found'], 404);
        }

        // check location zone
        $valid = $request->input('distance') <= $company->radius ? 'inzone' : 'outzone';

        // convert all times to Carbon for comparison
        $punchTime = Carbon::createFromFormat('H:i:s', $request->input('time'));

        $status = '';
        if (isset($company->requires_hours) && $company->requires_hours !== 0) {
            $startTime = Carbon::createFromFormat('H:i:s', $company->start_time);
            $endTime   = Carbon::createFromFormat('H:i:s', $company->end_time);
            if ($request->input('punch_type') === 'punchIn') {
                if ($punchTime->gt($startTime->copy()->addHours(2))) {
                    $status = 'absent';
                } elseif ($punchTime->lt($startTime)) {
                    $status = 'early';
                } elseif ($punchTime->eq($startTime)) {
                    $status = 'on_time';
                } else {
                    $status = 'late';
                }
            } else {
                // punch out logic
                if ($punchTime->lt($endTime)) {
                    $status = 'early_leave';
                } elseif ($punchTime->eq($endTime)) {
                    $status = 'on_time';
                } else {
                    $status = 'over_time';
                }
            }
        } else {
            $status = 'on_time';
        }
        $punch = Punch::create([
            'employee_id' => $request->user()->id,
            'location'    => $request->input('location'),
            'distance'    => $request->input('distance'),
            'punch_type'  => $request->input('punch_type'),
            'valid'       => $valid,
            'status'      => $status,
        ]);

        return response()->json([
            'message' => 'Punch recorded successfully',
            'data' => $punch
        ], 201);
    }

    public function EmployeePunches(Request $request)
    {
        $punches = Punch::query()->join('users', 'punches.employee_id', '=', 'users.id')->where('users.company_id', '=', $request->user()->id)->select('punches.*', 'users.name as employee_name', 'users.email as employee_email')->get();
        return response()->json([
            'message' => 'Punches fetched successfully',
            'data' => $punches
        ], 200);
    }
}
