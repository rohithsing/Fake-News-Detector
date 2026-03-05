
export type VerificationStatus = 'TRUE' | 'FAKE' | 'NOT_FOUND';

export interface VerificationResult {
  status: VerificationStatus;
  summary: string;
  source: string;
  publicationDate: string;
}

export interface GroundingChunk {
  web?: {
    uri?: string;
    title?: string;
  };
}
