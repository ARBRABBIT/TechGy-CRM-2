import React, { useState, useEffect } from 'react';
import {
  LuDatabase,
  LuPackage,
  LuShare2,
  LuFactory,
  LuGitCommitVertical,
  LuMapPin,
  LuMail,
  LuPlus,
  LuSearch,
  LuCheck,
  LuX,
  LuToggleLeft,
  LuToggleRight,
  LuChevronRight,
  LuLayers,
  LuPencil,
  LuTrash2
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
  territories: [
    { id: 'TER-001', name: 'West Zone', hub: 'Mumbai, Maharashtra', states: 'MH, GJ, GA', regionalLead: 'Rajesh Sharma', status: 'Active' },
    { id: 'TER-002', name: 'South Zone - Karnataka', hub: 'Bengaluru, Karnataka', states: 'KA, KL', regionalLead: 'Priya Patel', status: 'Active' },
    { id: 'TER-003', name: 'North Zone - NCR', hub: 'New Delhi & Gurugram', states: 'DL, HR, UP, PB', regionalLead: 'Amit Verma', status: 'Active' },
    { id: 'TER-004', name: 'South Zone - Deccan', hub: 'Hyderabad, Telangana', states: 'TG, AP, TN', regionalLead: 'Ananya Rao', status: 'Active' },
    { id: 'TER-005', name: 'East Zone', hub: 'Kolkata, West Bengal', states: 'WB, OR, JH, NE', regionalLead: 'Vikram Malhotra', status: 'Active' }
  ]
};

const MASTER_TABS = [
  { id: 'products', label: 'Products & Services', icon: LuPackage },
  { id: 'sources', label: 'Lead Sources', icon: LuShare2 },
  { id: 'industries', label: 'Industry Sectors', icon: LuFactory },
  { id: 'stages', label: 'Pipeline Stages', icon: LuGitCommitVertical },
  { id: 'territories', label: 'Territories & Hubs', icon: LuMapPin },
  { id: 'emailTemplates', label: 'Email Templates', icon: LuMail }
];

