import React, { useState } from 'react';
import { ArrowRightLeft, Copy, Download, RotateCcw, FileText, Globe, Check } from 'lucide-react';

interface FontMapping {
  name: string;
  description: string;
  sample: string;
}

const FONT_MAPPINGS: FontMapping[] = [
  {
    name: 'KrutiDev to Unicode',
    description: 'Convert KrutiDev font to Unicode (Devanagari)',
    sample: 'नमस्ते'
  },
  {
    name: 'Unicode to KrutiDev',
    description: 'Convert Unicode to KrutiDev font',
    sample: 'यूनिकोड टेक्स्ट'
  },
  {
    name: 'Preeti to Unicode',
    description: 'Convert Preeti (Nepali) font to Unicode',
    sample: 'नमस्कार'
  },
  {
    name: 'Unicode to Preeti',
    description: 'Convert Unicode to Preeti (Nepali) font',
    sample: 'युनिकोड पाठ'
  }
];

// Comprehensive KrutiDev to Unicode mapping
const KRUTI_TO_UNICODE_MAP: { [key: string]: string } = (() => {
  const m: { [key: string]: string } = {};

  // Matras (Vowel signs)
  m['v'] = 'ा'; m['w'] = 'ी'; m['x'] = 'ु'; m['X'] = 'ू';
  m['s'] = 'े'; m['S'] = 'ै'; m['k'] = 'ो'; m['K'] = 'ौ';
  m['M'] = 'ं'; m['a'] = 'ँ'; m['`'] = '्';

  // Vowels
  m['Q'] = 'ऊ'; m['W'] = 'ई'; m['O'] = 'ओ';

  // Consonants
  m['d'] = 'क'; m['D'] = 'ख'; m['x'] = 'ग'; m['?'] = 'घ';
  m['p'] = 'च'; m['P'] = 'छ'; m['T'] = 'ज'; m['V'] = 'झ';
  m['B'] = 'ठ'; m['"'] = 'ढ'; m['='] = 'ण';
  m['r'] = 'त'; m['R'] = 'थ'; m['n'] = 'द'; m['N'] = 'ध'; m['u'] = 'न';
  m['i'] = 'प'; m['I'] = 'फ'; m['c'] = 'ब'; m['C'] = 'भ'; m['e'] = 'म';
  m[';'] = 'य'; m['j'] = 'र'; m['y'] = 'ल'; m['Y'] = 'व';
  m['z'] = 'श'; m['Z'] = 'ष'; m['l'] = 'स'; m['g'] = 'ह';

  // Numerals  
  m['0'] = '०'; m['1'] = '१'; m['2'] = '२'; m['3'] = '३'; m['4'] = '४';
  m['5'] = '५'; m['6'] = '६'; m['7'] = '७'; m['8'] = '८'; m['9'] = '९';

  return m;
})();

