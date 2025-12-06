import React, { useState, useEffect } from 'react';
import { Heart, MessageCircle, Share, Bookmark, TrendingUp, BarChart3, Users, Target, Zap, Award, AlertTriangle, CheckCircle } from 'lucide-react';

interface EngagementMetrics {
  followers: number;
  likes: number;
  comments: number;
  shares: number;
  saves: number;
  impressions: number;
  reach: number;
}

interface EngagementResults {
  engagementRate: number;
  engagementScore: 'Poor' | 'Average' | 'Good' | 'Excellent';
  benchmarkComparison: string;
  recommendations: string[];
  insights: string[];
}

const EngagementCalculator: React.FC = () => {
  const [platform, setPlatform] = useState<'instagram' | 'twitter' | 'facebook' | 'tiktok' | 'linkedin'>('instagram');
  const [postType, setPostType] = useState<'post' | 'reel' | 'story' | 'tweet' | 'video'>('post');
  const [metrics, setMetrics] = useState<EngagementMetrics>({
    followers: 0,
    likes: 0,
    comments: 0,
    shares: 0,
    saves: 0,
    impressions: 0,
    reach: 0
  });
  const [results, setResults] = useState<EngagementResults | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);

  const platforms = [
    { id: 'instagram', name: 'Instagram', icon: '📸', color: 'from-pink-500 to-purple-600' },
    { id: 'twitter', name: 'Twitter/X', icon: '🐦', color: 'from-blue-400 to-blue-600' },
    { id: 'facebook', name: 'Facebook', icon: '👥', color: 'from-blue-600 to-blue-800' },
    { id: 'tiktok', name: 'TikTok', icon: '🎵', color: 'from-black to-gray-800' },
    { id: 'linkedin', name: 'LinkedIn', icon: '💼', color: 'from-blue-700 to-blue-900' }
  ];

  const postTypes = {
    instagram: [
      { id: 'post', name: 'Post', icon: '🖼️' },
      { id: 'reel', name: 'Reel', icon: '🎬' },
      { id: 'story', name: 'Story', icon: '📱' }
    ],
    twitter: [
      { id: 'tweet', name: 'Tweet', icon: '💬' }
    ],
    facebook: [
      { id: 'post', name: 'Post', icon: '📝' },
      { id: 'video', name: 'Video', icon: '🎥' }
    ],
    tiktok: [
      { id: 'video', name: 'Video', icon: '🎵' }
    ],
    linkedin: [
      { id: 'post', name: 'Post', icon: '💼' }
    ]
  };

  const calculateEngagement = async () => {
    setIsCalculating(true);

    // Simulate API delay for better UX
    await new Promise(resolve => setTimeout(resolve, 800));

    const { followers, likes, comments, shares, saves, impressions, reach } = metrics;

    if (followers === 0 || impressions === 0) {
      setResults(null);
      setIsCalculating(false);
      return;
    }

    // Calculate total engagements
    const totalEngagements = likes + comments + shares + saves;

    // Calculate engagement rate based on platform and post type
    let engagementRate = 0;
    let benchmark = 0;

    switch (platform) {
      case 'instagram':
        if (postType === 'reel') {
          engagementRate = (totalEngagements / impressions) * 100;
          benchmark = 3.5; // Good reel engagement rate
        } else if (postType === 'story') {
          engagementRate = (totalEngagements / reach) * 100;
          benchmark = 1.2; // Good story engagement rate
        } else {
          engagementRate = (totalEngagements / impressions) * 100;
          benchmark = 1.8; // Good post engagement rate
        }
        break;
      case 'twitter':
        engagementRate = (totalEngagements / impressions) * 100;
        benchmark = 0.5; // Good tweet engagement rate
        break;
      case 'facebook':
        engagementRate = (totalEngagements / impressions) * 100;
        benchmark = 0.8; // Good Facebook engagement rate
        break;
      case 'tiktok':
        engagementRate = (totalEngagements / impressions) * 100;
        benchmark = 5.0; // Good TikTok engagement rate
        break;
      case 'linkedin':
        engagementRate = (totalEngagements / impressions) * 100;
        benchmark = 0.3; // Good LinkedIn engagement rate
        break;
    }

    // Determine engagement score
    let engagementScore: 'Poor' | 'Average' | 'Good' | 'Excellent';
    let benchmarkComparison = '';
    const recommendations: string[] = [];
    const insights: string[] = [];

    if (engagementRate >= benchmark * 1.5) {
      engagementScore = 'Excellent';
      benchmarkComparison = `${((engagementRate / benchmark - 1) * 100).toFixed(0)}% above average`;
      insights.push('🎉 Outstanding performance! Your content is resonating exceptionally well.');
      recommendations.push('Keep creating similar content and analyze what makes it successful.');
      recommendations.push('Consider creating more content in this format.');
    } else if (engagementRate >= benchmark) {
      engagementScore = 'Good';
      benchmarkComparison = `${((engagementRate / benchmark - 1) * 100).toFixed(0)}% above average`;
      insights.push('👍 Good engagement! Your content is performing above average.');
      recommendations.push('Maintain this quality and experiment with similar content types.');
    } else if (engagementRate >= benchmark * 0.5) {
      engagementScore = 'Average';
      benchmarkComparison = `${((1 - engagementRate / benchmark) * 100).toFixed(0)}% below average`;
      insights.push('🤔 Average performance. Room for improvement.');
      recommendations.push('Try different content formats or posting times.');
      recommendations.push('Engage more with your audience through comments and DMs.');
    } else {
      engagementScore = 'Poor';
      benchmarkComparison = `${((1 - engagementRate / benchmark) * 100).toFixed(0)}% below average`;
      insights.push('⚠️ Low engagement. Significant improvements needed.');
      recommendations.push('Review your content strategy and audience targeting.');
      recommendations.push('Post at optimal times for your audience.');
      recommendations.push('Create more engaging content formats (questions, polls, stories).');
      recommendations.push('Collaborate with other creators or run contests.');
    }

    // Additional insights based on metrics
    if (likes > comments * 3) {
      insights.push('❤️ High like-to-comment ratio suggests visual appeal but limited discussion.');
      recommendations.push('Ask questions in captions to encourage more comments.');
    }

    if (comments > likes * 0.5) {
      insights.push('💬 High comment engagement indicates strong community interaction.');
      recommendations.push('Continue encouraging discussions and respond to comments promptly.');
    }

    if (shares > totalEngagements * 0.3) {
      insights.push('🔄 High share rate! Your content is highly shareable.');
      recommendations.push('Create more viral-worthy content.');
    }

    if (saves > totalEngagements * 0.2) {
      insights.push('💾 High save rate indicates valuable, reference-worthy content.');
      recommendations.push('Create more educational or inspirational content.');
    }

    // Reach vs Impressions analysis
    if (reach > 0 && impressions > reach * 1.5) {
      insights.push('👀 Good impression-to-reach ratio suggests multiple views per person.');
      recommendations.push('Your content is engaging enough for repeated views.');
    }

    setResults({
      engagementRate: parseFloat(engagementRate.toFixed(2)),
      engagementScore,
      benchmarkComparison,
      recommendations,
      insights
    });

    setIsCalculating(false);
  };

  const updateMetric = (field: keyof EngagementMetrics, value: string) => {
    const numValue = parseInt(value) || 0;
    setMetrics(prev => ({ ...prev, [field]: numValue }));
  };

  const resetCalculator = () => {
    setMetrics({
      followers: 0,
      likes: 0,
      comments: 0,
      shares: 0,
      saves: 0,
      impressions: 0,
      reach: 0
    });
    setResults(null);
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full">
            <TrendingUp className="text-white" size={24} />
          </div>
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Engagement Calculator</h2>
        </div>
        <p className="text-slate-600 dark:text-slate-400">Calculate and analyze your social media engagement rates with AI-powered insights</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Input Section */}
        <div className="space-y-6">
          {/* Platform Selection */}
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
              <Target size={20} />
              Platform & Content Type
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Social Media Platform
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {platforms.map((p) => (
                    <button
                      key={p.id}
                      onClick={() => setPlatform(p.id as any)}
                      className={`p-3 rounded-xl border-2 transition-all duration-200 ${
                        platform === p.id
                          ? `bg-gradient-to-r ${p.color} text-white border-transparent shadow-lg`
                          : 'bg-slate-50 dark:bg-slate-700 border-slate-200 dark:border-slate-600 hover:border-slate-300 dark:hover:border-slate-500'
                      }`}
                    >
                      <div className="text-2xl mb-1">{p.icon}</div>
                      <div className="text-sm font-medium">{p.name}</div>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Content Type
                </label>
                <div className="flex flex-wrap gap-2">
                  {postTypes[platform].map((type) => (
                    <button
                      key={type.id}
                      onClick={() => setPostType(type.id as any)}
                      className={`px-4 py-2 rounded-lg border transition-all duration-200 ${
                        postType === type.id
                          ? 'bg-blue-500 text-white border-blue-500'
                          : 'bg-slate-50 dark:bg-slate-700 border-slate-200 dark:border-slate-600 hover:border-slate-300 dark:hover:border-slate-500'
                      }`}
                    >
                      <span className="mr-2">{type.icon}</span>
                      {type.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Metrics Input */}
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
              <BarChart3 size={20} />
              Engagement Metrics
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Total Followers
                </label>
                <input
                  type="number"
                  value={metrics.followers || ''}
                  onChange={(e) => updateMetric('followers', e.target.value)}
                  placeholder="e.g., 10000"
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Impressions/Views
                </label>
                <input
                  type="number"
                  value={metrics.impressions || ''}
                  onChange={(e) => updateMetric('impressions', e.target.value)}
                  placeholder="e.g., 5000"
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 flex items-center gap-1">
                  <Heart size={16} className="text-red-500" />
                  Likes
                </label>
                <input
                  type="number"
                  value={metrics.likes || ''}
                  onChange={(e) => updateMetric('likes', e.target.value)}
                  placeholder="e.g., 150"
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 flex items-center gap-1">
                  <MessageCircle size={16} className="text-blue-500" />
                  Comments
                </label>
                <input
                  type="number"
                  value={metrics.comments || ''}
                  onChange={(e) => updateMetric('comments', e.target.value)}
                  placeholder="e.g., 25"
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 flex items-center gap-1">
                  <Share size={16} className="text-green-500" />
                  Shares/Retweets
                </label>
                <input
                  type="number"
                  value={metrics.shares || ''}
                  onChange={(e) => updateMetric('shares', e.target.value)}
                  placeholder="e.g., 10"
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 flex items-center gap-1">
                  <Bookmark size={16} className="text-purple-500" />
                  Saves/Bookmarks
                </label>
                <input
                  type="number"
                  value={metrics.saves || ''}
                  onChange={(e) => updateMetric('saves', e.target.value)}
                  placeholder="e.g., 30"
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 flex items-center gap-1">
                  <Users size={16} className="text-indigo-500" />
                  Reach (Optional - for Stories)
                </label>
                <input
                  type="number"
                  value={metrics.reach || ''}
                  onChange={(e) => updateMetric('reach', e.target.value)}
                  placeholder="e.g., 4000"
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={calculateEngagement}
                disabled={isCalculating || metrics.impressions === 0}
                className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                {isCalculating ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Zap size={20} />
                    Calculate Engagement
                  </>
                )}
              </button>

              <button
                onClick={resetCalculator}
                className="px-4 py-3 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-300 rounded-xl font-medium transition-colors"
              >
                Reset
              </button>
            </div>
          </div>
        </div>

        {/* Results Section */}
        <div className="space-y-6">
          {results ? (
            <>
              {/* Engagement Score */}
              <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6">
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                  <Award size={20} />
                  Engagement Analysis
                </h3>

                <div className="text-center mb-6">
                  <div className={`inline-flex items-center gap-2 px-6 py-3 rounded-full text-white font-bold text-lg mb-2 ${
                    results.engagementScore === 'Excellent' ? 'bg-gradient-to-r from-green-500 to-emerald-600' :
                    results.engagementScore === 'Good' ? 'bg-gradient-to-r from-blue-500 to-cyan-600' :
                    results.engagementScore === 'Average' ? 'bg-gradient-to-r from-yellow-500 to-orange-600' :
                    'bg-gradient-to-r from-red-500 to-pink-600'
                  }`}>
                    {results.engagementScore === 'Excellent' ? '🏆' :
                     results.engagementScore === 'Good' ? '👍' :
                     results.engagementScore === 'Average' ? '🤔' : '⚠️'}
                    {results.engagementScore}
                  </div>
                  <div className="text-3xl font-bold text-slate-900 dark:text-white mb-1">
                    {results.engagementRate}%
                  </div>
                  <div className="text-sm text-slate-500 dark:text-slate-400">
                    Engagement Rate • {results.benchmarkComparison}
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mb-4">
                  <div className="flex justify-between text-sm text-slate-600 dark:text-slate-400 mb-1">
                    <span>Engagement Rate</span>
                    <span>{results.engagementRate}%</span>
                  </div>
                  <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-3">
                    <div
                      className={`h-3 rounded-full transition-all duration-500 ${
                        results.engagementScore === 'Excellent' ? 'bg-gradient-to-r from-green-400 to-emerald-500' :
                        results.engagementScore === 'Good' ? 'bg-gradient-to-r from-blue-400 to-cyan-500' :
                        results.engagementScore === 'Average' ? 'bg-gradient-to-r from-yellow-400 to-orange-500' :
                        'bg-gradient-to-r from-red-400 to-pink-500'
                      }`}
                      style={{ width: `${Math.min(results.engagementRate * 10, 100)}%` }}
                    ></div>
                  </div>
                </div>
              </div>

              {/* Insights */}
              <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6">
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                  <CheckCircle size={20} />
                  AI Insights
                </h3>
                <div className="space-y-3">
                  {results.insights.map((insight, index) => (
                    <div key={index} className="flex items-start gap-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                      <div className="text-blue-500 mt-0.5">💡</div>
                      <p className="text-sm text-slate-700 dark:text-slate-300">{insight}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recommendations */}
              <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6">
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                  <Target size={20} />
                  Recommendations
                </h3>
                <div className="space-y-3">
                  {results.recommendations.map((rec, index) => (
                    <div key={index} className="flex items-start gap-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                      <div className="text-green-500 mt-0.5">🎯</div>
                      <p className="text-sm text-slate-700 dark:text-slate-300">{rec}</p>
                    </div>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 text-center">
              <BarChart3 size={48} className="mx-auto mb-4 text-slate-300 dark:text-slate-600" />
              <h3 className="text-xl font-semibold text-slate-600 dark:text-slate-400 mb-2">
                Ready to Analyze
              </h3>
              <p className="text-slate-500 dark:text-slate-500">
                Enter your engagement metrics above and click "Calculate Engagement" to get AI-powered insights and recommendations.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EngagementCalculator;