<?php

namespace App\Repositories;

use App\Models\Company;

class CompanyRepository
{
    public function getUserCompany($user)
    {
        return $user->companies()->first();
    }

    public function find($id)
    {
        return Company::find($id);
    }

    public function create(array $data, $user)
    {
        $company = new Company();
        $company->fill($data);
        $company->radius = round(sqrt($data['area'] / M_PI) * 1.3);
        $company->hr_id = $user->id;
        $company->save();
        return $company;
    }

    public function update($company, array $data)
    {
        $company->fill($data);
        $company->save();
        return $company;
    }

    public function delete($company)
    {
        return $company->delete();
    }
}
