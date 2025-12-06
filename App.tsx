import React, { useState, useEffect } from 'react';
import { 
  Menu, X, Settings, Sun, Globe, Search, 
  LayoutGrid, FileText, Image as ImageIcon, File, DollarSign, Wrench, ChevronRight, Home, CreditCard,
  Code, Type, Palette, Hash, Link as LinkIcon, Clock, Percent, Calendar, FileSpreadsheet, Presentation, 
  FileCode2, Braces, Paintbrush, TrendingUp, BarChart3, Bitcoin, Mail, Database, Shield, HelpCircle, Star, History,
  QrCode, MessageSquare, Zap, CheckSquare, Target, User, FileSignature, BookOpen, Calculator, Quote, Heart, 
  Apple, Dumbbell, Droplets, Moon, Package, Languages, Film, Music, Gamepad2, ChefHat, ShoppingCart, 
  PiggyBank, Wifi, Monitor, FileType, Users, Cpu, Plane, LogIn, LogOut
} from 'lucide-react';
import { ToolCategory, ToolItem } from './types';
import { AuthProvider, useAuth } from './src/contexts/AuthContext';
import { AuthModal } from './components/AuthModal';
import Hero from './components/Hero';
import FinanceCalculator from './components/Tools/FinanceCalculator';
import SmartTextTools from './components/Tools/SmartTextTools';
import ImageTools from './components/Tools/ImageTools';
import PdfTools from './components/Tools/PdfTools';
import UtilityTools from './components/Tools/UtilityTools';
import DeveloperTools from './components/Tools/DeveloperTools';
import ContentTools from './components/Tools/ContentTools';
import OfficeTools from './components/Tools/OfficeTools';
import WebDevTools from './components/Tools/WebDevTools';
import SEOTools from './components/Tools/SEOTools';
import AnalyticsTools from './components/Tools/AnalyticsTools';
import CryptoTools from './components/Tools/CryptoTools';
import SecurityTools from './components/Tools/SecurityTools';
import EmailTools from './components/Tools/EmailTools';
import DataScienceTools from './components/Tools/DataScienceTools';
import PomodoroTimer from './components/Tools/PomodoroTimer';
import TaskManager from './components/Tools/TaskManager';
import NoteTakingApp from './components/Tools/NoteTakingApp';
import HabitTracker from './components/Tools/HabitTracker';
import LogoMaker from './components/Tools/LogoMaker';
import MockupGenerator from './components/Tools/MockupGenerator';
import PatternGenerator from './components/Tools/PatternGenerator';
import InvoiceGenerator from './components/Tools/InvoiceGenerator';
import BusinessCardMaker from './components/Tools/BusinessCardMaker';
import ResumeBuilder from './components/Tools/ResumeBuilder';
import ContractGenerator from './components/Tools/ContractGenerator';
import SWOTAnalysis from './components/Tools/SWOTAnalysis';
import QuizMaker from './components/Tools/QuizMaker';
import FlashcardGenerator from './components/Tools/FlashcardGenerator';
import StudyTimer from './components/Tools/StudyTimer';
import GradeCalculator from './components/Tools/GradeCalculator';
import CitationGenerator from './components/Tools/CitationGenerator';
import BMICalculator from './components/Tools/BMICalculator';
import CalorieCounter from './components/Tools/CalorieCounter';
import WorkoutPlanner from './components/Tools/WorkoutPlanner';
import WaterIntakeTracker from './components/Tools/WaterIntakeTracker';
import SleepCalculator from './components/Tools/SleepCalculator';
import TimeZoneConverter from './components/Tools/TimeZoneConverter';
import PackingListGenerator from './components/Tools/PackingListGenerator';
import TravelBudgetCalculator from './components/Tools/TravelBudgetCalculator';
import LanguageTranslator from './components/Tools/LanguageTranslator';
import MovieRecommender from './components/Tools/MovieRecommender';
import MusicPlaylistGenerator from './components/Tools/MusicPlaylistGenerator';
import TriviaGenerator from './components/Tools/TriviaGenerator';
import RecipeGenerator from './components/Tools/RecipeGenerator';
import ShoppingList from './components/Tools/ShoppingList';
import HomeBudgetTracker from './components/Tools/HomeBudgetTracker';
import HomeMaintenanceScheduler from './components/Tools/HomeMaintenanceScheduler';
import WiFiQRGenerator from './components/Tools/WiFiQRGenerator';
import DeviceSpecsChecker from './components/Tools/DeviceSpecsChecker';
import FileConverter from './components/Tools/FileConverter';
import HashtagGenerator from './components/Tools/HashtagGenerator';
import CaptionWriter from './components/Tools/CaptionWriter';
import ColorPaletteGenerator from './components/Tools/ColorPaletteGenerator';
import FontPairingTool from './components/Tools/FontPairingTool';
import IconGenerator from './components/Tools/IconGenerator';
import MemeGenerator from './components/Tools/MemeGenerator';
import URLShortener from './components/Tools/URLShortener';
import APITestingTool from './components/Tools/APITestingTool';
import SocialMediaPostGenerator from './components/Tools/SocialMediaPostGenerator';
import AdvancedQRCodeGenerator from './components/Tools/AdvancedQRCodeGenerator';
import EngagementCalculator from './components/Tools/EngagementCalculator';
import UnicodeConverter from './components/Tools/UnicodeConverter';
import UsageGuide from './components/UsageGuide';

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
  
  // MS Office Tools
  { id: 't23', name: 'Word Counter Pro', description: 'Advanced document analysis for DOCX files.', category: 'Office', icon: FileText, isNew: true },
  { id: 't24', name: 'Excel Formula Helper', description: 'Generate & explain Excel formulas.', category: 'Office', icon: FileSpreadsheet, popular: true },
  { id: 't25', name: 'PPT Template Generator', description: 'Create PowerPoint slide templates.', category: 'Office', icon: Presentation },
  { id: 't26', name: 'CSV to JSON Converter', description: 'Convert CSV/Excel to JSON format.', category: 'Office', icon: FileSpreadsheet },
  { id: 't27', name: 'Table Generator', description: 'Create markdown & HTML tables easily.', category: 'Office', icon: LayoutGrid },
  
  // Web Development Tools
  { id: 't28', name: 'HTML Formatter', description: 'Format & beautify HTML code.', category: 'WebDev', icon: FileCode2, popular: true },
  { id: 't29', name: 'CSS Minifier', description: 'Compress CSS for faster load times.', category: 'WebDev', icon: Braces },
  { id: 't30', name: 'CSS Gradient Generator', description: 'Create beautiful CSS gradients visually.', category: 'WebDev', icon: Paintbrush, isNew: true },
  { id: 't31', name: 'Box Shadow Generator', description: 'Design CSS box shadows with preview.', category: 'WebDev', icon: Palette },
  { id: 't32', name: 'HTML Entity Encoder', description: 'Encode/decode HTML special characters.', category: 'WebDev', icon: Code },
  
  // SEO Tools
  { id: 't33', name: 'Meta Tag Generator', description: 'Create SEO-optimized meta tags for websites.', category: 'SEO', icon: TrendingUp, popular: true },
  { id: 't34', name: 'Keyword Density Checker', description: 'Analyze keyword usage in your content.', category: 'SEO', icon: Search },
  { id: 't35', name: 'Backlink Analyzer', description: 'Check and analyze backlink quality.', category: 'SEO', icon: LinkIcon },
  { id: 't36', name: 'Schema Markup Generator', description: 'Generate JSON-LD structured data.', category: 'SEO', icon: Code, isNew: true },
  
  // Analytics Tools
  { id: 't37', name: 'UTM Builder', description: 'Create trackable campaign URLs.', category: 'Analytics', icon: BarChart3 },
  { id: 't38', name: 'ROI Calculator', description: 'Calculate marketing return on investment.', category: 'Analytics', icon: DollarSign, popular: true },
  { id: 't39', name: 'A/B Test Calculator', description: 'Statistical significance for A/B tests.', category: 'Analytics', icon: BarChart3 },
  { id: 't40', name: 'Conversion Rate Calculator', description: 'Track and optimize conversion rates.', category: 'Analytics', icon: TrendingUp },
  
  // Crypto Tools
  { id: 't41', name: 'Crypto Profit Calculator', description: 'Calculate cryptocurrency profits & losses.', category: 'Crypto', icon: Bitcoin, popular: true },
  { id: 't42', name: 'Mining Calculator', description: 'Estimate mining profitability.', category: 'Crypto', icon: Bitcoin },
  { id: 't43', name: 'DCA Calculator', description: 'Dollar-cost averaging investment calculator.', category: 'Crypto', icon: TrendingUp, isNew: true },
  { id: 't44', name: 'Gas Fee Estimator', description: 'Ethereum gas fee calculator.', category: 'Crypto', icon: Bitcoin },
  
  // Email Marketing Tools
  { id: 't45', name: 'Email Template Builder', description: 'Create responsive email templates.', category: 'Email', icon: Mail, popular: true },
  { id: 't46', name: 'Subject Line Tester', description: 'Test and optimize email subject lines.', category: 'Email', icon: Mail },
  { id: 't47', name: 'Email Validator', description: 'Validate email addresses in bulk.', category: 'Email', icon: Mail },
  { id: 't48', name: 'Spam Score Checker', description: 'Check if your email will hit spam.', category: 'Email', icon: Shield },
  
  // Data Science Tools
  { id: 't49', name: 'Statistical Calculator', description: 'Mean, median, mode, std deviation.', category: 'DataScience', icon: Database },
  { id: 't50', name: 'Correlation Calculator', description: 'Calculate Pearson correlation coefficient.', category: 'DataScience', icon: BarChart3, isNew: true },
  { id: 't51', name: 'Data Visualizer', description: 'Create charts from your data.', category: 'DataScience', icon: BarChart3, popular: true },
  { id: 't52', name: 'Sample Size Calculator', description: 'Determine required sample size.', category: 'DataScience', icon: Database },
  
  // Security Tools
  { id: 't53', name: 'Password Generator', description: 'Generate ultra-secure passwords.', category: 'Security', icon: Shield, popular: true },
  { id: 't54', name: 'Password Strength Checker', description: 'Test password security level.', category: 'Security', icon: Shield },
  { id: 't55', name: 'Encryption Tool', description: 'AES encryption/decryption.', category: 'Security', icon: Shield },
  { id: 't56', name: 'SSL Certificate Checker', description: 'Verify SSL certificate validity.', category: 'Security', icon: Shield, isNew: true },
  
  // Design Tools
  { id: 't57', name: 'Color Palette Generator', description: 'Create beautiful color schemes for designs.', category: 'Design', icon: Palette, popular: true, isNew: true },
  { id: 't58', name: 'Font Pairing Tool', description: 'Find perfect font combinations.', category: 'Design', icon: Type, isNew: true },
  { id: 't59', name: 'Icon Generator', description: 'AI-powered custom icon creation.', category: 'Design', icon: Zap, isNew: true },
  { id: 't60', name: 'Meme Generator', description: 'Create viral memes instantly.', category: 'Design', icon: ImageIcon, isNew: true },
  
  // Productivity Tools
  { id: 't61', name: 'URL Shortener with Analytics', description: 'Shorten URLs and track performance.', category: 'Productivity', icon: LinkIcon, popular: true, isNew: true },
  { id: 't62', name: 'API Testing Tool', description: 'Test REST APIs with full functionality.', category: 'Productivity', icon: Code, isNew: true },
  { id: 't63', name: 'Social Media Post Generator', description: 'Generate engaging social content.', category: 'Productivity', icon: MessageSquare, isNew: true },
  { id: 't64', name: 'Advanced QR Code Generator', description: 'Create custom QR codes with logos.', category: 'Productivity', icon: QrCode, isNew: true },
  
  // Productivity Tools
  { id: 't65', name: 'Pomodoro Timer', description: 'Boost productivity with focused work sessions.', category: 'Productivity', icon: Clock, popular: true },
  { id: 't66', name: 'Task Manager', description: 'Organize and track your tasks efficiently.', category: 'Productivity', icon: CheckSquare },
  { id: 't67', name: 'Note Taking App', description: 'Create and organize digital notes.', category: 'Productivity', icon: FileText },
  { id: 't68', name: 'Habit Tracker', description: 'Build and maintain good habits.', category: 'Productivity', icon: Target },
  
  // Business Tools
  { id: 't69', name: 'Invoice Generator', description: 'Create professional invoices instantly.', category: 'Business', icon: FileText, popular: true },
  { id: 't70', name: 'Business Card Maker', description: 'Design professional business cards.', category: 'Business', icon: CreditCard },
  { id: 't71', name: 'Resume Builder', description: 'Create stunning resumes online.', category: 'Business', icon: User },
  { id: 't72', name: 'Contract Generator', description: 'Generate legal contracts quickly.', category: 'Business', icon: FileSignature },
  { id: 't73', name: 'SWOT Analysis', description: 'Strategic planning and analysis tool.', category: 'Business', icon: BarChart3 },
  
  // Education Tools
  { id: 't74', name: 'Quiz Maker', description: 'Create interactive quizzes and tests.', category: 'Education', icon: HelpCircle, popular: true },
  { id: 't75', name: 'Flashcard Generator', description: 'Create digital flashcards for learning.', category: 'Education', icon: BookOpen },
  { id: 't76', name: 'Study Timer', description: 'Optimize study sessions with timers.', category: 'Education', icon: Clock },
  { id: 't77', name: 'Grade Calculator', description: 'Calculate GPA and course grades.', category: 'Education', icon: Calculator },
  { id: 't78', name: 'Citation Generator', description: 'Generate proper citations and references.', category: 'Education', icon: Quote },
  
  // Health & Fitness Tools
  { id: 't79', name: 'BMI Calculator', description: 'Calculate Body Mass Index and health metrics.', category: 'Health', icon: Heart, popular: true },
  { id: 't80', name: 'Calorie Counter', description: 'Track daily calorie intake and nutrition.', category: 'Health', icon: Apple },
  { id: 't81', name: 'Workout Planner', description: 'Create personalized workout routines.', category: 'Health', icon: Dumbbell },
  { id: 't82', name: 'Water Intake Tracker', description: 'Monitor daily water consumption.', category: 'Health', icon: Droplets },
  { id: 't83', name: 'Sleep Calculator', description: 'Optimize sleep schedule and quality.', category: 'Health', icon: Moon },
  
  // Travel Tools
  { id: 't84', name: 'Time Zone Converter', description: 'Convert time across different zones.', category: 'Travel', icon: Clock, popular: true },
  { id: 't85', name: 'Packing List Generator', description: 'Create comprehensive travel checklists.', category: 'Travel', icon: Package },
  { id: 't86', name: 'Travel Budget Calculator', description: 'Plan and track travel expenses.', category: 'Travel', icon: DollarSign },
  { id: 't87', name: 'Language Translator', description: 'Translate text between languages.', category: 'Travel', icon: Languages },
  
  // Entertainment Tools
  { id: 't88', name: 'Movie Recommender', description: 'Get personalized movie suggestions.', category: 'Entertainment', icon: Film, popular: true },
  { id: 't89', name: 'Music Playlist Generator', description: 'Create custom music playlists.', category: 'Entertainment', icon: Music },
  { id: 't90', name: 'Trivia Generator', description: 'Create fun trivia questions and games.', category: 'Entertainment', icon: Gamepad2 },
  
  // Lifestyle Tools
  { id: 't91', name: 'Recipe Generator', description: 'Generate recipes based on ingredients.', category: 'Lifestyle', icon: ChefHat, popular: true },
  { id: 't92', name: 'Shopping List', description: 'Organize and manage shopping lists.', category: 'Lifestyle', icon: ShoppingCart },
  { id: 't93', name: 'Home Budget Tracker', description: 'Track household expenses and savings.', category: 'Lifestyle', icon: PiggyBank },
  { id: 't94', name: 'Home Maintenance Scheduler', description: 'Schedule and track home maintenance.', category: 'Lifestyle', icon: Wrench },
  
  // Tech Tools
  { id: 't95', name: 'WiFi QR Generator', description: 'Generate QR codes for WiFi networks.', category: 'Tech', icon: Wifi, popular: true },
  { id: 't96', name: 'Device Specs Checker', description: 'Check device specifications and compatibility.', category: 'Tech', icon: Monitor },
  { id: 't97', name: 'File Converter', description: 'Convert files between different formats.', category: 'Tech', icon: FileType },
  
  // Social Media Tools
  { id: 't98', name: 'Hashtag Generator', description: 'Generate trending hashtags for posts.', category: 'Social', icon: Hash, popular: true },
  { id: 't99', name: 'Caption Writer', description: 'Create engaging social media captions.', category: 'Social', icon: MessageSquare },
  { id: 't100', name: 'Engagement Calculator', description: 'Calculate social media engagement rates.', category: 'Social', icon: TrendingUp },
  
  // Content Tools - Unicode Converter
  { id: 't101', name: 'Unicode Converter', description: 'Convert between Indian fonts (KrutiDev, Preeti, Mangal) and Unicode.', category: 'Content', icon: Globe, popular: true, isNew: true },
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
    { id: 'Office', label: 'MS Office', icon: FileSpreadsheet },
    { id: 'WebDev', label: 'Web Dev', icon: FileCode2 },
    { id: 'SEO', label: 'SEO', icon: TrendingUp },
    { id: 'Analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'Crypto', label: 'Crypto', icon: Bitcoin },
    { id: 'Email', label: 'Email Marketing', icon: Mail },
    { id: 'DataScience', label: 'Data Science', icon: Database },
    { id: 'Design', label: 'Design & Creative', icon: Palette },
    { id: 'Productivity', label: 'Productivity', icon: Settings },
    { id: 'Security', label: 'Security', icon: Shield },
    { id: 'Business', label: 'Business', icon: DollarSign },
    { id: 'Education', label: 'Education', icon: BookOpen },
    { id: 'Health', label: 'Health & Fitness', icon: Heart },
    { id: 'Travel', label: 'Travel', icon: Plane },
    { id: 'Entertainment', label: 'Entertainment', icon: Gamepad2 },
    { id: 'Lifestyle', label: 'Lifestyle', icon: Home },
    { id: 'Tech', label: 'Tech Tools', icon: Cpu },
    { id: 'Social', label: 'Social Media', icon: Users },
];

