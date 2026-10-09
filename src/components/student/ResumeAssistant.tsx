import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { FileText, Sparkles, Check, AlertCircle, ArrowRight, Loader2, Copy } from 'lucide-react';

export const ResumeAssistant: React.FC = () => {
  const { student } = useAuth();
  const [resumeText, setResumeText] = useState(
    `ARJUN KUMAR
Email: arjun.kumar@rcee.ac.in | Phone: +91 98765 43210
B.Tech in Computer Science and Engineering, Ramachandra College of Engineering (CGPA: 8.4/10)

TECHNICAL SKILLS:
Languages: Java, C++, Python, JavaScript, SQL
Frameworks: React.js, Node.js, Express, Tailwind CSS
Databases: PostgreSQL, MySQL, MongoDB
Tools: Git, GitHub, VS Code, Postman

PROJECTS:
1. Campus Placement Portal
- Built a web portal for student placement registration using React and Node.js.
- Implemented user authentication and resume download features.
- Used MySQL to store student records and eligibility criteria.

2. Real-time Chat Application
- Created a messaging app using Socket.io and React.
- Added support for group rooms and message history.`
  );

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{
    atsScore: number;
    matchScore: number;
    extractedSkills: string[];
    missingKeywords: string[];
    strengths: string[];
    improvements: string[];
    bulletImprovements: { original: string; improved: string; reason: string }[];
  } | null>({
    atsScore: 78,
    matchScore: 82,
    extractedSkills: ['Java', 'SQL', 'React.js', 'Node.js', 'MySQL', 'Git'],
    missingKeywords: ['Docker', 'REST API Optimization', 'Unit Testing', 'CI/CD Pipelines'],
    strengths: [
      'Clean typography and standard sectional hierarchy.',
      'Strong core programming languages aligned with campus mass recruiters.',
      'Clear project references with real full-stack web technologies.'
    ],
    improvements: [
      'Quantify project achievements with concrete numbers and latency gains.',
      'Highlight automated testing and cloud deployment foundations.',
      'Use strong active verbs (Engineered, Architected, Spearheaded).'
    ],
    bulletImprovements: [
      {
        original: 'Built a web portal for student placement registration using React and Node.js.',
        improved: 'Architected high-throughput campus placement portal serving 1,200+ students with 99.8% uptime using React and Node.js.',
        reason: 'Adds active verb "Architected" and measurable student scale.'
      },
      {
        original: 'Used MySQL to store student records and eligibility criteria.',
        improved: 'Engineered normalized relational schemas and optimized SQL indexing, cutting eligibility query latency by 42%.',
        reason: 'Demonstrates deep database competence and performance optimization.'
      }
    ]
  });

  const handleAnalyze = async () => {
    if (!resumeText.trim() || loading) return;
    setLoading(true);

    try {
      const res = await fetch('/api/ai/review-resume', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          resumeText,
          targetRecruiter: student?.targetRecruiter || 'TCS',
          targetRole: student?.targetRole || 'Software Engineer',
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setResult(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white border border-neutral-200 rounded-2xl p-5 shadow-xs">
        <h1 className="text-xl font-bold text-neutral-900 flex items-center gap-2">
          <FileText className="w-5 h-5 text-neutral-900" />
          Resume & Portfolio Intelligence
        </h1>
        <p className="text-xs text-neutral-500 mt-1">
          ATS keyword scanner and impact bullet optimizer tailored for {student?.targetRecruiter}.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Editor (5 cols) */}
        <div className="lg:col-span-5 bg-white border border-neutral-200 rounded-2xl p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-neutral-900">
              Resume Text Content
            </span>
            <span className="text-[11px] text-neutral-500 font-mono">
              {resumeText.split(/\s+/).length} words
            </span>
          </div>

          <textarea
            value={resumeText}
            onChange={e => setResumeText(e.target.value)}
            rows={15}
            className="w-full p-3 text-xs font-mono bg-[#F7F7F8] border border-neutral-200 rounded-xl outline-none text-neutral-900 focus:border-neutral-900"
            placeholder="Paste your resume text here..."
          />

          <button
            onClick={handleAnalyze}
            disabled={loading || !resumeText.trim()}
            className="w-full py-2.5 px-4 bg-neutral-900 hover:bg-black disabled:opacity-50 text-white rounded-xl text-xs font-semibold shadow-xs flex items-center justify-center gap-2 transition-colors"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Scanning ATS Match...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Analyze with CareerTwin AI</span>
              </>
            )}
          </button>
        </div>

        {/* Right Column: AI Analysis Result (7 cols) */}
        <div className="lg:col-span-7 space-y-5">
          {result && (
            <>
              {/* Scores Strip */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-white border border-neutral-200 rounded-2xl shadow-xs">
                  <div className="text-xs font-semibold text-neutral-500 uppercase">ATS Compatibility</div>
                  <div className="text-3xl font-black text-neutral-900 font-mono mt-1">
                    {result.atsScore}%
                  </div>
                  <div className="text-[11px] text-neutral-500 mt-1">Passes standard campus ATS parsers</div>
                </div>

                <div className="p-4 bg-white border border-neutral-200 rounded-2xl shadow-xs">
                  <div className="text-xs font-semibold text-neutral-500 uppercase">{student?.targetRecruiter} Role Match</div>
                  <div className="text-3xl font-black text-emerald-600 font-mono mt-1">
                    {result.matchScore}%
                  </div>
                  <div className="text-[11px] text-neutral-500 mt-1">Keyword alignment to job requirements</div>
                </div>
              </div>

              {/* Missing Keywords & Extracted Skills */}
              <div className="p-5 bg-white border border-neutral-200 rounded-2xl shadow-xs space-y-3">
                <h3 className="text-xs font-bold text-neutral-500 uppercase tracking-wider">
                  Keywords Identified & Recommended Additions
                </h3>

                <div>
                  <div className="text-[11px] font-semibold text-neutral-700 mb-1.5">
                    Extracted Technical Skills:
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {result.extractedSkills.map(sk => (
                      <span
                        key={sk}
                        className="px-2 py-0.5 rounded text-[11px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200"
                      >
                        ✓ {sk}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="text-[11px] font-semibold text-neutral-700 mb-1.5">
                    Missing Recommended Recruiter Keywords:
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {result.missingKeywords.map(sk => (
                      <span
                        key={sk}
                        className="px-2 py-0.5 rounded text-[11px] font-medium bg-rose-50 text-rose-700 border border-rose-200"
                      >
                        + {sk}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Bullet Improvements (Before & After) */}
              <div className="p-5 bg-white border border-neutral-200 rounded-2xl shadow-xs space-y-3">
                <h3 className="text-xs font-bold text-neutral-500 uppercase tracking-wider">
                  Action Verb & Metric Bullet Rewrites
                </h3>

                <div className="space-y-3">
                  {result.bulletImprovements.map((b, i) => (
                    <div
                      key={i}
                      className="p-3.5 rounded-xl bg-[#F7F7F8] border border-neutral-200 text-xs space-y-1.5"
                    >
                      <div className="text-neutral-500 line-through">
                        "{b.original}"
                      </div>
                      <div className="text-emerald-700 font-semibold flex items-start gap-1.5">
                        <ArrowRight className="w-3.5 h-3.5 shrink-0 mt-0.5 text-emerald-600" />
                        <span>"{b.improved}"</span>
                      </div>
                      <div className="text-[10px] text-neutral-600 font-medium">
                        Why: {b.reason}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
