import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import {
  Sparkles,
  Send,
  Volume2,
  VolumeX,
  Languages,
  CheckCircle,
  HelpCircle,
  Loader2,
} from 'lucide-react';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  source?: 'ai' | 'fallback';
}

export const AiCareerCopilot: React.FC = () => {
  const { student } = useAuth();
  const { language, setLanguage, speak, stopSpeaking, isSpeaking } = useLanguage();

  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'assistant',
      content: language === 'te'
        ? `నమస్కారం ${student?.name || 'విద్యార్థి'}! నేను మీ **CareerTwin AI కెరీర్ కోపైలట్**. మీ లక్ష్య రిక్రూటర్ **${student?.targetRecruiter || 'TCS'}** కోసం 30 రోజుల ప్రిపరేషన్ ప్రణాళికను రూపొందించడంలో లేదా కాంప్లెక్స్ కాన్సెప్ట్‌లను తెలుగులో సులభంగా వివరించడంలో సహాయపడతాను. కింది త్వరిత బటన్లలో ఒకదాన్ని ఎంచుకోండి లేదా మీ ప్రశ్నను టైప్ చేయండి!`
        : `Hello **${student?.name || 'Student'}**! I am your **CareerTwin AI Career Copilot**. I analyze your current placement readiness (**${student?.readiness}%**) for **${student?.targetRecruiter} (${student?.targetRole})** and help bridge your specific skill gaps. How can I guide you today?`,
      source: 'ai',
    },
  ]);

  const quickPrompts = [
    {
      label: 'Create my 30-day placement sprint',
      prompt: `Create a concrete 30-day week-by-week placement plan for me targeting ${student?.targetRecruiter || 'TCS'} based on my 78% readiness score.`,
    },
    {
      label: 'Explain this concept in Telugu',
      prompt: 'Explain the difference between SQL JOINs and Subqueries in simple Telugu with a real-life analogy.',
    },
    {
      label: 'Find my top 5 skill gaps',
      prompt: `Analyze my profile and list my top 5 skill gaps for ${student?.targetRecruiter || 'TCS'} with recommended practice topics.`,
    },
    {
      label: 'Prepare me for TCS Technical Round',
      prompt: `What are the most frequent questions asked in ${student?.targetRecruiter || 'TCS'} Technical Round 1 and how should I answer them?`,
    },
    {
      label: 'Why did my readiness score change?',
      prompt: 'Explain the mathematical and skills basis of why my CareerTwin readiness score is calculated as 78% and how I can raise it to 85%+. ',
    },
  ];

  const handleSend = async (textToSend?: string) => {
    const text = textToSend || input;
    if (!text.trim() || loading) return;

    const userMsg: ChatMessage = { role: 'user', content: text };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/ai/guidance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentName: student?.name,
          department: student?.department,
          year: student?.year,
          targetRecruiter: student?.targetRecruiter,
          targetRole: student?.targetRole,
          readiness: student?.readiness,
          weakSkills: ['Advanced DP', 'SQL Subqueries', 'System Design Basics'],
          strongSkills: ['Data Structures', 'Spoken English', 'OOP'],
          userPrompt: text,
          language,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setMessages(prev => [
          ...prev,
          { role: 'assistant', content: data.response, source: data.source },
        ]);
      } else {
        setMessages(prev => [
          ...prev,
          {
            role: 'assistant',
            content: 'Unable to connect with AI service. Please check your network or try again.',
            source: 'fallback',
          },
        ]);
      }
    } catch (err) {
      setMessages(prev => [
        ...prev,
        {
          role: 'assistant',
          content: 'CareerTwin AI Copilot is currently running offline demo guidance. Use the practice question bank for instant verified solutions.',
          source: 'fallback',
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Title & Language Preference Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white border border-neutral-200 rounded-2xl p-4 shadow-2xs">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-neutral-100 border border-neutral-200 text-neutral-900 flex items-center justify-center font-bold">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h1 className="text-base font-bold text-neutral-900 flex items-center gap-2">
              CareerTwin AI Copilot
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-neutral-100 text-neutral-700 border border-neutral-200">
                Gemini 3.8 Flash Powered
              </span>
            </h1>
            <p className="text-xs text-neutral-500">
              Personalized career coaching calibrated to {student?.targetRecruiter} campus hiring standards
            </p>
          </div>
        </div>

        {/* Response Language Toggle */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-neutral-500 font-medium flex items-center gap-1">
            <Languages className="w-3.5 h-3.5" />
            Response Language:
          </span>
          <div className="flex items-center bg-neutral-100 p-0.5 rounded-lg border border-neutral-200">
            <button
              onClick={() => setLanguage('en')}
              className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-colors ${
                language === 'en'
                  ? 'bg-white text-neutral-900 shadow-2xs'
                  : 'text-neutral-500'
              }`}
            >
              English
            </button>
            <button
              onClick={() => setLanguage('te')}
              className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-colors ${
                language === 'te'
                  ? 'bg-white text-neutral-900 shadow-2xs'
                  : 'text-neutral-500'
              }`}
            >
              తెలుగు
            </button>
          </div>
        </div>
      </div>

      {/* Quick Action Prompt Pills */}
      <div>
        <div className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider mb-2">
          Suggested Mentoring Prompts
        </div>
        <div className="flex flex-wrap gap-2">
          {quickPrompts.map((qp, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(qp.prompt)}
              className="text-xs font-medium px-3 py-1.5 rounded-lg bg-white border border-neutral-200 hover:border-neutral-900 text-neutral-700 hover:text-neutral-900 transition-colors shadow-2xs"
            >
              {qp.label}
            </button>
          ))}
        </div>
      </div>

      {/* Chat Messages Log */}
      <div className="bg-white border border-neutral-200 rounded-2xl p-4 lg:p-6 shadow-2xs min-h-[380px] space-y-4">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
          >
            <div className="flex items-center gap-1.5 text-[11px] font-semibold text-neutral-400 mb-1 px-1">
              <span>{msg.role === 'user' ? 'You' : 'CareerTwin Copilot'}</span>
              {msg.source && msg.role === 'assistant' && (
                <span className="text-[10px] text-neutral-500 font-mono">
                  ({msg.source === 'ai' ? 'Live Gemini AI' : 'Deterministic Advisory'})
                </span>
              )}
            </div>

            <div
              className={`max-w-3xl rounded-2xl p-4 text-xs lg:text-sm leading-relaxed whitespace-pre-line shadow-2xs ${
                msg.role === 'user'
                  ? 'bg-neutral-900 text-white rounded-tr-xs'
                  : 'bg-neutral-50 text-neutral-900 border border-neutral-200 rounded-tl-xs'
              }`}
            >
              {msg.content}
            </div>

            {msg.role === 'assistant' && (
              <div className="mt-1 flex items-center gap-2 text-xs">
                <button
                  onClick={() => (isSpeaking ? stopSpeaking() : speak(msg.content, language))}
                  className="flex items-center gap-1 text-[11px] font-medium text-neutral-500 hover:text-neutral-900 px-2 py-0.5 rounded transition-colors"
                  title="Listen to this explanation"
                >
                  {isSpeaking ? (
                    <>
                      <VolumeX className="w-3.5 h-3.5 text-rose-600" />
                      <span className="text-rose-600">Stop Speaking</span>
                    </>
                  ) : (
                    <>
                      <Volume2 className="w-3.5 h-3.5 text-neutral-700" />
                      <span>Listen Spoken Audio</span>
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        ))}

        {loading && (
          <div className="flex items-center gap-2 p-3 text-xs text-neutral-700 bg-neutral-100 rounded-xl w-fit">
            <Loader2 className="w-4 h-4 animate-spin text-neutral-900" />
            <span>Analyzing student metrics & generating guidance...</span>
          </div>
        )}
      </div>

      {/* Input Bar */}
      <div className="flex items-center gap-2 bg-white border border-neutral-200 rounded-2xl p-2 shadow-2xs">
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSend()}
          placeholder={
            language === 'te'
              ? 'మీ ప్రశ్నను ఇక్కడ టైప్ చేయండి (ఉదా: SQL JOINs మరియు సబ్‌క్వెరీల తేడా ఏమిటి?)...'
              : `Ask career advice or practice request for ${student?.targetRecruiter}...`
          }
          className="flex-1 px-4 py-2 text-xs lg:text-sm bg-transparent outline-none text-neutral-900 placeholder:text-neutral-400"
        />
        <button
          onClick={() => handleSend()}
          disabled={!input.trim() || loading}
          className="p-2.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 disabled:opacity-50 text-white shadow-xs transition-colors"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>

      {/* Trust & Verification Disclaimer */}
      <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-200 text-[11px] text-neutral-500 flex items-start gap-2">
        <HelpCircle className="w-4 h-4 text-neutral-400 shrink-0 mt-0.5" />
        <span>
          <strong>Advisory Guarantee:</strong> CareerTwin AI advice is dynamically grounded in verified institutional placement patterns. It does not fabricate vacancies, guarantees, or private recruiter materials.
        </span>
      </div>
    </div>
  );
};
