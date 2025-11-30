import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

export const checkGrammar = async (text: string): Promise<string> => {
  if (!apiKey) return "API Key not configured.";
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Correct the grammar and spelling of the following text. Return ONLY the corrected text without any introductory phrases or markdown formatting unless the original text had it:\n\n${text}`,
    });
    return response.text || "No correction needed.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Error processing request.";
  }
};

export const rephraseText = async (text: string, tone: 'professional' | 'casual' | 'creative'): Promise<string> => {
  if (!apiKey) return "API Key not configured.";
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Rephrase the following text to sound more ${tone}. Return ONLY the rephrased text:\n\n${text}`,
    });
    return response.text || "Could not rephrase.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Error processing request.";
  }
};

export const analyzeLoanEligibility = async (income: number, obligations: number, amount: number): Promise<string> => {
    if (!apiKey) return "API Key not configured.";
    try {
        const prompt = `
        I have a monthly income of ${income}, monthly obligations of ${obligations}, and I want to borrow ${amount}.
        Act as a strict financial advisor. Analyze my eligibility in 3 sentences. 
        1. Determine if I am eligible (high/medium/low chance).
        2. Explain why based on Debt-to-Income ratio.
        3. Give one tip.
        `;
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt
        });
        return response.text || "Could not analyze.";
    } catch (error) {
        return "Error analyzing eligibility.";
    }
}
