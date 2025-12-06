const FN_BASE = '/api/gemini';

interface GeminiResult { result?: string; error?: string; }

async function callFunction(payload: Record<string, any>): Promise<string> {
  try {
    const resp = await fetch(FN_BASE, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const data: GeminiResult = await resp.json();
    if (!resp.ok || data.error) {
      throw new Error(data.error || `Request failed (${resp.status})`);
    }
    return data.result || '';
  } catch (e: any) {
    console.error('Gemini proxy error:', e);
    return 'Error processing request.';
  }
}

export const checkGrammar = async (text: string): Promise<string> => {
  if (!text) return 'No text provided.';
  return callFunction({ action: 'checkGrammar', text });
};

export const rephraseText = async (text: string, tone: 'professional' | 'casual' | 'creative'): Promise<string> => {
  if (!text) return 'No text provided.';
  return callFunction({ action: 'rephraseText', text, tone });
};

export const analyzeLoanEligibility = async (income: number, obligations: number, amount: number): Promise<string> => {
  if (income == null || obligations == null || amount == null) return 'Missing parameters.';
  return callFunction({ action: 'analyzeLoanEligibility', income, obligations, amount });
};

export const recommendMovies = async (genre?: string, mood?: string, year?: string): Promise<string> => {
  return callFunction({ action: 'recommendMovies', genre, mood, year });
};

export const translateText = async (text: string, fromLang: string, toLang: string): Promise<string> => {
  if (!text || !fromLang || !toLang) return 'Missing translation parameters.';
  return callFunction({ action: 'translateText', text, fromLang, toLang });
};
