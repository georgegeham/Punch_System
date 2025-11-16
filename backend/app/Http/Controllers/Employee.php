<?php

namespace App\Http\Controllers;

use App\Events\PunchEvent;
use Illuminate\Http\Request;
use App\Repositories\EmployeeRepository;

class Employee extends Controller
{
    protected $employeeRepo;

    public function __construct(EmployeeRepository $employeeRepo)
    {
        $this->employeeRepo = $employeeRepo;
    }

    public function getAll(Request $request)
    {
        $employees = $this->employeeRepo->getAllEmployees($request->user()->company_id);

        return response()->json([
            'status' => 'success',
            'message' => 'Employees fetched successfully',
            'employees' => $employees,
        ], 200);
    }

    public function punch(Request $request)
    {
        $validated = $request->validate([
            'location' => 'required',
            'distance' => 'required|numeric',
            'punch_type' => 'required|in:punchIn,punchOut',
            'time' => 'required|date_format:H:i:s',
        ]);


        $punch = $this->employeeRepo->recordPunch($request->user(), $validated,);

        if (!$punch) {
            return response()->json(['message' => 'Company not found'], 404);
        }
        event(new PunchEvent($request->user()));

        return response()->json([
            'message' => 'Punch recorded successfully',
            'data' => $punch
        ], 201);
    }

    public function EmployeePunches(Request $request)
    {
        $companyId = $request->user()->companies()->first()->id;
        $punches = $this->employeeRepo->getEmployeePunches($companyId);

        return response()->json([
            'message' => 'Punches fetched successfully',
            'data' => $punches,
        ], 200);
    }
}
