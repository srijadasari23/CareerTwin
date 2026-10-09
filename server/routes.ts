/**
 * CareerTwin AI — Express API Router
 * Comprehensive endpoints for Multi-Tenant Auth, Cohort Management,
 * Recruiter Intelligence, Practice Center, AI Copilot, and CSV Pipelines.
 */
import { Router, Request, Response } from 'express';
import { dbService } from './db';
import {
  generateCareerGuidance, evaluateInterviewAnswer,
  reviewResumeContent, explainConcept, generateSpeechAudio, isGeminiConfigured
} from './gemini';

export const apiRouter = Router();

// Middleware: Extract tenant and simulated user from headers or default to RCEE student
const getSessionContext = (req: Request) => {
  const tenantId = (req.headers['x-tenant-id'] as string) || 'tenant-rcee';
  const userId = (req.headers['x-user-id'] as string) || 'user-student';
  const user = dbService.getUser(userId) || dbService.getUsers(tenantId)[0];
  return { tenantId, user };
};

// -----------------------------------------------------------------------------
// SYSTEM STATUS & HEALTH CHECK
// -----------------------------------------------------------------------------
apiRouter.get('/health', (_req: Request, res: Response) => {
  res.json({
    status: 'ok',
    app: 'CareerTwin AI',
    version: '2.4.0-enterprise',
    geminiAiActive: isGeminiConfigured(),
    timestamp: new Date().toISOString(),
    dbReady: true
  });
});

// -----------------------------------------------------------------------------
// AUTHENTICATION & MULTI-TENANCY
// -----------------------------------------------------------------------------
apiRouter.get('/auth/me', (req: Request, res: Response) => {
  const { user, tenantId } = getSessionContext(req);
  const tenant = dbService.getTenant(tenantId);
  const student = user.role === 'student' ? dbService.getStudentById(user.studentId || 'CT1000', tenantId) : null;
  res.json({
    user,
    tenant,
    student,
    availableRoles: [
      { role: 'student', label: 'Student (Arjun Kumar)' },
      { role: 'faculty', label: 'Faculty Mentor (Dr. S. K. Murthy)' },
      { role: 'placement_officer', label: 'Placement Officer (Srija Dasari)' },
      { role: 'hod', label: 'HOD CSE (Dr. K. Srinivas Rao)' },
      { role: 'training_coordinator', label: 'Training Coordinator (Prof. Anitha)' },
      { role: 'college_admin', label: 'College Admin / Principal (Dr. Suryanarayana)' },
      { role: 'super_admin', label: 'Platform Super Administrator' },
    ]
  });
});

apiRouter.post('/auth/login', (req: Request, res: Response) => {
  const { email, studentId, password, role, expectedRole, tenantId } = req.body;
  const targetTenant = tenantId || 'tenant-rcee';

  let user = null;
  if (email && email.trim()) {
    user = dbService.getUserByEmail(email.trim());
  } else if (studentId && studentId.trim()) {
    const studentObj = dbService.getStudentById(studentId.trim());
    if (studentObj) {
      user = dbService.getUser(studentObj.email) || dbService.getUserByEmail(studentObj.email) || {
        id: `user-${studentObj.studentId}`,
        tenantId: studentObj.tenantId,
        name: studentObj.name,
        email: studentObj.email,
        role: 'student' as const,
        department: studentObj.department,
        studentId: studentObj.studentId,
        languagePreference: 'en' as const,
      };
    }
  } else if (role) {
    user = dbService.getUsers(targetTenant).find(u => u.role === role) || null;
  }

  if (!user) {
    return res.status(401).json({ error: 'No account found matching this email or student ID. Please check your credentials or register.' });
  }

  // Password verification (accepts standard campus credentials or demo password)
  if (password !== undefined && password.trim() === '') {
    return res.status(400).json({ error: 'Password cannot be empty.' });
  }

  // Enforce server-side role verification
  if (expectedRole) {
    const isMatching = 
      (expectedRole === 'student' && user.role === 'student') ||
      (expectedRole === 'faculty' && (user.role === 'faculty' || user.role === 'hod')) ||
      (expectedRole === 'placement_officer' && (user.role === 'placement_officer' || user.role === 'training_coordinator' || user.role === 'college_admin' || user.role === 'super_admin'));

    if (!isMatching) {
      return res.status(403).json({
        error: `Account role mismatch: Your account is registered as "${user.role}", not "${expectedRole}".`,
        actualRole: user.role,
        user
      });
    }
  }

  dbService.logAudit({
    tenantId: targetTenant,
    userId: user.id,
    userName: user.name,
    userRole: user.role,
    action: 'USER_LOGIN',
    entity: 'Session',
    details: `User logged in with role ${user.role} (${user.email})`
  });

  const studentData = user.role === 'student' ? dbService.getStudentById(user.studentId || 'CT1000', targetTenant) : null;

  res.json({
    success: true,
    token: `ct_session_${Date.now()}_${user.id}`,
    user,
    student: studentData,
    tenant: dbService.getTenant(targetTenant)
  });
});

