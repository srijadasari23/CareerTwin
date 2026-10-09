import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Recruiter, Question } from '../../types';
import { StatusPill } from '../common/StatusPill';
import {
  Building2,
  CheckCircle2,
  Layers,
  Briefcase,
} from 'lucide-react';

export const StudentRecruiterIntel: React.FC = () => {
  const { student } = useAuth();
  const [recruiters, setRecruiters] = useState<Recruiter[]>([]);
  const [selectedRecruiter, setSelectedRecruiter] = useState<string>(student?.targetRecruiter || 'TCS');
  const [selectedRole, setSelectedRole] = useState<string>('All');
  const [selectedRound, setSelectedRound] = useState<string>('All');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch('/api/recruiters')
      .then(r => r.json())
      .then(d => {
        if (d.recruiters) setRecruiters(d.recruiters);
      });
  }, []);

  useEffect(() => {
    setLoading(true);
    const query = new URLSearchParams({
      recruiter: selectedRecruiter,
      ...(selectedRole !== 'All' && { role: selectedRole }),
      ...(selectedRound !== 'All' && { round: selectedRound }),
    });

    fetch(`/api/questions?${query.toString()}`)
      .then(r => r.json())
      .then(d => {
        if (d.questions) setQuestions(d.questions);
      })
      .finally(() => setLoading(false));
  }, [selectedRecruiter, selectedRole, selectedRound]);

  const activeRecruiterObj = recruiters.find(r => r.name === selectedRecruiter) || recruiters[0];

  const topicCounts: Record<string, number> = {};
  questions.forEach(q => {
    topicCounts[q.topic] = (topicCounts[q.topic] || 0) + 1;
  });
  const sortedTopics = Object.entries(topicCounts).sort((a, b) => b[1] - a[1]);

  return (
    <div className="space-y-6">
      {/* Header & Notice */}
      <div className="bg-white border border-neutral-200 rounded-2xl p-5 shadow-2xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold text-neutral-900 flex items-center gap-2">
              <Building2 className="w-5 h-5 text-neutral-900" />
              Recruiter Intelligence
            </h1>
            <p className="text-xs text-neutral-500 mt-1">
              Campus-specific historical interview questions, topic weighting, and round distributions.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs font-medium text-emerald-800 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200 w-fit">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Placement-cell verified intelligence</span>
          </div>
        </div>

        {/* Recruiter Tabs */}
        <div className="mt-5 flex gap-1.5 overflow-x-auto pb-2 scrollbar-none">
          {recruiters.map(r => (
            <button
              key={r.name}
              onClick={() => {
                setSelectedRecruiter(r.name);
                setSelectedRole('All');
              }}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                selectedRecruiter === r.name
                  ? 'bg-neutral-900 text-white shadow-2xs'
                  : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200 hover:text-neutral-900'
              }`}
            >
              {r.name}
            </button>
          ))}
        </div>
      </div>

      {/* Recruiter Profile Card */}
      {activeRecruiterObj && (
        <div className="bg-white border border-neutral-200 rounded-2xl p-5 shadow-2xs grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
          <div>
            <div className="text-[11px] font-semibold text-neutral-400 uppercase">Primary Role & Package</div>
            <div className="text-base font-bold text-neutral-900 mt-0.5">
              {activeRecruiterObj.role}
            </div>
            <div className="text-xs font-mono text-neutral-900 font-bold mt-0.5">
              ₹ {activeRecruiterObj.package}
            </div>
          </div>

          <div>
            <div className="text-[11px] font-semibold text-neutral-400 uppercase">Eligibility Criteria</div>
            <div className="text-xs text-neutral-700 mt-1">
              Min Readiness: <strong className="font-mono">{activeRecruiterObj.criteria.minReadiness}%</strong>
            </div>
            <div className="text-xs text-neutral-700">
              Min CGPA: <strong className="font-mono">{activeRecruiterObj.criteria.minCgpa}</strong>
            </div>
          </div>

          <div className="md:col-span-2">
            <div className="text-[11px] font-semibold text-neutral-400 uppercase mb-1.5">Required Skill Focus</div>
            <div className="flex flex-wrap gap-1.5">
              {activeRecruiterObj.requiredSkills.map(sk => (
                <span
                  key={sk}
                  className="px-2 py-0.5 rounded text-[11px] font-medium bg-neutral-100 border border-neutral-200 text-neutral-800"
                >
                  {sk}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Topic Weighting & Round Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        <div className="lg:col-span-8 bg-white border border-neutral-200 rounded-2xl p-5 shadow-2xs">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-bold text-neutral-900 flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-neutral-900" />
              Frequently Reported Topics for {selectedRecruiter}
            </h2>
            <span className="text-xs text-neutral-400 font-mono">
              {questions.length} questions mapped
            </span>
          </div>

          <div className="space-y-3">
            {sortedTopics.slice(0, 7).map(([topic, count]) => {
              const max = sortedTopics[0]?.[1] || 1;
              const pct = Math.round((count / max) * 100);
              return (
                <div key={topic} className="space-y-1">
                  <div className="flex justify-between text-xs font-semibold text-neutral-700">
                    <span>{topic}</span>
                    <span className="font-mono text-neutral-500">{count} questions ({pct}% weighting)</span>
                  </div>
                  <div className="w-full bg-neutral-100 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-neutral-900 h-full rounded-full transition-all duration-300"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="lg:col-span-4 bg-white border border-neutral-200 rounded-2xl p-5 shadow-2xs flex flex-col justify-between">
          <div>
            <h2 className="text-sm font-bold text-neutral-900 mb-3 flex items-center gap-1.5">
              <Briefcase className="w-4 h-4 text-neutral-900" />
              Recruitment Round Pipeline
            </h2>
            <div className="space-y-2">
              {activeRecruiterObj?.rounds.map((rnd, i) => (
                <div
                  key={rnd}
                  className="flex items-center gap-3 p-2.5 rounded-xl bg-neutral-50 border border-neutral-200 text-xs"
                >
                  <span className="w-5 h-5 rounded-full bg-neutral-900 text-white font-mono text-[10px] font-bold flex items-center justify-center shrink-0">
                    {i + 1}
                  </span>
                  <span className="font-semibold text-neutral-900">{rnd}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 p-3 rounded-xl bg-neutral-50 border border-neutral-200 text-[11px] text-neutral-600">
            Historical clearance rate for students scoring &gt;75% on CareerTwin readiness is <strong>88.4%</strong>.
          </div>
        </div>
      </div>

      {/* Reported Historical Questions */}
      <div className="bg-white border border-neutral-200 rounded-2xl p-5 shadow-2xs">
        <h2 className="text-sm font-bold text-neutral-900 mb-4">
          Verified Historical Interview Questions ({questions.length})
        </h2>

        {loading ? (
          <div className="p-8 text-center text-xs text-neutral-500">Loading recruiter questions...</div>
        ) : (
          <div className="space-y-3">
            {questions.slice(0, 10).map(q => (
              <div
                key={q.id}
                className="p-4 rounded-xl border border-neutral-200 hover:border-neutral-300 bg-white transition-colors"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="text-xs lg:text-sm font-semibold text-neutral-900">
                      {q.question}
                    </div>
                    <div className="mt-1 flex flex-wrap items-center gap-2 text-[11px] text-neutral-500">
                      <span>Topic: <strong>{q.topic}</strong></span>
                      <span aria-hidden="true">·</span>
                      <span>Round: <strong>{q.round}</strong></span>
                      <span aria-hidden="true">·</span>
                      <span>Year: <strong>{q.year}</strong></span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <StatusPill status={q.difficulty} size="sm" />
                    <StatusPill status={q.confidence} size="sm" />
                  </div>
                </div>

                {q.explanation && (
                  <div className="mt-2.5 pt-2.5 border-t border-neutral-100 text-xs text-neutral-600">
                    <strong className="text-neutral-900">Solution outline:</strong> {q.explanation}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
