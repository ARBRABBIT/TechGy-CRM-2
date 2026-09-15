import React, { useState, useEffect } from 'react';
import {
  LuPackage,
  LuShare2,
  LuFactory,
  LuGitCommitVertical,
  LuMail,
  LuPlus,
  LuSearch,
  LuX,
  LuChevronRight,
  LuArrowRight,
  LuPencil,
  LuShieldAlert,
  LuClock,
  LuSparkles
} from 'react-icons/lu';
import { INITIAL_EMAIL_TEMPLATES } from '../data/mockData';

const INITIAL_MASTER_DATA = {
  products: [
    { id: 'PRD-001', name: 'Enterprise Cloud Suite', sku: 'TGY-ECS-01', category: 'Software', price: '₹15,00,000 / yr', billing: 'Annual Subscription' },
    { id: 'PRD-002', name: 'TechGy Security Gateway', sku: 'TGY-SEC-02', category: 'Security', price: '₹8,50,000 / yr', billing: 'Annual Subscription' },
    { id: 'PRD-003', name: 'AI Process Automation Engine', sku: 'TGY-AIP-03', category: 'Artificial Intelligence', price: '₹22,00,000 / yr', billing: 'Annual Subscription' },
    { id: 'PRD-004', name: 'Custom API Connectors & Middleware', sku: 'TGY-API-04', category: 'Integration', price: '₹4,50,000 / unit', billing: 'One-time License' },
    { id: 'PRD-005', name: 'Dedicated 24/7 Enterprise SLA Support', sku: 'TGY-SUP-05', category: 'Services', price: '₹6,00,000 / yr', billing: 'Annual Support' },
    { id: 'PRD-006', name: 'Legacy Database Migration Kit', sku: 'TGY-MIG-06', category: 'Services', price: '₹7,50,000 / project', billing: 'Professional Services' }
  ],
  sources: [
    { id: 'SRC-001', name: 'Website', type: 'Inbound Digital', weight: 'High (37.5%)', costPerLead: '₹1,200' },
    { id: 'SRC-002', name: 'Inbound Call', type: 'Direct Voice', weight: 'Medium (9.4%)', costPerLead: '₹850' },
    { id: 'SRC-003', name: 'Referral', type: 'Partner / Client', weight: 'High (25.0%)', costPerLead: '₹0 (Organic)' },
    { id: 'SRC-004', name: 'LinkedIn', type: 'Social B2B', weight: 'High (18.8%)', costPerLead: '₹2,400' },
    { id: 'SRC-005', name: 'Campaign', type: 'Paid Media', weight: 'Medium (6.3%)', costPerLead: '₹3,100' },
    { id: 'SRC-006', name: 'Partner', type: 'Channel Alliance', weight: 'Medium (3.1%)', costPerLead: 'Revenue Share' }
  ],
  industries: [
    { id: 'IND-001', name: 'Enterprise Software', code: 'IT-SOFT', standardMargin: '42%' },
    { id: 'IND-002', name: 'Cloud Infrastructure', code: 'IT-CLD', standardMargin: '38%' },
    { id: 'IND-003', name: 'Fintech & Banking', code: 'BFSI-FIN', standardMargin: '45%' },
    { id: 'IND-004', name: 'Healthcare & MedTech', code: 'HLTH-MED', standardMargin: '35%' },
    { id: 'IND-005', name: 'Manufacturing & Supply Chain', code: 'MFG-SCM', standardMargin: '28%' },
    { id: 'IND-006', name: 'E-Commerce & Retail', code: 'RET-ECOM', standardMargin: '30%' }
  ],
  stages: [
    { id: 'STG-001', name: 'New Lead', order: 1, probability: '10%', slaDays: 2 },
    { id: 'STG-002', name: 'Contacted', order: 2, probability: '25%', slaDays: 5 },
    { id: 'STG-003', name: 'Qualified', order: 3, probability: '40%', slaDays: 7 },
    { id: 'STG-004', name: 'Discussion', order: 4, probability: '60%', slaDays: 10 },
    { id: 'STG-005', name: 'Proposal Sent', order: 5, probability: '75%', slaDays: 14 },
    { id: 'STG-006', name: 'Negotiation', order: 6, probability: '90%', slaDays: 7 },
    { id: 'STG-007', name: 'Closed Won', order: 7, probability: '100%', slaDays: 0 },
    { id: 'STG-008', name: 'Closed Lost', order: 8, probability: '0%', slaDays: 0 }
  ],

  objections: [
    { id: 'OBJ-001', name: 'Budgetary Constraints', category: 'Pricing', rebuttal: 'Offer milestone billing (50/50) or showcase 14-month ROI case study.', severity: 'High' },
    { id: 'OBJ-002', name: 'Competitor Multi-Year Contract', category: 'Incumbent', rebuttal: 'Provide side-by-side migration roadmap and buyout transition credits.', severity: 'High' },
    { id: 'OBJ-003', name: 'Data Security & Compliance', category: 'Technical', rebuttal: 'Share SOC 2 Type II, ISO 27001 certificates & on-premise connector specs.', severity: 'Critical' },
    { id: 'OBJ-004', name: 'Internal Implementation Bandwidth', category: 'Operations', rebuttal: 'Include dedicated TechGy implementation manager and 14-day go-live guarantee.', severity: 'Medium' }
  ],
  cadences: [
    { id: 'CAD-001', name: 'Day 1 Rapid Response', timing: 'Within 2 Hours', channel: 'Direct Call + WhatsApp Intro', mandatoryAction: 'Validate qualification criteria' },
    { id: 'CAD-002', name: 'Day 3 Discovery Follow-up', timing: '72 Hours Post-First Contact', channel: 'Customized Pitch Email', mandatoryAction: 'Schedule technical solution demo' },
    { id: 'CAD-003', name: 'Day 7 Proposal Review', timing: '1 Week Post-Quote', channel: 'Executive Follow-up Call', mandatoryAction: 'Confirm procurement decision makers' },
    { id: 'CAD-004', name: 'Day 14 Re-engagement', timing: '2 Weeks Inactive', channel: 'Value-add Whitepaper / Case Study', mandatoryAction: 'Send CEO benchmark report' }
  ],
  aiRules: [
    { id: 'RUL-001', name: 'C-Suite Title Multiplier', factor: 'Designation Match (CXO, VP, Founder)', weight: '+25 Points', autoTrigger: 'Route to Senior Account Executive' },
    { id: 'RUL-002', name: 'High Company Size Weight', factor: 'Employee Count > 250', weight: '+20 Points', autoTrigger: 'Tag as Enterprise Tier' },
    { id: 'RUL-003', name: 'Direct Inbound Intent', factor: 'Website Demo Request / Pricing Calculator', weight: '+30 Points', autoTrigger: 'Trigger instant 15-min SLA alert' },
    { id: 'RUL-004', name: 'Email Engagement Signal', factor: 'Email Proposal Opened > 3 Times', weight: '+15 Points', autoTrigger: 'Schedule automatic call task' }
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
    desc: 'Standardize client industry classifications, margin benchmarks, and vertical sector codes.',
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
    title: 'Lead Follow-up Cadences',
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
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [hubAddCategory, setHubAddCategory] = useState('products');
  const [editingTemplate, setEditingTemplate] = useState(null);
  const [editingRecord, setEditingRecord] = useState(null);
  const [editRecordFormData, setEditRecordFormData] = useState({});

  const initialSectionFormData = {
    products: {
      name: '',
      sku: '',
      category: 'Software',
      price: '',
      billing: 'Annual Subscription'
    },
    sources: {
      name: '',
      type: 'Inbound Digital',
      weight: 'High (25.0%)',
      costPerLead: ''
    },
    industries: {
      name: '',
      code: '',
      standardMargin: ''
    },
    stages: {
      name: '',
      order: '',
      probability: '',
      slaDays: ''
    },
    objections: {
      name: '',
      category: 'Pricing',
      severity: 'High',
      rebuttal: ''
    },
    cadences: {
      name: '',
      timing: '',
      channel: 'Direct Call + WhatsApp Intro',
      mandatoryAction: ''
    },
    aiRules: {
      name: '',
      factor: '',
      weight: '+20 Points',
      autoTrigger: ''
    }
  };

  const [sectionFormData, setSectionFormData] = useState(initialSectionFormData);

  const updateSectionField = (category, field, value) => {
    setSectionFormData(prev => ({
      ...prev,
      [category]: {
        ...(prev[category] || {}),
        [field]: value
      }
    }));
  };

  const resetSectionForm = (category) => {
    setSectionFormData(prev => ({
      ...prev,
      [category]: { ...initialSectionFormData[category] }
    }));
  };

  // Form state for adding/editing email templates
  const [templateFormData, setTemplateFormData] = useState({
    name: '',
    category: 'Sales Outreach',
    subject: '',
    body: ''
  });

  // Master Data state loaded from localStorage
  const [masterData, setMasterData] = useState(() => {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem('techgy_master_data_v3');
        if (stored) return JSON.parse(stored);
      } catch {}
    }
    return INITIAL_MASTER_DATA;
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('techgy_master_data_v3', JSON.stringify(masterData));
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
      return !effectiveSearch ||
        (item.name && item.name.toLowerCase().includes(effectiveSearch)) ||
        (item.subject && item.subject.toLowerCase().includes(effectiveSearch)) ||
        (item.category && item.category.toLowerCase().includes(effectiveSearch)) ||
        (item.body && item.body.toLowerCase().includes(effectiveSearch));
    }

    return !effectiveSearch ||
      (item.name && item.name.toLowerCase().includes(effectiveSearch)) ||
      (item.sku && item.sku.toLowerCase().includes(effectiveSearch)) ||
      (item.code && item.code.toLowerCase().includes(effectiveSearch)) ||
      (item.category && item.category.toLowerCase().includes(effectiveSearch)) ||
      (item.regionalLead && item.regionalLead.toLowerCase().includes(effectiveSearch)) ||
      (item.hub && item.hub.toLowerCase().includes(effectiveSearch)) ||
      (item.factor && item.factor.toLowerCase().includes(effectiveSearch)) ||
      (item.timing && item.timing.toLowerCase().includes(effectiveSearch));
  });

  const handleOpenEditRecord = (item) => {
    setEditingRecord(item);
    setEditRecordFormData({ ...item });
  };

  const handleSaveEditRecord = (e) => {
    e.preventDefault();
    if (!editingRecord || !editRecordFormData.name?.trim()) return;

    setMasterData(prev => ({
      ...prev,
      [selectedCategory]: (prev[selectedCategory] || []).map(item =>
        item.id === editingRecord.id ? { ...item, ...editRecordFormData } : item
      )
    }));

    if (onTriggerToast) {
      onTriggerToast({
        title: 'Record Updated',
        description: `Successfully updated "${editRecordFormData.name}".`,
        type: 'success'
      });
    }

    setEditingRecord(null);
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
          body: templateFormData.body
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
    const targetCategory = selectedCategory || hubAddCategory || 'products';
    const targetMeta = MASTER_CATEGORIES.find(c => c.id === targetCategory);

    if (targetCategory === 'emailTemplates') {
      if (!templateFormData.name.trim() || !templateFormData.subject.trim()) return;

      const newTpl = {
        id: `TPL-${String(activeEmailTemplates.length + 1).padStart(3, '0')}`,
        name: templateFormData.name.trim(),
        category: templateFormData.category || 'Sales Outreach',
        subject: templateFormData.subject.trim(),
        body: templateFormData.body || ''
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

      setTemplateFormData({ name: '', category: 'Sales Outreach', subject: '', body: '' });
      setIsAddModalOpen(false);
      return;
    }

    const currentForm = sectionFormData[targetCategory] || {};
    if (!currentForm.name || !currentForm.name.trim()) return;

    let newRecord = { ...currentForm, name: currentForm.name.trim() };

    if (targetCategory === 'products') {
      const nextNum = (masterData.products?.length || 0) + 1;
      newRecord.id = `PRD-${String(nextNum).padStart(3, '0')}`;
      if (!newRecord.sku?.trim()) {
        newRecord.sku = `TGY-${newRecord.name.slice(0, 3).toUpperCase()}-${String(nextNum).padStart(2, '0')}`;
      }
      if (!newRecord.price?.trim()) newRecord.price = '₹10,00,000 / yr';
      if (!newRecord.billing) newRecord.billing = 'Annual Subscription';
      if (!newRecord.category) newRecord.category = 'Software';
    } else if (targetCategory === 'sources') {
      const nextNum = (masterData.sources?.length || 0) + 1;
      newRecord.id = `SRC-${String(nextNum).padStart(3, '0')}`;
      if (!newRecord.type) newRecord.type = 'Inbound Digital';
      if (!newRecord.weight) newRecord.weight = 'Medium (15.0%)';
      if (!newRecord.costPerLead?.trim()) newRecord.costPerLead = '₹1,500';
    } else if (targetCategory === 'industries') {
      const nextNum = (masterData.industries?.length || 0) + 1;
      newRecord.id = `IND-${String(nextNum).padStart(3, '0')}`;
      if (!newRecord.code?.trim()) {
        newRecord.code = newRecord.name.replace(/[^a-zA-Z]/g, '').slice(0, 4).toUpperCase();
      }
      if (!newRecord.standardMargin?.trim()) newRecord.standardMargin = '35%';
    } else if (targetCategory === 'stages') {
      const nextNum = (masterData.stages?.length || 0) + 1;
      newRecord.id = `STG-${String(nextNum).padStart(3, '0')}`;
      newRecord.order = Number(newRecord.order) || nextNum;
      if (!newRecord.probability?.trim()) newRecord.probability = '50%';
      if (!newRecord.probability.includes('%')) newRecord.probability = `${newRecord.probability}%`;
      newRecord.slaDays = Number(newRecord.slaDays) || 7;
    } else if (targetCategory === 'objections') {
      const nextNum = (masterData.objections?.length || 0) + 1;
      newRecord.id = `OBJ-${String(nextNum).padStart(3, '0')}`;
      if (!newRecord.category) newRecord.category = 'Pricing';
      if (!newRecord.severity) newRecord.severity = 'High';
      if (!newRecord.rebuttal?.trim()) newRecord.rebuttal = 'Standard objection rebuttal.';
    } else if (targetCategory === 'cadences') {
      const nextNum = (masterData.cadences?.length || 0) + 1;
      newRecord.id = `CAD-${String(nextNum).padStart(3, '0')}`;
      if (!newRecord.timing?.trim()) newRecord.timing = 'Within 24 Hours';
      if (!newRecord.channel) newRecord.channel = 'Direct Call + WhatsApp Intro';
      if (!newRecord.mandatoryAction?.trim()) newRecord.mandatoryAction = 'Follow up with key decision maker.';
    } else if (targetCategory === 'aiRules') {
      const nextNum = (masterData.aiRules?.length || 0) + 1;
      newRecord.id = `RUL-${String(nextNum).padStart(3, '0')}`;
      if (!newRecord.factor?.trim()) newRecord.factor = 'Key Intent Indicator';
      if (!newRecord.weight?.trim()) newRecord.weight = '+20 Points';
      if (!newRecord.autoTrigger?.trim()) newRecord.autoTrigger = 'Flag for account executive review';
    }

    setMasterData(prev => ({
      ...prev,
      [targetCategory]: [...(prev[targetCategory] || []), newRecord]
    }));

    if (onTriggerToast) {
      onTriggerToast({
        title: `${targetMeta?.title.slice(0, -1) || 'Record'} Added`,
        description: `Successfully added "${newRecord.name}" to ${targetMeta?.title || 'Master Data'}`,
        type: 'success'
      });
    }

    resetSectionForm(targetCategory);
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
                  setTemplateFormData({ name: '', category: 'Sales Outreach', subject: '', body: '' });
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

        {/* Search Bar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '1.25rem', padding: '0.75rem 1rem', background: '#F8FAFC', borderRadius: '10px', border: '1px solid #E2E8F0' }}>
          <div style={{ position: 'relative', width: '320px', maxWidth: '100%' }}>
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
                    <th style={{ padding: '0.75rem 1rem', textAlign: 'right' }}>Actions</th>
                  </>
                )}

                {selectedCategory === 'industries' && (
                  <>
                    <th style={{ padding: '0.75rem 1rem' }}>Code</th>
                    <th style={{ padding: '0.75rem 1rem' }}>Industry Sector</th>
                    <th style={{ padding: '0.75rem 1rem' }}>Standard Margin</th>
                    <th style={{ padding: '0.75rem 1rem', textAlign: 'right' }}>Actions</th>
                  </>
                )}

                {selectedCategory === 'stages' && (
                  <>
                    <th style={{ padding: '0.75rem 1rem' }}>Order</th>
                    <th style={{ padding: '0.75rem 1rem' }}>Pipeline Stage Name</th>
                    <th style={{ padding: '0.75rem 1rem' }}>Win Probability</th>
                    <th style={{ padding: '0.75rem 1rem' }}>SLA Target</th>
                    <th style={{ padding: '0.75rem 1rem', textAlign: 'right' }}>Actions</th>
                  </>
                )}


                {selectedCategory === 'emailTemplates' && (
                  <>
                    <th style={{ padding: '0.75rem 1rem' }}>ID</th>
                    <th style={{ padding: '0.75rem 1rem' }}>Template Name</th>
                    <th style={{ padding: '0.75rem 1rem' }}>Category</th>
                    <th style={{ padding: '0.75rem 1rem' }}>Subject Line</th>
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

                  {/* Actions Column */}
                  <td style={{ padding: '0.75rem 1rem', textAlign: 'right' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '0.4rem' }}>
                      {selectedCategory === 'emailTemplates' ? (
                        <button
                          type="button"
                          onClick={() => handleOpenEditTemplate(item)}
                          style={{ background: 'none', border: 'none', color: '#557396', cursor: 'pointer', padding: '4px' }}
                          title="Edit Template"
                        >
                          <LuPencil size={15} />
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => handleOpenEditRecord(item)}
                          style={{
                            background: '#F1F5F9',
                            border: '1px solid #CBD5E1',
                            borderRadius: '6px',
                            padding: '0.25rem 0.65rem',
                            fontSize: '0.75rem',
                            fontWeight: 600,
                            color: '#063669',
                            cursor: 'pointer',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.35rem'
                          }}
                          title="Edit Record"
                        >
                          <LuPencil size={13} /> Edit
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}

              {filteredList.length === 0 && (
                <tr>
                  <td colSpan={6} style={{ textAlign: 'center', padding: '2.5rem', color: '#94A3B8', fontSize: '0.875rem' }}>
                    No records found matching "{effectiveSearch}". Click "+ Add Record" to create one.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Section-Specific Add Record Modal */}
      {isAddModalOpen && selectedCategory !== 'emailTemplates' && (() => {
        const activeCat = selectedCategory || hubAddCategory || 'products';
        const meta = MASTER_CATEGORIES.find(c => c.id === activeCat);
        const CatIcon = meta?.icon || LuPackage;

        return (
          <div className="modal-overlay" onClick={() => setIsAddModalOpen(false)}>
            <div className="modal-card" style={{ maxWidth: '520px' }} onClick={e => e.stopPropagation()}>
              <div className="modal-header">
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                  <div style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '10px',
                    backgroundColor: meta?.iconBg || '#EFF6FF',
                    color: meta?.iconColor || '#1D4ED8',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <CatIcon size={20} />
                  </div>
                  <div>
                    <h3 className="modal-title" style={{ fontSize: '1.1rem', margin: 0 }}>
                      Add {meta?.title.slice(0, -1) || 'Record'}
                    </h3>
                    <div style={{ fontSize: '0.725rem', color: '#557396' }}>
                      Section: <strong>{meta?.title}</strong>
                    </div>
                  </div>
                </div>
                <button className="modal-close-btn" onClick={() => setIsAddModalOpen(false)}><LuX size={18} /></button>
              </div>

              <form onSubmit={handleCreateRecord}>
                <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  
                  {/* Category Switcher if opened from Overview Hub */}
                  {!selectedCategory && (
                    <div className="form-group" style={{ padding: '0.65rem', background: '#F8FAFC', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
                      <label className="form-label" style={{ fontSize: '0.75rem', color: '#063669', fontWeight: 700 }}>
                        Target Master Section
                      </label>
                      <select
                        className="form-select"
                        value={hubAddCategory}
                        onChange={(e) => setHubAddCategory(e.target.value)}
                        style={{ fontSize: '0.825rem', fontWeight: 600 }}
                      >
                        {MASTER_CATEGORIES.map(c => (
                          <option key={c.id} value={c.id}>{c.title}</option>
                        ))}
                      </select>
                    </div>
                  )}

                  {/* 1. Products & Services */}
                  {activeCat === 'products' && (
                    <>
                      <div className="form-group">
                        <label className="form-label">Product / Service Name *</label>
                        <input
                          type="text"
                          required
                          className="form-input"
                          placeholder="e.g. Enterprise Cloud Suite"
                          value={sectionFormData.products.name}
                          onChange={(e) => updateSectionField('products', 'name', e.target.value)}
                        />
                      </div>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                        <div className="form-group">
                          <label className="form-label">SKU Code</label>
                          <input
                            type="text"
                            className="form-input"
                            placeholder="e.g. TGY-ECS-01"
                            value={sectionFormData.products.sku}
                            onChange={(e) => updateSectionField('products', 'sku', e.target.value)}
                          />
                        </div>
                        <div className="form-group">
                          <label className="form-label">Category</label>
                          <select
                            className="form-select"
                            value={sectionFormData.products.category}
                            onChange={(e) => updateSectionField('products', 'category', e.target.value)}
                          >
                            <option value="Software">Software</option>
                            <option value="Security">Security</option>
                            <option value="Artificial Intelligence">Artificial Intelligence</option>
                            <option value="Integration">Integration</option>
                            <option value="Services">Services</option>
                            <option value="Cloud Infrastructure">Cloud Infrastructure</option>
                          </select>
                        </div>
                      </div>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                        <div className="form-group">
                          <label className="form-label">Standard Pricing *</label>
                          <input
                            type="text"
                            required
                            className="form-input"
                            placeholder="e.g. ₹15,00,000 / yr"
                            value={sectionFormData.products.price}
                            onChange={(e) => updateSectionField('products', 'price', e.target.value)}
                          />
                        </div>
                        <div className="form-group">
                          <label className="form-label">Billing Model</label>
                          <select
                            className="form-select"
                            value={sectionFormData.products.billing}
                            onChange={(e) => updateSectionField('products', 'billing', e.target.value)}
                          >
                            <option value="Annual Subscription">Annual Subscription</option>
                            <option value="Monthly Retainer">Monthly Retainer</option>
                            <option value="One-time License">One-time License</option>
                            <option value="Professional Services">Professional Services</option>
                            <option value="Usage-based">Usage-based</option>
                          </select>
                        </div>
                      </div>
                    </>
                  )}

                  {/* 2. Lead Sources */}
                  {activeCat === 'sources' && (
                    <>
                      <div className="form-group">
                        <label className="form-label">Channel / Source Name *</label>
                        <input
                          type="text"
                          required
                          className="form-input"
                          placeholder="e.g. Partner Portal, Webinar Series, Google Ads"
                          value={sectionFormData.sources.name}
                          onChange={(e) => updateSectionField('sources', 'name', e.target.value)}
                        />
                      </div>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                        <div className="form-group">
                          <label className="form-label">Channel Type</label>
                          <select
                            className="form-select"
                            value={sectionFormData.sources.type}
                            onChange={(e) => updateSectionField('sources', 'type', e.target.value)}
                          >
                            <option value="Inbound Digital">Inbound Digital</option>
                            <option value="Direct Voice">Direct Voice</option>
                            <option value="Partner / Client">Partner / Client</option>
                            <option value="Social B2B">Social B2B</option>
                            <option value="Paid Media">Paid Media</option>
                            <option value="Channel Alliance">Channel Alliance</option>
                            <option value="Event / Trade Show">Event / Trade Show</option>
                          </select>
                        </div>
                        <div className="form-group">
                          <label className="form-label">Attribution Weight</label>
                          <select
                            className="form-select"
                            value={sectionFormData.sources.weight}
                            onChange={(e) => updateSectionField('sources', 'weight', e.target.value)}
                          >
                            <option value="High (37.5%)">High (37.5%)</option>
                            <option value="High (25.0%)">High (25.0%)</option>
                            <option value="High (18.8%)">High (18.8%)</option>
                            <option value="Medium (15.0%)">Medium (15.0%)</option>
                            <option value="Medium (9.4%)">Medium (9.4%)</option>
                            <option value="Medium (6.3%)">Medium (6.3%)</option>
                            <option value="Low (3.1%)">Low (3.1%)</option>
                          </select>
                        </div>
                      </div>
                      <div className="form-group">
                        <label className="form-label">Estimated Cost per Lead</label>
                        <input
                          type="text"
                          className="form-input"
                          placeholder="e.g. ₹1,500, ₹0 (Organic), Revenue Share"
                          value={sectionFormData.sources.costPerLead}
                          onChange={(e) => updateSectionField('sources', 'costPerLead', e.target.value)}
                        />
                      </div>
                    </>
                  )}

                  {/* 3. Industry Sectors */}
                  {activeCat === 'industries' && (
                    <>
                      <div className="form-group">
                        <label className="form-label">Industry Sector Name *</label>
                        <input
                          type="text"
                          required
                          className="form-input"
                          placeholder="e.g. Logistics & Supply Chain, FinTech & Banking"
                          value={sectionFormData.industries.name}
                          onChange={(e) => updateSectionField('industries', 'name', e.target.value)}
                        />
                      </div>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                        <div className="form-group">
                          <label className="form-label">Sector Code</label>
                          <input
                            type="text"
                            className="form-input"
                            placeholder="e.g. IT-SOFT, BFSI-FIN"
                            value={sectionFormData.industries.code}
                            onChange={(e) => updateSectionField('industries', 'code', e.target.value)}
                          />
                        </div>
                        <div className="form-group">
                          <label className="form-label">Standard Margin Target</label>
                          <input
                            type="text"
                            className="form-input"
                            placeholder="e.g. 42%, 35%"
                            value={sectionFormData.industries.standardMargin}
                            onChange={(e) => updateSectionField('industries', 'standardMargin', e.target.value)}
                          />
                        </div>
                      </div>
                    </>
                  )}

                  {/* 4. Pipeline Stages */}
                  {activeCat === 'stages' && (
                    <>
                      <div className="form-group">
                        <label className="form-label">Pipeline Stage Name *</label>
                        <input
                          type="text"
                          required
                          className="form-input"
                          placeholder="e.g. Technical Solution Validation"
                          value={sectionFormData.stages.name}
                          onChange={(e) => updateSectionField('stages', 'name', e.target.value)}
                        />
                      </div>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                        <div className="form-group">
                          <label className="form-label">Order in Funnel</label>
                          <input
                            type="number"
                            className="form-input"
                            placeholder="e.g. 5"
                            value={sectionFormData.stages.order}
                            onChange={(e) => updateSectionField('stages', 'order', e.target.value)}
                          />
                        </div>
                        <div className="form-group">
                          <label className="form-label">Win Probability (%) *</label>
                          <input
                            type="text"
                            required
                            className="form-input"
                            placeholder="e.g. 50%"
                            value={sectionFormData.stages.probability}
                            onChange={(e) => updateSectionField('stages', 'probability', e.target.value)}
                          />
                        </div>
                      </div>
                      <div className="form-group">
                        <label className="form-label">Target SLA Duration (Days)</label>
                        <input
                          type="number"
                          className="form-input"
                          placeholder="e.g. 7"
                          value={sectionFormData.stages.slaDays}
                          onChange={(e) => updateSectionField('stages', 'slaDays', e.target.value)}
                        />
                      </div>
                    </>
                  )}

                  {/* 5. Sales Objections */}
                  {activeCat === 'objections' && (
                    <>
                      <div className="form-group">
                        <label className="form-label">Objection Title *</label>
                        <input
                          type="text"
                          required
                          className="form-input"
                          placeholder="e.g. Budget Freeze / Timeline Delay"
                          value={sectionFormData.objections.name}
                          onChange={(e) => updateSectionField('objections', 'name', e.target.value)}
                        />
                      </div>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                        <div className="form-group">
                          <label className="form-label">Category</label>
                          <select
                            className="form-select"
                            value={sectionFormData.objections.category}
                            onChange={(e) => updateSectionField('objections', 'category', e.target.value)}
                          >
                            <option value="Pricing">Pricing</option>
                            <option value="Incumbent">Incumbent / Competitor</option>
                            <option value="Technical">Technical & Security</option>
                            <option value="Operations">Operations & Bandwidth</option>
                            <option value="Timeline">Timeline / Delays</option>
                            <option value="Compliance">Compliance & Legal</option>
                          </select>
                        </div>
                        <div className="form-group">
                          <label className="form-label">Severity Level</label>
                          <select
                            className="form-select"
                            value={sectionFormData.objections.severity}
                            onChange={(e) => updateSectionField('objections', 'severity', e.target.value)}
                          >
                            <option value="Critical">Critical</option>
                            <option value="High">High</option>
                            <option value="Medium">Medium</option>
                            <option value="Low">Low</option>
                          </select>
                        </div>
                      </div>
                      <div className="form-group">
                        <label className="form-label">Recommended Rebuttal / Script *</label>
                        <textarea
                          rows={4}
                          required
                          className="form-textarea"
                          placeholder="Detail the suggested response framework, ROI proof point, or customer case study..."
                          value={sectionFormData.objections.rebuttal}
                          onChange={(e) => updateSectionField('objections', 'rebuttal', e.target.value)}
                        />
                      </div>
                    </>
                  )}

                  {/* 6. Lead Follow-up Cadences */}
                  {activeCat === 'cadences' && (
                    <>
                      <div className="form-group">
                        <label className="form-label">Cadence Step Name *</label>
                        <input
                          type="text"
                          required
                          className="form-input"
                          placeholder="e.g. Day 5 Executive Alignment"
                          value={sectionFormData.cadences.name}
                          onChange={(e) => updateSectionField('cadences', 'name', e.target.value)}
                        />
                      </div>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                        <div className="form-group">
                          <label className="form-label">Timing Window *</label>
                          <input
                            type="text"
                            required
                            className="form-input"
                            placeholder="e.g. Within 2 Hours, Day 3 Post-Call"
                            value={sectionFormData.cadences.timing}
                            onChange={(e) => updateSectionField('cadences', 'timing', e.target.value)}
                          />
                        </div>
                        <div className="form-group">
                          <label className="form-label">Channel Mode</label>
                          <select
                            className="form-select"
                            value={sectionFormData.cadences.channel}
                            onChange={(e) => updateSectionField('cadences', 'channel', e.target.value)}
                          >
                            <option value="Direct Call + WhatsApp Intro">Direct Call + WhatsApp Intro</option>
                            <option value="Customized Pitch Email">Customized Pitch Email</option>
                            <option value="Executive Follow-up Call">Executive Follow-up Call</option>
                            <option value="Value-add Whitepaper / Case Study">Value-add Whitepaper / Case Study</option>
                            <option value="LinkedIn InMail">LinkedIn InMail</option>
                            <option value="Product Demonstration">Product Demonstration</option>
                          </select>
                        </div>
                      </div>
                      <div className="form-group">
                        <label className="form-label">Mandatory Next Action *</label>
                        <input
                          type="text"
                          required
                          className="form-input"
                          placeholder="e.g. Validate qualification criteria, Confirm stakeholders"
                          value={sectionFormData.cadences.mandatoryAction}
                          onChange={(e) => updateSectionField('cadences', 'mandatoryAction', e.target.value)}
                        />
                      </div>
                    </>
                  )}

                  {/* 7. AI Scoring Rules */}
                  {activeCat === 'aiRules' && (
                    <>
                      <div className="form-group">
                        <label className="form-label">Scoring Rule Name *</label>
                        <input
                          type="text"
                          required
                          className="form-input"
                          placeholder="e.g. Enterprise Employee Count Multiplier"
                          value={sectionFormData.aiRules.name}
                          onChange={(e) => updateSectionField('aiRules', 'name', e.target.value)}
                        />
                      </div>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                        <div className="form-group">
                          <label className="form-label">Intent / Profile Factor *</label>
                          <input
                            type="text"
                            required
                            className="form-input"
                            placeholder="e.g. Employee Count > 250"
                            value={sectionFormData.aiRules.factor}
                            onChange={(e) => updateSectionField('aiRules', 'factor', e.target.value)}
                          />
                        </div>
                        <div className="form-group">
                          <label className="form-label">Score Weight *</label>
                          <input
                            type="text"
                            required
                            className="form-input"
                            placeholder="e.g. +25 Points, -10 Points"
                            value={sectionFormData.aiRules.weight}
                            onChange={(e) => updateSectionField('aiRules', 'weight', e.target.value)}
                          />
                        </div>
                      </div>
                      <div className="form-group">
                        <label className="form-label">Automated System Trigger</label>
                        <input
                          type="text"
                          className="form-input"
                          placeholder="e.g. Route to Senior Account Executive"
                          value={sectionFormData.aiRules.autoTrigger}
                          onChange={(e) => updateSectionField('aiRules', 'autoTrigger', e.target.value)}
                        />
                      </div>
                    </>
                  )}

                </div>
                <div className="modal-footer">
                  <button type="button" className="btn-secondary" onClick={() => setIsAddModalOpen(false)}>Cancel</button>
                  <button type="submit" className="btn-primary">
                    Save {meta?.title.slice(0, -1) || 'Record'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        );
      })()}

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

      {/* Edit Standard Master Record Modal */}
      {editingRecord && (
        <div className="modal-overlay" onClick={() => setEditingRecord(null)}>
          <div className="modal-card" style={{ maxWidth: '500px' }} onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">Edit {selectedCategoryMeta?.title.slice(0, -1) || 'Record'}</h3>
              <button className="modal-close-btn" onClick={() => setEditingRecord(null)}><LuX size={18} /></button>
            </div>
            <form onSubmit={handleSaveEditRecord}>
              <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Name / Title *</label>
                  <input
                    type="text"
                    required
                    className="form-input"
                    value={editRecordFormData.name || ''}
                    onChange={(e) => setEditRecordFormData({ ...editRecordFormData, name: e.target.value })}
                  />
                </div>

                {selectedCategory === 'products' && (
                  <>
                    <div className="form-group">
                      <label className="form-label">SKU</label>
                      <input
                        type="text"
                        className="form-input"
                        value={editRecordFormData.sku || ''}
                        onChange={(e) => setEditRecordFormData({ ...editRecordFormData, sku: e.target.value })}
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Category</label>
                      <input
                        type="text"
                        className="form-input"
                        value={editRecordFormData.category || ''}
                        onChange={(e) => setEditRecordFormData({ ...editRecordFormData, category: e.target.value })}
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Price / Value</label>
                      <input
                        type="text"
                        className="form-input"
                        value={editRecordFormData.price || ''}
                        onChange={(e) => setEditRecordFormData({ ...editRecordFormData, price: e.target.value })}
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Billing Model</label>
                      <input
                        type="text"
                        className="form-input"
                        value={editRecordFormData.billing || ''}
                        onChange={(e) => setEditRecordFormData({ ...editRecordFormData, billing: e.target.value })}
                      />
                    </div>
                  </>
                )}

                {selectedCategory === 'sources' && (
                  <>
                    <div className="form-group">
                      <label className="form-label">Channel / Type</label>
                      <input
                        type="text"
                        className="form-input"
                        value={editRecordFormData.type || ''}
                        onChange={(e) => setEditRecordFormData({ ...editRecordFormData, type: e.target.value })}
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Attribution Weight</label>
                      <input
                        type="text"
                        className="form-input"
                        value={editRecordFormData.weight || ''}
                        onChange={(e) => setEditRecordFormData({ ...editRecordFormData, weight: e.target.value })}
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Cost Per Lead</label>
                      <input
                        type="text"
                        className="form-input"
                        value={editRecordFormData.costPerLead || ''}
                        onChange={(e) => setEditRecordFormData({ ...editRecordFormData, costPerLead: e.target.value })}
                      />
                    </div>
                  </>
                )}

                {selectedCategory === 'industries' && (
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                    <div className="form-group">
                      <label className="form-label">Sector Code</label>
                      <input
                        type="text"
                        className="form-input"
                        value={editRecordFormData.code || ''}
                        onChange={(e) => setEditRecordFormData({ ...editRecordFormData, code: e.target.value })}
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Standard Margin</label>
                      <input
                        type="text"
                        className="form-input"
                        value={editRecordFormData.standardMargin || ''}
                        onChange={(e) => setEditRecordFormData({ ...editRecordFormData, standardMargin: e.target.value })}
                      />
                    </div>
                  </div>
                )}

                {selectedCategory === 'stages' && (
                  <>
                    <div className="form-group">
                      <label className="form-label">Win Probability</label>
                      <input
                        type="text"
                        className="form-input"
                        value={editRecordFormData.probability || ''}
                        onChange={(e) => setEditRecordFormData({ ...editRecordFormData, probability: e.target.value })}
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">SLA Target Days</label>
                      <input
                        type="number"
                        className="form-input"
                        value={editRecordFormData.slaDays || 0}
                        onChange={(e) => setEditRecordFormData({ ...editRecordFormData, slaDays: Number(e.target.value) })}
                      />
                    </div>
                  </>
                )}

                {selectedCategory === 'objections' && (
                  <>
                    <div className="form-group">
                      <label className="form-label">Category</label>
                      <input
                        type="text"
                        className="form-input"
                        value={editRecordFormData.category || ''}
                        onChange={(e) => setEditRecordFormData({ ...editRecordFormData, category: e.target.value })}
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Recommended Rebuttal</label>
                      <textarea
                        rows={3}
                        className="form-textarea"
                        value={editRecordFormData.rebuttal || ''}
                        onChange={(e) => setEditRecordFormData({ ...editRecordFormData, rebuttal: e.target.value })}
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Severity</label>
                      <input
                        type="text"
                        className="form-input"
                        value={editRecordFormData.severity || ''}
                        onChange={(e) => setEditRecordFormData({ ...editRecordFormData, severity: e.target.value })}
                      />
                    </div>
                  </>
                )}

                {selectedCategory === 'cadences' && (
                  <>
                    <div className="form-group">
                      <label className="form-label">Timing</label>
                      <input
                        type="text"
                        className="form-input"
                        value={editRecordFormData.timing || ''}
                        onChange={(e) => setEditRecordFormData({ ...editRecordFormData, timing: e.target.value })}
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Channel</label>
                      <input
                        type="text"
                        className="form-input"
                        value={editRecordFormData.channel || ''}
                        onChange={(e) => setEditRecordFormData({ ...editRecordFormData, channel: e.target.value })}
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Mandatory Action</label>
                      <input
                        type="text"
                        className="form-input"
                        value={editRecordFormData.mandatoryAction || ''}
                        onChange={(e) => setEditRecordFormData({ ...editRecordFormData, mandatoryAction: e.target.value })}
                      />
                    </div>
                  </>
                )}

                {selectedCategory === 'aiRules' && (
                  <>
                    <div className="form-group">
                      <label className="form-label">Factor</label>
                      <input
                        type="text"
                        className="form-input"
                        value={editRecordFormData.factor || ''}
                        onChange={(e) => setEditRecordFormData({ ...editRecordFormData, factor: e.target.value })}
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Weight</label>
                      <input
                        type="text"
                        className="form-input"
                        value={editRecordFormData.weight || ''}
                        onChange={(e) => setEditRecordFormData({ ...editRecordFormData, weight: e.target.value })}
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Automated Trigger</label>
                      <input
                        type="text"
                        className="form-input"
                        value={editRecordFormData.autoTrigger || ''}
                        onChange={(e) => setEditRecordFormData({ ...editRecordFormData, autoTrigger: e.target.value })}
                      />
                    </div>
                  </>
                )}
              </div>
              <div className="modal-footer">
                <button type="button" className="btn-secondary" onClick={() => setEditingRecord(null)}>Cancel</button>
                <button type="submit" className="btn-primary">Save Changes</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
