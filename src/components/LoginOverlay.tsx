import { useState } from 'react';
import { supabase } from '../lib/supabase';

interface LoginOverlayProps {
    onLogin: (email: string) => void;
}

export function LoginOverlay({ onLogin }: LoginOverlayProps) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        // MASTER ADMIN BYPASS (Standardized)
        if (email === 'jucaalgo' && password === '13470811') {
            console.log("Master Admin Access Granted");
            onLogin('jucaalgo (Master)');
            setLoading(false);
            return;
        }

        // Supabase Auth Fallback
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        setLoading(false);

        if (error) {
            setError(error.message);
        } else if (data.user?.email) {
            onLogin(data.user.email);
        }
    };

    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-950/90 backdrop-blur-md">
            <div className="w-full max-w-md rounded-2xl bg-slate-900 p-8 shadow-2xl border border-purple-500/20">
                <div className="mb-8 text-center">
                    <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
                        Antigravity Architect
                    </h2>
                    <p className="mt-2 text-slate-400 text-sm">Restricted Area. Authorized Personnel Only.</p>
                </div>

                <form onSubmit={handleLogin} className="space-y-6">
                    <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Identity</label>
                        <input
                            type="text"
                            required
                            className="block w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-3 text-white placeholder-slate-600 focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500 transition-all"
                            placeholder="username"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Access Key</label>
                        <input
                            type="password"
                            required
                            className="block w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-3 text-white placeholder-slate-600 focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500 transition-all"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>

                    {error && (
                        <div className="rounded-lg bg-red-500/10 p-3 text-sm text-red-400 border border-red-500/20">
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 px-4 py-3 font-bold text-white shadow-lg transition-all hover:from-purple-500 hover:to-pink-500 disabled:opacity-50 hover:scale-[1.02] active:scale-95"
                    >
                        {loading ? 'Verifying...' : 'Initialize System'}
                    </button>
                </form>
            </div>
        </div>
    );
}
