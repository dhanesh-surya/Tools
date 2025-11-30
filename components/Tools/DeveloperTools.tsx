import React, { useState } from 'react';
import { Code, Copy, Check, AlertCircle, Hash, Link as LinkIcon, Clock } from 'lucide-react';

const DeveloperTools: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'JSON' | 'BASE64' | 'HASH' | 'URL' | 'TIMESTAMP'>('JSON');
  const [copied, setCopied] = useState(false);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-6 bg-white dark:bg-slate-800 rounded-xl shadow-lg">
      <h2 className="text-3xl font-bold mb-6 text-slate-800 dark:text-white">Developer Tools</h2>
      
      {/* Tabs */}
      <div className="flex flex-wrap gap-2 mb-6 border-b border-slate-200 dark:border-slate-700">
        {[
          { id: 'JSON', label: 'JSON Formatter', icon: Code },
          { id: 'BASE64', label: 'Base64', icon: Code },
          { id: 'HASH', label: 'Hash Generator', icon: Hash },
          { id: 'URL', label: 'URL Encoder', icon: LinkIcon },
          { id: 'TIMESTAMP', label: 'Timestamp', icon: Clock },
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2 rounded-t-lg flex items-center gap-2 transition-all ${
                activeTab === tab.id
                  ? 'bg-indigo-600 text-white'
                  : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
              }`}
            >
              <Icon size={16} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* JSON Formatter */}
      {activeTab === 'JSON' && <JSONFormatter copyToClipboard={copyToClipboard} copied={copied} />}
      
      {/* Base64 */}
      {activeTab === 'BASE64' && <Base64Tool copyToClipboard={copyToClipboard} copied={copied} />}
      
      {/* Hash Generator */}
      {activeTab === 'HASH' && <HashGenerator copyToClipboard={copyToClipboard} copied={copied} />}
      
      {/* URL Encoder */}
      {activeTab === 'URL' && <URLTool copyToClipboard={copyToClipboard} copied={copied} />}
      
      {/* Timestamp */}
      {activeTab === 'TIMESTAMP' && <TimestampTool copyToClipboard={copyToClipboard} copied={copied} />}
    </div>
  );
};

// JSON Formatter Component
const JSONFormatter: React.FC<{ copyToClipboard: (text: string) => void; copied: boolean }> = ({ copyToClipboard, copied }) => {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');

  const formatJSON = () => {
    try {
      const parsed = JSON.parse(input);
      const formatted = JSON.stringify(parsed, null, 2);
      setOutput(formatted);
      setError('');
    } catch (e: any) {
      setError(e.message);
      setOutput('');
    }
  };

  const minifyJSON = () => {
    try {
      const parsed = JSON.parse(input);
      const minified = JSON.stringify(parsed);
      setOutput(minified);
      setError('');
    } catch (e: any) {
      setError(e.message);
      setOutput('');
    }
  };

  return (
    <div className="space-y-4">
      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder='{"name": "John", "age": 30}'
        className="w-full h-40 p-4 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 text-slate-800 dark:text-white font-mono text-sm"
      />
      <div className="flex gap-3">
        <button onClick={formatJSON} className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
          Format
        </button>
        <button onClick={minifyJSON} className="px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700">
          Minify
        </button>
      </div>
      {error && (
        <div className="flex items-center gap-2 p-3 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-lg">
          <AlertCircle size={18} />
          <span className="text-sm">{error}</span>
        </div>
      )}
      {output && (
        <div className="relative">
          <textarea
            value={output}
            readOnly
            className="w-full h-40 p-4 border border-slate-300 dark:border-slate-600 rounded-lg bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-white font-mono text-sm"
          />
          <button
            onClick={() => copyToClipboard(output)}
            className="absolute top-2 right-2 p-2 bg-white dark:bg-slate-700 rounded hover:bg-slate-100 dark:hover:bg-slate-600"
          >
            {copied ? <Check size={18} className="text-green-600" /> : <Copy size={18} />}
          </button>
        </div>
      )}
    </div>
  );
};

// Base64 Tool
const Base64Tool: React.FC<{ copyToClipboard: (text: string) => void; copied: boolean }> = ({ copyToClipboard, copied }) => {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [mode, setMode] = useState<'encode' | 'decode'>('encode');

  const process = () => {
    try {
      if (mode === 'encode') {
        const encoded = btoa(input);
        setOutput(encoded);
      } else {
        const decoded = atob(input);
        setOutput(decoded);
      }
    } catch (e) {
      setOutput('Invalid input');
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-3 mb-4">
        <button
          onClick={() => setMode('encode')}
          className={`px-4 py-2 rounded-lg ${mode === 'encode' ? 'bg-indigo-600 text-white' : 'bg-slate-200 dark:bg-slate-700'}`}
        >
          Encode
        </button>
        <button
          onClick={() => setMode('decode')}
          className={`px-4 py-2 rounded-lg ${mode === 'decode' ? 'bg-indigo-600 text-white' : 'bg-slate-200 dark:bg-slate-700'}`}
        >
          Decode
        </button>
      </div>
      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder={mode === 'encode' ? 'Enter text to encode' : 'Enter Base64 to decode'}
        className="w-full h-32 p-4 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 text-slate-800 dark:text-white"
      />
      <button onClick={process} className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
        {mode === 'encode' ? 'Encode' : 'Decode'}
      </button>
      {output && (
        <div className="relative">
          <textarea
            value={output}
            readOnly
            className="w-full h-32 p-4 border border-slate-300 dark:border-slate-600 rounded-lg bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-white"
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

// Hash Generator
const HashGenerator: React.FC<{ copyToClipboard: (text: string) => void; copied: boolean }> = ({ copyToClipboard, copied }) => {
  const [input, setInput] = useState('');
  const [hashes, setHashes] = useState<{ md5: string; sha1: string; sha256: string } | null>(null);

  const generateHashes = async () => {
    if (!input) return;
    
    const encoder = new TextEncoder();
    const data = encoder.encode(input);
    
    const sha256Buffer = await crypto.subtle.digest('SHA-256', data);
    const sha256 = Array.from(new Uint8Array(sha256Buffer)).map(b => b.toString(16).padStart(2, '0')).join('');
    
    const sha1Buffer = await crypto.subtle.digest('SHA-1', data);
    const sha1 = Array.from(new Uint8Array(sha1Buffer)).map(b => b.toString(16).padStart(2, '0')).join('');
    
    setHashes({ md5: 'MD5 not available in browser', sha1, sha256 });
  };

  return (
    <div className="space-y-4">
      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Enter text to hash"
        className="w-full h-32 p-4 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 text-slate-800 dark:text-white"
      />
      <button onClick={generateHashes} className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
        Generate Hashes
      </button>
      {hashes && (
        <div className="space-y-3">
          {Object.entries(hashes).map(([algo, hash]) => (
            <div key={algo} className="relative p-4 bg-slate-50 dark:bg-slate-900 rounded-lg">
              <div className="text-sm font-semibold text-slate-600 dark:text-slate-400 mb-1">{algo.toUpperCase()}</div>
              <div className="font-mono text-xs text-slate-800 dark:text-white break-all">{hash}</div>
              <button
                onClick={() => copyToClipboard(hash)}
                className="absolute top-3 right-3 p-2 bg-white dark:bg-slate-700 rounded hover:bg-slate-100"
              >
                {copied ? <Check size={16} className="text-green-600" /> : <Copy size={16} />}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// URL Tool
const URLTool: React.FC<{ copyToClipboard: (text: string) => void; copied: boolean }> = ({ copyToClipboard, copied }) => {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [mode, setMode] = useState<'encode' | 'decode'>('encode');

  const process = () => {
    try {
      if (mode === 'encode') {
        setOutput(encodeURIComponent(input));
      } else {
        setOutput(decodeURIComponent(input));
      }
    } catch (e) {
      setOutput('Invalid input');
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-3 mb-4">
        <button
          onClick={() => setMode('encode')}
          className={`px-4 py-2 rounded-lg ${mode === 'encode' ? 'bg-indigo-600 text-white' : 'bg-slate-200 dark:bg-slate-700'}`}
        >
          Encode
        </button>
        <button
          onClick={() => setMode('decode')}
          className={`px-4 py-2 rounded-lg ${mode === 'decode' ? 'bg-indigo-600 text-white' : 'bg-slate-200 dark:bg-slate-700'}`}
        >
          Decode
        </button>
      </div>
      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder={mode === 'encode' ? 'Enter URL to encode' : 'Enter encoded URL to decode'}
        className="w-full h-32 p-4 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 text-slate-800 dark:text-white"
      />
      <button onClick={process} className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
        {mode === 'encode' ? 'Encode' : 'Decode'}
      </button>
      {output && (
        <div className="relative">
          <textarea
            value={output}
            readOnly
            className="w-full h-32 p-4 border border-slate-300 dark:border-slate-600 rounded-lg bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-white"
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

// Timestamp Tool
const TimestampTool: React.FC<{ copyToClipboard: (text: string) => void; copied: boolean }> = ({ copyToClipboard, copied }) => {
  const [timestamp, setTimestamp] = useState(Date.now());
  const [customDate, setCustomDate] = useState('');
  const [result, setResult] = useState('');

  const convertToDate = () => {
    const date = new Date(parseInt(timestamp.toString()));
    setResult(date.toLocaleString());
  };

  const convertToTimestamp = () => {
    const date = new Date(customDate);
    setResult(date.getTime().toString());
  };

  return (
    <div className="space-y-6">
      <div className="p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg">
        <div className="text-sm text-slate-600 dark:text-slate-400 mb-1">Current Timestamp</div>
        <div className="text-2xl font-bold text-slate-800 dark:text-white font-mono">{Date.now()}</div>
      </div>
      
      <div className="space-y-3">
        <h4 className="font-semibold text-slate-700 dark:text-slate-300">Timestamp to Date</h4>
        <input
          type="number"
          value={timestamp}
          onChange={(e) => setTimestamp(parseInt(e.target.value) || 0)}
          placeholder="Enter timestamp"
          className="w-full p-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 text-slate-800 dark:text-white"
        />
        <button onClick={convertToDate} className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
          Convert to Date
        </button>
      </div>

      <div className="space-y-3">
        <h4 className="font-semibold text-slate-700 dark:text-slate-300">Date to Timestamp</h4>
        <input
          type="datetime-local"
          value={customDate}
          onChange={(e) => setCustomDate(e.target.value)}
          className="w-full p-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 text-slate-800 dark:text-white"
        />
        <button onClick={convertToTimestamp} className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
          Convert to Timestamp
        </button>
      </div>

      {result && (
        <div className="relative p-4 bg-slate-50 dark:bg-slate-900 rounded-lg">
          <div className="text-lg font-mono text-slate-800 dark:text-white">{result}</div>
          <button
            onClick={() => copyToClipboard(result)}
            className="absolute top-3 right-3 p-2 bg-white dark:bg-slate-700 rounded hover:bg-slate-100"
          >
            {copied ? <Check size={16} className="text-green-600" /> : <Copy size={16} />}
          </button>
        </div>
      )}
    </div>
  );
};

export default DeveloperTools;