export default function MasterDataView({
  searchQuery = '',
  fromDashboard = false,
  onBackToDashboard,
  onTriggerToast,
  emailTemplates = [],
  onUpdateEmailTemplates
}) {
  const [activeTab, setActiveTab] = useState('products');
  const [localSearch, setLocalSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState(null);

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
        const stored = localStorage.getItem('techgy_master_data');
        if (stored) return JSON.parse(stored);
      } catch {}
    }
    return INITIAL_MASTER_DATA;
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('techgy_master_data', JSON.stringify(masterData));
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

  // Active dataset
  const currentList = activeTab === 'emailTemplates' ? activeEmailTemplates : (masterData[activeTab] || []);
  const filteredList = currentList.filter(item => {
    if (activeTab === 'emailTemplates') {
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
      (item.hub && item.hub.toLowerCase().includes(effectiveSearch));

    const matchesStatus = statusFilter === 'All' || item.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const toggleStatus = (id) => {
    if (activeTab === 'emailTemplates') {
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

    const targetItem = masterData[activeTab]?.find(item => item.id === id);
    if (!targetItem) return;
    const newStatus = targetItem.status === 'Active' ? 'Inactive' : 'Active';

    setMasterData(prev => ({
      ...prev,
      [activeTab]: prev[activeTab].map(item =>
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

    if (activeTab === 'emailTemplates') {
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

    if (activeTab === 'products') {
      newRecord.sku = formData.codeOrSku || `TGY-${formData.name.slice(0, 3).toUpperCase()}-99`;
      newRecord.category = formData.categoryOrType || 'Software';
      newRecord.price = formData.extraInfo || '₹10,00,000 / yr';
      newRecord.billing = 'Annual Subscription';
    } else if (activeTab === 'sources') {
      newRecord.type = formData.categoryOrType || 'Direct Channel';
      newRecord.weight = 'Custom';
      newRecord.costPerLead = formData.extraInfo || '₹1,500';
    } else if (activeTab === 'industries') {
      newRecord.code = formData.codeOrSku || formData.name.slice(0, 4).toUpperCase();
      newRecord.tier = formData.categoryOrType || 'Tier 2 Strategic';
      newRecord.standardMargin = formData.extraInfo || '35%';
    } else if (activeTab === 'stages') {
      newRecord.order = (masterData.stages.length || 0) + 1;
      newRecord.probability = formData.extraInfo || '50%';
      newRecord.slaDays = 7;
    } else if (activeTab === 'territories') {
      newRecord.hub = formData.codeOrSku || 'Hub Location';
      newRecord.states = formData.categoryOrType || 'State Coverage';
      newRecord.regionalLead = formData.extraInfo || 'Rajesh Sharma';
    }

    setMasterData(prev => ({
      ...prev,
      [activeTab]: [...prev[activeTab], newRecord]
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

  const activeCategoryMeta = MASTER_TABS.find(t => t.id === activeTab);

  return (
    <div className="master-data-view" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      {/* Breadcrumb Navigation when navigated from Dashboard */}
      {fromDashboard && (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <nav style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', fontWeight: 500, color: '#557396' }}>
            <span
              onClick={onBackToDashboard}
              style={{ cursor: 'pointer', color: '#063669' }}
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

      {/* Main Container Card */}
      <div className="section-card" style={{ padding: '1.25rem 1.5rem', background: '#FFFFFF', borderRadius: '12px', border: '1px solid #E5EBF2' }}>
        
        {/* Top Header Row with Actions */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: '#063669', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <LuDatabase size={20} />
            </div>
            <div>
              <h2 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#063669', margin: 0 }}>
                Master Data Repository
              </h2>
              <p style={{ fontSize: '0.8rem', color: '#64748B', margin: '0.15rem 0 0 0' }}>
                Manage core catalog items, lead channels, industry sectors, pipeline stages, territories, and email templates.
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <button
              className="btn-primary"
              onClick={() => {
                if (activeTab === 'emailTemplates') {
                  setTemplateFormData({ name: '', category: 'Sales Outreach', subject: '', body: '', status: 'Active' });
                }
                setIsAddModalOpen(true);
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.35rem',
                fontSize: '0.8rem',
                background: '#063669',
                color: 'white',
                height: '34px',
                padding: '0 0.95rem',
                borderRadius: '6px',
                fontWeight: 600,
                border: 'none',
                cursor: 'pointer'
              }}
            >
              <LuPlus size={15} /> {activeTab === 'emailTemplates' ? 'Create Email Template' : 'Add Record'}
            </button>
          </div>
        </div>

        {/* Clean Segmented Tab Navigation - Apple/Linear Pill Style */}
        <div style={{ marginBottom: '1.25rem' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              backgroundColor: '#F1F5F9',
              padding: '3px',
              borderRadius: '9px',
              gap: '3px',
              maxWidth: '100%',
              overflowX: 'auto'
            }}
          >
            {MASTER_TABS.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              const count = tab.id === 'emailTemplates' ? activeEmailTemplates.length : (masterData[tab.id]?.length || 0);
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => {
                    setActiveTab(tab.id);
                    setLocalSearch('');
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.45rem',
                    padding: '0.45rem 0.85rem',
                    fontSize: '0.825rem',
                    fontWeight: isActive ? 700 : 500,
                    color: isActive ? '#063669' : '#64748B',
                    background: isActive ? '#FFFFFF' : 'transparent',
                    border: 'none',
                    outline: 'none',
                    borderRadius: '7px',
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                    boxShadow: isActive ? '0 1px 3px rgba(0, 0, 0, 0.08), 0 1px 2px rgba(0, 0, 0, 0.04)' : 'none',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <Icon size={15} style={{ color: isActive ? '#063669' : '#94A3B8' }} />
                  <span>{tab.label}</span>
                  <span
                    style={{
                      fontSize: '0.7rem',
                      fontWeight: 700,
                      padding: '0.1rem 0.45rem',
                      borderRadius: '999px',
                      background: isActive ? '#E6EDF5' : '#E2E8F0',
                      color: isActive ? '#063669' : '#64748B',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Clean Filter & Search Bar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
          <div style={{ position: 'relative', width: '280px', maxWidth: '100%' }}>
            <LuSearch size={15} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }} />
            <input
              type="text"
              placeholder={`Search in ${activeCategoryMeta?.label}...`}
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
              style={{
                width: '100%',
                height: '34px',
                padding: '0 0.75rem 0 2.1rem',
                borderRadius: '6px',
                border: '1px solid #E2E8F0',
                backgroundColor: '#F8FAFC',
                fontSize: '0.825rem',
                color: '#0F172A',
                outline: 'none',
                transition: 'border-color 0.15s ease'
              }}
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '0.8rem', color: '#64748B', fontWeight: 500 }}>Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              style={{
                height: '34px',
                padding: '0 0.75rem',
                borderRadius: '6px',
                border: '1px solid #E2E8F0',
                fontSize: '0.825rem',
                color: '#063669',
                backgroundColor: '#FFFFFF',
                cursor: 'pointer',
                outline: 'none'
              }}
            >
              <option value="All">All Records ({currentList.length})</option>
              <option value="Active">Active ({currentList.filter(i => i.status === 'Active').length})</option>
              <option value="Inactive">Inactive ({currentList.filter(i => i.status === 'Inactive').length})</option>
            </select>
          </div>
        </div>

        {/* Clean Data Table */}
        {filteredList.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3.5rem 1rem', color: '#64748B' }}>
            <div style={{ width: '44px', height: '44px', borderRadius: '50%', background: '#F1F5F9', color: '#64748B', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 0.75rem' }}>
              <LuLayers size={20} />
            </div>
            <div style={{ fontWeight: 600, color: '#063669', fontSize: '0.95rem', marginBottom: '0.2rem' }}>No master records match</div>
            <div style={{ fontSize: '0.8rem' }}>Try refining your search keyword or switching the status filter.</div>
          </div>
        ) : (
          <div style={{ overflowX: 'auto', borderRadius: '8px', border: '1px solid #E5EBF2' }}>
            <table className="action-table" style={{ width: '100%', margin: 0 }}>
              <thead>
                <tr>
                  <th style={{ width: '100px' }}>ID / Code</th>
                  <th>Template / Record Name</th>
                  {activeTab === 'emailTemplates' && (
                    <>
                      <th style={{ width: '130px' }}>Category</th>
                      <th style={{ minWidth: '220px' }}>Subject Line</th>
                      <th style={{ minWidth: '240px' }}>Email Body Snippet</th>
                    </>
                  )}
                  {activeTab === 'products' && (
                    <>
                      <th>Category</th>
                      <th>Pricing</th>
                      <th>Billing Model</th>
                    </>
                  )}
                  {activeTab === 'sources' && (
                    <>
                      <th>Channel Type</th>
                      <th>Attribution Mix</th>
                      <th>Benchmark CPL</th>
                    </>
                  )}
                  {activeTab === 'industries' && (
                    <>
                      <th>Sector Code</th>
                      <th>Account Tier</th>
                      <th>Target Margin</th>
                    </>
                  )}
                  {activeTab === 'stages' && (
                    <>
                      <th>Stage Order</th>
                      <th>Win Probability</th>
                      <th>Max SLA Duration</th>
                    </>
                  )}
                  {activeTab === 'territories' && (
                    <>
                      <th>Regional Hub</th>
                      <th>State Coverage</th>
                      <th>Regional Lead</th>
                    </>
                  )}
                  <th style={{ width: '90px' }}>Status</th>
                  <th style={{ width: activeTab === 'emailTemplates' ? '140px' : '110px', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredList.map((item) => (
                  <tr key={item.id}>
                    <td style={{ fontWeight: 700, color: '#063669', fontSize: '0.8rem' }}>
                      {item.id || item.code || item.sku}
                    </td>
                    <td style={{ fontWeight: 600, color: '#0F172A' }}>
                      {item.name}
                    </td>
                    {activeTab === 'emailTemplates' && (
                      <>
                        <td>
                          <span style={{ padding: '0.2rem 0.5rem', borderRadius: '4px', background: '#F0F5FA', fontSize: '0.75rem', fontWeight: 600, color: '#063669' }}>
                            {item.category || 'Sales Outreach'}
                          </span>
                        </td>
                        <td style={{ color: '#063669', fontWeight: 600, fontSize: '0.8rem' }}>
                          {item.subject}
                        </td>
                        <td style={{ color: '#64748B', fontSize: '0.785rem', maxWidth: '280px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {item.body ? item.body.replace(/\n/g, ' ') : '—'}
                        </td>
                      </>
                    )}
                    {activeTab === 'products' && (
                      <>
                        <td>
                          <span style={{ padding: '0.15rem 0.45rem', borderRadius: '4px', background: '#F1F5F9', fontSize: '0.75rem', fontWeight: 600, color: '#475569' }}>
                            {item.category}
                          </span>
                        </td>
                        <td style={{ fontWeight: 700, color: '#063669' }}>{item.price}</td>
                        <td style={{ color: '#64748B' }}>{item.billing}</td>
                      </>
                    )}
                    {activeTab === 'sources' && (
                      <>
                        <td style={{ color: '#64748B' }}>{item.type}</td>
                        <td style={{ fontWeight: 600, color: '#063669' }}>{item.weight}</td>
                        <td style={{ color: '#64748B' }}>{item.costPerLead}</td>
                      </>
                    )}
                    {activeTab === 'industries' && (
                      <>
                        <td style={{ color: '#64748B' }}>{item.code}</td>
                        <td style={{ color: '#063669', fontWeight: 600 }}>{item.tier}</td>
                        <td style={{ color: '#137333', fontWeight: 700 }}>{item.standardMargin}</td>
                      </>
                    )}
                    {activeTab === 'stages' && (
                      <>
                        <td style={{ color: '#64748B' }}>Stage {item.order}</td>
                        <td style={{ fontWeight: 700, color: '#063669' }}>{item.probability}</td>
                        <td style={{ color: '#64748B' }}>{item.slaDays ? `${item.slaDays} Days` : 'Immediate'}</td>
                      </>
                    )}
                    {activeTab === 'territories' && (
                      <>
                        <td style={{ color: '#063669', fontWeight: 600 }}>{item.hub}</td>
                        <td style={{ color: '#64748B' }}>{item.states}</td>
                        <td style={{ color: '#063669' }}>{item.regionalLead}</td>
                      </>
                    )}
                    <td>
                      <span
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.25rem',
                          padding: '0.2rem 0.55rem',
                          borderRadius: '999px',
                          fontSize: '0.75rem',
                          fontWeight: 600,
                          background: item.status === 'Active' ? '#E6F4EA' : '#F1F5F9',
                          color: item.status === 'Active' ? '#137333' : '#64748B'
                        }}
                      >
                        {item.status === 'Active' ? <LuCheck size={12} /> : <LuX size={12} />}
                        {item.status}
                      </span>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', justifyContent: 'flex-end' }}>
                        {activeTab === 'emailTemplates' && (
                          <>
                            <button
                              type="button"
                              onClick={() => handleOpenEditTemplate(item)}
                              style={{
                                background: '#F0F5FA',
                                border: '1px solid #D5E2EE',
                                borderRadius: '5px',
                                cursor: 'pointer',
                                color: '#063669',
                                padding: '0.25rem 0.45rem',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '0.25rem',
                                fontSize: '0.75rem',
                                fontWeight: 600
                              }}
                              title="Edit Email Template"
                            >
                              <LuPencil size={12} /> Edit
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteTemplate(item.id)}
                              style={{
                                background: '#FEF2F2',
                                border: '1px solid #FECACA',
                                borderRadius: '5px',
                                cursor: 'pointer',
                                color: '#DC2626',
                                padding: '0.25rem 0.45rem',
                                display: 'inline-flex',
                                alignItems: 'center',
                                fontSize: '0.75rem'
                              }}
                              title="Delete Template"
                            >
                              <LuTrash2 size={12} />
                            </button>
                          </>
                        )}
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleStatus(item.id);
                          }}
                          style={{
                            background: 'none',
                            border: 'none',
                            outline: 'none',
                            cursor: 'pointer',
                            color: item.status === 'Active' ? '#063669' : '#94A3B8',
                            padding: '0.2rem',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.25rem',
                            fontSize: '0.75rem',
                            fontWeight: 600
                          }}
                          title={item.status === 'Active' ? 'Click to Deactivate' : 'Click to Activate'}
                        >
                          {item.status === 'Active' ? (
                            <LuToggleRight size={22} color="#063669" />
                          ) : (
                            <LuToggleLeft size={22} color="#94A3B8" />
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Create Modal (Standard Master Record or Email Template) */}
      {isAddModalOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(6, 54, 105, 0.45)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '1.25rem'
          }}
          onClick={() => setIsAddModalOpen(false)}
        >
          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '14px',
              maxWidth: activeTab === 'emailTemplates' ? '680px' : '500px',
              width: '92%',
              maxHeight: '92vh',
              overflowY: 'auto',
              padding: activeTab === 'emailTemplates' ? '1.75rem 2rem' : '1.5rem',
              boxShadow: '0 25px 50px -12px rgba(6, 54, 105, 0.25)'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.35rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#063669', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {activeTab === 'emailTemplates' ? <LuMail size={18} /> : <LuPlus size={18} />}
                </div>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#063669', margin: 0 }}>
                  {activeTab === 'emailTemplates'
                    ? 'Create New Email Template'
                    : `Add ${activeTab === 'products' ? 'Product / Service' : activeTab === 'sources' ? 'Lead Channel' : activeTab === 'industries' ? 'Industry Vertical' : activeTab === 'stages' ? 'Pipeline Stage' : 'Territory Hub'}`}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                style={{ background: 'none', border: 'none', outline: 'none', color: '#64748B', cursor: 'pointer', padding: '0.25rem' }}
              >
                <LuX size={20} />
              </button>
            </div>

            {activeTab === 'emailTemplates' ? (
              <form onSubmit={handleCreateRecord} style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '1rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 600, color: '#063669', marginBottom: '0.4rem' }}>
                      Template Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Contract Sign-off & Onboarding"
                      value={templateFormData.name}
                      onChange={(e) => setTemplateFormData({ ...templateFormData, name: e.target.value })}
                      style={{ width: '100%', height: '38px', padding: '0 0.85rem', borderRadius: '7px', border: '1px solid #CBD5E1', fontSize: '0.875rem', outline: 'none' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 600, color: '#063669', marginBottom: '0.4rem' }}>
                      Category
                    </label>
                    <select
                      value={templateFormData.category}
                      onChange={(e) => setTemplateFormData({ ...templateFormData, category: e.target.value })}
                      style={{ width: '100%', height: '38px', padding: '0 0.85rem', borderRadius: '7px', border: '1px solid #CBD5E1', fontSize: '0.875rem', outline: 'none', backgroundColor: '#FFFFFF' }}
                    >
                      <option value="Sales Outreach">Sales Outreach</option>
                      <option value="Follow-up">Follow-up</option>
                      <option value="Demo & Pitch">Demo & Pitch</option>
                      <option value="Commercials">Commercials</option>
                      <option value="Lead Nurture">Lead Nurture</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 600, color: '#063669', marginBottom: '0.4rem' }}>
                    Subject Line *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Next Steps: TechGy CRM Agreement for {company}"
                    value={templateFormData.subject}
                    onChange={(e) => setTemplateFormData({ ...templateFormData, subject: e.target.value })}
                    style={{ width: '100%', height: '38px', padding: '0 0.85rem', borderRadius: '7px', border: '1px solid #CBD5E1', fontSize: '0.875rem', outline: 'none' }}
                  />
                </div>

                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                    <label style={{ fontSize: '0.825rem', fontWeight: 600, color: '#063669' }}>
                      Email Body Content *
                    </label>
                    <div style={{ display: 'flex', gap: '0.4rem' }}>
                      <button
                        type="button"
                        onClick={() => setTemplateFormData(prev => ({ ...prev, body: prev.body + ' {leadName}' }))}
                        style={{ fontSize: '0.75rem', padding: '0.2rem 0.55rem', borderRadius: '5px', border: '1px solid #CBD5E1', background: '#F8FAFC', cursor: 'pointer', color: '#063669', fontWeight: 600 }}
                      >
                        + {'{leadName}'}
                      </button>
                      <button
                        type="button"
                        onClick={() => setTemplateFormData(prev => ({ ...prev, body: prev.body + ' {company}' }))}
                        style={{ fontSize: '0.75rem', padding: '0.2rem 0.55rem', borderRadius: '5px', border: '1px solid #CBD5E1', background: '#F8FAFC', cursor: 'pointer', color: '#063669', fontWeight: 600 }}
                      >
                        + {'{company}'}
                      </button>
                    </div>
                  </div>
                  <textarea
                    required
                    rows={9}
                    placeholder="Type template message body here. Use {leadName} and {company} as dynamic placeholders..."
                    value={templateFormData.body}
                    onChange={(e) => setTemplateFormData({ ...templateFormData, body: e.target.value })}
                    style={{
                      width: '100%',
                      minHeight: '200px',
                      padding: '0.85rem',
                      borderRadius: '8px',
                      border: '1px solid #CBD5E1',
                      fontSize: '0.875rem',
                      lineHeight: '1.55',
                      outline: 'none',
                      resize: 'vertical',
                      fontFamily: 'inherit',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.65rem', marginTop: '0.5rem' }}>
                  <button
                    type="button"
                    onClick={() => setIsAddModalOpen(false)}
                    className="btn-secondary"
                    style={{ padding: '0.55rem 1.15rem', fontSize: '0.85rem' }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn-primary"
                    style={{ background: '#063669', color: 'white', padding: '0.55rem 1.35rem', borderRadius: '7px', fontWeight: 600, border: 'none', cursor: 'pointer', fontSize: '0.85rem' }}
                  >
                    Save Template
                  </button>
                </div>
              </form>
            ) : (
              <form onSubmit={handleCreateRecord} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#063669', marginBottom: '0.35rem' }}>
                    Record Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder={activeTab === 'products' ? 'e.g. AI Workflow Suite' : activeTab === 'sources' ? 'e.g. Webinars & Events' : activeTab === 'industries' ? 'e.g. CleanTech & Renewable' : activeTab === 'stages' ? 'e.g. Contract Drafting' : 'e.g. Central Zone'}
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    style={{ width: '100%', height: '36px', padding: '0 0.75rem', borderRadius: '6px', border: '1px solid #E2E8F0', fontSize: '0.85rem', outline: 'none' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#063669', marginBottom: '0.35rem' }}>
                    {activeTab === 'products' ? 'SKU Code' : activeTab === 'territories' ? 'Hub City / State' : 'System Code'}
                  </label>
                  <input
                    type="text"
                    placeholder={activeTab === 'products' ? 'e.g. TGY-AWF-07' : activeTab === 'territories' ? 'e.g. Bhopal, Madhya Pradesh' : 'e.g. IND-CLEAN'}
                    value={formData.codeOrSku}
                    onChange={(e) => setFormData({ ...formData, codeOrSku: e.target.value })}
                    style={{ width: '100%', height: '36px', padding: '0 0.75rem', borderRadius: '6px', border: '1px solid #E2E8F0', fontSize: '0.85rem', outline: 'none' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#063669', marginBottom: '0.35rem' }}>
                    {activeTab === 'products' ? 'Category' : activeTab === 'sources' ? 'Channel Type' : activeTab === 'industries' ? 'Priority Tier' : activeTab === 'territories' ? 'Covered States' : 'Category'}
                  </label>
                  <input
                    type="text"
                    placeholder={activeTab === 'products' ? 'e.g. Automation' : activeTab === 'sources' ? 'e.g. Inbound Digital' : activeTab === 'industries' ? 'e.g. Tier 1 Priority' : activeTab === 'territories' ? 'e.g. MP, CG' : 'e.g. Standard'}
                    value={formData.categoryOrType}
                    onChange={(e) => setFormData({ ...formData, categoryOrType: e.target.value })}
                    style={{ width: '100%', height: '36px', padding: '0 0.75rem', borderRadius: '6px', border: '1px solid #E2E8F0', fontSize: '0.85rem', outline: 'none' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#063669', marginBottom: '0.35rem' }}>
                    {activeTab === 'products' ? 'Price / Billing' : activeTab === 'sources' ? 'Benchmark CPL' : activeTab === 'industries' ? 'Target Margin %' : activeTab === 'stages' ? 'Win Probability %' : 'Regional Lead'}
                  </label>
                  <input
                    type="text"
                    placeholder={activeTab === 'products' ? 'e.g. ₹18,00,000 / yr' : activeTab === 'sources' ? 'e.g. ₹1,800' : activeTab === 'industries' ? 'e.g. 40%' : activeTab === 'stages' ? 'e.g. 80%' : 'e.g. Vikram Malhotra'}
                    value={formData.extraInfo}
                    onChange={(e) => setFormData({ ...formData, extraInfo: e.target.value })}
                    style={{ width: '100%', height: '36px', padding: '0 0.75rem', borderRadius: '6px', border: '1px solid #E2E8F0', fontSize: '0.85rem', outline: 'none' }}
                  />
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', marginTop: '0.5rem' }}>
                  <button
                    type="button"
                    onClick={() => setIsAddModalOpen(false)}
                    className="btn-secondary"
                    style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn-primary"
                    style={{ background: '#063669', color: 'white', padding: '0.5rem 1.25rem', borderRadius: '6px', fontWeight: 600, border: 'none', cursor: 'pointer', fontSize: '0.85rem' }}
                  >
                    Save Record
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Edit Email Template Modal */}
      {editingTemplate && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(6, 54, 105, 0.45)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '1.25rem'
          }}
          onClick={() => setEditingTemplate(null)}
        >
          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '14px',
              maxWidth: '680px',
              width: '92%',
              maxHeight: '92vh',
              overflowY: 'auto',
              padding: '1.75rem 2rem',
              boxShadow: '0 25px 50px -12px rgba(6, 54, 105, 0.25)'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.35rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#063669', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <LuPencil size={16} />
                </div>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#063669', margin: 0 }}>
                  Edit Email Template ({editingTemplate.id})
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setEditingTemplate(null)}
                style={{ background: 'none', border: 'none', outline: 'none', color: '#64748B', cursor: 'pointer', padding: '0.25rem' }}
              >
                <LuX size={20} />
              </button>
            </div>

            <form onSubmit={handleSaveEditTemplate} style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 600, color: '#063669', marginBottom: '0.4rem' }}>
                    Template Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={templateFormData.name}
                    onChange={(e) => setTemplateFormData({ ...templateFormData, name: e.target.value })}
                    style={{ width: '100%', height: '38px', padding: '0 0.85rem', borderRadius: '7px', border: '1px solid #CBD5E1', fontSize: '0.875rem', outline: 'none' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 600, color: '#063669', marginBottom: '0.4rem' }}>
                    Category
                  </label>
                  <select
                    value={templateFormData.category}
                    onChange={(e) => setTemplateFormData({ ...templateFormData, category: e.target.value })}
                    style={{ width: '100%', height: '38px', padding: '0 0.85rem', borderRadius: '7px', border: '1px solid #CBD5E1', fontSize: '0.875rem', outline: 'none', backgroundColor: '#FFFFFF' }}
                  >
                    <option value="Sales Outreach">Sales Outreach</option>
                    <option value="Follow-up">Follow-up</option>
                    <option value="Demo & Pitch">Demo & Pitch</option>
                    <option value="Commercials">Commercials</option>
                    <option value="Lead Nurture">Lead Nurture</option>
                  </select>
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 600, color: '#063669', marginBottom: '0.4rem' }}>
                  Subject Line *
                </label>
                <input
                  type="text"
                  required
                  value={templateFormData.subject}
                  onChange={(e) => setTemplateFormData({ ...templateFormData, subject: e.target.value })}
                  style={{ width: '100%', height: '38px', padding: '0 0.85rem', borderRadius: '7px', border: '1px solid #CBD5E1', fontSize: '0.875rem', outline: 'none' }}
                />
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                  <label style={{ fontSize: '0.825rem', fontWeight: 600, color: '#063669' }}>
                    Email Body Content *
                  </label>
                  <div style={{ display: 'flex', gap: '0.4rem' }}>
                    <button
                      type="button"
                      onClick={() => setTemplateFormData(prev => ({ ...prev, body: prev.body + ' {leadName}' }))}
                      style={{ fontSize: '0.75rem', padding: '0.2rem 0.55rem', borderRadius: '5px', border: '1px solid #CBD5E1', background: '#F8FAFC', cursor: 'pointer', color: '#063669', fontWeight: 600 }}
                    >
                      + {'{leadName}'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setTemplateFormData(prev => ({ ...prev, body: prev.body + ' {company}' }))}
                      style={{ fontSize: '0.75rem', padding: '0.2rem 0.55rem', borderRadius: '5px', border: '1px solid #CBD5E1', background: '#F8FAFC', cursor: 'pointer', color: '#063669', fontWeight: 600 }}
                    >
                      + {'{company}'}
                    </button>
                  </div>
                </div>
                <textarea
                  required
                  rows={9}
                  value={templateFormData.body}
                  onChange={(e) => setTemplateFormData({ ...templateFormData, body: e.target.value })}
                  style={{
                    width: '100%',
                    minHeight: '200px',
                    padding: '0.85rem',
                    borderRadius: '8px',
                    border: '1px solid #CBD5E1',
                    fontSize: '0.875rem',
                    lineHeight: '1.55',
                    outline: 'none',
                    resize: 'vertical',
                    fontFamily: 'inherit',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <label style={{ fontSize: '0.825rem', fontWeight: 600, color: '#063669' }}>Status:</label>
                  <select
                    value={templateFormData.status}
                    onChange={(e) => setTemplateFormData({ ...templateFormData, status: e.target.value })}
                    style={{ height: '34px', padding: '0 0.65rem', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '0.825rem', backgroundColor: '#FFFFFF' }}
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>

                <div style={{ display: 'flex', gap: '0.65rem' }}>
                  <button
                    type="button"
                    onClick={() => setEditingTemplate(null)}
                    className="btn-secondary"
                    style={{ padding: '0.55rem 1.15rem', fontSize: '0.85rem' }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn-primary"
                    style={{ background: '#063669', color: 'white', padding: '0.55rem 1.35rem', borderRadius: '7px', fontWeight: 600, border: 'none', cursor: 'pointer', fontSize: '0.85rem' }}
                  >
                    Update Template
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
