import { IngestInput } from "@/components/trendstream/ingest-input";
import { PatternCard } from "@/components/trendstream/pattern-card";

export default function Home() {
  return (
    <div className="space-y-12">
      {/* Header */}
      <div className="flex flex-col items-center justify-center py-10 space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-4xl font-bold tracking-tight text-white">Trendstream™ Intelligence</h2>
          <p className="text-slate-400 max-w-lg mx-auto">
            Input a content URL to extract winning patterns, analyze viral triggers, and get actionable improvements.
          </p>
        </div>

        <IngestInput />
      </div>

      {/* Recent Patterns Grid */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-white">Recent Discoveries</h3>
          <button className="text-sm text-indigo-400 hover:text-indigo-300">View All &rarr;</button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <PatternCard
            title="The 'Unexpected Expert' Hook"
            abstract="Starts with a counter-intuitive statement from a credible source, immediately followed by visual proof. High retention in first 3s."
            score={94}
            platform="tiktok"
            trendVelocity="high"
          />
          <PatternCard
            title="ASMR Unboxing Reversal"
            abstract="Plays the end result first, then rewinds to the unboxing experience. Utilizes sound design triggers for satisfaction."
            score={88}
            platform="youtube"
          />
          <PatternCard
            title="Carousel Storytelling"
            abstract="Uses slight image overlap to encourage swiping. Last slide contains a 'save this for later' CTA."
            score={91}
            platform="instagram"
            trendVelocity="medium"
          />
        </div>
      </div>

      {/* Marketplace Teaser */}
      <div className="bg-gradient-to-r from-indigo-900/50 to-slate-900 border border-indigo-500/30 rounded-2xl p-8 flex items-center justify-between">
        <div>
          <h3 className="text-2xl font-bold text-white mb-2">Explore the Marketplace</h3>
          <p className="text-slate-300 max-w-xl">
            Accelerate your growth with community-verified pattern packs.
            Unbox new hooks, visual structures, and storytelling frameworks.
          </p>
        </div>
        <a href="/marketplace" className="px-6 py-3 bg-white text-indigo-900 font-bold rounded-xl shadow-lg hover:bg-indigo-50 transition-colors">
          Browse Packs
        </a>
      </div>
    </div>
  );
}
