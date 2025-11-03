<?php

namespace App\Http\Controllers;

use App\Http\Requests\CompanyRequest;
use App\Models\Company;
use Illuminate\Http\Request;

class CompanyController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        try {

            $user = $request->user();
            if (!$user) {
                return response()->json(['status' => 'error', 'message' => 'Error has been occured'], 401);
            }
            $companies = $user->companies()->get()->first();
            return response()->json(['status' => 'success', 'meesage' => 'Companies fetched successfully', 'companies' => $companies], 200);
        } catch (\Exception $e) {
            return response()->json(['status' => 'error', 'message' => 'Error has been occured'], 500);
        }
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(CompanyRequest $request)
    {
        try {
            $user = $request->user();
            if (!$user) {
                return response()->json(['status' => 'error', 'message' => 'Error has been occured'], 401);
            }
            $company = new Company();
            $company->name = $request->name;
            $company->location = $request->location;
            $company->area = $request->area;
            $company->radius = round(sqrt($request->area / M_PI) * 1.3); //1.3 Factor for Safety
            $company->requires_hours = $request->input('requires_hours');
            $company->start_time = $request->input('start_time');
            $company->end_time = $request->input('end_time');

            $company->hr_id = $user->id;
            $company->save();
            return response()->json(['status' => 'success', 'message' => 'Company created successfully', 'company' => $company], 200);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Validation failed.',
                'errors' => $e->errors(),
            ], 422);
        } catch (\Exception $e) {
            return response()->json(['status' => 'error', 'message' => 'Error has been occured', 'error' => $e->getMessage()], 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $company = Company::find($id);
        if (!$company) {
            return response()->json(['status' => 'error', 'message' => 'No Company Found'], 404);
        }
        return response()->json(['status' => 'success', 'message' => 'Company fetched successfully', 'company' => $company], 200);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(CompanyRequest $request, string $id)
    {
        try {
            $user = $request->user();
            if (!$user) {
                return response()->json(['status' => 'error', 'message' => 'Error has been occured'], 401);
            }
            $company = Company::find($id);
            if (!$company) {
                return response()->json(['status' => 'error', 'message' => 'No Company Found'], 404);
            }
            $company->name = $request->name;
            $company->location = $request->location;
            $company->area = $request->area;
            $company->requires_hours = $request->input('requires_hours');
            $company->start_time = $request->input('start_time');
            $company->end_time = $request->input('end_time');
            $company->save();
            return response()->json(['status' => 'success', 'message' => 'Company updated successfully', 'company' => $company], 200);
        } catch (\Exception $e) {
            return response()->json(['status' => 'error', 'message' => 'Error has been occured'], 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        try {
            $company = Company::find($id);
            if (!$company) {
                return response()->json(['status' => 'error', 'message' => 'No Company Found'], 404);
            }
            $company->delete();
            return response()->json(['status' => 'success', 'message' => 'Company deleted successfully'], 200);
        } catch (\Exception $e) {
            return response()->json(['status' => 'error', 'message' => 'Error has been occured'], 500);
        }
    }
}
