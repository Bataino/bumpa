<?php

namespace App\Services;

use App\Models\Achievement;
use App\Models\User;
use Carbon\Carbon;

class AchievementEvaluator
{
    public function isUnlocked(User $user, Achievement $achievement): bool
    {
        $criteria = $achievement->criteria ?? [];

        return match ($achievement->type) {
            'total_spent' => $this->totalSpent($user, $criteria),
            'orders_in_timeframe' => $this->ordersInTimeframe($user, $criteria),
            'orders_min_amount' => $this->ordersMinAmount($user, $criteria),
            default => false,
        };
    }

    private function totalSpent(User $user, array $criteria): bool
    {
        $amount = (int) ($criteria['amount'] ?? 0);

        return $user->orders()->paid()->sum('amount') >= $amount;
    }

    private function ordersInTimeframe(User $user, array $criteria): bool
    {
        $count = (int) ($criteria['count'] ?? 0);
        $window = $criteria['window'] ?? 'day';

        $from = match ($window) {
            'week' => Carbon::now()->startOfWeek(),
            default => Carbon::now()->startOfDay(),
        };

        return $user->orders()
            ->paid()
            ->where('created_at', '>=', $from)
            ->count() >= $count;
    }

    private function ordersMinAmount(User $user, array $criteria): bool
    {
        $count = (int) ($criteria['count'] ?? 0);
        $minAmount = (int) ($criteria['min_amount'] ?? 0);

        return $user->orders()
            ->paid()
            ->where('amount', '>=', $minAmount)
            ->count() >= $count;
    }
}
