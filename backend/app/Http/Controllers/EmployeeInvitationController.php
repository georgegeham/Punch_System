<?php

namespace App\Http\Controllers;

use App\Mail\EmployeeInvitionMail;
use App\Models\EmployeeInvitation;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;

class EmployeeInvitationController extends Controller
{
    public function invite(Request $request)
    {
        $request->validate([
            "email" => "required|email|unique:employee_invitations,email",
        ]);

        $user = $request->user();
        if (!$user) {
            return response()->json(['message' => 'User not found'], 404);
        }

        $token = Str::random(32);
        $invitation = EmployeeInvitation::create([
            "email" => $request->email,
            "token" => $token,
            'hr_id' => $user->id,
            'company_id' => $user->companies()->first()->id
        ]);
        Mail::to($request->email)->send(new EmployeeInvitionMail($request->email, $token));

        return response()->json(['message' => 'Invitation sent successfully'], 200);
    }
    public function verify(Request $request)
    {
        $token = $request->query('token');
        $invitation = EmployeeInvitation::where('token', $token)->firstOrFail();
        if ($invitation->status === 'accepted') {
            return response()->json(['statues' => 'error', 'message' => 'Invitation already used'], 400);
        }
        if (!$invitation) {
            return response()->json(['status' => 'error', 'message' => 'Invalid Invitation'], 400);
        }

        return response()->json([
            'success' => true,
            'message' => 'Invitation verified successfully',
            'data' => [
                'email' => $invitation->email,
                'companyId' => $invitation->company_id,
            ]
        ], 200);
    }
    public function register(Request $request)
    {
        try {

            $request->validate([
                'token' => 'required|exists:employee_invitations,token',
                'name' => 'required|string|max:255',
                'password' => 'required|string|min:6|confirmed',
            ]);

            $invitation = EmployeeInvitation::where('token', $request->token)->firstOrFail();
            if ($invitation->status === 'accepted') {
                return response()->json(['error' => 'Token already used'], 400);
            }

            $employee = User::create([
                'name' => $request->name,
                'email' => $invitation->email,
                'password' => bcrypt($request->password),
                'company_id' => $invitation->company_id,
                'role' => 'employee',
            ]);

            $invitation->status = 'accepted';
            $invitation->save();

            return response()->json(['message' => 'Employee registered successfully']);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage(), 'status' => 'error', 'message' => 'Error has been occured'], 400);
        }
    }
}
