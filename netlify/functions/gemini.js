import { GoogleGenAI } from "@google/genai";

export async function handler(event) {
  // Only allow POST requests
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: "Method Not Allowed" }),
    };
  }

  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Server misconfiguration: API key is missing." }),
    };
  }

  let headline, year;
  try {
    ({ headline, year } = JSON.parse(event.body));
  } catch {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "Invalid request body." }),
    };
  }

  if (!headline || !headline.trim()) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "A headline is required." }),
    };
  }

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
    const ai = new GoogleGenAI({ apiKey });

    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: prompt,
      config: { temperature: 0.1 },
    });

    const text = response.text;
    const sources =
      response.candidates?.[0]?.groundingMetadata?.groundingChunks?.filter(
        (chunk) => chunk.web?.uri && chunk.web?.title
      ) ?? [];

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text, sources }),
    };
  } catch (error) {
    console.error("Gemini API error:", error);

    const message = error instanceof Error ? error.message : "Unknown error";

    if (
      message.includes("429") ||
      message.includes("RESOURCE_EXHAUSTED") ||
      message.includes("quota")
    ) {
      return {
        statusCode: 429,
        body: JSON.stringify({ error: `API quota exceeded. ${message}` }),
      };
    }

    return {
      statusCode: 500,
      body: JSON.stringify({
        error: "Failed to get a response from the AI. Please try again.",
      }),
    };
  }
}