'use client';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import DashboardLayout from '@/components/DashboardLayout';
import { Loader2, CheckCircle2, ArrowLeft } from 'lucide-react';
import api from '@/lib/axios';
import type { Job } from '@/types';

export default function ApplyPage() {
  const { jobId } = useParams<{ jobId: string }>();
  const router    = useRouter();

  const [job,        setJob]        = useState<Job | null>(null);
  const [jobLoading, setJobLoading] = useState(true);
  const [coverLetter,setCoverLetter]= useState('');
  const [submitting, setSubmitting] = useState(false);
  const [success,    setSuccess]    = useState(false);
  const [error,      setError]      = useState('');

  useEffect(() => {
    api.get<Job>(`/jobs/${jobId}`)
      .then(({ data }) => setJob(data))
      .finally(() => setJobLoading(false));
  }, [jobId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true); setError('');
    try {
      await api.post('/applications', { jobId, coverLetter });
      setSuccess(true);
    } catch (err: any) {
      const msg = err.response?.data?.message;
      setError(msg || 'Submission failed.');
    } finally { setSubmitting(false); }
  };

  if (success) return (
    <DashboardLayout heading="APPLICATION_SUBMITTED">
      <div className="max-w-md mx-auto text-center py-16">
        <div className="bg-rms-black w-16 h-16 flex items-center justify-center mx-auto mb-6 border-2 border-rms-yellow">
          <CheckCircle2 size={28} className="text-rms-yellow" />
        </div>
        <p className="text-[9px] tracking-[0.4em] text-rms-faint mb-2">SUBMISSION_COMPLETE</p>
        <h2 className="text-lg font-medium tracking-wide mb-4">APPLICATION_SENT</h2>
        <p className="text-xs text-rms-muted mb-8 leading-relaxed">
          Your application for <span className="text-rms-black font-medium">{job?.title}</span> at{' '}
          <span className="text-rms-black font-medium">{job?.companyName}</span> has been submitted.
        </p>
        <div className="flex gap-3 justify-center">
          <Link href="/dashboard/applicant/applications" className="btn-primary text-[9px] py-2">TRACK_APPLICATIONS</Link>
          <Link href="/jobs" className="btn-ghost text-[9px] py-2">BROWSE_MORE</Link>
        </div>
      </div>
    </DashboardLayout>
  );

  return (
    <DashboardLayout heading="APPLY_FOR_JOB">
      <div className="max-w-2xl mx-auto space-y-5">
        <Link href={`/jobs/${jobId}`} className="inline-flex items-center gap-2 text-[9px] tracking-widest text-rms-faint hover:text-rms-black uppercase">
          <ArrowLeft size={12} /> BACK_TO_JOB
        </Link>

        {jobLoading ? (
          <div className="bg-white border border-rms-border p-5 flex justify-center"><Loader2 size={20} className="animate-spin" /></div>
        ) : job ? (
          <div className="bg-rms-black border-l-2 border-rms-yellow p-4">
            <p className="text-[9px] tracking-[0.3em] text-rms-yellow uppercase mb-1">{job.companyName}</p>
            <p className="text-sm font-medium text-rms-cream tracking-wide">{job.title}</p>
            <p className="text-[9px] text-rms-faint mt-1 tracking-wide">{job.location}</p>
            <div className="flex flex-wrap gap-1.5 mt-2">
              {job.skillsRequired.slice(0, 4).map((s) => (
                <span key={s} className="badge-skill border-[#444] text-rms-faint">{s}</span>
              ))}
            </div>
          </div>
        ) : null}

        <form onSubmit={handleSubmit} className="bg-white border border-rms-border">
          <div className="px-5 py-4 border-b border-rms-border">
            <p className="text-[9px] tracking-[0.3em] uppercase text-rms-faint">APPLICATION_FORM</p>
          </div>
          <div className="p-5 space-y-5">
            <div>
              <label className="label">COVER_LETTER <span className="normal-case text-rms-faint">(optional)</span></label>
              <textarea
                value={coverLetter}
                onChange={(e) => setCoverLetter(e.target.value)}
                rows={6}
                className="input resize-none"
                placeholder="Tell the recruiter why you're the right fit..."
              />
              <p className="text-[9px] text-rms-faint mt-1 tracking-wide">{coverLetter.length} CHARS</p>
            </div>

            {error && (
              <div className="border border-red-300 bg-red-50 px-3 py-2 text-[10px] font-mono text-red-700">
                ERROR: {error}
              </div>
            )}

            <div className="flex gap-3 pt-2">
              <button type="submit" disabled={submitting || !job} className="btn-primary flex-1 py-3 text-[9px]">
                {submitting ? <><Loader2 size={14} className="animate-spin" /> SUBMITTING...</> : 'SUBMIT_APPLICATION →'}
              </button>
              <Link href="/jobs" className="btn-ghost py-3 px-5 text-[9px]">CANCEL</Link>
            </div>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}