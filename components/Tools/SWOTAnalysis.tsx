import React, { useState } from 'react';
import { Plus, Trash2, Download, TrendingUp, TrendingDown, Shield, AlertTriangle, BarChart3 } from 'lucide-react';

interface SWOTItem {
  id: string;
  text: string;
}

interface SWOTData {
  strengths: SWOTItem[];
  weaknesses: SWOTItem[];
  opportunities: SWOTItem[];
  threats: SWOTItem[];
}

const SWOTAnalysis: React.FC = () => {
  const [title, setTitle] = useState('My SWOT Analysis');
  const [swot, setSwot] = useState<SWOTData>({
    strengths: [],
    weaknesses: [],
    opportunities: [],
    threats: [],
  });
  const [inputs, setInputs] = useState({ strengths: '', weaknesses: '', opportunities: '', threats: '' });

  const addItem = (category: keyof SWOTData) => {
    if (!inputs[category].trim()) return;

    const newItem: SWOTItem = {
      id: Date.now().toString(),
      text: inputs[category],
    };

    setSwot({ ...swot, [category]: [...swot[category], newItem] });
    setInputs({ ...inputs, [category]: '' });
  };

  const deleteItem = (category: keyof SWOTData, id: string) => {
    setSwot({ ...swot, [category]: swot[category].filter(item => item.id !== id) });
  };

  const exportAnalysis = () => {
    const data = { title, ...swot, createdAt: new Date().toISOString() };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `swot-analysis-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const getTotalItems = () => {
    return Object.values(swot).reduce((sum, items) => sum + items.length, 0);
  };

  const categories = [
    { key: 'strengths' as keyof SWOTData, label: 'Strengths', icon: TrendingUp, color: 'green', description: 'Internal positive factors' },
    { key: 'weaknesses' as keyof SWOTData, label: 'Weaknesses', icon: TrendingDown, color: 'red', description: 'Internal negative factors' },
    { key: 'opportunities' as keyof SWOTData, label: 'Opportunities', icon: Shield, color: 'blue', description: 'External positive factors' },
    { key: 'threats' as keyof SWOTData, label: 'Threats', icon: AlertTriangle, color: 'orange', description: 'External negative factors' },
  ];

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-3">
          <div className="p-4 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl shadow-lg">
            <BarChart3 className="w-10 h-10 text-white" />
          </div>
        </div>
        <h1 className="text-4xl font-bold text-slate-900 dark:text-white">SWOT Analysis</h1>
        <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
          Strategic planning and business analysis framework
        </p>
      </div>

      {/* Title & Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-2 bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-6">
          <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
            Analysis Title
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent font-semibold text-lg"
            placeholder="Enter analysis title..."
          />
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-2xl border border-purple-200 dark:border-purple-800 p-6">
          <div className="text-sm text-purple-700 dark:text-purple-300 font-semibold mb-2">Total Items</div>
          <div className="text-5xl font-bold text-purple-900 dark:text-purple-100">{getTotalItems()}</div>
        </div>
      </div>

      {/* SWOT Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {categories.map(({ key, label, icon: Icon, color, description }) => (
          <div
            key={key}
            className={`bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-6 border-t-4 ${color === 'green' ? 'border-green-500' :
                color === 'red' ? 'border-red-500' :
                  color === 'blue' ? 'border-blue-500' :
                    'border-orange-500'
              }`}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className={`p-3 rounded-xl ${color === 'green' ? 'bg-green-100 dark:bg-green-900/30' :
                  color === 'red' ? 'bg-red-100 dark:bg-red-900/30' :
                    color === 'blue' ? 'bg-blue-100 dark:bg-blue-900/30' :
                      'bg-orange-100 dark:bg-orange-900/30'
                }`}>
                <Icon className={`w-6 h-6 ${color === 'green' ? 'text-green-600' :
                    color === 'red' ? 'text-red-600' :
                      color === 'blue' ? 'text-blue-600' :
                        'text-orange-600'
                  }`} />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">{label}</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">{description}</p>
              </div>
              <span className={`px-3 py-1 rounded-full text-sm font-bold ${color === 'green' ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300' :
                  color === 'red' ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300' :
                    color === 'blue' ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300' :
                      'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300'
                }`}>
                {swot[key].length}
              </span>
            </div>

            <div className="flex gap-2 mb-4">
              <input
                type="text"
                value={inputs[key]}
                onChange={(e) => setInputs({ ...inputs, [key]: e.target.value })}
                onKeyPress={(e) => e.key === 'Enter' && addItem(key)}
                className="flex-1 px-4 py-2 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder={`Add ${label.toLowerCase()}...`}
              />
              <button
                onClick={() => addItem(key)}
                className={`px-4 py-2 rounded-lg font-bold text-white transition-all flex items-center gap-2 ${color === 'green' ? 'bg-green-600 hover:bg-green-700' :
                    color === 'red' ? 'bg-red-600 hover:bg-red-700' :
                      color === 'blue' ? 'bg-blue-600 hover:bg-blue-700' :
                        'bg-orange-600 hover:bg-orange-700'
                  }`}
              >
                <Plus size={18} />
              </button>
            </div>

            <div className="space-y-2 max-h-64 overflow-y-auto">
              {swot[key].length === 0 ? (
                <p className="text-center text-slate-400 dark:text-slate-500 py-8 text-sm">
                  No items added yet
                </p>
              ) : (
                swot[key].map(item => (
                  <div
                    key={item.id}
                    className={`flex items-start gap-3 p-3 rounded-lg ${color === 'green' ? 'bg-green-50 dark:bg-green-900/10' :
                        color === 'red' ? 'bg-red-50 dark:bg-red-900/10' :
                          color === 'blue' ? 'bg-blue-50 dark:bg-blue-900/10' :
                            'bg-orange-50 dark:bg-orange-900/10'
                      }`}
                  >
                    <span className="flex-1 text-sm text-slate-700 dark:text-slate-300">{item.text}</span>
                    <button
                      onClick={() => deleteItem(key, item.id)}
                      className="p-1 hover:bg-red-100 dark:hover:bg-red-900/30 text-red-600 dark:text-red-400 rounded transition-all"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Export */}
      <div className="flex justify-end">
        <button
          onClick={exportAnalysis}
          disabled={getTotalItems() === 0}
          className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:from-slate-400 disabled:to-slate-400 disabled:cursor-not-allowed text-white rounded-xl font-bold shadow-lg transition-all flex items-center gap-2"
        >
          <Download size={20} />
          Export Analysis
        </button>
      </div>

      {/* Tips */}
      <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-2xl border border-purple-200 dark:border-purple-800 p-6">
        <h3 className="text-lg font-bold text-purple-900 dark:text-purple-100 mb-3">💡 SWOT Analysis Tips</h3>
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-purple-800 dark:text-purple-200">
          <li>✓ <strong>Strengths:</strong> What do you do well?</li>
          <li>✓ <strong>Weaknesses:</strong> What could be improved?</li>
          <li>✓ <strong>Opportunities:</strong> What trends could you take advantage of?</li>
          <li>✓ <strong>Threats:</strong> What obstacles do you face?</li>
        </ul>
      </div>
    </div>
  );
};

export default SWOTAnalysis;