<?php

namespace App\Listeners;

use App\Events\AchievementUnlocked;
use App\Events\BadgeUnlocked;
use App\Events\PurchaseCompleted;
use App\Models\Achievement;
use App\Models\Badge;
use App\Services\AchievementEvaluator;
use Illuminate\Support\Carbon;

class EvaluateAchievementsAndBadges
{
    public function __construct(private AchievementEvaluator $achievementEvaluator)
    {
    }

    /**
     * Handle the event.
     */
    public function handle(PurchaseCompleted $event): void
    {
        $user = $event->order->user;

        $alreadyUnlocked = $user->achievements()->pluck('achievements.id')->all();
        $newAchievements = Achievement::query()
            ->whereNotIn('id', $alreadyUnlocked)
            ->get()
            ->filter(fn (Achievement $achievement) => $this->achievementEvaluator->isUnlocked($user, $achievement));

        foreach ($newAchievements as $achievement) {
            $user->achievements()->attach($achievement->id, [
                'unlocked_at' => Carbon::now(),
            ]);
            event(new AchievementUnlocked($user, $achievement));
        }

        $totalSpent = (int) $user->orders()->paid()->sum('amount');
        $eligibleBadge = Badge::query()
            ->where('threshold', '<=', $totalSpent)
            ->orderByDesc('threshold')
            ->first();

        if ($eligibleBadge) {
            $currentBadge = $user->badges()
                ->orderByPivot('unlocked_at', 'desc')
                ->first();

            if (!$currentBadge || $currentBadge->id !== $eligibleBadge->id) {
                $user->badges()->attach($eligibleBadge->id, [
                    'unlocked_at' => Carbon::now(),
                ]);
                event(new BadgeUnlocked($user, $eligibleBadge));
            }
        }
    }
}
