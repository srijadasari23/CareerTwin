/**
 * CareerTwin AI — Server-Side Gemini Intelligence Provider
 * Adheres strictly to @google/genai guidelines with 'gemini-3.8-flash'
 * and 'gemini-3.8-flash-lite-tts' models.
 */
import { GoogleGenAI } from '@google/genai';

const apiKey = process.env.GEMINI_API_KEY || '';

let ai: GoogleGenAI | null = null;
if (apiKey && apiKey !== 'MY_GEMINI_API_KEY') {
  ai = new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

export const isGeminiConfigured = (): boolean => {
  return !!ai;
};

/**
 * AI Career Copilot: Guidance & 30-Day Plan Generation
 */
export async function generateCareerGuidance(params: {
  studentName: string;
  department: string;
  year: string;
  targetRecruiter: string;
  targetRole: string;
  readiness: number;
  weakSkills: string[];
  strongSkills: string[];
  userPrompt: string;
  language: 'en' | 'te';
}): Promise<{ response: string; source: 'ai' | 'fallback' }> {
  const languageInstruction = params.language === 'te' 
    ? 'IMPORTANT: Generate the response predominantly in clear, grammatically natural Telugu (తెలుగు) with standard English technical terms (like SQL, DSA, Hash Map, OOP) transliterated or kept in English for academic clarity.'
    : 'Provide the response in professional, motivating English tailored for an Indian engineering campus placement context.';

  const systemInstruction = `You are CareerTwin AI Copilot, an expert placement dean and career mentor at an elite engineering institution.
You guide students to clear technical interviews, improve aptitude, and bridge skill gaps.
${languageInstruction}
Provide actionable, concrete steps with realistic timelines. Clearly distinguish AI guidance from institutional guarantees. Never fabricate recruiter facts or impossible promises.`;

  const prompt = `Student Profile:
- Name: ${params.studentName}
- Department: ${params.department} (${params.year})
- Target Recruiter: ${params.targetRecruiter} (${params.targetRole})
- Current Placement Readiness Score: ${params.readiness}/100
- Strong Skill Areas: ${params.strongSkills.join(', ') || 'General fundamentals'}
- Immediate Skill Gaps: ${params.weakSkills.join(', ') || 'Technical interview practice'}

Student Question/Request:
"${params.userPrompt}"

Deliver a comprehensive, structured response formatted with clear markdown headings, bullet points, and specific weekly milestones if requesting a plan.`;

  if (!ai) {
    return {
      response: params.language === 'te'
        ? `### ${params.targetRecruiter} కోసం మీ కెరీర్ మార్గదర్శకం (డెమో మోడ్)\n\nనమస్కారం ${params.studentName}! మీ ప్రస్తుత ప్లేస్‌మెంట్ సంసిద్ధత స్కోర్ **${params.readiness}%**.\n\n#### ప్రధాన లక్ష్యాలు:\n- **${params.targetRecruiter} టెక్నికల్ రౌండ్**: ${params.weakSkills.join(', ') || 'కోడింగ్ మరియు SQL'} పై ఎక్కువ శ్రద్ధ పెట్టండి.\n- **వారాంతపు లక్ష్యం**: రోజుకు 30 నిమిషాలు ప్రాక్టీస్ ప్రశ్నలు మరియు 1 మాక్ ఇంటర్వ్యూ పూర్తి చేయండి.\n\n*(గమనిక: పూర్తి AI సమాధానం కోసం సర్వర్‌లో Gemini API Key కాన్ఫిగర్ చేయబడింది)*`
        : `### Personalized Placement Guidance for ${params.targetRecruiter}\n\nHello **${params.studentName}**, based on your current readiness score of **${params.readiness}%** targeting **${params.targetRecruiter} (${params.targetRole})**:\n\n1. **Focus Areas**: Prioritize your skill gaps in **${params.weakSkills.join(', ') || 'Core Technical Foundations'}**.\n2. **Weekly Milestone**: Complete 3 high-frequency ${params.targetRecruiter} questions from the CareerTwin question bank daily.\n3. **Interview Polish**: Schedule a simulated mock interview using the STAR method for behavioral rounds.\n\n*(Advisory note: Live Gemini API connection is available when GEMINI_API_KEY is active.)*`,
      source: 'fallback',
    };
  }

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        systemInstruction,
        temperature: 0.7,
      },
    });

    return {
      response: response.text || 'Unable to generate guidance at this time.',
      source: 'ai',
    };
  } catch (error: any) {
    console.error('[Gemini API] Guidance generation error:', error?.message);
    return {
      response: `AI Guidance is temporarily operating in local fallback mode (${error?.message || 'Rate limit or network error'}). Continue practicing with the verified question bank below.`,
      source: 'fallback',
    };
  }
}

