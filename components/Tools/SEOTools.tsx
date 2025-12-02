import React, { useState } from 'react';
import { TrendingUp, Search, Link as LinkIcon, Code, Copy, Check, HelpCircle } from 'lucide-react';

type SEOTab = 'META_TAGS' | 'KEYWORD_DENSITY' | 'BACKLINK' | 'SCHEMA';

const SEOTools: React.FC = () => {
  const [activeTab, setActiveTab] = useState<SEOTab>('META_TAGS');
  const [copied, setCopied] = useState(false);

  // Meta Tags State
  const [pageTitle, setPageTitle] = useState('');
  const [metaDescription, setMetaDescription] = useState('');
  const [keywords, setKeywords] = useState('');
  const [siteUrl, setSiteUrl] = useState('');
  const [ogImage, setOgImage] = useState('');
  const [generatedMeta, setGeneratedMeta] = useState('');

  // Keyword Density State
  const [contentText, setContentText] = useState('');
  const [keywordStats, setKeywordStats] = useState<Array<{word: string, count: number, density: number}>>([]);

  // Backlink Analyzer State
  const [backlinks, setBacklinks] = useState('');
  const [backlinkResults, setBacklinkResults] = useState<Array<{url: string, status: string, quality: string}>>([]);

  // Schema Generator State
  const [schemaType, setSchemaType] = useState('Article');
  const [schemaData, setSchemaData] = useState({
    headline: '',
    author: '',
    datePublished: '',
    description: ''
  });
  const [generatedSchema, setGeneratedSchema] = useState('');

  // Generate Meta Tags
  React.useEffect(() => {
    if (pageTitle || metaDescription) {
      const meta = `<!-- Primary Meta Tags -->
<title>${pageTitle || 'Your Page Title Here'}</title>
<meta name="title" content="${pageTitle || 'Your Page Title Here'}">
<meta name="description" content="${metaDescription || 'Your page description here'}">
<meta name="keywords" content="${keywords || 'keyword1, keyword2, keyword3'}">

<!-- Open Graph / Facebook -->
<meta property="og:type" content="website">
<meta property="og:url" content="${siteUrl || 'https://yourwebsite.com/'}">
<meta property="og:title" content="${pageTitle || 'Your Page Title Here'}">
<meta property="og:description" content="${metaDescription || 'Your page description here'}">
<meta property="og:image" content="${ogImage || 'https://yourwebsite.com/og-image.jpg'}">

<!-- Twitter -->
<meta property="twitter:card" content="summary_large_image">
<meta property="twitter:url" content="${siteUrl || 'https://yourwebsite.com/'}">
<meta property="twitter:title" content="${pageTitle || 'Your Page Title Here'}">
<meta property="twitter:description" content="${metaDescription || 'Your page description here'}">
<meta property="twitter:image" content="${ogImage || 'https://yourwebsite.com/og-image.jpg'}">`;
      setGeneratedMeta(meta);
    }
  }, [pageTitle, metaDescription, keywords, siteUrl, ogImage]);

  // Analyze Keyword Density
  const analyzeKeywords = () => {
    if (!contentText.trim()) return;
    
    const words = contentText.toLowerCase()
      .replace(/[^\w\s]/g, ' ')
      .split(/\s+/)
      .filter(word => word.length > 3); // Filter out short words
    
    const totalWords = words.length;
    const wordCount: {[key: string]: number} = {};
    
    words.forEach(word => {
      wordCount[word] = (wordCount[word] || 0) + 1;
    });
    
    const stats = Object.entries(wordCount)
      .map(([word, count]) => ({
        word,
        count,
        density: (count / totalWords) * 100
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 20);
    
    setKeywordStats(stats);
  };

  React.useEffect(() => {
    if (contentText) {
      analyzeKeywords();
    }
  }, [contentText]);

  // Generate Schema Markup
  React.useEffect(() => {
    const schema = {
      "@context": "https://schema.org",
      "@type": schemaType,
      "headline": schemaData.headline || "Your Article Headline",
      "author": {
        "@type": "Person",
        "name": schemaData.author || "Author Name"
      },
      "datePublished": schemaData.datePublished || new Date().toISOString(),
      "description": schemaData.description || "Article description"
    };
    setGeneratedSchema(JSON.stringify(schema, null, 2));
  }, [schemaType, schemaData]);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-6xl mx-auto animate-fade-in">
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 overflow-hidden">
        <div className="p-6 border-b border-slate-200 dark:border-slate-700 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-slate-900 dark:to-slate-800">
          <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
            <TrendingUp className="text-green-600" /> SEO Tools Suite
          </h2>
          
          <div className="flex flex-wrap gap-2">
            {[
              { id: 'META_TAGS', label: 'Meta Tags', icon: Code },
              { id: 'KEYWORD_DENSITY', label: 'Keyword Density', icon: Search },
              { id: 'BACKLINK', label: 'Backlink Check', icon: LinkIcon },
              { id: 'SCHEMA', label: 'Schema Markup', icon: Code },
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as SEOTab)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                    activeTab === tab.id
                      ? 'bg-green-600 text-white shadow-lg'
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
          {activeTab === 'META_TAGS' && (
            <div className="space-y-6">
              <div className="bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-600 p-4 rounded-r-lg">
                <div className="flex items-start gap-2">
                  <HelpCircle className="text-blue-600 flex-shrink-0 mt-0.5" size={18} />
                  <p className="text-sm text-slate-700 dark:text-slate-300">
                    <strong>Usage Guide:</strong> Fill in your page details to generate SEO-optimized meta tags. Title should be 50-60 characters, description 150-160 characters for best results.
                  </p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-bold text-slate-500 uppercase mb-2">
                      Page Title <span className="text-xs text-slate-400">({pageTitle.length}/60)</span>
                    </label>
                    <input
                      type="text"
                      value={pageTitle}
                      onChange={(e) => setPageTitle(e.target.value)}
                      placeholder="Best SEO Tools 2025 | Free Online Tools"
                      maxLength={60}
                      className="w-full p-3 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-green-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-500 uppercase mb-2">
                      Meta Description <span className="text-xs text-slate-400">({metaDescription.length}/160)</span>
                    </label>
                    <textarea
                      value={metaDescription}
                      onChange={(e) => setMetaDescription(e.target.value)}
                      placeholder="Discover the best free online SEO tools to optimize your website..."
                      maxLength={160}
                      rows={3}
                      className="w-full p-3 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-green-500 outline-none resize-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-500 uppercase mb-2">Keywords</label>
                    <input
                      type="text"
                      value={keywords}
                      onChange={(e) => setKeywords(e.target.value)}
                      placeholder="seo tools, meta tags, keyword density, backlink checker"
                      className="w-full p-3 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-green-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-500 uppercase mb-2">Website URL</label>
                    <input
                      type="url"
                      value={siteUrl}
                      onChange={(e) => setSiteUrl(e.target.value)}
                      placeholder="https://yourwebsite.com"
                      className="w-full p-3 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-green-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-500 uppercase mb-2">OG Image URL</label>
                    <input
                      type="url"
                      value={ogImage}
                      onChange={(e) => setOgImage(e.target.value)}
                      placeholder="https://yourwebsite.com/og-image.jpg"
                      className="w-full p-3 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-green-500 outline-none"
                    />
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="block text-sm font-bold text-slate-500 uppercase">Generated Meta Tags</label>
                    <button
                      onClick={() => copyToClipboard(generatedMeta)}
                      className="text-green-600 text-sm flex items-center gap-1 hover:text-green-700"
                    >
                      {copied ? <Check size={14} /> : <Copy size={14} />} {copied ? 'Copied!' : 'Copy'}
                    </button>
                  </div>
                  <pre className="w-full h-[500px] p-4 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 overflow-auto font-mono text-xs text-slate-700 dark:text-slate-300">
                    {generatedMeta || '<!-- Meta tags will appear here -->'}
                  </pre>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'KEYWORD_DENSITY' && (
            <div className="space-y-6">
              <div className="bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-600 p-4 rounded-r-lg">
                <div className="flex items-start gap-2">
                  <HelpCircle className="text-blue-600 flex-shrink-0 mt-0.5" size={18} />
                  <p className="text-sm text-slate-700 dark:text-slate-300">
                    <strong>Usage Guide:</strong> Paste your content to analyze keyword usage. Ideal keyword density is 1-2% for primary keywords. Avoid keyword stuffing (over 3%).
                  </p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-slate-500 uppercase mb-2">Content Text</label>
                  <textarea
                    value={contentText}
                    onChange={(e) => setContentText(e.target.value)}
                    placeholder="Paste your article or webpage content here..."
                    className="w-full h-96 p-4 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-green-500 outline-none resize-none"
                  />
                  <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                    Total Words: {contentText.trim().split(/\s+/).filter(w => w).length}
                  </p>
                </div>
                
                <div>
                  <label className="block text-sm font-bold text-slate-500 uppercase mb-2">Keyword Analysis (Top 20)</label>
                  <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg h-96 overflow-auto">
                    <table className="w-full text-sm">
                      <thead className="bg-slate-200 dark:bg-slate-800 sticky top-0">
                        <tr>
                          <th className="p-3 text-left">Keyword</th>
                          <th className="p-3 text-center">Count</th>
                          <th className="p-3 text-center">Density</th>
                        </tr>
                      </thead>
                      <tbody>
                        {keywordStats.length > 0 ? keywordStats.map((stat, i) => (
                          <tr key={i} className="border-t border-slate-200 dark:border-slate-700">
                            <td className="p-3 font-mono">{stat.word}</td>
                            <td className="p-3 text-center">{stat.count}</td>
                            <td className="p-3 text-center">
                              <span className={`px-2 py-1 rounded ${stat.density > 3 ? 'bg-red-100 dark:bg-red-900/30 text-red-700' : stat.density > 1 ? 'bg-green-100 dark:bg-green-900/30 text-green-700' : 'bg-slate-100 dark:bg-slate-800'}`}>
                                {stat.density.toFixed(2)}%
                              </span>
                            </td>
                          </tr>
                        )) : (
                          <tr>
                            <td colSpan={3} className="p-6 text-center text-slate-500">
                              Paste content to see keyword analysis
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'SCHEMA' && (
            <div className="space-y-6">
              <div className="bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-600 p-4 rounded-r-lg">
                <div className="flex items-start gap-2">
                  <HelpCircle className="text-blue-600 flex-shrink-0 mt-0.5" size={18} />
                  <p className="text-sm text-slate-700 dark:text-slate-300">
                    <strong>Usage Guide:</strong> Generate JSON-LD schema markup for better search engine understanding. Add the code to your page's {'<head>'} section or before closing {'</body>'} tag.
                  </p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-bold text-slate-500 uppercase mb-2">Schema Type</label>
                    <select
                      value={schemaType}
                      onChange={(e) => setSchemaType(e.target.value)}
                      className="w-full p-3 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-green-500 outline-none"
                    >
                      <option>Article</option>
                      <option>BlogPosting</option>
                      <option>Product</option>
                      <option>Organization</option>
                      <option>LocalBusiness</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-500 uppercase mb-2">Headline</label>
                    <input
                      type="text"
                      value={schemaData.headline}
                      onChange={(e) => setSchemaData({...schemaData, headline: e.target.value})}
                      placeholder="Your article headline"
                      className="w-full p-3 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-green-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-500 uppercase mb-2">Author</label>
                    <input
                      type="text"
                      value={schemaData.author}
                      onChange={(e) => setSchemaData({...schemaData, author: e.target.value})}
                      placeholder="Author name"
                      className="w-full p-3 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-green-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-500 uppercase mb-2">Date Published</label>
                    <input
                      type="date"
                      value={schemaData.datePublished}
                      onChange={(e) => setSchemaData({...schemaData, datePublished: e.target.value})}
                      className="w-full p-3 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-green-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-500 uppercase mb-2">Description</label>
                    <textarea
                      value={schemaData.description}
                      onChange={(e) => setSchemaData({...schemaData, description: e.target.value})}
                      placeholder="Brief description of your content"
                      rows={3}
                      className="w-full p-3 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-green-500 outline-none resize-none"
                    />
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="block text-sm font-bold text-slate-500 uppercase">Generated Schema (JSON-LD)</label>
                    <button
                      onClick={() => copyToClipboard(`<script type="application/ld+json">\n${generatedSchema}\n</script>`)}
                      className="text-green-600 text-sm flex items-center gap-1 hover:text-green-700"
                    >
                      {copied ? <Check size={14} /> : <Copy size={14} />} {copied ? 'Copied!' : 'Copy with Script Tag'}
                    </button>
                  </div>
                  <pre className="w-full h-96 p-4 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 overflow-auto font-mono text-xs text-slate-700 dark:text-slate-300">
                    {`<script type="application/ld+json">\n${generatedSchema}\n</script>`}
                  </pre>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SEOTools;
