import { useEffect, useMemo, useState } from 'react';
import { usePage } from '@inertiajs/react';
import Layout from './Layout';
import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
} from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import {
    BanknotesIcon,
    CalendarDaysIcon,
    ShoppingBagIcon,
} from '@heroicons/react/24/outline';

ChartJS.register(ArcElement, Tooltip);

export default function Dashboard() {
    const { auth, loyalty } = usePage().props;
    const [summary, setSummary] = useState(null);
    const [loading, setLoading] = useState(true);

    const badgeThresholds = useMemo(
        () => [
            { name: 'Bronze', threshold: 10000 },
            { name: 'Silver', threshold: 30000 },
            { name: 'Gold', threshold: 50000 },
        ],
        []
    );

    const progressPercent = useMemo(() => {
        if (!summary) {
            return 0;
        }

        const nextThreshold = badgeThresholds.find(
            (badge) => badge.name === summary.next_badge
        )?.threshold;
        const currentThreshold = badgeThresholds.find(
            (badge) => badge.name === summary.current_badge
        )?.threshold ?? 0;

        if (!nextThreshold) {
            return summary?.current_badge ? 100 : 0;
        }

        const remaining = summary?.remaining_to_unlock_next_badge ?? 0;
        const total = Math.max(0, nextThreshold - remaining);
        const span = nextThreshold - currentThreshold;

        if (span <= 0) {
            return 0;
        }

        return Math.min(100, Math.round(((total - currentThreshold) / span) * 100));
    }, [summary, badgeThresholds]);

    const progressChartData = useMemo(
        () => ({
            labels: ['Progress', 'Remaining'],
            datasets: [
                {
                    data: [progressPercent, Math.max(0, 100 - progressPercent)],
                    backgroundColor: ['rgba(251, 191, 36, 0.85)', 'rgba(30, 41, 59, 0.6)'],
                    borderWidth: 0,
                    cutout: '70%',
                },
            ],
        }),
        [progressPercent]
    );

    const achievementItems = useMemo(() => {
        if (summary?.achievements_meta?.length) {
            return summary.achievements_meta;
        }

        const unlocked = summary?.unlocked_achievements ?? [];
        const next = summary?.next_available_achievements ?? [];

        return [
            ...unlocked.map((name) => ({ id: name, name, unlocked: true })),
            ...next.map((name) => ({ id: name, name, unlocked: false })),
        ];
    }, [summary]);

    const iconForAchievement = (type) => {
        if (type === 'total_spent') {
            return BanknotesIcon;
        }
        if (type === 'orders_in_timeframe') {
            return CalendarDaysIcon;
        }
        if (type === 'orders_min_amount') {
            return ShoppingBagIcon;
        }

        return ShoppingBagIcon;
    };

    useEffect(() => {
        if (!auth?.user) {
            return;
        }

        setLoading(true);
        fetch(`/api/users/${auth.user.id}/achievements`)
            .then((response) => response.json())
            .then((data) => setSummary(data))
            .finally(() => setLoading(false));
    }, [auth?.user]);

    return (
        <Layout>
            <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
                <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-6 fade-in-up">
                    <h2 className="text-2xl font-semibold text-white">Loyalty Dashboard</h2>
                    <p className="mt-2 text-sm text-slate-400">
                        Track achievements unlocked by your recent purchases.
                    </p>

                    {loading ? (
                        <div className="mt-6 text-sm text-slate-400">Loading summary...</div>
                    ) : (
                        <>
                            <div className="mt-6">
                                <h3 className="text-sm uppercase tracking-[0.25em] text-amber-300/70">
                                    Achievements
                                </h3>
                                {achievementItems.length ? (
                                    <div className="mt-4 grid gap-4 sm:grid-cols-2">
                                        {achievementItems.map((achievement, index) => {
                                            const Icon = iconForAchievement(achievement.type);

                                            return (
                                                <div
                                                    key={achievement.name}
                                                    className={`rounded-2xl border px-4 py-4 transition fade-in-up ${
                                                        achievement.unlocked
                                                            ? 'border-amber-500/80 bg-amber-500/30 text-slate-100'
                                                            : 'border-slate-800 bg-slate-950/40 text-slate-500'
                                                    }`}
                                                    style={{ animationDelay: `${index * 60}ms` }}
                                                >
                                                    <div className="flex flex-col items-center justify-center">
                                                        <span
                                                            className={`inline-flex h-10 w-10 items-center my-6 justify-center ${
                                                                achievement.unlocked
                                                                    ? 'text-amber-200'
                                                                    : 'text-slate-400'
                                                            }`}
                                                        >
                                                            <Icon className="h-15 w-15" />
                                                        </span>
                                                        <div>
                                                            <p className="text-sm text-center font-semibold">
                                                                {achievement.name}
                                                            </p>
                                                            {achievement.description ? (
                                                                <p className="mt-1 text-center text-xs">
                                                                    {achievement.description}
                                                                </p>
                                                            ) : null}
                                                        </div>
                                                        
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                ) : (
                                    <p className="mt-3 text-sm text-slate-400">
                                        No achievements configured yet.
                                    </p>
                                )}
                            </div>
                        </>
                    )}
                </div>

                <div className="space-y-6">
                    <div className="rounded-3xl border border-slate-800 bg-gradient-to-br from-slate-900 via-slate-900/60 to-slate-950 p-6 fade-in-up">
                        <div className="flex items-center justify-between">
                            <h3 className="text-lg font-semibold text-white">Badge Status</h3>
                            <div className="flex gap-2 text-xs text-slate-400">
                                {badgeThresholds.map((badge) => (
                                    <span
                                        key={badge.name}
                                        className={`rounded-full border px-3 py-1 ${
                                            summary?.current_badge === badge.name
                                                ? 'border-amber-400 text-amber-200'
                                                : 'border-slate-700 text-slate-400'
                                        }`}
                                    >
                                        {badge.name}
                                    </span>
                                ))}
                            </div>
                        </div>
                        {loading ? (
                            <p className="mt-4 text-sm text-slate-400">Loading badge...</p>
                        ) : (
                            <>
                                <p className="mt-4 text-sm text-slate-400">Current badge</p>
                                <p className="text-2xl font-semibold text-white">
                                    {summary?.current_badge ?? 'No badge yet'}
                                </p>
                                <p className="mt-4 text-sm text-slate-400">Next badge</p>
                                <p className="text-xl text-amber-200">
                                    {summary?.next_badge
                                        ? summary.next_badge
                                        : summary?.current_badge
                                            ? 'All badges unlocked'
                                            : 'No badges configured'}
                                </p>
                                <div className="mt-6">
                                    <div className="flex items-center justify-between text-xs text-slate-400">
                                        <span>Progress to next badge</span>
                                        <span>{progressPercent}%</span>
                                    </div>
                                    <div className="mt-2 h-3 w-full rounded-full bg-slate-800">
                                        <div
                                            className="h-3 rounded-full bg-amber-400 transition-all"
                                            style={{ width: `${progressPercent}%` }}
                                        />
                                    </div>
                                </div>
                            </>
                        )}
                    </div>

                    <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-6 fade-in-up">
                        <h3 className="text-lg font-semibold text-white">
                            Progress to <span className="text-amber-200">{summary?.next_badge ?? 'Next Badge'}</span>
                        </h3>
                        {loading ? (
                            <p className="mt-4 text-sm text-slate-400">Calculating...</p>
                        ) : (
                            <>
                                <div className="relative mx-auto my-10 flex h-48 w-48 items-center justify-center fade-in-up">
                                    <Doughnut
                                        data={progressChartData}
                                        options={{
                                            responsive: true,
                                            plugins: { legend: { display: false } },
                                        }}
                                    />
                                    <div className="absolute text-center">
                                        <p className="text-3xl font-semibold text-white">
                                            {progressPercent}%
                                        </p>
                                        <p className="text-xs uppercase tracking-[0.25em] text-slate-500">
                                            Complete
                                        </p>
                                    </div>
                                </div>
                                <div className="mt-4">
                                    <p className="text-sm text-slate-300">
                                        Remaining to unlock {summary?.next_badge }:
                                    </p>
                                    <p className="mt-2 text-2xl font-semibold text-amber-200">
                                        NGN {summary?.remaining_to_unlock_next_badge ?? 0}
                                    </p>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </Layout>
    );
}
