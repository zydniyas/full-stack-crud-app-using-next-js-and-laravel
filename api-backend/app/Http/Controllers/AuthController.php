<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AuthController extends Controller
{
    public function register(Request $request)
    {
        $data = $request->validate([
            "name" => "requried|string",
            "email" => "requried|email|unique:users,email",
            "password" => "requried"
        ]);

        User::create($data);

        return response()->json([
            "status" => true,
            "message" => 'User registration successfull'
        ]);
    }

    public function login(Request $request)
    {
        $request->validate([
            'email' => 'requried|email',
            "password" => "requried"

        ]);

        if (!Auth::attempt($request->only('email', 'password'))) {
            return response()->json([
                'status' => false,
                'message' => 'Invalid Credantials'
            ]);
        }


        $user = Auth::user();

        $token = $user->createToken('myToken')->plainTextToken;


        return response()->json([
            'status' => true,
            'message' => 'User logined',
            'token' => $token
        ]);
    }

    public function profile()
    {

        $user = Auth::user();

        return response()->json([
            'status' => true,
            'message' => 'User profile data',
            'user' => $user
        ]);
    }

    public function logout()
    {
        Auth::logout();

        return response()->json([
            'status' => true,
            'message' => 'User loggedout',
        ]);
    }
}
