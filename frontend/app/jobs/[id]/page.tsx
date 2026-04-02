'use client';
// frontend/app/jobs/[id]/page.tsx
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import { MapPin, Calendar, Users, ArrowLeft, Loader2 } from 'lucide-react';
import api from '@/lib/axios';
import { getUser } from '@/lib/auth';
import type { Job } from '@/types';

export default function JobDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [job, setJob]       = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const user = getUser();

  useEffect(() => {
    api.get<Job>(`/jobs/${id}`)
      .then(({ data }) => setJob(data))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return (
    <>
      <Navbar />
      <div className="flex justify-center items-center min-h-[60vh]">
        <Loader2 size={20} className="animate-spin" />
        <span className="ml-3 text-[10px] tracking-widest text-rms-muted">LOADING...</span>
      </div>
    </>
  );

  if (!job) return (
    <>
      <Navbar />
      <div className="max-w-4xl mx-auto px-6 py-16 text-center">
        <p className="text-[9px] tracking-[0.3em] text-red-500 uppercase">JOB_NOT_FOUND</p>
        <Link href="/jobs" className="btn-ghost mt-6 inline-flex text-[9px]">← BACK_TO_JOBS</Link>
      </div>
    </>
  );

  return (
    <>
      <Navbar />
      <div className="max-w-5xl mx-auto px-6 py-8">

        <Link href="/jobs" className="inline-flex items-center gap-2 text-[9px] tracking-widest text-rms-faint hover:text-rms-black uppercase mb-6">
          <ArrowLeft size={12} /> BACK_TO_LISTINGS
        </Link>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main */}
          <div className="lg:col-span-2 space-y-5">
            {/* Title block */}
            <div className="bg-rms-black p-6 border-b-2 border-rms-yellow">
              <span className={`badge mb-3 ${job.status === 'OPEN' ? 'badge-open' : 'badge-closed'}`}>
                {job.status === 'OPEN' ? '● OPEN' : '○ CLOSED'}
              </span>
              <h1 className="text-xl font-medium text-rms-cream tracking-wide mb-1">{job.title}</h1>
              <p className="text-[10px] text-rms-yellow tracking-widest uppercase">
                {job.companyName} · {job.recruitername}
              </p>
            </div>

            {/* Meta */}
            <div className="bg-white border border-rms-border p-4 flex flex-wrap gap-6 text-[10px] font-mono tracking-wide text-rms-faint">
              <span className="flex items-center gap-1.5"><MapPin size={12} /> {job.location}</span>
              <span className="flex items-center gap-1.5">
                <Calendar size={12} />
                POSTED {new Date(job.postedDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }).toUpperCase()}
              </span>
              {job._count && (
                <span className="flex items-center gap-1.5"><Users size={12} /> {job.applicationCount} APPLICATIONS</span>
              )}
            </div>

            {/* Skills */}
            <div className="bg-white border border-rms-border p-4">
              <p className="section-label">SKILLS_REQUIRED</p>
              <div className="flex flex-wrap gap-2">
                {job.skillsRequired.map((s) => (
                  <span key={s} className="badge-skill">{s}</span>
                ))}
              </div>
            </div>

            {/* Description */}
            <div className="bg-white border border-rms-border p-4">
              <p className="section-label">JOB_DESCRIPTION</p>
              <div className="space-y-3">
                {job.description.split('\n').map((para, i) => (
                  <p key={i} className="text-xs text-rms-subtle leading-relaxed">{para}</p>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <aside>
            <div className="bg-white border border-rms-border border-t-2 border-t-rms-yellow sticky top-14">
              <div className="p-4 border-b border-rms-border">
                <p className="section-label">APPLY_FOR_ROLE</p>
              </div>
              <div className="p-4 space-y-3">
                {job.status === 'CLOSED' && (
                  <p className="text-[9px] tracking-widest text-rms-faint uppercase">
                    ○ This position is no longer accepting applications.
                  </p>
                )}
                {job.status === 'OPEN' && (
                  user?.role === 'applicant' ? (
                    <Link href={`/dashboard/applicant/apply/${job.id}`} className="btn-yellow w-full justify-center py-3 text-[9px]">
                      APPLY_NOW →
                    </Link>
                  ) : (
                    <div className="space-y-2">
                      <p className="text-[9px] text-rms-muted leading-relaxed">Create an applicant account to apply.</p>
                      <Link href="/auth/register?role=applicant" className="btn-yellow w-full justify-center py-2.5 text-[9px]">
                        SIGN_UP_TO_APPLY
                      </Link>
                      <Link href="/auth/login" className="btn-ghost w-full justify-center py-2.5 text-[9px]">
                        LOG_IN
                      </Link>
                    </div>
                  )
                )}

                <div className="pt-3 border-t border-rms-border space-y-2">
                  {[
                    ['COMPANY',  job.companyName],
                    ['LOCATION', job.location],
                    ['STATUS',   job.status],
                  ].map(([label, val]) => (
                    <div key={label} className="flex justify-between text-[9px] font-mono">
                      <span className="tracking-widest text-rms-faint">{label}</span>
                      <span className="text-rms-black uppercase">{val}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </>
  );
}
