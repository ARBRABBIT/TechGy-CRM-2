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
  LuLayers,
  LuPhoneCall,
  LuCircleCheck,
  LuClipboardCheck
} from 'react-icons/lu';
import { INITIAL_EMAIL_TEMPLATES } from '../data/mockData';
import { STORAGE_KEYS } from '../constants/storageKeys';

export const INITIAL_MASTER_DATA = {
  // 1. Content Types
  contentTypes: [
    { id: 'CNT-001', name: 'Email Outreach & Pitch' },
    { id: 'CNT-002', name: 'WhatsApp Business Template' },
    { id: 'CNT-003', name: 'Product Brochure & Spec Sheet' },
    { id: 'CNT-004', name: 'Commercial Proposal & Service Contract' },
    { id: 'CNT-005', name: 'Inbound Web Inquiry & Form' },
    { id: 'CNT-006', name: 'SMS Alert & Verification OTP' },
    { id: 'CNT-007', name: 'Interactive Product Demo Deck' }
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
    { id: 'PRD-007', name: 'Dedicated Support & AMC' }
  ],

  // Sources (Cleaned: Channel Type, Attribution Weight, Cost per Lead Removed)
  sources: [
    { id: 'SRC-001', name: 'Website' },
    { id: 'SRC-002', name: 'Inbound Call' },
    { id: 'SRC-003', name: 'Referral' },
    { id: 'SRC-004', name: 'LinkedIn' },
    { id: 'SRC-005', name: 'Campaign' },
    { id: 'SRC-006', name: 'Partner' }
  ]
};

