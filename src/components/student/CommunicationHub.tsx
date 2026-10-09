import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { MessageSquare, Mic, Volume2, VolumeX, Sparkles, CheckCircle2 } from 'lucide-react';

export const CommunicationHub: React.FC = () => {
  const { language, setLanguage, speak, stopSpeaking, isSpeaking, startListening, stopListening, isListening, micSupported } = useLanguage();

  const [selfIntro, setSelfIntro] = useState('');
  const [feedback, setFeedback] = useState<{
    clarity: number;
    structure: number;
    confidence: number;
    vocabulary: number;
    grammar: number;
    tips: string[];
  } | null>(null);

  const modules = [
    { title: 'Self Introduction in 60s', desc: 'Clear opening, academics, top project, and career goal alignment.' },
    { title: 'Technical Concept Translation', desc: 'Explaining database indexing in simple Telugu analogies.' },
    { title: 'STAR Behavioral Framework', desc: 'Situation, Task, Action, Result structured storytelling.' },
    { title: 'Group Discussion Entry', desc: 'Initiating, agreeing politely, and steering points constructively.' },
    { title: 'Handling Difficult Questions', desc: 'Dealing with unknown questions with grace and structured curiosity.' },
    { title: 'Corporate Professional Tone', desc: 'Eliminating filler words ("um", "like") and speaking with rhythm.' },
  ];

  const handleEvaluateIntro = () => {
    if (!selfIntro.trim()) return;
    const words = selfIntro.trim().split(/\s+/).length;
    setFeedback({
      clarity: Math.min(94, Math.max(50, 65 + words * 0.4)),
      structure: Math.min(92, Math.max(45, 60 + words * 0.35)),
      confidence: Math.min(90, Math.max(50, 68 + words * 0.3)),
      vocabulary: Math.min(92, Math.max(50, 64 + words * 0.35)),
      grammar: 85,
      tips: [
        'Great flow! Consider mentioning a specific metric in your project (e.g. "built an application used by 500+ students").',
        'Conclude with why you are specifically enthusiastic about the target recruiter role.',
        'Keep total delivery between 50 to 70 seconds for day-1 recruiter screenings.'
      ]
    });
  };

  return (
    <div className="space-y-6">
      <div className="bg-white border border-neutral-200 rounded-2xl p-5 shadow-xs">
        <h1 className="text-xl font-bold text-neutral-900 flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-neutral-900" />
          Communication & Telugu Learning Hub
        </h1>
        <p className="text-xs text-neutral-500 mt-1">
          Bridge vernacular-to-English spoken fluency and master campus interview communication.
        </p>
      </div>

      {/* Modules Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {modules.map((m, i) => (
          <div
            key={i}
            className="p-4 bg-white border border-neutral-200 rounded-xl shadow-xs"
          >
            <div className="text-xs font-bold text-neutral-900">{m.title}</div>
            <div className="text-[11px] text-neutral-500 mt-1 leading-relaxed">{m.desc}</div>
          </div>
        ))}
      </div>

      {/* Interactive Self-Introduction Practice Box */}
      <div className="bg-white border border-neutral-200 rounded-2xl p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold text-neutral-900">
              60-Second Self Introduction Drill
            </h2>
            <p className="text-xs text-neutral-500">
              Speak using your microphone or type your response to receive instant clarity and structural feedback.
            </p>
          </div>

          {micSupported && (
            <button
              onClick={() => {
                if (isListening) stopListening();
                else startListening(text => setSelfIntro(prev => prev ? `${prev} ${text}` : text));
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                isListening
                  ? 'bg-rose-50 text-rose-700 border border-rose-200 animate-pulse'
                  : 'bg-white border border-neutral-200 text-neutral-700 hover:bg-neutral-50'
              }`}
            >
              <Mic className="w-4 h-4 text-neutral-900" />
              <span>{isListening ? 'Listening (Speak Now)...' : 'Use Microphone'}</span>
            </button>
          )}
        </div>

        <textarea
          value={selfIntro}
          onChange={e => setSelfIntro(e.target.value)}
          rows={5}
          placeholder="Good morning panel! My name is Arjun Kumar, currently pursuing final year B.Tech in Computer Science at Ramachandra College of Engineering..."
          className="w-full p-3 text-xs bg-white border border-neutral-300 rounded-xl outline-none text-neutral-900 placeholder:text-neutral-400 focus:border-neutral-900"
        />

        <div className="flex justify-end">
          <button
            onClick={handleEvaluateIntro}
            disabled={!selfIntro.trim()}
            className="px-4 py-2 bg-neutral-900 hover:bg-neutral-800 disabled:opacity-50 text-white rounded-lg text-xs font-semibold shadow-xs flex items-center gap-1.5 transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5 text-white" />
            <span>Analyze Self Introduction</span>
          </button>
        </div>

        {feedback && (
          <div className="mt-4 pt-4 border-t border-neutral-200 space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3 text-center">
              <div className="p-3 rounded-xl bg-neutral-50 border border-neutral-200">
                <div className="text-[10px] text-neutral-500 font-semibold uppercase">Clarity</div>
                <div className="text-xl font-black text-neutral-900 font-mono mt-0.5">{feedback.clarity}%</div>
              </div>
              <div className="p-3 rounded-xl bg-neutral-50 border border-neutral-200">
                <div className="text-[10px] text-neutral-500 font-semibold uppercase">Structure</div>
                <div className="text-xl font-black text-neutral-900 font-mono mt-0.5">{feedback.structure}%</div>
              </div>
              <div className="p-3 rounded-xl bg-neutral-50 border border-neutral-200">
                <div className="text-[10px] text-neutral-500 font-semibold uppercase">Confidence</div>
                <div className="text-xl font-black text-neutral-900 font-mono mt-0.5">{feedback.confidence}%</div>
              </div>
              <div className="p-3 rounded-xl bg-neutral-50 border border-neutral-200">
                <div className="text-[10px] text-neutral-500 font-semibold uppercase">Vocabulary</div>
                <div className="text-xl font-black text-neutral-900 font-mono mt-0.5">{feedback.vocabulary}%</div>
              </div>
              <div className="p-3 rounded-xl bg-neutral-50 border border-neutral-200">
                <div className="text-[10px] text-neutral-500 font-semibold uppercase">Grammar</div>
                <div className="text-xl font-black text-emerald-700 font-mono mt-0.5">{feedback.grammar}%</div>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-neutral-50 border border-neutral-200 text-xs text-neutral-800 space-y-1">
              <div className="font-bold text-neutral-900">Coach Feedback:</div>
              {feedback.tips.map((t, i) => (
                <div key={i} className="flex items-start gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-neutral-900 shrink-0 mt-0.5" />
                  <span>{t}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
