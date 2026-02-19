<?php

namespace App\Http\Middleware;

use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    protected $rootView = 'app';

    public function share(Request $request): array
    {
        $userId = $request->session()->get('user_id');
        $user = $userId ? User::find($userId) : null;

        return array_merge(parent::share($request), [
            'auth' => [
                'user' => $user ? [
                    'id' => $user->id,
                    'email' => $user->email,
                ] : null,
            ],
            'flash' => [
                'success' => $request->session()->get('success'),
            ],
        ]);
    }
}
