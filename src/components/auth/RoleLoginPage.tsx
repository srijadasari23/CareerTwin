import React, { useState } from 'react';
import { useAuth, RoleFlowType } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import {
  GraduationCap,
  BookOpen,
  Briefcase,
  ArrowLeft,
  Eye,
  EyeOff,
  CheckCircle,
  AlertCircle,
  Loader2,
  Lock,
  Mail,
  User as UserIcon,
  Sparkles,
} from 'lucide-react';

interface RoleLoginPageProps {
  roleFlow: 'student' | 'faculty' | 'placement_officer';
  onBack: () => void;
}

export const RoleLoginPage: React.FC<RoleLoginPageProps> = ({ roleFlow, onBack }) => {
  const { login, tenant } = useAuth();
  const { t, language } = useLanguage();

  const [activeTab, setActiveTab] = useState<'signin' | 'register'>('signin');
  const [identifier, setIdentifier] = useState(''); // email or studentId
  const [password, setPassword] = useState('CareerTwin@2026');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Registration form fields (for student tab)
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regStudentId, setRegStudentId] = useState('');
  const [regDept, setRegDept] = useState('CSE');
  const [regSuccess, setRegSuccess] = useState(false);

  // Forgot password modal
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotSubmitted, setForgotSubmitted] = useState(false);

  // Role Meta configuration
  const roleConfig = {
    student: {
      title: 'Student Portal Sign In',
      subtitle: 'Enter your institutional email or student ID to access your career copilot.',
      icon: <GraduationCap className="w-5 h-5 text-neutral-900" />,
      identifierLabel: 'Email Address or Student ID',
      identifierPlaceholder: 'e.g. arjun.kumar@rcee.ac.in or CT1000',
      demoCred: { identifier: 'arjun.kumar@rcee.ac.in', name: 'Arjun Kumar (CT1000)' },
    },
    faculty: {
      title: 'Faculty Mentor Sign In',
      subtitle: 'Enter your verified faculty email to access assigned student cohorts.',
      icon: <BookOpen className="w-5 h-5 text-neutral-900" />,
      identifierLabel: 'Institutional Faculty Email',
      identifierPlaceholder: 'e.g. sk.murthy@rcee.ac.in',
      demoCred: { identifier: 'sk.murthy@rcee.ac.in', name: 'Dr. S. K. Murthy (Prof. CSE)' },
    },
    placement_officer: {
      title: 'Placement Officer Sign In',
      subtitle: 'Enter your placement department credentials to manage drives and outcomes.',
      icon: <Briefcase className="w-5 h-5 text-neutral-900" />,
      identifierLabel: 'Placement Cell Email',
      identifierPlaceholder: 'e.g. dasarisrija36@gmail.com',
      demoCred: { identifier: 'dasarisrija36@gmail.com', name: 'Srija Dasari (TPO Lead)' },
    },
  }[roleFlow];

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!identifier.trim()) {
      setErrorMessage('Please enter your email or identification number.');
      return;
    }
    setLoading(true);
    setErrorMessage(null);

    const isEmail = identifier.includes('@');
    const res = await login({
      email: isEmail ? identifier.trim() : undefined,
      studentId: !isEmail ? identifier.trim() : undefined,
      password,
      expectedRole: roleFlow,
      rememberMe,
    });

    if (!res.success) {
      setErrorMessage(res.error || 'Authentication failed.');
      setLoading(false);
    }
    // On success, AuthContext automatically navigates to the dashboard
  };

  const handleAutofillDemo = () => {
    setIdentifier(roleConfig.demoCred.identifier);
    setPassword('CareerTwin@2026');
    setErrorMessage(null);
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!regName.trim() || !regEmail.trim()) {
      setErrorMessage('Please fill in all registration fields.');
      return;
    }
    setLoading(true);
    setErrorMessage(null);

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: regName,
          email: regEmail,
          studentId: regStudentId || `CT${Math.floor(1000 + Math.random() * 9000)}`,
          department: regDept,
          role: 'student',
          tenantId: tenant?.id || 'tenant-rcee',
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setRegSuccess(true);
        // Automatically sign in the registered user
        await login({
          email: regEmail,
          password: 'defaultPassword',
          expectedRole: 'student',
        });
      } else {
        setErrorMessage(data.error || 'Registration failed.');
      }
    } catch (err: any) {
      setErrorMessage(err?.message || 'Network error.');
    } finally {
      setLoading(false);
    }
  };

  const handleSendForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotEmail) return;
    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: forgotEmail }),
      });
      if (res.ok) {
        setForgotSubmitted(true);
      } else {
        const err = await res.json();
        setErrorMessage(err.error || 'Password reset failed.');
      }
    } catch (err) {
      setErrorMessage('Network error dispatching reset instructions.');
    }
  };

  return (
    <div className="min-h-screen bg-white text-neutral-900 flex flex-col font-sans">
      {/* Top Bar with Return Action */}
      <header className="w-full border-b border-neutral-200 bg-white">
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-xs font-semibold text-neutral-600 hover:text-neutral-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{t('backToRoles')}</span>
          </button>

          <div className="flex items-center gap-2 text-xs font-semibold text-neutral-900">
            <span>CareerTwin AI</span>
            <span aria-hidden="true" className="text-neutral-300">·</span>
            <span className="text-neutral-500 font-normal">{tenant?.code || 'RCEE'} Portal</span>
          </div>
        </div>
      </header>

      {/* Main Login Form Card */}
      <main className="flex-1 max-w-md w-full mx-auto px-4 py-12 flex flex-col justify-center">
        <div className="bg-white border border-neutral-200 rounded-2xl p-6 sm:p-8 shadow-xs space-y-6">
          {/* Header & Icon */}
          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-xl bg-neutral-100 border border-neutral-200 flex items-center justify-center mx-auto text-neutral-900">
              {roleConfig.icon}
            </div>
            <h1 className="text-xl font-bold text-neutral-900 tracking-tight">
              {roleConfig.title}
            </h1>
            <p className="text-xs text-neutral-500 max-w-xs mx-auto">
              {roleConfig.subtitle}
            </p>
          </div>

          {/* Student Toggle: Sign In vs. Register */}
          {roleFlow === 'student' && (
            <div className="flex p-1 bg-neutral-100 rounded-lg border border-neutral-200 text-xs font-semibold">
              <button
                type="button"
                onClick={() => {
                  setActiveTab('signin');
                  setErrorMessage(null);
                }}
                className={`flex-1 py-1.5 rounded-md transition-colors ${
                  activeTab === 'signin' ? 'bg-white text-neutral-900 shadow-2xs font-bold' : 'text-neutral-500'
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => {
                  setActiveTab('register');
                  setErrorMessage(null);
                }}
                className={`flex-1 py-1.5 rounded-md transition-colors ${
                  activeTab === 'register' ? 'bg-white text-neutral-900 shadow-2xs font-bold' : 'text-neutral-500'
                }`}
              >
                Student Enrollment
              </button>
            </div>
          )}

          {/* Error Notice */}
          {errorMessage && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-800 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Quick Demo Credentials Autofill Shortcut */}
          <div className="p-3 bg-neutral-50 border border-neutral-200 rounded-xl text-xs flex items-center justify-between">
            <div>
              <div className="font-semibold text-neutral-800">Demo Account Available</div>
              <div className="text-[11px] text-neutral-500 truncate max-w-[220px]">
                {roleConfig.demoCred.name}
              </div>
            </div>
            <button
              type="button"
              onClick={handleAutofillDemo}
              className="px-2.5 py-1 text-[11px] font-bold text-neutral-900 bg-white hover:bg-neutral-100 border border-neutral-300 rounded-lg shadow-2xs transition-colors shrink-0"
            >
              Autofill Demo
            </button>
          </div>

          {/* Sign In Form */}
          {activeTab === 'signin' ? (
            <form onSubmit={handleSignIn} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
                  {roleConfig.identifierLabel}
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-neutral-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    value={identifier}
                    onChange={e => setIdentifier(e.target.value)}
                    placeholder={roleConfig.identifierPlaceholder}
                    required
                    className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-neutral-300 rounded-xl outline-none text-neutral-900 placeholder:text-neutral-400 focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900 transition-all"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-semibold text-neutral-700">
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setForgotEmail(identifier);
                      setShowForgotPassword(true);
                      setForgotSubmitted(false);
                    }}
                    className="text-[11px] font-semibold text-neutral-600 hover:text-neutral-900 hover:underline"
                  >
                    Forgot password?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-neutral-400 absolute left-3 top-2.5" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="Enter password..."
                    required
                    className="w-full pl-9 pr-10 py-2 text-xs bg-white border border-neutral-300 rounded-xl outline-none text-neutral-900 placeholder:text-neutral-400 focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(prev => !prev)}
                    className="absolute right-3 top-2.5 text-neutral-400 hover:text-neutral-700"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="rememberMe"
                  checked={rememberMe}
                  onChange={e => setRememberMe(e.target.checked)}
                  className="rounded border-neutral-300 text-neutral-900 focus:ring-neutral-900"
                />
                <label htmlFor="rememberMe" className="ml-2 text-xs text-neutral-600 font-medium">
                  Remember my session on this device
                </label>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 px-4 bg-neutral-900 hover:bg-neutral-800 disabled:opacity-50 text-white rounded-xl text-xs font-bold shadow-xs transition-colors flex items-center justify-center gap-2"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                <span>Sign In to {roleConfig.title.split(' ')[0]}</span>
              </button>
            </form>
          ) : (
            /* Student Registration Form */
            <form onSubmit={handleRegister} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
                  Full Name
                </label>
                <input
                  type="text"
                  value={regName}
                  onChange={e => setRegName(e.target.value)}
                  placeholder="e.g. Ramesh Kumar"
                  required
                  className="w-full px-3 py-2 text-xs bg-white border border-neutral-300 rounded-xl outline-none text-neutral-900 placeholder:text-neutral-400 focus:border-neutral-900"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
                  College Email
                </label>
                <input
                  type="email"
                  value={regEmail}
                  onChange={e => setRegEmail(e.target.value)}
                  placeholder="e.g. ramesh.kumar@rcee.ac.in"
                  required
                  className="w-full px-3 py-2 text-xs bg-white border border-neutral-300 rounded-xl outline-none text-neutral-900 placeholder:text-neutral-400 focus:border-neutral-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
                    Student Roll No
                  </label>
                  <input
                    type="text"
                    value={regStudentId}
                    onChange={e => setRegStudentId(e.target.value)}
                    placeholder="e.g. CT1050"
                    className="w-full px-3 py-2 text-xs bg-white border border-neutral-300 rounded-xl outline-none text-neutral-900 placeholder:text-neutral-400 focus:border-neutral-900"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
                    Department
                  </label>
                  <select
                    value={regDept}
                    onChange={e => setRegDept(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-white border border-neutral-300 rounded-xl outline-none text-neutral-900 focus:border-neutral-900"
                  >
                    <option value="CSE">CSE</option>
                    <option value="IT">IT</option>
                    <option value="ECE">ECE</option>
                    <option value="AI & DS">AI & DS</option>
                    <option value="EEE">EEE</option>
                    <option value="MECH">MECH</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 px-4 bg-neutral-900 hover:bg-neutral-800 disabled:opacity-50 text-white rounded-xl text-xs font-bold shadow-xs transition-colors flex items-center justify-center gap-2"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                <span>Complete Student Enrollment</span>
              </button>
            </form>
          )}

          {/* Institutional Access Notice */}
          <div className="pt-2 text-center text-[11px] text-neutral-500">
            Protected by institutional single sign-on & tenant security. Unauthorized access is recorded.
          </div>
        </div>
      </main>

      {/* Forgot Password Modal */}
      {showForgotPassword && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-900/40 backdrop-blur-2xs p-4">
          <div className="bg-white border border-neutral-200 rounded-2xl max-w-sm w-full p-6 shadow-xl space-y-4">
            <h3 className="text-sm font-bold text-neutral-900">
              Reset Institutional Credentials
            </h3>

            {forgotSubmitted ? (
              <div className="p-3 rounded-xl bg-emerald-50 text-emerald-800 text-xs space-y-2">
                <div className="font-bold flex items-center gap-1.5">
                  <CheckCircle className="w-4 h-4 text-emerald-600" />
                  <span>Password Reset Dispatched</span>
                </div>
                <p>
                  Instructions have been sent to <strong>{forgotEmail}</strong>. Contact your department coordinator if you do not receive it.
                </p>
                <button
                  type="button"
                  onClick={() => setShowForgotPassword(false)}
                  className="w-full mt-2 py-2 bg-neutral-900 text-white text-xs font-bold rounded-lg"
                >
                  Return to Sign In
                </button>
              </div>
            ) : (
              <form onSubmit={handleSendForgotPassword} className="space-y-3">
                <p className="text-xs text-neutral-500">
                  Enter your registered college email. A verification link will be dispatched.
                </p>
                <input
                  type="email"
                  value={forgotEmail}
                  onChange={e => setForgotEmail(e.target.value)}
                  placeholder="name@rcee.ac.in"
                  required
                  className="w-full px-3 py-2 text-xs bg-white border border-neutral-300 rounded-xl outline-none text-neutral-900"
                />

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowForgotPassword(false)}
                    className="px-3 py-1.5 text-xs text-neutral-600 hover:text-neutral-900"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-3 py-1.5 bg-neutral-900 text-white rounded-lg text-xs font-bold"
                  >
                    Send Instructions
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
