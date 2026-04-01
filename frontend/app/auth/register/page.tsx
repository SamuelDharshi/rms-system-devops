'use client';
// frontend/app/auth/register/page.tsx
import { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Eye, EyeOff, Loader2, CheckCircle2 } from 'lucide-react';
import api from '@/lib/axios';
import { saveSession, dashboardPath } from '@/lib/auth';
import type { AuthUser } from '@/lib/auth';

function RegisterForm() {
  const router      = useRouter();
  const params      = useSearchParams();
  const defaultRole = (params.get('role') as 'applicant' | 'recruiter') || 'applicant';

  const [role,     setRole]    = useState<'applicant' | 'recruiter'>(defaultRole);
  const [name,     setName]    = useState('');
  const [email,    setEmail]   = useState('');
  const [company,  setCompany] = useState('');
  const [phone,    setPhone]   = useState('');
  const [password, setPass]    = useState('');
  const [showPass, setShow]    = useState(false);
  const [loading,  setLoading] = useState(false);
  const [error,    setError]   = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 8) { setError('Password must be at least 8 characters.'); return; }
    setLoading(true); setError('');
    try {
      const endpoint = role === 'applicant'
        ? '/auth/applicant/register'
        : '/auth/recruiter/register';

      const payload = role === 'applicant'
        ? { name, email, password, phone }
        : { name, email, password, companyName: company };

      const { data } = await api.post<AuthUser>(endpoint, payload);
      saveSession(data);
      router.push(dashboardPath(data.role));
    } catch (err: any) {
      const msg = err.response?.data?.message;
      setError(msg || 'Registration failed. Please try again.');
    } finally { setLoading(false); }
  };

  const perks = {
    applicant: ['Apply to open roles', 'Track every application', 'Build your profile'],
    recruiter: ['Post job listings', 'Review applicants', 'Accept or reject with one click'],
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
          <p className="text-[9px] tracking-[0.4em] uppercase text-rms-faint mb-4">NEW_USER_REGISTRATION</p>
          <h2 className="text-3xl font-medium text-rms-cream leading-tight mb-4">
            CREATE<br />ACCOUNT<span className="text-rms-yellow">.</span>
          </h2>
          <div className="mt-6 space-y-2">
            {perks[role].map((t) => (
              <div key={t} className="flex items-center gap-2 text-[9px] text-rms-faint">
                <span className="text-rms-yellow">▶</span> {t.toUpperCase()}
              </div>
            ))}
          </div>
        </div>
        <div className="terminal p-3">
          <p className="text-[9px] text-[#444] tracking-widest mb-1">REGISTRATION_LOG</p>
          <p className="terminal-row">$ init_account <span className="val">READY</span></p>
          <p className="terminal-row">$ role_selected <span className="val">{role.toUpperCase()}</span></p>
          <p className="terminal-row">$ awaiting_input<span className="cursor">_</span></p>
        </div>
      </div>

      {/* Right panel */}
      <div className="flex flex-1 items-center justify-center px-6 py-12 bg-rms-cream overflow-y-auto">
        <div className="w-full max-w-sm">
          <div className="lg:hidden mb-8">
            <span className="font-mono text-sm font-medium tracking-[0.25em] text-rms-black">
              RMS<span className="cursor">_</span>
            </span>
          </div>

          <div className="bg-white border border-rms-border border-t-2 border-t-rms-yellow p-8">
            <p className="text-[9px] tracking-[0.4em] uppercase text-rms-faint mb-1">NEW_USER</p>
            <h1 className="text-lg font-medium text-rms-black tracking-wide mb-6">REGISTER</h1>

            <div className="flex border border-rms-border mb-6">
              {(['applicant', 'recruiter'] as const).map((r) => (
                <button key={r} type="button" onClick={() => setRole(r)}
                  className={`flex-1 py-2 text-[9px] tracking-widest uppercase font-mono transition-colors ${
                    role === r ? 'bg-rms-black text-rms-yellow' : 'text-rms-faint hover:text-rms-black'
                  }`}>
                  {r}
                </button>
              ))}
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="label">FULL_NAME</label>
                <input type="text" value={name} onChange={(e) => setName(e.target.value)}
                  placeholder="Jane Smith" className="input" required />
              </div>
              <div>
                <label className="label">EMAIL_ADDRESS</label>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                  placeholder="user@example.com" className="input" required autoComplete="email" />
              </div>
              {role === 'recruiter' && (
                <div>
                  <label className="label">COMPANY_NAME</label>
                  <input type="text" value={company} onChange={(e) => setCompany(e.target.value)}
                    placeholder="Acme Corp" className="input" required />
                </div>
              )}
              {role === 'applicant' && (
                <div>
                  <label className="label">PHONE <span className="normal-case text-rms-faint">(optional)</span></label>
                  <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)}
                    placeholder="+1 555 000 0000" className="input" />
                </div>
              )}
              <div>
                <label className="label">PASSWORD</label>
                <div className="relative">
                  <input type={showPass ? 'text' : 'password'} value={password}
                    onChange={(e) => setPass(e.target.value)} placeholder="Min. 8 characters"
                    className="input pr-10" required minLength={8} autoComplete="new-password" />
                  <button type="button" onClick={() => setShow(!showPass)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-rms-faint hover:text-rms-black">
                    {showPass ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                </div>
                <div className="flex gap-0.5 mt-1.5">
                  {[8, 12, 16].map((len) => (
                    <div key={len} className={`h-0.5 flex-1 transition-colors ${
                      password.length >= len ? 'bg-rms-yellow' : 'bg-rms-border'}`} />
                  ))}
                </div>
              </div>

              {error && (
                <div className="border border-red-300 bg-red-50 px-3 py-2 text-[10px] font-mono text-red-700 tracking-wide">
                  ERROR: {error}
                </div>
              )}

              <button type="submit" disabled={loading} className="btn-primary w-full py-3">
                {loading
                  ? <><Loader2 size={14} className="animate-spin" /> CREATING_ACCOUNT...</>
                  : `REGISTER_AS_${role.toUpperCase()} →`
                }
              </button>
            </form>

            <p className="mt-6 text-center text-[9px] font-mono tracking-wide text-rms-faint">
              HAVE_ACCOUNT?{' '}
              <Link href={`/auth/login?role=${role}`}
                className="text-rms-black hover:text-rms-yellow underline underline-offset-2">
                LOGIN
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function RegisterPage() {
  return <Suspense><RegisterForm /></Suspense>;
}
