// frontend/app/page.tsx
import Link from 'next/link';
import Navbar from '@/components/Navbar';

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main className="font-mono">

        {/* Hero */}
        <section className="bg-rms-black border-b-2 border-rms-yellow py-20 px-6 relative overflow-hidden">
          {/* Grid decoration */}
          <div className="absolute inset-0 opacity-5"
            style={{ backgroundImage: 'linear-gradient(#e5e400 1px, transparent 1px), linear-gradient(90deg, #e5e400 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

          <div className="max-w-4xl mx-auto relative">
            <p className="text-[9px] tracking-[0.4em] uppercase text-rms-faint mb-6">
              RECRUITMENT_MANAGEMENT_SYSTEM v1.0
            </p>
            <h1 className="text-4xl sm:text-6xl font-medium text-rms-cream leading-tight tracking-tight mb-3">
              FIND YOUR
            </h1>
            <h1 className="text-4xl sm:text-6xl font-medium leading-tight tracking-tight mb-6">
              <span className="text-rms-yellow">NEXT_ROLE</span>
              <span className="text-rms-cream cursor">_</span>
            </h1>
            <p className="text-sm text-rms-faint leading-relaxed max-w-xl mb-10 tracking-wide">
              The recruitment platform that connects exceptional candidates with forward-thinking companies.
              Search jobs, apply, and track your progress — all in one place.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link href="/jobs" className="btn-yellow px-8 py-3 text-xs">
                BROWSE_JOBS →
              </Link>
              <Link href="/auth/register?role=recruiter" className="btn-ghost px-8 py-3 text-xs border-[#444] text-rms-faint hover:text-rms-cream hover:border-rms-faint">
                POST_A_JOB
              </Link>
            </div>
          </div>
        </section>

        {/* Stats bar */}
        <section className="bg-rms-dark border-b border-[#444]">
          <div className="max-w-4xl mx-auto grid grid-cols-2 sm:grid-cols-4 divide-x divide-[#444]">
            {[
              { value: '10K+', label: 'ACTIVE_JOBS'    },
              { value: '50K+', label: 'CANDIDATES'      },
              { value: '2K+',  label: 'COMPANIES'       },
              { value: '94%',  label: 'PLACEMENT_RATE'  },
            ].map(({ value, label }) => (
              <div key={label} className="px-6 py-5 text-center">
                <p className="text-xl font-medium text-rms-yellow">{value}</p>
                <p className="text-[8px] tracking-[0.3em] text-rms-faint mt-1">{label}</p>
              </div>
            ))}
          </div>
        </section>

        {/* How it works */}
        <section className="py-20 px-6">
          <div className="max-w-4xl mx-auto">
            <p className="section-label mb-8">HOW_IT_WORKS</p>

            <div className="grid sm:grid-cols-3 gap-0 border border-rms-border">
              {[
                { step: '01', title: 'SEARCH_&_DISCOVER', desc: 'Browse curated job listings. Filter by location, skills, and company to find your perfect role.' },
                { step: '02', title: 'APPLY_WITH_EASE',   desc: 'Upload your resume, write a cover letter, and submit your application with a single click.'     },
                { step: '03', title: 'TRACK_&_SUCCEED',   desc: 'Follow every application in real time — from PENDING to SELECTED.'                               },
              ].map(({ step, title, desc }, i) => (
                <div key={step} className={`p-8 bg-white ${i < 2 ? 'border-r border-rms-border' : ''}`}>
                  <p className="text-[9px] tracking-[0.3em] text-rms-yellow mb-4">{step}</p>
                  <h3 className="text-xs font-medium tracking-widest mb-3">{title}</h3>
                  <p className="text-[10px] text-rms-muted leading-relaxed">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 px-6 bg-rms-black border-t-2 border-rms-yellow">
          <div className="max-w-2xl mx-auto text-center">
            <p className="text-[9px] tracking-[0.4em] text-rms-faint mb-4">READY_TO_START</p>
            <h2 className="text-2xl font-medium text-rms-cream mb-6">
              Join thousands of professionals<br />already using RMS<span className="cursor">_</span>
            </h2>
            <div className="flex flex-wrap justify-center gap-3">
              <Link href="/auth/register?role=applicant" className="btn-yellow px-8 py-3 text-xs">
                I'M_LOOKING_FOR_WORK
              </Link>
              <Link href="/auth/register?role=recruiter" className="btn-ghost px-8 py-3 text-xs border-[#444] text-rms-faint hover:text-rms-cream hover:border-rms-faint">
                I'M_HIRING
              </Link>
            </div>
          </div>
        </section>

      </main>

      <footer className="bg-rms-black border-t border-[#333] py-6 px-6">
        <p className="text-center text-[9px] font-mono tracking-widest text-[#444] uppercase">
          © {new Date().getFullYear()} RMS_ — Recruitment Management System — University Software Engineering Project
        </p>
      </footer>
    </>
  );
}
