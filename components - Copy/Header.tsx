import React from 'react';
import { BoltIcon } from './icons/BoltIcon';

interface HeaderProps {
  onStartAnalysis: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onStartAnalysis }) => {
  return (
    <header className="text-center py-16 sm:py-24">
      <div className="flex justify-center mb-4">
        <div className="bg-white/30 text-purple-800 text-xs font-medium px-3 py-1 rounded-full">
          AI-Powered Detection
        </div>
      </div>
      <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold tracking-tight text-slate-900">
        Fake News Detector
      </h1>
      <p className="mt-6 max-w-3xl mx-auto text-lg sm:text-xl text-slate-600">
        Harness the power of advanced AI to instantly analyze news content and identify potentially misleading information with high accuracy.
      </p>
      <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
        <button
          onClick={onStartAnalysis}
          className="flex items-center justify-center gap-2 w-full sm:w-auto bg-purple-600 text-white font-semibold py-3 px-6 rounded-lg shadow-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 focus:ring-offset-purple-300 transition-all duration-300"
        >
          <BoltIcon className="w-5 h-5" />
          Start Analysis
        </button>
        <button
          onClick={() => {
            const samples = document.getElementById('samples');
            if (samples) {
              samples.scrollIntoView({ behavior: 'smooth' });
            }
          }}
          className="w-full sm:w-auto bg-white/30 text-purple-700 font-semibold py-3 px-6 rounded-lg backdrop-blur-sm border border-white/50 hover:bg-white/50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 focus:ring-offset-purple-300 transition-all duration-300"
        >
          Try Samples
        </button>
      </div>

      <div className="mt-20 max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
        <div className="bg-white/20 backdrop-blur-sm p-6 rounded-2xl border border-white/30">
          <p className="text-4xl font-bold text-purple-700">95%</p>
          <p className="text-slate-600 mt-1">Accuracy Rate</p>
        </div>
        <div className="bg-white/20 backdrop-blur-sm p-6 rounded-2xl border border-white/30">
          <p className="text-4xl font-bold text-purple-700">&lt;1s</p>
          <p className="text-slate-600 mt-1">Analysis Time</p>
        </div>
        <div className="bg-white/20 backdrop-blur-sm p-6 rounded-2xl border border-white/30">
          <p className="text-4xl font-bold text-purple-700">Real-time</p>
          <p className="text-slate-600 mt-1">Detection</p>
        </div>
      </div>
    </header>
  );
};