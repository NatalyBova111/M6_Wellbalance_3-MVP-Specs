'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function SignUpPage() {
  const router = useRouter();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrorMessage(null);
    setMessage(null);
    setLoading(true);

    try {
      const redirectTo =
        (process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000') +
        '/auth/callback';

      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { full_name: fullName },
          emailRedirectTo: redirectTo,
        },
      });

      if (error) {
        setErrorMessage(error.message);
        return;
      }

      setMessage(
        'Your account has been created. Please check your email to confirm your registration.'
      );
      setFullName('');
      setEmail('');
      setPassword('');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-linear-to-br from-green-50 via-emerald-50/40 to-teal-50/30 flex items-center justify-center px-4">
      <div className="w-full max-w-4xl bg-white/80 backdrop-blur-xl shadow-xl rounded-3xl border border-emerald-100 grid md:grid-cols-2 overflow-hidden">
       
        {/* Left side */}
        <div className="bg-linear-to-br from-emerald-100 via-emerald-50 to-white p-8 md:p-10 flex flex-col justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-white/80 px-3 py-1 text-xs font-medium text-emerald-700 shadow-xs mb-4">
              <span className="inline-block h-2 w-2 rounded-full bg-emerald-500" />
              Wellness Tracker
            </div>
            <h1 className="text-2xl md:text-3xl font-semibold text-emerald-900 mb-3">
              Start your wellness journey
            </h1>
            <p className="text-sm text-emerald-800/80">
              Track your meals, water, and sleep to understand your habits and feel better every day.
            </p>
          </div>
          <p className="mt-8 text-xs text-emerald-700/80">
            “Take care of your body. It’s the only place you have to live.”
          </p>
        </div>

        {/* Right side — Form */}
        <div className="p-8 md:p-10">
          <div className="flex justify-between items-center mb-6">
            <div>
              <p className="text-xs uppercase tracking-wide text-emerald-500 font-semibold">
                Create account
              </p>
              <h2 className="text-xl font-semibold text-slate-900">
                Sign up to WellBalance
              </h2>
            </div>
            <div className="inline-flex rounded-full bg-slate-100 p-1 text-xs">
              <Button
                variant="outline"
                className="h-7 px-3 text-xs rounded-full border-0 bg-white shadow-sm"
              >
                Sign up
              </Button>
              <Button
                variant="ghost"
                className="h-7 px-3 text-xs rounded-full text-slate-500"
                type="button"
                onClick={() => router.push('/login')}
              >
                Log in
              </Button>
            </div>
          </div>

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-700">
                Full name
              </label>
              <Input
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Enter your name"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-700">
                Email
              </label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-700">
                Password
              </label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Create a password"
                required
              />
            </div>

            {errorMessage && (
              <p className="text-sm text-red-600">{errorMessage}</p>
            )}
            {message && (
              <p className="text-sm text-emerald-600">{message}</p>
            )}

            <Button
              type="submit"
              disabled={loading}
              className="w-full mt-2 bg-emerald-500 hover:bg-emerald-600"
            >
              {loading ? 'Creating account…' : 'Create account'}
            </Button>
          </form>

          <p className="mt-4 text-xs text-slate-500">
            Already have an account?{' '}
            <button
              type="button"
              onClick={() => router.push('/login')}
              className="text-emerald-600 underline-offset-2 hover:underline"
            >
              Log in
            </button>
          </p>
        </div>
      </div>
    </main>
  );
}
