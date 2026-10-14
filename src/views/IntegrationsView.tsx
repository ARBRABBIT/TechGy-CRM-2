import React, { useEffect, useMemo, useRef, useState } from 'react';
import { SiMeta, SiGoogleads, SiGooglemaps } from 'react-icons/si';
import { FaLinkedin } from 'react-icons/fa6';
import {
  LuWebhook,
  LuSend,
  LuSettings2,
  LuCopy,
  LuCheck,
  LuX,
  LuInfo,
  LuArrowRight,
  LuPlug,
  LuInbox,
  LuFilter,
  LuCopyCheck,
  LuUserCheck,
  LuSearch,
  LuDownload,
  LuEye,
  LuCode,
  LuFileText,
  LuTerminal,
  LuCircleCheck,
  LuTriangleAlert,
  LuExternalLink,
  LuSlidersHorizontal,
  LuMapPin,
  LuPhoneCall,
  LuUsers,
  LuDollarSign,
  LuStar
} from 'react-icons/lu';
import {
  CONNECTORS,
  CRM_FIELDS,
  buildIntakeLead,
  sampleSubmission
} from '../utils/leadIntake';
import { API_BASE_URL, USE_MOCK_FALLBACK } from '../constants/apiConfig';
import useDialog from '../hooks/useDialog';
import { EmptyState } from '../components/common/StateViews';
import { onKeyActivate } from '../utils/a11y';

const BRAND = {
  meta: { icon: SiMeta, color: '#0866FF', bg: '#E8F0FF' },
  googleAds: { icon: SiGoogleads, color: '#1A73E8', bg: '#E8F1FD' },
  linkedin: { icon: FaLinkedin, color: '#0A66C2', bg: '#E7F0F9' },
  webhook: { icon: LuWebhook, color: '#0F1A34', bg: '#F1F3F8' },
  googleMaps: { icon: SiGooglemaps, color: '#EA4335', bg: '#FEECEB' }
};

const PROJECTS = ['Farm Natura', 'Reliance Elysium', 'TechGy CRM Enterprise Suite'];
const PRIORITIES = ['High', 'Medium', 'Low'];

const FLOW = [
  { icon: LuPlug, title: 'Form submitted', text: 'On Meta, Google, LinkedIn or a webhook' },
  { icon: LuFilter, title: 'Fields mapped', text: 'Platform fields become CRM fields' },
  { icon: LuCopyCheck, title: 'Duplicate check', text: 'Same email or phone is caught' },
  { icon: LuUserCheck, title: 'Routed', text: 'Unassigned queue or straight to an executive' }
];

// Mock Google Maps Business Profile locations & performance data
const GOOGLE_MAPS_LOCATIONS = [
  {
    id: 'all',
    name: 'All Locations (3 Listings)',
    address: 'Pan-India Corporate Headquarters & Innovation Hubs',
    rating: 4.9,
    reviews: 846,
    views: 58420,
    searchShare: '38% Search • 62% Maps',
    calls: 1420,
    directions: 2180,
    websiteClicks: 3460,
    messages: 360,
    leads: 186,
    closedDeals: 24,
    salesRevenue: '₹1,42,50,000',
    salesRaw: 14250000,
    convRate: '12.9%'
  },
  {
    id: 'mumbai',
    name: 'TechGy HQ – BKC, Mumbai',
    address: 'G-Block, Bandra Kurla Complex, Mumbai, Maharashtra 400051',
    rating: 4.9,
    reviews: 428,
    views: 28400,
    searchShare: '42% Search • 58% Maps',
    calls: 740,
    directions: 1120,
    websiteClicks: 1720,
    messages: 180,
    leads: 92,
    closedDeals: 14,
    salesRevenue: '₹86,00,000',
    salesRaw: 8600000,
    convRate: '15.2%'
  },
  {
    id: 'bangalore',
    name: 'TechGy Innovation Hub – Indiranagar, Bangalore',
    address: '100 Feet Road, HAL 2nd Stage, Indiranagar, Bengaluru, Karnataka 560038',
    rating: 4.8,
    reviews: 264,
    views: 18200,
    searchShare: '35% Search • 65% Maps',
    calls: 430,
    directions: 690,
    websiteClicks: 1140,
    messages: 110,
    leads: 58,
    closedDeals: 7,
    salesRevenue: '₹39,50,000',
    salesRaw: 3950000,
    convRate: '12.1%'
  },
  {
    id: 'delhi',
    name: 'TechGy North Hub – Cyber City, Gurugram',
    address: 'DLF Cyber City, Building 10, Gurugram, Haryana 122002',
    rating: 4.9,
    reviews: 154,
    views: 11820,
    searchShare: '32% Search • 68% Maps',
    calls: 250,
    directions: 370,
    websiteClicks: 600,
    messages: 70,
    leads: 36,
    closedDeals: 3,
    salesRevenue: '₹17,00,000',
    salesRaw: 1700000,
    convRate: '8.3%'
  }
];

const GOOGLE_MAPS_KEYWORDS = [
  { term: 'CRM software company Mumbai', category: 'Category Search', impressions: 14200, calls: 380, salesAttributed: '₹48,00,000' },
  { term: 'Enterprise CRM provider near me', category: 'Discovery Search', impressions: 11800, calls: 290, salesAttributed: '₹38,50,000' },
  { term: 'TechGy CRM headquarters BKC', category: 'Direct Brand', impressions: 9400, calls: 310, salesAttributed: '₹24,00,000' },
  { term: 'Cloud ERP & CRM solutions Bangalore', category: 'Category Search', impressions: 8600, calls: 220, salesAttributed: '₹19,00,000' },
  { term: 'Real estate CRM consultants Gurgaon', category: 'Discovery Search', impressions: 6200, calls: 180, salesAttributed: '₹13,00,000' }
];

const GOOGLE_MAPS_RECENT_DEALS = [
  { id: 'GM-101', client: 'Lodha Enterprise Logistics', branch: 'Mumbai HQ (BKC)', type: 'Google Maps Inbound Call', owner: 'Sneha Rao', stage: 'Closed Won', value: '₹18,50,000', status: 'Won', date: '2 days ago' },
  { id: 'GM-102', client: 'Kalyan Jewellers Corporate', branch: 'Mumbai HQ (BKC)', type: 'Directions Request -> Office Visit', owner: 'Rahul Verma', stage: 'Closed Won', value: '₹24,00,000', status: 'Won', date: '4 days ago' },
  { id: 'GM-103', client: 'Prestige Cloud Infrastructure', branch: 'Bangalore Hub', type: 'Google Business Chat Message', owner: 'Aditya Joshi', stage: 'Closed Won', value: '₹15,00,000', status: 'Won', date: '1 week ago' },
  { id: 'GM-104', client: 'CyberPark IT Services', branch: 'Delhi NCR Hub', type: 'Google Maps Inbound Call', owner: 'Sneha Rao', stage: 'Negotiation', value: '₹12,00,000', status: 'Pipeline', date: '1 week ago' },
  { id: 'GM-105', client: 'Apollo Health Tech Global', branch: 'Bangalore Hub', type: 'Google Maps Inbound Call', owner: 'Rahul Verma', stage: 'Proposal Sent', value: '₹22,00,000', status: 'Pipeline', date: '2 weeks ago' },
  { id: 'GM-106', client: 'Mahindra Logistics Regional', branch: 'Mumbai HQ (BKC)', type: 'Google Business Profile Direct Call', owner: 'Sneha Rao', stage: 'Closed Won', value: '₹32,50,000', status: 'Won', date: '3 weeks ago' }
];

const webhookUrl = (id) => `${API_BASE_URL.replace(/\/$/, '')}/integrations/${id}/webhook`;

