'use client';
// frontend/app/jobs/page.tsx
import { useEffect, useState, useCallback } from 'react';
import Navbar from '@/components/Navbar';
import JobCard from '@/components/JobCard';
import { Loader2, Search } from 'lucide-react';
import api from '@/lib/axios';
import type { Job } from '@/types';

export default function JobsPage() {
  const [jobs,     setJobs]     = useState<Job[]>([]);
  const [loading,  setLoading]  = useState(true);
  const [keyword,  setKeyword]  = useState('');
  const [location, setLocation] = useState('');
  const [skill,    setSkill]    = useState('');

  const fetchJobs = useCallback(async (kw = keyword, loc = location, sk = skill) => {
    setLoading(true);
    try {
      const params: Record<string, string> = {};
      if (kw)  params.keyword  = kw;
      if (loc) params.location = loc;
      if (sk)  params.skill    = sk;
      const { data } = await api.get<Job[]>('/jobs', { params });
      setJobs(data);
    } finally {
      setLoading(false);
    }
  }, [keyword, location, skill]);

  useEffect(() => { fetchJobs('', '', ''); }, []);

  const handleSearch = (e: React.FormEvent) => { e.preventDefault(); fetchJobs(); };

  const handleClear = () => {
    setKeyword(''); setLocation(''); setSkill('');
    fetchJobs('', '', '');
  };

  return (
    <>
      <Navbar />

      {/* Hero / Search */}
      <div className="bg-rms-black border-b-2 border-rms-yellow px-6 py-10">
        <div className="max-w-5xl mx-auto">
          <p className="text-[9px] tracking-[0.4em] uppercase text-rms-faint mb-3">
            RECRUITMENT_MANAGEMENT_SYSTEM
          </p>
          <h1 className="text-2xl font-medium text-rms-cream tracking-tight mb-1">
            OPEN_POSITIONS
          </h1>
          <p className="text-[10px] text-rms-faint tracking-wide mb-6">
            {loading ? '...' : `${jobs.length} POSITION${jobs.length !== 1 ? 'S' : ''} AVAILABLE`}
          </p>

          <form onSubmit={handleSearch} className="flex flex-wrap gap-0">
            <input
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="TITLE OR KEYWORD"
              className="input-dark flex-1 min-w-[160px] border-r-0"
            />
            <input
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="LOCATION"
              className="input-dark w-40 border-r-0"
            />
            <input
              value={skill}
              onChange={(e) => setSkill(e.target.value)}
              placeholder="SKILL"
              className="input-dark w-36 border-r-0"
            />
            <button type="submit" className="btn-yellow text-[9px] px-5 py-2.5">
              <Search size={13} /> SEARCH
            </button>
            {(keyword || location || skill) && (
              <button type="button" onClick={handleClear} className="btn-ghost text-[9px] px-4 border-[#444] text-rms-faint hover:text-rms-cream hover:border-rms-faint ml-1">
                CLEAR
              </button>
            )}
          </form>
        </div>
      </div>

      {/* Results */}
      <div className="max-w-5xl mx-auto px-6 py-8">
        {loading && (
          <div className="flex justify-center items-center py-24">
            <Loader2 size={24} className="animate-spin text-rms-black" />
            <span className="ml-3 text-[10px] tracking-widest text-rms-muted">LOADING_JOBS...</span>
          </div>
        )}

        {!loading && jobs.length === 0 && (
          <div className="text-center py-24 border border-rms-border bg-white">
            <p className="text-[9px] tracking-[0.3em] uppercase text-rms-faint">NO_RESULTS_FOUND</p>
            <p className="text-xs text-rms-muted mt-2">Try adjusting your search filters.</p>
          </div>
        )}

        {!loading && jobs.length > 0 && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {jobs.map((job) => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>
        )}
      </div>
    </>
  );
}
