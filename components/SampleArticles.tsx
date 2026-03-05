import React from 'react';

interface SampleArticlesProps {
  onAnalyzeSample: (headline: string) => void;
}

const samples = [
  {
    title: 'Local University Researchers Develop New Water Purification Method',
    source: 'Source: University News',
    summary: 'Scientists at the State University have developed a new water purification technique that removes 99.7% of contaminants according to peer-reviewed research...',
    isReal: true,
  },
  {
    title: 'SHOCKING: Doctors HATE This One Simple Trick That CURES Everything!',
    source: 'Source: Unknown Source',
    summary: 'URGENT LEAKED INFORMATION: Big Pharma doesn\'t want you to know about this MIRACLE cure that doctors are trying to hide! This AMAZING secret will INSTANTLY fix all...',
    isReal: false,
  },
  {
    title: 'Climate Change Report Shows Rising Sea Levels',
    source: 'Source: Scientific Journal',
    summary: 'A comprehensive study by the International Climate Research Institute indicates that global sea levels have risen by 3.4 millimeters annually over the past decade. Th...',
    isReal: true,
  },
  {
    title: '7 SECRETS Weather Forecasters Don\'t Want You to Know - #3 Will SHOCK You!',
    source: 'Source: Conspiracy Blog',
    summary: 'BREAKING: EXPOSED weather manipulation conspiracy! Government controls weather with secret technology! You won\'t believe these LEAKED documents that prove...',
    isReal: false,
  },
];

export const SampleArticles: React.FC<SampleArticlesProps> = ({ onAnalyzeSample }) => {
  return (
    <section id="samples" className="py-16 sm:py-24 scroll-mt-20">
      <div className="text-center">
        <h2 className="text-3xl sm:text-4xl font-bold">Try Sample Articles</h2>
        <p className="mt-4 max-w-2xl mx-auto text-lg text-slate-600">
          Test the detector with these sample news articles to see how it identifies real vs. fake content.
        </p>
      </div>
      <div className="mt-16">
        <div className="bg-white/20 backdrop-blur-sm p-6 sm:p-8 rounded-2xl shadow-lg border border-white/30">
          <h3 className="text-xl font-semibold flex items-center gap-3 text-purple-800">
            <span role="img" aria-label="Newspaper">📰</span>
            Sample News Articles
          </h3>
          <p className="text-slate-500 mt-1">Try these sample articles to see how the detector works with different types of content.</p>
          <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
            {samples.map((sample, index) => (
              <div key={index} className="bg-white/30 border border-purple-200/50 rounded-xl p-6 flex flex-col">
                <div className="flex justify-between items-start gap-4">
                  <h4 className="font-bold text-purple-800">{sample.title}</h4>
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-full flex-shrink-0 ${sample.isReal ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {sample.isReal ? 'Real' : 'Fake'}
                  </span>
                </div>
                <p className="text-sm text-slate-500 mt-2">{sample.source}</p>
                <p className="text-slate-600 mt-4 text-sm flex-grow">{sample.summary}</p>
                <button
                  onClick={() => onAnalyzeSample(sample.title)}
                  className="mt-6 w-full bg-purple-100 text-purple-700 font-semibold py-2 px-4 rounded-lg hover:bg-purple-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-400 focus:ring-offset-purple-300/50 transition-all duration-300"
                >
                  Analyze This
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};