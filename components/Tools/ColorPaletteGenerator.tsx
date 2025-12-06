import React, { useState } from 'react';
import { Palette, Shuffle, Copy, Download, Eye } from 'lucide-react';

const ColorPaletteGenerator: React.FC = () => {
  const [palettes, setPalettes] = useState<any[]>([]);
  const [selectedPalette, setSelectedPalette] = useState<any>(null);

  const generatePalette = () => {
    const newPalettes = [];
    for (let i = 0; i < 6; i++) {
      const baseHue = Math.random() * 360;
      const palette = {
        id: i,
        colors: [
          { hue: baseHue, saturation: 85, lightness: 55 }, // Primary
          { hue: (baseHue + 30) % 360, saturation: 75, lightness: 65 }, // Secondary
          { hue: (baseHue + 180) % 360, saturation: 70, lightness: 75 }, // Accent
          { hue: (baseHue + 210) % 360, saturation: 40, lightness: 85 }, // Light
          { hue: (baseHue + 270) % 360, saturation: 60, lightness: 35 }, // Dark
        ]
      };
      newPalettes.push(palette);
    }
    setPalettes(newPalettes);
    setSelectedPalette(newPalettes[0]);
  };

  const copyColor = (color: any) => {
    const hex = hslToHex(color.hue, color.saturation, color.lightness);
    navigator.clipboard.writeText(hex);
  };

  const hslToHex = (h: number, s: number, l: number) => {
    l /= 100;
    const a = s * Math.min(l, 1 - l) / 100;
    const f = (n: number) => {
      const k = (n + h / 30) % 12;
      const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
      return Math.round(255 * color).toString(16).padStart(2, '0');
    };
    return `#${f(0)}${f(8)}${f(4)}`;
  };

  const getContrastColor = (lightness: number) => {
    return lightness > 50 ? '#000000' : '#ffffff';
  };

  React.useEffect(() => {
    generatePalette();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-200">Color Palette Generator</h3>
        <button
          onClick={generatePalette}
          className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Shuffle size={18} />
          Generate New
        </button>
      </div>

      {/* Palette Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {palettes.map((palette) => (
          <div
            key={palette.id}
            onClick={() => setSelectedPalette(palette)}
            className={`cursor-pointer rounded-lg overflow-hidden border-2 transition-all ${
              selectedPalette?.id === palette.id ? 'border-primary shadow-lg scale-105' : 'border-slate-200 dark:border-slate-700'
            }`}
          >
            <div className="flex h-20">
              {palette.colors.map((color: any, index: number) => (
                <div
                  key={index}
                  className="flex-1"
                  style={{
                    backgroundColor: `hsl(${color.hue}, ${color.saturation}%, ${color.lightness}%)`
                  }}
                />
              ))}
            </div>
            <div className="p-3 bg-white dark:bg-slate-800">
              <div className="text-xs text-slate-500 dark:text-slate-400">Palette {palette.id + 1}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Selected Palette Details */}
      {selectedPalette && (
        <div className="bg-white dark:bg-slate-800 rounded-lg p-6 shadow-sm border border-slate-200 dark:border-slate-700">
          <h4 className="text-lg font-semibold mb-4 text-slate-800 dark:text-slate-200">Selected Palette</h4>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {selectedPalette.colors.map((color: any, index: number) => {
              const hex = hslToHex(color.hue, color.saturation, color.lightness);
              const contrastColor = getContrastColor(color.lightness);
              return (
                <div key={index} className="space-y-2">
                  <div
                    className="h-24 rounded-lg flex items-center justify-center text-sm font-medium cursor-pointer group relative"
                    style={{
                      backgroundColor: `hsl(${color.hue}, ${color.saturation}%, ${color.lightness}%)`,
                      color: contrastColor
                    }}
                    onClick={() => copyColor(color)}
                  >
                    {hex}
                    <div className="absolute inset-0 bg-black bg-opacity-20 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                      <Copy size={16} className="text-white" />
                    </div>
                  </div>
                  <div className="text-xs text-center space-y-1">
                    <div>HSL({Math.round(color.hue)}, {color.saturation}%, {color.lightness}%)</div>
                    <div className="text-slate-500 dark:text-slate-400">
                      {index === 0 ? 'Primary' : index === 1 ? 'Secondary' : index === 2 ? 'Accent' : index === 3 ? 'Light' : 'Dark'}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-6 flex gap-4">
            <button className="flex items-center gap-2 px-4 py-2 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded hover:bg-slate-200 dark:hover:bg-slate-600">
              <Download size={16} />
              Export CSS
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded hover:bg-slate-200 dark:hover:bg-slate-600">
              <Eye size={16} />
              Preview
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ColorPaletteGenerator;