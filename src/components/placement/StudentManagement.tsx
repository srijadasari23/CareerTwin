import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Student } from '../../types';
import { StatusPill } from '../common/StatusPill';
import { RadarChart } from '../common/RadarChart';
import {
  Users,
  Search,
  Filter,
  Eye,
  Download,
  CheckCircle,
  FileSpreadsheet,
} from 'lucide-react';

export const StudentManagement: React.FC = () => {
  const { tenant } = useAuth();
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(false);

  const [search, setSearch] = useState('');
  const [selectedDept, setSelectedDept] = useState('All');
  const [selectedYear, setSelectedYear] = useState('All');
  const [selectedRecruiter, setSelectedRecruiter] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [minReadiness, setMinReadiness] = useState(0);

  // Student lookup modal
  const [inspectStudent, setInspectStudent] = useState<Student | null>(null);

  const fetchStudents = () => {
    setLoading(true);
    const q = new URLSearchParams({
      ...(selectedDept !== 'All' && { department: selectedDept }),
      ...(selectedYear !== 'All' && { year: selectedYear }),
      ...(selectedRecruiter !== 'All' && { recruiter: selectedRecruiter }),
      ...(selectedStatus !== 'All' && { status: selectedStatus }),
      ...(minReadiness > 0 && { minReadiness: String(minReadiness) }),
      ...(search.trim() && { search }),
    });

    fetch(`/api/students?${q.toString()}`)
      .then(r => r.json())
      .then(d => {
        if (d.students) setStudents(d.students);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchStudents();
  }, [selectedDept, selectedYear, selectedRecruiter, selectedStatus, minReadiness]);

  return (
    <div className="space-y-6">
      <div className="bg-white border border-neutral-200 rounded-2xl p-5 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold text-neutral-900 flex items-center gap-2">
              <Users className="w-5 h-5 text-neutral-900" />
              Student Cohort Intelligence & Directory
            </h1>
            <p className="text-xs text-neutral-500 mt-1">
              Search, filter, and inspect detailed profiles across all {tenant?.code || 'RCEE'} branches.
            </p>
          </div>

          <a
            href="/api/export/students"
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold bg-white border border-neutral-200 hover:bg-neutral-50 text-neutral-700 transition-colors w-fit"
          >
            <Download className="w-4 h-4 text-neutral-900" />
            <span>Export CSV</span>
          </a>
        </div>

        {/* Filters */}
        <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && fetchStudents()}
              placeholder="Search student or ID..."
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-white border border-neutral-300 rounded-lg outline-none text-neutral-900 placeholder:text-neutral-400 focus:border-neutral-900"
            />
          </div>

          <select
            value={selectedDept}
            onChange={e => setSelectedDept(e.target.value)}
            className="px-3 py-1.5 text-xs bg-white border border-neutral-200 rounded-lg text-neutral-800 outline-none"
          >
            <option value="All">All Departments</option>
            <option value="CSE">CSE</option>
            <option value="IT">IT</option>
            <option value="ECE">ECE</option>
            <option value="AI & DS">AI & DS</option>
            <option value="CSE (Cyber Security)">Cyber Security</option>
            <option value="EEE">EEE</option>
            <option value="MECH">MECH</option>
            <option value="CIVIL">CIVIL</option>
          </select>

          <select
            value={selectedRecruiter}
            onChange={e => setSelectedRecruiter(e.target.value)}
            className="px-3 py-1.5 text-xs bg-white border border-neutral-200 rounded-lg text-neutral-800 outline-none"
          >
            <option value="All">All Target Recruiters</option>
            <option value="TCS">TCS</option>
            <option value="Infosys">Infosys</option>
            <option value="Wipro">Wipro</option>
            <option value="Accenture">Accenture</option>
            <option value="Cognizant">Cognizant</option>
            <option value="Deloitte">Deloitte</option>
            <option value="Zoho">Zoho</option>
          </select>

          <select
            value={selectedStatus}
            onChange={e => setSelectedStatus(e.target.value)}
            className="px-3 py-1.5 text-xs bg-white border border-neutral-200 rounded-lg text-neutral-800 outline-none"
          >
            <option value="All">All Statuses</option>
            <option value="Interview Ready">Interview Ready (≥80%)</option>
            <option value="On Track">On Track (65-79%)</option>
            <option value="Needs Improvement">Needs Improvement (&lt;65%)</option>
            <option value="High Priority">High Priority (&lt;45%)</option>
          </select>

          <div className="flex items-center gap-2 px-3 py-1.5 bg-neutral-50 border border-neutral-200 rounded-lg text-xs">
            <span className="text-neutral-500 whitespace-nowrap">Min: {minReadiness}%</span>
            <input
              type="range"
              min="0"
              max="90"
              step="5"
              value={minReadiness}
              onChange={e => setMinReadiness(Number(e.target.value))}
              className="w-full accent-neutral-900"
            />
          </div>
        </div>
      </div>

      {/* Cohort Table */}
      <div className="bg-white border border-neutral-200 rounded-2xl shadow-xs overflow-hidden">
        <div className="p-4 border-b border-neutral-200 flex items-center justify-between">
          <span className="text-xs font-bold text-neutral-900">
            Enrolled Students ({students.length} matching)
          </span>
          <span className="text-[11px] text-neutral-400 font-mono">
            Displaying verified institutional records
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-neutral-50 border-b border-neutral-200 text-[11px] font-bold text-neutral-500 uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4">Student</th>
                <th className="py-3 px-3">Dept & Year</th>
                <th className="py-3 px-3">Target Recruiter</th>
                <th className="py-3 px-3 text-right">Readiness</th>
                <th className="py-3 px-3 text-right">Technical</th>
                <th className="py-3 px-3 text-right">Communication</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {loading ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-neutral-400">Loading student cohort...</td>
                </tr>
              ) : students.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-neutral-400">No students matched the active filters.</td>
                </tr>
              ) : (
                students.map(s => (
                  <tr key={s.id} className="hover:bg-neutral-50 transition-colors">
                    <td className="py-3 px-4">
                      <div className="font-bold text-neutral-900">{s.name}</div>
                      <div className="text-[11px] text-neutral-500 font-mono">{s.studentId} · CGPA {s.cgpa}</div>
                    </td>
                    <td className="py-3 px-3 text-neutral-700">
                      <div>{s.department}</div>
                      <div className="text-[11px] text-neutral-400">{s.year}</div>
                    </td>
                    <td className="py-3 px-3 text-neutral-700">
                      <div className="font-semibold text-neutral-900">{s.targetRecruiter}</div>
                      <div className="text-[11px] text-neutral-500">{s.targetRole}</div>
                    </td>
                    <td className="py-3 px-3 text-right font-mono font-bold text-neutral-900 text-sm">
                      {s.readiness}%
                    </td>
                    <td className="py-3 px-3 text-right font-mono text-neutral-600">
                      {s.technical}%
                    </td>
                    <td className="py-3 px-3 text-right font-mono text-neutral-600">
                      {s.communication}%
                    </td>
                    <td className="py-3 px-3">
                      <StatusPill status={s.status} size="sm" />
                    </td>
                    <td className="py-3 px-4 text-center">
                      <button
                        onClick={() => setInspectStudent(s)}
                        className="px-2.5 py-1 text-xs font-semibold text-neutral-800 bg-white border border-neutral-200 hover:bg-neutral-50 rounded-lg transition-colors"
                      >
                        Lookup
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Inspect Student Modal */}
      {inspectStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-900/40 backdrop-blur-2xs p-4">
          <div className="bg-white border border-neutral-200 rounded-2xl max-w-xl w-full p-6 shadow-2xl space-y-5">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-base font-bold text-neutral-900">
                  {inspectStudent.name}
                </h3>
                <div className="text-xs text-neutral-500 mt-0.5">
                  {inspectStudent.department} · {inspectStudent.studentId} · CGPA {inspectStudent.cgpa}
                </div>
              </div>
              <StatusPill status={inspectStudent.status} size="md" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
              <div className="flex justify-center">
                <RadarChart
                  data={[
                    { subject: 'Technical', score: inspectStudent.technical },
                    { subject: 'Communication', score: inspectStudent.communication },
                    { subject: 'Aptitude', score: inspectStudent.aptitude },
                    { subject: 'Interview', score: inspectStudent.interviewSkills },
                    { subject: 'Coding', score: inspectStudent.coding },
                  ]}
                  size={220}
                  color="#171717"
                />
              </div>

              <div className="space-y-2 text-xs">
                <div className="p-2.5 bg-neutral-50 rounded-lg border border-neutral-200">
                  <div className="text-neutral-500 text-[10px] uppercase font-semibold">Target Company & Role</div>
                  <div className="font-bold text-neutral-900 mt-0.5">
                    {inspectStudent.targetRecruiter} ({inspectStudent.targetRole})
                  </div>
                </div>

                <div className="p-2.5 bg-neutral-50 rounded-lg border border-neutral-200">
                  <div className="text-neutral-500 text-[10px] uppercase font-semibold">Assigned Faculty Mentor</div>
                  <div className="font-semibold text-neutral-800 mt-0.5">
                    {inspectStudent.mentorName || 'Dr. S. K. Murthy (Prof. CSE)'}
                  </div>
                </div>

                <div className="p-2.5 bg-neutral-50 rounded-lg border border-neutral-200">
                  <div className="text-neutral-500 text-[10px] uppercase font-semibold">Practice Completion & Mocks</div>
                  <div className="font-mono text-neutral-800 mt-0.5">
                    {inspectStudent.practiceCompletion}% completed · {inspectStudent.mockInterviews} mocks
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setInspectStudent(null)}
                className="px-4 py-2 bg-neutral-900 text-white hover:bg-neutral-800 rounded-lg text-xs font-semibold"
              >
                Close Profile
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
