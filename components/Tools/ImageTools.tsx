import React, { useState, useRef, useEffect } from 'react';
import { Upload, Download, Image as ImageIcon, FileImage, Crop as CropIcon, Images as ImagesIcon, Maximize, FileStack } from 'lucide-react';

type ImageToolTab = 'RESIZE' | 'CROP' | 'BATCH';

const ImageTools: React.FC = () => {
  const [activeTab, setActiveTab] = useState<ImageToolTab>('RESIZE');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);
  const [originalSize, setOriginalSize] = useState({ w: 0, h: 0 });
  const [aspectRatio, setAspectRatio] = useState(true);
  const [quality, setQuality] = useState(90);
  // Crop state
  const [isCropping, setIsCropping] = useState(false);
  const [cropRect, setCropRect] = useState<{x:number;y:number;w:number;h:number}|null>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  // Batch processing state
  const [batchFiles, setBatchFiles] = useState<File[]>([]);
  const [batchWidth, setBatchWidth] = useState<number>(0);
  const [batchQuality, setBatchQuality] = useState<number>(85);
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

  const toggleCropMode = () => {
    setIsCropping(!isCropping);
    if (isCropping) {
      setCropRect(null);
    }
  };

  const handleResizeDownload = () => {
    if (!imageFile || !canvasRef.current || !previewUrl) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const img = new Image();
    
    img.onload = () => {
      canvas.width = width;
      canvas.height = height;
      ctx?.drawImage(img, 0, 0, width, height);
      
      const dataUrl = canvas.toDataURL(imageFile.type, quality / 100);
      const link = document.createElement('a');
      link.download = `resized-${imageFile.name}`;
      link.href = dataUrl;
      link.click();
    };
    img.src = previewUrl;
  };

  const handleCropDownload = () => {
    if (!imageFile || !canvasRef.current || !previewUrl || !cropRect) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const img = new Image();
    
    img.onload = () => {
      canvas.width = cropRect.w;
      canvas.height = cropRect.h;
      ctx?.drawImage(img, cropRect.x, cropRect.y, cropRect.w, cropRect.h, 0, 0, cropRect.w, cropRect.h);
      
      const dataUrl = canvas.toDataURL(imageFile.type, quality / 100);
      const link = document.createElement('a');
      link.download = `cropped-${imageFile.name}`;
      link.href = dataUrl;
      link.click();
    };
    img.src = previewUrl;
  };

    // Crop overlay interactions
    useEffect(() => {
        const overlay = overlayRef.current;
        const imgEl = imgRef.current;
        if (!overlay || !imgEl) return;
        let startX = 0, startY = 0, dragging = false;
        const onMouseDown = (e: MouseEvent) => {
            if (!isCropping) return;
            const rect = imgEl.getBoundingClientRect();
            startX = e.clientX - rect.left;
            startY = e.clientY - rect.top;
            setCropRect({ x: startX, y: startY, w: 0, h: 0 });
            dragging = true;
        };
        const onMouseMove = (e: MouseEvent) => {
            if (!dragging || !cropRect) return;
            const rect = imgEl.getBoundingClientRect();
            const curX = e.clientX - rect.left;
            const curY = e.clientY - rect.top;
            setCropRect({ x: Math.min(startX, curX), y: Math.min(startY, curY), w: Math.abs(curX - startX), h: Math.abs(curY - startY) });
        };
        const onMouseUp = () => { dragging = false; };
        overlay.addEventListener('mousedown', onMouseDown);
        window.addEventListener('mousemove', onMouseMove);
        window.addEventListener('mouseup', onMouseUp);
        return () => {
            overlay.removeEventListener('mousedown', onMouseDown);
            window.removeEventListener('mousemove', onMouseMove);
            window.removeEventListener('mouseup', onMouseUp);
        };
    }, [isCropping, cropRect]);

    // Batch processing
    const handleBatchFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files) return;
        const files = Array.from(e.target.files).filter((f: File) => f.type.startsWith('image/'));
        setBatchFiles(files);
    };

    const runBatchResize = async () => {
        if (batchFiles.length === 0 || batchWidth <= 0) return;
        for (const f of batchFiles) {
            const img = new Image();
            const url = URL.createObjectURL(f);
            await new Promise<void>((resolve) => {
                img.onload = () => {
                    const ratio = img.height / img.width;
                    const canvas = document.createElement('canvas');
                    canvas.width = batchWidth;
                    canvas.height = Math.round(batchWidth * ratio);
                    const ctx = canvas.getContext('2d');
                    ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);
                    const dataUrl = canvas.toDataURL(f.type, batchQuality / 100);
                    const a = document.createElement('a');
                    a.href = dataUrl;
                    a.download = `batch-${f.name}`;
                    a.click();
                    URL.revokeObjectURL(url);
                    resolve();
                };
                img.src = url;
            });
        }
    };

  return (
    <div className="max-w-6xl mx-auto animate-fade-in">
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 overflow-hidden">
        <div className="p-6 border-b border-slate-200 dark:border-slate-700 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-slate-900 dark:to-slate-800">
          <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
            <ImageIcon className="text-purple-500" /> Image Tools Suite
          </h2>
          
          <div className="flex flex-wrap gap-2">
            {[
              { id: 'RESIZE', label: 'Resize & Quality', icon: Maximize },
              { id: 'CROP', label: 'Crop Image', icon: CropIcon },
              { id: 'BATCH', label: 'Batch Process', icon: FileStack },
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as ImageToolTab)}
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
          {activeTab === 'RESIZE' && <ResizeTool 
            imageFile={imageFile}
            setImageFile={setImageFile}
            previewUrl={previewUrl}
            setPreviewUrl={setPreviewUrl}
            width={width}
            setWidth={setWidth}
            height={height}
            setHeight={setHeight}
            originalSize={originalSize}
            setOriginalSize={setOriginalSize}
            aspectRatio={aspectRatio}
            setAspectRatio={setAspectRatio}
            quality={quality}
            setQuality={setQuality}
            handleFileChange={handleFileChange}
            handleWidthChange={handleWidthChange}
            handleHeightChange={handleHeightChange}
            handleDownload={handleResizeDownload}
            canvasRef={canvasRef}
          />}
          {activeTab === 'CROP' && <CropTool 
            imageFile={imageFile}
            setImageFile={setImageFile}
            previewUrl={previewUrl}
            setPreviewUrl={setPreviewUrl}
            width={width}
            setWidth={setWidth}
            height={height}
            setHeight={setHeight}
            originalSize={originalSize}
            setOriginalSize={setOriginalSize}
            handleFileChange={handleFileChange}
            handleDownload={handleCropDownload}
            isCropping={isCropping}
            setIsCropping={setIsCropping}
            cropRect={cropRect}
            setCropRect={setCropRect}
            overlayRef={overlayRef}
            imgRef={imgRef}
            canvasRef={canvasRef}
            quality={quality}
            toggleCropMode={toggleCropMode}
          />}
          {activeTab === 'BATCH' && <BatchTool 
            batchFiles={batchFiles}
            handleBatchFiles={handleBatchFiles}
            batchWidth={batchWidth}
            setBatchWidth={setBatchWidth}
            batchQuality={batchQuality}
            setBatchQuality={setBatchQuality}
            runBatchResize={runBatchResize}
          />}
        </div>
      </div>
    </div>
  );
};

