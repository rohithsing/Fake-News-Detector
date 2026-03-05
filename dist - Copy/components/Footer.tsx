import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="text-center py-12 mt-16 border-t border-slate-900/10">
      <h3 className="text-lg font-semibold text-purple-700">Fake News Detector</h3>
      <p className="mt-2 text-sm text-slate-600 max-w-md mx-auto">
        Empowering digital literacy through AI-powered news authenticity analysis.
        Built with advanced machine learning algorithms for accurate detection.
      </p>
    </footer>
  );
};