import React, { useState } from 'react';
import { BarChart3, DollarSign, TrendingUp, Copy, Check, HelpCircle } from 'lucide-react';

type AnalyticsTab = 'UTM_BUILDER' | 'ROI_CALC' | 'AB_TEST' | 'CONVERSION';

const AnalyticsTools: React.FC = () => {
  const [activeTab, setActiveTab] = useState<AnalyticsTab>('UTM_BUILDER');
  const [copied, setCopied] = useState(false);

  // UTM Builder State
  const [utmData, setUtmData] = useState({
    baseUrl: '',
    source: '',
    medium: '',
    campaign: '',
    term: '',
    content: ''
  });
  const [generatedUrl, setGeneratedUrl] = useState('');

  // ROI Calculator State
  const [investment, setInvestment] = useState('');
  const [revenue, setRevenue] = useState('');
  const [roi, setRoi] = useState({ value: 0, percentage: 0, profit: 0 });

  // A/B Test Calculator State
  const [variantA, setVariantA] = useState({ visitors: '', conversions: '' });
  const [variantB, setVariantB] = useState({ visitors: '', conversions: '' });
  const [abResult, setAbResult] = useState({ significant: false, confidence: 0, winner: '' });

  // Conversion Rate Calculator State
  const [visitors, setVisitors] = useState('');
  const [conversions, setConversions] = useState('');
  const [conversionRate, setConversionRate] = useState(0);

  // Generate UTM URL
  React.useEffect(() => {
    if (utmData.baseUrl && utmData.source && utmData.medium && utmData.campaign) {
      let url = utmData.baseUrl;
      const params = new URLSearchParams();
      if (utmData.source) params.append('utm_source', utmData.source);
      if (utmData.medium) params.append('utm_medium', utmData.medium);
      if (utmData.campaign) params.append('utm_campaign', utmData.campaign);
      if (utmData.term) params.append('utm_term', utmData.term);
      if (utmData.content) params.append('utm_content', utmData.content);
      setGeneratedUrl(`${url}?${params.toString()}`);
    }
  }, [utmData]);

  // Calculate ROI
  React.useEffect(() => {
    const inv = parseFloat(investment) || 0;
    const rev = parseFloat(revenue) || 0;
    const profit = rev - inv;
    const roiValue = inv > 0 ? (profit / inv) * 100 : 0;
    setRoi({ value: inv, percentage: roiValue, profit });
  }, [investment, revenue]);

  // Calculate A/B Test Significance
  const calculateABTest = () => {
    const aVisitors = parseInt(variantA.visitors) || 0;
    const aConversions = parseInt(variantA.conversions) || 0;
    const bVisitors = parseInt(variantB.visitors) || 0;
    const bConversions = parseInt(variantB.conversions) || 0;

    if (aVisitors === 0 || bVisitors === 0) return;

    const aRate = aConversions / aVisitors;
    const bRate = bConversions / bVisitors;

    // Simplified z-test calculation
    const pooledRate = (aConversions + bConversions) / (aVisitors + bVisitors);
    const se = Math.sqrt(pooledRate * (1 - pooledRate) * (1/aVisitors + 1/bVisitors));
    const zScore = Math.abs(aRate - bRate) / se;
    const confidence = (1 - Math.exp(-zScore * zScore / 2)) * 100;

    setAbResult({
      significant: confidence > 95,
      confidence: confidence,
      winner: bRate > aRate ? 'Variant B' : 'Variant A'
    });
  };

  // Calculate Conversion Rate
  React.useEffect(() => {
    const v = parseInt(visitors) || 0;
    const c = parseInt(conversions) || 0;
    setConversionRate(v > 0 ? (c / v) * 100 : 0);
  }, [visitors, conversions]);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-6xl mx-auto animate-fade-in">
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 overflow-hidden">
        <div className="p-6 border-b border-slate-200 dark:border-slate-700 bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-slate-900 dark:to-slate-800">
          <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
            <BarChart3 className="text-blue-600" /> Analytics & Marketing Tools
          </h2>
          
          <div className="flex flex-wrap gap-2">
            {[
              { id: 'UTM_BUILDER', label: 'UTM Builder', icon: TrendingUp },
              { id: 'ROI_CALC', label: 'ROI Calculator', icon: DollarSign },
              { id: 'AB_TEST', label: 'A/B Test', icon: BarChart3 },
              { id: 'CONVERSION', label: 'Conversion Rate', icon: TrendingUp },
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as AnalyticsTab)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                    activeTab === tab.id
                      ? 'bg-blue-600 text-white shadow-lg'
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
          {activeTab === 'UTM_BUILDER' && (
            <div className="space-y-6">
              <div className="bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-600 p-4 rounded-r-lg">
                <div className="flex items-start gap-2">
                  <HelpCircle className="text-blue-600 flex-shrink-0 mt-0.5" size={18} />
                  <p className="text-sm text-slate-700 dark:text-slate-300">
                    <strong>Usage Guide:</strong> Create trackable URLs for your marketing campaigns. Use consistent naming conventions. Source = where traffic comes from, Medium = marketing medium, Campaign = specific promotion name.
                  </p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-bold text-slate-500 uppercase mb-2">Website URL *</label>
                    <input
                      type="url"
                      value={utmData.baseUrl}
                      onChange={(e) => setUtmData({...utmData, baseUrl: e.target.value})}
                      placeholder="https://yourwebsite.com/page"
                      className="w-full p-3 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-500 uppercase mb-2">Campaign Source *</label>
                    <input
                      type="text"
                      value={utmData.source}
                      onChange={(e) => setUtmData({...utmData, source: e.target.value})}
                      placeholder="google, facebook, newsletter"
                      className="w-full p-3 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-500 uppercase mb-2">Campaign Medium *</label>
                    <input
                      type="text"
                      value={utmData.medium}
                      onChange={(e) => setUtmData({...utmData, medium: e.target.value})}
                      placeholder="cpc, email, social, banner"
                      className="w-full p-3 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-500 uppercase mb-2">Campaign Name *</label>
                    <input
                      type="text"
                      value={utmData.campaign}
                      onChange={(e) => setUtmData({...utmData, campaign: e.target.value})}
                      placeholder="summer_sale_2025"
                      className="w-full p-3 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-500 uppercase mb-2">Campaign Term (optional)</label>
                    <input
                      type="text"
                      value={utmData.term}
                      onChange={(e) => setUtmData({...utmData, term: e.target.value})}
                      placeholder="keyword, search term"
                      className="w-full p-3 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-500 uppercase mb-2">Campaign Content (optional)</label>
                    <input
                      type="text"
                      value={utmData.content}
                      onChange={(e) => setUtmData({...utmData, content: e.target.value})}
                      placeholder="banner_red, link_blue"
                      className="w-full p-3 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="block text-sm font-bold text-slate-500 uppercase">Generated Tracking URL</label>
                    {generatedUrl && (
                      <button
                        onClick={() => copyToClipboard(generatedUrl)}
                        className="text-blue-600 text-sm flex items-center gap-1 hover:text-blue-700"
                      >
                        {copied ? <Check size={14} /> : <Copy size={14} />} {copied ? 'Copied!' : 'Copy'}
                      </button>
                    )}
                  </div>
                  <div className="p-4 rounded-lg bg-blue-50 dark:bg-blue-900/20 border-2 border-blue-200 dark:border-blue-700 min-h-[200px] break-all font-mono text-sm text-blue-700 dark:text-blue-400">
                    {generatedUrl || 'Fill in the required fields to generate URL'}
                  </div>
                  
                  <div className="mt-6 p-4 bg-slate-50 dark:bg-slate-900 rounded-lg">
                    <h4 className="font-bold text-slate-700 dark:text-slate-300 mb-2">Quick Examples:</h4>
                    <div className="space-y-1 text-sm text-slate-600 dark:text-slate-400">
                      <p>• Source: <code className="bg-slate-200 dark:bg-slate-800 px-1 rounded">google</code>, Medium: <code className="bg-slate-200 dark:bg-slate-800 px-1 rounded">cpc</code></p>
                      <p>• Source: <code className="bg-slate-200 dark:bg-slate-800 px-1 rounded">facebook</code>, Medium: <code className="bg-slate-200 dark:bg-slate-800 px-1 rounded">social</code></p>
                      <p>• Source: <code className="bg-slate-200 dark:bg-slate-800 px-1 rounded">newsletter</code>, Medium: <code className="bg-slate-200 dark:bg-slate-800 px-1 rounded">email</code></p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'ROI_CALC' && (
            <div className="space-y-6">
              <div className="bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-600 p-4 rounded-r-lg">
                <div className="flex items-start gap-2">
                  <HelpCircle className="text-blue-600 flex-shrink-0 mt-0.5" size={18} />
                  <p className="text-sm text-slate-700 dark:text-slate-300">
                    <strong>Usage Guide:</strong> Calculate Return on Investment (ROI). Formula: ((Revenue - Investment) / Investment) × 100. A positive ROI means profit, negative means loss.
                  </p>
                </div>
              </div>

              <div className="max-w-2xl mx-auto space-y-6">
                <div>
                  <label className="block text-sm font-bold text-slate-500 uppercase mb-2">Total Investment ($)</label>
                  <input
                    type="number"
                    value={investment}
                    onChange={(e) => setInvestment(e.target.value)}
                    placeholder="10000"
                    className="w-full p-4 text-lg rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-bold text-slate-500 uppercase mb-2">Total Revenue ($)</label>
                  <input
                    type="number"
                    value={revenue}
                    onChange={(e) => setRevenue(e.target.value)}
                    placeholder="15000"
                    className="w-full p-4 text-lg rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>

                <div className="grid grid-cols-3 gap-4 pt-4">
                  <div className="p-6 rounded-lg bg-blue-50 dark:bg-blue-900/20 border-2 border-blue-200 dark:border-blue-700 text-center">
                    <div className="text-3xl font-bold text-blue-600">{roi.percentage.toFixed(2)}%</div>
                    <div className="text-sm text-slate-600 dark:text-slate-400 uppercase mt-1">ROI</div>
                  </div>
                  <div className="p-6 rounded-lg bg-green-50 dark:bg-green-900/20 border-2 border-green-200 dark:border-green-700 text-center">
                    <div className="text-3xl font-bold text-green-600">${roi.profit.toFixed(2)}</div>
                    <div className="text-sm text-slate-600 dark:text-slate-400 uppercase mt-1">Profit</div>
                  </div>
                  <div className="p-6 rounded-lg bg-purple-50 dark:bg-purple-900/20 border-2 border-purple-200 dark:border-purple-700 text-center">
                    <div className="text-3xl font-bold text-purple-600">${parseFloat(revenue || '0').toFixed(2)}</div>
                    <div className="text-sm text-slate-600 dark:text-slate-400 uppercase mt-1">Revenue</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'AB_TEST' && (
            <div className="space-y-6">
              <div className="bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-600 p-4 rounded-r-lg">
                <div className="flex items-start gap-2">
                  <HelpCircle className="text-blue-600 flex-shrink-0 mt-0.5" size={18} />
                  <p className="text-sm text-slate-700 dark:text-slate-300">
                    <strong>Usage Guide:</strong> Test if your A/B test results are statistically significant. 95%+ confidence means the difference is unlikely due to chance. Always test one variable at a time.
                  </p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="p-6 rounded-lg bg-blue-50 dark:bg-blue-900/20 border-2 border-blue-200 dark:border-blue-700">
                  <h3 className="font-bold text-lg text-slate-800 dark:text-white mb-4">Variant A (Control)</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-bold text-slate-500 uppercase mb-2">Visitors</label>
                      <input
                        type="number"
                        value={variantA.visitors}
                        onChange={(e) => setVariantA({...variantA, visitors: e.target.value})}
                        placeholder="5000"
                        className="w-full p-3 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-blue-500 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-slate-500 uppercase mb-2">Conversions</label>
                      <input
                        type="number"
                        value={variantA.conversions}
                        onChange={(e) => setVariantA({...variantA, conversions: e.target.value})}
                        placeholder="250"
                        className="w-full p-3 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-blue-500 outline-none"
                      />
                    </div>
                    <div className="text-center p-3 bg-white dark:bg-slate-900 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">
                        {(parseInt(variantA.visitors) > 0 ? (parseInt(variantA.conversions) / parseInt(variantA.visitors)) * 100 : 0).toFixed(2)}%
                      </div>
                      <div className="text-xs text-slate-500 uppercase">Conversion Rate</div>
                    </div>
                  </div>
                </div>

                <div className="p-6 rounded-lg bg-green-50 dark:bg-green-900/20 border-2 border-green-200 dark:border-green-700">
                  <h3 className="font-bold text-lg text-slate-800 dark:text-white mb-4">Variant B (Test)</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-bold text-slate-500 uppercase mb-2">Visitors</label>
                      <input
                        type="number"
                        value={variantB.visitors}
                        onChange={(e) => setVariantB({...variantB, visitors: e.target.value})}
                        placeholder="5000"
                        className="w-full p-3 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-blue-500 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-slate-500 uppercase mb-2">Conversions</label>
                      <input
                        type="number"
                        value={variantB.conversions}
                        onChange={(e) => setVariantB({...variantB, conversions: e.target.value})}
                        placeholder="300"
                        className="w-full p-3 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-blue-500 outline-none"
                      />
                    </div>
                    <div className="text-center p-3 bg-white dark:bg-slate-900 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">
                        {(parseInt(variantB.visitors) > 0 ? (parseInt(variantB.conversions) / parseInt(variantB.visitors)) * 100 : 0).toFixed(2)}%
                      </div>
                      <div className="text-xs text-slate-500 uppercase">Conversion Rate</div>
                    </div>
                  </div>
                </div>
              </div>

              <button
                onClick={calculateABTest}
                className="w-full py-4 bg-blue-600 text-white rounded-lg font-bold text-lg hover:bg-blue-700 transition-all"
              >
                Calculate Statistical Significance
              </button>

              {abResult.confidence > 0 && (
                <div className={`p-6 rounded-lg text-center ${abResult.significant ? 'bg-green-50 dark:bg-green-900/20 border-2 border-green-500' : 'bg-yellow-50 dark:bg-yellow-900/20 border-2 border-yellow-500'}`}>
                  <div className="text-4xl font-bold mb-2">{abResult.confidence.toFixed(1)}%</div>
                  <div className="text-lg font-bold text-slate-700 dark:text-slate-300 mb-1">Confidence Level</div>
                  <div className={`text-xl font-bold ${abResult.significant ? 'text-green-600' : 'text-yellow-600'}`}>
                    {abResult.significant ? `✓ Statistically Significant! Winner: ${abResult.winner}` : '⚠ Not Statistically Significant (need more data)'}
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'CONVERSION' && (
            <div className="space-y-6">
              <div className="bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-600 p-4 rounded-r-lg">
                <div className="flex items-start gap-2">
                  <HelpCircle className="text-blue-600 flex-shrink-0 mt-0.5" size={18} />
                  <p className="text-sm text-slate-700 dark:text-slate-300">
                    <strong>Usage Guide:</strong> Calculate your conversion rate. Formula: (Conversions / Total Visitors) × 100. Average e-commerce conversion rate is 2-3%. Landing pages can achieve 5-15%.
                  </p>
                </div>
              </div>

              <div className="max-w-2xl mx-auto space-y-6">
                <div>
                  <label className="block text-sm font-bold text-slate-500 uppercase mb-2">Total Visitors</label>
                  <input
                    type="number"
                    value={visitors}
                    onChange={(e) => setVisitors(e.target.value)}
                    placeholder="10000"
                    className="w-full p-4 text-lg rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-bold text-slate-500 uppercase mb-2">Total Conversions</label>
                  <input
                    type="number"
                    value={conversions}
                    onChange={(e) => setConversions(e.target.value)}
                    placeholder="250"
                    className="w-full p-4 text-lg rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>

                <div className="p-8 rounded-lg bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border-2 border-blue-200 dark:border-blue-700 text-center">
                  <div className="text-6xl font-bold text-blue-600 mb-2">{conversionRate.toFixed(2)}%</div>
                  <div className="text-xl text-slate-600 dark:text-slate-400">Conversion Rate</div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 rounded-lg bg-slate-50 dark:bg-slate-900 text-center">
                    <div className="text-2xl font-bold text-slate-700 dark:text-slate-300">{visitors || 0}</div>
                    <div className="text-sm text-slate-500">Visitors</div>
                  </div>
                  <div className="p-4 rounded-lg bg-slate-50 dark:bg-slate-900 text-center">
                    <div className="text-2xl font-bold text-slate-700 dark:text-slate-300">{conversions || 0}</div>
                    <div className="text-sm text-slate-500">Conversions</div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AnalyticsTools;