const ResizeTool: React.FC<any> = ({ imageFile, previewUrl, width, height, originalSize, aspectRatio, setAspectRatio, quality, setQuality, handleFileChange, handleWidthChange, handleHeightChange, handleDownload, canvasRef }) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Controls */}
        <div className="lg:col-span-1 space-y-6">
            <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-slate-800 dark:text-white">
                    <Maximize size={20} className="text-primary"/> Resize Settings
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
                    <p>Upload an image to start resizing</p>
                </div>
            )}
            {/* Hidden canvas for processing */}
            <canvas ref={canvasRef} className="hidden" />
        </div>
    </div>
  );
};

const CropTool: React.FC<any> = ({ imageFile, previewUrl, isCropping, toggleCropMode, cropRect, setCropRect, imgRef, overlayRef, handleFileChange, handleDownload, canvasRef }) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Controls */}
        <div className="lg:col-span-1 space-y-6">
            <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-slate-800 dark:text-white">
                    <CropIcon size={20} className="text-primary"/> Crop Image
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
                            <div className="space-y-2">
                                <button 
                                    onClick={toggleCropMode} 
                                    className={`w-full px-4 py-2 rounded border text-sm font-medium transition-colors ${isCropping ? 'bg-primary text-white border-primary' : 'bg-white dark:bg-slate-900 dark:text-white border-slate-300 dark:border-slate-600'}`}
                                >
                                    <CropIcon size={16} className="inline mr-2"/> 
                                    {isCropping ? 'Cropping: Drag to select area' : 'Enable Crop Mode'}
                                </button>
                                <button 
                                    onClick={() => setCropRect(null)} 
                                    className="w-full px-4 py-2 rounded border text-sm bg-white dark:bg-slate-900 dark:text-white border-slate-300 dark:border-slate-600"
                                >
                                    Clear Selection
                                </button>
                            </div>

                            {cropRect && (
                                <div className="p-3 bg-slate-100 dark:bg-slate-900 rounded text-xs">
                                    <p className="font-bold mb-1">Crop Area:</p>
                                    <p>X: {Math.round(cropRect.x)}px, Y: {Math.round(cropRect.y)}px</p>
                                    <p>Width: {Math.round(cropRect.w)}px, Height: {Math.round(cropRect.h)}px</p>
                                </div>
                            )}

                            <button 
                                onClick={handleDownload}
                                disabled={!cropRect}
                                className={`w-full py-3 rounded-lg font-bold shadow-lg transition-all flex items-center justify-center gap-2 ${cropRect ? 'bg-primary text-white hover:shadow-xl hover:scale-[1.02]' : 'bg-slate-300 dark:bg-slate-700 text-slate-500 cursor-not-allowed'}`}
                            >
                                <Download size={18} /> Download Cropped Image
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
                        ref={imgRef}
                        src={previewUrl} 
                        alt="Preview" 
                        style={{ width: 'auto', height: 'auto', maxHeight: '500px', maxWidth: '100%' }}
                    />
                    {isCropping && (
                        <div ref={overlayRef} className="absolute inset-0 cursor-crosshair">
                            {cropRect && (
                                <div
                                    style={{
                                        position: 'absolute',
                                        left: `${cropRect.x}px`,
                                        top: `${cropRect.y}px`,
                                        width: `${cropRect.w}px`,
                                        height: `${cropRect.h}px`,
                                        border: '2px dashed #22c55e',
                                        background: 'rgba(34,197,94,0.1)'
                                    }}
                                />
                            )}
                        </div>
                    )}
                </div>
            ) : (
                <div className="text-center text-slate-400">
                    <FileImage size={64} className="mx-auto mb-4 opacity-50" />
                    <p>Upload an image to start cropping</p>
                </div>
            )}
            {/* Hidden canvas for processing */}
            <canvas ref={canvasRef} className="hidden" />
        </div>
    </div>
  );
};

