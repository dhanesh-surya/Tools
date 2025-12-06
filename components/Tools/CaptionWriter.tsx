import React, { useState } from 'react';
import { MessageSquare, Hash, Copy, Sparkles, Heart, Smile, Zap, TrendingUp, Image as ImageIcon, RefreshCw, Wand2 } from 'lucide-react';

interface Caption {
  id: number;
  text: string;
  emojis: string[];
  hashtags: string[];
  style: string;
  platform: string;
  characterCount: number;
}

const CaptionWriter: React.FC = () => {
  const [topic, setTopic] = useState('');
  const [platform, setPlatform] = useState('instagram');
  const [style, setStyle] = useState('engaging');
  const [includeEmojis, setIncludeEmojis] = useState(true);
  const [includeHashtags, setIncludeHashtags] = useState(true);
  const [generatedCaptions, setGeneratedCaptions] = useState<Caption[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [copiedId, setCopiedId] = useState<number | null>(null);

  const platforms = [
    { id: 'instagram', name: 'Instagram', icon: '📷', maxLength: 2200, recommended: '125-150 chars' },
    { id: 'facebook', name: 'Facebook', icon: '📘', maxLength: 63206, recommended: '40-80 chars' },
    { id: 'twitter', name: 'Twitter/X', icon: '🐦', maxLength: 280, recommended: '71-100 chars' },
    { id: 'linkedin', name: 'LinkedIn', icon: '💼', maxLength: 3000, recommended: '150-300 chars' },
    { id: 'tiktok', name: 'TikTok', icon: '🎵', maxLength: 2200, recommended: '100-150 chars' },
    { id: 'youtube', name: 'YouTube', icon: '📹', maxLength: 5000, recommended: '150-200 chars' },
  ];

  const styles = [
    { id: 'engaging', name: 'Engaging & Fun', emoji: '🎉', description: 'Catchy and interactive' },
    { id: 'professional', name: 'Professional', emoji: '💼', description: 'Formal and business-like' },
    { id: 'inspirational', name: 'Inspirational', emoji: '✨', description: 'Motivational and uplifting' },
    { id: 'storytelling', name: 'Storytelling', emoji: '📖', description: 'Narrative and personal' },
    { id: 'humorous', name: 'Humorous', emoji: '😂', description: 'Funny and lighthearted' },
    { id: 'educational', name: 'Educational', emoji: '📚', description: 'Informative and teaching' },
    { id: 'promotional', name: 'Promotional', emoji: '🛍️', description: 'Sales and marketing focused' },
    { id: 'minimalist', name: 'Minimalist', emoji: '⚪', description: 'Simple and clean' },
  ];

  const emojiSets = {
    engaging: ['✨', '💫', '🌟', '⭐', '🎯', '💪', '🔥', '❤️', '😍', '🙌'],
    professional: ['💼', '📊', '🎯', '✅', '📈', '🏆', '💡', '🔍', '⚡', '🌐'],
    inspirational: ['✨', '🌟', '💫', '⭐', '🦋', '🌈', '💎', '🌸', '🔮', '🌺'],
    storytelling: ['📖', '🎬', '📝', '🎭', '🗣️', '💭', '🌅', '🌄', '🎨', '📸'],
    humorous: ['😂', '🤣', '😆', '😄', '🤪', '😜', '🙃', '😎', '🤓', '😏'],
    educational: ['📚', '📖', '🎓', '💡', '🔬', '🧪', '📊', '📈', '🎯', '✏️'],
    promotional: ['🛍️', '🎁', '💰', '💸', '🔥', '⚡', '✨', '🎉', '🎊', '🏆'],
    minimalist: ['⚪', '⚫', '🔸', '🔹', '▪️', '▫️', '✦', '✧', '○', '●'],
  };

  const generateCaptions = () => {
    if (!topic.trim()) return;

    setIsGenerating(true);

    setTimeout(() => {
      const captions: Caption[] = [];
      const selectedPlatform = platforms.find(p => p.id === platform);

      for (let i = 0; i < 5; i++) {
        const caption = createCaption(topic, platform, style, includeEmojis, includeHashtags, selectedPlatform?.maxLength || 2200);
        captions.push({
          id: i,
          text: caption.text,
          emojis: caption.emojis,
          hashtags: caption.hashtags,
          style,
          platform,
          characterCount: caption.text.length,
        });
      }

      setGeneratedCaptions(captions);
      setIsGenerating(false);
    }, 1500);
  };

  const createCaption = (
    topic: string,
    platform: string,
    style: string,
    withEmojis: boolean,
    withHashtags: boolean,
    maxLength: number
  ) => {
    const templates = getCaptionTemplates(topic, style, platform);
    const randomTemplate = templates[Math.floor(Math.random() * templates.length)];
    
    // Generate emojis
    const emojis = withEmojis ? generateEmojis(style) : [];
    
    // Generate hashtags
    const hashtags = withHashtags ? generateHashtags(topic, platform) : [];

    return {
      text: randomTemplate,
      emojis,
      hashtags,
    };
  };

  const getCaptionTemplates = (topic: string, style: string, platform: string): string[] => {
    const topicClean = topic.charAt(0).toUpperCase() + topic.slice(1);
    
    const templates: Record<string, string[]> = {
      engaging: [
        `Can we talk about ${topic}? 🌟 This is something I've been so excited to share with you all! Drop a ❤️ if you agree!`,
        `${topicClean} has completely changed my perspective! ✨ Who else feels the same? Let me know in the comments! 👇`,
        `Just discovered something amazing about ${topic} and I HAD to share! 💫 Save this for later!`,
        `The ultimate guide to ${topic} - bookmark this! 🔥 Trust me, you'll want to come back to this!`,
        `Here's everything you need to know about ${topic}! 🎯 Which point resonates with you the most?`,
      ],
      professional: [
        `Insights on ${topic}: Sharing my professional perspective on this evolving landscape. Thoughts?`,
        `${topicClean} continues to be a game-changer in our industry. Here's what you need to know.`,
        `Key findings from my latest work on ${topic}. The data speaks for itself.`,
        `Breaking down ${topic} - a comprehensive analysis for professionals in the field.`,
        `${topicClean}: Strategic implications and future outlook. Let's discuss.`,
      ],
      inspirational: [
        `✨ ${topicClean} reminded me that every journey starts with a single step. Keep pushing forward! ✨`,
        `Your story about ${topic} matters. Don't let anyone tell you otherwise. You are capable of amazing things! 💫`,
        `${topicClean} taught me this: Growth happens outside your comfort zone. Embrace the challenge! 🌟`,
        `Today's reminder: ${topic} is not about perfection, it's about progress. Keep going! 🦋`,
        `The beauty of ${topic} lies in the journey, not just the destination. Trust your process. 💎`,
      ],
      storytelling: [
        `Let me tell you about my experience with ${topic}... It all started when I least expected it. 📖`,
        `There's a story behind every ${topic}, and mine began on an ordinary Tuesday morning. Here's what happened... 🎬`,
        `${topicClean} - the journey that changed everything. Swipe to read the full story. 📝`,
        `I never thought ${topic} would impact me this way. But here's what I learned along the way... 🌅`,
        `From skeptic to believer: My ${topic} transformation story. It's been quite a ride! 🎭`,
      ],
      humorous: [
        `Me trying to explain ${topic} to someone: *gestures wildly* 😂 Can anyone relate?`,
        `${topicClean}: Expectations vs Reality 🤣 Tag someone who needs to see this!`,
        `Nobody: ... | Me: Let me tell you about ${topic} for 3 hours 😆`,
        `When ${topic} becomes your entire personality 😂 (No regrets though!)`,
        `Plot twist: ${topic} was the friends we made along the way 🤪 Just kidding... or am I?`,
      ],
      educational: [
        `📚 Today's lesson: Understanding ${topic} in 5 key points. Save this for your reference!`,
        `${topicClean} 101: Everything you need to know as a beginner. Let's break it down! 📖`,
        `Did you know? 3 fascinating facts about ${topic} that will change how you see it. 🎓`,
        `Master ${topic} with these proven techniques. Study tip: bookmark this! 💡`,
        `The science behind ${topic} explained simply. No jargon, just clear explanations. 🔬`,
      ],
      promotional: [
        `🔥 Exclusive: ${topicClean} like you've never seen before! Limited time opportunity - don't miss out!`,
        `Ready to experience ${topic} at its finest? This is THE moment you've been waiting for! ✨`,
        `${topicClean} is here and it's INCREDIBLE! Tap the link to discover why everyone's talking about it! 🛍️`,
        `Big news! ${topicClean} just got even better. Check it out before it's gone! ⚡`,
        `Your search for the perfect ${topic} ends here! Special offer inside 🎁`,
      ],
      minimalist: [
        `${topicClean}. Simple as that.`,
        `${topic} ○`,
        `On ${topic}—thoughts and reflections.`,
        `${topicClean}. Nothing more, nothing less.`,
        `Just ${topic}.`,
      ],
    };

    return templates[style] || templates.engaging;
  };

  const generateEmojis = (style: string): string[] => {
    const emojis = emojiSets[style as keyof typeof emojiSets] || emojiSets.engaging;
    return emojis.sort(() => 0.5 - Math.random()).slice(0, 3);
  };

  const generateHashtags = (topic: string, platform: string): string[] => {
    const topicHash = topic.replace(/\s+/g, '').replace(/[^a-zA-Z0-9]/g, '');
    const baseHashtags = [`#${topicHash}`];
    
    const commonHashtags = {
      instagram: ['#instagood', '#photooftheday', '#love', '#beautiful', '#happy', '#life', '#instadaily', '#picoftheday', '#motivation', '#inspiration'],
      facebook: ['#facebook', '#socialmedia', '#community', '#trending', '#viral'],
      twitter: ['#tweet', '#trending', '#viral', '#news', '#update'],
      linkedin: ['#linkedin', '#professional', '#career', '#business', '#networking', '#growth', '#leadership'],
      tiktok: ['#fyp', '#foryou', '#viral', '#trending', '#tiktok'],
      youtube: ['#youtube', '#video', '#subscribe', '#content', '#creator'],
    };

    const platformHashtags = commonHashtags[platform as keyof typeof commonHashtags] || commonHashtags.instagram;
    const randomHashtags = platformHashtags.sort(() => 0.5 - Math.random()).slice(0, platform === 'instagram' ? 8 : 3);

    return [...baseHashtags, ...randomHashtags];
  };

  const copyToClipboard = (text: string, id: number) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const copyFullCaption = (caption: Caption) => {
    const emojisText = caption.emojis.length > 0 ? `\n\n${caption.emojis.join(' ')}` : '';
    const hashtagsText = caption.hashtags.length > 0 ? `\n\n${caption.hashtags.join(' ')}` : '';
    const fullText = `${caption.text}${emojisText}${hashtagsText}`;
    navigator.clipboard.writeText(fullText);
    setCopiedId(caption.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const selectedPlatformData = platforms.find(p => p.id === platform);
  const selectedStyleData = styles.find(s => s.id === style);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 bg-gradient-to-br from-pink-500 via-purple-500 to-indigo-500 rounded-xl flex items-center justify-center shadow-lg">
          <MessageSquare className="text-white" size={24} />
        </div>
        <div>
          <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-200">Caption Writer</h3>
          <p className="text-sm text-slate-600 dark:text-slate-400">Create engaging captions for social media</p>
        </div>
      </div>

      {/* Input Controls */}
      <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-700">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-2 text-slate-700 dark:text-slate-300">
              <Sparkles className="inline mr-2" size={16} />
              What's your post about?
            </label>
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g., sunset photography, coffee morning, travel adventure..."
              className="w-full p-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-slate-700 dark:text-slate-300">
              <ImageIcon className="inline mr-2" size={16} />
              Platform
            </label>
            <select
              value={platform}
              onChange={(e) => setPlatform(e.target.value)}
              className="w-full p-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
            >
              {platforms.map(p => (
                <option key={p.id} value={p.id}>{p.icon} {p.name}</option>
              ))}
            </select>
            {selectedPlatformData && (
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Recommended: {selectedPlatformData.recommended}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-slate-700 dark:text-slate-300">
              <Wand2 className="inline mr-2" size={16} />
              Caption Style
            </label>
            <select
              value={style}
              onChange={(e) => setStyle(e.target.value)}
              className="w-full p-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
            >
              {styles.map(s => (
                <option key={s.id} value={s.id}>{s.emoji} {s.name}</option>
              ))}
            </select>
            {selectedStyleData && (
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                {selectedStyleData.description}
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-6 mb-4">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={includeEmojis}
              onChange={(e) => setIncludeEmojis(e.target.checked)}
              className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500"
            />
            <span className="text-sm text-slate-700 dark:text-slate-300">
              <Smile className="inline mr-1" size={16} />
              Include Emojis
            </span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={includeHashtags}
              onChange={(e) => setIncludeHashtags(e.target.checked)}
              className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500"
            />
            <span className="text-sm text-slate-700 dark:text-slate-300">
              <Hash className="inline mr-1" size={16} />
              Include Hashtags
            </span>
          </label>
        </div>

        <button
          onClick={generateCaptions}
          disabled={isGenerating || !topic.trim()}
          className="w-full bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 text-white py-3 rounded-lg hover:from-pink-600 hover:via-purple-600 hover:to-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 font-medium shadow-lg hover:shadow-xl"
        >
          {isGenerating ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
              Generating Magic...
            </>
          ) : (
            <>
              <Zap size={18} />
              Generate Captions
            </>
          )}
        </button>
      </div>

      {/* Generated Captions */}
      {generatedCaptions.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-lg font-semibold text-slate-800 dark:text-slate-200">
              ✨ Your Captions ({generatedCaptions.length})
            </h4>
            <button
              onClick={generateCaptions}
              className="flex items-center gap-2 text-sm text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 transition-colors"
            >
              <RefreshCw size={16} />
              Regenerate
            </button>
          </div>

          <div className="space-y-4">
            {generatedCaptions.map((caption) => (
              <div
                key={caption.id}
                className="bg-gradient-to-br from-white to-purple-50 dark:from-slate-800 dark:to-slate-800/50 rounded-xl p-6 shadow-sm border border-purple-200 dark:border-purple-900/30 hover:shadow-lg transition-shadow"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{platforms.find(p => p.id === caption.platform)?.icon}</span>
                    <div>
                      <span className="font-medium text-slate-800 dark:text-slate-200 text-sm">
                        {platforms.find(p => p.id === caption.platform)?.name}
                      </span>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs text-slate-500 dark:text-slate-400">
                          {caption.characterCount} characters
                        </span>
                        <span className="px-2 py-0.5 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded text-xs font-medium">
                          {styles.find(s => s.id === caption.style)?.emoji} {styles.find(s => s.id === caption.style)?.name}
                        </span>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => copyFullCaption(caption)}
                    className={`p-2 rounded-lg transition-all ${
                      copiedId === caption.id
                        ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400'
                        : 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 hover:bg-purple-200 dark:hover:bg-purple-900/50'
                    }`}
                    title="Copy full caption"
                  >
                    {copiedId === caption.id ? (
                      <span className="text-xs font-medium">Copied! ✓</span>
                    ) : (
                      <Copy size={16} />
                    )}
                  </button>
                </div>

                <div className="mb-4">
                  <p className="text-slate-800 dark:text-slate-200 leading-relaxed whitespace-pre-wrap">
                    {caption.text}
                  </p>
                </div>

                {caption.emojis.length > 0 && (
                  <div className="mb-4">
                    <p className="text-xs font-medium text-slate-600 dark:text-slate-400 mb-2">Suggested Emojis:</p>
                    <div className="flex flex-wrap gap-2">
                      {caption.emojis.map((emoji, index) => (
                        <button
                          key={index}
                          onClick={() => copyToClipboard(emoji, caption.id * 100 + index)}
                          className="text-2xl hover:scale-125 transition-transform cursor-pointer"
                          title="Click to copy"
                        >
                          {emoji}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {caption.hashtags.length > 0 && (
                  <div>
                    <p className="text-xs font-medium text-slate-600 dark:text-slate-400 mb-2">Suggested Hashtags:</p>
                    <div className="flex flex-wrap gap-2">
                      {caption.hashtags.map((hashtag, index) => (
                        <button
                          key={index}
                          onClick={() => copyToClipboard(hashtag, caption.id * 1000 + index)}
                          className="bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300 px-3 py-1 rounded-full text-xs font-medium hover:bg-purple-200 dark:hover:bg-purple-900/60 transition-colors cursor-pointer"
                          title="Click to copy"
                        >
                          {hashtag}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tips */}
      <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border border-purple-200 dark:border-purple-800/30 rounded-xl p-6">
        <h5 className="font-semibold text-purple-900 dark:text-purple-200 mb-3 flex items-center gap-2">
          <TrendingUp size={20} />
          Pro Caption Tips
        </h5>
        <div className="grid md:grid-cols-2 gap-3 text-sm text-purple-800 dark:text-purple-300">
          <div className="flex items-start gap-2">
            <Heart size={16} className="mt-0.5 flex-shrink-0" />
            <span>First 125 characters matter most for engagement</span>
          </div>
          <div className="flex items-start gap-2">
            <Sparkles size={16} className="mt-0.5 flex-shrink-0" />
            <span>Ask questions to encourage comments</span>
          </div>
          <div className="flex items-start gap-2">
            <Hash size={16} className="mt-0.5 flex-shrink-0" />
            <span>Use 3-5 relevant hashtags for best reach</span>
          </div>
          <div className="flex items-start gap-2">
            <Smile size={16} className="mt-0.5 flex-shrink-0" />
            <span>Emojis increase engagement by 47%</span>
          </div>
          <div className="flex items-start gap-2">
            <Zap size={16} className="mt-0.5 flex-shrink-0" />
            <span>Include a clear call-to-action</span>
          </div>
          <div className="flex items-start gap-2">
            <MessageSquare size={16} className="mt-0.5 flex-shrink-0" />
            <span>Be authentic and tell your story</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CaptionWriter;