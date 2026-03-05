
import { GoogleGenAI, GroundingMetadata } from "@google/genai";
import type { VerificationResult, VerificationStatus, GroundingChunk } from '../types';

const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

// Debug: Log all available environment variables
console.log("=== Environment Debug ===");
console.log("All import.meta.env keys:", Object.keys(import.meta.env));
console.log("VITE_GEMINI_API_KEY:", apiKey ? `Loaded (${apiKey.substring(0, 15)}...)` : "NOT FOUND");
console.log("import.meta.env.MODE:", import.meta.env.MODE);
console.log("import.meta.env.DEV:", import.meta.env.DEV);

if (!apiKey) {
  console.error("VITE_GEMINI_API_KEY not found in environment variables");
  console.log("Available env vars:", Object.keys(import.meta.env).filter(k => k.includes('GEMINI') || k.includes('VITE')));
  throw new Error("VITE_GEMINI_API_KEY environment variable is not set. Please add VITE_GEMINI_API_KEY to your .env.local file.");
}

console.log("API Key loaded:", apiKey ? "YES (first 10 chars: " + apiKey.substring(0, 10) + ")" : "NO");

const ai = new GoogleGenAI({ apiKey });

function parseGeminiResponse(responseText: string): VerificationResult {
  const result: VerificationResult = {
    status: 'NOT_FOUND',
    summary: 'N/A',
    source: 'N/A',
    publicationDate: 'N/A',
  };

  const sections = responseText.split('---').map(s => s.trim());
  
  if (sections.length < 4) {
      result.summary = "The AI returned an unexpected response format. Please try again with a clearer headline.";
      return result;
  }

  const statusLine = sections.find(s => s.startsWith('STATUS:'));
  if (statusLine) {
    const status = statusLine.replace('STATUS:', '').trim().toUpperCase() as VerificationStatus;
    if (['TRUE', 'FAKE', 'NOT_FOUND'].includes(status)) {
      result.status = status;
    }
  }

  const summaryLine = sections.find(s => s.startsWith('SUMMARY:'));
  if (summaryLine) {
    result.summary = summaryLine.replace('SUMMARY:', '').trim();
  }

  const sourceLine = sections.find(s => s.startsWith('SOURCE:'));
  if (sourceLine) {
    result.source = sourceLine.replace('SOURCE:', '').trim();
  }

  const dateLine = sections.find(s => s.startsWith('DATE:'));
  if (dateLine) {
    result.publicationDate = dateLine.replace('DATE:', '').trim();
  }

  return result;
}


export const verifyHeadline = async (headline: string, year: string): Promise<{ verificationResult: VerificationResult; sources: GroundingChunk[] }> => {
  const prompt = `
    Analyze the following news headline for the year ${year}.
    Headline: "${headline}"

    Your task is to act as a rigorous fact-checker.
    1. Use your search tool to find credible news sources from the specified year (${year}) that report on this topic.
    2. Based on high-quality sources, determine if the headline is true and accurately represents the event.
    3. Respond ONLY in the following structured format. Do not add any introductory or concluding text outside of this structure.

    ---
    STATUS: [Respond with only one of: TRUE, FAKE, or NOT_FOUND]
    ---
    SUMMARY: [If TRUE, provide a concise 2-3 line summary of the real news event. Otherwise, write N/A.]
    ---
    SOURCE: [If TRUE, name the primary, credible news source. Otherwise, write N/A.]
    ---
    DATE: [If TRUE, provide the publication date (e.g., Month Day, Year). Otherwise, write N/A.]
    ---
  `;

  try {
    console.log("Attempting to call Gemini API with model: gemini-3-flash-preview");
    console.log("API Key prefix:", apiKey ? apiKey.substring(0, 15) + "..." : "NOT FOUND");
    
    // Test network connectivity first
    try {
      console.log("Testing network connectivity to Google...");
      const testResponse = await fetch('https://www.google.com', { method: 'HEAD', mode: 'no-cors' });
      console.log("Network test: Google is reachable");
    } catch (networkTestError) {
      console.error("Network test FAILED - cannot reach Google:", networkTestError);
      console.error("This indicates a network/firewall/vpn issue on your machine");
    }
    
    console.log("=== API Call Debug ===");
    console.log("Model being used:", "gemini-3-flash-preview");
    console.log("API Key being used:", apiKey ? apiKey.substring(0, 20) + "..." : "MISSING");
    console.log("Prompt length:", prompt.length);
    
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        temperature: 0.1,
      },
    });

    console.log("Gemini API response received successfully");

    const verificationResult = parseGeminiResponse(response.text);
    
    const groundingMetadata: GroundingMetadata | undefined = response.candidates?.[0]?.groundingMetadata;
    const sources: GroundingChunk[] = groundingMetadata?.groundingChunks?.filter(chunk => chunk.web?.uri && chunk.web.title) ?? [];
    
    return { verificationResult, sources };
  } catch (error) {
    console.error("=== Gemini API Error Details ===");
    console.error("Error object:", error);
    
    if (error instanceof Error) {
      console.error("Error name:", error.name);
      console.error("Error message:", error.message);
      
      // Check for specific error types
      if (error.message.includes('API_KEY') || error.message.includes('permission') || error.message.includes('unauthorized')) {
        console.error("DIAGNOSIS: API Key issue detected - the key may be invalid, expired, or not have Gemini API enabled");
      } else if (error.message.includes('network') || error.message.includes('fetch') || error.message.includes('ENOTFOUND')) {
        console.error("DIAGNOSIS: Network issue detected - unable to reach Google's servers");
      } else if (error.message.includes('quota') || error.message.includes('rate limit')) {
        console.error("DIAGNOSIS: Quota/rate limit exceeded");
      } else if (error.message.includes('model') || error.message.includes('not found')) {
        console.error("DIAGNOSIS: Model not available - check if gemini-flash-latest is available in your region");
      }
    }
    
    // Re-throw with more helpful message
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    
    // Check if it's a quota error
    if (errorMessage.includes('429') || errorMessage.includes('RESOURCE_EXHAUSTED') || errorMessage.includes('quota')) {
      // Try to extract retry delay
      const retryMatch = errorMessage.match(/retry in ([\d.]+)s/);
      const retryDelay = retryMatch ? `Please try again in ${Math.ceil(parseFloat(retryMatch[1]))} seconds.` : 'Please wait a moment before trying again.';
      throw new Error(`API quota exceeded. ${retryDelay} If this persists, you may need to enable billing in Google AI Studio or wait for your quota to reset.`);
    }
    
    throw new Error("Failed to communicate with the AI. Please check your connection or API key and try again.");
  }
};
