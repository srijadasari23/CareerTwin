import React from 'react';
import { Flame, AlertTriangle, CheckCircle, BarChart3 } from 'lucide-react';
import { KpiCard } from '../common/KpiCard';

export const SkillGapAnalytics: React.FC = () => {
  const topGaps = [
    { name: 'Coding & Algorithmic Implementation', gap: 31, impacted: 124 },
    { name: 'SQL Window Functions & Subqueries', gap: 27, impacted: 108 },
    { name: 'Data Structures (Trees & Graphs)', gap: 26, impacted: 104 },
    { name: 'Spoken English & STAR Articulation', gap: 21, impacted: 84 },
    { name: 'Quantitative & Analytical Aptitude', gap: 19, impacted: 76 },
  ];

  const categoryGaps = [
    {
      category: 'Technical Skills',
      items: [
        { skill: 'Dynamic Programming', gap: 38 },
        { skill: 'System Design Basics', gap: 35 },
        { skill: 'Operating Systems & Concurrency', gap: 28 },
        { skill: 'Computer Networks (OSI / TCP)', gap: 25 },
        { skill: 'Relational DBMS & ACID', gap: 22 },
        { skill: 'Object-Oriented Programming', gap: 16 },
      ]
    },
    {
      category: 'Aptitude & Verbal',
      items: [
        { skill: 'Time, Speed & Distance', gap: 28 },
        { skill: 'Data Interpretation Charts', gap: 24 },
        { skill: 'Reading Comprehension', gap: 22 },
        { skill: 'Grammar & Sentence Correction', gap: 18 },
      ]
    },
    {
      category: 'Interview & Soft Skills',
      items: [
        { skill: 'STAR Behavioral Delivery', gap: 32 },
        { skill: 'Technical Project Defense', gap: 26 },
        { skill: 'Spoken English Fluency', gap: 24 },
        { skill: 'Group Discussion Turn Taking', gap: 20 },
      ]
    }
  ];

  return (
    <div className="space-y-6">
      <div className="bg-white border border-neutral-200 rounded-2xl p-5 shadow-xs">
        <h1 className="text-xl font-bold text-neutral-900 flex items-center gap-2">
          <Flame className="w-5 h-5 text-neutral-900" />
          Campus-Wide Skill Gap Heatmaps
        </h1>
        <p className="text-xs text-neutral-500 mt-1">
          Identifies deficit areas across 400 enrolled students to trigger precision training programs.
        </p>
      </div>

      {/* Top 5 Intervention Areas */}
      <div>
        <div className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider mb-2.5">
          Top 5 Intervention Priorities (Campus-Wide)
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {topGaps.map(g => (
            <div
              key={g.name}
              className="p-4 bg-white border border-neutral-200 rounded-xl shadow-xs"
            >
              <div className="text-xs font-bold text-neutral-900 truncate">{g.name}</div>
              <div className="mt-2 text-2xl font-black text-rose-700 font-mono">{g.gap}% gap</div>
              <div className="text-[11px] text-neutral-500 mt-0.5">{g.impacted} students flagged</div>
            </div>
          ))}
        </div>
      </div>

      {/* Category Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {categoryGaps.map(cat => (
          <div
            key={cat.category}
            className="p-5 bg-white border border-neutral-200 rounded-2xl shadow-xs space-y-3"
          >
            <h3 className="text-xs font-bold text-neutral-900 uppercase tracking-wider">
              {cat.category}
            </h3>

            <div className="space-y-3">
              {cat.items.map(it => (
                <div key={it.skill} className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="font-semibold text-neutral-800">{it.skill}</span>
                    <span className="font-mono text-rose-700 font-bold">{it.gap}% below</span>
                  </div>
                  <div className="w-full bg-neutral-100 h-1.5 rounded-full overflow-hidden">
                    <div
                      className="bg-rose-600 h-full rounded-full"
                      style={{ width: `${it.gap * 2.5}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
