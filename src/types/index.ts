export interface Tenant {
  id: string;
  name: string;
  code: string;
  city: string;
  state: string;
  established: number;
  studentCount: number;
  placementRate: number;
}

export type UserRole = 
  | 'student' 
  | 'faculty' 
  | 'placement_officer' 
  | 'hod' 
  | 'training_coordinator' 
  | 'college_admin' 
  | 'super_admin';

export interface User {
  id: string;
  tenantId: string;
  name: string;
  email: string;
  role: UserRole;
  department?: string;
  studentId?: string;
  avatar?: string;
  languagePreference: 'en' | 'te';
}

export interface Student {
  id: string;
  studentId: string;
  tenantId: string;
  name: string;
  email: string;
  department: string;
  year: 'Final Year' | 'Pre-Final Year';
  cgpa: number;
  targetRecruiter: string;
  targetRole: string;
  technical: number;
  communication: number;
  aptitude: number;
  interviewSkills: number;
  coding: number;
  practiceCompletion: number;
  mockInterviews: number;
  readiness: number;
  streakDays: number;
  status: 'Interview Ready' | 'On Track' | 'Needs Improvement' | 'High Priority';
  mentorName?: string;
  isVerified: boolean;
  history?: { date: string; score: number }[];
}

export interface Recruiter {
  id: string;
  name: string;
  role: string;
  package: string;
  ctcNum: number;
  type: 'Mass' | 'Product' | 'Consulting';
  hiringStatus: 'Active' | 'Upcoming' | 'Completed';
  requiredSkills: string[];
  rounds: string[];
  criteria: {
    minReadiness: number;
    minCgpa: number;
    allowedDepts: string[];
  };
}

export interface Question {
  id: string;
  recruiter: string;
  role: string;
  year: number;
  round: string;
  topic: string;
  question: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  frequency: 'High' | 'Medium' | 'Low';
  confidence: 'High Confidence' | 'Medium Confidence' | 'Low Confidence';
  sourceType: 'Placement-cell verified' | 'Multiple student reports' | 'Alumni reported' | 'Single student report' | 'Unverified';
  explanation?: string;
  modelAnswer?: string;
  isVerified: boolean;
  isSaved?: boolean;
  isPracticed?: boolean;
}

export interface TrainingProgram {
  id: string;
  tenantId: string;
  program: string;
  skill: string;
  category: string;
  durationWeeks: number;
  enrolled: number;
  completionPct: number;
  avgImprovement: number;
  instructor: string;
  status: 'Active' | 'Upcoming' | 'Completed';
}

export interface Intervention {
  id: string;
  tenantId: string;
  studentId: string;
  name: string;
  department: string;
  targetRecruiter: string;
  readiness: number;
  mainGap: string;
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
  recommendedAction: string;
  status: 'Pending' | 'In Progress' | 'Reviewed' | 'Resolved';
  assignedDate: string;
  mentorFeedback?: string;
}

export interface PlacementOutcome {
  id: string;
  tenantId: string;
  studentId: string;
  name: string;
  department: string;
  readiness: number;
  targetRecruiter: string;
  eligible: boolean;
  interviewed: boolean;
  offer: boolean;
  packageLpa: number | null;
  placedCompany?: string;
  placedRole?: string;
  driveDate: string;
}

export interface MockInterviewRecord {
  id: string;
  studentId: string;
  tenantId: string;
  recruiter: string;
  role: string;
  interviewType: string;
  completedAt: string;
  score: number;
  overallScore: number;
  technicalScore: number;
  communicationScore: number;
  confidenceScore: number;
  questionsCount: number;
  qna: {
    question: string;
    answer: string;
    score: number;
    strength: string;
    improvement: string;
    starAnalysis?: {
      situation: string;
      task: string;
      action: string;
      result: string;
    };
  }[];
}

export interface AuditLog {
  id: string;
  tenantId: string;
  userId: string;
  userName: string;
  userRole: string;
  action: string;
  entity: string;
  details: string;
  timestamp: string;
}
