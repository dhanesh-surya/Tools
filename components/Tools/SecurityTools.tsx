import React, { useState } from 'react';
import { Shield, Copy, Check, HelpCircle, Eye, EyeOff, RefreshCw } from 'lucide-react';

type SecurityTab = 'PASSWORD_GEN' | 'PASSWORD_STRENGTH' | 'ENCRYPTION' | 'SSL_CHECK';

const SecurityTools: React.FC = () => {
  const [activeTab, setActiveTab] = useState<SecurityTab>('PASSWORD_GEN');
  const [copied, setCopied] = useState(false);

  // Password Generator State
  const [passwordLength, setPasswordLength] = useState(16);
  const [includeUppercase, setIncludeUppercase] = useState(true);
  const [includeLowercase, setIncludeLowercase] = useState(true);
  const [includeNumbers, setIncludeNumbers] = useState(true);
  const [includeSymbols, setIncludeSymbols] = useState(true);
  const [generatedPassword, setGeneratedPassword] = useState('');
  const [showPassword, setShowPassword] = useState(true);

  // Password Strength State
  const [testPassword, setTestPassword] = useState('');
  const [strength, setStrength] = useState({ score: 0, level: 'Weak', color: 'red', feedback: [] as string[] });

  // Encryption State
  const [encryptMode, setEncryptMode] = useState<'encrypt' | 'decrypt'>('encrypt');
  const [plainText, setPlainText] = useState('');
  const [encryptionKey, setEncryptionKey] = useState('');
  const [encryptedText, setEncryptedText] = useState('');

  // SSL Checker State
  const [sslDomain, setSslDomain] = useState('');
  const [sslResult, setSslResult] = useState({ valid: false, issuer: '', expiry: '', message: '' });

  // Generate Password
  const generatePassword = () => {
    const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const lowercase = 'abcdefghijklmnopqrstuvwxyz';
    const numbers = '0123456789';
    const symbols = '!@#$%^&*()_+-=[]{}|;:,.<>?';
    
    let charset = '';
    if (includeUppercase) charset += uppercase;
    if (includeLowercase) charset += lowercase;
    if (includeNumbers) charset += numbers;
    if (includeSymbols) charset += symbols;
    
    if (charset === '') charset = lowercase;
    
    let password = '';
    for (let i = 0; i < passwordLength; i++) {
      password += charset.charAt(Math.floor(Math.random() * charset.length));
    }
    
    setGeneratedPassword(password);
  };

  React.useEffect(() => {
    generatePassword();
  }, [passwordLength, includeUppercase, includeLowercase, includeNumbers, includeSymbols]);

  // Check Password Strength
  const checkStrength = (password: string) => {
    let score = 0;
    const feedback: string[] = [];
    
    if (password.length < 8) {
      feedback.push('Password should be at least 8 characters');
    } else {
      score += 1;
    }
    
    if (password.length >= 12) score += 1;
    if (password.length >= 16) score += 1;
    
    if (/[a-z]/.test(password)) score += 1;
    else feedback.push('Add lowercase letters');
    
    if (/[A-Z]/.test(password)) score += 1;
    else feedback.push('Add uppercase letters');
    
    if (/[0-9]/.test(password)) score += 1;
    else feedback.push('Add numbers');
    
    if (/[^a-zA-Z0-9]/.test(password)) score += 1;
    else feedback.push('Add special characters');
    
    let level = 'Weak';
    let color = 'red';
    
    if (score >= 6) { level = 'Very Strong'; color = 'green'; }
    else if (score >= 5) { level = 'Strong'; color = 'blue'; }
    else if (score >= 3) { level = 'Medium'; color = 'yellow'; }
    
    setStrength({ score, level, color, feedback });
  };

  React.useEffect(() => {
    if (testPassword) checkStrength(testPassword);
  }, [testPassword]);

  // Simple XOR Encryption (for demo purposes)
  const xorEncrypt = (text: string, key: string) => {
    if (!key) return text;
    let result = '';
    for (let i = 0; i < text.length; i++) {
      result += String.fromCharCode(text.charCodeAt(i) ^ key.charCodeAt(i % key.length));
    }
    return btoa(result); // Base64 encode
  };

  const xorDecrypt = (encrypted: string, key: string) => {
    if (!key) return encrypted;
    try {
      const decoded = atob(encrypted);
      let result = '';
      for (let i = 0; i < decoded.length; i++) {
        result += String.fromCharCode(decoded.charCodeAt(i) ^ key.charCodeAt(i % key.length));
      }
      return result;
    } catch {
      return 'Invalid encrypted text or key';
    }
  };

  const processEncryption = () => {
    if (encryptMode === 'encrypt') {
      setEncryptedText(xorEncrypt(plainText, encryptionKey));
    } else {
      setEncryptedText(xorDecrypt(plainText, encryptionKey));
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-6xl mx-auto animate-fade-in">
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 overflow-hidden">
        <div className="p-6 border-b border-slate-200 dark:border-slate-700 bg-gradient-to-r from-red-50 to-orange-50 dark:from-slate-900 dark:to-slate-800">
          <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
            <Shield className="text-red-600" /> Security Tools Suite
          </h2>
          
          <div className="flex flex-wrap gap-2">
            {[
              { id: 'PASSWORD_GEN', label: 'Password Generator', icon: Shield },
              { id: 'PASSWORD_STRENGTH', label: 'Password Strength', icon: Shield },
              { id: 'ENCRYPTION', label: 'Encryption', icon: Shield },
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as SecurityTab)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                    activeTab === tab.id
                      ? 'bg-red-600 text-white shadow-lg'
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
          {activeTab === 'PASSWORD_GEN' && (
            <div className="space-y-6">
              <div className="bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-600 p-4 rounded-r-lg">
                <div className="flex items-start gap-2">
                  <HelpCircle className="text-blue-600 flex-shrink-0 mt-0.5" size={18} />
                  <p className="text-sm text-slate-700 dark:text-slate-300">
                    <strong>Usage Guide:</strong> Generate cryptographically strong passwords. Use 12+ characters with mixed character types. Never reuse passwords across sites. Store in a password manager like LastPass, 1Password, or Bitwarden.
                  </p>
                </div>
              </div>

              <div className="max-w-2xl mx-auto space-y-6">
                <div className="relative">
                  <div className="flex justify-between items-center mb-2">
                    <label className="block text-sm font-bold text-slate-500 uppercase">Generated Password</label>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setShowPassword(!showPassword)}
                        className="text-slate-600 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200"
                        title={showPassword ? 'Hide password' : 'Show password'}
                      >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                      <button
                        onClick={generatePassword}
                        className="text-blue-600 hover:text-blue-700 flex items-center gap-1"
                      >
                        <RefreshCw size={18} /> Regenerate
                      </button>
                      <button
                        onClick={() => copyToClipboard(generatedPassword)}
                        className="text-green-600 text-sm flex items-center gap-1 hover:text-green-700"
                      >
                        {copied ? <Check size={14} /> : <Copy size={14} />} {copied ? 'Copied!' : 'Copy'}
                      </button>
                    </div>
                  </div>
                  <div className="p-6 rounded-lg bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 border-2 border-green-200 dark:border-green-700 text-center font-mono text-2xl font-bold text-green-700 dark:text-green-400 break-all">
                    {showPassword ? generatedPassword : '•'.repeat(generatedPassword.length)}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-500 uppercase mb-2">
                    Password Length: {passwordLength}
                  </label>
                  <input
                    type="range"
                    min="8"
                    max="32"
                    value={passwordLength}
                    onChange={(e) => setPasswordLength(Number(e.target.value))}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-slate-500 mt-1">
                    <span>8</span>
                    <span>32</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <label className="flex items-center gap-2 p-3 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800">
                    <input
                      type="checkbox"
                      checked={includeUppercase}
                      onChange={(e) => setIncludeUppercase(e.target.checked)}
                      className="w-5 h-5"
                    />
                    <span className="font-medium">Uppercase (A-Z)</span>
                  </label>
                  <label className="flex items-center gap-2 p-3 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800">
                    <input
                      type="checkbox"
                      checked={includeLowercase}
                      onChange={(e) => setIncludeLowercase(e.target.checked)}
                      className="w-5 h-5"
                    />
                    <span className="font-medium">Lowercase (a-z)</span>
                  </label>
                  <label className="flex items-center gap-2 p-3 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800">
                    <input
                      type="checkbox"
                      checked={includeNumbers}
                      onChange={(e) => setIncludeNumbers(e.target.checked)}
                      className="w-5 h-5"
                    />
                    <span className="font-medium">Numbers (0-9)</span>
                  </label>
                  <label className="flex items-center gap-2 p-3 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800">
                    <input
                      type="checkbox"
                      checked={includeSymbols}
                      onChange={(e) => setIncludeSymbols(e.target.checked)}
                      className="w-5 h-5"
                    />
                    <span className="font-medium">Symbols (!@#$%)</span>
                  </label>
                </div>

                <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 rounded-lg">
                  <p className="text-sm text-yellow-800 dark:text-yellow-200">
                    <strong>Security Tip:</strong> Change passwords every 3-6 months for sensitive accounts. Enable two-factor authentication (2FA) whenever possible.
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'PASSWORD_STRENGTH' && (
            <div className="space-y-6">
              <div className="bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-600 p-4 rounded-r-lg">
                <div className="flex items-start gap-2">
                  <HelpCircle className="text-blue-600 flex-shrink-0 mt-0.5" size={18} />
                  <p className="text-sm text-slate-700 dark:text-slate-300">
                    <strong>Usage Guide:</strong> Test password strength. Strong passwords are 12+ characters with uppercase, lowercase, numbers, and symbols. Avoid dictionary words and personal information.
                  </p>
                </div>
              </div>

              <div className="max-w-2xl mx-auto space-y-6">
                <div>
                  <label className="block text-sm font-bold text-slate-500 uppercase mb-2">Enter Password to Test</label>
                  <input
                    type="text"
                    value={testPassword}
                    onChange={(e) => setTestPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="w-full p-4 text-lg rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-blue-500 outline-none font-mono"
                  />
                </div>

                {testPassword && (
                  <>
                    <div className={`p-8 rounded-lg bg-${strength.color}-50 dark:bg-${strength.color}-900/20 border-2 border-${strength.color}-200 dark:border-${strength.color}-700 text-center`}>
                      <div className="text-5xl font-bold mb-2" style={{color: strength.color === 'green' ? '#10b981' : strength.color === 'blue' ? '#3b82f6' : strength.color === 'yellow' ? '#f59e0b' : '#ef4444'}}>
                        {strength.level}
                      </div>
                      <div className="text-lg text-slate-600 dark:text-slate-400">Password Strength</div>
                    </div>

                    <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-4">
                      <div 
                        className={`h-4 rounded-full bg-${strength.color}-500 transition-all`}
                        style={{width: `${(strength.score / 7) * 100}%`, backgroundColor: strength.color === 'green' ? '#10b981' : strength.color === 'blue' ? '#3b82f6' : strength.color === 'yellow' ? '#f59e0b' : '#ef4444'}}
                      />
                    </div>

                    {strength.feedback.length > 0 && (
                      <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 rounded-lg">
                        <p className="font-bold text-yellow-800 dark:text-yellow-200 mb-2">Suggestions to improve:</p>
                        <ul className="list-disc list-inside space-y-1 text-sm text-yellow-700 dark:text-yellow-300">
                          {strength.feedback.map((item, i) => (
                            <li key={i}>{item}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    <div className="grid grid-cols-4 gap-3 text-sm">
                      <div className={`p-3 rounded-lg text-center ${testPassword.length >= 12 ? 'bg-green-100 dark:bg-green-900/30 text-green-700' : 'bg-slate-100 dark:bg-slate-900'}`}>
                        <div className="font-bold">{testPassword.length}</div>
                        <div className="text-xs">Characters</div>
                      </div>
                      <div className={`p-3 rounded-lg text-center ${/[A-Z]/.test(testPassword) ? 'bg-green-100 dark:bg-green-900/30 text-green-700' : 'bg-slate-100 dark:bg-slate-900'}`}>
                        <div className="font-bold">{(/[A-Z]/.test(testPassword) ? '✓' : '✗')}</div>
                        <div className="text-xs">Uppercase</div>
                      </div>
                      <div className={`p-3 rounded-lg text-center ${/[0-9]/.test(testPassword) ? 'bg-green-100 dark:bg-green-900/30 text-green-700' : 'bg-slate-100 dark:bg-slate-900'}`}>
                        <div className="font-bold">{(/[0-9]/.test(testPassword) ? '✓' : '✗')}</div>
                        <div className="text-xs">Numbers</div>
                      </div>
                      <div className={`p-3 rounded-lg text-center ${/[^a-zA-Z0-9]/.test(testPassword) ? 'bg-green-100 dark:bg-green-900/30 text-green-700' : 'bg-slate-100 dark:bg-slate-900'}`}>
                        <div className="font-bold">{(/[^a-zA-Z0-9]/.test(testPassword) ? '✓' : '✗')}</div>
                        <div className="text-xs">Symbols</div>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          )}

          {activeTab === 'ENCRYPTION' && (
            <div className="space-y-6">
              <div className="bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-600 p-4 rounded-r-lg">
                <div className="flex items-start gap-2">
                  <HelpCircle className="text-blue-600 flex-shrink-0 mt-0.5" size={18} />
                  <p className="text-sm text-slate-700 dark:text-slate-300">
                    <strong>Usage Guide:</strong> Encrypt/decrypt text using XOR cipher (demo). For production use, consider AES-256 encryption. Never share encryption keys via insecure channels.
                  </p>
                </div>
              </div>

              <div className="flex gap-2 mb-4">
                <button
                  onClick={() => setEncryptMode('encrypt')}
                  className={`px-6 py-2 rounded-lg font-bold transition-all ${encryptMode === 'encrypt' ? 'bg-red-600 text-white' : 'bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-300'}`}
                >
                  Encrypt
                </button>
                <button
                  onClick={() => setEncryptMode('decrypt')}
                  className={`px-6 py-2 rounded-lg font-bold transition-all ${encryptMode === 'decrypt' ? 'bg-red-600 text-white' : 'bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-300'}`}
                >
                  Decrypt
                </button>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-bold text-slate-500 uppercase mb-2">
                      {encryptMode === 'encrypt' ? 'Plain Text' : 'Encrypted Text'}
                    </label>
                    <textarea
                      value={plainText}
                      onChange={(e) => setPlainText(e.target.value)}
                      placeholder={encryptMode === 'encrypt' ? 'Enter text to encrypt' : 'Enter encrypted text to decrypt'}
                      className="w-full h-64 p-4 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-red-500 outline-none resize-none font-mono text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-500 uppercase mb-2">Encryption Key</label>
                    <input
                      type="text"
                      value={encryptionKey}
                      onChange={(e) => setEncryptionKey(e.target.value)}
                      placeholder="Enter a secret key"
                      className="w-full p-3 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-red-500 outline-none font-mono"
                    />
                  </div>
                  <button
                    onClick={processEncryption}
                    className="w-full py-3 bg-red-600 text-white rounded-lg font-bold hover:bg-red-700 transition-all"
                  >
                    {encryptMode === 'encrypt' ? 'Encrypt' : 'Decrypt'}
                  </button>
                </div>
                
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="block text-sm font-bold text-slate-500 uppercase">
                      {encryptMode === 'encrypt' ? 'Encrypted Output' : 'Decrypted Output'}
                    </label>
                    {encryptedText && (
                      <button
                        onClick={() => copyToClipboard(encryptedText)}
                        className="text-red-600 text-sm flex items-center gap-1 hover:text-red-700"
                      >
                        {copied ? <Check size={14} /> : <Copy size={14} />} {copied ? 'Copied!' : 'Copy'}
                      </button>
                    )}
                  </div>
                  <div className="w-full h-64 p-4 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 overflow-auto font-mono text-sm text-slate-700 dark:text-slate-300 whitespace-pre-wrap break-all">
                    {encryptedText || 'Output will appear here...'}
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

export default SecurityTools;
