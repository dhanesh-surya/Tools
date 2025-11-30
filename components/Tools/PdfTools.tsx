import React, { useState } from 'react';
import { File as FileIcon, Upload, Download, Trash2, Plus, Loader2, Scissors, RotateCw, Zap, FileEdit, Globe } from 'lucide-react';
import { PDFDocument, degrees } from 'pdf-lib';

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
                {activeTab === 'COMPRESS' && <CompressPDFInfo />}
                {activeTab === 'CONVERT' && <ConvertPDFInfo />}
                {activeTab === 'EDIT' && <QuickEditInfo />}
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
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
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
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
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

const CompressPDFInfo: React.FC = () => (
  <div className="p-6 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-slate-900 dark:to-emerald-900/20 rounded-lg border border-green-200 dark:border-green-800">
    <h3 className="text-xl font-bold text-green-800 dark:text-green-300 mb-4 flex items-center gap-2">
      <Zap size={24} /> Compress PDFs
    </h3>
    <p className="text-slate-700 dark:text-slate-300 mb-4">
      For advanced PDF compression (reduce file size while maintaining quality), we recommend:
    </p>
    <ul className="space-y-3">
      <li className="flex items-start gap-3">
        <span className="text-green-600 font-bold">•</span>
        <div>
          <strong className="text-slate-800 dark:text-white">Smallpdf</strong> - <a href="https://smallpdf.com/compress-pdf" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">smallpdf.com/compress-pdf</a>
          <p className="text-sm text-slate-600 dark:text-slate-400">Free online compression with excellent quality</p>
        </div>
      </li>
      <li className="flex items-start gap-3">
        <span className="text-green-600 font-bold">•</span>
        <div>
          <strong className="text-slate-800 dark:text-white">PDF24</strong> - <a href="https://tools.pdf24.org/en/compress-pdf" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">tools.pdf24.org</a>
          <p className="text-sm text-slate-600 dark:text-slate-400">Free desktop & online tool with batch processing</p>
        </div>
      </li>
      <li className="flex items-start gap-3">
        <span className="text-green-600 font-bold">•</span>
        <div>
          <strong className="text-slate-800 dark:text-white">Adobe Acrobat</strong> - Premium quality compression
          <p className="text-sm text-slate-600 dark:text-slate-400">Best for professional use</p>
        </div>
      </li>
    </ul>
  </div>
);

const ConvertPDFInfo: React.FC = () => (
  <div className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-slate-900 dark:to-indigo-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
    <h3 className="text-xl font-bold text-blue-800 dark:text-blue-300 mb-4 flex items-center gap-2">
      <FileEdit size={24} /> Convert PDFs (Word, Excel, Images)
    </h3>
    <p className="text-slate-700 dark:text-slate-300 mb-4">
      Convert PDFs to/from Word, Excel, PowerPoint, and images:
    </p>
    <div className="grid md:grid-cols-2 gap-4">
      <div className="p-4 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
        <h4 className="font-bold text-slate-800 dark:text-white mb-2">📄 To/From Word & Excel</h4>
        <ul className="text-sm space-y-1 text-slate-600 dark:text-slate-400">
          <li>• <a href="https://www.ilovepdf.com/pdf_to_word" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">ILovePDF</a></li>
          <li>• <a href="https://www.sejda.com/pdf-to-word" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Sejda</a></li>
          <li>• PDFelement (Desktop)</li>
        </ul>
      </div>
      <div className="p-4 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
        <h4 className="font-bold text-slate-800 dark:text-white mb-2">🖼️ To/From Images</h4>
        <ul className="text-sm space-y-1 text-slate-600 dark:text-slate-400">
          <li>• <a href="https://www.pdf2go.com/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">PDF2Go</a></li>
          <li>• <a href="https://cloudconvert.com/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">CloudConvert</a></li>
          <li>• Adobe Acrobat</li>
        </ul>
      </div>
    </div>
  </div>
);

const QuickEditInfo: React.FC = () => (
  <div className="p-6 bg-gradient-to-br from-orange-50 to-red-50 dark:from-slate-900 dark:to-orange-900/20 rounded-lg border border-orange-200 dark:border-orange-800">
    <h3 className="text-xl font-bold text-orange-800 dark:text-orange-300 mb-4 flex items-center gap-2">
      <Globe size={24} /> Quick Online PDF Editors
    </h3>
    <p className="text-slate-700 dark:text-slate-300 mb-4">
      For quick edits without installing software (add text, signatures, highlights, annotations):
    </p>
    <div className="grid md:grid-cols-3 gap-4">
      {[
        { name: 'Smallpdf', url: 'https://smallpdf.com/edit-pdf', desc: 'Full-featured online editor' },
        { name: 'PDFgear', url: 'https://www.pdfgear.com/', desc: 'Free editing & annotation' },
        { name: 'Sejda', url: 'https://www.sejda.com/pdf-editor', desc: 'No registration needed' },
        { name: 'DocHub', url: 'https://dochub.com/', desc: 'Sign & fill forms easily' },
        { name: 'pdfFiller', url: 'https://www.pdffiller.com/', desc: 'Advanced form filling' },
        { name: 'PDF-XChange', url: 'https://www.pdf-xchange.com/', desc: 'Desktop viewer/editor' },
      ].map(tool => (
        <a 
          key={tool.name}
          href={tool.url}
          target="_blank"
          rel="noopener noreferrer"
          className="p-4 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 hover:shadow-lg transition-all"
        >
          <h4 className="font-bold text-slate-800 dark:text-white mb-1">{tool.name}</h4>
          <p className="text-xs text-slate-600 dark:text-slate-400">{tool.desc}</p>
          <span className="text-xs text-blue-600 hover:underline mt-2 inline-block">Visit →</span>
        </a>
      ))}
    </div>
    
    <div className="mt-6 p-4 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
      <h4 className="font-bold text-slate-800 dark:text-white mb-2">🛠️ Desktop Power Tools (Advanced Batch Processing)</h4>
      <ul className="text-sm space-y-1 text-slate-600 dark:text-slate-400">
        <li>• <strong>PDFtk</strong> - Command-line tool for scripting/automation</li>
        <li>• <strong>QPDF</strong> - CLI for repair, encryption, transformation</li>
        <li>• <strong>PDFsam</strong> - Open-source split & merge with GUI</li>
        <li>• <strong>Adobe Acrobat Pro</strong> - Industry standard for professional editing</li>
      </ul>
    </div>
  </div>
);

export default PdfTools;
