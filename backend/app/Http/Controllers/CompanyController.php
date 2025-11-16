<?php

namespace App\Http\Controllers;

use App\Http\Requests\CompanyRequest;
use App\Http\Resources\CompanyResource;
use App\Repositories\CompanyRepository;
use Illuminate\Http\Request;

class CompanyController extends Controller
{
    protected $companies;

    public function __construct(CompanyRepository $companies)
    {
        $this->companies = $companies;
    }

    public function index(Request $request)
    {
        $user = $request->user();
        if (!$user) {
            return response()->json(['status' => 'error', 'message' => 'Unauthorized'], 401);
        }

        $company = $this->companies->getUserCompany($user);

        if (!$company) {
            return response()->json(['status' => 'error', 'message' => 'No Company Found'], 404);
        }

        return response()->json([
            'status' => 'success',
            'message' => 'Company fetched successfully',
            'company' => new CompanyResource($company)
        ]);
    }

    public function store(CompanyRequest $request)
    {
        $user = $request->user();
        if (!$user) {
            return response()->json(['status' => 'error', 'message' => 'Unauthorized'], 401);
        }

        $company = $this->companies->create($request->validated(), $user);

        return response()->json([
            'status' => 'success',
            'message' => 'Company created successfully',
            'company' => new CompanyResource($company)
        ], 201);
    }

    public function show($id)
    {
        $company = $this->companies->find($id);

        if (!$company) {
            return response()->json(['status' => 'error', 'message' => 'No Company Found'], 404);
        }

        return response()->json([
            'status' => 'success',
            'message' => 'Company fetched successfully',
            'company' => new CompanyResource($company)
        ]);
    }

    public function update(CompanyRequest $request, $id)
    {
        $company = $this->companies->find($id);

        if (!$company) {
            return response()->json(['status' => 'error', 'message' => 'No Company Found'], 404);
        }

        $updated = $this->companies->update($company, $request->validated());

        return response()->json([
            'status' => 'success',
            'message' => 'Company updated successfully',
            'company' => new CompanyResource($updated)
        ]);
    }

    public function destroy($id)
    {
        $company = $this->companies->find($id);

        if (!$company) {
            return response()->json(['status' => 'error', 'message' => 'No Company Found'], 404);
        }

        $this->companies->delete($company);

        return response()->json(['status' => 'success', 'message' => 'Company deleted successfully']);
    }
}
