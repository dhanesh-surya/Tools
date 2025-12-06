import React, { useState } from 'react';
import { Link, BarChart3, Copy, ExternalLink, Trash2, RefreshCw } from 'lucide-react';

const URLShortener: React.FC = () => {
  const [originalUrl, setOriginalUrl] = useState('');
  const [customSlug, setCustomSlug] = useState('');
  const [shortenedUrls, setShortenedUrls] = useState<any[]>([]);
  const [isShortening, setIsShortening] = useState(false);
  const [selectedUrl, setSelectedUrl] = useState<any>(null);

  // Mock data for demonstration
  const mockAnalytics = {
    clicks: 1247,
    uniqueVisitors: 892,
    topReferrers: [
      { source: 'Direct', count: 456 },
      { source: 'Twitter', count: 234 },
      { source: 'Facebook', count: 189 },
      { source: 'Reddit', count: 156 },
      { source: 'Other', count: 212 }
    ],
    clicksByDate: [
      { date: '2025-12-01', clicks: 45 },
      { date: '2025-12-02', clicks: 67 },
      { date: '2025-12-03', clicks: 89 },
      { date: '2025-12-04', clicks: 123 },
      { date: '2025-12-05', clicks: 156 },
      { date: '2025-12-06', clicks: 178 },
      { date: '2025-12-07', clicks: 201 }
    ],
    countries: [
      { country: 'United States', count: 456 },
      { country: 'United Kingdom', count: 234 },
      { country: 'Canada', count: 123 },
      { country: 'Germany', count: 98 },
      { country: 'Australia', count: 87 }
    ]
  };

  const shortenUrl = async () => {
    if (!originalUrl.trim()) return;

    setIsShortening(true);

    // Simulate API call
    setTimeout(() => {
      const slug = customSlug.trim() || generateSlug();
      const shortUrl = `https://short.ly/${slug}`;

      const newUrl = {
        id: Date.now(),
        originalUrl: originalUrl.trim(),
        shortUrl,
        slug,
        createdAt: new Date().toISOString(),
        clicks: Math.floor(Math.random() * 1000) + 100,
        analytics: mockAnalytics
      };

      setShortenedUrls(prev => [newUrl, ...prev]);
      setOriginalUrl('');
      setCustomSlug('');
      setIsShortening(false);
    }, 1000);
  };

  const generateSlug = () => {
    const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < 6; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const deleteUrl = (id: number) => {
    setShortenedUrls(prev => prev.filter(url => url.id !== id));
    if (selectedUrl?.id === id) {
      setSelectedUrl(null);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-200">URL Shortener with Analytics</h3>

      {/* URL Shortener Form */}
      <div className="bg-white dark:bg-slate-800 rounded-lg p-6 shadow-sm border border-slate-200 dark:border-slate-700">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2 text-slate-700 dark:text-slate-300">
              Original URL
            </label>
            <input
              type="url"
              value={originalUrl}
              onChange={(e) => setOriginalUrl(e.target.value)}
              placeholder="https://example.com/very-long-url-that-needs-shortening"
              className="w-full p-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-slate-700 dark:text-slate-300">
              Custom Slug (optional)
            </label>
            <div className="flex gap-2">
              <span className="flex items-center px-3 bg-slate-100 dark:bg-slate-700 border border-r-0 border-slate-300 dark:border-slate-600 rounded-l-lg text-slate-500 dark:text-slate-400">
                short.ly/
              </span>
              <input
                type="text"
                value={customSlug}
                onChange={(e) => setCustomSlug(e.target.value.replace(/[^a-zA-Z0-9-_]/g, ''))}
                placeholder="my-custom-link"
                className="flex-1 p-3 border border-slate-300 dark:border-slate-600 rounded-r-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100"
              />
            </div>
          </div>

          <button
            onClick={shortenUrl}
            disabled={isShortening || !originalUrl.trim()}
            className="w-full bg-primary text-white py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
          >
            {isShortening ? <RefreshCw size={18} className="animate-spin" /> : <Link size={18} />}
            {isShortening ? 'Shortening...' : 'Shorten URL'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* URL List */}
        <div>
          <h4 className="text-lg font-semibold mb-4 text-slate-800 dark:text-slate-200">Your Shortened URLs</h4>
          <div className="space-y-3">
            {shortenedUrls.length === 0 ? (
              <div className="text-center py-8 text-slate-500 dark:text-slate-400">
                <Link size={48} className="mx-auto mb-4 opacity-50" />
                <p>No shortened URLs yet</p>
                <p className="text-sm">Create your first short link above</p>
              </div>
            ) : (
              shortenedUrls.map((url) => (
                <div
                  key={url.id}
                  className={`bg-white dark:bg-slate-800 rounded-lg p-4 shadow-sm border transition-all cursor-pointer ${
                    selectedUrl?.id === url.id
                      ? 'border-primary shadow-lg'
                      : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
                  }`}
                  onClick={() => setSelectedUrl(url)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-medium text-slate-900 dark:text-slate-100 truncate">
                          {url.shortUrl}
                        </span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            copyToClipboard(url.shortUrl);
                          }}
                          className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                          title="Copy short URL"
                        >
                          <Copy size={14} />
                        </button>
                      </div>
                      <p className="text-sm text-slate-500 dark:text-slate-400 truncate mb-2">
                        {url.originalUrl}
                      </p>
                      <div className="flex items-center gap-4 text-xs text-slate-400 dark:text-slate-500">
                        <span>{url.clicks} clicks</span>
                        <span>{formatDate(url.createdAt)}</span>
                      </div>
                    </div>
                    <div className="flex gap-1 ml-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          window.open(url.shortUrl, '_blank');
                        }}
                        className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                        title="Open short URL"
                      >
                        <ExternalLink size={14} />
                      </button>
                      <button
                        onClick={(e) => deleteUrl(url.id)}
                        className="p-2 text-slate-400 hover:text-red-500"
                        title="Delete URL"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Analytics */}
        <div>
          {selectedUrl ? (
            <div>
              <div className="flex items-center gap-2 mb-4">
                <BarChart3 size={20} className="text-slate-600 dark:text-slate-400" />
                <h4 className="text-lg font-semibold text-slate-800 dark:text-slate-200">Analytics</h4>
              </div>

              <div className="space-y-4">
                {/* Overview Stats */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white dark:bg-slate-800 rounded-lg p-4 shadow-sm border border-slate-200 dark:border-slate-700">
                    <div className="text-2xl font-bold text-primary">{selectedUrl.analytics.clicks.toLocaleString()}</div>
                    <div className="text-sm text-slate-500 dark:text-slate-400">Total Clicks</div>
                  </div>
                  <div className="bg-white dark:bg-slate-800 rounded-lg p-4 shadow-sm border border-slate-200 dark:border-slate-700">
                    <div className="text-2xl font-bold text-green-600">{selectedUrl.analytics.uniqueVisitors.toLocaleString()}</div>
                    <div className="text-sm text-slate-500 dark:text-slate-400">Unique Visitors</div>
                  </div>
                </div>

                {/* Top Referrers */}
                <div className="bg-white dark:bg-slate-800 rounded-lg p-4 shadow-sm border border-slate-200 dark:border-slate-700">
                  <h5 className="font-medium mb-3 text-slate-800 dark:text-slate-200">Top Referrers</h5>
                  <div className="space-y-2">
                    {selectedUrl.analytics.topReferrers.map((referrer: any, index: number) => (
                      <div key={index} className="flex items-center justify-between">
                        <span className="text-sm text-slate-600 dark:text-slate-400">{referrer.source}</span>
                        <span className="text-sm font-medium text-slate-800 dark:text-slate-200">{referrer.count}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Clicks Over Time */}
                <div className="bg-white dark:bg-slate-800 rounded-lg p-4 shadow-sm border border-slate-200 dark:border-slate-700">
                  <h5 className="font-medium mb-3 text-slate-800 dark:text-slate-200">Clicks Over Time</h5>
                  <div className="space-y-2">
                    {selectedUrl.analytics.clicksByDate.slice(-7).map((day: any, index: number) => (
                      <div key={index} className="flex items-center gap-3">
                        <span className="text-xs text-slate-500 dark:text-slate-400 w-16">
                          {new Date(day.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        </span>
                        <div className="flex-1 bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                          <div
                            className="bg-primary h-2 rounded-full"
                            style={{ width: `${(day.clicks / Math.max(...selectedUrl.analytics.clicksByDate.map((d: any) => d.clicks))) * 100}%` }}
                          />
                        </div>
                        <span className="text-xs text-slate-600 dark:text-slate-400 w-8 text-right">{day.clicks}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-16 text-slate-500 dark:text-slate-400">
              <BarChart3 size={48} className="mx-auto mb-4 opacity-50" />
              <p>Select a shortened URL to view analytics</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default URLShortener;