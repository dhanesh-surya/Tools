import React, { useState } from 'react';
import { File as FileIcon, Upload, Download, Trash2, Plus, Loader2, Scissors, RotateCw, Zap, FileEdit, Globe } from 'lucide-react';
import { PDFDocument, degrees, rgb } from 'pdf-lib';

type PDFToolTab = 'MERGE' | 'SPLIT' | 'ROTATE' | 'COMPRESS' | 'CONVERT' | 'EDIT';

const PdfTools: React.FC = () => {
  const [activeTab, setActiveTab] = useState<PDFToolTab>('MERGE');

  return (
    <div className="max-w-6xl mx-auto animate-fade-in">
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 overflow-hidden">
            <div className="p-6 border-b border-slate-200 dark:border-slate-700 bg-gradient-to-r from-red-50 to-orange-50 dark:from-slate-900 dark:to-slate-800">
                <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
                    <FileIcon className="text-red-500" /> PDF Tools Suite
                </h2>
                
                <div className="flex flex-wrap gap-2">
                    {[
                        { id: 'MERGE', label: 'Merge PDFs', icon: Plus },
                        { id: 'SPLIT', label: 'Split PDF', icon: Scissors },
                        { id: 'ROTATE', label: 'Rotate Pages', icon: RotateCw },
                        { id: 'COMPRESS', label: 'Compress', icon: Zap },
                        { id: 'CONVERT', label: 'Convert', icon: FileEdit },
                        { id: 'EDIT', label: 'Quick Edit', icon: Globe },
                    ].map((tab) => {
                        const Icon = tab.icon;
                        return (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id as PDFToolTab)}
                                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                                    activeTab === tab.id
                                        ? 'bg-red-600 text-white shadow-lg'
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
              {activeTab === 'MERGE' && <MergePDFTool />}
              {activeTab === 'SPLIT' && <SplitPDFTool />}
              {activeTab === 'ROTATE' && <RotatePDFTool />}
              {activeTab === 'COMPRESS' && <CompressPDFTool />}
              {activeTab === 'CONVERT' && <ConvertPDFTool />}
              {activeTab === 'EDIT' && <QuickEditTool />}
            </div>
        </div>
    </div>
  );
};

const MergePDFTool: React.FC = () => {
  const [pdfFiles, setPdfFiles] = useState<File[]>([]);
  const [processing, setProcessing] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files as FileList).filter((f: File) => f.type === 'application/pdf');
      setPdfFiles(prev => [...prev, ...newFiles]);
    }
  };

  const removeFile = (index: number) => {
    setPdfFiles(prev => prev.filter((_, i) => i !== index));
  };

  const mergePDFs = async () => {
    if (pdfFiles.length < 2) return;
    setProcessing(true);

    try {
        const mergedPdf = await PDFDocument.create();

        for (const file of pdfFiles) {
          const fileBuffer = await file.arrayBuffer();
          const pdf = await PDFDocument.load(fileBuffer);
          const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
          copiedPages.forEach((p) => mergedPdf.addPage(p));
        }
        const pdfBytes = await mergedPdf.save();
        const blob = new Blob([pdfBytes as any], { type: 'application/pdf' });
        const url = URL.createObjectURL(blob);
        
        const link = document.createElement('a');
        link.href = url;
        link.download = 'merged-document.pdf';
        link.click();
      } catch (error) {
        console.error('Merge failed', error);
        alert('Failed to merge PDFs. Ensure files are valid.');
      } finally {
        setProcessing(false);
      }
  };

  return (
    <div className="space-y-4">
        <div className="relative">
            <input 
                type="file" 
                multiple 
                accept=".pdf" 
                onChange={handleFileChange}
                className="absolute inset-0 opacity-0 cursor-pointer"
            />
            <button className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-red-500 to-orange-500 text-white rounded-lg hover:from-red-600 hover:to-orange-600 transition-all shadow-lg font-bold">
                <Plus size={20} /> Add PDF Files to Merge
            </button>
        </div>

        {pdfFiles.length === 0 ? (
            <div className="h-64 flex flex-col items-center justify-center text-slate-400 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-xl">
                <Upload size={48} className="mb-4 opacity-50" />
                <p className="font-medium">No PDFs selected</p>
                <p className="text-sm">Add 2+ files to merge them</p>
            </div>
        ) : (
            <div className="space-y-3">
                {pdfFiles.map((file, idx) => (
                    <div key={`${file.name}-${idx}`} className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700">
                        <div className="flex items-center gap-4">
                            <div className="w-8 h-8 rounded-full bg-red-100 dark:bg-red-900/30 text-red-600 flex items-center justify-center font-bold">
                                {idx + 1}
                            </div>
                            <div>
                                <p className="font-medium text-slate-800 dark:text-slate-200 truncate max-w-xs">{file.name}</p>
                                <p className="text-xs text-slate-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                            </div>
                        </div>
                        <button 
                            onClick={() => removeFile(idx)}
                            className="p-2 text-slate-400 hover:text-red-500"
                        >
                            <Trash2 size={18} />
                        </button>
                    </div>
                ))}
                <button 
                    onClick={mergePDFs}
                    disabled={pdfFiles.length < 2 || processing}
                    className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-bold shadow-lg transition-all disabled:opacity-50"
                >
                    {processing ? <Loader2 className="animate-spin" /> : <Download />}
                    {processing ? 'Merging...' : 'Download Merged PDF'}
                </button>
            </div>
        )}
    </div>
  );
};

