'use client';
// frontend/app/dashboard/recruiter/page.tsx
import { useEffect, useState } from 'react';
import Link from 'next/link';
import DashboardLayout from '@/components/DashboardLayout';
import { Loader2 } from 'lucide-react';
import api from '@/lib/axios';
import { getUser } from '@/lib/auth';
import type { Job, Recruiter } from '@/types';

export default function RecruiterDashboard() {
  const user = getUser();
  const [profile, setProfile] = useState<Recruiter | null>(null);
  const [jobs,    setJobs]    = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get<Recruiter>('/recruiters/profile'),
      api.get<Job[]>('/jobs/recruiter/my'),
    ]).then(([p, j]) => { setProfile(p.data); setJobs(j.data); })
      .finally(() => setLoading(false));
  }, []);

  const openJobs       = jobs.filter((j) => j.status === 'OPEN').length;
  const totalApplicants = jobs.reduce((sum, j) => sum + (j.applicationCount ?? 0), 0);
  const recent         = jobs.slice(0, 5);

  return (
    <DashboardLayout heading="OVERVIEW">
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 size={20} className="animate-spin" />
        </div>
      ) : (
        <div className="space-y-6">
          {/* Welcome */}
          <div className="bg-rms-black border-l-2 border-rms-yellow p-5">
            <p className="text-[9px] tracking-[0.4em] uppercase text-rms-faint mb-1">LOGGED_IN_AS</p>
            <p className="text-sm font-medium text-rms-cream tracking-wide">{profile?.name ?? user?.email}</p>
            <p className="text-[9px] text-rms-yellow tracking-widest mt-0.5">{profile?.companyName?.toUpperCase()} · RECRUITER</p>
            <div className="flex gap-3 mt-4">
              <Link href="/dashboard/recruiter/post-job" className="btn-yellow text-[9px] py-1.5 px-4">POST_A_JOB →</Link>
              <Link href="/dashboard/recruiter/jobs" className="btn-ghost text-[9px] py-1.5 px-4 border-[#444] text-rms-faint hover:text-rms-cream hover:border-rms-faint">MANAGE_LISTINGS</Link>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: 'TOTAL_LISTINGS',  value: jobs.length        },
              { label: 'OPEN_JOBS',       value: openJobs           },
              { label: 'TOTAL_APPLICANTS',value: totalApplicants    },
            ].map(({ label, value }, i) => (
              <div key={label} className={`bg-white border border-rms-border p-4 ${i === 0 ? 'border-l-2 border-l-rms-yellow' : ''}`}>
                <p className="text-[8px] tracking-[0.3em] text-rms-faint mb-2">{label}</p>
                <p className="text-3xl font-medium text-rms-black">{String(value).padStart(2, '0')}</p>
              </div>
            ))}
          </div>

          {/* Listings */}
          <div className="bg-white border border-rms-border">
            <div className="flex items-center justify-between px-4 py-3 border-b border-rms-border">
              <p className="text-[9px] tracking-[0.3em] uppercase text-rms-faint">YOUR_LISTINGS</p>
              <Link href="/dashboard/recruiter/jobs" className="text-[9px] tracking-widest text-rms-black hover:text-rms-yellow uppercase">
                MANAGE_ALL →
              </Link>
            </div>

            {recent.length === 0 ? (
              <div className="p-8 text-center">
                <p className="text-[9px] tracking-widest text-rms-faint mb-4">NO_LISTINGS_YET</p>
                <Link href="/dashboard/recruiter/post-job" className="btn-primary text-[9px] py-2 inline-flex">POST_FIRST_JOB →</Link>
              </div>
            ) : (
              <div className="divide-y divide-rms-border">
                {recent.map((job, i) => (
                  <div key={job.id} className="flex items-center gap-3 px-4 py-3 hover:bg-rms-cream transition-colors">
                    <span className="text-[9px] text-rms-faint font-mono w-5">{String(i + 1).padStart(2, '0')}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-[10px] font-medium text-rms-black truncate tracking-wide">{job.title}</p>
                      <p className="text-[9px] text-rms-faint tracking-widest">{job.location?.toUpperCase()}</p>
                    </div>
                    <span className="text-[9px] text-rms-faint">{job.applicationCount ?? 0} APPS</span>
                    <span className={`badge ${job.status === 'OPEN' ? 'badge-open' : 'badge-closed'}`}>
                      {job.status === 'OPEN' ? '● OPEN' : '○ CLOSED'}
                    </span>
                    <Link href={`/dashboard/recruiter/jobs/${job.id}/applicants`}
                      className="text-[9px] tracking-widest text-rms-black hover:text-rms-yellow uppercase">
                      VIEW →
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Terminal */}
          <div className="terminal">
            <p className="text-[8px] tracking-[0.3em] text-[#444] mb-2">SYSTEM_STATUS.LOG</p>
            <p className="terminal-row">$ total_listings <span className="val">{jobs.length}</span></p>
            <p className="terminal-row">$ open_positions <span className="ok">{openJobs}</span></p>
            <p className="terminal-row">$ total_applicants <span className="val">{totalApplicants}</span></p>
            <p className="terminal-row">$ company <span className="val">{profile?.companyName?.toUpperCase()}</span></p>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