/**
 * AI Mock Interview Answer Evaluation (STAR Format)
 */
export async function evaluateInterviewAnswer(params: {
  recruiter: string;
  role: string;
  question: string;
  answer: string;
  interviewType: string;
  language: 'en' | 'te';
}): Promise<{
  score: number; // 1 to 10
  clarity: number; // 0 to 100
  structure: number; // 0 to 100
  technicalDepth: number; // 0 to 100
  confidence: number; // 0 to 100
  strength: string;
  improvement: string;
  modelAnswer: string;
  starAnalysis?: {
    situation: string;
    task: string;
    action: string;
    result: string;
  };
  source: 'ai' | 'fallback';
}> {
  if (!ai || !params.answer.trim()) {
    // Robust local heuristic fallback
    const words = params.answer.trim().split(/\s+/).length;
    const baseScore = Math.min(9.5, Math.max(3.5, Math.round((4.5 + words * 0.08) * 10) / 10));
    return {
      score: baseScore,
      clarity: Math.min(95, Math.max(45, 60 + words)),
      structure: Math.min(95, Math.max(40, 55 + Math.round(words * 0.8))),
      technicalDepth: Math.min(95, Math.max(35, 50 + Math.round(words * 0.7))),
      confidence: Math.min(95, Math.max(45, 65 + Math.round(words * 0.5))),
      strength: 'Identified the core requirement of the recruiter question with direct approach.',
      improvement: 'Incorporate quantifiable results and structured STAR format (Situation, Task, Action, Result) to make your delivery more compelling.',
      modelAnswer: `In my project, when faced with this requirement for ${params.role}, I first analyzed the constraints, implemented the optimal modular solution, and validated performance through automated unit tests.`,
      starAnalysis: {
        situation: 'Context described adequately in your introduction.',
        task: 'Defined the primary technical deliverable clearly.',
        action: 'Steps explained, but could include more specific architectural tradeoffs.',
        result: 'Mention concrete metrics (e.g., reduced query latency by 35% or handled 10K requests).'
      },
      source: 'fallback',
    };
  }

  const prompt = `Evaluate this student's interview response for ${params.recruiter} (${params.role}) in a ${params.interviewType} interview round.
Question: "${params.question}"
Student's Answer: "${params.answer}"

Return a JSON object strictly matching this schema:
{
  "score": number (1.0 to 10.0),
  "clarity": number (0 to 100),
  "structure": number (0 to 100),
  "technicalDepth": number (0 to 100),
  "confidence": number (0 to 100),
  "strength": "1 concise sentence highlighting the best part of the response",
  "improvement": "1 actionable sentence on how to score higher next time",
  "modelAnswer": "A stellar 2-3 sentence model answer an exemplary candidate would give",
  "starAnalysis": {
    "situation": "brief analysis of situation context provided",
    "task": "brief analysis of task clarity",
    "action": "brief analysis of actions taken",
    "result": "brief analysis of impact or metric result"
  }
}`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        systemInstruction: 'You are an experienced technical hiring manager conducting campus interviews. Evaluate candidate responses rigorously, constructively, and fairly. Return only valid JSON.',
        responseMimeType: 'application/json',
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    return {
      score: parsed.score || 7.0,
      clarity: parsed.clarity || 75,
      structure: parsed.structure || 70,
      technicalDepth: parsed.technicalDepth || 72,
      confidence: parsed.confidence || 75,
      strength: parsed.strength || 'Good conceptual understanding.',
      improvement: parsed.improvement || 'Elaborate on edge cases and concrete metrics.',
      modelAnswer: parsed.modelAnswer || 'A structured answer detailing context, actions, and quantifiable impact.',
      starAnalysis: parsed.starAnalysis,
      source: 'ai',
    };
  } catch (err: any) {
    console.error('[Gemini API] Interview evaluation error:', err?.message);
    return {
      score: 7.2,
      clarity: 75,
      structure: 70,
      technicalDepth: 70,
      confidence: 72,
      strength: 'Clear communication of basic problem resolution.',
      improvement: 'Provide more concrete technical specifics and quantify the end outcome.',
      modelAnswer: `For ${params.recruiter}, explain the theoretical basis first, followed by a time/space complexity analysis and a real project application.`,
      source: 'fallback',
    };
  }
}

