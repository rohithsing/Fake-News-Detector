import React from 'react';
import type { VerificationResult, GroundingChunk } from '../types';
import { CheckCircleIcon } from './icons/CheckCircleIcon';
import { XCircleIcon } from './icons/XCircleIcon';
import { QuestionMarkCircleIcon } from './icons/QuestionMarkCircleIcon';
import { LinkIcon } from './icons/LinkIcon';

interface ResultCardProps {
  loading: boolean;
  error: string | null;
  result: VerificationResult | null;
  groundingSources: GroundingChunk[];
}

const ResultContent: React.FC<{ result: VerificationResult }> = ({ result }) => {
  switch (result.status) {
    case 'TRUE':
      return (
        <div className="border-l-4 border-green-500 p-4 bg-green-500/10 rounded-r-lg">
          <div className="flex items-center gap-3">
            <CheckCircleIcon className="w-8 h-8 text-green-500" />
            <h2 className="text-2xl font-bold text-green-600">TRUE</h2>
          </div>
          <div className="mt-4 space-y-3 text-slate-700">
            <p><strong className="font-semibold text-slate-900">Summary:</strong> {result.summary}</p>
            <p><strong className="font-semibold text-slate-900">Source:</strong> {result.source}</p>
            <p><strong className="font-semibold text-slate-900">Date:</strong> {result.publicationDate}</p>
          </div>
        </div>
      );
    case 'FAKE':
      return (
        <div className="border-l-4 border-red-500 p-4 bg-red-500/10 rounded-r-lg">
          <div className="flex items-center gap-3">
            <XCircleIcon className="w-8 h-8 text-red-500" />
            <h2 className="text-2xl font-bold text-red-600">FAKE / MISINFORMATION</h2>
          </div>
          <p className="mt-4 text-slate-700">This headline does not appear to correspond with credible news reports and may be false or misleading.</p>
        </div>
      );
    case 'NOT_FOUND':
      return (
        <div className="border-l-4 border-yellow-500 p-4 bg-yellow-500/10 rounded-r-lg">
          <div className="flex items-center gap-3">
            <QuestionMarkCircleIcon className="w-8 h-8 text-yellow-500" />
            <h2 className="text-2xl font-bold text-yellow-600">NOT FOUND / LOW CONFIDENCE</h2>
          </div>
          <p className="mt-4 text-slate-700">{result.summary !== 'N/A' ? result.summary : 'The AI could not confidently verify this headline based on available web search data. This could be due to it being a very niche topic, recent breaking news, or from an unreliable source.'}</p>
        </div>
      );
    default:
      return null;
  }
};

const GroundingSources: React.FC<{ sources: GroundingChunk[] }> = ({ sources }) => {
  if (sources.length === 0) return null;

  return (
    <div className="mt-6">
      <h3 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
        <LinkIcon className="w-5 h-5" />
        Sources Found
      </h3>
      <ul className="mt-3 space-y-2">
        {sources.map((source, index) => (
          source.web && (
            <li key={index} className="bg-purple-500/10 p-3 rounded-lg hover:bg-purple-500/20 transition-colors">
              <a
                href={source.web.uri}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 text-purple-600 hover:text-purple-500"
              >
                <span className="truncate">{source.web.title || source.web.uri}</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            </li>
          )
        ))}
      </ul>
    </div>
  );
};

export const ResultCard: React.FC<ResultCardProps> = ({ loading, error, result, groundingSources }) => {
  if (loading) {
    return (
      <div className="mt-8 flex justify-center items-center p-8 bg-white/20 backdrop-blur-sm rounded-2xl border border-white/30">
        <div className="text-center text-slate-600">
          <svg className="animate-spin mx-auto h-10 w-10 text-purple-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p className="mt-4 text-lg font-semibold">Searching for verified sources...</p>
          <p>Analyzing sources to verify the headline.</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mt-8 p-6 bg-red-100 border border-red-200 rounded-2xl text-red-800">
        <h3 className="font-bold">An Error Occurred</h3>
        <p>{error}</p>
      </div>
    );
  }

  if (!result) {
    return null;
  }

  return (
    <div className="mt-8 p-6 bg-white/20 backdrop-blur-sm rounded-2xl shadow-xl border border-white/30 animate-fade-in">
      <ResultContent result={result} />
      <GroundingSources sources={groundingSources} />
    </div>
  );
};