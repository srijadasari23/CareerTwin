import React, { useState, useEffect } from 'react';
import { Intervention } from '../../types';
import { StatusPill } from '../common/StatusPill';
import { AlertTriangle, CheckCircle, Search, Filter, CalendarCheck, UserCheck } from 'lucide-react';

export const InterventionCenter: React.FC = () => {
  const [interventions, setInterventions] = useState<Intervention[]>([]);
  const [priority, setPriority] = useState('All');
  const [department, setDepartment] = useState('All');
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);

  const fetchInterventions = () => {
    setLoading(true);
    const q = new URLSearchParams({
      ...(priority !== 'All' && { priority }),
      ...(department !== 'All' && { department }),
    });

    fetch(`/api/interventions?${q.toString()}`)
      .then(r => r.json())
      .then(d => {
        if (d.interventions) setInterventions(d.interventions);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchInterventions();
  }, [priority, department]);

  const handleUpdate = async (id: string, updates: Partial<Intervention>, message: string) => {
    try {
      const res = await fetch(`/api/interventions/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      });
      if (res.ok) {
        setInterventions(prev => prev.map(i => i.id === id ? { ...i, ...updates } : i));
        setNotification(message);
        setTimeout(() => setNotification(null), 3000);
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white border border-neutral-200 rounded-2xl p-5 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold text-neutral-900 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-neutral-900" />
              Student Intervention & Precision Mentorship Console
            </h1>
            <p className="text-xs text-neutral-500 mt-1">
              Active caseload of students below target placement thresholds prioritized for staff review.
            </p>
          </div>

          <div className="text-xs font-mono font-bold text-neutral-800 bg-neutral-100 px-3 py-1.5 rounded-xl border border-neutral-200">
            {interventions.length} active intervention cases
          </div>
        </div>

        {/* Filters */}
        <div className="mt-4 flex flex-wrap gap-3">
          <select
            value={priority}
            onChange={e => setPriority(e.target.value)}
            className="px-3 py-1.5 text-xs bg-white border border-neutral-200 rounded-lg text-neutral-800 outline-none"
          >
            <option value="All">All Priorities</option>
            <option value="HIGH">HIGH (&lt;48% Readiness)</option>
            <option value="MEDIUM">MEDIUM (48–64% Readiness)</option>
            <option value="LOW">LOW</option>
          </select>

          <select
            value={department}
            onChange={e => setDepartment(e.target.value)}
            className="px-3 py-1.5 text-xs bg-white border border-neutral-200 rounded-lg text-neutral-800 outline-none"
          >
            <option value="All">All Departments</option>
            <option value="CSE">CSE</option>
            <option value="IT">IT</option>
            <option value="ECE">ECE</option>
            <option value="AI & DS">AI & DS</option>
            <option value="EEE">EEE</option>
            <option value="MECH">MECH</option>
          </select>
        </div>
      </div>

      {notification && (
        <div className="p-3 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-xl text-xs flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{notification}</span>
        </div>
      )}

      {/* Interventions List */}
      <div className="space-y-3">
        {loading ? (
          <div className="p-12 text-center text-xs text-neutral-400">Loading intervention records...</div>
        ) : (
          interventions.map(item => (
            <div
              key={item.id}
              className="p-4 bg-white border border-neutral-200 rounded-xl shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-neutral-900 text-xs lg:text-sm">
                    {item.name}
                  </span>
                  <span className="font-mono text-[11px] text-neutral-400">({item.studentId})</span>
                  <StatusPill status={item.priority} size="sm" />
                  <StatusPill status={item.status} size="sm" />
                </div>

                <div className="text-xs text-neutral-500 flex flex-wrap items-center gap-x-3 gap-y-1">
                  <span>Dept: <strong className="text-neutral-800">{item.department}</strong></span>
                  <span aria-hidden="true" className="text-neutral-300">·</span>
                  <span>Target: <strong className="text-neutral-800">{item.targetRecruiter}</strong></span>
                  <span aria-hidden="true" className="text-neutral-300">·</span>
                  <span>Readiness: <strong className="font-mono text-neutral-900">{item.readiness}%</strong></span>
                  <span aria-hidden="true" className="text-neutral-300">·</span>
                  <span>Deficit: <strong className="text-rose-700">{item.mainGap}</strong></span>
                </div>

                <div className="text-[11px] text-neutral-600 font-medium">
                  Prescription: <em>{item.recommendedAction}</em>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 shrink-0 self-end md:self-auto">
                <button
                  onClick={() => handleUpdate(item.id, { status: 'In Progress' }, `Assigned bootcamp training to ${item.name}`)}
                  className="px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-neutral-100 hover:bg-neutral-200 text-neutral-800 transition-colors"
                >
                  Assign Training
                </button>

                <button
                  onClick={() => handleUpdate(item.id, { status: 'In Progress' }, `Scheduled technical mock for ${item.name}`)}
                  className="px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-white border border-neutral-200 text-neutral-800 hover:bg-neutral-50 transition-colors"
                >
                  Schedule Mock
                </button>

                <button
                  onClick={() => handleUpdate(item.id, { status: 'Reviewed' }, `Marked case reviewed for ${item.name}`)}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                    item.status === 'Reviewed'
                      ? 'bg-neutral-50 text-neutral-600 border border-neutral-300'
                      : 'bg-neutral-900 text-white hover:bg-neutral-800'
                  }`}
                >
                  {item.status === 'Reviewed' ? 'Reviewed ✓' : 'Mark Reviewed'}
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
