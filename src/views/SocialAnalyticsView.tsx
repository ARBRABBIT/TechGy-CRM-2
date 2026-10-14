import React, { useState, useMemo } from 'react';
import {
  LuShare2,
  LuVideo,
  LuFlame,
  LuTrendingUp,
  LuTriangleAlert,
  LuCircleX,
  LuCircleCheck,
  LuPlus,
  LuRefreshCw,
  LuDownload,
  LuEye,
  LuDollarSign,
  LuSearch,
  LuExternalLink,
  LuArrowUpRight,
  LuZap,
  LuX,
  LuCheck
} from 'react-icons/lu';
import {
  FaInstagram,
  FaLinkedin,
  FaYoutube,
  FaMeta,
  FaFacebook,
  FaXTwitter,
  FaTiktok
} from 'react-icons/fa6';
import {
  SocialAccount,
  SocialPost,
  INITIAL_SOCIAL_ACCOUNTS,
  INITIAL_SOCIAL_POSTS,
  computeSocialSummary,
  exportSocialAnalysisCsv
} from '../data/socialData';
import { triggerFileDownload } from '../utils/heatmapEngine';

export function getPlatformConfig(platform: string) {
  switch (platform.toLowerCase()) {
    case 'instagram':
      return {
        name: 'Instagram',
        Icon: FaInstagram,
        color: '#E1306C',
        bg: '#FDF2F8',
        borderColor: '#FBCFE8',
        badgeBg: 'linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)'
      };
    case 'linkedin':
      return {
        name: 'LinkedIn',
        Icon: FaLinkedin,
        color: '#0A66C2',
        bg: '#EFF6FF',
        borderColor: '#BFDBFE',
        badgeBg: '#0A66C2'
      };
    case 'youtube':
      return {
        name: 'YouTube',
        Icon: FaYoutube,
        color: '#FF0000',
        bg: '#FEF2F2',
        borderColor: '#FECACA',
        badgeBg: '#FF0000'
      };
    case 'meta':
      return {
        name: 'Meta / Facebook',
        Icon: FaMeta,
        color: '#0668E1',
        bg: '#EFF6FF',
        borderColor: '#BFDBFE',
        badgeBg: 'linear-gradient(135deg, #0081FB 0%, #0064E0 100%)'
      };
    case 'facebook':
      return {
        name: 'Facebook',
        Icon: FaFacebook,
        color: '#1877F2',
        bg: '#EFF6FF',
        borderColor: '#BFDBFE',
        badgeBg: '#1877F2'
      };
    case 'x':
      return {
        name: 'X (Twitter)',
        Icon: FaXTwitter,
        color: '#0F172A',
        bg: '#F8FAFC',
        borderColor: '#CBD5E1',
        badgeBg: '#0F172A'
      };
    case 'tiktok':
      return {
        name: 'TikTok',
        Icon: FaTiktok,
        color: '#000000',
        bg: '#F8FAFC',
        borderColor: '#CBD5E1',
        badgeBg: 'linear-gradient(135deg, #000000 0%, #25F4EE 50%, #FE2C55 100%)'
      };
    default:
      return {
        name: platform,
        Icon: FaMeta,
        color: '#557396',
        bg: '#F1F5F9',
        borderColor: '#CBD5E1',
        badgeBg: '#557396'
      };
  }
}

interface SocialAnalyticsViewProps {
  onSelectLead?: (lead: { id: string; client: string; company: string }) => void;
}

