import { INITIAL_EMAIL_TEMPLATES } from './mockData';

// Default master data (lookups, templates, checklists) used until the user edits it
export const INITIAL_MASTER_DATA = {
  // 1. Content Types
  contentTypes: [
    { id: 'CNT-001', name: 'Email Outreach & Pitch' },
    { id: 'CNT-002', name: 'WhatsApp Business Template' },
    { id: 'CNT-003', name: 'Product Brochure & Spec Sheet' },
    { id: 'CNT-004', name: 'Commercial Proposal & Service Contract' },
    { id: 'CNT-005', name: 'Inbound Web Inquiry & Form' },
    { id: 'CNT-006', name: 'SMS Alert & Verification OTP' },
    { id: 'CNT-007', name: 'Interactive Product Demo Deck' },
    { id: 'CNT-008', name: 'Short-Form Reel & Video Hook Asset' },
    { id: 'CNT-009', name: 'Long-Form Video & YouTube Masterclass' },
    { id: 'CNT-010', name: 'LinkedIn Carousel & Thought Leadership Deck' },
    { id: 'CNT-011', name: 'Customer Success Video Story & Testimonial' }
  ],

  // 2. Lead Follow-up Types
  followupTypes: [
    { id: 'FUT-001', name: 'Discovery Follow-up' },
    { id: 'FUT-002', name: 'Architecture & Demo Walkthrough' },
    { id: 'FUT-003', name: 'Proposal & Commercials Review' },
    { id: 'FUT-004', name: 'WhatsApp Milestone Check-in' },
    { id: 'FUT-005', name: 'Executive Decision Alignment' },
    { id: 'FUT-006', name: 'Re-engagement / Nurture Touchpoint' }
  ],

  // 3. Lead Follow-up Status
  followupStatuses: [
    { id: 'FUS-001', description: 'Immediate Callback Scheduled' },
    { id: 'FUS-002', description: 'Pending Technical Architecture Review' },
    { id: 'FUS-003', description: 'Executive Pitch Deck Dispatched' },
    { id: 'FUS-004', description: 'Commercial Proposal Under Review' },
    { id: 'FUS-005', description: 'Follow-up Cadence Paused / Delayed' },
    { id: 'FUS-006', description: 'Contact Reached & Milestone Completed' }
  ],

  // 4. Lead Status
  leadStatuses: [
    { id: 'LST-001', name: 'New' },
    { id: 'LST-002', name: 'Contacted' },
    { id: 'LST-003', name: 'Qualified' },
    { id: 'LST-004', name: 'Discussion' },
    { id: 'LST-005', name: 'Proposal' },
    { id: 'LST-006', name: 'Negotiation' },
    { id: 'LST-007', name: 'Won' },
    { id: 'LST-008', name: 'Lost' }
  ],

  // 5. Objections
  objections: [
    {
      id: 'OBJ-001',
      name: 'Budgetary Constraints & Pricing'
    },
    {
      id: 'OBJ-002',
      name: 'Competitor Multi-Year Contract Lock-in'
    },
    {
      id: 'OBJ-003',
      name: 'Data Security & SOC 2 / ISO Compliance'
    },
    {
      id: 'OBJ-004',
      name: 'Internal Implementation Bandwidth'
    },
    {
      id: 'OBJ-005',
      name: 'Legacy CRM Database Migration Risk'
    }
  ],

  // 6. Agent Checklist (Mapped to Lead Status with Points to Talk)
  agentChecklist: [
    {
      id: 'CHK-001',
      leadStatus: 'New',
      pointsToTalk: 'Introduce TechGy enterprise positioning and validate primary business challenge and company scale.',
      name: 'Introduce TechGy enterprise positioning and validate primary business challenge and company scale.',
      description: 'Introduce TechGy enterprise positioning and validate primary business challenge and company scale.'
    },
    {
      id: 'CHK-002',
      leadStatus: 'New',
      pointsToTalk: 'Confirm current CRM or toolstack being used and primary pain points or renewal timeline.',
      name: 'Confirm current CRM or toolstack being used and primary pain points or renewal timeline.',
      description: 'Confirm current CRM or toolstack being used and primary pain points or renewal timeline.'
    },
    {
      id: 'CHK-003',
      leadStatus: 'Contacted',
      pointsToTalk: 'Demonstrate API architecture connectors, key features & 99.95% enterprise uptime guarantee.',
      name: 'Demonstrate API architecture connectors, key features & 99.95% enterprise uptime guarantee.',
      description: 'Demonstrate API architecture connectors, key features & 99.95% enterprise uptime guarantee.'
    },
    {
      id: 'CHK-004',
      leadStatus: 'Contacted',
      pointsToTalk: 'Identify operational champions, daily user seat headcount, and key workflow bottlenecks.',
      name: 'Identify operational champions, daily user seat headcount, and key workflow bottlenecks.',
      description: 'Identify operational champions, daily user seat headcount, and key workflow bottlenecks.'
    },
    {
      id: 'CHK-005',
      leadStatus: 'Qualified',
      pointsToTalk: 'Identify budget authority & procurement stakeholder sign-off process and budget cycle timeline.',
      name: 'Identify budget authority & procurement stakeholder sign-off process and budget cycle timeline.',
      description: 'Identify budget authority & procurement stakeholder sign-off process and budget cycle timeline.'
    },
    {
      id: 'CHK-006',
      leadStatus: 'Qualified',
      pointsToTalk: 'Validate client data security, ISO 27001 / SOC 2 compliance, and cloud hosting preferences.',
      name: 'Validate client data security, ISO 27001 / SOC 2 compliance, and cloud hosting preferences.',
      description: 'Validate client data security, ISO 27001 / SOC 2 compliance, and cloud hosting preferences.'
    },
    {
      id: 'CHK-007',
      leadStatus: 'Discussion',
      pointsToTalk: 'Present customized live solution demo matching discovered business pain points.',
      name: 'Present customized live solution demo matching discovered business pain points.',
      description: 'Present customized live solution demo matching discovered business pain points.'
    },
    {
      id: 'CHK-008',
      leadStatus: 'Discussion',
      pointsToTalk: 'Lock in agreed follow-up milestone for technical proof-of-concept (PoC) evaluation.',
      name: 'Lock in agreed follow-up milestone for technical proof-of-concept (PoC) evaluation.',
      description: 'Lock in agreed follow-up milestone for technical proof-of-concept (PoC) evaluation.'
    },
    {
      id: 'CHK-009',
      leadStatus: 'Proposal',
      pointsToTalk: 'Dispatch comprehensive commercial proposal, user tier options, and custom implementation scope.',
      name: 'Dispatch comprehensive commercial proposal, user tier options, and custom implementation scope.',
      description: 'Dispatch comprehensive commercial proposal, user tier options, and custom implementation scope.'
    },
    {
      id: 'CHK-010',
      leadStatus: 'Proposal',
      pointsToTalk: 'Address procurement queries, software billing terms, and deliver customer ROI case studies.',
      name: 'Address procurement queries, software billing terms, and deliver customer ROI case studies.',
      description: 'Address procurement queries, software billing terms, and deliver customer ROI case studies.'
    },
    {
      id: 'CHK-011',
      leadStatus: 'Negotiation',
      pointsToTalk: 'Finalize SLA guarantees, dedicated customer success tier, and multi-year licensing terms.',
      name: 'Finalize SLA guarantees, dedicated customer success tier, and multi-year licensing terms.',
      description: 'Finalize SLA guarantees, dedicated customer success tier, and multi-year licensing terms.'
    },
    {
      id: 'CHK-012',
      leadStatus: 'Negotiation',
      pointsToTalk: 'Confirm Master Services Agreement (MSA) review turnaround with legal and procurement leads.',
      name: 'Confirm Master Services Agreement (MSA) review turnaround with legal and procurement leads.',
      description: 'Confirm Master Services Agreement (MSA) review turnaround with legal and procurement leads.'
    },
    {
      id: 'CHK-013',
      leadStatus: 'Won',
      pointsToTalk: 'Conduct transition kickoff call with Customer Success and establish implementation timeline.',
      name: 'Conduct transition kickoff call with Customer Success and establish implementation timeline.',
      description: 'Conduct transition kickoff call with Customer Success and establish implementation timeline.'
    },
    {
      id: 'CHK-014',
      leadStatus: 'Lost',
      pointsToTalk: 'Document detailed loss root cause (budget, competitor, timing) and schedule follow-up in 6 months.',
      name: 'Document detailed loss root cause (budget, competitor, timing) and schedule follow-up in 6 months.',
      description: 'Document detailed loss root cause (budget, competitor, timing) and schedule follow-up in 6 months.'
    }
  ],

  // 7. Email Templates (Category Removed)
  emailTemplates: [
    ...INITIAL_EMAIL_TEMPLATES.map(t => ({
      id: t.id,
      name: t.name,
      subject: t.subject,
      body: t.body
    })),
    {
      id: 'TPL-006',
      name: 'Enterprise Service & Security Architecture Brief',
      subject: 'Enterprise Service Terms & Compliance Standards for {company}',
      body: `Hi {leadName},\n\nFollowing our discussion regarding data governance, I've compiled our complete ISO 27001, SOC 2 Type II compliance pack and 99.95% uptime documentation for {company}.\n\nPlease let me know if your IT security team requires an architectural alignment call.\n\nBest regards,\nRajesh Sharma\nTechGy Solutions`
    }
  ],

  // 8. Industries (Standard Margin & Domain Focus Area Removed)
  industries: [
    { id: 'IND-001', name: 'Enterprise Software', code: 'IT-SOFT' },
    { id: 'IND-002', name: 'Cloud Infrastructure & DevOps', code: 'IT-CLD' },
    { id: 'IND-003', name: 'Financial Services & Banking', code: 'BFSI-FIN' },
    { id: 'IND-004', name: 'Healthcare & Pharma', code: 'HLTH-MED' },
    { id: 'IND-005', name: 'Manufacturing & Supply Chain', code: 'MFG-SCM' },
    { id: 'IND-006', name: 'Retail & Consumer Goods', code: 'RET-ECOM' },
    { id: 'IND-007', name: 'Renewable Energy & CleanTech', code: 'ENG-CLN' },
    { id: 'IND-008', name: 'Consulting & Professional Services', code: 'CNS-SERV' }
  ],

  // Supporting Master Catalogs
  // Products & Services (Cleaned: Category, Standard Pricing, Billing Model Removed)
  products: [
    { id: 'PRD-001', name: 'TechGy CRM Enterprise Suite' },
    { id: 'PRD-002', name: 'Omnichannel Voice & AI Dialer' },
    { id: 'PRD-003', name: 'Field Sales Mobility & Geofencing' },
    { id: 'PRD-004', name: 'Enterprise Data Migration & Onboarding' },
    { id: 'PRD-005', name: 'Custom ERP & WhatsApp Gateway Integration' },
    { id: 'PRD-006', name: 'Cloud Infrastructure & Security Solutions' },
    { id: 'PRD-007', name: 'Dedicated Support & AMC' },
    { id: 'PRD-008', name: 'Website Heatmap & Real-Time Click Engine' },
    { id: 'PRD-009', name: 'Social Content & Video Retention Analytics' }
  ],

  // Sources (Cleaned: Channel Type, Attribution Weight, Cost per Lead Removed)
  sources: [
    { id: 'SRC-001', name: 'Website' },
    { id: 'SRC-002', name: 'Inbound Call' },
    { id: 'SRC-003', name: 'Referral' },
    { id: 'SRC-004', name: 'LinkedIn' },
    { id: 'SRC-005', name: 'Campaign' },
    { id: 'SRC-006', name: 'Partner' },
    { id: 'SRC-007', name: 'Meta / Facebook Ads' },
    { id: 'SRC-008', name: 'Instagram Ads & Reels' },
    { id: 'SRC-009', name: 'YouTube Brand Channel' },
    { id: 'SRC-010', name: 'WhatsApp Business Inbound' },
    { id: 'SRC-011', name: 'Website Heatmap Inbound CTA' },
    { id: 'SRC-012', name: 'X (Twitter) Outbound' },
    { id: 'SRC-013', name: 'TikTok Business Form' }
  ],

  // Website Heatmap Monitored Domains
  heatmapDomains: [
    { id: 'HTM-001', name: 'techgylink.com (Main Website / Landing Page)' },
    { id: 'HTM-002', name: 'app.techgylink.com (Cloud CRM Web App Portal)' },
    { id: 'HTM-003', name: 'docs.techgylink.com (Developer API & Docs Hub)' },
    { id: 'HTM-004', name: 'greenlandcapital.in (Client Showcase Landing Page)' }
  ],

  // Connected Social Channels & Video Telemetry Ingest Pipelines
  socialPlatforms: [
    { id: 'SOC-001', name: 'Instagram (@techgylink)' },
    { id: 'SOC-002', name: 'LinkedIn (TechGy Link)' },
    { id: 'SOC-003', name: 'YouTube (@TechGyLink)' },
    { id: 'SOC-004', name: 'Meta / Facebook (TechGyLinkOfficial)' },
    { id: 'SOC-005', name: 'X / Twitter (@TechGyLink)' },
    { id: 'SOC-006', name: 'TikTok (@techgylink)' }
  ]
};
