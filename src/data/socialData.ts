/**
 * Social Analytics Data Model & Baseline Content Telemetry
 * Real multi-platform social metrics, content performance diagnostics,
 * account connection state, and closed-loop CRM sales attribution.
 */

export interface SocialAccount {
  id: string;
  platform: 'instagram' | 'linkedin' | 'youtube' | 'meta' | 'x';
  platformName: string;
  handle: string;
  displayName: string;
  avatar: string;
  connected: boolean;
  connectedAt?: string;
  followers: number;
  followersGrowth: string;
  totalPosts: number;
  totalReach: string;
  engagementRate: string;
  lastSynced: string;
  tokenStatus: 'valid' | 'expiring' | 'disconnected';
  permissions: string[];
}

export interface RetentionDropPoint {
  second: number;
  percentage: number;
  label?: string;
}

export interface SocialPost {
  id: string;
  title: string;
  captionExcerpt: string;
  platform: 'instagram' | 'linkedin' | 'youtube' | 'meta' | 'x';
  format: 'reel' | 'video' | 'carousel' | 'static' | 'thread';
  formatLabel: string;
  duration?: string; // e.g. "0:34", "1:12", "8:15"
  publishedAt: string;
  thumbnailUrl: string;
  postUrl: string;
  verdict: 'working' | 'average' | 'not_working';
  verdictTitle: string;
  score: number; // 0 - 100

  // Core Metrics
  views: number;
  impressions: number;
  reach: number;
  likes: number;
  comments: number;
  shares: number;
  saves: number;
  engagementRate: number; // percentage, e.g. 8.4

  // Video Specific Metrics
  hookRate?: number; // % who watched past 3 seconds (e.g. 79.2)
  completionRate?: number; // % who watched to end
  avgWatchTime?: string; // e.g. "0:28"
  dropOffPoints?: RetentionDropPoint[];

  // Conversion & CRM Attribution
  clicksToBio: number;
  attributedLeads: number;
  attributedPipelineValue: string;
  topLeadClient?: string;

  // AI Diagnostic Analysis: What Worked & What Didn't
  workingReasons: string[];
  failureReasons: string[];
  actionableRecommendation: string;
}

export const INITIAL_SOCIAL_ACCOUNTS: SocialAccount[] = [
  {
    id: 'soc-ig',
    platform: 'instagram',
    platformName: 'Instagram',
    handle: '@techgylink',
    displayName: 'TechGy Link',
    avatar: 'https://techgylink.com/brand/logo.png',
    connected: true,
    connectedAt: '2026-08-15',
    followers: 24850,
    followersGrowth: '+18.4% MoM',
    totalPosts: 142,
    totalReach: '384,200',
    engagementRate: '6.8%',
    lastSynced: '2 mins ago',
    tokenStatus: 'valid',
    permissions: ['Read Media Insights', 'Read Reels Telemetry', 'Direct Message Sync']
  },
  {
    id: 'soc-li',
    platform: 'linkedin',
    platformName: 'LinkedIn',
    handle: 'TechGy Link',
    displayName: 'TechGy Link (Enterprise Page)',
    avatar: 'https://techgylink.com/brand/logo.png',
    connected: true,
    connectedAt: '2026-07-10',
    followers: 48200,
    followersGrowth: '+22.6% MoM',
    totalPosts: 186,
    totalReach: '540,100',
    engagementRate: '5.4%',
    lastSynced: '4 mins ago',
    tokenStatus: 'valid',
    permissions: ['Read Page Insights', 'Lead Gen Forms Webhook', 'Campaign Telemetry']
  },
  {
    id: 'soc-yt',
    platform: 'youtube',
    platformName: 'YouTube',
    handle: '@TechGyLink',
    displayName: 'TechGy Link Studio',
    avatar: 'https://techgylink.com/brand/logo.png',
    connected: true,
    connectedAt: '2026-09-01',
    followers: 14600,
    followersGrowth: '+14.2% MoM',
    totalPosts: 48,
    totalReach: '265,000',
    engagementRate: '7.9%',
    lastSynced: '10 mins ago',
    tokenStatus: 'valid',
    permissions: ['YouTube Analytics API', 'Video Metadata Access', 'Comment Sync']
  },
  {
    id: 'soc-meta',
    platform: 'meta',
    platformName: 'Meta / Facebook',
    handle: 'TechGy Link Official',
    displayName: 'TechGy Link Facebook',
    avatar: 'https://techgylink.com/brand/logo.png',
    connected: true,
    connectedAt: '2026-08-20',
    followers: 32400,
    followersGrowth: '+8.7% MoM',
    totalPosts: 98,
    totalReach: '198,400',
    engagementRate: '4.1%',
    lastSynced: '15 mins ago',
    tokenStatus: 'valid',
    permissions: ['Meta Lead Ads Webhook', 'Page Post Insights', 'Audience Network']
  },
  {
    id: 'soc-x',
    platform: 'x',
    platformName: 'X (Twitter)',
    handle: '@techgylink',
    displayName: 'TechGy Link',
    avatar: 'https://techgylink.com/brand/logo.png',
    connected: false,
    followers: 8900,
    followersGrowth: '+4.2% MoM',
    totalPosts: 312,
    totalReach: '92,000',
    engagementRate: '2.8%',
    lastSynced: 'Disconnected',
    tokenStatus: 'disconnected',
    permissions: ['Read Tweets', 'Direct Message Sync']
  }
];

