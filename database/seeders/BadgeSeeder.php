<?php

namespace Database\Seeders;

use App\Models\Badge;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class BadgeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $badges = [
            [
                'name' => 'Bronze',
                'threshold' => 10000,
                'description' => 'Reach NGN 10,000 in total paid orders.',
            ],
            [
                'name' => 'Silver',
                'threshold' => 30000,
                'description' => 'Reach NGN 30,000 in total paid orders.',
            ],
            [
                'name' => 'Gold',
                'threshold' => 50000,
                'description' => 'Reach NGN 50,000 in total paid orders.',
            ],
        ];

        foreach ($badges as $badge) {
            Badge::firstOrCreate(['name' => $badge['name']], $badge);
        }
    }
}
