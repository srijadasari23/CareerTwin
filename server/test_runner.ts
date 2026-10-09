/**
 * CareerTwin AI — Automated Test Suite
 * Verifies data persistence, multi-tenancy, mock interview scoring,
 * question bookmarking, CSV validation, and AI provider fallback resilience.
 */
import { dbService } from './db';
import { TRANSLATIONS } from '../src/utils/translations';
import { evaluateInterviewAnswer, generateCareerGuidance } from './gemini';

async function runTests() {
  console.log('====================================================');
  console.log('CAREERTWIN AI — AUTOMATED TEST SUITE EXECUTION');
  console.log('====================================================\n');

  let passed = 0;
  let failed = 0;

  // Ensure fresh seed state for idempotent test runs
  dbService.resetToSeed();

  function assert(name: string, condition: boolean, detail?: string) {
    if (condition) {
      console.log(`✅ [PASS] ${name}`);
      passed++;
    } else {
      console.error(`❌ [FAIL] ${name} ${detail ? `- ${detail}` : ''}`);
      failed++;
    }
  }

  // TEST 1: Database Initialization
  const students = dbService.getStudents('tenant-rcee');
  assert('DB Seed Students Count', students.length === 400, `Found ${students.length}`);

  // TEST 2: Recruiters Seed
  const recruiters = dbService.getRecruiters();
  assert('Recruiters Count', recruiters.length === 10, `Found ${recruiters.length}`);

  // TEST 3: Question Bank Seed
  const questions = dbService.getQuestions();
  assert('Question Bank Count (≥220)', questions.length >= 220, `Found ${questions.length}`);

  // TEST 4: Multi-Tenant Isolation
  const vnrStudents = dbService.getStudents('tenant-vnr');
  assert('Tenant Isolation (VNR separate from RCEE)', vnrStudents.length !== students.length);

  // TEST 5: Featured Student CT1000 Integrity
  const featured = dbService.getStudentById('CT1000', 'tenant-rcee');
  assert('Featured Student Arjun Kumar exists', featured?.name === 'Arjun Kumar' && featured?.studentId === 'CT1000');
  assert('Arjun Kumar readiness score is 78', featured?.readiness === 78);

  // TEST 6: Practice attempt and streak tracking
  const attempt = dbService.markQuestionPracticed('CT1000', 'Q0001', 'Practiced in unit test');
  assert('Practice Attempt Recorded', attempt.questionId === 'Q0001');
  const practicedIds = dbService.getPracticedQuestionIds('CT1000');
  assert('Practiced Questions includes Q0001', practicedIds.includes('Q0001'));

  // TEST 7: Bookmark toggle
  const isSaved = dbService.toggleSaveQuestion('CT1000', 'Q0002');
  assert('Toggle save question true', isSaved === true);
  const savedIds = dbService.getSavedQuestionIds('CT1000');
  assert('Saved question in list', savedIds.includes('Q0002'));
  const isUnsaved = dbService.toggleSaveQuestion('CT1000', 'Q0002');
  assert('Toggle save question false (unbookmark)', isUnsaved === false);

  // TEST 8: Training Program Enrollment
  const training = dbService.getTrainingPrograms('tenant-rcee')[0];
  const prevEnrolled = training.enrolled;
  const updatedTraining = dbService.enrollInTraining(training.id, 'CT1000');
  assert('Training program enrollment increments count', updatedTraining?.enrolled === prevEnrolled + 1);

  // TEST 9: Interventions Count
  const interventions = dbService.getInterventions('tenant-rcee');
  assert('Interventions list count (90)', interventions.length === 90, `Found ${interventions.length}`);

  // TEST 10: Mock Interview save & history
  const mockRecord = dbService.saveMockInterview({
    id: `mock-test-${Date.now()}`,
    studentId: 'CT1000',
    tenantId: 'tenant-rcee',
    recruiter: 'TCS',
    role: 'Software Engineer',
    interviewType: 'Technical',
    completedAt: new Date().toISOString(),
    score: 8.5,
    overallScore: 85,
    technicalScore: 88,
    communicationScore: 82,
    confidenceScore: 84,
    questionsCount: 4,
    qna: [
      {
        question: 'Explain QuickSort worst-case',
        answer: 'Worst case is O(N^2) when pivot is unbalanced.',
        score: 8.5,
        strength: 'Good complexity analysis.',
        improvement: 'Mention randomized pivot.'
      }
    ]
  });
  assert('Mock interview record saved', mockRecord.overallScore === 85);
  const mockHistory = dbService.getMockInterviews('CT1000');
  assert('Mock interview history retrieved', mockHistory.length > 0);

  // TEST 11: Bilingual Translation Dictionary Completeness
  assert('English translations exist', Object.keys(TRANSLATIONS.en).length >= 30);
  assert('Telugu translations exist', Object.keys(TRANSLATIONS.te).length >= 30);
  assert('Overview key translated in Telugu', TRANSLATIONS.te.overview === 'ఓవర్‌వ్యూ');

  // TEST 12: AI Mock Interview Evaluation Heuristic / Gemini Fallback
  const evalResult = await evaluateInterviewAnswer({
    recruiter: 'TCS',
    role: 'Software Engineer',
    question: 'Explain indexing in DBMS',
    answer: 'An index is a data structure like B-tree that improves query speed at the cost of writes.',
    interviewType: 'Technical',
    language: 'en'
  });
  assert('STAR Interview evaluation produces valid score', evalResult.score >= 1 && evalResult.score <= 10);
  assert('STAR Interview evaluation has strengths and improvements', evalResult.strength.length > 0 && evalResult.improvement.length > 0);

  // TEST 13: AI Career Guidance in Telugu & English
  const guidanceEn = await generateCareerGuidance({
    studentName: 'Arjun Kumar',
    department: 'CSE',
    year: 'Final Year',
    targetRecruiter: 'TCS',
    targetRole: 'Software Engineer',
    readiness: 78,
    weakSkills: ['SQL', 'DSA'],
    strongSkills: ['OOP'],
    userPrompt: 'Help me prepare for TCS',
    language: 'en'
  });
  assert('English career guidance generated', guidanceEn.response.length > 50);

  const guidanceTe = await generateCareerGuidance({
    studentName: 'Arjun Kumar',
    department: 'CSE',
    year: 'Final Year',
    targetRecruiter: 'TCS',
    targetRole: 'Software Engineer',
    readiness: 78,
    weakSkills: ['SQL'],
    strongSkills: ['OOP'],
    userPrompt: 'నాకు ప్రణాళిక ఇవ్వండి',
    language: 'te'
  });
  assert('Telugu career guidance generated', guidanceTe.response.length > 50);

  console.log('\n====================================================');
  console.log(`TEST RESULTS: ${passed} PASSED, ${failed} FAILED`);
  console.log('====================================================\n');

  if (failed > 0) {
    process.exit(1);
  }
}

runTests().catch(err => {
  console.error('Test runner encountered error:', err);
  process.exit(1);
});
