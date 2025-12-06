import React, { useState } from 'react';
import { Quote, Copy, Download, Plus, Trash2, BookOpen, Globe, FileText, Newspaper, Film, Check } from 'lucide-react';

type CitationStyle = 'APA' | 'MLA' | 'Chicago' | 'Harvard';
type SourceType = 'Book' | 'Website' | 'Journal' | 'Newspaper' | 'Video' | 'Other';

interface Citation {
  id: string;
  style: CitationStyle;
  sourceType: SourceType;
  authors: string;
  title: string;
  year: string;
  publisher?: string;
  url?: string;
  accessDate?: string;
  volume?: string;
  issue?: string;
  pages?: string;
  doi?: string;
}

const CitationGenerator: React.FC = () => {
  const [citations, setCitations] = useState<Citation[]>([]);
  const [currentCitation, setCurrentCitation] = useState<Partial<Citation>>({
    style: 'APA',
    sourceType: 'Book',
    authors: '',
    title: '',
    year: '',
  });
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const formatCitation = (citation: Citation): string => {
    const { style, sourceType, authors, title, year, publisher, url, accessDate, volume, issue, pages, doi } = citation;

    // Helper to format author names
    const formatAuthors = (authorsStr: string, style: CitationStyle): string => {
      if (!authorsStr) return '';
      const authorList = authorsStr.split(',').map(a => a.trim());

      if (style === 'APA' || style === 'Chicago') {
        return authorList.map((author, index) => {
          const parts = author.split(' ');
          if (parts.length >= 2) {
            const lastName = parts[parts.length - 1];
            const initials = parts.slice(0, -1).map(n => n[0] + '.').join(' ');
            return index === 0 ? `${lastName}, ${initials}` : `${initials} ${lastName}`;
          }
          return author;
        }).join(', ');
      } else if (style === 'MLA') {
        return authorList.map((author, index) => {
          const parts = author.split(' ');
          if (parts.length >= 2 && index === 0) {
            const lastName = parts[parts.length - 1];
            const firstName = parts.slice(0, -1).join(' ');
            return `${lastName}, ${firstName}`;
          }
          return author;
        }).join(', and ');
      } else if (style === 'Harvard') {
        return authorList.map((author) => {
          const parts = author.split(' ');
          if (parts.length >= 2) {
            const lastName = parts[parts.length - 1];
            const initials = parts.slice(0, -1).map(n => n[0].toUpperCase()).join('.');
            return `${lastName}, ${initials}.`;
          }
          return author;
        }).join(', ');
      }
      return authorsStr;
    };

    const formattedAuthors = formatAuthors(authors, style);

    // APA Style
    if (style === 'APA') {
      if (sourceType === 'Book') {
        return `${formattedAuthors} (${year}). *${title}*${publisher ? `. ${publisher}` : ''}.`;
      } else if (sourceType === 'Website') {
        return `${formattedAuthors} (${year}). *${title}*. ${url || ''}${accessDate ? ` Retrieved ${accessDate}` : ''}`;
      } else if (sourceType === 'Journal') {
        return `${formattedAuthors} (${year}). ${title}. *Journal Name*${volume ? `, ${volume}` : ''}${issue ? `(${issue})` : ''}${pages ? `, ${pages}` : ''}${doi ? `. https://doi.org/${doi}` : ''}`;
      }
    }

    // MLA Style
    if (style === 'MLA') {
      if (sourceType === 'Book') {
        return `${formattedAuthors}. *${title}*${publisher ? `. ${publisher}` : ''}${year ? `, ${year}` : ''}.`;
      } else if (sourceType === 'Website') {
        return `${formattedAuthors}. "${title}." *Website Name*${year ? `, ${year}` : ''}${url ? `, ${url}` : ''}${accessDate ? `. Accessed ${accessDate}` : ''}.`;
      } else if (sourceType === 'Journal') {
        return `${formattedAuthors}. "${title}." *Journal Name*${volume ? `, vol. ${volume}` : ''}${issue ? `, no. ${issue}` : ''}${year ? `, ${year}` : ''}${pages ? `, pp. ${pages}` : ''}.`;
      }
    }

    // Chicago Style
    if (style === 'Chicago') {
      if (sourceType === 'Book') {
        return `${formattedAuthors}. *${title}*${publisher ? `. ${publisher}` : ''}${year ? `, ${year}` : ''}.`;
      } else if (sourceType === 'Website') {
        return `${formattedAuthors}. "${title}."${url ? ` ${url}` : ''}${accessDate ? ` (accessed ${accessDate})` : ''}.`;
      } else if (sourceType === 'Journal') {
        return `${formattedAuthors}. "${title}." *Journal Name*${volume ? ` ${volume}` : ''}${issue ? `, no. ${issue}` : ''}${year ? ` (${year})` : ''}${pages ? `: ${pages}` : ''}.`;
      }
    }

    // Harvard Style
    if (style === 'Harvard') {
      if (sourceType === 'Book') {
        return `${formattedAuthors} ${year}, *${title}*${publisher ? `, ${publisher}` : ''}.`;
      } else if (sourceType === 'Website') {
        return `${formattedAuthors} ${year}, *${title}*${url ? `, Available at: ${url}` : ''}${accessDate ? ` (Accessed: ${accessDate})` : ''}.`;
      } else if (sourceType === 'Journal') {
        return `${formattedAuthors} ${year}, '${title}', *Journal Name*${volume ? `, vol. ${volume}` : ''}${issue ? `, no. ${issue}` : ''}${pages ? `, pp. ${pages}` : ''}.`;
      }
    }

    return `${formattedAuthors} (${year}). ${title}.`;
  };

  const addCitation = () => {
    if (!currentCitation.authors || !currentCitation.title || !currentCitation.year) {
      alert('Please fill in at least Authors, Title, and Year');
      return;
    }

    const newCitation: Citation = {
      id: Date.now().toString(),
      style: currentCitation.style || 'APA',
      sourceType: currentCitation.sourceType || 'Book',
      authors: currentCitation.authors || '',
      title: currentCitation.title || '',
      year: currentCitation.year || '',
      publisher: currentCitation.publisher,
      url: currentCitation.url,
      accessDate: currentCitation.accessDate,
      volume: currentCitation.volume,
      issue: currentCitation.issue,
      pages: currentCitation.pages,
      doi: currentCitation.doi,
    };

    setCitations([...citations, newCitation]);
    // Reset form
    setCurrentCitation({
      style: currentCitation.style,
      sourceType: currentCitation.sourceType,
      authors: '',
      title: '',
      year: '',
    });
  };

  const deleteCitation = (id: string) => {
    setCitations(citations.filter(c => c.id !== id));
  };

  const copyCitation = (citation: Citation) => {
    const formatted = formatCitation(citation);
    navigator.clipboard.writeText(formatted);
    setCopiedId(citation.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const exportBibliography = () => {
    const bibliography = citations.map(c => formatCitation(c)).join('\n\n');
    const blob = new Blob([bibliography], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'bibliography.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  const getSourceIcon = (type: SourceType) => {
    switch (type) {
      case 'Book': return <BookOpen size={16} />;
      case 'Website': return <Globe size={16} />;
      case 'Journal': return <FileText size={16} />;
      case 'Newspaper': return <Newspaper size={16} />;
      case 'Video': return <Film size={16} />;
      default: return <Quote size={16} />;
    }
  };

  const showAdvancedFields = currentCitation.sourceType === 'Journal' || currentCitation.sourceType === 'Website';

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center mb-4">
          <div className="p-4 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl shadow-lg">
            <Quote className="text-white" size={32} />
          </div>
        </div>
        <h2 className="text-4xl font-bold text-slate-900 dark:text-white mb-2">Citation Generator</h2>
        <p className="text-slate-600 dark:text-slate-400">Generate properly formatted citations in multiple styles</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Input Form */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-6">
          <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
            <Plus size={20} />
            Create Citation
          </h3>

          <div className="space-y-4">
            {/* Citation Style */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                Citation Style
              </label>
              <div className="grid grid-cols-2 gap-2">
                {(['APA', 'MLA', 'Chicago', 'Harvard'] as CitationStyle[]).map(style => (
                  <button
                    key={style}
                    onClick={() => setCurrentCitation({ ...currentCitation, style })}
                    className={`px-4 py-2 rounded-lg font-medium transition-all ${currentCitation.style === style
                        ? 'bg-indigo-600 text-white shadow-lg'
                        : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
                      }`}
                  >
                    {style}
                  </button>
                ))}
              </div>
            </div>

            {/* Source Type */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                Source Type
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(['Book', 'Website', 'Journal', 'Newspaper', 'Video', 'Other'] as SourceType[]).map(type => (
                  <button
                    key={type}
                    onClick={() => setCurrentCitation({ ...currentCitation, sourceType: type })}
                    className={`px-3 py-2 rounded-lg font-medium text-sm transition-all flex items-center justify-center gap-2 ${currentCitation.sourceType === type
                        ? 'bg-purple-600 text-white shadow-lg'
                        : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
                      }`}
                  >
                    {getSourceIcon(type)}
                    {type}
                  </button>
                ))}
              </div>
            </div>

            {/* Basic Fields */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                Authors <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="e.g., John Smith, Jane Doe"
                value={currentCitation.authors || ''}
                onChange={(e) => setCurrentCitation({ ...currentCitation, authors: e.target.value })}
                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
              />
              <p className="text-xs text-slate-500 mt-1">Separate multiple authors with commas</p>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="Enter the title"
                value={currentCitation.title || ''}
                onChange={(e) => setCurrentCitation({ ...currentCitation, title: e.target.value })}
                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                  Year <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="2024"
                  value={currentCitation.year || ''}
                  onChange={(e) => setCurrentCitation({ ...currentCitation, year: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                  Publisher
                </label>
                <input
                  type="text"
                  placeholder="Publisher name"
                  value={currentCitation.publisher || ''}
                  onChange={(e) => setCurrentCitation({ ...currentCitation, publisher: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                />
              </div>
            </div>

            {/* Advanced Fields */}
            {showAdvancedFields && (
              <div className="space-y-4 pt-4 border-t border-slate-200 dark:border-slate-700">
                <h4 className="text-sm font-bold text-slate-700 dark:text-slate-300">Additional Information</h4>

                {currentCitation.sourceType === 'Website' && (
                  <>
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                        URL
                      </label>
                      <input
                        type="url"
                        placeholder="https://example.com"
                        value={currentCitation.url || ''}
                        onChange={(e) => setCurrentCitation({ ...currentCitation, url: e.target.value })}
                        className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                        Access Date
                      </label>
                      <input
                        type="text"
                        placeholder="December 5, 2024"
                        value={currentCitation.accessDate || ''}
                        onChange={(e) => setCurrentCitation({ ...currentCitation, accessDate: e.target.value })}
                        className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                      />
                    </div>
                  </>
                )}

                {currentCitation.sourceType === 'Journal' && (
                  <>
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                          Volume
                        </label>
                        <input
                          type="text"
                          placeholder="10"
                          value={currentCitation.volume || ''}
                          onChange={(e) => setCurrentCitation({ ...currentCitation, volume: e.target.value })}
                          className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                          Issue
                        </label>
                        <input
                          type="text"
                          placeholder="3"
                          value={currentCitation.issue || ''}
                          onChange={(e) => setCurrentCitation({ ...currentCitation, issue: e.target.value })}
                          className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                          Pages
                        </label>
                        <input
                          type="text"
                          placeholder="45-67"
                          value={currentCitation.pages || ''}
                          onChange={(e) => setCurrentCitation({ ...currentCitation, pages: e.target.value })}
                          className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                        DOI
                      </label>
                      <input
                        type="text"
                        placeholder="10.1000/xyz123"
                        value={currentCitation.doi || ''}
                        onChange={(e) => setCurrentCitation({ ...currentCitation, doi: e.target.value })}
                        className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                      />
                    </div>
                  </>
                )}
              </div>
            )}

            <button
              onClick={addCitation}
              className="w-full mt-6 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-xl font-bold shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center gap-2"
            >
              <Plus size={20} />
              Add Citation
            </button>
          </div>
        </div>

        {/* Bibliography */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <BookOpen size={20} />
              Bibliography ({citations.length})
            </h3>
            {citations.length > 0 && (
              <button
                onClick={exportBibliography}
                className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium shadow-lg transition-all flex items-center gap-2"
              >
                <Download size={16} />
                Export
              </button>
            )}
          </div>

          {citations.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-slate-100 dark:bg-slate-700/50 rounded-full flex items-center justify-center mx-auto mb-4">
                <Quote className="text-slate-400" size={32} />
              </div>
              <p className="text-slate-500 dark:text-slate-400">No citations yet. Create your first citation!</p>
            </div>
          ) : (
            <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
              {citations.map((citation) => (
                <div
                  key={citation.id}
                  className="bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl p-4 hover:shadow-md transition-all group"
                >
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div className="flex items-center gap-2 text-sm font-semibold text-slate-600 dark:text-slate-400">
                      {getSourceIcon(citation.sourceType)}
                      <span>{citation.style} - {citation.sourceType}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => copyCitation(citation)}
                        className="p-2 hover:bg-indigo-100 dark:hover:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-lg transition-all"
                        title="Copy citation"
                      >
                        {copiedId === citation.id ? <Check size={16} /> : <Copy size={16} />}
                      </button>
                      <button
                        onClick={() => deleteCitation(citation.id)}
                        className="p-2 hover:bg-red-100 dark:hover:bg-red-900/30 text-red-600 dark:text-red-400 rounded-lg transition-all"
                        title="Delete citation"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                  <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                    {formatCitation(citation)}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Info Panel */}
      <div className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-slate-800 dark:to-slate-900 rounded-2xl border border-indigo-200 dark:border-slate-700 p-6">
        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-3">💡 Citation Tips</h3>
        <ul className="space-y-2 text-sm text-slate-700 dark:text-slate-300">
          <li>• <strong>APA</strong>: Commonly used in social sciences and psychology</li>
          <li>• <strong>MLA</strong>: Standard for humanities and liberal arts</li>
          <li>• <strong>Chicago</strong>: Popular in history and some humanities disciplines</li>
          <li>• <strong>Harvard</strong>: Widely used in UK universities and business schools</li>
          <li>• Always double-check your citations against official style guides</li>
        </ul>
      </div>
    </div>
  );
};

export default CitationGenerator;