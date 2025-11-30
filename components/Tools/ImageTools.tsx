import React, { useState, useRef } from 'react';
import { Upload, Download, Image as ImageIcon, Maximize, FileImage } from 'lucide-react';

const ImageTools: React.FC = () => {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);
  const [originalSize, setOriginalSize] = useState({ w: 0, h: 0 });
  const [aspectRatio, setAspectRatio] = useState(true);
  const [quality, setQuality] = useState(90);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (!file.type.startsWith('image/')) return;
      
      setImageFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);

      const img = new Image();
      img.onload = () => {
        setWidth(img.width);
        setHeight(img.height);
        setOriginalSize({ w: img.width, h: img.height });
      };
      img.src = url;
    }
  };

  const handleWidthChange = (val: number) => {
    setWidth(val);
    if (aspectRatio && originalSize.w > 0) {
      setHeight(Math.round(val * (originalSize.h / originalSize.w)));
    }
  };

  const handleHeightChange = (val: number) => {
    setHeight(val);
    if (aspectRatio && originalSize.h > 0) {
      setWidth(Math.round(val * (originalSize.w / originalSize.h)));
    }
  };

  const handleDownload = () => {
    if (!imageFile || !canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const img = new Image();
    
    img.onload = () => {
        canvas.width = width;
        canvas.height = height;
        // High quality scaling
        ctx?.drawImage(img, 0, 0, width, height);
        
        const dataUrl = canvas.toDataURL(imageFile.type, quality / 100);
        const link = document.createElement('a');
        link.download = `resized-${imageFile.name}`;
        link.href = dataUrl;
        link.click();
    };
    img.src = previewUrl || '';
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-fade-in">
        {/* Controls */}
        <div className="lg:col-span-1 space-y-6">
            <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-slate-800 dark:text-white">
                    <ImageIcon size={20} className="text-primary"/> Image Settings
                </h3>

                <div className="space-y-4">
                    <div className="p-4 border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-lg text-center cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors relative">
                        <input 
                            type="file" 
                            accept="image/*"
                            onChange={handleFileChange}
                            className="absolute inset-0 opacity-0 cursor-pointer"
                        />
                        <Upload className="mx-auto text-slate-400 mb-2" />
                        <span className="text-sm text-slate-500 font-medium">Click to Upload Image</span>
                    </div>

                    {imageFile && (
                        <>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">Width (px)</label>
                                    <input 
                                        type="number" 
                                        value={width}
                                        onChange={(e) => handleWidthChange(Number(e.target.value))}
                                        className="w-full p-2 rounded border dark:bg-slate-900 dark:border-slate-600 text-sm"
                                    />
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">Height (px)</label>
                                    <input 
                                        type="number" 
                                        value={height}
                                        onChange={(e) => handleHeightChange(Number(e.target.value))}
                                        className="w-full p-2 rounded border dark:bg-slate-900 dark:border-slate-600 text-sm"
                                    />
                                </div>
                            </div>

                            <div className="flex items-center gap-2">
                                <input 
                                    type="checkbox" 
                                    checked={aspectRatio} 
                                    onChange={(e) => setAspectRatio(e.target.checked)}
                                    className="w-4 h-4 rounded text-primary focus:ring-primary"
                                />
                                <label className="text-sm text-slate-600 dark:text-slate-300">Maintain Aspect Ratio</label>
                            </div>

                            <div>
                                <label className="text-xs font-bold text-slate-500 uppercase mb-1 flex justify-between">
                                    <span>Quality</span>
                                    <span>{quality}%</span>
                                </label>
                                <input 
                                    type="range" min="10" max="100" 
                                    value={quality}
                                    onChange={(e) => setQuality(Number(e.target.value))}
                                    className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer dark:bg-slate-700 accent-primary"
                                />
                            </div>

                            <button 
                                onClick={handleDownload}
                                className="w-full py-3 bg-primary text-white rounded-lg font-bold shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all flex items-center justify-center gap-2"
                            >
                                <Download size={18} /> Download Resized
                            </button>
                        </>
                    )}
                </div>
            </div>
        </div>

        {/* Preview */}
        <div className="lg:col-span-2 bg-slate-100 dark:bg-slate-900 rounded-xl p-8 flex items-center justify-center border border-slate-200 dark:border-slate-800 min-h-[400px]">
            {previewUrl ? (
                <div className="relative shadow-2xl rounded-lg overflow-hidden max-w-full">
                    <img 
                        src={previewUrl} 
                        alt="Preview" 
                        style={{ width: 'auto', height: 'auto', maxHeight: '500px', maxWidth: '100%' }}
                    />
                    <div className="absolute bottom-0 left-0 right-0 bg-black/60 backdrop-blur-sm text-white p-2 text-xs text-center flex justify-between px-4">
                        <span>Original: {originalSize.w} x {originalSize.h}</span>
                        <span>New: {width} x {height}</span>
                    </div>
                </div>
            ) : (
                <div className="text-center text-slate-400">
                    <FileImage size={64} className="mx-auto mb-4 opacity-50" />
                    <p>Upload an image to start editing</p>
                </div>
            )}
            {/* Hidden canvas for processing */}
            <canvas ref={canvasRef} className="hidden" />
        </div>
    </div>
  );
};

export default ImageTools;