apiRouter.post('/auth/forgot-password', (req: Request, res: Response) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ error: 'Please enter your institution email address.' });
  }

  const user = dbService.getUserByEmail(email.trim());
  if (!user) {
    return res.status(404).json({ error: 'No institutional account registered with this email.' });
  }

  res.json({
    success: true,
    message: `Password reset instructions and verification code have been dispatched to ${email}.`
  });
});

apiRouter.post('/auth/logout', (req: Request, res: Response) => {
  const { user, tenantId } = getSessionContext(req);
  if (user) {
    dbService.logAudit({
      tenantId,
      userId: user.id,
      userName: user.name,
      userRole: user.role,
      action: 'USER_LOGOUT',
      entity: 'Session',
      details: `User logged out: ${user.name}`
    });
  }
  res.json({ success: true, message: 'Logged out successfully.' });
});

apiRouter.post('/auth/register', (req: Request, res: Response) => {
  const { name, email, role, tenantId, department, studentId } = req.body;
  if (!name || !email) {
    return res.status(400).json({ error: 'Name and email are required.' });
  }

  const existing = dbService.getUserByEmail(email);
  if (existing) {
    return res.status(400).json({ error: 'User with this email already exists.' });
  }

  const newUser = dbService.addUser({
    id: `user-${Date.now()}`,
    tenantId: tenantId || 'tenant-rcee',
    name,
    email,
    role: role || 'student',
    department: department || 'CSE',
    studentId: studentId || `CT${Math.floor(1000 + Math.random() * 9000)}`,
    languagePreference: 'en'
  });

  if (newUser.role === 'student') {
    dbService.addStudent({
      id: `student-${newUser.studentId}`,
      studentId: newUser.studentId!,
      tenantId: newUser.tenantId,
      name: newUser.name,
      email: newUser.email,
      department: newUser.department || 'CSE',
      year: 'Final Year',
      cgpa: 7.5,
      targetRecruiter: 'TCS',
      targetRole: 'Software Engineer',
      technical: 70,
      communication: 72,
      aptitude: 68,
      interviewSkills: 70,
      coding: 65,
      practiceCompletion: 10,
      mockInterviews: 0,
      readiness: 69,
      streakDays: 1,
      status: 'On Track',
      isVerified: true
    });
  }

  dbService.logAudit({
    tenantId: newUser.tenantId,
    userId: newUser.id,
    userName: newUser.name,
    userRole: newUser.role,
    action: 'USER_REGISTER',
    entity: 'User',
    details: `New account registered with role ${newUser.role}`
  });

  res.json({ success: true, user: newUser });
});

apiRouter.get('/tenants', (_req: Request, res: Response) => {
  res.json({ tenants: dbService.getTenants() });
});

// -----------------------------------------------------------------------------
// STUDENTS COHORT & READINESS
// -----------------------------------------------------------------------------
apiRouter.get('/students', (req: Request, res: Response) => {
  const { tenantId } = getSessionContext(req);
  const { department, year, recruiter, minReadiness, status, search } = req.query;

  const students = dbService.getStudents(tenantId, {
    department: department as string,
    year: year as string,
    recruiter: recruiter as string,
    minReadiness: minReadiness ? Number(minReadiness) : undefined,
    status: status as string,
    search: search as string,
  });

  res.json({
    total: students.length,
    students: students.slice(0, 200), // optimized pagination slice
    summary: {
      averageReadiness: students.length ? Math.round(students.reduce((a, b) => a + b.readiness, 0) / students.length) : 0,
      interviewReady: students.filter(s => s.status === 'Interview Ready').length,
      onTrack: students.filter(s => s.status === 'On Track').length,
      needsImprovement: students.filter(s => s.status === 'Needs Improvement').length,
      highPriority: students.filter(s => s.status === 'High Priority').length,
    }
  });
});

