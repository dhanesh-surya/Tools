import React, { useState } from 'react';
import { FileText, FileSpreadsheet, Presentation, Download, Copy, Check, Table, Upload } from 'lucide-react';

type OfficeTab = 'WORD_COUNTER' | 'EXCEL_FORMULA' | 'PPT_TEMPLATE' | 'CSV_JSON' | 'TABLE_GEN';

const OfficeTools: React.FC = () => {
  const [activeTab, setActiveTab] = useState<OfficeTab>('WORD_COUNTER');
  const [copied, setCopied] = useState(false);

  // Word Counter State
  const [docText, setDocText] = useState('');
  const [wordStats, setWordStats] = useState({ words: 0, chars: 0, charsNoSpace: 0, sentences: 0, paragraphs: 0, readTime: 0 });

  // Excel Formula Helper State
  const [formulaType, setFormulaType] = useState('SUM');
  const [formulaRange, setFormulaRange] = useState('A1:A10');
  const [generatedFormula, setGeneratedFormula] = useState('');

  // CSV to JSON State
  const [csvInput, setCsvInput] = useState('');
  const [jsonOutput, setJsonOutput] = useState('');

  // Table Generator State
  const [rows, setRows] = useState(3);
  const [cols, setCols] = useState(3);
  const [tableType, setTableType] = useState<'MARKDOWN' | 'HTML'>('MARKDOWN');
  const [tableOutput, setTableOutput] = useState('');

  // Word Counter Logic
  const analyzeText = (text: string) => {
    const words = text.trim() ? text.trim().split(/\s+/).length : 0;
    const chars = text.length;
    const charsNoSpace = text.replace(/\s/g, '').length;
    const sentences = text.split(/[.!?]+/).filter(s => s.trim()).length;
    const paragraphs = text.split(/\n\n+/).filter(p => p.trim()).length;
    const readTime = Math.ceil(words / 200); // 200 words per minute
    
    setWordStats({ words, chars, charsNoSpace, sentences, paragraphs, readTime });
  };

  React.useEffect(() => {
    analyzeText(docText);
  }, [docText]);

  // Excel Formula Generator
  const formulaTemplates: Record<string, string> = {
    'SUM': `=SUM(${formulaRange})`,
    'AVERAGE': `=AVERAGE(${formulaRange})`,
    'COUNT': `=COUNT(${formulaRange})`,
    'MAX': `=MAX(${formulaRange})`,
    'MIN': `=MIN(${formulaRange})`,
    'IF': `=IF(A1>0, "Positive", "Negative")`,
    'VLOOKUP': `=VLOOKUP(A1, A:B, 2, FALSE)`,
    'SUMIF': `=SUMIF(A:A, ">100", B:B)`,
    'COUNTIF': `=COUNTIF(${formulaRange}, "criteria")`,
  };

  React.useEffect(() => {
    setGeneratedFormula(formulaTemplates[formulaType] || '');
  }, [formulaType, formulaRange]);

  // CSV to JSON Converter
  const convertCsvToJson = () => {
    try {
      const lines = csvInput.trim().split('\n');
      const headers = lines[0].split(',').map(h => h.trim());
      const result = lines.slice(1).map(line => {
        const values = line.split(',').map(v => v.trim());
        const obj: any = {};
        headers.forEach((header, i) => {
          obj[header] = values[i] || '';
        });
        return obj;
      });
      setJsonOutput(JSON.stringify(result, null, 2));
    } catch (e) {
      setJsonOutput('Error: Invalid CSV format');
    }
  };

  // Table Generator
  const generateTable = () => {
    if (tableType === 'MARKDOWN') {
      let table = '';
      // Header
      table += '| ' + Array(cols).fill('Header').map((h, i) => `${h}${i + 1}`).join(' | ') + ' |\n';
      // Separator
      table += '| ' + Array(cols).fill('---').join(' | ') + ' |\n';
      // Rows
      for (let r = 0; r < rows; r++) {
        table += '| ' + Array(cols).fill('Cell').map((c, i) => `${c} ${r + 1},${i + 1}`).join(' | ') + ' |\n';
      }
      setTableOutput(table);
    } else {
      let table = '<table border="1">\n';
      // Header
      table += '  <thead>\n    <tr>\n';
      for (let c = 0; c < cols; c++) {
        table += `      <th>Header ${c + 1}</th>\n`;
      }
      table += '    </tr>\n  </thead>\n';
      // Body
      table += '  <tbody>\n';
      for (let r = 0; r < rows; r++) {
        table += '    <tr>\n';
        for (let c = 0; c < cols; c++) {
          table += `      <td>Cell ${r + 1},${c + 1}</td>\n`;
        }
        table += '    </tr>\n';
      }
      table += '  </tbody>\n</table>';
      setTableOutput(table);
    }
  };

  React.useEffect(() => {
    generateTable();
  }, [rows, cols, tableType]);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-6xl mx-auto animate-fade-in">
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 overflow-hidden">
        <div className="p-6 border-b border-slate-200 dark:border-slate-700 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-slate-900 dark:to-slate-800">
          <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
            <FileSpreadsheet className="text-blue-600" /> MS Office Tools Suite
          </h2>
          
          <div className="flex flex-wrap gap-2">
            {[
              { id: 'WORD_COUNTER', label: 'Word Counter Pro', icon: FileText },
              { id: 'EXCEL_FORMULA', label: 'Excel Formulas', icon: FileSpreadsheet },
              { id: 'CSV_JSON', label: 'CSV to JSON', icon: FileSpreadsheet },
              { id: 'TABLE_GEN', label: 'Table Generator', icon: Table },
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as OfficeTab)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                    activeTab === tab.id
                      ? 'bg-blue-600 text-white shadow-lg'
                      : 'bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-600'
                  }`}
                >
                  <Icon size={16} />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        <div className="p-6">
          {activeTab === 'WORD_COUNTER' && (
            <div className="space-y-6">
              <h3 className="text-xl font-bold text-slate-800 dark:text-white">Document Analysis</h3>
              <textarea
                value={docText}
                onChange={(e) => setDocText(e.target.value)}
                placeholder="Paste your document text here for detailed analysis..."
                className="w-full h-64 p-4 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-blue-500 outline-none resize-none"
              />
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {[
                  { label: 'Words', value: wordStats.words, color: 'blue' },
                  { label: 'Characters', value: wordStats.chars, color: 'green' },
                  { label: 'No Spaces', value: wordStats.charsNoSpace, color: 'purple' },
                  { label: 'Sentences', value: wordStats.sentences, color: 'orange' },
                  { label: 'Paragraphs', value: wordStats.paragraphs, color: 'pink' },
                  { label: 'Read Time', value: `${wordStats.readTime}m`, color: 'indigo' },
                ].map((stat) => (
                  <div key={stat.label} className={`p-4 rounded-lg bg-${stat.color}-50 dark:bg-${stat.color}-900/20 border border-${stat.color}-200 dark:border-${stat.color}-700`}>
                    <div className={`text-2xl font-bold text-${stat.color}-600`}>{stat.value}</div>
                    <div className="text-xs text-slate-600 dark:text-slate-400 uppercase">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'EXCEL_FORMULA' && (
            <div className="space-y-6">
              <h3 className="text-xl font-bold text-slate-800 dark:text-white">Excel Formula Helper</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-bold text-slate-500 uppercase mb-2">Formula Type</label>
                    <select
                      value={formulaType}
                      onChange={(e) => setFormulaType(e.target.value)}
                      className="w-full p-3 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-blue-500 outline-none"
                    >
                      {Object.keys(formulaTemplates).map(type => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                  </div>
                  {['SUM', 'AVERAGE', 'COUNT', 'MAX', 'MIN', 'COUNTIF'].includes(formulaType) && (
                    <div>
                      <label className="block text-sm font-bold text-slate-500 uppercase mb-2">Cell Range</label>
                      <input
                        type="text"
                        value={formulaRange}
                        onChange={(e) => setFormulaRange(e.target.value)}
                        placeholder="e.g., A1:A10"
                        className="w-full p-3 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-blue-500 outline-none"
                      />
                    </div>
                  )}
                </div>
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="block text-sm font-bold text-slate-500 uppercase">Generated Formula</label>
                    <button
                      onClick={() => copyToClipboard(generatedFormula)}
                      className="text-blue-600 text-sm flex items-center gap-1 hover:text-blue-700"
                    >
                      {copied ? <Check size={14} /> : <Copy size={14} />} {copied ? 'Copied!' : 'Copy'}
                    </button>
                  </div>
                  <div className="p-4 rounded-lg bg-blue-50 dark:bg-blue-900/20 border-2 border-blue-200 dark:border-blue-700 font-mono text-lg font-bold text-blue-700 dark:text-blue-400">
                    {generatedFormula}
                  </div>
                  <div className="mt-4 p-4 bg-slate-50 dark:bg-slate-900 rounded-lg">
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      <strong>How to use:</strong> Copy the formula and paste it into your Excel cell. Adjust cell references as needed.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'CSV_JSON' && (
            <div className="space-y-6">
              <h3 className="text-xl font-bold text-slate-800 dark:text-white">CSV to JSON Converter</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-slate-500 uppercase mb-2">CSV Input</label>
                  <textarea
                    value={csvInput}
                    onChange={(e) => setCsvInput(e.target.value)}
                    placeholder="name,age,city&#10;John,30,NYC&#10;Jane,25,LA"
                    className="w-full h-64 p-4 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-blue-500 outline-none resize-none font-mono text-sm"
                  />
                  <button
                    onClick={convertCsvToJson}
                    className="mt-4 w-full py-3 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 transition-all"
                  >
                    Convert to JSON
                  </button>
                </div>
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="block text-sm font-bold text-slate-500 uppercase">JSON Output</label>
                    {jsonOutput && (
                      <button
                        onClick={() => copyToClipboard(jsonOutput)}
                        className="text-blue-600 text-sm flex items-center gap-1 hover:text-blue-700"
                      >
                        {copied ? <Check size={14} /> : <Copy size={14} />} {copied ? 'Copied!' : 'Copy'}
                      </button>
                    )}
                  </div>
                  <pre className="w-full h-64 p-4 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 overflow-auto font-mono text-sm text-slate-700 dark:text-slate-300">
                    {jsonOutput || 'JSON output will appear here...'}
                  </pre>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'TABLE_GEN' && (
            <div className="space-y-6">
              <h3 className="text-xl font-bold text-slate-800 dark:text-white">Table Generator</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex gap-4">
                    <div className="flex-1">
                      <label className="block text-sm font-bold text-slate-500 uppercase mb-2">Rows</label>
                      <input
                        type="number"
                        min="1"
                        max="20"
                        value={rows}
                        onChange={(e) => setRows(Number(e.target.value))}
                        className="w-full p-3 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-blue-500 outline-none"
                      />
                    </div>
                    <div className="flex-1">
                      <label className="block text-sm font-bold text-slate-500 uppercase mb-2">Columns</label>
                      <input
                        type="number"
                        min="1"
                        max="10"
                        value={cols}
                        onChange={(e) => setCols(Number(e.target.value))}
                        className="w-full p-3 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-blue-500 outline-none"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-500 uppercase mb-2">Table Type</label>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setTableType('MARKDOWN')}
                        className={`flex-1 py-2 rounded-lg font-bold transition-all ${tableType === 'MARKDOWN' ? 'bg-blue-600 text-white' : 'bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-300'}`}
                      >
                        Markdown
                      </button>
                      <button
                        onClick={() => setTableType('HTML')}
                        className={`flex-1 py-2 rounded-lg font-bold transition-all ${tableType === 'HTML' ? 'bg-blue-600 text-white' : 'bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-300'}`}
                      >
                        HTML
                      </button>
                    </div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="block text-sm font-bold text-slate-500 uppercase">Generated Table</label>
                    <button
                      onClick={() => copyToClipboard(tableOutput)}
                      className="text-blue-600 text-sm flex items-center gap-1 hover:text-blue-700"
                    >
                      {copied ? <Check size={14} /> : <Copy size={14} />} {copied ? 'Copied!' : 'Copy'}
                    </button>
                  </div>
                  <pre className="w-full h-64 p-4 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 overflow-auto font-mono text-xs text-slate-700 dark:text-slate-300">
                    {tableOutput}
                  </pre>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OfficeTools;
