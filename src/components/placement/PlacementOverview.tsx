import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { KpiCard } from '../common/KpiCard';
import { StatusPill } from '../common/StatusPill';
import {
  Users,
  Building2,
  TrendingUp,
  AlertTriangle,
  Award,
  Layers,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';

export const PlacementOverview: React.FC = () => {
  const { tenant, setActiveTab } = useAuth();
  const [stats, setStats] = useState({
    total: 400,
    active: 340,
    averageReadiness: 71,
    interviewReady: 112,
    needsIntervention: 86,
    placementRate: 78,
  });

  const deptData = [
    { dept: 'AI & DS', avg: 82, count: 50 },
    { dept: 'CSE', avg: 79, count: 120 },
    { dept: 'CSE (Cyber)', avg: 77, count: 40 },
    { dept: 'IT', avg: 75, count: 45 },
    { dept: 'ECE', avg: 72, count: 65 },
    { dept: 'EEE', avg: 67, count: 35 },
    { dept: 'MECH', avg: 64, count: 25 },
    { dept: 'CIVIL', avg: 61, count: 20 },
  ];

  return (
    <div className="space-y-6">
      {/* Title & Institutional Banner */}
      <div className="bg-white border border-neutral-200 rounded-2xl p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-neutral-900">
              Campus Placement Operations Workspace
            </h1>
            <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-neutral-100 text-neutral-900 border border-neutral-200">
              {tenant?.code || 'RCEE'}
            </span>
          </div>
          <p className="text-xs text-neutral-500 mt-1">
            Real-time cohort readiness telemetry and recruiter intelligence before campus day.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-semibold text-emerald-800 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200 w-fit">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>Tenant Data Isolation Active</span>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 lg:gap-4">
        <KpiCard
          label="Total Cohort"
          value={stats.total}
          sub="Final & Pre-Final"
          icon={<Users className="w-4 h-4 text-neutral-400" />}
        />
        <KpiCard
          label="Active Trainees"
          value={stats.active}
          sub="85% weekly engagement"
        />
        <KpiCard
          label="Avg Readiness"
          value={`${stats.averageReadiness}%`}
          trend="+3.2% MoM"
          trendUp={true}
          icon={<TrendingUp className="w-4 h-4 text-emerald-600" />}
        />
        <KpiCard
          label="Interview Ready"
          value={stats.interviewReady}
          sub="Readiness ≥80%"
        />
        <KpiCard
          label="Intervention Pool"
          value={stats.needsIntervention}
          trend="86 students"
          trendUp={false}
          icon={<AlertTriangle className="w-4 h-4 text-amber-600" />}
        />
        <KpiCard
          label="Placement Rate"
          value={`${stats.placementRate}%`}
          sub="Projected offers"
          icon={<Award className="w-4 h-4 text-neutral-900" />}
        />
      </div>

      {/* Split Grids: Department Readiness vs. Status Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Department Readiness Bars (7 cols) */}
        <div className="lg:col-span-7 bg-white border border-neutral-200 rounded-2xl p-5 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-bold text-neutral-900 flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-neutral-900" />
              Department-Wise Average Readiness Index
            </h2>
            <button
              onClick={() => setActiveTab('students')}
              className="text-xs text-neutral-900 font-semibold hover:underline flex items-center gap-1"
            >
              <span>View Cohort</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {deptData.map(d => (
              <div key={d.dept} className="space-y-1">
                <div className="flex justify-between text-xs font-semibold text-neutral-800">
                  <span>{d.dept} <span className="font-normal text-[11px] text-neutral-500">({d.count} students)</span></span>
                  <span className="font-mono text-neutral-900">{d.avg}%</span>
                </div>
                <div className="w-full bg-neutral-100 h-2 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${
                      d.avg >= 80 ? 'bg-emerald-600' : (d.avg >= 70 ? 'bg-neutral-900' : 'bg-neutral-400')
                    }`}
                    style={{ width: `${d.avg}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Readiness Status Distribution & Quick Workflows (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white border border-neutral-200 rounded-2xl p-5 shadow-xs">
            <h2 className="text-sm font-bold text-neutral-900 mb-3">
              Cohort Preparedness Distribution
            </h2>

            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-xl bg-neutral-50 border border-neutral-200 flex items-center justify-between">
                <div>
                  <div className="font-bold text-neutral-900">Interview Ready (≥80%)</div>
                  <div className="text-[11px] text-neutral-500">Can clear technical screening immediately</div>
                </div>
                <span className="text-xl font-extrabold font-mono text-emerald-700">112</span>
              </div>

              <div className="p-3 rounded-xl bg-neutral-50 border border-neutral-200 flex items-center justify-between">
                <div>
                  <div className="font-bold text-neutral-900">On Track (65–79%)</div>
                  <div className="text-[11px] text-neutral-500">Need 2-3 mock interview iterations</div>
                </div>
                <span className="text-xl font-extrabold font-mono text-neutral-900">202</span>
              </div>

              <div className="p-3 rounded-xl bg-neutral-50 border border-neutral-200 flex items-center justify-between">
                <div>
                  <div className="font-bold text-neutral-900">Needs Intervention (&lt;65%)</div>
                  <div className="text-[11px] text-neutral-500">Critical coding or communication gap</div>
                </div>
                <span className="text-xl font-extrabold font-mono text-amber-700">86</span>
              </div>
            </div>
          </div>

          {/* Quick Action Trigger */}
          <div className="p-4 rounded-2xl bg-white border border-neutral-200 shadow-xs flex items-center justify-between">
            <div>
              <div className="text-xs font-bold text-neutral-900">Intervention Center</div>
              <div className="text-[11px] text-neutral-500 mt-0.5">86 students pending mentor assignment</div>
            </div>
            <button
              onClick={() => setActiveTab('interventions')}
              className="px-3.5 py-1.5 bg-neutral-900 text-white rounded-lg text-xs font-bold hover:bg-neutral-800 transition-colors"
            >
              Open Interventions
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
