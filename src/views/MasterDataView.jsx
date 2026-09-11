import React, { useState, useEffect } from 'react';
import {
  LuPackage,
  LuShare2,
  LuFactory,
  LuGitCommitVertical,
  LuMail,
  LuPlus,
  LuSearch,
  LuCheck,
  LuX,
  LuChevronRight,
  LuArrowRight,
  LuArrowLeft,
  LuPencil,
  LuTrash2,
  LuShieldAlert,
  LuClock,
  LuSparkles,
  LuEye
} from 'react-icons/lu';
import { INITIAL_EMAIL_TEMPLATES } from '../data/mockData';

const INITIAL_MASTER_DATA = {
  products: [
    { id: 'PRD-001', name: 'Enterprise Cloud Suite', sku: 'TGY-ECS-01', category: 'Software', price: '₹15,00,000 / yr', billing: 'Annual Subscription', status: 'Active' },
    { id: 'PRD-002', name: 'TechGy Security Gateway', sku: 'TGY-SEC-02', category: 'Security', price: '₹8,50,000 / yr', billing: 'Annual Subscription', status: 'Active' },
    { id: 'PRD-003', name: 'AI Process Automation Engine', sku: 'TGY-AIP-03', category: 'Artificial Intelligence', price: '₹22,00,000 / yr', billing: 'Annual Subscription', status: 'Active' },
    { id: 'PRD-004', name: 'Custom API Connectors & Middleware', sku: 'TGY-API-04', category: 'Integration', price: '₹4,50,000 / unit', billing: 'One-time License', status: 'Active' },
    { id: 'PRD-005', name: 'Dedicated 24/7 Enterprise SLA Support', sku: 'TGY-SUP-05', category: 'Services', price: '₹6,00,000 / yr', billing: 'Annual Support', status: 'Active' },
    { id: 'PRD-006', name: 'Legacy Database Migration Kit', sku: 'TGY-MIG-06', category: 'Services', price: '₹7,50,000 / project', billing: 'Professional Services', status: 'Active' }
  ],
  sources: [
    { id: 'SRC-001', name: 'Website', type: 'Inbound Digital', weight: 'High (37.5%)', costPerLead: '₹1,200', status: 'Active' },
    { id: 'SRC-002', name: 'Inbound Call', type: 'Direct Voice', weight: 'Medium (9.4%)', costPerLead: '₹850', status: 'Active' },
    { id: 'SRC-003', name: 'Referral', type: 'Partner / Client', weight: 'High (25.0%)', costPerLead: '₹0 (Organic)', status: 'Active' },
    { id: 'SRC-004', name: 'LinkedIn', type: 'Social B2B', weight: 'High (18.8%)', costPerLead: '₹2,400', status: 'Active' },
    { id: 'SRC-005', name: 'Campaign', type: 'Paid Media', weight: 'Medium (6.3%)', costPerLead: '₹3,100', status: 'Active' },
    { id: 'SRC-006', name: 'Partner', type: 'Channel Alliance', weight: 'Medium (3.1%)', costPerLead: 'Revenue Share', status: 'Active' }
  ],
  industries: [
    { id: 'IND-001', name: 'Enterprise Software', code: 'IT-SOFT', tier: 'Tier 1 Priority', standardMargin: '42%', status: 'Active' },
    { id: 'IND-002', name: 'Cloud Infrastructure', code: 'IT-CLD', tier: 'Tier 1 Priority', standardMargin: '38%', status: 'Active' },
    { id: 'IND-003', name: 'Fintech & Banking', code: 'BFSI-FIN', tier: 'Tier 1 Priority', standardMargin: '45%', status: 'Active' },
    { id: 'IND-004', name: 'Healthcare & MedTech', code: 'HLTH-MED', tier: 'Tier 2 Strategic', standardMargin: '35%', status: 'Active' },
    { id: 'IND-005', name: 'Manufacturing & Supply Chain', code: 'MFG-SCM', tier: 'Tier 2 Strategic', standardMargin: '28%', status: 'Active' },
    { id: 'IND-006', name: 'E-Commerce & Retail', code: 'RET-ECOM', tier: 'Tier 3 Standard', standardMargin: '30%', status: 'Active' }
  ],
  stages: [
    { id: 'STG-001', name: 'New Lead', order: 1, probability: '10%', slaDays: 2, status: 'Active' },
    { id: 'STG-002', name: 'Contacted', order: 2, probability: '25%', slaDays: 5, status: 'Active' },
    { id: 'STG-003', name: 'Qualified', order: 3, probability: '40%', slaDays: 7, status: 'Active' },
    { id: 'STG-004', name: 'Discussion', order: 4, probability: '60%', slaDays: 10, status: 'Active' },
    { id: 'STG-005', name: 'Proposal Sent', order: 5, probability: '75%', slaDays: 14, status: 'Active' },
    { id: 'STG-006', name: 'Negotiation', order: 6, probability: '90%', slaDays: 7, status: 'Active' },
    { id: 'STG-007', name: 'Closed Won', order: 7, probability: '100%', slaDays: 0, status: 'Active' },
    { id: 'STG-008', name: 'Closed Lost', order: 8, probability: '0%', slaDays: 0, status: 'Active' }
  ],

  objections: [
    { id: 'OBJ-001', name: 'Budgetary Constraints', category: 'Pricing', rebuttal: 'Offer milestone billing (50/50) or showcase 14-month ROI case study.', severity: 'High', status: 'Active' },
    { id: 'OBJ-002', name: 'Competitor Multi-Year Contract', category: 'Incumbent', rebuttal: 'Provide side-by-side migration roadmap and buyout transition credits.', severity: 'High', status: 'Active' },
    { id: 'OBJ-003', name: 'Data Security & Compliance', category: 'Technical', rebuttal: 'Share SOC 2 Type II, ISO 27001 certificates & on-premise connector specs.', severity: 'Critical', status: 'Active' },
    { id: 'OBJ-004', name: 'Internal Implementation Bandwidth', category: 'Operations', rebuttal: 'Include dedicated TechGy implementation manager and 14-day go-live guarantee.', severity: 'Medium', status: 'Active' }
  ],
  cadences: [
    { id: 'CAD-001', name: 'Day 1 Rapid Response', timing: 'Within 2 Hours', channel: 'Direct Call + WhatsApp Intro', mandatoryAction: 'Validate qualification criteria', status: 'Active' },
    { id: 'CAD-002', name: 'Day 3 Discovery Follow-up', timing: '72 Hours Post-First Contact', channel: 'Customized Pitch Email', mandatoryAction: 'Schedule technical solution demo', status: 'Active' },
    { id: 'CAD-003', name: 'Day 7 Proposal Review', timing: '1 Week Post-Quote', channel: 'Executive Follow-up Call', mandatoryAction: 'Confirm procurement decision makers', status: 'Active' },
    { id: 'CAD-004', name: 'Day 14 Re-engagement', timing: '2 Weeks Inactive', channel: 'Value-add Whitepaper / Case Study', mandatoryAction: 'Send CEO benchmark report', status: 'Active' }
  ],
  aiRules: [
    { id: 'RUL-001', name: 'C-Suite Title Multiplier', factor: 'Designation Match (CXO, VP, Founder)', weight: '+25 Points', autoTrigger: 'Route to Senior Account Executive', status: 'Active' },
    { id: 'RUL-002', name: 'High Company Size Weight', factor: 'Employee Count > 250', weight: '+20 Points', autoTrigger: 'Tag as Enterprise Tier', status: 'Active' },
    { id: 'RUL-003', name: 'Direct Inbound Intent', factor: 'Website Demo Request / Pricing Calculator', weight: '+30 Points', autoTrigger: 'Trigger instant 15-min SLA alert', status: 'Active' },
    { id: 'RUL-004', name: 'Email Engagement Signal', factor: 'Email Proposal Opened > 3 Times', weight: '+15 Points', autoTrigger: 'Schedule automatic call task', status: 'Active' }
  ]
};