const SplitPDFTool: React.FC = () => {
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [pageCount, setPageCount] = useState(0);
  const [splitRange, setSplitRange] = useState('1-end');
  const [processing, setProcessing] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setPdfFile(file);
      
      const buffer = await file.arrayBuffer();
      const pdf = await PDFDocument.load(buffer);
      setPageCount(pdf.getPageCount());
    }
  };

  const splitPDF = async () => {
    if (!pdfFile) return;
    setProcessing(true);

    try {
      const buffer = await pdfFile.arrayBuffer();
      const sourcePdf = await PDFDocument.load(buffer);
      
      const [start, end] = splitRange.split('-');
      const startPage = parseInt(start) - 1;
      const endPage = end === 'end' ? sourcePdf.getPageCount() - 1 : parseInt(end) - 1;
      
      const newPdf = await PDFDocument.create();
      const pages = await newPdf.copyPages(sourcePdf, Array.from({length: endPage - startPage + 1}, (_, i) => startPage + i));
      pages.forEach(page => newPdf.addPage(page));
      
      const pdfBytes = await newPdf.save();
      const blob = new Blob([pdfBytes as any], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = `split-pages-${start}-${end}.pdf`;
      link.click();
    } catch (error) {
      alert('Failed to split PDF. Check your page range.');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="relative">
        <input type="file" accept=".pdf" onChange={handleFileChange} className="absolute inset-0 opacity-0 cursor-pointer" />
        <button className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-lg hover:from-blue-600 hover:to-cyan-600 transition-all shadow-lg font-bold">
          <Upload size={20} /> Select PDF to Split
        </button>
      </div>

      {pdfFile && (
        <div className="space-y-4 p-6 bg-slate-50 dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700">
          <p className="text-sm text-slate-600 dark:text-slate-400">
            <strong>{pdfFile.name}</strong> ({pageCount} pages)
          </p>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Page Range (e.g., 1-5 or 1-end):
            </label>
            <input
              type="text"
              value={splitRange}
              onChange={(e) => setSplitRange(e.target.value)}
              placeholder="1-end"
              className="w-full p-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-800 dark:text-white"
            />
          </div>
          <button
            onClick={splitPDF}
            disabled={processing}
            className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold shadow-lg transition-all disabled:opacity-50"
          >
            {processing ? <Loader2 className="animate-spin" /> : <Scissors />}
            {processing ? 'Splitting...' : 'Split & Download'}
          </button>
        </div>
      )}
    </div>
  );
};

const RotatePDFTool: React.FC = () => {
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [rotation, setRotation] = useState(90);
  const [processing, setProcessing] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setPdfFile(e.target.files[0]);
    }
  };

  const rotatePDF = async () => {
    if (!pdfFile) return;
    setProcessing(true);

    try {
      const buffer = await pdfFile.arrayBuffer();
      const pdfDoc = await PDFDocument.load(buffer);
      
      const pages = pdfDoc.getPages();
      pages.forEach(page => {
        page.setRotation(degrees(rotation));
      });
      
      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes as any], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = `rotated-${rotation}deg.pdf`;
      link.click();
    } catch (error) {
      alert('Failed to rotate PDF.');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="relative">
        <input type="file" accept=".pdf" onChange={handleFileChange} className="absolute inset-0 opacity-0 cursor-pointer" />
        <button className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all shadow-lg font-bold">
          <Upload size={20} /> Select PDF to Rotate
        </button>
      </div>

      {pdfFile && (
        <div className="space-y-4 p-6 bg-slate-50 dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700">
          <p className="text-sm text-slate-600 dark:text-slate-400"><strong>{pdfFile.name}</strong></p>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Rotation Angle:</label>
            <div className="grid grid-cols-4 gap-2">
              {[90, 180, 270, 360].map(deg => (
                <button
                  key={deg}
                  onClick={() => setRotation(deg)}
                  className={`px-4 py-2 rounded-lg font-medium transition-all ${rotation === deg ? 'bg-purple-600 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'}`}
                >
                  {deg}°
                </button>
              ))}
            </div>
          </div>
          <button
            onClick={rotatePDF}
            disabled={processing}
            className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-bold shadow-lg transition-all disabled:opacity-50"
          >
            {processing ? <Loader2 className="animate-spin" /> : <RotateCw />}
            {processing ? 'Rotating...' : 'Rotate & Download'}
          </button>
        </div>
      )}
    </div>
  );
};