export const MASTER_CATEGORIES = [
  {
    id: 'contentTypes',
    title: 'Content Types',
    desc: 'Configure message formats, collateral types, marketing assets, and outbound delivery channels.',
    icon: LuLayers,
    iconBg: '#EFF6FF',
    iconColor: '#2563EB'
  },
  {
    id: 'followupTypes',
    title: 'Lead Follow-up Types',
    desc: 'Standardize communication methods, recommended timeframes, and priority levels for lead follow-up activities.',
    icon: LuPhoneCall,
    iconBg: '#F5F3FF',
    iconColor: '#7C3AED'
  },
  {
    id: 'followupStatuses',
    title: 'Lead Follow-up Status',
    desc: 'Manage follow-up activity lifecycles, escalation triggers, and resolution states.',
    icon: LuCircleCheck,
    iconBg: '#ECFDF5',
    iconColor: '#059669'
  },
  {
    id: 'leadStatuses',
    title: 'Lead Status',
    desc: 'Standardize sales funnel stages and pipeline progression criteria.',
    icon: LuGitCommitVertical,
    iconBg: '#F0F4F9',
    iconColor: '#063669'
  },
  {
    id: 'objections',
    title: 'Sales Objections',
    desc: 'Maintain a central directory of common buyer concerns, pricing hesitations, and objection scenarios.',
    icon: LuShieldAlert,
    iconBg: '#FEF2F2',
    iconColor: '#DC2626'
  },
  {
    id: 'agentChecklist',
    title: 'Agent Checklist',
    desc: 'Configure talking points and call guidance for each lead status to steer buyer interactions.',
    icon: LuClipboardCheck,
    iconBg: '#FEF3C7',
    iconColor: '#D97706'
  },
  {
    id: 'emailTemplates',
    title: 'Email Templates',
    desc: 'Centralize standardized sales outreach copy, proposal emails, follow-up messages, and dynamic merge tags.',
    icon: LuMail,
    iconBg: '#FFF1F2',
    iconColor: '#BE123C'
  },
  {
    id: 'industries',
    title: 'Industry Sectors',
    desc: 'Standardize client industry classifications, domain focus areas, and sector codes.',
    icon: LuFactory,
    iconBg: '#F0FDF4',
    iconColor: '#15803D'
  },
  {
    id: 'products',
    title: 'Products & Services',
    desc: 'Define and manage the catalog of software suites, enterprise solutions, and client services.',
    icon: LuPackage,
    iconBg: '#F1F5F9',
    iconColor: '#334155'
  },
  {
    id: 'sources',
    title: 'Lead Sources',
    desc: 'Configure lead acquisition channels and source attribution names.',
    icon: LuShare2,
    iconBg: '#E0F2FE',
    iconColor: '#0284C7'
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
  const [checklistStatusFilter, setChecklistStatusFilter] = useState('All');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [hubAddCategory, setHubAddCategory] = useState('contentTypes');
  const [editingTemplate, setEditingTemplate] = useState(null);
  const [editingRecord, setEditingRecord] = useState(null);
  const [editRecordFormData, setEditRecordFormData] = useState({});

  const initialSectionFormData = {
    contentTypes: {
      name: ''
    },
    followupTypes: {
      name: ''
    },
    followupStatuses: {
      description: ''
    },
    leadStatuses: {
      name: ''
    },
    objections: {
      name: ''
    },
    agentChecklist: {
      leadStatus: 'New',
      pointsToTalk: '',
      name: '',
      description: ''
    },
    industries: {
      name: '',
      code: ''
    },
    products: {
      name: ''
    },
    sources: {
      name: ''
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

  // Form state for adding/editing email templates (Category removed)
  const [templateFormData, setTemplateFormData] = useState({
    name: '',
    subject: '',
    body: ''
  });

  const MASTER_STORAGE_KEY = STORAGE_KEYS?.MASTER_DATA || 'techgy_master_data_v13';

  // Master Data state loaded from localStorage with full schema merging (v13 = agentChecklist with leadStatus and pointsToTalk)
  const [masterData, setMasterData] = useState(() => {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem(MASTER_STORAGE_KEY);
        if (stored) {
          const parsed = JSON.parse(stored);
          return {
            ...INITIAL_MASTER_DATA,
            ...parsed,
            contentTypes: parsed.contentTypes || INITIAL_MASTER_DATA.contentTypes,
            followupTypes: parsed.followupTypes || INITIAL_MASTER_DATA.followupTypes,
            followupStatuses: parsed.followupStatuses || INITIAL_MASTER_DATA.followupStatuses,
            leadStatuses: parsed.leadStatuses || INITIAL_MASTER_DATA.leadStatuses,
            agentChecklist: (parsed.agentChecklist || INITIAL_MASTER_DATA.agentChecklist).map(item => ({
              ...item,
              leadStatus: item.leadStatus || 'New',
              pointsToTalk: item.pointsToTalk || item.name || item.description || ''
            })),
            objections: parsed.objections || INITIAL_MASTER_DATA.objections,
            industries: parsed.industries || INITIAL_MASTER_DATA.industries,
            emailTemplates: parsed.emailTemplates || INITIAL_MASTER_DATA.emailTemplates,
            products: parsed.products || INITIAL_MASTER_DATA.products,
            sources: parsed.sources || INITIAL_MASTER_DATA.sources
          };
        }
      } catch {}
    }
    return INITIAL_MASTER_DATA;
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(MASTER_STORAGE_KEY, JSON.stringify(masterData));
      } catch {}
    }
  }, [masterData, MASTER_STORAGE_KEY]);

  // Local fallback templates state if onUpdateEmailTemplates is not provided
  const [localTemplates, setLocalTemplates] = useState(() => {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem('techgy_email_templates');
        if (stored) {
          const parsed = JSON.parse(stored);
          return parsed.map(t => ({
            id: t.id,
            name: t.name,
            subject: t.subject,
            body: t.body
          }));
        }
      } catch {}
    }
    return INITIAL_MASTER_DATA.emailTemplates;
  });

  const activeEmailTemplates = emailTemplates && emailTemplates.length > 0 ? emailTemplates : localTemplates;

  const updateTemplates = (newTemplates) => {
    if (onUpdateEmailTemplates) {
      onUpdateEmailTemplates(newTemplates);
    }
    setLocalTemplates(newTemplates);
    setMasterData(prev => ({
      ...prev,
      emailTemplates: newTemplates
    }));
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
    if (selectedCategory === 'agentChecklist') {
      if (checklistStatusFilter !== 'All' && item.leadStatus !== checklistStatusFilter) {
        return false;
      }
    }

    if (!effectiveSearch) return true;

    if (selectedCategory === 'emailTemplates') {
      return (
        (item.id && item.id.toLowerCase().includes(effectiveSearch)) ||
        (item.name && item.name.toLowerCase().includes(effectiveSearch)) ||
        (item.subject && item.subject.toLowerCase().includes(effectiveSearch)) ||
        (item.body && item.body.toLowerCase().includes(effectiveSearch))
      );
    }

    return (
      (item.id && item.id.toLowerCase().includes(effectiveSearch)) ||
      (item.name && item.name.toLowerCase().includes(effectiveSearch)) ||
      (item.leadStatus && item.leadStatus.toLowerCase().includes(effectiveSearch)) ||
      (item.pointsToTalk && item.pointsToTalk.toLowerCase().includes(effectiveSearch)) ||
      (item.category && item.category.toLowerCase().includes(effectiveSearch)) ||
      (item.format && item.format.toLowerCase().includes(effectiveSearch)) ||
      (item.channel && item.channel.toLowerCase().includes(effectiveSearch)) ||
      (item.description && item.description.toLowerCase().includes(effectiveSearch)) ||
      (item.timeframe && item.timeframe.toLowerCase().includes(effectiveSearch)) ||
      (item.priority && item.priority.toLowerCase().includes(effectiveSearch)) ||
      (item.phase && item.phase.toLowerCase().includes(effectiveSearch)) ||
      (item.guidelines && item.guidelines.toLowerCase().includes(effectiveSearch)) ||
      (item.rebuttal && item.rebuttal.toLowerCase().includes(effectiveSearch)) ||
      (item.severity && item.severity.toLowerCase().includes(effectiveSearch)) ||
      (item.code && item.code.toLowerCase().includes(effectiveSearch)) ||
      (item.sku && item.sku.toLowerCase().includes(effectiveSearch))
    );
  });

  const handleOpenEditRecord = (item) => {
    setEditingRecord(item);
    setEditRecordFormData({
      ...item,
      leadStatus: item.leadStatus || (masterData.leadStatuses[0]?.name || 'New'),
      pointsToTalk: item.pointsToTalk || item.name || item.description || ''
    });
  };

  const handleSaveEditRecord = (e) => {
    e.preventDefault();
    const primaryField = editRecordFormData.pointsToTalk || editRecordFormData.name || editRecordFormData.description || editRecordFormData.code;
    if (!editingRecord || !primaryField?.trim()) return;

    setMasterData(prev => ({
      ...prev,
      [selectedCategory]: (prev[selectedCategory] || []).map(item =>
        item.id === editingRecord.id ? {
          ...item,
          ...editRecordFormData,
          pointsToTalk: editRecordFormData.pointsToTalk || editRecordFormData.name || editRecordFormData.description,
          name: editRecordFormData.pointsToTalk || editRecordFormData.name || editRecordFormData.description,
          description: editRecordFormData.pointsToTalk || editRecordFormData.description || editRecordFormData.name,
          leadStatus: editRecordFormData.leadStatus || item.leadStatus || 'New'
        } : item
      )
    }));

    if (onTriggerToast) {
      onTriggerToast({
        title: 'Record Updated',
        description: `Successfully updated "${primaryField.slice(0, 40)}${primaryField.length > 40 ? '...' : ''}".`,
        type: 'success'
      });
    }

    setEditingRecord(null);
  };

  const handleOpenEditTemplate = (tpl) => {
    setEditingTemplate(tpl);
    setTemplateFormData({
      name: tpl.name || '',
      subject: tpl.subject || '',
      body: tpl.body || ''
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
        title: 'Email Template Updated',
        description: `Successfully updated "${templateFormData.name.trim()}".`,
        type: 'success'
      });
    }
  };

  const handleCreateRecord = (e) => {
    e.preventDefault();
    const targetCategory = selectedCategory || hubAddCategory || 'contentTypes';
    const targetMeta = MASTER_CATEGORIES.find(c => c.id === targetCategory);

    if (targetCategory === 'emailTemplates') {
      if (!templateFormData.name.trim() || !templateFormData.subject.trim()) return;

      const newTpl = {
        id: `TPL-${String(activeEmailTemplates.length + 1).padStart(3, '0')}`,
        name: templateFormData.name.trim(),
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

      setTemplateFormData({ name: '', subject: '', body: '' });
      setIsAddModalOpen(false);
      return;
    }

    const currentForm = sectionFormData[targetCategory] || {};
    const primaryVal = currentForm.pointsToTalk || currentForm.name || currentForm.description;
    if (!primaryVal || !primaryVal.trim()) return;

    let newRecord = { ...currentForm };
    if (newRecord.name) newRecord.name = newRecord.name.trim();
    if (newRecord.description) newRecord.description = newRecord.description.trim();
    if (newRecord.pointsToTalk) newRecord.pointsToTalk = newRecord.pointsToTalk.trim();
    if (targetCategory === 'followupStatuses') {
      newRecord.name = newRecord.description;
    }
    const nextNum = (masterData[targetCategory]?.length || 0) + 1;

    if (targetCategory === 'contentTypes') {
      newRecord.id = `CNT-${String(nextNum).padStart(3, '0')}`;
    } else if (targetCategory === 'followupTypes') {
      newRecord.id = `FUT-${String(nextNum).padStart(3, '0')}`;
    } else if (targetCategory === 'followupStatuses') {
      newRecord.id = `FUS-${String(nextNum).padStart(3, '0')}`;
    } else if (targetCategory === 'leadStatuses') {
      newRecord.id = `LST-${String(nextNum).padStart(3, '0')}`;
    } else if (targetCategory === 'objections') {
      newRecord.id = `OBJ-${String(nextNum).padStart(3, '0')}`;
    } else if (targetCategory === 'agentChecklist') {
      newRecord.id = `CHK-${String(nextNum).padStart(3, '0')}`;
      newRecord.leadStatus = newRecord.leadStatus || (checklistStatusFilter !== 'All' ? checklistStatusFilter : (masterData.leadStatuses[0]?.name || 'New'));
      newRecord.pointsToTalk = newRecord.pointsToTalk || newRecord.name || newRecord.description || '';
      newRecord.name = newRecord.pointsToTalk;
      newRecord.description = newRecord.pointsToTalk;
    } else if (targetCategory === 'industries') {
      newRecord.id = `IND-${String(nextNum).padStart(3, '0')}`;
      if (!newRecord.code?.trim()) {
        newRecord.code = newRecord.name.replace(/[^a-zA-Z]/g, '').slice(0, 4).toUpperCase();
      }
    } else if (targetCategory === 'products') {
      newRecord.id = `PRD-${String(nextNum).padStart(3, '0')}`;
    } else if (targetCategory === 'sources') {
      newRecord.id = `SRC-${String(nextNum).padStart(3, '0')}`;
    }

    setMasterData(prev => ({
      ...prev,
      [targetCategory]: [...(prev[targetCategory] || []), newRecord]
    }));

    if (onTriggerToast) {
      onTriggerToast({
        title: 'Record Added',
        description: `Successfully added "${primaryVal.slice(0, 40)}${primaryVal.length > 40 ? '...' : ''}" to ${targetMeta?.title || targetCategory}`,
        type: 'success'
      });
    }

    resetSectionForm(targetCategory);
    setIsAddModalOpen(false);
  };

  const selectedCategoryMeta = MASTER_CATEGORIES.find(c => c.id === selectedCategory);

  // ---------------------------------------------------------------------------
  // 1. OVERVIEW SCREEN: 3-COLUMN CARD GRID
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
  // 2. CATEGORY DETAIL PAGE (Table, Search, Add & Edit Record)
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
                  setTemplateFormData({ name: '', subject: '', body: '' });
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

        {/* Search Bar & Filter Toolbar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '1.25rem', padding: '0.75rem 1rem', background: '#F8FAFC', borderRadius: '10px', border: '1px solid #E2E8F0' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap', flex: 1 }}>
            <div style={{ position: 'relative', width: '300px', maxWidth: '100%' }}>
              <LuSearch size={15} style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }} />
              <input
                type="text"
                placeholder={`Search in ${selectedCategoryMeta?.title}...`}
                value={localSearch}
                onChange={(e) => setLocalSearch(e.target.value)}
                style={{
                  width: '100%',
                  height: '38px',
                  boxSizing: 'border-box',
                  padding: '0 0.85rem 0 2.35rem',
                  fontSize: '0.825rem',
                  border: '1px solid #CBD5E1',
                  borderRadius: '7px',
                  background: '#FFFFFF',
                  color: '#063669',
                  outline: 'none',
                  display: 'flex',
                  alignItems: 'center'
                }}
              />
            </div>

            {/* Agent Checklist: Lead Status drop-down */}
            {selectedCategory === 'agentChecklist' && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem' }}>
                <label htmlFor="agent-checklist-status-select" style={{ fontSize: '0.825rem', fontWeight: 700, color: '#063669', whiteSpace: 'nowrap' }}>
                  Lead status:
                </label>
                <select
                  id="agent-checklist-status-select"
                  value={checklistStatusFilter}
                  onChange={(e) => setChecklistStatusFilter(e.target.value)}
                  style={{
                    height: '38px',
                    boxSizing: 'border-box',
                    padding: '0 2.25rem 0 0.85rem',
                    fontSize: '0.825rem',
                    fontWeight: 600,
                    border: '1px solid #CBD5E1',
                    borderRadius: '7px',
                    background: '#FFFFFF',
                    color: '#063669',
                    cursor: 'pointer',
                    outline: 'none',
                    minWidth: '200px',
                    appearance: 'none',
                    WebkitAppearance: 'none',
                    MozAppearance: 'none',
                    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23063669' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'right 0.85rem center',
                    display: 'inline-flex',
                    alignItems: 'center'
                  }}
                >
                  <option value="All">All Lead Statuses ({masterData.agentChecklist?.length || 0})</option>
                  {masterData.leadStatuses.map(ls => {
                    const count = (masterData.agentChecklist || []).filter(item => item.leadStatus === ls.name).length;
                    return (
                      <option key={ls.id} value={ls.name}>
                        {ls.name} ({count})
                      </option>
                    );
                  })}
                </select>
              </div>
            )}
          </div>
        </div>

        {/* Selected Status Indicator Banner for Agent Checklist */}
        {selectedCategory === 'agentChecklist' && checklistStatusFilter !== 'All' && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0.65rem 1rem',
            background: '#F0F7FF',
            border: '1px solid #BAE6FD',
            borderRadius: '8px',
            marginBottom: '1rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ fontSize: '0.825rem', fontWeight: 700, color: '#063669' }}>
                Points to talk for status:
              </span>
              <span style={{
                fontSize: '0.75rem',
                fontWeight: 700,
                padding: '0.2rem 0.6rem',
                borderRadius: '9999px',
                background: '#063669',
                color: '#FFFFFF'
              }}>
                {checklistStatusFilter}
              </span>
            </div>
            <span style={{ fontSize: '0.785rem', color: '#557396', fontWeight: 600 }}>
              {filteredList.length} {filteredList.length === 1 ? 'talking point' : 'talking points'}
            </span>
          </div>
        )}

        {/* Data Table */}
        <div style={{ overflowX: 'auto' }}>
          <table className="crm-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#F8FAFC', borderBottom: '1px solid #E2E8F0', color: '#557396', fontSize: '0.785rem', textAlign: 'left' }}>
                {/* 1. Content Types */}
                {selectedCategory === 'contentTypes' && (
                  <>
                    <th style={{ padding: '0.75rem 1rem' }}>ID</th>
                    <th style={{ padding: '0.75rem 1rem' }}>Content Type Name</th>
                    <th style={{ padding: '0.75rem 1rem', textAlign: 'right' }}>Actions</th>
                  </>
                )}

                {/* 2. Lead Follow-up Types */}
                {selectedCategory === 'followupTypes' && (
                  <>
                    <th style={{ padding: '0.75rem 1rem' }}>ID</th>
                    <th style={{ padding: '0.75rem 1rem' }}>Follow-up Type</th>
                    <th style={{ padding: '0.75rem 1rem', textAlign: 'right' }}>Actions</th>
                  </>
                )}

                {/* 3. Lead Follow-up Status */}
                {selectedCategory === 'followupStatuses' && (
                  <>
                    <th style={{ padding: '0.75rem 1rem' }}>ID</th>
                    <th style={{ padding: '0.75rem 1rem' }}>Description</th>
                    <th style={{ padding: '0.75rem 1rem', textAlign: 'right' }}>Actions</th>
                  </>
                )}

                {/* 4. Lead Status (Cleaned of Win Probability & Description - First column strictly ID) */}
                {selectedCategory === 'leadStatuses' && (
                  <>
                    <th style={{ padding: '0.75rem 1rem' }}>ID</th>
                    <th style={{ padding: '0.75rem 1rem' }}>Lead Status Name</th>
                    <th style={{ padding: '0.75rem 1rem', textAlign: 'right' }}>Actions</th>
                  </>
                )}

                {/* 5. Sales Objections */}
                {selectedCategory === 'objections' && (
                  <>
                    <th style={{ padding: '0.75rem 1rem' }}>ID</th>
                    <th style={{ padding: '0.75rem 1rem' }}>Objection Concern</th>
                    <th style={{ padding: '0.75rem 1rem', textAlign: 'right' }}>Actions</th>
                  </>
                )}

                {/* 6. Agent Checklist */}
                {selectedCategory === 'agentChecklist' && (
                  <>
                    <th style={{ padding: '0.75rem 1rem' }}>ID</th>
                    <th style={{ padding: '0.75rem 1rem' }}>Lead Status</th>
                    <th style={{ padding: '0.75rem 1rem' }}>Points to Talk</th>
                    <th style={{ padding: '0.75rem 1rem', textAlign: 'right' }}>Actions</th>
                  </>
                )}

                {/* 7. Email Templates (Category Removed - First column strictly ID) */}
                {selectedCategory === 'emailTemplates' && (
                  <>
                    <th style={{ padding: '0.75rem 1rem' }}>ID</th>
                    <th style={{ padding: '0.75rem 1rem' }}>Template Name</th>
                    <th style={{ padding: '0.75rem 1rem' }}>Subject Line</th>
                    <th style={{ padding: '0.75rem 1rem', textAlign: 'right' }}>Actions</th>
                  </>
                )}

                {/* 8. Industry Sectors (Standard Margin & Domain Focus Area Removed - First column strictly ID) */}
                {selectedCategory === 'industries' && (
                  <>
                    <th style={{ padding: '0.75rem 1rem' }}>ID</th>
                    <th style={{ padding: '0.75rem 1rem' }}>Industry Sector</th>
                    <th style={{ padding: '0.75rem 1rem', textAlign: 'right' }}>Actions</th>
                  </>
                )}

                {/* Products (Only ID and Product / Service Name - First column strictly ID) */}
                {selectedCategory === 'products' && (
                  <>
                    <th style={{ padding: '0.75rem 1rem' }}>ID</th>
                    <th style={{ padding: '0.75rem 1rem' }}>Product / Service Name</th>
                    <th style={{ padding: '0.75rem 1rem', textAlign: 'right' }}>Actions</th>
                  </>
                )}

                {/* Sources (Channel Type, Attribution Weight, Cost per Lead Removed - First column strictly ID) */}
                {selectedCategory === 'sources' && (
                  <>
                    <th style={{ padding: '0.75rem 1rem' }}>ID</th>
                    <th style={{ padding: '0.75rem 1rem' }}>Channel Name</th>
                    <th style={{ padding: '0.75rem 1rem', textAlign: 'right' }}>Actions</th>
                  </>
                )}
              </tr>
            </thead>

            <tbody>
              {filteredList.map((item) => (
                <tr key={item.id} style={{ borderBottom: '1px solid #F1F5F9', fontSize: '0.825rem' }}>
                  {/* 1. Content Types */}
                  {selectedCategory === 'contentTypes' && (
                    <>
                      <td style={{ padding: '0.75rem 1rem', fontFamily: 'monospace', fontWeight: 600, color: '#557396' }}>{item.id}</td>
                      <td style={{ padding: '0.75rem 1rem', fontWeight: 700, color: '#063669' }}>{item.name}</td>
                    </>
                  )}

                  {/* 2. Lead Follow-up Types */}
                  {selectedCategory === 'followupTypes' && (
                    <>
                      <td style={{ padding: '0.75rem 1rem', fontFamily: 'monospace', fontWeight: 600, color: '#557396' }}>{item.id}</td>
                      <td style={{ padding: '0.75rem 1rem', fontWeight: 700, color: '#063669' }}>{item.name}</td>
                    </>
                  )}

                  {/* 3. Lead Follow-up Status */}
                  {selectedCategory === 'followupStatuses' && (
                    <>
                      <td style={{ padding: '0.75rem 1rem', fontFamily: 'monospace', fontWeight: 600, color: '#557396' }}>{item.id}</td>
                      <td style={{ padding: '0.75rem 1rem', color: '#1E293B', fontWeight: 500 }}>{item.description || item.name}</td>
                    </>
                  )}

                  {/* 4. Lead Status (Cleaned of Win Probability & Description - First column strictly ID) */}
                  {selectedCategory === 'leadStatuses' && (
                    <>
                      <td style={{ padding: '0.75rem 1rem', fontFamily: 'monospace', fontWeight: 600, color: '#557396' }}>{item.id}</td>
                      <td style={{ padding: '0.75rem 1rem', fontWeight: 700, color: '#063669' }}>{item.name}</td>
                    </>
                  )}

                  {/* 5. Sales Objections */}
                  {selectedCategory === 'objections' && (
                    <>
                      <td style={{ padding: '0.75rem 1rem', fontFamily: 'monospace', fontWeight: 600, color: '#557396' }}>{item.id}</td>
                      <td style={{ padding: '0.75rem 1rem', fontWeight: 700, color: '#063669' }}>{item.name}</td>
                    </>
                  )}

                  {/* 6. Agent Checklist */}
                  {selectedCategory === 'agentChecklist' && (
                    <>
                      <td style={{ padding: '0.75rem 1rem', fontFamily: 'monospace', fontWeight: 600, color: '#557396' }}>{item.id}</td>
                      <td style={{ padding: '0.75rem 1rem' }}>
                        <span style={{
                          display: 'inline-block',
                          fontSize: '0.75rem',
                          fontWeight: 700,
                          padding: '0.2rem 0.55rem',
                          borderRadius: '6px',
                          background: '#EBF3FA',
                          color: '#063669',
                          border: '1px solid #D5E2EE'
                        }}>
                          {item.leadStatus || 'New'}
                        </span>
                      </td>
                      <td style={{ padding: '0.75rem 1rem', color: '#1E293B', fontWeight: 500, lineHeight: 1.5 }}>{item.pointsToTalk || item.name || item.description}</td>
                    </>
                  )}

                  {/* 7. Email Templates (Category Removed - First column strictly ID) */}
                  {selectedCategory === 'emailTemplates' && (
                    <>
                      <td style={{ padding: '0.75rem 1rem', fontFamily: 'monospace', fontWeight: 600, color: '#557396' }}>{item.id}</td>
                      <td style={{ padding: '0.75rem 1rem', fontWeight: 700, color: '#063669' }}>{item.name}</td>
                      <td style={{ padding: '0.75rem 1rem', color: '#557396', maxWidth: '380px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.subject}</td>
                    </>
                  )}

                  {/* 8. Industry Sectors (Standard Margin & Domain Focus Area Removed - First column strictly ID) */}
                  {selectedCategory === 'industries' && (
                    <>
                      <td style={{ padding: '0.75rem 1rem', fontFamily: 'monospace', fontWeight: 600, color: '#557396' }}>{item.id}</td>
                      <td style={{ padding: '0.75rem 1rem', fontWeight: 700, color: '#063669' }}>{item.name}</td>
                    </>
                  )}

                  {/* Products (Only ID and Product / Service Name - First column strictly ID) */}
                  {selectedCategory === 'products' && (
                    <>
                      <td style={{ padding: '0.75rem 1rem', fontFamily: 'monospace', fontWeight: 600, color: '#557396' }}>{item.id}</td>
                      <td style={{ padding: '0.75rem 1rem', fontWeight: 700, color: '#063669' }}>{item.name}</td>
                    </>
                  )}

                  {/* Sources (Only ID and Channel Name - First column strictly ID) */}
                  {selectedCategory === 'sources' && (
                    <>
                      <td style={{ padding: '0.75rem 1rem', fontFamily: 'monospace', fontWeight: 600, color: '#557396' }}>{item.id}</td>
                      <td style={{ padding: '0.75rem 1rem', fontWeight: 700, color: '#063669' }}>{item.name}</td>
                    </>
                  )}

                  {/* Actions Column (Edit ONLY - NO Delete option) */}
                  <td style={{ padding: '0.75rem 1rem', textAlign: 'right' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '0.4rem' }}>
                      {selectedCategory === 'emailTemplates' ? (
                        <button
                          type="button"
                          onClick={() => handleOpenEditTemplate(item)}
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
                          title="Edit Template"
                        >
                          <LuPencil size={13} /> Edit
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
                  <td colSpan={7} style={{ textAlign: 'center', padding: '2.5rem', color: '#94A3B8', fontSize: '0.875rem' }}>
                    {selectedCategory === 'agentChecklist' && checklistStatusFilter !== 'All'
                      ? `No points to talk found for status "${checklistStatusFilter}". Click "+ Add Record" to add points for this status.`
                      : `No records found matching "${effectiveSearch}". Click "+ Add Record" to create one.`}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ---------------------------------------------------------------------- */}
      {/* 3. ADD RECORD MODAL                                                    */}
      {/* ---------------------------------------------------------------------- */}
      {isAddModalOpen && selectedCategory !== 'emailTemplates' && (() => {
        const activeCat = selectedCategory || hubAddCategory || 'contentTypes';
        const meta = MASTER_CATEGORIES.find(c => c.id === activeCat);
        const CatIcon = meta?.icon || LuPackage;

        return (
          <div className="modal-overlay" onClick={() => setIsAddModalOpen(false)}>
            <div className="modal-card" style={{ maxWidth: '540px' }} onClick={e => e.stopPropagation()}>
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

                  {/* 1. Content Types */}
                  {activeCat === 'contentTypes' && (
                    <div className="form-group">
                      <label className="form-label">Content Type Name *</label>
                      <input
                        type="text"
                        required
                        className="form-input"
                        placeholder="e.g. Email Outreach & Pitch, Product Brochure"
                        value={sectionFormData.contentTypes.name}
                        onChange={(e) => updateSectionField('contentTypes', 'name', e.target.value)}
                      />
                    </div>
                  )}

                  {/* 2. Lead Follow-up Types */}
                  {activeCat === 'followupTypes' && (
                    <div className="form-group">
                      <label className="form-label">Follow-up Type Name *</label>
                      <input
                        type="text"
                        required
                        className="form-input"
                        placeholder="e.g. Discovery Follow-up, Architecture Demo Walkthrough"
                        value={sectionFormData.followupTypes.name}
                        onChange={(e) => updateSectionField('followupTypes', 'name', e.target.value)}
                      />
                    </div>
                  )}

                  {/* 3. Lead Follow-up Status */}
                  {activeCat === 'followupStatuses' && (
                    <div className="form-group">
                      <label className="form-label">Description *</label>
                      <textarea
                        rows={3}
                        required
                        className="form-textarea"
                        placeholder="Define the state and meaning of this status..."
                        value={sectionFormData.followupStatuses.description}
                        onChange={(e) => updateSectionField('followupStatuses', 'description', e.target.value)}
                      />
                    </div>
                  )}

                  {/* 4. Lead Status (Cleaned of Win Probability & Description) */}
                  {activeCat === 'leadStatuses' && (
                    <div className="form-group">
                      <label className="form-label">Lead Status Name *</label>
                      <input
                        type="text"
                        required
                        className="form-input"
                        placeholder="e.g. Qualified, Proposal, Negotiation"
                        value={sectionFormData.leadStatuses.name}
                        onChange={(e) => updateSectionField('leadStatuses', 'name', e.target.value)}
                      />
                    </div>
                  )}

                  {/* 5. Sales Objections */}
                  {activeCat === 'objections' && (
                    <div className="form-group">
                      <label className="form-label">Objection Concern *</label>
                      <input
                        type="text"
                        required
                        className="form-input"
                        placeholder="e.g. Budgetary Constraints & Pricing"
                        value={sectionFormData.objections.name}
                        onChange={(e) => updateSectionField('objections', 'name', e.target.value)}
                      />
                    </div>
                  )}

                  {/* 6. Agent Checklist */}
                  {activeCat === 'agentChecklist' && (
                    <>
                      <div className="form-group">
                        <label className="form-label">Lead Status *</label>
                        <select
                          required
                          className="form-select"
                          value={sectionFormData.agentChecklist.leadStatus || (checklistStatusFilter !== 'All' ? checklistStatusFilter : (masterData.leadStatuses[0]?.name || 'New'))}
                          onChange={(e) => updateSectionField('agentChecklist', 'leadStatus', e.target.value)}
                        >
                          {masterData.leadStatuses.map(ls => (
                            <option key={ls.id} value={ls.name}>{ls.name}</option>
                          ))}
                        </select>
                      </div>
                      <div className="form-group">
                        <label className="form-label">Points to Talk *</label>
                        <textarea
                          rows={4}
                          required
                          className="form-textarea"
                          placeholder="Enter talking points, guidance, or qualification requirements for this lead status..."
                          value={sectionFormData.agentChecklist.pointsToTalk || sectionFormData.agentChecklist.name || ''}
                          onChange={(e) => {
                            updateSectionField('agentChecklist', 'pointsToTalk', e.target.value);
                            updateSectionField('agentChecklist', 'name', e.target.value);
                          }}
                        />
                      </div>
                    </>
                  )}

                  {/* 7. Industry Sectors (Standard Margin & Domain Focus Area Removed) */}
                  {activeCat === 'industries' && (
                    <>
                      <div className="form-group">
                        <label className="form-label">Industry Sector Name *</label>
                        <input
                          type="text"
                          required
                          className="form-input"
                          placeholder="e.g. Enterprise Software, FinTech & Banking"
                          value={sectionFormData.industries.name}
                          onChange={(e) => updateSectionField('industries', 'name', e.target.value)}
                        />
                      </div>
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
                    </>
                  )}

                  {/* Products (Only Product / Service Name) */}
                  {activeCat === 'products' && (
                    <div className="form-group">
                      <label className="form-label">Product / Service Name *</label>
                      <input
                        type="text"
                        required
                        className="form-input"
                        placeholder="e.g. TechGy CRM Enterprise Suite"
                        value={sectionFormData.products.name}
                        onChange={(e) => updateSectionField('products', 'name', e.target.value)}
                      />
                    </div>
                  )}

                  {/* Sources (Channel Type, Attribution Weight, Cost per Lead Removed) */}
                  {activeCat === 'sources' && (
                    <>
                      <div className="form-group">
                        <label className="form-label">Channel / Source Name *</label>
                        <input
                          type="text"
                          required
                          className="form-input"
                          placeholder="e.g. Website, Inbound Call, Referral, LinkedIn"
                          value={sectionFormData.sources.name}
                          onChange={(e) => updateSectionField('sources', 'name', e.target.value)}
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

      {/* ---------------------------------------------------------------------- */}
      {/* 4. CREATE EMAIL TEMPLATE MODAL (Category Removed)                      */}
      {/* ---------------------------------------------------------------------- */}
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
                  <label className="form-label">Subject Line *</label>
                  <input
                    type="text"
                    required
                    className="form-input"
                    value={templateFormData.subject}
                    onChange={(e) => setTemplateFormData({ ...templateFormData, subject: e.target.value })}
                    placeholder="e.g. Scaling TechGy CRM Operations for {company}"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Email Body</label>
                  <textarea
                    rows={6}
                    className="form-textarea"
                    value={templateFormData.body}
                    onChange={(e) => setTemplateFormData({ ...templateFormData, body: e.target.value })}
                    placeholder="Hi {leadName},&#10;&#10;Following up regarding our solution..."
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

      {/* ---------------------------------------------------------------------- */}
      {/* 5. EDIT EMAIL TEMPLATE MODAL (Category Removed)                        */}
      {/* ---------------------------------------------------------------------- */}
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

      {/* ---------------------------------------------------------------------- */}
      {/* 6. EDIT STANDARD MASTER RECORD MODAL                                   */}
      {/* ---------------------------------------------------------------------- */}
      {editingRecord && (
        <div className="modal-overlay" onClick={() => setEditingRecord(null)}>
          <div className="modal-card" style={{ maxWidth: '520px' }} onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">Edit {selectedCategoryMeta?.title.slice(0, -1) || 'Record'}</h3>
              <button className="modal-close-btn" onClick={() => setEditingRecord(null)}><LuX size={18} /></button>
            </div>
            <form onSubmit={handleSaveEditRecord}>
              <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {selectedCategory === 'agentChecklist' && (
                  <div className="form-group">
                    <label className="form-label">Lead Status *</label>
                    <select
                      required
                      className="form-select"
                      value={editRecordFormData.leadStatus || (masterData.leadStatuses[0]?.name || 'New')}
                      onChange={(e) => setEditRecordFormData({ ...editRecordFormData, leadStatus: e.target.value })}
                    >
                      {masterData.leadStatuses.map(ls => (
                        <option key={ls.id} value={ls.name}>{ls.name}</option>
                      ))}
                    </select>
                  </div>
                )}

                <div className="form-group">
                  <label className="form-label">
                    {selectedCategory === 'objections' ? 'Objection Concern *' :
                     selectedCategory === 'products' ? 'Product / Service Name *' :
                     selectedCategory === 'sources' ? 'Lead Source Name *' :
                     selectedCategory === 'agentChecklist' ? 'Points to Talk *' :
                     selectedCategory === 'contentTypes' ? 'Content Type Name *' :
                     selectedCategory === 'followupTypes' ? 'Follow-up Type Name *' :
                     selectedCategory === 'followupStatuses' ? 'Description *' :
                     'Name / Title *'}
                  </label>
                  {selectedCategory === 'agentChecklist' ? (
                    <textarea
                      rows={4}
                      required
                      className="form-textarea"
                      placeholder="Enter talking points, guidance, or qualification requirements for this lead status..."
                      value={editRecordFormData.pointsToTalk || editRecordFormData.name || editRecordFormData.description || ''}
                      onChange={(e) => setEditRecordFormData({
                        ...editRecordFormData,
                        pointsToTalk: e.target.value,
                        name: e.target.value,
                        description: e.target.value
                      })}
                    />
                  ) : selectedCategory === 'followupStatuses' ? (
                    <textarea
                      rows={3}
                      required
                      className="form-textarea"
                      value={editRecordFormData.description || editRecordFormData.name || ''}
                      onChange={(e) => setEditRecordFormData({
                        ...editRecordFormData,
                        description: e.target.value,
                        name: e.target.value
                      })}
                    />
                  ) : (
                    <input
                      type="text"
                      required
                      className="form-input"
                      value={editRecordFormData.name || ''}
                      onChange={(e) => setEditRecordFormData({ ...editRecordFormData, name: e.target.value })}
                    />
                  )}
                </div>

                {/* 7. Industry Sectors (Standard Margin & Domain Focus Area Removed) */}
                {selectedCategory === 'industries' && (
                  <div className="form-group">
                    <label className="form-label">Sector Code</label>
                    <input
                      type="text"
                      className="form-input"
                      value={editRecordFormData.code || ''}
                      onChange={(e) => setEditRecordFormData({ ...editRecordFormData, code: e.target.value })}
                    />
                  </div>
                )}

                {/* Sources (Only Channel Name Editable) */}
                {selectedCategory === 'sources' && (
                  <div className="form-group">
                    <label className="form-label">Channel Name *</label>
                    <input
                      type="text"
                      required
                      className="form-input"
                      value={editRecordFormData.name || ''}
                      onChange={(e) => setEditRecordFormData({ ...editRecordFormData, name: e.target.value })}
                    />
                  </div>
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
