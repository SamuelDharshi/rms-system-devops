'use client';
// frontend/app/dashboard/applicant/applications/page.tsx
import { useEffect, useState } from 'react';
import Link from 'next/link';
import DashboardLayout from '@/components/DashboardLayout';
import ApplicationCard from '@/components/ApplicationCard';
import { Loader2 } from 'lucide-react';
import api from '@/lib/axios';
import type { Application } from '@/types';

const FILTERS = ['ALL', 'PENDING', 'SELECTED', 'REJECTED'] as const;
type Filter = (typeof FILTERS)[number];

export default function MyApplicationsPage() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [filter,       setFilter]       = useState<Filter>('ALL');
  const [loading,      setLoading]      = useState(true);

  useEffect(() => {
    api.get<Application[]>('/applications/my')
      .then(({ data }) => setApplications(data))
      .finally(() => setLoading(false));
  }, []);

  const handleWithdraw = async (id: string) => {
    if (!confirm('Withdraw this application?')) return;
    await api.delete(`/applications/${id}`);
    setApplications((prev) => prev.filter((a) => a.id !== id));
  };

  const visible = filter === 'ALL'
    ? applications
    : applications.filter((a) => a.applicationStatus === filter);

  return (
    <DashboardLayout heading="MY_APPLICATIONS">
      <div className="space-y-5">
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

        {!loading && visible.length === 0 && (
          <div className="bg-white border border-rms-border p-12 text-center">
            <p className="text-[9px] tracking-[0.3em] uppercase text-rms-faint">NO_RESULTS_FOUND</p>
            {filter === 'ALL' && (
              <Link href="/jobs" className="btn-primary text-[9px] py-2 mt-4 inline-flex">BROWSE_JOBS →</Link>
            )}
          </div>
        )}

        {!loading && visible.length > 0 && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {visible.map((app) => (
              <ApplicationCard key={app.id} application={app} onWithdraw={handleWithdraw} />
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
