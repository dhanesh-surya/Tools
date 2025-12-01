import React, { useState, useEffect } from 'react';
import { QrCode, Type, FileCode, ArrowLeftRight, Download, Copy, Check } from 'lucide-react';
import QRCode from 'qrcode';

interface UtilityToolsProps {
  initialTool?: 'QR' | 'BASE64' | 'UNIT';
}

const UtilityTools: React.FC<UtilityToolsProps> = ({ initialTool = 'QR' }) => {
  const [tool, setTool] = useState<'QR' | 'BASE64' | 'UNIT'>(initialTool);
  
  // QR State
  const [qrText, setQrText] = useState('');
  const [qrUrl, setQrUrl] = useState('');

  // Base64 State
  const [b64Input, setB64Input] = useState('');
  const [b64Output, setB64Output] = useState('');
  const [b64Mode, setB64Mode] = useState<'ENCODE' | 'DECODE'>('ENCODE');
  const [copied, setCopied] = useState(false);

  // Unit Converter State
  const [unitCategory, setUnitCategory] = useState<'LENGTH' | 'WEIGHT' | 'TEMP' | 'VOLUME'>('LENGTH');
  const [fromUnit, setFromUnit] = useState('');
  const [toUnit, setToUnit] = useState('');
  const [inputValue, setInputValue] = useState('');
  const [outputValue, setOutputValue] = useState('');

  useEffect(() => {
    setTool(initialTool);
  }, [initialTool]);

  // QR Logic
  useEffect(() => {
    if (qrText) {
        QRCode.toDataURL(qrText, { width: 300, margin: 2, color: { dark: '#0f172a', light: '#ffffff' } })
            .then(url => setQrUrl(url))
            .catch(err => console.error(err));
    } else {
        setQrUrl('');
    }
  }, [qrText]);

  // Base64 Logic
  const handleBase64Process = () => {
      try {
          if (b64Mode === 'ENCODE') {
              setB64Output(btoa(b64Input));
          } else {
              setB64Output(atob(b64Input));
          }
      } catch (e) {
          setB64Output('Invalid input for decoding.');
      }
  };

  const copyToClipboard = () => {
      navigator.clipboard.writeText(b64Output);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
  };

  // Unit Conversion Logic
  const unitConversions = {
    LENGTH: {
      units: ['Meter', 'Kilometer', 'Centimeter', 'Millimeter', 'Mile', 'Yard', 'Foot', 'Inch'],
      toBase: {
        'Meter': 1,
        'Kilometer': 1000,
        'Centimeter': 0.01,
        'Millimeter': 0.001,
        'Mile': 1609.34,
        'Yard': 0.9144,
        'Foot': 0.3048,
        'Inch': 0.0254,
      }
    },
    WEIGHT: {
      units: ['Kilogram', 'Gram', 'Milligram', 'Ton', 'Pound', 'Ounce'],
      toBase: {
        'Kilogram': 1,
        'Gram': 0.001,
        'Milligram': 0.000001,
        'Ton': 1000,
        'Pound': 0.453592,
        'Ounce': 0.0283495,
      }
    },
    TEMP: {
      units: ['Celsius', 'Fahrenheit', 'Kelvin'],
      toBase: {} // Temperature needs special handling
    },
    VOLUME: {
      units: ['Liter', 'Milliliter', 'Gallon', 'Quart', 'Pint', 'Cup', 'Fluid Ounce'],
      toBase: {
        'Liter': 1,
        'Milliliter': 0.001,
        'Gallon': 3.78541,
        'Quart': 0.946353,
        'Pint': 0.473176,
        'Cup': 0.236588,
        'Fluid Ounce': 0.0295735,
      }
    }
  };

  const convertUnit = () => {
    const value = parseFloat(inputValue);
    if (isNaN(value) || !fromUnit || !toUnit) {
      setOutputValue('');
      return;
    }

    if (unitCategory === 'TEMP') {
      let result = 0;
      // Convert to Celsius first
      let celsius = 0;
      if (fromUnit === 'Celsius') celsius = value;
      else if (fromUnit === 'Fahrenheit') celsius = (value - 32) * 5/9;
      else if (fromUnit === 'Kelvin') celsius = value - 273.15;

      // Convert from Celsius to target
      if (toUnit === 'Celsius') result = celsius;
      else if (toUnit === 'Fahrenheit') result = celsius * 9/5 + 32;
      else if (toUnit === 'Kelvin') result = celsius + 273.15;

      setOutputValue(result.toFixed(4));
    } else {
      const conversionData = unitConversions[unitCategory];
      const baseValue = value * conversionData.toBase[fromUnit];
      const result = baseValue / conversionData.toBase[toUnit];
      setOutputValue(result.toFixed(4));
    }
  };

  useEffect(() => {
    if (inputValue && fromUnit && toUnit) {
      convertUnit();
    }
  }, [inputValue, fromUnit, toUnit, unitCategory]);

  useEffect(() => {
    const units = unitConversions[unitCategory].units;
    setFromUnit(units[0]);
    setToUnit(units[1] || units[0]);
    setInputValue('');
    setOutputValue('');
  }, [unitCategory]);

  return (
    <div className="max-w-4xl mx-auto animate-fade-in">
        <div className="flex flex-wrap gap-2 mb-6 justify-center">
            <button
                onClick={() => setTool('QR')}
                className={`px-6 py-2 rounded-full font-bold transition-all ${tool === 'QR' ? 'bg-slate-900 dark:bg-slate-700 text-white shadow-lg' : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'}`}
            >
                QR Generator
            </button>
            <button
                onClick={() => setTool('BASE64')}
                className={`px-6 py-2 rounded-full font-bold transition-all ${tool === 'BASE64' ? 'bg-primary text-white shadow-lg' : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'}`}
            >
                Base64 Converter
            </button>
            <button
                onClick={() => setTool('UNIT')}
                className={`px-6 py-2 rounded-full font-bold transition-all ${tool === 'UNIT' ? 'bg-green-600 text-white shadow-lg' : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'}`}
            >
                Unit Converter
            </button>
        </div>

        {tool === 'QR' && (
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-8 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                <div className="space-y-4">
                    <h3 className="text-xl font-bold flex items-center gap-2"><QrCode className="text-slate-900 dark:text-white"/> Enter Content</h3>
                    <textarea 
                        className="w-full h-32 p-4 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-slate-500 outline-none resize-none"
                        placeholder="Type URL or Text to generate QR..."
                        value={qrText}
                        onChange={(e) => setQrText(e.target.value)}
                    ></textarea>
                    <p className="text-sm text-slate-500">The QR code updates automatically as you type.</p>
                </div>
                <div className="flex flex-col items-center justify-center p-6 bg-slate-50 dark:bg-slate-900 rounded-xl border-2 border-dashed border-slate-200 dark:border-slate-700 min-h-[300px]">
                    {qrUrl ? (
                        <>
                            <img src={qrUrl} alt="QR Code" className="w-48 h-48 mb-6 rounded-lg shadow-sm bg-white p-2" />
                            <a 
                                href={qrUrl} 
                                download="qrcode.png"
                                className="flex items-center gap-2 px-6 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-700 transition-colors"
                            >
                                <Download size={16} /> Download PNG
                            </a>
                        </>
                    ) : (
                        <div className="text-slate-400 text-center">
                            <QrCode size={64} className="mx-auto mb-4 opacity-20" />
                            <p>Preview will appear here</p>
                        </div>
                    )}
                </div>
            </div>
        )}

        {tool === 'BASE64' && (
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-8">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold flex items-center gap-2 text-primary"><FileCode /> Base64 Tool</h3>
                    <button 
                        onClick={() => {
                            setB64Mode(prev => prev === 'ENCODE' ? 'DECODE' : 'ENCODE');
                            setB64Input(b64Output); // Swap for convenience
                            setB64Output('');
                        }}
                        className="flex items-center gap-2 px-4 py-2 bg-slate-100 dark:bg-slate-700 rounded-lg text-sm font-bold hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
                    >
                        <ArrowLeftRight size={16} /> 
                        Switch to {b64Mode === 'ENCODE' ? 'Decode' : 'Encode'}
                    </button>
                </div>

                <div className="grid gap-6">
                    <div>
                        <label className="block text-sm font-bold text-slate-500 mb-2 uppercase">Input</label>
                        <textarea 
                            className="w-full h-32 p-4 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-primary outline-none font-mono text-sm"
                            placeholder={b64Mode === 'ENCODE' ? "Type text to encode..." : "Paste Base64 string to decode..."}
                            value={b64Input}
                            onChange={(e) => setB64Input(e.target.value)}
                        ></textarea>
                    </div>

                    <div className="flex justify-center">
                        <button 
                            onClick={handleBase64Process}
                            className="px-8 py-2 bg-primary text-white rounded-full font-bold shadow-lg hover:shadow-primary/50 transition-all"
                        >
                            {b64Mode === 'ENCODE' ? 'Encode to Base64' : 'Decode to Text'}
                        </button>
                    </div>

                    <div>
                         <div className="flex justify-between mb-2">
                             <label className="block text-sm font-bold text-slate-500 uppercase">Output</label>
                             {b64Output && (
                                 <button onClick={copyToClipboard} className="text-primary text-sm flex items-center gap-1 hover:text-blue-700">
                                     {copied ? <Check size={14}/> : <Copy size={14}/>} {copied ? 'Copied' : 'Copy Result'}
                                 </button>
                             )}
                         </div>
                        <div className="w-full min-h-[8rem] p-4 rounded-lg bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 font-mono text-sm break-all text-slate-700 dark:text-slate-300">
                            {b64Output || <span className="text-slate-400 italic">Result will appear here...</span>}
                        </div>
                    </div>
                </div>
            </div>
        )}

        {tool === 'UNIT' && (
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-8">
                <h3 className="text-xl font-bold flex items-center gap-2 mb-6 text-green-600"><ArrowLeftRight /> Unit Converter</h3>
                
                {/* Category Selection */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
                    {(['LENGTH', 'WEIGHT', 'TEMP', 'VOLUME'] as const).map(cat => (
                        <button
                            key={cat}
                            onClick={() => setUnitCategory(cat)}
                            className={`px-4 py-3 rounded-lg font-bold transition-all ${
                                unitCategory === cat 
                                ? 'bg-green-600 text-white shadow-lg' 
                                : 'bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                            }`}
                        >
                            {cat === 'LENGTH' ? '📏 Length' : cat === 'WEIGHT' ? '⚖️ Weight' : cat === 'TEMP' ? '🌡️ Temperature' : '🧪 Volume'}
                        </button>
                    ))}
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                    {/* From Unit */}
                    <div className="space-y-4">
                        <label className="block text-sm font-bold text-slate-500 uppercase">From</label>
                        <select 
                            value={fromUnit}
                            onChange={(e) => setFromUnit(e.target.value)}
                            className="w-full p-3 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-green-500 outline-none"
                        >
                            {unitConversions[unitCategory].units.map(unit => (
                                <option key={unit} value={unit}>{unit}</option>
                            ))}
                        </select>
                        <input 
                            type="number"
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            placeholder="Enter value"
                            className="w-full p-4 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-green-500 outline-none text-lg font-bold"
                        />
                    </div>

                    {/* To Unit */}
                    <div className="space-y-4">
                        <label className="block text-sm font-bold text-slate-500 uppercase">To</label>
                        <select 
                            value={toUnit}
                            onChange={(e) => setToUnit(e.target.value)}
                            className="w-full p-3 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-green-500 outline-none"
                        >
                            {unitConversions[unitCategory].units.map(unit => (
                                <option key={unit} value={unit}>{unit}</option>
                            ))}
                        </select>
                        <div className="w-full p-4 rounded-lg bg-green-50 dark:bg-green-900/20 border-2 border-green-200 dark:border-green-700 text-lg font-bold text-green-700 dark:text-green-400">
                            {outputValue || '0'}
                        </div>
                    </div>
                </div>

                {/* Quick Info */}
                <div className="mt-6 p-4 bg-slate-50 dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700">
                    <p className="text-sm text-slate-600 dark:text-slate-400 text-center">
                        {inputValue && outputValue ? (
                            <span className="font-mono">
                                <span className="font-bold text-slate-800 dark:text-slate-200">{inputValue} {fromUnit}</span> = <span className="font-bold text-green-600">{outputValue} {toUnit}</span>
                            </span>
                        ) : (
                            'Enter a value to convert'
                        )}
                    </p>
                </div>
            </div>
        )}
    </div>
  );
};

export default UtilityTools;