const CompressPDFTool: React.FC = () => {
  const [inputFiles, setInputFiles] = useState<FileList | null>(null);
  const [processing, setProcessing] = useState(false);
  const [resultBlob, setResultBlob] = useState<Blob | null>(null);
  const [log, setLog] = useState<string>("");

  async function compress() {
    if (!inputFiles || inputFiles.length === 0) return;
    setProcessing(true);
    setLog("");
    try {
      const file = inputFiles[0];
      const bytes = await file.arrayBuffer();
      setLog((l) => l + "Loaded input PDF\n");
      const pdfDoc = await PDFDocument.load(bytes, {
        updateMetadata: true,
        ignoreEncryption: true,
      });
      setLog((l) => l + "Parsed PDF, pages: " + pdfDoc.getPageCount() + "\n");

      pdfDoc.setTitle("");
      pdfDoc.setAuthor("");
      pdfDoc.setSubject("");
      pdfDoc.setKeywords([]);
      pdfDoc.setProducer("");
      pdfDoc.setCreator("");
      pdfDoc.setCreationDate(undefined);
      pdfDoc.setModificationDate(undefined);

      const compressed = await pdfDoc.save({ useObjectStreams: true });
      setLog((l) => l + "Re-saved with object streams\n");
      const blob = new Blob([compressed as any], { type: "application/pdf" });
      setResultBlob(blob);
      setLog((l) => l + "Done.\n");
    } catch (e) {
      console.error(e);
      setLog((l) => l + "Error: " + (e as Error).message + "\n");
    } finally {
      setProcessing(false);
    }
  }

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold">Compress PDF</h3>
      <p className="text-sm text-muted-foreground">
        Basic optimization: removes metadata and re-saves with object streams.
      </p>
      <div className="space-y-2">
        <input type="file" accept="application/pdf" onChange={(e) => setInputFiles(e.target.files)} />
        <button className="px-4 py-2 bg-indigo-600 text-white rounded" disabled={processing || !inputFiles} onClick={compress}>
          {processing ? "Compressing..." : "Compress"}
        </button>
      </div>
      {resultBlob && (
        <div className="space-y-2">
          <a
            className="underline text-indigo-600"
            href={URL.createObjectURL(resultBlob)}
            download={"compressed.pdf"}
          >
            Download Compressed PDF
          </a>
        </div>
      )}
      {log && (
        <pre className="bg-gray-100 dark:bg-gray-800 p-2 rounded text-xs overflow-auto max-h-48">{log}</pre>
      )}
    </div>
  );
};

