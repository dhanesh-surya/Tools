import React, { useState } from 'react';
import { HelpCircle, X, BookOpen, Lightbulb, CheckCircle, ArrowRight } from 'lucide-react';

interface ToolGuide {
  toolId: string;
  toolName: string;
  description: string;
  steps: string[];
  tips: string[];
  useCases: string[];
}

const TOOL_GUIDES: ToolGuide[] = [
  {
    toolId: 't1',
    toolName: 'Income Tax Calculator',
    description: 'Calculate your annual income tax liability based on Indian tax slabs.',
    steps: [
      'Enter your annual gross income in the "Annual Income" field',
      'Select your age category (Below 60, 60-80, or Above 80)',
      'Choose the appropriate financial year',
      'Click "Calculate Tax" to see your tax breakdown',
      'View detailed tax slab information and total tax payable'
    ],
    tips: [
      'Include all sources of income (salary, business, capital gains, etc.)',
      'Consider deductions under Section 80C, 80D for accurate calculation',
      'Senior citizens get higher tax exemption limits',
      'Keep investment proofs handy for tax filing'
    ],
    useCases: [
      'Salary planning and negotiation',
      'Annual tax liability estimation',
      'Investment planning to optimize tax',
      'Freelancers calculating advance tax'
    ]
  },
  {
    toolId: 't2',
    toolName: 'Loan EMI Calculator',
    description: 'Calculate Equated Monthly Installments (EMI) for loans with detailed amortization.',
    steps: [
      'Enter the loan principal amount',
      'Input the annual interest rate (%)',
      'Specify the loan tenure in years',
      'Click "Calculate EMI" to see monthly payment',
      'Review the amortization schedule showing principal vs interest breakdown'
    ],
    tips: [
      'Lower interest rates significantly reduce total interest paid',
      'Shorter tenure means higher EMI but less total interest',
      'Consider prepayment options to reduce loan burden',
      'Compare offers from multiple banks before finalizing'
    ],
    useCases: [
      'Home loan planning',
      'Car loan calculations',
      'Personal loan comparisons',
      'Business loan affordability check'
    ]
  },
  {
    toolId: 't8',
    toolName: 'QR Code Generator',
    description: 'Create QR codes for URLs, text, contact info, WiFi credentials, and more.',
    steps: [
      'Select the type of content (URL, Text, WiFi, Contact)',
      'Enter the content you want to encode',
      'Adjust QR code size and error correction level',
      'Preview the generated QR code',
      'Download as PNG or SVG format'
    ],
    tips: [
      'Use high error correction for QR codes that might get damaged',
      'Test QR codes with multiple devices before printing',
      'For WiFi sharing, use WPA/WPA2 encryption',
      'Include https:// for URL QR codes for better security'
    ],
    useCases: [
      'Business card contact sharing',
      'WiFi guest network access',
      'Product packaging with website links',
      'Event registration and ticketing',
      'Restaurant menu digital access'
    ]
  },
  {
    toolId: 't10',
    toolName: 'Unit Converter',
    description: 'Convert between different units of measurement for length, weight, temperature, and volume.',
    steps: [
      'Select the category (Length, Weight, Temperature, Volume)',
      'Enter the value you want to convert',
      'Choose the "From" unit',
      'Select the "To" unit',
      'See the instant conversion result'
    ],
    tips: [
      'Common conversions: 1 inch = 2.54 cm, 1 kg = 2.205 lbs',
      'Temperature: Celsius to Fahrenheit = (°C × 9/5) + 32',
      'Volume: 1 liter = 1000 milliliters = 33.814 fluid ounces',
      'Double-check unit abbreviations (lb vs lbs, oz vs fl oz)'
    ],
    useCases: [
      'Cooking recipe conversions',
      'International shipping weight calculations',
      'Scientific measurements and lab work',
      'Construction and engineering projects',
      'Travel planning (miles to kilometers)'
    ]
  },
  {
    toolId: 't28',
    toolName: 'HTML Formatter',
    description: 'Beautify and properly indent HTML code for better readability.',
    steps: [
      'Paste your minified or unformatted HTML code',
      'Click "Format HTML" button',
      'View the properly indented output',
      'Copy the formatted code',
      'Use in your projects or documentation'
    ],
    tips: [
      'Use formatted HTML for better code reviews',
      'Helps identify unclosed tags and structure issues',
      'Improves team collaboration and code maintenance',
      'Great for debugging complex nested structures'
    ],
    useCases: [
      'Cleaning up minified HTML from production',
      'Making email templates more readable',
      'Code review and documentation',
      'Teaching and learning HTML structure',
      'Debugging nested component layouts'
    ]
  },
  {
    toolId: 't30',
    toolName: 'CSS Gradient Generator',
    description: 'Create beautiful CSS gradients visually with live preview.',
    steps: [
      'Choose gradient type (Linear or Radial)',
      'For linear: Adjust the angle slider (0-360°)',
      'Select first color using color picker',
      'Select second color using color picker',
      'Preview gradient in real-time',
      'Copy the generated CSS code'
    ],
    tips: [
      'Popular angles: 0° (bottom to top), 90° (left to right), 180° (top to bottom)',
      'Use complementary colors for vibrant gradients',
      'Subtle gradients (similar colors) work best for backgrounds',
      'Test gradients on both light and dark content',
      'Add more color stops by editing CSS for complex gradients'
    ],
    useCases: [
      'Website background designs',
      'Button and card styling',
      'Hero section backgrounds',
      'Brand identity elements',
      'UI component highlights'
    ]
  },
  {
    toolId: 't33',
    toolName: 'Meta Tag Generator',
    description: 'Generate SEO-optimized meta tags for better search engine visibility.',
    steps: [
      'Enter your page title (50-60 characters recommended)',
      'Write a compelling meta description (150-160 characters)',
      'Add relevant keywords separated by commas',
      'Input your website URL',
      'Upload Open Graph image for social media',
      'Copy all generated meta tags to your HTML <head>'
    ],
    tips: [
      'Include primary keyword in title and description',
      'Make titles unique for each page',
      'Write descriptions that encourage clicks',
      'Use action words and benefits in descriptions',
      'Update meta tags when content changes significantly'
    ],
    useCases: [
      'New website launch SEO setup',
      'Blog post optimization',
      'E-commerce product pages',
      'Landing page optimization',
      'Social media sharing optimization'
    ]
  },
  {
    toolId: 't41',
    toolName: 'Crypto Profit Calculator',
    description: 'Calculate cryptocurrency trading profits, losses, and ROI percentage.',
    steps: [
      'Enter the amount of cryptocurrency purchased',
      'Input the buying price per coin',
      'Enter the current/selling price per coin',
      'Add any transaction fees (optional)',
      'View profit/loss amount and percentage',
      'See detailed breakdown of investment and returns'
    ],
    tips: [
      'Always include trading fees for accurate calculations',
      'Consider tax implications on crypto gains',
      'Track multiple trades in a spreadsheet',
      'Set profit targets before investing',
      'Don\'t forget to account for network gas fees'
    ],
    useCases: [
      'Day trading profit tracking',
      'Long-term investment ROI calculation',
      'Portfolio performance analysis',
      'Tax reporting preparation',
      'Trading strategy evaluation'
    ]
  },
  {
    toolId: 't53',
    toolName: 'Password Generator',
    description: 'Generate cryptographically secure passwords with customizable options.',
    steps: [
      'Set desired password length (12-32 recommended)',
      'Enable uppercase letters (A-Z)',
      'Enable lowercase letters (a-z)',
      'Include numbers (0-9)',
      'Add special characters (!@#$%^&*)',
      'Click "Generate" for instant secure password',
      'Copy and save in a password manager'
    ],
    tips: [
      'Minimum 12 characters for good security',
      '16+ characters for high-security accounts',
      'Never reuse passwords across sites',
      'Use a password manager to store them',
      'Enable two-factor authentication (2FA) additionally',
      'Change passwords every 3-6 months for sensitive accounts'
    ],
    useCases: [
      'Creating new account passwords',
      'Updating compromised passwords',
      'Corporate IT password policies',
      'Secure WiFi password generation',
      'Database and server access credentials'
    ]
  },
  {
    toolId: 't51',
    toolName: 'Data Visualizer',
    description: 'Create beautiful charts and graphs from your data instantly.',
    steps: [
      'Choose chart type (Bar, Line, Pie, Scatter)',
      'Enter your data (comma-separated values)',
      'Add labels for each data point',
      'Customize colors and styling',
      'Preview the generated chart',
      'Download as image or copy embed code'
    ],
    tips: [
      'Bar charts: Best for comparing categories',
      'Line charts: Great for trends over time',
      'Pie charts: Use for percentage breakdowns',
      'Scatter plots: Show correlation between variables',
      'Keep charts simple with 5-7 data points for clarity'
    ],
    useCases: [
      'Business presentations and reports',
      'Research paper visualizations',
      'Marketing campaign performance',
      'Sales data analysis',
      'Student projects and assignments'
    ]
  }
];

