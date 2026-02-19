<?php

namespace App\Services;

use App\Models\Badge;
use App\Models\User;

class LoyaltySummary
{
    public function build(User $user): array
    {
        $totalSpent = (int) $user->orders()->paid()->sum('amount');
        $unlocked = $user->achievements()->pluck('name')->all();
        $nextAchievements = \App\Models\Achievement::query()
            ->whereNotIn('id', $user->achievements()->pluck('achievements.id'))
            ->orderBy('id')
            ->pluck('name')
            ->all();

        $currentBadge = $user->badges()
            ->orderByPivot('unlocked_at', 'desc')
            ->first();

        $nextBadge = Badge::query()
            ->where('threshold', '>', $totalSpent)
            ->orderBy('threshold')
            ->first();

        return [
            'unlocked_achievements' => $unlocked,
            'next_available_achievements' => $nextAchievements,
            'current_badge' => $currentBadge?->name,
            'next_badge' => $nextBadge?->name,
            'remaining_to_unlock_next_badge' => $nextBadge
                ? max(0, $nextBadge->threshold - $totalSpent)
                : 0,
        ];
    }
}
