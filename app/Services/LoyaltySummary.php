<?php

namespace App\Services;

use App\Models\Achievement;
use App\Models\Badge;
use App\Models\User;

class LoyaltySummary
{
    public function build(User $user): array
    {
        $totalSpent = (int) $user->orders()->paid()->sum('amount');
        $unlocked = $user->achievements()->pluck('name')->all();
        $unlockedIds = $user->achievements()->pluck('achievements.id')->all();
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

        $badgeThresholds = Badge::query()
            ->orderBy('threshold')
            ->get(['name', 'threshold'])
            ->map(fn (Badge $badge) => [
                'name' => $badge->name,
                'threshold' => $badge->threshold,
            ])
            ->all();

        $achievementsMeta = Achievement::query()
            ->orderBy('id')
            ->get(['id', 'name', 'type', 'description'])
            ->map(fn (Achievement $achievement) => [
                'id' => $achievement->id,
                'name' => $achievement->name,
                'type' => $achievement->type,
                'description' => $achievement->description,
                'unlocked' => in_array($achievement->id, $unlockedIds, true),
            ])
            ->all();

        $unlockedMeta = array_values(array_filter(
            $achievementsMeta,
            fn (array $achievement) => $achievement['unlocked'] === true
        ));

        return [
            'unlocked_achievements' => $unlocked,
            'next_available_achievements' => $nextAchievements,
            'unlocked_achievements_meta' => $unlockedMeta,
            'achievements_meta' => $achievementsMeta,
            'current_badge' => $currentBadge?->name,
            'next_badge' => $nextBadge?->name,
            'remaining_to_unlock_next_badge' => $nextBadge
                ? max(0, $nextBadge->threshold - $totalSpent)
                : 0,
            'total_spent' => $totalSpent,
            'badge_thresholds' => $badgeThresholds,
        ];
    }
}