interface UsageGuideProps {
  toolId?: string;
}

const UsageGuide: React.FC<UsageGuideProps> = ({ toolId }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedGuide, setSelectedGuide] = useState<ToolGuide | null>(null);

  React.useEffect(() => {
    if (toolId) {
      const guide = TOOL_GUIDES.find(g => g.toolId === toolId);
      if (guide) {
        setSelectedGuide(guide);
        setIsOpen(true);
      }
    }
  }, [toolId]);

  if (!isOpen || !selectedGuide) {
    return (
      <button
        onClick={() => {
          if (toolId) {
            const guide = TOOL_GUIDES.find(g => g.toolId === toolId);
            if (guide) {
              setSelectedGuide(guide);
              setIsOpen(true);
            }
          }
        }}
        className="fixed bottom-6 right-6 bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition-all hover:scale-110 z-40"
        title="Usage Guide"
      >
        <HelpCircle size={24} />
      </button>
    );
  }

  return (
    <>
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50" onClick={() => setIsOpen(false)} />
      <div className="fixed inset-y-0 right-0 w-full md:w-2/3 lg:w-1/2 bg-white dark:bg-slate-900 shadow-2xl z-50 overflow-y-auto">
        <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-purple-600 p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <BookOpen size={28} className="text-white" />
            <div>
              <h2 className="text-2xl font-bold text-white">{selectedGuide.toolName}</h2>
              <p className="text-blue-100">Complete Usage Guide</p>
            </div>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="p-2 hover:bg-white/20 rounded-lg transition-all"
          >
            <X size={24} className="text-white" />
          </button>
        </div>

        <div className="p-6 space-y-8">
          {/* Description */}
          <div className="bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-600 p-4 rounded-r-lg">
            <p className="text-slate-700 dark:text-slate-300 text-lg">{selectedGuide.description}</p>
          </div>

          {/* Steps */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <CheckCircle className="text-green-600" size={24} />
              <h3 className="text-xl font-bold text-slate-800 dark:text-white">Step-by-Step Instructions</h3>
            </div>
            <div className="space-y-3">
              {selectedGuide.steps.map((step, index) => (
                <div key={index} className="flex gap-3 items-start">
                  <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
                    {index + 1}
                  </div>
                  <p className="text-slate-700 dark:text-slate-300 pt-1">{step}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Tips */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Lightbulb className="text-yellow-600" size={24} />
              <h3 className="text-xl font-bold text-slate-800 dark:text-white">Pro Tips</h3>
            </div>
            <div className="space-y-2">
              {selectedGuide.tips.map((tip, index) => (
                <div key={index} className="flex gap-2 items-start bg-yellow-50 dark:bg-yellow-900/20 p-3 rounded-lg">
                  <ArrowRight className="text-yellow-600 flex-shrink-0 mt-0.5" size={18} />
                  <p className="text-slate-700 dark:text-slate-300 text-sm">{tip}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Use Cases */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <BookOpen className="text-purple-600" size={24} />
              <h3 className="text-xl font-bold text-slate-800 dark:text-white">Common Use Cases</h3>
            </div>
            <div className="grid gap-2">
              {selectedGuide.useCases.map((useCase, index) => (
                <div key={index} className="bg-purple-50 dark:bg-purple-900/20 p-3 rounded-lg border border-purple-200 dark:border-purple-800">
                  <p className="text-slate-700 dark:text-slate-300">✓ {useCase}</p>
                </div>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 rounded-xl text-center">
            <p className="text-white text-lg font-medium mb-3">Ready to use this tool?</p>
            <button
              onClick={() => setIsOpen(false)}
              className="bg-white text-blue-600 px-6 py-3 rounded-lg font-bold hover:bg-blue-50 transition-all"
            >
              Start Using {selectedGuide.toolName}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default UsageGuide;
