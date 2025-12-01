import React, { useState, useEffect } from 'react';
import { 
  Menu, X, Settings, Moon, Sun, Globe, Search, 
  LayoutGrid, FileText, Image as ImageIcon, File, DollarSign, Wrench, ChevronRight, Home, CreditCard,
  Code, Type, Palette, Hash, Link as LinkIcon, Clock, Percent, Calendar
} from 'lucide-react';
import { ToolCategory, ToolItem } from './types';
import Hero from './components/Hero';
import FinanceCalculator from './components/Tools/FinanceCalculator';
import SmartTextTools from './components/Tools/SmartTextTools';
import ImageTools from './components/Tools/ImageTools';
import PdfTools from './components/Tools/PdfTools';
import UtilityTools from './components/Tools/UtilityTools';
import DeveloperTools from './components/Tools/DeveloperTools';
import ContentTools from './components/Tools/ContentTools';

// --- Tool Data Definition ---
const TOOLS: ToolItem[] = [
  // Finance Tools
  { id: 't1', name: 'Income Tax Calculator', description: 'Calculate your annual tax liabilities.', category: 'Finance', icon: DollarSign },
  { id: 't2', name: 'Loan EMI Calculator', description: 'Plan your loans with smart EMI breakdowns.', category: 'Finance', icon: CreditCard, popular: true },
  { id: 't9', name: 'SIP Calculator', description: 'Estimate returns on your monthly investments.', category: 'Finance', icon: DollarSign },
  { id: 't20', name: 'Inflation Adjuster', description: 'See future cost and real value vs inflation.', category: 'Finance', icon: Percent, isNew: true },
  { id: 't21', name: 'Fixed Deposit (FD)', description: 'Compute maturity amount and interest.', category: 'Finance', icon: DollarSign },
  { id: 't22', name: 'Recurring Deposit (RD)', description: 'Monthly deposit growth and interest.', category: 'Finance', icon: Calendar },
  
  // AI Text Tools
  { id: 't3', name: 'Grammar Checker', description: 'AI-powered grammar & spell fix.', category: 'Text', icon: FileText, isNew: true },
  { id: 't5', name: 'Rephraser', description: 'Rewrite text professionally with AI.', category: 'Text', icon: FileText, popular: true },
  { id: 't4', name: 'Word Counter', description: 'Count words, chars & sentences instantly.', category: 'Text', icon: LayoutGrid },
  
  // Developer Tools
  { id: 't11', name: 'JSON Formatter', description: 'Format & minify JSON beautifully.', category: 'Developer', icon: Code, popular: true },
  { id: 't12', name: 'Base64 Encoder', description: 'Encode/decode Base64 strings.', category: 'Developer', icon: Code },
  { id: 't13', name: 'Hash Generator', description: 'Generate SHA-1, SHA-256 hashes.', category: 'Developer', icon: Hash },
  { id: 't14', name: 'URL Encoder', description: 'Encode/decode URL components.', category: 'Developer', icon: LinkIcon },
  { id: 't15', name: 'Timestamp Converter', description: 'Convert timestamps to dates & vice versa.', category: 'Developer', icon: Clock },
  
  // Content Tools
  { id: 't16', name: 'Case Converter', description: 'Convert text case (upper, lower, camel, etc).', category: 'Content', icon: Type },
  { id: 't17', name: 'Lorem Ipsum Generator', description: 'Generate placeholder text instantly.', category: 'Content', icon: FileText },
  { id: 't18', name: 'Color Picker', description: 'Pick colors & get HEX, RGB, HSL codes.', category: 'Content', icon: Palette },
  { id: 't19', name: 'Regex Tester', description: 'Test & debug regular expressions.', category: 'Content', icon: Type },
  
  // Image & PDF Tools
  { id: 't6', name: 'Image Resizer', description: 'Resize images without losing quality.', category: 'Image', icon: ImageIcon },
  { id: 't7', name: 'PDF Merger', description: 'Combine multiple PDFs into one.', category: 'PDF', icon: File },
  
  // Utility Tools
  { id: 't8', name: 'QR Generator', description: 'Create custom QR codes instantly.', category: 'Utility', icon: LayoutGrid },
  { id: 't10', name: 'Unit Converter', description: 'Convert units (length, weight, temp).', category: 'Utility', icon: Wrench },
];

