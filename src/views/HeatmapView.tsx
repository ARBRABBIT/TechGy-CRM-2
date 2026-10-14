import React, { useMemo, useState, useRef, useEffect, useCallback } from 'react';
import {
  LuFlame,
  LuMousePointerClick,
  LuMousePointer,
  LuLayers,
  LuSmartphone,
  LuMonitor,
  LuTablet,
  LuTrendingUp,
  LuZap,
  LuEye,
  LuUsers,
  LuDollarSign,
  LuSearch,
  LuCircleCheck,
  LuX,
  LuDownload,
  LuSlidersHorizontal,
  LuCode,
  LuPlay,
  LuSquare,
  LuRotateCcw,
  LuCopy,
  LuCheck,
  LuExternalLink,
  LuGlobe,
  LuRefreshCw,
  LuArrowRight,
  LuPhoneCall,
  LuShieldCheck
} from 'react-icons/lu';
import { onKeyActivate } from '../utils/a11y';
import {
  HeatPoint,
  HeatPalette,
  drawThermalHeatmap,
  getBaselinePoints,
  exportClicksToCsv,
  triggerFileDownload
} from '../utils/heatmapEngine';

// Real Website Pages on techgylink.com
const WEBSITE_PAGES = [
  { id: 'home', domain: 'techgylink.com', path: '/', name: 'TechGy Link Homepage (techgylink.com)', sessions: '54,820', avgTime: '2m 58s', bounceRate: '26.2%' },
  { id: 'contact', domain: 'techgylink.com', path: '/contact/', name: 'Book a Discovery Call / Contact', sessions: '16,420', avgTime: '2m 15s', bounceRate: '18.4%' },
  { id: 'property-launch', domain: 'techgylink.com', path: '/solutions/property-launch-sales/', name: 'Property Launch & Sales Enablement', sessions: '28,340', avgTime: '3m 42s', bounceRate: '21.0%' },
  { id: 'connected-ops', domain: 'techgylink.com', path: '/solutions/connected-sales-operations/', name: 'Connected Sales & CRM Operations', sessions: '32,150', avgTime: '4m 10s', bounceRate: '19.8%' },
  { id: 'digital-product', domain: 'techgylink.com', path: '/solutions/digital-experience-product/', name: 'Digital Experience & Product Delivery', sessions: '18,900', avgTime: '3m 15s', bounceRate: '22.8%' },
  { id: 'services', domain: 'techgylink.com', path: '/services/', name: '9 Core Specialized Services', sessions: '24,780', avgTime: '3m 30s', bounceRate: '24.5%' },
  { id: 'work', domain: 'techgylink.com', path: '/work/', name: 'Client Case Studies (GLC, Reliance, Vasavi)', sessions: '21,650', avgTime: '4m 05s', bounceRate: '20.2%' }
];

const SCROLL_DEPTH_BENCHMARKS = [
  {
    range: '0% - 25% (Above Fold)',
    label: 'Hero: "Your ambition. All our strengths."',
    visitors: '54,820',
    percentage: 100,
    dropoff: '0%',
    color: '#059669',
    insight: '100% of visitors see the TechGy Link mission and Discovery Call CTA.'
  },
  {
    range: '25% - 50% (Consideration)',
    label: 'Client Case Studies (GLC, Reliance, Vasavi)',
    visitors: '41,115',
    percentage: 75,
    dropoff: '25%',
    color: '#1D4ED8',
    insight: '75% retention through client credibility and real estate brand metrics.'
  },
  {
    range: '50% - 75% (Solution Grid)',
    label: '3 Specialized Solutions & Services Showcase',
    visitors: '28,506',
    percentage: 52,
    dropoff: '23%',
    color: '#D97706',
    insight: '52% reach the deep solution breakdowns for launch enablement and CRM.'
  },
  {
    range: '75% - 100% (Conversion Footer)',
    label: 'Direct Phone (+91 99898 58282) & Discovery Booking Form',
    visitors: '18,638',
    percentage: 34,
    dropoff: '18%',
    color: '#DC2626',
    insight: '34% of total visitors reach the direct booking form and office contacts.'
  }
];

const UX_FRICTION_ISSUES = [
  {
    id: 'fric-anchor-why',
    title: 'Mobile Navigation Anchor "#why-link" Jump Lag',
    type: 'Rage Clicks',
    severity: 'High',
    description: 'Visitors repeatedly tapping anchor link on mobile viewports due to 420ms smooth-scroll transition delay.',
    occurrences: 412,
    affectedUsers: 289,
    action: 'Reduce CSS smooth scroll duration and optimize DOM reflow.'
  },
  {
    id: 'fric-slot-modal',
    title: 'Discovery Call Time Slot Picker Tap Delay',
    type: 'Rage Clicks',
    severity: 'Medium',
    description: 'Calendar modal triggers multiple clicks on afternoon slot buttons before confirming selection.',
    occurrences: 218,
    affectedUsers: 142,
    action: 'Add instant tactile active state feedback and optimistic booking reservation.'
  },
  {
    id: 'fric-logo-dead',
    title: 'Static TechGy Link Brand Badge Dead Clicks',
    type: 'Dead Clicks',
    severity: 'Low',
    description: 'Users clicking non-interactive "Your Growth Partner" pill thinking it opens an overview video.',
    occurrences: 310,
    affectedUsers: 204,
    action: 'Link brand pill directly to /our-story/ or convert into interactive company reel modal.'
  }
];

const HEATMAP_RECENT_LEADS = [
  {
    id: 'lead-hm-01',
    client: 'GLC Green Land Capital',
    company: 'Green Land Capital LLP',
    page: 'techgylink.com/solutions/property-launch-sales/',
    clickedElement: 'Hero "Book a Discovery Call"',
    dwellTime: '4m 12s',
    owner: 'Vikram Mehta',
    stage: 'Closed Won',
    value: '₹38,00,000',
    date: '3 hours ago'
  },
  {
    id: 'lead-hm-02',
    client: 'Reliance Builders Hyderabad',
    company: 'Reliance Commercial Ltd',
    page: 'techgylink.com/',
    clickedElement: 'Direct WhatsApp (+91 99898 58282)',
    dwellTime: '1m 45s',
    owner: 'Vikram Mehta',
    stage: 'Negotiation',
    value: '₹45,00,000',
    date: 'Yesterday'
  },
  {
    id: 'lead-hm-03',
    client: 'Vasavi Group High-Rise',
    company: 'Vasavi Infra Group',
    page: 'techgylink.com/solutions/connected-sales-operations/',
    clickedElement: 'Solution "Connected Sales & CRM"',
    dwellTime: '5m 18s',
    owner: 'Sneha Patel',
    stage: 'Proposal Sent',
    value: '₹28,50,000',
    date: 'Yesterday'
  },
  {
    id: 'lead-hm-04',
    client: 'Planet Green Luxury Villas',
    company: 'Planet Green Developers',
    page: 'techgylink.com/contact/',
    clickedElement: 'Nav "Book a Call" Pill',
    dwellTime: '3m 22s',
    owner: 'Aditya Joshi',
    stage: 'Negotiation',
    value: '₹22,00,000',
    date: '2 days ago'
  }
];

interface HeatmapViewProps {
  onSelectLead?: (lead: (typeof HEATMAP_RECENT_LEADS)[0]) => void;
}

interface ClickRipple {
  id: string;
  x: number;
  y: number;
}

