import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { RadarChart } from '../common/RadarChart';
import { StatusPill } from '../common/StatusPill';
import { TrendingUp, Award, CheckCircle, AlertCircle, Sparkles } from 'lucide-react';

export const StudentReadiness: React.FC = () => {
  const { student, setActiveTab } = useAuth();

  if (!student) return null;

  const radarData = [
    { subject: 'Technical', score: student.technical },
    { subject: 'Communication', score: student.communication },
    { subject: 'Aptitude', score: student.aptitude },
    { subject: 'Interview', score: student.interviewSkills },
    { subject: 'Coding', score: student.coding },
    { subject: 'Recruiter Fit', score: 79 },
  ];

  return (
    <div className="space-y-6">
      <div className="bg-white border border-neutral-200 rounded-2xl p-5 shadow-xs">
        <h1 className="text-xl font-bold text-neutral-900 flex items-center gap-2">
          <Award className="w-5 h-5 text-neutral-900" />
          CareerTwin Readiness Score Deep Dive
        </h1>
        <p className="text-xs text-neutral-500 mt-1">
          Audited placement probability calibrated to day-1 recruiter shortlisting models.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Left Column: Big Score Card (5 cols) */}
        <div className="lg:col-span-5 bg-white border border-neutral-200 rounded-2xl p-6 shadow-xs flex flex-col items-center justify-center text-center">
          <span className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">
            Overall Campus Placement Readiness
          </span>
          <div className="mt-3 text-7xl font-black text-neutral-900 font-mono tracking-tight">
            {student.readiness}
          </div>
          <span className="text-xs font-mono text-neutral-400 mt-1">out of 100 maximum index</span>

          <div className="mt-3">
            <StatusPill status={student.status} size="md" />
          </div>

          <div className="mt-4 p-3 rounded-xl bg-neutral-50 border border-neutral-200 text-xs text-neutral-700 max-w-sm">
            Current clearance band for <strong>{student.targetRecruiter}</strong>: <strong>Eligible & Competitive</strong>.
          </div>
        </div>

        {/* Right Column: Radar Chart Breakdown (7 cols) */}
        <div className="lg:col-span-7 bg-white border border-neutral-200 rounded-2xl p-6 shadow-xs flex flex-col justify-between">
          <h2 className="text-sm font-bold text-neutral-900 mb-2">
            Skill Dimension Balance
          </h2>
          <div className="flex justify-center my-2">
            <RadarChart data={radarData} size={280} color="#171717" />
          </div>
          <div className="text-[11px] text-neutral-400 text-center font-mono">
            Scale: 0 (Beginner) to 100 (Day-1 Industry Ready)
          </div>
        </div>
      </div>

      {/* Causal Explainer: Why Score Changed */}
      <div className="p-5 bg-neutral-50 border border-neutral-200 rounded-2xl shadow-xs space-y-3">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-neutral-900" />
          <h3 className="text-xs font-bold text-neutral-900 uppercase tracking-wider">
            AI Readiness Explainer — Recent Factors
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
          <div className="p-3 bg-white rounded-xl border border-neutral-200 space-y-1">
            <div className="font-bold text-emerald-700">+2.4 Points: Mock Interview</div>
            <p className="text-neutral-600">
              Completed TCS simulation session with 8.2/10 STAR delivery rating.
            </p>
          </div>
          <div className="p-3 bg-white rounded-xl border border-neutral-200 space-y-1">
            <div className="font-bold text-emerald-700">+1.6 Points: SQL Practice</div>
            <p className="text-neutral-600">
              Solved 4 high-frequency database questions with 85% first-attempt accuracy.
            </p>
          </div>
          <div className="p-3 bg-white rounded-xl border border-neutral-200 space-y-1">
            <div className="font-bold text-neutral-900">Next Target: +4.0 Points</div>
            <p className="text-neutral-600">
              Complete DSA Graph BFS/DFS module to push total readiness past 82%.
            </p>
          </div>
        </div>
      </div>

      {/* Top Recommended Actions */}
      <div className="bg-white border border-neutral-200 rounded-2xl p-5 shadow-xs space-y-3">
        <h2 className="text-sm font-bold text-neutral-900">
          Top 3 High-Impact Recommended Actions
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div
            onClick={() => setActiveTab('practice')}
            className="p-4 rounded-xl border border-neutral-200 hover:border-neutral-900 bg-white cursor-pointer transition-colors"
          >
            <div className="text-xs font-bold text-neutral-900">1. Master Dynamic Programming</div>
            <p className="text-[11px] text-neutral-500 mt-1">
              Top differentiator for TCS Digital (7 LPA) and Zoho (8.5 LPA) product tracks.
            </p>
          </div>

          <div
            onClick={() => setActiveTab('mock_interview')}
            className="p-4 rounded-xl border border-neutral-200 hover:border-neutral-900 bg-white cursor-pointer transition-colors"
          >
            <div className="text-xs font-bold text-neutral-900">2. Technical Mock Round 2</div>
            <p className="text-[11px] text-neutral-500 mt-1">
              Practice answering edge-case questions using the STAR framework.
            </p>
          </div>

          <div
            onClick={() => setActiveTab('resume')}
            className="p-4 rounded-xl border border-neutral-200 hover:border-neutral-900 bg-white cursor-pointer transition-colors"
          >
            <div className="text-xs font-bold text-neutral-900">3. Optimize ATS Keywords</div>
            <p className="text-[11px] text-neutral-500 mt-1">
              Add CI/CD and Docker foundations to boost resume ATS score past 90%.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
