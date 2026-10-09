import React, { useState, useEffect } from 'react';
import { CalendarCheck, Check, Clock, Play, ArrowRight } from 'lucide-react';
import { StatusPill } from '../common/StatusPill';

export const PreparationPlan: React.FC = () => {
  const defaultSchedule = [
    { day: 'Monday', topic: 'DBMS Fundamentals & Normalization', dur: '30 min', key: 'Monday_DBMS' },
    { day: 'Tuesday', topic: 'SQL Subqueries, Aggregates & Window Functions', dur: '30 min', key: 'Tuesday_SQL' },
    { day: 'Wednesday', topic: 'DSA — Trees, Hash Maps & Two Pointers', dur: '45 min', key: 'Wednesday_DSA' },
    { day: 'Thursday', topic: 'Spoken Communication & Self Introduction', dur: '20 min', key: 'Thursday_Communication' },
    { day: 'Friday', topic: 'Technical Interview Simulation Drill', dur: '30 min', key: 'Friday_Technical Interview' },
    { day: 'Saturday', topic: 'Full Recruiter Mock Interview & Review', dur: '45 min', key: 'Saturday_Mock Interview' },
    { day: 'Sunday', topic: 'Weekly Revision & Weak Area Flashcards', dur: '40 min', key: 'Sunday_Revision' },
  ];

  const [planState, setPlanState] = useState<Record<string, 'Not Started' | 'In Progress' | 'Completed'>>({});

  useEffect(() => {
    fetch('/api/plan')
      .then(r => r.json())
      .then(d => {
        if (d.plan) setPlanState(d.plan);
      });
  }, []);

  const handleToggleStatus = async (key: string) => {
    const current = planState[key] || 'Not Started';
    const next: 'Not Started' | 'In Progress' | 'Completed' =
      current === 'Not Started' ? 'In Progress' : (current === 'In Progress' ? 'Completed' : 'Not Started');

    setPlanState(prev => ({ ...prev, [key]: next }));

    try {
      await fetch('/api/plan', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ dayTopic: key, status: next })
      });
    } catch (err) {
      console.error(err);
    }
  };

  const completedCount = Object.values(planState).filter(s => s === 'Completed').length;
  const pct = Math.round((completedCount / defaultSchedule.length) * 100);

  return (
    <div className="space-y-6">
      <div className="bg-white border border-neutral-200 rounded-2xl p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-neutral-900 flex items-center gap-2">
            <CalendarCheck className="w-5 h-5 text-neutral-900" />
            My Weekly Preparation Sprint
          </h1>
          <p className="text-xs text-neutral-500 mt-1">
            Tailored 7-day preparation cadence calibrated to your measured skill gaps and target recruiter.
          </p>
        </div>

        <div className="flex items-center gap-3 bg-neutral-50 p-3 rounded-xl border border-neutral-200">
          <div>
            <div className="text-[11px] font-semibold text-neutral-500 uppercase">Weekly Completion</div>
            <div className="text-base font-bold text-neutral-900 font-mono">
              {completedCount} / {defaultSchedule.length} days ({pct}%)
            </div>
          </div>
          <div className="w-16 bg-neutral-200 h-2 rounded-full overflow-hidden">
            <div className="bg-neutral-900 h-full rounded-full transition-all" style={{ width: `${pct}%` }} />
          </div>
        </div>
      </div>

      {/* 7-Day Sprint Checklist */}
      <div className="space-y-3">
        {defaultSchedule.map(item => {
          const status = planState[item.key] || 'Not Started';
          return (
            <div
              key={item.key}
              className={`p-4 rounded-xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                status === 'Completed'
                  ? 'bg-neutral-50/60 border-neutral-300'
                  : 'bg-white border-neutral-200'
              }`}
            >
              <div className="flex items-start gap-3">
                <span className="w-24 text-xs font-bold text-neutral-900 shrink-0">
                  {item.day}
                </span>
                <div>
                  <div className="text-xs lg:text-sm font-semibold text-neutral-900">
                    {item.topic}
                  </div>
                  <div className="text-[11px] text-neutral-500 flex items-center gap-1 mt-0.5">
                    <Clock className="w-3 h-3 text-neutral-400" />
                    <span>Estimated: {item.dur}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 shrink-0 self-end sm:self-auto">
                <StatusPill status={status} size="sm" />
                <button
                  onClick={() => handleToggleStatus(item.key)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 ${
                    status === 'Completed'
                      ? 'bg-white border border-neutral-300 text-neutral-700 hover:bg-neutral-50'
                      : (status === 'In Progress'
                        ? 'bg-emerald-700 hover:bg-emerald-800 text-white shadow-xs'
                        : 'bg-neutral-900 hover:bg-neutral-800 text-white shadow-xs')
                  }`}
                >
                  {status === 'Completed' ? 'Reset' : (status === 'In Progress' ? 'Mark Done ✓' : 'Start Task')}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
