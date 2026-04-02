'use client';
// frontend/app/dashboard/recruiter/jobs/[id]/edit/page.tsx
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import DashboardLayout from '@/components/DashboardLayout';
import { Plus, X, Loader2, CheckCircle2, ArrowLeft } from 'lucide-react';
import api from '@/lib/axios';
import type { Job } from '@/types';

export default function EditJobPage() {
  const { id }  = useParams<{ id: string }>();
  const router  = useRouter();

  const [loading,     setLoading]    = useState(true);
  const [title,       setTitle]      = useState('');
  const [description, setDesc]       = useState('');
  const [location,    setLocation]   = useState('');
  const [status,      setStatus]     = useState<'OPEN' | 'CLOSED'>('OPEN');
  const [skills,      setSkills]     = useState<string[]>([]);
  const [skillInput,  setSkillInput] = useState('');
  const [saving,      setSaving]     = useState(false);
  const [saved,       setSaved]      = useState(false);
  const [error,       setError]      = useState('');

  useEffect(() => {
    api.get<Job>(`/jobs/${id}`)
      .then(({ data }) => {
        setTitle(data.title); setDesc(data.description);
        setLocation(data.location); setStatus(data.status);
        setSkills(data.skillsRequired);
      })
      .catch(() => setError('Failed to load job.'))
      .finally(() => setLoading(false));
  }, [id]);

  const addSkill = () => {
    const s = skillInput.trim();
    if (s && !skills.includes(s)) setSkills([...skills, s]);
    setSkillInput('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true); setError(''); setSaved(false);
    try {
      await api.put(`/jobs/${id}`, { title, description, location, status, skillsRequired: skills });
      setSaved(true);
      setTimeout(() => router.push('/dashboard/recruiter/jobs'), 1200);
    } catch (err: any) {
      const msg = err.response?.data?.message;
      setError(Array.isArray(msg) ? msg.join(' · ') : msg || 'Update failed.');
    } finally { setSaving(false); }
  };

  if (loading) return (
    <DashboardLayout heading="EDIT_JOB">
      <div className="flex justify-center items-center h-64">
        <Loader2 size={20} className="animate-spin" />
      </div>
    </DashboardLayout>
  );

  return (
    <DashboardLayout heading="EDIT_JOB">
      <div className="max-w-2xl mx-auto space-y-5">
        <Link href="/dashboard/recruiter/jobs" className="inline-flex items-center gap-2 text-[9px] tracking-widest text-rms-faint hover:text-rms-black uppercase">
          <ArrowLeft size={12} /> BACK_TO_LISTINGS
        </Link>

        {saved && (
          <div className="border border-rms-yellow bg-rms-cream px-4 py-2 text-[10px] font-mono text-rms-black flex items-center gap-2">
            <CheckCircle2 size={14} className="text-rms-yellow" /> JOB_UPDATED — REDIRECTING...
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Details */}
          <div className="bg-white border border-rms-border">
            <div className="px-5 py-3 border-b border-rms-border">
              <p className="text-[9px] tracking-[0.3em] uppercase text-rms-faint">JOB_DETAILS</p>
            </div>
            <div className="p-5 space-y-4">
              <div>
                <label className="label">JOB_TITLE</label>
                <input value={title} onChange={(e) => setTitle(e.target.value)} className="input" required />
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="label">LOCATION</label>
                  <input value={location} onChange={(e) => setLocation(e.target.value)} className="input" required />
                </div>
                <div>
                  <label className="label">STATUS</label>
                  <select value={status} onChange={(e) => setStatus(e.target.value as 'OPEN' | 'CLOSED')}
                    className="input">
                    <option value="OPEN">OPEN</option>
                    <option value="CLOSED">CLOSED</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="label">DESCRIPTION</label>
                <textarea value={description} onChange={(e) => setDesc(e.target.value)}
                  rows={7} className="input resize-none" required />
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
              <div className="flex gap-0 mb-3">
                <input value={skillInput} onChange={(e) => setSkillInput(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addSkill(); }}}
                  placeholder="ADD_SKILL..." className="input flex-1" />
                <button type="button" onClick={addSkill} className="btn-primary text-[9px] px-4">
                  <Plus size={14} />
                </button>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {skills.map((s) => (
                  <span key={s} className="flex items-center gap-1.5 badge-skill">
                    {s}
                    <button type="button" onClick={() => setSkills(skills.filter((k) => k !== s))}
                      className="hover:text-red-500">
                      <X size={9} />
                    </button>
                  </span>
                ))}
              </div>
            </div>
          </div>

          {error && (
            <div className="border border-red-300 bg-red-50 px-4 py-2 text-[10px] font-mono text-red-700">
              ERROR: {error}
            </div>
          )}

          <div className="flex gap-3">
            <button type="submit" disabled={saving} className="btn-primary flex-1 py-3 text-[9px]">
              {saving ? <><Loader2 size={14} className="animate-spin" /> SAVING...</> : 'SAVE_CHANGES →'}
            </button>
            <Link href="/dashboard/recruiter/jobs" className="btn-ghost py-3 px-6 text-[9px]">
              CANCEL
            </Link>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}
