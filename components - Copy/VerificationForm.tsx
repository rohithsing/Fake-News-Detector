import React from 'react';
import { BoltIcon } from './icons/BoltIcon';

interface VerificationFormProps {
  headline: string;
  setHeadline: (value: string) => void;
  year: string;
  setYear: (value: string) => void;
  loading: boolean;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
}

export const VerificationForm: React.FC<VerificationFormProps> = ({
  headline,
  setHeadline,
  year,
  setYear,
  loading,
  onSubmit,
}) => {
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 5 }, (_, i) => (currentYear - 4 + i).toString()).reverse();

  return (
    <div className="bg-white/20 backdrop-blur-sm p-6 sm:p-8 rounded-2xl shadow-lg border border-white/30">
      <div className="flex items-center gap-3">
        <BoltIcon className="w-6 h-6 text-purple-600" />
        <h3 className="text-xl font-semibold text-purple-800">News Analysis</h3>
      </div>
      <p className="mt-2 text-slate-600">
        Enter a news headline below to analyze its authenticity using AI-powered detection.
      </p>
      <form onSubmit={onSubmit} className="mt-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="md:col-span-3">
            <label htmlFor="headline" className="sr-only">
              News Headline
            </label>
            <textarea
              id="headline"
              rows={4}
              className="w-full bg-white/30 border border-purple-300 rounded-lg p-3 text-slate-900 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-300 placeholder-slate-500"
              placeholder="Paste your news headline or article here..."
              value={headline}
              onChange={(e) => setHeadline(e.target.value)}
              disabled={loading}
            />
          </div>
          <div className="h-full">
            <label htmlFor="year" className="sr-only">
              Year
            </label>
            <select
              id="year"
              className="w-full h-full bg-white/30 border border-purple-300 rounded-lg p-3 text-slate-900 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-300 appearance-none bg-no-repeat pr-10"
              style={{
                backgroundImage: `url('data:image/svg+xml;utf8,<svg fill="#334155" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg"><path d="M7 10l5 5 5-5z"/></svg>')`,
                backgroundPosition: 'right 0.7rem center',
                backgroundSize: '1.5em',
              }}
              value={year}
              onChange={(e) => setYear(e.target.value)}
              disabled={loading}
            >
              {years.map((y) => (
                <option key={y} value={y} className="bg-purple-100 text-slate-800">{y}</option>
              ))}
            </select>
          </div>
        </div>
        <div className="mt-6">
          <button
            type="submit"
            className="w-full flex items-center justify-center gap-2 bg-purple-600 text-white font-semibold py-3 px-4 rounded-lg shadow-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 focus:ring-offset-purple-300 transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed"
            disabled={loading}
          >
            {loading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Analyzing News...
              </>
            ) : (
              <>
                <BoltIcon className="w-5 h-5" />
                Analyze News
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};