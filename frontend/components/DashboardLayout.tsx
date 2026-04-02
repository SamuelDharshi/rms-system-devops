'use client';
// frontend/components/DashboardLayout.tsx
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Menu, X, LogOut, ChevronRight } from 'lucide-react';
import { getUser, clearSession, type AuthUser } from '@/lib/auth';

interface NavLink { label: string; href: string; }

const APPLICANT_LINKS: NavLink[] = [
  { label: 'OVERVIEW',         href: '/dashboard/applicant'              },
  { label: 'BROWSE JOBS',      href: '/jobs'                             },
  { label: 'MY APPLICATIONS',  href: '/dashboard/applicant/applications' },
  { label: 'PROFILE',          href: '/dashboard/applicant/profile'      },
];

const RECRUITER_LINKS: NavLink[] = [
  { label: 'OVERVIEW',         href: '/dashboard/recruiter'              },
  { label: 'POST A JOB',       href: '/dashboard/recruiter/post-job'     },
  { label: 'MY LISTINGS',      href: '/dashboard/recruiter/jobs'         },
];

export default function DashboardLayout({ children, heading }: { children: React.ReactNode; heading?: string }) {
  const pathname = usePathname();
  const router   = useRouter();
  const [user, setUser]   = useState<AuthUser | null>(null);
  const [open, setOpen]   = useState(false);

  useEffect(() => {
    const u = getUser();
    if (!u) { router.replace('/auth/login'); return; }
    setUser(u);
  }, []);

  const links = user?.role === 'recruiter' ? RECRUITER_LINKS : APPLICANT_LINKS;

  const logout = () => { clearSession(); router.push('/'); };

  return (
    <div className="flex h-screen overflow-hidden bg-rms-cream font-mono">

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-40 flex flex-col w-52 bg-rms-black border-r-2 border-rms-yellow
        transform transition-transform duration-200 ease-in-out
        lg:relative lg:translate-x-0
        ${open ? 'translate-x-0' : '-translate-x-full'}
      `}>
        {/* Logo */}
        <div className="flex h-11 items-center justify-between px-4 border-b border-[#333]">
          <span className="font-mono text-sm font-medium tracking-[0.25em] text-rms-cream">
            RMS<span className="cursor">_</span>
          </span>
          <button className="lg:hidden text-rms-faint hover:text-rms-cream p-1" onClick={() => setOpen(false)}>
            <X size={16} />
          </button>
        </div>

        {/* User info */}
        {user && (
          <div className="px-4 py-3 border-b border-[#333]">
            <p className="text-[9px] font-mono tracking-[0.25em] uppercase text-rms-faint mb-0.5">{user.role}</p>
            <p className="text-[10px] font-mono text-rms-cream truncate">{user.email}</p>
          </div>
        )}

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto py-3">
          <div className="px-3.5 mb-2">
            <p className="text-[8px] font-mono tracking-[0.3em] uppercase text-[#444] mb-1">NAVIGATION</p>
          </div>
          {links.map(({ label, href }) => {
            const active = pathname === href || (href !== '/jobs' && pathname.startsWith(href));
            return (
              <Link
                key={href}
                href={href}
                onClick={() => setOpen(false)}
                className={active ? 'sidebar-item-active' : 'sidebar-item'}
              >
                <span className="text-[9px] tracking-widest flex-1">{label}</span>
                {active && <ChevronRight size={11} className="text-rms-yellow" />}
              </Link>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="border-t border-[#333] p-2">
          <button
            onClick={logout}
            className="sidebar-item w-full text-red-400 hover:text-red-300 hover:bg-red-950"
          >
            <LogOut size={13} />
            <span className="text-[9px] tracking-widest">LOGOUT</span>
          </button>
        </div>
      </aside>

      {/* Overlay */}
      {open && (
        <div className="fixed inset-0 z-30 bg-black/50 lg:hidden" onClick={() => setOpen(false)} />
      )}

      {/* Main */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Top bar */}
        <header className="flex h-11 items-center gap-4 border-b-2 border-rms-yellow bg-rms-black px-5">
          <button className="lg:hidden text-rms-faint hover:text-rms-cream" onClick={() => setOpen(true)}>
            <Menu size={18} />
          </button>
          {heading && (
            <h1 className="font-mono text-xs font-medium tracking-widest uppercase text-rms-cream">
              {heading}
            </h1>
          )}
          <div className="ml-auto">
            <span className="text-[8px] font-mono tracking-[0.3em] uppercase text-[#444]">
              SYSTEM_ONLINE ●
            </span>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-5 bg-rms-cream">
          {children}
        </main>
      </div>
    </div>
  );
}
