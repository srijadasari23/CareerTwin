import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { KpiCard } from '../common/KpiCard';
import { StatusPill } from '../common/StatusPill';
import { RadarChart } from '../common/RadarChart';
import {
  Flame,
  CheckCircle2,
  Calendar,
  ArrowRight,
  TrendingUp,
  Info,
  Building,
  Target,
  FileCheck,
  Sparkles,
} from 'lucide-react';

export const StudentOverview: React.FC = () => {
  const { student, setActiveTab, tenant } = useAuth();
  const { t } = useLanguage();
  const [showFormulaModal, setShowFormulaModal] = useState(false);

  if (!student) {
    return (
      <div className="p-8 text-center text-neutral-500">
        Loading student workspace...
      </div>
    );
  }

  const radarData = [
    { subject: 'Technical', score: student.technical },
    { subject: 'Communication', score: student.communication },
    { subject: 'Aptitude', score: student.aptitude },
    { subject: 'Interview', score: student.interviewSkills },
    { subject: 'Coding', score: student.coding },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome & Target Recruiter Header */}
      <div className="bg-white border border-neutral-200 rounded-2xl p-5 lg:p-6 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl lg:text-2xl font-black text-neutral-900 tracking-tight">
              Good morning, {student.name.split(' ')[0]}
            </h1>
            <StatusPill status={student.status} />
          </div>
          <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-neutral-500">
            <span>{student.department} · {student.year}</span>
            <span aria-hidden="true">·</span>
            <span>ID: <strong className="font-mono text-neutral-800">{student.studentId}</strong></span>
            <span aria-hidden="true">·</span>
            <span>CGPA: <strong className="font-mono text-neutral-800">{student.cgpa}</strong></span>
            <span aria-hidden="true">·</span>
            <span>Institution: <strong className="text-neutral-900 font-semibold">{tenant?.code || 'RCEE'}</strong></span>
          </div>
        </div>

        <div className="flex items-center gap-3 bg-neutral-50 p-3 rounded-xl border border-neutral-200 shrink-0">
          <div className="w-10 h-10 rounded-lg bg-neutral-900 text-white flex items-center justify-center font-bold text-sm shrink-0">
            <Target className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider">Target Recruiter</div>
            <div className="text-sm font-bold text-neutral-900">
              {student.targetRecruiter} <span className="font-normal text-xs text-neutral-500">({student.targetRole})</span>
            </div>
          </div>
        </div>
      </div>

      {/* Primary KPI Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 lg:gap-4">
        <KpiCard
          label={t('overallReadiness')}
          value={`${student.readiness}%`}
          trend="+4 this week"
          trendUp={true}
          icon={<TrendingUp className="w-4 h-4 text-emerald-600" />}
        />
        <KpiCard
          label="Technical Skills"
          value={`${student.technical}%`}
          sub="Strong proficiency"
        />
        <KpiCard
          label="Communication"
          value={`${student.communication}%`}
          sub="Verbal fluency"
        />
        <KpiCard
          label="Practice Completed"
          value={`${student.practiceCompletion}%`}
          sub="On track"
        />
        <KpiCard
          label="Mock Interviews"
          value={student.mockInterviews}
          sub="1 completed recently"
        />
        <KpiCard
          label={t('currentStreak')}
          value={`${student.streakDays}d`}
          trend="Keep going!"
          trendUp={true}
          icon={<Flame className="w-4 h-4 text-amber-600" />}
        />
      </div>

      {/* Main Split: Readiness Breakdown & Recommended Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Left Column: Readiness Composite Explanation (7 cols) */}
        <div className="lg:col-span-7 bg-white border border-neutral-200 rounded-2xl p-5 lg:p-6 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
              <div>
                <h2 className="text-base font-bold text-neutral-900">
                  Career Readiness Architecture
                </h2>
                <p className="text-xs text-neutral-500">
                  Multivariate composite calculated from verified practice and assessments
                </p>
              </div>
              <button
                onClick={() => setShowFormulaModal(true)}
                className="text-xs text-neutral-900 font-semibold hover:underline flex items-center gap-1"
              >
                <Info className="w-3.5 h-3.5" />
                <span>Explain Formula</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 items-center">
              <div className="flex justify-center">
                <RadarChart data={radarData} size={240} />
              </div>
              <div className="space-y-2 text-xs">
                <div className="p-2.5 rounded-xl bg-neutral-50 border border-neutral-200">
                  <div className="flex justify-between font-semibold">
                    <span>Technical Foundations (30%)</span>
                    <span className="font-mono">{student.technical}%</span>
                  </div>
                  <div className="w-full bg-neutral-200 h-1.5 rounded-full mt-1.5 overflow-hidden">
                    <div className="bg-neutral-900 h-full rounded-full" style={{ width: `${student.technical}%` }} />
                  </div>
                </div>

                <div className="p-2.5 rounded-xl bg-neutral-50 border border-neutral-200">
                  <div className="flex justify-between font-semibold">
                    <span>Spoken Communication (20%)</span>
                    <span className="font-mono">{student.communication}%</span>
                  </div>
                  <div className="w-full bg-neutral-200 h-1.5 rounded-full mt-1.5 overflow-hidden">
                    <div className="bg-neutral-700 h-full rounded-full" style={{ width: `${student.communication}%` }} />
                  </div>
                </div>

                <div className="p-2.5 rounded-xl bg-neutral-50 border border-neutral-200">
                  <div className="flex justify-between font-semibold">
                    <span>Analytical Aptitude (15%)</span>
                    <span className="font-mono">{student.aptitude}%</span>
                  </div>
                  <div className="w-full bg-neutral-200 h-1.5 rounded-full mt-1.5 overflow-hidden">
                    <div className="bg-neutral-700 h-full rounded-full" style={{ width: `${student.aptitude}%` }} />
                  </div>
                </div>

                <div className="p-2.5 rounded-xl bg-neutral-50 border border-neutral-200">
                  <div className="flex justify-between font-semibold">
                    <span>Interview & STAR Delivery (20%)</span>
                    <span className="font-mono">{student.interviewSkills}%</span>
                  </div>
                  <div className="w-full bg-neutral-200 h-1.5 rounded-full mt-1.5 overflow-hidden">
                    <div className="bg-neutral-800 h-full rounded-full" style={{ width: `${student.interviewSkills}%` }} />
                  </div>
                </div>

                <div className="p-2.5 rounded-xl bg-neutral-50 border border-neutral-200">
                  <div className="flex justify-between font-semibold">
                    <span>Coding & Algorithms (15%)</span>
                    <span className="font-mono">{student.coding}%</span>
                  </div>
                  <div className="w-full bg-neutral-200 h-1.5 rounded-full mt-1.5 overflow-hidden">
                    <div className="bg-neutral-900 h-full rounded-full" style={{ width: `${student.coding}%` }} />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Institutional Eligibility Notice */}
          <div className="mt-4 pt-3 border-t border-neutral-100 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 text-neutral-600">
              <FileCheck className="w-4 h-4 text-emerald-700" />
              <span>Placement Eligibility: <strong>Verified by RCEE Placement Cell</strong></span>
            </div>
            <span className="font-mono font-bold text-emerald-800">
              Eligible for {student.targetRecruiter} (Min 65%)
            </span>
          </div>
        </div>

        {/* Right Column: Recommended Today & AI Actions (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white border border-neutral-200 rounded-2xl p-5 shadow-2xs">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-bold text-neutral-900 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-neutral-900" />
                Recommended Today
              </h2>
              <span className="text-[11px] font-semibold text-neutral-400">Tailored for {student.targetRecruiter}</span>
            </div>

            <div className="space-y-2.5">
              <div
                onClick={() => setActiveTab('practice')}
                className="group p-3 rounded-xl border border-neutral-200 hover:border-neutral-900 bg-white cursor-pointer transition-all"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-neutral-900">
                    Practice SQL Subqueries & JOINs
                  </span>
                  <ArrowRight className="w-3.5 h-3.5 text-neutral-400 group-hover:translate-x-0.5 transition-transform" />
                </div>
                <p className="text-[11px] text-neutral-500 mt-1">
                  20 mins · TCS asked this in Technical Round 1 across 3 previous drives.
                </p>
              </div>

              <div
                onClick={() => setActiveTab('mock_interview')}
                className="group p-3 rounded-xl border border-neutral-200 hover:border-neutral-900 bg-white cursor-pointer transition-all"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-neutral-900">
                    Take TCS Technical Mock Interview
                  </span>
                  <ArrowRight className="w-3.5 h-3.5 text-neutral-400 group-hover:translate-x-0.5 transition-transform" />
                </div>
                <p className="text-[11px] text-neutral-500 mt-1">
                  15 mins · Evaluated using STAR format with instant speech & clarity coaching.
                </p>
              </div>

              <div
                onClick={() => setActiveTab('comm_lab')}
                className="group p-3 rounded-xl border border-neutral-200 hover:border-neutral-900 bg-white cursor-pointer transition-all"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-neutral-900">
                    60-Second Self Introduction Drill
                  </span>
                  <ArrowRight className="w-3.5 h-3.5 text-neutral-400 group-hover:translate-x-0.5 transition-transform" />
                </div>
                <p className="text-[11px] text-neutral-500 mt-1">
                  Available with Telugu concept explanations and English speaking coach.
                </p>
              </div>
            </div>
          </div>

          {/* AI Career Copilot Callout */}
          <div className="bg-neutral-50 border border-neutral-200 rounded-2xl p-5 shadow-2xs space-y-2">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-neutral-900" />
              <h3 className="text-xs font-bold text-neutral-900 uppercase tracking-wider">
                AI Career Copilot
              </h3>
            </div>
            <p className="text-xs text-neutral-600 leading-relaxed">
              Need a personalized 30-day placement sprint or concept explanation in Telugu?
            </p>
            <button
              onClick={() => setActiveTab('copilot')}
              className="mt-2 w-full py-2 px-3 bg-neutral-900 hover:bg-neutral-800 text-white rounded-lg text-xs font-semibold shadow-xs flex items-center justify-center gap-2 transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Launch AI Career Copilot</span>
            </button>
          </div>
        </div>
      </div>

      {/* Formula Modal */}
      {showFormulaModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-900/40 backdrop-blur-2xs p-4">
          <div className="bg-white border border-neutral-200 rounded-2xl max-w-lg w-full p-6 shadow-xl">
            <h3 className="text-base font-bold text-neutral-900">
              Readiness Score Calculation Methodology
            </h3>
            <p className="text-xs text-neutral-500 mt-1">
              CareerTwin employs an audited, deterministic multivariate model calibrated to Indian campus recruitment patterns.
            </p>

            <div className="mt-4 p-3 bg-neutral-50 border border-neutral-200 rounded-xl font-mono text-xs text-neutral-800 space-y-1">
              <div>Readiness = (0.30 × Technical)</div>
              <div>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;+ (0.20 × Communication)</div>
              <div>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;+ (0.15 × Aptitude)</div>
              <div>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;+ (0.20 × Interview Skills)</div>
              <div>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;+ (0.15 × Coding Proficiency)</div>
            </div>

            <div className="mt-4 space-y-2 text-xs text-neutral-600">
              <div>• <strong>80–100 (Interview Ready):</strong> High probability of clearing day-1 recruiter rounds.</div>
              <div>• <strong>65–79 (On Track):</strong> Meets baseline criteria; requires targeted mock practice.</div>
              <div>• <strong>45–64 (Needs Improvement):</strong> Flagged for department intervention and skill workshops.</div>
              <div>• <strong>&lt;45 (High Priority):</strong> Assigned dedicated mentor follow-up.</div>
            </div>

            <button
              onClick={() => setShowFormulaModal(false)}
              className="mt-6 w-full py-2 bg-neutral-900 text-white rounded-lg text-xs font-semibold"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
