'use client';
// frontend/app/auth/login/page.tsx
import { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import api from '@/lib/axios';
import { saveSession, dashboardPath } from '@/lib/auth';
import type { AuthUser } from '@/lib/auth';

function LoginForm() {
  const router      = useRouter();
  const params      = useSearchParams();
  const defaultRole = (params.get('role') as 'applicant' | 'recruiter') || 'applicant';

  const [role,     setRole]    = useState<'applicant' | 'recruiter'>(defaultRole);
  const [email,    setEmail]   = useState('');
  const [password, setPass]    = useState('');
  const [showPass, setShow]    = useState(false);
  const [loading,  setLoading] = useState(false);
  const [error,    setError]   = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const { data } = await api.post<AuthUser>('/auth/login', {
        email,
        password,
        role,
      });
      saveSession(data);
      router.push(dashboardPath(data.role));
    } catch (err: any) {
      const msg = err.response?.data?.message;
      setError(msg || 'Invalid credentials. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex font-mono">
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-rms-black flex-col justify-between p-12 border-r-2 border-rms-yellow">
        <div>
          <span className="font-mono text-sm font-medium tracking-[0.25em] text-rms-cream">
            RMS<span className="cursor">_</span>
          </span>
        </div>
        <div>
          <p className="text-[9px] tracking-[0.4em] uppercase text-rms-faint mb-4">SYSTEM_ACCESS</p>
          <h2 className="text-3xl font-medium text-rms-cream leading-tight mb-4">
            WELCOME<br />BACK<span className="text-rms-yellow">.</span>
          </h2>
          <p className="text-[10px] text-rms-faint leading-relaxed max-w-xs">
            Track applications, discover opportunities, and connect with the right companies.
          </p>
          <div className="mt-10 space-y-2">
            {['10K+ open positions', '50K+ registered candidates', '94% placement rate'].map((t) => (
              <div key={t} className="flex items-center gap-2 text-[9px] text-rms-faint">
                <span className="text-rms-yellow">▶</span> {t.toUpperCase()}
              </div>
            ))}
          </div>
        </div>
        <div className="terminal p-3">
          <p className="text-[9px] text-[#444] tracking-widest mb-1">SYSTEM_LOG</p>
          <p className="terminal-row">$ auth_service <span className="val">ONLINE</span></p>
          <p className="terminal-row">$ database <span className="ok">CONNECTED</span></p>
          <p className="terminal-row">$ awaiting_credentials<span className="cursor">_</span></p>
        </div>
      </div>

      {/* Right panel */}
      <div className="flex flex-1 items-center justify-center px-6 py-12 bg-rms-cream">
        <div className="w-full max-w-sm">
          <div className="lg:hidden mb-8">
            <span className="font-mono text-sm font-medium tracking-[0.25em] text-rms-black">
              RMS<span className="cursor">_</span>
            </span>
          </div>

          <div className="bg-white border border-rms-border border-t-2 border-t-rms-yellow p-8">
            <p className="text-[9px] tracking-[0.4em] uppercase text-rms-faint mb-1">SYSTEM_ACCESS</p>
            <h1 className="text-lg font-medium text-rms-black tracking-wide mb-6">SIGN_IN</h1>

            {/* Role toggle */}
            <div className="flex border border-rms-border mb-6">
              {(['applicant', 'recruiter'] as const).map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setRole(r)}
                  className={`flex-1 py-2 text-[9px] tracking-widest uppercase font-mono transition-colors ${
                    role === r ? 'bg-rms-black text-rms-yellow' : 'text-rms-faint hover:text-rms-black'
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="label">EMAIL_ADDRESS</label>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                  placeholder="user@example.com" className="input" required autoComplete="email" />
              </div>
              <div>
                <label className="label">PASSWORD</label>
                <div className="relative">
                  <input type={showPass ? 'text' : 'password'} value={password}
                    onChange={(e) => setPass(e.target.value)} placeholder="••••••••"
                    className="input pr-10" required autoComplete="current-password" />
                  <button type="button" onClick={() => setShow(!showPass)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-rms-faint hover:text-rms-black">
                    {showPass ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                </div>
              </div>

              {error && (
                <div className="border border-red-300 bg-red-50 px-3 py-2 text-[10px] font-mono text-red-700 tracking-wide">
                  ERROR: {error}
                </div>
              )}

              <button type="submit" disabled={loading} className="btn-primary w-full py-3">
                {loading
                  ? <><Loader2 size={14} className="animate-spin" /> AUTHENTICATING...</>
                  : 'LOGIN →'}
              </button>
            </form>

            <p className="mt-6 text-center text-[9px] font-mono tracking-wide text-rms-faint">
              NO_ACCOUNT?{' '}
              <Link href={`/auth/register?role=${role}`}
                className="text-rms-black hover:text-rms-yellow underline underline-offset-2">
                REGISTER
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return <Suspense><LoginForm /></Suspense>;
}
