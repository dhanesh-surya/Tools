import React, { useState } from 'react';
import { Type, Heart, Copy, RefreshCw } from 'lucide-react';

const FontPairingTool: React.FC = () => {
  const [selectedHeading, setSelectedHeading] = useState('Inter');
  const [selectedBody, setSelectedBody] = useState('Inter');
  const [sampleText, setSampleText] = useState('The quick brown fox jumps over the lazy dog');
  const [favorites, setFavorites] = useState<string[]>([]);

  const fontPairs = [
    { heading: 'Inter', body: 'Inter', category: 'Sans-serif' },
    { heading: 'Poppins', body: 'Inter', category: 'Sans-serif' },
    { heading: 'Playfair Display', body: 'Inter', category: 'Serif + Sans' },
    { heading: 'Montserrat', body: 'Open Sans', category: 'Sans-serif' },
    { heading: 'Oswald', body: 'Lato', category: 'Display + Sans' },
    { heading: 'Roboto Slab', body: 'Roboto', category: 'Serif + Sans' },
    { heading: 'Cinzel', body: 'Source Sans Pro', category: 'Display + Sans' },
    { heading: 'Nunito', body: 'Nunito Sans', category: 'Rounded' },
    { heading: 'Abril Fatface', body: 'Poppins', category: 'Display + Sans' },
    { heading: 'Crimson Text', body: 'Inter', category: 'Serif + Sans' },
    { heading: 'Bebas Neue', body: 'Roboto', category: 'Display + Sans' },
    { heading: 'Dancing Script', body: 'Montserrat', category: 'Script + Sans' },
  ];

  const googleFonts = [
    'Inter', 'Poppins', 'Playfair Display', 'Montserrat', 'Oswald', 'Roboto Slab',
    'Roboto', 'Cinzel', 'Nunito', 'Nunito Sans', 'Abril Fatface', 'Crimson Text',
    'Bebas Neue', 'Dancing Script', 'Open Sans', 'Lato', 'Source Sans Pro'
  ];

  const toggleFavorite = (pair: string) => {
    setFavorites(prev =>
      prev.includes(pair)
        ? prev.filter(f => f !== pair)
        : [...prev, pair]
    );
  };

  const copyCSS = (heading: string, body: string) => {
    const css = `/* Heading Font */
@import url('https://fonts.googleapis.com/css2?family=${heading.replace(' ', '+')}:wght@400;500;600;700&display=swap');

/* Body Font */
@import url('https://fonts.googleapis.com/css2?family=${body.replace(' ', '+')}:wght@400;500;600&display=swap');

body {
  font-family: '${body}', sans-serif;
}

h1, h2, h3, h4, h5, h6 {
  font-family: '${heading}', serif;
}`;
    navigator.clipboard.writeText(css);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-200">Font Pairing Tool</h3>
        <div className="flex gap-2">
          <select
            value={selectedHeading}
            onChange={(e) => setSelectedHeading(e.target.value)}
            className="px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100"
          >
            {googleFonts.map(font => (
              <option key={font} value={font}>{font}</option>
            ))}
          </select>
          <span className="text-slate-500 dark:text-slate-400 self-center">+</span>
          <select
            value={selectedBody}
            onChange={(e) => setSelectedBody(e.target.value)}
            className="px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100"
          >
            {googleFonts.map(font => (
              <option key={font} value={font}>{font}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Sample Text Input */}
      <div>
        <label className="block text-sm font-medium mb-2 text-slate-700 dark:text-slate-300">Sample Text</label>
        <textarea
          value={sampleText}
          onChange={(e) => setSampleText(e.target.value)}
          rows={3}
          className="w-full p-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100"
          placeholder="Enter text to preview fonts..."
        />
      </div>

      {/* Custom Pair Preview */}
      <div className="bg-white dark:bg-slate-800 rounded-lg p-6 shadow-sm border border-slate-200 dark:border-slate-700">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-lg font-semibold text-slate-800 dark:text-slate-200">Custom Pair</h4>
          <div className="flex gap-2">
            <button
              onClick={() => copyCSS(selectedHeading, selectedBody)}
              className="flex items-center gap-2 px-3 py-1 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded hover:bg-slate-200 dark:hover:bg-slate-600"
            >
              <Copy size={16} />
              CSS
            </button>
            <button
              onClick={() => toggleFavorite(`${selectedHeading}+${selectedBody}`)}
              className={`p-2 rounded ${favorites.includes(`${selectedHeading}+${selectedBody}`) ? 'text-red-500 bg-red-50 dark:bg-red-900/20' : 'text-slate-400 hover:text-red-500'}`}
            >
              <Heart size={16} fill={favorites.includes(`${selectedHeading}+${selectedBody}`) ? 'currentColor' : 'none'} />
            </button>
          </div>
        </div>
        <div className="space-y-4">
          <h1
            className="text-3xl font-bold"
            style={{ fontFamily: `'${selectedHeading}', serif` }}
          >
            {sampleText.split('.')[0] || sampleText}
          </h1>
          <p
            className="text-lg leading-relaxed"
            style={{ fontFamily: `'${selectedBody}', sans-serif` }}
          >
            {sampleText}
          </p>
        </div>
        <div className="mt-4 text-sm text-slate-500 dark:text-slate-400">
          Heading: {selectedHeading} | Body: {selectedBody}
        </div>
      </div>

      {/* Popular Font Pairs */}
      <div>
        <h4 className="text-lg font-semibold mb-4 text-slate-800 dark:text-slate-200">Popular Font Pairs</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {fontPairs.map((pair, index) => (
            <div key={index} className="bg-white dark:bg-slate-800 rounded-lg p-4 shadow-sm border border-slate-200 dark:border-slate-700">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded text-slate-600 dark:text-slate-400">
                  {pair.category}
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={() => copyCSS(pair.heading, pair.body)}
                    className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                    title="Copy CSS"
                  >
                    <Copy size={14} />
                  </button>
                  <button
                    onClick={() => toggleFavorite(`${pair.heading}+${pair.body}`)}
                    className={`p-1 ${favorites.includes(`${pair.heading}+${pair.body}`) ? 'text-red-500' : 'text-slate-400 hover:text-red-500'}`}
                  >
                    <Heart size={14} fill={favorites.includes(`${pair.heading}+${pair.body}`) ? 'currentColor' : 'none'} />
                  </button>
                </div>
              </div>
              <div className="space-y-2">
                <h3
                  className="text-xl font-bold"
                  style={{ fontFamily: `'${pair.heading}', serif` }}
                >
                  {sampleText.split('.')[0] || sampleText}
                </h3>
                <p
                  className="text-sm leading-relaxed text-slate-600 dark:text-slate-400"
                  style={{ fontFamily: `'${pair.body}', sans-serif` }}
                >
                  {sampleText}
                </p>
              </div>
              <div className="mt-3 text-xs text-slate-500 dark:text-slate-400">
                {pair.heading} + {pair.body}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Favorites */}
      {favorites.length > 0 && (
        <div>
          <h4 className="text-lg font-semibold mb-4 text-slate-800 dark:text-slate-200">Your Favorites</h4>
          <div className="flex flex-wrap gap-2">
            {favorites.map((pair, index) => {
              const [heading, body] = pair.split('+');
              return (
                <div
                  key={index}
                  className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg px-3 py-2 cursor-pointer hover:bg-red-100 dark:hover:bg-red-900/30"
                  onClick={() => {
                    setSelectedHeading(heading);
                    setSelectedBody(body);
                  }}
                >
                  <div className="text-sm font-medium text-red-800 dark:text-red-200">
                    {heading} + {body}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default FontPairingTool;