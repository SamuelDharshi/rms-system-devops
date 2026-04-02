'use client';
// frontend/app/dashboard/admin/page.tsx
import { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import { Users, Briefcase, FileText, TrendingUp, Loader2, AlertCircle, BarChart2 } from 'lucide-react';
import api from '@/lib/axios';
import { getUser } from '@/lib/auth';
import { useRouter } from 'next/navigation';
import type { AdminReport } from '@/types';

export default function AdminDashboard() {
  const router  = useRouter();
  const user    = getUser();
  const [report,   setReport]   = useState<AdminReport | null>(null);
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState('');
  const [activeTab, setTab]     = useState<'report' | 'users' | 'jobs'>('report');
  const [users,    setUsers]    = useState<{ applicants: any[]; recruiters: any[] }>({ applicants: [], recruiters: [] });
  const [jobs,     setJobs]     = useState<any[]>([]);

  // Guard: redirect non-admins
  useEffect(() => {
    if (!user) { router.replace('/auth/login'); return; }
    if (user.role !== 'admin') { router.replace('/'); return; }

    Promise.all([
      api.get('/admin/report'),
      api.get('/admin/users'),
      api.get('/admin/jobs'),
    ])
      .then(([reportRes, usersRes, jobsRes]) => {
        setReport(reportRes.data);
        setUsers(usersRes.data);
        setJobs(jobsRes.data);
      })
      .catch(() => setError('Failed to load admin data.'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50">
        <div className="page-container py-8">
          <div className="flex items-center gap-3 mb-8">
            <div className="h-10 w-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white">
              <BarChart2 size={20} />
            </div>
            <div>
              <h1 className="font-display text-2xl font-bold text-gray-900">Admin Dashboard</h1>
              <p className="text-sm text-gray-500">System overview and monitoring</p>
            </div>
          </div>

          {loading && (
            <div className="flex justify-center py-20">
              <Loader2 size={32} className="animate-spin text-indigo-400" />
            </div>
          )}

          {error && (
            <div className="flex items-center gap-2 rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-600 mb-6">
              <AlertCircle size={16} /> {error}
            </div>
          )}

          {!loading && report && (
            <div className="space-y-6 animate-fade-in">
              {/* ── Stats ──────────────────────────────────────── */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { label: 'Applicants',     value: report.users.totalApplicants,          icon: <Users size={20} />,    color: 'bg-blue-100 text-blue-600'    },
                  { label: 'Recruiters',     value: report.users.totalRecruiters,          icon: <Users size={20} />,    color: 'bg-violet-100 text-violet-600'},
                  { label: 'Total Jobs',     value: report.jobs.totalJobs,                 icon: <Briefcase size={20} />,color: 'bg-indigo-100 text-indigo-600'},
                  { label: 'Applications',   value: report.applications.totalApplications, icon: <FileText size={20} />, color: 'bg-amber-100 text-amber-600'  },
                ].map(({ label, value, icon, color }) => (
                  <div key={label} className="card p-5">
                    <div className={`h-10 w-10 rounded-xl flex items-center justify-center mb-3 ${color}`}>{icon}</div>
                    <p className="text-2xl font-bold text-gray-900">{value}</p>
                    <p className="text-sm text-gray-500 mt-0.5">{label}</p>
                  </div>
                ))}
              </div>

              {/* ── Tabs ──────────────────────────────────────── */}
              <div className="flex gap-2 border-b border-gray-200 pb-0">
                {(['report', 'users', 'jobs'] as const).map((t) => (
                  <button
                    key={t}
                    onClick={() => setTab(t)}
                    className={`pb-3 px-4 text-sm font-semibold capitalize border-b-2 transition-colors ${
                      activeTab === t
                        ? 'border-indigo-600 text-indigo-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>

              {/* ── Report Tab ────────────────────────────────── */}
              {activeTab === 'report' && (
                <div className="grid lg:grid-cols-2 gap-6">
                  {/* Application breakdown */}
                  <div className="card p-6">
                    <h3 className="font-display text-lg font-bold text-gray-900 mb-4">Application Breakdown</h3>
                    {[
                      { label: 'Pending',  value: report.applications.pendingApplications,  color: 'bg-amber-400'  },
                      { label: 'Selected', value: report.applications.selectedApplications, color: 'bg-emerald-400'},
                      { label: 'Rejected', value: report.applications.rejectedApplications, color: 'bg-red-400'    },
                    ].map(({ label, value, color }) => {
                      const pct = report.applications.totalApplications > 0
                        ? Math.round((value / report.applications.totalApplications) * 100) : 0;
                      return (
                        <div key={label} className="mb-3">
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-gray-600">{label}</span>
                            <span className="font-semibold text-gray-800">{value} ({pct}%)</span>
                          </div>
                          <div className="h-2 rounded-full bg-gray-100">
                            <div className={`h-2 rounded-full ${color} transition-all`} style={{ width: `${pct}%` }} />
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Popular jobs */}
                  <div className="card p-6">
                    <h3 className="font-display text-lg font-bold text-gray-900 mb-4">Top 5 Jobs by Applications</h3>
                    <div className="space-y-3">
                      {report.popularJobs.map((job, i) => (
                        <div key={job.id} className="flex items-center gap-3">
                          <span className="text-xs font-mono font-bold text-gray-400 w-4">{i + 1}</span>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-gray-800 truncate">{job.title}</p>
                            <p className="text-xs text-gray-500">{job.recruiter.companyName}</p>
                          </div>
                          <span className="badge badge-blue">{job._count.applications}</span>
                        </div>
                      ))}
                    </div>
                    <p className="text-xs text-gray-400 mt-4">
                      Report generated: {new Date(report.generatedAt).toLocaleString()}
                    </p>
                  </div>
                </div>
              )}

              {/* ── Users Tab ─────────────────────────────────── */}
              {activeTab === 'users' && (
                <div className="grid lg:grid-cols-2 gap-6">
                  {/* Applicants */}
                  <div className="card p-6">
                    <h3 className="font-display text-lg font-bold text-gray-900 mb-4">
                      Applicants ({users.applicants.length})
                    </h3>
                    <div className="space-y-2 max-h-96 overflow-y-auto">
                      {users.applicants.map((a: any) => (
                        <div key={a.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50">
                          <div className="h-8 w-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-bold">
                            {a.name[0]}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-800 truncate">{a.name}</p>
                            <p className="text-xs text-gray-500 truncate">{a.email}</p>
                          </div>
                          <span className="text-xs text-gray-400">{new Date(a.createdAt).toLocaleDateString()}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Recruiters */}
                  <div className="card p-6">
                    <h3 className="font-display text-lg font-bold text-gray-900 mb-4">
                      Recruiters ({users.recruiters.length})
                    </h3>
                    <div className="space-y-2 max-h-96 overflow-y-auto">
                      {users.recruiters.map((r: any) => (
                        <div key={r.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50">
                          <div className="h-8 w-8 rounded-full bg-violet-100 text-violet-600 flex items-center justify-center text-xs font-bold">
                            {r.name[0]}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-800 truncate">{r.name}</p>
                            <p className="text-xs text-gray-500 truncate">{r.companyName}</p>
                          </div>
                          <span className="text-xs text-gray-400">{new Date(r.createdAt).toLocaleDateString()}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* ── Jobs Tab ──────────────────────────────────── */}
              {activeTab === 'jobs' && (
                <div className="card overflow-hidden">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        {['Title', 'Company', 'Location', 'Status', 'Applications', 'Posted'].map((h) => (
                          <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 bg-white">
                      {jobs.map((job: any) => (
                        <tr key={job.id} className="hover:bg-gray-50">
                          <td className="px-4 py-3 text-sm font-medium text-gray-800 max-w-[180px] truncate">{job.title}</td>
                          <td className="px-4 py-3 text-sm text-gray-600">{job.recruiter?.companyName}</td>
                          <td className="px-4 py-3 text-sm text-gray-600">{job.location}</td>
                          <td className="px-4 py-3">
                            <span className={`badge ${job.status === 'OPEN' ? 'badge-green' : 'badge-gray'}`}>{job.status}</span>
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-600">{job._count?.applications ?? 0}</td>
                          <td className="px-4 py-3 text-xs text-gray-400">{new Date(job.postedDate).toLocaleDateString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