// Unicode to KrutiDev mapping
const UNICODE_TO_KRUTI_MAP: { [key: string]: string } = (() => {
  const m: { [key: string]: string } = {};

  // Vowels
  m['अ'] = 'v'; m['आ'] = 'vk'; m['इ'] = 'b'; m['ई'] = 'bZ';
  m['उ'] = 'mQ'; m['ऊ'] = 'Q'; m['ऋ'] = '_'; m['ए'] = 'Q';
  m['ऐ'] = 'S'; m['ओ'] = 'O'; m['औ'] = 'qq';

  // Matras
  m['ा'] = 'k'; m['ि'] = 'i'; m['ी'] = 'h'; m['ु'] = 'q'; m['ू'] = 'w';
  m['े'] = 's'; m['ै'] = 'S'; m['ो'] = 'ks'; m['ौ'] = 'kS';
  m['ं'] = 'a'; m['ः'] = ':'; m['ँ'] = '¡'; m['्'] = '`';

  // Consonants
  m['क'] = 'd'; m['ख'] = '[k'; m['ग'] = 'x'; m['घ'] = '?';
  m['च'] = 'p'; m['छ'] = 'N'; m['ज'] = 't'; m['झ'] = '>k';
  m['ट'] = 'V'; m['ठ'] = 'B'; m['ड'] = 'M'; m['ढ'] = '<';
  m['त'] = 'r'; m['थ'] = 'Fk'; m['द'] = 'n'; m['ध'] = '/k'; m['न'] = 'u';
  m['प'] = 'i'; m['फ'] = 'Q'; m['ब'] = 'c'; m['भ'] = 'Hk'; m['म'] = 'e';
  m['य'] = ';'; m['र'] = 'j'; m['ल'] = 'y'; m['व'] = 'o';
  m['श'] = 'z'; m['ष'] = 'k'; m['स'] = 'l'; m['ह'] = 'g';

  // Numerals
  m['०'] = '0'; m['१'] = '1'; m['२'] = '2'; m['३'] = '3'; m['४'] = '4';
  m['५'] = '5'; m['६'] = '6'; m['७'] = '7'; m['८'] = '8'; m['९'] = '9';

  return m;
})();

// Preeti to Unicode mapping for Nepali
const PREETI_TO_UNICODE_MAP: { [key: string]: string } = (() => {
  const m: { [key: string]: string } = {};

  // Vowels
  m['a'] = 'अ'; m['f'] = 'आ'; m['i'] = 'इ'; m['O'] = 'ई';
  m['u'] = 'उ'; m['pm'] = 'ऊ';
  m['P'] = 'ए'; m['cf]'] = 'ओ'; m['cf}'] = 'औ';

  // Matras
  m['L'] = 'ि'; m[']'] = 'ु'; m['o'] = 'ू';
  m['M'] = 'े'; m['f]'] = 'ो'; m['f}'] = 'ौ';

  // Anusvara and Visarga
  m['+'] = 'ं'; m['M'] = 'ः'; m['F'] = 'ँ';

  // Consonants
  m['k'] = 'क'; m['v'] = 'ख'; m['u'] = 'ग'; m['}'] = 'घ';
  m['r'] = 'च'; m['R'] = 'छ'; m['h'] = 'ज';
  m['t'] = 'त'; m['y'] = 'थ'; m['b'] = 'द'; m['w'] = 'ध'; m['g'] = 'न';
  m['km'] = 'फ'; m['a'] = 'ब'; m['e'] = 'भ'; m['d'] = 'म';
  m['l'] = 'र'; m['n'] = 'ल'; m['j'] = 'व';
  m['z'] = 'श'; m['x'] = 'ह';

  // Numerals
  m['@'] = '०'; m['!'] = '१'; m['#'] = '२'; m['$'] = '३'; m['%'] = '४';
  m['^'] = '५'; m['*'] = '७';

  return m;
})();

// Unicode to Preeti mapping
const UNICODE_TO_PREETI_MAP: { [key: string]: string } = (() => {
  const m: { [key: string]: string } = {};

  // Vowels
  m['अ'] = 'a'; m['आ'] = 'f'; m['इ'] = 'O'; m['ई'] = 'OL';
  m['उ'] = 'p'; m['ऊ'] = 'pm';
  m['ए'] = 'P'; m['ओ'] = 'cf]'; m['औ'] = 'cf}';

  // Matras
  m['ा'] = 'f'; m['ि'] = 'L'; m['ु'] = ']'; m['ू'] = 'o';
  m['े'] = 'M'; m['ो'] = 'f]'; m['ौ'] = 'f}';

  // Anusvara and Visarga
  m['ं'] = '+'; m['ः'] = 'M'; m['ँ'] = 'F';

  // Consonants
  m['क'] = 'o'; m['ख'] = 'v'; m['ग'] = 'u'; m['घ'] = 'u}';
  m['च'] = 'r'; m['छ'] = 'R'; m['ज'] = 'h';
  m['त'] = 't'; m['थ'] = 'y'; m['द'] = 'b'; m['ध'] = 'w'; m['न'] = 'g';
  m['प'] = 'k'; m['फ'] = 'km'; m['ब'] = 'a'; m['भ'] = 'e'; m['म'] = 'd';
  m['र'] = 'l'; m['ल'] = 'n'; m['व'] = 'j';
  m['श'] = 'z'; m['ह'] = 'x';
  m['्'] = '}';

  // Numerals
  m['०'] = '@'; m['१'] = '!'; m['२'] = '@'; m['३'] = '#'; m['४'] = '$';
  m['५'] = '%'; m['७'] = '*';

  return m;
})();

