"use client";

import { useState, useCallback, useRef, useEffect } from 'react';
import dynamic from 'next/dynamic';
import Sidebar, { type ViewId }      from './Sidebar';
import Header                        from './Header';
import StatCards                     from './StatCards';
import RumorAnalyzer                 from './RumorAnalyzer';
import SocialPulse                   from './SocialPulse';
import CityOperations                from './CityOperations';
import LiveTicker                    from './LiveTicker';
import FeedGrid                      from './FeedGrid';
import SocialFeedView                from './SocialFeedView';
import NineOneOnePulseView           from './NineOneOnePulseView';
import WeatherAlertView              from './WeatherAlertView';
import ReportsView311                from './ReportsView311';
import CityTrendsView                from './CityTrendsView';
import LeaderboardView               from './LeaderboardView';
import SettingsView                  from './SettingsView';
import IncidentMapFullView           from './IncidentMapFullView';
import { ToastProvider }             from './ToastProvider';
import { useToast }                  from './ToastProvider';
import type { FeedItem }             from '@/lib/dashboardData';

const MapComponent = dynamic(() => import('./MapComponent'), { ssr: false });

const VIEW_TITLES: Record<ViewId, string> = {
  'rumor-analyzer': 'Rumor Analyzer',
  'social-feed':    'Live Social Feed',
  'incident-map':   'Incident Map',
  '911-pulse':      '911 Pulse',
  'weather-alert':  'Weather Alert',
  '311-reports':    '311 Reports',
  'city-trends':    'City Trends',
  'top-reporters':  'Top Reporters',
  'settings':       'Settings',
};

// ─── Rumor Analyzer full page view ────────────────────────────────────────
function RumorAnalyzerView({
  preloadedText, extraFeedItems, onNewAnalysis, onFeedItemClick, scrollTrigger, refreshKey, onScrollConsumed
}: {
  preloadedText: string;
  extraFeedItems: FeedItem[];
  onNewAnalysis: (txt: string, verdict: string, score: number) => void;
  onFeedItemClick: (txt: string) => void;
  scrollTrigger: number;
  refreshKey: number;
  onScrollConsumed: () => void;
}) {
  const { toast }   = useToast();
  const scrollRef   = useRef<HTMLDivElement>(null);
  const analyzerRef = useRef<HTMLDivElement>(null);

  // Intent-based scroll: Only scroll when scrollTrigger is updated
  useEffect(() => {
    if (scrollTrigger && analyzerRef.current && scrollRef.current) {
      const top = analyzerRef.current.offsetTop - 12;
      scrollRef.current.scrollTo({ top, behavior: 'smooth' });
      onScrollConsumed(); // Reset the trigger immediately after use
    }
  }, [scrollTrigger, onScrollConsumed]);

  return (
    <div ref={scrollRef} style={{ flex: 1, overflowY: 'auto', padding: '20px 24px' }}>
      {/* Stats - Re-mount on refresh to trigger animations */}
      <div style={{ marginBottom: 18 }}><StatCards /></div>

      {/* Live ticker */}
      <LiveTicker
        extraItems={extraFeedItems}
        label="SOCIAL PULSE LIVE"
        onItemClick={txt => { onFeedItemClick(txt); toast('📋', 'Loaded into analyzer — hit Analyze!'); }}
      />

      {/* 4-col feed grid */}
      <FeedGrid onItemClick={txt => { onFeedItemClick(txt); toast('📋', 'Loaded into analyzer — hit Analyze!'); }} />

      {/* Scroll anchor — just above the analyzer row */}
      <div ref={analyzerRef} />

      {/* Analyzer + Social Pulse */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 296px', gap: 16, marginBottom: 20 }}>
        <RumorAnalyzer preloadedText={preloadedText} onNewResult={onNewAnalysis} />
        <SocialPulse key={refreshKey} />
      </div>

      {/* City Operations */}
      <CityOperations key={refreshKey} />

      {/* Map */}
      <MapComponent key={refreshKey} />
    </div>
  );
}


// ─── Inner controller (needs ToastContext) ────────────────────────────────
function DashboardInner() {
  const { toast } = useToast();
  const [activeView, setActiveView]       = useState<ViewId>('rumor-analyzer');
  const [analyzerText, setAnalyzerText]   = useState('');
  const [extraFeed, setExtraFeed]         = useState<FeedItem[]>([]);
  const [refreshKey, setRefreshKey]       = useState(0);
  const [scrollTrigger, setScrollTrigger] = useState(0);

  // Global 2-minute re-verification timer
  useEffect(() => {
    const interval = setInterval(() => {
      setRefreshKey(prev => prev + 1);
      toast('📡', 'Civic Data Re-verified: Syncing all intelligence nodes...');
    }, 120000); // 2 minutes
    return () => clearInterval(interval);
  }, [toast]);

  const handleLoadToAnalyzer = useCallback((txt: string) => {
    setAnalyzerText(txt);
    setActiveView('rumor-analyzer');
    setScrollTrigger(Date.now()); // Explicitly trigger scroll intent
    toast('📋', 'Loaded into analyzer — hit ⚡ Analyze!');
  }, [toast]);

  const consumeScrollTrigger = useCallback(() => {
    setScrollTrigger(0);
  }, []);

  const handleNewAnalysis = useCallback((txt: string, verdict: string, score: number) => {
    const map: Record<string, 'v' | 'a' | 'c'> = { verified: 'v', caution: 'c', misinformation: 'a' };
    const v = map[verdict] || 'c';
    setExtraFeed(prev => [{
      src: '𝕏 Twitter', dot: '#1d9bf0', time: 'now',
      txt: txt.slice(0, 80), sc: score, v, cat: 'Analyze',
    }, ...prev].slice(0, 20));
  }, []);

  const renderView = () => {
    switch (activeView) {
      case 'rumor-analyzer':
        return (
          <RumorAnalyzerView
            preloadedText={analyzerText}
            extraFeedItems={extraFeed}
            onNewAnalysis={handleNewAnalysis}
            onFeedItemClick={handleLoadToAnalyzer}
            scrollTrigger={scrollTrigger}
            refreshKey={refreshKey}
            onScrollConsumed={consumeScrollTrigger}
          />
        );
      case 'social-feed':    return <SocialFeedView key={refreshKey} onLoadToAnalyzer={handleLoadToAnalyzer} />;
      case 'incident-map':   return <IncidentMapFullView key={refreshKey} />;
      case '911-pulse':      return <NineOneOnePulseView key={refreshKey} />;
      case 'weather-alert':  return <WeatherAlertView key={refreshKey} />;
      case '311-reports':    return <ReportsView311 key={refreshKey} />;
      case 'city-trends':    return <CityTrendsView key={refreshKey} />;
      case 'top-reporters':  return <LeaderboardView key={refreshKey} />;
      case 'settings':       return <SettingsView key={refreshKey} />;
      default:               return null;
    }
  };


  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden', background: '#f5f1ea', fontFamily: "'Figtree',sans-serif", color: '#1c1409' }}>
      <Sidebar activeView={activeView} onViewChange={setActiveView} />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, overflow: 'hidden' }}>
        <Header
          viewTitle={VIEW_TITLES[activeView]}
          onSubmitRumor={() => { setActiveView('rumor-analyzer'); setAnalyzerText(''); }}
        />
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          {renderView()}
        </div>
      </div>
    </div>
  );
}

// ─── Root — wraps everything in ToastProvider ──────────────────────────────
export default function Dashboard() {
  return (
    <ToastProvider>
      <DashboardInner />
    </ToastProvider>
  );
}
