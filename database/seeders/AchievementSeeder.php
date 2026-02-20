<?php

namespace Database\Seeders;

use App\Models\Achievement;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class AchievementSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $achievements = [
            [
                'name' => 'Spendthrift',
                'type' => 'total_spent',
                'criteria' => ['amount' => 1000],
                'description' => 'Reach NGN 1,000 in total paid orders.',
            ],
            [
                'name' => 'Thrifty',
                'type' => 'total_spent',
                'criteria' => ['amount' => 5000],
                'description' => 'Reach NGN 5,000 in total paid orders.',
            ],
            [
                'name' => 'Thousands Club',
                'type' => 'total_spent',
                'criteria' => ['amount' => 10000],
                'description' => 'Reach NGN 10,000 in total paid orders.',
            ],
            [
                'name' => 'Perpetual Buyer',
                'type' => 'orders_in_timeframe',
                'criteria' => ['count' => 2, 'window' => 'day'],
                'description' => 'Place two paid orders within the same day.',
            ],
            [
                'name' => 'Unstoppable',
                'type' => 'orders_in_timeframe',
                'criteria' => ['count' => 4, 'window' => 'week'],
                'description' => 'Place four paid orders within the same week.',
            ],
            [
                'name' => 'Premium Customer',
                'type' => 'orders_min_amount',
                'criteria' => ['count' => 3, 'min_amount' => 5000],
                'description' => 'Place three paid orders worth at least NGN 5,000 each.',
            ],
        ];

        foreach ($achievements as $achievement) {
            Achievement::firstOrCreate(['name' => $achievement['name']], $achievement);
        }
    }
}
