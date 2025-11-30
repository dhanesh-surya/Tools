import React, { useState } from 'react';
import { Wand2, CheckCheck, RefreshCw, Copy, RotateCcw, Type } from 'lucide-react';
import { checkGrammar, rephraseText } from '../../services/geminiService';

const SmartTextTools: React.FC = () => {
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState<'GRAMMAR' | 'REPHRASE' | 'STATS'>('GRAMMAR');

  const getStats = (text: string) => {
    const words = text.trim().split(/\s+/).filter(w => w.length > 0).length;
    const chars = text.length;
    const sentences = text.split(/[.!?]+/).filter(s => s.length > 0).length;
    return { words, chars, sentences };
  };

  const handleAction = async () => {
    if (!inputText) return;
    setLoading(true);
    let result = '';
    
    if (mode === 'GRAMMAR') {
        result = await checkGrammar(inputText);
    } else if (mode === 'REPHRASE') {
        result = await rephraseText(inputText, 'professional');
    }

    setOutputText(result);
    setLoading(false);
  };

  const stats = getStats(inputText);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
            <div className="glass-panel p-6 rounded-xl border border-slate-200 dark:border-slate-700">
                <div className="flex justify-between items-center mb-4">
                    <div className="flex space-x-2">
                        <button 
                            onClick={() => setMode('GRAMMAR')}
                            className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium transition-all ${mode === 'GRAMMAR' ? 'bg-primary text-white shadow-md' : 'bg-slate-100 dark:bg-slate-700 hover:bg-slate-200'}`}
                        >
                            <CheckCheck size={14} /> Grammar
                        </button>
                        <button 
                            onClick={() => setMode('REPHRASE')}
                            className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium transition-all ${mode === 'REPHRASE' ? 'bg-secondary text-white shadow-md' : 'bg-slate-100 dark:bg-slate-700 hover:bg-slate-200'}`}
                        >
                            <RefreshCw size={14} /> Rephraser
                        </button>
                        <button 
                            onClick={() => setMode('STATS')}
                            className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium transition-all ${mode === 'STATS' ? 'bg-orange-500 text-white shadow-md' : 'bg-slate-100 dark:bg-slate-700 hover:bg-slate-200'}`}
                        >
                            <Type size={14} /> Stats
                        </button>
                    </div>
                    <button 
                        onClick={() => { setInputText(''); setOutputText(''); }}
                        className="text-slate-400 hover:text-red-500 transition-colors"
                        title="Clear"
                    >
                        <RotateCcw size={18} />
                    </button>
                </div>

                <textarea
                    className="w-full h-40 p-4 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-primary outline-none resize-none transition-all font-mono text-sm"
                    placeholder="Type or paste your text here..."
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                ></textarea>

                {mode !== 'STATS' && (
                    <div className="mt-4 flex justify-end">
                        <button
                            onClick={handleAction}
                            disabled={loading || !inputText}
                            className="flex items-center gap-2 px-6 py-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-lg font-bold hover:shadow-lg hover:scale-105 transition-all disabled:opacity-50 disabled:scale-100"
                        >
                            {loading ? <RefreshCw className="animate-spin" size={18}/> : <Wand2 size={18}/>}
                            {mode === 'GRAMMAR' ? 'Fix Errors' : 'Rephrase'}
                        </button>
                    </div>
                )}
            </div>

            {(outputText || mode === 'STATS') && (
                <div className="glass-panel p-6 rounded-xl border border-green-200 dark:border-green-900/30 bg-green-50/50 dark:bg-green-900/10 animate-fade-in-up">
                    <div className="flex justify-between items-center mb-2">
                        <h3 className="text-sm font-bold text-green-700 dark:text-green-400 uppercase tracking-wider">
                            {mode === 'STATS' ? 'Text Analysis' : 'AI Output'}
                        </h3>
                        {mode !== 'STATS' && (
                             <button onClick={() => navigator.clipboard.writeText(outputText)} className="text-green-600 hover:text-green-800 dark:text-green-400">
                                <Copy size={16} />
                            </button>
                        )}
                    </div>
                    
                    {mode === 'STATS' ? (
                        <div className="grid grid-cols-3 gap-4 text-center">
                            <div className="p-4 bg-white dark:bg-slate-800 rounded-lg shadow-sm">
                                <div className="text-2xl font-bold text-slate-800 dark:text-white">{stats.words}</div>
                                <div className="text-xs text-slate-500 uppercase">Words</div>
                            </div>
                            <div className="p-4 bg-white dark:bg-slate-800 rounded-lg shadow-sm">
                                <div className="text-2xl font-bold text-slate-800 dark:text-white">{stats.chars}</div>
                                <div className="text-xs text-slate-500 uppercase">Characters</div>
                            </div>
                            <div className="p-4 bg-white dark:bg-slate-800 rounded-lg shadow-sm">
                                <div className="text-2xl font-bold text-slate-800 dark:text-white">{stats.sentences}</div>
                                <div className="text-xs text-slate-500 uppercase">Sentences</div>
                            </div>
                        </div>
                    ) : (
                        <p className="text-slate-800 dark:text-slate-200 whitespace-pre-wrap leading-relaxed">
                            {outputText}
                        </p>
                    )}
                </div>
            )}
        </div>

        {/* Sidebar Info */}
        <div className="space-y-4">
             <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl p-6 text-white shadow-lg">
                <Wand2 className="mb-4" size={32} />
                <h3 className="text-lg font-bold mb-2">Power of Gemini AI</h3>
                <p className="text-sm opacity-90">
                    Our text tools are powered by Google's latest Gemini models. 
                    Whether you need perfect grammar or a creative rewrite, we've got you covered.
                </p>
             </div>
             <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm">
                 <h4 className="font-bold mb-3 text-sm uppercase text-slate-500">Quick Tips</h4>
                 <ul className="text-sm space-y-2 text-slate-600 dark:text-slate-300 list-disc pl-4">
                     <li>Use "Stats" for instant word counts.</li>
                     <li>"Rephrase" makes text more professional.</li>
                     <li>Clear text to start a new session.</li>
                 </ul>
             </div>
        </div>
    </div>
  );
};

export default SmartTextTools;