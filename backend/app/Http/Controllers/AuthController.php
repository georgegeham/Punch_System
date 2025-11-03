<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{
    public function register(Request $request)
    {
        $request->validate([
            "name" => "required|min:3",
            "email" => "required|email",
            "password" => "required|min:6",
            "role" => "required|in:hr,employee"
        ]);
        $user = User::create([
            "name" => $request->name,
            "email" => $request->email,
            "password" => Hash::make($request->password),
            "role" => $request->role
        ]);
        return response()->json(['message' => 'User created successfully'], 201);
    }
    public function login(Request $request)
    {
        $request->validate([
            "email" => "required|email",
            "password" => "required|min:6",
        ]);
        $user = User::where('email', $request->email)->first();
        if (!$user || !Hash::check($request->password, $user->password)) {
            return response()->json(['message' => 'Invalid email or password'], 401);
        }
        $token = $user->createToken('aut_token')->plainTextToken;
        if ($user->role == 'hr') {
            return response()->json(['message' => 'User logged in successfully', 'user' => $user, 'token' => $token], 200);
        } else {
            $company = $user->company()->get()->first();
            return response()->json(['message' => 'Employee logged in successfully', 'user' => $user, 'token' => $token, 'company' => $company], 200);
        }
    }

    public function logout(Request $request)
    {
        $request->user()->tokens()->delete();
        return response()->json(['message' => 'User logged out successfully'], 200);
    }
    public function me(Request $request)
    {
        return response()->json($request->user());
    }
}
