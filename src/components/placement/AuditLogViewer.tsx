import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { AuditLog } from '../../types';
import { Settings, Shield, RotateCcw, CheckCircle2, Clock } from 'lucide-react';

export const AuditLogViewer: React.FC = () => {
  const { tenant } = useAuth();
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [resetting, setResetting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const fetchLogs = () => {
    fetch('/api/audit-logs')
      .then(r => r.json())
      .then(d => {
        if (d.logs) setLogs(d.logs);
      });
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const handleReset = async () => {
    if (!confirm('Are you sure you want to reset the database to clean demo seed state?')) return;
    setResetting(true);
    try {
      const res = await fetch('/api/system/reset-demo', { method: 'POST' });
      if (res.ok) {
        setMessage('Database reset to clean prototype state successfully.');
        fetchLogs();
        setTimeout(() => setMessage(null), 3000);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setResetting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white border border-neutral-200 rounded-2xl p-5 shadow-xs">
        <h1 className="text-xl font-bold text-neutral-900 flex items-center gap-2">
          <Settings className="w-5 h-5 text-neutral-900" />
          Institution Settings & Security Audit Logs
        </h1>
        <p className="text-xs text-neutral-500 mt-1">
          Governance controls, multi-tenant parameters, and non-repudiation audit trails.
        </p>
      </div>

      {message && (
        <div className="p-3 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-xl text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{message}</span>
        </div>
      )}

      {/* Settings Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-5 bg-white border border-neutral-200 rounded-2xl shadow-xs space-y-3">
          <h3 className="text-xs font-bold text-neutral-400 uppercase tracking-wider">Institution Profile</h3>
          <div className="space-y-2 text-xs">
            <div className="flex justify-between py-1 border-b border-neutral-100">
              <span className="text-neutral-500">Institution:</span>
              <strong className="text-neutral-900">{tenant?.name}</strong>
            </div>
            <div className="flex justify-between py-1 border-b border-neutral-100">
              <span className="text-neutral-500">Tenant Code:</span>
              <span className="font-mono font-bold text-neutral-900">{tenant?.code}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-neutral-100">
              <span className="text-neutral-500">Location:</span>
              <span className="text-neutral-800">{tenant?.city}, {tenant?.state}</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-neutral-500">Data Mode:</span>
              <span className="font-semibold text-emerald-700">Enterprise Tenant Isolation</span>
            </div>
          </div>
        </div>

        <div className="p-5 bg-white border border-neutral-200 rounded-2xl shadow-xs space-y-3">
          <h3 className="text-xs font-bold text-neutral-400 uppercase tracking-wider">Administrative Actions</h3>
          <p className="text-xs text-neutral-500">
            Resetting returns all student practice records, mock interviews, and interventions to the initial calibrated prototype state.
          </p>
          <button
            onClick={handleReset}
            disabled={resetting}
            className="w-full py-2.5 px-4 bg-white hover:bg-neutral-50 border border-neutral-200 text-neutral-800 rounded-xl text-xs font-bold shadow-xs flex items-center justify-center gap-2 transition-colors"
          >
            <RotateCcw className="w-4 h-4 text-neutral-900" />
            <span>{resetting ? 'Resetting Database...' : 'Reset Demo Seed Data'}</span>
          </button>
        </div>
      </div>

      {/* Audit Log Table */}
      <div className="bg-white border border-neutral-200 rounded-2xl shadow-xs overflow-hidden">
        <div className="p-4 border-b border-neutral-200 flex items-center justify-between">
          <span className="text-xs font-bold text-neutral-900">
            Audit Trails ({logs.length} logged events)
          </span>
          <span className="text-[11px] text-neutral-400 font-mono">
            Non-repudiation audit store
          </span>
        </div>

        <div className="overflow-x-auto max-h-96">
          <table className="w-full text-left text-xs">
            <thead className="bg-neutral-50 sticky top-0 text-[11px] font-bold text-neutral-500 uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4">Timestamp</th>
                <th className="py-3 px-3">Actor & Role</th>
                <th className="py-3 px-3">Action</th>
                <th className="py-3 px-3">Entity</th>
                <th className="py-3 px-4">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {logs.map(l => (
                <tr key={l.id} className="hover:bg-neutral-50">
                  <td className="py-2.5 px-4 font-mono text-[11px] text-neutral-500 whitespace-nowrap">
                    {new Date(l.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                  </td>
                  <td className="py-2.5 px-3">
                    <div className="font-bold text-neutral-900">{l.userName}</div>
                    <div className="text-[10px] text-neutral-500">{l.userRole}</div>
                  </td>
                  <td className="py-2.5 px-3 font-mono font-bold text-neutral-900 text-[11px]">
                    {l.action}
                  </td>
                  <td className="py-2.5 px-3 text-neutral-700">
                    {l.entity}
                  </td>
                  <td className="py-2.5 px-4 text-neutral-600 max-w-sm truncate">
                    {l.details}
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
