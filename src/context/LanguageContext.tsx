import React, { createContext, useContext, useState, useEffect } from 'react';
import { SupportedLanguage, t as translateFn } from '../utils/translations';

interface LanguageContextType {
  language: SupportedLanguage;
  setLanguage: (lang: SupportedLanguage) => void;
  t: (key: string) => string;
  isSpeaking: boolean;
  isListening: boolean;
  speechSupported: boolean;
  micSupported: boolean;
  speak: (text: string, langOverride?: SupportedLanguage) => void;
  stopSpeaking: () => void;
  startListening: (onResult: (text: string) => void) => void;
  stopListening: () => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<SupportedLanguage>(() => {
    return (localStorage.getItem('careertwin_lang') as SupportedLanguage) || 'en';
  });
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(false);
  const [micSupported, setMicSupported] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setSpeechSupported('speechSynthesis' in window);
      setMicSupported('SpeechRecognition' in window || 'webkitSpeechRecognition' in window);
    }
  }, []);

  const setLanguage = (lang: SupportedLanguage) => {
    setLanguageState(lang);
    localStorage.setItem('careertwin_lang', lang);
  };

  const t = (key: string) => translateFn(key, language);

  const speak = (text: string, langOverride?: SupportedLanguage) => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();

    // Clean markdown before speaking
    const cleanText = text
      .replace(/[#*_`]/g, '')
      .replace(/\[(.*?)\]\(.*?\)/g, '$1')
      .slice(0, 500);

    const utterance = new SpeechSynthesisUtterance(cleanText);
    const targetLang = langOverride || language;
    utterance.lang = targetLang === 'te' ? 'te-IN' : 'en-IN';
    utterance.rate = targetLang === 'te' ? 0.9 : 1.0;

    // Pick Telugu voice if available
    const voices = window.speechSynthesis.getVoices();
    const voice = voices.find(v => v.lang.startsWith(targetLang === 'te' ? 'te' : 'en'));
    if (voice) {
      utterance.voice = voice;
    }

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
  };

  const stopSpeaking = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setIsSpeaking(false);
  };

  let recognitionInstance: any = null;

  const startListening = (onResult: (text: string) => void) => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) return;

    try {
      recognitionInstance = new SpeechRecognition();
      recognitionInstance.lang = language === 'te' ? 'te-IN' : 'en-IN';
      recognitionInstance.interimResults = false;
      recognitionInstance.maxAlternatives = 1;

      recognitionInstance.onstart = () => setIsListening(true);
      recognitionInstance.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        onResult(transcript);
        setIsListening(false);
      };
      recognitionInstance.onerror = () => setIsListening(false);
      recognitionInstance.onend = () => setIsListening(false);

      recognitionInstance.start();
    } catch (err) {
      console.warn('Speech recognition start failed:', err);
      setIsListening(false);
    }
  };

  const stopListening = () => {
    if (recognitionInstance) {
      recognitionInstance.stop();
    }
    setIsListening(false);
  };

  return (
    <LanguageContext.Provider value={{
      language,
      setLanguage,
      t,
      isSpeaking,
      isListening,
      speechSupported,
      micSupported,
      speak,
      stopSpeaking,
      startListening,
      stopListening,
    }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
