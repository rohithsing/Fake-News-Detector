import React, { useState, useCallback, useRef } from 'react';
import { Header } from './components/Header';
import { VerificationForm } from './components/VerificationForm';
import { ResultCard } from './components/ResultCard';
import { HowItWorks } from './components/HowItWorks';
import { SampleArticles } from './components/SampleArticles';
import { Footer } from './components/Footer';
import { verifyHeadline } from './services/geminiService';
import type { VerificationResult, GroundingChunk } from './types';

const App: React.FC = () => {
  const [headline, setHeadline] = useState<string>('');
  const [year, setYear] = useState<string>(new Date().getFullYear().toString());
  const [result, setResult] = useState<VerificationResult | null>(null);
  const [groundingSources, setGroundingSources] = useState<GroundingChunk[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const analysisRef = useRef<HTMLElement>(null);

  const performVerification = useCallback(async (headlineToVerify: string, yearToVerify: string) => {
    if (!headlineToVerify.trim()) {
      setError('Please enter a headline to verify.');
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);
    setGroundingSources([]);

    try {
      const { verificationResult, sources } = await verifyHeadline(headlineToVerify, yearToVerify);
      setResult(verificationResult);
      setGroundingSources(sources);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
    } finally {
      setLoading(false);
    }
  }, []);

  const handleSubmit = useCallback((event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    performVerification(headline, year);
  }, [headline, year, performVerification]);

  const handleAnalyzeSample = useCallback((sampleHeadline: string) => {
    const sampleYear = new Date().getFullYear().toString();
    setHeadline(sampleHeadline);
    setYear(sampleYear);
    analysisRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    performVerification(sampleHeadline, sampleYear);
  }, [performVerification]);

  const handleStartAnalysis = () => {
    analysisRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col items-center p-4 sm:p-6 md:p-8 font-sans overflow-x-hidden">
      <div className="w-full max-w-6xl mx-auto">
        <Header onStartAnalysis={handleStartAnalysis} />
        <HowItWorks />

        <main ref={analysisRef} id="analyze" className="mt-24 scroll-mt-20">
          <div className="text-center">
            <h2 className="text-3xl sm:text-4xl font-bold">Analyze News Content</h2>
            <p className="mt-4 max-w-2xl mx-auto text-lg text-slate-600">
              Paste any news headline or article below to get an instant analysis of its authenticity.
            </p>
          </div>
          <div className="mt-8 max-w-4xl mx-auto">
            <VerificationForm
              headline={headline}
              setHeadline={setHeadline}
              year={year}
              setYear={setYear}
              loading={loading}
              onSubmit={handleSubmit}
            />
            <ResultCard
              loading={loading}
              error={error}
              result={result}
              groundingSources={groundingSources}
            />
          </div>
        </main>

        <SampleArticles onAnalyzeSample={handleAnalyzeSample} />
        <Footer />
      </div>
    </div>
  );
};

export default App;