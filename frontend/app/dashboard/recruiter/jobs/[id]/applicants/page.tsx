'use client';
// frontend/app/dashboard/recruiter/jobs/[id]/applicants/page.tsx
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import DashboardLayout from '@/components/DashboardLayout';
import ApplicationCard from '@/components/ApplicationCard';
import { Loader2, ArrowLeft } from 'lucide-react';
import api from '@/lib/axios';
import type { Application, Job } from '@/types';

const FILTERS = ['ALL', 'PENDING', 'SELECTED', 'REJECTED'] as const;
type Filter = (typeof FILTERS)[number];

export default function ApplicantsPage() {
  const { id: jobId } = useParams<{ id: string }>();
  const [job,          setJob]          = useState<Job | null>(null);
  const [applications, setApplications] = useState<Application[]>([]);
  const [filter,       setFilter]       = useState<Filter>('ALL');
  const [loading,      setLoading]      = useState(true);
  const [error,        setError]        = useState('');

  useEffect(() => {
    Promise.all([
      api.get<Job>(`/jobs/${jobId}`),
      api.get<Application[]>(`/applications/job/${jobId}`),
    ]).then(([j, a]) => { setJob(j.data); setApplications(a.data); })
      .catch(() => setError('Failed to load applicants.'))
      .finally(() => setLoading(false));
  }, [jobId]);

  const handleStatus = async (id: string, status: 'SELECTED' | 'REJECTED') => {
    await api.put(`/applications/${id}/status`, { applicationStatus: status });
    setApplications((prev) => prev.map((a) => a.id === id ? { ...a, applicationStatus: status } : a));
  };

  const visible = filter === 'ALL'
    ? applications
    : applications.filter((a) => a.applicationStatus === filter);

  return (
    <DashboardLayout heading="APPLICANTS">
      <div className="space-y-5">

        <Link href="/dashboard/recruiter/jobs" className="inline-flex items-center gap-2 text-[9px] tracking-widest text-rms-faint hover:text-rms-black uppercase">
          <ArrowLeft size={12} /> BACK_TO_LISTINGS
        </Link>

        {/* Job summary */}
        {job && (
          <div className="bg-rms-black border-l-2 border-rms-yellow p-4">
            <p className="text-sm font-medium text-rms-cream tracking-wide">{job.title}</p>
            <div className="flex flex-wrap gap-4 mt-1 text-[9px] text-rms-faint tracking-widest">
              <span>{job.location?.toUpperCase()}</span>
              <span className={job.status === 'OPEN' ? 'text-rms-yellow' : 'text-rms-faint'}>
                {job.status === 'OPEN' ? '● OPEN' : '○ CLOSED'}
              </span>
              <span>{applications.length} TOTAL APPLICANT{applications.length !== 1 ? 'S' : ''}</span>
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="flex flex-wrap gap-0 border border-rms-border bg-white w-fit">
          {FILTERS.map((f) => {
            const count = f === 'ALL' ? applications.length : applications.filter((a) => a.applicationStatus === f).length;
            return (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-2 text-[9px] tracking-widest font-mono uppercase border-r border-rms-border transition-colors last:border-r-0 ${
                  filter === f ? 'bg-rms-black text-rms-yellow' : 'text-rms-faint hover:text-rms-black'
                }`}
              >
                {f} ({count})
              </button>
            );
          })}
        </div>

        {loading && (
          <div className="flex justify-center py-16">
            <Loader2 size={20} className="animate-spin" />
            <span className="ml-3 text-[10px] tracking-widest text-rms-muted">LOADING...</span>
          </div>
        )}

        {!loading && error && (
          <div className="border border-red-300 bg-red-50 px-4 py-2 text-[10px] font-mono text-red-700">
            ERROR: {error}
          </div>
        )}

        {!loading && !error && visible.length === 0 && (
          <div className="bg-white border border-rms-border p-12 text-center">
            <p className="text-[9px] tracking-[0.3em] uppercase text-rms-faint">
              {filter === 'ALL' ? 'NO_APPLICANTS_YET' : `NO_${filter}_APPLICATIONS`}
            </p>
          </div>
        )}

        {!loading && visible.length > 0 && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {visible.map((app) => (
              <ApplicationCard
                key={app.id}
                application={app}
                recruiterView
                onSelect={(id) => handleStatus(id, 'SELECTED')}
                onReject={(id) => handleStatus(id, 'REJECTED')}
              />
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
