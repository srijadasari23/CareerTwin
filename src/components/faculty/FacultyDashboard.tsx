import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Student, Intervention } from '../../types';
import { StatusPill } from '../common/StatusPill';
import { RadarChart } from '../common/RadarChart';
import {
  Users,
  Search,
  BookOpen,
  CalendarCheck,
  CheckCircle2,
  AlertTriangle,
  MessageSquare,
  FileText,
  Clock,
  ArrowRight,
} from 'lucide-react';

export const FacultyDashboard: React.FC = () => {
  const { user, tenant } = useAuth();
  const [students, setStudents] = useState<Student[]>([]);
  const [interventions, setInterventions] = useState<Intervention[]>([]);
  const [search, setSearch] = useState('');
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [mentorNote, setMentorNote] = useState('');
  const [noteSaved, setNoteSaved] = useState(false);

  useEffect(() => {
    // Fetch students belonging to Dr. S. K. Murthy's department (CSE)
    fetch('/api/students?department=CSE')
      .then(r => r.json())
      .then(d => {
        if (d.students) {
          setStudents(d.students);
          if (d.students.length > 0) setSelectedStudent(d.students[0]);
        }
      });

    fetch('/api/interventions?department=CSE')
      .then(r => r.json())
      .then(d => {
        if (d.interventions) setInterventions(d.interventions);
      });
  }, []);

  const handleSaveNote = () => {
    if (!mentorNote.trim()) return;
    setNoteSaved(true);
    setTimeout(() => setNoteSaved(false), 3000);
    setMentorNote('');
  };

  const filtered = students.filter(s =>
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.studentId.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Faculty Header */}
      <div className="bg-white border border-neutral-200 rounded-2xl p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-neutral-900 tracking-tight">
              Faculty Mentorship Console
            </h1>
            <span className="text-[11px] font-bold px-2.5 py-0.5 rounded bg-neutral-100 text-neutral-800 border border-neutral-200">
              Department of CSE
            </span>
          </div>
          <p className="text-xs text-neutral-500 mt-1">
            Logged in as <strong>{user?.name || 'Dr. S. K. Murthy'}</strong> · Ramachandra College of Engineering
          </p>
        </div>

        <div className="flex items-center gap-3 text-xs text-neutral-600 font-medium">
          <div className="px-3 py-1.5 rounded-xl bg-neutral-50 border border-neutral-200">
            Assigned Mentees: <strong className="text-neutral-900 font-mono">{students.length}</strong>
          </div>
          <div className="px-3 py-1.5 rounded-xl bg-neutral-50 border border-neutral-200">
            Pending Interventions: <strong className="text-neutral-900 font-mono">{interventions.length}</strong>
          </div>
        </div>
      </div>

      {/* Main Grid: Mentee List & Detailed Inspection */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Mentee Roster (5 cols) */}
        <div className="lg:col-span-5 bg-white border border-neutral-200 rounded-2xl p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-neutral-900 flex items-center gap-1.5">
              <Users className="w-4 h-4 text-neutral-900" />
              <span>Assigned Mentee Roster</span>
            </h2>
            <span className="text-[11px] text-neutral-500 font-mono">{filtered.length} students</span>
          </div>

          <div className="relative">
            <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search by name or CT number..."
              className="w-full pl-8 pr-3 py-1.5 text-xs bg-neutral-50 border border-neutral-200 rounded-lg outline-none text-neutral-900 placeholder:text-neutral-400 focus:border-neutral-900"
            />
          </div>

          <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1">
            {filtered.map(s => {
              const isSelected = selectedStudent?.studentId === s.studentId;
              return (
                <div
                  key={s.id}
                  onClick={() => setSelectedStudent(s)}
                  className={`p-3 rounded-xl border text-xs cursor-pointer transition-all flex items-center justify-between ${
                    isSelected
                      ? 'bg-neutral-50 border-neutral-900 shadow-2xs font-bold'
                      : 'border-neutral-200 hover:border-neutral-300'
                  }`}
                >
                  <div>
                    <div className="font-semibold text-neutral-900">{s.name}</div>
                    <div className="text-[11px] text-neutral-500 font-mono mt-0.5">
                      {s.studentId} · CGPA {s.cgpa} · Target: {s.targetRecruiter}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-mono text-sm font-black text-neutral-900">{s.readiness}%</div>
                    <StatusPill status={s.status} size="sm" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Mentee Profile & Action Workspace (7 cols) */}
        <div className="lg:col-span-7 space-y-5">
          {selectedStudent ? (
            <div className="bg-white border border-neutral-200 rounded-2xl p-6 shadow-xs space-y-6">
              <div className="flex items-start justify-between pb-4 border-b border-neutral-200">
                <div>
                  <h2 className="text-base font-bold text-neutral-900">{selectedStudent.name}</h2>
                  <div className="text-xs text-neutral-500 mt-0.5">
                    ID: {selectedStudent.studentId} · {selectedStudent.year} · Target: {selectedStudent.targetRecruiter} ({selectedStudent.targetRole})
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs font-semibold text-neutral-500 uppercase">Readiness Index</div>
                  <div className="text-2xl font-black text-neutral-900 font-mono mt-0.5">
                    {selectedStudent.readiness}%
                  </div>
                </div>
              </div>

              {/* Skill Radar & Deficits */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
                <div className="flex justify-center">
                  <RadarChart
                    data={[
                      { subject: 'Technical', score: selectedStudent.technical },
                      { subject: 'Communication', score: selectedStudent.communication },
                      { subject: 'Aptitude', score: selectedStudent.aptitude },
                      { subject: 'Interview', score: selectedStudent.interviewSkills },
                      { subject: 'Coding', score: selectedStudent.coding },
                    ]}
                    size={220}
                    color="#171717"
                  />
                </div>

                <div className="space-y-2 text-xs">
                  <div className="p-3 bg-neutral-50 border border-neutral-200 rounded-xl space-y-1">
                    <div className="text-[11px] font-bold text-neutral-500 uppercase">Practice Activity</div>
                    <div className="font-mono text-neutral-800">
                      {selectedStudent.practiceCompletion}% Completed · {selectedStudent.mockInterviews} Mocks Logged · {selectedStudent.streakDays}d Streak
                    </div>
                  </div>

                  <div className="p-3 bg-neutral-50 border border-neutral-200 rounded-xl space-y-1">
                    <div className="text-[11px] font-bold text-neutral-500 uppercase">Key Prescription</div>
                    <div className="text-neutral-700">
                      Focus on DSA Trees & Graph recursion for {selectedStudent.targetRecruiter} technical rounds.
                    </div>
                  </div>
                </div>
              </div>

              {/* Mentoring Log & Feedback Form */}
              <div className="pt-4 border-t border-neutral-200 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold text-neutral-900 uppercase tracking-wider flex items-center gap-1.5">
                    <MessageSquare className="w-3.5 h-3.5 text-neutral-900" />
                    <span>Faculty Mentor Guidance Note</span>
                  </h3>
                  {noteSaved && (
                    <span className="text-[11px] font-semibold text-emerald-700 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Note saved to student record
                    </span>
                  )}
                </div>

                <textarea
                  value={mentorNote}
                  onChange={e => setMentorNote(e.target.value)}
                  placeholder="Record observations from your 1-on-1 counseling session (e.g. Reviewed SQL subqueries; advised student to complete week 2 bootcamp program)..."
                  rows={3}
                  className="w-full p-3 text-xs bg-white border border-neutral-300 rounded-xl outline-none text-neutral-900 placeholder:text-neutral-400 focus:border-neutral-900"
                />

                <div className="flex justify-end gap-2">
                  <button
                    onClick={handleSaveNote}
                    disabled={!mentorNote.trim()}
                    className="px-4 py-2 bg-neutral-900 hover:bg-neutral-800 disabled:opacity-50 text-white rounded-lg text-xs font-bold transition-colors"
                  >
                    Save Mentor Feedback
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-12 text-center text-xs text-neutral-400 bg-white border border-neutral-200 rounded-2xl">
              Select a student mentee from the roster on the left to inspect their progress.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
