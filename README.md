# Bumpa Loyalty Program (Assessment)

This project implements a minimal full-stack loyalty program for an e-commerce store:
- Laravel 10 backend with achievement + badge logic.
- Inertia + React frontend with a checkout simulator and a customer dashboard.
- Paystack sandbox call for cashback on badge unlocks.

## Features
- Flexible achievement rules defined by `type` + `criteria` JSON.
- Badge tiers based on total spend (NGN 10,000 / 30,000 / 50,000).
- Events fired on unlocks: `AchievementUnlocked`, `BadgeUnlocked`.
- Cashback trigger: Paystack sandbox `transaction/initialize` (NGN 300).
- REST API: `GET /api/users/{user}/achievements`.
- Responsive UI with Tailwind.

## Requirements
- PHP 8.1+
- Composer
- Node.js 18+
- MySQL (for local dev; tests use SQLite in memory)

## Setup
1. Install PHP dependencies:
   ```bash
   composer install
   ```

2. Install JS dependencies:
   ```bash
   npm install
   ```

3. Configure environment:
   ```bash
   cp .env.example .env
   php artisan key:generate
   ```
   Update `.env` with MySQL settings and a Paystack sandbox key:
   ```env
   DB_DATABASE=bumpa
   DB_USERNAME=root
   DB_PASSWORD=secret
   PAYSTACK_SECRET_KEY=sk_test_your_key
   LOYALTY_CASHBACK_AMOUNT=300
   ```

4. Run migrations and seeders:
   ```bash
   php artisan migrate --seed
   ```

5. Start the backend:
   ```bash
   php artisan serve
   ```
6.Start the frontend (Vite):
   ```bash
   npm run dev
   ```
7. Test
   Run the test 
   ```bash
   php artisan serve
   ```
7. Open:
   - `http://127.0.0.1:8000`

## Usage
- Visit `/` to log in with any email (user is created if missing).
- Go to `/checkout` to simulate paid orders.
- Visit `/dashboard` to see achievements, badges, and progress.

## API - Can Test this using php artisan test
`GET /api/users/{user}/achievements`
Returns:
```json
{
  "unlocked_achievements": ["Spend NGN 1,000 Total"],
  "next_available_achievements": ["Spend NGN 5,000 Total"],
  "current_badge": "Bronze",
  "next_badge": "Silver",
  "remaining_to_unlock_next_badge": 20000
}
```


## Notes
- Cashback uses Paystack sandbox `transaction/initialize` and logs the response.
- Achievements are extensible via `type` + `criteria` JSON.
