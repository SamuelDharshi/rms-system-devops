'use client';
// frontend/components/Navbar.tsx
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { Menu, X, LogOut, ChevronDown } from 'lucide-react';
import { getUser, clearSession, dashboardPath, type AuthUser } from '@/lib/auth';

export default function Navbar() {
  const router   = useRouter();
  const pathname = usePathname();
  const [user, setUser]     = useState<AuthUser | null>(null);
  const [menu, setMenu]     = useState(false);
  const [drop, setDrop]     = useState(false);

  useEffect(() => { setUser(getUser()); }, []);

  const logout = () => {
  clearSession();
  setUser(null);
  setDrop(false);
  setMenu(false);
  router.push('/');
};
  const navLinks = [
    { label: 'JOBS',      href: '/jobs'                                      },
    ...(user ? [{ label: 'DASHBOARD', href: dashboardPath(user.role) }] : []),
  ];

  return (
    <nav className="bg-rms-black border-b-2 border-rms-yellow sticky top-0 z-50">
      <div className="flex h-11 items-center justify-between px-5">

        {/* Logo */}
        <Link href="/" className="flex items-center">
          <span className="font-mono text-sm font-medium tracking-[0.25em] text-rms-cream">
            RMS<span className="cursor">_</span>
          </span>
        </Link>

        {/* Desktop nav links */}
        <div className="hidden md:flex">
          {navLinks.map(({ label, href }) => {
            const active = pathname === href || pathname.startsWith(href + '/');
            return (
              <Link
                key={href}
                href={href}
                className={`flex items-center h-11 px-4 font-mono text-[10px] tracking-widest border-l border-[#333] transition-colors ${
                  active ? 'text-rms-cream bg-rms-dark' : 'text-rms-faint hover:text-rms-cream hover:bg-rms-dark'
                }`}
              >
                {label}
              </Link>
            );
          })}
        </div>

        {/* Auth area */}
        <div className="hidden md:flex items-center gap-3">
          {user ? (
            <div className="relative">
              <button
                onClick={() => setDrop(!drop)}
                className="flex items-center gap-2 h-11 px-4 font-mono text-[10px] tracking-wide text-rms-faint border-l border-[#333] hover:text-rms-cream hover:bg-rms-dark transition-colors"
              >
                <span className="uppercase">{user.email.split('@')[0]}</span>
                <span className="text-[8px] text-rms-yellow uppercase border border-rms-yellow px-1">
                  {user.role}
                </span>
                <ChevronDown size={12} className={`transition-transform ${drop ? 'rotate-180' : ''}`} />
              </button>

              {drop && (
                <div className="absolute right-0 top-full mt-0 w-48 bg-rms-black border border-[#444] border-t-2 border-t-rms-yellow z-50">
                  <Link
                    href={dashboardPath(user.role)}
                    onClick={() => setDrop(false)}
                    className="flex items-center px-4 py-3 text-[10px] font-mono tracking-widest text-rms-faint hover:text-rms-cream hover:bg-rms-dark transition-colors uppercase"
                  >
                    Dashboard
                  </Link>
                  <button
                    onClick={logout}
                    className="w-full flex items-center gap-2 px-4 py-3 text-[10px] font-mono tracking-widest text-red-400 hover:bg-rms-dark transition-colors uppercase"
                  >
                    <LogOut size={12} /> Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link
                href="/auth/login"
                className="flex items-center h-11 px-4 font-mono text-[10px] tracking-widest text-rms-faint border-l border-[#333] hover:text-rms-cream hover:bg-rms-dark transition-colors uppercase"
              >
                Log In
              </Link>
              <Link
                href="/auth/register"
                className="flex items-center h-11 px-4 font-mono text-[10px] tracking-widest bg-rms-yellow text-rms-black font-medium hover:bg-yellow-300 transition-colors uppercase"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>

        {/* Mobile toggle */}
        <button
          className="md:hidden text-rms-faint hover:text-rms-cream p-2"
          onClick={() => setMenu(!menu)}
        >
          {menu ? <X size={18} /> : <Menu size={18} />}
        </button>
      </div>

      {/* Mobile menu */}
      {menu && (
        <div className="md:hidden border-t border-[#333] bg-rms-black">
          {navLinks.map(({ label, href }) => (
            <Link
              key={href}
              href={href}
              onClick={() => setMenu(false)}
              className="flex items-center px-5 py-3 font-mono text-[10px] tracking-widest text-rms-faint hover:text-rms-cream hover:bg-rms-dark uppercase border-b border-[#333]"
            >
              {label}
            </Link>
          ))}
          {user ? (
            <button
              onClick={logout}
              className="w-full flex items-center gap-2 px-5 py-3 font-mono text-[10px] tracking-widest text-red-400 hover:bg-rms-dark uppercase"
            >
              <LogOut size={12} /> Logout
            </button>
          ) : (
            <>
              <Link href="/auth/login" onClick={() => setMenu(false)} className="flex items-center px-5 py-3 font-mono text-[10px] tracking-widest text-rms-faint hover:text-rms-cream uppercase border-b border-[#333]">Log In</Link>
              <Link href="/auth/register" onClick={() => setMenu(false)} className="flex items-center px-5 py-3 font-mono text-[10px] tracking-widest text-rms-black bg-rms-yellow uppercase font-medium">Sign Up</Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
}
