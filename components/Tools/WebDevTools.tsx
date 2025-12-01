import React, { useState } from 'react';
import { FileCode2, Braces, Paintbrush, Copy, Check, Download } from 'lucide-react';

type WebDevTab = 'HTML_FORMAT' | 'CSS_MINIFY' | 'CSS_GRADIENT' | 'BOX_SHADOW' | 'HTML_ENTITY';

const WebDevTools: React.FC = () => {
  const [activeTab, setActiveTab] = useState<WebDevTab>('HTML_FORMAT');
  const [copied, setCopied] = useState(false);

  // HTML Formatter State
  const [htmlInput, setHtmlInput] = useState('');
  const [formattedHtml, setFormattedHtml] = useState('');

  // CSS Minifier State
  const [cssInput, setCssInput] = useState('');
  const [minifiedCss, setMinifiedCss] = useState('');

  // CSS Gradient Generator State
  const [gradientType, setGradientType] = useState<'linear' | 'radial'>('linear');
  const [gradientAngle, setGradientAngle] = useState(90);
  const [color1, setColor1] = useState('#667eea');
  const [color2, setColor2] = useState('#764ba2');
  const [gradientCss, setGradientCss] = useState('');

  // Box Shadow Generator State
  const [shadowX, setShadowX] = useState(0);
  const [shadowY, setShadowY] = useState(10);
  const [shadowBlur, setShadowBlur] = useState(25);
  const [shadowSpread, setShadowSpread] = useState(0);
  const [shadowColor, setShadowColor] = useState('#000000');
  const [shadowOpacity, setShadowOpacity] = useState(0.3);
  const [boxShadowCss, setBoxShadowCss] = useState('');

  // HTML Entity Encoder State
  const [entityInput, setEntityInput] = useState('');
  const [entityOutput, setEntityOutput] = useState('');
  const [encodeMode, setEncodeMode] = useState<'encode' | 'decode'>('encode');

  // HTML Formatter Logic
  const formatHtml = () => {
    try {
      let formatted = htmlInput;
      formatted = formatted.replace(/></g, '>\n<');
      
      const lines = formatted.split('\n');
      let indent = 0;
      const indentedLines = lines.map(line => {
        const trimmed = line.trim();
        if (trimmed.startsWith('</')) indent = Math.max(0, indent - 1);
        const indented = '  '.repeat(indent) + trimmed;
        if (trimmed.startsWith('<') && !trimmed.startsWith('</') && !trimmed.endsWith('/>')) {
          indent++;
        }
        return indented;
      });
      
      setFormattedHtml(indentedLines.join('\n'));
    } catch (e) {
      setFormattedHtml('Error formatting HTML');
    }
  };

  // CSS Minifier Logic
  const minifyCss = () => {
    try {
      let minified = cssInput;
      minified = minified.replace(/\/\*[\s\S]*?\*\//g, ''); // Remove comments
      minified = minified.replace(/\s+/g, ' '); // Replace multiple spaces
      minified = minified.replace(/\s*{\s*/g, '{'); // Remove spaces around {
      minified = minified.replace(/\s*}\s*/g, '}'); // Remove spaces around }
      minified = minified.replace(/\s*:\s*/g, ':'); // Remove spaces around :
      minified = minified.replace(/\s*;\s*/g, ';'); // Remove spaces around ;
      minified = minified.trim();
      setMinifiedCss(minified);
    } catch (e) {
      setMinifiedCss('Error minifying CSS');
    }
  };

  // CSS Gradient Generator
  React.useEffect(() => {
    if (gradientType === 'linear') {
      setGradientCss(`background: linear-gradient(${gradientAngle}deg, ${color1}, ${color2});`);
    } else {
      setGradientCss(`background: radial-gradient(circle, ${color1}, ${color2});`);
    }
  }, [gradientType, gradientAngle, color1, color2]);

  // Box Shadow Generator
  React.useEffect(() => {
    const hexToRgb = (hex: string) => {
      const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
      return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
      } : { r: 0, g: 0, b: 0 };
    };
    
    const rgb = hexToRgb(shadowColor);
    setBoxShadowCss(`box-shadow: ${shadowX}px ${shadowY}px ${shadowBlur}px ${shadowSpread}px rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${shadowOpacity});`);
  }, [shadowX, shadowY, shadowBlur, shadowSpread, shadowColor, shadowOpacity]);

  // HTML Entity Encoder/Decoder
  const processEntity = () => {
    if (encodeMode === 'encode') {
      const encoded = entityInput
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
      setEntityOutput(encoded);
    } else {
      const decoded = entityInput
        .replace(/&amp;/g, '&')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'");
      setEntityOutput(decoded);
    }
  };

  React.useEffect(() => {
    if (entityInput) processEntity();
  }, [entityInput, encodeMode]);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-6xl mx-auto animate-fade-in">
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 overflow-hidden">
        <div className="p-6 border-b border-slate-200 dark:border-slate-700 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-slate-900 dark:to-slate-800">
          <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
            <FileCode2 className="text-purple-600" /> Web Development Tools
          </h2>
          
          <div className="flex flex-wrap gap-2">
            {[
              { id: 'HTML_FORMAT', label: 'HTML Formatter', icon: FileCode2 },
              { id: 'CSS_MINIFY', label: 'CSS Minifier', icon: Braces },
              { id: 'CSS_GRADIENT', label: 'Gradient Generator', icon: Paintbrush },
              { id: 'BOX_SHADOW', label: 'Box Shadow', icon: Paintbrush },
              { id: 'HTML_ENTITY', label: 'Entity Encoder', icon: Braces },
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as WebDevTab)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                    activeTab === tab.id
                      ? 'bg-purple-600 text-white shadow-lg'
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
          {activeTab === 'HTML_FORMAT' && (
            <div className="space-y-6">
              <h3 className="text-xl font-bold text-slate-800 dark:text-white">HTML Beautifier</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-slate-500 uppercase mb-2">HTML Input</label>
                  <textarea
                    value={htmlInput}
                    onChange={(e) => setHtmlInput(e.target.value)}
                    placeholder="<div><h1>Title</h1><p>Content</p></div>"
                    className="w-full h-80 p-4 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-purple-500 outline-none resize-none font-mono text-sm"
                  />
                  <button
                    onClick={formatHtml}
                    className="mt-4 w-full py-3 bg-purple-600 text-white rounded-lg font-bold hover:bg-purple-700 transition-all"
                  >
                    Format HTML
                  </button>
                </div>
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="block text-sm font-bold text-slate-500 uppercase">Formatted Output</label>
                    {formattedHtml && (
                      <button
                        onClick={() => copyToClipboard(formattedHtml)}
                        className="text-purple-600 text-sm flex items-center gap-1 hover:text-purple-700"
                      >
                        {copied ? <Check size={14} /> : <Copy size={14} />} {copied ? 'Copied!' : 'Copy'}
                      </button>
                    )}
                  </div>
                  <pre className="w-full h-80 p-4 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 overflow-auto font-mono text-sm text-slate-700 dark:text-slate-300">
                    {formattedHtml || 'Formatted HTML will appear here...'}
                  </pre>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'CSS_MINIFY' && (
            <div className="space-y-6">
              <h3 className="text-xl font-bold text-slate-800 dark:text-white">CSS Minifier</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-slate-500 uppercase mb-2">CSS Input</label>
                  <textarea
                    value={cssInput}
                    onChange={(e) => setCssInput(e.target.value)}
                    placeholder=".class {&#10;  color: red;&#10;  font-size: 16px;&#10;}"
                    className="w-full h-80 p-4 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-purple-500 outline-none resize-none font-mono text-sm"
                  />
                  <button
                    onClick={minifyCss}
                    className="mt-4 w-full py-3 bg-purple-600 text-white rounded-lg font-bold hover:bg-purple-700 transition-all"
                  >
                    Minify CSS
                  </button>
                </div>
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="block text-sm font-bold text-slate-500 uppercase">Minified Output</label>
                    {minifiedCss && (
                      <button
                        onClick={() => copyToClipboard(minifiedCss)}
                        className="text-purple-600 text-sm flex items-center gap-1 hover:text-purple-700"
                      >
                        {copied ? <Check size={14} /> : <Copy size={14} />} {copied ? 'Copied!' : 'Copy'}
                      </button>
                    )}
                  </div>
                  <div className="p-4 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 h-80 overflow-auto">
                    <code className="font-mono text-sm text-slate-700 dark:text-slate-300 break-all">
                      {minifiedCss || 'Minified CSS will appear here...'}
                    </code>
                  </div>
                  {minifiedCss && (
                    <div className="mt-4 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700 rounded-lg">
                      <p className="text-sm text-green-700 dark:text-green-400">
                        <strong>Saved:</strong> {cssInput.length - minifiedCss.length} characters ({Math.round((1 - minifiedCss.length / cssInput.length) * 100)}% reduction)
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'CSS_GRADIENT' && (
            <div className="space-y-6">
              <h3 className="text-xl font-bold text-slate-800 dark:text-white">CSS Gradient Generator</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-bold text-slate-500 uppercase mb-2">Gradient Type</label>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setGradientType('linear')}
                        className={`flex-1 py-2 rounded-lg font-bold transition-all ${gradientType === 'linear' ? 'bg-purple-600 text-white' : 'bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-300'}`}
                      >
                        Linear
                      </button>
                      <button
                        onClick={() => setGradientType('radial')}
                        className={`flex-1 py-2 rounded-lg font-bold transition-all ${gradientType === 'radial' ? 'bg-purple-600 text-white' : 'bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-300'}`}
                      >
                        Radial
                      </button>
                    </div>
                  </div>
                  
                  {gradientType === 'linear' && (
                    <div>
                      <label className="block text-sm font-bold text-slate-500 uppercase mb-2">Angle: {gradientAngle}°</label>
                      <input
                        type="range"
                        min="0"
                        max="360"
                        value={gradientAngle}
                        onChange={(e) => setGradientAngle(Number(e.target.value))}
                        className="w-full"
                      />
                    </div>
                  )}
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-bold text-slate-500 uppercase mb-2">Color 1</label>
                      <input
                        type="color"
                        value={color1}
                        onChange={(e) => setColor1(e.target.value)}
                        className="w-full h-12 rounded-lg cursor-pointer"
                      />
                      <input
                        type="text"
                        value={color1}
                        onChange={(e) => setColor1(e.target.value)}
                        className="w-full mt-2 p-2 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 font-mono text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-slate-500 uppercase mb-2">Color 2</label>
                      <input
                        type="color"
                        value={color2}
                        onChange={(e) => setColor2(e.target.value)}
                        className="w-full h-12 rounded-lg cursor-pointer"
                      />
                      <input
                        type="text"
                        value={color2}
                        onChange={(e) => setColor2(e.target.value)}
                        className="w-full mt-2 p-2 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 font-mono text-sm"
                      />
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-bold text-slate-500 uppercase mb-2">Preview</label>
                    <div 
                      className="w-full h-64 rounded-lg border-4 border-slate-300 dark:border-slate-600"
                      style={{ 
                        background: gradientType === 'linear' 
                          ? `linear-gradient(${gradientAngle}deg, ${color1}, ${color2})`
                          : `radial-gradient(circle, ${color1}, ${color2})`
                      }}
                    />
                  </div>
                  
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <label className="block text-sm font-bold text-slate-500 uppercase">CSS Code</label>
                      <button
                        onClick={() => copyToClipboard(gradientCss)}
                        className="text-purple-600 text-sm flex items-center gap-1 hover:text-purple-700"
                      >
                        {copied ? <Check size={14} /> : <Copy size={14} />} {copied ? 'Copied!' : 'Copy'}
                      </button>
                    </div>
                    <code className="block p-4 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 font-mono text-sm text-slate-700 dark:text-slate-300">
                      {gradientCss}
                    </code>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'BOX_SHADOW' && (
            <div className="space-y-6">
              <h3 className="text-xl font-bold text-slate-800 dark:text-white">Box Shadow Generator</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-bold text-slate-500 uppercase mb-2">X Offset: {shadowX}px</label>
                      <input
                        type="range"
                        min="-50"
                        max="50"
                        value={shadowX}
                        onChange={(e) => setShadowX(Number(e.target.value))}
                        className="w-full"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-slate-500 uppercase mb-2">Y Offset: {shadowY}px</label>
                      <input
                        type="range"
                        min="-50"
                        max="50"
                        value={shadowY}
                        onChange={(e) => setShadowY(Number(e.target.value))}
                        className="w-full"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-slate-500 uppercase mb-2">Blur: {shadowBlur}px</label>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={shadowBlur}
                        onChange={(e) => setShadowBlur(Number(e.target.value))}
                        className="w-full"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-slate-500 uppercase mb-2">Spread: {shadowSpread}px</label>
                      <input
                        type="range"
                        min="-50"
                        max="50"
                        value={shadowSpread}
                        onChange={(e) => setShadowSpread(Number(e.target.value))}
                        className="w-full"
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-bold text-slate-500 uppercase mb-2">Shadow Color</label>
                      <input
                        type="color"
                        value={shadowColor}
                        onChange={(e) => setShadowColor(e.target.value)}
                        className="w-full h-12 rounded-lg cursor-pointer"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-slate-500 uppercase mb-2">Opacity: {shadowOpacity}</label>
                      <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.01"
                        value={shadowOpacity}
                        onChange={(e) => setShadowOpacity(Number(e.target.value))}
                        className="w-full mt-3"
                      />
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-bold text-slate-500 uppercase mb-2">Preview</label>
                    <div className="w-full h-64 rounded-lg bg-slate-100 dark:bg-slate-900 flex items-center justify-center p-8">
                      <div 
                        className="w-48 h-48 rounded-lg bg-white dark:bg-slate-800"
                        style={{ boxShadow: boxShadowCss.split(': ')[1].replace(';', '') }}
                      />
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <label className="block text-sm font-bold text-slate-500 uppercase">CSS Code</label>
                      <button
                        onClick={() => copyToClipboard(boxShadowCss)}
                        className="text-purple-600 text-sm flex items-center gap-1 hover:text-purple-700"
                      >
                        {copied ? <Check size={14} /> : <Copy size={14} />} {copied ? 'Copied!' : 'Copy'}
                      </button>
                    </div>
                    <code className="block p-4 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 font-mono text-sm text-slate-700 dark:text-slate-300">
                      {boxShadowCss}
                    </code>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'HTML_ENTITY' && (
            <div className="space-y-6">
              <h3 className="text-xl font-bold text-slate-800 dark:text-white">HTML Entity Encoder/Decoder</h3>
              <div className="flex gap-2 mb-4">
                <button
                  onClick={() => setEncodeMode('encode')}
                  className={`px-6 py-2 rounded-lg font-bold transition-all ${encodeMode === 'encode' ? 'bg-purple-600 text-white' : 'bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-300'}`}
                >
                  Encode
                </button>
                <button
                  onClick={() => setEncodeMode('decode')}
                  className={`px-6 py-2 rounded-lg font-bold transition-all ${encodeMode === 'decode' ? 'bg-purple-600 text-white' : 'bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-300'}`}
                >
                  Decode
                </button>
              </div>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-slate-500 uppercase mb-2">Input</label>
                  <textarea
                    value={entityInput}
                    onChange={(e) => setEntityInput(e.target.value)}
                    placeholder={encodeMode === 'encode' ? '<div class="test">Hello & Welcome</div>' : '&lt;div class=&quot;test&quot;&gt;Hello &amp; Welcome&lt;/div&gt;'}
                    className="w-full h-80 p-4 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-purple-500 outline-none resize-none font-mono text-sm"
                  />
                </div>
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="block text-sm font-bold text-slate-500 uppercase">Output</label>
                    {entityOutput && (
                      <button
                        onClick={() => copyToClipboard(entityOutput)}
                        className="text-purple-600 text-sm flex items-center gap-1 hover:text-purple-700"
                      >
                        {copied ? <Check size={14} /> : <Copy size={14} />} {copied ? 'Copied!' : 'Copy'}
                      </button>
                    )}
                  </div>
                  <div className="w-full h-80 p-4 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 overflow-auto font-mono text-sm text-slate-700 dark:text-slate-300 whitespace-pre-wrap break-all">
                    {entityOutput || 'Output will appear here...'}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WebDevTools;