const BatchTool: React.FC<any> = ({ batchFiles, batchWidth, setBatchWidth, batchQuality, setBatchQuality, handleBatchFiles, runBatchResize }) => {
  return (
    <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 space-y-6">
        <h3 className="text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2">
            <FileStack size={20} className="text-primary"/> Batch Resize & Compress
        </h3>
        
        <div className="grid md:grid-cols-3 gap-4">
            <div className="p-6 border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-lg text-center cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors relative">
                <input 
                    type="file" 
                    accept="image/*" 
                    multiple 
                    onChange={handleBatchFiles} 
                    className="absolute inset-0 opacity-0 cursor-pointer"
                />
                <Upload className="mx-auto text-slate-400 mb-2" size={32} />
                <span className="text-sm text-slate-600 dark:text-slate-300 font-medium">
                    {batchFiles.length > 0 ? `${batchFiles.length} images selected` : 'Click to add multiple images'}
                </span>
            </div>
            
            <div>
                <label className="text-xs font-bold text-slate-500 uppercase mb-2 block">Target Width (px)</label>
                <input 
                    type="number" 
                    className="w-full p-3 rounded border dark:bg-slate-900 dark:border-slate-600 text-sm" 
                    value={batchWidth} 
                    onChange={(e) => setBatchWidth(Number(e.target.value))} 
                    placeholder="e.g., 1920"
                />
            </div>
            
            <div>
                <label className="text-xs font-bold text-slate-500 uppercase mb-2 flex justify-between">
                    <span>Quality</span>
                    <span className="text-primary">{batchQuality}%</span>
                </label>
                <input 
                    type="range" 
                    min="10" 
                    max="100" 
                    value={batchQuality} 
                    onChange={(e) => setBatchQuality(Number(e.target.value))} 
                    className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer dark:bg-slate-700 accent-primary"
                />
            </div>
        </div>

        {batchFiles.length > 0 && (
            <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-lg">
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">Selected files:</p>
                <div className="max-h-32 overflow-y-auto space-y-1">
                    {Array.from(batchFiles).map((file: File, i) => (
                        <div key={i} className="text-xs text-slate-500 dark:text-slate-500 flex items-center gap-2">
                            <FileImage size={14} />
                            <span>{file.name}</span>
                        </div>
                    ))}
                </div>
            </div>
        )}

        <button 
            onClick={runBatchResize}
            disabled={batchFiles.length === 0}
            className={`w-full py-3 rounded-lg font-bold shadow-lg transition-all flex items-center justify-center gap-2 ${batchFiles.length > 0 ? 'bg-primary text-white hover:shadow-xl hover:scale-[1.02]' : 'bg-slate-300 dark:bg-slate-700 text-slate-500 cursor-not-allowed'}`}
        >
            <Download size={18} /> Process & Download All ({batchFiles.length} images)
        </button>
    </div>
  );
};

export default ImageTools;