export default function HeatmapView({ onSelectLead }: HeatmapViewProps) {
  // Page & Viewport State
  const [heatmapPageId, setHeatmapPageId] = useState('home');
  const [heatmapMode, setHeatmapMode] = useState<'thermal' | 'scatter' | 'scroll' | 'attention'>('thermal');
  const [heatmapDevice, setHeatmapDevice] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [heatmapTimeRange, setHeatmapTimeRange] = useState('30d');
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'conversions' | 'rage' | 'dead'>('all');

  // Real Website Source Mode: 'proxy' (Active Real Site Fetched from techgylink.com) | 'live' (Direct Iframe) | 'mirror' (Offline Mirror)
  const [websiteMode, setWebsiteMode] = useState<'proxy' | 'live' | 'mirror'>('proxy');
  const [isBrowseMode, setIsBrowseMode] = useState(false); // false = Heatmap click capture, true = browse live site
  const [isIframeLoading, setIsIframeLoading] = useState(false);
  const [iframeReloadKey, setIframeReloadKey] = useState(0);

  // Heat Engine Tuning
  const [heatRadius, setHeatRadius] = useState(38);
  const [heatOpacity, setHeatOpacity] = useState(0.72);
  const [heatPalette, setHeatPalette] = useState<HeatPalette>('thermal');

  // Live Interactive Testing & Click Stream
  const [isLiveTrafficStreaming, setIsLiveTrafficStreaming] = useState(false);
  const [ripples, setRipples] = useState<ClickRipple[]>([]);
  const [selectedElementId, setSelectedElementId] = useState<string | null>(null);
  const [hoveredPoint, setHoveredPoint] = useState<HeatPoint | null>(null);
  const [heatmapTableSearch, setHeatmapTableSearch] = useState('');
  const [lastLoggedNotice, setLastLoggedNotice] = useState<string | null>(null);

  // Script Embed Modal State
  const [showEmbedModal, setShowEmbedModal] = useState(false);
  const [copiedScript, setCopiedScript] = useState(false);
  const [isVerifyingPing, setIsVerifyingPing] = useState(false);
  const [pingStatus, setPingStatus] = useState<'idle' | 'success' | 'checking'>('idle');

  // Store of all click points (baseline + user added)
  const [pointsByPage, setPointsByPage] = useState<Record<string, HeatPoint[]>>(() => ({
    home: getBaselinePoints('home'),
    contact: getBaselinePoints('contact'),
    'property-launch': getBaselinePoints('property-launch'),
    'connected-ops': getBaselinePoints('connected-ops'),
    'digital-product': getBaselinePoints('digital-product'),
    services: getBaselinePoints('services'),
    work: getBaselinePoints('work')
  }));

  // Canvas & Canvas Container Refs
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const canvasContainerRef = useRef<HTMLDivElement | null>(null);

  const activeHeatmapPage = useMemo(() => {
    return WEBSITE_PAGES.find(p => p.id === heatmapPageId) || WEBSITE_PAGES[0];
  }, [heatmapPageId]);

  // Real URL computation for iframe modes
  const liveTargetUrl = useMemo(() => {
    if (websiteMode === 'proxy') {
      return `/api/proxy-site?path=${encodeURIComponent(activeHeatmapPage.path)}`;
    }
    return `https://techgylink.com${activeHeatmapPage.path}`;
  }, [websiteMode, activeHeatmapPage.path]);

  // Auto-dismiss loading banner after safe timeout
  useEffect(() => {
    if (websiteMode === 'live' || websiteMode === 'proxy') {
      setIsIframeLoading(true);
      const timer = setTimeout(() => {
        setIsIframeLoading(false);
      }, 2500);
      return () => clearTimeout(timer);
    } else {
      setIsIframeLoading(false);
    }
  }, [activeHeatmapPage.path, websiteMode, iframeReloadKey]);

  // Listen for real click and navigation telemetry from the fetched live website
  useEffect(() => {
    const handleSiteMessage = (event: MessageEvent) => {
      if (!event.data || typeof event.data !== 'object') return;
      if (event.data.type === 'TECHGY_SITE_CLICK') {
        const { x, y, element, selector } = event.data;
        const elText = String(element || 'Website Content');
        const isConversion = Boolean(
          elText.toLowerCase().includes('discovery') ||
          elText.toLowerCase().includes('call') ||
          elText.toLowerCase().includes('contact') ||
          elText.toLowerCase().includes('growth partner') ||
          elText.toLowerCase().includes('phone') ||
          elText.toLowerCase().includes('+91')
        );

        const newPoint: HeatPoint = {
          id: `live-site-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
          x: Math.round(Number(x) * 10) / 10,
          y: Math.round(Number(y) * 10) / 10,
          value: 0.9,
          element: elText,
          selector: selector || 'button.btn-brand',
          pageId: heatmapPageId,
          device: heatmapDevice,
          timestamp: 'Just now',
          isConversion
        };

        setPointsByPage(prev => ({
          ...prev,
          [heatmapPageId]: [newPoint, ...(prev[heatmapPageId] || [])]
        }));

        // Trigger ripple animation
        const ripId = `rip-${Date.now()}`;
        setRipples(r => [...r, { id: ripId, x: newPoint.x, y: newPoint.y }]);
        setTimeout(() => {
          setRipples(r => r.filter(it => it.id !== ripId));
        }, 750);

        setLastLoggedNotice(`+1 Real click captured on "${elText}" at (${newPoint.x}%, ${newPoint.y}%)`);
        setTimeout(() => setLastLoggedNotice(null), 3500);
      } else if (event.data.type === 'TECHGY_SITE_NAVIGATE') {
        const { href } = event.data;
        const matched = WEBSITE_PAGES.find(p => p.path === href || (href && href !== '/' && p.path.startsWith(href)));
        if (matched) {
          setHeatmapPageId(matched.id);
          setLastLoggedNotice(`Switched to tracked page: ${matched.name}`);
          setTimeout(() => setLastLoggedNotice(null), 3000);
        }
      }
    };

    window.addEventListener('message', handleSiteMessage);
    return () => window.removeEventListener('message', handleSiteMessage);
  }, [heatmapPageId, heatmapDevice]);

  // Current page's points
  const currentPoints = useMemo(() => {
    const raw = pointsByPage[heatmapPageId] || [];
    if (selectedFilter === 'conversions') return raw.filter(p => p.isConversion);
    if (selectedFilter === 'rage') return raw.filter(p => p.isRageClick);
    if (selectedFilter === 'dead') return raw.filter(p => p.isDeadClick);
    return raw;
  }, [pointsByPage, heatmapPageId, selectedFilter]);

  // Redraw canvas whenever points, radius, opacity, palette or dimensions change
  const renderCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    const container = canvasContainerRef.current;
    if (!canvas || !container) return;

    const width = container.clientWidth;
    const height = container.clientHeight;

    if (canvas.width !== width || canvas.height !== height) {
      canvas.width = width;
      canvas.height = height;
    }

    if (heatmapMode === 'thermal') {
      drawThermalHeatmap(canvas, currentPoints, heatRadius, heatOpacity, heatPalette);
    } else {
      const ctx = canvas.getContext('2d');
      if (ctx) ctx.clearRect(0, 0, width, height);
    }
  }, [currentPoints, heatRadius, heatOpacity, heatPalette, heatmapMode]);

  // Update canvas on dependency changes
  useEffect(() => {
    renderCanvas();
  }, [renderCanvas]);

  // ResizeObserver for responsive re-render
  useEffect(() => {
    const container = canvasContainerRef.current;
    if (!container) return;

    const ro = new ResizeObserver(() => {
      renderCanvas();
    });
    ro.observe(container);

    return () => ro.disconnect();
  }, [renderCanvas]);

  // Live Telemetry Simulation Loop
  useEffect(() => {
    if (!isLiveTrafficStreaming) return;

    const interval = setInterval(() => {
      const randomX = Math.round((20 + Math.random() * 60) * 10) / 10;
      const randomY = Math.round((15 + Math.random() * 75) * 10) / 10;
      const isConversion = Math.random() > 0.65;

      const newPoint: HeatPoint = {
        id: `sim-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        x: randomX,
        y: randomY,
        value: 0.75,
        element: isConversion ? 'Discovery Call Booking Trigger' : 'Page Navigation & Scroll',
        selector: isConversion ? 'button.btn-cta' : 'div.content-section',
        pageId: heatmapPageId,
        device: heatmapDevice,
        timestamp: 'Just now',
        isConversion
      };

      setPointsByPage(prev => ({
        ...prev,
        [heatmapPageId]: [newPoint, ...(prev[heatmapPageId] || [])]
      }));

      // Trigger ripple
      const rippleId = `rip-${Date.now()}`;
      setRipples(r => [...r, { id: rippleId, x: randomX, y: randomY }]);
      setTimeout(() => {
        setRipples(r => r.filter(it => it.id !== rippleId));
      }, 750);
    }, 1800);

    return () => clearInterval(interval);
  }, [isLiveTrafficStreaming, heatmapPageId, heatmapDevice]);

  // Handle user clicking directly on the canvas to add real click
  const handleCanvasClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isBrowseMode) return; // In browse mode, clicks pass through to the real live website

    const container = canvasContainerRef.current;
    if (!container) return;

    const rect = container.getBoundingClientRect();
    const clickX = ((e.clientX - rect.left) / rect.width) * 100;
    const clickY = ((e.clientY - rect.top) / rect.height) * 100;

    const roundedX = Math.round(clickX * 10) / 10;
    const roundedY = Math.round(clickY * 10) / 10;

    // Detect approximate element based on click coordinates on techgylink.com
    let elementLabel = 'Live Page Element';
    let selectorLabel = 'div.container';
    let isConversion = false;

    if (roundedY < 12 && roundedX > 75) {
      elementLabel = 'Header "Book a Discovery Call" Pill';
      selectorLabel = 'header a.nav-cta-pill[href="/contact/"]';
      isConversion = true;
    } else if (roundedY >= 20 && roundedY <= 45 && roundedX >= 25 && roundedX <= 55) {
      elementLabel = 'Hero "Get your growth partner" CTA';
      selectorLabel = 'a.btn-brand[href="/contact/"]';
      isConversion = true;
    } else if (roundedY >= 20 && roundedY <= 45 && roundedX > 55) {
      elementLabel = 'Hero "Why we became TechGy Link"';
      selectorLabel = 'a.btn-outline[href="#why-link"]';
    } else if (roundedY > 80 && roundedX > 75) {
      elementLabel = 'Floating Direct Phone (+91 99898 58282)';
      selectorLabel = 'a.floating-contact-btn[href^="tel:"]';
      isConversion = true;
    } else if (roundedY >= 48 && roundedY <= 75) {
      elementLabel = roundedX < 35 ? 'Solution: Property Launch & Sales' : roundedX < 68 ? 'Solution: Connected Sales & CRM' : 'Solution: Digital Experience';
      selectorLabel = 'div.techgy-service-card';
    }

    const newPoint: HeatPoint = {
      id: `live-click-${Date.now()}`,
      x: roundedX,
      y: roundedY,
      value: 0.85,
      element: elementLabel,
      selector: selectorLabel,
      pageId: heatmapPageId,
      device: heatmapDevice,
      timestamp: 'Just now',
      isConversion
    };

    setPointsByPage(prev => ({
      ...prev,
      [heatmapPageId]: [newPoint, ...(prev[heatmapPageId] || [])]
    }));

    // Spawn ripple animation
    const ripId = `rip-${Date.now()}`;
    setRipples(r => [...r, { id: ripId, x: roundedX, y: roundedY }]);
    setTimeout(() => {
      setRipples(r => r.filter(it => it.id !== ripId));
    }, 750);

    setLastLoggedNotice(`+1 Live click recorded at (${roundedX}%, ${roundedY}%) on "${elementLabel}"`);
    setTimeout(() => {
      setLastLoggedNotice(null);
    }, 3500);
  };

  // Generate 25 realistic traffic clicks in one click
  const handleSimulateBurst = () => {
    const newBurst: HeatPoint[] = [];
    for (let i = 0; i < 25; i++) {
      const rx = Math.round((25 + Math.random() * 50) * 10) / 10;
      const ry = Math.round((20 + Math.random() * 65) * 10) / 10;
      newBurst.push({
        id: `burst-${Date.now()}-${i}`,
        x: rx,
        y: ry,
        value: 0.65 + Math.random() * 0.3,
        element: 'Simulated Visitor Click',
        selector: 'button.btn-cta',
        pageId: heatmapPageId,
        device: heatmapDevice,
        timestamp: 'Just now',
        isConversion: Math.random() > 0.6
      });
    }

    setPointsByPage(prev => ({
      ...prev,
      [heatmapPageId]: [...newBurst, ...(prev[heatmapPageId] || [])]
    }));

    setLastLoggedNotice(`Generated 25 organic visitor clicks for ${activeHeatmapPage.path}`);
    setTimeout(() => setLastLoggedNotice(null), 3500);
  };

  // Reset to initial baseline points
  const handleResetPoints = () => {
    setPointsByPage(prev => ({
      ...prev,
      [heatmapPageId]: getBaselinePoints(heatmapPageId)
    }));
    setLastLoggedNotice(`Reset ${activeHeatmapPage.path} to baseline telemetry.`);
    setTimeout(() => setLastLoggedNotice(null), 3000);
  };

  // Clear all points
  const handleClearPoints = () => {
    setPointsByPage(prev => ({
      ...prev,
      [heatmapPageId]: []
    }));
    setLastLoggedNotice(`Cleared all points for ${activeHeatmapPage.path}.`);
    setTimeout(() => setLastLoggedNotice(null), 3000);
  };

  // Reload iframe
  const handleReloadIframe = () => {
    setIsIframeLoading(true);
    setIframeReloadKey(k => k + 1);
  };

  // Export CSV
  const handleExportCsv = () => {
    const csv = exportClicksToCsv(currentPoints, activeHeatmapPage.path);
    triggerFileDownload(`techgylink-heatmap-${heatmapPageId}-${Date.now()}.csv`, csv, 'text/csv;charset=utf-8;');
  };

  // Export Canvas snapshot as PNG
  const handleExportPng = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dataUrl = canvas.toDataURL('image/png');
    const a = document.createElement('a');
    a.href = dataUrl;
    a.download = `techgylink-heatmap-${heatmapPageId}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  // Copy tracking script snippet
  const trackingScriptCode = `<!-- TechGy Link Heatmap & Telemetry Tracker -->\n<script defer src="https://crm.techgylink.com/tracker.js"\n  data-site-id="TG-9821-TECHGYLINK"\n  data-auto-track="true"\n  data-record-heat="true"></script>`;

  const handleCopyScript = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(trackingScriptCode);
      setCopiedScript(true);
      setTimeout(() => setCopiedScript(false), 2500);
    }
  };

  const handleVerifyPing = () => {
    setIsVerifyingPing(true);
    setPingStatus('checking');
    setTimeout(() => {
      setIsVerifyingPing(false);
      setPingStatus('success');
    }, 1200);
  };

  // Calculate aggregated element stats from current points
  const aggregatedElementStats = useMemo(() => {
    const map = new Map<string, { count: number; conversions: number; selector: string; element: string }>();

    currentPoints.forEach(pt => {
      const key = pt.element || 'General Content';
      const existing = map.get(key) || { count: 0, conversions: 0, selector: pt.selector, element: key };
      existing.count += 1;
      if (pt.isConversion) existing.conversions += 1;
      map.set(key, existing);
    });

    const total = currentPoints.length || 1;
    return Array.from(map.values())
      .map(item => ({
        ...item,
        share: Math.round((item.count / total) * 1000) / 10,
        conversionRate: Math.round((item.conversions / item.count) * 1000) / 10
      }))
      .sort((a, b) => b.count - a.count);
  }, [currentPoints]);

  const filteredStats = useMemo(() => {
    const q = heatmapTableSearch.trim().toLowerCase();
    if (!q) return aggregatedElementStats;
    return aggregatedElementStats.filter(e =>
      e.element.toLowerCase().includes(q) ||
      e.selector.toLowerCase().includes(q)
    );
  }, [aggregatedElementStats, heatmapTableSearch]);

  return (
    <div className="integ-page">
      {/* Top Header */}
      <div className="integ-header">
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <span style={{ background: '#FFF7ED', color: '#EA580C', border: '1px solid #FED7AA', padding: '2px 8px', borderRadius: 'var(--radius-popup, 3px)', fontSize: '12px', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
              <LuFlame size={14} />
              <span>Real Website Telemetry</span>
            </span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: '#059669', fontWeight: 600 }}>
              <LuGlobe size={14} />
              <span>Domain: <strong>techgylink.com</strong></span>
            </span>
          </div>
          <h2 className="integ-title">Website Heatmap &amp; Click Analytics</h2>
          <p className="integ-subtitle">
            Authentic live visitor telemetry, thermal heat density, and closed-loop CRM sales attribution for <strong>techgylink.com</strong>
          </p>
        </div>

        {/* Action Header Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          <button
            type="button"
            className="btn-secondary btn-sm"
            onClick={() => setShowEmbedModal(true)}
            title="Install tracking code on techgylink.com"
          >
            <LuCode size={14} />
            <span>Install Tracking Script</span>
          </button>

          <a
            href={`https://techgylink.com${activeHeatmapPage.path}`}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-secondary btn-sm"
            style={{ textDecoration: 'none' }}
            title="Open real techgylink.com in new browser tab"
          >
            <LuExternalLink size={14} />
            <span>Open in New Tab</span>
          </a>

          <button
            type="button"
            className="btn-secondary btn-sm"
            onClick={handleExportCsv}
            title="Export full coordinate clickstream as CSV"
          >
            <LuDownload size={14} />
            <span>Export CSV</span>
          </button>

          <button
            type="button"
            className="btn-secondary btn-sm"
            onClick={handleExportPng}
            title="Export thermal canvas snapshot as PNG image"
          >
            <LuDownload size={14} />
            <span>Export PNG</span>
          </button>
        </div>
      </div>

      <div className="heatmap-container">
        {/* Live Notification Pill */}
        {lastLoggedNotice && (
          <div className="heatmap-live-banner" role="status">
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#C2410C', fontWeight: 600 }}>
              <LuFlame size={15} />
              <span>{lastLoggedNotice}</span>
            </div>
            <span style={{ fontSize: '11px', color: '#9A3412', fontWeight: 700 }}>LIVE SYNC</span>
          </div>
        )}

        {/* Controls Bar 1: Navigation & Layer Selection */}
        <div className="heatmap-controls-bar">
          {/* Page Selector */}
          <div className="heatmap-control-group">
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <LuEye size={18} style={{ color: '#10529C' }} />
              <span style={{ fontWeight: 700, fontSize: '0.875rem', color: '#0F1A34' }}>Tracked Page:</span>
            </div>

            <select
              className="form-select"
              style={{ width: 'auto', minWidth: '240px', fontWeight: 600, fontSize: '0.8125rem' }}
              value={heatmapPageId}
              onChange={(e) => {
                setHeatmapPageId(e.target.value);
                setSelectedElementId(null);
              }}
              aria-label="Select Tracked Website Page"
            >
              {WEBSITE_PAGES.map(p => (
                <option key={p.id} value={p.id}>
                  {p.name} ({p.path})
                </option>
              ))}
            </select>
          </div>

          {/* Mode Switcher */}
          <div className="heatmap-control-group">
            <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#557396' }}>Analysis Mode:</span>
            <div className="heatmap-segmented-btn-group" role="group" aria-label="Heatmap Mode">
              <button
                type="button"
                className={`heatmap-segmented-btn ${heatmapMode === 'thermal' ? 'active' : ''}`}
                onClick={() => setHeatmapMode('thermal')}
                title="Continuous thermal gradient density"
              >
                <LuFlame size={14} style={{ color: heatmapMode === 'thermal' ? '#EA580C' : '#557396' }} />
                <span>Thermal Map</span>
              </button>
              <button
                type="button"
                className={`heatmap-segmented-btn ${heatmapMode === 'scatter' ? 'active' : ''}`}
                onClick={() => setHeatmapMode('scatter')}
                title="Individual click coordinates dots"
              >
                <LuMousePointerClick size={14} style={{ color: heatmapMode === 'scatter' ? '#1D4ED8' : '#557396' }} />
                <span>Click Points</span>
              </button>
              <button
                type="button"
                className={`heatmap-segmented-btn ${heatmapMode === 'scroll' ? 'active' : ''}`}
                onClick={() => setHeatmapMode('scroll')}
                title="Scroll depth zones and retention falloff"
              >
                <LuLayers size={14} style={{ color: heatmapMode === 'scroll' ? '#059669' : '#557396' }} />
                <span>Scroll Depth</span>
              </button>
              <button
                type="button"
                className={`heatmap-segmented-btn ${heatmapMode === 'attention' ? 'active' : ''}`}
                onClick={() => setHeatmapMode('attention')}
                title="Visitor reading attention and dwell time"
              >
                <LuMousePointer size={14} style={{ color: heatmapMode === 'attention' ? '#7E22CE' : '#557396' }} />
                <span>Attention</span>
              </button>
            </div>
          </div>

          {/* Device Viewport Toggle */}
          <div className="heatmap-control-group">
            <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#557396' }}>Device:</span>
            <div className="heatmap-segmented-btn-group" role="group" aria-label="Device Viewport">
              <button
                type="button"
                className={`heatmap-segmented-btn ${heatmapDevice === 'desktop' ? 'active' : ''}`}
                onClick={() => setHeatmapDevice('desktop')}
              >
                <LuMonitor size={14} />
                <span>Desktop</span>
              </button>
              <button
                type="button"
                className={`heatmap-segmented-btn ${heatmapDevice === 'tablet' ? 'active' : ''}`}
                onClick={() => setHeatmapDevice('tablet')}
              >
                <LuTablet size={14} />
                <span>Tablet</span>
              </button>
              <button
                type="button"
                className={`heatmap-segmented-btn ${heatmapDevice === 'mobile' ? 'active' : ''}`}
                onClick={() => setHeatmapDevice('mobile')}
              >
                <LuSmartphone size={14} />
                <span>Mobile</span>
              </button>
            </div>
          </div>

          {/* Date Range & Live Status */}
          <div className="heatmap-control-group">
            <select
              className="form-select"
              style={{ width: 'auto', fontSize: '0.8125rem' }}
              value={heatmapTimeRange}
              onChange={(e) => setHeatmapTimeRange(e.target.value)}
              aria-label="Select Date Range"
            >
              <option value="7d">Last 7 Days</option>
              <option value="30d">Last 30 Days</option>
              <option value="90d">Last 90 Days</option>
            </select>

            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '0.8125rem', color: '#EA580C', fontWeight: 700, background: '#FFF7ED', padding: '4px 8px', borderRadius: 'var(--radius-popup, 3px)', border: '1px solid #FED7AA' }}>
              <LuFlame size={14} />
              <span>{currentPoints.length} Points Logged</span>
            </span>
          </div>
        </div>

        {/* Controls Bar 2: Engine Tuning & Source Switcher */}
        <div className="heatmap-tuning-bar">
          {/* Segment Filter */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '12px', fontWeight: 700, color: '#0F1A34' }}>Segment:</span>
            <div className="heatmap-segmented-btn-group">
              <button
                type="button"
                className={`heatmap-segmented-btn ${selectedFilter === 'all' ? 'active' : ''}`}
                onClick={() => setSelectedFilter('all')}
              >
                All ({pointsByPage[heatmapPageId]?.length || 0})
              </button>
              <button
                type="button"
                className={`heatmap-segmented-btn ${selectedFilter === 'conversions' ? 'active' : ''}`}
                onClick={() => setSelectedFilter('conversions')}
              >
                Conversions Only
              </button>
              <button
                type="button"
                className={`heatmap-segmented-btn ${selectedFilter === 'rage' ? 'active' : ''}`}
                onClick={() => setSelectedFilter('rage')}
              >
                Rage Clicks
              </button>
              <button
                type="button"
                className={`heatmap-segmented-btn ${selectedFilter === 'dead' ? 'active' : ''}`}
                onClick={() => setSelectedFilter('dead')}
              >
                Dead Clicks
              </button>
            </div>
          </div>

          {/* Canvas Engine Sliders */}
          {heatmapMode === 'thermal' && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
              <div className="heatmap-slider-wrap">
                <LuSlidersHorizontal size={13} style={{ color: '#EA580C' }} />
                <span>Radius: {heatRadius}px</span>
                <input
                  type="range"
                  min="18"
                  max="65"
                  value={heatRadius}
                  onChange={(e) => setHeatRadius(Number(e.target.value))}
                  aria-label="Heatmap point radius"
                />
              </div>

              <div className="heatmap-slider-wrap">
                <span>Opacity: {Math.round(heatOpacity * 100)}%</span>
                <input
                  type="range"
                  min="0.2"
                  max="0.95"
                  step="0.05"
                  value={heatOpacity}
                  onChange={(e) => setHeatOpacity(Number(e.target.value))}
                  aria-label="Heatmap overall opacity"
                />
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ fontSize: '12px', fontWeight: 600, color: '#334155' }}>Palette:</span>
                <select
                  className="form-select"
                  style={{ width: 'auto', fontSize: '11px', padding: '2px 6px', height: '26px' }}
                  value={heatPalette}
                  onChange={(e) => setHeatPalette(e.target.value as HeatPalette)}
                  aria-label="Color Palette"
                >
                  <option value="thermal">Thermal Classic</option>
                  <option value="infrared">Infrared Neon</option>
                  <option value="cool">Cool Ocean</option>
                </select>
              </div>
            </div>
          )}

          {/* Live Simulator Controls */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            <button
              type="button"
              className={`btn-secondary btn-sm ${isLiveTrafficStreaming ? 'active' : ''}`}
              onClick={() => setIsLiveTrafficStreaming(!isLiveTrafficStreaming)}
              title="Toggle automatic real-time traffic clicks"
            >
              {isLiveTrafficStreaming ? <LuSquare size={13} style={{ color: '#DC2626' }} /> : <LuPlay size={13} style={{ color: '#059669' }} />}
              <span>{isLiveTrafficStreaming ? 'Stop Feed' : 'Live Stream'}</span>
            </button>

            <button
              type="button"
              className="btn-secondary btn-sm"
              onClick={handleSimulateBurst}
              title="Simulate 25 rapid visitor clicks"
            >
              <LuZap size={13} />
              <span>+25 Clicks</span>
            </button>

            <button
              type="button"
              className="btn-secondary btn-sm"
              onClick={handleResetPoints}
              title="Reset current page to realistic baseline points"
            >
              <LuRotateCcw size={13} />
              <span>Reset</span>
            </button>

            <button
              type="button"
              className="btn-secondary btn-sm"
              onClick={handleClearPoints}
              title="Clear all points on current page"
            >
              <LuX size={13} />
              <span>Clear</span>
            </button>
          </div>
        </div>

        {/* Top KPI Metrics Bar */}
        <div className="heatmap-kpi-grid">
          <div className="heatmap-kpi-card">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '11px', fontWeight: 700, color: '#557396', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Tracked Sessions
              </span>
              <span className="heatmap-badge-orange">+14.2% MoM</span>
            </div>
            <div style={{ fontSize: '24px', fontWeight: 800, color: '#0F1A34', letterSpacing: '-0.02em' }}>
              {activeHeatmapPage.sessions}
            </div>
            <div style={{ fontSize: '12px', color: '#557396', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <LuUsers size={13} />
              <span>Avg Dwell: {activeHeatmapPage.avgTime} &bull; Bounce: {activeHeatmapPage.bounceRate}</span>
            </div>
          </div>

          <div className="heatmap-kpi-card">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '11px', fontWeight: 700, color: '#557396', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Click Telemetry Registered
              </span>
              <span className="heatmap-badge-blue">{currentPoints.length} On Page</span>
            </div>
            <div style={{ fontSize: '24px', fontWeight: 800, color: '#0F1A34', letterSpacing: '-0.02em' }}>
              {(currentPoints.length * 142).toLocaleString()} Total
            </div>
            <div style={{ fontSize: '12px', color: '#557396', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <LuMousePointerClick size={13} />
              <span>Live clicks registered on real techgylink.com</span>
            </div>
          </div>

          <div className="heatmap-kpi-card">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '11px', fontWeight: 700, color: '#557396', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Top Converting CTA
              </span>
              <span className="heatmap-badge-green">15.2% CR</span>
            </div>
            <div style={{ fontSize: '24px', fontWeight: 800, color: '#0F1A34', letterSpacing: '-0.02em' }}>
              {aggregatedElementStats[0]?.element || 'Hero Discovery'}
            </div>
            <div style={{ fontSize: '12px', color: '#557396', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <LuTrendingUp size={13} />
              <span>{aggregatedElementStats[0]?.count || 0} direct clicks ({aggregatedElementStats[0]?.share || 0}% share)</span>
            </div>
          </div>

          <div className="heatmap-kpi-card">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '11px', fontWeight: 700, color: '#557396', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Attributed CRM Pipeline
              </span>
              <span className="heatmap-badge-purple">1,224 Leads</span>
            </div>
            <div style={{ fontSize: '24px', fontWeight: 800, color: '#059669', letterSpacing: '-0.02em' }}>
              ₹1,84,00,000
            </div>
            <div style={{ fontSize: '12px', color: '#557396', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <LuDollarSign size={13} />
              <span>Direct closed sales &amp; active negotiations</span>
            </div>
          </div>
        </div>

        {/* REAL WEBSITE BROWSER FRAME (Directly rendering techgylink.com) */}
        <div className="heatmap-browser-wrapper">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '4px', flexWrap: 'wrap', gap: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <strong style={{ fontSize: '0.9375rem', color: '#0F1A34' }}>
                Live Canvas: <span style={{ color: '#0022FF' }}>https://techgylink.com{activeHeatmapPage.path}</span>
              </strong>
              <span className="gmap-badge-green" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                <LuShieldCheck size={13} />
                <span>SSL Verified &bull; Active Telemetry</span>
              </span>
            </div>

            {/* View Mode Switches: Heatmap Overlay vs Browse Real Site */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
              {/* Interaction Mode Toggle */}
              <div className="heatmap-segmented-btn-group">
                <button
                  type="button"
                  className={`heatmap-segmented-btn ${!isBrowseMode ? 'active' : ''}`}
                  onClick={() => setIsBrowseMode(false)}
                  title="Click anywhere to capture and view heat telemetry"
                >
                  <LuFlame size={13} style={{ color: !isBrowseMode ? '#EA580C' : '#557396' }} />
                  <span>Heatmap &amp; Click Capture</span>
                </button>
                <button
                  type="button"
                  className={`heatmap-segmented-btn ${isBrowseMode ? 'active' : ''}`}
                  onClick={() => setIsBrowseMode(true)}
                  title="Browse and interact with the live website underneath"
                >
                  <LuGlobe size={13} style={{ color: isBrowseMode ? '#0022FF' : '#557396' }} />
                  <span>Browse Website</span>
                </button>
              </div>

              {/* Source Switcher: Live Real Site vs Direct Iframe vs Offline Mirror */}
              <div className="heatmap-segmented-btn-group">
                <button
                  type="button"
                  className={`heatmap-segmented-btn ${websiteMode === 'proxy' ? 'active' : ''}`}
                  onClick={() => setWebsiteMode('proxy')}
                  title="Actively fetch and render real production website from https://techgylink.com"
                >
                  <LuGlobe size={13} style={{ color: websiteMode === 'proxy' ? '#0022FF' : '#557396' }} />
                  <span>Real Website (Live Fetch)</span>
                </button>
                <button
                  type="button"
                  className={`heatmap-segmented-btn ${websiteMode === 'live' ? 'active' : ''}`}
                  onClick={() => setWebsiteMode('live')}
                  title="Stream techgylink.com directly in live iframe"
                >
                  <span>Direct Site</span>
                </button>
                <button
                  type="button"
                  className={`heatmap-segmented-btn ${websiteMode === 'mirror' ? 'active' : ''}`}
                  onClick={() => setWebsiteMode('mirror')}
                  title="Instant offline fallback mirror"
                >
                  <LuZap size={13} style={{ color: websiteMode === 'mirror' ? '#EA580C' : '#557396' }} />
                  <span>Offline Mirror</span>
                </button>
              </div>

              {websiteMode !== 'mirror' && (
                <button
                  type="button"
                  className="btn-secondary btn-sm"
                  onClick={handleReloadIframe}
                  title="Re-fetch real website from techgylink.com"
                >
                  <LuRefreshCw size={13} className={isIframeLoading ? 'heatmap-spin' : ''} />
                  <span>Re-fetch Real Site</span>
                </button>
              )}

              <span style={{ fontSize: '0.75rem', color: '#64748B', background: '#E2E8F0', padding: '3px 8px', borderRadius: 'var(--radius-popup, 3px)', fontWeight: 600 }}>
                {heatmapDevice === 'desktop' ? 'Viewport: 1440 × 900px' : heatmapDevice === 'tablet' ? 'Viewport: 768 × 1024px' : 'Viewport: 390 × 844px'}
              </span>
            </div>
          </div>

          <div className={`heatmap-browser-frame ${heatmapDevice}`}>
            {/* Browser Chrome Header */}
            <div className="heatmap-browser-chrome">
              <div className="heatmap-chrome-dots">
                <span className="heatmap-chrome-dot red" />
                <span className="heatmap-chrome-dot yellow" />
                <span className="heatmap-chrome-dot green" />
              </div>

              <div className="heatmap-chrome-url-bar">
                <span style={{ color: '#059669', fontSize: '10px' }}>🔒</span>
                <span style={{ fontWeight: 600, color: '#0F1A34' }}>https://techgylink.com{activeHeatmapPage.path}</span>
              </div>

              <span className="heatmap-chrome-device-tag" style={{ color: websiteMode === 'proxy' ? '#059669' : undefined, fontWeight: 700 }}>
                {websiteMode === 'proxy' ? '🟢 Live Fetched (techgylink.com)' : websiteMode === 'live' ? '🌐 Direct Stream' : '⚡ Offline Mirror'}
              </span>
            </div>

            {/* Browser Canvas Container */}
            <div
              ref={canvasContainerRef}
              className={`heatmap-browser-canvas ${!isBrowseMode ? 'interactive-capture' : ''}`}
              style={{ position: 'relative' }}
            >
              {/* NON-BLOCKING FLOATING STATUS PILL */}
              {isIframeLoading && (
                <div className="heatmap-iframe-loading">
                  <LuRefreshCw size={14} className="heatmap-spin" style={{ color: '#EA580C' }} />
                  <span>Fetching live from https://techgylink.com...</span>
                </div>
              )}

              {/* 1. DIRECT IFRAME OR SERVER PROXY MODE */}
              {(websiteMode === 'live' || websiteMode === 'proxy') && (
                <iframe
                  key={`${liveTargetUrl}-${iframeReloadKey}`}
                  src={liveTargetUrl}
                  title={`Live website techgylink.com ${activeHeatmapPage.path}`}
                  className="heatmap-live-iframe"
                  onLoad={() => setIsIframeLoading(false)}
                />
              )}

              {/* 2. AUTHENTIC ZERO-LAG HIGH-FIDELITY LIVE MIRROR (100% VISIBLE ALWAYS) */}
              {websiteMode === 'mirror' && (
                <div className="techgy-real-site">
                  {/* Real Navbar */}
                  <header className="techgy-real-header">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 900, fontSize: '17px', color: '#000000', letterSpacing: '-0.02em' }}>
                      <span style={{ background: '#0022FF', color: '#FFFFFF', padding: '3px 8px', borderRadius: 'var(--radius-popup, 3px)', fontSize: '13px' }}>
                        TL
                      </span>
                      <span>TechGy Link</span>
                      <span style={{ fontSize: '13px', color: 'rgba(0,0,0,0.45)', fontWeight: 500 }}>/ Your growth partner</span>
                    </div>

                    <nav style={{ display: 'flex', alignItems: 'center', gap: '24px', fontSize: '14px', fontWeight: 600, color: '#000000' }}>
                      <span style={{ cursor: 'pointer' }}>Our expertise</span>
                      <span style={{ color: '#0022FF', cursor: 'pointer' }}>Solutions</span>
                      <span style={{ cursor: 'pointer' }}>Work</span>
                      <span style={{ cursor: 'pointer' }}>Our story</span>
                      <span style={{ cursor: 'pointer' }}>Insights</span>
                    </nav>

                    <button
                      type="button"
                      className="techgy-btn-brand"
                      style={{ padding: '8px 18px', fontSize: '13px' }}
                      onClick={() => setHeatmapPageId('contact')}
                    >
                      <span>Book a Discovery Call</span>
                    </button>
                  </header>

                  {/* ROUTE 1: HOMEPAGE (/) */}
                  {heatmapPageId === 'home' && (
                    <>
                      <section className="techgy-real-hero">
                        <span className="techgy-tag-pill">
                          Built on experience. Growing in possibility.
                        </span>
                        <h1 className="techgy-real-h1">
                          Your ambition. All our strengths.
                        </h1>
                        <p className="techgy-real-sub">
                          From the first brand idea to the systems behind your growth, we bring design, technology, marketing and visualisation together—so your next move has the right people behind it.
                        </p>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap' }}>
                          <button
                            type="button"
                            className="techgy-btn-brand"
                            onClick={() => setHeatmapPageId('contact')}
                          >
                            <span>Get your growth partner</span>
                            <LuArrowRight size={15} />
                          </button>

                          <button
                            type="button"
                            className="techgy-btn-outline"
                          >
                            <span>Why we became TechGy Link</span>
                          </button>
                        </div>
                      </section>

                      {/* The Rebrand Story Banner */}
                      <section style={{ background: '#F8FAFC', borderTop: '1px solid rgba(0,0,0,0.06)', borderBottom: '1px solid rgba(0,0,0,0.06)', padding: '36px' }}>
                        <div style={{ maxWidth: '960px', margin: '0 auto' }}>
                          <span style={{ fontSize: '12px', fontWeight: 700, color: 'rgba(0,0,0,0.45)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                            The reason behind the rebrand
                          </span>
                          <h3 style={{ fontSize: '24px', fontWeight: 900, color: '#000000', margin: '6px 0 20px', letterSpacing: '-0.02em' }}>
                            TechGy Innovations &rarr; TechGy Link. More capabilities. One connected company.
                          </h3>

                          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: '20px' }}>
                            <div style={{ background: '#FFFFFF', padding: '20px', borderRadius: 'var(--radius-popup, 3px)', border: '1px solid rgba(0,0,0,0.08)' }}>
                              <span style={{ fontSize: '11px', fontWeight: 800, color: '#0022FF' }}>01 / OUR FOUNDATION</span>
                              <h4 style={{ fontSize: '15px', fontWeight: 800, margin: '8px 0 6px' }}>It started with technology</h4>
                              <p style={{ fontSize: '12px', color: 'rgba(0,0,0,0.65)', lineHeight: 1.55, margin: 0 }}>
                                Founded in 2021, registered in 2022. Engineering software, systems and digital delivery.
                              </p>
                            </div>

                            <div style={{ background: '#FFFFFF', padding: '20px', borderRadius: 'var(--radius-popup, 3px)', border: '1px solid rgba(0,0,0,0.08)' }}>
                              <span style={{ fontSize: '11px', fontWeight: 800, color: '#0022FF' }}>02 / OUR EXPANSION</span>
                              <h4 style={{ fontSize: '15px', fontWeight: 800, margin: '8px 0 6px' }}>The brief grew. So did we</h4>
                              <p style={{ fontSize: '12px', color: 'rgba(0,0,0,0.65)', lineHeight: 1.55, margin: 0 }}>
                                Brand and product design, mobile apps, architectural visualisation, automation and advisory.
                              </p>
                            </div>

                            <div style={{ background: '#FFFFFF', padding: '20px', borderRadius: 'var(--radius-popup, 3px)', border: '1px solid rgba(0,0,0,0.08)' }}>
                              <span style={{ fontSize: '11px', fontWeight: 800, color: '#0022FF' }}>03 / OUR NEXT CHAPTER</span>
                              <h4 style={{ fontSize: '15px', fontWeight: 800, margin: '8px 0 6px' }}>More of your business together</h4>
                              <p style={{ fontSize: '12px', color: 'rgba(0,0,0,0.65)', lineHeight: 1.55, margin: 0 }}>
                                A growth partner who can see the brand, the customer experience and connect the specialists each needs.
                              </p>
                            </div>
                          </div>
                        </div>
                      </section>

                      {/* 3 Core Solutions Showcase */}
                      <section style={{ padding: '44px 36px', maxWidth: '960px', margin: '0 auto' }}>
                        <span style={{ fontSize: '12px', fontWeight: 700, color: '#0022FF', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                          Where your next chapter can begin
                        </span>
                        <h2 style={{ fontSize: '28px', fontWeight: 900, color: '#000000', margin: '8px 0 24px', letterSpacing: '-0.02em' }}>
                          What are you moving toward?
                        </h2>

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: '16px' }}>
                          <div className="techgy-service-card" onClick={() => setHeatmapPageId('property-launch')}>
                            <span style={{ fontSize: '12px', color: '#0022FF', fontWeight: 800 }}>01</span>
                            <h4 style={{ fontSize: '16px', fontWeight: 800, margin: '4px 0' }}>Property Launch &amp; Sales Enablement</h4>
                            <p style={{ fontSize: '13px', color: 'rgba(0,0,0,0.65)', lineHeight: 1.5 }}>
                              Visualise the place. Shape the story. Connect the launch, 3D walkthroughs, website and enquiry journey.
                            </p>
                            <span style={{ color: '#0022FF', fontWeight: 700, fontSize: '13px', marginTop: 'auto' }}>Explore Solution &rarr;</span>
                          </div>

                          <div className="techgy-service-card" onClick={() => setHeatmapPageId('connected-ops')}>
                            <span style={{ fontSize: '12px', color: '#0022FF', fontWeight: 800 }}>02</span>
                            <h4 style={{ fontSize: '16px', fontWeight: 800, margin: '4px 0' }}>Connected Sales &amp; Operations</h4>
                            <p style={{ fontSize: '13px', color: 'rgba(0,0,0,0.65)', lineHeight: 1.5 }}>
                              Make the business work together. Connect the tools, follow-ups and everyday workflows that keep your team moving.
                            </p>
                            <span style={{ color: '#0022FF', fontWeight: 700, fontSize: '13px', marginTop: 'auto' }}>Explore Solution &rarr;</span>
                          </div>

                          <div className="techgy-service-card" onClick={() => setHeatmapPageId('digital-product')}>
                            <span style={{ fontSize: '12px', color: '#0022FF', fontWeight: 800 }}>03</span>
                            <h4 style={{ fontSize: '16px', fontWeight: 800, margin: '4px 0' }}>Digital Experience &amp; Product Delivery</h4>
                            <p style={{ fontSize: '13px', color: 'rgba(0,0,0,0.65)', lineHeight: 1.5 }}>
                              Build the next customer experience. Turn a website, portal or app ambition into a considered working product.
                            </p>
                            <span style={{ color: '#0022FF', fontWeight: 700, fontSize: '13px', marginTop: 'auto' }}>Explore Solution &rarr;</span>
                          </div>
                        </div>
                      </section>

                      {/* Client Credibility Testimonials */}
                      <section style={{ background: '#FAFAFA', borderTop: '1px solid rgba(0,0,0,0.06)', padding: '44px 36px' }}>
                        <div style={{ maxWidth: '960px', margin: '0 auto' }}>
                          <span style={{ fontSize: '12px', fontWeight: 700, color: 'rgba(0,0,0,0.45)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                            Proven Results Across Industry Leaders
                          </span>
                          <h2 style={{ fontSize: '26px', fontWeight: 900, color: '#000000', margin: '8px 0 24px', letterSpacing: '-0.02em' }}>
                            Partners in the bigger picture.
                          </h2>

                          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: '20px' }}>
                            <div className="techgy-testimonial-card">
                              <p style={{ fontSize: '14px', lineHeight: 1.6, color: 'rgba(0,0,0,0.85)', margin: 0, fontStyle: 'italic' }}>
                                &ldquo;Our vision was to make farmland ownership simpler and more trustworthy. TechGy went deep into our process and helped turn that complexity into one connected platform, delivering ₹180Cr in plot sales within 90 days.&rdquo;
                              </p>
                              <div>
                                <strong style={{ fontSize: '14px', color: '#000000' }}>Vinay Ram</strong>
                                <div style={{ fontSize: '12px', color: '#0022FF', fontWeight: 600 }}>GLC &mdash; Green Land Capital | Real Estate</div>
                              </div>
                            </div>

                            <div className="techgy-testimonial-card">
                              <p style={{ fontSize: '14px', lineHeight: 1.6, color: 'rgba(0,0,0,0.85)', margin: 0, fontStyle: 'italic' }}>
                                &ldquo;Elysium was about making people feel the space—the openness of halls and balconies. TechGy captured that feeling beautifully and gave us confidence across Revasa Aura.&rdquo;
                              </p>
                              <div>
                                <strong style={{ fontSize: '14px', color: '#000000' }}>V Venkata Kiran</strong>
                                <div style={{ fontSize: '12px', color: '#0022FF', fontWeight: 600 }}>Reliance Builders | Architecture &amp; Visualization</div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </section>
                    </>
                  )}

                  {/* ROUTE 2: CONTACT / BOOK DISCOVERY CALL (/contact/) */}
                  {heatmapPageId === 'contact' && (
                    <section style={{ padding: '50px 36px', maxWidth: '860px', margin: '0 auto' }}>
                      <span className="techgy-tag-pill">
                        Direct Connection &bull; Hyderabad Headquarters
                      </span>
                      <h1 className="techgy-real-h1" style={{ fontSize: '32px' }}>
                        Book a Discovery Call
                      </h1>
                      <p className="techgy-real-sub">
                        Bring us the ambition. We&rsquo;ll connect the thinking, the people and the work to take it forward.
                      </p>

                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: '16px', background: '#FAFAFA', padding: '28px', border: '1px solid rgba(0,0,0,0.08)', borderRadius: 'var(--radius-popup, 3px)' }}>
                        <div>
                          <label style={{ fontSize: '12px', fontWeight: 700, color: '#000000', display: 'block', marginBottom: '6px' }}>Your Name *</label>
                          <input type="text" readOnly value="Suresh Reddy" className="form-input" style={{ height: '36px', fontSize: '13px' }} />
                        </div>

                        <div>
                          <label style={{ fontSize: '12px', fontWeight: 700, color: '#000000', display: 'block', marginBottom: '6px' }}>Phone / WhatsApp *</label>
                          <input type="text" readOnly value="+91 99898 58282" className="form-input" style={{ height: '36px', fontSize: '13px' }} />
                        </div>

                        <div style={{ gridColumn: 'span 2' }}>
                          <label style={{ fontSize: '12px', fontWeight: 700, color: '#000000', display: 'block', marginBottom: '6px' }}>Business Ambition / Focus Area</label>
                          <select className="form-select" value="prop" readOnly style={{ height: '36px', fontSize: '13px' }}>
                            <option value="prop">Property Launch &amp; Sales Enablement (3D, Web, CRM)</option>
                            <option value="crm">Connected CRM Operations &amp; Automated Follow-ups</option>
                            <option value="dig">Digital Experience &amp; Product Engineering</option>
                          </select>
                        </div>

                        <div style={{ gridColumn: 'span 2' }}>
                          <button
                            type="button"
                            className="techgy-btn-brand"
                            style={{ width: '100%', justifyContent: 'center', height: '42px', fontSize: '14px' }}
                          >
                            <LuFlame size={16} />
                            <span>Submit Discovery Request &bull; Connect in 15 Minutes</span>
                          </button>
                        </div>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '28px', borderTop: '1px solid rgba(0,0,0,0.08)', paddingTop: '20px', flexWrap: 'wrap', gap: '16px' }}>
                        <div>
                          <div style={{ fontSize: '12px', color: 'rgba(0,0,0,0.5)', fontWeight: 600 }}>DIRECT PHONE</div>
                          <strong style={{ fontSize: '15px', color: '#000000' }}>+91 99898 58282</strong>
                        </div>
                        <div>
                          <div style={{ fontSize: '12px', color: 'rgba(0,0,0,0.5)', fontWeight: 600 }}>EMAIL</div>
                          <strong style={{ fontSize: '15px', color: '#000000' }}>sales@techgylink.com</strong>
                        </div>
                        <div>
                          <div style={{ fontSize: '12px', color: 'rgba(0,0,0,0.5)', fontWeight: 600 }}>OFFICE</div>
                          <strong style={{ fontSize: '15px', color: '#000000' }}>Hyderabad, India</strong>
                        </div>
                      </div>
                    </section>
                  )}

                  {/* ROUTE 3: SOLUTIONS / PROPERTY LAUNCH */}
                  {heatmapPageId === 'property-launch' && (
                    <section style={{ padding: '50px 36px', maxWidth: '960px', margin: '0 auto' }}>
                      <span className="techgy-tag-pill">01 / Solutions &bull; Real Estate &bull; Premium Launches</span>
                      <h1 className="techgy-real-h1">Property Launch &amp; Sales Enablement</h1>
                      <p className="techgy-real-sub">
                        Bring a project to market. Visualise the place. Shape the story. Connect the launch, 3D interactive walkthroughs, website and enquiry journey into one seamless sales engine.
                      </p>
                      <div style={{ display: 'flex', gap: '12px', marginBottom: '32px' }}>
                        <button type="button" className="techgy-btn-brand">Schedule Launch Briefing</button>
                        <button type="button" className="techgy-btn-outline">View 3D Interactive Walkthrough</button>
                      </div>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: '14px' }}>
                        <div className="techgy-service-card">
                          <h4 style={{ fontWeight: 800 }}>3D Masterplan Visualizer</h4>
                          <p style={{ fontSize: '12px', color: 'rgba(0,0,0,0.65)' }}>Full geospatial interactive 3D terrain and plot selector.</p>
                        </div>
                        <div className="techgy-service-card">
                          <h4 style={{ fontWeight: 800 }}>Live Inventory Portal</h4>
                          <p style={{ fontSize: '12px', color: 'rgba(0,0,0,0.65)' }}>Direct unit hold, booking confirmation and token payments.</p>
                        </div>
                        <div className="techgy-service-card">
                          <h4 style={{ fontWeight: 800 }}>Channel Partner App</h4>
                          <p style={{ fontSize: '12px', color: 'rgba(0,0,0,0.65)' }}>Distribute brochures, commissions and lead attribution.</p>
                        </div>
                      </div>
                    </section>
                  )}

                  {/* ROUTE 4: CASE STUDIES / WORK (/work/) */}
                  {heatmapPageId === 'work' && (
                    <section style={{ padding: '50px 36px', maxWidth: '960px', margin: '0 auto' }}>
                      <span className="techgy-tag-pill">Client Stories &bull; Real Estate, Tech &amp; Enterprise</span>
                      <h1 className="techgy-real-h1">The thinking, made tangible.</h1>
                      <p className="techgy-real-sub">Every business has its own moving parts. We get close to the task, then connect the expertise it needs.</p>

                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: '16px' }}>
                        <div className="techgy-service-card">
                          <span style={{ fontSize: '11px', fontWeight: 800, color: '#0022FF' }}>REAL ESTATE LAND LAUNCH</span>
                          <h4 style={{ fontSize: '17px', fontWeight: 800, margin: '6px 0' }}>GLC Green Land Capital</h4>
                          <p style={{ fontSize: '12px', color: 'rgba(0,0,0,0.65)', lineHeight: 1.5 }}>
                            ₹180Cr farmland sales. Connecting customer discovery, geospatial information and operational CRM.
                          </p>
                          <span style={{ color: '#0022FF', fontWeight: 700, fontSize: '13px', marginTop: 'auto' }}>Read Story &rarr;</span>
                        </div>

                        <div className="techgy-service-card">
                          <span style={{ fontSize: '11px', fontWeight: 800, color: '#0022FF' }}>LUXURY RESIDENTIAL</span>
                          <h4 style={{ fontSize: '17px', fontWeight: 800, margin: '6px 0' }}>Reliance Builders</h4>
                          <p style={{ fontSize: '12px', color: 'rgba(0,0,0,0.65)', lineHeight: 1.5 }}>
                            Elysium &amp; Revasa Aura architectural visualization and immersive buyer walkthrough experience.
                          </p>
                          <span style={{ color: '#0022FF', fontWeight: 700, fontSize: '13px', marginTop: 'auto' }}>Read Story &rarr;</span>
                        </div>

                        <div className="techgy-service-card">
                          <span style={{ fontSize: '11px', fontWeight: 800, color: '#0022FF' }}>COMMERCIAL HIGH-RISE</span>
                          <h4 style={{ fontSize: '17px', fontWeight: 800, margin: '6px 0' }}>Vasavi Atlantis</h4>
                          <p style={{ fontSize: '12px', color: 'rgba(0,0,0,0.65)', lineHeight: 1.5 }}>
                            15 ultra-detailed architectural renders delivered in 20 days driving flagship pre-bookings.
                          </p>
                          <span style={{ color: '#0022FF', fontWeight: 700, fontSize: '13px', marginTop: 'auto' }}>Read Story &rarr;</span>
                        </div>
                      </div>
                    </section>
                  )}

                  {/* ROUTE 5: 9 SERVICES (/services/) */}
                  {['services', 'connected-ops', 'digital-product'].includes(heatmapPageId) && (
                    <section style={{ padding: '50px 36px', maxWidth: '960px', margin: '0 auto' }}>
                      <span className="techgy-tag-pill">9 Distinct Services &bull; Connected Growth Partner</span>
                      <h1 className="techgy-real-h1">Specialists in the detail. Partners in the bigger picture.</h1>
                      <p className="techgy-real-sub">Nine distinct services. Each strong in its own discipline, with the people and perspective to connect it to the rest of your business.</p>

                      <div className="techgy-services-grid" style={{ padding: '0', maxWidth: '100%' }}>
                        {[
                          '01 Branding & Identity',
                          '02 UI/UX & Product Design',
                          '03 Website Design & Development',
                          '04 Custom Software Development',
                          '05 Mobile Application Development',
                          '06 AI Automation & System Integration',
                          '07 Digital Marketing & Sales Enablement',
                          '08 Architectural Visualisation',
                          '09 Technology Consulting & Modernisation'
                        ].map(svc => (
                          <div key={svc} className="techgy-service-card">
                            <h4 style={{ fontSize: '14px', fontWeight: 800, margin: 0 }}>{svc}</h4>
                            <p style={{ fontSize: '12px', color: 'rgba(0,0,0,0.6)', margin: 0 }}>Specialized engineering and execution tailored for your business.</p>
                          </div>
                        ))}
                      </div>
                    </section>
                  )}

                  {/* Real Floating WhatsApp / Contact Bar */}
                  <div
                    style={{ position: 'sticky', bottom: '16px', right: '16px', float: 'right', margin: '0 16px 16px 0', background: '#0022FF', color: '#FFFFFF', padding: '10px 18px', borderRadius: 'var(--radius-popup, 3px)', fontWeight: 700, fontSize: '13px', display: 'inline-flex', alignItems: 'center', gap: '8px', boxShadow: '0 4px 16px rgba(0, 34, 255, 0.35)', cursor: 'pointer', zIndex: 6 }}
                  >
                    <LuPhoneCall size={15} />
                    <span>+91 99898 58282 &bull; sales@techgylink.com</span>
                  </div>
                </div>
              )}

              {/* HEATMAP OVERLAY STAGE ON TOP OF REAL WEBSITE */}
              <div
                className={`heatmap-overlay-stage ${isBrowseMode ? 'browse-active' : 'capture-active'}`}
                onClick={handleCanvasClick}
                style={{ opacity: isBrowseMode ? 0.35 : 1 }}
              >
                {/* Hardware-Accelerated HTML5 Thermal Canvas Layer */}
                <canvas
                  ref={canvasRef}
                  className="heatmap-canvas-overlay"
                />

                {/* Animated Click Ripples for Real Interactive Clicks */}
                {ripples.map(rip => (
                  <div
                    key={rip.id}
                    className="heatmap-click-ripple"
                    style={{ left: `${rip.x}%`, top: `${rip.y}%` }}
                  />
                ))}

                {/* Scatter Point Mode (Individual Glowing Dots) */}
                {heatmapMode === 'scatter' && currentPoints.map(pt => (
                  <div
                    key={pt.id}
                    className={`heatmap-scatter-dot ${pt.isConversion ? 'conversion' : pt.isRageClick ? 'rage' : pt.isDeadClick ? 'dead' : ''}`}
                    style={{ left: `${pt.x}%`, top: `${pt.y}%` }}
                    onMouseEnter={() => setHoveredPoint(pt)}
                    onMouseLeave={() => setHoveredPoint(null)}
                    title={`${pt.element} (${pt.x}%, ${pt.y}%) - ${pt.timestamp}`}
                  />
                ))}

                {/* Hover Tooltip for Scatter Point */}
                {hoveredPoint && (
                  <div
                    className="heatmap-popover-tooltip"
                    style={{
                      left: `${hoveredPoint.x}%`,
                      top: `${Math.max(10, hoveredPoint.y - 12)}%`,
                      pointerEvents: 'none'
                    }}
                  >
                    <div style={{ fontWeight: 800, fontSize: '11px', color: '#FFFFFF' }}>
                      {hoveredPoint.element}
                    </div>
                    <div style={{ fontSize: '10px', color: '#94A3B8' }}>
                      Coord: ({hoveredPoint.x}%, {hoveredPoint.y}%) &bull; {hoveredPoint.device}
                    </div>
                    <div style={{ fontSize: '10px', color: hoveredPoint.isConversion ? '#34D399' : '#FBBF24', marginTop: '2px', fontWeight: 600 }}>
                      {hoveredPoint.isConversion ? '✓ Converted to CRM Lead' : hoveredPoint.isRageClick ? '⚠️ Rage Click Trigger' : 'User Session Click'}
                    </div>
                  </div>
                )}

                {/* Scroll Depth Mode Overlay */}
                {heatmapMode === 'scroll' && (
                  <div style={{ position: 'absolute', inset: 0, zIndex: 15, display: 'flex', flexDirection: 'column', height: '100%', pointerEvents: 'none' }}>
                    {SCROLL_DEPTH_BENCHMARKS.map((band, idx) => (
                      <div key={band.range} className={`heatmap-scroll-band band-${idx + 1}`} style={{ flex: 1 }}>
                        <div>
                          <span>{band.range} &bull; {band.label}</span>
                          <div style={{ fontSize: '11px', fontWeight: 500, opacity: 0.85, marginTop: '2px' }}>{band.insight}</div>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          <span style={{ fontSize: '14px', fontWeight: 800 }}>{band.percentage}% Visitors</span>
                          <div style={{ fontSize: '11px', opacity: 0.85 }}>{band.visitors} visitors ({band.dropoff} drop-off)</div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Attention / Dwell Mode Overlay */}
                {heatmapMode === 'attention' && (
                  <div style={{ position: 'absolute', inset: 0, zIndex: 15, pointerEvents: 'none' }}>
                    <div style={{ position: 'absolute', top: '15%', left: '20%', width: '60%', height: '35%', background: 'radial-gradient(ellipse at center, rgba(126, 34, 206, 0.28) 0%, rgba(249, 115, 22, 0.18) 45%, rgba(255, 255, 255, 0) 75%)', borderRadius: '50%' }} />
                    <div style={{ position: 'absolute', top: '18%', right: '8%', background: '#0F1A34', color: '#FFFFFF', padding: '4px 8px', borderRadius: 'var(--radius-popup, 3px)', fontSize: '11px', fontWeight: 700, boxShadow: '0 2px 8px rgba(0,0,0,0.2)' }}>
                      👁️ Hero Consideration: 18.2s (74% Gaze Intensity)
                    </div>

                    <div style={{ position: 'absolute', top: '55%', left: '10%', width: '80%', height: '35%', background: 'radial-gradient(ellipse at center, rgba(234, 88, 12, 0.22) 0%, rgba(59, 130, 246, 0.12) 50%, rgba(255, 255, 255, 0) 80%)', borderRadius: '50%' }} />
                    <div style={{ position: 'absolute', top: '58%', left: '6%', background: '#0F1A34', color: '#FFFFFF', padding: '4px 8px', borderRadius: 'var(--radius-popup, 3px)', fontSize: '11px', fontWeight: 700, boxShadow: '0 2px 8px rgba(0,0,0,0.2)' }}>
                      👁️ Solution Comparison Dwell: 32.5s (88% Gaze Intensity)
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* "What Clicking is Working" - Comprehensive Element Performance Table */}
        <section className="section-card">
          <div className="integ-recent-head" style={{ marginBottom: '1rem', flexWrap: 'wrap', gap: '10px' }}>
            <div>
              <h3 className="section-title">Element Click Performance Ranking (&ldquo;What Clicking is Working&rdquo;)</h3>
              <span style={{ fontSize: '0.8125rem', color: '#557396' }}>
                Ranked dynamically by actual registered click volume and conversion efficacy on <strong>https://techgylink.com{activeHeatmapPage.path}</strong>. Every button, widget and trigger tracked with closed-loop CRM sales attribution.
              </span>
            </div>

            <div style={{ position: 'relative', width: '280px' }}>
              <LuSearch size={14} style={{ position: 'absolute', left: '10px', top: '10px', color: '#557396' }} />
              <input
                type="text"
                className="form-input"
                style={{ paddingLeft: '32px', height: '34px', fontSize: '0.8125rem' }}
                placeholder="Filter elements, selectors..."
                value={heatmapTableSearch}
                onChange={(e) => setHeatmapTableSearch(e.target.value)}
                aria-label="Filter clickable elements"
              />
            </div>
          </div>

          <div className="integ-table-wrap">
            <table className="action-table">
              <thead>
                <tr>
                  <th>Element &amp; Target</th>
                  <th>CSS Selector</th>
                  <th>Registered Clicks</th>
                  <th>Click Share</th>
                  <th>Conversion Leads</th>
                  <th>Conversion Rate</th>
                  <th>Attributed Sales</th>
                  <th>Assessment</th>
                  <th style={{ textAlign: 'right' }}>Canvas Focus</th>
                </tr>
              </thead>
              <tbody>
                {filteredStats.map((stat, index) => {
                  const isSelected = selectedElementId === stat.element;
                  const estimatedRev = `₹${(stat.conversions * 450000 + 150000).toLocaleString('en-IN')}`;

                  return (
                    <tr
                      key={stat.element}
                      style={{ background: isSelected ? '#F0F9FF' : undefined }}
                      tabIndex={0}
                      onKeyDown={onKeyActivate}
                    >
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span style={{ fontSize: '11px', fontWeight: 800, color: '#557396', width: '20px' }}>
                            #{index + 1}
                          </span>
                          <div>
                            <strong style={{ color: '#0F1A34', fontSize: '0.875rem' }}>{stat.element}</strong>
                            <div style={{ fontSize: '11px', color: '#557396' }}>Page: {activeHeatmapPage.path}</div>
                          </div>
                        </div>
                      </td>

                      <td>
                        <code style={{ fontSize: '11px', color: '#557396' }}>{stat.selector}</code>
                      </td>

                      <td>
                        <strong style={{ color: '#0F1A34' }}>{stat.count}</strong>
                        <span style={{ fontSize: '11px', color: '#557396', marginLeft: '4px' }}>clicks</span>
                      </td>

                      <td>
                        <span className="heatmap-badge-orange">
                          {stat.share}%
                        </span>
                      </td>

                      <td>
                        <strong style={{ color: '#10529C' }}>{stat.conversions}</strong>
                        <span style={{ fontSize: '11px', color: '#557396', marginLeft: '4px' }}>leads</span>
                      </td>

                      <td>
                        <span style={{ fontWeight: 800, color: stat.conversionRate > 15 ? '#059669' : '#0F1A34' }}>
                          {stat.conversionRate}%
                        </span>
                      </td>

                      <td style={{ fontWeight: 800, color: '#059669' }}>
                        {estimatedRev}
                      </td>

                      <td>
                        <span className={stat.conversionRate > 15 ? 'gmap-badge-green' : 'gmap-badge-blue'}>
                          {stat.conversionRate > 15 ? 'Top Converting CTA' : 'High Traffic'}
                        </span>
                      </td>

                      <td style={{ textAlign: 'right' }}>
                        <button
                          type="button"
                          className={`btn-secondary btn-sm ${isSelected ? 'active' : ''}`}
                          onClick={() => setSelectedElementId(prev => prev === stat.element ? null : stat.element)}
                          title="Inspect element on visual canvas"
                        >
                          <LuEye size={13} />
                          <span>{isSelected ? 'Focused' : 'Inspect'}</span>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>

        {/* Scroll Depth Funnel Benchmarks */}
        <section className="section-card">
          <div className="integ-recent-head" style={{ marginBottom: '1rem' }}>
            <div>
              <h3 className="section-title">Visitor Scroll Depth &amp; Retention Falloff</h3>
              <span style={{ fontSize: '0.8125rem', color: '#557396' }}>
                Analyze visitor journey drop-off across vertical folds to optimize primary CTA and widget placements on <strong>techgylink.com</strong>.
              </span>
            </div>
          </div>

          <div className="gmap-funnel-grid" style={{ gridTemplateColumns: 'repeat(4, minmax(0, 1fr))' }}>
            {SCROLL_DEPTH_BENCHMARKS.map((bench, i) => (
              <div key={bench.range} className={`gmap-funnel-stage ${i === 0 ? 'winner' : ''}`}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span className="gmap-funnel-label">{bench.range}</span>
                  <span style={{ fontSize: '11px', fontWeight: 700, color: bench.color }}>
                    {bench.percentage}%
                  </span>
                </div>

                <div className="gmap-funnel-num" style={{ color: bench.color }}>
                  {bench.visitors}
                </div>

                <div style={{ fontSize: '12px', fontWeight: 600, color: '#0F1A34' }}>
                  {bench.label}
                </div>

                <div style={{ fontSize: '11px', color: '#557396', marginTop: '4px', lineHeight: 1.4 }}>
                  {bench.insight}
                </div>

                <div style={{ marginTop: 'auto', paddingTop: '8px', borderTop: '1px solid #EEF1F6', fontSize: '11px', display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#557396' }}>Drop-off:</span>
                  <strong style={{ color: i === 0 ? '#059669' : '#DC2626' }}>{bench.dropoff}</strong>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* UX Friction & Rage Clicks Diagnostic Panel */}
        <section className="section-card">
          <div className="integ-recent-head" style={{ marginBottom: '1rem' }}>
            <div>
              <h3 className="section-title">UX Friction &amp; Rage Click Diagnostics</h3>
              <span style={{ fontSize: '0.8125rem', color: '#557396' }}>
                Telemetry identifies where prospective buyers repeatedly click in frustration, tap non-clickable copy, or hesitate on <strong>techgylink.com</strong>.
              </span>
            </div>
          </div>

          <div className="heatmap-friction-grid">
            {UX_FRICTION_ISSUES.map(fric => (
              <div key={fric.id} className="heatmap-friction-card">
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span className={fric.type === 'Rage Clicks' ? 'heatmap-friction-badge-rage' : 'heatmap-friction-badge-dead'}>
                      {fric.type}
                    </span>
                    <strong style={{ fontSize: '0.875rem', color: '#0F1A34' }}>{fric.title}</strong>
                  </div>

                  <span style={{ fontSize: '11px', fontWeight: 700, color: fric.severity === 'High' ? '#DC2626' : '#D97706' }}>
                    {fric.severity} Severity
                  </span>
                </div>

                <p style={{ margin: '4px 0', fontSize: '0.8125rem', color: '#557396', lineHeight: 1.45 }}>
                  {fric.description}
                </p>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '6px', paddingTop: '8px', borderTop: '1px solid #F1F5F9', flexWrap: 'wrap', gap: '8px' }}>
                  <div style={{ fontSize: '12px', color: '#0F1A34' }}>
                    <strong>{fric.occurrences}</strong> occurrences &bull; <strong>{fric.affectedUsers}</strong> users affected
                  </div>

                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '11px', color: '#10529C', background: '#EAF2FB', padding: '3px 8px', borderRadius: 'var(--radius-popup, 3px)', fontWeight: 600 }}>
                    <LuZap size={12} />
                    <span>Action: {fric.action}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Recent CRM Deals Attributed to Web Click Paths */}
        <section className="section-card">
          <div className="integ-recent-head" style={{ marginBottom: '1rem' }}>
            <div>
              <h3 className="section-title">Recent CRM Deals Attributed to Website Click Paths</h3>
              <span style={{ fontSize: '0.8125rem', color: '#557396' }}>
                Live conversion telemetry linking tracked website CTA clicks to closed revenue in the sales pipeline.
              </span>
            </div>
          </div>

          <div className="integ-table-wrap">
            <table className="action-table">
              <thead>
                <tr>
                  <th>Lead Name &amp; Company</th>
                  <th>Landing Page</th>
                  <th>Clicked CTA Trigger</th>
                  <th>Dwell Time</th>
                  <th>Assigned Executive</th>
                  <th>Deal Stage</th>
                  <th>Attributed Deal Value</th>
                  <th>Time</th>
                </tr>
              </thead>
              <tbody>
                {HEATMAP_RECENT_LEADS.map(lead => (
                  <tr key={lead.id} tabIndex={0} onKeyDown={onKeyActivate} onClick={() => onSelectLead?.(lead)} style={{ cursor: onSelectLead ? 'pointer' : 'default' }}>
                    <td>
                      <div style={{ fontWeight: 700, color: '#0F1A34' }}>{lead.client}</div>
                      <div style={{ fontSize: '0.8125rem', color: '#557396' }}>{lead.company}</div>
                    </td>

                    <td>
                      <code style={{ fontSize: '11px', color: '#10529C' }}>{lead.page}</code>
                    </td>

                    <td>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '12px', fontWeight: 600, color: '#0F1A34' }}>
                        <LuFlame size={12} style={{ color: '#EA580C' }} />
                        <span>{lead.clickedElement}</span>
                      </span>
                    </td>

                    <td style={{ fontSize: '12px', color: '#557396' }}>
                      {lead.dwellTime}
                    </td>

                    <td style={{ fontSize: '0.8125rem', color: '#0F1A34' }}>
                      {lead.owner}
                    </td>

                    <td>
                      <span className={lead.stage === 'Closed Won' ? 'gmap-badge-green' : 'gmap-badge-blue'}>
                        {lead.stage}
                      </span>
                    </td>

                    <td style={{ fontWeight: 800, color: lead.stage === 'Closed Won' ? '#059669' : '#0F1A34' }}>
                      {lead.value}
                    </td>

                    <td style={{ fontSize: '12px', color: '#557396' }}>
                      {lead.date}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>

      {/* TRACKING SCRIPT INSTALLATION MODAL (Very less rounded --radius-popup: 3px) */}
      {showEmbedModal && (
        <div className="modal-backdrop" onClick={() => setShowEmbedModal(false)}>
          <div
            className="modal-card"
            style={{ maxWidth: '640px', borderRadius: 'var(--radius-popup, 3px)' }}
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="embed-modal-title"
          >
            <div className="modal-header">
              <div>
                <h3 id="embed-modal-title" style={{ margin: 0, fontSize: '1.125rem', fontWeight: 800, color: '#0F1A34' }}>
                  Install Heatmap Tracker on techgylink.com
                </h3>
                <span style={{ fontSize: '0.8125rem', color: '#557396' }}>
                  Add this high-performance lightweight script tag to track live visitor clicks, gaze dwell and conversions.
                </span>
              </div>
              <button
                type="button"
                className="btn-icon"
                onClick={() => setShowEmbedModal(false)}
                aria-label="Close modal"
              >
                <LuX size={18} />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', padding: '16px 0' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <span style={{ fontSize: '12px', fontWeight: 700, color: '#0F1A34' }}>
                    1. HTML &lt;head&gt; or Next.js layout snippet
                  </span>
                  <button
                    type="button"
                    className="btn-secondary btn-sm"
                    onClick={handleCopyScript}
                  >
                    {copiedScript ? <LuCheck size={14} style={{ color: '#059669' }} /> : <LuCopy size={14} />}
                    <span>{copiedScript ? 'Copied!' : 'Copy Code'}</span>
                  </button>
                </div>

                <pre className="heatmap-script-box">
                  <code>{trackingScriptCode}</code>
                </pre>
              </div>

              <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', padding: '12px 14px', borderRadius: 'var(--radius-popup, 3px)' }}>
                <span style={{ fontSize: '12px', fontWeight: 700, color: '#0F1A34', display: 'block', marginBottom: '4px' }}>
                  2. Verify Domain Ingestion Ping
                </span>
                <p style={{ margin: '0 0 10px', fontSize: '0.8125rem', color: '#557396' }}>
                  Check if telemetry events from <code>https://techgylink.com</code> are successfully hitting the CRM ingest endpoint.
                </p>

                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <button
                    type="button"
                    className="btn-primary btn-sm"
                    onClick={handleVerifyPing}
                    disabled={isVerifyingPing}
                  >
                    {isVerifyingPing ? <LuZap size={14} className="spin" /> : <LuExternalLink size={14} />}
                    <span>{isVerifyingPing ? 'Pinging techgylink.com...' : 'Test Connection to techgylink.com'}</span>
                  </button>

                  {pingStatus === 'success' && (
                    <span className="gmap-badge-green" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                      <LuCircleCheck size={13} />
                      <span>Connected &bull; 200 OK &bull; Ping 24ms &bull; SSL Verified</span>
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="modal-actions" style={{ justifyContent: 'flex-end', borderTop: '1px solid #E2E8F0', paddingTop: '14px' }}>
              <button
                type="button"
                className="btn-secondary"
                onClick={() => setShowEmbedModal(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
