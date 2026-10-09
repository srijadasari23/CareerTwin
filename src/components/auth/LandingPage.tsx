import React from 'react';
import { useAuth, RoleFlowType } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import {
  GraduationCap,
  BookOpen,
  Briefcase,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  const { setSelectedRoleFlow, tenant } = useAuth();
  const { language, setLanguage, t } = useLanguage();

  const handleSelectRole = (flow: RoleFlowType) => {
    setSelectedRoleFlow(flow);
  };

  return (
    <div className="min-h-screen bg-white text-neutral-900 flex flex-col font-sans">
      {/* Landing Header */}
      <header className="w-full border-b border-neutral-200 bg-white sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-neutral-900 text-white flex items-center justify-center font-black text-sm select-none">
              CT
            </div>
            <div className="flex flex-col">
              <span className="text-base font-bold tracking-tight text-neutral-900">
                CareerTwin AI
              </span>
              <span className="text-[11px] text-neutral-500 font-medium">
                Campus Intelligence & Placement SaaS
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Language Toggle */}
            <div className="flex items-center bg-neutral-100 p-0.5 rounded-lg border border-neutral-200">
              <button
                onClick={() => setLanguage('en')}
                className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-colors ${
                  language === 'en'
                    ? 'bg-white text-neutral-900 shadow-2xs'
                    : 'text-neutral-500 hover:text-neutral-900'
                }`}
              >
                English
              </button>
              <button
                onClick={() => setLanguage('te')}
                className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-colors ${
                  language === 'te'
                    ? 'bg-white text-neutral-900 shadow-2xs'
                    : 'text-neutral-500 hover:text-neutral-900'
                }`}
              >
                తెలుగు
              </button>
            </div>

            <div className="hidden sm:flex items-center gap-1.5 text-xs text-neutral-500 font-medium">
              <ShieldCheck className="w-4 h-4 text-neutral-700" />
              <span>Multi-College Tenant Isolation</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Hero & Role Selection */}
      <main className="flex-1 max-w-6xl mx-auto px-4 sm:px-6 py-12 md:py-20 flex flex-col items-center justify-center text-center">
        {/* Subtle kicker */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-neutral-200 bg-neutral-50 text-xs font-medium text-neutral-700 mb-6">
          <Sparkles className="w-3.5 h-3.5 text-neutral-900" />
          <span>Next-Generation Campus Placement Architecture</span>
        </div>

        {/* Hero Headlines */}
        <h1 className="text-3xl sm:text-5xl font-extrabold text-neutral-900 tracking-tight max-w-3xl leading-[1.15]">
          {t('heroTitle')}
        </h1>
        <p className="mt-4 text-sm sm:text-base text-neutral-600 max-w-2xl leading-relaxed">
          {t('heroSubtitle')}
        </p>

        {/* Institutional Badge */}
        <div className="mt-4 text-xs text-neutral-500 font-medium flex items-center gap-1.5">
          <span>Configured for:</span>
          <strong className="text-neutral-900">{tenant?.name || 'Ramachandra College of Engineering (RCEE)'}</strong>
        </div>

        {/* Three Prominent Role Login Cards */}
        <div className="mt-12 w-full grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
          {/* Card 1: Student Login */}
          <div
            onClick={() => handleSelectRole('student')}
            className="group p-6 bg-white rounded-2xl border border-neutral-200 hover:border-neutral-900 transition-all cursor-pointer flex flex-col justify-between shadow-2xs hover:shadow-xs"
          >
            <div>
              <div className="w-12 h-12 rounded-xl bg-neutral-100 border border-neutral-200 flex items-center justify-center text-neutral-900 group-hover:bg-neutral-900 group-hover:text-white transition-colors">
                <GraduationCap className="w-6 h-6" />
              </div>
              <h2 className="mt-5 text-lg font-bold text-neutral-900 tracking-tight">
                {t('studentLoginTitle')}
              </h2>
              <p className="mt-2 text-xs text-neutral-600 leading-relaxed">
                {t('studentLoginDesc')}
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-neutral-100 flex items-center justify-between">
              <span className="text-xs font-bold text-neutral-900 group-hover:translate-x-0.5 transition-transform">
                {t('continueAsStudent')}
              </span>
              <div className="w-7 h-7 rounded-full bg-neutral-100 group-hover:bg-neutral-900 text-neutral-900 group-hover:text-white flex items-center justify-center transition-colors">
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>
          </div>

          {/* Card 2: Faculty Login */}
          <div
            onClick={() => handleSelectRole('faculty')}
            className="group p-6 bg-white rounded-2xl border border-neutral-200 hover:border-neutral-900 transition-all cursor-pointer flex flex-col justify-between shadow-2xs hover:shadow-xs"
          >
            <div>
              <div className="w-12 h-12 rounded-xl bg-neutral-100 border border-neutral-200 flex items-center justify-center text-neutral-900 group-hover:bg-neutral-900 group-hover:text-white transition-colors">
                <BookOpen className="w-6 h-6" />
              </div>
              <h2 className="mt-5 text-lg font-bold text-neutral-900 tracking-tight">
                {t('facultyLoginTitle')}
              </h2>
              <p className="mt-2 text-xs text-neutral-600 leading-relaxed">
                {t('facultyLoginDesc')}
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-neutral-100 flex items-center justify-between">
              <span className="text-xs font-bold text-neutral-900 group-hover:translate-x-0.5 transition-transform">
                {t('continueAsFaculty')}
              </span>
              <div className="w-7 h-7 rounded-full bg-neutral-100 group-hover:bg-neutral-900 text-neutral-900 group-hover:text-white flex items-center justify-center transition-colors">
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>
          </div>

          {/* Card 3: Placement Login */}
          <div
            onClick={() => handleSelectRole('placement_officer')}
            className="group p-6 bg-white rounded-2xl border border-neutral-200 hover:border-neutral-900 transition-all cursor-pointer flex flex-col justify-between shadow-2xs hover:shadow-xs"
          >
            <div>
              <div className="w-12 h-12 rounded-xl bg-neutral-100 border border-neutral-200 flex items-center justify-center text-neutral-900 group-hover:bg-neutral-900 group-hover:text-white transition-colors">
                <Briefcase className="w-6 h-6" />
              </div>
              <h2 className="mt-5 text-lg font-bold text-neutral-900 tracking-tight">
                {t('placementLoginTitle')}
              </h2>
              <p className="mt-2 text-xs text-neutral-600 leading-relaxed">
                {t('placementLoginDesc')}
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-neutral-100 flex items-center justify-between">
              <span className="text-xs font-bold text-neutral-900 group-hover:translate-x-0.5 transition-transform">
                {t('continueAsPlacement')}
              </span>
              <div className="w-7 h-7 rounded-full bg-neutral-100 group-hover:bg-neutral-900 text-neutral-900 group-hover:text-white flex items-center justify-center transition-colors">
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>
          </div>
        </div>

        {/* Feature Highlights Banner */}
        <div className="mt-16 pt-8 border-t border-neutral-200 w-full grid grid-cols-2 sm:grid-cols-4 gap-4 text-left text-xs text-neutral-600">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-neutral-900 shrink-0" />
            <span>400 Student Cohort Telemetry</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-neutral-900 shrink-0" />
            <span>220+ Verified Recruiter Questions</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-neutral-900 shrink-0" />
            <span>AI Mock Interviews with STAR Rubric</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-neutral-900 shrink-0" />
            <span>Telugu & English Bilingual Guidance</span>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full border-t border-neutral-200 py-6 text-center text-xs text-neutral-500 bg-white">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>© 2026 CareerTwin AI. All rights reserved.</span>
          <span>Enterprise Campus Career Intelligence SaaS · Version 2.5 Minimalist</span>
        </div>
      </footer>
    </div>
  );
};
