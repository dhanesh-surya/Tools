import React, { useState } from 'react';
import { Zap, Download, Copy, RefreshCw, Search } from 'lucide-react';

const IconGenerator: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [style, setStyle] = useState('minimal');
  const [size, setSize] = useState('64');
  const [generatedIcons, setGeneratedIcons] = useState<any[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);

  const iconStyles = [
    { id: 'minimal', name: 'Minimal', description: 'Clean, simple designs' },
    { id: 'flat', name: 'Flat', description: 'Modern flat design' },
    { id: 'outline', name: 'Outline', description: 'Line-based icons' },
    { id: '3d', name: '3D', description: 'Three-dimensional look' },
    { id: 'handdrawn', name: 'Hand Drawn', description: 'Sketchy, artistic style' },
    { id: 'pixel', name: 'Pixel Art', description: 'Retro pixel style' },
  ];

  const sizes = ['32', '48', '64', '128', '256'];

  const generateIcons = async () => {
    if (!prompt.trim()) return;

    setIsGenerating(true);

    // Simulate AI generation (in real implementation, this would call an AI API)
    setTimeout(() => {
      const icons = [];
      for (let i = 0; i < 6; i++) {
        icons.push({
          id: i,
          svg: generateMockIcon(prompt, style, size),
          style,
          size,
          prompt
        });
      }
      setGeneratedIcons(icons);
      setIsGenerating(false);
    }, 2000);
  };

  const generateMockIcon = (prompt: string, style: string, size: string) => {
    // This is a mock SVG generator - in real implementation, this would be AI-generated
    const colors = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];

    // Generate different shapes based on prompt keywords
    let shape = '';
    const lowerPrompt = prompt.toLowerCase();

    if (lowerPrompt.includes('user') || lowerPrompt.includes('person') || lowerPrompt.includes('profile')) {
      shape = `<circle cx="32" cy="24" r="8" fill="${randomColor}"/><path d="M16 40h32v4H16z" fill="${randomColor}"/>`;
    } else if (lowerPrompt.includes('heart') || lowerPrompt.includes('love')) {
      shape = `<path d="M32 48c-8-8-16-12-16-20 0-4 3-8 8-8 3 0 6 2 8 4 2-2 5-4 8-4 5 0 8 4 8 8 0 8-8 12-16 20z" fill="${randomColor}"/>`;
    } else if (lowerPrompt.includes('star')) {
      shape = `<path d="M32 12l6 18h18l-14 10 6 18-16-12-16 12 6-18-14-10h18z" fill="${randomColor}"/>`;
    } else if (lowerPrompt.includes('home') || lowerPrompt.includes('house')) {
      shape = `<path d="M16 32v16h8v-8h16v8h8V32l-16-12z" fill="${randomColor}"/><polygon points="24,20 40,20 40,28 24,28" fill="none" stroke="${randomColor}" stroke-width="2"/>`;
    } else if (lowerPrompt.includes('gear') || lowerPrompt.includes('settings')) {
      shape = `<circle cx="32" cy="32" r="16" fill="none" stroke="${randomColor}" stroke-width="2"/><circle cx="32" cy="32" r="8" fill="${randomColor}"/><path d="M32 16v8M32 40v8M16 32h8M40 32h8" stroke="${randomColor}" stroke-width="2" stroke-linecap="round"/>`;
    } else {
      // Default geometric shape
      shape = `<rect x="20" y="20" width="24" height="24" rx="4" fill="${randomColor}"/><circle cx="32" cy="32" r="6" fill="white"/>`;
    }

    return `<svg width="${size}" height="${size}" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">${shape}</svg>`;
  };

  const downloadIcon = (icon: any) => {
    const blob = new Blob([icon.svg], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `icon-${icon.id}.svg`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const copySVG = (svg: string) => {
    navigator.clipboard.writeText(svg);
  };

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-200">AI Icon Generator</h3>

      {/* Input Section */}
      <div className="bg-white dark:bg-slate-800 rounded-lg p-6 shadow-sm border border-slate-200 dark:border-slate-700">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2 text-slate-700 dark:text-slate-300">
              Describe your icon
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="e.g., a rocket launching into space, minimalist style"
                className="flex-1 p-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100"
                onKeyPress={(e) => e.key === 'Enter' && generateIcons()}
              />
              <button
                onClick={generateIcons}
                disabled={isGenerating || !prompt.trim()}
                className="flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isGenerating ? <RefreshCw size={18} className="animate-spin" /> : <Zap size={18} />}
                {isGenerating ? 'Generating...' : 'Generate'}
              </button>
            </div>
          </div>

          {/* Style and Size Options */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2 text-slate-700 dark:text-slate-300">Style</label>
              <select
                value={style}
                onChange={(e) => setStyle(e.target.value)}
                className="w-full p-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100"
              >
                {iconStyles.map(s => (
                  <option key={s.id} value={s.id}>{s.name} - {s.description}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2 text-slate-700 dark:text-slate-300">Size (px)</label>
              <select
                value={size}
                onChange={(e) => setSize(e.target.value)}
                className="w-full p-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100"
              >
                {sizes.map(s => (
                  <option key={s} value={s}>{s}x{s} px</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Generated Icons */}
      {generatedIcons.length > 0 && (
        <div>
          <h4 className="text-lg font-semibold mb-4 text-slate-800 dark:text-slate-200">Generated Icons</h4>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {generatedIcons.map((icon) => (
              <div key={icon.id} className="bg-white dark:bg-slate-800 rounded-lg p-4 shadow-sm border border-slate-200 dark:border-slate-700">
                <div className="flex flex-col items-center space-y-3">
                  <div
                    className="w-16 h-16 flex items-center justify-center bg-slate-50 dark:bg-slate-900 rounded-lg"
                    dangerouslySetInnerHTML={{ __html: icon.svg }}
                  />
                  <div className="flex gap-1">
                    <button
                      onClick={() => downloadIcon(icon)}
                      className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 rounded"
                      title="Download SVG"
                    >
                      <Download size={16} />
                    </button>
                    <button
                      onClick={() => copySVG(icon.svg)}
                      className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 rounded"
                      title="Copy SVG Code"
                    >
                      <Copy size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tips */}
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
        <h5 className="font-medium text-blue-800 dark:text-blue-200 mb-2">💡 Tips for better results:</h5>
        <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
          <li>• Be specific about the object or concept</li>
          <li>• Mention the mood or style you want</li>
          <li>• Include colors if you have preferences</li>
          <li>• Try different styles for variety</li>
        </ul>
      </div>
    </div>
  );
};

export default IconGenerator;