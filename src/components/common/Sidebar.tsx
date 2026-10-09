import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import {
  LayoutDashboard,
  Sparkles,
  Search,
  BookOpen,
  CalendarCheck,
  Dumbbell,
  Mic,
  FileText,
  MessageSquare,
  BarChart3,
  Users,
  Building2,
  Database,
  Flame,
  GraduationCap,
  AlertTriangle,
  Award,
  ShieldCheck,
  UploadCloud,
  FileSpreadsheet,
  Settings,
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const { role, activeTab, setActiveTab, student, user } = useAuth();
  const { t } = useLanguage();

  interface NavItem {
    id: string;
    label: string;
    icon: React.ReactNode;
  }

  interface NavGroup {
    group: string;
    items: NavItem[];
  }

  let navGroups: NavGroup[] = [];

  if (role === 'student') {
    navGroups = [
      {
        group: 'OVERVIEW',
        items: [
          { id: 'overview', label: t('overview'), icon: <LayoutDashboard className="w-4 h-4 text-neutral-700" /> },
          { id: 'copilot', label: t('copilot'), icon: <Sparkles className="w-4 h-4 text-neutral-900" /> },
          { id: 'recruiter_intel', label: t('recruiterIntel'), icon: <Search className="w-4 h-4 text-neutral-700" /> },
        ]
      },
      {
        group: 'PREPARATION',
        items: [
          { id: 'skills', label: t('subjectsSkills'), icon: <BookOpen className="w-4 h-4 text-neutral-700" /> },
          { id: 'practice', label: t('practiceCenter'), icon: <Dumbbell className="w-4 h-4 text-neutral-700" /> },
          { id: 'plan', label: t('myPreparation'), icon: <CalendarCheck className="w-4 h-4 text-neutral-700" /> },
          { id: 'mock_interview', label: t('mockInterview'), icon: <Mic className="w-4 h-4 text-neutral-700" /> },
          { id: 'resume', label: t('resumeAssistant'), icon: <FileText className="w-4 h-4 text-neutral-700" /> },
          { id: 'comm_lab', label: t('communicationLab'), icon: <MessageSquare className="w-4 h-4 text-neutral-700" /> },
        ]
      },
      {
        group: 'PERFORMANCE',
        items: [
          { id: 'readiness', label: t('readinessScore'), icon: <BarChart3 className="w-4 h-4 text-neutral-700" /> },
        ]
      }
    ];
  } else if (role === 'faculty' || role === 'hod') {
    navGroups = [
      {
        group: 'DEPARTMENT MENTORSHIP',
        items: [
          { id: 'overview', label: 'Faculty Console', icon: <LayoutDashboard className="w-4 h-4 text-neutral-700" /> },
          { id: 'students', label: 'Department Students', icon: <Users className="w-4 h-4 text-neutral-700" /> },
          { id: 'interventions', label: 'Student Interventions', icon: <AlertTriangle className="w-4 h-4 text-neutral-700" /> },
        ]
      },
      {
        group: 'ACADEMIC ALIGNMENT',
        items: [
          { id: 'skill_gaps', label: t('skillGaps'), icon: <Flame className="w-4 h-4 text-neutral-700" /> },
          { id: 'historical_db', label: t('historicalDb'), icon: <Database className="w-4 h-4 text-neutral-700" /> },
          { id: 'training', label: t('training'), icon: <GraduationCap className="w-4 h-4 text-neutral-700" /> },
          { id: 'reports', label: t('reports'), icon: <FileSpreadsheet className="w-4 h-4 text-neutral-700" /> },
        ]
      }
    ];
  } else {
    // Placement Officer, Training Lead, College Admin, Super Admin
    navGroups = [
      {
        group: 'OVERVIEW',
        items: [
          { id: 'overview', label: 'Operations Dashboard', icon: <LayoutDashboard className="w-4 h-4 text-neutral-700" /> },
        ]
      },
      {
        group: 'MANAGEMENT',
        items: [
          { id: 'students', label: t('students'), icon: <Users className="w-4 h-4 text-neutral-700" /> },
          { id: 'recruiters', label: t('recruiters'), icon: <Building2 className="w-4 h-4 text-neutral-700" /> },
          { id: 'historical_db', label: t('historicalDb'), icon: <Database className="w-4 h-4 text-neutral-700" /> },
        ]
      },
      {
        group: 'ANALYTICS',
        items: [
          { id: 'skill_gaps', label: t('skillGaps'), icon: <Flame className="w-4 h-4 text-neutral-700" /> },
          { id: 'outcomes', label: t('placementOutcomes'), icon: <Award className="w-4 h-4 text-neutral-700" /> },
        ]
      },
      {
        group: 'ACTION',
        items: [
          { id: 'training', label: t('training'), icon: <GraduationCap className="w-4 h-4 text-neutral-700" /> },
          { id: 'interventions', label: t('interventions'), icon: <AlertTriangle className="w-4 h-4 text-neutral-700" /> },
          { id: 'csv_pipeline', label: t('csvPipeline'), icon: <UploadCloud className="w-4 h-4 text-neutral-700" /> },
          { id: 'reports', label: t('reports'), icon: <FileSpreadsheet className="w-4 h-4 text-neutral-700" /> },
        ]
      },
      {
        group: 'SYSTEM',
        items: [
          { id: 'data_moat', label: t('dataMoat'), icon: <ShieldCheck className="w-4 h-4 text-neutral-700" /> },
          { id: 'audit_logs', label: t('auditLogs'), icon: <Settings className="w-4 h-4 text-neutral-700" /> },
        ]
      }
    ];
  }

  return (
    <aside className="w-64 shrink-0 border-r border-neutral-200 bg-white flex flex-col justify-between h-[calc(100vh-4rem)] sticky top-16">
      <div className="overflow-y-auto px-3 py-4 space-y-6">
        {navGroups.map((g, idx) => (
          <div key={idx}>
            <div className="px-3 mb-2 text-[10.5px] font-bold text-neutral-400 tracking-wider uppercase">
              {g.group}
            </div>
            <div className="space-y-0.5">
              {g.items.map(item => {
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs transition-colors whitespace-nowrap ${
                      isActive
                        ? 'bg-neutral-100 text-neutral-900 font-bold border-l-2 border-neutral-900'
                        : 'text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900 font-medium'
                    }`}
                  >
                    <span className="shrink-0">{item.icon}</span>
                    <span className="truncate">{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* User Session Footer Card */}
      <div className="p-3 border-t border-neutral-200 bg-neutral-50/50">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-neutral-100 border border-neutral-200 text-neutral-900 font-bold text-xs flex items-center justify-center shrink-0">
            {user?.name.charAt(0) || 'U'}
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-xs font-bold text-neutral-900 truncate">
              {role === 'student' ? (student?.name || 'Arjun Kumar') : user?.name}
            </div>
            <div className="text-[11px] text-neutral-500 truncate">
              {role === 'student' ? `${student?.department} · ${student?.studentId}` : user?.email}
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};
