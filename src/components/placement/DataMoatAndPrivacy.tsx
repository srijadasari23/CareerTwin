import React from 'react';
import { ShieldCheck, Lock, Globe, Server, CheckCircle2, FileCheck } from 'lucide-react';

export const DataMoatAndPrivacy: React.FC = () => {
  const privacyPillars = [
    { title: 'Strict Tenant Isolation', desc: 'Every institution operates within a cryptographically isolated tenant envelope. One college can never query or inspect another college\'s private student database.' },
    { title: 'Consent-Based Student Data', desc: 'Academic scores, resume files, and interview recordings are ingested strictly with explicit student consent and college placement department authorization.' },
    { title: 'Anonymized Recruiter Intelligence', desc: 'Historical interview questions and question frequency maps are decoupled from individual student identities to build compounding institutional intelligence.' },
    { title: 'Server-Side Access Control (RBAC)', desc: 'Role permissions (Student, Mentor, HOD, Placement Officer) are enforced on backend API routes rather than purely hiding frontend buttons.' },
    { title: 'Immutable Audit Logging', desc: 'Every administrative profile edit, CSV import, and data export generates an audit event logged with timestamp, actor ID, and action parameters.' },
    { title: 'Advisory AI Safeguards', desc: 'Readiness scores and mock interview evaluations are explicitly labeled as advisory guidance rather than definitive judgments on student capability.' }
  ];

  return (
    <div className="space-y-6">
      <div className="bg-white border border-neutral-200 rounded-2xl p-5 shadow-xs">
        <h1 className="text-xl font-bold text-neutral-900 flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-neutral-900" />
          The CareerTwin Data Moat & Institutional Privacy Layer
        </h1>
        <p className="text-xs text-neutral-500 mt-1">
          How campus intelligence compounds safely across academic years without compromising student privacy.
        </p>
      </div>

      {/* Network Effect Diagram Card */}
      <div className="p-6 bg-white border border-neutral-200 rounded-2xl shadow-xs space-y-4">
        <h2 className="text-sm font-bold text-neutral-900 flex items-center gap-2">
          <Globe className="w-4 h-4 text-neutral-900" />
          The Cross-College Intelligence Flywheel
        </h2>
        <p className="text-xs text-neutral-500">
          "Every year, colleges invite the same recruiters. CareerTwin makes sure last year's intelligence is never lost again."
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2 text-center text-xs">
          <div className="p-4 rounded-xl bg-neutral-50 border border-neutral-200">
            <div className="font-bold text-neutral-900">1. Campus Intelligence Ingestion</div>
            <div className="text-[11px] text-neutral-500 mt-1">Verified interview experiences, drive criteria, and question templates recorded systematically.</div>
          </div>
          <div className="p-4 rounded-xl bg-neutral-50 border border-neutral-200">
            <div className="font-bold text-neutral-900">2. Anonymized Synthesis</div>
            <div className="text-[11px] text-neutral-500 mt-1">Identities stripped; topic clusters and frequency patterns aggregated into verified question banks.</div>
          </div>
          <div className="p-4 rounded-xl bg-neutral-50 border border-neutral-200">
            <div className="font-bold text-neutral-900">3. Precision Preparation</div>
            <div className="text-[11px] text-neutral-500 mt-1">Future batches prepare directly on company patterns, producing higher clearance rates and placement CTCs.</div>
          </div>
        </div>
      </div>

      {/* Privacy Pillars Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {privacyPillars.map(p => (
          <div
            key={p.title}
            className="p-4 bg-white border border-neutral-200 rounded-xl shadow-xs space-y-1.5"
          >
            <div className="flex items-center gap-2 text-xs font-bold text-neutral-900">
              <CheckCircle2 className="w-4 h-4 text-neutral-900 shrink-0" />
              <span>{p.title}</span>
            </div>
            <p className="text-[11px] text-neutral-500 leading-relaxed pl-6">
              {p.desc}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};