/**
 * AI Resume Review & Job Description Matcher
 */
export async function reviewResumeContent(params: {
  resumeText: string;
  targetRecruiter: string;
  targetRole: string;
  jobDescription?: string;
}): Promise<{
  atsScore: number;
  matchScore: number;
  extractedSkills: string[];
  missingKeywords: string[];
  strengths: string[];
  improvements: string[];
  bulletImprovements: { original: string; improved: string; reason: string }[];
  source: 'ai' | 'fallback';
}> {
  if (!ai || !params.resumeText.trim()) {
    return {
      atsScore: 78,
      matchScore: 74,
      extractedSkills: ['Java', 'SQL', 'Data Structures', 'Git', 'HTML/CSS', 'Python Basics'],
      missingKeywords: ['System Design', 'CI/CD Pipelines', 'RESTful API integration', 'Docker', 'Unit Testing'],
      strengths: [
        'Well-formatted education and academic project section.',
        'Clear listing of primary programming languages.',
        'Relevant degree curriculum from accredited institution.'
      ],
      improvements: [
        'Replace passive verbs with active impact statements (e.g. "Engineered", "Optimized", "Architected").',
        'Add quantitative metrics to projects (e.g. "reduced latency by 20%", "supporting 500+ users").',
        'Tailor project descriptions to align directly with ' + params.targetRecruiter + '\'s core tech stack.'
      ],
      bulletImprovements: [
        {
          original: 'Worked on a web development project using React and Node.js for college fest.',
          improved: 'Architected full-stack event portal using React and Node.js, managing 1,200+ registrations with zero downtime.',
          reason: 'Adds measurable impact, strong active verb, and scale.'
        }
      ],
      source: 'fallback'
    };
  }

  const prompt = `Review this student resume for the role of "${params.targetRole}" at "${params.targetRecruiter}".
Target Job Requirements / Description: "${params.jobDescription || 'Standard software engineering campus hiring requirements including DSA, SQL, Web/Cloud fundamentals, and problem solving.'}"

Resume Content:
"""
${params.resumeText.slice(0, 4000)}
"""

Return a JSON object strictly matching this schema:
{
  "atsScore": number (0 to 100),
  "matchScore": number (0 to 100),
  "extractedSkills": string[],
  "missingKeywords": string[],
  "strengths": string[],
  "improvements": string[],
  "bulletImprovements": [
    {
      "original": string,
      "improved": string,
      "reason": string
    }
  ]
}`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        systemInstruction: 'You are an executive campus recruiter and ATS screening specialist. Provide rigorous, actionable, honest feedback that increases shortlisting rates without fabricating credentials.',
        responseMimeType: 'application/json',
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    return {
      atsScore: parsed.atsScore || 75,
      matchScore: parsed.matchScore || 70,
      extractedSkills: parsed.extractedSkills || ['Programming', 'Databases'],
      missingKeywords: parsed.missingKeywords || ['Unit Testing', 'Deployment'],
      strengths: parsed.strengths || ['Good foundational coursework.'],
      improvements: parsed.improvements || ['Quantify project outcomes.'],
      bulletImprovements: parsed.bulletImprovements || [],
      source: 'ai',
    };
  } catch (err: any) {
    console.error('[Gemini API] Resume review error:', err?.message);
    return {
      atsScore: 72,
      matchScore: 68,
      extractedSkills: ['Java', 'SQL', 'C++'],
      missingKeywords: ['Cloud Fundamentals', 'Agile Methodologies'],
      strengths: ['Clear structure and relevant coursework.'],
      improvements: ['Quantify project achievements with metrics and users reached.'],
      bulletImprovements: [],
      source: 'fallback',
    };
  }
}

