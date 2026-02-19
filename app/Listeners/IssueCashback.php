<?php

namespace App\Listeners;

use App\Events\BadgeUnlocked;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class IssueCashback
{
    /**
     * Handle the event.
     */
    public function handle(BadgeUnlocked $event): void
    {
        $cashbackAmount = (int) config('loyalty.cashback_amount', 300);

        $response = Http::withToken(config('services.paystack.secret_key'))
            ->post('https://api.paystack.co/transaction/initialize', [
                'email' => $event->user->email,
                'amount' => $cashbackAmount * 100,
                'metadata' => [
                    'reason' => 'loyalty_cashback',
                    'badge' => $event->badge->name,
                ],
            ]);

        Log::info('Paystack sandbox cashback initialized.', [
            'user_id' => $event->user->id,
            'amount' => $cashbackAmount,
            'response' => $response->json(),
        ]);
    }
}
