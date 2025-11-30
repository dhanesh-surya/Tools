import React, { useState, useEffect } from 'react';
import { QrCode, Type, FileCode, ArrowLeftRight, Download, Copy, Check } from 'lucide-react';
import QRCode from 'qrcode';

interface UtilityToolsProps {
  initialTool?: 'QR' | 'BASE64';
}

const UtilityTools: React.FC<UtilityToolsProps> = ({ initialTool = 'QR' }) => {
  const [tool, setTool] = useState<'QR' | 'BASE64'>(initialTool);
  
  // QR State
  const [qrText, setQrText] = useState('');
  const [qrUrl, setQrUrl] = useState('');

  // Base64 State
  const [b64Input, setB64Input] = useState('');
  const [b64Output, setB64Output] = useState('');
  const [b64Mode, setB64Mode] = useState<'ENCODE' | 'DECODE'>('ENCODE');
  const [copied, setCopied] = useState(false);

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

  return (
    <div className="max-w-4xl mx-auto animate-fade-in">
        <div className="flex space-x-2 mb-6 justify-center">
            <button
                onClick={() => setTool('QR')}
                className={`px-6 py-2 rounded-full font-bold transition-all ${tool === 'QR' ? 'bg-slate-900 text-white shadow-lg' : 'bg-white text-slate-600 hover:bg-slate-100'}`}
            >
                QR Generator
            </button>
            <button
                onClick={() => setTool('BASE64')}
                className={`px-6 py-2 rounded-full font-bold transition-all ${tool === 'BASE64' ? 'bg-primary text-white shadow-lg' : 'bg-white text-slate-600 hover:bg-slate-100'}`}
            >
                Base64 Converter
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
    </div>
  );
};

export default UtilityTools;