<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class AuthController extends Controller
{
    public function login(Request $request)
    {
        $data = $request->validate([
            'email' => ['required', 'email'],
            'password' => ['required', 'string', 'min:6'],
        ]);

        $user = User::where('email', $data['email'])->first();

        if ($user) {
            if (!Hash::check($data['password'], $user->password)) {
                return back()->withErrors([
                    'password' => 'Invalid password.',
                ])->withInput();
            }
        } else {
            $user = User::create([
                'email' => $data['email'],
                'name' => Str::before($data['email'], '@') ?: 'Customer',
                'password' => Hash::make($data['password']),
            ]);
        }

        $request->session()->put('user_id', $user->id);

        return redirect()->route('dashboard');
    }

    public function logout(Request $request)
    {
        $request->session()->forget('user_id');

        return redirect()->route('login');
    }
}
