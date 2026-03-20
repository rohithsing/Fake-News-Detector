exports.handler = async function (event) {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: JSON.stringify({ error: "Method Not Allowed" }) };
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return { statusCode: 500, body: JSON.stringify({ error: "API key not configured." }) };
  }

  let headline, year;
  try {
    ({ headline, year } = JSON.parse(event.body));
  } catch (e) {
    return { statusCode: 400, body: JSON.stringify({ error: "Invalid request body." }) };
  }

  if (!headline || !headline.trim()) {
    return { statusCode: 400, body: JSON.stringify({ error: "A headline is required." }) };
  }

  const prompt = `
    Analyze the following news headline for the year ${year}.
    Headline: "${headline}"

    Your task is to act as a rigorous fact-checker.
    1. Search for credible news sources from ${year} that report on this topic.
    2. Determine if the headline is true and accurately represents the event.
    3. Respond ONLY in the following structured format:

    ---
    STATUS: [TRUE, FAKE, or NOT_FOUND]
    ---
    SUMMARY: [2-3 line summary if TRUE, otherwise N/A]
    ---
    SOURCE: [Primary credible source if TRUE, otherwise N/A]
    ---
    DATE: [Publication date if TRUE, otherwise N/A]
    ---
  `;

  try {
    const geminiRes = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-lite:generateContent?key=" + apiKey,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { temperature: 0.1 },
        }),
      }
    );

    const data = await geminiRes.json();

    if (!geminiRes.ok) {
      console.error("Gemini error:", JSON.stringify(data));
      var googleMsg = (data.error && data.error.message) || JSON.stringify(data);
      return { statusCode: geminiRes.status, body: JSON.stringify({ error: "Google API [" + geminiRes.status + "]: " + googleMsg }) };
    }

    const text = (data.candidates && data.candidates[0] && data.candidates[0].content && data.candidates[0].content.parts && data.candidates[0].content.parts[0] && data.candidates[0].content.parts[0].text) || "";
    const rawSources = (data.candidates && data.candidates[0] && data.candidates[0].groundingMetadata && data.candidates[0].groundingMetadata.groundingChunks) || [];
    const sources = rawSources.filter(function (c) { return c.web && c.web.uri && c.web.title; });

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: text, sources: sources }),
    };
  } catch (error) {
    console.error("Function error:", error.message || error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Internal server error: " + (error.message || "unknown") }),
    };
  }
};