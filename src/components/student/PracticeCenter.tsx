import React, { useState, useEffect } from 'react';
import { Question } from '../../types';
import { StatusPill } from '../common/StatusPill';
import { useLanguage } from '../../context/LanguageContext';
import {
  Dumbbell,
  Search,
  Bookmark,
  CheckCircle,
  Sparkles,
  Volume2,
  VolumeX,
} from 'lucide-react';

export const PracticeCenter: React.FC = () => {
  const { language, speak, stopSpeaking, isSpeaking } = useLanguage();

  const [questions, setQuestions] = useState<Question[]>([]);
  const [search, setSearch] = useState('');
  const [selectedTopic, setSelectedTopic] = useState('All');
  const [selectedRecruiter, setSelectedRecruiter] = useState('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState('All');
  const [loading, setLoading] = useState(false);

  // Concept modal
  const [explainingQuestion, setExplainingQuestion] = useState<Question | null>(null);
  const [aiExplanation, setAiExplanation] = useState<string | null>(null);
  const [loadingAi, setLoadingAi] = useState(false);

  const fetchQuestions = () => {
    setLoading(true);
    const q = new URLSearchParams({
      ...(selectedTopic !== 'All' && { topic: selectedTopic }),
      ...(selectedRecruiter !== 'All' && { recruiter: selectedRecruiter }),
      ...(selectedDifficulty !== 'All' && { difficulty: selectedDifficulty }),
      ...(search.trim() && { search }),
    });

    fetch(`/api/questions?${q.toString()}`)
      .then(r => r.json())
      .then(d => {
        if (d.questions) setQuestions(d.questions);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchQuestions();
  }, [selectedTopic, selectedRecruiter, selectedDifficulty]);

  const handlePractice = async (qId: string) => {
    try {
      const res = await fetch('/api/questions/practice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ questionId: qId })
      });
      if (res.ok) {
        setQuestions(prev => prev.map(q => q.id === qId ? { ...q, isPracticed: true } : q));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleToggleSave = async (qId: string) => {
    try {
      const res = await fetch('/api/questions/toggle-save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ questionId: qId })
      });
      if (res.ok) {
        const data = await res.json();
        setQuestions(prev => prev.map(q => q.id === qId ? { ...q, isSaved: data.isSaved } : q));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleAskAiExplanation = async (q: Question) => {
    setExplainingQuestion(q);
    setLoadingAi(true);
    setAiExplanation(null);

    try {
      const res = await fetch('/api/ai/explain-concept', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          concept: q.question,
          topic: q.topic,
          language
        })
      });
      if (res.ok) {
        const data = await res.json();
        setAiExplanation(data.explanation);
      }
    } catch (err) {
      setAiExplanation('Unable to load AI explanation at this time.');
    } finally {
      setLoadingAi(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header & Section Progress */}
      <div className="bg-white border border-neutral-200 rounded-2xl p-5 shadow-2xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold text-neutral-900 flex items-center gap-2">
              <Dumbbell className="w-5 h-5 text-neutral-900" />
              Practice Center & Question Bank
            </h1>
            <p className="text-xs text-neutral-500 mt-1">
              Search and practice 220+ verified technical, aptitude, verbal, and interview questions.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-neutral-500 font-mono">
              {questions.length} questions available
            </span>
          </div>
        </div>

        {/* Filters Bar */}
        <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && fetchQuestions()}
              placeholder="Search keyword or question..."
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-neutral-50 border border-neutral-200 rounded-lg outline-none text-neutral-900 placeholder:text-neutral-400 focus:border-neutral-900"
            />
          </div>

          <select
            value={selectedTopic}
            onChange={e => setSelectedTopic(e.target.value)}
            className="px-3 py-1.5 text-xs bg-neutral-50 border border-neutral-200 rounded-lg text-neutral-700 outline-none"
          >
            <option value="All">All Topics</option>
            <option value="Data Structures & Algorithms">DSA</option>
            <option value="DBMS">DBMS</option>
            <option value="SQL">SQL</option>
            <option value="Operating Systems">Operating Systems</option>
            <option value="Computer Networks">Computer Networks</option>
            <option value="Object-Oriented Programming">OOP</option>
            <option value="Coding">Coding</option>
            <option value="Aptitude">Aptitude</option>
            <option value="HR">HR</option>
            <option value="Communication">Communication</option>
          </select>

          <select
            value={selectedRecruiter}
            onChange={e => setSelectedRecruiter(e.target.value)}
            className="px-3 py-1.5 text-xs bg-neutral-50 border border-neutral-200 rounded-lg text-neutral-700 outline-none"
          >
            <option value="All">All Recruiters</option>
            <option value="TCS">TCS</option>
            <option value="Infosys">Infosys</option>
            <option value="Wipro">Wipro</option>
            <option value="Accenture">Accenture</option>
            <option value="Cognizant">Cognizant</option>
            <option value="Deloitte">Deloitte</option>
            <option value="Zoho">Zoho</option>
          </select>

          <select
            value={selectedDifficulty}
            onChange={e => setSelectedDifficulty(e.target.value)}
            className="px-3 py-1.5 text-xs bg-neutral-50 border border-neutral-200 rounded-lg text-neutral-700 outline-none"
          >
            <option value="All">All Difficulties</option>
            <option value="Easy">Easy</option>
            <option value="Medium">Medium</option>
            <option value="Hard">Hard</option>
          </select>
        </div>
      </div>

      {/* Question Cards List */}
      <div className="space-y-3">
        {loading ? (
          <div className="p-12 text-center text-xs text-neutral-400">Loading questions...</div>
        ) : questions.length === 0 ? (
          <div className="p-12 text-center text-xs text-neutral-500 bg-white rounded-2xl border border-neutral-200">
            No questions matched your search criteria. Try broadening your filter.
          </div>
        ) : (
          questions.map(q => (
            <div
              key={q.id}
              className="bg-white border border-neutral-200 rounded-xl p-4 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div className="flex-1 space-y-1.5">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-mono text-[11px] font-bold text-neutral-400">{q.id}</span>
                  <StatusPill status={q.difficulty} size="sm" />
                  <StatusPill status={q.frequency + ' Frequency'} size="sm" />
                  {q.isPracticed && (
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700">
                      <CheckCircle className="w-3.5 h-3.5" />
                      Practiced
                    </span>
                  )}
                  {q.isSaved && (
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-neutral-800">
                      <Bookmark className="w-3.5 h-3.5 fill-current" />
                      Saved
                    </span>
                  )}
                </div>

                <div className="text-xs lg:text-sm font-bold text-neutral-900">
                  {q.question}
                </div>

                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-neutral-500">
                  <span>Topic: <strong className="text-neutral-800">{q.topic}</strong></span>
                  <span aria-hidden="true">·</span>
                  <span>Recruiter: <strong className="text-neutral-800">{q.recruiter}</strong></span>
                  <span aria-hidden="true">·</span>
                  <span>Round: <strong>{q.round}</strong></span>
                  <span aria-hidden="true">·</span>
                  <span>Source: {q.sourceType}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => handleAskAiExplanation(q)}
                  className="px-2.5 py-1.5 rounded-lg text-xs font-medium text-neutral-700 bg-neutral-100 hover:bg-neutral-200 border border-neutral-200 flex items-center gap-1 transition-colors"
                  title="Explain this question using Gemini"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>AI Explain</span>
                </button>

                <button
                  onClick={() => handleToggleSave(q.id)}
                  className={`p-1.5 rounded-lg text-xs border transition-colors ${
                    q.isSaved
                      ? 'bg-neutral-100 text-neutral-900 border-neutral-300'
                      : 'border-neutral-200 text-neutral-500 hover:text-neutral-800 bg-white'
                  }`}
                  title="Bookmark question"
                >
                  <Bookmark className="w-4 h-4" />
                </button>

                <button
                  onClick={() => handlePractice(q.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                    q.isPracticed
                      ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                      : 'bg-neutral-900 hover:bg-neutral-800 text-white shadow-2xs'
                  }`}
                >
                  {q.isPracticed ? 'Practiced ✓' : 'Practice Now'}
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* AI Concept Explanation Modal */}
      {explainingQuestion && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-900/40 backdrop-blur-2xs p-4">
          <div className="bg-white border border-neutral-200 rounded-2xl max-w-xl w-full p-6 shadow-xl space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-neutral-100 text-neutral-800 border border-neutral-200">
                  {explainingQuestion.topic} · {explainingQuestion.recruiter}
                </span>
                <h3 className="text-sm font-bold text-neutral-900 mt-1">
                  {explainingQuestion.question}
                </h3>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-neutral-50 border border-neutral-200 text-xs text-neutral-800 leading-relaxed whitespace-pre-line max-h-72 overflow-y-auto">
              {loadingAi ? (
                <div className="flex items-center gap-2 text-neutral-700">
                  <Sparkles className="w-4 h-4 animate-spin" />
                  <span>Generating bilingual concept explanation...</span>
                </div>
              ) : (
                aiExplanation || explainingQuestion.explanation || 'No solution recorded.'
              )}
            </div>

            <div className="flex items-center justify-between pt-2">
              <button
                onClick={() => {
                  if (aiExplanation) {
                    if (isSpeaking) stopSpeaking();
                    else speak(aiExplanation, language);
                  }
                }}
                className="flex items-center gap-1.5 text-xs font-semibold text-neutral-700 hover:text-neutral-900"
              >
                {isSpeaking ? <VolumeX className="w-4 h-4 text-rose-600" /> : <Volume2 className="w-4 h-4 text-neutral-700" />}
                <span>{isSpeaking ? 'Stop Audio' : 'Listen Explanation'}</span>
              </button>

              <button
                onClick={() => {
                  stopSpeaking();
                  setExplainingQuestion(null);
                }}
                className="px-4 py-2 bg-neutral-900 text-white rounded-lg text-xs font-semibold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
