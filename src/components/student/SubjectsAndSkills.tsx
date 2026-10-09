import React, { useState } from 'react';
import { StatusPill } from '../common/StatusPill';
import { BookOpen } from 'lucide-react';

const SKILL_TAXONOMY: Record<string, { name: string; score: number; questionsDone: number }[]> = {
  'Technical Skills': [
    { name: 'Data Structures & Algorithms', score: 82, questionsDone: 42 },
    { name: 'DBMS', score: 78, questionsDone: 35 },
    { name: 'SQL', score: 85, questionsDone: 40 },
    { name: 'Operating Systems', score: 74, questionsDone: 28 },
    { name: 'Computer Networks', score: 72, questionsDone: 25 },
    { name: 'Object-Oriented Programming', score: 88, questionsDone: 45 },
    { name: 'Java', score: 80, questionsDone: 38 },
    { name: 'Python', score: 76, questionsDone: 30 },
    { name: 'C / C++', score: 70, questionsDone: 22 },
    { name: 'Web Development', score: 84, questionsDone: 36 },
    { name: 'Cloud Fundamentals', score: 68, questionsDone: 18 },
    { name: 'Git & Version Control', score: 90, questionsDone: 24 },
    { name: 'System Design Basics', score: 65, questionsDone: 15 },
    { name: 'APIs & Backend', score: 79, questionsDone: 26 },
  ],
  'Aptitude': [
    { name: 'Quantitative Aptitude', score: 76, questionsDone: 52 },
    { name: 'Logical Reasoning', score: 80, questionsDone: 48 },
    { name: 'Data Interpretation', score: 74, questionsDone: 34 },
    { name: 'Numerical Ability', score: 72, questionsDone: 30 },
  ],
  'Verbal & Communication': [
    { name: 'English Communication', score: 84, questionsDone: 28 },
    { name: 'Verbal Ability', score: 82, questionsDone: 35 },
    { name: 'Grammar', score: 86, questionsDone: 40 },
    { name: 'Vocabulary', score: 78, questionsDone: 30 },
    { name: 'Group Discussion', score: 75, questionsDone: 18 },
    { name: 'Email Writing', score: 88, questionsDone: 15 },
  ],
  'Interview Skills': [
    { name: 'Technical Interview', score: 78, questionsDone: 24 },
    { name: 'HR Interview', score: 85, questionsDone: 20 },
    { name: 'Behavioral Interview (STAR)', score: 76, questionsDone: 18 },
    { name: 'Self Introduction', score: 90, questionsDone: 12 },
    { name: 'Project Explanation', score: 82, questionsDone: 16 },
  ],
  'Professional Skills': [
    { name: 'Teamwork', score: 88, questionsDone: 10 },
    { name: 'Time Management', score: 82, questionsDone: 8 },
    { name: 'Critical Thinking', score: 76, questionsDone: 12 },
    { name: 'Professional Etiquette', score: 92, questionsDone: 10 },
  ],
  'Career Preparation': [
    { name: 'Resume Preparation', score: 94, questionsDone: 15 },
    { name: 'LinkedIn Profile', score: 88, questionsDone: 8 },
    { name: 'Job Role Understanding', score: 85, questionsDone: 10 },
    { name: 'Company & Recruiter Research', score: 82, questionsDone: 12 },
  ],
};

export const SubjectsAndSkills: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('Technical Skills');
  const categories = Object.keys(SKILL_TAXONOMY);

  return (
    <div className="space-y-6">
      <div className="bg-white border border-neutral-200 rounded-2xl p-5 shadow-2xs">
        <h1 className="text-xl font-bold text-neutral-900 flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-neutral-900" />
          Subjects & Skills Taxonomy
        </h1>
        <p className="text-xs text-neutral-500 mt-1">
          A complete engineering campus skill map spanning 6 key dimensions beyond just DSA/DBMS.
        </p>

        {/* Category Tabs */}
        <div className="mt-4 flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveTab(cat)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                activeTab === cat
                  ? 'bg-neutral-900 text-white shadow-2xs'
                  : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200 hover:text-neutral-900'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Skills Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {SKILL_TAXONOMY[activeTab]?.map(s => {
          const status = s.score >= 80 ? 'Strong' : (s.score >= 65 ? 'Good' : 'Needs Improvement');
          return (
            <div
              key={s.name}
              className="bg-white border border-neutral-200 rounded-xl p-4 shadow-2xs flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <span className="text-xs font-bold text-neutral-900">{s.name}</span>
                  <StatusPill status={status} size="sm" />
                </div>
                <div className="mt-2 flex items-baseline gap-2">
                  <span className="text-2xl font-extrabold text-neutral-900 font-mono">
                    {s.score}%
                  </span>
                  <span className="text-[11px] text-neutral-500">
                    · {s.questionsDone} questions completed
                  </span>
                </div>
              </div>

              <div className="mt-3 w-full bg-neutral-100 h-1.5 rounded-full overflow-hidden">
                <div
                  className="bg-neutral-900 h-full rounded-full"
                  style={{ width: `${s.score}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
