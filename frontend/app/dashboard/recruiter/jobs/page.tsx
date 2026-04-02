'use client';
// frontend/app/dashboard/recruiter/jobs/page.tsx
import { useEffect, useState } from 'react';
import Link from 'next/link';
import DashboardLayout from '@/components/DashboardLayout';
import JobCard from '@/components/JobCard';
import { Loader2 } from 'lucide-react';
import api from '@/lib/axios';
import type { Job } from '@/types';

export default function RecruiterJobsPage() {
  const [jobs,    setJobs]    = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState('');

  useEffect(() => {
    api.get<Job[]>('/jobs/recruiter/my')
      .then(({ data }) => setJobs(data))
      .catch(() => setError('Failed to load listings.'))
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this listing? All applications will also be removed.')) return;
    await api.delete(`/jobs/${id}`);
    setJobs((prev) => prev.filter((j) => j.id !== id));
  };

  return (
    <DashboardLayout heading="MY_LISTINGS">
      <div className="space-y-5">

        {/* Toolbar */}
        <div className="flex items-center justify-between">
          <p className="text-[9px] tracking-[0.3em] uppercase text-rms-faint">
            {loading ? '...' : `${jobs.length} LISTING${jobs.length !== 1 ? 'S' : ''}`}
          </p>
          <Link href="/dashboard/recruiter/post-job" className="btn-yellow text-[9px] py-2 px-5">
            + POST_NEW_JOB
          </Link>
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

        {!loading && !error && jobs.length === 0 && (
          <div className="bg-white border border-rms-border p-12 text-center">
            <p className="text-[9px] tracking-[0.3em] uppercase text-rms-faint mb-4">NO_LISTINGS_FOUND</p>
            <Link href="/dashboard/recruiter/post-job" className="btn-primary text-[9px] py-2 inline-flex">
              POST_FIRST_JOB →
            </Link>
          </div>
        )}

        {!loading && jobs.length > 0 && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {jobs.map((job) => (
              <JobCard key={job.id} job={job} recruiterView onDelete={handleDelete} />
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
