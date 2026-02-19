import { useEffect, useState } from 'react';
import { usePage } from '@inertiajs/react';
import Layout from './Layout';

export default function Dashboard() {
    const { auth, loyalty } = usePage().props;
    const [summary, setSummary] = useState(null);
    const [loading, setLoading] = useState(true);

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
                <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-6">
                    <h2 className="text-2xl font-semibold text-white">Loyalty Dashboard</h2>
                    <p className="mt-2 text-sm text-slate-400">
                        Track achievements unlocked by your recent purchases.
                    </p>

                    {loading ? (
                        <div className="mt-6 text-sm text-slate-400">Loading summary…</div>
                    ) : (
                        <>
                            <div className="mt-6">
                                <h3 className="text-sm uppercase tracking-[0.25em] text-amber-300/70">
                                    Unlocked Achievements
                                </h3>
                                {summary?.unlocked_achievements?.length ? (
                                    <ul className="mt-3 space-y-2 text-sm text-slate-200">
                                        {summary.unlocked_achievements.map((item) => (
                                            <li
                                                key={item}
                                                className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3"
                                            >
                                                {item}
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <p className="mt-3 text-sm text-slate-400">
                                        No achievements unlocked yet.
                                    </p>
                                )}
                            </div>

                            <div className="mt-8">
                                <h3 className="text-sm uppercase tracking-[0.25em] text-amber-300/70">
                                    Next Achievements
                                </h3>
                                {summary?.next_available_achievements?.length ? (
                                    <ul className="mt-3 space-y-2 text-sm text-slate-300">
                                        {summary.next_available_achievements.map((item) => (
                                            <li
                                                key={item}
                                                className="rounded-2xl border border-slate-700/60 bg-slate-950/50 px-4 py-3"
                                            >
                                                {item}
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    summary?.unlocked_achievements?.length ? (
                                    <p className="mt-3 text-sm text-slate-400">
                                        All achievements completed.
                                    </p>
                                    ) : (
                                        <p className="mt-3 text-sm text-slate-400">
                                            No achievements available yet
                                        </p>
                                    )
                                )}
                            </div>
                        </>
                    )}
                </div>

                <div className="space-y-6">
                    <div className="rounded-3xl border border-slate-800 bg-gradient-to-br from-slate-900 via-slate-900/60 to-slate-950 p-6">
                        <h3 className="text-lg font-semibold text-white">Badge Status</h3>
                        {loading ? (
                            <p className="mt-4 text-sm text-slate-400">Loading badge…</p>
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
                            </>
                        )}
                    </div>

                    <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-6">
                        <h3 className="text-lg font-semibold text-white">Progress</h3>
                        {loading ? (
                            <p className="mt-4 text-sm text-slate-400">Calculating…</p>
                        ) : (
                            <>
                                <p className="mt-4 text-sm text-slate-300">
                                    Remaining to unlock next badge:
                                </p>
                                <p className="mt-2 text-2xl font-semibold text-amber-200">
                                    NGN {summary?.remaining_to_unlock_next_badge ?? 0}
                                </p>
                                <p className="mt-4 text-xs uppercase tracking-[0.25em] text-slate-500">
                                    Unlock badge and get  NGN {loyalty?.cashbackAmount ?? 300}
                                </p>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </Layout>
    );
}
