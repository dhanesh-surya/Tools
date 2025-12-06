import React, { useState, useRef } from 'react';
import { Image as ImageIcon, Type, Download, Share2, RotateCcw } from 'lucide-react';

const MemeGenerator: React.FC = () => {
  const [selectedTemplate, setSelectedTemplate] = useState<any>(null);
  const [topText, setTopText] = useState('');
  const [bottomText, setBottomText] = useState('');
  const [fontSize, setFontSize] = useState(48);
  const [textColor, setTextColor] = useState('#ffffff');
  const [strokeColor, setStrokeColor] = useState('#000000');
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const memeTemplates = [
    {
      id: 'distracted-boyfriend',
      name: 'Distracted Boyfriend',
      url: 'https://i.imgflip.com/1ur9b0.jpg',
      width: 500,
      height: 500
    },
    {
      id: 'drake',
      name: 'Drake Hotline Bling',
      url: 'https://i.imgflip.com/4/1bgw.jpg',
      width: 500,
      height: 500
    },
    {
      id: 'success-kid',
      name: 'Success Kid',
      url: 'https://i.imgflip.com/1bhk.jpg',
      width: 500,
      height: 500
    },
    {
      id: 'this-is-fine',
      name: 'This is Fine',
      url: 'https://i.imgflip.com/wxica.jpg',
      width: 500,
      height: 500
    },
    {
      id: 'change-my-mind',
      name: 'Change My Mind',
      url: 'https://i.imgflip.com/24y43o.jpg',
      width: 500,
      height: 500
    },
    {
      id: 'expanding-brain',
      name: 'Expanding Brain',
      url: 'https://i.imgflip.com/1jwhww.jpg',
      width: 500,
      height: 500
    },
    {
      id: 'sponge-mock',
      name: 'Mocking SpongeBob',
      url: 'https://i.imgflip.com/1otk.jpg',
      width: 500,
      height: 500
    },
    {
      id: 'two-buttons',
      name: 'Two Buttons',
      url: 'https://i.imgflip.com/1g8my4.jpg',
      width: 500,
      height: 500
    }
  ];

  const generateMeme = () => {
    if (!selectedTemplate || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      canvas.width = selectedTemplate.width;
      canvas.height = selectedTemplate.height;

      // Draw background image
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      // Configure text style
      ctx.font = `bold ${fontSize}px Impact, Arial Black, sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.strokeStyle = strokeColor;
      ctx.lineWidth = 3;
      ctx.fillStyle = textColor;

      // Function to wrap text
      const wrapText = (text: string, maxWidth: number) => {
        const words = text.split(' ');
        const lines = [];
        let currentLine = '';

        for (const word of words) {
          const testLine = currentLine + (currentLine ? ' ' : '') + word;
          const metrics = ctx.measureText(testLine);

          if (metrics.width > maxWidth && currentLine) {
            lines.push(currentLine);
            currentLine = word;
          } else {
            currentLine = testLine;
          }
        }
        lines.push(currentLine);
        return lines;
      };

      // Draw top text
      if (topText) {
        const topLines = wrapText(topText.toUpperCase(), canvas.width - 40);
        const lineHeight = fontSize * 1.2;
        const startY = 50;

        topLines.forEach((line, index) => {
          const y = startY + (index * lineHeight);
          ctx.strokeText(line, canvas.width / 2, y);
          ctx.fillText(line, canvas.width / 2, y);
        });
      }

      // Draw bottom text
      if (bottomText) {
        const bottomLines = wrapText(bottomText.toUpperCase(), canvas.width - 40);
        const lineHeight = fontSize * 1.2;
        const startY = canvas.height - 50 - ((bottomLines.length - 1) * lineHeight);

        bottomLines.forEach((line, index) => {
          const y = startY + (index * lineHeight);
          ctx.strokeText(line, canvas.width / 2, y);
          ctx.fillText(line, canvas.width / 2, y);
        });
      }
    };
    img.src = selectedTemplate.url;
  };

  const downloadMeme = () => {
    if (!canvasRef.current) return;

    const link = document.createElement('a');
    link.download = `meme-${selectedTemplate?.id || 'custom'}.png`;
    link.href = canvasRef.current.toDataURL();
    link.click();
  };

  const resetMeme = () => {
    setTopText('');
    setBottomText('');
    setFontSize(48);
    setTextColor('#ffffff');
    setStrokeColor('#000000');
    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext('2d');
      if (ctx) {
        ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      }
    }
  };

  React.useEffect(() => {
    if (selectedTemplate) {
      generateMeme();
    }
  }, [selectedTemplate, topText, bottomText, fontSize, textColor, strokeColor]);

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-200">Meme Generator</h3>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Controls */}
        <div className="space-y-6">
          {/* Template Selection */}
          <div>
            <h4 className="text-lg font-medium mb-3 text-slate-800 dark:text-slate-200">Choose Template</h4>
            <div className="grid grid-cols-2 gap-3">
              {memeTemplates.map((template) => (
                <div
                  key={template.id}
                  onClick={() => setSelectedTemplate(template)}
                  className={`cursor-pointer rounded-lg overflow-hidden border-2 transition-all ${
                    selectedTemplate?.id === template.id
                      ? 'border-primary shadow-lg'
                      : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
                  }`}
                >
                  <img
                    src={template.url}
                    alt={template.name}
                    className="w-full h-24 object-cover"
                  />
                  <div className="p-2 bg-white dark:bg-slate-800">
                    <div className="text-xs font-medium text-slate-700 dark:text-slate-300 truncate">
                      {template.name}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Text Inputs */}
          {selectedTemplate && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2 text-slate-700 dark:text-slate-300">Top Text</label>
                <input
                  type="text"
                  value={topText}
                  onChange={(e) => setTopText(e.target.value)}
                  placeholder="Enter top text..."
                  className="w-full p-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-slate-700 dark:text-slate-300">Bottom Text</label>
                <input
                  type="text"
                  value={bottomText}
                  onChange={(e) => setBottomText(e.target.value)}
                  placeholder="Enter bottom text..."
                  className="w-full p-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100"
                />
              </div>

              {/* Style Controls */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2 text-slate-700 dark:text-slate-300">Font Size</label>
                  <input
                    type="range"
                    min="24"
                    max="72"
                    value={fontSize}
                    onChange={(e) => setFontSize(parseInt(e.target.value))}
                    className="w-full"
                  />
                  <div className="text-xs text-center mt-1 text-slate-500 dark:text-slate-400">{fontSize}px</div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-slate-700 dark:text-slate-300">Text Color</label>
                  <input
                    type="color"
                    value={textColor}
                    onChange={(e) => setTextColor(e.target.value)}
                    className="w-full h-10 rounded border border-slate-300 dark:border-slate-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-slate-700 dark:text-slate-300">Outline Color</label>
                <input
                  type="color"
                  value={strokeColor}
                  onChange={(e) => setStrokeColor(e.target.value)}
                  className="w-full h-10 rounded border border-slate-300 dark:border-slate-600"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={downloadMeme}
                  className="flex-1 flex items-center justify-center gap-2 bg-primary text-white py-3 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Download size={18} />
                  Download
                </button>
                <button
                  onClick={resetMeme}
                  className="flex items-center justify-center gap-2 px-4 py-3 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-600"
                >
                  <RotateCcw size={18} />
                  Reset
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Preview */}
        <div className="space-y-4">
          <h4 className="text-lg font-medium text-slate-800 dark:text-slate-200">Preview</h4>
          <div className="bg-slate-100 dark:bg-slate-900 rounded-lg p-4 flex items-center justify-center min-h-96">
            {selectedTemplate ? (
              <canvas
                ref={canvasRef}
                className="max-w-full h-auto border border-slate-300 dark:border-slate-600 rounded"
                style={{ maxHeight: '400px' }}
              />
            ) : (
              <div className="text-center text-slate-500 dark:text-slate-400">
                <ImageIcon size={48} className="mx-auto mb-4 opacity-50" />
                <p>Select a template to start creating your meme</p>
              </div>
            )}
          </div>

          {selectedTemplate && (
            <div className="flex gap-2">
              <button className="flex-1 flex items-center justify-center gap-2 bg-green-600 text-white py-2 rounded hover:bg-green-700">
                <Share2 size={16} />
                Share on Social
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Tips */}
      <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
        <h5 className="font-medium text-yellow-800 dark:text-yellow-200 mb-2">💡 Meme Creation Tips:</h5>
        <ul className="text-sm text-yellow-700 dark:text-yellow-300 space-y-1">
          <li>• Keep text short and punchy</li>
          <li>• Use ALL CAPS for maximum impact</li>
          <li>• Choose contrasting colors for readability</li>
          <li>• Consider the template's context when writing text</li>
        </ul>
      </div>
    </div>
  );
};

export default MemeGenerator;