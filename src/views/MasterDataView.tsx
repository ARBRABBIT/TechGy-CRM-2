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
  LuClipboardCheck,
  LuCheck
} from 'react-icons/lu';
import { STORAGE_KEYS } from '../constants/storageKeys';
import { INITIAL_MASTER_DATA } from '../data/masterData';
import { onKeyActivate } from '../utils/a11y';
import { EmptyRow } from '../components/common/StateViews';

export const MASTER_CATEGORIES = [
  {
    id: 'contentTypes',
    title: 'Content Types',
    singular: 'Content Type',
    desc: 'Configure message formats, collateral types, marketing assets, and outbound delivery channels.',
    icon: LuLayers,
    iconBg: '#EFF6FF',
    iconColor: '#2563EB'
  },
  {
    id: 'followupTypes',
    title: 'Lead Follow-up Types',
    singular: 'Lead Follow-up Type',
    desc: 'Standardize communication methods, recommended timeframes, and priority levels for lead follow-up activities.',
    icon: LuPhoneCall,
    iconBg: '#F5F3FF',
    iconColor: '#7C3AED'
  },
  {
    id: 'followupStatuses',
    title: 'Lead Follow-up Status',
    singular: 'Lead Follow-up Status',
    desc: 'Manage follow-up activity lifecycles, escalation triggers, and resolution states.',
    icon: LuCircleCheck,
    iconBg: '#ECFDF5',
    iconColor: '#059669'
  },
  {
    id: 'leadStatuses',
    title: 'Lead Status',
    singular: 'Lead Status',
    desc: 'Standardize sales funnel stages and pipeline progression criteria.',
    icon: LuGitCommitVertical,
    iconBg: '#F0F4F9',
    iconColor: '#0F1A34'
  },
  {
    id: 'objections',
    title: 'Sales Objections',
    singular: 'Sales Objection',
    desc: 'Maintain a central directory of common buyer concerns, pricing hesitations, and objection scenarios.',
    icon: LuShieldAlert,
    iconBg: '#FEF2F2',
    iconColor: '#DC2626'
  },
  {
    id: 'agentChecklist',
    title: 'Agent Checklist',
    singular: 'Checklist Item',
    desc: 'Configure talking points and call guidance for each lead status to steer buyer interactions.',
    icon: LuClipboardCheck,
    iconBg: '#FEF3C7',
    iconColor: '#D97706'
  },
  {
    id: 'emailTemplates',
    title: 'Email Templates',
    singular: 'Email Template',
    desc: 'Centralize standardized sales outreach copy, proposal emails, follow-up messages, and dynamic merge tags.',
    icon: LuMail,
    iconBg: '#FFF1F2',
    iconColor: '#BE123C'
  },
  {
    id: 'industries',
    title: 'Industry Sectors',
    singular: 'Industry Sector',
    desc: 'Standardize client industry classifications, domain focus areas, and sector codes.',
    icon: LuFactory,
    iconBg: '#F0FDF4',
    iconColor: '#15803D'
  },
  {
    id: 'products',
    title: 'Products & Services',
    singular: 'Product / Service',
    desc: 'Define and manage the catalog of software suites, enterprise solutions, and client services.',
    icon: LuPackage,
    iconBg: '#F1F5F9',
    iconColor: '#334155'
  },
  {
    id: 'sources',
    title: 'Lead Sources',
    singular: 'Lead Source',
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
      code: '',
      name: ''
    },
    followupTypes: {
      code: '',
      name: ''
    },
    followupStatuses: {
      code: '',
      description: ''
    },
    leadStatuses: {
      code: '',
      name: ''
    },
    objections: {
      code: '',
      name: ''
    },
    agentChecklist: {
      code: '',
      leadStatus: 'New',
      pointsToTalk: '',
      name: '',
      description: ''
    },
    industries: {
      code: '',
      name: ''
    },
    products: {
      code: '',
      name: ''
    },
    sources: {
      code: '',
      name: ''
    }
  };

  const getCategoryPrefix = (catId) => {
    switch (catId) {
      case 'contentTypes': return 'CNT';
      case 'followupTypes': return 'FUT';
      case 'followupStatuses': return 'FUS';
      case 'leadStatuses': return 'LST';
      case 'objections': return 'OBJ';
      case 'agentChecklist': return 'CHK';
      case 'industries': return 'IND';
      case 'products': return 'PRD';
      case 'sources': return 'SRC';
      case 'emailTemplates': return 'TPL';
      default: return 'MST';
    }
  };

  const getSuggestedCode = (catId) => {
    const prefix = getCategoryPrefix(catId);
    const count = (masterData[catId]?.length || 0) + 1;
    return `${prefix}-${String(count).padStart(3, '0')}`;
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
    code: '',
    name: '',
    subject: '',
    body: '',
    cc: ''
  });
  const [templateCcEmails, setTemplateCcEmails] = useState([]);
  const [templateCcInput, setTemplateCcInput] = useState('');

  const handleAddTemplateCcEmail = (rawText) => {
    if (!rawText) return;
    const parts = rawText
      .split(/[,;\s]+/)
      .map(s => s.trim())
      .filter(s => s.length > 0 && s.includes('@'));

    if (parts.length > 0) {
      setTemplateCcEmails(prev => {
        const set = new Set([...prev, ...parts]);
        return Array.from(set);
      });
      setTemplateCcInput('');
    }
  };

  const handleTemplateCcKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ',' || e.key === ';') {
      e.preventDefault();
      handleAddTemplateCcEmail(templateCcInput);
    } else if (e.key === 'Backspace' && !templateCcInput && templateCcEmails.length > 0) {
      setTemplateCcEmails(prev => prev.slice(0, -1));
    }
  };

  const handleTemplateCcBlur = () => {
    if (templateCcInput.trim()) {
      handleAddTemplateCcEmail(templateCcInput);
    }
  };

  const handleRemoveTemplateCcEmail = (indexToRemove) => {
    setTemplateCcEmails(prev => prev.filter((_, idx) => idx !== indexToRemove));
  };

  const MASTER_STORAGE_KEY = STORAGE_KEYS.MASTER_DATA;

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
        const stored = localStorage.getItem(STORAGE_KEYS.EMAIL_TEMPLATES);
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
        localStorage.setItem(STORAGE_KEYS.EMAIL_TEMPLATES, JSON.stringify(newTemplates));
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
      code: item.code || item.id || '',
      leadStatus: item.leadStatus || (masterData.leadStatuses[0]?.name || 'New'),
      pointsToTalk: item.pointsToTalk || item.name || item.description || ''
    });
  };

  const handleSaveEditRecord = (e) => {
    e.preventDefault();
    const primaryField = editRecordFormData.pointsToTalk || editRecordFormData.name || editRecordFormData.description || editRecordFormData.code;
    if (!editingRecord || !primaryField?.trim()) return;

    const finalCode = (editRecordFormData.code && editRecordFormData.code.trim())
      ? editRecordFormData.code.trim().toUpperCase()
      : editingRecord.id;

    setMasterData(prev => ({
      ...prev,
      [selectedCategory]: (prev[selectedCategory] || []).map(item =>
        item.id === editingRecord.id ? {
          ...item,
          ...editRecordFormData,
          id: finalCode,
          code: finalCode,
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
    const initialCc = tpl.cc
      ? (Array.isArray(tpl.cc) ? tpl.cc : tpl.cc.split(/[,;\s]+/).map(s => s.trim()).filter(Boolean))
      : [];
    setTemplateCcEmails(initialCc);
    setTemplateCcInput('');
    setTemplateFormData({
      code: tpl.code || tpl.id || '',
      name: tpl.name || '',
      subject: tpl.subject || '',
      body: tpl.body || '',
      cc: tpl.cc || ''
    });
  };

  const handleSaveEditTemplate = (e) => {
    e.preventDefault();
    if (!editingTemplate || !templateFormData.name.trim() || !templateFormData.subject.trim()) return;

    const finalCc = templateCcEmails.join(', ');
    const finalCode = (templateFormData.code && templateFormData.code.trim())
      ? templateFormData.code.trim().toUpperCase()
      : editingTemplate.id;

    const updated = activeEmailTemplates.map(tpl =>
      tpl.id === editingTemplate.id
        ? {
            ...tpl,
            id: finalCode,
            code: finalCode,
            name: templateFormData.name.trim(),
            subject: templateFormData.subject.trim(),
            body: templateFormData.body,
            cc: finalCc
          }
        : tpl
    );

    updateTemplates(updated);
    setEditingTemplate(null);
    setTemplateCcEmails([]);
    setTemplateCcInput('');

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
      if (activeEmailTemplates.some(t => (t.name || '').trim().toLowerCase() === templateFormData.name.trim().toLowerCase())) {
        onTriggerToast?.({ title: 'Duplicate template', description: `A template named “${templateFormData.name.trim()}” already exists.`, type: 'warning' });
        return;
      }

      const finalCc = templateCcEmails.join(', ');
      const finalCode = (templateFormData.code && templateFormData.code.trim())
        ? templateFormData.code.trim().toUpperCase()
        : `TPL-${String(activeEmailTemplates.length + 1).padStart(3, '0')}`;

      const newTpl = {
        id: finalCode,
        code: finalCode,
        name: templateFormData.name.trim(),
        subject: templateFormData.subject.trim(),
        body: templateFormData.body || '',
        cc: finalCc
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

      setTemplateFormData({ code: '', name: '', subject: '', body: '', cc: '' });
      setTemplateCcEmails([]);
      setTemplateCcInput('');
      setIsAddModalOpen(false);
      return;
    }

    const currentForm = sectionFormData[targetCategory] || {};
    const primaryVal = currentForm.pointsToTalk || currentForm.name || currentForm.description;
    if (!primaryVal || !primaryVal.trim()) return;
    const existing = masterData[targetCategory] || [];
    const key = primaryVal.trim().toLowerCase();
    if (existing.some(item => (item.pointsToTalk || item.name || item.description || '').trim().toLowerCase() === key)) {
      onTriggerToast?.({ title: 'Duplicate entry', description: `“${primaryVal.trim()}” already exists in ${targetMeta?.title || 'this list'}.`, type: 'warning' });
      return;
    }

    let newRecord = { ...currentForm };
    if (newRecord.name) newRecord.name = newRecord.name.trim();
    if (newRecord.description) newRecord.description = newRecord.description.trim();
    if (newRecord.pointsToTalk) newRecord.pointsToTalk = newRecord.pointsToTalk.trim();
    if (targetCategory === 'followupStatuses') {
      newRecord.name = newRecord.description;
    }
    const autoCode = getSuggestedCode(targetCategory);
    const finalCode = (newRecord.code && newRecord.code.trim())
      ? newRecord.code.trim().toUpperCase()
      : autoCode;

    newRecord.id = finalCode;
    newRecord.code = finalCode;

    if (targetCategory === 'agentChecklist') {
      newRecord.leadStatus = newRecord.leadStatus || (checklistStatusFilter !== 'All' ? checklistStatusFilter : (masterData.leadStatuses[0]?.name || 'New'));
      newRecord.pointsToTalk = newRecord.pointsToTalk || newRecord.name || newRecord.description || '';
      newRecord.name = newRecord.pointsToTalk;
      newRecord.description = newRecord.pointsToTalk;
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
              <span role="button" tabIndex={0} onKeyDown={onKeyActivate}
                onClick={onBackToDashboard}
                style={{ cursor: 'pointer', color: '#0F1A34', fontWeight: 600 }}
                title="Go to Dashboard"
              >
                Dashboard
              </span>
              <LuChevronRight size={14} />
              <span style={{ color: '#0F1A34', fontWeight: 700 }}>
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
              <div role="button" tabIndex={0} onKeyDown={onKeyActivate}
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
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    color: '#557396',
                    backgroundColor: '#F1F5F9',
                    padding: '0.25rem 0.625rem',
                    borderRadius: 'var(--radius)'
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
              <span role="button" tabIndex={0} onKeyDown={onKeyActivate}
                onClick={onBackToDashboard}
                style={{ cursor: 'pointer', color: '#0F1A34', fontWeight: 600 }}
                title="Return to Dashboard"
              >
                Dashboard
              </span>
              <LuChevronRight size={14} />
            </>
          )}

          <span role="button" tabIndex={0} onKeyDown={onKeyActivate}
            onClick={() => setSelectedCategory(null)}
            style={{ cursor: 'pointer', color: '#0F1A34', fontWeight: 600, textDecoration: 'underline' }}
            title="Return to Master Data Hub"
          >
            Master Data
          </span>

          <LuChevronRight size={14} />

          <span style={{ color: '#0F1A34', fontWeight: 800 }}>
            {selectedCategoryMeta?.title}
          </span>
        </nav>
      </div>

      {/* Main Detail Container Card */}
      <div className="section-card" style={{ padding: '1.5rem', background: '#FFFFFF', borderRadius: 'var(--radius)', border: '1px solid #E2E8F0', boxShadow: '0 4px 16px rgba(6, 54, 105, 0.04)' }}>
        
        {/* Header Row */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem' }}>
            <div style={{
              width: '44px',
              height: '44px',
              borderRadius: 'var(--radius)',
              background: selectedCategoryMeta?.iconBg || '#EFF6FF',
              color: selectedCategoryMeta?.iconColor || '#1D4ED8',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <DetailIcon size={20} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0F1A34', margin: 0, letterSpacing: '-0.01em' }}>
                  {selectedCategoryMeta?.title}
                </h2>
                <span style={{
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  backgroundColor: '#EBF3FA',
                  color: '#0F1A34',
                  padding: '0.25rem 0.5rem',
                  borderRadius: 'var(--radius)'
                }}>
                  {filteredList.length} {filteredList.length === 1 ? 'Record' : 'Records'}
                </span>
              </div>
              <p style={{ fontSize: '0.8125rem', color: '#557396', margin: '0.25rem 0 0 0' }}>
                {selectedCategoryMeta?.desc}
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <button
              className="btn-primary"
              onClick={() => {
                if (selectedCategory === 'emailTemplates') {
                  setTemplateFormData({ name: '', subject: '', body: '', cc: '' });
                  setTemplateCcEmails([]);
                  setTemplateCcInput('');
                }
                setIsAddModalOpen(true);
              }}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                cursor: 'pointer' }}
            >
              <LuPlus size={16} /> {selectedCategory === 'emailTemplates' ? 'Create Email Template' : `Add ${selectedCategoryMeta?.singular || selectedCategoryMeta?.title || 'Record'}`}
            </button>
          </div>
        </div>

        {/* Search Bar & Filter Toolbar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '1.25rem', padding: '0.75rem 1rem', background: '#F8FAFC', borderRadius: 'var(--radius)', border: '1px solid #E2E8F0' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap', flex: 1 }}>
            <div style={{ position: 'relative', width: '300px', maxWidth: '100%' }}>
              <LuSearch size={16} style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: '#64748B' }} />
              <input aria-label="Search records"
                type="text"
                placeholder={`Search in ${selectedCategoryMeta?.title}...`}
                value={localSearch}
                onChange={(e) => setLocalSearch(e.target.value)}
                style={{
                  width: '100%',
                  height: '38px',
                  boxSizing: 'border-box',
                  padding: '0 0.875rem 0 2.375rem',
                  fontSize: '0.8125rem',
                  border: '1px solid #CBD5E1',
                  borderRadius: 'var(--radius)',
                  background: '#FFFFFF',
                  color: '#0F1A34',
                  outline: 'none',
                  display: 'flex',
                  alignItems: 'center'
                }}
              />
            </div>

            {/* Agent Checklist: Lead Status drop-down */}
            {selectedCategory === 'agentChecklist' && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <label htmlFor="agent-checklist-status-select" style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#0F1A34', whiteSpace: 'nowrap' }}>
                  Lead status:
                </label>
                <select
                  id="agent-checklist-status-select"
                  value={checklistStatusFilter}
                  onChange={(e) => setChecklistStatusFilter(e.target.value)}
                  style={{
                    height: '38px',
                    boxSizing: 'border-box',
                    padding: '0 2.25rem 0 0.875rem',
                    fontSize: '0.8125rem',
                    fontWeight: 600,
                    border: '1px solid #CBD5E1',
                    borderRadius: 'var(--radius)',
                    background: '#FFFFFF',
                    color: '#0F1A34',
                    cursor: 'pointer',
                    outline: 'none',
                    minWidth: '200px',
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
            padding: '0.625rem 1rem',
            background: '#F0F7FF',
            border: '1px solid #BAE6FD',
            borderRadius: 'var(--radius)',
            marginBottom: '1rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#0F1A34' }}>
                Points to talk for status:
              </span>
              <span style={{
                fontSize: '0.75rem',
                fontWeight: 700,
                padding: '0.25rem 0.625rem',
                borderRadius: '9999px',
                background: '#0F1A34',
                color: '#FFFFFF'
              }}>
                {checklistStatusFilter}
              </span>
            </div>
            <span style={{ fontSize: '0.8125rem', color: '#557396', fontWeight: 600 }}>
              {filteredList.length} {filteredList.length === 1 ? 'talking point' : 'talking points'}
            </span>
          </div>
        )}

        {/* Email Templates Card Grid OR Standard Master Data Table */}
        {selectedCategory === 'emailTemplates' ? (
          filteredList.length === 0 ? (
            <div style={{
              textAlign: 'center',
              padding: '3.5rem 1.5rem',
              background: '#F8FAFC',
              borderRadius: 'var(--radius)',
              border: '1px dashed #CBD5E1'
            }}>
              <div style={{
                width: '48px',
                height: '48px',
                borderRadius: '50%',
                backgroundColor: '#E0F2FE',
                color: '#0369A1',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '0.875rem'
              }}>
                <LuMail size={24} />
              </div>
              <h4 style={{ margin: '0 0 0.375rem 0', color: '#0F1A34', fontSize: '1rem', fontWeight: 700 }}>
                No Email Templates Found
              </h4>
              <p style={{ margin: 0, color: '#64748B', fontSize: '0.8125rem' }}>
                {localSearch ? `No email templates match "${localSearch}". Try clearing your search term.` : 'Create a new template using the "+ Create Email Template" button above.'}
              </p>
            </div>
          ) : (
            <div className="email-template-cards-grid">
              {filteredList.map((tpl) => (
                <div
                  key={tpl.id}
                  className="email-template-card"
                >
                  <div>
                    {/* Top Row: ID Badge & Edit CTA */}
                    <div className="email-template-card-top">
                      <span className="email-template-id-badge">
                        {tpl.id}
                      </span>
                      <button
                        type="button"
                        className="email-template-edit-btn"
                        onClick={() => handleOpenEditTemplate(tpl)}
                        title="Edit Template"
                      >
                        <LuPencil size={12} /> Edit
                      </button>
                    </div>

                    {/* Template Name */}
                    <h3 className="email-template-card-title">
                      {tpl.name}
                    </h3>

                    {/* Subject Line preview */}
                    <div className="email-template-subject-box">
                      <LuMail size={14} style={{ color: '#0369A1', marginTop: '2px', flexShrink: 0 }} />
                      <span className="email-template-subject-text" title={tpl.subject}>
                        {tpl.subject || '(No Subject Line)'}
                      </span>
                    </div>

                    {/* CC recipient preview if present */}
                    {tpl.cc && (
                      <div style={{
                        fontSize: '0.75rem',
                        color: '#0369A1',
                        backgroundColor: '#F0F9FF',
                        border: '1px solid #BAE6FD',
                        borderRadius: 'var(--radius)',
                        padding: '0.25rem 0.5rem',
                        marginBottom: '0.875rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.375rem'
                      }}>
                        <span style={{ fontWeight: 700 }}>CC:</span>
                        <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{tpl.cc}</span>
                      </div>
                    )}

                    {/* Mini Mail Template Mockup Preview (Aesthetic from Create Mail) */}
                    <div className="email-template-mini-preview" style={{ marginBottom: 0 }}>
                      <div className="email-template-mini-header">
                        <div className="email-template-mini-brand">
                          <LuLayers size={12} color="#FFFFFF" strokeWidth={1.8} />
                          <span>TechGy CRM</span>
                        </div>
                        <span style={{ fontSize: '0.625rem', color: 'rgba(255,255,255,0.7)', fontWeight: 600 }}>
                          Official Mail
                        </span>
                      </div>
                      <div className="email-template-mini-body">
                        <div style={{ fontWeight: 600, color: '#334155', marginBottom: '0.25rem' }}>
                          Dear {'{leadName}'},
                        </div>
                        {tpl.body ? (
                          <span>{tpl.body}</span>
                        ) : (
                          <span style={{ color: '#64748B', fontStyle: 'italic' }}>(No body content defined)</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )
        ) : (
          /* Data Table */
          <div style={{ overflowX: 'auto' }}>
            <table className="crm-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#F8FAFC', borderBottom: '1px solid #E2E8F0', color: '#557396', fontSize: '0.8125rem', textAlign: 'left' }}>
                  {/* 1. Content Types */}
                  {selectedCategory === 'contentTypes' && (
                    <>
                      <th style={{ padding: '0.75rem 1rem' }}>Code</th>
                      <th style={{ padding: '0.75rem 1rem' }}>Content Type Name</th>
                      <th style={{ padding: '0.75rem 1rem', textAlign: 'right' }}>Actions</th>
                    </>
                  )}

                  {/* 2. Lead Follow-up Types */}
                  {selectedCategory === 'followupTypes' && (
                    <>
                      <th style={{ padding: '0.75rem 1rem' }}>Code</th>
                      <th style={{ padding: '0.75rem 1rem' }}>Follow-up Type</th>
                      <th style={{ padding: '0.75rem 1rem', textAlign: 'right' }}>Actions</th>
                    </>
                  )}

                  {/* 3. Lead Follow-up Status */}
                  {selectedCategory === 'followupStatuses' && (
                    <>
                      <th style={{ padding: '0.75rem 1rem' }}>Code</th>
                      <th style={{ padding: '0.75rem 1rem' }}>Description</th>
                      <th style={{ padding: '0.75rem 1rem', textAlign: 'right' }}>Actions</th>
                    </>
                  )}

                  {/* 4. Lead Status */}
                  {selectedCategory === 'leadStatuses' && (
                    <>
                      <th style={{ padding: '0.75rem 1rem' }}>Code</th>
                      <th style={{ padding: '0.75rem 1rem' }}>Lead Status Name</th>
                      <th style={{ padding: '0.75rem 1rem', textAlign: 'right' }}>Actions</th>
                    </>
                  )}

                  {/* 5. Sales Objections */}
                  {selectedCategory === 'objections' && (
                    <>
                      <th style={{ padding: '0.75rem 1rem' }}>Code</th>
                      <th style={{ padding: '0.75rem 1rem' }}>Objection Concern</th>
                      <th style={{ padding: '0.75rem 1rem', textAlign: 'right' }}>Actions</th>
                    </>
                  )}

                  {/* 6. Agent Checklist */}
                  {selectedCategory === 'agentChecklist' && (
                    <>
                      <th style={{ padding: '0.75rem 1rem' }}>Code</th>
                      <th style={{ padding: '0.75rem 1rem' }}>Lead Status</th>
                      <th style={{ padding: '0.75rem 1rem' }}>Points to Talk</th>
                      <th style={{ padding: '0.75rem 1rem', textAlign: 'right' }}>Actions</th>
                    </>
                  )}

                  {/* 8. Industry Sectors */}
                  {selectedCategory === 'industries' && (
                    <>
                      <th style={{ padding: '0.75rem 1rem' }}>Code</th>
                      <th style={{ padding: '0.75rem 1rem' }}>Industry Sector</th>
                      <th style={{ padding: '0.75rem 1rem', textAlign: 'right' }}>Actions</th>
                    </>
                  )}

                  {/* Products */}
                  {selectedCategory === 'products' && (
                    <>
                      <th style={{ padding: '0.75rem 1rem' }}>Code</th>
                      <th style={{ padding: '0.75rem 1rem' }}>Product / Service Name</th>
                      <th style={{ padding: '0.75rem 1rem', textAlign: 'right' }}>Actions</th>
                    </>
                  )}

                  {/* Sources */}
                  {selectedCategory === 'sources' && (
                    <>
                      <th style={{ padding: '0.75rem 1rem' }}>Code</th>
                      <th style={{ padding: '0.75rem 1rem' }}>Channel Name</th>
                      <th style={{ padding: '0.75rem 1rem', textAlign: 'right' }}>Actions</th>
                    </>
                  )}
                </tr>
              </thead>

              <tbody>
                {filteredList.map((item) => (
                  <tr key={item.id} style={{ borderBottom: '1px solid #F1F5F9', fontSize: '0.8125rem' }}>
                    {/* 1. Content Types */}
                    {selectedCategory === 'contentTypes' && (
                      <>
                        <td style={{ padding: '0.75rem 1rem', fontFamily: 'monospace', fontWeight: 600, color: '#557396' }}>{item.code || item.id}</td>
                        <td style={{ padding: '0.75rem 1rem', fontWeight: 700, color: '#0F1A34' }}>{item.name}</td>
                      </>
                    )}

                    {/* 2. Lead Follow-up Types */}
                    {selectedCategory === 'followupTypes' && (
                      <>
                        <td style={{ padding: '0.75rem 1rem', fontFamily: 'monospace', fontWeight: 600, color: '#557396' }}>{item.code || item.id}</td>
                        <td style={{ padding: '0.75rem 1rem', fontWeight: 700, color: '#0F1A34' }}>{item.name}</td>
                      </>
                    )}

                    {/* 3. Lead Follow-up Status */}
                    {selectedCategory === 'followupStatuses' && (
                      <>
                        <td style={{ padding: '0.75rem 1rem', fontFamily: 'monospace', fontWeight: 600, color: '#557396' }}>{item.code || item.id}</td>
                        <td style={{ padding: '0.75rem 1rem', color: '#1E293B', fontWeight: 500 }}>{item.description || item.name}</td>
                      </>
                    )}

                    {/* 4. Lead Status */}
                    {selectedCategory === 'leadStatuses' && (
                      <>
                        <td style={{ padding: '0.75rem 1rem', fontFamily: 'monospace', fontWeight: 600, color: '#557396' }}>{item.code || item.id}</td>
                        <td style={{ padding: '0.75rem 1rem', fontWeight: 700, color: '#0F1A34' }}>{item.name}</td>
                      </>
                    )}

                    {/* 5. Sales Objections */}
                    {selectedCategory === 'objections' && (
                      <>
                        <td style={{ padding: '0.75rem 1rem', fontFamily: 'monospace', fontWeight: 600, color: '#557396' }}>{item.code || item.id}</td>
                        <td style={{ padding: '0.75rem 1rem', fontWeight: 700, color: '#0F1A34' }}>{item.name}</td>
                      </>
                    )}

                    {/* 6. Agent Checklist */}
                    {selectedCategory === 'agentChecklist' && (
                      <>
                        <td style={{ padding: '0.75rem 1rem', fontFamily: 'monospace', fontWeight: 600, color: '#557396' }}>{item.code || item.id}</td>
                        <td style={{ padding: '0.75rem 1rem' }}>
                          <span style={{
                            display: 'inline-block',
                            fontSize: '0.75rem',
                            fontWeight: 700,
                            padding: '0.25rem 0.5rem',
                            borderRadius: 'var(--radius)',
                            background: '#EBF3FA',
                            color: '#0F1A34',
                            border: '1px solid #D5E2EE'
                          }}>
                            {item.leadStatus || 'New'}
                          </span>
                        </td>
                        <td style={{ padding: '0.75rem 1rem', color: '#1E293B', fontWeight: 500, lineHeight: 1.5 }}>{item.pointsToTalk || item.name || item.description}</td>
                      </>
                    )}

                    {/* 8. Industry Sectors */}
                    {selectedCategory === 'industries' && (
                      <>
                        <td style={{ padding: '0.75rem 1rem', fontFamily: 'monospace', fontWeight: 600, color: '#557396' }}>{item.code || item.id}</td>
                        <td style={{ padding: '0.75rem 1rem', fontWeight: 700, color: '#0F1A34' }}>{item.name}</td>
                      </>
                    )}

                    {/* Products */}
                    {selectedCategory === 'products' && (
                      <>
                        <td style={{ padding: '0.75rem 1rem', fontFamily: 'monospace', fontWeight: 600, color: '#557396' }}>{item.code || item.id}</td>
                        <td style={{ padding: '0.75rem 1rem', fontWeight: 700, color: '#0F1A34' }}>{item.name}</td>
                      </>
                    )}

                    {/* Sources */}
                    {selectedCategory === 'sources' && (
                      <>
                        <td style={{ padding: '0.75rem 1rem', fontFamily: 'monospace', fontWeight: 600, color: '#557396' }}>{item.code || item.id}</td>
                        <td style={{ padding: '0.75rem 1rem', fontWeight: 700, color: '#0F1A34' }}>{item.name}</td>
                      </>
                    )}

                    {/* Actions Column (Edit ONLY - NO Delete option) */}
                    <td style={{ padding: '0.75rem 1rem', textAlign: 'right' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '0.375rem' }}>
                        <button
                          type="button"
                          onClick={() => handleOpenEditRecord(item)}
                          style={{
                            background: '#F1F5F9',
                            border: '1px solid #CBD5E1',
                            borderRadius: 'var(--radius)',
                            padding: '0.25rem 0.625rem',
                            fontSize: '0.75rem',
                            fontWeight: 600,
                            color: '#0F1A34',
                            cursor: 'pointer',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.375rem'
                          }}
                          title="Edit Record"
                        >
                          <LuPencil size={14} /> Edit
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}

                {filteredList.length === 0 && (
                  <EmptyRow
                    colSpan={7}
                    icon={LuSearch}
                    title="No records found"
                    description={selectedCategory === 'agentChecklist' && checklistStatusFilter !== 'All'
                      ? `No points to talk for status “${checklistStatusFilter}”. Use “+ Add Record” to add some.`
                      : effectiveSearch
                        ? `Nothing matches “${effectiveSearch}”. Use “+ Add Record” to create it.`
                        : 'This list is empty. Use “+ Add Record” to create the first entry.'}
                  />
                )}
              </tbody>
            </table>
          </div>
        )}
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
            <div role="dialog" aria-label={`Add ${meta?.singular || meta?.title || 'Record'}`} aria-modal="true" className="modal-card" style={{ maxWidth: '540px' }} onClick={e => e.stopPropagation()}>
              <div className="modal-header">
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
                  <div style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: 'var(--radius)',
                    backgroundColor: meta?.iconBg || '#EFF6FF',
                    color: meta?.iconColor || '#1D4ED8',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <CatIcon size={20} />
                  </div>
                  <div>
                    <h3 className="modal-title" style={{ fontSize: '1.125rem', margin: 0 }}>
                      Add {meta?.singular || meta?.title || 'Record'}
                    </h3>
                    <div style={{ fontSize: '0.75rem', color: '#557396' }}>
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
                    <div className="form-group" style={{ padding: '0.625rem', background: '#F8FAFC', borderRadius: 'var(--radius)', border: '1px solid #E2E8F0' }}>
                      <label className="form-label" style={{ fontSize: '0.75rem', color: '#0F1A34', fontWeight: 700 }}>
                        Target Master Section
                      </label>
                      <select aria-label="Target Master Section"
                        className="form-select"
                        value={hubAddCategory}
                        onChange={(e) => setHubAddCategory(e.target.value)}
                        style={{ fontSize: '0.8125rem', fontWeight: 600 }}
                      >
                        {MASTER_CATEGORIES.map(c => (
                          <option key={c.id} value={c.id}>{c.title}</option>
                        ))}
                      </select>
                    </div>
                  )}

                  {/* Code Input Field (appears for all master data records) */}
                  {activeCat !== 'emailTemplates' && (
                    <div className="form-group">
                      <label className="form-label">Code</label>
                      <input aria-label="Code"
                        type="text"
                        className="form-input"
                        placeholder="Enter code"
                        value={sectionFormData[activeCat]?.code || ''}
                        onChange={(e) => updateSectionField(activeCat, 'code', e.target.value.toUpperCase())}
                      />
                    </div>
                  )}

                  {/* 1. Content Types */}
                  {activeCat === 'contentTypes' && (
                    <div className="form-group">
                      <label className="form-label">Content Type Name *</label>
                      <input aria-label="Content Type Name"
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
                      <input aria-label="Follow-up Type Name"
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
                      <textarea aria-label="Description"
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
                      <input aria-label="Lead Status Name"
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
                      <input aria-label="Objection Concern"
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
                        <select aria-label="Lead Status"
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
                        <textarea aria-label="Points to Talk"
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
                    <div className="form-group">
                      <label className="form-label">Industry Sector Name *</label>
                      <input aria-label="Industry Sector Name"
                        type="text"
                        required
                        className="form-input"
                        placeholder="e.g. Enterprise Software, FinTech & Banking"
                        value={sectionFormData.industries.name}
                        onChange={(e) => updateSectionField('industries', 'name', e.target.value)}
                      />
                    </div>
                  )}

                  {/* Products (Only Product / Service Name) */}
                  {activeCat === 'products' && (
                    <div className="form-group">
                      <label className="form-label">Product / Service Name *</label>
                      <input aria-label="Product / Service Name"
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
                    <div className="form-group">
                      <label className="form-label">Channel / Source Name *</label>
                      <input aria-label="Channel / Source Name"
                        type="text"
                        required
                        className="form-input"
                        placeholder="e.g. Website, Inbound Call, Referral, LinkedIn"
                        value={sectionFormData.sources.name}
                        onChange={(e) => updateSectionField('sources', 'name', e.target.value)}
                      />
                    </div>
                  )}

                </div>
                <div className="modal-footer">
                  <button type="button" className="btn-secondary" onClick={() => setIsAddModalOpen(false)}>Cancel</button>
                  <button type="submit" className="btn-primary">
                    Save {meta?.singular || meta?.title || 'Record'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        );
      })()}

      {/* ---------------------------------------------------------------------- */}
      {/* 4. WHOLE MAIL TEMPLATE MODAL (EDIT & CREATE - WITH LIVE CORPORATE PREVIEW) */}
      {/* ---------------------------------------------------------------------- */}
      {(editingTemplate || (isAddModalOpen && selectedCategory === 'emailTemplates')) && (() => {
        const isEditing = !!editingTemplate;
        const currentId = isEditing
          ? editingTemplate.id
          : `TPL-${String(activeEmailTemplates.length + 1).padStart(3, '0')}`;
        const closeHandler = () => {
          if (isEditing) {
            setEditingTemplate(null);
          } else {
            setIsAddModalOpen(false);
          }
        };
        const submitHandler = isEditing ? handleSaveEditTemplate : handleCreateRecord;


        return (
          <div className="modal-overlay" onClick={closeHandler} style={{ zIndex: 1200, animation: 'none' }}>
            <div role="dialog" aria-label={isEditing ? 'Edit Email Template' : 'Create Email Template'} aria-modal="true"
              className="modal-card"
              style={{
                maxWidth: '1100px',
                width: '95vw',
                maxHeight: '92vh',
                display: 'flex',
                flexDirection: 'column',
                borderRadius: 'var(--radius)',
                overflow: 'hidden',
                animation: 'none',
                transform: 'none'
              }}
              onClick={e => e.stopPropagation()}
            >
              {/* Modal Top Header */}
              <div className="modal-header" style={{ borderBottom: '1px solid #E2E8F0', padding: '1rem 1.5rem', background: '#F8FAFC' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: 'var(--radius)',
                    backgroundColor: '#E0F2FE',
                    color: '#0369A1',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <LuMail size={18} />
                  </div>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
                      <h3 className="modal-title" style={{ fontSize: '1.125rem', fontWeight: 800, color: '#0F1A34', margin: 0 }}>
                        {isEditing ? 'Edit Email Template' : 'Create Email Template'}
                      </h3>
                      <span style={{
                        fontFamily: 'monospace',
                        fontWeight: 700,
                        fontSize: '0.75rem',
                        color: '#0369A1',
                        backgroundColor: '#E0F2FE',
                        border: '1px solid #BAE6FD',
                        padding: '0.125rem 0.5rem',
                        borderRadius: 'var(--radius)'
                      }}>
                        {currentId}
                      </span>
                    </div>
                    <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.8125rem', color: '#64748B' }}>
                      Interactive email template editor with real-time Gmail corporate preview
                    </p>
                  </div>
                </div>
                <button aria-label="Close"
                  type="button"
                  className="modal-close-btn"
                  onClick={closeHandler}
                  title="Close"
                  style={{
                    background: 'transparent',
                    border: 'none',
                    outline: 'none',
                    cursor: 'pointer',
                    color: '#64748B',
                    width: '32px',
                    height: '32px',
                    borderRadius: 'var(--radius)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: 0,
                    animation: 'none',
                    transform: 'none',
                    transition: 'background-color 0.15s ease, color 0.15s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#F1F5F9';
                    e.currentTarget.style.color = '#0F1A34';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                    e.currentTarget.style.color = '#64748B';
                  }}
                >
                  <LuX size={20} />
                </button>
              </div>

              {/* Modal Body: 2-Column Split View */}
              <form onSubmit={submitHandler} style={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0, overflow: 'hidden' }}>
                <div
                  className="modal-body"
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
                    gap: '1.5rem',
                    padding: '1.25rem 1.5rem',
                    overflowY: 'auto',
                    flex: 1,
                    minHeight: 0
                  }}
                >
                  {/* Left Column: Template Form Editor */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div className="form-group" style={{ marginBottom: 0 }}>
                      <label className="form-label">Template Code</label>
                      <input aria-label="Template Code"
                        type="text"
                        className="form-input"
                        placeholder="Enter template code"
                        value={templateFormData.code || ''}
                        onChange={(e) => setTemplateFormData({ ...templateFormData, code: e.target.value.toUpperCase() })}
                        style={{ height: '40px', fontSize: '0.875rem' }}
                      />
                    </div>

                    <div className="form-group" style={{ marginBottom: 0 }}>
                      <label className="form-label">Template Name *</label>
                      <input aria-label="Template Name"
                        type="text"
                        required
                        className="form-input"
                        placeholder="e.g. Introduction & Capabilities Overview"
                        value={templateFormData.name}
                        onChange={(e) => setTemplateFormData({ ...templateFormData, name: e.target.value })}
                        style={{ height: '40px', fontSize: '0.875rem' }}
                      />
                    </div>

                    <div className="form-group" style={{ marginBottom: 0 }}>
                      <label className="form-label">Subject Line *</label>
                      <input aria-label="Subject Line"
                        type="text"
                        required
                        className="form-input"
                        placeholder="e.g. Introduction: TechGy Enterprise CRM Overview for {company}"
                        value={templateFormData.subject}
                        onChange={(e) => setTemplateFormData({ ...templateFormData, subject: e.target.value })}
                        style={{ height: '40px', fontSize: '0.875rem' }}
                      />
                    </div>

                    {/* Multi-Email CC Field */}
                    <div className="form-group" style={{ marginBottom: 0 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.25rem' }}>
                        <label className="form-label" style={{ margin: 0 }}>CC (Carbon Copy)</label>
                        {templateCcEmails.length > 0 && (
                          <span style={{ fontSize: '0.6875rem', color: '#0369A1', fontWeight: 600 }}>
                            {templateCcEmails.length} {templateCcEmails.length === 1 ? 'recipient' : 'recipients'}
                          </span>
                        )}
                      </div>
                      <div style={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        alignItems: 'center',
                        gap: '0.375rem',
                        padding: '0.375rem 0.625rem',
                        border: '1px solid #CBD5E1',
                        borderRadius: 'var(--radius)',
                        backgroundColor: '#FFFFFF',
                        minHeight: '38px',
                        boxShadow: '0 1px 2px rgba(6, 54, 105, 0.03)'
                      }}>
                        {templateCcEmails.map((email, idx) => (
                          <span
                            key={idx}
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '0.25rem',
                              backgroundColor: '#E0F2FE',
                              color: '#0369A1',
                              border: '1px solid #BAE6FD',
                              borderRadius: 'var(--radius)',
                              padding: '0.125rem 0.5rem',
                              fontSize: '0.75rem',
                              fontWeight: 600
                            }}
                          >
                            <span>{email}</span>
                            <LuX
                              size={12}
                              style={{ cursor: 'pointer', opacity: 0.8 }}
                              onClick={() => handleRemoveTemplateCcEmail(idx)}
                              title="Remove email"
                            />
                          </span>
                        ))}
                        <input aria-label="Add CC email"
                          type="text"
                          placeholder={templateCcEmails.length === 0 ? "Add CC emails (type and press Enter or comma)..." : "Add more..."}
                          value={templateCcInput}
                          onChange={(e) => setTemplateCcInput(e.target.value)}
                          onKeyDown={handleTemplateCcKeyDown}
                          onBlur={handleTemplateCcBlur}
                          style={{
                            flex: 1,
                            minWidth: '160px',
                            border: 'none',
                            outline: 'none',
                            fontSize: '0.8125rem',
                            color: '#1E293B',
                            padding: '0.25rem 0',
                            backgroundColor: 'transparent'
                          }}
                        />
                      </div>
                    </div>


                    {/* Email Body Textarea */}
                    <div className="form-group" style={{ marginBottom: 0, display: 'flex', flexDirection: 'column', flex: 1 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.375rem' }}>
                        <label className="form-label" style={{ margin: 0 }}>Email Template Body *</label>
                        <span style={{ fontSize: '0.75rem', color: '#64748B' }}>
                          {(templateFormData.body || '').length} characters
                        </span>
                      </div>
                      <textarea aria-label="Email Template Body"
                        rows={10}
                        required
                        className="form-textarea"
                        placeholder="Hi {leadName},&#10;&#10;Thank you for connecting with TechGy..."
                        value={templateFormData.body}
                        onChange={(e) => setTemplateFormData({ ...templateFormData, body: e.target.value })}
                        style={{
                          flex: 1,
                          minHeight: '190px',
                          fontSize: '0.875rem',
                          lineHeight: '1.6',
                          fontFamily: 'inherit'
                        }}
                      />
                    </div>
                  </div>

                  {/* Right Column: Authentic Gmail Message Live Preview */}
                  <div style={{
                    backgroundColor: '#FFFFFF',
                    borderRadius: 'var(--radius)',
                    border: '1px solid #CBD5E1',
                    boxShadow: '0 4px 14px rgba(6, 54, 105, 0.06)',
                    display: 'flex',
                    flexDirection: 'column',
                    overflow: 'hidden',
                    minHeight: '440px'
                  }}>
                    {/* Gmail Header Bar */}
                    <div style={{
                      padding: '0.625rem 1rem',
                      backgroundColor: '#F8FAFC',
                      borderBottom: '1px solid #E2E8F0',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      flexShrink: 0
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <div style={{
                          width: '22px',
                          height: '22px',
                          borderRadius: '4px',
                          backgroundColor: '#EA4335',
                          color: '#FFFFFF',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontWeight: 900,
                          fontSize: '0.75rem',
                          boxShadow: '0 1px 3px rgba(234, 67, 53, 0.3)'
                        }}>
                          M
                        </div>
                        <span style={{ fontSize: '0.875rem', fontWeight: 700, color: '#1E293B' }}>
                          Gmail Live Preview
                        </span>
                      </div>
                      <span style={{
                        fontSize: '0.6875rem',
                        fontWeight: 600,
                        color: '#475569',
                        backgroundColor: '#E2E8F0',
                        padding: '0.125rem 0.5rem',
                        borderRadius: '4px'
                      }}>
                        Inbox
                      </span>
                    </div>

                    {/* Scrollable Email Thread Container */}
                    <div style={{
                      flex: 1,
                      overflowY: 'auto',
                      display: 'flex',
                      flexDirection: 'column',
                      minHeight: 0
                    }}>
                      {/* Thread Subject Row */}
                      <div style={{
                        padding: '0.875rem 1.125rem',
                        borderBottom: '1px solid #F1F5F9',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.75rem',
                        flexShrink: 0
                      }}>
                        <h4 style={{
                          margin: 0,
                          fontSize: '1rem',
                          fontWeight: 700,
                          color: templateFormData.subject.trim() ? '#1E293B' : '#94A3B8',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                          flex: 1,
                          minWidth: 0
                        }}>
                          {templateFormData.subject.trim() || '(No Subject Line)'}
                        </h4>
                      </div>

                      {/* Sender Meta Row */}
                      <div style={{
                        padding: '0.75rem 1.125rem',
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: '0.75rem',
                        borderBottom: '1px solid #F1F5F9',
                        flexShrink: 0
                      }}>
                        <div style={{
                          width: '36px',
                          height: '36px',
                          borderRadius: '50%',
                          backgroundColor: '#0F1A34',
                          color: '#FFFFFF',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '0.875rem',
                          fontWeight: 700,
                          flexShrink: 0
                        }}>
                          R
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: '0.5rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', flexWrap: 'wrap' }}>
                              <span style={{ fontSize: '0.875rem', fontWeight: 700, color: '#1E293B' }}>
                                Rajesh Sharma
                              </span>
                              <span style={{ fontSize: '0.75rem', color: '#64748B' }}>
                                &lt;rajesh@techgylink.internal&gt;
                              </span>
                            </div>
                            <span style={{ fontSize: '0.6875rem', color: '#64748B', flexShrink: 0 }}>
                              Today, 10:30 AM
                            </span>
                          </div>
                          <div style={{ fontSize: '0.75rem', color: '#64748B', marginTop: '0.25rem' }}>
                            to: <span style={{ fontWeight: 600, color: '#334155' }}>
                              {'{leadName}'} &lt;contact@{'{company}'}.co.in&gt;
                            </span>
                          </div>
                          {templateCcEmails.length > 0 && (
                            <div style={{ fontSize: '0.75rem', color: '#64748B', marginTop: '0.125rem' }}>
                              cc: <span style={{ fontWeight: 600, color: '#0369A1' }}>
                                {templateCcEmails.join(', ')}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Corporate Email Body */}
                      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                        {/* TechGy Corporate Banner */}
                        <div style={{
                          background: 'linear-gradient(135deg, #0F1A34 0%, #0a4a8a 35%, #1565c0 60%, #0d47a1 80%, #0F1A34 100%)',
                          position: 'relative',
                          overflow: 'hidden',
                          height: '72px',
                          flexShrink: 0
                        }}>
                          <div style={{
                            position: 'absolute', right: 0, top: 0, bottom: 0,
                            display: 'flex', alignItems: 'stretch'
                          }}>
                            {[
                              { bg: 'rgba(255,255,255,0.04)', skew: '-12deg', width: '80px', right: '200px' },
                              { bg: 'rgba(255,255,255,0.07)', skew: '-12deg', width: '70px', right: '140px' },
                              { bg: 'rgba(21,101,192,0.5)', skew: '-12deg', width: '65px', right: '85px' },
                              { bg: 'rgba(255,255,255,0.09)', skew: '-12deg', width: '55px', right: '38px' },
                              { bg: 'rgba(255,255,255,0.06)', skew: '-12deg', width: '45px', right: '0px' },
                            ].map((s, i) => (
                              <div key={i} style={{
                                position: 'absolute',
                                top: 0, bottom: 0,
                                right: s.right,
                                width: s.width,
                                backgroundColor: s.bg,
                                transform: `skewX(${s.skew})`,
                                transformOrigin: 'top left'
                              }} />
                            ))}
                          </div>
                          <div style={{
                            position: 'relative',
                            zIndex: 2,
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.625rem',
                            padding: '0 1.25rem',
                            height: '100%'
                          }}>
                            <div style={{
                              width: '32px',
                              height: '32px',
                              borderRadius: 'var(--radius)',
                              background: 'rgba(255,255,255,0.18)',
                              border: '1.5px solid rgba(255,255,255,0.35)',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              backdropFilter: 'blur(4px)'
                            }}>
                              <LuLayers size={18} color="#FFFFFF" strokeWidth={1.8} />
                            </div>
                            <div>
                              <div style={{ color: '#FFFFFF', fontWeight: 800, fontSize: '1rem', letterSpacing: '0.02em', lineHeight: 1 }}>
                                TechGy
                              </div>
                              <div style={{ color: 'rgba(255,255,255,0.65)', fontSize: '0.625rem', fontWeight: 500, letterSpacing: '0.08em', marginTop: '2px' }}>
                                ENTERPRISE CRM
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* White Email Body Area */}
                        <div style={{ padding: '1.125rem 1.25rem', flex: 1, backgroundColor: '#FFFFFF' }}>
                          <div style={{ fontSize: '0.875rem', color: '#202124', marginBottom: '0.625rem', lineHeight: 1.6 }}>
                            Dear {'{leadName}'},
                          </div>

                          {templateFormData.body && templateFormData.body.trim() ? (
                            <div style={{
                              fontSize: '0.8125rem',
                              color: '#202124',
                              lineHeight: '1.7',
                              whiteSpace: 'pre-wrap',
                              wordBreak: 'break-word',
                              marginBottom: '1rem'
                            }}>
                              {templateFormData.body}
                            </div>
                          ) : (
                            <div style={{
                              color: '#64748B',
                              fontStyle: 'italic',
                              padding: '1.25rem 0.75rem',
                              textAlign: 'center',
                              backgroundColor: '#F8FAFC',
                              borderRadius: 'var(--radius)',
                              border: '1px dashed #CBD5E1',
                              fontSize: '0.8125rem',
                              marginBottom: '1rem'
                            }}>
                              Start typing template body on the left to see live preview here...
                            </div>
                          )}

                          {/* Sign-off */}
                          <div style={{ fontSize: '0.8125rem', color: '#202124', marginBottom: '0.375rem', lineHeight: 1.7 }}>
                            Best regards,
                          </div>
                          <div style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#0F1A34', marginBottom: '0.125rem' }}>
                            Rajesh Sharma
                          </div>
                          <div style={{ fontSize: '0.75rem', color: '#64748B' }}>
                            TechGy Solutions Enterprise Team
                          </div>

                          {/* Divider */}
                          <div style={{ borderTop: '1px solid #E2E8F0', margin: '0.875rem 0' }} />

                          {/* Legal Disclaimer */}
                          <div style={{
                            fontSize: '0.6875rem',
                            color: '#64748B',
                            lineHeight: '1.6',
                            backgroundColor: '#F8FAFC',
                            padding: '0.75rem 0.875rem',
                            borderRadius: 'var(--radius)'
                          }}>
                            This e-mail and any files transmitted with it are confidential and intended solely for the use of the individual or entity to whom they are addressed. If you have received this email in error, please notify TechGy system administration.
                          </div>

                          {/* Copyright */}
                          <div style={{ fontSize: '0.6875rem', color: '#64748B', textAlign: 'center', marginTop: '0.75rem' }}>
                            © {new Date().getFullYear()} TechGy. All rights reserved.
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Modal Footer */}
                <div className="modal-footer" style={{ borderTop: '1px solid #E2E8F0', padding: '0.875rem 1.5rem', background: '#F8FAFC' }}>
                  <button type="button" className="btn-secondary" onClick={closeHandler}>
                    Cancel
                  </button>
                  <button type="submit" className="btn-primary" style={{ display: 'inline-flex', alignItems: 'center' }}>
                    <LuCheck size={16} /> {isEditing ? 'Save Template Changes' : 'Create Template'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        );
      })()}

      {/* ---------------------------------------------------------------------- */}
      {/* 6. EDIT STANDARD MASTER RECORD MODAL                                   */}
      {/* ---------------------------------------------------------------------- */}
      {editingRecord && (
        <div className="modal-overlay" onClick={() => setEditingRecord(null)}>
          <div role="dialog" aria-label={`Edit ${selectedCategoryMeta?.singular || selectedCategoryMeta?.title || 'Record'}`} aria-modal="true" className="modal-card" style={{ maxWidth: '520px' }} onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">Edit {selectedCategoryMeta?.singular || selectedCategoryMeta?.title || 'Record'}</h3>
              <button className="modal-close-btn" onClick={() => setEditingRecord(null)}><LuX size={18} /></button>
            </div>
            <form onSubmit={handleSaveEditRecord}>
              <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Code</label>
                  <input aria-label="Code"
                    type="text"
                    className="form-input"
                    style={{ fontFamily: 'monospace', textTransform: 'uppercase' }}
                    value={editRecordFormData.code || editRecordFormData.id || ''}
                    onChange={(e) => setEditRecordFormData({
                      ...editRecordFormData,
                      code: e.target.value.toUpperCase(),
                      id: e.target.value.toUpperCase()
                    })}
                  />
                </div>

                {selectedCategory === 'agentChecklist' && (
                  <div className="form-group">
                    <label className="form-label">Lead Status *</label>
                    <select aria-label="Lead Status"
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
                    <textarea aria-label="Enter talking points, guidance, or qualification requirements for this lead status"
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
                    <textarea aria-label={selectedCategoryMeta?.singular || 'Record value'}
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
                    <input aria-label={selectedCategoryMeta?.singular || 'Record name'}
                      type="text"
                      required
                      className="form-input"
                      value={editRecordFormData.name || ''}
                      onChange={(e) => setEditRecordFormData({ ...editRecordFormData, name: e.target.value })}
                    />
                  )}
                </div>

                {/* Sources (Only Channel Name Editable) */}
                {selectedCategory === 'sources' && (
                  <div className="form-group">
                    <label className="form-label">Channel Name *</label>
                    <input aria-label="Channel Name"
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