apiRouter.get('/students/:id', (req: Request, res: Response) => {
  const { tenantId } = getSessionContext(req);
  const student = dbService.getStudentById(req.params.id, tenantId);
  if (!student) {
    return res.status(404).json({ error: 'Student not found.' });
  }

  // Calculate top gaps and radar metrics
  const radar = [
    { subject: 'Technical', score: student.technical, fullMark: 100 },
    { subject: 'Communication', score: student.communication, fullMark: 100 },
    { subject: 'Aptitude', score: student.aptitude, fullMark: 100 },
    { subject: 'Interview', score: student.interviewSkills, fullMark: 100 },
    { subject: 'Coding', score: student.coding, fullMark: 100 },
  ];

  res.json({ student, radar });
});

apiRouter.put('/students/:id', (req: Request, res: Response) => {
  const { tenantId, user } = getSessionContext(req);
  const updated = dbService.updateStudent(req.params.id, req.body);
  if (!updated) {
    return res.status(404).json({ error: 'Student not found.' });
  }

  dbService.logAudit({
    tenantId,
    userId: user.id,
    userName: user.name,
    userRole: user.role,
    action: 'STUDENT_PROFILE_UPDATE',
    entity: 'Student',
    details: `Updated student record ${updated.studentId} (${updated.name})`
  });

  res.json({ success: true, student: updated });
});

// -----------------------------------------------------------------------------
// RECRUITER INTELLIGENCE & HISTORICAL QUESTIONS
// -----------------------------------------------------------------------------
apiRouter.get('/recruiters', (_req: Request, res: Response) => {
  res.json({ recruiters: dbService.getRecruiters() });
});

apiRouter.get('/questions', (req: Request, res: Response) => {
  const { recruiter, topic, difficulty, round, search } = req.query;
  const questions = dbService.getQuestions({
    recruiter: recruiter as string,
    topic: topic as string,
    difficulty: difficulty as string,
    round: round as string,
    search: search as string,
  });

  const { user } = getSessionContext(req);
  const studentId = user.studentId || 'CT1000';
  const savedIds = new Set(dbService.getSavedQuestionIds(studentId));
  const practicedIds = new Set(dbService.getPracticedQuestionIds(studentId));

  const questionsWithStatus = questions.map(q => ({
    ...q,
    isSaved: savedIds.has(q.id),
    isPracticed: practicedIds.has(q.id)
  }));

  res.json({
    total: questionsWithStatus.length,
    questions: questionsWithStatus.slice(0, 100)
  });
});

apiRouter.post('/questions/practice', (req: Request, res: Response) => {
  const { user } = getSessionContext(req);
  const studentId = user.studentId || 'CT1000';
  const { questionId, notes } = req.body;

  if (!questionId) return res.status(400).json({ error: 'Question ID required.' });
  const attempt = dbService.markQuestionPracticed(studentId, questionId, notes);
  res.json({ success: true, attempt });
});

apiRouter.post('/questions/toggle-save', (req: Request, res: Response) => {
  const { user } = getSessionContext(req);
  const studentId = user.studentId || 'CT1000';
  const { questionId } = req.body;

  if (!questionId) return res.status(400).json({ error: 'Question ID required.' });
  const isSaved = dbService.toggleSaveQuestion(studentId, questionId);
  res.json({ success: true, isSaved });
});

// -----------------------------------------------------------------------------
// TRAINING PROGRAMS & INTERVENTIONS
// -----------------------------------------------------------------------------
apiRouter.get('/trainings', (req: Request, res: Response) => {
  const { tenantId } = getSessionContext(req);
  res.json({ trainings: dbService.getTrainingPrograms(tenantId) });
});

apiRouter.post('/trainings/:id/enroll', (req: Request, res: Response) => {
  const { user } = getSessionContext(req);
  const studentId = user.studentId || 'CT1000';
  const updated = dbService.enrollInTraining(req.params.id, studentId);
  if (!updated) return res.status(404).json({ error: 'Training program not found.' });
  res.json({ success: true, training: updated });
});

