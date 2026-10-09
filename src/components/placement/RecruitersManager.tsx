import React, { useState, useEffect } from 'react';
import { Recruiter } from '../../types';
import { Building2, Briefcase, Award, Users, CheckCircle2 } from 'lucide-react';

export const RecruitersManager: React.FC = () => {
  const [recruiters, setRecruiters] = useState<Recruiter[]>([]);

  useEffect(() => {
    fetch('/api/recruiters')
      .then(r => r.json())
      .then(d => {
        if (d.recruiters) setRecruiters(d.recruiters);
      });
  }, []);

  return (
    <div className="space-y-6">
      <div className="bg-white border border-neutral-200 rounded-2xl p-5 shadow-xs">
        <h1 className="text-xl font-bold text-neutral-900 flex items-center gap-2">
          <Building2 className="w-5 h-5 text-neutral-900" />
          Campus Recruiter Partners & Hiring Drives
        </h1>
        <p className="text-xs text-neutral-500 mt-1">
          Target companies, salary bands, required competency tracks, and institutional criteria.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {recruiters.map(r => (
          <div
            key={r.name}
            className="p-5 bg-white border border-neutral-200 rounded-2xl shadow-xs space-y-3"
          >
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-base font-bold text-neutral-900">{r.name}</h3>
                <div className="text-xs text-neutral-500 mt-0.5">{r.role} · {r.type} Recruiter</div>
              </div>
              <span className="text-xs font-mono font-bold text-neutral-900 bg-neutral-100 border border-neutral-200 px-2.5 py-1 rounded-lg">
                ₹ {r.package}
              </span>
            </div>

            <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-200 text-xs space-y-1 text-neutral-700">
              <div className="flex justify-between">
                <span>Minimum Readiness Threshold:</span>
                <strong className="font-mono text-neutral-900">{r.criteria.minReadiness}%</strong>
              </div>
              <div className="flex justify-between">
                <span>Eligible Departments:</span>
                <span className="font-semibold text-[11px] text-neutral-800">{r.criteria.allowedDepts.slice(0, 3).join(', ')}...</span>
              </div>
            </div>

            <div>
              <div className="text-[11px] font-semibold text-neutral-400 uppercase mb-1.5">Key Required Skills</div>
              <div className="flex flex-wrap gap-1.5">
                {r.requiredSkills.map(sk => (
                  <span
                    key={sk}
                    className="text-[11px] px-2 py-0.5 rounded bg-neutral-100 text-neutral-800 border border-neutral-200 font-medium"
                  >
                    {sk}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
