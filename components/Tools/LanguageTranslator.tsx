import React, { useState, useEffect } from 'react';
import { Languages, ArrowRightLeft, Copy, Volume2, RotateCcw, Sparkles } from 'lucide-react';
import { translateText } from '../../services/geminiService';

interface Language {
  code: string;
  name: string;
  nativeName: string;
  flag: string;
}

const LanguageTranslator: React.FC = () => {
  const [sourceText, setSourceText] = useState('');
  const [translatedText, setTranslatedText] = useState('');
  const [sourceLang, setSourceLang] = useState('en');
  const [targetLang, setTargetLang] = useState('hi');
  const [isTranslating, setIsTranslating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const languages: Language[] = [
    { code: 'en', name: 'English', nativeName: 'English', flag: '🇺🇸' },
    { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', flag: '🇮🇳' },
    { code: 'es', name: 'Spanish', nativeName: 'Español', flag: '🇪🇸' },
    { code: 'fr', name: 'French', nativeName: 'Français', flag: '🇫🇷' },
    { code: 'de', name: 'German', nativeName: 'Deutsch', flag: '🇩🇪' },
    { code: 'it', name: 'Italian', nativeName: 'Italiano', flag: '🇮🇹' },
    { code: 'pt', name: 'Portuguese', nativeName: 'Português', flag: '🇵🇹' },
    { code: 'ru', name: 'Russian', nativeName: 'Русский', flag: '🇷🇺' },
    { code: 'ja', name: 'Japanese', nativeName: '日本語', flag: '🇯🇵' },
    { code: 'ko', name: 'Korean', nativeName: '한국어', flag: '🇰🇷' },
    { code: 'zh', name: 'Chinese', nativeName: '中文', flag: '🇨🇳' },
    { code: 'ar', name: 'Arabic', nativeName: 'العربية', flag: '🇸🇦' },
    { code: 'bn', name: 'Bengali', nativeName: 'বাংলা', flag: '🇧🇩' },
    { code: 'te', name: 'Telugu', nativeName: 'తెలుగు', flag: '🇮🇳' },
    { code: 'mr', name: 'Marathi', nativeName: 'मराठी', flag: '🇮🇳' },
    { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்', flag: '🇮🇳' },
    { code: 'ur', name: 'Urdu', nativeName: 'اردو', flag: '🇵🇰' },
    { code: 'gu', name: 'Gujarati', nativeName: 'ગુજરાતી', flag: '🇮🇳' },
    { code: 'kn', name: 'Kannada', nativeName: 'ಕನ್ನಡ', flag: '🇮🇳' },
    { code: 'ml', name: 'Malayalam', nativeName: 'മലയാളം', flag: '🇮🇳' },
    { code: 'pa', name: 'Punjabi', nativeName: 'ਪੰਜਾਬੀ', flag: '🇮🇳' },
    { code: 'or', name: 'Odia', nativeName: 'ଓଡ଼ିଆ', flag: '🇮🇳' },
    { code: 'as', name: 'Assamese', nativeName: 'অসমীয়া', flag: '🇮🇳' },
    { code: 'mai', name: 'Maithili', nativeName: 'मैथिली', flag: '🇮🇳' },
    { code: 'bho', name: 'Bhojpuri', nativeName: 'भोजपुरी', flag: '🇮🇳' },
    { code: 'awa', name: 'Awadhi', nativeName: 'अवधी', flag: '🇮🇳' },
    { code: 'mag', name: 'Magahi', nativeName: 'मगही', flag: '🇮🇳' },
    { code: 'hne', name: 'Chhattisgarhi', nativeName: 'छत्तीसगढ़ी', flag: '🇮🇳' },
    { code: 'raj', name: 'Rajasthani', nativeName: 'राजस्थानी', flag: '🇮🇳' },
    { code: 'bg', name: 'Bulgarian', nativeName: 'Български', flag: '🇧🇬' },
    { code: 'cs', name: 'Czech', nativeName: 'Čeština', flag: '🇨🇿' },
    { code: 'da', name: 'Danish', nativeName: 'Dansk', flag: '🇩🇰' },
    { code: 'el', name: 'Greek', nativeName: 'Ελληνικά', flag: '🇬🇷' },
    { code: 'fi', name: 'Finnish', nativeName: 'Suomi', flag: '🇫🇮' },
    { code: 'he', name: 'Hebrew', nativeName: 'עברית', flag: '🇮🇱' },
    { code: 'hu', name: 'Hungarian', nativeName: 'Magyar', flag: '🇭🇺' },
    { code: 'id', name: 'Indonesian', nativeName: 'Bahasa Indonesia', flag: '🇮🇩' },
    { code: 'ms', name: 'Malay', nativeName: 'Bahasa Melayu', flag: '🇲🇾' },
    { code: 'nl', name: 'Dutch', nativeName: 'Nederlands', flag: '🇳🇱' },
    { code: 'no', name: 'Norwegian', nativeName: 'Norsk', flag: '🇳🇴' },
    { code: 'pl', name: 'Polish', nativeName: 'Polski', flag: '🇵🇱' },
    { code: 'ro', name: 'Romanian', nativeName: 'Română', flag: '🇷🇴' },
    { code: 'sk', name: 'Slovak', nativeName: 'Slovenčina', flag: '🇸🇰' },
    { code: 'sv', name: 'Swedish', nativeName: 'Svenska', flag: '🇸🇪' },
    { code: 'th', name: 'Thai', nativeName: 'ไทย', flag: '🇹🇭' },
    { code: 'tr', name: 'Turkish', nativeName: 'Türkçe', flag: '🇹🇷' },
    { code: 'uk', name: 'Ukrainian', nativeName: 'Українська', flag: '🇺🇦' },
    { code: 'vi', name: 'Vietnamese', nativeName: 'Tiếng Việt', flag: '🇻🇳' }
  ];

  const getLanguageName = (code: string): Language => {
    return languages.find(lang => lang.code === code) || languages[0];
  };

  const handleTranslate = async () => {
    if (!sourceText.trim()) {
      setError('Please enter text to translate');
      return;
    }

    setIsTranslating(true);
    setError(null);

    try {
      const sourceLangName = getLanguageName(sourceLang).name;
      const targetLangName = getLanguageName(targetLang).name;

      const result = await translateText(sourceText, sourceLangName, targetLangName);
      setTranslatedText(result);
    } catch (err) {
      console.error('Translation error:', err);
      setError('Translation failed. Please try again.');
      setTranslatedText('');
    } finally {
      setIsTranslating(false);
    }
  };

  const swapLanguages = () => {
    const tempText = sourceText;
    const tempLang = sourceLang;

    setSourceText(translatedText);
    setSourceLang(targetLang);
    setTargetLang(tempLang);
    setTranslatedText(tempText);
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      // You could add a toast notification here
    } catch (err) {
      console.error('Failed to copy text:', err);
    }
  };

  const speakText = (text: string, lang: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = lang;
      utterance.rate = 0.8;
      utterance.pitch = 1;

      // Try to find a voice that matches the language
      const voices = speechSynthesis.getVoices();
      const matchingVoice = voices.find(voice => voice.lang.startsWith(lang.split('-')[0]));

      if (matchingVoice) {
        utterance.voice = matchingVoice;
      }

      speechSynthesis.speak(utterance);
    }
  };

  const clearAll = () => {
    setSourceText('');
    setTranslatedText('');
    setError(null);
  };

  // Auto-translate when text changes (debounced)
  useEffect(() => {
    if (sourceText.trim()) {
      const timeoutId = setTimeout(() => {
        handleTranslate();
      }, 1000);

      return () => clearTimeout(timeoutId);
    } else {
      setTranslatedText('');
      setError(null);
    }
  }, [sourceText, sourceLang, targetLang]);

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full">
            <Languages className="text-white" size={24} />
          </div>
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white">AI Language Translator</h2>
        </div>
        <p className="text-slate-600 dark:text-slate-400">Translate between 50+ languages with AI-powered accuracy</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Source Language */}
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <span className="text-2xl">{getLanguageName(sourceLang).flag}</span>
              <span className="font-semibold text-slate-900 dark:text-white">
                {getLanguageName(sourceLang).nativeName}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => speakText(sourceText, sourceLang)}
                disabled={!sourceText.trim()}
                className="p-2 text-slate-500 hover:text-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                title="Speak text"
              >
                <Volume2 size={18} />
              </button>
              <button
                onClick={() => copyToClipboard(sourceText)}
                disabled={!sourceText.trim()}
                className="p-2 text-slate-500 hover:text-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                title="Copy text"
              >
                <Copy size={18} />
              </button>
            </div>
          </div>

          <select
            value={sourceLang}
            onChange={(e) => setSourceLang(e.target.value)}
            className="w-full px-3 py-2 mb-4 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {languages.map(lang => (
              <option key={lang.code} value={lang.code}>
                {lang.flag} {lang.name} ({lang.nativeName})
              </option>
            ))}
          </select>

          <textarea
            value={sourceText}
            onChange={(e) => setSourceText(e.target.value)}
            placeholder="Enter text to translate..."
            className="w-full h-40 px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            maxLength={5000}
          />

          <div className="flex justify-between items-center mt-2 text-sm text-slate-500">
            <span>{sourceText.length}/5000 characters</span>
            <button
              onClick={clearAll}
              className="text-blue-500 hover:text-blue-600 transition-colors"
            >
              Clear all
            </button>
          </div>
        </div>

        {/* Target Language */}
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <span className="text-2xl">{getLanguageName(targetLang).flag}</span>
              <span className="font-semibold text-slate-900 dark:text-white">
                {getLanguageName(targetLang).nativeName}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => speakText(translatedText, targetLang)}
                disabled={!translatedText.trim()}
                className="p-2 text-slate-500 hover:text-green-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                title="Speak translation"
              >
                <Volume2 size={18} />
              </button>
              <button
                onClick={() => copyToClipboard(translatedText)}
                disabled={!translatedText.trim()}
                className="p-2 text-slate-500 hover:text-green-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                title="Copy translation"
              >
                <Copy size={18} />
              </button>
            </div>
          </div>

          <select
            value={targetLang}
            onChange={(e) => setTargetLang(e.target.value)}
            className="w-full px-3 py-2 mb-4 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
          >
            {languages.map(lang => (
              <option key={lang.code} value={lang.code}>
                {lang.flag} {lang.name} ({lang.nativeName})
              </option>
            ))}
          </select>

          <div className="relative">
            <textarea
              value={translatedText}
              readOnly
              placeholder="Translation will appear here..."
              className="w-full h-40 px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 resize-none"
            />

            {isTranslating && (
              <div className="absolute inset-0 flex items-center justify-center bg-white/80 dark:bg-slate-800/80 rounded-lg">
                <div className="flex items-center gap-3 text-blue-500">
                  <Sparkles className="animate-spin" size={20} />
                  <span className="font-medium">Translating...</span>
                </div>
              </div>
            )}
          </div>

          {error && (
            <div className="mt-2 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
            </div>
          )}

          <div className="flex justify-between items-center mt-2 text-sm text-slate-500">
            <span>{translatedText.length} characters</span>
            {translatedText && (
              <span className="text-green-500 flex items-center gap-1">
                <Sparkles size={14} />
                AI Translated
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Swap Languages Button */}
      <div className="flex justify-center mt-6">
        <button
          onClick={swapLanguages}
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105"
        >
          <ArrowRightLeft size={20} />
          Swap Languages
        </button>
      </div>

      {/* Popular Language Pairs */}
      <div className="mt-8 bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6">
        <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-4 text-center">
          Popular Language Pairs
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { from: 'en', to: 'hi', label: 'English → Hindi' },
            { from: 'hi', to: 'en', label: 'Hindi → English' },
            { from: 'en', to: 'es', label: 'English → Spanish' },
            { from: 'en', to: 'fr', label: 'English → French' },
            { from: 'en', to: 'de', label: 'English → German' },
            { from: 'en', to: 'ja', label: 'English → Japanese' },
            { from: 'en', to: 'zh', label: 'English → Chinese' },
            { from: 'hi', to: 'te', label: 'Hindi → Telugu' }
          ].map(pair => (
            <button
              key={`${pair.from}-${pair.to}`}
              onClick={() => {
                setSourceLang(pair.from);
                setTargetLang(pair.to);
              }}
              className="p-3 text-center border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
            >
              <div className="text-sm font-medium text-slate-900 dark:text-white">{pair.label}</div>
              <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                {getLanguageName(pair.from).flag} → {getLanguageName(pair.to).flag}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Features */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 text-center">
          <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <Sparkles className="text-blue-500" size={24} />
          </div>
          <h4 className="font-semibold text-slate-900 dark:text-white mb-2">AI-Powered</h4>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Advanced AI translation with contextual understanding
          </p>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 text-center">
          <div className="w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <Languages className="text-green-500" size={24} />
          </div>
          <h4 className="font-semibold text-slate-900 dark:text-white mb-2">50+ Languages</h4>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Support for major world languages including regional variants
          </p>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 text-center">
          <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <Volume2 className="text-purple-500" size={24} />
          </div>
          <h4 className="font-semibold text-slate-900 dark:text-white mb-2">Text-to-Speech</h4>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Listen to pronunciations in both source and target languages
          </p>
        </div>
      </div>
    </div>
  );
};

export default LanguageTranslator;