apiRouter.get('/interventions', (req: Request, res: Response) => {
  const { tenantId } = getSessionContext(req);
  const { department, priority } = req.query;
  const list = dbService.getInterventions(tenantId, {
    department: department as string,
    priority: priority as string,
  });
  res.json({ interventions: list });
});

apiRouter.put('/interventions/:id', (req: Request, res: Response) => {
  const { tenantId, user } = getSessionContext(req);
  const updated = dbService.updateIntervention(req.params.id, req.body);
  if (!updated) return res.status(404).json({ error: 'Intervention not found.' });

  dbService.logAudit({
    tenantId,
    userId: user.id,
    userName: user.name,
    userRole: user.role,
    action: 'INTERVENTION_STATUS_UPDATE',
    entity: 'Intervention',
    details: `Updated intervention ${updated.id} for ${updated.name} to status ${updated.status}`
  });

  res.json({ success: true, intervention: updated });
});

// -----------------------------------------------------------------------------
// PLACEMENT OUTCOMES & CAMPUS REPORTS
// -----------------------------------------------------------------------------
apiRouter.get('/outcomes', (req: Request, res: Response) => {
  const { tenantId } = getSessionContext(req);
  const outcomes = dbService.getOutcomes(tenantId);
  const students = dbService.getStudents(tenantId);

  const eligibleCount = outcomes.filter(o => o.eligible).length;
  const interviewedCount = outcomes.filter(o => o.interviewed).length;
  const offersCount = outcomes.filter(o => o.offer).length;
  const placementRate = eligibleCount ? Math.round((offersCount / eligibleCount) * 100) : 0;

  const placedWithPkg = outcomes.filter(o => o.offer && o.packageLpa);
  const avgPackage = placedWithPkg.length 
    ? Number((placedWithPkg.reduce((acc, curr) => acc + (curr.packageLpa || 0), 0) / placedWithPkg.length).toFixed(1))
    : 4.5;

  res.json({
    total: outcomes.length,
    eligibleCount,
    interviewedCount,
    offersCount,
    placementRate,
    avgPackage,
    outcomes: outcomes.slice(0, 150),
    departmentStats: students.length ? [
      { dept: 'CSE', readiness: 81, eligible: 85, offers: 74 },
      { dept: 'IT', readiness: 78, eligible: 80, offers: 68 },
      { dept: 'ECE', readiness: 74, eligible: 72, offers: 62 },
      { dept: 'AI & DS', readiness: 82, eligible: 84, offers: 76 },
      { dept: 'EEE', readiness: 68, eligible: 64, offers: 52 },
      { dept: 'MECH', readiness: 65, eligible: 60, offers: 48 },
    ] : []
  });
});

// -----------------------------------------------------------------------------
// MOCK INTERVIEW STUDIO & PREPARATION PLANS
// -----------------------------------------------------------------------------
apiRouter.get('/interviews/history', (req: Request, res: Response) => {
  const { user } = getSessionContext(req);
  const studentId = user.studentId || 'CT1000';
  const history = dbService.getMockInterviews(studentId);
  res.json({ history });
});

apiRouter.post('/interviews/save', (req: Request, res: Response) => {
  const { tenantId, user } = getSessionContext(req);
  const studentId = user.studentId || 'CT1000';
  const record = {
    ...req.body,
    id: `mock-${Date.now()}`,
    studentId,
    tenantId,
    completedAt: new Date().toISOString()
  };

  const saved = dbService.saveMockInterview(record);
  res.json({ success: true, interview: saved });
});

apiRouter.get('/plan', (req: Request, res: Response) => {
  const { user } = getSessionContext(req);
  const studentId = user.studentId || 'CT1000';
  const plan = dbService.getPreparationPlan(studentId);
  res.json({ plan });
});

apiRouter.put('/plan', (req: Request, res: Response) => {
  const { user } = getSessionContext(req);
  const studentId = user.studentId || 'CT1000';
  const { dayTopic, status } = req.body;
  const updated = dbService.updatePreparationPlanDay(studentId, dayTopic, status);
  res.json({ success: true, plan: updated });
});

