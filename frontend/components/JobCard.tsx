'use client';
import Link from 'next/link';
import { MapPin, Clock, Users } from 'lucide-react';
import type { Job } from '@/types';

interface JobCardProps {
  job: Job;
  recruiterView?: boolean;
  onDelete?: (id: string) => void;
}

export default function JobCard({ job, recruiterView, onDelete }: JobCardProps) {
  const postedAgo = getRelativeTime(job.postedDate);
  const isOpen    = job.status === 'OPEN';

  return (
    <article className={`bg-white border border-rms-border hover:border-rms-black transition-colors duration-100 ${isOpen ? 'border-l-2 border-l-rms-yellow' : ''}`}>
      <div className="p-4 pb-3">
        <div className="flex items-start justify-between gap-3 mb-2">
          <div className="flex-1 min-w-0">
            <p className="text-[9px] font-mono tracking-[0.25em] uppercase text-rms-faint mb-1">
              {job.companyName}
            </p>
            <h3 className="text-sm font-medium text-rms-black leading-snug tracking-wide">
              {job.title}
            </h3>
          </div>
          <span className={isOpen ? 'badge-open' : 'badge-closed'}>
            {isOpen ? '● OPEN' : '○ CLOSED'}
          </span>
        </div>
        <div className="flex flex-wrap gap-x-4 gap-y-1 text-[9px] font-mono tracking-wide text-rms-faint mt-2">
          <span className="flex items-center gap-1"><MapPin size={10} /> {job.location}</span>
          <span className="flex items-center gap-1"><Clock size={10} /> {postedAgo}</span>
          <span className="flex items-center gap-1"><Users size={10} /> {job.applicationCount} applicants</span>
        </div>
      </div>

      <div className="px-4 pb-3 flex flex-wrap gap-1">
        {job.skillsRequired.slice(0, 5).map((s) => (
          <span key={s} className="badge-skill">{s}</span>
        ))}
        {job.skillsRequired.length > 5 && (
          <span className="badge-skill">+{job.skillsRequired.length - 5}</span>
        )}
      </div>

      <div className="px-4 pb-3">
        <p className="text-[10px] font-mono text-rms-muted line-clamp-2 leading-relaxed">
          {job.description}
        </p>
      </div>

      <div className="px-4 py-3 border-t border-rms-border flex items-center gap-2">
        {recruiterView ? (
          <>
            <Link href={`/dashboard/recruiter/jobs/${job.id}/applicants`} className="btn-primary text-[9px] py-1.5 px-3">
              VIEW APPLICANTS →
            </Link>
            <Link href={`/dashboard/recruiter/jobs/${job.id}/edit`} className="btn-ghost text-[9px] py-1.5 px-3">
              EDIT
            </Link>
            {onDelete && (
              <button onClick={() => onDelete(job.id)} className="ml-auto font-mono text-[9px] tracking-widest uppercase text-red-500 hover:text-red-700 transition-colors">
                DELETE
              </button>
            )}
          </>
        ) : (
          <>
            <Link href={`/jobs/${job.id}`} className="btn-ghost text-[9px] py-1.5 px-3">DETAILS</Link>
            {isOpen && (
              <Link href={`/dashboard/applicant/apply/${job.id}`} className="btn-primary text-[9px] py-1.5 px-3 ml-auto">
                APPLY →
              </Link>
            )}
          </>
        )}
      </div>
    </article>
  );
}

function getRelativeTime(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const days = Math.floor(diff / 86_400_000);
  if (days === 0) return 'TODAY';
  if (days === 1) return 'YESTERDAY';
  if (days < 7)  return `${days}D AGO`;
  if (days < 30) return `${Math.floor(days / 7)}W AGO`;
  return `${Math.floor(days / 30)}MO AGO`;
}