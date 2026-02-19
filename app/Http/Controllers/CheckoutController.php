<?php

namespace App\Http\Controllers;

use App\Enums\OrderStatus;
use App\Events\PurchaseCompleted;
use App\Models\Order;
use App\Models\User;
use Illuminate\Http\Request;

class CheckoutController extends Controller
{
    public function store(Request $request)
    {
        $data = $request->validate([
            'amount' => ['required', 'integer', 'min:100'],
        ]);

        $userId = $request->session()->get('user_id');
        $user = User::findOrFail($userId);

        $order = Order::create([
            'user_id' => $user->id,
            'amount' => (int) $data['amount'],
            'status' => OrderStatus::Paid,
        ]);

        event(new PurchaseCompleted($order));

        return redirect()->back()->with('success', 'Order placed and loyalty updated.');
    }
}
