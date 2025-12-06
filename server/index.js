import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { existsSync } from 'fs';
import fetch from 'node-fetch';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());
app.use(express.json());

const MODEL = 'gemini-2.5-flash';

async function callGemini(prompt, apiKey) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${apiKey}`;
  const body = {
    contents: [
      {
        parts: [{ text: prompt }]
      }
    ]
  };
  const resp = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });
  const data = await resp.json();
  if (!resp.ok) {
    throw new Error(data.error?.message || 'Gemini API error');
  }
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
  return text.trim();
}

app.post('/api/gemini', async (req, res) => {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      res.status(500).json({ error: 'API key not configured' });
      return;
    }
    const { action, text, tone, income, obligations, amount } = req.body || {};
    let prompt = '';
    switch (action) {
      case 'checkGrammar':
        if (!text) throw new Error('Missing text');
        prompt = `Correct the grammar and spelling of the following text. Return ONLY the corrected text without any introductory phrases or markdown formatting unless the original text had it:\n\n${text}`;
        break;
      case 'rephraseText':
        if (!text || !tone) throw new Error('Missing text or tone');
        prompt = `Rephrase the following text to sound more ${tone}. Return ONLY the rephrased text:\n\n${text}`;
        break;
      case 'analyzeLoanEligibility':
        if (income == null || obligations == null || amount == null) throw new Error('Missing financial parameters');
        prompt = `I have a monthly income of ${income}, monthly obligations of ${obligations}, and I want to borrow ${amount}. Act as a strict financial advisor. Analyze my eligibility in 3 sentences. 1. Determine if I am eligible (high/medium/low chance). 2. Explain why based on Debt-to-Income ratio. 3. Give one tip.`;
        break;
      case 'translateText':
        const { text: translateText, fromLang, toLang } = req.body;
        if (!translateText || !fromLang || !toLang) throw new Error('Missing translation parameters');
        prompt = `Translate the following text from ${fromLang} to ${toLang}. Return ONLY the translated text without any introductory phrases, explanations, or additional formatting. If the source and target languages are the same, return the original text unchanged.

Text to translate: "${translateText}"

Translation:`;
        break;
      default:
        throw new Error('Unknown action');
    }

    const result = await callGemini(prompt, apiKey);
    res.json({ result });
  } catch (e) {
    res.status(500).json({ error: e.message || 'Internal error' });
  }
});

// Authentication endpoints (for future server-side features)
app.post('/api/auth/verify', (req, res) => {
  // This could be used for server-side session verification
  // For now, just return success since Firebase handles auth
  res.json({ success: true, message: 'Authentication verified' });
});

// User preferences endpoint
app.post('/api/user/preferences', (req, res) => {
  // This could store user preferences server-side
  const { userId, preferences } = req.body;
  // For now, just acknowledge
  res.json({ success: true, message: 'Preferences saved' });
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Serve static files from dist
const distPath = path.join(__dirname, '..', 'dist');
console.log(`Serving static files from: ${distPath}`);

// Check if dist exists
if (!existsSync(distPath)) {
  console.error(`ERROR: dist directory not found at ${distPath}`);
  console.error('Please run "npm run build" first');
  process.exit(1);
}

app.use(express.static(distPath, {
  etag: true,
  lastModified: true,
  setHeaders: (res, path) => {
    if (path.endsWith('.html')) {
      res.setHeader('Cache-Control', 'no-cache');
    }
  }
}));

// Fallback to index.html for SPA routes
app.get('*', (req, res) => {
  const indexPath = path.join(distPath, 'index.html');
  if (!existsSync(indexPath)) {
    console.error(`ERROR: index.html not found at ${indexPath}`);
    return res.status(500).send('Application not built. Please run npm run build.');
  }
  res.sendFile(indexPath);
});

const port = process.env.PORT || 10000;
const server = app.listen(port, '0.0.0.0', () => {
  console.log(`Server listening on http://0.0.0.0:${port}`);
  console.log(`Dist path: ${distPath}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, closing server...');
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});
