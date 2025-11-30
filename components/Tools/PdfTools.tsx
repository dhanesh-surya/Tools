import React, { useState } from 'react';
import { File as FileIcon, Upload, Download, Trash2, Plus, ArrowDown, Loader2 } from 'lucide-react';
import { PDFDocument } from 'pdf-lib';

const PdfTools: React.FC = () => {
  const [pdfFiles, setPdfFiles] = useState<File[]>([]);
  const [processing, setProcessing] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files).filter(f => f.type === 'application/pdf');
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
            copiedPages.forEach((page) => mergedPdf.addPage(page));
        }

        const pdfBytes = await mergedPdf.save();
        const blob = new Blob([pdfBytes], { type: 'application/pdf' });
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
    <div className="max-w-4xl mx-auto animate-fade-in">
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 overflow-hidden">
            <div className="p-6 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center bg-slate-50 dark:bg-slate-900/50">
                <div>
                    <h3 className="text-xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
                        <FileIcon className="text-red-500" /> PDF Merger
                    </h3>
                    <p className="text-sm text-slate-500">Combine multiple PDF files into a single document.</p>
                </div>
                <div className="relative">
                    <input 
                        type="file" 
                        multiple 
                        accept=".pdf" 
                        onChange={handleFileChange}
                        className="absolute inset-0 opacity-0 cursor-pointer"
                    />
                    <button className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-600 transition-colors shadow-sm font-medium text-slate-700 dark:text-slate-200">
                        <Plus size={18} /> Add Files
                    </button>
                </div>
            </div>

            <div className="p-6 min-h-[300px] bg-slate-50/50 dark:bg-slate-950/50">
                {pdfFiles.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center py-12 text-slate-400 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-xl">
                        <Upload size={48} className="mb-4 opacity-50" />
                        <p className="font-medium">Drag & Drop or Click "Add Files"</p>
                        <p className="text-sm">to start merging PDFs</p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {pdfFiles.map((file, idx) => (
                            <div key={`${file.name}-${idx}`} className="flex items-center justify-between p-4 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm animate-fade-in">
                                <div className="flex items-center gap-4">
                                    <div className="w-8 h-8 rounded-full bg-red-100 dark:bg-red-900/30 text-red-600 flex items-center justify-center font-bold text-sm">
                                        {idx + 1}
                                    </div>
                                    <div>
                                        <p className="font-medium text-slate-800 dark:text-slate-200 truncate max-w-[200px] md:max-w-md">{file.name}</p>
                                        <p className="text-xs text-slate-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                                    </div>
                                </div>
                                <button 
                                    onClick={() => removeFile(idx)}
                                    className="p-2 text-slate-400 hover:text-red-500 transition-colors"
                                >
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <div className="p-6 border-t border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 flex justify-end">
                <button 
                    onClick={mergePDFs}
                    disabled={pdfFiles.length < 2 || processing}
                    className="flex items-center gap-2 px-8 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-bold shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {processing ? <Loader2 className="animate-spin" /> : <Download />}
                    {processing ? 'Merging...' : 'Merge PDF'}
                </button>
            </div>
        </div>
    </div>
  );
};

export default PdfTools;