import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Tenant, Student, UserRole } from '../types';

export type RoleFlowType = 'student' | 'faculty' | 'placement_officer' | null;

interface AuthContextType {
  isAuthenticated: boolean;
  selectedRoleFlow: RoleFlowType;
  setSelectedRoleFlow: (flow: RoleFlowType) => void;
  user: User | null;
  tenant: Tenant | null;
  tenants: Tenant[];
  student: Student | null;
  role: UserRole;
  isDark: boolean;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  toggleTheme: () => void;
  login: (params: {
    email?: string;
    studentId?: string;
    password?: string;
    expectedRole?: string;
    tenantId?: string;
    rememberMe?: boolean;
  }) => Promise<{ success: boolean; error?: string; actualRole?: string }>;
  logout: () => Promise<void>;
  switchRole: (role: UserRole) => Promise<void>;
  switchTenant: (tenantId: string) => Promise<void>;
  updateStudentProfile: (updates: Partial<Student>) => Promise<void>;
  notifications: { id: string; title: string; time: string; read: boolean }[];
  markNotificationsRead: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return !!localStorage.getItem('careertwin_token');
    }
    return false;
  });

  const [selectedRoleFlow, setSelectedRoleFlow] = useState<RoleFlowType>(null);
  const [user, setUser] = useState<User | null>(null);
  const [tenant, setTenant] = useState<Tenant | null>(null);
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [student, setStudent] = useState<Student | null>(null);
  const [role, setRole] = useState<UserRole>('student');
  const [activeTab, setActiveTab] = useState<string>('overview');
  const [isLoading, setIsLoading] = useState(true);

  // STRICT RULE: Pure white theme by default
  const [isDark, setIsDark] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('careertwin_theme') === 'dark';
    }
    return false;
  });

  const [notifications, setNotifications] = useState([
    { id: '1', title: 'TCS Campus Drive: Online Assessment starts in 4 days', time: '10m ago', read: false },
    { id: '2', title: 'New Recruiter Question verified for SQL & Normalization', time: '1h ago', read: false },
    { id: '3', title: 'Weekly Readiness Report published: +4 pts gained', time: '1d ago', read: true },
  ]);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('careertwin_theme', isDark ? 'dark' : 'light');
  }, [isDark]);

  const toggleTheme = () => setIsDark(prev => !prev);

  // Load Tenants and Session if token exists
  useEffect(() => {
    async function initSession() {
      try {
        setIsLoading(true);
        const [tenantsRes] = await Promise.all([
          fetch('/api/tenants')
        ]);

        if (tenantsRes.ok) {
          const tData = await tenantsRes.json();
          setTenants(tData.tenants || []);
        }

        const storedToken = localStorage.getItem('careertwin_token');
        const storedRole = localStorage.getItem('careertwin_role') as UserRole;

        if (storedToken && storedRole) {
          const meRes = await fetch('/api/auth/me');
          if (meRes.ok) {
            const data = await meRes.json();
            setUser(data.user);
            setTenant(data.tenant);
            setStudent(data.student);
            setRole(data.user?.role || storedRole);
            setIsAuthenticated(true);
          }
        }
      } catch (err) {
        console.warn('Init session failed:', err);
      } finally {
        setIsLoading(false);
      }
    }

    initSession();
  }, []);

  const login = async (params: {
    email?: string;
    studentId?: string;
    password?: string;
    expectedRole?: string;
    tenantId?: string;
    rememberMe?: boolean;
  }) => {
    try {
      setIsLoading(true);
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: params.email,
          studentId: params.studentId,
          password: params.password,
          expectedRole: params.expectedRole,
          tenantId: params.tenantId || tenant?.id || 'tenant-rcee'
        })
      });

      const data = await res.json();
      if (!res.ok) {
        return {
          success: false,
          error: data.error || 'Authentication failed. Please check your credentials.',
          actualRole: data.actualRole
        };
      }

      // Successful login
      setUser(data.user);
      setTenant(data.tenant);
      setStudent(data.student || null);
      setRole(data.user.role);
      setIsAuthenticated(true);
      setActiveTab('overview');
      setSelectedRoleFlow(null);

      localStorage.setItem('careertwin_token', data.token || 'ct_token');
      localStorage.setItem('careertwin_role', data.user.role);

      return { success: true };
    } catch (err: any) {
      return { success: false, error: err?.message || 'Network error during login.' };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch (err) {
      console.warn('Logout notification error:', err);
    } finally {
      localStorage.removeItem('careertwin_token');
      localStorage.removeItem('careertwin_role');
      setIsAuthenticated(false);
      setUser(null);
      setStudent(null);
      setSelectedRoleFlow(null);
      setActiveTab('overview');
    }
  };

  const switchRole = async (newRole: UserRole) => {
    try {
      setIsLoading(true);
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: newRole, tenantId: tenant?.id || 'tenant-rcee' })
      });
      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
        setTenant(data.tenant);
        setRole(newRole);
        setActiveTab('overview');

        if (newRole === 'student') {
          const stuRes = await fetch(`/api/students/${data.user.studentId || 'CT1000'}`);
          if (stuRes.ok) {
            const stuData = await stuRes.json();
            setStudent(stuData.student);
          }
        } else {
          setStudent(null);
        }
      }
    } catch (err) {
      console.error('Role switch failed:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const switchTenant = async (tenantId: string) => {
    try {
      setIsLoading(true);
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role, tenantId })
      });
      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
        setTenant(data.tenant);
        setActiveTab('overview');
      }
    } catch (err) {
      console.error('Tenant switch failed:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const updateStudentProfile = async (updates: Partial<Student>) => {
    if (!student) return;
    try {
      const res = await fetch(`/api/students/${student.studentId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      });
      if (res.ok) {
        const data = await res.json();
        setStudent(data.student);
      }
    } catch (err) {
      console.error('Student update failed:', err);
    }
  };

  const markNotificationsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  return (
    <AuthContext.Provider value={{
      isAuthenticated,
      selectedRoleFlow,
      setSelectedRoleFlow,
      user,
      tenant,
      tenants,
      student,
      role,
      isDark,
      activeTab,
      setActiveTab,
      toggleTheme,
      login,
      logout,
      switchRole,
      switchTenant,
      updateStudentProfile,
      notifications,
      markNotificationsRead,
      isLoading
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