const MASTER_CATEGORIES = [
  {
    id: 'products',
    title: 'Products & Services',
    desc: 'Define and manage the catalog of software suites, enterprise licenses, cloud modules, pricing tiers, and professional services.',
    icon: LuPackage,
    iconBg: '#EFF6FF',
    iconColor: '#1D4ED8'
  },
  {
    id: 'sources',
    title: 'Lead Sources',
    desc: 'Configure lead acquisition channels, inbound digital sources, partner attribution weights, and cost per lead tracking metrics.',
    icon: LuShare2,
    iconBg: '#F0FDF4',
    iconColor: '#15803D'
  },
  {
    id: 'industries',
    title: 'Industry Sectors',
    desc: 'Standardize client industry classifications, priority targeting tiers, margin benchmarks, and vertical sector codes.',
    icon: LuFactory,
    iconBg: '#FEF3C7',
    iconColor: '#B45309'
  },
  {
    id: 'stages',
    title: 'Pipeline Stages',
    desc: 'Define and customize the distinct stages of your sales funnel, SLA breach thresholds, and deal win probabilities.',
    icon: LuGitCommitVertical,
    iconBg: '#F5F3FF',
    iconColor: '#6D28D9'
  },

  {
    id: 'emailTemplates',
    title: 'Email Templates',
    desc: 'Centralize standardized sales outreach copy, proposal emails, follow-up cadences, and dynamic merge tags.',
    icon: LuMail,
    iconBg: '#FFF1F2',
    iconColor: '#BE123C'
  },
  {
    id: 'objections',
    title: 'Sales Objections',
    desc: 'Maintain a central directory of common buyer concerns, pricing hesitations, and recommended objection scripts.',
    icon: LuShieldAlert,
    iconBg: '#FEF2F2',
    iconColor: '#DC2626'
  },
  {
    id: 'cadences',
    title: 'Lead Follow-up Statuses',
    desc: 'Configure standard communication cadences, SLA escalation parameters, and mandatory next-action triggers.',
    icon: LuClock,
    iconBg: '#F1F5F9',
    iconColor: '#334155'
  },
  {
    id: 'aiRules',
    title: 'Lead Scoring & Intent Rules',
    desc: 'Adjust the algorithmic weightings, demographic criteria, and intent signals the AI uses to score inbound leads.',
    icon: LuSparkles,
    iconBg: '#FDF4FF',
    iconColor: '#A21CAF'
  }
];

