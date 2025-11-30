import React, { useState, useEffect } from 'react';
import { 
  Menu, X, Settings, Moon, Sun, Globe, Search, 
  LayoutGrid, FileText, Image as ImageIcon, File, DollarSign, Wrench, ChevronRight, Home, CreditCard
} from 'lucide-react';
import { ToolCategory, ToolItem } from './types';
import Hero from './components/Hero';
import FinanceCalculator from './components/Tools/FinanceCalculator';
import SmartTextTools from './components/Tools/SmartTextTools';
import ImageTools from './components/Tools/ImageTools';
import PdfTools from './components/Tools/PdfTools';
import UtilityTools from './components/Tools/UtilityTools';

// --- Tool Data Definition ---
const TOOLS: ToolItem[] = [
  { id: 't1', name: 'Income Tax Calculator', description: 'Calculate your annual tax liabilities.', category: 'Finance', icon: DollarSign },
  { id: 't2', name: 'Loan EMI Calculator', description: 'Plan your loans with smart EMI breakdowns.', category: 'Finance', icon: CreditCard, popular: true },
  { id: 't3', name: 'Grammar Checker', description: 'AI-powered grammar & spell fix.', category: 'Text', icon: FileText, isNew: true },
  { id: 't4', name: 'Word Counter', description: 'Count words, chars & sentences instantly.', category: 'Text', icon: LayoutGrid },
  { id: 't5', name: 'Rephraser', description: 'Rewrite text professionally with AI.', category: 'Text', icon: FileText, popular: true },
  { id: 't6', name: 'Image Resizer', description: 'Resize images without losing quality.', category: 'Image', icon: ImageIcon },
  { id: 't7', name: 'PDF Merger', description: 'Combine multiple PDFs into one.', category: 'PDF', icon: File },
  { id: 't8', name: 'QR Generator', description: 'Create custom QR codes instantly.', category: 'Utility', icon: LayoutGrid },
  { id: 't9', name: 'SIP Calculator', description: 'Estimate returns on your monthly investments.', category: 'Finance', icon: DollarSign },
  { id: 't10', name: 'Base64 Encoder', description: 'Convert text/files to Base64 strings.', category: 'Utility', icon: Wrench },
];

const CATEGORIES: { id: ToolCategory; label: string; icon: any }[] = [
    { id: 'All', label: 'All Tools', icon: LayoutGrid },
    { id: 'Finance', label: 'Finance', icon: DollarSign },
    { id: 'Text', label: 'Text Tools', icon: FileText },
    { id: 'PDF', label: 'PDF Tools', icon: File },
    { id: 'Image', label: 'Image', icon: ImageIcon },
    { id: 'Utility', label: 'Utility', icon: Wrench },
];

