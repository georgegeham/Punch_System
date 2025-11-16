<?php

namespace App\Http\Controllers;

use App\Events\RegisterEvent;
use App\Http\Resources\UserResource;
use App\Repositories\UserRepository;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{
    protected $users;

    public function __construct(UserRepository $users)
    {
        $this->users = $users;
    }

    public function register(Request $request)
    {
        $request->validate([
            "name" => "required|min:3",
            "email" => "required|email|unique:users,email",
            "password" => "required|min:6",
            "role" => "required|in:hr,employee"
        ]);

        $user = $this->users->create($request->all());
        event(new RegisterEvent($user));

        return response()->json([
            'message' => 'User created successfully',
            'user' => new UserResource($user),
        ], 201);
    }

    public function login(Request $request)
    {
        $request->validate([
            "email" => "required|email",
            "password" => "required|min:6",
            "role" => "required|in:hr,employee"
        ]);

        $user = $this->users->findByEmail($request->email);

        if (!$user || !Hash::check($request->password, $user->password)) {
            return response()->json(['message' => 'Invalid email or password'], 401);
        }
        if ($user->role !== $request->role) {
            return response()->json(['message' => 'Invalid Login'], 401);
        }

        $token = $user->createToken('auth_token')->plainTextToken;

        $response = [
            'message' => 'User logged in successfully',
            'user' => new UserResource($user),
            'token' => $token,
        ];

        if ($user->role === 'employee') {
            $response['company'] = $user->company;
        }

        return response()->json($response, 200);
    }

    public function logout(Request $request)
    {
        $this->users->deleteTokens($request->user());

        return response()->json(['message' => 'User logged out successfully'], 200);
    }

    public function me(Request $request)
    {
        return new UserResource($request->user());
    }
}
