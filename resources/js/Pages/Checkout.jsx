import { useForm, usePage } from '@inertiajs/react';
import Layout from './Layout';

export default function Checkout() {
    const { flash } = usePage().props;
    const { data, setData, post, processing, errors, reset } = useForm({
        amount: 1000,
    });

    const submit = (event) => {
        event.preventDefault();
        post('/checkout', {
            onSuccess: () => reset('amount'),
        });
    };

    return (
        <Layout>
            <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
                <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-6">
                    <h2 className="text-2xl font-semibold text-white">Checkout Simulator</h2>
                    <p className="mt-2 text-sm text-slate-400">
                        Simulate a paid order to trigger achievements, badges, and cashback.
                    </p>

                    {flash?.success ? (
                        <div className="mt-4 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-sm text-emerald-200">
                            {flash.success}
                        </div>
                    ) : null}

                    <form onSubmit={submit} className="mt-6 space-y-4">
                        <div>
                            <label className="text-sm text-slate-300">Order amount (NGN)</label>
                            <input
                                type="number"
                                min="100"
                                value={data.amount}
                                onChange={(event) => setData('amount', event.target.value)}
                                className="mt-2 w-full rounded-2xl border border-slate-700 bg-slate-950/60 px-4 py-3 text-slate-100 outline-none transition focus:border-amber-400"
                            />
                            {errors.amount ? (
                                <p className="mt-2 text-xs text-red-300">{errors.amount}</p>
                            ) : null}
                        </div>
                        <button
                            type="submit"
                            disabled={processing}
                            className="w-full rounded-2xl bg-amber-400 px-4 py-3 font-semibold text-slate-950 transition hover:bg-amber-300 disabled:opacity-60"
                        >
                            Pay & Unlock
                        </button>
                    </form>
                </div>

                <div className="rounded-3xl border border-slate-800 bg-gradient-to-br from-slate-900 via-slate-900/70 to-slate-950 p-6">
                    <h3 className="text-lg font-semibold text-white">Suggested Scenarios</h3>
                    <ul className="mt-4 space-y-3 text-sm text-slate-300">
                        <li>NGN 1,000 to unlock the first total spend achievement.</li>
                        <li>NGN 5,000+ to unlock the premium order achievement.</li>
                        <li>NGN 10,000 total to reach the Bronze badge.</li>
                    </ul>
                    <p className="mt-6 text-xs uppercase tracking-[0.25em] text-amber-300/70">
                        Sandbox Mode
                    </p>
                    <p className="mt-2 text-sm text-slate-400">
                        Cashback triggers a Paystack sandbox initialization and logs the response.
                    </p>
                </div>
            </div>
        </Layout>
    );
}
