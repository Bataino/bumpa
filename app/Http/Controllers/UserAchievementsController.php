<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Services\LoyaltySummary;
use Illuminate\Http\Request;

class UserAchievementsController extends Controller
{
    /**
     * Handle the incoming request.
     */
    public function __invoke(Request $request, User $user, LoyaltySummary $summary)
    {
        return response()->json($summary->build($user));
    }
}