const ConvertPDFTool: React.FC = () => {
  const [imageFiles, setImageFiles] = useState<FileList | null>(null);
  const [processing, setProcessing] = useState(false);
  const [pdfBlob, setPdfBlob] = useState<Blob | null>(null);

  async function imagesToPdf() {
    if (!imageFiles || imageFiles.length === 0) return;
    setProcessing(true);
    try {
      const pdfDoc = await PDFDocument.create();
      for (let i = 0; i < imageFiles.length; i++) {
        const f = imageFiles[i];
        const bytes = await f.arrayBuffer();
        const isPng = f.type === 'image/png';
        const embedded = isPng ? await pdfDoc.embedPng(bytes) : await pdfDoc.embedJpg(bytes);
        const page = pdfDoc.addPage([embedded.width, embedded.height]);
        page.drawImage(embedded, { x: 0, y: 0, width: embedded.width, height: embedded.height });
      }
      const out = await pdfDoc.save({ useObjectStreams: true });
      setPdfBlob(new Blob([out as any], { type: 'application/pdf' }));
    } finally {
      setProcessing(false);
    }
  }

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold">Convert</h3>
      <div className="space-y-2">
        <label className="font-medium">Images to PDF</label>
        <input type="file" accept="image/png,image/jpeg" multiple onChange={(e) => setImageFiles(e.target.files)} />
        <button className="px-4 py-2 bg-indigo-600 text-white rounded" disabled={processing || !imageFiles} onClick={imagesToPdf}>
          {processing ? 'Converting...' : 'Create PDF'}
        </button>
      </div>
      {pdfBlob && (
        <a className="underline text-indigo-600" href={URL.createObjectURL(pdfBlob)} download="images-to-pdf.pdf">
          Download PDF
        </a>
      )}
    </div>
  );
};

const QuickEditTool: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [processing, setProcessing] = useState(false);
  const [output, setOutput] = useState<Blob | null>(null);
  const [textToAdd, setTextToAdd] = useState<string>('');
  const [pageIndex, setPageIndex] = useState<number>(0);
  const [position, setPosition] = useState<{ x: number; y: number }>({ x: 50, y: 50 });

  async function applyEdit() {
    if (!file) return;
    setProcessing(true);
    try {
      const bytes = await file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(bytes);
      const pages = pdfDoc.getPages();
      const idx = Math.min(Math.max(0, pageIndex), pages.length - 1);
      const page = pages[idx];
      page.drawText(textToAdd, { x: position.x, y: position.y, size: 12, color: rgb(0, 0, 0) });
      const out = await pdfDoc.save({ useObjectStreams: true });
      setOutput(new Blob([out as any], { type: 'application/pdf' }));
    } finally {
      setProcessing(false);
    }
  }

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold">Quick Edit</h3>
      <div className="space-y-2">
        <input type="file" accept="application/pdf" onChange={(e) => setFile(e.target.files?.[0] ?? null)} />
        <div className="grid grid-cols-2 gap-2">
          <label className="text-sm">Text</label>
          <input className="border rounded px-2 py-1" value={textToAdd} onChange={(e) => setTextToAdd(e.target.value)} />
          <label className="text-sm">Page Index (0-based)</label>
          <input type="number" className="border rounded px-2 py-1" value={pageIndex} onChange={(e) => setPageIndex(parseInt(e.target.value || '0'))} />
          <label className="text-sm">X</label>
          <input type="number" className="border rounded px-2 py-1" value={position.x} onChange={(e) => setPosition({ ...position, x: parseFloat(e.target.value || '0') })} />
          <label className="text-sm">Y</label>
          <input type="number" className="border rounded px-2 py-1" value={position.y} onChange={(e) => setPosition({ ...position, y: parseFloat(e.target.value || '0') })} />
        </div>
        <button className="px-4 py-2 bg-indigo-600 text-white rounded" disabled={processing || !file || !textToAdd} onClick={applyEdit}>
          {processing ? 'Applying...' : 'Apply Text'}
        </button>
      </div>
      {output && (
        <a className="underline text-indigo-600" href={URL.createObjectURL(output)} download="quick-edit.pdf">
          Download Edited PDF
        </a>
      )}
    </div>
  );
};

export default PdfTools;