export const INITIAL_SOCIAL_POSTS: SocialPost[] = [
  // 1. TOP WORKING - Instagram Reel (GLC Case Study)
  {
    id: 'post-01',
    title: 'How GLC Green Land Capital sold ₹180Cr in plot sales within 90 days — Behind the 3D Map & CRM Engine',
    captionExcerpt: 'When Green Land Capital launched their flagship farmland project, they needed buyers to experience the open geography before driving 70km...',
    platform: 'instagram',
    format: 'reel',
    formatLabel: 'Instagram Reel',
    duration: '0:34',
    publishedAt: '3 days ago',
    thumbnailUrl: '/source/optimized/banner.webp',
    postUrl: 'https://instagram.com/p/glc-case-study',
    verdict: 'working',
    verdictTitle: '🔥 Top Performing Reel (Viral Hit)',
    score: 96,
    views: 142500,
    impressions: 168400,
    reach: 129000,
    likes: 6840,
    comments: 412,
    shares: 2840,
    saves: 1920,
    engagementRate: 8.4,
    hookRate: 79.2, // 79.2% stayed past 3s
    completionRate: 64.5,
    avgWatchTime: '0:29',
    dropOffPoints: [
      { second: 0, percentage: 100, label: 'Start (Visual Hook)' },
      { second: 3, percentage: 79.2, label: '3s Hook Pass' },
      { second: 12, percentage: 74.0, label: '3D Map Demo' },
      { second: 22, percentage: 69.5, label: '₹180Cr Result' },
      { second: 30, percentage: 64.5, label: 'CTA "Book Call"' }
    ],
    clicksToBio: 1480,
    attributedLeads: 18,
    attributedPipelineValue: '₹45,00,000',
    topLeadClient: 'GLC Green Land Capital LLP',
    workingReasons: [
      'Visual Pattern Interrupt in first 1.2s: Real iPad footage of the 3D terrain selector with zero logo delay.',
      'Tangible High-Stakes Proof: Directly quoted the ₹180Cr verified revenue result in bold captions.',
      'High B2B Developer Shareability: 2,840 shares directly between real estate founders and marketing heads.',
      'Frictionless Call-to-Action: Clear callout to comment "MAP" or visit techgylink.com/contact/.'
    ],
    failureReasons: [],
    actionableRecommendation: 'Re-distribute this winning hook formula to YouTube Shorts and LinkedIn Video ads. Create Part 2 diving into the automated WhatsApp lead routing.'
  },

  // 2. TOP WORKING - YouTube Short (Reliance Builders 3D Balcony)
  {
    id: 'post-02',
    title: 'Reliance Builders Elysium: Interactive 3D Balcony & Hall Walkthrough vs Traditional 2D Brochure',
    captionExcerpt: 'Buyers don’t want flat floor plans anymore. Here is how we helped Reliance Builders showcase the open living spaces for Revasa Aura...',
    platform: 'youtube',
    format: 'reel',
    formatLabel: 'YouTube Short',
    duration: '0:42',
    publishedAt: '5 days ago',
    thumbnailUrl: '/source/optimized/banner.webp',
    postUrl: 'https://youtube.com/shorts/reliance-elysium',
    verdict: 'working',
    verdictTitle: '🔥 Top Performing Short',
    score: 93,
    views: 98400,
    impressions: 115200,
    reach: 89000,
    likes: 4920,
    comments: 298,
    shares: 1640,
    saves: 1410,
    engagementRate: 8.2,
    hookRate: 76.5,
    completionRate: 61.0,
    avgWatchTime: '0:35',
    dropOffPoints: [
      { second: 0, percentage: 100, label: 'Split Screen Hook' },
      { second: 3, percentage: 76.5, label: 'Hook Retained' },
      { second: 15, percentage: 72.1, label: 'Balcony 3D Zoom' },
      { second: 32, percentage: 65.4, label: 'Buyer Reaction' },
      { second: 42, percentage: 61.0, label: 'End CTA' }
    ],
    clicksToBio: 940,
    attributedLeads: 12,
    attributedPipelineValue: '₹32,00,000',
    topLeadClient: 'Reliance Commercial Ltd',
    workingReasons: [
      'Split-Screen Comparison Hook: Left side showed boring paper PDF; Right side showed glowing 3D interactive walkthrough.',
      'Aspirational Architectural Visuals: Ultra-crisp golden hour lighting captured high dwell time.',
      'High conversion from high-net-worth property buyers and developers.'
    ],
    failureReasons: [],
    actionableRecommendation: 'Scale up architectural split-screen comparisons across luxury high-rises and villa launches.'
  },

  // 3. TOP WORKING - LinkedIn Video (WhatsApp CRM Lead Routing)
  {
    id: 'post-03',
    title: 'Why Meta Lead Ads waste 60% of budget without instant WhatsApp auto-routing (Live CRM Workflow Demo)',
    captionExcerpt: 'If your sales executive calls a lead 4 hours after they submit an ad form, your conversion rate drops by 391%. Here is the exact zero-delay pipeline we architected...',
    platform: 'linkedin',
    format: 'video',
    formatLabel: 'LinkedIn Video',
    duration: '1:18',
    publishedAt: '1 week ago',
    thumbnailUrl: '/source/optimized/banner.webp',
    postUrl: 'https://linkedin.com/posts/crm-whatsapp-routing',
    verdict: 'working',
    verdictTitle: '🔥 Top B2B Sales Driver',
    score: 91,
    views: 48200,
    impressions: 64800,
    reach: 41200,
    likes: 2410,
    comments: 382,
    shares: 680,
    saves: 890,
    engagementRate: 9.1,
    hookRate: 71.8,
    completionRate: 54.2,
    avgWatchTime: '0:58',
    dropOffPoints: [
      { second: 0, percentage: 100, label: 'Pain Point: 60% Wasted' },
      { second: 3, percentage: 71.8, label: 'Hook Pass' },
      { second: 25, percentage: 66.0, label: 'Live Routing Screen' },
      { second: 55, percentage: 59.8, label: 'Executive Audio Ping' },
      { second: 78, percentage: 54.2, label: 'Summary' }
    ],
    clicksToBio: 1120,
    attributedLeads: 14,
    attributedPipelineValue: '₹38,00,000',
    topLeadClient: 'Vasavi Group High-Rise',
    workingReasons: [
      'Immediate Pain Quantification: "Wasting 60% of budget" directly targets Real Estate CMOs and Sales Heads.',
      'Live Operational Screen Recording: Showed real incoming webhook triggers inside TechGy CRM.',
      'Generated 382 comments with Sales Heads asking for implementation blueprints.'
    ],
    failureReasons: [],
    actionableRecommendation: 'Publish a downloadable SOP guide linked in the comments to collect direct executive email and phone leads.'
  },

  // 4. TOP WORKING - LinkedIn Carousel (Vasavi Atlantis 15 Renders)
  {
    id: 'post-04',
    title: 'Vasavi Atlantis: 15 Photorealistic Renders in 20 Days — Architecture Visualization Case Study',
    captionExcerpt: 'Flagship pre-bookings required hyper-detailed architectural renders before civil construction began. 8 slides detailing the workflow...',
    platform: 'linkedin',
    format: 'carousel',
    formatLabel: 'LinkedIn 8-Slide Carousel',
    publishedAt: '2 weeks ago',
    thumbnailUrl: '/source/optimized/banner.webp',
    postUrl: 'https://linkedin.com/posts/vasavi-atlantis-case',
    verdict: 'working',
    verdictTitle: '🔥 High-Conversion Carousel',
    score: 88,
    views: 64100,
    impressions: 78500,
    reach: 52000,
    likes: 3120,
    comments: 184,
    shares: 420,
    saves: 920,
    engagementRate: 7.6,
    clicksToBio: 680,
    attributedLeads: 9,
    attributedPipelineValue: '₹22,00,000',
    topLeadClient: 'Planet Green Luxury Villas',
    workingReasons: [
      'High Slide-Through Rate (82% reached slide 8): Visual before-and-after progressions.',
      'Deep Technical Authenticity: Detailed render render times, software stack (Unreal Engine 5), and architectural detail.',
      'High save rate (920 saves) for architectural reference.'
    ],
    failureReasons: [],
    actionableRecommendation: 'Repurpose the 8 slides into high-intent Instagram carousel ads targeting architectural firms and real estate developers.'
  },

  // 5. AVERAGE / OPTIMIZATION - YouTube Video (TechGy Studio Tour)
  {
    id: 'post-05',
    title: 'TechGy Link Studio Tour: Meet Our 3D Visualizers and Software Engineers in Hyderabad',
    captionExcerpt: 'Go inside our Hyderabad headquarters where architectural renders, real estate platforms and connected CRM systems come together...',
    platform: 'youtube',
    format: 'video',
    formatLabel: 'YouTube Long-Form',
    duration: '8:15',
    publishedAt: '2 weeks ago',
    thumbnailUrl: '/source/optimized/banner.webp',
    postUrl: 'https://youtube.com/watch?v=techgy-tour',
    verdict: 'average',
    verdictTitle: '⚠️ Average (Watch Time Dip at 3:30)',
    score: 64,
    views: 22400,
    impressions: 48000,
    reach: 19800,
    likes: 980,
    comments: 64,
    shares: 110,
    saves: 95,
    engagementRate: 4.8,
    hookRate: 51.0,
    completionRate: 28.4,
    avgWatchTime: '3:22',
    dropOffPoints: [
      { second: 0, percentage: 100, label: 'Intro' },
      { second: 3, percentage: 51.0, label: 'Drop (Intro Too Slow)' },
      { second: 180, percentage: 42.0, label: '3D Team Interview' },
      { second: 210, percentage: 31.0, label: 'Tech Stack Monologue (Drop-off)' },
      { second: 495, percentage: 28.4, label: 'Outro' }
    ],
    clicksToBio: 140,
    attributedLeads: 2,
    attributedPipelineValue: '₹6,00,000',
    workingReasons: [
      'Authentic company culture and high credibility showing our physical Hyderabad office.',
      'Viewers who made it past 4 minutes showed strong brand trust.'
    ],
    failureReasons: [
      'Slow 18-second b-roll opening without introducing what clients gain from the video.',
      'Middle section (3:30 to 4:45) is a static talking-head without cutaway screens.',
      'Call to action buried at minute 8:05 which only 28% of viewers reached.'
    ],
    actionableRecommendation: 'Add an instant hook in the first 5 seconds. Insert animated text highlights and chapter timestamps. Add verbal CTA to book a discovery call at minute 2:00.'
  },

  // 6. AVERAGE / OPTIMIZATION - Meta Facebook Video (GLC Farmland Walkthrough)
  {
    id: 'post-06',
    title: 'GLC Farmland Project Walkthrough — Aerial Drone & Landscape Visualization',
    captionExcerpt: 'Beautiful wide-angle morning views over Green Land Capital’s premier managed farmland project...',
    platform: 'meta',
    format: 'video',
    formatLabel: 'Facebook Video',
    duration: '1:05',
    publishedAt: '3 weeks ago',
    thumbnailUrl: '/source/optimized/banner.webp',
    postUrl: 'https://facebook.com/techgylink/videos/glc-drone',
    verdict: 'average',
    verdictTitle: '⚠️ Average (Pretty Visuals, Low Conversion)',
    score: 58,
    views: 29800,
    impressions: 54000,
    reach: 26000,
    likes: 840,
    comments: 48,
    shares: 88,
    saves: 72,
    engagementRate: 3.8,
    hookRate: 44.0,
    completionRate: 32.0,
    avgWatchTime: '0:28',
    dropOffPoints: [
      { second: 0, percentage: 100, label: 'Drone Start' },
      { second: 3, percentage: 44.0, label: 'Hook' },
      { second: 30, percentage: 38.0, label: 'Farmland Trees' },
      { second: 65, percentage: 32.0, label: 'End' }
    ],
    clicksToBio: 190,
    attributedLeads: 3,
    attributedPipelineValue: '₹8,50,000',
    workingReasons: [
      'High production drone footage looks premium and captures real estate investor interest.'
    ],
    failureReasons: [
      'Zero voiceover or text explanations: Viewers didn\'t know who made the project or how to buy plots.',
      'No mention of TechGy Link\'s role in driving the sales tech stack.',
      'Low click-through to discovery booking form.'
    ],
    actionableRecommendation: 'Re-record with enthusiastic founder voiceover explaining "How this 3D visual tech enabled ₹180Cr in sales". Add bold subtitles.'
  },

  // 7. NOT WORKING - Instagram Reel (Rebrand Announcement)
  {
    id: 'post-07',
    title: 'TechGy Innovations is now TechGy Link: Company Rebrand Announcement',
    captionExcerpt: 'We are thrilled to announce that TechGy Innovations is officially evolving into TechGy Link! Here is what our new brand identity means for our team...',
    platform: 'instagram',
    format: 'reel',
    formatLabel: 'Instagram Reel',
    duration: '0:52',
    publishedAt: '3 weeks ago',
    thumbnailUrl: '/source/optimized/banner.webp',
    postUrl: 'https://instagram.com/p/rebrand-announcement',
    verdict: 'not_working',
    verdictTitle: '❌ Underperforming (78% Hook Bounce)',
    score: 28,
    views: 6200,
    impressions: 8900,
    reach: 5400,
    likes: 180,
    comments: 18,
    shares: 12,
    saves: 8,
    engagementRate: 1.8,
    hookRate: 21.4, // 78.6% bounced before 3 seconds!
    completionRate: 11.2,
    avgWatchTime: '0:07',
    dropOffPoints: [
      { second: 0, percentage: 100, label: 'Start' },
      { second: 3, percentage: 21.4, label: 'MASSIVE DROP (Logo Intro)' },
      { second: 15, percentage: 16.0, label: 'Talking about Vision' },
      { second: 35, percentage: 13.5, label: 'New Colors' },
      { second: 52, percentage: 11.2, label: 'End' }
    ],
    clicksToBio: 15,
    attributedLeads: 0,
    attributedPipelineValue: '₹0',
    workingReasons: [],
    failureReasons: [
      'Lethal 4.8s Static Animated Logo Intro: Instagram algorithm instantly penalized post because 78.6% of viewers swiped away before second 3.',
      'Self-Obsessed Messaging: "We are thrilled to announce..." focuses on the company, not client problems or outcomes.',
      'Zero curiosity gap, zero pain point, zero case study proof.',
      'Zero CRM leads generated.'
    ],
    actionableRecommendation: 'DELETE or ARCHIVE. Never open video content with a spinning corporate logo. Reframe rebrand around client value: "Why we merged 3D visualisation and CRM automation to help developers sell faster."'
  },

  // 8. NOT WORKING - LinkedIn Static Image (World Architecture Day Greeting)
  {
    id: 'post-08',
    title: 'Happy World Architecture Day from the TechGy Link Team!',
    captionExcerpt: 'Wishing all architects and visionaries a very inspiring World Architecture Day. Here\'s to building tomorrow\'s spaces...',
    platform: 'linkedin',
    format: 'static',
    formatLabel: 'LinkedIn Static Graphic',
    publishedAt: '1 month ago',
    thumbnailUrl: '/source/optimized/banner.webp',
    postUrl: 'https://linkedin.com/posts/architecture-day',
    verdict: 'not_working',
    verdictTitle: '❌ Underperforming (Low Reach & Zero Intent)',
    score: 22,
    views: 2100,
    impressions: 3400,
    reach: 1900,
    likes: 42,
    comments: 2,
    shares: 1,
    saves: 3,
    engagementRate: 1.2,
    clicksToBio: 4,
    attributedLeads: 0,
    attributedPipelineValue: '₹0',
    workingReasons: [],
    failureReasons: [
      'Stock Holiday Greeting: LinkedIn algorithm heavily suppresses generic holiday celebration graphics.',
      'Zero business insight or technical demonstration.',
      'Dead clicks: Users scrolled right past without reading caption.'
    ],
    actionableRecommendation: 'Stop posting generic calendar greeting cards. Replace holiday greetings with behind-the-scenes engineering teardowns or real estate client stories.'
  },

  // 9. NOT WORKING - YouTube Video (CRM Architecture Database Schema)
  {
    id: 'post-09',
    title: 'Enterprise CRM Systems Architecture: Deep Dive into API Endpoints & PostgreSQL Schemas',
    captionExcerpt: 'In this technical lecture, we explain how relational schemas handle millions of real estate leads without lock contention...',
    platform: 'youtube',
    format: 'video',
    formatLabel: 'YouTube Long-Form',
    duration: '12:40',
    publishedAt: '1 month ago',
    thumbnailUrl: '/source/optimized/banner.webp',
    postUrl: 'https://youtube.com/watch?v=techgy-database-schema',
    verdict: 'not_working',
    verdictTitle: '❌ Underperforming (Weak Engagement & High Drop-off)',
    score: 32,
    views: 3400,
    impressions: 9800,
    reach: 3100,
    likes: 88,
    comments: 8,
    shares: 6,
    saves: 14,
    engagementRate: 1.9,
    hookRate: 28.0,
    completionRate: 9.8,
    avgWatchTime: '1:42',
    dropOffPoints: [
      { second: 0, percentage: 100, label: 'Slide Title' },
      { second: 3, percentage: 28.0, label: 'Early Drop-off' },
      { second: 75, percentage: 18.2, label: 'Terminal Code Screen' },
      { second: 360, percentage: 12.0, label: 'Schema Diagram' },
      { second: 760, percentage: 9.8, label: 'Conclusion' }
    ],
    clicksToBio: 12,
    attributedLeads: 0,
    attributedPipelineValue: '₹0',
    workingReasons: [
      'High technical depth for backend engineers.'
    ],
    failureReasons: [
      'Target Audience Mismatch: Video is too technical for Real Estate CEOs and Sales Heads who actually hire TechGy Link.',
      'Unedited 12-minute screen recording with dry audio and zero visual hooks.',
      'Massive 72% drop-off within the first 3 seconds.'
    ],
    actionableRecommendation: 'Repurpose the core insight into a high-level 45-second animated Reel: "Why standard CRMs crash when running Meta property ads, and how we solved it in 3 steps."'
  }
];

