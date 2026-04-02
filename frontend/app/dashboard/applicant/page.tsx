'use client';
// frontend/app/dashboard/applicant/page.tsx
import { useEffect, useState } from 'react';
import Link from 'next/link';
import DashboardLayout from '@/components/DashboardLayout';
import { Loader2 } from 'lucide-react';
import api from '@/lib/axios';
import { getUser } from '@/lib/auth';
import type { Application, Applicant } from '@/types';

export default function ApplicantDashboard() {
  const user = getUser();
  const [profile,      setProfile]      = useState<Applicant | null>(null);
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading,      setLoading]      = useState(true);

  useEffect(() => {
    Promise.all([
      api.get<Applicant>('/applicants/profile'),
      api.get<Application[]>('/applications/my'),
    ]).then(([p, a]) => { setProfile(p.data); setApplications(a.data); })
      .finally(() => setLoading(false));
  }, []);

  const stats = {
    total:    applications.length,
    pending:  applications.filter((a) => a.applicationStatus === 'PENDING').length,
    selected: applications.filter((a) => a.applicationStatus === 'SELECTED').length,
    rejected: applications.filter((a) => a.applicationStatus === 'REJECTED').length,
  };

  const recent = applications.slice(0, 4);

   // profileDetails is a JSON string from Java
  const pd = (() => {
    try { return profile?.profileDetails ? JSON.parse(profile.profileDetails) : {}; }
    catch { return {}; }
  })();

  return (
    <DashboardLayout heading="OVERVIEW">
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 size={20} className="animate-spin" />
          <span className="ml-3 text-[10px] tracking-widest text-rms-muted">LOADING...</span>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Welcome */}
          <div className="bg-rms-black border-l-2 border-rms-yellow p-5">
            <p className="text-[9px] tracking-[0.4em] uppercase text-rms-faint mb-1">LOGGED_IN_AS</p>
            <p className="text-sm font-medium text-rms-cream tracking-wide">
              {profile?.name ?? user?.email}
            </p>
            <p className="text-[9px] text-rms-yellow tracking-widest mt-0.5">APPLICANT</p>
            <div className="flex gap-3 mt-4">
              <Link href="/jobs" className="btn-yellow text-[9px] py-1.5 px-4">BROWSE_JOBS →</Link>
              <Link href="/dashboard/applicant/applications" className="btn-ghost text-[9px] py-1.5 px-4 border-[#444] text-rms-faint hover:text-rms-cream hover:border-rms-faint">MY_APPLICATIONS</Link>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {[
              { label: 'TOTAL_APPLIED', value: stats.total,    accent: true  },
              { label: 'PENDING',       value: stats.pending,  accent: false },
              { label: 'SELECTED',      value: stats.selected, accent: false },
              { label: 'REJECTED',      value: stats.rejected, accent: false },
            ].map(({ label, value, accent }) => (
              <div key={label} className={`bg-white border border-rms-border p-4 ${accent ? 'border-l-2 border-l-rms-yellow' : ''}`}>
                <p className="text-[8px] tracking-[0.3em] text-rms-faint mb-2">{label}</p>
                <p className="text-3xl font-medium text-rms-black">{String(value).padStart(2, '0')}</p>
              </div>
            ))}
          </div>

          <div className="grid lg:grid-cols-2 gap-5">
            {/* Recent applications */}
            <div className="bg-white border border-rms-border">
              <div className="flex items-center justify-between px-4 py-3 border-b border-rms-border">
                <p className="text-[9px] tracking-[0.3em] uppercase text-rms-faint">RECENT_APPLICATIONS</p>
                <Link href="/dashboard/applicant/applications" className="text-[9px] tracking-widest text-rms-black hover:text-rms-yellow uppercase">
                  VIEW_ALL →
                </Link>
              </div>
              {recent.length === 0 ? (
                <div className="p-6 text-center">
                  <p className="text-[9px] tracking-widest text-rms-faint">NO_APPLICATIONS_YET</p>
                  <Link href="/jobs" className="btn-primary text-[9px] py-1.5 mt-4 inline-flex">BROWSE_JOBS</Link>
                </div>
              ) : (
                <div className="divide-y divide-rms-border">
                  {recent.map((app, i) => (
                    <div key={app.id} className="flex items-center gap-3 px-4 py-3 hover:bg-rms-cream transition-colors">
                      <span className="text-[9px] text-rms-faint font-mono w-5">{String(i + 1).padStart(2, '0')}</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-[10px] font-medium text-rms-black truncate tracking-wide">{app.job.title}</p>
                        <p className="text-[9px] text-rms-faint tracking-widest">{app.job.recruiter?.companyName?.toUpperCase()}</p>
                      </div>
                      <span className={`badge ${app.applicationStatus === 'PENDING' ? 'badge-pending' : app.applicationStatus === 'SELECTED' ? 'badge-selected' : 'badge-rejected'}`}>
                        ● {app.applicationStatus}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Profile + Terminal */}
            <div className="space-y-4">
              {/* Profile completion */}
              {(() => {
                const pd = profile?.profileDetails as any;
                const fields = [
                  { label: 'NAME',       done: !!profile?.name      },
                  { label: 'PHONE',      done: !!profile?.phone     },
                  { label: 'BIO',        done: !!pd?.bio            },
                  { label: 'SKILLS',     done: !!(pd?.skills?.length)},
                  { label: 'EXPERIENCE', done: !!pd?.experience     },
                ];
                const pct = Math.round((fields.filter((f) => f.done).length / fields.length) * 100);
                return (
                  <div className="bg-white border border-rms-border">
                    <div className="px-4 py-3 border-b border-rms-border">
                      <p className="text-[9px] tracking-[0.3em] uppercase text-rms-faint">PROFILE_STRENGTH</p>
                    </div>
                    <div className="p-4">
                      <div className="flex justify-between text-[9px] mb-2">
                        <span className="tracking-widest text-rms-faint">COMPLETION</span>
                        <span className="text-rms-yellow font-medium">{pct}%</span>
                      </div>
                      <div className="h-1 bg-rms-border mb-4">
                        <div className="h-1 bg-rms-yellow transition-all" style={{ width: `${pct}%` }} />
                      </div>
                      <div className="space-y-1.5">
                        {fields.map(({ label, done }) => (
                          <div key={label} className="flex items-center gap-2 text-[9px]">
                            <span className={done ? 'text-green-500' : 'text-rms-faint'}>
                              {done ? '▶' : '○'}
                            </span>
                            <span className={`tracking-widest ${done ? 'text-rms-black' : 'text-rms-faint'}`}>{label}</span>
                          </div>
                        ))}
                      </div>
                      {pct < 100 && (
                        <Link href="/dashboard/applicant/profile" className="btn-ghost text-[9px] py-1.5 w-full justify-center mt-4">
                          COMPLETE_PROFILE
                        </Link>
                      )}
                    </div>
                  </div>
                );
              })()}

              {/* Terminal */}
              <div className="terminal">
                <p className="text-[8px] tracking-[0.3em] text-[#444] mb-2">SYSTEM_STATUS.LOG</p>
                <p className="terminal-row">$ total_applications <span className="val">{stats.total}</span></p>
                <p className="terminal-row">$ pending_responses <span className="val">{stats.pending}</span></p>
                <p className="terminal-row">$ selected <span className="ok">{stats.selected}</span></p>
                <p className="terminal-row">$ rejected <span className="err">{stats.rejected}</span></p>
              </div>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
