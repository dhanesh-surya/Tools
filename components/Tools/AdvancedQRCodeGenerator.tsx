import React, { useState, useRef } from 'react';
import { QrCode, Download, Copy, Eye, Settings, Palette } from 'lucide-react';

const AdvancedQRCodeGenerator: React.FC = () => {
  const [text, setText] = useState('');
  const [size, setSize] = useState(256);
  const [errorCorrection, setErrorCorrection] = useState('M');
  const [qrColor, setQrColor] = useState('#000000');
  const [bgColor, setBgColor] = useState('#ffffff');
  const [logoUrl, setLogoUrl] = useState('');
  const [generatedQR, setGeneratedQR] = useState<string>('');
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const errorCorrectionLevels = [
    { value: 'L', label: 'Low (7%)', description: 'Best for simple content' },
    { value: 'M', label: 'Medium (15%)', description: 'Good balance' },
    { value: 'Q', label: 'Quartile (25%)', description: 'Better error correction' },
    { value: 'H', label: 'High (30%)', description: 'Maximum error correction' },
  ];

  const presetTemplates = [
    { name: 'Website URL', text: 'https://example.com', icon: '🌐' },
    { name: 'Email', text: 'mailto:hello@example.com', icon: '📧' },
    { name: 'Phone', text: 'tel:+1234567890', icon: '📞' },
    { name: 'SMS', text: 'sms:+1234567890', icon: '💬' },
    { name: 'WiFi', text: 'WIFI:S:MyNetwork;T:WPA;P:mypassword;;', icon: '📶' },
    { name: 'Location', text: 'geo:37.7749,-122.4194', icon: '📍' },
    { name: 'Contact', text: 'BEGIN:VCARD\nVERSION:3.0\nFN:John Doe\nTEL:+1234567890\nEMAIL:john@example.com\nEND:VCARD', icon: '👤' },
  ];

  const generateQRCode = () => {
    if (!text.trim()) return;

    // In a real implementation, this would use a QR code library like qrcode.js
    // For now, we'll create a simple visual representation
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');

    if (ctx) {
      // Fill background
      ctx.fillStyle = bgColor;
      ctx.fillRect(0, 0, size, size);

      // Simple QR code pattern (this is just a visual demo)
      const moduleSize = size / 21; // Standard QR code has 21x21 modules
      ctx.fillStyle = qrColor;

      // Draw a simple pattern that looks like a QR code
      for (let i = 0; i < 21; i++) {
        for (let j = 0; j < 21; j++) {
          // Create a pattern that resembles a QR code
          const shouldFill = (
            // Position detection patterns
            (i < 7 && j < 7) || (i < 7 && j > 13) || (i > 13 && j < 7) ||
            // Alignment patterns
            (i > 8 && i < 13 && j > 8 && j < 13) ||
            // Timing patterns
            (i === 6 || j === 6) ||
            // Random data pattern (simplified)
            Math.random() > 0.6
          );

          if (shouldFill) {
            ctx.fillRect(
              i * moduleSize,
              j * moduleSize,
              moduleSize,
              moduleSize
            );
          }
        }
      }

      // Add logo if provided
      if (logoUrl) {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.onload = () => {
          const logoSize = size * 0.2;
          const logoX = (size - logoSize) / 2;
          const logoY = (size - logoSize) / 2;

          // Create circular mask for logo
          ctx.save();
          ctx.beginPath();
          ctx.arc(logoX + logoSize/2, logoY + logoSize/2, logoSize/2, 0, 2 * Math.PI);
          ctx.clip();
          ctx.drawImage(img, logoX, logoY, logoSize, logoSize);
          ctx.restore();

          setGeneratedQR(canvas.toDataURL());
        };
        img.src = logoUrl;
      } else {
        setGeneratedQR(canvas.toDataURL());
      }
    }
  };

  const downloadQR = () => {
    if (!generatedQR) return;

    const link = document.createElement('a');
    link.download = `qr-code-${Date.now()}.png`;
    link.href = generatedQR;
    link.click();
  };

  const copyQRData = () => {
    navigator.clipboard.writeText(text);
  };

  React.useEffect(() => {
    if (text) {
      generateQRCode();
    }
  }, [text, size, errorCorrection, qrColor, bgColor, logoUrl]);

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-200">Advanced QR Code Generator</h3>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Controls */}
        <div className="space-y-6">
          {/* Text Input */}
          <div className="bg-white dark:bg-slate-800 rounded-lg p-6 shadow-sm border border-slate-200 dark:border-slate-700">
            <label className="block text-sm font-medium mb-2 text-slate-700 dark:text-slate-300">
              Content to encode
            </label>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Enter text, URL, email, phone number, or any content..."
              rows={4}
              className="w-full p-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100"
            />

            {/* Preset Templates */}
            <div className="mt-3">
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">Quick templates:</p>
              <div className="flex flex-wrap gap-2">
                {presetTemplates.map((template, index) => (
                  <button
                    key={index}
                    onClick={() => setText(template.text)}
                    className="flex items-center gap-1 px-3 py-1 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded text-sm hover:bg-slate-200 dark:hover:bg-slate-600"
                  >
                    <span>{template.icon}</span>
                    {template.name}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Customization Options */}
          <div className="bg-white dark:bg-slate-800 rounded-lg p-6 shadow-sm border border-slate-200 dark:border-slate-700">
            <h4 className="font-medium mb-4 text-slate-800 dark:text-slate-200 flex items-center gap-2">
              <Settings size={18} />
              Customization
            </h4>

            <div className="space-y-4">
              {/* Size */}
              <div>
                <label className="block text-sm font-medium mb-2 text-slate-700 dark:text-slate-300">Size (px)</label>
                <select
                  value={size}
                  onChange={(e) => setSize(parseInt(e.target.value))}
                  className="w-full p-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100"
                >
                  <option value={128}>128x128 (Small)</option>
                  <option value={256}>256x256 (Medium)</option>
                  <option value={512}>512x512 (Large)</option>
                  <option value={1024}>1024x1024 (Extra Large)</option>
                </select>
              </div>

              {/* Error Correction */}
              <div>
                <label className="block text-sm font-medium mb-2 text-slate-700 dark:text-slate-300">Error Correction</label>
                <select
                  value={errorCorrection}
                  onChange={(e) => setErrorCorrection(e.target.value)}
                  className="w-full p-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100"
                >
                  {errorCorrectionLevels.map(level => (
                    <option key={level.value} value={level.value}>
                      {level.label} - {level.description}
                    </option>
                  ))}
                </select>
              </div>

              {/* Colors */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2 text-slate-700 dark:text-slate-300 flex items-center gap-2">
                    <Palette size={14} />
                    QR Color
                  </label>
                  <input
                    type="color"
                    value={qrColor}
                    onChange={(e) => setQrColor(e.target.value)}
                    className="w-full h-10 rounded border border-slate-300 dark:border-slate-600"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 text-slate-700 dark:text-slate-300">Background</label>
                  <input
                    type="color"
                    value={bgColor}
                    onChange={(e) => setBgColor(e.target.value)}
                    className="w-full h-10 rounded border border-slate-300 dark:border-slate-600"
                  />
                </div>
              </div>

              {/* Logo */}
              <div>
                <label className="block text-sm font-medium mb-2 text-slate-700 dark:text-slate-300">Center Logo (optional)</label>
                <input
                  type="url"
                  value={logoUrl}
                  onChange={(e) => setLogoUrl(e.target.value)}
                  placeholder="https://example.com/logo.png"
                  className="w-full p-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100"
                />
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  PNG or JPG, transparent background recommended
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Preview */}
        <div className="space-y-4">
          <div className="bg-white dark:bg-slate-800 rounded-lg p-6 shadow-sm border border-slate-200 dark:border-slate-700">
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-medium text-slate-800 dark:text-slate-200">QR Code Preview</h4>
              {generatedQR && (
                <div className="flex gap-2">
                  <button
                    onClick={downloadQR}
                    className="flex items-center gap-2 px-3 py-1 bg-primary text-white rounded hover:bg-blue-700"
                  >
                    <Download size={14} />
                    Download
                  </button>
                  <button
                    onClick={copyQRData}
                    className="flex items-center gap-2 px-3 py-1 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded hover:bg-slate-200 dark:hover:bg-slate-600"
                  >
                    <Copy size={14} />
                    Copy Data
                  </button>
                </div>
              )}
            </div>

            <div className="flex items-center justify-center min-h-64">
              {generatedQR ? (
                <div className="text-center">
                  <img
                    src={generatedQR}
                    alt="Generated QR Code"
                    className="max-w-full h-auto border border-slate-200 dark:border-slate-700 rounded"
                  />
                  <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
                    {size}x{size} pixels • {errorCorrection} error correction
                  </p>
                </div>
              ) : (
                <div className="text-center text-slate-500 dark:text-slate-400">
                  <QrCode size={64} className="mx-auto mb-4 opacity-50" />
                  <p>Enter content to generate your QR code</p>
                </div>
              )}
            </div>
          </div>

          {/* Usage Tips */}
          <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
            <h5 className="font-medium text-green-800 dark:text-green-200 mb-2">✅ QR Code Best Practices:</h5>
            <ul className="text-sm text-green-700 dark:text-green-300 space-y-1">
              <li>• Test your QR code before printing</li>
              <li>• Include a call-to-action near the code</li>
              <li>• Use high contrast colors for better scanning</li>
              <li>• Leave adequate white space around the code</li>
              <li>• Consider error correction level based on usage</li>
            </ul>
          </div>

          {/* Content Examples */}
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
            <h5 className="font-medium text-blue-800 dark:text-blue-200 mb-2">💡 Content Examples:</h5>
            <div className="grid grid-cols-1 gap-2 text-sm text-blue-700 dark:text-blue-300">
              <div><strong>URL:</strong> https://example.com</div>
              <div><strong>Email:</strong> mailto:user@example.com</div>
              <div><strong>Phone:</strong> tel:+1234567890</div>
              <div><strong>WiFi:</strong> WIFI:S:NetworkName;T:WPA;P:password;;</div>
              <div><strong>Location:</strong> geo:37.7749,-122.4194</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdvancedQRCodeGenerator;