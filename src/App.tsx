/**
 * CareerTwin AI — Main Application Shell
 * Campus-Specific Placement Intelligence & Personalized Career Copilot Platform
 */
import React from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { LanguageProvider, useLanguage } from './context/LanguageContext';
import { Header } from './components/common/Header';
import { Sidebar } from './components/common/Sidebar';

// Auth & Role Gateway
import { LandingPage } from './components/auth/LandingPage';
import { RoleLoginPage } from './components/auth/RoleLoginPage';

// Student Modules
import { StudentOverview } from './components/student/StudentOverview';
import { AiCareerCopilot } from './components/student/AiCareerCopilot';
import { StudentRecruiterIntel } from './components/student/StudentRecruiterIntel';
import { SubjectsAndSkills } from './components/student/SubjectsAndSkills';
import { PracticeCenter } from './components/student/PracticeCenter';
import { AiMockInterviewStudio } from './components/student/AiMockInterviewStudio';
import { ResumeAssistant } from './components/student/ResumeAssistant';
import { CommunicationHub } from './components/student/CommunicationHub';
import { PreparationPlan } from './components/student/PreparationPlan';
import { StudentReadiness } from './components/student/StudentReadiness';

// Faculty Modules
import { FacultyDashboard } from './components/faculty/FacultyDashboard';

// Placement & Management Modules
import { PlacementOverview } from './components/placement/PlacementOverview';
import { StudentManagement } from './components/placement/StudentManagement';
import { RecruitersManager } from './components/placement/RecruitersManager';
import { HistoricalIntelligenceDb } from './components/placement/HistoricalIntelligenceDb';
import { SkillGapAnalytics } from './components/placement/SkillGapAnalytics';
import { TrainingManager } from './components/placement/TrainingManager';
import { InterventionCenter } from './components/placement/InterventionCenter';
import { PlacementOutcomes } from './components/placement/PlacementOutcomes';
import { DataMoatAndPrivacy } from './components/placement/DataMoatAndPrivacy';
import { CsvImportPipeline } from './components/placement/CsvImportPipeline';
import { ReportsExport } from './components/placement/ReportsExport';
import { AuditLogViewer } from './components/placement/AuditLogViewer';

import { AlertCircle, ShieldCheck } from 'lucide-react';

const AppContent: React.FC = () => {
  const { isAuthenticated, selectedRoleFlow, setSelectedRoleFlow, role, activeTab } = useAuth();
  const { t } = useLanguage();

  // If user is not authenticated, show Role Selection Landing or Role Login
  if (!isAuthenticated) {
    if (selectedRoleFlow) {
      return (
        <RoleLoginPage
          roleFlow={selectedRoleFlow}
          onBack={() => setSelectedRoleFlow(null)}
        />
      );
    }
    return <LandingPage />;
  }

  const renderContent = () => {
    // 1. Student Dashboard
    if (role === 'student') {
      switch (activeTab) {
        case 'overview':
          return <StudentOverview />;
        case 'copilot':
          return <AiCareerCopilot />;
        case 'recruiter_intel':
          return <StudentRecruiterIntel />;
        case 'skills':
          return <SubjectsAndSkills />;
        case 'practice':
          return <PracticeCenter />;
        case 'plan':
          return <PreparationPlan />;
        case 'mock_interview':
          return <AiMockInterviewStudio />;
        case 'resume':
          return <ResumeAssistant />;
        case 'comm_lab':
          return <CommunicationHub />;
        case 'readiness':
          return <StudentReadiness />;
        default:
          return <StudentOverview />;
      }
    }

    // 2. Faculty / HOD Dashboard
    if (role === 'faculty' || role === 'hod') {
      switch (activeTab) {
        case 'overview':
          return <FacultyDashboard />;
        case 'students':
          return <StudentManagement />;
        case 'interventions':
          return <InterventionCenter />;
        case 'skill_gaps':
          return <SkillGapAnalytics />;
        case 'historical_db':
          return <HistoricalIntelligenceDb />;
        case 'training':
          return <TrainingManager />;
        case 'reports':
          return <ReportsExport />;
        default:
          return <FacultyDashboard />;
      }
    }

    // 3. Placement Cell, Training Lead, College Admin, Super Admin
    switch (activeTab) {
      case 'overview':
        return <PlacementOverview />;
      case 'students':
        return <StudentManagement />;
      case 'recruiters':
        return <RecruitersManager />;
      case 'historical_db':
        return <HistoricalIntelligenceDb />;
      case 'skill_gaps':
        return <SkillGapAnalytics />;
      case 'training':
        return <TrainingManager />;
      case 'interventions':
        return <InterventionCenter />;
      case 'outcomes':
        return <PlacementOutcomes />;
      case 'data_moat':
        return <DataMoatAndPrivacy />;
      case 'csv_pipeline':
        return <CsvImportPipeline />;
      case 'reports':
        return <ReportsExport />;
      case 'audit_logs':
        return <AuditLogViewer />;
      default:
        return <PlacementOverview />;
    }
  };

  return (
    <div className="min-h-screen bg-white text-neutral-900 flex flex-col font-sans">
      <Header />

      {/* Main Workspace Frame */}
      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        <Sidebar />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 min-w-0 overflow-y-auto max-h-[calc(100vh-4rem)] bg-white">
          {/* Institutional Demo Notice Banner - Clean Pure White/Neutral minimal styling */}
          <div className="mb-6 p-3.5 bg-neutral-50 border border-neutral-200 rounded-xl text-xs text-neutral-700 flex items-center justify-between gap-3 shadow-2xs">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-neutral-900 shrink-0" />
              <span>
                <strong>Institutional Demo Environment:</strong> 400 Student Cohort telemetry active with tenant isolation. Real recruitment intelligence models loaded.
              </span>
            </div>
            <span className="hidden md:inline font-mono text-[11px] font-semibold text-neutral-600 bg-white px-2 py-0.5 rounded border border-neutral-200 shrink-0">
              Active Session
            </span>
          </div>

          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </LanguageProvider>
  );
}
