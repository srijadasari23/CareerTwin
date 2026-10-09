import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { UserRole } from '../../types';
import {
  Globe,
  Bell,
  Building,
  UserCheck,
  Check,
  VolumeX,
  LogOut,
  User as UserIcon,
} from 'lucide-react';

export const Header: React.FC = () => {
  const { user, tenant, tenants, role, switchRole, switchTenant, notifications, markNotificationsRead, logout } = useAuth();
  const { language, setLanguage, t, isSpeaking, stopSpeaking } = useLanguage();

  const [showRoleMenu, setShowRoleMenu] = useState(false);
  const [showTenantMenu, setShowTenantMenu] = useState(false);
  const [showNotifMenu, setShowNotifMenu] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const roleOptions: { role: UserRole; label: string; badge: string }[] = [
    { role: 'student', label: 'Arjun Kumar', badge: 'Student' },
    { role: 'faculty', label: 'Dr. S. K. Murthy', badge: 'Faculty Mentor' },
    { role: 'placement_officer', label: 'Srija Dasari', badge: 'Placement Officer' },
    { role: 'hod', label: 'Dr. K. Srinivas Rao', badge: 'HOD CSE' },
    { role: 'training_coordinator', label: 'Prof. Anitha Varma', badge: 'Training Lead' },
    { role: 'college_admin', label: 'Dr. Suryanarayana', badge: 'Principal / Admin' },
    { role: 'super_admin', label: 'Platform Operations', badge: 'Super Admin' },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-neutral-200 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16 gap-4">
        {/* Zone 1: Wordmark */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="w-8 h-8 rounded-lg bg-neutral-900 text-white flex items-center justify-center font-black text-sm select-none">
            CT
          </div>
          <div className="flex flex-col">
            <span className="text-base font-bold tracking-tight text-neutral-900 whitespace-nowrap leading-tight">
              CareerTwin AI
            </span>
            <span className="text-[11px] font-medium text-neutral-500 whitespace-nowrap">
              {tenant ? tenant.code : 'RCEE'} Campus Intelligence
            </span>
          </div>
        </div>

        {/* Zone 2: Navigation Breadcrumb */}
        <div className="hidden lg:flex items-center gap-2 text-xs text-neutral-500">
          <span>{tenant?.name || 'Ramachandra College of Engineering'}</span>
          <span aria-hidden="true">·</span>
          <span>Role: <strong className="text-neutral-900 font-semibold">{t(`role_${role}`)}</strong></span>
          <span aria-hidden="true">·</span>
          <span className="text-emerald-700 font-medium">Tenant Isolation Active</span>
        </div>

        {/* Zone 3: Actions & Profile */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Audio Stop Button if voice is active */}
          {isSpeaking && (
            <button
              onClick={stopSpeaking}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200"
              title="Stop current voice narration"
            >
              <VolumeX className="w-3.5 h-3.5" />
              <span>Stop Voice</span>
            </button>
          )}

          {/* Telugu / English Toggle */}
          <div className="flex items-center bg-neutral-100 p-0.5 rounded-lg border border-neutral-200">
            <button
              onClick={() => setLanguage('en')}
              className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
                language === 'en'
                  ? 'bg-white text-neutral-900 shadow-2xs font-bold'
                  : 'text-neutral-500 hover:text-neutral-900'
              }`}
            >
              English
            </button>
            <button
              onClick={() => setLanguage('te')}
              className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
                language === 'te'
                  ? 'bg-white text-neutral-900 shadow-2xs font-bold'
                  : 'text-neutral-500 hover:text-neutral-900'
              }`}
            >
              తెలుగు
            </button>
          </div>

          {/* College Tenant Selector */}
          <div className="relative">
            <button
              onClick={() => setShowTenantMenu(prev => !prev)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-neutral-700 bg-white border border-neutral-200 rounded-lg hover:border-neutral-300 transition-colors"
              title="Change Institution Tenant"
            >
              <Building className="w-3.5 h-3.5 text-neutral-400" />
              <span className="hidden sm:inline font-mono font-semibold">{tenant?.code || 'RCEE'}</span>
            </button>

            {showTenantMenu && (
              <div className="absolute right-0 mt-2 w-64 bg-white border border-neutral-200 rounded-xl shadow-lg p-2 z-50">
                <div className="px-2 py-1 text-[11px] font-bold text-neutral-400 uppercase tracking-wider">
                  Select College Tenant
                </div>
                {tenants.map(t => (
                  <button
                    key={t.id}
                    onClick={() => {
                      switchTenant(t.id);
                      setShowTenantMenu(false);
                    }}
                    className={`w-full text-left px-2.5 py-2 rounded-lg text-xs flex items-center justify-between transition-colors ${
                      tenant?.id === t.id
                        ? 'bg-neutral-100 text-neutral-900 font-bold'
                        : 'text-neutral-700 hover:bg-neutral-50'
                    }`}
                  >
                    <div>
                      <div className="font-medium">{t.name}</div>
                      <div className="text-[10px] text-neutral-400">{t.city}, {t.state}</div>
                    </div>
                    {tenant?.id === t.id && <Check className="w-3.5 h-3.5 shrink-0" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Quick Role Switcher */}
          <div className="relative">
            <button
              onClick={() => setShowRoleMenu(prev => !prev)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-neutral-900 hover:bg-neutral-800 rounded-lg shadow-2xs transition-colors whitespace-nowrap"
            >
              <UserCheck className="w-3.5 h-3.5" />
              <span>{t(`role_${role}`)}</span>
            </button>

            {showRoleMenu && (
              <div className="absolute right-0 mt-2 w-72 bg-white border border-neutral-200 rounded-xl shadow-xl p-2 z-50">
                <div className="px-3 py-1.5 text-[11px] font-bold text-neutral-400 uppercase tracking-wider">
                  Instant Role Switcher
                </div>
                <div className="space-y-1">
                  {roleOptions.map(opt => (
                    <button
                      key={opt.role}
                      onClick={() => {
                        switchRole(opt.role);
                        setShowRoleMenu(false);
                      }}
                      className={`w-full text-left px-3 py-2 rounded-lg text-xs flex items-center justify-between transition-colors ${
                        role === opt.role
                          ? 'bg-neutral-100 text-neutral-900 font-bold'
                          : 'text-neutral-700 hover:bg-neutral-50'
                      }`}
                    >
                      <div>
                        <div className="font-semibold">{opt.label}</div>
                        <div className="text-[10px] text-neutral-400">{opt.badge}</div>
                      </div>
                      {role === opt.role && <Check className="w-4 h-4 text-neutral-900" />}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Notifications Popover */}
          <div className="relative">
            <button
              onClick={() => {
                setShowNotifMenu(prev => !prev);
                markNotificationsRead();
              }}
              className="p-2 text-neutral-600 hover:bg-neutral-100 rounded-lg relative transition-colors"
              title="Notifications"
            >
              <Bell className="w-4 h-4" />
              {notifications.some(n => !n.read) && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-neutral-900" />
              )}
            </button>

            {showNotifMenu && (
              <div className="absolute right-0 mt-2 w-80 bg-white border border-neutral-200 rounded-xl shadow-lg p-3 z-50">
                <div className="flex items-center justify-between pb-2 border-b border-neutral-100 mb-2">
                  <span className="text-xs font-bold text-neutral-900">Notifications</span>
                  <span className="text-[11px] text-neutral-400">Placement Updates</span>
                </div>
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {notifications.map(n => (
                    <div key={n.id} className="text-xs p-2 rounded-lg bg-neutral-50">
                      <div className="font-medium text-neutral-800">{n.title}</div>
                      <div className="text-[10px] text-neutral-400 mt-1">{n.time}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* User Profile & Sign Out Menu */}
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(prev => !prev)}
              className="flex items-center gap-1.5 p-1.5 text-xs font-semibold text-neutral-700 hover:bg-neutral-100 rounded-lg transition-colors"
              title="User Account Menu"
            >
              <div className="w-6 h-6 rounded-full bg-neutral-100 border border-neutral-200 text-neutral-900 text-xs font-bold flex items-center justify-center">
                {user?.name.charAt(0) || 'U'}
              </div>
            </button>

            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-56 bg-white border border-neutral-200 rounded-xl shadow-lg p-2 z-50 space-y-1">
                <div className="px-3 py-2 border-b border-neutral-100">
                  <div className="text-xs font-bold text-neutral-900 truncate">{user?.name}</div>
                  <div className="text-[11px] text-neutral-500 truncate">{user?.email}</div>
                  <div className="text-[10px] text-neutral-400 mt-0.5">{t(`role_${role}`)}</div>
                </div>

                <button
                  onClick={() => {
                    setShowUserMenu(false);
                    logout();
                  }}
                  className="w-full text-left px-3 py-2 rounded-lg text-xs font-semibold text-rose-600 hover:bg-rose-50 flex items-center gap-2 transition-colors"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>{t('signOut')}</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
