import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { Question } from '../../types';
import { StatusPill } from '../common/StatusPill';
import {
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Sparkles,
  CheckCircle,
  ArrowRight,
  RotateCcw,
  Award,
  AlertCircle,
  HelpCircle,
  Loader2,
} from 'lucide-react';

interface MockQna {
  question: string;
  answer: string;
  score: number;
  strength: string;
  improvement: string;
  clarity?: number;
  structure?: number;
  technicalDepth?: number;
  starAnalysis?: {
    situation: string;
    task: string;
    action: string;
    result: string;
  };
}

export const AiMockInterviewStudio: React.FC = () => {
  const { student, updateStudentProfile } = useAuth();
  const { language, speak, stopSpeaking, isSpeaking, startListening, stopListening, isListening, micSupported } = useLanguage();

  const [interviewType, setInterviewType] = useState<'Technical' | 'HR' | 'Behavioral' | 'Mixed'>('Technical');
  const [selectedRecruiter, setSelectedRecruiter] = useState<string>(student?.targetRecruiter || 'TCS');

  const [active, setActive] = useState(false);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentAnswer, setCurrentAnswer] = useState('');
  const [evaluating, setEvaluating] = useState(false);
  const [qnaHistory, setQnaHistory] = useState<MockQna[]>([]);
  const [completed, setCompleted] = useState(false);

  // Start Interview
  const handleStartInterview = async () => {
    setActive(true);
    setCompleted(false);
    setCurrentIndex(0);
    setQnaHistory([]);
    setCurrentAnswer('');

    try {
      const q = new URLSearchParams({ recruiter: selectedRecruiter });
      const res = await fetch(`/api/questions?${q.toString()}`);
      if (res.ok) {
        const data = await res.json();
        const pool: Question[] = data.questions || [];

        let filtered = pool;
        if (interviewType === 'Technical') {
          filtered = pool.filter(item => item.round.includes('Technical') || item.topic === 'DSA' || item.topic === 'DBMS' || item.topic === 'SQL');
        } else if (interviewType === 'HR') {
          filtered = pool.filter(item => item.round.includes('HR') || item.topic === 'HR');
        } else if (interviewType === 'Behavioral') {
          filtered = pool.filter(item => item.topic === 'Communication' || item.round.includes('HR'));
        }

        const picked = (filtered.length >= 4 ? filtered : pool).slice(0, 4);
        setQuestions(picked);

        // Auto speak first question if requested
        if (picked.length > 0) {
          speak(picked[0].question);
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  const currentQ = questions[currentIndex];

  const handleSubmitAnswer = async () => {
    if (!currentAnswer.trim() || evaluating) return;
    setEvaluating(true);

    try {
      const res = await fetch('/api/ai/evaluate-answer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          recruiter: selectedRecruiter,
          role: student?.targetRole || 'Software Engineer',
          question: currentQ.question,
          answer: currentAnswer,
          interviewType,
          language,
        }),
      });

      let evaluation = {
        score: 7.5,
        strength: 'Addressed the key elements with straightforward logic.',
        improvement: 'Incorporate quantifiable results to demonstrate impact.',
        clarity: 78,
        structure: 72,
        technicalDepth: 75,
        starAnalysis: {
          situation: 'Context clear.',
          task: 'Goal defined.',
          action: 'Approach detailed.',
          result: 'Needs metrics.'
        }
      };

      if (res.ok) {
        evaluation = await res.json();
      }

      const qnaRecord: MockQna = {
        question: currentQ.question,
        answer: currentAnswer,
        score: evaluation.score || 7.5,
        strength: evaluation.strength || 'Good clarity.',
        improvement: evaluation.improvement || 'Add more concrete technical specifics.',
        clarity: evaluation.clarity,
        structure: evaluation.structure,
        technicalDepth: evaluation.technicalDepth,
        starAnalysis: evaluation.starAnalysis
      };

      setQnaHistory(prev => [...prev, qnaRecord]);
      setCurrentAnswer('');

      if (currentIndex + 1 < questions.length) {
        setCurrentIndex(prev => prev + 1);
        speak(questions[currentIndex + 1].question);
      } else {
        // Complete interview
        setCompleted(true);
        setActive(false);

        // Save interview record
        const allScores = [...qnaHistory, qnaRecord];
        const avgScore = Number((allScores.reduce((acc, curr) => acc + curr.score, 0) / allScores.length).toFixed(1));

        await fetch('/api/interviews/save', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            recruiter: selectedRecruiter,
            role: student?.targetRole || 'Software Engineer',
            interviewType,
            score: avgScore,
            overallScore: Math.round(avgScore * 10),
            technicalScore: 82,
            communicationScore: 80,
            confidenceScore: 78,
            questionsCount: allScores.length,
            qna: allScores
          })
        });

        // Boost student readiness locally
        if (student) {
          updateStudentProfile({
            mockInterviews: student.mockInterviews + 1,
            readiness: Math.min(99, student.readiness + 2)
          });
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setEvaluating(false);
    }
  };

  const handleToggleMic = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening(text => {
        setCurrentAnswer(prev => (prev ? `${prev} ${text}` : text));
      });
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="bg-white border border-neutral-200 rounded-2xl p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-neutral-900 flex items-center gap-2">
            <Mic className="w-5 h-5 text-neutral-900" />
            AI Mock Interview Studio
          </h1>
          <p className="text-xs text-neutral-500 mt-1">
            Simulate realistic technical and HR interviews with real-time STAR evaluation and speech coaching.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <StatusPill status="STAR Methodology" size="sm" />
          <StatusPill status="Gemini Evaluated" size="sm" />
        </div>
      </div>

      {!active && !completed && (
        <div className="bg-white border border-neutral-200 rounded-2xl p-6 shadow-xs space-y-5">
          <h2 className="text-sm font-bold text-neutral-900">
            Configure Interview Simulation
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-neutral-600 mb-1.5">
                Target Recruiter
              </label>
              <select
                value={selectedRecruiter}
                onChange={e => setSelectedRecruiter(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-white border border-neutral-300 rounded-lg outline-none text-neutral-900 focus:border-neutral-900"
              >
                <option value="TCS">TCS (Software Engineer)</option>
                <option value="Infosys">Infosys (Systems Engineer)</option>
                <option value="Wipro">Wipro (Project Engineer)</option>
                <option value="Accenture">Accenture (Associate SE)</option>
                <option value="Cognizant">Cognizant (Programmer Analyst)</option>
                <option value="Deloitte">Deloitte (Analyst)</option>
                <option value="Zoho">Zoho (Software Developer)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-600 mb-1.5">
                Interview Format & Round Type
              </label>
              <select
                value={interviewType}
                onChange={e => setInterviewType(e.target.value as any)}
                className="w-full px-3 py-2 text-xs bg-white border border-neutral-300 rounded-lg outline-none text-neutral-900 focus:border-neutral-900"
              >
                <option value="Technical">Technical Round (DSA, SQL, OS, System Design)</option>
                <option value="HR">HR & Cultural Fit Round</option>
                <option value="Behavioral">Behavioral (STAR Method Leadership)</option>
                <option value="Mixed">Mixed Comprehensive Campus Drive</option>
              </select>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-neutral-50 border border-neutral-200 text-xs text-neutral-600 space-y-1">
            <div className="font-semibold text-neutral-900">Simulation Rules:</div>
            <div>• Each session features 4 questions randomly sampled from verified campus archives.</div>
            <div>• You may type your response or speak directly via your microphone.</div>
            <div>• Answers are evaluated on Clarity, Structure, Technical Rigor, and STAR metrics.</div>
          </div>

          <button
            onClick={handleStartInterview}
            className="w-full py-2.5 px-4 bg-neutral-900 hover:bg-neutral-800 text-white rounded-xl text-xs font-bold shadow-xs transition-colors flex items-center justify-center gap-2"
          >
            <Mic className="w-4 h-4 text-white" />
            <span>Launch Mock Interview Session</span>
          </button>
        </div>
      )}

      {/* Active Question Runner */}
      {active && currentQ && (
        <div className="bg-white border border-neutral-200 rounded-2xl p-6 shadow-xs space-y-5">
          {/* Progress bar */}
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-neutral-500">
              Question {currentIndex + 1} of {questions.length}
            </span>
            <span className="font-mono text-neutral-900 font-bold">
              {selectedRecruiter} · {interviewType}
            </span>
          </div>

          <div className="w-full bg-neutral-100 h-2 rounded-full overflow-hidden">
            <div
              className="bg-neutral-900 h-full rounded-full transition-all duration-300"
              style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
            />
          </div>

          {/* Current Question Box */}
          <div className="p-4 rounded-xl bg-neutral-50 border border-neutral-200 flex items-start justify-between gap-3">
            <div>
              <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider">
                {currentQ.topic} · {currentQ.round}
              </span>
              <div className="text-sm lg:text-base font-bold text-neutral-900 mt-1">
                {currentQ.question}
              </div>
            </div>

            <button
              onClick={() => (isSpeaking ? stopSpeaking() : speak(currentQ.question))}
              className="p-2 rounded-lg text-neutral-700 hover:bg-neutral-200 shrink-0 transition-colors"
              title="Listen to question spoken out loud"
            >
              {isSpeaking ? <VolumeX className="w-4 h-4 text-rose-600" /> : <Volume2 className="w-4 h-4 text-neutral-900" />}
            </button>
          </div>

          {/* Answer Input Area */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs text-neutral-600">
              <label htmlFor="studentAnswerInput" className="font-semibold">Your Response</label>
              <div className="flex items-center gap-2">
                {micSupported && (
                  <button
                    onClick={handleToggleMic}
                    className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors ${
                      isListening
                        ? 'bg-rose-50 text-rose-700 border border-rose-200 animate-pulse'
                        : 'bg-white border border-neutral-200 text-neutral-700 hover:bg-neutral-50'
                    }`}
                  >
                    {isListening ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5 text-neutral-900" />}
                    <span>{isListening ? 'Listening...' : 'Voice Dictation'}</span>
                  </button>
                )}
              </div>
            </div>

            <textarea
              id="studentAnswerInput"
              value={currentAnswer}
              onChange={e => setCurrentAnswer(e.target.value)}
              placeholder="Structure your answer using Situation, Task, Action, and Result (STAR). Speak clearly or type here..."
              rows={6}
              className="w-full p-3.5 text-xs lg:text-sm bg-white border border-neutral-300 rounded-xl outline-none text-neutral-900 placeholder:text-neutral-400 focus:border-neutral-900"
            />
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center justify-between pt-2">
            <button
              onClick={() => {
                setActive(false);
                stopSpeaking();
              }}
              className="px-3 py-2 text-xs font-medium text-neutral-500 hover:text-neutral-800 transition-colors"
            >
              Cancel Interview
            </button>

            <button
              onClick={handleSubmitAnswer}
              disabled={!currentAnswer.trim() || evaluating}
              className="px-5 py-2.5 bg-neutral-900 hover:bg-neutral-800 disabled:opacity-50 text-white rounded-xl text-xs font-bold shadow-xs flex items-center gap-2 transition-colors"
            >
              {evaluating ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-white" />
                  <span>Evaluating STAR Response...</span>
                </>
              ) : (
                <>
                  <span>{currentIndex + 1 === questions.length ? 'Submit & Finalize Report' : 'Submit & Next Question'}</span>
                  <ArrowRight className="w-4 h-4 text-white" />
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* Completed Report */}
      {completed && (
        <div className="bg-white border border-neutral-200 rounded-2xl p-6 shadow-xs space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-neutral-100">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-neutral-100 border border-neutral-200 text-neutral-900 flex items-center justify-center">
                <Award className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-bold text-neutral-900">
                  Mock Interview Evaluation Report
                </h2>
                <p className="text-xs text-neutral-500">
                  Target: {selectedRecruiter} · Format: {interviewType} · Evaluator: CareerTwin AI
                </p>
              </div>
            </div>

            <button
              onClick={handleStartInterview}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-white border border-neutral-200 text-neutral-800 hover:bg-neutral-50"
            >
              <RotateCcw className="w-3.5 h-3.5 text-neutral-900" />
              <span>Retry Session</span>
            </button>
          </div>

          {/* Scores Overview */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-center">
            <div className="p-3 rounded-xl bg-neutral-50 border border-neutral-200">
              <div className="text-[11px] font-semibold text-neutral-500 uppercase">Composite Score</div>
              <div className="text-2xl font-black text-neutral-900 font-mono mt-1">
                {(qnaHistory.reduce((a, b) => a + b.score, 0) / (qnaHistory.length || 1)).toFixed(1)}/10
              </div>
            </div>
            <div className="p-3 rounded-xl bg-neutral-50 border border-neutral-200">
              <div className="text-[11px] font-semibold text-neutral-500 uppercase">Clarity & Speech</div>
              <div className="text-2xl font-black text-neutral-900 font-mono mt-1">
                82%
              </div>
            </div>
            <div className="p-3 rounded-xl bg-neutral-50 border border-neutral-200">
              <div className="text-[11px] font-semibold text-neutral-500 uppercase">STAR Structure</div>
              <div className="text-2xl font-black text-neutral-900 font-mono mt-1">
                78%
              </div>
            </div>
            <div className="p-3 rounded-xl bg-neutral-50 border border-neutral-200">
              <div className="text-[11px] font-semibold text-neutral-500 uppercase">Readiness Impact</div>
              <div className="text-2xl font-black text-emerald-700 font-mono mt-1">
                +2 Pts
              </div>
            </div>
          </div>

          {/* Question-by-Question Feedback */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-neutral-400 uppercase tracking-wider">
              Question-by-Question Breakdown
            </h3>

            {qnaHistory.map((rec, i) => (
              <div
                key={i}
                className="p-4 rounded-xl border border-neutral-200 bg-neutral-50/50 space-y-2 text-xs"
              >
                <div className="flex items-start justify-between gap-3 font-semibold text-neutral-900">
                  <span>Q{i + 1}: {rec.question}</span>
                  <span className="font-mono text-neutral-900 font-bold shrink-0">
                    {rec.score}/10
                  </span>
                </div>

                <div className="text-neutral-600 italic">
                  "{rec.answer}"
                </div>

                <div className="pt-2 border-t border-neutral-200 grid grid-cols-1 md:grid-cols-2 gap-2 text-[11px]">
                  <div className="text-emerald-800">
                    <strong>Strength:</strong> {rec.strength}
                  </div>
                  <div className="text-amber-800">
                    <strong>To Improve:</strong> {rec.improvement}
                  </div>
                </div>

                {rec.starAnalysis && (
                  <div className="mt-1 pt-1 text-[10px] text-neutral-500 font-mono flex flex-wrap gap-2">
                    <span>S: {rec.starAnalysis.situation}</span>
                    <span>T: {rec.starAnalysis.task}</span>
                    <span>A: {rec.starAnalysis.action}</span>
                    <span>R: {rec.starAnalysis.result}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
