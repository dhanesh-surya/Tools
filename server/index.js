import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
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

// Serve static files from dist
const distPath = path.join(__dirname, '..', 'dist');
app.use(express.static(distPath));

// Fallback to index.html for SPA routes
app.get('*', (req, res) => {
  res.sendFile(path.join(distPath, 'index.html'));
});

const port = process.env.PORT || 10000;
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
