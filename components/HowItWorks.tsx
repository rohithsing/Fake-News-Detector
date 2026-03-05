import React from 'react';
import { ClipboardIcon } from './icons/ClipboardIcon';
import { ShieldCheckIcon } from './icons/ShieldCheckIcon';
import { TrendingUpIcon } from './icons/TrendingUpIcon';

export const HowItWorks: React.FC = () => {
  const features = [
    {
      icon: <ClipboardIcon className="w-8 h-8 text-purple-600" />,
      title: 'Content Analysis',
      description: 'Examines language patterns, sensationalism, and credibility indicators in the text.'
    },
    {
      icon: <ShieldCheckIcon className="w-8 h-8 text-purple-600" />,
      title: 'Source Verification',
      description: 'Checks for reliable sources, citations, and journalistic standards compliance.'
    },
    {
      icon: <TrendingUpIcon className="w-8 h-8 text-purple-600" />,
      title: 'Confidence Score',
      description: 'Provides a confidence percentage and detailed analysis of suspicious elements.'
    }
  ];

  return (
    <section className="py-16 sm:py-24">
      <div className="text-center">
        <h2 className="text-3xl sm:text-4xl font-bold">How It Works</h2>
        <p className="mt-4 max-w-2xl mx-auto text-lg text-slate-600">
          Our advanced AI system analyzes multiple factors to determine the authenticity of news content.
        </p>
      </div>
      <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
        {features.map((feature, index) => (
          <div key={index} className="flex flex-col items-center">
            <div className="flex items-center justify-center w-20 h-20 bg-white/40 border border-purple-200 rounded-full">
              {feature.icon}
            </div>
            <h3 className="mt-6 text-xl font-semibold text-purple-800">{feature.title}</h3>
            <p className="mt-2 text-slate-600">{feature.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
};