import React, { useState } from 'react';
import { Mail, CheckCircle, AlertTriangle, FileText, Copy, Eye, EyeOff } from 'lucide-react';

const EmailTools: React.FC = () => {
  const [activeTab, setActiveTab] = useState('template');

  const tabs = [
    { id: 'template', label: 'Template Builder', icon: FileText },
    { id: 'subject', label: 'Subject Tester', icon: Mail },
    { id: 'validator', label: 'Email Validator', icon: CheckCircle },
    { id: 'spam', label: 'Spam Checker', icon: AlertTriangle },
  ];

  return (
    <div className="space-y-6">
      {/* Tab Navigation */}
      <div className="flex flex-wrap gap-2 border-b border-slate-200 dark:border-slate-700">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-t-lg font-medium transition-colors ${
              activeTab === tab.id
                ? 'bg-primary text-white border-b-2 border-primary'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <tab.icon size={18} />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="bg-white dark:bg-slate-800 rounded-lg p-6 shadow-sm border border-slate-200 dark:border-slate-700">
        {activeTab === 'template' && <EmailTemplateBuilder />}
        {activeTab === 'subject' && <SubjectLineTester />}
        {activeTab === 'validator' && <EmailValidator />}
        {activeTab === 'spam' && <SpamScoreChecker />}
      </div>
    </div>
  );
};

const EmailTemplateBuilder: React.FC = () => {
  const [template, setTemplate] = useState({
    subject: '',
    greeting: 'Dear [Name],',
    body: '',
    closing: 'Best regards,\n[Your Name]',
    cta: 'Click here to learn more',
    ctaUrl: '',
  });
  const [generatedHtml, setGeneratedHtml] = useState('');

  const generateTemplate = () => {
    const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${template.subject}</title>
  <style>
    body { font-family: Arial, sans-serif; margin: 0; padding: 20px; background-color: #f4f4f4; }
    .container { max-width: 600px; margin: 0 auto; background: white; padding: 20px; border-radius: 8px; }
    .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
    .content { padding: 20px; line-height: 1.6; }
    .cta-button { display: inline-block; background: #667eea; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
    .footer { text-align: center; color: #666; font-size: 12px; margin-top: 20px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>${template.subject}</h1>
    </div>
    <div class="content">
      <p>${template.greeting}</p>
      <p>${template.body.replace(/\n/g, '<br>')}</p>
      <a href="${template.ctaUrl}" class="cta-button">${template.cta}</a>
      <p>${template.closing.replace(/\n/g, '<br>')}</p>
    </div>
    <div class="footer">
      <p>This email was sent to you because you subscribed to our newsletter.</p>
    </div>
  </div>
</body>
</html>`;
    setGeneratedHtml(html);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedHtml);
  };

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-200">Email Template Builder</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-4">
          <input
            type="text"
            placeholder="Email Subject"
            value={template.subject}
            onChange={(e) => setTemplate({...template, subject: e.target.value})}
            className="w-full p-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100"
          />
          <input
            type="text"
            placeholder="Greeting"
            value={template.greeting}
            onChange={(e) => setTemplate({...template, greeting: e.target.value})}
            className="w-full p-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100"
          />
          <textarea
            placeholder="Email body content"
            value={template.body}
            onChange={(e) => setTemplate({...template, body: e.target.value})}
            rows={6}
            className="w-full p-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100"
          />
          <textarea
            placeholder="Closing"
            value={template.closing}
            onChange={(e) => setTemplate({...template, closing: e.target.value})}
            rows={3}
            className="w-full p-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100"
          />
          <input
            type="text"
            placeholder="Call-to-Action text"
            value={template.cta}
            onChange={(e) => setTemplate({...template, cta: e.target.value})}
            className="w-full p-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100"
          />
          <input
            type="url"
            placeholder="CTA URL"
            value={template.ctaUrl}
            onChange={(e) => setTemplate({...template, ctaUrl: e.target.value})}
            className="w-full p-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100"
          />
          <button
            onClick={generateTemplate}
            className="w-full bg-primary text-white py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Generate Template
          </button>
        </div>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-medium text-slate-800 dark:text-slate-200">Generated HTML</h4>
            {generatedHtml && (
              <button
                onClick={copyToClipboard}
                className="flex items-center gap-2 px-3 py-1 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded hover:bg-slate-200 dark:hover:bg-slate-600"
              >
                <Copy size={16} />
                Copy
              </button>
            )}
          </div>
          <textarea
            value={generatedHtml}
            readOnly
            rows={20}
            className="w-full p-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 font-mono text-sm"
            placeholder="Generated HTML will appear here..."
          />
        </div>
      </div>
    </div>
  );
};

const SubjectLineTester: React.FC = () => {
  const [subject, setSubject] = useState('');
  const [results, setResults] = useState<any>(null);

  const testSubject = () => {
    // Simple subject line analysis
    const analysis = {
      length: subject.length,
      wordCount: subject.split(' ').length,
      hasEmoji: /[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]/u.test(subject),
      hasNumbers: /\d/.test(subject),
      hasQuestion: subject.includes('?'),
      hasExclamation: subject.includes('!'),
      score: 0,
      suggestions: [] as string[]
    };

    // Scoring logic
    if (analysis.length >= 30 && analysis.length <= 70) analysis.score += 20;
    else if (analysis.length < 30) analysis.score += 10;
    
    if (analysis.hasEmoji) analysis.score += 15;
    if (analysis.hasNumbers) analysis.score += 10;
    if (analysis.hasQuestion || analysis.hasExclamation) analysis.score += 15;
    
    if (analysis.wordCount <= 10) analysis.score += 20;
    else if (analysis.wordCount > 15) analysis.score -= 10;

    // Suggestions
    if (analysis.length < 30) analysis.suggestions.push('Consider making the subject line longer for better visibility');
    if (analysis.length > 70) analysis.suggestions.push('Subject line might be too long - consider shortening it');
    if (!analysis.hasEmoji && !analysis.hasQuestion && !analysis.hasExclamation) analysis.suggestions.push('Add an emoji or punctuation to increase engagement');
    if (analysis.wordCount > 15) analysis.suggestions.push('Too many words - keep it concise');

    setResults(analysis);
  };

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-200">Subject Line Tester</h3>
      <div className="space-y-4">
        <input
          type="text"
          placeholder="Enter your email subject line"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          className="w-full p-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100"
        />
        <button
          onClick={testSubject}
          className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Test Subject Line
        </button>
        
        {results && (
          <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-lg">
            <h4 className="font-semibold mb-3 text-slate-800 dark:text-slate-200">Analysis Results</h4>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>Length: {results.length} characters</div>
              <div>Words: {results.wordCount}</div>
              <div>Has Emoji: {results.hasEmoji ? 'Yes' : 'No'}</div>
              <div>Has Numbers: {results.hasNumbers ? 'Yes' : 'No'}</div>
              <div>Has Question: {results.hasQuestion ? 'Yes' : 'No'}</div>
              <div>Has Exclamation: {results.hasExclamation ? 'Yes' : 'No'}</div>
            </div>
            <div className="mb-4">
              <div className="flex items-center gap-2 mb-2">
                <span>Score: {results.score}/100</span>
                <div className="flex-1 bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                  <div 
                    className="bg-green-500 h-2 rounded-full" 
                    style={{width: `${results.score}%`}}
                  ></div>
                </div>
              </div>
            </div>
            {results.suggestions.length > 0 && (
              <div>
                <h5 className="font-medium mb-2 text-slate-800 dark:text-slate-200">Suggestions:</h5>
                <ul className="list-disc list-inside space-y-1 text-slate-600 dark:text-slate-400">
                  {results.suggestions.map((suggestion: string, index: number) => (
                    <li key={index}>{suggestion}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

const EmailValidator: React.FC = () => {
  const [emails, setEmails] = useState('');
  const [results, setResults] = useState<any[]>([]);

  const validateEmails = () => {
    const emailList = emails.split('\n').filter(email => email.trim());
    const validationResults = emailList.map(email => {
      const trimmed = email.trim();
      const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed);
      const domain = trimmed.split('@')[1];
      const isCommonDomain = ['gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com'].includes(domain?.toLowerCase());
      
      return {
        email: trimmed,
        isValid,
        domain,
        isCommonDomain,
        status: isValid ? 'Valid' : 'Invalid'
      };
    });
    setResults(validationResults);
  };

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-200">Email Validator</h3>
      <div className="space-y-4">
        <textarea
          placeholder="Enter email addresses (one per line)"
          value={emails}
          onChange={(e) => setEmails(e.target.value)}
          rows={8}
          className="w-full p-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100"
        />
        <button
          onClick={validateEmails}
          className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Validate Emails
        </button>
        
        {results.length > 0 && (
          <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-lg">
            <h4 className="font-semibold mb-3 text-slate-800 dark:text-slate-200">Validation Results</h4>
            <div className="space-y-2">
              {results.map((result, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded border">
                  <div>
                    <span className="font-medium">{result.email}</span>
                    <span className="text-sm text-slate-500 ml-2">({result.domain})</span>
                  </div>
                  <span className={`px-2 py-1 rounded text-sm ${
                    result.isValid 
                      ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                      : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                  }`}>
                    {result.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const SpamScoreChecker: React.FC = () => {
  const [emailContent, setEmailContent] = useState('');
  const [score, setScore] = useState<number | null>(null);
  const [issues, setIssues] = useState<string[]>([]);

  const checkSpamScore = () => {
    let spamScore = 0;
    const foundIssues: string[] = [];

    // Check for spam triggers
    if (emailContent.toLowerCase().includes('free')) {
      spamScore += 10;
      foundIssues.push('Contains "free" - can trigger spam filters');
    }
    if (emailContent.toLowerCase().includes('urgent') || emailContent.toLowerCase().includes('immediate')) {
      spamScore += 15;
      foundIssues.push('Urgency words can increase spam score');
    }
    if (emailContent.match(/!/g)?.length > 3) {
      spamScore += 10;
      foundIssues.push('Too many exclamation marks');
    }
    if (emailContent.toUpperCase() === emailContent && emailContent.length > 10) {
      spamScore += 20;
      foundIssues.push('All caps text is a major spam trigger');
    }
    if (emailContent.match(/\$/g)?.length > 2) {
      spamScore += 10;
      foundIssues.push('Multiple dollar signs can trigger spam filters');
    }
    if (!emailContent.includes('unsubscribe')) {
      spamScore += 5;
      foundIssues.push('Missing unsubscribe link');
    }

    // Length checks
    if (emailContent.length < 50) {
      spamScore += 5;
      foundIssues.push('Email content is too short');
    }

    setScore(spamScore);
    setIssues(foundIssues);
  };

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-200">Spam Score Checker</h3>
      <div className="space-y-4">
        <textarea
          placeholder="Paste your email content here"
          value={emailContent}
          onChange={(e) => setEmailContent(e.target.value)}
          rows={10}
          className="w-full p-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100"
        />
        <button
          onClick={checkSpamScore}
          className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Check Spam Score
        </button>
        
        {score !== null && (
          <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-lg">
            <h4 className="font-semibold mb-3 text-slate-800 dark:text-slate-200">Spam Analysis</h4>
            <div className="mb-4">
              <div className="flex items-center gap-2 mb-2">
                <span>Spam Score: {score}/100</span>
                <div className="flex-1 bg-slate-200 dark:bg-slate-700 rounded-full h-3">
                  <div 
                    className={`h-3 rounded-full ${
                      score < 30 ? 'bg-green-500' : score < 70 ? 'bg-yellow-500' : 'bg-red-500'
                    }`} 
                    style={{width: `${Math.min(score, 100)}%`}}
                  ></div>
                </div>
              </div>
              <p className={`text-sm ${
                score < 30 ? 'text-green-600' : score < 70 ? 'text-yellow-600' : 'text-red-600'
              }`}>
                {score < 30 ? 'Low risk - should pass most filters' : 
                 score < 70 ? 'Medium risk - may be flagged by some filters' : 
                 'High risk - likely to be marked as spam'}
              </p>
            </div>
            {issues.length > 0 && (
              <div>
                <h5 className="font-medium mb-2 text-slate-800 dark:text-slate-200">Issues Found:</h5>
                <ul className="list-disc list-inside space-y-1 text-slate-600 dark:text-slate-400">
                  {issues.map((issue, index) => (
                    <li key={index}>{issue}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default EmailTools;