<?php

namespace App\Repositories;

use App\Models\User;
use Illuminate\Support\Facades\Hash;

class UserRepository
{
    public function create(array $data)
    {
        return User::create([
            'name' => $data['name'],
            'email' => $data['email'],
            'password' => Hash::make($data['password']),
            'role' => $data['role'],
        ]);
    }

    public function findByEmail(string $email)
    {
        return User::where('email', $email)->first();
    }

    public function deleteTokens($user)
    {
        return $user->tokens()->delete();
    }
    public function getHrCompany($user)
    {
        return $user->companies()->first();
    }
}
