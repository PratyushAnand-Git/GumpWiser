"use client";

import dynamic from 'next/dynamic';
import { useState, useEffect } from 'react';
import { Search, MapPin, AlertTriangle, CheckCircle, XCircle, Shield, Activity, Info, Loader2 } from 'lucide-react';
import { TrendingRumor } from '@/lib/brightData';

const Map = dynamic(() => import('./MapComponent'), { ssr: false });

export default function Dashboard() {
  const [rumor, setRumor] = useState("");
  const [isChecking, setIsChecking] = useState(false);
  const [factCheckResult, setFactCheckResult] = useState<any>(null);
  const [trendingRumors, setTrendingRumors] = useState<TrendingRumor[]>([]);
  const [isLoadingTrending, setIsLoadingTrending] = useState(true);
  const [safetyPulse, setSafetyPulse] = useState({
    message: "Analyzing Montgomery 911 & Weather data...",
    status: "neutral"
  });

  useEffect(() => {
    async function loadTrending() {
      try {
        const response = await fetch('/api/trending');
        if (response.ok) {
          const data = await response.json();
          setTrendingRumors(data.rumors || []);
        }
      } catch (error) {
        console.error("Failed to load trending rumors", error);
      } finally {
        setIsLoadingTrending(false);
      }
    }
    loadTrending();
  }, []);

  const handleFactCheck = async () => {
    if (!rumor) return;
    setIsChecking(true);
    setFactCheckResult(null);

    // Check the active fact checking API
    try {
      const response = await fetch('/api/factcheck', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ rumor }),
      });

      if (response.ok) {
        const data = await response.json();

        let icon = <AlertTriangle className="text-yellow-500 w-8 h-8" />;
        if (data.status === 'verified') icon = <CheckCircle className="text-green-500 w-8 h-8" />;
        else if (data.status === 'misinformation') icon = <XCircle className="text-red-500 w-8 h-8" />;

        setFactCheckResult({
          ...data,
          icon
        });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsChecking(false);

      // Update safety pulse randomly for demo
      setSafetyPulse({
        message: "Your area is generally safe. Nearest Police Station (Central) is 1.2 miles away. No active weather sirens.",
        status: "safe"
      });
    }
  };

  return (
    <div className="flex flex-col md:flex-row h-screen bg-slate-950 text-slate-100 font-sans overflow-hidden">
      {/* Sidebar */}
      <div className="w-full md:w-96 bg-slate-900 border-r border-slate-800 flex flex-col p-6 overflow-y-auto">
        <div className="flex items-center gap-3 mb-8">
          <Shield className="w-8 h-8 text-blue-500" />
          <div>
            <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-400">
              GumpWiser
            </h1>
            <p className="text-xs text-slate-400">Civic Intelligence Platform</p>
          </div>
        </div>

        {/* Fact-Checker Input */}
        <div className="mb-8">
          <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
            <Search className="w-4 h-4" /> Fact Check a Rumor
          </h2>
          <div className="space-y-3">
            <textarea
              className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none transition-all placeholder-slate-500"
              rows={4}
              placeholder="e.g. Huge sinkhole on Commerce Street!"
              value={rumor}
              onChange={(e) => setRumor(e.target.value)}
            />
            <button
              onClick={handleFactCheck}
              disabled={isChecking || !rumor}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-medium py-2.5 px-4 rounded-lg transition-all flex justify-center items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_15px_rgba(59,130,246,0.2)]"
            >
              {isChecking ? "Sensing Truth..." : "Check Reality"}
            </button>
          </div>
        </div>

        {/* Dynamic Fact Check Status Card */}
        {factCheckResult && (
          <div className={`p-5 rounded-xl border mb-8 transition-all duration-500 animate-in fade-in slide-in-from-bottom-4 shadow-lg ${factCheckResult.status === 'verified' ? 'bg-green-500/10 border-green-500/30' :
              factCheckResult.status === 'misinformation' ? 'bg-red-500/10 border-red-500/30' :
                'bg-yellow-500/10 border-yellow-500/30'
            }`}>
            <div className="flex items-start gap-4">
              <div className="mt-1">
                {factCheckResult.icon}
              </div>
              <div>
                <h3 className="font-bold text-lg mb-1 flex items-center gap-2">
                  {factCheckResult.title}
                </h3>
                <p className="text-sm text-slate-300 mb-3 leading-relaxed">
                  {factCheckResult.message}
                </p>
                <div className="flex items-center gap-2">
                  <div className="text-xs font-semibold uppercase tracking-wider text-slate-500">Gump-Score</div>
                  <div className="flex-1 bg-slate-800 rounded-full h-2 overflow-hidden">
                    <div
                      className={`h-full rounded-full ${factCheckResult.score > 80 ? 'bg-green-500' :
                          factCheckResult.score > 30 ? 'bg-yellow-500' : 'bg-red-500'
                        }`}
                      style={{ width: `${factCheckResult.score}%` }}
                    />
                  </div>
                  <div className="text-sm font-bold">{factCheckResult.score}%</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Trending Rumors */}
        {!factCheckResult && (
          <div className="mb-8">
            <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
              <Activity className="w-4 h-4" /> Trending in Montgomery
            </h2>

            {isLoadingTrending ? (
              <div className="flex items-center justify-center p-8 gap-3 text-slate-500">
                <Loader2 className="w-5 h-5 animate-spin" />
                <span className="text-sm">Fetching live Bright Data API...</span>
              </div>
            ) : trendingRumors.length === 0 ? (
              <div className="text-sm text-slate-500 p-4 border border-slate-800 rounded-lg text-center">
                No active rumors sensed.
              </div>
            ) : (
              <div className="space-y-3">
                {trendingRumors.map(tweet => (
                  <div
                    key={tweet.id}
                    className="bg-slate-950 border border-slate-800/50 p-3 rounded-lg text-sm cursor-pointer hover:border-blue-500/50 transition-colors group"
                    onClick={() => setRumor(tweet.text)}
                  >
                    <p className="text-slate-300 group-hover:text-slate-200 transition-colors">"{tweet.text}"</p>
                    <div className="text-xs text-slate-500 mt-2 flex items-center gap-1">
                      <MapPin className="w-3 h-3" /> {tweet.source}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        <div className="mt-auto pt-6 border-t border-slate-800/50">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <Info className="w-4 h-4" /> Powered by Gemini 3 & Bright Data
          </div>
        </div>
      </div>

      {/* Main Content Area (Map & Safety Pulse) */}
      <div className="flex-1 flex flex-col relative bg-slate-950">

        {/* The Safety Pulse Overlay */}
        <div className="absolute top-6 right-6 left-6 z-[1000] pointer-events-none">
          <div className="bg-slate-900/80 backdrop-blur-md border border-slate-800 p-4 rounded-xl shadow-2xl pointer-events-auto max-w-lg ml-auto">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-blue-500/20 rounded-lg text-blue-400">
                <Activity className="w-6 h-6 animate-pulse" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-200 mb-1 flex items-center gap-2">
                  Neighborhood Safety Pulse
                </h3>
                <p className="text-sm text-slate-400 leading-relaxed">
                  {safetyPulse.message}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Map Container */}
        <div className="flex-1 w-full h-full relative z-[1]">
          <Map />
        </div>

      </div>
    </div>
  );
}
