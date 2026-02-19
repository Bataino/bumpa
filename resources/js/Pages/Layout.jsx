import { Link, usePage } from '@inertiajs/react';

export default function Layout({ children }) {
    const { auth } = usePage().props;

    return (
        <div className="min-h-screen bg-slate-950 text-slate-100">
            <div className="mx-auto max-w-6xl px-4 py-6">
                <div className="flex items-center justify-between rounded-2xl border border-slate-800 bg-slate-900/50 px-5 py-4">
                    <div>
                        <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Bumpa Loyalty</p>
                        <h1 className="text-2xl font-semibold text-white">Customer Portal</h1>
                    </div>
                    {auth?.user ? (
                        <div className="flex items-center gap-3 text-sm">
                            <span className="hidden text-slate-400 md:inline">
                                {auth.user.email}
                            </span>
                            <Link
                                href="/logout"
                                method="post"
                                as="button"
                                className="rounded-full border border-slate-700 px-4 py-2 text-slate-200 transition hover:border-amber-400 hover:text-amber-200"
                            >
                                Sign out
                            </Link>
                        </div>
                    ) : null}
                </div>

                <div className="mt-6 flex flex-wrap gap-3">
                    <Link
                        href="/checkout"
                        className="rounded-full border border-slate-800 px-4 py-2 text-sm text-slate-300 transition hover:border-amber-400 hover:text-amber-200"
                    >
                        Checkout Simulator
                    </Link>
                    <Link
                        href="/dashboard"
                        className="rounded-full border border-slate-800 px-4 py-2 text-sm text-slate-300 transition hover:border-amber-400 hover:text-amber-200"
                    >
                        Loyalty Dashboard
                    </Link>
                </div>

                <div className="mt-8">{children}</div>
            </div>
        </div>
    );
}
