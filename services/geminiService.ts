import type { VerificationResult, VerificationStatus, GroundingChunk } from '../types';

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

export const verifyHeadline = async (
  headline: string,
  year: string
): Promise<{ verificationResult: VerificationResult; sources: GroundingChunk[] }> => {
  try {
    const response = await fetch('/.netlify/functions/gemini', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ headline, year }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Unknown server error' }));
      throw new Error(errorData.error || `Server error: ${response.status}`);
    }

    const data = await response.json();

    const verificationResult = parseGeminiResponse(data.text);
    const sources: GroundingChunk[] = data.sources ?? [];

    return { verificationResult, sources };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';

    if (errorMessage.includes('429') || errorMessage.includes('RESOURCE_EXHAUSTED') || errorMessage.includes('quota')) {
      const retryMatch = errorMessage.match(/retry in ([\d.]+)s/);
      const retryDelay = retryMatch
        ? `Please try again in ${Math.ceil(parseFloat(retryMatch[1]))} seconds.`
        : 'Please wait a moment before trying again.';
      throw new Error(`API quota exceeded. ${retryDelay}`);
    }

    throw new Error('Failed to communicate with the server. Please check your connection and try again.');
  }
};