function timeAgo(iso) {
  if (!iso) return '—';
  const secs = Math.max(0, Math.round((Date.now() - new Date(iso).getTime()) / 1000));
  if (secs < 60) return 'just now';
  if (secs < 3600) return `${Math.floor(secs / 60)} min ago`;
  if (secs < 86400) return `${Math.floor(secs / 3600)} h ago`;
  return `${Math.floor(secs / 86400)} d ago`;
}

function BrandMark({ id, size = 22 }) {
  const brand = BRAND[id] || BRAND.webhook;
  const Icon = brand.icon;
  return (
    <span className="integ-brand" style={{ background: brand.bg, color: brand.color }} aria-hidden="true">
      <Icon size={size} />
    </span>
  );
}

function CopyField({ value, label }) {
  const [copied, setCopied] = useState(false);
  return (
    <div className="integ-copy">
      <code title={value}>{value}</code>
      <button
        type="button"
        className="integ-icon-btn"
        aria-label={`Copy ${label}`}
        onClick={() => {
          navigator.clipboard?.writeText(value);
          setCopied(true);
          setTimeout(() => setCopied(false), 1500);
        }}
      >
        {copied ? <LuCheck size={16} /> : <LuCopy size={16} />}
      </button>
    </div>
  );
}

/**
 * Configure Connector Dialog
 * Features sticky header, section jump navigation, smoothly scrollable content, and sticky footer.
 */