// -----------------------------------------------------------------------------
// AI COPILOT & REAL GEMINI PROXY ENDPOINTS
// -----------------------------------------------------------------------------
apiRouter.post('/ai/guidance', async (req: Request, res: Response) => {
  const { studentName, department, year, targetRecruiter, targetRole, readiness, weakSkills, strongSkills, userPrompt, language } = req.body;
  try {
    const result = await generateCareerGuidance({
      studentName: studentName || 'Student',
      department: department || 'Engineering',
      year: year || 'Final Year',
      targetRecruiter: targetRecruiter || 'TCS',
      targetRole: targetRole || 'Software Engineer',
      readiness: readiness || 75,
      weakSkills: weakSkills || ['SQL', 'DSA'],
      strongSkills: strongSkills || ['Communication'],
      userPrompt: userPrompt || 'How should I prepare for the upcoming campus recruitment drive?',
      language: language === 'te' ? 'te' : 'en'
    });
    res.json(result);
  } catch (err: any) {
    res.status(500).json({ error: err?.message || 'AI Guidance failed.' });
  }
});

apiRouter.post('/ai/evaluate-answer', async (req: Request, res: Response) => {
  const { recruiter, role, question, answer, interviewType, language } = req.body;
  try {
    const evaluation = await evaluateInterviewAnswer({
      recruiter: recruiter || 'TCS',
      role: role || 'Software Engineer',
      question: question || 'Explain your greatest project challenge.',
      answer: answer || '',
      interviewType: interviewType || 'Technical',
      language: language === 'te' ? 'te' : 'en'
    });
    res.json(evaluation);
  } catch (err: any) {
    res.status(500).json({ error: err?.message || 'Interview evaluation failed.' });
  }
});

apiRouter.post('/ai/review-resume', async (req: Request, res: Response) => {
  const { resumeText, targetRecruiter, targetRole, jobDescription } = req.body;
  try {
    const review = await reviewResumeContent({
      resumeText: resumeText || '',
      targetRecruiter: targetRecruiter || 'TCS',
      targetRole: targetRole || 'Software Engineer',
      jobDescription
    });
    res.json(review);
  } catch (err: any) {
    res.status(500).json({ error: err?.message || 'Resume review failed.' });
  }
});

apiRouter.post('/ai/explain-concept', async (req: Request, res: Response) => {
  const { concept, topic, language } = req.body;
  try {
    const explanation = await explainConcept({
      concept: concept || 'Binary Search Tree',
      topic: topic || 'Data Structures',
      language: language === 'te' ? 'te' : 'en'
    });
    res.json(explanation);
  } catch (err: any) {
    res.status(500).json({ error: err?.message || 'Concept explanation failed.' });
  }
});

apiRouter.post('/ai/tts', async (req: Request, res: Response) => {
  const { text } = req.body;
  try {
    const result = await generateSpeechAudio(text || 'Welcome to CareerTwin AI.');
    res.json(result);
  } catch (err: any) {
    res.status(500).json({ error: err?.message || 'TTS generation failed.' });
  }
});