const CATEGORIES: { id: ToolCategory; label: string; icon: any }[] = [
    { id: 'All', label: 'All Tools', icon: LayoutGrid },
    { id: 'Finance', label: 'Finance', icon: DollarSign },
    { id: 'Text', label: 'AI Text', icon: FileText },
    { id: 'Developer', label: 'Developer', icon: Code },
    { id: 'Content', label: 'Content', icon: Type },
    { id: 'Image', label: 'Image', icon: ImageIcon },
    { id: 'PDF', label: 'PDF', icon: File },
    { id: 'Utility', label: 'Utility', icon: Wrench },
];

const App: React.FC = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState<ToolCategory>('All');
  const [activeToolId, setActiveToolId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [lang, setLang] = useState<'EN' | 'HI'>('EN');
  const [toolUsageCount, setToolUsageCount] = useState(0);
  const [activePage, setActivePage] = useState<'home' | 'how-to-use' | 'about'>('home');

  // Load usage count from localStorage
  useEffect(() => {
    const storedCount = localStorage.getItem('toolUsageCount');
    if (storedCount) {
      setToolUsageCount(parseInt(storedCount));
    }
  }, []);

  // Theme Toggle Effect
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // Filter Logic
  const filteredTools = TOOLS.filter(tool => {
    const matchesCategory = activeCategory === 'All' || tool.category === activeCategory;
    const matchesSearch = tool.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          tool.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleToolClick = (id: string) => {
    setActiveToolId(id);
    setActivePage('home');
    setSidebarOpen(false); // Close sidebar on mobile on selection
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    // Increment usage count
    const newCount = toolUsageCount + 1;
    setToolUsageCount(newCount);
    localStorage.setItem('toolUsageCount', newCount.toString());
  };

  const navigateToPage = (page: 'home' | 'how-to-use' | 'about') => {
    setActivePage(page);
    setActiveToolId(null);
    setSidebarOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const renderActiveTool = () => {
    if (!activeToolId) return null;
    
    // Map IDs to components
    switch (activeToolId) {
        case 't1': // Tax
            return <FinanceCalculator initialTab="TAX" />;
        case 't2': // EMI
            return <FinanceCalculator initialTab="EMI" />;
        case 't9': // SIP
            return <FinanceCalculator initialTab="SIP" />;
        case 't20': // Inflation
          return <FinanceCalculator initialTab="INFLATION" />;
        case 't21': // FD
          return <FinanceCalculator initialTab="FD" />;
        case 't22': // RD
          return <FinanceCalculator initialTab="RD" />;
        
        case 't3': // Grammar
        case 't4': // Word Counter
        case 't5': // Rephraser
            return <SmartTextTools />;
        
        case 't6': // Image Resizer
            return <ImageTools />;
        
        case 't7': // PDF Merger
            return <PdfTools />;
        
        case 't8': // QR Generator
            return <UtilityTools initialTool="QR" />;
        
        case 't10': // Unit Converter
            return <UtilityTools initialTool="UNIT" />;
        
        case 't11': // JSON Formatter
        case 't12': // Base64
        case 't13': // Hash
        case 't14': // URL Encoder
        case 't15': // Timestamp
            return <DeveloperTools />;
        
        case 't16': // Case Converter
        case 't17': // Lorem Ipsum
        case 't18': // Color Picker
        case 't19': // Regex Tester
            return <ContentTools />;
            
        default:
            return (
                <div className="flex flex-col items-center justify-center py-20 bg-white dark:bg-slate-800 rounded-xl shadow border border-slate-200 dark:border-slate-700">
                    <Wrench size={64} className="text-slate-300 mb-4" />
                    <h3 className="text-2xl font-bold text-slate-700 dark:text-slate-200">Tool Under Construction</h3>
                    <p className="text-slate-500">The {TOOLS.find(t => t.id === activeToolId)?.name} is coming soon!</p>
                    <button 
                        onClick={() => setActiveToolId(null)}
                        className="mt-6 px-6 py-2 bg-primary text-white rounded-lg hover:bg-blue-700"
                    >
                        Go Back
                    </button>
                </div>
            );
    }
  };

  return (
    <div className="min-h-screen flex flex-col font-sans">
      
      {/* --- HEADER --- */}
      <header className="fixed top-0 left-0 right-0 z-50 h-16 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-4 lg:px-8 transition-colors">
        <div className="flex items-center gap-4">
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="lg:hidden p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg">
            <Menu size={24} />
          </button>
          
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigateToPage('home')}>
            <div className="w-8 h-8 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center shadow-lg shadow-indigo-500/30">
              <Settings className="text-white animate-[spin_8s_linear_infinite]" size={20} />
            </div>
            <span className="text-xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400">
              ToolSphere
            </span>
          </div>
        </div>

        <div className="hidden md:flex items-center space-x-6 text-sm font-medium text-slate-600 dark:text-slate-300">
          <button onClick={() => navigateToPage('home')} className={`hover:text-primary transition-colors ${activePage === 'home' && !activeToolId ? 'text-primary font-bold' : ''}`}>Home</button>
          <button onClick={() => navigateToPage('how-to-use')} className={`hover:text-primary transition-colors ${activePage === 'how-to-use' ? 'text-primary font-bold' : ''}`}>How to Use</button>
          <button onClick={() => navigateToPage('about')} className={`hover:text-primary transition-colors ${activePage === 'about' ? 'text-primary font-bold' : ''}`}>About Us</button>
        </div>

        <div className="flex items-center gap-3">
           {/* Language Switcher */}
           <button 
             onClick={() => setLang(lang === 'EN' ? 'HI' : 'EN')}
             className="flex items-center gap-1 px-2 py-1 rounded border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
             <Globe size={14} /> {lang}
           </button>

          {/* Theme Toggle */}
          <button 
            onClick={() => setDarkMode(!darkMode)}
            className="p-2.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-yellow-400 hover:bg-slate-200 dark:hover:bg-slate-700 hover:scale-110 hover:rotate-12 transition-all duration-300 shadow-sm hover:shadow-md"
          >
            {darkMode ? <Sun size={20} className="animate-spin-slow" /> : <Moon size={20} />}
          </button>
        </div>
      </header>

      <div className="flex pt-16 flex-1">
        
        {/* --- SIDEBAR --- */}
        <aside className={`fixed lg:sticky top-16 left-0 h-[calc(100vh-4rem)] w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 transition-transform duration-300 z-40 overflow-y-auto`}>
           <div className="p-4">
             <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 px-2">Categories</h3>
             <nav className="space-y-1">
               {CATEGORIES.map(cat => (
                 <button
                    key={cat.id}
                    onClick={() => { setActiveCategory(cat.id); setActiveToolId(null); setSidebarOpen(false); }}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 group relative overflow-hidden ${
                      activeCategory === cat.id && !activeToolId
                      ? 'bg-gradient-to-r from-primary to-indigo-600 text-white shadow-lg shadow-primary/30'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:translate-x-1'
                    }`}
                 >
                   {activeCategory === cat.id && !activeToolId && (
                     <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-50"></div>
                   )}
                   <cat.icon size={18} className={`transition-transform duration-200 ${
                     activeCategory === cat.id && !activeToolId ? 'scale-110' : 'group-hover:scale-110'
                   }`} />
                   <span className="relative z-10">{cat.label}</span>
                 </button>
               ))}
             </nav>

             <div className="mt-8">
               <div className="bg-gradient-to-br from-primary/10 via-purple-500/10 to-pink-500/10 dark:from-slate-800 dark:via-slate-800 dark:to-slate-800 rounded-xl p-5 text-center border border-primary/20 dark:border-slate-700 shadow-sm">
                  <div className="text-3xl font-extrabold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">{toolUsageCount.toLocaleString()}</div>
                  <div className="text-xs text-slate-600 dark:text-slate-400 uppercase tracking-wider mt-1 font-semibold">Tools Used Today</div>
               </div>
             </div>
           </div>
        </aside>

        {/* --- MAIN CONTENT --- */}
        <main className="flex-1 bg-slate-50 dark:bg-slate-950 transition-colors w-full overflow-x-hidden flex flex-col">
          
          {/* Overlay for mobile sidebar */}
          {sidebarOpen && (
            <div className="fixed inset-0 bg-black/50 z-30 lg:hidden" onClick={() => setSidebarOpen(false)}></div>
          )}

          {activePage === 'how-to-use' ? (
            <div className="p-4 lg:p-8 max-w-5xl mx-auto animate-fade-in flex-1">
              <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-6">How to Use ToolSphere</h1>
              <div className="prose dark:prose-invert max-w-none">
                <p className="text-lg text-slate-600 dark:text-slate-300 mb-8">ToolSphere is designed to be intuitive and easy to use. Follow these simple steps to get started:</p>
                
                <div className="space-y-6">
                  <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700">
                    <h3 className="text-xl font-bold text-primary mb-3">1. Browse Tools</h3>
                    <p className="text-slate-600 dark:text-slate-300">Use the sidebar to browse tools by category (Finance, AI Text, Developer, Content, Image, PDF, Utility) or search for specific tools using the search bar.</p>
                  </div>
                  
                  <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700">
                    <h3 className="text-xl font-bold text-primary mb-3">2. Select a Tool</h3>
                    <p className="text-slate-600 dark:text-slate-300">Click on any tool card to open it. You'll see a detailed interface with input fields and controls specific to that tool.</p>
                  </div>
                  
                  <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700">
                    <h3 className="text-xl font-bold text-primary mb-3">3. Input Your Data</h3>
                    <p className="text-slate-600 dark:text-slate-300">Enter your data, upload files, or adjust sliders as needed. Most tools provide real-time results as you make changes.</p>
                  </div>
                  
                  <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700">
                    <h3 className="text-xl font-bold text-primary mb-3">4. Get Results</h3>
                    <p className="text-slate-600 dark:text-slate-300">View your results instantly. For file-based tools (PDF, Image), download your processed files directly to your device.</p>
                  </div>
                  
                  <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700">
                    <h3 className="text-xl font-bold text-primary mb-3">5. Privacy First</h3>
                    <p className="text-slate-600 dark:text-slate-300">All tools process data client-side in your browser. Your files and data never leave your device, ensuring complete privacy.</p>
                  </div>
                </div>
              </div>
            </div>
          ) : activePage === 'about' ? (
            <div className="p-4 lg:p-8 max-w-5xl mx-auto animate-fade-in flex-1">
              <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-6">About ToolSphere</h1>
              <div className="prose dark:prose-invert max-w-none">
                <div className="bg-white dark:bg-slate-800 p-8 rounded-xl border border-slate-200 dark:border-slate-700 mb-6">
                  <h2 className="text-2xl font-bold text-primary mb-4">Our Mission</h2>
                  <p className="text-lg text-slate-600 dark:text-slate-300">ToolSphere was created to provide a comprehensive, privacy-focused toolkit for everyone. Whether you're a student, developer, content creator, or professional, we believe powerful tools should be accessible, free, and respectful of your privacy.</p>
                </div>
                
                <div className="bg-white dark:bg-slate-800 p-8 rounded-xl border border-slate-200 dark:border-slate-700 mb-6">
                  <h2 className="text-2xl font-bold text-primary mb-4">What We Offer</h2>
                  <ul className="space-y-3 text-slate-600 dark:text-slate-300">
                    <li className="flex items-start gap-3"><span className="text-primary font-bold">✓</span> 30+ professional-grade tools across 8 categories</li>
                    <li className="flex items-start gap-3"><span className="text-primary font-bold">✓</span> AI-powered text tools with Gemini integration</li>
                    <li className="flex items-start gap-3"><span className="text-primary font-bold">✓</span> Client-side processing for complete privacy</li>
                    <li className="flex items-start gap-3"><span className="text-primary font-bold">✓</span> No registration or account required</li>
                    <li className="flex items-start gap-3"><span className="text-primary font-bold">✓</span> 100% free, no hidden costs</li>
                    <li className="flex items-start gap-3"><span className="text-primary font-bold">✓</span> Dark mode and responsive design</li>
                  </ul>
                </div>
                
                <div className="bg-white dark:bg-slate-800 p-8 rounded-xl border border-slate-200 dark:border-slate-700">
                  <h2 className="text-2xl font-bold text-primary mb-4">Privacy & Security</h2>
                  <p className="text-slate-600 dark:text-slate-300 mb-4">We take your privacy seriously. All file processing (PDF merge, image resize, etc.) happens directly in your browser using client-side JavaScript. Your files never touch our servers.</p>
                  <p className="text-slate-600 dark:text-slate-300">For AI-powered features that require external API calls (Grammar Checker, Rephraser), we use secure server-side proxies to protect your API keys, but the text content is only processed temporarily and never stored.</p>
                </div>
              </div>
            </div>
          ) : activeToolId ? (
             <div className="p-4 lg:p-8 animate-fade-in flex-1">
                <button 
                  onClick={() => navigateToPage('home')}
                  className="flex items-center gap-2 text-sm text-slate-500 hover:text-primary mb-6 transition-colors"
                >
                  <Home size={16} /> <ChevronRight size={14} /> Tools <ChevronRight size={14} /> {TOOLS.find(t => t.id === activeToolId)?.name}
                </button>
                
                <div className="max-w-5xl mx-auto">
                    <div className="mb-8">
                        <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">{TOOLS.find(t => t.id === activeToolId)?.name}</h2>
                        <p className="text-slate-600 dark:text-slate-400">{TOOLS.find(t => t.id === activeToolId)?.description}</p>
                    </div>
                    {renderActiveTool()}
                </div>
             </div>
          ) : (
            <div className="flex-1 flex flex-col">
              {activeCategory === 'All' && <Hero onExplore={() => setActiveCategory('Finance')} />}

              <div className="p-4 lg:p-12 max-w-7xl mx-auto w-full flex-1" id="tools-section">
                
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                    <div>
                        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                            {activeCategory === 'All' ? 'Popular Tools' : `${activeCategory} Tools`}
                        </h2>
                        <p className="text-slate-500 text-sm">Find the right utility for your workflow.</p>
                    </div>
                    
                    <div className="relative w-full md:w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input 
                            type="text" 
                            placeholder="Search tools..." 
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-full text-sm focus:ring-2 focus:ring-primary outline-none transition-all"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-fade-in">
                  {filteredTools.map((tool, index) => (
                    <div 
                      key={tool.id} 
                      onClick={() => handleToolClick(tool.id)}
                      style={{ animationDelay: `${index * 0.05}s` }}
                      className="group bg-white dark:bg-slate-900 rounded-xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-2xl hover:-translate-y-2 hover:border-primary/50 transition-all duration-300 cursor-pointer relative overflow-hidden animate-fade-in"
                    >
                        {/* Hover Gradient Background */}
                        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-purple-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
                        
                        {/* Shine Effect */}
                        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                          <div className="absolute inset-0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-12"></div>
                        </div>
                        
                        <div className="flex justify-between items-start mb-4 relative z-10">
                            <div className={`p-3 rounded-xl transition-all duration-300 group-hover:scale-110 group-hover:rotate-6 shadow-sm group-hover:shadow-md ${
                              tool.category === 'Finance' ? 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400' : 
                              tool.category === 'Text' ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400' : 
                              tool.category === 'Developer' ? 'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400' : 
                              tool.category === 'Content' ? 'bg-pink-100 text-pink-600 dark:bg-pink-900/30 dark:text-pink-400' : 
                              tool.category === 'Image' ? 'bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400' : 
                              tool.category === 'PDF' ? 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400' : 
                              'bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400'
                            }`}>
                                <tool.icon size={24} className="transition-transform duration-300 group-hover:scale-110" />
                            </div>
                            {tool.popular && (
                                <span className="px-2.5 py-1 bg-gradient-to-r from-orange-400 to-red-500 text-white text-[10px] font-bold uppercase rounded-full tracking-wide shadow-md animate-pulse">Hot</span>
                            )}
                            {tool.isNew && (
                                <span className="px-2.5 py-1 bg-gradient-to-r from-blue-500 to-cyan-500 text-white text-[10px] font-bold uppercase rounded-full tracking-wide shadow-md">New</span>
                            )}
                        </div>
                        
                        <h3 className="font-bold text-slate-900 dark:text-slate-100 mb-2 relative z-10 group-hover:text-primary transition-colors duration-300">{tool.name}</h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2 relative z-10 leading-relaxed">{tool.description}</p>
                        
                        {/* Arrow indicator on hover */}
                        <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0">
                          <ChevronRight size={18} className="text-primary" />
                        </div>
                    </div>
                  ))}
                </div>

                {filteredTools.length === 0 && (
                    <div className="text-center py-20 text-slate-500">
                        <p>No tools found matching "{searchQuery}"</p>
                    </div>
                )}
              </div>
            </div>
          )}
          
          <footer className="py-8 px-4 text-slate-500 text-sm border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
             <div className="max-w-7xl mx-auto">
               <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                 <div className="text-center md:text-left">
                   <h3 className="font-bold text-slate-700 dark:text-slate-300 mb-2">Contact Us</h3>
                   <p className="flex items-center justify-center md:justify-start gap-2">
                     <span>📧</span>
                     <a href="mailto:digidhanesh@gmail.com" className="hover:text-primary transition-colors">digidhanesh@gmail.com</a>
                   </p>
                   <p className="flex items-center justify-center md:justify-start gap-2 mt-1">
                     <span>📱</span>
                     <a href="tel:+917898726342" className="hover:text-primary transition-colors">+91 7898726342</a>
                   </p>
                 </div>
                 
                 <div className="text-center">
                   <h3 className="font-bold text-slate-700 dark:text-slate-300 mb-2">ToolSphere</h3>
                   <p className="text-xs">Complete Toolkit for Everyone</p>
                   <p className="text-xs mt-2">&copy; 2024 ToolSphere. All rights reserved.</p>
                 </div>
                 
                 <div className="text-center md:text-right">
                   <h3 className="font-bold text-slate-700 dark:text-slate-300 mb-2">Developed By</h3>
                   <a href="https://dnstech.in" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline font-semibold">
                     dnstech.in
                   </a>
                 </div>
               </div>
             </div>
          </footer>

        </main>
      </div>
    </div>
  );
};

export default App;