import React, { useState, useEffect } from 'react';
import { Question } from '../../types';
import { StatusPill } from '../common/StatusPill';
import { Database, Search, Download, ShieldCheck, CheckCircle } from 'lucide-react';

export const HistoricalIntelligenceDb: React.FC = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [search, setSearch] = useState('');
  const [recruiter, setRecruiter] = useState('All');
  const [topic, setTopic] = useState('All');
  const [loading, setLoading] = useState(false);

  const fetchQuestions = () => {
    setLoading(true);
    const q = new URLSearchParams({
      ...(recruiter !== 'All' && { recruiter }),
      ...(topic !== 'All' && { topic }),
      ...(search.trim() && { search }),
    });

    fetch(`/api/questions?${q.toString()}`)
      .then(r => r.json())
      .then(d => {
        if (d.questions) setQuestions(d.questions);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchQuestions();
  }, [recruiter, topic]);

  return (
    <div className="space-y-6">
      <div className="bg-white border border-neutral-200 rounded-2xl p-5 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold text-neutral-900 flex items-center gap-2">
              <Database className="w-5 h-5 text-neutral-900" />
              Recruiter Intelligence Database
            </h1>
            <p className="text-xs text-neutral-500 mt-1">
              CareerTwin core knowledge moat — 220+ verified historical campus interview questions with source audit trails.
            </p>
          </div>

          <a
            href="/api/export/questions"
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold bg-white border border-neutral-200 hover:bg-neutral-50 text-neutral-700 transition-colors w-fit"
          >
            <Download className="w-4 h-4 text-neutral-900" />
            <span>Export Question Bank</span>
          </a>
        </div>

        {/* Filters */}
        <div className="mt-5 grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && fetchQuestions()}
              placeholder="Search question keyword..."
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-white border border-neutral-300 rounded-lg outline-none text-neutral-900 placeholder:text-neutral-400 focus:border-neutral-900"
            />
          </div>

          <select
            value={recruiter}
            onChange={e => setRecruiter(e.target.value)}
            className="px-3 py-1.5 text-xs bg-white border border-neutral-200 rounded-lg text-neutral-800 outline-none"
          >
            <option value="All">All Recruiters</option>
            <option value="TCS">TCS</option>
            <option value="Infosys">Infosys</option>
            <option value="Wipro">Wipro</option>
            <option value="Accenture">Accenture</option>
            <option value="Cognizant">Cognizant</option>
            <option value="Deloitte">Deloitte</option>
            <option value="Zoho">Zoho</option>
          </select>

          <select
            value={topic}
            onChange={e => setTopic(e.target.value)}
            className="px-3 py-1.5 text-xs bg-white border border-neutral-200 rounded-lg text-neutral-800 outline-none"
          >
            <option value="All">All Topics</option>
            <option value="Data Structures & Algorithms">DSA</option>
            <option value="DBMS">DBMS</option>
            <option value="SQL">SQL</option>
            <option value="Operating Systems">Operating Systems</option>
            <option value="Computer Networks">Computer Networks</option>
            <option value="Object-Oriented Programming">OOP</option>
            <option value="Coding">Coding</option>
            <option value="Aptitude">Aptitude</option>
            <option value="HR">HR</option>
          </select>
        </div>
      </div>

      {/* Database Grid */}
      <div className="bg-white border border-neutral-200 rounded-2xl shadow-xs overflow-hidden">
        <div className="p-4 border-b border-neutral-200 flex items-center justify-between">
          <span className="text-xs font-bold text-neutral-900">
            Historical Records ({questions.length})
          </span>
          <span className="text-[11px] text-neutral-400 font-mono">
            Full source verification provenance
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-neutral-50 border-b border-neutral-200 text-[11px] font-bold text-neutral-500 uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4">ID</th>
                <th className="py-3 px-3">Recruiter & Role</th>
                <th className="py-3 px-3">Topic & Round</th>
                <th className="py-3 px-4">Question Experience</th>
                <th className="py-3 px-3">Frequency</th>
                <th className="py-3 px-3">Confidence & Source</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {questions.map(q => (
                <tr key={q.id} className="hover:bg-neutral-50">
                  <td className="py-3 px-4 font-mono font-bold text-neutral-400 text-[11px]">
                    {q.id}
                  </td>
                  <td className="py-3 px-3">
                    <div className="font-bold text-neutral-900">{q.recruiter}</div>
                    <div className="text-[11px] text-neutral-500">{q.role} ({q.year})</div>
                  </td>
                  <td className="py-3 px-3">
                    <div className="font-medium text-neutral-800">{q.topic}</div>
                    <div className="text-[11px] text-neutral-400">{q.round}</div>
                  </td>
                  <td className="py-3 px-4 max-w-md">
                    <div className="text-neutral-900 font-medium leading-relaxed">
                      {q.question}
                    </div>
                  </td>
                  <td className="py-3 px-3">
                    <StatusPill status={q.frequency} size="sm" />
                  </td>
                  <td className="py-3 px-3">
                    <div className="space-y-1">
                      <StatusPill status={q.confidence} size="sm" />
                      <div className="text-[10px] text-neutral-400 font-medium">{q.sourceType}</div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
