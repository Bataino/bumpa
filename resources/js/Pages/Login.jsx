import { useForm, usePage } from '@inertiajs/react';

export default function Login() {
    const { auth } = usePage().props;
    const { data, setData, post, processing, errors } = useForm({
        email: '',
        password: '',
    });

    const submit = (event) => {
        event.preventDefault();
        post('/login');
    };

    return (
        <div className="min-h-screen bg-slate-950 text-slate-100">
            <div className="mx-auto flex min-h-screen max-w-5xl flex-col justify-center px-4 py-12">
                <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
                    <div>
                        <p className="text-sm uppercase tracking-[0.35em] text-amber-300/70">
                            Loyalty Program
                        </p>
                        <h1 className="mt-4 text-4xl font-semibold text-white sm:text-5xl">
                            Reward every checkout with achievements and badges.
                        </h1>
                        <p className="mt-4 text-lg text-slate-300">
                            Sign in with any email to simulate purchases, unlock achievements,
                            and preview cashback triggers.
                        </p>
                    </div>

                    <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-8 shadow-xl shadow-slate-950/50">
                        <h2 className="text-xl font-semibold text-white">Quick Login</h2>
                        <p className="mt-2 text-sm text-slate-400">
                            Use a real-looking email address. We will create the account if it
                            does not exist.
                        </p>

                        {auth?.user ? (
                            <div className="mt-6 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-sm text-emerald-200">
                                You are already signed in as {auth.user.email}. Head to the
                                dashboard or checkout page.
                            </div>
                        ) : (
                            <form onSubmit={submit} className="mt-6 space-y-4">
                                <div>
                                    <label className="text-sm text-slate-300">Email address</label>
                                    <input
                                        type="email"
                                        value={data.email}
                                        onChange={(event) => setData('email', event.target.value)}
                                        className="mt-2 w-full rounded-2xl border border-slate-700 bg-slate-950/60 px-4 py-3 text-slate-100 outline-none transition focus:border-amber-400"
                                        placeholder="customer@demo.com"
                                    />
                                    {errors.email ? (
                                        <p className="mt-2 text-xs text-red-300">{errors.email}</p>
                                    ) : null}
                                </div>
                                <div>
                                    <label className="text-sm text-slate-300">Password</label>
                                    <input
                                        type="password"
                                        value={data.password}
                                        onChange={(event) => setData('password', event.target.value)}
                                        className="mt-2 w-full rounded-2xl border border-slate-700 bg-slate-950/60 px-4 py-3 text-slate-100 outline-none transition focus:border-amber-400"
                                        placeholder="Minimum 6 characters"
                                    />
                                    {errors.password ? (
                                        <p className="mt-2 text-xs text-red-300">{errors.password}</p>
                                    ) : null}
                                </div>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="w-full rounded-2xl bg-amber-400 px-4 py-3 font-semibold text-slate-950 transition hover:bg-amber-300 disabled:opacity-60"
                                >
                                    Enter workspace
                                </button>
                            </form>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
