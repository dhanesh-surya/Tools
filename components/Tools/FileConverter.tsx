import React, { useState, useRef } from 'react';
import {
  FileType, Upload, Download, RefreshCw, CheckCircle2,
  AlertCircle, File, Image as ImageIcon, FileText,
  Music, Video, Archive, Code, Zap, ArrowRight,
  Info, Trash2, FileCode
} from 'lucide-react';

interface ConversionOption {
  from: string[];
  to: string[];
  category: string;
  icon: any;
}

interface FileItem {
  id: string;
  file: File;
  name: string;
  size: number;
  type: string;
  status: 'pending' | 'converting' | 'completed' | 'error';
  convertedBlob?: Blob;
  convertedName?: string;
  error?: string;
}

const FileConverter: React.FC = () => {
  const [files, setFiles] = useState<FileItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('image');
  const [targetFormat, setTargetFormat] = useState<string>('');
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const conversionOptions: ConversionOption[] = [
    {
      category: 'image',
      from: ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp', 'svg'],
      to: ['jpg', 'png', 'webp', 'gif', 'bmp'],
      icon: ImageIcon,
    },
    {
      category: 'document',
      from: ['txt', 'md', 'html', 'csv', 'json', 'xml'],
      to: ['txt', 'md', 'html', 'csv', 'json', 'xml'],
      icon: FileText,
    },
    {
      category: 'code',
      from: ['js', 'jsx', 'ts', 'tsx', 'css', 'scss', 'json', 'xml', 'html'],
      to: ['txt', 'json', 'xml', 'html'],
      icon: Code,
    },
  ];

  const selectedOption = conversionOptions.find(opt => opt.category === selectedCategory);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const droppedFiles = Array.from(e.dataTransfer.files);
    addFiles(droppedFiles);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);
      addFiles(selectedFiles);
    }
  };

  const addFiles = (newFiles: File[]) => {
    const fileItems: FileItem[] = newFiles.map(file => ({
      id: Math.random().toString(36).substr(2, 9),
      file,
      name: file.name,
      size: file.size,
      type: file.type,
      status: 'pending',
    }));

    setFiles(prev => [...prev, ...fileItems]);
  };

  const removeFile = (id: string) => {
    setFiles(prev => prev.filter(f => f.id !== id));
  };

  const convertFile = async (fileItem: FileItem) => {
    if (!targetFormat) {
      alert('Please select a target format first!');
      return;
    }

    setFiles(prev => prev.map(f =>
      f.id === fileItem.id ? { ...f, status: 'converting' } : f
    ));

    try {
      let convertedBlob: Blob;
      // Ensure proper filename with extension
      const baseNameWithoutExt = fileItem.name.replace(/\.[^.]*$/, '') || fileItem.name;
      const newFileName = `${baseNameWithoutExt}.${targetFormat}`;

      // Image conversion
      if (selectedCategory === 'image') {
        convertedBlob = await convertImage(fileItem.file, targetFormat);
      }
      // Text-based file conversion
      else {
        const text = await fileItem.file.text();
        const result = await convertTextFile(text, fileItem.name, targetFormat);
        convertedBlob = result.blob;
      }

      setFiles(prev => prev.map(f =>
        f.id === fileItem.id
          ? { ...f, status: 'completed', convertedBlob, convertedName: newFileName }
          : f
      ));
    } catch (error) {
      console.error('Conversion error:', error);
      setFiles(prev => prev.map(f =>
        f.id === fileItem.id
          ? { ...f, status: 'error', error: error instanceof Error ? error.message : 'Conversion failed' }
          : f
      ));
    }
  };

  const convertImage = async (file: File, format: string): Promise<Blob> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      const reader = new FileReader();

      reader.onload = (e) => {
        img.onload = () => {
          try {
            const canvas = document.createElement('canvas');
            canvas.width = img.width;
            canvas.height = img.height;

            const ctx = canvas.getContext('2d');
            if (!ctx) {
              reject(new Error('Could not get canvas context'));
              return;
            }

            // For formats that don't support transparency, fill with white background
            if (format === 'jpg' || format === 'bmp') {
              ctx.fillStyle = '#FFFFFF';
              ctx.fillRect(0, 0, canvas.width, canvas.height);
            }

            ctx.drawImage(img, 0, 0);

            canvas.toBlob(
              (blob) => {
                if (blob) {
                  resolve(blob);
                } else {
                  reject(new Error('Conversion failed - blob is null'));
                }
              },
              `image/${format === 'jpg' ? 'jpeg' : format}`,
              0.95
            );
          } catch (err) {
            reject(err);
          }
        };

        img.onerror = () => reject(new Error('Failed to load image'));
        img.src = e.target?.result as string;
      };

      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsDataURL(file);
    });
  };

  const convertTextFile = async (content: string, originalFileName: string, targetFormat: string): Promise<{ blob: Blob; fileName: string }> => {
    let convertedContent = content;
    let mimeType = 'text/plain';
    const baseName = originalFileName.replace(/\.[^.]+$/, '');

    try {
      // CSV to JSON
      if (targetFormat === 'json' && originalFileName.toLowerCase().endsWith('.csv')) {
        convertedContent = csvToJson(content);
        mimeType = 'application/json';
      }
      // JSON to CSV
      else if (targetFormat === 'csv' && originalFileName.toLowerCase().endsWith('.json')) {
        convertedContent = jsonToCsv(content);
        mimeType = 'text/csv';
      }
      // Any to HTML
      else if (targetFormat === 'html') {
        convertedContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${baseName}</title>
  <style>
    body { font-family: monospace; padding: 20px; background: #f5f5f5; }
    pre { background: white; padding: 20px; border-radius: 8px; overflow-x: auto; }
  </style>
</head>
<body>
  <h1>${baseName}</h1>
  <pre>${escapeHtml(content)}</pre>
</body>
</html>`;
        mimeType = 'text/html';
      }
      // Any to Markdown
      else if (targetFormat === 'md') {
        convertedContent = `# ${baseName}\n\n\`\`\`\n${content}\n\`\`\``;
        mimeType = 'text/markdown';
      }
      // XML formatting
      else if (targetFormat === 'xml') {
        convertedContent = content;
        mimeType = 'application/xml';
      }
      // Plain text (default)
      else if (targetFormat === 'txt') {
        convertedContent = content;
        mimeType = 'text/plain';
      }
    } catch (error) {
      throw new Error(`Conversion error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }

    const blob = new Blob([convertedContent], { type: mimeType });
    const fileName = `${baseName}.${targetFormat}`;

    return { blob, fileName };
  };

  const csvToJson = (csv: string): string => {
    const lines = csv.trim().split('\n');
    if (lines.length < 2) {
      throw new Error('CSV must have at least a header and one data row');
    }

    const headers = lines[0].split(',').map(h => h.trim());
    const result = [];

    for (let i = 1; i < lines.length; i++) {
      const obj: any = {};
      const currentLine = lines[i].split(',');

      headers.forEach((header, index) => {
        obj[header] = currentLine[index]?.trim() || '';
      });

      result.push(obj);
    }

    return JSON.stringify(result, null, 2);
  };

  const jsonToCsv = (json: string): string => {
    const data = JSON.parse(json);

    if (!Array.isArray(data)) {
      throw new Error('JSON must be an array of objects');
    }

    if (data.length === 0) {
      throw new Error('JSON array is empty');
    }

    const headers = Object.keys(data[0]);
    const csvRows = [headers.join(',')];

    data.forEach(row => {
      const values = headers.map(header => {
        const value = row[header];
        // Escape values with commas
        if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
          return `"${value.replace(/"/g, '""')}"`;
        }
        return value ?? '';
      });
      csvRows.push(values.join(','));
    });

    return csvRows.join('\n');
  };

  const escapeHtml = (text: string): string => {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  };

  const convertAll = () => {
    if (!targetFormat) {
      alert('Please select a target format first!');
      return;
    }

    files.forEach(file => {
      if (file.status === 'pending') {
        convertFile(file);
      }
    });
  };

  const downloadFile = (fileItem: FileItem) => {
    if (!fileItem.convertedBlob || !fileItem.convertedName) {
      console.error('No converted file available');
      return;
    }

    try {
      // Ensure filename has proper extension
      let downloadName = fileItem.convertedName;

      // Validate and fix filename if needed
      if (!downloadName.includes('.') || !downloadName.endsWith(`.${targetFormat}`)) {
        const baseName = downloadName.replace(/\.[^.]*$/, '') || 'converted';
        downloadName = `${baseName}.${targetFormat}`;
      }

      // Create download link
      const url = URL.createObjectURL(fileItem.convertedBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = downloadName;
      link.setAttribute('download', downloadName); // Ensure attribute is set
      link.style.display = 'none';

      // Trigger download
      document.body.appendChild(link);
      link.click();

      // Cleanup
      setTimeout(() => {
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      }, 100);

      console.log('Downloaded:', downloadName);
    } catch (error) {
      console.error('Download error:', error);
      alert('Failed to download file. Please try again.');
    }
  };

  const downloadAll = () => {
    files.forEach((file, index) => {
      if (file.status === 'completed' && file.convertedBlob) {
        // Stagger downloads slightly to avoid browser blocking
        setTimeout(() => downloadFile(file), index * 100);
      }
    });
  };

  const clearAll = () => {
    setFiles([]);
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 bg-gradient-to-br from-green-500 via-teal-500 to-blue-500 rounded-xl flex items-center justify-center shadow-lg">
          <FileType className="text-white" size={24} />
        </div>
        <div>
          <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-200">File Converter</h3>
          <p className="text-sm text-slate-600 dark:text-slate-400">Convert files between different formats</p>
        </div>
      </div>

      {/* Category Selection */}
      <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-700">
        <label className="block text-sm font-medium mb-3 text-slate-700 dark:text-slate-300">
          Select Conversion Type
        </label>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {conversionOptions.map((option) => {
            const Icon = option.icon;
            return (
              <button
                key={option.category}
                onClick={() => {
                  setSelectedCategory(option.category);
                  setTargetFormat('');
                }}
                className={`p-4 rounded-lg border-2 transition-all ${selectedCategory === option.category
                    ? 'border-teal-500 bg-teal-50 dark:bg-teal-900/20 text-teal-700 dark:text-teal-300'
                    : 'border-slate-200 dark:border-slate-600 hover:border-teal-300 dark:hover:border-teal-700'
                  }`}
              >
                <Icon className="mx-auto mb-2" size={32} />
                <div className="text-sm font-bold capitalize">{option.category}</div>
                <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  {option.from.length} formats
                </div>
              </button>
            );
          })}
        </div>

        {selectedOption && (
          <div className="mt-4">
            <label className="block text-sm font-medium mb-2 text-slate-700 dark:text-slate-300">
              Convert To
            </label>
            <select
              value={targetFormat}
              onChange={(e) => setTargetFormat(e.target.value)}
              className="w-full p-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
            >
              <option value="">Select target format...</option>
              {selectedOption.to.map((format) => (
                <option key={format} value={format}>
                  .{format.toUpperCase()}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Upload Area */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`border-2 border-dashed rounded-xl p-12 text-center cursor-pointer transition-all ${isDragging
            ? 'border-teal-500 bg-teal-50 dark:bg-teal-900/20'
            : 'border-slate-300 dark:border-slate-600 hover:border-teal-400 dark:hover:border-teal-600 hover:bg-slate-50 dark:hover:bg-slate-800/50'
          }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          onChange={handleFileSelect}
          className="hidden"
          accept={selectedOption?.from.map(f => `.${f}`).join(',')}
        />
        <Upload className="mx-auto mb-4 text-teal-500" size={48} />
        <h4 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-2">
          Drop files here or click to browse
        </h4>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Supported formats: {selectedOption?.from.map(f => `.${f}`).join(', ')}
        </p>
      </div>

      {/* File List */}
      {files.length > 0 && (
        <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-700">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-lg font-semibold text-slate-800 dark:text-slate-200">
              Files ({files.length})
            </h4>
            <div className="flex gap-2">
              <button
                onClick={convertAll}
                disabled={!targetFormat || files.every(f => f.status !== 'pending')}
                className="flex items-center gap-2 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm font-medium"
              >
                <Zap size={16} />
                Convert All
              </button>
              <button
                onClick={downloadAll}
                disabled={!files.some(f => f.status === 'completed')}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm font-medium"
              >
                <Download size={16} />
                Download All
              </button>
              <button
                onClick={clearAll}
                className="flex items-center gap-2 px-4 py-2 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-lg hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors text-sm font-medium"
              >
                <Trash2 size={16} />
                Clear
              </button>
            </div>
          </div>

          <div className="space-y-3">
            {files.map((fileItem) => (
              <div
                key={fileItem.id}
                className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-700/50 rounded-lg"
              >
                <div className="flex items-center gap-3 flex-1">
                  <File className="text-slate-400" size={24} />
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-slate-900 dark:text-slate-100 truncate">
                      {fileItem.name}
                    </div>
                    <div className="text-xs text-slate-500 dark:text-slate-400">
                      {formatFileSize(fileItem.size)}
                      {fileItem.convertedName && (
                        <span className="ml-2 text-teal-600 dark:text-teal-400 font-medium">
                          → {fileItem.convertedName}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  {fileItem.status === 'pending' && (
                    <>
                      <ArrowRight className="text-slate-400" size={20} />
                      <button
                        onClick={() => convertFile(fileItem)}
                        disabled={!targetFormat}
                        className="px-3 py-1.5 bg-teal-500 text-white rounded-lg hover:bg-teal-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm font-medium"
                      >
                        Convert
                      </button>
                    </>
                  )}

                  {fileItem.status === 'converting' && (
                    <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400">
                      <RefreshCw className="animate-spin" size={20} />
                      <span className="text-sm font-medium">Converting...</span>
                    </div>
                  )}

                  {fileItem.status === 'completed' && (
                    <>
                      <CheckCircle2 className="text-green-600 dark:text-green-400" size={20} />
                      <button
                        onClick={() => downloadFile(fileItem)}
                        className="px-3 py-1.5 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-sm font-medium flex items-center gap-2"
                      >
                        <Download size={16} />
                        Download
                      </button>
                    </>
                  )}

                  {fileItem.status === 'error' && (
                    <div className="flex items-center gap-2 text-red-600 dark:text-red-400">
                      <AlertCircle size={20} />
                      <span className="text-sm">{fileItem.error}</span>
                    </div>
                  )}

                  <button
                    onClick={() => removeFile(fileItem.id)}
                    className="p-1.5 hover:bg-slate-200 dark:hover:bg-slate-600 rounded transition-colors"
                  >
                    <Trash2 size={16} className="text-slate-400" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Info & Tips */}
      <div className="bg-gradient-to-r from-teal-50 to-blue-50 dark:from-teal-900/20 dark:to-blue-900/20 border border-teal-200 dark:border-teal-800/30 rounded-xl p-6">
        <h5 className="font-semibold text-teal-900 dark:text-teal-200 mb-3 flex items-center gap-2">
          <Info size={20} />
          Conversion Tips
        </h5>
        <div className="grid md:grid-cols-2 gap-3 text-sm text-teal-800 dark:text-teal-300">
          <div className="flex items-start gap-2">
            <CheckCircle2 size={16} className="mt-0.5 flex-shrink-0" />
            <span>All conversions happen in your browser - completely private</span>
          </div>
          <div className="flex items-start gap-2">
            <Zap size={16} className="mt-0.5 flex-shrink-0" />
            <span>Convert multiple files at once for efficiency</span>
          </div>
          <div className="flex items-start gap-2">
            <ImageIcon size={16} className="mt-0.5 flex-shrink-0" />
            <span>Image quality is preserved at 95% during conversion</span>
          </div>
          <div className="flex items-start gap-2">
            <FileCode size={16} className="mt-0.5 flex-shrink-0" />
            <span>Downloaded files always include the correct extension</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FileConverter;