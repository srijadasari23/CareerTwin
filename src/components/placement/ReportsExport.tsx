import React from 'react';
import { FileSpreadsheet, Download } from 'lucide-react';

export const ReportsExport: React.FC = () => {
  const reports = [
    {
      title: 'Student Readiness & Competency Cohort',
      desc: 'Full tabular export of all 400 enrolled students including departmental breakdown, readiness %, streak days, and status.',
      endpoint: '/api/export/students',
      filename: 'careertwin_students.csv',
      rows: '400 records'
    },
    {
      title: 'Historical Question Bank & Recruiter DB',
      desc: 'All 220+ verified historical questions with recruiter mapping, round classifications, confidence weights, and source attribution.',
      endpoint: '/api/export/questions',
      filename: 'careertwin_question_bank.csv',
      rows: '220+ records'
    },
    {
      title: 'Placement Outcomes & Package Report',
      desc: 'Empirical outcome records connecting readiness bands, eligibility flags, interview attendances, offers, and CTC compensation.',
      endpoint: '/api/export/outcomes',
      filename: 'careertwin_placement_outcomes.csv',
      rows: '400 records'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="bg-white border border-neutral-200 rounded-2xl p-5 shadow-xs">
        <h1 className="text-xl font-bold text-neutral-900 flex items-center gap-2">
          <FileSpreadsheet className="w-5 h-5 text-neutral-900" />
          Campus Reports & Analytics Exports
        </h1>
        <p className="text-xs text-neutral-500 mt-1">
          Export verified departmental data sheets for accreditation, placement records, and mentor reviews.
        </p>
      </div>

      <div className="space-y-3">
        {reports.map((r, i) => (
          <div
            key={i}
            className="p-5 bg-white border border-neutral-200 rounded-xl shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4"
          >
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xs lg:text-sm font-bold text-neutral-900">{r.title}</h3>
                <span className="text-[11px] font-mono text-neutral-400">({r.rows})</span>
              </div>
              <p className="text-xs text-neutral-500 mt-1 max-w-2xl">{r.desc}</p>
            </div>

            <a
              href={r.endpoint}
              className="flex items-center gap-2 px-4 py-2 bg-neutral-900 hover:bg-neutral-800 text-white rounded-xl text-xs font-bold shadow-xs shrink-0 transition-colors w-fit"
            >
              <Download className="w-4 h-4 text-white" />
              <span>Download CSV</span>
            </a>
          </div>
        ))}
      </div>
    </div>
  );
};
