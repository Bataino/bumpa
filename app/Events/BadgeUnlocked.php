<?php

namespace App\Events;

use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;
use App\Models\Badge;
use App\Models\User;

class BadgeUnlocked
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public function __construct(public User $user, public Badge $badge)
    {
    }
}
