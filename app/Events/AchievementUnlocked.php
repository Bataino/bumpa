<?php

namespace App\Events;

use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;
use App\Models\Achievement;
use App\Models\User;

class AchievementUnlocked
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public function __construct(public User $user, public Achievement $achievement)
    {
    }
}