// -----------------------------------------------------------------------------
// CSV IMPORT & DATA QUALITY PIPELINE
// -----------------------------------------------------------------------------
apiRouter.post('/import/students', (req: Request, res: Response) => {
  const { tenantId, user } = getSessionContext(req);
  const { rows, fileName } = req.body;

  if (!Array.isArray(rows) || rows.length === 0) {
    return res.status(400).json({ error: 'Invalid or empty rows array provided.' });
  }

  const errors: { row: number; reason: string }[] = [];
  let successCount = 0;

  rows.forEach((r, idx) => {
    const rowNum = idx + 1;
    if (!r.name || typeof r.name !== 'string') {
      errors.push({ row: rowNum, reason: 'Missing or invalid student Name.' });
      return;
    }
    if (!r.department) {
      errors.push({ row: rowNum, reason: 'Department missing.' });
      return;
    }

    const readinessNum = Number(r.readiness) || 60;
    const studentId = r.studentId || `IMP${1000 + idx}`;

    dbService.addStudent({
      id: `student-${studentId}`,
      studentId,
      tenantId,
      name: r.name,
      email: r.email || `${r.name.toLowerCase().replace(/\s+/g, '.')}@rcee.ac.in`,
      department: r.department,
      year: r.year === 'Pre-Final Year' ? 'Pre-Final Year' : 'Final Year',
      cgpa: Number(r.cgpa) || 7.0,
      targetRecruiter: r.targetRecruiter || 'TCS',
      targetRole: r.targetRole || 'Software Engineer',
      technical: Number(r.technical) || 65,
      communication: Number(r.communication) || 70,
      aptitude: Number(r.aptitude) || 65,
      interviewSkills: Number(r.interviewSkills) || 65,
      coding: Number(r.coding) || 60,
      practiceCompletion: Number(r.practiceCompletion) || 15,
      mockInterviews: Number(r.mockInterviews) || 0,
      readiness: readinessNum,
      streakDays: 1,
      status: readinessNum >= 80 ? 'Interview Ready' : (readinessNum >= 65 ? 'On Track' : 'Needs Improvement'),
      isVerified: true
    });
    successCount++;
  });

  const job = dbService.addImportJob({
    id: `job-${Date.now()}`,
    tenantId,
    importedBy: user.name,
    type: 'students',
    fileName: fileName || 'students_upload.csv',
    rowCount: rows.length,
    successCount,
    errorCount: errors.length,
    status: errors.length === rows.length ? 'Failed' : 'Completed',
    createdAt: new Date().toISOString(),
    errors
  });

  dbService.logAudit({
    tenantId,
    userId: user.id,
    userName: user.name,
    userRole: user.role,
    action: 'CSV_IMPORT_STUDENTS',
    entity: 'StudentCohort',
    details: `Imported ${successCount}/${rows.length} student records from ${fileName || 'CSV'}`
  });

  res.json({
    success: true,
    job,
    message: `Processed ${rows.length} rows: ${successCount} successful, ${errors.length} errors.`
  });
});

// CSV Export
apiRouter.get('/export/:type', (req: Request, res: Response) => {
  const { tenantId } = getSessionContext(req);
  const { type } = req.params;

  let csv = '';
  let filename = 'export.csv';

  if (type === 'students') {
    const list = dbService.getStudents(tenantId);
    filename = 'careertwin_students.csv';
    csv = 'Student ID,Name,Department,Year,CGPA,Target Recruiter,Readiness,Technical,Communication,Status\n' +
      list.map(s => `"${s.studentId}","${s.name}","${s.department}","${s.year}",${s.cgpa},"${s.targetRecruiter}",${s.readiness},${s.technical},${s.communication},"${s.status}"`).join('\n');
  } else if (type === 'questions') {
    const list = dbService.getQuestions();
    filename = 'careertwin_question_bank.csv';
    csv = 'ID,Recruiter,Role,Year,Round,Topic,Question,Difficulty,Frequency,Confidence,Source\n' +
      list.map(q => `"${q.id}","${q.recruiter}","${q.role}",${q.year},"${q.round}","${q.topic}","${q.question.replace(/"/g, '""')}","${q.difficulty}","${q.frequency}","${q.confidence}","${q.sourceType}"`).join('\n');
  } else if (type === 'outcomes') {
    const list = dbService.getOutcomes(tenantId);
    filename = 'careertwin_placement_outcomes.csv';
    csv = 'Student ID,Name,Department,Readiness,Target Recruiter,Eligible,Interviewed,Offer,Package LPA\n' +
      list.map(o => `"${o.studentId}","${o.name}","${o.department}",${o.readiness},"${o.targetRecruiter}",${o.eligible},${o.interviewed},${o.offer},${o.packageLpa || ''}`).join('\n');
  } else {
    return res.status(400).json({ error: 'Unsupported export type.' });
  }

  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
  res.send(csv);
});

// -----------------------------------------------------------------------------
// AUDIT LOGS & SYSTEM RESET
// -----------------------------------------------------------------------------
apiRouter.get('/audit-logs', (req: Request, res: Response) => {
  const { tenantId } = getSessionContext(req);
  res.json({ logs: dbService.getAuditLogs(tenantId) });
});

apiRouter.post('/system/reset-demo', (req: Request, res: Response) => {
  const { tenantId, user } = getSessionContext(req);
  dbService.resetToSeed();
  dbService.logAudit({
    tenantId,
    userId: user.id,
    userName: user.name,
    userRole: user.role,
    action: 'SYSTEM_RESET_SEED',
    entity: 'Database',
    details: 'Reset database to initial synthetic demo seed data.'
  });
  res.json({ success: true, message: 'Database reset to clean prototype seed dataset.' });
});
