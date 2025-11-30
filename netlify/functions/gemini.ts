import type { Handler } from '@netlify/functions';

interface RequestBody {
  action: 'checkGrammar' | 'rephraseText' | 'analyzeLoanEligibility';
  text?: string;
  tone?: 'professional' | 'casual' | 'creative';
  income?: number;
  obligations?: number;
  amount?: number;
}

const MODEL = 'gemini-2.5-flash';

async function callGemini(prompt: string, apiKey: string) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${apiKey}`;
  const body = {
    contents: [
      {
        parts: [
          { text: prompt }
        ]
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

export const handler: Handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: JSON.stringify({ error: 'Method not allowed' }) };
  }
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return { statusCode: 500, body: JSON.stringify({ error: 'API key not configured' }) };
  }
  try {
    const body: RequestBody = JSON.parse(event.body || '{}');
    let prompt = '';
    switch (body.action) {
      case 'checkGrammar':
        if (!body.text) throw new Error('Missing text');
        prompt = `Correct the grammar and spelling of the following text. Return ONLY the corrected text without any introductory phrases or markdown formatting unless the original text had it:\n\n${body.text}`;
        break;
      case 'rephraseText':
        if (!body.text || !body.tone) throw new Error('Missing text or tone');
        prompt = `Rephrase the following text to sound more ${body.tone}. Return ONLY the rephrased text:\n\n${body.text}`;
        break;
      case 'analyzeLoanEligibility':
        if (body.income == null || body.obligations == null || body.amount == null) throw new Error('Missing financial parameters');
        prompt = `I have a monthly income of ${body.income}, monthly obligations of ${body.obligations}, and I want to borrow ${body.amount}. Act as a strict financial advisor. Analyze my eligibility in 3 sentences. 1. Determine if I am eligible (high/medium/low chance). 2. Explain why based on Debt-to-Income ratio. 3. Give one tip.`;
        break;
      default:
        throw new Error('Unknown action');
    }
    const text = await callGemini(prompt, apiKey);
    return { statusCode: 200, body: JSON.stringify({ result: text }) };
  } catch (e: any) {
    return { statusCode: 500, body: JSON.stringify({ error: e.message || 'Internal error' }) };
  }
};