const App: React.FC = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState<ToolCategory>('All');
  const [activeToolId, setActiveToolId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [lang, setLang] = useState<'EN' | 'HI'>('EN');

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
    setSidebarOpen(false); // Close sidebar on mobile on selection
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
        
        case 't3': // Grammar
        case 't4': // Word Counter
        case 't5': // Rephraser
            return <SmartTextTools />; // Tabs handles internally
        
        case 't6': // Image Resizer
            return <ImageTools />;
        
        case 't7': // PDF Merger
            return <PdfTools />;
        
        case 't8': // QR Generator
            return <UtilityTools initialTool="QR" />;
        case 't10': // Base64
            return <UtilityTools initialTool="BASE64" />;
            
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
          
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveToolId(null)}>
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center shadow-lg shadow-primary/30">
              <Settings className="text-white animate-[spin_8s_linear_infinite]" size={20} />
            </div>
            <span className="text-xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-400">
              PM TOOLS
            </span>
          </div>
        </div>

        <div className="hidden md:flex items-center space-x-6 text-sm font-medium text-slate-600 dark:text-slate-300">
          <button onClick={() => setActiveToolId(null)} className="hover:text-primary transition-colors">Home</button>
          <button className="hover:text-primary transition-colors">How to Use</button>
          <button className="hover:text-primary transition-colors">About Us</button>
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
            className="p-2 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-yellow-400 hover:ring-2 ring-primary transition-all"
          >
            {darkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
        </div>
      </header>

      <div className="flex pt-16 min-h-screen">
        
        {/* --- SIDEBAR --- */}
        <aside className={`fixed lg:sticky top-16 left-0 h-[calc(100vh-4rem)] w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 transition-transform duration-300 z-40 overflow-y-auto`}>
           <div className="p-4">
             <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 px-2">Categories</h3>
             <nav className="space-y-1">
               {CATEGORIES.map(cat => (
                 <button
                    key={cat.id}
                    onClick={() => { setActiveCategory(cat.id); setActiveToolId(null); setSidebarOpen(false); }}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                      activeCategory === cat.id && !activeToolId
                      ? 'bg-primary text-white shadow-md'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                 >
                   <cat.icon size={18} />
                   {cat.label}
                 </button>
               ))}
             </nav>

             <div className="mt-8">
               <div className="bg-slate-100 dark:bg-slate-800 rounded-xl p-4 text-center">
                  <div className="text-2xl font-bold text-primary">29k+</div>
                  <div className="text-xs text-slate-500 uppercase">Tools Used Today</div>
               </div>
             </div>
           </div>
        </aside>

        {/* --- MAIN CONTENT --- */}
        <main className="flex-1 bg-slate-50 dark:bg-slate-950 transition-colors w-full overflow-x-hidden">
          
          {/* Overlay for mobile sidebar */}
          {sidebarOpen && (
            <div className="fixed inset-0 bg-black/50 z-30 lg:hidden" onClick={() => setSidebarOpen(false)}></div>
          )}

          {activeToolId ? (
             <div className="p-4 lg:p-8 animate-fade-in">
                <button 
                  onClick={() => setActiveToolId(null)}
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
            <>
              {activeCategory === 'All' && <Hero onExplore={() => setActiveCategory('Finance')} />}

              <div className="p-4 lg:p-12 max-w-7xl mx-auto" id="tools-section">
                
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

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {filteredTools.map(tool => (
                    <div 
                      key={tool.id} 
                      onClick={() => handleToolClick(tool.id)}
                      className="group bg-white dark:bg-slate-900 rounded-xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer relative overflow-hidden"
                    >
                        {/* Hover Gradient Background */}
                        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        
                        <div className="flex justify-between items-start mb-4">
                            <div className={`p-3 rounded-lg ${tool.category === 'Finance' ? 'bg-green-100 text-green-600' : tool.category === 'Text' ? 'bg-blue-100 text-blue-600' : 'bg-purple-100 text-purple-600'} dark:bg-slate-800`}>
                                <tool.icon size={24} />
                            </div>
                            {tool.popular && (
                                <span className="px-2 py-1 bg-orange-100 text-orange-600 text-[10px] font-bold uppercase rounded-full tracking-wide">Hot</span>
                            )}
                            {tool.isNew && (
                                <span className="px-2 py-1 bg-blue-100 text-blue-600 text-[10px] font-bold uppercase rounded-full tracking-wide">New</span>
                            )}
                        </div>
                        
                        <h3 className="font-bold text-slate-900 dark:text-slate-100 mb-1 relative z-10">{tool.name}</h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2 relative z-10">{tool.description}</p>
                    </div>
                  ))}
                </div>

                {filteredTools.length === 0 && (
                    <div className="text-center py-20 text-slate-500">
                        <p>No tools found matching "{searchQuery}"</p>
                    </div>
                )}
              </div>
            </>
          )}
          
          <footer className="mt-auto py-8 text-center text-slate-500 text-sm border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
             <p>&copy; 2024 PM TOOLS. All rights reserved.</p>
          </footer>

        </main>
      </div>
    </div>
  );
};

export default App;