export const UnicodeConverter: React.FC = () => {
  const [selectedConversion, setSelectedConversion] = useState(0);
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');
  const [isConverting, setIsConverting] = useState(false);
  const [copied, setCopied] = useState(false);

  const convertText = async () => {
    if (!inputText.trim()) {
      setOutputText('');
      return;
    }

    setIsConverting(true);

    // Simulate conversion delay for better UX
    await new Promise(resolve => setTimeout(resolve, 300));

    let result = '';

    switch (selectedConversion) {
      case 0: // KrutiDev to Unicode
        result = convertKrutiToUnicode(inputText);
        break;
      case 1: // Unicode to KrutiDev
        result = convertUnicodeToKruti(inputText);
        break;
      case 2: // Preeti to Unicode
        result = convertPreetiToUnicode(inputText);
        break;
      case 3: // Unicode to Preeti
        result = convertUnicodeToPreeti(inputText);
        break;
      default:
        result = inputText;
    }

    setOutputText(result);
    setIsConverting(false);
  };

  const convertKrutiToUnicode = (text: string): string => {
    let result = text;

    // Sort keys by length (longer keys first) to handle multi-character mappings
    const sortedKeys = Object.keys(KRUTI_TO_UNICODE_MAP).sort((a, b) => b.length - a.length);

    sortedKeys.forEach(key => {
      const regex = new RegExp(escapeRegExp(key), 'g');
      result = result.replace(regex, KRUTI_TO_UNICODE_MAP[key]);
    });

    return result;
  };

  const convertUnicodeToKruti = (text: string): string => {
    let result = text;

    // Sort keys by length (longer keys first) to handle multi-character mappings
    const sortedKeys = Object.keys(UNICODE_TO_KRUTI_MAP).sort((a, b) => b.length - a.length);

    sortedKeys.forEach(key => {
      const regex = new RegExp(escapeRegExp(key), 'g');
      result = result.replace(regex, UNICODE_TO_KRUTI_MAP[key]);
    });

    return result;
  };

  const convertPreetiToUnicode = (text: string): string => {
    let result = text;

    // Sort keys by length (longer keys first) to handle multi-character mappings
    const sortedKeys = Object.keys(PREETI_TO_UNICODE_MAP).sort((a, b) => b.length - a.length);

    sortedKeys.forEach(key => {
      const regex = new RegExp(escapeRegExp(key), 'g');
      result = result.replace(regex, PREETI_TO_UNICODE_MAP[key]);
    });

    return result;
  };

  const convertUnicodeToPreeti = (text: string): string => {
    let result = text;

    // Sort keys by length (longer keys first) to handle multi-character mappings
    const sortedKeys = Object.keys(UNICODE_TO_PREETI_MAP).sort((a, b) => b.length - a.length);

    sortedKeys.forEach(key => {
      const regex = new RegExp(escapeRegExp(key), 'g');
      result = result.replace(regex, UNICODE_TO_PREETI_MAP[key]);
    });

    return result;
  };

  // Helper function to escape special regex characters
  const escapeRegExp = (string: string): string => {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
      alert('Failed to copy to clipboard');
    }
  };

  const downloadAsText = () => {
    const element = document.createElement('a');
    const file = new Blob([outputText], { type: 'text/plain;charset=utf-8' });
    element.href = URL.createObjectURL(file);
    element.download = `converted-text-${Date.now()}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const clearAll = () => {
    setInputText('');
    setOutputText('');
  };

  const swapTexts = () => {
    const temp = inputText;
    setInputText(outputText);
    setOutputText(temp);

    // Swap conversion direction
    if (selectedConversion === 0) setSelectedConversion(1);
    else if (selectedConversion === 1) setSelectedConversion(0);
    else if (selectedConversion === 2) setSelectedConversion(3);
    else if (selectedConversion === 3) setSelectedConversion(2);
  };

  React.useEffect(() => {
    if (inputText) {
      convertText();
    } else {
      setOutputText('');
    }
  }, [inputText, selectedConversion]);

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-3">
          <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl shadow-lg">
            <Globe className="w-10 h-10 text-white" />
          </div>
        </div>
        <h1 className="text-4xl font-bold text-slate-900 dark:text-slate-100">
          Unicode Converter
        </h1>
        <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
          Convert between various Indian language fonts (KrutiDev, Preeti) and Unicode.
          Perfect for documents, websites, and cross-platform compatibility.
        </p>
      </div>

      {/* Conversion Type Selector */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-6">
        <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-4">
          Select Conversion Type
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {FONT_MAPPINGS.map((mapping, index) => (
            <button
              key={index}
              onClick={() => setSelectedConversion(index)}
              className={`p-4 rounded-xl border-2 transition-all duration-200 text-left hover:scale-105 ${selectedConversion === index
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30 shadow-lg'
                  : 'border-slate-200 dark:border-slate-700 hover:border-blue-300 dark:hover:border-blue-600'
                }`}
            >
              <div className="flex items-center gap-2 mb-2">
                <ArrowRightLeft className={`w-5 h-5 ${selectedConversion === index ? 'text-blue-600 dark:text-blue-400' : 'text-slate-400'}`} />
                <h3 className={`font-semibold ${selectedConversion === index ? 'text-blue-900 dark:text-blue-100' : 'text-slate-900 dark:text-slate-100'}`}>
                  {mapping.name}
                </h3>
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">
                {mapping.description}
              </p>
              <div className="text-xs bg-slate-100 dark:bg-slate-700 px-3 py-1.5 rounded-lg font-medium">
                Sample: <span className="font-semibold">{mapping.sample}</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Conversion Interface */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Section */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <FileText className="w-5 h-5 text-blue-600" />
              {FONT_MAPPINGS[selectedConversion].name.split(' to ')[0]} Text
            </h3>
            <button
              onClick={clearAll}
              className="flex items-center gap-2 px-3 py-2 text-sm bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 rounded-lg transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              Clear
            </button>
          </div>
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder={`Enter ${FONT_MAPPINGS[selectedConversion].name.split(' to ')[0]} text here...`}
            className="w-full h-64 p-4 border-2 border-slate-300 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 resize-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
            style={{ fontSize: '16px', lineHeight: '1.6' }}
          />
          <div className="mt-4 flex items-center justify-between text-sm text-slate-500 dark:text-slate-400">
            <span className="font-medium">{inputText.length} characters</span>
            <button
              onClick={() => copyToClipboard(inputText)}
              disabled={!inputText}
              className="flex items-center gap-1 hover:text-blue-600 dark:hover:text-blue-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Copy className="w-4 h-4" />
              Copy Input
            </button>
          </div>
        </div>

        {/* Output Section */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <FileText className="w-5 h-5 text-purple-600" />
              {FONT_MAPPINGS[selectedConversion].name.split(' to ')[1]} Text
            </h3>
            <div className="flex gap-2">
              <button
                onClick={() => copyToClipboard(outputText)}
                disabled={!outputText}
                className={`flex items-center gap-2 px-3 py-2 text-sm rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed ${copied
                    ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300'
                    : 'bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600'
                  }`}
              >
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                {copied ? 'Copied!' : 'Copy'}
              </button>
              <button
                onClick={downloadAsText}
                disabled={!outputText}
                className="flex items-center gap-2 px-3 py-2 text-sm bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
              >
                <Download className="w-4 h-4" />
                Download
              </button>
            </div>
          </div>
          <div className="w-full h-64 p-4 border-2 border-slate-300 dark:border-slate-600 rounded-xl bg-slate-50 dark:bg-slate-900/50 text-slate-900 dark:text-slate-100 overflow-auto">
            {isConverting ? (
              <div className="flex items-center justify-center h-full">
                <div className="flex flex-col items-center gap-3">
                  <div className="animate-spin rounded-full h-10 w-10 border-4 border-blue-200 border-t-blue-600"></div>
                  <span className="text-sm text-slate-500">Converting...</span>
                </div>
              </div>
            ) : (
              <pre className="whitespace-pre-wrap font-mono text-base leading-relaxed">
                {outputText || 'Converted text will appear here...'}
              </pre>
            )}
          </div>
          <div className="mt-4 flex items-center justify-between text-sm text-slate-500 dark:text-slate-400">
            <span className="font-medium">{outputText.length} characters</span>
            <button
              onClick={swapTexts}
              disabled={!outputText}
              className="flex items-center gap-2 hover:text-blue-600 dark:hover:text-blue-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ArrowRightLeft className="w-4 h-4" />
              Swap
            </button>
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-slate-800 dark:to-slate-900 rounded-2xl border border-blue-200 dark:border-slate-700 p-6">
        <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-4">
          ✨ Key Features
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-start gap-3 bg-white dark:bg-slate-800 p-4 rounded-xl">
            <ArrowRightLeft className="w-6 h-6 text-blue-600 mt-1 flex-shrink-0" />
            <div>
              <h4 className="font-semibold text-slate-900 dark:text-slate-100 mb-1">Bidirectional Conversion</h4>
              <p className="text-sm text-slate-600 dark:text-slate-400">Convert both ways between Unicode and legacy fonts</p>
            </div>
          </div>
          <div className="flex items-start gap-3 bg-white dark:bg-slate-800 p-4 rounded-xl">
            <Copy className="w-6 h-6 text-purple-600 mt-1 flex-shrink-0" />
            <div>
              <h4 className="font-semibold text-slate-900 dark:text-slate-100 mb-1">Easy Copy & Download</h4>
              <p className="text-sm text-slate-600 dark:text-slate-400">One-click copy and download as text file</p>
            </div>
          </div>
          <div className="flex items-start gap-3 bg-white dark:bg-slate-800 p-4 rounded-xl">
            <Globe className="w-6 h-6 text-green-600 mt-1 flex-shrink-0" />
            <div>
              <h4 className="font-semibold text-slate-900 dark:text-slate-100 mb-1">Universal Compatibility</h4>
              <p className="text-sm text-slate-600 dark:text-slate-400">Works seamlessly across all platforms</p>
            </div>
          </div>
        </div>
      </div>

      {/* Usage Instructions */}
      <div className="bg-blue-50 dark:bg-blue-900/20 rounded-2xl border border-blue-200 dark:border-blue-800 p-6">
        <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-3 flex items-center gap-2">
          <FileText className="w-5 h-5" />
          How to Use
        </h3>
        <ol className="list-decimal list-inside space-y-2 text-blue-800 dark:text-blue-200">
          <li className="pl-2">Select your desired conversion type from the options above</li>
          <li className="pl-2">Paste or type your text in the input box on the left</li>
          <li className="pl-2">The converted text appears automatically in the output box</li>
          <li className="pl-2">Copy the result to clipboard or download it as a text file</li>
          <li className="pl-2">Use the "Swap" button to reverse the conversion direction</li>
        </ol>
      </div>
    </div>
  );
};

export default UnicodeConverter;