const AppContent: React.FC = () => {
  const { user, logout } = useAuth();
  const [darkMode, setDarkMode] = useState(() => {
    // Load dark mode preference from localStorage on initialization
    const stored = localStorage.getItem('darkMode');
    return stored ? JSON.parse(stored) : false;
  });
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState<ToolCategory>('All');
  const [activeToolId, setActiveToolId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [showSearchSuggestions, setShowSearchSuggestions] = useState(false);
  const [toast, setToast] = useState<{message: string; type: 'success' | 'info'} | null>(null);
  const [lang, setLang] = useState<'EN' | 'HI'>('EN');
  const [toolUsageCount, setToolUsageCount] = useState(0);
  const [activePage, setActivePage] = useState<'home' | 'how-to-use' | 'about' | 'privacy' | 'terms' | 'contact'>('home');
  const [showAuthModal, setShowAuthModal] = useState(false);

  // Load favorites and recent searches from localStorage
  useEffect(() => {
    const storedCount = localStorage.getItem('toolUsageCount');
    if (storedCount) {
      setToolUsageCount(parseInt(storedCount));
    }
    
    const storedFavorites = localStorage.getItem('toolFavorites');
    if (storedFavorites) {
      setFavorites(new Set(JSON.parse(storedFavorites)));
    }
    
    const storedRecentSearches = localStorage.getItem('recentSearches');
    if (storedRecentSearches) {
      setRecentSearches(JSON.parse(storedRecentSearches));
    }
  }, []);

  // Theme Toggle Effect - persist to localStorage
  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // Debounced search
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('');
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Filter Logic with favorites priority
  const filteredTools = TOOLS.filter(tool => {
    const matchesCategory = activeCategory === 'All' || 
                           (activeCategory === 'Favorites' ? favorites.has(tool.id) : tool.category === activeCategory);
    
    // Enhanced search logic - check multiple fields
    const searchLower = debouncedSearchQuery.toLowerCase().trim();
    const matchesSearch = searchLower === '' || 
                          tool.name.toLowerCase().includes(searchLower) || 
                          tool.description.toLowerCase().includes(searchLower) ||
                          tool.category.toLowerCase().includes(searchLower);
    
    return matchesCategory && matchesSearch;
  }).sort((a, b) => {
    // If there's a search query, prioritize exact name matches
    const searchLower = debouncedSearchQuery.toLowerCase().trim();
    if (searchLower) {
      const aNameMatch = a.name.toLowerCase().startsWith(searchLower) ? 0 : 1;
      const bNameMatch = b.name.toLowerCase().startsWith(searchLower) ? 0 : 1;
      if (aNameMatch !== bNameMatch) return aNameMatch - bNameMatch;
    }
    
    // Then sort by favorites
    const aIsFavorite = favorites.has(a.id);
    const bIsFavorite = favorites.has(b.id);
    if (aIsFavorite && !bIsFavorite) return -1;
    if (!aIsFavorite && bIsFavorite) return 1;
    
    // Then by popular/new status
    if (a.popular && !b.popular) return -1;
    if (!a.popular && b.popular) return 1;
    if (a.isNew && !b.isNew) return -1;
    if (!a.isNew && b.isNew) return 1;
    
    return 0;
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
    
    // Add to recent searches if it was a search result
    if (debouncedSearchQuery && !recentSearches.includes(debouncedSearchQuery)) {
      const newRecentSearches = [debouncedSearchQuery, ...recentSearches.slice(0, 4)];
      setRecentSearches(newRecentSearches);
      localStorage.setItem('recentSearches', JSON.stringify(newRecentSearches));
    }
  };

  const toggleFavorite = (toolId: string, event: React.MouseEvent) => {
    event.stopPropagation();
    const tool = TOOLS.find(t => t.id === toolId);
    const newFavorites = new Set(favorites);
    if (newFavorites.has(toolId)) {
      newFavorites.delete(toolId);
      setToast({ message: `Removed ${tool?.name} from favorites`, type: 'info' });
    } else {
      newFavorites.add(toolId);
      setToast({ message: `Added ${tool?.name} to favorites`, type: 'success' });
    }
    setFavorites(newFavorites);
    localStorage.setItem('toolFavorites', JSON.stringify([...newFavorites]));
    
    // Auto-hide toast after 3 seconds
    setTimeout(() => setToast(null), 3000);
  };

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    setShowSearchSuggestions(value.length > 0);
  };

  const selectSearchSuggestion = (suggestion: string) => {
    setSearchQuery(suggestion);
    setShowSearchSuggestions(false);
  };

  const navigateToPage = (page: 'home' | 'how-to-use' | 'about' | 'privacy' | 'terms' | 'contact') => {
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
        
        case 't23': // Word Counter Pro
        case 't24': // Excel Formula Helper
        case 't25': // PPT Template
        case 't26': // CSV to JSON
        case 't27': // Table Generator
            return <OfficeTools />;
        
        case 't28': // HTML Formatter
        case 't29': // CSS Minifier
        case 't30': // CSS Gradient
        case 't31': // Box Shadow
        case 't32': // HTML Entity
            return <WebDevTools />;
        
        case 't33': // Meta Tag Generator
        case 't34': // Keyword Density
        case 't35': // Backlink Analyzer
        case 't36': // Schema Markup
            return <SEOTools />;
        
        case 't37': // UTM Builder
        case 't38': // ROI Calculator
        case 't39': // A/B Test Calculator
        case 't40': // Conversion Rate
            return <AnalyticsTools />;
        
        case 't41': // Crypto Profit
        case 't42': // Mining Calculator
        case 't43': // DCA Calculator
        case 't44': // Gas Fee
            return <CryptoTools />;
        
        case 't45': // Email Template Builder
        case 't46': // Subject Line Tester
        case 't47': // Email Validator
        case 't48': // Spam Score Checker
            return <EmailTools />;
        
        case 't49': // Statistical Calculator
        case 't50': // Correlation Calculator
        case 't51': // Data Visualizer
        case 't52': // Sample Size Calculator
            return <DataScienceTools />;
        
        case 't53': // Password Generator
        case 't54': // Password Strength
        case 't55': // Encryption
        case 't56': // SSL Checker
            return <SecurityTools />;
        
        case 't57': // Color Palette Generator
            return <ColorPaletteGenerator />;
        
        case 't58': // Font Pairing Tool
            return <FontPairingTool />;
        
        case 't59': // Icon Generator
            return <IconGenerator />;
        
        case 't60': // Meme Generator
            return <MemeGenerator />;
        
        case 't61': // URL Shortener
            return <URLShortener />;
        
        case 't62': // API Testing Tool
            return <APITestingTool />;
        
        case 't63': // Social Media Post Generator
            return <SocialMediaPostGenerator />;
        
        case 't64': // Advanced QR Code Generator
            return <AdvancedQRCodeGenerator />;
        
        case 't65': // Pomodoro Timer
            return <PomodoroTimer />;
        
        case 't66': // Task Manager
            return <TaskManager />;
        
        case 't67': // Note Taking App
            return <NoteTakingApp />;
        
        case 't68': // Habit Tracker
            return <HabitTracker />;
        
        case 't69': // Invoice Generator
            return <InvoiceGenerator />;
        
        case 't70': // Business Card Maker
            return <BusinessCardMaker />;
        
        case 't71': // Resume Builder
            return <ResumeBuilder />;
        
        case 't72': // Contract Generator
            return <ContractGenerator />;
        
        case 't73': // SWOT Analysis
            return <SWOTAnalysis />;
        
        case 't74': // Quiz Maker
            return <QuizMaker />;
        
        case 't75': // Flashcard Generator
            return <FlashcardGenerator />;
        
        case 't76': // Study Timer
            return <StudyTimer />;
        
        case 't77': // Grade Calculator
            return <GradeCalculator />;
        
        case 't78': // Citation Generator
            return <CitationGenerator />;
        
        case 't79': // BMI Calculator
            return <BMICalculator />;
        
        case 't80': // Calorie Counter
            return <CalorieCounter />;
        
        case 't81': // Workout Planner
            return <WorkoutPlanner />;
        
        case 't82': // Water Intake Tracker
            return <WaterIntakeTracker />;
        
        case 't83': // Sleep Calculator
            return <SleepCalculator />;
        
        case 't84': // Time Zone Converter
            return <TimeZoneConverter />;
        
        case 't85': // Packing List Generator
            return <PackingListGenerator />;
        
        case 't86': // Travel Budget Calculator
            return <TravelBudgetCalculator />;
        
        case 't87': // Language Translator
            return <LanguageTranslator />;
        
        case 't88': // Movie Recommender
            return <MovieRecommender />;
        
        case 't89': // Music Playlist Generator
            return <MusicPlaylistGenerator />;
        
        case 't90': // Trivia Generator
            return <TriviaGenerator />;
        
        case 't91': // Recipe Generator
            return <RecipeGenerator />;
        
        case 't92': // Shopping List
            return <ShoppingList />;
        
        case 't93': // Home Budget Tracker
            return <HomeBudgetTracker />;
        
        case 't94': // Home Maintenance Scheduler
            return <HomeMaintenanceScheduler />;
        
        case 't95': // WiFi QR Generator
            return <WiFiQRGenerator />;
        
        case 't96': // Device Specs Checker
            return <DeviceSpecsChecker />;
        
        case 't97': // File Converter
            return <FileConverter />;
        
        case 't98': // Hashtag Generator
            return <HashtagGenerator />;
        
        case 't99': // Caption Writer
            return <CaptionWriter />;
        
        case 't100': // Engagement Calculator
            return <EngagementCalculator />;
            
        case 't101': // Unicode Converter
            return <UnicodeConverter />;
            
        default:
            return null;
    }
  };

  return (
    <div className="min-h-screen flex flex-col font-sans">
      
      {/* --- HEADER --- */}
      <header className="fixed top-0 left-0 right-0 z-50 h-16 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-slate-200/50 dark:border-slate-800/50 flex items-center justify-between px-4 lg:px-8 transition-all duration-300 shadow-lg shadow-slate-900/5">
        <div className="flex items-center gap-4">
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="lg:hidden p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all duration-200 hover:scale-105">
            <Menu size={24} />
          </button>
          
          <button className="flex items-center gap-3 cursor-pointer hover:scale-105 hover:drop-shadow-lg transition-all duration-200 group" onClick={() => navigateToPage('home')} title="Go to Homepage">
            <div className="w-8 h-8 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/30 animate-pulse group-hover:shadow-2xl">
              <Settings className="text-white animate-[spin_8s_linear_infinite]" size={20} />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent group-hover:from-indigo-700 group-hover:to-purple-700 transition-all">
                ToolSphere
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300 transition-colors">100+ Professional Tools</p>
            </div>
          </button>
        </div>

        <div className="hidden md:flex items-center space-x-6 text-sm font-medium text-slate-600 dark:text-slate-300">
          <button onClick={() => navigateToPage('home')} className={`hover:text-primary transition-colors ${activePage === 'home' ? 'text-primary font-bold' : ''}`}>Home</button>
          
          {/* Categories Dropdown */}
          <div className="relative group">
            <button className="hover:text-primary transition-colors flex items-center gap-1">
              Categories <ChevronRight size={14} className="group-hover:rotate-90 transition-transform duration-200" />
            </button>
            <div className="absolute top-full left-0 mt-2 w-48 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-200 dark:border-slate-700 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
              <div className="p-2">
                <button onClick={() => { setActiveCategory('Finance'); setActivePage('home'); }} className="w-full text-left px-3 py-2 text-sm hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors">Finance Tools</button>
                <button onClick={() => { setActiveCategory('Text'); setActivePage('home'); }} className="w-full text-left px-3 py-2 text-sm hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors">AI Text Tools</button>
                <button onClick={() => { setActiveCategory('Developer'); setActivePage('home'); }} className="w-full text-left px-3 py-2 text-sm hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors">Developer Tools</button>
                <button onClick={() => { setActiveCategory('Design'); setActivePage('home'); }} className="w-full text-left px-3 py-2 text-sm hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors">Design Tools</button>
                <button onClick={() => { setActiveCategory('Productivity'); setActivePage('home'); }} className="w-full text-left px-3 py-2 text-sm hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors">Productivity Tools</button>
                <button onClick={() => { setActiveCategory('Business'); setActivePage('home'); }} className="w-full text-left px-3 py-2 text-sm hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors">Business Tools</button>
                <button onClick={() => { setActiveCategory('Health'); setActivePage('home'); }} className="w-full text-left px-3 py-2 text-sm hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors">Health & Fitness</button>
              </div>
            </div>
          </div>
          
          {/* Support Dropdown */}
          <div className="relative group">
            <button className="hover:text-primary transition-colors flex items-center gap-1">
              Support <ChevronRight size={14} className="group-hover:rotate-90 transition-transform duration-200" />
            </button>
            <div className="absolute top-full left-0 mt-2 w-48 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-200 dark:border-slate-700 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
              <div className="p-2">
                <button onClick={() => navigateToPage('how-to-use')} className="w-full text-left px-3 py-2 text-sm hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors">How to Use</button>
                <button onClick={() => navigateToPage('about')} className="w-full text-left px-3 py-2 text-sm hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors">About Us</button>
                <button onClick={() => navigateToPage('privacy')} className="w-full text-left px-3 py-2 text-sm hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors">Privacy Policy</button>
                <button onClick={() => navigateToPage('terms')} className="w-full text-left px-3 py-2 text-sm hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors">Terms of Service</button>
                <button onClick={() => navigateToPage('contact')} className="w-full text-left px-3 py-2 text-sm hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors">Contact Us</button>
              </div>
            </div>
          </div>
          
          <button onClick={() => navigateToPage('about')} className={`hover:text-primary transition-colors ${activePage === 'about' ? 'text-primary font-bold' : ''}`}>About</button>
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

          {/* Authentication */}
          {user ? (
            <div className="flex items-center gap-3">
              <div className="hidden sm:flex flex-col items-end">
                <span className="text-sm font-medium text-slate-900 dark:text-slate-100">
                  {user.displayName || user.email?.split('@')[0]}
                </span>
                <span className="text-xs text-slate-500 dark:text-slate-400">
                  {user.email}
                </span>
              </div>
              <button
                onClick={async () => {
                  try {
                    await logout();
                    setToast({ message: 'Logged out successfully', type: 'info' });
                  } catch (error) {
                    setToast({ message: 'Logout failed', type: 'info' });
                  }
                }}
                className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 text-white rounded-xl font-bold shadow-xl shadow-red-500/50 hover:shadow-2xl hover:shadow-red-600/60 transition-all duration-200 hover:scale-105 text-sm"
              >
                <LogOut size={18} />
                <span className="hidden sm:inline">Sign Out</span>
              </button>
            </div>
          ) : (
            <button
              onClick={() => setShowAuthModal(true)}
              className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl font-bold shadow-xl shadow-blue-500/50 hover:shadow-2xl hover:shadow-blue-600/60 transition-all duration-200 hover:scale-105 text-sm"
            >
              <LogIn size={18} />
              <span className="hidden sm:inline">Sign In</span>
            </button>
          )}
        </div>
      </header>

      <div className="flex pt-16 flex-1">
        
        {/* --- SIDEBAR --- */}
        <aside className={`fixed lg:sticky top-16 left-0 h-[calc(100vh-4rem)] w-64 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border-r border-slate-200/50 dark:border-slate-800/50 transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 transition-all duration-300 z-40 overflow-y-auto shadow-xl shadow-slate-900/10`}>
           <div className="p-4">
             {/* Search */}
             <div className="relative mb-6">
               <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={18} />
               <input
                 type="text"
                 placeholder="Search tools..."
                 value={searchQuery}
                 onChange={(e) => handleSearchChange(e.target.value)}
                 onFocus={() => setShowSearchSuggestions(searchQuery.length > 0)}
                 onBlur={() => setTimeout(() => setShowSearchSuggestions(false), 200)}
                 className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 hover:bg-slate-100 dark:hover:bg-slate-800"
               />
               
               {/* Search Suggestions */}
               {showSearchSuggestions && (
                 <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-xl z-50 max-h-64 overflow-y-auto">
                   {/* Recent Searches */}
                   {recentSearches.length > 0 && (
                     <div className="p-3 border-b border-slate-200 dark:border-slate-700">
                       <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Recent Searches</div>
                       {recentSearches.map((search, index) => (
                         <button
                           key={index}
                           onClick={() => selectSearchSuggestion(search)}
                           className="w-full text-left px-3 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                         >
                           <div className="flex items-center gap-2">
                             <Clock size={14} className="text-slate-400" />
                             {search}
                           </div>
                         </button>
                       ))}
                     </div>
                   )}
                   
                   {/* Popular Categories */}
                   <div className="p-3">
                     <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Popular Categories</div>
                     {['Finance', 'Text', 'Developer', 'Design', 'Productivity'].map((category) => (
                       <button
                         key={category}
                         onClick={() => selectSearchSuggestion(category)}
                         className="w-full text-left px-3 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                       >
                         <div className="flex items-center gap-2">
                           <Hash size={14} className="text-slate-400" />
                           {category} Tools
                         </div>
                       </button>
                     ))}
                   </div>
                 </div>
               )}
             </div>

             <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 px-2">Categories</h3>
             <nav className="space-y-1">
               {/* Favorites Filter */}
               <button
                  onClick={() => { setActiveCategory('Favorites'); setActiveToolId(null); setSidebarOpen(false); }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 group relative overflow-hidden hover:scale-105 hover:shadow-xl ${
                    activeCategory === 'Favorites' && !activeToolId
                    ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-xl shadow-amber-500/40'
                    : 'text-slate-700 dark:text-slate-300 hover:bg-gradient-to-r hover:from-amber-50 hover:to-orange-50 dark:hover:from-slate-800 dark:hover:to-slate-700 hover:translate-x-1 border border-transparent hover:border-amber-200 dark:hover:border-amber-900'
                  }`}
               >
                 {activeCategory === 'Favorites' && !activeToolId && (
                   <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-50"></div>
                 )}
                 <Star size={18} className={`transition-transform duration-200 ${
                   activeCategory === 'Favorites' && !activeToolId ? 'scale-110 fill-current' : 'group-hover:scale-110'
                 }`} />
                 <span className="relative z-10">Favorites ({favorites.size})</span>
               </button>

               {CATEGORIES.map(cat => (
                 <button
                    key={cat.id}
                    onClick={() => { setActiveCategory(cat.id); setActiveToolId(null); setSidebarOpen(false); }}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 group relative overflow-hidden hover:scale-105 hover:shadow-xl ${
                      activeCategory === cat.id && !activeToolId
                      ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-xl shadow-blue-500/40'
                      : 'text-slate-700 dark:text-slate-300 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 dark:hover:from-slate-800 dark:hover:to-slate-700 hover:translate-x-1 border border-transparent hover:border-blue-200 dark:hover:border-blue-900'
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
               <div className="bg-gradient-to-br from-indigo-500/10 via-purple-500/10 to-pink-500/10 dark:from-slate-800/80 dark:via-slate-800/80 dark:to-slate-800/80 rounded-xl p-5 text-center border border-indigo-200/50 dark:border-slate-700/50 shadow-lg backdrop-blur-sm">
                  <div className="text-3xl font-extrabold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">{toolUsageCount.toLocaleString()}</div>
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
          ) : activePage === 'privacy' ? (
            <div className="p-4 lg:p-8 max-w-5xl mx-auto animate-fade-in flex-1">
              <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-6">Privacy Policy</h1>
              <div className="prose dark:prose-invert max-w-none">
                <div className="bg-white dark:bg-slate-800 p-8 rounded-xl border border-slate-200 dark:border-slate-700 mb-6">
                  <h2 className="text-2xl font-bold text-primary mb-4">Data Collection</h2>
                  <p className="text-lg text-slate-600 dark:text-slate-300">ToolSphere does not collect, store, or transmit any personal data. All tools operate entirely in your browser using client-side processing.</p>
                </div>
                
                <div className="bg-white dark:bg-slate-800 p-8 rounded-xl border border-slate-200 dark:border-slate-700 mb-6">
                  <h2 className="text-2xl font-bold text-primary mb-4">File Processing</h2>
                  <p className="text-lg text-slate-600 dark:text-slate-300">When you upload files (PDFs, images, etc.), they are processed locally in your browser and never sent to our servers. Files are not stored or cached anywhere.</p>
                </div>
                
                <div className="bg-white dark:bg-slate-800 p-8 rounded-xl border border-slate-200 dark:border-slate-700">
                  <h2 className="text-2xl font-bold text-primary mb-4">Third-Party Services</h2>
                  <p className="text-lg text-slate-600 dark:text-slate-300">Some AI-powered tools may use external APIs. In these cases, only the necessary data is sent to the service provider, and we use secure, encrypted connections.</p>
                </div>
              </div>
            </div>
          ) : activePage === 'terms' ? (
            <div className="p-4 lg:p-8 max-w-5xl mx-auto animate-fade-in flex-1">
              <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-6">Terms of Service</h1>
              <div className="prose dark:prose-invert max-w-none">
                <div className="bg-white dark:bg-slate-800 p-8 rounded-xl border border-slate-200 dark:border-slate-700 mb-6">
                  <h2 className="text-2xl font-bold text-primary mb-4">Usage Terms</h2>
                  <p className="text-lg text-slate-600 dark:text-slate-300">ToolSphere is provided as-is for personal and commercial use. You are responsible for ensuring your use complies with applicable laws and regulations.</p>
                </div>
                
                <div className="bg-white dark:bg-slate-800 p-8 rounded-xl border border-slate-200 dark:border-slate-700 mb-6">
                  <h2 className="text-2xl font-bold text-primary mb-4">Service Availability</h2>
                  <p className="text-lg text-slate-600 dark:text-slate-300">While we strive for 99.9% uptime, ToolSphere is provided without warranties. We reserve the right to modify or discontinue services at any time.</p>
                </div>
                
                <div className="bg-white dark:bg-slate-800 p-8 rounded-xl border border-slate-200 dark:border-slate-700">
                  <h2 className="text-2xl font-bold text-primary mb-4">Limitation of Liability</h2>
                  <p className="text-lg text-slate-600 dark:text-slate-300">ToolSphere shall not be liable for any direct, indirect, incidental, or consequential damages arising from your use of our services.</p>
                </div>
              </div>
            </div>
          ) : activePage === 'contact' ? (
            <div className="p-4 lg:p-8 max-w-5xl mx-auto animate-fade-in flex-1">
              <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-6">Contact Us</h1>
              <div className="prose dark:prose-invert max-w-none">
                <div className="bg-white dark:bg-slate-800 p-8 rounded-xl border border-slate-200 dark:border-slate-700 mb-6">
                  <h2 className="text-2xl font-bold text-primary mb-4">Get in Touch</h2>
                  <p className="text-lg text-slate-600 dark:text-slate-300 mb-4">Have questions, feedback, or need support? We'd love to hear from you!</p>
                  
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="text-xl font-semibold mb-3">Email Support</h3>
                      <p className="text-slate-600 dark:text-slate-300 mb-2">For general inquiries and support:</p>
                      <a href="mailto:support@dnstech.in" className="text-primary hover:underline">support@dnstech.in</a>
                    </div>
                    
                    <div>
                      <h3 className="text-xl font-semibold mb-3">Business Inquiries</h3>
                      <p className="text-slate-600 dark:text-slate-300 mb-2">For partnerships and business:</p>
                      <a href="mailto:business@dnstech.in" className="text-primary hover:underline">business@dnstech.in</a>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white dark:bg-slate-800 p-8 rounded-xl border border-slate-200 dark:border-slate-700">
                  <h2 className="text-2xl font-bold text-primary mb-4">Developer</h2>
                  <p className="text-lg text-slate-600 dark:text-slate-300 mb-4">ToolSphere is developed and maintained by:</p>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-full flex items-center justify-center">
                      <span className="text-white font-bold text-lg">D</span>
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900 dark:text-white">DNS Tech</p>
                      <p className="text-slate-600 dark:text-slate-300">Full-Stack Developer</p>
                      <a href="https://dnstech.in" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline text-sm">dnstech.in</a>
                    </div>
                  </div>
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
                            {activeCategory === 'All' ? 'Popular Tools' : activeCategory === 'Favorites' ? 'Favorite Tools' : `${activeCategory} Tools`}
                        </h2>
                        <p className="text-slate-500 text-sm">Find the right utility for your workflow.</p>
                    </div>
                    
                    <div className="relative w-full md:w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input 
                            type="text" 
                            placeholder="Search tools..." 
                            value={searchQuery}
                            onChange={(e) => handleSearchChange(e.target.value)}
                            onFocus={() => setShowSearchSuggestions(searchQuery.length > 0)}
                            onBlur={() => setTimeout(() => setShowSearchSuggestions(false), 200)}
                            className="w-full pl-10 pr-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-full text-sm focus:ring-2 focus:ring-primary outline-none transition-all"
                        />
                        
                        {/* Search Suggestions for main search */}
                        {showSearchSuggestions && (
                          <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-xl z-50 max-h-80 overflow-y-auto">
                            {/* Matching Tools */}
                            {filteredTools.slice(0, 5).length > 0 && (
                              <div className="p-3 border-b border-slate-200 dark:border-slate-700">
                                <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Matching Tools</div>
                                {filteredTools.slice(0, 5).map((tool) => (
                                  <button
                                    key={tool.id}
                                    onClick={() => {
                                      handleToolClick(tool.id);
                                      setShowSearchSuggestions(false);
                                    }}
                                    className="w-full text-left px-3 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                                  >
                                    <div className="flex items-center gap-2">
                                      <tool.icon size={14} className="text-slate-400" />
                                      <span>{tool.name}</span>
                                    </div>
                                    <div className="text-xs text-slate-500 dark:text-slate-400 ml-6">{tool.description}</div>
                                  </button>
                                ))}
                              </div>
                            )}
                            
                            {/* Recent Searches */}
                            {recentSearches.length > 0 && (
                              <div className="p-3 border-b border-slate-200 dark:border-slate-700">
                                <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Recent Searches</div>
                                {recentSearches.map((search, index) => (
                                  <button
                                    key={index}
                                    onClick={() => selectSearchSuggestion(search)}
                                    className="w-full text-left px-3 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                                  >
                                    <div className="flex items-center gap-2">
                                      <Clock size={14} className="text-slate-400" />
                                      {search}
                                    </div>
                                  </button>
                                ))}
                              </div>
                            )}
                            
                            {/* Popular Categories */}
                            <div className="p-3">
                              <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Popular Categories</div>
                              {['Finance', 'Text', 'Developer', 'Design', 'Productivity'].map((category) => (
                                <button
                                  key={category}
                                  onClick={() => selectSearchSuggestion(category)}
                                  className="w-full text-left px-3 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                                >
                                  <div className="flex items-center gap-2">
                                    <Hash size={14} className="text-slate-400" />
                                    {category} Tools
                                  </div>
                                </button>
                              ))}
                            </div>
                          </div>
                        )}
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-fade-in">
                  {filteredTools.length === 0 && searchQuery !== '' ? (
                    <div className="col-span-full text-center py-20">
                      <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Search size={32} className="text-slate-400" />
                      </div>
                      <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-300 mb-2">No tools found</h3>
                      <p className="text-slate-500 dark:text-slate-400">Try adjusting your search terms or browse all categories</p>
                      <button
                        onClick={() => { setSearchQuery(''); setActiveCategory('All'); }}
                        className="mt-4 px-6 py-3 bg-primary hover:bg-primary-dark text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105"
                      >
                        View All Tools
                      </button>
                    </div>
                  ) : (
                    filteredTools.map((tool, index) => (
                      <div 
                        key={tool.id} 
                        onClick={() => handleToolClick(tool.id)}
                        style={{ animationDelay: `${index * 0.05}s` }}
                        className="group bg-white dark:bg-slate-900 rounded-2xl p-6 border-2 border-slate-200 dark:border-slate-800 shadow-lg hover:shadow-2xl hover:-translate-y-2 hover:border-blue-400 dark:hover:border-blue-600 transition-all duration-300 cursor-pointer relative overflow-hidden animate-fade-in"
                      >
                          {/* Favorite indicator */}
                          {favorites.has(tool.id) && (
                            <div className="absolute top-3 right-3 z-20">
                              <Star size={18} className="text-amber-500 fill-current drop-shadow-lg" />
                            </div>
                          )}

                          {/* Hover Gradient Background */}
                          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-indigo-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
                          
                          {/* Shine Effect */}
                          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                            <div className="absolute inset-0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12"></div>
                          </div>
                          
                          <div className="flex justify-between items-start mb-4 relative z-10">
                              <div className={`p-3.5 rounded-2xl transition-all duration-300 group-hover:scale-110 group-hover:rotate-6 shadow-lg group-hover:shadow-xl ${
                                tool.category === 'Finance' ? 'bg-gradient-to-br from-emerald-400 to-green-600 text-white' : 
                                tool.category === 'Text' ? 'bg-gradient-to-br from-blue-400 to-blue-600 text-white' : 
                                tool.category === 'Developer' ? 'bg-gradient-to-br from-purple-400 to-purple-600 text-white' : 
                                tool.category === 'Content' ? 'bg-gradient-to-br from-pink-400 to-pink-600 text-white' : 
                                tool.category === 'Image' ? 'bg-gradient-to-br from-indigo-400 to-indigo-600 text-white' : 
                                tool.category === 'PDF' ? 'bg-gradient-to-br from-red-400 to-red-600 text-white' : 
                                'bg-gradient-to-br from-amber-400 to-amber-600 text-white'
                              }`}>
                                  <tool.icon size={24} className="transition-transform duration-300 group-hover:scale-110" />
                              </div>
                              <div className="flex items-center gap-2">
                                  <button
                                    onClick={(e) => toggleFavorite(tool.id, e)}
                                    className={`p-2 rounded-xl transition-all duration-200 hover:scale-110 shadow-md ${
                                      favorites.has(tool.id)
                                        ? 'bg-gradient-to-br from-amber-400 to-yellow-500 text-white'
                                        : 'bg-slate-100 text-slate-400 dark:bg-slate-700 dark:text-slate-500 hover:bg-gradient-to-br hover:from-amber-100 hover:to-yellow-100 dark:hover:from-slate-600 dark:hover:to-slate-500'
                                    }`}
                                  >
                                    <Star size={14} className={favorites.has(tool.id) ? 'fill-current' : ''} />
                                  </button>
                                  {tool.popular && (
                                      <span className="px-3 py-1.5 bg-gradient-to-r from-orange-500 to-red-500 text-white text-[10px] font-bold uppercase rounded-full tracking-wide shadow-lg animate-pulse">🔥 Hot</span>
                                  )}
                                  {tool.isNew && (
                                      <span className="px-3 py-1.5 bg-gradient-to-r from-blue-500 to-cyan-500 text-white text-[10px] font-bold uppercase rounded-full tracking-wide shadow-lg">✨ New</span>
                                  )}
                              </div>
                          </div>
                          
                          <h3 className="font-bold text-lg text-slate-900 dark:text-slate-100 mb-2 relative z-10 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">{tool.name}</h3>
                          <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2 relative z-10 leading-relaxed">{tool.description}</p>
                          
                          {/* Arrow indicator on hover */}
                          <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0">
                            <div className="bg-blue-500 text-white rounded-full p-1.5 shadow-lg">
                              <ChevronRight size={18} />
                            </div>
                          </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          )}
          
          <footer className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-t border-slate-200/50 dark:border-slate-800/50 mt-16">
             <div className="max-w-7xl mx-auto px-4 lg:px-8 py-12">
               <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                 <div className="md:col-span-2">
                   <button onClick={() => navigateToPage('home')} className="flex items-center gap-3 mb-4 cursor-pointer hover:scale-105 hover:drop-shadow-lg transition-all duration-200 group" title="Go to Homepage">
                     <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/30 group-hover:shadow-2xl">
                       <Settings className="text-white" size={24} />
                     </div>
                     <div>
                       <h3 className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent group-hover:from-indigo-700 group-hover:to-purple-700 transition-all">ToolSphere</h3>
                       <p className="text-sm text-slate-500 dark:text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300 transition-colors">Complete Toolkit for Everyone</p>
                     </div>
                   </button>
                   <p className="text-slate-600 dark:text-slate-300 mb-6 leading-relaxed">
                     Your comprehensive toolkit featuring 72+ professional tools across 20 categories. 
                     All tools are free, privacy-focused, and work entirely in your browser.
                   </p>
                   <div className="flex gap-4">
                     <button className="p-2 bg-slate-100 dark:bg-slate-800 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-700 transition-all duration-200 hover:scale-110">
                       <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/></svg>
                     </button>
                     <button className="p-2 bg-slate-100 dark:bg-slate-800 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-700 transition-all duration-200 hover:scale-110">
                       <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z"/></svg>
                     </button>
                     <button className="p-2 bg-slate-100 dark:bg-slate-800 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-700 transition-all duration-200 hover:scale-110">
                       <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                     </button>
                   </div>
                 </div>
                 
                 <div>
                   <h4 className="font-semibold text-slate-900 dark:text-slate-100 mb-4">Categories</h4>
                   <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
                     <li><button onClick={() => { setActiveCategory('Finance'); setActivePage('home'); }} className="hover:text-primary transition-colors">Finance Tools</button></li>
                     <li><button onClick={() => { setActiveCategory('Text'); setActivePage('home'); }} className="hover:text-primary transition-colors">AI Text Tools</button></li>
                     <li><button onClick={() => { setActiveCategory('Developer'); setActivePage('home'); }} className="hover:text-primary transition-colors">Developer Tools</button></li>
                     <li><button onClick={() => { setActiveCategory('Design'); setActivePage('home'); }} className="hover:text-primary transition-colors">Design Tools</button></li>
                     <li><button onClick={() => { setActiveCategory('Productivity'); setActivePage('home'); }} className="hover:text-primary transition-colors">Productivity</button></li>
                   </ul>
                 </div>
                 
                 <div>
                   <h4 className="font-semibold text-slate-900 dark:text-slate-100 mb-4">Support</h4>
                   <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
                     <li><button onClick={() => navigateToPage('how-to-use')} className="hover:text-primary transition-colors">How to Use</button></li>
                     <li><button onClick={() => navigateToPage('privacy')} className="hover:text-primary transition-colors">Privacy Policy</button></li>
                     <li><button onClick={() => navigateToPage('terms')} className="hover:text-primary transition-colors">Terms of Service</button></li>
                     <li><button onClick={() => navigateToPage('contact')} className="hover:text-primary transition-colors">Contact Us</button></li>
                   </ul>
                 </div>
               </div>
               
               <div className="border-t border-slate-200/50 dark:border-slate-800/50 mt-8 pt-8 text-center">
                 <p className="text-sm text-slate-500 dark:text-slate-400">
                   &copy; 2024 ToolSphere. Built with ❤️ using React & TypeScript. All rights reserved.
                 </p>
                 <p className="text-xs text-slate-400 dark:text-slate-500 mt-2">
                   Developed by <a href="https://dnstech.in" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline font-medium">dnstech.in</a>
                 </p>
               </div>
             </div>
          </footer>

        </main>
      </div>

      {/* Toast Notification */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 animate-fade-in">
          <div className={`flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg backdrop-blur-xl border ${
            toast.type === 'success'
              ? 'bg-green-500/90 text-white border-green-400/50'
              : 'bg-blue-500/90 text-white border-blue-400/50'
          }`}>
            {toast.type === 'success' ? (
              <Star size={20} className="text-white" />
            ) : (
              <Hash size={20} className="text-white" />
            )}
            <span className="text-sm font-medium">{toast.message}</span>
            <button
              onClick={() => setToast(null)}
              className="ml-2 p-1 hover:bg-white/20 rounded-lg transition-colors"
            >
              <X size={16} />
            </button>
          </div>
        </div>
      )}

      {/* Usage Guide Component */}
      <UsageGuide toolId={activeToolId || undefined} />

      {/* Auth Modal */}
      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
    </div>
  );
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};

export default App;