/**
 * AI Concept Explainer in Telugu / English
 */
export async function explainConcept(params: {
  concept: string;
  topic: string;
  language: 'en' | 'te';
}): Promise<{ explanation: string; teluguAudioScript?: string; source: 'ai' | 'fallback' }> {
  const languageInstruction = params.language === 'te'
    ? 'Explain this engineering placement concept in simple, friendly Telugu (తెలుగు) using easy-to-understand real-life analogies. Keep technical terms like "Array", "Pointer", "Query", "Stack" intact in English so students can remember them for English interviews.'
    : 'Explain this placement concept in concise, intuitive English with a real-world analogy and typical interview trick questions to watch out for.';

  const prompt = `Topic: ${params.topic}
Concept: ${params.concept}

${languageInstruction}
Include:
1. One-sentence definition
2. Real-world analogy (e.g. railway booking, kitchen pantry, library)
3. Key points recruiters listen for in interviews
4. Common pitfall to avoid`;

  if (!ai) {
    return {
      explanation: params.language === 'te'
        ? `### ${params.concept} — సులభమైన వివరణ (తెలుగులో)\n\n**నిర్వచనం:** ${params.concept} అనేది కంప్యూటర్ సైన్స్‌లో తరచూ అడిగే ఒక కీలకమైన భావన.\n\n**నిజ జీవిత ఉదాహరణ:** ఉదాహరణకు ఒక లైబ్రరీలోని పుస్తకాల అరను ఊహించుకోండి. మనం నిర్దిష్ట క్రమంలో పుస్తకాలను ఉంచితే శోధించడం ఎంత సులువో, అలాగే కంప్యూటర్‌లో డేటాను సమర్థవంతంగా నిల్వ చేయడానికి మరియు ప్రాసెస్ చేయడానికి ఇది సహాయపడుతుంది.\n\n**ఇంటర్వ్యూ చిట్కా:** ఇంటర్వ్యూలో సమాధానం చెప్పేటప్పుడు ఎల్లప్పుడూ Time Complexity మరియు Space Complexity గురించి ప్రత్యేకంగా ప్రస్తావించండి!`
        : `### Understanding ${params.concept}\n\n**Definition:** A fundamental concept in ${params.topic} tested frequently in technical rounds.\n\n**Analogy:** Think of an organized warehouse indexing system where items can be retrieved rapidly without sequential scanning.\n\n**What Recruiters Look For:** Explain the underlying data representation, boundary edge cases, and asymptotic complexity (O(N) vs O(1)).`,
      source: 'fallback'
    };
  }

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        systemInstruction: 'You are an inspiring engineering professor who excels at demystifying complex computer science concepts for vernacular and bilingual students.',
      },
    });

    return {
      explanation: response.text || 'Explanation unavailable.',
      source: 'ai'
    };
  } catch (err: any) {
    console.error('[Gemini API] Concept explain error:', err?.message);
    return {
      explanation: `Concept explanation for ${params.concept} is currently operating in local mode. Review the question bank for sample questions.`,
      source: 'fallback'
    };
  }
}

/**
 * Text-to-Speech Generation using 'gemini-3.8-flash-lite-tts'
 */
export async function generateSpeechAudio(text: string): Promise<{ audioBase64?: string; mimeType: string }> {
  if (!ai) {
    return { mimeType: 'audio/wav' };
  }

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash-lite-tts',
      contents: [
        {
          role: 'user',
          parts: [
            {
              text: text.slice(0, 600),
              speechMetadata: {
                style: 'Clear, articulate, academic mentor voice',
              },
            },
          ],
        },
      ],
      config: {
        responseModalities: ['AUDIO'],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: 'Kore' },
          },
        },
      },
    });

    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    return {
      audioBase64: base64Audio,
      mimeType: 'audio/wav',
    };
  } catch (err: any) {
    console.warn('[Gemini TTS] Speech generation error:', err?.message);
    return { mimeType: 'audio/wav' };
  }
}
