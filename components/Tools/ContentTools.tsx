import React, { useState } from 'react';
import { Type, Copy, Check, FileText, Palette } from 'lucide-react';

const ContentTools: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'CASE' | 'LOREM' | 'COLOR' | 'REGEX'>('CASE');
  const [copied, setCopied] = useState(false);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-6 bg-white dark:bg-slate-800 rounded-xl shadow-lg">
      <h2 className="text-3xl font-bold mb-6 text-slate-800 dark:text-white">Content Tools</h2>
      
      {/* Tabs */}
      <div className="flex flex-wrap gap-2 mb-6 border-b border-slate-200 dark:border-slate-700">
        {[
          { id: 'CASE', label: 'Case Converter', icon: Type },
          { id: 'LOREM', label: 'Lorem Ipsum', icon: FileText },
          { id: 'COLOR', label: 'Color Picker', icon: Palette },
          { id: 'REGEX', label: 'Regex Tester', icon: Type },
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2 rounded-t-lg flex items-center gap-2 transition-all ${
                activeTab === tab.id
                  ? 'bg-indigo-600 text-white'
                  : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
              }`}
            >
              <Icon size={16} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {activeTab === 'CASE' && <CaseConverter copyToClipboard={copyToClipboard} copied={copied} />}
      {activeTab === 'LOREM' && <LoremIpsum copyToClipboard={copyToClipboard} copied={copied} />}
      {activeTab === 'COLOR' && <ColorPicker copyToClipboard={copyToClipboard} copied={copied} />}
      {activeTab === 'REGEX' && <RegexTester />}
    </div>
  );
};

// Case Converter
const CaseConverter: React.FC<{ copyToClipboard: (text: string) => void; copied: boolean }> = ({ copyToClipboard, copied }) => {
  const [input, setInput] = useState('');

  const convert = (type: string) => {
    let result = '';
    switch (type) {
      case 'upper':
        result = input.toUpperCase();
        break;
      case 'lower':
        result = input.toLowerCase();
        break;
      case 'title':
        result = input.replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());
        break;
      case 'sentence':
        result = input.charAt(0).toUpperCase() + input.slice(1).toLowerCase();
        break;
      case 'camel':
        result = input.replace(/(?:^\w|[A-Z]|\b\w|\s+)/g, (match, index) =>
          index === 0 ? match.toLowerCase() : match.toUpperCase()
        ).replace(/\s+/g, '');
        break;
      case 'snake':
        result = input.toLowerCase().replace(/\s+/g, '_');
        break;
    }
    copyToClipboard(result);
  };

  return (
    <div className="space-y-4">
      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Enter text to convert..."
        className="w-full h-40 p-4 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 text-slate-800 dark:text-white"
      />
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {['upper', 'lower', 'title', 'sentence', 'camel', 'snake'].map((type) => (
          <button
            key={type}
            onClick={() => convert(type)}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 capitalize"
          >
            {type} Case
          </button>
        ))}
      </div>
      {copied && (
        <div className="flex items-center gap-2 p-3 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-lg">
          <Check size={18} />
          <span>Copied to clipboard!</span>
        </div>
      )}
    </div>
  );
};

// Lorem Ipsum Generator
const LoremIpsum: React.FC<{ copyToClipboard: (text: string) => void; copied: boolean }> = ({ copyToClipboard, copied }) => {
  const [paragraphs, setParagraphs] = useState(3);
  const [output, setOutput] = useState('');

  const lorem = [
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
    'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.',
    'Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    'Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium.',
  ];

  const generate = () => {
    const result = Array.from({ length: paragraphs }, (_, i) => lorem[i % lorem.length]).join('\n\n');
    setOutput(result);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <label className="text-slate-700 dark:text-slate-300">Paragraphs:</label>
        <input
          type="number"
          min="1"
          max="10"
          value={paragraphs}
          onChange={(e) => setParagraphs(parseInt(e.target.value) || 1)}
          className="w-20 p-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 text-slate-800 dark:text-white"
        />
        <button onClick={generate} className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
          Generate
        </button>
      </div>
      {output && (
        <div className="relative">
          <textarea
            value={output}
            readOnly
            className="w-full h-64 p-4 border border-slate-300 dark:border-slate-600 rounded-lg bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-white"
          />
          <button
            onClick={() => copyToClipboard(output)}
            className="absolute top-2 right-2 p-2 bg-white dark:bg-slate-700 rounded hover:bg-slate-100"
          >
            {copied ? <Check size={18} className="text-green-600" /> : <Copy size={18} />}
          </button>
        </div>
      )}
    </div>
  );
};

// Color Picker
const ColorPicker: React.FC<{ copyToClipboard: (text: string) => void; copied: boolean }> = ({ copyToClipboard, copied }) => {
  const [color, setColor] = useState('#4f46e5');

  const hexToRgb = (hex: string) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgb(${r}, ${g}, ${b})`;
  };

  const hexToHsl = (hex: string) => {
    let r = parseInt(hex.slice(1, 3), 16) / 255;
    let g = parseInt(hex.slice(3, 5), 16) / 255;
    let b = parseInt(hex.slice(5, 7), 16) / 255;
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h = 0, s = 0, l = (max + min) / 2;
    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
        case g: h = ((b - r) / d + 2) / 6; break;
        case b: h = ((r - g) / d + 4) / 6; break;
      }
    }
    return `hsl(${Math.round(h * 360)}, ${Math.round(s * 100)}%, ${Math.round(l * 100)}%)`;
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-6">
        <div className="flex-1">
          <input
            type="color"
            value={color}
            onChange={(e) => setColor(e.target.value)}
            className="w-full h-40 rounded-lg cursor-pointer border-2 border-slate-300 dark:border-slate-600"
          />
        </div>
        <div className="flex-1 space-y-3">
          {[
            { label: 'HEX', value: color },
            { label: 'RGB', value: hexToRgb(color) },
            { label: 'HSL', value: hexToHsl(color) },
          ].map((format) => (
            <div key={format.label} className="relative p-4 bg-slate-50 dark:bg-slate-900 rounded-lg">
              <div className="text-sm font-semibold text-slate-600 dark:text-slate-400 mb-1">{format.label}</div>
              <div className="font-mono text-slate-800 dark:text-white">{format.value}</div>
              <button
                onClick={() => copyToClipboard(format.value)}
                className="absolute top-3 right-3 p-2 bg-white dark:bg-slate-700 rounded hover:bg-slate-100"
              >
                {copied ? <Check size={16} className="text-green-600" /> : <Copy size={16} />}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Regex Tester
const RegexTester: React.FC = () => {
  const [pattern, setPattern] = useState('');
  const [testString, setTestString] = useState('');
  const [flags, setFlags] = useState('g');
  const [matches, setMatches] = useState<string[]>([]);
  const [error, setError] = useState('');

  const test = () => {
    try {
      const regex = new RegExp(pattern, flags);
      const results = testString.match(regex);
      setMatches(results || []);
      setError('');
    } catch (e: any) {
      setError(e.message);
      setMatches([]);
    }
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <input
          type="text"
          value={pattern}
          onChange={(e) => setPattern(e.target.value)}
          placeholder="Regex pattern"
          className="md:col-span-2 p-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 text-slate-800 dark:text-white font-mono"
        />
        <input
          type="text"
          value={flags}
          onChange={(e) => setFlags(e.target.value)}
          placeholder="Flags (g, i, m)"
          className="p-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 text-slate-800 dark:text-white"
        />
      </div>
      <textarea
        value={testString}
        onChange={(e) => setTestString(e.target.value)}
        placeholder="Test string..."
        className="w-full h-32 p-4 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 text-slate-800 dark:text-white"
      />
      <button onClick={test} className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
        Test Regex
      </button>
      {error && <div className="p-3 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-lg">{error}</div>}
      {matches.length > 0 && (
        <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
          <div className="font-semibold text-green-700 dark:text-green-300 mb-2">{matches.length} matches found:</div>
          <div className="space-y-1">
            {matches.map((match, i) => (
              <div key={i} className="font-mono text-sm text-slate-800 dark:text-white bg-white dark:bg-slate-800 p-2 rounded">
                {match}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ContentTools;