function ConnectorDialog({
  connector,
  settings,
  salesHeads,
  salesExecutives,
  backendReady,
  onClose,
  onSave,
  onSendTestLead
}) {
  const [draft, setDraft] = useState(settings);
  const [activeSection, setActiveSection] = useState('routing');
  const [testSentMessage, setTestSentMessage] = useState(null);
  const dialogRef = useRef(null);
  const scrollContainerRef = useRef(null);
  useDialog(dialogRef, true, onClose);

  const set = (patch) => setDraft(prev => ({ ...prev, ...patch }));
  const setRouting = (patch) => setDraft(prev => ({ ...prev, routing: { ...prev.routing, ...patch } }));
  const titleId = `integ-dialog-${connector.id}`;

  const scrollToSection = (secId) => {
    setActiveSection(secId);
    const target = scrollContainerRef.current?.querySelector(`#sec-${secId}`);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleTestInDialog = () => {
    if (onSendTestLead) {
      onSendTestLead(connector.id);
      setTestSentMessage(`Test lead successfully sent for ${connector.name}!`);
      setTimeout(() => setTestSentMessage(null), 4000);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        ref={dialogRef}
        className="modal-card integ-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        onClick={(e) => e.stopPropagation()}
      >
        <form
          onSubmit={(e) => {
            e.preventDefault();
            onSave(draft);
          }}
          style={{ display: 'flex', flexDirection: 'column', height: '100%', minHeight: 0, overflow: 'hidden' }}
        >
          {/* 1. Sticky Header */}
          <div className="integ-dialog-head">
            <BrandMark id={connector.id} />
            <div className="integ-dialog-title">
              <h3 id={titleId}>{connector.name}</h3>
              <span>{connector.platform} • {draft.enabled ? 'Enabled' : 'Disabled'}</span>
            </div>
            <button type="button" className="integ-icon-btn" aria-label="Close" onClick={onClose}>
              <LuX size={18} />
            </button>
          </div>

          {/* 2. Jump Navigation Pills */}
          <div className="integ-dialog-jump-nav" aria-label="Dialog sections">
            <button
              type="button"
              className={`integ-jump-btn ${activeSection === 'connection' ? 'active' : ''}`}
              onClick={() => scrollToSection('connection')}
            >
              1. Connection
            </button>
            <button
              type="button"
              className={`integ-jump-btn ${activeSection === 'routing' ? 'active' : ''}`}
              onClick={() => scrollToSection('routing')}
            >
              2. Lead Routing
            </button>
            <button
              type="button"
              className={`integ-jump-btn ${activeSection === 'mapping' ? 'active' : ''}`}
              onClick={() => scrollToSection('mapping')}
            >
              3. Field Mapping
            </button>
            <button
              type="button"
              className={`integ-jump-btn ${activeSection === 'test' ? 'active' : ''}`}
              onClick={() => scrollToSection('test')}
            >
              4. Test Intake
            </button>
          </div>

          {/* 3. Smoothly Scrollable Body with min-height: 0 */}
          <div className="integ-dialog-body" ref={scrollContainerRef}>
            {/* 1. Connection Section */}
            <section id="sec-connection" className="integ-section">
              <h4>1. Connection Setup</h4>
              {!backendReady && (
                <div className="integ-note">
                  <LuInfo size={16} aria-hidden="true" />
                  <span>Live connection needs the CRM backend. All configurations are saved now and used immediately upon deployment.</span>
                </div>
              )}
              <ol className="integ-steps">
                {connector.steps.map(step => <li key={step}>{step}</li>)}
              </ol>
              {connector.connectMethod === 'webhook' ? (
                <div className="integ-field">
                  <span className="integ-label">Webhook Endpoint URL</span>
                  <CopyField value={webhookUrl(connector.id)} label="webhook URL" />
                  <span className="integ-hint">The signing secret is secured by the server and verified via HMAC headers.</span>
                </div>
              ) : (
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <button type="button" className="btn-primary" disabled title="Available once the CRM backend is deployed">
                    <LuPlug aria-hidden="true" />
                    <span>Connect {connector.source}</span>
                  </button>
                  <span className="integ-hint">Requires verified developer account credentials.</span>
                </div>
              )}
            </section>

            {/* 2. Routing Section */}
            <section id="sec-routing" className="integ-section">
              <h4>2. Lead Routing & Rules</h4>
              <label className="integ-switch">
                <input
                  type="checkbox"
                  checked={draft.enabled}
                  onChange={(e) => set({ enabled: e.target.checked })}
                  aria-label="Import leads from this connector"
                />
                <span className="integ-switch-track" aria-hidden="true" />
                <span>Import leads from this connector</span>
              </label>

              <div className="integ-grid-2">
                <label className="integ-field">
                  <span className="integ-label">Default Target Project</span>
                  <select className="form-select" value={draft.project} onChange={(e) => set({ project: e.target.value })}>
                    {PROJECTS.map(p => <option key={p}>{p}</option>)}
                  </select>
                </label>
                <label className="integ-field">
                  <span className="integ-label">Lead Priority</span>
                  <select className="form-select" value={draft.priority} onChange={(e) => set({ priority: e.target.value })}>
                    {PRIORITIES.map(p => <option key={p}>{p}</option>)}
                  </select>
                </label>
              </div>

              <fieldset className="integ-radios">
                <legend className="integ-label">Executive Assignment Strategy</legend>
                <label>
                  <input type="radio" name="routing" checked={draft.routing.mode === 'unassigned'} onChange={() => setRouting({ mode: 'unassigned' })} />
                  <span>Leave in the Unassigned queue</span>
                </label>
                <label>
                  <input type="radio" name="routing" checked={draft.routing.mode === 'balanced'} onChange={() => setRouting({ mode: 'balanced' })} />
                  <span>Auto-assign to the least-busy executive in</span>
                  <select
                    className="form-select integ-inline-select"
                    aria-label="Team for auto-assignment"
                    value={draft.routing.salesHead}
                    disabled={draft.routing.mode !== 'balanced'}
                    onChange={(e) => setRouting({ salesHead: e.target.value })}
                  >
                    <option value="">All teams</option>
                    {salesHeads.map(sh => <option key={sh.id} value={sh.name}>{sh.name}’s team</option>)}
                  </select>
                </label>
                <label>
                  <input
                    type="radio"
                    name="routing"
                    checked={draft.routing.mode === 'executive'}
                    onChange={() => setRouting({ mode: 'executive', executive: draft.routing.executive || salesExecutives[0]?.name || '' })}
                  />
                  <span>Always assign to</span>
                  <select
                    className="form-select integ-inline-select"
                    aria-label="Executive to assign"
                    value={draft.routing.executive}
                    disabled={draft.routing.mode !== 'executive'}
                    onChange={(e) => setRouting({ executive: e.target.value })}
                  >
                    {salesExecutives.map(se => <option key={se.id} value={se.name}>{se.name}</option>)}
                  </select>
                </label>
              </fieldset>

              <fieldset className="integ-radios">
                <legend className="integ-label">Duplicate Handling (Same Email or Phone)</legend>
                <label>
                  <input type="radio" name="duplicates" checked={draft.duplicates === 'skip'} onChange={() => set({ duplicates: 'skip' })} />
                  <span>Skip — don’t create a second lead</span>
                </label>
                <label>
                  <input type="radio" name="duplicates" checked={draft.duplicates === 'flag'} onChange={() => set({ duplicates: 'flag' })} />
                  <span>Import and flag as a possible duplicate</span>
                </label>
              </fieldset>
            </section>

            {/* 3. Field Mapping Section */}
            <section id="sec-mapping" className="integ-section">
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <h4>3. Field Mapping</h4>
                <button
                  type="button"
                  className="btn-secondary btn-sm"
                  onClick={() => set({ mapping: { ...connector.defaultMapping } })}
                  title="Reset mapping to platform defaults"
                >
                  Reset to defaults
                </button>
              </div>
              <p className="integ-hint" style={{ margin: 0 }}>
                Map platform form fields directly into CRM lead properties. Unmapped fields will be placed into lead activity notes.
              </p>
              <div className="integ-mapping">
                {connector.fields.map(field => (
                  <div key={field.key} className="integ-map-row">
                    <span className="integ-map-source">{field.label}</span>
                    <LuArrowRight size={14} aria-hidden="true" />
                    <select
                      className="form-select"
                      aria-label={`CRM field for ${field.label}`}
                      value={draft.mapping[field.key] ?? ''}
                      onChange={(e) => set({ mapping: { ...draft.mapping, [field.key]: e.target.value } })}
                    >
                      {CRM_FIELDS.map(f => <option key={f.value} value={f.value}>{f.label}</option>)}
                    </select>
                  </div>
                ))}
              </div>
            </section>

            {/* 4. Test Intake Verification */}
            <section id="sec-test" className="integ-section" style={{ borderBottom: 'none' }}>
              <h4>4. Test Intake & Simulator</h4>
              <p className="integ-hint" style={{ margin: 0 }}>
                Verify routing and mappings by dispatching a realistic mock form submission right now.
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '6px' }}>
                <button type="button" className="btn-secondary" onClick={handleTestInDialog}>
                  <LuSend size={15} />
                  <span>Send Test Submission Now</span>
                </button>
                {testSentMessage && (
                  <span style={{ fontSize: '0.8125rem', color: '#059669', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <LuCircleCheck size={16} />
                    {testSentMessage}
                  </span>
                )}
              </div>
            </section>
          </div>

          {/* 4. Pinned Sticky Footer */}
          <div className="integ-dialog-foot">
            <button type="button" className="btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              Save settings
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

/**
 * Lead Intake Payload Inspector Modal
 */
function IntakeDetailsModal({ lead, onClose }) {
  const dialogRef = useRef(null);
  useDialog(dialogRef, true, onClose);
  const [copied, setCopied] = useState(false);

  if (!lead) return null;

  const rawJson = JSON.stringify(lead.intake?.rawPayload || {
    leadName: lead.leadName,
    email: lead.emailId,
    phone: lead.phoneNumber,
    company: lead.company,
    designation: lead.designation,
    campaign: lead.intake?.campaign,
    receivedAt: lead.intake?.receivedAt
  }, null, 2);

  const copyPayload = () => {
    navigator.clipboard?.writeText(rawJson);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        ref={dialogRef}
        className="modal-card integ-dialog"
        role="dialog"
        aria-modal="true"
        aria-label="Intake Details"
        onClick={(e) => e.stopPropagation()}
        style={{ height: 'min(80vh, 650px)' }}
      >
        <div className="integ-dialog-head">
          <BrandMark id={lead.intake?.connectorId || 'webhook'} />
          <div className="integ-dialog-title">
            <h3>Intake Payload: {lead.leadName}</h3>
            <span>{lead.leadSource} • {timeAgo(lead.intake?.receivedAt)}</span>
          </div>
          <button type="button" className="integ-icon-btn" aria-label="Close" onClick={onClose}>
            <LuX size={18} />
          </button>
        </div>

        <div className="integ-dialog-body" style={{ padding: '1.25rem 1.5rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: '1rem', marginBottom: '1.25rem' }}>
            <div style={{ background: '#F8FAFC', padding: '0.875rem', borderRadius: 'var(--radius-popup, 3px)', border: '1px solid #EEF1F6' }}>
              <div style={{ fontSize: '0.75rem', color: '#557396', fontWeight: 600, textTransform: 'uppercase' }}>Routing Status</div>
              <div style={{ fontSize: '0.9375rem', fontWeight: 700, color: '#0F1A34', marginTop: '2px' }}>
                {lead.salesExecutive ? `Assigned to ${lead.salesExecutive}` : 'Unassigned Queue'}
              </div>
              <div style={{ fontSize: '0.75rem', color: '#557396', marginTop: '4px' }}>
                {lead.salesHead ? `Team Head: ${lead.salesHead}` : 'Direct Intake'}
              </div>
            </div>

            <div style={{ background: '#F8FAFC', padding: '0.875rem', borderRadius: 'var(--radius-popup, 3px)', border: '1px solid #EEF1F6' }}>
              <div style={{ fontSize: '0.75rem', color: '#557396', fontWeight: 600, textTransform: 'uppercase' }}>Campaign & Type</div>
              <div style={{ fontSize: '0.9375rem', fontWeight: 700, color: '#0F1A34', marginTop: '2px' }}>
                {lead.intake?.campaign || 'Organic / Direct'}
              </div>
              <div style={{ fontSize: '0.75rem', color: lead.intake?.isTest ? '#0022FF' : '#059669', marginTop: '4px', fontWeight: 600 }}>
                {lead.intake?.isTest ? 'Simulated Test Intake' : 'Live Lead Submission'}
              </div>
            </div>
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
              <span className="integ-label">Raw Form Payload (JSON)</span>
              <button type="button" className="btn-secondary btn-sm" onClick={copyPayload}>
                {copied ? <LuCheck size={14} /> : <LuCopy size={14} />}
                <span>{copied ? 'Copied' : 'Copy Payload'}</span>
              </button>
            </div>
            <pre className="integ-code-block" style={{ maxHeight: '220px', margin: 0 }}>
              <code>{rawJson}</code>
            </pre>
          </div>
        </div>

        <div className="integ-dialog-foot">
          <button type="button" className="btn-secondary" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

export default function IntegrationsView({
  integrations,
  leads = [],
  salesHeads = [],
  salesExecutives = [],
  onUpdateIntegration,
  onSendTestLead,
  onSelectLead,
  initialTab = 'connectors'
}) {
  const [activeTab, setActiveTab] = useState(initialTab); // 'connectors' | 'googleMaps' | 'heatmap' | 'logs' | 'docs' | 'sandbox'

  useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab);
    }
  }, [initialTab]);
  const [selectedLocationId, setSelectedLocationId] = useState('all');
  const [selectedPeriod, setSelectedPeriod] = useState('30d');
  const [configuringId, setConfiguringId] = useState(null);
  const [inspectingLead, setInspectingLead] = useState(null);
  const [logSearch, setLogSearch] = useState('');
  const [logConnectorFilter, setLogConnectorFilter] = useState('all');

  // Sandbox simulation state
  const [sandboxConnectorId, setSandboxConnectorId] = useState('meta');
  const [sandboxPayloadText, setSandboxPayloadText] = useState(() =>
    JSON.stringify(sampleSubmission('meta').payload, null, 2)
  );
  const [sandboxResult, setSandboxResult] = useState(null);

  const backendReady = !USE_MOCK_FALLBACK;

  const captured = useMemo(
    () => leads
      .filter(l => l.intake?.connectorId)
      .sort((a, b) => (b.intake?.receivedAt || '').localeCompare(a.intake?.receivedAt || '')),
    [leads]
  );

  const enabledCount = CONNECTORS.filter(c => integrations[c.id]?.enabled).length;
  const totalReceived = CONNECTORS.reduce((n, c) => n + (integrations[c.id]?.stats.received || 0), 0);
  const totalSkipped = CONNECTORS.reduce((n, c) => n + (integrations[c.id]?.stats.skipped || 0), 0);
  const lastReceived = CONNECTORS.map(c => integrations[c.id]?.stats.lastReceivedAt).filter(Boolean).sort().pop();
  const configuring = CONNECTORS.find(c => c.id === configuringId);

  // Selected Google Maps branch data
  const activeLocation = useMemo(() => {
    return GOOGLE_MAPS_LOCATIONS.find(l => l.id === selectedLocationId) || GOOGLE_MAPS_LOCATIONS[0];
  }, [selectedLocationId]);

  // Filtered log entries
  const filteredLogs = useMemo(() => {
    return captured.filter(l => {
      const matchConn = logConnectorFilter === 'all' || l.intake?.connectorId === logConnectorFilter;
      const query = logSearch.trim().toLowerCase();
      const matchSearch = !query
        || (l.leadName || '').toLowerCase().includes(query)
        || (l.emailId || '').toLowerCase().includes(query)
        || (l.company || '').toLowerCase().includes(query)
        || (l.intake?.campaign || '').toLowerCase().includes(query);
      return matchConn && matchSearch;
    });
  }, [captured, logConnectorFilter, logSearch]);

  const handleSimulateSandbox = () => {
    try {
      const parsed = JSON.parse(sandboxPayloadText);
      const res = buildIntakeLead({
        connectorId: sandboxConnectorId,
        settings: integrations[sandboxConnectorId],
        payload: parsed,
        meta: { campaign: 'Sandbox Simulation Test' },
        leads,
        salesExecutives
      });
      setSandboxResult(res);
    } catch (err) {
      setSandboxResult({ error: `Invalid JSON syntax: ${err.message}` });
    }
  };

  const handleExportLogs = () => {
    if (captured.length === 0) return;
    const headers = ['Lead Name', 'Email', 'Phone', 'Company', 'Connector', 'Campaign', 'Assigned Executive', 'Received At', 'Is Test'];
    const rows = captured.map(l => [
      `"${l.leadName || ''}"`,
      `"${l.emailId || ''}"`,
      `"${l.phoneNumber || ''}"`,
      `"${l.company || ''}"`,
      `"${l.leadSource || ''}"`,
      `"${l.intake?.campaign || ''}"`,
      `"${l.salesExecutive || 'Unassigned'}"`,
      `"${l.intake?.receivedAt || ''}"`,
      l.intake?.isTest ? 'Yes' : 'No'
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `crm_connector_intake_logs_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="integ-page">
      {/* Top Header */}
      <div className="integ-header">
        <div>
          <h2 className="integ-title">Integrations</h2>
          <p className="integ-subtitle">
            Bring leads from ad platforms, Google Maps, and tools straight into your CRM pipeline — mapped, de-duplicated and assigned.
          </p>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="integ-tabs-bar" role="tablist">
        <button
          type="button"
          className={`integ-tab-button ${activeTab === 'connectors' ? 'active' : ''}`}
          onClick={() => setActiveTab('connectors')}
        >
          <LuSlidersHorizontal size={15} />
          <span>All Connectors</span>
          <span className="integ-tab-badge">{enabledCount}/{CONNECTORS.length}</span>
        </button>

        <button
          type="button"
          className={`integ-tab-button ${activeTab === 'googleMaps' ? 'active' : ''}`}
          onClick={() => setActiveTab('googleMaps')}
        >
          <SiGooglemaps size={15} style={{ color: '#EA4335' }} />
          <span>Google Maps Analysis</span>
          <span className="integ-tab-badge" style={{ background: '#FEECEB', color: '#EA4335' }}>Live</span>
        </button>

        <button
          type="button"
          className={`integ-tab-button ${activeTab === 'logs' ? 'active' : ''}`}
          onClick={() => setActiveTab('logs')}
        >
          <LuFileText size={15} />
          <span>Intake History & Logs</span>
          <span className="integ-tab-badge">{captured.length}</span>
        </button>

        <button
          type="button"
          className={`integ-tab-button ${activeTab === 'docs' ? 'active' : ''}`}
          onClick={() => setActiveTab('docs')}
        >
          <LuCode size={15} />
          <span>Webhook & API Guide</span>
        </button>

        <button
          type="button"
          className={`integ-tab-button ${activeTab === 'sandbox' ? 'active' : ''}`}
          onClick={() => setActiveTab('sandbox')}
        >
          <LuTerminal size={15} />
          <span>Intake Simulator</span>
        </button>
      </div>

      {!backendReady && activeTab !== 'googleMaps' && (
        <div className="integ-banner" role="status">
          <LuInfo size={18} aria-hidden="true" />
          <div>
            <strong>Live connections need the CRM backend.</strong>{' '}
            Set up routing and field mapping now, and use <em>Send test lead</em> to try the full intake flow. Connectors go live once the backend is deployed.
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 1: ALL CONNECTORS & RECENT STREAM
          ========================================================================= */}
      {activeTab === 'connectors' && (
        <>
          {/* 4-Stat Metric Cards */}
          <div className="integ-stats-4">
            <div className="integ-stat">
              <span className="integ-stat-label">Active Connectors</span>
              <span className="integ-stat-value">{enabledCount} <small>of {CONNECTORS.length}</small></span>
            </div>
            <div className="integ-stat">
              <span className="integ-stat-label">Leads Captured</span>
              <span className="integ-stat-value">{totalReceived}</span>
            </div>
            <div className="integ-stat">
              <span className="integ-stat-label">Duplicates Caught</span>
              <span className="integ-stat-value">{totalSkipped}</span>
            </div>
            <div className="integ-stat">
              <span className="integ-stat-label">Last Lead Received</span>
              <span className="integ-stat-value">{timeAgo(lastReceived)}</span>
            </div>
          </div>

          <div className="integ-flow" aria-label="How connector leads flow into the CRM">
            {FLOW.map(({ icon: Icon, title, text }, i) => (
              <div key={title} className="integ-flow-step">
                <span className="integ-flow-icon"><Icon size={16} aria-hidden="true" /></span>
                <div>
                  <strong>{title}</strong>
                  <span>{text}</span>
                </div>
                {i < FLOW.length - 1 && <LuArrowRight className="integ-flow-arrow" size={16} aria-hidden="true" />}
              </div>
            ))}
          </div>

          <div className="integ-grid">
            {CONNECTORS.map(connector => {
              const settings = integrations[connector.id] || { stats: { received: 0, skipped: 0, lastReceivedAt: null }, enabled: false, project: 'Farm Natura', priority: 'High', routing: { mode: 'unassigned' } };
              const { received, skipped, lastReceivedAt } = settings.stats;
              const routeSummary = settings.routing.mode === 'unassigned'
                ? 'Unassigned Queue'
                : settings.routing.mode === 'balanced'
                  ? (settings.routing.salesHead ? `Balanced: ${settings.routing.salesHead} team` : 'Balanced across all teams')
                  : `Always: ${settings.routing.executive || 'Executive'}`;

              return (
                <article key={connector.id} className="integ-card">
                  <div className="integ-card-top">
                    <BrandMark id={connector.id} />
                    <div className="integ-card-name">
                      <h3>{connector.name}</h3>
                      <span>{connector.platform}</span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span className={`integ-status ${settings.enabled ? 'on' : ''}`}>
                        {settings.enabled ? 'Set up' : 'Not set up'}
                      </span>
                    </div>
                  </div>

                  <p className="integ-card-desc">{connector.description}</p>

                  {/* Route Summary Pill */}
                  <div className="integ-card-route-info">
                    <span className="integ-card-route-text">
                      {settings.project} • {settings.priority}
                    </span>
                    <span className="integ-card-route-target">
                      {routeSummary}
                    </span>
                  </div>

                  <div className="integ-card-meta">
                    <span><strong>{received}</strong> leads</span>
                    {skipped > 0 && <span><strong>{skipped}</strong> duplicates skipped</span>}
                    <span>Last: {timeAgo(lastReceivedAt)}</span>
                  </div>

                  <div className="integ-card-actions">
                    <button
                      type="button"
                      className="btn-secondary btn-sm"
                      onClick={() => setConfiguringId(connector.id)}
                    >
                      <LuSettings2 aria-hidden="true" />
                      <span>Configure</span>
                    </button>
                    <button
                      type="button"
                      className="btn-secondary btn-sm"
                      onClick={() => onSendTestLead(connector.id)}
                    >
                      <LuSend aria-hidden="true" />
                      <span>Send test lead</span>
                    </button>
                  </div>
                </article>
              );
            })}
          </div>

          {/* Recently Captured Leads Table */}
          <section className="section-card integ-recent">
            <div className="integ-recent-head">
              <div>
                <h3 className="section-title">Recently captured leads</h3>
                <span style={{ fontSize: '0.8125rem', color: '#557396' }}>{captured.length} leads total</span>
              </div>
              {captured.length > 0 && (
                <button type="button" className="btn-secondary btn-sm" onClick={() => setActiveTab('logs')}>
                  <span>View all in logs</span>
                  <LuArrowRight size={14} />
                </button>
              )}
            </div>

            {captured.length === 0 ? (
              <EmptyState
                compact
                icon={LuInbox}
                title="No connector leads yet"
                description="Send a test lead from any connector above to see how it arrives, gets checked and is assigned."
              />
            ) : (
              <div className="integ-table-wrap">
                <table className="action-table">
                  <thead>
                    <tr>
                      <th>Lead</th>
                      <th>Connector</th>
                      <th>Campaign</th>
                      <th>Assigned to</th>
                      <th>Received</th>
                      <th style={{ textAlign: 'right' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {captured.slice(0, 8).map(lead => {
                      const connector = CONNECTORS.find(c => c.id === lead.intake?.connectorId);
                      return (
                        <tr key={lead.id} tabIndex={0} onKeyDown={onKeyActivate}>
                          <td onClick={() => onSelectLead?.(lead)} style={{ cursor: 'pointer' }}>
                            <div className="integ-lead-name">
                              {lead.leadName}
                              {lead.intake?.isTest && <span className="integ-tag">Test</span>}
                              {lead.possibleDuplicateOf && <span className="integ-tag warn">Possible duplicate</span>}
                            </div>
                            <div className="integ-lead-sub">{lead.emailId || lead.phoneNumber}</div>
                          </td>
                          <td onClick={() => onSelectLead?.(lead)} style={{ cursor: 'pointer' }}>
                            <span className="integ-connector-cell">
                              <BrandMark id={connector?.id} size={14} />
                              {connector?.name || lead.leadSource}
                            </span>
                          </td>
                          <td>{lead.intake?.campaign || '—'}</td>
                          <td>{lead.salesExecutive || <span className="integ-muted">Unassigned</span>}</td>
                          <td>{timeAgo(lead.intake?.receivedAt)}</td>
                          <td style={{ textAlign: 'right' }}>
                            <button
                              type="button"
                              className="btn-secondary btn-sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                setInspectingLead(lead);
                              }}
                              title="Inspect intake payload"
                            >
                              <LuEye size={13} />
                              <span>Inspect</span>
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        </>
      )}

      {/* =========================================================================
          TAB 2: GOOGLE MAPS ANALYSIS & SALES ATTRIBUTION
          ========================================================================= */}
      {activeTab === 'googleMaps' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Location & Time Filter Bar */}
          <div className="gmap-banner">
            <div className="gmap-location-picker">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <SiGooglemaps size={20} style={{ color: '#EA4335' }} />
                <span style={{ fontWeight: 700, fontSize: '0.9375rem', color: '#0F1A34' }}>Google Business Profile:</span>
              </div>

              <select
                className="form-select"
                style={{ width: 'auto', minWidth: '220px', fontWeight: 600 }}
                value={selectedLocationId}
                onChange={(e) => setSelectedLocationId(e.target.value)}
                aria-label="Select Google Maps Location"
              >
                {GOOGLE_MAPS_LOCATIONS.map(loc => (
                  <option key={loc.id} value={loc.id}>{loc.name}</option>
                ))}
              </select>

              <select
                className="form-select"
                style={{ width: 'auto', fontSize: '0.8125rem' }}
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
                aria-label="Select Date Range"
              >
                <option value="30d">Last 30 Days</option>
                <option value="90d">Last 90 Days</option>
                <option value="year">This Financial Year</option>
              </select>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span className="gmap-badge-green" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                <LuCircleCheck size={13} />
                <span>Verified Listing • Rating: {activeLocation.rating} ★ ({activeLocation.reviews} reviews)</span>
              </span>

              <button
                type="button"
                className="btn-secondary btn-sm"
                onClick={() => onSendTestLead('googleMaps')}
                title="Send a sample Google Maps call lead"
              >
                <LuPhoneCall size={14} />
                <span>Simulate Maps Call</span>
              </button>
            </div>
          </div>

          {/* 4 Hero KPI Cards */}
          <div className="gmap-kpi-grid">
            {/* 1. Visibility (How many people are seeing) */}
            <div className="gmap-kpi-card">
              <div className="gmap-kpi-top">
                <span className="gmap-kpi-title">Google Maps Views</span>
                <div className="gmap-kpi-icon" style={{ background: '#FEECEB', color: '#EA4335' }}>
                  <LuEye />
                </div>
              </div>
              <div className="gmap-kpi-val">{activeLocation.views.toLocaleString()}</div>
              <div className="gmap-kpi-sub">
                <span className="gmap-badge-green">+14.8% MoM</span>
                <span>{activeLocation.searchShare}</span>
              </div>
            </div>

            {/* 2. Customer Actions Taken */}
            <div className="gmap-kpi-card">
              <div className="gmap-kpi-top">
                <span className="gmap-kpi-title">Direct Customer Actions</span>
                <div className="gmap-kpi-icon" style={{ background: '#E8F1FD', color: '#1A73E8' }}>
                  <LuPhoneCall />
                </div>
              </div>
              <div className="gmap-kpi-val">{(activeLocation.calls + activeLocation.directions + activeLocation.websiteClicks).toLocaleString()}</div>
              <div className="gmap-kpi-sub">
                <span>{activeLocation.calls} Calls • {activeLocation.directions} Directions</span>
              </div>
            </div>

            {/* 3. Inbound Qualified Leads */}
            <div className="gmap-kpi-card">
              <div className="gmap-kpi-top">
                <span className="gmap-kpi-title">CRM Inbound Leads</span>
                <div className="gmap-kpi-icon" style={{ background: '#F3E8FF', color: '#7E22CE' }}>
                  <LuUsers />
                </div>
              </div>
              <div className="gmap-kpi-val">{activeLocation.leads}</div>
              <div className="gmap-kpi-sub">
                <span className="gmap-badge-blue">Cost per Lead: ₹0</span>
                <span>Organic Local Pack</span>
              </div>
            </div>

            {/* 4. Closed Sales Revenue (What sales are coming) */}
            <div className="gmap-kpi-card">
              <div className="gmap-kpi-top">
                <span className="gmap-kpi-title">Sales Revenue from Maps</span>
                <div className="gmap-kpi-icon" style={{ background: '#ECFDF5', color: '#059669' }}>
                  <LuDollarSign />
                </div>
              </div>
              <div className="gmap-kpi-val" style={{ color: '#059669' }}>{activeLocation.salesRevenue}</div>
              <div className="gmap-kpi-sub">
                <span className="gmap-badge-green">{activeLocation.closedDeals} Deals Won</span>
                <span>Conv. Rate: {activeLocation.convRate}</span>
              </div>
            </div>
          </div>

          {/* Google Maps Conversion Pipeline Funnel */}
          <div className="gmap-funnel-card">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <h3 className="section-title" style={{ margin: 0 }}>Google Maps Sales Conversion Pipeline</h3>
                <p className="integ-subtitle">
                  Visual funnel tracking customer discovery on Google Maps down to closed revenue in TechGy CRM.
                </p>
              </div>
              <span className="gmap-badge-blue">Average Deal Size: ₹5,93,750</span>
            </div>

            <div className="gmap-funnel-grid">
              <div className="gmap-funnel-stage">
                <span className="gmap-funnel-label">1. Profile Views</span>
                <div className="gmap-funnel-num">{activeLocation.views.toLocaleString()}</div>
                <div style={{ fontSize: '0.6875rem', color: '#557396' }}>Search 3-Pack & Maps</div>
                <span className="gmap-funnel-rate" style={{ color: '#1A73E8' }}>100% Top of Funnel</span>
              </div>

              <div className="gmap-funnel-stage">
                <span className="gmap-funnel-label">2. Customer Actions</span>
                <div className="gmap-funnel-num">{(activeLocation.calls + activeLocation.directions + activeLocation.websiteClicks).toLocaleString()}</div>
                <div style={{ fontSize: '0.6875rem', color: '#557396' }}>Calls, Directions, Clicks</div>
                <span className="gmap-funnel-rate">12.7% Action Rate</span>
              </div>

              <div className="gmap-funnel-stage">
                <span className="gmap-funnel-label">3. Inbound Leads</span>
                <div className="gmap-funnel-num">{activeLocation.leads}</div>
                <div style={{ fontSize: '0.6875rem', color: '#557396' }}>Verified CRM Leads</div>
                <span className="gmap-funnel-rate">Auto-assigned</span>
              </div>

              <div className="gmap-funnel-stage">
                <span className="gmap-funnel-label">4. Qualified Demos</span>
                <div className="gmap-funnel-num">{Math.round(activeLocation.leads * 0.45)}</div>
                <div style={{ fontSize: '0.6875rem', color: '#557396' }}>Site Visits & Consultations</div>
                <span className="gmap-funnel-rate">45.2% Lead-to-Demo</span>
              </div>

              <div className="gmap-funnel-stage winner">
                <span className="gmap-funnel-label" style={{ color: '#059669', fontWeight: 700 }}>5. Closed Won Sales</span>
                <div className="gmap-funnel-num" style={{ color: '#059669' }}>{activeLocation.closedDeals} Deals</div>
                <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#0F1A34' }}>{activeLocation.salesRevenue}</div>
                <span className="gmap-funnel-rate">{activeLocation.convRate} Win Rate</span>
              </div>
            </div>
          </div>

          {/* Location Breakdown Table (Sales Coming from Each Branch) */}
          <section className="section-card">
            <div className="integ-recent-head" style={{ marginBottom: '1rem' }}>
              <div>
                <h3 className="section-title">Sales Generated by Google Maps Location</h3>
                <span style={{ fontSize: '0.8125rem', color: '#557396' }}>
                  Performance, customer views, calls, and revenue generated from each verified Google Business Profile.
                </span>
              </div>
            </div>

            <div className="integ-table-wrap">
              <table className="action-table">
                <thead>
                  <tr>
                    <th>Location / Listing</th>
                    <th>Google Rating</th>
                    <th>Map Views</th>
                    <th>Customer Calls</th>
                    <th>Directions</th>
                    <th>Leads Created</th>
                    <th>Won Deals</th>
                    <th style={{ textAlign: 'right' }}>Sales Revenue</th>
                    <th>Win Rate</th>
                  </tr>
                </thead>
                <tbody>
                  {GOOGLE_MAPS_LOCATIONS.filter(l => l.id !== 'all').map(loc => (
                    <tr key={loc.id}>
                      <td>
                        <div style={{ fontWeight: 700, color: '#0F1A34', display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <LuMapPin size={15} style={{ color: '#EA4335' }} />
                          <span>{loc.name}</span>
                        </div>
                        <div style={{ fontSize: '0.75rem', color: '#557396', marginTop: '2px' }}>{loc.address}</div>
                      </td>
                      <td>
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '3px', fontWeight: 700, color: '#D97706' }}>
                          <LuStar size={13} fill="#D97706" />
                          <span>{loc.rating}</span>
                          <span style={{ fontSize: '0.6875rem', color: '#557396', fontWeight: 400 }}>({loc.reviews})</span>
                        </span>
                      </td>
                      <td><strong>{loc.views.toLocaleString()}</strong></td>
                      <td>{loc.calls.toLocaleString()}</td>
                      <td>{loc.directions.toLocaleString()}</td>
                      <td><span className="gmap-badge-blue">{loc.leads} leads</span></td>
                      <td><span className="gmap-badge-green">{loc.closedDeals} deals</span></td>
                      <td style={{ textAlign: 'right', fontWeight: 800, color: '#059669', fontSize: '0.9375rem' }}>
                        {loc.salesRevenue}
                      </td>
                      <td><strong>{loc.convRate}</strong></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* Top Search Terms Driving Maps Views & Deals */}
          <section className="section-card">
            <div className="integ-recent-head" style={{ marginBottom: '1rem' }}>
              <div>
                <h3 className="section-title">Top Search Keywords Driving Google Maps Sales</h3>
                <span style={{ fontSize: '0.8125rem', color: '#557396' }}>
                  Direct search phrases used by customers on Google Maps that resulted in phone inquiries and closed bookings.
                </span>
              </div>
            </div>

            <div className="integ-table-wrap">
              <table className="action-table">
                <thead>
                  <tr>
                    <th>Customer Search Query</th>
                    <th>Search Category</th>
                    <th>Search Impressions</th>
                    <th>Phone Calls</th>
                    <th style={{ textAlign: 'right' }}>Closed Sales Revenue</th>
                  </tr>
                </thead>
                <tbody>
                  {GOOGLE_MAPS_KEYWORDS.map(k => (
                    <tr key={k.term}>
                      <td>
                        <div style={{ fontWeight: 600, color: '#0F1A34', display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <LuSearch size={14} style={{ color: '#1A73E8' }} />
                          <span>&ldquo;{k.term}&rdquo;</span>
                        </div>
                      </td>
                      <td>
                        <span className={k.category === 'Direct Brand' ? 'gmap-badge-blue' : 'gmap-badge-green'}>
                          {k.category}
                        </span>
                      </td>
                      <td>{k.impressions.toLocaleString()} views</td>
                      <td><strong>{k.calls} calls</strong></td>
                      <td style={{ textAlign: 'right', fontWeight: 800, color: '#059669', fontSize: '0.9375rem' }}>
                        {k.salesAttributed}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* Recent Deals & Inbound Leads Attributed to Google Maps */}
          <section className="section-card">
            <div className="integ-recent-head" style={{ marginBottom: '1rem' }}>
              <div>
                <h3 className="section-title">Recent Deals & Inquiries from Google Maps</h3>
                <span style={{ fontSize: '0.8125rem', color: '#557396' }}>
                  Live CRM pipeline deals initiated via Google Maps phone calls and direct office visit directions.
                </span>
              </div>
            </div>

            <div className="integ-table-wrap">
              <table className="action-table">
                <thead>
                  <tr>
                    <th>Client / Organization</th>
                    <th>Branch Attributed</th>
                    <th>Inquiry Origin</th>
                    <th>Assigned Executive</th>
                    <th>Stage</th>
                    <th>Deal Value</th>
                    <th>Time</th>
                  </tr>
                </thead>
                <tbody>
                  {GOOGLE_MAPS_RECENT_DEALS.map(deal => (
                    <tr key={deal.id}>
                      <td>
                        <div style={{ fontWeight: 700, color: '#0F1A34' }}>{deal.client}</div>
                        <div style={{ fontSize: '0.6875rem', color: '#557396' }}>ID: {deal.id}</div>
                      </td>
                      <td>{deal.branch}</td>
                      <td>
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '0.8125rem', color: '#1A73E8', fontWeight: 600 }}>
                          <LuPhoneCall size={13} />
                          <span>{deal.type}</span>
                        </span>
                      </td>
                      <td>{deal.owner}</td>
                      <td>
                        <span className={deal.status === 'Won' ? 'gmap-badge-green' : 'gmap-badge-blue'}>
                          {deal.stage}
                        </span>
                      </td>
                      <td style={{ fontWeight: 800, color: deal.status === 'Won' ? '#059669' : '#0F1A34' }}>
                        {deal.value}
                      </td>
                      <td>{deal.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      )}

      {/* =========================================================================
          TAB 3: FULL INTAKE HISTORY & LOGS
          ========================================================================= */}
      {activeTab === 'logs' && (
        <section className="section-card">
          <div className="integ-recent-head" style={{ marginBottom: '1rem' }}>
            <div>
              <h3 className="section-title">Intake History & Activity Logs</h3>
              <span style={{ fontSize: '0.8125rem', color: '#557396' }}>
                Complete stream of submissions ingested through Meta, Google Ads, LinkedIn, Google Maps, and Webhooks.
              </span>
            </div>
            {captured.length > 0 && (
              <button type="button" className="btn-secondary btn-sm" onClick={handleExportLogs}>
                <LuDownload size={14} />
                <span>Export CSV</span>
              </button>
            )}
          </div>

          {/* Filter Bar */}
          <div className="integ-filter-bar">
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1, minWidth: '240px' }}>
              <div style={{ position: 'relative', width: '100%', maxWidth: '320px' }}>
                <LuSearch size={14} style={{ position: 'absolute', left: '10px', top: '10px', color: '#557396' }} />
                <input
                  type="text"
                  className="form-input"
                  style={{ paddingLeft: '32px', height: '34px', fontSize: '0.8125rem' }}
                  placeholder="Search by name, email, company..."
                  value={logSearch}
                  onChange={(e) => setLogSearch(e.target.value)}
                />
              </div>

              <select
                className="form-select"
                style={{ height: '34px', width: 'auto', fontSize: '0.8125rem' }}
                value={logConnectorFilter}
                onChange={(e) => setLogConnectorFilter(e.target.value)}
              >
                <option value="all">All Connectors</option>
                {CONNECTORS.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>

            <span style={{ fontSize: '0.8125rem', color: '#557396' }}>
              Showing {filteredLogs.length} of {captured.length} logs
            </span>
          </div>

          {filteredLogs.length === 0 ? (
            <EmptyState
              compact
              icon={LuInbox}
              title="No logs found"
              description="No connector logs match your current search and filter criteria."
            />
          ) : (
            <div className="integ-table-wrap">
              <table className="action-table">
                <thead>
                  <tr>
                    <th>Lead Name</th>
                    <th>Source Connector</th>
                    <th>Contact Info</th>
                    <th>Company</th>
                    <th>Campaign</th>
                    <th>Assigned Executive</th>
                    <th>Timestamp</th>
                    <th style={{ textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredLogs.map(lead => {
                    const connector = CONNECTORS.find(c => c.id === lead.intake?.connectorId);
                    return (
                      <tr key={lead.id}>
                        <td>
                          <div className="integ-lead-name">
                            {lead.leadName}
                            {lead.intake?.isTest && <span className="integ-tag">Test</span>}
                            {lead.possibleDuplicateOf && <span className="integ-tag warn">Duplicate</span>}
                          </div>
                        </td>
                        <td>
                          <span className="integ-connector-cell">
                            <BrandMark id={connector?.id} size={14} />
                            {connector?.name || lead.leadSource}
                          </span>
                        </td>
                        <td>{lead.emailId || lead.phoneNumber || '—'}</td>
                        <td>{lead.company || '—'}</td>
                        <td>{lead.intake?.campaign || '—'}</td>
                        <td>{lead.salesExecutive || <span className="integ-muted">Unassigned</span>}</td>
                        <td>{lead.intake?.receivedAt ? new Date(lead.intake.receivedAt).toLocaleString() : '—'}</td>
                        <td style={{ textAlign: 'right' }}>
                          <button
                            type="button"
                            className="btn-secondary btn-sm"
                            onClick={() => setInspectingLead(lead)}
                            style={{ marginRight: '6px' }}
                          >
                            <LuEye size={13} />
                            <span>Payload</span>
                          </button>
                          <button
                            type="button"
                            className="btn-primary btn-sm"
                            onClick={() => onSelectLead?.(lead)}
                          >
                            <LuExternalLink size={13} />
                            <span>Lead</span>
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </section>
      )}

      {/* =========================================================================
          TAB 4: WEBHOOK & API DOCUMENTATION
          ========================================================================= */}
      {activeTab === 'docs' && (
        <section className="section-card" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div>
            <h3 className="section-title">Webhook & Custom API Integration</h3>
            <p className="integ-subtitle">
              Send leads directly from any web form, custom server, Zapier, or Make scenario into TechGy CRM.
            </p>
          </div>

          <div className="integ-field">
            <span className="integ-label">Public Webhook URL (POST)</span>
            <CopyField value={webhookUrl('webhook')} label="Webhook URL" />
          </div>

          <div>
            <span className="integ-label" style={{ display: 'block', marginBottom: '6px' }}>
              Sample cURL Request
            </span>
            <pre className="integ-code-block">
              <code>{`curl -X POST "${webhookUrl('webhook')}" \\
  -H "Content-Type: application/json" \\
  -H "X-TechGy-Signature: sha256=your_hmac_secret" \\
  -d '{
    "name": "Arjun Kapoor",
    "email": "arjun@enterprise.in",
    "phone": "+91 98765 43210",
    "company": "Kapoor Logistics Ltd",
    "title": "VP Procurement",
    "message": "Interested in 50 enterprise CRM seats",
    "campaign": "Google Search - CRM 2026"
  }'`}</code>
            </pre>
          </div>

          <div>
            <span className="integ-label" style={{ display: 'block', marginBottom: '6px' }}>
              JSON Request Schema & Field Reference
            </span>
            <div className="integ-table-wrap">
              <table className="action-table">
                <thead>
                  <tr>
                    <th>Key</th>
                    <th>Type</th>
                    <th>Description</th>
                    <th>Maps To CRM Attribute</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><code>name</code></td>
                    <td>string (Required)</td>
                    <td>Full name of the contact</td>
                    <td><code>leadName</code></td>
                  </tr>
                  <tr>
                    <td><code>email</code></td>
                    <td>string</td>
                    <td>Email address for follow-ups</td>
                    <td><code>emailId</code></td>
                  </tr>
                  <tr>
                    <td><code>phone</code></td>
                    <td>string</td>
                    <td>Contact phone or mobile number</td>
                    <td><code>phoneNumber</code></td>
                  </tr>
                  <tr>
                    <td><code>company</code></td>
                    <td>string</td>
                    <td>Organization or business name</td>
                    <td><code>company</code> (creates account if new)</td>
                  </tr>
                  <tr>
                    <td><code>title</code></td>
                    <td>string</td>
                    <td>Designation or corporate role</td>
                    <td><code>designation</code></td>
                  </tr>
                  <tr>
                    <td><code>campaign</code></td>
                    <td>string</td>
                    <td>Ad campaign, channel or referral code</td>
                    <td><code>intake.campaign</code></td>
                  </tr>
                  <tr>
                    <td><code>message</code></td>
                    <td>string</td>
                    <td>Notes, inquiry details or requirements</td>
                    <td><code>notes</code> & Activity history</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>
      )}

      {/* =========================================================================
          TAB 5: INTAKE SANDBOX & SIMULATOR
          ========================================================================= */}
      {activeTab === 'sandbox' && (
        <section className="section-card">
          <div style={{ marginBottom: '1.25rem' }}>
            <h3 className="section-title">Interactive Intake Simulator</h3>
            <p className="integ-subtitle">
              Test and dry-run any lead submission against your current assignment rules and field mappings before going live.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.2fr) minmax(0, 1fr)', gap: '1.5rem' }}>
            {/* Input Side */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                <label className="integ-label">Select Connector to Simulate</label>
                <select
                  className="form-select"
                  style={{ width: 'auto', fontSize: '0.8125rem' }}
                  value={sandboxConnectorId}
                  onChange={(e) => {
                    const cid = e.target.value;
                    setSandboxConnectorId(cid);
                    setSandboxPayloadText(JSON.stringify(sampleSubmission(cid).payload, null, 2));
                    setSandboxResult(null);
                  }}
                >
                  {CONNECTORS.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>

              <div style={{ marginBottom: '12px' }}>
                <span className="integ-label" style={{ display: 'block', marginBottom: '6px' }}>
                  Mock Payload (JSON)
                </span>
                <textarea
                  className="form-input"
                  style={{
                    fontFamily: 'monospace',
                    fontSize: '0.8125rem',
                    height: '240px',
                    width: '100%',
                    padding: '10px 12px'
                  }}
                  value={sandboxPayloadText}
                  onChange={(e) => setSandboxPayloadText(e.target.value)}
                />
              </div>

              <button type="button" className="btn-primary" onClick={handleSimulateSandbox}>
                <LuTerminal size={15} />
                <span>Simulate Intake Pipeline</span>
              </button>
            </div>

            {/* Output Preview Side */}
            <div style={{ background: '#F8FAFC', padding: '1.25rem', borderRadius: 'var(--radius-popup, 3px)', border: '1px solid #E2E8F0' }}>
              <span className="integ-label" style={{ display: 'block', marginBottom: '8px' }}>
                Simulation Results
              </span>

              {!sandboxResult ? (
                <div style={{ color: '#557396', fontSize: '0.875rem', marginTop: '2rem', textAlign: 'center' }}>
                  Click &ldquo;Simulate Intake Pipeline&rdquo; to test parsing, deduplication, and assignment rules.
                </div>
              ) : sandboxResult.error ? (
                <div style={{ background: '#FEF2F2', border: '1px solid #FECACA', padding: '1rem', borderRadius: 'var(--radius-popup, 3px)', color: '#DC2626' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 700 }}>
                    <LuTriangleAlert size={16} />
                    <span>Submission Rejected</span>
                  </div>
                  <div style={{ fontSize: '0.8125rem', marginTop: '4px' }}>{sandboxResult.error}</div>
                </div>
              ) : sandboxResult.skipped ? (
                <div style={{ background: '#FFFBEB', border: '1px solid #FDE68A', padding: '1rem', borderRadius: 'var(--radius-popup, 3px)', color: '#D97706' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 700 }}>
                    <LuCopyCheck size={16} />
                    <span>Duplicate Lead Caught</span>
                  </div>
                  <div style={{ fontSize: '0.8125rem', marginTop: '4px' }}>
                    Matches existing lead ID: <code>{sandboxResult.duplicate?.id}</code> ({sandboxResult.duplicate?.leadName})
                  </div>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <div style={{ background: '#ECFDF5', border: '1px solid #A7F3D0', padding: '0.75rem 1rem', borderRadius: 'var(--radius-popup, 3px)', color: '#059669', display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 700, fontSize: '0.875rem' }}>
                    <LuCircleCheck size={16} />
                    <span>Lead Parsed & Routed Successfully</span>
                  </div>

                  <div style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', padding: '1rem', borderRadius: 'var(--radius-popup, 3px)' }}>
                    <div style={{ fontSize: '1rem', fontWeight: 700, color: '#0F1A34' }}>{sandboxResult.lead?.leadName}</div>
                    <div style={{ fontSize: '0.8125rem', color: '#557396', marginTop: '2px' }}>
                      {sandboxResult.lead?.company} • {sandboxResult.lead?.designation}
                    </div>

                    <div style={{ marginTop: '0.75rem', paddingTop: '0.75rem', borderTop: '1px solid #F1F5F9', fontSize: '0.8125rem', display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: '6px' }}>
                      <div><strong>Email:</strong> {sandboxResult.lead?.emailId}</div>
                      <div><strong>Phone:</strong> {sandboxResult.lead?.phoneNumber}</div>
                      <div><strong>Assigned:</strong> {sandboxResult.lead?.salesExecutive || 'Unassigned'}</div>
                      <div><strong>Priority:</strong> {sandboxResult.lead?.priority}</div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Configure Connector Dialog */}
      {configuring && (
        <ConnectorDialog
          connector={configuring}
          settings={integrations[configuring.id] || { stats: { received: 0, skipped: 0, lastReceivedAt: null }, enabled: false, project: 'Farm Natura', priority: 'High', routing: { mode: 'unassigned' }, mapping: configuring.defaultMapping }}
          salesHeads={salesHeads}
          salesExecutives={salesExecutives}
          backendReady={backendReady}
          onClose={() => setConfiguringId(null)}
          onSave={(draft) => {
            onUpdateIntegration(configuring.id, draft);
            setConfiguringId(null);
          }}
          onSendTestLead={onSendTestLead}
        />
      )}

      {/* Intake Details Modal */}
      {inspectingLead && (
        <IntakeDetailsModal
          lead={inspectingLead}
          onClose={() => setInspectingLead(null)}
        />
      )}
    </div>
  );
}
