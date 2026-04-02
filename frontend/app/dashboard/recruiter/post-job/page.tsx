'use client';
// frontend/app/dashboard/recruiter/post-job/page.tsx
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/DashboardLayout';
import { Plus, X, Loader2, CheckCircle2 } from 'lucide-react';
import api from '@/lib/axios';

export default function PostJobPage() {
  const router = useRouter();
  const [title,       setTitle]      = useState('');
  const [description, setDesc]       = useState('');
  const [location,    setLocation]   = useState('');
  const [skillInput,  setSkillInput] = useState('');
  const [skills,      setSkills]     = useState<string[]>([]);
  const [submitting,  setSubmitting] = useState(false);
  const [success,     setSuccess]    = useState(false);
  const [error,       setError]      = useState('');

  const addSkill = () => {
    const s = skillInput.trim();
    if (s && !skills.includes(s)) setSkills([...skills, s]);
    setSkillInput('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (skills.length === 0)      { setError('At least one skill is required.'); return; }
    if (description.length < 20)  { setError('Description must be at least 20 characters.'); return; }
    setSubmitting(true); setError('');
    try {
      await api.post('/jobs', { title, description, skillsRequired: skills, location });
      setSuccess(true);
      setTimeout(() => router.push('/dashboard/recruiter/jobs'), 1500);
    } catch (err: any) {
      const msg = err.response?.data?.message;
      setError(Array.isArray(msg) ? msg.join(' · ') : msg || 'Failed to post job.');
    } finally { setSubmitting(false); }
  };

  return (
    <DashboardLayout heading="POST_A_JOB">
      <div className="max-w-2xl mx-auto">
        {success && (
          <div className="border border-rms-yellow bg-rms-cream px-4 py-3 text-[10px] font-mono text-rms-black flex items-center gap-2 mb-5">
            <CheckCircle2 size={14} className="text-rms-yellow" /> JOB_POSTED_SUCCESSFULLY — REDIRECTING...
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Job details */}
          <div className="bg-white border border-rms-border">
            <div className="px-5 py-3 border-b border-rms-border">
              <p className="text-[9px] tracking-[0.3em] uppercase text-rms-faint">JOB_DETAILS</p>
            </div>
            <div className="p-5 space-y-4">
              <div>
                <label className="label">JOB_TITLE</label>
                <input value={title} onChange={(e) => setTitle(e.target.value)} className="input" required minLength={3} placeholder="e.g. Senior Frontend Engineer" />
              </div>
              <div>
                <label className="label">LOCATION</label>
                <input value={location} onChange={(e) => setLocation(e.target.value)} className="input" required placeholder="e.g. Remote, New York, London" />
              </div>
              <div>
                <label className="label">JOB_DESCRIPTION</label>
                <textarea value={description} onChange={(e) => setDesc(e.target.value)} rows={7}
                  className="input resize-none" required minLength={20}
                  placeholder="Describe the role, responsibilities, requirements..." />
                <p className="text-[9px] text-rms-faint mt-1 tracking-wide">{description.length} CHARS</p>
              </div>
            </div>
          </div>

          {/* Skills */}
          <div className="bg-white border border-rms-border">
            <div className="px-5 py-3 border-b border-rms-border">
              <p className="text-[9px] tracking-[0.3em] uppercase text-rms-faint">REQUIRED_SKILLS</p>
            </div>
            <div className="p-5">
              <p className="text-[9px] text-rms-faint tracking-wide mb-3">PRESS ENTER OR CLICK + TO ADD EACH SKILL</p>
              <div className="flex gap-0 mb-3">
                <input value={skillInput} onChange={(e) => setSkillInput(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addSkill(); }}}
                  placeholder="e.g. REACT, TYPESCRIPT..." className="input flex-1" />
                <button type="button" onClick={addSkill} className="btn-primary text-[9px] px-4">
                  <Plus size={14} />
                </button>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {skills.map((s) => (
                  <span key={s} className="flex items-center gap-1.5 badge-skill">
                    {s}
                    <button type="button" onClick={() => setSkills(skills.filter((k) => k !== s))} className="hover:text-red-500">
                      <X size={9} />
                    </button>
                  </span>
                ))}
                {skills.length === 0 && <p className="text-[9px] tracking-widest text-rms-faint">NO_SKILLS_ADDED</p>}
              </div>
            </div>
          </div>

          {error && <div className="border border-red-300 bg-red-50 px-4 py-2 text-[10px] font-mono text-red-700">ERROR: {error}</div>}

          <div className="flex gap-3">
            <button type="submit" disabled={submitting || success} className="btn-primary flex-1 py-3 text-[9px]">
              {submitting ? <><Loader2 size={14} className="animate-spin" /> POSTING...</> : 'PUBLISH_LISTING →'}
            </button>
            <button type="button" onClick={() => router.push('/dashboard/recruiter')} className="btn-ghost py-3 px-6 text-[9px]">
              CANCEL
            </button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}