export default function MasterDataView({
  searchQuery = '',
  fromDashboard = false,
  onBackToDashboard,
  onTriggerToast,
  emailTemplates = [],
  onUpdateEmailTemplates
}) {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [localSearch, setLocalSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState(null);
  const [previewTemplate, setPreviewTemplate] = useState(null);

  // Form state for adding standard master records
  const [formData, setFormData] = useState({
    name: '',
    codeOrSku: '',
    categoryOrType: '',
    extraInfo: ''
  });

  // Form state for adding/editing email templates
  const [templateFormData, setTemplateFormData] = useState({
    name: '',
    category: 'Sales Outreach',
    subject: '',
    body: '',
    status: 'Active'
  });

  // Master Data state loaded from localStorage
  const [masterData, setMasterData] = useState(() => {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem('techgy_master_data_v2');
        if (stored) return JSON.parse(stored);
      } catch {}
    }
    return INITIAL_MASTER_DATA;
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('techgy_master_data_v2', JSON.stringify(masterData));
      } catch {}
    }
  }, [masterData]);

  // Local fallback templates state if onUpdateEmailTemplates is not provided
  const [localTemplates, setLocalTemplates] = useState(() => {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem('techgy_email_templates');
        if (stored) return JSON.parse(stored);
      } catch {}
    }
    return INITIAL_EMAIL_TEMPLATES;
  });

  const activeEmailTemplates = emailTemplates && emailTemplates.length > 0 ? emailTemplates : localTemplates;

  const updateTemplates = (newTemplates) => {
    if (onUpdateEmailTemplates) {
      onUpdateEmailTemplates(newTemplates);
    }
    setLocalTemplates(newTemplates);
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('techgy_email_templates', JSON.stringify(newTemplates));
      } catch {}
    }
  };

  const effectiveSearch = (searchQuery || localSearch).toLowerCase().trim();

  // Active dataset when inside a category detail page
  const currentList = selectedCategory === 'emailTemplates'
    ? activeEmailTemplates
    : (selectedCategory ? (masterData[selectedCategory] || []) : []);

  const filteredList = currentList.filter(item => {
    if (selectedCategory === 'emailTemplates') {
      const matchesSearch = !effectiveSearch ||
        (item.name && item.name.toLowerCase().includes(effectiveSearch)) ||
        (item.subject && item.subject.toLowerCase().includes(effectiveSearch)) ||
        (item.category && item.category.toLowerCase().includes(effectiveSearch)) ||
        (item.body && item.body.toLowerCase().includes(effectiveSearch));

      const matchesStatus = statusFilter === 'All' || item.status === statusFilter;
      return matchesSearch && matchesStatus;
    }

    const matchesSearch = !effectiveSearch ||
      (item.name && item.name.toLowerCase().includes(effectiveSearch)) ||
      (item.sku && item.sku.toLowerCase().includes(effectiveSearch)) ||
      (item.code && item.code.toLowerCase().includes(effectiveSearch)) ||
      (item.category && item.category.toLowerCase().includes(effectiveSearch)) ||
      (item.regionalLead && item.regionalLead.toLowerCase().includes(effectiveSearch)) ||
      (item.hub && item.hub.toLowerCase().includes(effectiveSearch)) ||
      (item.factor && item.factor.toLowerCase().includes(effectiveSearch)) ||
      (item.timing && item.timing.toLowerCase().includes(effectiveSearch));

    const matchesStatus = statusFilter === 'All' || item.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const toggleStatus = (id) => {
    if (selectedCategory === 'emailTemplates') {
      const targetItem = activeEmailTemplates.find(item => item.id === id);
      if (!targetItem) return;
      const newStatus = targetItem.status === 'Active' ? 'Inactive' : 'Active';
      const updated = activeEmailTemplates.map(item => item.id === id ? { ...item, status: newStatus } : item);
      updateTemplates(updated);

      if (onTriggerToast) {
        onTriggerToast({
          title: 'Email Template Updated',
          description: `Status of "${targetItem.name}" changed to ${newStatus}`,
          type: 'info'
        });
      }
      return;
    }

    const targetItem = masterData[selectedCategory]?.find(item => item.id === id);
    if (!targetItem) return;
    const newStatus = targetItem.status === 'Active' ? 'Inactive' : 'Active';

    setMasterData(prev => ({
      ...prev,
      [selectedCategory]: prev[selectedCategory].map(item =>
        item.id === id ? { ...item, status: newStatus } : item
      )
    }));

    if (onTriggerToast) {
      onTriggerToast({
        title: 'Master Record Updated',
        description: `Status of "${targetItem.name}" changed to ${newStatus}`,
        type: 'info'
      });
    }
  };

  const handleDeleteTemplate = (id) => {
    const targetItem = activeEmailTemplates.find(item => item.id === id);
    if (!targetItem) return;

    if (window.confirm(`Are you sure you want to delete the email template "${targetItem.name}"?`)) {
      const updated = activeEmailTemplates.filter(item => item.id !== id);
      updateTemplates(updated);
      if (onTriggerToast) {
        onTriggerToast({
          title: 'Template Deleted',
          description: `Email template "${targetItem.name}" has been removed.`,
          type: 'info'
        });
      }
    }
  };

  const handleOpenEditTemplate = (tpl) => {
    setEditingTemplate(tpl);
    setTemplateFormData({
      name: tpl.name || '',
      category: tpl.category || 'Sales Outreach',
      subject: tpl.subject || '',
      body: tpl.body || '',
      status: tpl.status || 'Active'
    });
  };

  const handleSaveEditTemplate = (e) => {
    e.preventDefault();
    if (!editingTemplate || !templateFormData.name.trim() || !templateFormData.subject.trim()) return;

    const updated = activeEmailTemplates.map(tpl => {
      if (tpl.id === editingTemplate.id) {
        return {
          ...tpl,
          name: templateFormData.name.trim(),
          category: templateFormData.category,
          subject: templateFormData.subject.trim(),
          body: templateFormData.body,
          status: templateFormData.status
        };
      }
      return tpl;
    });

    updateTemplates(updated);
    setEditingTemplate(null);

    if (onTriggerToast) {
      onTriggerToast({
        title: 'Email Template Saved',
        description: `Template "${templateFormData.name}" updated successfully.`,
        type: 'success'
      });
    }
  };

  const handleCreateRecord = (e) => {
    e.preventDefault();

    if (selectedCategory === 'emailTemplates') {
      if (!templateFormData.name.trim() || !templateFormData.subject.trim()) return;

      const newTpl = {
        id: `TPL-${String(activeEmailTemplates.length + 1).padStart(3, '0')}`,
        name: templateFormData.name.trim(),
        category: templateFormData.category || 'Sales Outreach',
        subject: templateFormData.subject.trim(),
        body: templateFormData.body || '',
        status: 'Active'
      };

      const updated = [newTpl, ...activeEmailTemplates];
      updateTemplates(updated);

      if (onTriggerToast) {
        onTriggerToast({
          title: 'Email Template Created',
          description: `Successfully added "${newTpl.name}" to Email Templates`,
          type: 'success'
        });
      }

      setTemplateFormData({ name: '', category: 'Sales Outreach', subject: '', body: '', status: 'Active' });
      setIsAddModalOpen(false);
      return;
    }

    if (!formData.name.trim()) return;

    let newRecord = {
      id: `MST-${Date.now().toString().slice(-4)}`,
      name: formData.name.trim(),
      status: 'Active'
    };

    if (selectedCategory === 'products') {
      newRecord.sku = formData.codeOrSku || `TGY-${formData.name.slice(0, 3).toUpperCase()}-99`;
      newRecord.category = formData.categoryOrType || 'Software';
      newRecord.price = formData.extraInfo || '₹10,00,000 / yr';
      newRecord.billing = 'Annual Subscription';
    } else if (selectedCategory === 'sources') {
      newRecord.type = formData.categoryOrType || 'Direct Channel';
      newRecord.weight = 'Custom';
      newRecord.costPerLead = formData.extraInfo || '₹1,500';
    } else if (selectedCategory === 'industries') {
      newRecord.code = formData.codeOrSku || formData.name.slice(0, 4).toUpperCase();
      newRecord.tier = formData.categoryOrType || 'Tier 2 Strategic';
      newRecord.standardMargin = formData.extraInfo || '35%';
    } else if (selectedCategory === 'stages') {
      newRecord.order = (masterData.stages?.length || 0) + 1;
      newRecord.probability = formData.extraInfo || '50%';
      newRecord.slaDays = 7;

    } else if (selectedCategory === 'objections') {
      newRecord.category = formData.categoryOrType || 'Pricing';
      newRecord.rebuttal = formData.extraInfo || 'Recommended response script.';
      newRecord.severity = 'High';
    } else if (selectedCategory === 'cadences') {
      newRecord.timing = formData.codeOrSku || 'Within 24 Hours';
      newRecord.channel = formData.categoryOrType || 'Phone Call';
      newRecord.mandatoryAction = formData.extraInfo || 'Log customer response';
    } else if (selectedCategory === 'aiRules') {
      newRecord.factor = formData.codeOrSku || 'Key Buying Intent';
      newRecord.weight = formData.categoryOrType || '+20 Points';
      newRecord.autoTrigger = formData.extraInfo || 'Priority routing';
    }

    setMasterData(prev => ({
      ...prev,
      [selectedCategory]: [...(prev[selectedCategory] || []), newRecord]
    }));

    if (onTriggerToast) {
      onTriggerToast({
        title: 'Record Added',
        description: `Successfully added "${formData.name}" to Master Data`,
        type: 'success'
      });
    }

    setFormData({ name: '', codeOrSku: '', categoryOrType: '', extraInfo: '' });
    setIsAddModalOpen(false);
  };

  const selectedCategoryMeta = MASTER_CATEGORIES.find(c => c.id === selectedCategory);

  // ---------------------------------------------------------------------------
  // 1. OVERVIEW SCREEN: 3-COLUMN CARD GRID (Inspired by Screenshot)
  // ---------------------------------------------------------------------------
  if (!selectedCategory) {
    return (
      <div className="master-data-page" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        {/* Breadcrumb Navigation when navigated from Dashboard */}
        {fromDashboard && (
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <nav style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', fontWeight: 500, color: '#557396' }}>
              <span
                onClick={onBackToDashboard}
                style={{ cursor: 'pointer', color: '#063669', fontWeight: 600 }}
                title="Go to Dashboard"
              >
                Dashboard
              </span>
              <LuChevronRight size={14} />
              <span style={{ color: '#063669', fontWeight: 700 }}>
                Master Data
              </span>
            </nav>
          </div>
        )}


        {/* 3-Column Card Grid */}
        <div className="master-data-hub-grid">
          {MASTER_CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            const count = cat.id === 'emailTemplates'
              ? activeEmailTemplates.length
              : (masterData[cat.id]?.length || 0);

            return (
              <div
                key={cat.id}
                className="master-hub-card"
                onClick={() => {
                  setSelectedCategory(cat.id);
                  setLocalSearch('');
                  setStatusFilter('All');
                }}
              >
                <div>
                  {/* Top Row: Icon & View -> CTA */}
                  <div className="master-hub-card-top">
                    <div
                      className="master-hub-icon-wrap"
                      style={{ backgroundColor: cat.iconBg, color: cat.iconColor }}
                    >
                      <Icon size={20} />
                    </div>

                    <div className="master-hub-view-link">
                      <span>View</span>
                      <LuArrowRight size={14} />
                    </div>
                  </div>

                  {/* Card Title */}
                  <h3 className="master-hub-title">
                    {cat.title}
                  </h3>

                  {/* Card Description */}
                  <p className="master-hub-desc">
                    {cat.desc}
                  </p>
                </div>

                {/* Bottom Item Count Pill */}
                <div style={{ marginTop: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{
                    fontSize: '0.735rem',
                    fontWeight: 700,
                    color: '#557396',
                    backgroundColor: '#F1F5F9',
                    padding: '0.2rem 0.6rem',
                    borderRadius: '6px'
                  }}>
                    {count} {count === 1 ? 'Record' : 'Records'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // ---------------------------------------------------------------------------
  // 2. CATEGORY DETAIL PAGE (With Breadcrumbs, Table, Search & Add Record)
  // ---------------------------------------------------------------------------
  const DetailIcon = selectedCategoryMeta?.icon || LuPackage;

  return (
    <div className="master-data-detail-page" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      
      {/* Breadcrumb Navigation Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem' }}>
        <nav style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', fontWeight: 500, color: '#557396' }}>
          {fromDashboard && (
            <>
              <span
                onClick={onBackToDashboard}
                style={{ cursor: 'pointer', color: '#063669', fontWeight: 600 }}
                title="Return to Dashboard"
              >
                Dashboard
              </span>
              <LuChevronRight size={14} />
            </>
          )}

          <span
            onClick={() => setSelectedCategory(null)}
            style={{ cursor: 'pointer', color: '#063669', fontWeight: 600, textDecoration: 'underline' }}
            title="Return to Master Data Hub"
          >
            Master Data
          </span>

          <LuChevronRight size={14} />

          <span style={{ color: '#063669', fontWeight: 800 }}>
            {selectedCategoryMeta?.title}
          </span>
        </nav>

        {/* Back Button shortcut */}
        <button
          type="button"
          onClick={() => setSelectedCategory(null)}
          style={{
            background: '#FFFFFF',
            border: '1px solid #CBD5E1',
            borderRadius: '8px',
            padding: '0.35rem 0.75rem',
            fontSize: '0.785rem',
            fontWeight: 600,
            color: '#063669',
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.35rem',
            transition: 'all 0.15s ease'
          }}
        >
          <LuArrowLeft size={13} /> Back to Master Data
        </button>
      </div>

      {/* Main Detail Container Card */}
      <div className="section-card" style={{ padding: '1.5rem', background: '#FFFFFF', borderRadius: '16px', border: '1px solid #E2E8F0', boxShadow: '0 4px 16px rgba(6, 54, 105, 0.04)' }}>
        
        {/* Header Row */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
            <div style={{
              width: '44px',
              height: '44px',
              borderRadius: '12px',
              background: selectedCategoryMeta?.iconBg || '#EFF6FF',
              color: selectedCategoryMeta?.iconColor || '#1D4ED8',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <DetailIcon size={22} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#063669', margin: 0, letterSpacing: '-0.01em' }}>
                  {selectedCategoryMeta?.title}
                </h2>
                <span style={{
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  backgroundColor: '#EBF3FA',
                  color: '#063669',
                  padding: '0.2rem 0.55rem',
                  borderRadius: '6px'
                }}>
                  {filteredList.length} {filteredList.length === 1 ? 'Record' : 'Records'}
                </span>
              </div>
              <p style={{ fontSize: '0.825rem', color: '#557396', margin: '0.2rem 0 0 0' }}>
                {selectedCategoryMeta?.desc}
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <button
              className="btn-primary"
              onClick={() => {
                if (selectedCategory === 'emailTemplates') {
                  setTemplateFormData({ name: '', category: 'Sales Outreach', subject: '', body: '', status: 'Active' });
                }
                setIsAddModalOpen(true);
              }}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
                fontSize: '0.825rem',
                padding: '0.5rem 1rem',
                borderRadius: '8px',
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              <LuPlus size={16} /> {selectedCategory === 'emailTemplates' ? 'Create Email Template' : `Add ${selectedCategoryMeta?.title.slice(0, -1) || 'Record'}`}
            </button>
          </div>
        </div>

        {/* Filter and Search Bar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '1.25rem', padding: '0.75rem 1rem', background: '#F8FAFC', borderRadius: '10px', border: '1px solid #E2E8F0' }}>
          <div style={{ position: 'relative', width: '280px' }}>
            <LuSearch size={15} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }} />
            <input
              type="text"
              placeholder={`Search in ${selectedCategoryMeta?.title}...`}
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
              style={{
                width: '100%',
                padding: '0.45rem 0.75rem 0.45rem 2.2rem',
                fontSize: '0.825rem',
                border: '1px solid #CBD5E1',
                borderRadius: '6px',
                background: '#FFFFFF',
                color: '#063669',
                outline: 'none'
              }}
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '0.775rem', fontWeight: 600, color: '#557396' }}>Status:</span>
            {['All', 'Active', 'Inactive'].map((st) => (
              <button
                key={st}
                type="button"
                onClick={() => setStatusFilter(st)}
                style={{
                  padding: '0.25rem 0.65rem',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  borderRadius: '6px',
                  border: statusFilter === st ? '1px solid #063669' : '1px solid #CBD5E1',
                  background: statusFilter === st ? '#063669' : '#FFFFFF',
                  color: statusFilter === st ? '#FFFFFF' : '#557396',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
              >
                {st}
              </button>
            ))}
          </div>
        </div>

        {/* Data Table */}
        <div style={{ overflowX: 'auto' }}>
          <table className="crm-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#F8FAFC', borderBottom: '1px solid #E2E8F0', color: '#557396', fontSize: '0.785rem', textAlign: 'left' }}>
                {selectedCategory === 'products' && (
                  <>
                    <th style={{ padding: '0.75rem 1rem' }}>SKU</th>
                    <th style={{ padding: '0.75rem 1rem' }}>Product / Service Name</th>
                    <th style={{ padding: '0.75rem 1rem' }}>Category</th>
                    <th style={{ padding: '0.75rem 1rem' }}>Standard Pricing</th>
                    <th style={{ padding: '0.75rem 1rem' }}>Billing Model</th>
                    <th style={{ padding: '0.75rem 1rem' }}>Status</th>
                    <th style={{ padding: '0.75rem 1rem', textAlign: 'right' }}>Actions</th>
                  </>
                )}

                {selectedCategory === 'sources' && (
                  <>
                    <th style={{ padding: '0.75rem 1rem' }}>Source ID</th>
                    <th style={{ padding: '0.75rem 1rem' }}>Channel Name</th>
                    <th style={{ padding: '0.75rem 1rem' }}>Channel Type</th>
                    <th style={{ padding: '0.75rem 1rem' }}>Attribution Weight</th>
                    <th style={{ padding: '0.75rem 1rem' }}>Cost per Lead</th>
                    <th style={{ padding: '0.75rem 1rem' }}>Status</th>
                    <th style={{ padding: '0.75rem 1rem', textAlign: 'right' }}>Actions</th>
                  </>
                )}

                {selectedCategory === 'industries' && (
                  <>
                    <th style={{ padding: '0.75rem 1rem' }}>Code</th>
                    <th style={{ padding: '0.75rem 1rem' }}>Industry Sector</th>
                    <th style={{ padding: '0.75rem 1rem' }}>Priority Tier</th>
                    <th style={{ padding: '0.75rem 1rem' }}>Standard Margin</th>
                    <th style={{ padding: '0.75rem 1rem' }}>Status</th>
                    <th style={{ padding: '0.75rem 1rem', textAlign: 'right' }}>Actions</th>
                  </>
                )}

                {selectedCategory === 'stages' && (
                  <>
                    <th style={{ padding: '0.75rem 1rem' }}>Order</th>
                    <th style={{ padding: '0.75rem 1rem' }}>Pipeline Stage Name</th>
                    <th style={{ padding: '0.75rem 1rem' }}>Win Probability</th>
                    <th style={{ padding: '0.75rem 1rem' }}>SLA Target</th>
                    <th style={{ padding: '0.75rem 1rem' }}>Status</th>
                    <th style={{ padding: '0.75rem 1rem', textAlign: 'right' }}>Actions</th>
                  </>
                )}


                {selectedCategory === 'emailTemplates' && (
                  <>
                    <th style={{ padding: '0.75rem 1rem' }}>ID</th>
                    <th style={{ padding: '0.75rem 1rem' }}>Template Name</th>
                    <th style={{ padding: '0.75rem 1rem' }}>Category</th>
                    <th style={{ padding: '0.75rem 1rem' }}>Subject Line</th>
                    <th style={{ padding: '0.75rem 1rem' }}>Status</th>
                    <th style={{ padding: '0.75rem 1rem', textAlign: 'right' }}>Actions</th>
                  </>
                )}

                {selectedCategory === 'objections' && (
                  <>
                    <th style={{ padding: '0.75rem 1rem' }}>ID</th>
                    <th style={{ padding: '0.75rem 1rem' }}>Objection Title</th>
                    <th style={{ padding: '0.75rem 1rem' }}>Category</th>
                    <th style={{ padding: '0.75rem 1rem' }}>Recommended Rebuttal / Script</th>
                    <th style={{ padding: '0.75rem 1rem' }}>Severity</th>
                    <th style={{ padding: '0.75rem 1rem' }}>Status</th>
                    <th style={{ padding: '0.75rem 1rem', textAlign: 'right' }}>Actions</th>
                  </>
                )}

                {selectedCategory === 'cadences' && (
                  <>
                    <th style={{ padding: '0.75rem 1rem' }}>ID</th>
                    <th style={{ padding: '0.75rem 1rem' }}>Cadence Name</th>
                    <th style={{ padding: '0.75rem 1rem' }}>Timing Window</th>
                    <th style={{ padding: '0.75rem 1rem' }}>Channel Mode</th>
                    <th style={{ padding: '0.75rem 1rem' }}>Mandatory Action</th>
                    <th style={{ padding: '0.75rem 1rem' }}>Status</th>
                    <th style={{ padding: '0.75rem 1rem', textAlign: 'right' }}>Actions</th>
                  </>
                )}

                {selectedCategory === 'aiRules' && (
                  <>
                    <th style={{ padding: '0.75rem 1rem' }}>ID</th>
                    <th style={{ padding: '0.75rem 1rem' }}>Scoring Rule</th>
                    <th style={{ padding: '0.75rem 1rem' }}>Intent / Profile Factor</th>
                    <th style={{ padding: '0.75rem 1rem' }}>Score Weight</th>
                    <th style={{ padding: '0.75rem 1rem' }}>Automated Trigger</th>
                    <th style={{ padding: '0.75rem 1rem' }}>Status</th>
                    <th style={{ padding: '0.75rem 1rem', textAlign: 'right' }}>Actions</th>
                  </>
                )}
              </tr>
            </thead>

            <tbody>
              {filteredList.map((item) => (
                <tr key={item.id} style={{ borderBottom: '1px solid #F1F5F9', fontSize: '0.825rem' }}>
                  {selectedCategory === 'products' && (
                    <>
                      <td style={{ padding: '0.75rem 1rem', fontFamily: 'monospace', fontWeight: 600, color: '#557396' }}>{item.sku}</td>
                      <td style={{ padding: '0.75rem 1rem', fontWeight: 700, color: '#063669' }}>{item.name}</td>
                      <td style={{ padding: '0.75rem 1rem' }}><span className="status-chip new" style={{ fontSize: '0.72rem' }}>{item.category}</span></td>
                      <td style={{ padding: '0.75rem 1rem', fontWeight: 700, color: '#063669' }}>{item.price}</td>
                      <td style={{ padding: '0.75rem 1rem', color: '#557396' }}>{item.billing}</td>
                    </>
                  )}

                  {selectedCategory === 'sources' && (
                    <>
                      <td style={{ padding: '0.75rem 1rem', fontFamily: 'monospace', fontWeight: 600, color: '#557396' }}>{item.id}</td>
                      <td style={{ padding: '0.75rem 1rem', fontWeight: 700, color: '#063669' }}>{item.name}</td>
                      <td style={{ padding: '0.75rem 1rem', color: '#557396' }}>{item.type}</td>
                      <td style={{ padding: '0.75rem 1rem', fontWeight: 600, color: '#063669' }}>{item.weight}</td>
                      <td style={{ padding: '0.75rem 1rem', fontWeight: 700, color: '#059669' }}>{item.costPerLead}</td>
                    </>
                  )}

                  {selectedCategory === 'industries' && (
                    <>
                      <td style={{ padding: '0.75rem 1rem', fontFamily: 'monospace', fontWeight: 600, color: '#557396' }}>{item.code}</td>
                      <td style={{ padding: '0.75rem 1rem', fontWeight: 700, color: '#063669' }}>{item.name}</td>
                      <td style={{ padding: '0.75rem 1rem' }}><span className="status-chip qualified" style={{ fontSize: '0.72rem' }}>{item.tier}</span></td>
                      <td style={{ padding: '0.75rem 1rem', fontWeight: 700, color: '#063669' }}>{item.standardMargin}</td>
                    </>
                  )}

                  {selectedCategory === 'stages' && (
                    <>
                      <td style={{ padding: '0.75rem 1rem', fontWeight: 700, color: '#557396' }}>#{item.order}</td>
                      <td style={{ padding: '0.75rem 1rem', fontWeight: 700, color: '#063669' }}>{item.name}</td>
                      <td style={{ padding: '0.75rem 1rem', fontWeight: 700, color: '#059669' }}>{item.probability}</td>
                      <td style={{ padding: '0.75rem 1rem', color: '#557396' }}>{item.slaDays ? `${item.slaDays} Days` : 'N/A'}</td>
                    </>
                  )}


                  {selectedCategory === 'emailTemplates' && (
                    <>
                      <td style={{ padding: '0.75rem 1rem', fontFamily: 'monospace', fontWeight: 600, color: '#557396' }}>{item.id}</td>
                      <td style={{ padding: '0.75rem 1rem', fontWeight: 700, color: '#063669' }}>{item.name}</td>
                      <td style={{ padding: '0.75rem 1rem' }}><span className="status-chip new" style={{ fontSize: '0.72rem' }}>{item.category}</span></td>
                      <td style={{ padding: '0.75rem 1rem', color: '#557396', maxWidth: '240px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.subject}</td>
                    </>
                  )}

                  {selectedCategory === 'objections' && (
                    <>
                      <td style={{ padding: '0.75rem 1rem', fontFamily: 'monospace', fontWeight: 600, color: '#557396' }}>{item.id}</td>
                      <td style={{ padding: '0.75rem 1rem', fontWeight: 700, color: '#063669' }}>{item.name}</td>
                      <td style={{ padding: '0.75rem 1rem' }}><span className="status-chip contacted" style={{ fontSize: '0.72rem' }}>{item.category}</span></td>
                      <td style={{ padding: '0.75rem 1rem', color: '#334155', maxWidth: '300px' }}>{item.rebuttal}</td>
                      <td style={{ padding: '0.75rem 1rem' }}><span className="status-chip lost" style={{ fontSize: '0.72rem' }}>{item.severity}</span></td>
                    </>
                  )}

                  {selectedCategory === 'cadences' && (
                    <>
                      <td style={{ padding: '0.75rem 1rem', fontFamily: 'monospace', fontWeight: 600, color: '#557396' }}>{item.id}</td>
                      <td style={{ padding: '0.75rem 1rem', fontWeight: 700, color: '#063669' }}>{item.name}</td>
                      <td style={{ padding: '0.75rem 1rem', fontWeight: 600, color: '#063669' }}>{item.timing}</td>
                      <td style={{ padding: '0.75rem 1rem', color: '#557396' }}>{item.channel}</td>
                      <td style={{ padding: '0.75rem 1rem', color: '#334155' }}>{item.mandatoryAction}</td>
                    </>
                  )}

                  {selectedCategory === 'aiRules' && (
                    <>
                      <td style={{ padding: '0.75rem 1rem', fontFamily: 'monospace', fontWeight: 600, color: '#557396' }}>{item.id}</td>
                      <td style={{ padding: '0.75rem 1rem', fontWeight: 700, color: '#063669' }}>{item.name}</td>
                      <td style={{ padding: '0.75rem 1rem', color: '#557396' }}>{item.factor}</td>
                      <td style={{ padding: '0.75rem 1rem', fontWeight: 800, color: '#059669' }}>{item.weight}</td>
                      <td style={{ padding: '0.75rem 1rem', color: '#334155' }}>{item.autoTrigger}</td>
                    </>
                  )}

                  {/* Status Toggle */}
                  <td style={{ padding: '0.75rem 1rem' }}>
                    <span
                      onClick={() => toggleStatus(item.id)}
                      style={{
                        cursor: 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.35rem',
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        padding: '0.2rem 0.55rem',
                        borderRadius: '20px',
                        backgroundColor: item.status === 'Active' ? '#ECFDF5' : '#F1F5F9',
                        color: item.status === 'Active' ? '#059669' : '#64748B'
                      }}
                      title="Click to toggle status"
                    >
                      {item.status === 'Active' ? <LuCheck size={12} /> : <LuX size={12} />}
                      {item.status}
                    </span>
                  </td>

                  {/* Actions Column */}
                  <td style={{ padding: '0.75rem 1rem', textAlign: 'right' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '0.4rem' }}>
                      {selectedCategory === 'emailTemplates' && (
                        <>
                          <button
                            type="button"
                            onClick={() => setPreviewTemplate(item)}
                            style={{ background: 'none', border: 'none', color: '#063669', cursor: 'pointer', padding: '4px' }}
                            title="Preview Template"
                          >
                            <LuEye size={15} />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleOpenEditTemplate(item)}
                            style={{ background: 'none', border: 'none', color: '#557396', cursor: 'pointer', padding: '4px' }}
                            title="Edit Template"
                          >
                            <LuPencil size={15} />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteTemplate(item.id)}
                            style={{ background: 'none', border: 'none', color: '#DC2626', cursor: 'pointer', padding: '4px' }}
                            title="Delete Template"
                          >
                            <LuTrash2 size={15} />
                          </button>
                        </>
                      )}

                      {selectedCategory !== 'emailTemplates' && (
                        <button
                          type="button"
                          onClick={() => toggleStatus(item.id)}
                          style={{
                            background: '#F1F5F9',
                            border: '1px solid #CBD5E1',
                            borderRadius: '6px',
                            padding: '0.25rem 0.55rem',
                            fontSize: '0.725rem',
                            fontWeight: 600,
                            color: '#063669',
                            cursor: 'pointer'
                          }}
                        >
                          Toggle Status
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}

              {filteredList.length === 0 && (
                <tr>
                  <td colSpan={7} style={{ textAlign: 'center', padding: '2.5rem', color: '#94A3B8', fontSize: '0.875rem' }}>
                    No records found matching "{effectiveSearch}". Click "+ Add Record" to create one.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Record Modal */}
      {isAddModalOpen && selectedCategory !== 'emailTemplates' && (
        <div className="modal-overlay" onClick={() => setIsAddModalOpen(false)}>
          <div className="modal-card" style={{ maxWidth: '480px' }} onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">Add {selectedCategoryMeta?.title.slice(0, -1) || 'Record'}</h3>
              <button className="modal-close-btn" onClick={() => setIsAddModalOpen(false)}><LuX size={18} /></button>
            </div>
            <form onSubmit={handleCreateRecord}>
              <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Name / Title *</label>
                  <input
                    type="text"
                    required
                    className="form-input"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Premium Tier Package"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Category / Channel / Code</label>
                  <input
                    type="text"
                    className="form-input"
                    value={formData.categoryOrType}
                    onChange={(e) => setFormData({ ...formData, categoryOrType: e.target.value })}
                    placeholder="e.g. Software, Inbound Digital, etc."
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Price / Value / Lead / Extra Details</label>
                  <input
                    type="text"
                    className="form-input"
                    value={formData.extraInfo}
                    onChange={(e) => setFormData({ ...formData, extraInfo: e.target.value })}
                    placeholder="e.g. ₹12,00,000 / yr, Rajesh Sharma"
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn-secondary" onClick={() => setIsAddModalOpen(false)}>Cancel</button>
                <button type="submit" className="btn-primary">Save Record</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Create / Edit Email Template Modal */}
      {(isAddModalOpen && selectedCategory === 'emailTemplates') && (
        <div className="modal-overlay" onClick={() => setIsAddModalOpen(false)}>
          <div className="modal-card" style={{ maxWidth: '580px' }} onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">Create Email Template</h3>
              <button className="modal-close-btn" onClick={() => setIsAddModalOpen(false)}><LuX size={18} /></button>
            </div>
            <form onSubmit={handleCreateRecord}>
              <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Template Name *</label>
                  <input
                    type="text"
                    required
                    className="form-input"
                    value={templateFormData.name}
                    onChange={(e) => setTemplateFormData({ ...templateFormData, name: e.target.value })}
                    placeholder="e.g. Enterprise Solution Introduction"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Category</label>
                  <select
                    className="form-select"
                    value={templateFormData.category}
                    onChange={(e) => setTemplateFormData({ ...templateFormData, category: e.target.value })}
                  >
                    <option value="Sales Outreach">Sales Outreach</option>
                    <option value="Proposal Follow-up">Proposal Follow-up</option>
                    <option value="Customer Onboarding">Customer Onboarding</option>
                    <option value="Executive Update">Executive Update</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Subject Line *</label>
                  <input
                    type="text"
                    required
                    className="form-input"
                    value={templateFormData.subject}
                    onChange={(e) => setTemplateFormData({ ...templateFormData, subject: e.target.value })}
                    placeholder="e.g. Scaling TechGy CRM Operations for {{company}}"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Email Body</label>
                  <textarea
                    rows={6}
                    className="form-textarea"
                    value={templateFormData.body}
                    onChange={(e) => setTemplateFormData({ ...templateFormData, body: e.target.value })}
                    placeholder="Hi {{leadName}},&#10;&#10;Following up regarding our solution..."
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn-secondary" onClick={() => setIsAddModalOpen(false)}>Cancel</button>
                <button type="submit" className="btn-primary">Create Template</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Email Template Modal */}
      {editingTemplate && (
        <div className="modal-overlay" onClick={() => setEditingTemplate(null)}>
          <div className="modal-card" style={{ maxWidth: '580px' }} onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">Edit Email Template</h3>
              <button className="modal-close-btn" onClick={() => setEditingTemplate(null)}><LuX size={18} /></button>
            </div>
            <form onSubmit={handleSaveEditTemplate}>
              <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Template Name *</label>
                  <input
                    type="text"
                    required
                    className="form-input"
                    value={templateFormData.name}
                    onChange={(e) => setTemplateFormData({ ...templateFormData, name: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Category</label>
                  <select
                    className="form-select"
                    value={templateFormData.category}
                    onChange={(e) => setTemplateFormData({ ...templateFormData, category: e.target.value })}
                  >
                    <option value="Sales Outreach">Sales Outreach</option>
                    <option value="Proposal Follow-up">Proposal Follow-up</option>
                    <option value="Customer Onboarding">Customer Onboarding</option>
                    <option value="Executive Update">Executive Update</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Subject Line *</label>
                  <input
                    type="text"
                    required
                    className="form-input"
                    value={templateFormData.subject}
                    onChange={(e) => setTemplateFormData({ ...templateFormData, subject: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Email Body</label>
                  <textarea
                    rows={6}
                    className="form-textarea"
                    value={templateFormData.body}
                    onChange={(e) => setTemplateFormData({ ...templateFormData, body: e.target.value })}
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn-secondary" onClick={() => setEditingTemplate(null)}>Cancel</button>
                <button type="submit" className="btn-primary">Save Changes</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Template Preview Modal */}
      {previewTemplate && (
        <div className="modal-overlay" onClick={() => setPreviewTemplate(null)}>
          <div className="modal-card" style={{ maxWidth: '540px' }} onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">Template Preview: {previewTemplate.name}</h3>
              <button className="modal-close-btn" onClick={() => setPreviewTemplate(null)}><LuX size={18} /></button>
            </div>
            <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ padding: '0.75rem', background: '#F8FAFC', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
                <div style={{ fontSize: '0.75rem', color: '#557396', fontWeight: 600, marginBottom: '0.2rem' }}>SUBJECT</div>
                <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#063669' }}>{previewTemplate.subject}</div>
              </div>

              <div style={{ padding: '0.85rem', background: '#FFFFFF', borderRadius: '8px', border: '1px solid #E2E8F0', minHeight: '140px', whiteSpace: 'pre-wrap', fontSize: '0.85rem', color: '#1E293B', lineHeight: '1.6' }}>
                {previewTemplate.body || '(No template body defined.)'}
              </div>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn-primary" onClick={() => setPreviewTemplate(null)}>Close Preview</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
