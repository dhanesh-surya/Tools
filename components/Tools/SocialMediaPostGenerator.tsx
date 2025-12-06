import React, { useState } from 'react';
import { MessageSquare, Hash, Calendar, Copy, Download, Share2, Zap } from 'lucide-react';

const SocialMediaPostGenerator: React.FC = () => {
  const [topic, setTopic] = useState('');
  const [platform, setPlatform] = useState('twitter');
  const [tone, setTone] = useState('professional');
  const [generatedPosts, setGeneratedPosts] = useState<any[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);

  const platforms = [
    { id: 'twitter', name: 'Twitter/X', maxLength: 280, icon: '🐦' },
    { id: 'linkedin', name: 'LinkedIn', maxLength: 3000, icon: '💼' },
    { id: 'facebook', name: 'Facebook', maxLength: 63206, icon: '📘' },
    { id: 'instagram', name: 'Instagram', maxLength: 2200, icon: '📷' },
    { id: 'tiktok', name: 'TikTok', maxLength: 2200, icon: '🎵' },
  ];

  const tones = [
    { id: 'professional', name: 'Professional', emoji: '💼' },
    { id: 'casual', name: 'Casual', emoji: '😊' },
    { id: 'humorous', name: 'Humorous', emoji: '😂' },
    { id: 'inspirational', name: 'Inspirational', emoji: '✨' },
    { id: 'educational', name: 'Educational', emoji: '📚' },
  ];

  const generatePosts = async () => {
    if (!topic.trim()) return;

    setIsGenerating(true);

    // Simulate AI generation
    setTimeout(() => {
      const posts = [];
      const selectedPlatform = platforms.find(p => p.id === platform);

      for (let i = 0; i < 3; i++) {
        const post = generateMockPost(topic, platform, tone, selectedPlatform?.maxLength || 280);
        posts.push({
          id: i,
          content: post.content,
          hashtags: post.hashtags,
          platform,
          tone,
          characterCount: post.content.length,
          maxLength: selectedPlatform?.maxLength || 280,
          timestamp: new Date().toISOString()
        });
      }

      setGeneratedPosts(posts);
      setIsGenerating(false);
    }, 2000);
  };

  const generateMockPost = (topic: string, platform: string, tone: string, maxLength: number) => {
    const templates = {
      twitter: {
        professional: [
          `Excited to share insights on ${topic}! Here are key takeaways that can transform your approach. What's your biggest challenge in this area? #${topic.replace(/\s+/g, '')} #ProfessionalDevelopment`,
          `Just published a comprehensive guide on ${topic}. The landscape is evolving rapidly - here's what you need to know to stay ahead. Link in bio! #${topic.replace(/\s+/g, '')} #Innovation`,
          `Data shows that ${topic} adoption has increased 300% this year. Are you leveraging this trend in your strategy? Let's discuss! #${topic.replace(/\s+/g, '')} #BusinessStrategy`
        ],
        casual: [
          `Hey everyone! Just dove deep into ${topic} and wow, the possibilities are endless! Who's already experimenting with this? 🤔 #${topic.replace(/\s+/g, '')}`,
          `Quick thread on ${topic} - breaking it down simply because everyone should understand this! What's your take? #${topic.replace(/\s+/g, '')} 🚀`,
          `${topic} has me so excited right now! The future is looking bright ✨ What's one thing you're curious about? #${topic.replace(/\s+/g, '')}`
        ],
        humorous: [
          `Me trying to explain ${topic} to my grandma: "It's like..." 🤪 But seriously, the implications are huge! #${topic.replace(/\s+/g, '')} #TechHumor`,
          `When ${topic} becomes your entire personality 😂 Just kidding, but the obsession is real! Who's with me? #${topic.replace(/\s+/g, '')}`,
          `Breaking: Local developer discovers ${topic} and suddenly thinks they're Elon Musk 🚀 #${topic.replace(/\s+/g, '')} #DeveloperLife`
        ]
      },
      linkedin: {
        professional: [
          `I'm passionate about ${topic} and how it's reshaping our industry. After extensive research and implementation, here are my key insights:

1. The current state of ${topic}
2. Emerging trends to watch
3. Practical applications for businesses
4. Future predictions

What's your experience with ${topic}? I'd love to hear your thoughts in the comments.

#${topic.replace(/\s+/g, '')} #ProfessionalDevelopment #IndustryInsights`,
          `As ${topic} continues to evolve, it's crucial for professionals to stay informed. Here's what I've learned from implementing ${topic} strategies:

• Strategic importance
• Implementation challenges
• Measurable outcomes
• Future roadmap

The landscape is changing rapidly - how is your organization adapting?

#${topic.replace(/\s+/g, '')} #BusinessStrategy #Innovation`
        ]
      }
    };

    const platformTemplates = templates[platform as keyof typeof templates] || templates.twitter;
    const toneTemplates = platformTemplates[tone as keyof typeof platformTemplates] || platformTemplates.professional;
    const randomTemplate = toneTemplates[Math.floor(Math.random() * toneTemplates.length)];

    // Generate hashtags
    const baseHashtags = [`#${topic.replace(/\s+/g, '')}`, '#Tech', '#Innovation'];
    const additionalHashtags = ['#DigitalTransformation', '#FutureOfWork', '#Technology', '#Business', '#Growth'];
    const randomHashtags = additionalHashtags.sort(() => 0.5 - Math.random()).slice(0, 2);

    return {
      content: randomTemplate,
      hashtags: [...baseHashtags, ...randomHashtags]
    };
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const copyPostWithHashtags = (post: any) => {
    const fullText = `${post.content}\n\n${post.hashtags.join(' ')}`;
    navigator.clipboard.writeText(fullText);
  };

  const schedulePost = (post: any) => {
    // In a real app, this would integrate with social media APIs
    alert('Post scheduled! (This is a demo - in a real app, this would connect to your social media accounts)');
  };

  const selectedPlatformData = platforms.find(p => p.id === platform);

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-200">Social Media Post Generator</h3>

      {/* Input Controls */}
      <div className="bg-white dark:bg-slate-800 rounded-lg p-6 shadow-sm border border-slate-200 dark:border-slate-700">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium mb-2 text-slate-700 dark:text-slate-300">Topic</label>
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g., AI development, remote work"
              className="w-full p-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-slate-700 dark:text-slate-300">Platform</label>
            <select
              value={platform}
              onChange={(e) => setPlatform(e.target.value)}
              className="w-full p-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100"
            >
              {platforms.map(p => (
                <option key={p.id} value={p.id}>{p.icon} {p.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-slate-700 dark:text-slate-300">Tone</label>
            <select
              value={tone}
              onChange={(e) => setTone(e.target.value)}
              className="w-full p-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100"
            >
              {tones.map(t => (
                <option key={t.id} value={t.id}>{t.emoji} {t.name}</option>
              ))}
            </select>
          </div>

          <div className="flex items-end">
            <button
              onClick={generatePosts}
              disabled={isGenerating || !topic.trim()}
              className="w-full bg-primary text-white py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
            >
              {isGenerating ? <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" /> : <Zap size={18} />}
              {isGenerating ? 'Generating...' : 'Generate Posts'}
            </button>
          </div>
        </div>

        {selectedPlatformData && (
          <div className="text-sm text-slate-500 dark:text-slate-400">
            Character limit: {selectedPlatformData.maxLength} | Selected: {selectedPlatformData.name}
          </div>
        )}
      </div>

      {/* Generated Posts */}
      {generatedPosts.length > 0 && (
        <div>
          <h4 className="text-lg font-semibold mb-4 text-slate-800 dark:text-slate-200">Generated Posts</h4>
          <div className="space-y-4">
            {generatedPosts.map((post) => (
              <div key={post.id} className="bg-white dark:bg-slate-800 rounded-lg p-6 shadow-sm border border-slate-200 dark:border-slate-700">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{platforms.find(p => p.id === post.platform)?.icon}</span>
                    <span className="font-medium text-slate-800 dark:text-slate-200">
                      {platforms.find(p => p.id === post.platform)?.name}
                    </span>
                    <span className={`px-2 py-1 rounded text-xs ${
                      post.characterCount <= post.maxLength ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                    }`}>
                      {post.characterCount}/{post.maxLength}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => copyToClipboard(post.content)}
                      className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                      title="Copy post text"
                    >
                      <Copy size={16} />
                    </button>
                    <button
                      onClick={() => copyPostWithHashtags(post)}
                      className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                      title="Copy with hashtags"
                    >
                      <Hash size={16} />
                    </button>
                    <button
                      onClick={() => schedulePost(post)}
                      className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                      title="Schedule post"
                    >
                      <Calendar size={16} />
                    </button>
                  </div>
                </div>

                <div className="mb-4">
                  <p className="text-slate-800 dark:text-slate-200 whitespace-pre-wrap">{post.content}</p>
                </div>

                <div className="flex flex-wrap gap-2 mb-4">
                  {post.hashtags.map((hashtag: string, index: number) => (
                    <span
                      key={index}
                      className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded text-sm cursor-pointer hover:bg-blue-200 dark:hover:bg-blue-800"
                      onClick={() => copyToClipboard(hashtag)}
                    >
                      {hashtag}
                    </span>
                  ))}
                </div>

                <div className="flex gap-2">
                  <button className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
                    <Share2 size={16} />
                    Share Now
                  </button>
                  <button className="flex items-center gap-2 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 px-4 py-2 rounded hover:bg-slate-200 dark:hover:bg-slate-600">
                    <Download size={16} />
                    Save Draft
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tips */}
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
        <h5 className="font-medium text-blue-800 dark:text-blue-200 mb-2">💡 Social Media Best Practices:</h5>
        <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
          <li>• Use emojis strategically to increase engagement</li>
          <li>• Ask questions to encourage comments and discussions</li>
          <li>• Include 2-3 relevant hashtags per post</li>
          <li>• Post consistently and at optimal times for your audience</li>
          <li>• Use high-quality visuals to complement your text</li>
        </ul>
      </div>
    </div>
  );
};

export default SocialMediaPostGenerator;