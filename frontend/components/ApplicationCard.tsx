'use client';
import { MapPin, Calendar } from 'lucide-react';
import type { Application } from '@/types';

interface Props {
  application:    Application;
  recruiterView?: boolean;
  onSelect?:      (id: string) => void;
  onReject?:      (id: string) => void;
  onWithdraw?:    (id: string) => void;
}

const STATUS_BADGE: Record<string, string> = {
  PENDING:  'badge-pending',
  SELECTED: 'badge-selected',
  REJECTED: 'badge-rejected',
};

export default function ApplicationCard({ application, recruiterView, onSelect, onReject, onWithdraw }: Props) {
  const { applicationStatus, applicationDate, coverLetter } = application;

  return (
    <article className="bg-white border border-rms-border hover:border-rms-black transition-colors duration-100">
      <div className="p-4 pb-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            {recruiterView ? (
              <>
                <p className="text-sm font-medium text-rms-black tracking-wide">{application.applicantName}</p>
                <p className="text-[10px] font-mono text-rms-faint mt-0.5 tracking-wide">{application.applicantEmail}</p>
                {application.applicantPhone && (
                  <p className="text-[10px] font-mono text-rms-faint tracking-wide">{application.applicantPhone}</p>
                )}
              </>
            ) : (
              <>
                <p className="text-[9px] font-mono tracking-[0.25em] uppercase text-rms-faint mb-1">
                  {application.companyName}
                </p>
                <p className="text-sm font-medium text-rms-black tracking-wide">{application.jobTitle}</p>
              </>
            )}
          </div>
          <span className={STATUS_BADGE[applicationStatus] || 'badge'}>● {applicationStatus}</span>
        </div>

        <div className="flex flex-wrap gap-x-4 gap-y-1 text-[9px] font-mono text-rms-faint mt-2 tracking-wide">
          {!recruiterView && (
            <span className="flex items-center gap-1"><MapPin size={10} /> {application.jobLocation}</span>
          )}
          <span className="flex items-center gap-1">
            <Calendar size={10} />
            {new Date(applicationDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }).toUpperCase()}
          </span>
        </div>
      </div>

      {coverLetter && (
        <div className="px-4 pb-3">
          <p className="text-[10px] font-mono text-rms-muted italic line-clamp-2 leading-relaxed border-l-2 border-rms-yellow pl-3">
            "{coverLetter}"
          </p>
        </div>
      )}

      {((recruiterView && applicationStatus === 'PENDING') ||
        (!recruiterView && applicationStatus === 'PENDING' && onWithdraw)) && (
        <div className="px-4 py-3 border-t border-rms-border flex gap-2">
          {recruiterView && (
            <>
              <button onClick={() => onSelect?.(application.id)} className="btn-primary text-[9px] py-1.5 px-3">SELECT</button>
              <button onClick={() => onReject?.(application.id)} className="btn-danger text-[9px] py-1.5 px-3">REJECT</button>
            </>
          )}
          {!recruiterView && onWithdraw && (
            <button onClick={() => onWithdraw(application.id)} className="font-mono text-[9px] tracking-widest uppercase text-red-500 hover:text-red-700 transition-colors">
              WITHDRAW
            </button>
          )}
        </div>
      )}
    </article>
  );
}