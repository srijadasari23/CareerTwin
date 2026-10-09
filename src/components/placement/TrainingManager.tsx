import React, { useState, useEffect } from 'react';
import { TrainingProgram } from '../../types';
import { GraduationCap, Users, TrendingUp, CheckCircle } from 'lucide-react';
import { StatusPill } from '../common/StatusPill';

export const TrainingManager: React.FC = () => {
  const [trainings, setTrainings] = useState<TrainingProgram[]>([]);
  const [enrollingId, setEnrollingId] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/trainings')
      .then(r => r.json())
      .then(d => {
        if (d.trainings) setTrainings(d.trainings);
      });
  }, []);

  const handleEnrollBatch = async (id: string) => {
    setEnrollingId(id);
    try {
      const res = await fetch(`/api/trainings/${id}/enroll`, { method: 'POST' });
      if (res.ok) {
        const data = await res.json();
        setTrainings(prev => prev.map(t => t.id === id ? data.training : t));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setEnrollingId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white border border-neutral-200 rounded-2xl p-5 shadow-xs">
        <h1 className="text-xl font-bold text-neutral-900 flex items-center gap-2">
          <GraduationCap className="w-5 h-5 text-neutral-900" />
          Structured Intervention & Training Programs
        </h1>
        <p className="text-xs text-neutral-500 mt-1">
          Targeted institutional bootcamp cohorts designed to bridge verified skill gaps.
        </p>
      </div>

      <div className="space-y-4">
        {trainings.map(t => (
          <div
            key={t.id}
            className="p-5 bg-white border border-neutral-200 rounded-2xl shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4"
          >
            <div className="space-y-1.5 flex-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-neutral-900">{t.category}</span>
                <span aria-hidden="true" className="text-neutral-300">·</span>
                <span className="text-[11px] text-neutral-500">{t.durationWeeks} Weeks Bootcamp</span>
                <StatusPill status={t.status} size="sm" />
              </div>

              <h3 className="text-sm lg:text-base font-bold text-neutral-900">
                {t.program}
              </h3>

              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-neutral-500">
                <span>Instructor: <strong className="text-neutral-800">{t.instructor}</strong></span>
                <span aria-hidden="true">·</span>
                <span>Enrolled: <strong className="font-mono text-neutral-900">{t.enrolled}</strong> students</span>
                <span aria-hidden="true">·</span>
                <span className="text-emerald-700 font-semibold font-mono">Avg Gain: +{t.avgImprovement}%</span>
              </div>

              <div className="mt-2 w-full max-w-md bg-neutral-100 h-1.5 rounded-full overflow-hidden">
                <div
                  className="bg-neutral-900 h-full rounded-full"
                  style={{ width: `${t.completionPct}%` }}
                />
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => handleEnrollBatch(t.id)}
                disabled={enrollingId === t.id}
                className="px-3.5 py-2 bg-neutral-900 hover:bg-neutral-800 disabled:opacity-50 text-white rounded-xl text-xs font-bold shadow-xs transition-colors"
              >
                {enrollingId === t.id ? 'Assigning...' : 'Enroll Eligible Cohort'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