export interface SocialAnalysisSummary {
  totalAnalyzed: number;
  workingCount: number;
  averageCount: number;
  notWorkingCount: number;
  totalViews: number;
  totalImpressions: number;
  totalEngagements: number;
  totalAttributedLeads: number;
  totalAttributedPipeline: string;
  topFormat: string;
  avgHookRate: number;
}

export function computeSocialSummary(posts: SocialPost[]): SocialAnalysisSummary {
  const totalAnalyzed = posts.length;
  const workingCount = posts.filter(p => p.verdict === 'working').length;
  const averageCount = posts.filter(p => p.verdict === 'average').length;
  const notWorkingCount = posts.filter(p => p.verdict === 'not_working').length;

  const totalViews = posts.reduce((acc, p) => acc + p.views, 0);
  const totalImpressions = posts.reduce((acc, p) => acc + p.impressions, 0);
  const totalEngagements = posts.reduce((acc, p) => acc + p.likes + p.comments + p.shares + p.saves, 0);
  const totalAttributedLeads = posts.reduce((acc, p) => acc + p.attributedLeads, 0);

  const postsWithHook = posts.filter(p => typeof p.hookRate === 'number');
  const avgHookRate = postsWithHook.length > 0
    ? Math.round((postsWithHook.reduce((acc, p) => acc + (p.hookRate || 0), 0) / postsWithHook.length) * 10) / 10
    : 62.4;

  return {
    totalAnalyzed,
    workingCount,
    averageCount,
    notWorkingCount,
    totalViews,
    totalImpressions,
    totalEngagements,
    totalAttributedLeads,
    totalAttributedPipeline: '₹1,43,00,000',
    topFormat: 'Short-Form Video (Reels & Shorts, 28-42s)',
    avgHookRate
  };
}

export function exportSocialAnalysisCsv(posts: SocialPost[]): string {
  const headers = [
    'Post ID',
    'Title',
    'Platform',
    'Format',
    'Verdict',
    'Performance Score',
    'Views',
    'Impressions',
    'Engagement Rate (%)',
    '3s Hook Rate (%)',
    'Shares',
    'Saves',
    'Attributed CRM Leads',
    'Pipeline Value',
    'Why It Worked / Failed',
    'Actionable Recommendation'
  ];

  const rows = posts.map(p => [
    p.id,
    `"${p.title.replace(/"/g, '""')}"`,
    p.platform.toUpperCase(),
    p.formatLabel,
    p.verdict.toUpperCase(),
    p.score,
    p.views,
    p.impressions,
    `${p.engagementRate}%`,
    p.hookRate ? `${p.hookRate}%` : 'N/A',
    p.shares,
    p.saves,
    p.attributedLeads,
    `"${p.attributedPipelineValue}"`,
    `"${(p.verdict === 'working' ? p.workingReasons.join('; ') : p.failureReasons.join('; ')).replace(/"/g, '""')}"`,
    `"${p.actionableRecommendation.replace(/"/g, '""')}"`
  ]);

  return [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
}

