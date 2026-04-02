'use client';
// frontend/app/dashboard/applicant/profile/page.tsx
import { useEffect, useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { Loader2, Plus, X, CheckCircle2 } from 'lucide-react';
import api from '@/lib/axios';
import type { Applicant } from '@/types';

export default function ProfilePage() {
  const [loading,     setLoading]     = useState(true);
  const [saving,      setSaving]      = useState(false);
  const [saved,       setSaved]       = useState(false);
  const [error,       setError]       = useState('');
  const [profile,     setProfile]     = useState<Applicant | null>(null);
  const [name,        setName]        = useState('');
  const [phone,       setPhone]       = useState('');
  const [bio,         setBio]         = useState('');
  const [skills,      setSkills]      = useState<string[]>([]);
  const [skillInput,  setSkillInput]  = useState('');
  const [experience,  setExperience]  = useState('');
  const [education,   setEducation]   = useState('');
  const [linkedin,    setLinkedin]    = useState('');

  useEffect(() => {
    api.get<Applicant>('/applicants/profile').then(({ data }) => {
      setProfile(data);
      setName(data.name ?? '');
      setPhone(data.phone ?? '');
      // profileDetails is a JSON string from Java
      try {
        const pd = data.profileDetails ? JSON.parse(data.profileDetails) : {};
        setBio(pd.bio ?? '');
        setSkills(pd.skills ?? []);
        setExperience(pd.experience ?? '');
        setEducation(pd.education ?? '');
        setLinkedin(pd.linkedinUrl ?? '');
      } catch {}
    }).finally(() => setLoading(false));
  }, []);

  const addSkill = () => {
    const s = skillInput.trim();
    if (s && !skills.includes(s)) setSkills([...skills, s]);
    setSkillInput('');
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true); setError(''); setSaved(false);
    try {
      // Java expects profileDetails as a JSON string
      await api.put('/applicants/profile', {
        name,
        phone,
        profileDetails: JSON.stringify({ bio, skills, experience, education, linkedinUrl: linkedin }),
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Save failed.');
    } finally { setSaving(false); }
  };

  if (loading) return (
    <DashboardLayout heading="PROFILE">
      <div className="flex justify-center items-center h-64">
        <Loader2 size={20} className="animate-spin" />
      </div>
    </DashboardLayout>
  );

  return (
    <DashboardLayout heading="MY_PROFILE">
      <div className="max-w-2xl mx-auto">
        <form onSubmit={handleSave} className="space-y-4">

          {/* Personal */}
          <div className="bg-white border border-rms-border">
            <div className="px-5 py-3 border-b border-rms-border">
              <p className="text-[9px] tracking-[0.3em] uppercase text-rms-faint">PERSONAL_INFO</p>
            </div>
            <div className="p-5 space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="label">FULL_NAME</label>
                  <input value={name} onChange={(e) => setName(e.target.value)} className="input" required />
                </div>
                <div>
                  <label className="label">PHONE</label>
                  <input value={phone} onChange={(e) => setPhone(e.target.value)} className="input" placeholder="+1 555 000 0000" />
                </div>
              </div>
              <div>
                <label className="label">EMAIL <span className="normal-case text-rms-faint">(read only)</span></label>
                <input value={profile?.email ?? ''} disabled className="input" />
              </div>
              <div>
                <label className="label">LINKEDIN_URL</label>
                <input value={linkedin} onChange={(e) => setLinkedin(e.target.value)} className="input" placeholder="https://linkedin.com/in/yourname" />
              </div>
            </div>
          </div>

          {/* Professional */}
          <div className="bg-white border border-rms-border">
            <div className="px-5 py-3 border-b border-rms-border">
              <p className="text-[9px] tracking-[0.3em] uppercase text-rms-faint">PROFESSIONAL_DETAILS</p>
            </div>
            <div className="p-5 space-y-4">
              <div>
                <label className="label">BIO_SUMMARY</label>
                <textarea value={bio} onChange={(e) => setBio(e.target.value)} rows={3} className="input resize-none" placeholder="Describe yourself and your goals..." />
              </div>
              <div>
                <label className="label">SKILLS</label>
                <div className="flex gap-0 mb-2">
                  <input value={skillInput} onChange={(e) => setSkillInput(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addSkill(); }}}
                    placeholder="ADD_SKILL..." className="input flex-1" />
                  <button type="button" onClick={addSkill} className="btn-primary text-[9px] px-3 py-2">
                    <Plus size={14} />
                  </button>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {skills.map((s) => (
                    <span key={s} className="flex items-center gap-1 badge-skill">
                      {s}
                      <button type="button" onClick={() => setSkills(skills.filter((k) => k !== s))} className="hover:text-red-500 ml-0.5">
                        <X size={9} />
                      </button>
                    </span>
                  ))}
                  {skills.length === 0 && <p className="text-[9px] tracking-widest text-rms-faint">NO_SKILLS_ADDED</p>}
                </div>
              </div>
              <div>
                <label className="label">EXPERIENCE</label>
                <textarea value={experience} onChange={(e) => setExperience(e.target.value)} rows={3} className="input resize-none" placeholder="Previous roles, responsibilities..." />
              </div>
              <div>
                <label className="label">EDUCATION</label>
                <textarea value={education} onChange={(e) => setEducation(e.target.value)} rows={2} className="input resize-none" placeholder="University, degree, year..." />
              </div>
            </div>
          </div>

          {error && <div className="border border-red-300 bg-red-50 px-4 py-2 text-[10px] font-mono text-red-700">ERROR: {error}</div>}
          {saved  && <div className="border border-rms-yellow bg-rms-cream px-4 py-2 text-[10px] font-mono text-rms-black flex items-center gap-2"><CheckCircle2 size={14} className="text-rms-yellow" /> PROFILE_SAVED</div>}

          <button type="submit" disabled={saving} className="btn-primary w-full py-3 text-[9px]">
            {saving ? <><Loader2 size={14} className="animate-spin" /> SAVING...</> : 'SAVE_PROFILE →'}
          </button>
        </form>
      </div>
    </DashboardLayout>
  );
}
