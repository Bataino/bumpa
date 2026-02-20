<?php

namespace Tests\Feature;

use App\Events\PurchaseCompleted;
use App\Enums\OrderStatus;
use App\Models\Order;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Http;
use Tests\TestCase;

class LoyaltyTest extends TestCase
{
    use RefreshDatabase;

    public function test_purchase_unlocks_achievement(): void
    {
        $this->seed();

        $user = User::factory()->create();
        $order = Order::create([
            'user_id' => $user->id,
            'amount' => 1000,
            'status' => OrderStatus::Paid,
        ]);

        event(new PurchaseCompleted($order));

        $this->assertTrue(
            $user->achievements()->where('name', 'Spend NGN 1,000 Total')->exists()
        );
    }

    public function test_badge_unlock_triggers_cashback(): void
    {
        $this->seed();
        config(['services.paystack.secret_key' => 'test_key']);

        Http::fake([
            'https://api.paystack.co/*' => Http::response(['status' => true], 200),
        ]);

        $user = User::factory()->create();

        $order = Order::create([
            'user_id' => $user->id,
            'amount' => 10000,
            'status' => OrderStatus::Paid,
        ]);

        event(new PurchaseCompleted($order));

        $this->assertTrue(
            $user->badges()->where('name', 'Bronze')->exists()
        );

        Http::assertSent(function ($request) use ($user) {
            return $request->url() === 'https://api.paystack.co/transaction/initialize'
                && $request['email'] === $user->email
                && $request['amount'] === 30000;
        });
    }

    public function test_achievements_api_returns_summary(): void
    {
        $this->seed();

        $user = User::factory()->create();
        $order = Order::create([
            'user_id' => $user->id,
            'amount' => 5000,
            'status' => OrderStatus::Paid,
        ]);

        event(new PurchaseCompleted($order));

        $response = $this->getJson("/api/users/{$user->id}/achievements");

        $response->assertOk();
        $response->assertJsonStructure([
            'unlocked_achievements',
            'next_available_achievements',
            'current_badge',
            'next_badge',
            'remaining_to_unlock_next_badge',
            'total_spent',
            'badge_thresholds',
        ]);
    }
}
