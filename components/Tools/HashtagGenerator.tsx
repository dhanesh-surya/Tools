import React, { useState } from 'react';
import { Hash, Sparkles, Copy, TrendingUp, Target, Zap, RefreshCw, Search, Filter, Crown, BarChart } from 'lucide-react';

interface HashtagSet {
  id: number;
  hashtags: string[];
  category: string;
  engagementScore: number;
}

const HashtagGenerator: React.FC = () => {
  const [topic, setTopic] = useState('');
  const [platform, setPlatform] = useState('instagram');
  const [count, setCount] = useState(30);
  const [includeNiche, setIncludeNiche] = useState(true);
  const [includeTrending, setIncludeTrending] = useState(true);
  const [generatedHashtags, setGeneratedHashtags] = useState<HashtagSet[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [copiedId, setCopiedId] = useState<number | null>(null);
  const [selectedSize, setSelectedSize] = useState<'small' | 'medium' | 'large'>('medium');

  const platforms = [
    { id: 'instagram', name: 'Instagram', icon: '📷', optimal: '5-10 hashtags', max: 30 },
    { id: 'twitter', name: 'Twitter/X', icon: '🐦', optimal: '1-2 hashtags', max: 5 },
    { id: 'facebook', name: 'Facebook', icon: '📘', optimal: '2-3 hashtags', max: 10 },
    { id: 'linkedin', name: 'LinkedIn', icon: '💼', optimal: '3-5 hashtags', max: 10 },
    { id: 'tiktok', name: 'TikTok', icon: '🎵', optimal: '4-6 hashtags', max: 20 },
    { id: 'youtube', name: 'YouTube', icon: '📹', optimal: '5-8 hashtags', max: 15 },
    { id: 'pinterest', name: 'Pinterest', icon: '📌', optimal: '5-10 hashtags', max: 20 },
  ];

  const hashtagCategories = {
    niche: [
      '#nichebusiness', '#microbrand', '#smallbusinessowner', '#entrepreneurlife',
      '#startuplife', '#creativepreneur', '#solopreneur', '#sidehustle'
    ],
    trending: [
      '#viral', '#trending', '#fyp', '#foryoupage', '#explorepage', '#instagood',
      '#photooftheday', '#instadaily', '#picoftheday', '#reels'
    ],
    engagement: [
      '#like4like', '#follow4follow', '#comment4comment', '#engagement',
      '#community', '#interact', '#share', '#savepost'
    ],
    industry: [
      '#business', '#marketing', '#branding', '#digitalmarketing', '#contentcreator',
      '#socialmedia', '#entrepreneur', '#startup', '#innovation', '#growth'
    ],
    seasonal: [
      '#mondaymotivation', '#transformationtuesday', '#wednesdaywisdom', '#throwbackthursday',
      '#fridayfeeling', '#saturdayvibes', '#sundayfunday', '#weekendvibes'
    ],
    size: {
      small: '#small',   // < 100k posts
      medium: '#medium', // 100k - 1M posts
      large: '#large'    // > 1M posts
    }
  };

  const generateHashtags = () => {
    if (!topic.trim()) return;

    setIsGenerating(true);

    setTimeout(() => {
      const hashtagSets: HashtagSet[] = [];
      const topicHash = topic.replace(/\s+/g, '').replace(/[^a-zA-Z0-9]/g, '');

      // Generate multiple sets with different strategies
      const sets = [
        { name: 'High Engagement Mix', score: 92 },
        { name: 'Trending & Popular', score: 88 },
        { name: 'Niche Targeted', score: 85 },
        { name: 'Balanced Approach', score: 90 },
        { name: 'Growth Optimized', score: 87 },
      ];

      sets.forEach((set, index) => {
        const hashtags = createHashtagSet(
          topicHash,
          topic,
          platform,
          count,
          includeNiche,
          includeTrending,
          selectedSize,
          index
        );

        hashtagSets.push({
          id: index,
          hashtags,
          category: set.name,
          engagementScore: set.score,
        });
      });

      setGeneratedHashtags(hashtagSets);
      setIsGenerating(false);
    }, 1500);
  };

  const createHashtagSet = (
    topicHash: string,
    topicOriginal: string,
    platform: string,
    count: number,
    withNiche: boolean,
    withTrending: boolean,
    size: string,
    variation: number
  ): string[] => {
    const hashtags: string[] = [];
    const words = topicOriginal.toLowerCase().split(' ').filter(w => w.length > 2);

    // Add main topic hashtag
    hashtags.push(`#${topicHash.toLowerCase()}`);

    // Add word combinations
    if (words.length > 1) {
      words.forEach(word => {
        const cleanWord = word.replace(/[^a-zA-Z0-9]/g, '');
        if (cleanWord.length > 2) {
          hashtags.push(`#${cleanWord}`);
        }
      });

      // Combine words
      for (let i = 0; i < words.length - 1; i++) {
        const combo = `${words[i]}${words[i + 1]}`.replace(/[^a-zA-Z0-9]/g, '');
        if (combo.length > 3) {
          hashtags.push(`#${combo}`);
        }
      }
    }

    // Add topic variations
    const variations = generateTopicVariations(topicOriginal);
    hashtags.push(...variations.slice(0, 3));

    // Add niche hashtags
    if (withNiche) {
      const nicheCount = Math.floor(count * 0.2);
      const nicheSelection = hashtagCategories.niche
        .sort(() => 0.5 - Math.random())
        .slice(variation, variation + nicheCount);
      hashtags.push(...nicheSelection);
    }

    // Add trending hashtags
    if (withTrending) {
      const trendingCount = Math.floor(count * 0.15);
      const trendingSelection = hashtagCategories.trending
        .sort(() => 0.5 - Math.random())
        .slice(variation, variation + trendingCount);
      hashtags.push(...trendingSelection);
    }

    // Add industry-specific hashtags
    const industryCount = Math.floor(count * 0.2);
    const industrySelection = hashtagCategories.industry
      .sort(() => 0.5 - Math.random())
      .slice(0, industryCount);
    hashtags.push(...industrySelection);

    // Add engagement hashtags
    const engagementCount = Math.floor(count * 0.1);
    const engagementSelection = hashtagCategories.engagement
      .sort(() => 0.5 - Math.random())
      .slice(0, engagementCount);
    hashtags.push(...engagementSelection);

    // Add seasonal hashtags
    const seasonalCount = Math.floor(count * 0.1);
    const seasonalSelection = hashtagCategories.seasonal
      .sort(() => 0.5 - Math.random())
      .slice(0, seasonalCount);
    hashtags.push(...seasonalSelection);

    // Platform-specific adjustments
    const platformMax = platforms.find(p => p.id === platform)?.max || 30;

    // Remove duplicates and limit to count
    const uniqueHashtags = [...new Set(hashtags)].slice(0, Math.min(count, platformMax));

    return uniqueHashtags;
  };

  const generateTopicVariations = (topic: string): string[] => {
    const variations: string[] = [];
    const cleanTopic = topic.replace(/[^a-zA-Z0-9\s]/g, '').toLowerCase();

    const suffixes = ['daily', 'life', 'love', 'vibes', 'gram', 'official', 'community', 'world'];
    const prefixes = ['best', 'top', 'amazing', 'awesome', 'daily', 'real', 'true', 'pro'];

    // Add suffix variations
    suffixes.forEach(suffix => {
      const variation = `${cleanTopic.replace(/\s+/g, '')}${suffix}`;
      variations.push(`#${variation}`);
    });

    // Add prefix variations
    prefixes.forEach(prefix => {
      const variation = `${prefix}${cleanTopic.replace(/\s+/g, '')}`;
      variations.push(`#${variation}`);
    });

    return variations;
  };

  const copyToClipboard = (text: string, id: number) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const copyHashtagSet = (hashtagSet: HashtagSet) => {
    const text = hashtagSet.hashtags.join(' ');
    navigator.clipboard.writeText(text);
    setCopiedId(hashtagSet.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const selectedPlatformData = platforms.find(p => p.id === platform);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-500 rounded-xl flex items-center justify-center shadow-lg">
          <Hash className="text-white" size={24} />
        </div>
        <div>
          <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-200">Hashtag Generator</h3>
          <p className="text-sm text-slate-600 dark:text-slate-400">Generate trending hashtags for maximum reach</p>
        </div>
      </div>

      {/* Input Controls */}
      <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-700">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-2 text-slate-700 dark:text-slate-300">
              <Sparkles className="inline mr-2" size={16} />
              What's your content about?
            </label>
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g., travel photography, fitness motivation, food blogger..."
              className="w-full p-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-slate-700 dark:text-slate-300">
              <Target className="inline mr-2" size={16} />
              Platform
            </label>
            <select
              value={platform}
              onChange={(e) => setPlatform(e.target.value)}
              className="w-full p-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
            >
              {platforms.map(p => (
                <option key={p.id} value={p.id}>{p.icon} {p.name}</option>
              ))}
            </select>
            {selectedPlatformData && (
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Optimal: {selectedPlatformData.optimal}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-slate-700 dark:text-slate-300">
              <Hash className="inline mr-2" size={16} />
              Number of Hashtags: {count}
            </label>
            <input
              type="range"
              min="5"
              max={selectedPlatformData?.max || 30}
              value={count}
              onChange={(e) => setCount(parseInt(e.target.value))}
              className="w-full h-2 bg-gradient-to-r from-blue-200 to-purple-200 dark:from-blue-900 dark:to-purple-900 rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400 mt-1">
              <span>5</span>
              <span>{selectedPlatformData?.max || 30}</span>
            </div>
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-2 text-slate-700 dark:text-slate-300">
              <Filter className="inline mr-2" size={16} />
              Hashtag Size Strategy
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => setSelectedSize('small')}
                className={`p-3 rounded-lg border-2 transition-all ${selectedSize === 'small'
                    ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-300'
                    : 'border-slate-200 dark:border-slate-600 hover:border-indigo-300 dark:hover:border-indigo-700'
                  }`}
              >
                <div className="text-xs font-bold">Small</div>
                <div className="text-xs text-slate-500 dark:text-slate-400">&lt; 100K posts</div>
              </button>
              <button
                onClick={() => setSelectedSize('medium')}
                className={`p-3 rounded-lg border-2 transition-all ${selectedSize === 'medium'
                    ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-300'
                    : 'border-slate-200 dark:border-slate-600 hover:border-indigo-300 dark:hover:border-indigo-700'
                  }`}
              >
                <div className="text-xs font-bold">Medium</div>
                <div className="text-xs text-slate-500 dark:text-slate-400">100K - 1M</div>
              </button>
              <button
                onClick={() => setSelectedSize('large')}
                className={`p-3 rounded-lg border-2 transition-all ${selectedSize === 'large'
                    ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-300'
                    : 'border-slate-200 dark:border-slate-600 hover:border-indigo-300 dark:hover:border-indigo-700'
                  }`}
              >
                <div className="text-xs font-bold">Large</div>
                <div className="text-xs text-slate-500 dark:text-slate-400">&gt; 1M posts</div>
              </button>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-6 mb-4">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={includeNiche}
              onChange={(e) => setIncludeNiche(e.target.checked)}
              className="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500"
            />
            <span className="text-sm text-slate-700 dark:text-slate-300">
              <Target className="inline mr-1" size={16} />
              Include Niche Tags
            </span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={includeTrending}
              onChange={(e) => setIncludeTrending(e.target.checked)}
              className="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500"
            />
            <span className="text-sm text-slate-700 dark:text-slate-300">
              <TrendingUp className="inline mr-1" size={16} />
              Include Trending Tags
            </span>
          </label>
        </div>

        <button
          onClick={generateHashtags}
          disabled={isGenerating || !topic.trim()}
          className="w-full bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 text-white py-3 rounded-lg hover:from-blue-600 hover:via-indigo-600 hover:to-purple-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 font-medium shadow-lg hover:shadow-xl"
        >
          {isGenerating ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
              Generating Hashtags...
            </>
          ) : (
            <>
              <Zap size={18} />
              Generate Hashtags
            </>
          )}
        </button>
      </div>

      {/* Generated Hashtag Sets */}
      {generatedHashtags.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-lg font-semibold text-slate-800 dark:text-slate-200">
              ✨ Your Hashtag Sets ({generatedHashtags.length})
            </h4>
            <button
              onClick={generateHashtags}
              className="flex items-center gap-2 text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors"
            >
              <RefreshCw size={16} />
              Regenerate
            </button>
          </div>

          <div className="space-y-4">
            {generatedHashtags.map((set) => (
              <div
                key={set.id}
                className="bg-gradient-to-br from-white to-indigo-50 dark:from-slate-800 dark:to-slate-800/50 rounded-xl p-6 shadow-sm border border-indigo-200 dark:border-indigo-900/30 hover:shadow-lg transition-shadow"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h5 className="font-semibold text-slate-800 dark:text-slate-200">
                        {set.category}
                      </h5>
                      <div className="flex items-center gap-1 px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-full text-xs font-medium">
                        <BarChart size={12} />
                        {set.engagementScore}% Engagement Score
                      </div>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {set.hashtags.length} hashtags • Optimized for {platforms.find(p => p.id === platform)?.name}
                    </p>
                  </div>
                  <button
                    onClick={() => copyHashtagSet(set)}
                    className={`p-2 rounded-lg transition-all ${copiedId === set.id
                        ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400'
                        : 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-200 dark:hover:bg-indigo-900/50'
                      }`}
                    title="Copy all hashtags"
                  >
                    {copiedId === set.id ? (
                      <span className="text-xs font-medium">Copied! ✓</span>
                    ) : (
                      <Copy size={16} />
                    )}
                  </button>
                </div>

                <div className="flex flex-wrap gap-2">
                  {set.hashtags.map((hashtag, index) => (
                    <button
                      key={index}
                      onClick={() => copyToClipboard(hashtag, set.id * 1000 + index)}
                      className="bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300 px-3 py-1.5 rounded-full text-sm font-medium hover:bg-indigo-200 dark:hover:bg-indigo-900/60 transition-colors cursor-pointer flex items-center gap-1"
                      title="Click to copy"
                    >
                      {hashtag}
                    </button>
                  ))}
                </div>

                <div className="mt-4 p-3 bg-white/50 dark:bg-slate-900/30 rounded-lg">
                  <div className="text-xs text-slate-600 dark:text-slate-400 font-mono break-all">
                    {set.hashtags.join(' ')}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tips */}
      <div className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 border border-indigo-200 dark:border-indigo-800/30 rounded-xl p-6">
        <h5 className="font-semibold text-indigo-900 dark:text-indigo-200 mb-3 flex items-center gap-2">
          <Crown size={20} />
          Pro Hashtag Tips
        </h5>
        <div className="grid md:grid-cols-2 gap-3 text-sm text-indigo-800 dark:text-indigo-300">
          <div className="flex items-start gap-2">
            <Search size={16} className="mt-0.5 flex-shrink-0" />
            <span>Mix popular and niche hashtags for better reach</span>
          </div>
          <div className="flex items-start gap-2">
            <TrendingUp size={16} className="mt-0.5 flex-shrink-0" />
            <span>Research trending hashtags in your industry</span>
          </div>
          <div className="flex items-start gap-2">
            <Target size={16} className="mt-0.5 flex-shrink-0" />
            <span>Use 3-5 highly relevant hashtags for best results</span>
          </div>
          <div className="flex items-start gap-2">
            <Hash size={16} className="mt-0.5 flex-shrink-0" />
            <span>Avoid banned or spammy hashtags</span>
          </div>
          <div className="flex items-start gap-2">
            <Sparkles size={16} className="mt-0.5 flex-shrink-0" />
            <span>Create a branded hashtag for your content</span>
          </div>
          <div className="flex items-start gap-2">
            <BarChart size={16} className="mt-0.5 flex-shrink-0" />
            <span>Track performance and adjust your strategy</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HashtagGenerator;