export default function SocialAnalyticsView({ onSelectLead }: SocialAnalyticsViewProps) {
  // Accounts & Posts State
  const [accounts, setAccounts] = useState<SocialAccount[]>(INITIAL_SOCIAL_ACCOUNTS);
  const [posts] = useState<SocialPost[]>(INITIAL_SOCIAL_POSTS);

  // Filters State
  const [selectedVerdictFilter, setSelectedVerdictFilter] = useState<'all' | 'working' | 'average' | 'not_working'>('all');
  const [selectedFormatFilter, setSelectedFormatFilter] = useState<string>('all');
  const [selectedPlatformFilter, setSelectedPlatformFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [syncNotice, setSyncNotice] = useState<string | null>(null);

  // Modals State
  const [inspectingPost, setInspectingPost] = useState<SocialPost | null>(null);
  const [showConnectModal, setShowConnectModal] = useState<boolean>(false);
  const [connectingPlatform, setConnectingPlatform] = useState<string>('instagram');
  const [connectHandleInput, setConnectHandleInput] = useState<string>('@techgylink');
  const [connectSuccess, setConnectSuccess] = useState<boolean>(false);

  // Computed Summary
  const summary = useMemo(() => computeSocialSummary(posts), [posts]);

  // Filtered Posts
  const filteredPosts = useMemo(() => {
    return posts.filter(post => {
      if (selectedVerdictFilter !== 'all' && post.verdict !== selectedVerdictFilter) {
        return false;
      }
      if (selectedFormatFilter !== 'all' && post.format !== selectedFormatFilter) {
        return false;
      }
      if (selectedPlatformFilter !== 'all' && post.platform !== selectedPlatformFilter) {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = post.title.toLowerCase().includes(q);
        const matchesCaption = post.captionExcerpt.toLowerCase().includes(q);
        const matchesFormat = post.formatLabel.toLowerCase().includes(q);
        const matchesClient = post.topLeadClient?.toLowerCase().includes(q);
        if (!matchesTitle && !matchesCaption && !matchesFormat && !matchesClient) {
          return false;
        }
      }
      return true;
    });
  }, [posts, selectedVerdictFilter, selectedFormatFilter, selectedPlatformFilter, searchQuery]);

  // Sync Analytics Action
  const handleSyncAnalytics = () => {
    setIsSyncing(true);
    setSyncNotice('Connecting to social platform APIs (Instagram Graph, LinkedIn v2, YouTube Data v3)...');
    setTimeout(() => {
      setIsSyncing(false);
      setAccounts(prev => prev.map(a => a.connected ? { ...a, lastSynced: 'Just now' } : a));
      setSyncNotice('✓ All social analytics synced successfully (9 posts & videos analyzed with latest retention telemetry)');
      setTimeout(() => setSyncNotice(null), 4000);
    }, 1400);
  };

  // Toggle Account Connection
  const handleToggleConnect = (accountId: string) => {
    setAccounts(prev => prev.map(acc => {
      if (acc.id === accountId) {
        const nextConnected = !acc.connected;
        return {
          ...acc,
          connected: nextConnected,
          tokenStatus: nextConnected ? 'valid' : 'disconnected',
          lastSynced: nextConnected ? 'Just now' : 'Disconnected'
        };
      }
      return acc;
    }));
  };

  // Connect New Account Modal Submit
  const handleConnectSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAccounts(prev => prev.map(acc => {
      if (acc.platform === connectingPlatform) {
        return {
          ...acc,
          connected: true,
          handle: connectHandleInput || acc.handle,
          tokenStatus: 'valid',
          lastSynced: 'Just now',
          connectedAt: new Date().toISOString().split('T')[0]
        };
      }
      return acc;
    }));
    setConnectSuccess(true);
    setTimeout(() => {
      setConnectSuccess(false);
      setShowConnectModal(false);
    }, 1200);
  };

  // Export CSV
  const handleExportCsv = () => {
    const csv = exportSocialAnalysisCsv(filteredPosts);
    triggerFileDownload(`techgy-social-analysis-${Date.now()}.csv`, csv, 'text/csv;charset=utf-8;');
  };

  return (
    <div className="integ-page">
      {/* Top Header */}
      <div className="integ-header">
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <span style={{ background: '#EFF6FF', color: '#1D4ED8', border: '1px solid #BFDBFE', padding: '2px 8px', borderRadius: 'var(--radius-popup, 3px)', fontSize: '12px', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
              <LuShare2 size={14} />
              <span>Social Content Intelligence</span>
            </span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: '#059669', fontWeight: 600 }}>
              <LuCircleCheck size={14} />
              <span>{accounts.filter(a => a.connected).length} of {accounts.length} Platforms Connected</span>
            </span>
          </div>
          <h2 className="integ-title">Social Content &amp; Video Performance Analysis</h2>
          <p className="integ-subtitle">
            Connect your social media accounts to track what posts and videos are working vs underperforming, with viewer retention drop-off diagnostics and closed-loop CRM sales attribution.
          </p>
        </div>

        {/* Action Header Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          <button
            type="button"
            className="btn-primary btn-sm"
            onClick={() => setShowConnectModal(true)}
            title="Connect a social account"
          >
            <LuPlus size={14} />
            <span>Connect Social Account</span>
          </button>

          <button
            type="button"
            className={`btn-secondary btn-sm ${isSyncing ? 'active' : ''}`}
            onClick={handleSyncAnalytics}
            disabled={isSyncing}
            title="Re-fetch latest video retention telemetry from connected platforms"
          >
            <LuRefreshCw size={14} className={isSyncing ? 'heatmap-spin' : ''} />
            <span>{isSyncing ? 'Syncing...' : 'Sync Live Analytics'}</span>
          </button>

          <button
            type="button"
            className="btn-secondary btn-sm"
            onClick={handleExportCsv}
            title="Export full post analysis report as CSV"
          >
            <LuDownload size={14} />
            <span>Export Report (CSV)</span>
          </button>
        </div>
      </div>

      {/* Sync Notification Banner */}
      {syncNotice && (
        <div className="heatmap-live-banner" role="status" style={{ background: '#EFF6FF', borderColor: '#BFDBFE' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#1D4ED8', fontWeight: 600, fontSize: '13px' }}>
            <LuRefreshCw size={15} className={isSyncing ? 'heatmap-spin' : ''} />
            <span>{syncNotice}</span>
          </div>
          <span style={{ fontSize: '11px', color: '#1E40AF', fontWeight: 700 }}>LIVE SYNC</span>
        </div>
      )}

      {/* Section 1: Connected Social Platforms Bar */}
      <section className="section-card" style={{ padding: '16px 20px', marginBottom: '1.25rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px', flexWrap: 'wrap', gap: '8px' }}>
          <div>
            <h3 style={{ margin: 0, fontSize: '0.9375rem', fontWeight: 800, color: '#0F1A34' }}>
              Connected Social Accounts ({accounts.filter(a => a.connected).length}/{accounts.length})
            </h3>
            <span style={{ fontSize: '12px', color: '#557396' }}>
              Real-time webhook and API connection status for TechGy Link social channels.
            </span>
          </div>

          <button
            type="button"
            className="btn-secondary btn-sm"
            onClick={() => setShowConnectModal(true)}
          >
            <LuPlus size={13} />
            <span>Add / Switch Channel</span>
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '12px' }}>
          {accounts.map(acc => {
            const isConnected = acc.connected;
            const pConf = getPlatformConfig(acc.platform);
            const OrgIcon = pConf.Icon;
            return (
              <div
                key={acc.id}
                style={{
                  background: isConnected ? '#FFFFFF' : '#F8FAFC',
                  border: isConnected ? '1px solid #CBD5E1' : '1px dashed #CBD5E1',
                  borderRadius: 'var(--radius-popup, 3px)',
                  padding: '14px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '10px',
                  boxShadow: isConnected ? '0 1px 3px rgba(0,0,0,0.04)' : 'none'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div
                      aria-label={`${pConf.name} official logo`}
                      title={`${pConf.name} official logo`}
                      style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: 'var(--radius-popup, 3px)',
                        background: pConf.badgeBg,
                        color: '#FFFFFF',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                        boxShadow: '0 2px 4px rgba(0,0,0,0.12)'
                      }}
                    >
                      <OrgIcon size={18} />
                    </div>
                    <div>
                      <strong style={{ fontSize: '13px', color: '#0F1A34', display: 'block', lineHeight: 1.2 }}>
                        {acc.platformName}
                      </strong>
                      <span style={{ fontSize: '11px', color: '#557396' }}>
                        {acc.handle}
                      </span>
                    </div>
                  </div>

                  <span style={{
                    fontSize: '11px',
                    fontWeight: 700,
                    padding: '2px 6px',
                    borderRadius: 'var(--radius-popup, 3px)',
                    background: isConnected ? '#ECFDF5' : '#F1F5F9',
                    color: isConnected ? '#059669' : '#64748B',
                    border: isConnected ? '1px solid #A7F3D0' : '1px solid #E2E8F0'
                  }}>
                    {isConnected ? 'Connected' : 'Offline'}
                  </span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '11px', color: '#557396' }}>
                  <span>Followers: <strong style={{ color: '#0F1A34' }}>{acc.followers.toLocaleString()}</strong></span>
                  <span style={{ color: '#059669', fontWeight: 600 }}>{acc.followersGrowth}</span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid #F1F5F9', paddingTop: '8px', fontSize: '11px' }}>
                  <span style={{ color: '#64748B' }}>
                    {isConnected ? `Synced: ${acc.lastSynced}` : 'No API key'}
                  </span>
                  <button
                    type="button"
                    style={{
                      background: 'none',
                      border: 'none',
                      color: isConnected ? '#DC2626' : '#0022FF',
                      fontSize: '11px',
                      fontWeight: 700,
                      cursor: 'pointer',
                      padding: 0
                    }}
                    onClick={() => handleToggleConnect(acc.id)}
                  >
                    {isConnected ? 'Disconnect' : 'Connect'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Section 2: Executive Scorecard ("What is Working vs Not Working") */}
      <div className="heatmap-kpi-grid">
        <div className="heatmap-kpi-card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '11px', fontWeight: 700, color: '#557396', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Content Analyzed
            </span>
            <span className="heatmap-badge-blue">{summary.totalAnalyzed} Posts &amp; Videos</span>
          </div>
          <div style={{ fontSize: '24px', fontWeight: 800, color: '#0F1A34', letterSpacing: '-0.02em' }}>
            {summary.workingCount} Working <span style={{ fontSize: '14px', fontWeight: 600, color: '#059669' }}>({Math.round((summary.workingCount / summary.totalAnalyzed) * 100)}%)</span>
          </div>
          <div style={{ fontSize: '12px', color: '#557396', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ color: '#059669', fontWeight: 700 }}>● {summary.workingCount} Working</span>
            <span>&bull;</span>
            <span style={{ color: '#D97706', fontWeight: 700 }}>● {summary.averageCount} Average</span>
            <span>&bull;</span>
            <span style={{ color: '#DC2626', fontWeight: 700 }}>● {summary.notWorkingCount} Underperforming</span>
          </div>
        </div>

        <div className="heatmap-kpi-card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '11px', fontWeight: 700, color: '#557396', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Total Video Views &amp; Reach
            </span>
            <span className="heatmap-badge-green">High Attention</span>
          </div>
          <div style={{ fontSize: '24px', fontWeight: 800, color: '#0F1A34', letterSpacing: '-0.02em' }}>
            {summary.totalViews.toLocaleString()}
          </div>
          <div style={{ fontSize: '12px', color: '#557396', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <LuEye size={13} />
            <span>{summary.totalImpressions.toLocaleString()} impressions &bull; {summary.totalEngagements.toLocaleString()} engagements</span>
          </div>
        </div>

        <div className="heatmap-kpi-card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '11px', fontWeight: 700, color: '#557396', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Average 3s Hook Rate
            </span>
            <span className="heatmap-badge-orange">{summary.avgHookRate}% Retained</span>
          </div>
          <div style={{ fontSize: '24px', fontWeight: 800, color: '#0F1A34', letterSpacing: '-0.02em' }}>
            {summary.avgHookRate}% Retention
          </div>
          <div style={{ fontSize: '12px', color: '#557396', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <LuTrendingUp size={13} />
            <span>Working posts avg 76% vs underperforming avg 24%</span>
          </div>
        </div>

        <div className="heatmap-kpi-card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '11px', fontWeight: 700, color: '#557396', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Attributed CRM Pipeline
            </span>
            <span className="heatmap-badge-purple">{summary.totalAttributedLeads} Inbound Leads</span>
          </div>
          <div style={{ fontSize: '24px', fontWeight: 800, color: '#059669', letterSpacing: '-0.02em' }}>
            {summary.totalAttributedPipeline}
          </div>
          <div style={{ fontSize: '12px', color: '#557396', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <LuDollarSign size={13} />
            <span>Closed-loop sales deals directly sourced from social content</span>
          </div>
        </div>
      </div>

      {/* Section 3: Filter & Control Toolbar */}
      <div className="heatmap-controls-bar" style={{ marginTop: '1.25rem', marginBottom: '1.25rem' }}>
        {/* Verdict Filter */}
        <div className="heatmap-control-group">
          <span style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#0F1A34' }}>Performance Verdict:</span>
          <div className="heatmap-segmented-btn-group" role="group" aria-label="Verdict Filter">
            <button
              type="button"
              className={`heatmap-segmented-btn ${selectedVerdictFilter === 'all' ? 'active' : ''}`}
              onClick={() => setSelectedVerdictFilter('all')}
            >
              All Content ({posts.length})
            </button>
            <button
              type="button"
              className={`heatmap-segmented-btn ${selectedVerdictFilter === 'working' ? 'active' : ''}`}
              onClick={() => setSelectedVerdictFilter('working')}
              style={{ color: selectedVerdictFilter === 'working' ? '#059669' : undefined }}
            >
              <LuFlame size={13} style={{ color: '#059669' }} />
              <span>Working ({summary.workingCount})</span>
            </button>
            <button
              type="button"
              className={`heatmap-segmented-btn ${selectedVerdictFilter === 'average' ? 'active' : ''}`}
              onClick={() => setSelectedVerdictFilter('average')}
              style={{ color: selectedVerdictFilter === 'average' ? '#D97706' : undefined }}
            >
              <LuTriangleAlert size={13} style={{ color: '#D97706' }} />
              <span>Average ({summary.averageCount})</span>
            </button>
            <button
              type="button"
              className={`heatmap-segmented-btn ${selectedVerdictFilter === 'not_working' ? 'active' : ''}`}
              onClick={() => setSelectedVerdictFilter('not_working')}
              style={{ color: selectedVerdictFilter === 'not_working' ? '#DC2626' : undefined }}
            >
              <LuCircleX size={13} style={{ color: '#DC2626' }} />
              <span>Not Working ({summary.notWorkingCount})</span>
            </button>
          </div>
        </div>

        {/* Format Filter */}
        <div className="heatmap-control-group">
          <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#557396' }}>Format:</span>
          <select
            className="form-select"
            style={{ width: 'auto', fontSize: '0.8125rem' }}
            value={selectedFormatFilter}
            onChange={(e) => setSelectedFormatFilter(e.target.value)}
            aria-label="Filter Content Format"
          >
            <option value="all">All Formats</option>
            <option value="reel">Reels / Shorts (Vertical)</option>
            <option value="video">Long-Form Videos</option>
            <option value="carousel">Carousels</option>
            <option value="static">Static Posts</option>
          </select>
        </div>

        {/* Platform Filter with Official Brand Icons */}
        <div className="heatmap-control-group" style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#557396' }}>Platform:</span>
          <div className="heatmap-segmented-control" role="group" aria-label="Platform Filter Controls">
            <button
              type="button"
              className={`heatmap-segmented-btn ${selectedPlatformFilter === 'all' ? 'active' : ''}`}
              onClick={() => setSelectedPlatformFilter('all')}
            >
              <span>All</span>
            </button>
            <button
              type="button"
              className={`heatmap-segmented-btn ${selectedPlatformFilter === 'instagram' ? 'active' : ''}`}
              onClick={() => setSelectedPlatformFilter('instagram')}
              style={{ color: selectedPlatformFilter === 'instagram' ? '#E1306C' : undefined }}
              title="Filter Instagram posts"
            >
              <FaInstagram size={13} style={{ color: '#E1306C' }} />
              <span>Instagram</span>
            </button>
            <button
              type="button"
              className={`heatmap-segmented-btn ${selectedPlatformFilter === 'linkedin' ? 'active' : ''}`}
              onClick={() => setSelectedPlatformFilter('linkedin')}
              style={{ color: selectedPlatformFilter === 'linkedin' ? '#0A66C2' : undefined }}
              title="Filter LinkedIn posts"
            >
              <FaLinkedin size={13} style={{ color: '#0A66C2' }} />
              <span>LinkedIn</span>
            </button>
            <button
              type="button"
              className={`heatmap-segmented-btn ${selectedPlatformFilter === 'youtube' ? 'active' : ''}`}
              onClick={() => setSelectedPlatformFilter('youtube')}
              style={{ color: selectedPlatformFilter === 'youtube' ? '#FF0000' : undefined }}
              title="Filter YouTube videos"
            >
              <FaYoutube size={13} style={{ color: '#FF0000' }} />
              <span>YouTube</span>
            </button>
            <button
              type="button"
              className={`heatmap-segmented-btn ${selectedPlatformFilter === 'meta' ? 'active' : ''}`}
              onClick={() => setSelectedPlatformFilter('meta')}
              style={{ color: selectedPlatformFilter === 'meta' ? '#0668E1' : undefined }}
              title="Filter Meta / Facebook posts"
            >
              <FaMeta size={13} style={{ color: '#0668E1' }} />
              <span>Meta</span>
            </button>
            <button
              type="button"
              className={`heatmap-segmented-btn ${selectedPlatformFilter === 'x' ? 'active' : ''}`}
              onClick={() => setSelectedPlatformFilter('x')}
              style={{ color: selectedPlatformFilter === 'x' ? '#0F1A34' : undefined }}
              title="Filter X posts"
            >
              <FaXTwitter size={13} style={{ color: '#0F1A34' }} />
              <span>X</span>
            </button>
          </div>
          <select
            className="form-select sr-only"
            style={{ position: 'absolute', width: '1px', height: '1px', padding: 0, margin: '-1px', overflow: 'hidden', clip: 'rect(0, 0, 0, 0)', border: 0 }}
            value={selectedPlatformFilter}
            onChange={(e) => setSelectedPlatformFilter(e.target.value)}
            aria-label="Filter Platform"
          >
            <option value="all">All Platforms</option>
            <option value="instagram">Instagram</option>
            <option value="linkedin">LinkedIn</option>
            <option value="youtube">YouTube</option>
            <option value="meta">Meta / Facebook</option>
            <option value="x">X (Twitter)</option>
          </select>
        </div>

        {/* Live Search */}
        <div style={{ position: 'relative', width: '240px' }}>
          <LuSearch size={14} style={{ position: 'absolute', left: '10px', top: '10px', color: '#557396' }} />
          <input
            type="text"
            className="form-input"
            style={{ paddingLeft: '32px', height: '34px', fontSize: '0.8125rem' }}
            placeholder="Search posts, clients..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            aria-label="Search content"
          />
        </div>
      </div>

      {/* Section 4: Detailed Post & Video Diagnostic Cards ("What is Working and What is Not") */}
      <section className="section-card" style={{ marginBottom: '1.25rem' }}>
        <div className="integ-recent-head" style={{ marginBottom: '1rem', flexWrap: 'wrap', gap: '8px' }}>
          <div>
            <h3 className="section-title">
              Content Diagnostic Matrix &mdash; Showing {filteredPosts.length} of {posts.length} Analyzed
            </h3>
            <span style={{ fontSize: '0.8125rem', color: '#557396' }}>
              Deep automated diagnosis explaining <strong>why specific videos and posts worked</strong> (high watch time, B2B shares, qualified pipeline) vs <strong>why others failed</strong> (hook drop-off, corporate logo lag, missing CTA).
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px' }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', color: '#059669', fontWeight: 700 }}>
              <LuCircleCheck size={13} />
              <span>Attribution Verified</span>
            </span>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {filteredPosts.map(post => {
            const isWorking = post.verdict === 'working';
            const isNotWorking = post.verdict === 'not_working';

            return (
              <div
                key={post.id}
                style={{
                  border: isWorking ? '1px solid #A7F3D0' : isNotWorking ? '1px solid #FECACA' : '1px solid #FED7AA',
                  background: isWorking ? '#F0FDF4' : isNotWorking ? '#FEF2F2' : '#FFFBEB',
                  borderRadius: 'var(--radius-popup, 3px)',
                  padding: '18px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '14px',
                  boxShadow: '0 1px 4px rgba(0,0,0,0.03)'
                }}
              >
                {/* Header Row: Title, Verdict, Format, Platform */}
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '16px', flexWrap: 'wrap' }}>
                  <div style={{ flex: 1, minWidth: '280px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px', flexWrap: 'wrap' }}>
                      <span style={{
                        fontSize: '11px',
                        fontWeight: 800,
                        padding: '3px 8px',
                        borderRadius: 'var(--radius-popup, 3px)',
                        background: isWorking ? '#059669' : isNotWorking ? '#DC2626' : '#D97706',
                        color: '#FFFFFF',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px'
                      }}>
                        {isWorking ? <LuFlame size={12} /> : isNotWorking ? <LuCircleX size={12} /> : <LuTriangleAlert size={12} />}
                        <span>{post.verdictTitle}</span>
                      </span>

                      <span style={{
                        fontSize: '11px',
                        fontWeight: 700,
                        padding: '2px 8px',
                        background: '#FFFFFF',
                        border: '1px solid #E2E8F0',
                        borderRadius: 'var(--radius-popup, 3px)',
                        color: '#0F1A34',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px'
                      }}>
                        <LuVideo size={12} />
                        <span>{post.formatLabel} {post.duration ? `(${post.duration})` : ''}</span>
                      </span>

                      {(() => {
                        const pConf = getPlatformConfig(post.platform);
                        const OrgIcon = pConf.Icon;
                        return (
                          <span
                            title={`Published on ${pConf.name}`}
                            style={{
                              fontSize: '11px',
                              fontWeight: 700,
                              padding: '2px 8px',
                              background: pConf.bg,
                              border: `1px solid ${pConf.borderColor}`,
                              borderRadius: 'var(--radius-popup, 3px)',
                              color: pConf.color,
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '5px'
                            }}
                          >
                            <OrgIcon size={12} />
                            <span>{pConf.name}</span>
                          </span>
                        );
                      })()}

                      <span style={{ fontSize: '11px', color: '#557396', fontWeight: 500 }}>
                        &bull; Published {post.publishedAt}
                      </span>
                    </div>

                    <h4 style={{ margin: '4px 0 6px', fontSize: '1.0625rem', fontWeight: 800, color: '#0F1A34', lineHeight: 1.35 }}>
                      {post.title}
                    </h4>

                    <p style={{ margin: 0, fontSize: '13px', color: '#475569', lineHeight: 1.5 }}>
                      &ldquo;{post.captionExcerpt}&rdquo;
                    </p>
                  </div>

                  {/* Quick Action Buttons */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    {post.dropOffPoints && post.dropOffPoints.length > 0 && (
                      <button
                        type="button"
                        className="btn-secondary btn-sm"
                        onClick={() => setInspectingPost(post)}
                        title="Inspect second-by-second viewer retention curve"
                        style={{ background: '#FFFFFF' }}
                      >
                        <LuTrendingUp size={13} style={{ color: '#0022FF' }} />
                        <span>Inspect Retention Curve</span>
                      </button>
                    )}

                    {(() => {
                      const pConf = getPlatformConfig(post.platform);
                      const OrgIcon = pConf.Icon;
                      return (
                        <a
                          href={post.postUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn-secondary btn-sm"
                          style={{ textDecoration: 'none', background: '#FFFFFF', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                          title={`View live post on ${pConf.name}`}
                        >
                          <OrgIcon size={13} style={{ color: pConf.color }} />
                          <span>View Post</span>
                          <LuExternalLink size={11} style={{ opacity: 0.6 }} />
                        </a>
                      );
                    })()}
                  </div>
                </div>

                {/* Metrics Breakdown Bar */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
                  gap: '10px',
                  background: '#FFFFFF',
                  padding: '12px 14px',
                  borderRadius: 'var(--radius-popup, 3px)',
                  border: '1px solid rgba(0,0,0,0.06)'
                }}>
                  <div>
                    <span style={{ fontSize: '11px', color: '#64748B', display: 'block' }}>Views / Reach</span>
                    <strong style={{ fontSize: '15px', color: '#0F1A34' }}>{post.views.toLocaleString()}</strong>
                  </div>

                  {typeof post.hookRate === 'number' && (
                    <div>
                      <span style={{ fontSize: '11px', color: '#64748B', display: 'block' }}>3s Hook Rate</span>
                      <strong style={{ fontSize: '15px', color: post.hookRate > 65 ? '#059669' : post.hookRate > 40 ? '#D97706' : '#DC2626' }}>
                        {post.hookRate}%
                      </strong>
                    </div>
                  )}

                  {typeof post.completionRate === 'number' && (
                    <div>
                      <span style={{ fontSize: '11px', color: '#64748B', display: 'block' }}>Completion %</span>
                      <strong style={{ fontSize: '15px', color: '#0F1A34' }}>{post.completionRate}%</strong>
                    </div>
                  )}

                  <div>
                    <span style={{ fontSize: '11px', color: '#64748B', display: 'block' }}>Engagement</span>
                    <strong style={{ fontSize: '15px', color: '#0F1A34' }}>{post.engagementRate}%</strong>
                    <span style={{ fontSize: '10px', color: '#64748B', marginLeft: '4px' }}>({post.shares} shares)</span>
                  </div>

                  <div>
                    <span style={{ fontSize: '11px', color: '#64748B', display: 'block' }}>Inbound CRM Leads</span>
                    <strong style={{ fontSize: '15px', color: post.attributedLeads > 0 ? '#059669' : '#64748B' }}>
                      {post.attributedLeads} Leads
                    </strong>
                  </div>

                  <div>
                    <span style={{ fontSize: '11px', color: '#64748B', display: 'block' }}>Attributed Pipeline</span>
                    <strong style={{ fontSize: '15px', color: post.attributedLeads > 0 ? '#059669' : '#64748B' }}>
                      {post.attributedPipelineValue}
                    </strong>
                  </div>
                </div>

                {/* AI Diagnostic: Why It's Working vs Why It's Not Working */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '14px' }}>
                  {/* Working Reasons */}
                  {post.workingReasons.length > 0 && (
                    <div style={{ background: '#FFFFFF', padding: '12px 14px', borderRadius: 'var(--radius-popup, 3px)', border: '1px solid #BBF7D0' }}>
                      <span style={{ fontSize: '11px', fontWeight: 800, color: '#059669', textTransform: 'uppercase', letterSpacing: '0.04em', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <LuCircleCheck size={13} />
                        <span>Why This Content Is Working</span>
                      </span>
                      <ul style={{ margin: '8px 0 0', paddingLeft: '18px', fontSize: '12px', color: '#334155', lineHeight: 1.55 }}>
                        {post.workingReasons.map((reason, idx) => (
                          <li key={idx} style={{ marginBottom: '4px' }}>{reason}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Failure / Bottleneck Reasons */}
                  {post.failureReasons.length > 0 && (
                    <div style={{ background: '#FFFFFF', padding: '12px 14px', borderRadius: 'var(--radius-popup, 3px)', border: '1px solid #FECACA' }}>
                      <span style={{ fontSize: '11px', fontWeight: 800, color: '#DC2626', textTransform: 'uppercase', letterSpacing: '0.04em', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <LuCircleX size={13} />
                        <span>Why This Content Underperformed</span>
                      </span>
                      <ul style={{ margin: '8px 0 0', paddingLeft: '18px', fontSize: '12px', color: '#334155', lineHeight: 1.55 }}>
                        {post.failureReasons.map((reason, idx) => (
                          <li key={idx} style={{ marginBottom: '4px' }}>{reason}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                {/* Actionable Strategic Fix */}
                <div style={{
                  background: '#FFFFFF',
                  padding: '10px 14px',
                  borderRadius: 'var(--radius-popup, 3px)',
                  border: '1px solid #E2E8F0',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: '8px'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <LuZap size={14} style={{ color: '#D97706', flexShrink: 0 }} />
                    <span style={{ fontSize: '12px', color: '#0F1A34' }}>
                      <strong>Actionable Recommendation:</strong> {post.actionableRecommendation}
                    </span>
                  </div>

                  {post.topLeadClient && (
                    <span style={{ fontSize: '11px', color: '#10529C', background: '#EAF2FB', padding: '2px 8px', borderRadius: 'var(--radius-popup, 3px)', fontWeight: 600 }}>
                      Generated Deal: {post.topLeadClient}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Section 5: Strategic Content Playbook Summary */}
      <section className="section-card">
        <div className="integ-recent-head" style={{ marginBottom: '1rem' }}>
          <div>
            <h3 className="section-title">Automated Strategic Content Playbook &mdash; Key Rules</h3>
            <span style={{ fontSize: '0.8125rem', color: '#557396' }}>
              Actionable formulas distilled directly from your verified social performance data across Instagram, LinkedIn, and YouTube.
            </span>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '16px' }}>
          {/* Winning Formulas */}
          <div style={{ background: '#F0FDF4', border: '1px solid #BBF7D0', padding: '16px', borderRadius: 'var(--radius-popup, 3px)' }}>
            <h4 style={{ margin: '0 0 10px', fontSize: '14px', fontWeight: 800, color: '#065F46', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <LuCircleCheck size={16} />
              <span>3 Content Types That Are Working (Scale These)</span>
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '12px', color: '#1F2937' }}>
              <div style={{ background: '#FFFFFF', padding: '10px', borderRadius: 'var(--radius-popup, 3px)', border: '1px solid #E2E8F0' }}>
                <strong style={{ color: '#059669', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <FaInstagram size={14} style={{ color: '#E1306C' }} />
                  <span>1. Real Client Revenue Numbers in First 1.5s</span>
                </strong>
                <p style={{ margin: '4px 0 0', color: '#475569' }}>
                  Leading with verified outcomes (e.g. &ldquo;₹180Cr in plot sales within 90 days for GLC&rdquo;) achieved a 79.2% hook pass rate and 18 inbound leads.
                </p>
              </div>
              <div style={{ background: '#FFFFFF', padding: '10px', borderRadius: 'var(--radius-popup, 3px)', border: '1px solid #E2E8F0' }}>
                <strong style={{ color: '#059669', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <FaYoutube size={14} style={{ color: '#FF0000' }} />
                  <span>2. Side-by-Side 3D Walkthrough Comparisons</span>
                </strong>
                <p style={{ margin: '4px 0 0', color: '#475569' }}>
                  Comparing flat 2D brochures with interactive 3D balcony/hall walkthroughs (Reliance Builders) delivered 98K views and 81% completion.
                </p>
              </div>
              <div style={{ background: '#FFFFFF', padding: '10px', borderRadius: 'var(--radius-popup, 3px)', border: '1px solid #E2E8F0' }}>
                <strong style={{ color: '#059669', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <FaLinkedin size={14} style={{ color: '#0A66C2' }} />
                  <span>3. Tactical B2B Lead Routing Teardowns on LinkedIn</span>
                </strong>
                <p style={{ margin: '4px 0 0', color: '#475569' }}>
                  Showing real webhook routing into TechGy CRM solved immediate pain for Sales Heads, generating 14 direct enterprise inquiries.
                </p>
              </div>
            </div>
          </div>

          {/* Underperforming Formats to Stop */}
          <div style={{ background: '#FEF2F2', border: '1px solid #FECACA', padding: '16px', borderRadius: 'var(--radius-popup, 3px)' }}>
            <h4 style={{ margin: '0 0 10px', fontSize: '14px', fontWeight: 800, color: '#991B1B', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <LuCircleX size={16} />
              <span>3 Formats to Stop or Fix Immediately</span>
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '12px', color: '#1F2937' }}>
              <div style={{ background: '#FFFFFF', padding: '10px', borderRadius: 'var(--radius-popup, 3px)', border: '1px solid #E2E8F0' }}>
                <strong style={{ color: '#DC2626', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <FaInstagram size={14} style={{ color: '#E1306C' }} />
                  <span>1. Animated Logo Intros in First 5 Seconds</span>
                </strong>
                <p style={{ margin: '4px 0 0', color: '#475569' }}>
                  The rebrand Reel had 78.6% of viewers swipe away before second 3 because of a spinning logo intro. Always cut directly to the core problem.
                </p>
              </div>
              <div style={{ background: '#FFFFFF', padding: '10px', borderRadius: 'var(--radius-popup, 3px)', border: '1px solid #E2E8F0' }}>
                <strong style={{ color: '#DC2626', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <FaXTwitter size={14} style={{ color: '#0F1A34' }} />
                  <span>2. Generic Calendar Holiday Greetings</span>
                </strong>
                <p style={{ margin: '4px 0 0', color: '#475569' }}>
                  &ldquo;Happy World Architecture Day&rdquo; achieved zero leads and minimal reach (2.1K impressions). Replace with real project milestone breakdowns.
                </p>
              </div>
              <div style={{ background: '#FFFFFF', padding: '10px', borderRadius: 'var(--radius-popup, 3px)', border: '1px solid #E2E8F0' }}>
                <strong style={{ color: '#DC2626', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <FaYoutube size={14} style={{ color: '#FF0000' }} />
                  <span>3. Unedited 10+ Minute Lectures without Chapter Hooks</span>
                </strong>
                <p style={{ margin: '4px 0 0', color: '#475569' }}>
                  12-minute database schema video had 72% early abandonment. Repurpose technical concepts into 45-second animated bite-sized clips.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* MODAL 1: RETENTION CURVE INSPECTOR */}
      {inspectingPost && (
        <div className="modal-backdrop" onClick={() => setInspectingPost(null)}>
          <div
            className="modal-card"
            style={{ maxWidth: '680px', borderRadius: 'var(--radius-popup, 3px)' }}
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="retention-modal-title"
          >
            <div className="modal-header">
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                  {(() => {
                    const pConf = getPlatformConfig(inspectingPost.platform);
                    const OrgIcon = pConf.Icon;
                    return (
                      <span
                        style={{
                          fontSize: '11px',
                          fontWeight: 700,
                          padding: '2px 8px',
                          background: pConf.bg,
                          border: `1px solid ${pConf.borderColor}`,
                          borderRadius: 'var(--radius-popup, 3px)',
                          color: pConf.color,
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '5px'
                        }}
                      >
                        <OrgIcon size={12} />
                        <span>{pConf.name}</span>
                      </span>
                    );
                  })()}
                  <span style={{ fontSize: '11px', fontWeight: 800, color: '#0022FF', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    Viewer Retention Curve Diagnostics
                  </span>
                </div>
                <h3 id="retention-modal-title" style={{ margin: '2px 0 0', fontSize: '1.125rem', fontWeight: 800, color: '#0F1A34' }}>
                  {inspectingPost.title}
                </h3>
              </div>
              <button
                type="button"
                className="btn-icon"
                onClick={() => setInspectingPost(null)}
                aria-label="Close retention modal"
              >
                <LuX size={18} />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', padding: '16px 0' }}>
              {/* Retention Graph Visualization (SVG Curve) */}
              <div style={{ background: '#0F1A34', padding: '20px', borderRadius: 'var(--radius-popup, 3px)', color: '#FFFFFF' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                  <span style={{ fontSize: '12px', fontWeight: 700, color: '#94A3B8' }}>
                    Second-by-Second Viewer Retention Curve
                  </span>
                  <span style={{ fontSize: '11px', color: '#34D399', fontWeight: 700 }}>
                    Avg Watch Time: {inspectingPost.avgWatchTime || '0:28'} ({inspectingPost.completionRate}% completion)
                  </span>
                </div>

                <div style={{ height: '140px', position: 'relative', width: '100%', borderBottom: '1px solid #334155', borderLeft: '1px solid #334155' }}>
                  {/* SVG Line Chart */}
                  <svg style={{ width: '100%', height: '100%', overflow: 'visible' }} viewBox="0 0 500 120" preserveAspectRatio="none">
                    <defs>
                      <linearGradient id="retGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#38BDF8" stopOpacity="0.4" />
                        <stop offset="100%" stopColor="#38BDF8" stopOpacity="0.0" />
                      </linearGradient>
                    </defs>
                    {/* SVG Area */}
                    <path
                      d="M 0,0 L 50,25 L 180,32 L 340,42 L 500,50 L 500,120 L 0,120 Z"
                      fill="url(#retGrad)"
                    />
                    {/* SVG Curve */}
                    <path
                      d="M 0,0 L 50,25 L 180,32 L 340,42 L 500,50"
                      fill="none"
                      stroke="#38BDF8"
                      strokeWidth="3"
                    />
                    {/* Key Marker Dots */}
                    <circle cx="0" cy="0" r="4" fill="#FFFFFF" />
                    <circle cx="50" cy="25" r="4" fill="#FBBF24" />
                    <circle cx="180" cy="32" r="4" fill="#38BDF8" />
                    <circle cx="340" cy="42" r="4" fill="#38BDF8" />
                    <circle cx="500" cy="50" r="4" fill="#34D399" />
                  </svg>

                  {/* Marker Labels */}
                  <div style={{ position: 'absolute', top: '15px', left: '10%', fontSize: '10px', color: '#FBBF24', fontWeight: 700 }}>
                    3s Hook ({inspectingPost.hookRate}%)
                  </div>
                  <div style={{ position: 'absolute', bottom: '60px', right: '4%', fontSize: '10px', color: '#34D399', fontWeight: 700 }}>
                    Completion ({inspectingPost.completionRate}%)
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: '#64748B', marginTop: '6px' }}>
                  <span>0:00 (Start)</span>
                  <span>0:03 (Hook)</span>
                  <span>Midpoint</span>
                  <span>{inspectingPost.duration || '0:34'} (End)</span>
                </div>
              </div>

              {/* Drop-off points breakdown */}
              {inspectingPost.dropOffPoints && (
                <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', padding: '14px', borderRadius: 'var(--radius-popup, 3px)' }}>
                  <strong style={{ fontSize: '12px', color: '#0F1A34', display: 'block', marginBottom: '8px' }}>
                    Viewer Drop-off Key Milestones
                  </strong>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '12px' }}>
                    {inspectingPost.dropOffPoints.map(pt => (
                      <div key={pt.second} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ color: '#475569' }}>
                          Second {pt.second}s: <strong>{pt.label}</strong>
                        </span>
                        <strong style={{ color: pt.percentage > 70 ? '#059669' : pt.percentage > 40 ? '#D97706' : '#DC2626' }}>
                          {pt.percentage}% Retained
                        </strong>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Attributed Lead Details */}
              {inspectingPost.topLeadClient && (
                <div style={{ background: '#EFF6FF', border: '1px solid #BFDBFE', padding: '12px', borderRadius: 'var(--radius-popup, 3px)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div>
                    <span style={{ fontSize: '11px', color: '#1D4ED8', fontWeight: 700 }}>VERIFIED CRM INBOUND LEAD</span>
                    <strong style={{ display: 'block', fontSize: '13px', color: '#0F1A34' }}>
                      {inspectingPost.topLeadClient} &mdash; Pipeline: {inspectingPost.attributedPipelineValue}
                    </strong>
                  </div>

                  <button
                    type="button"
                    className="btn-primary btn-sm"
                    onClick={() => {
                      if (onSelectLead) {
                        onSelectLead({
                          id: 'lead-social-01',
                          client: inspectingPost.topLeadClient || 'Client',
                          company: inspectingPost.topLeadClient || 'Company'
                        });
                      }
                      setInspectingPost(null);
                    }}
                  >
                    <span>View in CRM</span>
                    <LuArrowUpRight size={13} />
                  </button>
                </div>
              )}
            </div>

            <div className="modal-actions" style={{ justifyContent: 'flex-end', borderTop: '1px solid #E2E8F0', paddingTop: '12px' }}>
              <button
                type="button"
                className="btn-secondary"
                onClick={() => setInspectingPost(null)}
              >
                Close Inspector
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: CONNECT SOCIAL ACCOUNT */}
      {showConnectModal && (
        <div className="modal-backdrop" onClick={() => setShowConnectModal(false)}>
          <div
            className="modal-card"
            style={{ maxWidth: '520px', borderRadius: 'var(--radius-popup, 3px)' }}
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="connect-modal-title"
          >
            <div className="modal-header">
              <div>
                <h3 id="connect-modal-title" style={{ margin: 0, fontSize: '1.125rem', fontWeight: 800, color: '#0F1A34' }}>
                  Connect Social Account
                </h3>
                <span style={{ fontSize: '12px', color: '#557396' }}>
                  Authorize TechGy Link CRM to ingest viewer telemetry, retention curves, and post metrics.
                </span>
              </div>
              <button
                type="button"
                className="btn-icon"
                onClick={() => setShowConnectModal(false)}
                aria-label="Close connect modal"
              >
                <LuX size={18} />
              </button>
            </div>

            <form onSubmit={handleConnectSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px', padding: '16px 0' }}>
              <div>
                <label style={{ fontSize: '12px', fontWeight: 700, color: '#0F1A34', display: 'block', marginBottom: '8px' }}>
                  Select Platform to Connect *
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', marginBottom: '10px' }}>
                  {[
                    { id: 'instagram', name: 'Instagram', Icon: FaInstagram, color: '#E1306C', badgeBg: 'linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)', defaultHandle: '@techgylink' },
                    { id: 'linkedin', name: 'LinkedIn', Icon: FaLinkedin, color: '#0A66C2', badgeBg: '#0A66C2', defaultHandle: 'TechGy Link' },
                    { id: 'youtube', name: 'YouTube', Icon: FaYoutube, color: '#FF0000', badgeBg: '#FF0000', defaultHandle: '@TechGyLink' },
                    { id: 'meta', name: 'Meta / FB', Icon: FaMeta, color: '#0668E1', badgeBg: 'linear-gradient(135deg, #0081FB 0%, #0064E0 100%)', defaultHandle: 'TechGyLinkOfficial' },
                    { id: 'x', name: 'X (Twitter)', Icon: FaXTwitter, color: '#0F1A34', badgeBg: '#0F1A34', defaultHandle: '@TechGyLink' },
                    { id: 'tiktok', name: 'TikTok', Icon: FaTiktok, color: '#000000', badgeBg: 'linear-gradient(135deg, #000000 0%, #25F4EE 50%, #FE2C55 100%)', defaultHandle: '@techgylink' }
                  ].map(p => {
                    const isSelected = connectingPlatform === p.id;
                    const Icon = p.Icon;
                    return (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => {
                          setConnectingPlatform(p.id);
                          setConnectHandleInput(p.defaultHandle);
                        }}
                        style={{
                          background: isSelected ? '#EFF6FF' : '#FFFFFF',
                          border: isSelected ? '2px solid #0022FF' : '1px solid #CBD5E1',
                          borderRadius: 'var(--radius-popup, 3px)',
                          padding: '12px 8px',
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          gap: '6px',
                          cursor: 'pointer',
                          position: 'relative',
                          transition: 'all 0.15s ease'
                        }}
                        title={`Select ${p.name}`}
                      >
                        <div style={{
                          width: '34px',
                          height: '34px',
                          borderRadius: 'var(--radius-popup, 3px)',
                          background: p.badgeBg,
                          color: '#FFFFFF',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          boxShadow: '0 2px 4px rgba(0,0,0,0.12)'
                        }}>
                          <Icon size={18} />
                        </div>
                        <span style={{ fontSize: '11px', fontWeight: isSelected ? 800 : 600, color: isSelected ? '#0022FF' : '#0F1A34', textAlign: 'center' }}>
                          {p.name}
                        </span>
                        {isSelected && (
                          <div style={{
                            position: 'absolute',
                            top: '4px',
                            right: '4px',
                            background: '#0022FF',
                            color: '#FFFFFF',
                            width: '14px',
                            height: '14px',
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '9px',
                            fontWeight: 800
                          }}>
                            ✓
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
                <select
                  className="form-select"
                  value={connectingPlatform}
                  onChange={(e) => {
                    const val = e.target.value;
                    setConnectingPlatform(val);
                    if (val === 'instagram') setConnectHandleInput('@techgylink');
                    else if (val === 'linkedin') setConnectHandleInput('TechGy Link');
                    else if (val === 'youtube') setConnectHandleInput('@TechGyLink');
                    else if (val === 'meta') setConnectHandleInput('TechGyLinkOfficial');
                    else if (val === 'x') setConnectHandleInput('@TechGyLink');
                    else if (val === 'tiktok') setConnectHandleInput('@techgylink');
                  }}
                  style={{ width: '100%', fontSize: '13px' }}
                  aria-label="Select Platform"
                >
                  <option value="instagram">Instagram Professional / Creator</option>
                  <option value="linkedin">LinkedIn Company Page</option>
                  <option value="youtube">YouTube Brand Channel</option>
                  <option value="meta">Meta / Facebook Page</option>
                  <option value="x">X (Twitter) Organization</option>
                  <option value="tiktok">TikTok Business Center</option>
                </select>
              </div>

              <div>
                <label style={{ fontSize: '12px', fontWeight: 700, color: '#0F1A34', display: 'block', marginBottom: '6px' }}>
                  Account Handle / Page ID *
                </label>
                <input
                  type="text"
                  className="form-input"
                  value={connectHandleInput}
                  onChange={(e) => setConnectHandleInput(e.target.value)}
                  placeholder="@techgylink or Company ID"
                  required
                  style={{ width: '100%', fontSize: '13px' }}
                />
              </div>

              <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', padding: '12px', borderRadius: 'var(--radius-popup, 3px)' }}>
                <span style={{ fontSize: '11px', fontWeight: 700, color: '#0F1A34', display: 'block', marginBottom: '4px' }}>
                  OAuth API Permissions Requested
                </span>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '11px', color: '#557396' }}>
                  <span>✓ Read Video Second-by-Second Retention Telemetry</span>
                  <span>✓ Ingest Post Impressions, Shares, and Saves</span>
                  <span>✓ Sync Lead Gen Ad Forms Directly to TechGy CRM Leads</span>
                </div>
              </div>

              {connectSuccess && (
                <div style={{ background: '#ECFDF5', border: '1px solid #A7F3D0', padding: '10px', borderRadius: 'var(--radius-popup, 3px)', color: '#065F46', fontSize: '12px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <LuCheck size={14} />
                  <span>Account Connected Successfully! Syncing initial telemetry...</span>
                </div>
              )}

              <div className="modal-actions" style={{ justifyContent: 'flex-end', borderTop: '1px solid #E2E8F0', paddingTop: '12px' }}>
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => setShowConnectModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary"
                  disabled={connectSuccess}
                >
                  <span>Authorize &amp; Connect Account</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
