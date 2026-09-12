import React, { useState, useMemo, useRef, useEffect } from 'react';
import {
  LuChevronRight,
  LuChevronDown,
  LuPhone,
  LuMail,
  LuClock,
  LuTriangleAlert,
  LuPlus,
  LuMessageSquare,
  LuFileText,
  LuCalendar,
  LuArrowUpDown,
  LuX,
  LuPencil,
  LuCheck
} from 'react-icons/lu';
import { LEAD_SOURCES, INITIAL_OWNERS, INITIAL_ACCOUNTS } from '../data/mockData';
import StageConfirmModal from '../components/StageConfirmModal';
import LeadCallHistory from '../components/LeadCallHistory';
import LeadPipelineProgress from '../components/LeadPipelineProgress';
import LeadChatHistory from '../components/LeadChatHistory';
import FormDateSelector from '../components/FormDateSelector';

export default function LeadDetailView({
  lead,
  activities = [],
  onBack,
  onNavigateHome,
  onQuickAction,
  onSaveAction,
  onNavigateToAccount,
  navigationSource = 'leads',
  onNavigateToActivities,
  onNavigateToProposals,
  onNavigateToContacts,
  onUpdateLeadStage,
  onUpdateLead,
  accounts = []
}) {
  const [pendingStage, setPendingStage] = useState(null);
  const [isStageModalOpen, setIsStageModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('Activity');
  const [pipelineSortOrder, setPipelineSortOrder] = useState('desc');
  const [selectedActivityForModal, setSelectedActivityForModal] = useState(null);
  const [isStatusDropdownOpen, setIsStatusDropdownOpen] = useState(false);
  const statusDropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (statusDropdownRef.current && !statusDropdownRef.current.contains(event.target)) {
        setIsStatusDropdownOpen(false);
      }
    }
    function handleKeyDown(event) {
      if (event.key === 'Escape') {
        setIsStatusDropdownOpen(false);
      }
    }
    if (isStatusDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isStatusDropdownOpen]);

  const companyOptions = useMemo(() => {
    const compSet = new Set();
    if (accounts && Array.isArray(accounts)) {
      accounts.forEach(a => {
        const name = a.companyName || a.company;
        if (name) compSet.add(name);
      });
    }
    if (INITIAL_ACCOUNTS && Array.isArray(INITIAL_ACCOUNTS)) {
      INITIAL_ACCOUNTS.forEach(a => {
        const name = a.companyName || a.company;
        if (name) compSet.add(name);
      });
    }
    if (lead && lead.company) {
      compSet.add(lead.company);
    }
    return Array.from(compSet).sort((a, b) => a.localeCompare(b));
  }, [accounts, lead]);

  const [editForm, setEditForm] = useState({
    leadName: '',
    company: '',
    designation: '',
    leadSource: 'Website',
    phoneNumber: '',
    emailId: '',
    leadOwner: '',
    priority: 'Medium',
    followupDate: '',
    followupTime: '10:30 AM'
  });

  const handleOpenEditModal = () => {
    let initialDate = '';
    let initialTime = '10:30 AM';
    if (lead.nextFollowup) {
      const parts = lead.nextFollowup.trim().split(/\s+/);
      initialDate = parts[0] || '';
      if (parts.length > 1) {
        initialTime = parts.slice(1).join(' ');
      }
    }
    const todayISO = new Date().toISOString().split('T')[0];
    setEditForm({
      leadName: lead.leadName || '',
      company: lead.company || '',
      designation: lead.designation || '',
      leadSource: lead.leadSource || 'Website',
      phoneNumber: lead.phoneNumber || '',
      emailId: lead.emailId || '',
      leadOwner: lead.leadOwner || 'Rajesh Sharma',
      priority: lead.priority || 'Medium',
      followupDate: initialDate || todayISO,
      followupTime: initialTime || '10:30 AM'
    });
    setIsEditModalOpen(true);
  };

  const handleSaveEdit = (e) => {
    e.preventDefault();
    if (!editForm.leadName.trim()) return;
    if (onUpdateLead) {
      const combinedFollowup = editForm.followupDate
        ? `${editForm.followupDate} ${editForm.followupTime}`.trim()
        : lead.nextFollowup;

      onUpdateLead(lead.id, {
        leadName: editForm.leadName.trim(),
        company: editForm.company.trim(),
        designation: editForm.designation.trim(),
        phoneNumber: editForm.phoneNumber.trim(),
        emailId: editForm.emailId.trim(),
        leadSource: editForm.leadSource,
        leadOwner: editForm.leadOwner,
        priority: editForm.priority,
        nextFollowup: combinedFollowup
      });
    }
    setIsEditModalOpen(false);
  };

  const TABS = ['Activity', 'Calls', 'Chats', 'Enquiries', 'Followups', 'Mail', 'Notes'];

  const getActivityCategory = (act) => {
    const t = (act.type || '').toLowerCase();
    if (t === 'call' || t === 'calls') return 'Calls';
    if (t.includes('chat') || t.includes('sms') || t.includes('whatsapp')) return 'Chats';
    if (t.includes('enquir') || t.includes('inquir')) return 'Enquiries';
    if (t.includes('follow')) return 'Followups';
    if (t.includes('mail') || t.includes('email')) return 'Mail';
    return 'Activity';
  };

  const leadActivities = useMemo(() => {
    if (!lead) return [];
    const leadNameLower = (lead.leadName || '').toLowerCase().trim();
    const compLower = (lead.company || '').toLowerCase().trim();

    // Match activities belonging to this lead
    const matched = (activities || []).filter(act => {
      if (!act) return false;
      if (act.leadId && lead.id && String(act.leadId) === String(lead.id)) return true;
      if (act.targetLeadId && lead.id && String(act.targetLeadId) === String(lead.id)) return true;
      const aLead = (act.lead || '').toLowerCase().trim();
      const aComp = (act.company || '').toLowerCase().trim();
      const nameMatch = leadNameLower && aLead && (aLead === leadNameLower);
      const compMatch = compLower && aComp && (aComp === compLower);
      return (nameMatch && compMatch) || (nameMatch && !aComp) || (compMatch && !aLead);
    });

    return matched.sort((a, b) => {
      const dateA = a.date || a.dueTime || '';
      const dateB = b.date || b.dueTime || '';
      return dateB.localeCompare(dateA);
    });
  }, [activities, lead]);



  const filteredActivities = useMemo(() => {
    if (activeTab === 'Activity') return leadActivities;
    return leadActivities.filter(act => getActivityCategory(act) === activeTab);
  }, [leadActivities, activeTab]);

  const callActivities = useMemo(() => {
    return leadActivities.filter(act => getActivityCategory(act) === 'Calls');
  }, [leadActivities]);

  const renderTypeIcon = (type) => {
    const t = (type || '').toLowerCase();
    if (t === 'call' || t === 'calls') {
      return (
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', color: '#063669', backgroundColor: '#EBF3FA', padding: '0.2rem 0.55rem', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 600 }}>
          <LuPhone size={12} /> Call
        </span>
      );
    }
    if (t.includes('chat') || t.includes('sms') || t.includes('whatsapp')) {
      return (
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', color: '#0D9488', backgroundColor: '#F0FDFA', padding: '0.2rem 0.55rem', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 600 }}>
          <LuMessageSquare size={12} /> Chat
        </span>
      );
    }
    if (t.includes('enquir') || t.includes('inquir')) {
      return (
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', color: '#D97706', backgroundColor: '#FEF3C7', padding: '0.2rem 0.55rem', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 600 }}>
          <LuFileText size={12} /> Enquiry
        </span>
      );
    }
    if (t.includes('follow')) {
      return (
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', color: '#7C3AED', backgroundColor: '#F5F3FF', padding: '0.2rem 0.55rem', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 600 }}>
          <LuClock size={12} /> Follow-up
        </span>
      );
    }
    if (t.includes('mail') || t.includes('email')) {
      return (
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', color: '#059669', backgroundColor: '#ECFDF5', padding: '0.2rem 0.55rem', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 600 }}>
          <LuMail size={12} /> Mail
        </span>
      );
    }
    if (t.includes('note')) {
      return (
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', color: '#0369A1', backgroundColor: '#E0F2FE', padding: '0.2rem 0.55rem', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 600 }}>
          <LuFileText size={12} /> Note
        </span>
      );
    }
    return (
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', color: '#475569', backgroundColor: '#F1F5F9', padding: '0.2rem 0.55rem', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 600 }}>
        <LuCalendar size={12} /> {type || 'Activity'}
      </span>
    );
  };

  const getStatusBadgeClass = (statusStr) => {
    const s = (statusStr || '').toLowerCase();
    if (s.includes('complet') || s.includes('connect') || s.includes('won')) return 'won';
    if (s.includes('qualif')) return 'qualified';
    if (s.includes('schedul') || s.includes('pend')) return 'new';
    if (s.includes('deliv') || s.includes('sent')) return 'discussion';
    if (s.includes('overdue') || s.includes('lost')) return 'lost';
    return 'new';
  };

  const getLogCtaLabel = (tab) => {
    switch (tab) {
      case 'Calls': return 'Call';
      case 'Chats': return 'Send Message';
      case 'Enquiries': return 'Log Enquiry';
      case 'Followups': return 'Schedule Follow-up';
      case 'Mail': return 'Send Email';
      case 'Notes': return 'Add Note';
      case 'Activity': return 'Advance Stage';
      default:
        return 'Update Stage';
    }
  };

  const handleLogAction = (tab) => {
    if (!onQuickAction) return;
    switch (tab) {
      case 'Calls':
        onQuickAction('call', lead);
        break;
      case 'Chats':
        onQuickAction('sms', lead);
        break;
      case 'Mail':
        onQuickAction('email', lead);
        break;
      case 'Followups':
        onQuickAction('scheduleFollowup', lead);
        break;
      case 'Notes':
        onQuickAction('addNote', lead);
        break;
      case 'Activity': {
        const nextIdx = currentStageIndex + 1;
        if (nextIdx < stages.length) {
          handleStageClick(stages[nextIdx]);
        } else {
          handleStageClick(stages[stages.length - 1]);
        }
        break;
      }
      case 'Enquiries':
      default:
        onQuickAction('addNote', lead);
        break;
    }
  };

  const notesList = lead.notes ? lead.notes.split('\n').map(n => n.trim()).filter(Boolean) : [];

  const stages = ['New', 'Contacted', 'Qualified', 'Discussion', 'Proposal', 'Negotiation'];
  const currentStageIndex = stages.indexOf(lead.status) !== -1 ? stages.indexOf(lead.status) : 0;

  const handleStageClick = (stg) => {
    if (stg === lead.status) return;
    setPendingStage(stg);
    setIsStageModalOpen(true);
  };

  const handleConfirmStage = (targetStage) => {
    const nextStage = targetStage || pendingStage;
    if (onUpdateLeadStage && nextStage) {
      onUpdateLeadStage(lead.id, nextStage);
    }
    setIsStageModalOpen(false);
    setPendingStage(null);
  };

  return (
    <div className="lead-detail-page">
      {/* 1. Breadcrumbs Navigation Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
        <nav style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', fontWeight: 500, color: '#557396' }}>
          {navigationSource === 'contacts' ? (
            <>
              <span
                onClick={onNavigateToContacts || onBack}
                style={{ cursor: 'pointer', color: '#063669', fontWeight: 600 }}
                title="Return to Contacts Directory"
              >
                Contacts Directory
              </span>
              <LuChevronRight size={14} />
              <span style={{ color: '#063669', fontWeight: 700 }}>
                {lead.leadName} ({lead.company})
              </span>
            </>
          ) : navigationSource === 'dashboard' ? (
            <>
              <span
                onClick={onNavigateHome}
                style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.3rem', color: '#063669' }}
                title="Go to Dashboard"
              >
                Dashboard
              </span>
              <LuChevronRight size={14} />
              <span style={{ color: '#063669', fontWeight: 700 }}>
                {lead.leadName} ({lead.company})
              </span>
            </>
          ) : navigationSource === 'activities' ? (
            <>
              <span
                onClick={onNavigateToActivities || onBack}
                style={{ cursor: 'pointer', color: '#063669', fontWeight: 600 }}
                title="Return to Activities & Engagement Timeline"
              >
                Activities & Engagement Timeline
              </span>
              <LuChevronRight size={14} />
              <span style={{ color: '#063669', fontWeight: 700 }}>
                {lead.leadName} ({lead.company})
              </span>
            </>
          ) : navigationSource === 'proposals' ? (
            <>
              <span
                onClick={onNavigateToProposals || onBack}
                style={{ cursor: 'pointer', color: '#063669', fontWeight: 600 }}
                title="Return to Proposals Directory"
              >
                Proposals Directory
              </span>
              <LuChevronRight size={14} />
              <span style={{ color: '#063669', fontWeight: 700 }}>
                {lead.leadName} ({lead.company})
              </span>
            </>
          ) : navigationSource === 'accounts' ? (
            <>
              <span
                onClick={onBack}
                style={{ cursor: 'pointer', color: '#063669', fontWeight: 600 }}
                title="Return to Account Record"
              >
                {lead.company}
              </span>
              <LuChevronRight size={14} />
              <span style={{ color: '#063669', fontWeight: 700 }}>
                {lead.leadName}
              </span>
            </>
          ) : (
            <>
              <span
                onClick={onBack}
                style={{ cursor: 'pointer', color: '#063669', fontWeight: 600 }}
                title="Return to Leads Directory"
              >
                Leads Directory
              </span>
              <LuChevronRight size={14} />
              <span style={{ color: '#063669', fontWeight: 700 }}>
                {lead.leadName} ({lead.company})
              </span>
            </>
          )}
        </nav>
      </div>

      {/* 2. Top Summary Header Card */}
      <div className="section-card" style={{ marginBottom: '1.25rem', padding: '1.25rem 1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            {lead.isOverdue && (
              <div style={{ marginBottom: '0.35rem' }}>
                <span className="overdue-badge-pill" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', backgroundColor: '#ef4444', color: '#FFFFFF', padding: '0.2rem 0.55rem', borderRadius: '6px', fontSize: '0.725rem', fontWeight: 700 }}>
                  <LuTriangleAlert size={12} /> OVERDUE FOLLOW-UP
                </span>
              </div>
            )}
            <h1 style={{ fontSize: '1.65rem', fontWeight: 800, color: '#063669', margin: '0 0 0.35rem 0', letterSpacing: '-0.02em' }}>
              {lead.leadName}
            </h1>
            <div style={{ fontSize: '0.95rem', color: '#557396', display: 'flex', alignItems: 'center', gap: '0.45rem', flexWrap: 'wrap' }}>
              <span>{lead.designation} at</span>
              <button
                type="button"
                onClick={() => onNavigateToAccount && onNavigateToAccount(lead.company)}
                style={{ background: 'none', border: 'none', padding: 0, font: 'inherit', fontWeight: 700, color: '#063669', cursor: 'pointer', textDecoration: 'underline' }}
                title={`Open ${lead.company} account dossier`}
              >
                {lead.company}
              </button>
            </div>
          </div>

          {/* Lead Status Custom Dropdown UI — top-right of header card */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.6rem',
            padding: '0.45rem 0.75rem',
            backgroundColor: '#F0F5FA',
            borderRadius: '10px',
            border: '1px solid #D5E2EE'
          }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#557396', whiteSpace: 'nowrap' }}>Lead Status</span>
            <div ref={statusDropdownRef} style={{ position: 'relative', display: 'inline-flex', alignItems: 'center' }}>
              <button
                type="button"
                onClick={() => setIsStatusDropdownOpen(prev => !prev)}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '0.5rem',
                  border: `1px solid ${isStatusDropdownOpen ? '#063669' : '#CBD5E1'}`,
                  borderRadius: '7px',
                  padding: '0.32rem 0.65rem',
                  fontSize: '0.82rem',
                  fontWeight: 700,
                  color: '#063669',
                  backgroundColor: '#FFFFFF',
                  cursor: 'pointer',
                  outline: 'none',
                  minWidth: '135px',
                  boxShadow: isStatusDropdownOpen
                    ? '0 0 0 3px rgba(6, 54, 105, 0.12)'
                    : '0 1px 2px rgba(0, 0, 0, 0.04)',
                  transition: 'all 0.15s ease'
                }}
                aria-haspopup="listbox"
                aria-expanded={isStatusDropdownOpen}
              >
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.45rem' }}>
                  <span
                    style={{
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      backgroundColor: {
                        'New': '#3B82F6',
                        'Contacted': '#8B5CF6',
                        'Qualified': '#10B981',
                        'Discussion': '#F59E0B',
                        'Proposal': '#6366F1',
                        'Negotiation': '#EC4899'
                      }[lead.status] || '#063669',
                      flexShrink: 0
                    }}
                  />
                  <span>{lead.status || 'New'}</span>
                </span>
                <LuChevronDown
                  size={14}
                  style={{
                    color: '#063669',
                    transform: isStatusDropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                    transition: 'transform 0.2s cubic-bezier(0.4, 0, 0.2, 1)'
                  }}
                />
              </button>

              {/* Custom Dropdown Menu UI */}
              {isStatusDropdownOpen && (
                <div
                  role="listbox"
                  style={{
                    position: 'absolute',
                    top: 'calc(100% + 6px)',
                    right: 0,
                    minWidth: '165px',
                    backgroundColor: '#FFFFFF',
                    border: '1px solid #D5E2EE',
                    borderRadius: '10px',
                    boxShadow: '0 12px 28px -4px rgba(6, 54, 105, 0.16), 0 6px 12px -4px rgba(6, 54, 105, 0.08)',
                    padding: '0.35rem',
                    zIndex: 1000,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '2px',
                    animation: 'applePopIn 0.18s cubic-bezier(0.16, 1, 0.3, 1)'
                  }}
                >
                  {stages.map(s => {
                    const isSelected = s === lead.status;
                    const stageColor = {
                      'New': '#3B82F6',
                      'Contacted': '#8B5CF6',
                      'Qualified': '#10B981',
                      'Discussion': '#F59E0B',
                      'Proposal': '#6366F1',
                      'Negotiation': '#EC4899'
                    }[s] || '#063669';

                    return (
                      <button
                        key={s}
                        type="button"
                        role="option"
                        aria-selected={isSelected}
                        onClick={() => {
                          setIsStatusDropdownOpen(false);
                          handleStageClick(s);
                        }}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          gap: '0.5rem',
                          width: '100%',
                          padding: '0.45rem 0.65rem',
                          borderRadius: '6px',
                          border: 'none',
                          backgroundColor: isSelected ? '#EBF3FA' : 'transparent',
                          color: isSelected ? '#063669' : '#334155',
                          fontSize: '0.82rem',
                          fontWeight: isSelected ? 700 : 500,
                          cursor: 'pointer',
                          textAlign: 'left',
                          transition: 'background-color 0.15s ease, color 0.15s ease'
                        }}
                        onMouseEnter={(e) => {
                          if (!isSelected) e.currentTarget.style.backgroundColor = '#F8FAFC';
                        }}
                        onMouseLeave={(e) => {
                          if (!isSelected) e.currentTarget.style.backgroundColor = 'transparent';
                        }}
                      >
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
                          <span
                            style={{
                              width: '8px',
                              height: '8px',
                              borderRadius: '50%',
                              backgroundColor: stageColor,
                              flexShrink: 0
                            }}
                          />
                          <span>{s}</span>
                        </span>
                        {isSelected && (
                          <LuCheck size={14} color="#063669" style={{ strokeWidth: 2.5, flexShrink: 0 }} />
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 3. Main Content Grid */}
      <div className="lead-detail-main-grid" style={{ alignItems: 'stretch' }}>
        {/* Left Column - Main Details */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>

          {/* Key Contact Information Card */}
          <div className="section-card" style={{ marginBottom: 0 }}>
            <div className="section-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 className="section-title" style={{ margin: 0 }}>Lead Contact Information</h3>
              <button
                type="button"
                onClick={handleOpenEditModal}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  padding: '0.35rem 0.75rem',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  color: '#063669',
                  backgroundColor: '#F0F5FA',
                  border: '1px solid #D5E2EE',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#E6EFF8';
                  e.currentTarget.style.borderColor = '#063669';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#F0F5FA';
                  e.currentTarget.style.borderColor = '#D5E2EE';
                }}
                title="Edit Lead Contact Details"
              >
                <LuPencil size={13} />
                <span>Edit</span>
              </button>
            </div>

            <div className="detail-fields-grid">
              <div className="drawer-field-group">
                <div className="field-label">Full Name</div>
                <div className="field-value" style={{ fontWeight: 700, color: '#063669' }}>{lead.leadName}</div>
              </div>

              <div className="drawer-field-group">
                <div className="field-label">Company Account</div>
                <div
                  className="field-value"
                  style={{ fontWeight: 700, color: '#063669', textDecoration: 'underline', cursor: 'pointer' }}
                  onClick={() => onNavigateToAccount(lead.company)}
                >
                  {lead.company}
                </div>
              </div>

              <div className="drawer-field-group">
                <div className="field-label">Designation</div>
                <div className="field-value">{lead.designation}</div>
              </div>

              <div className="drawer-field-group">
                <div className="field-label">Lead Source</div>
                <div className="field-value">
                  <span className="status-chip new">{lead.leadSource}</span>
                </div>
              </div>

              <div className="drawer-field-group">
                <div className="field-label">Phone Number</div>
                <div
                  className="field-value"
                  style={{
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    color: '#063669'
                  }}
                  onClick={() => onQuickAction && onQuickAction('call', lead)}
                  title={`Click to call ${lead.leadName} (${lead.phoneNumber})`}
                >
                  <div style={{
                    width: '24px',
                    height: '24px',
                    borderRadius: '50%',
                    backgroundColor: '#E6EFF8',
                    color: '#063669',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}>
                    <LuPhone size={13} style={{ color: '#063669' }} />
                  </div>
                  <span style={{ textDecoration: 'underline' }}>{lead.phoneNumber}</span>
                </div>
              </div>
              <div className="drawer-field-group">
                <div className="field-label">Email ID</div>
                <div className="field-value" style={{ fontWeight: 600 }}>
                  <LuMail size={14} style={{ color: '#557396' }} /> {lead.emailId}
                </div>
              </div>
              <div className="drawer-field-group">
                <div className="field-label">Next Scheduled Follow-up</div>
                <div className="field-value" style={{ color: '#063669', fontWeight: 700 }}>
                  <LuClock size={14} style={{ display: 'inline', marginRight: 4 }} />
                  {lead.nextFollowup}
                </div>
              </div>
              <div className="drawer-field-group">
                <div className="field-label">Assigned Owner</div>
                <div className="field-value" style={{ fontWeight: 600 }}>{lead.leadOwner}</div>
              </div>
            </div>
          </div>

        </div>

        {/* Right Sidebar Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', height: '100%' }}>

          {/* Notes & Logged Requirements */}
          <div className="section-card" style={{ marginBottom: 0, height: '100%', boxSizing: 'border-box' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
              <h4 style={{ margin: 0, fontSize: '0.9rem', fontWeight: 700, color: '#063669' }}>Notes & Logged Requirements</h4>
              <button
                className="btn-primary"
                style={{ fontSize: '0.72rem', padding: '0.55rem 0.75rem', borderRadius: '20px', display: 'flex', alignItems: 'center', gap: '0.3rem', fontWeight: 600 }}
                onClick={() => onQuickAction('addNote', lead)}
              >
                <LuPlus size={13} /> Add Note
              </button>
            </div>
            {notesList.length > 0 && (
              <div style={{ fontSize: '0.7rem', color: '#94A3B8', fontWeight: 500, marginBottom: '0.75rem' }}>
                • Recent note
              </div>
            )}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              {notesList.length > 0 ? (
                <div style={{
                  background: '#F8FAFC',
                  border: '1px solid #E2E8F0',
                  borderRadius: '7px',
                  padding: '0.7rem 0.85rem',
                  fontSize: '0.82rem',
                  color: '#1E293B',
                  lineHeight: '1.55'
                }}>
                  {notesList[notesList.length - 1]}
                </div>
              ) : (
                <div style={{
                  fontSize: '0.82rem',
                  color: '#94A3B8',
                  fontStyle: 'italic',
                  padding: '1.25rem 0.85rem',
                  background: '#F8FAFC',
                  borderRadius: '7px',
                  border: '1px dashed #CBD5E1',
                  textAlign: 'center'
                }}>
                  No notes recorded yet. Click "+ Add Note" to log requirements.
                </div>
              )}
            </div>
          </div>


        </div>
      </div>

      {/* 4. Relational Activity, Calls, Chats, Enquiries, Followups, Mail Table */}
      <div className="section-card" style={{ marginTop: '1.25rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.75rem' }}>
          <div className="tab-header" style={{ marginBottom: 0, flexWrap: 'wrap' }}>
            {TABS.map(tab => (
              <div
                key={tab}
                className={`tab-item ${activeTab === tab ? 'active' : ''}`}
                onClick={() => setActiveTab(tab)}
                style={{ cursor: 'pointer' }}
              >
                {tab}
              </div>
            ))}
          </div>

          {activeTab === 'Activity' && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <button
                type="button"
                onClick={() => setPipelineSortOrder(prev => prev === 'desc' ? 'asc' : 'desc')}
                style={{
                  background: '#FFFFFF',
                  border: '1px solid #E2E8F0',
                  borderRadius: '8px',
                  padding: '0.4rem 0.75rem',
                  fontSize: '0.785rem',
                  fontWeight: 600,
                  color: '#063669',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  boxShadow: '0 1px 2px rgba(6, 54, 105, 0.04)',
                  transition: 'all 0.15s ease'
                }}
                title="Toggle sort order"
              >
                <LuArrowUpDown size={13} />
                {pipelineSortOrder === 'desc' ? 'Newest First' : 'Oldest First'}
              </button>
            </div>
          )}

          {activeTab !== 'Chats' && activeTab !== 'Activity' && activeTab !== 'Calls' && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <button
                className="btn-primary"
                onClick={() => handleLogAction(activeTab)}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.45rem',
                  fontSize: '0.825rem',
                  padding: '0.45rem 1.15rem',
                  borderRadius: '9999px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  boxShadow: '0 2px 6px rgba(6, 54, 105, 0.15)',
                  transition: 'all 0.18s ease'
                }}
                title={`${getLogCtaLabel(activeTab)} for ${lead.leadName}`}
              >
                <LuPlus size={15} /> {getLogCtaLabel(activeTab)}
              </button>
            </div>
          )}
        </div>

        {activeTab === 'Calls' ? (
          <LeadCallHistory
            lead={lead}
            calls={callActivities}
            onLogCall={() => handleLogAction('Calls')}
          />
        ) : activeTab === 'Chats' ? (
          <LeadChatHistory
            lead={lead}
            activities={leadActivities}
            onSendMessage={(msgText) => {
              if (onSaveAction) {
                onSaveAction('sms', { targetLeadId: lead.id, notes: msgText });
              }
            }}
          />
        ) : activeTab === 'Activity' ? (
          <LeadPipelineProgress
            lead={lead}
            sortOrder={pipelineSortOrder}
            onSelectStage={(stg) => handleStageClick(stg)}
            onUpdateStage={(stg) => handleStageClick(stg)}
          />
        ) : activeTab === 'Notes' ? (
          /* ── Notes Tab ── */
          (() => {
            const noteItems = (lead.notes || '')
              .split('\n')
              .map(n => n.trim())
              .filter(Boolean)
              .reverse();
            return (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {noteItems.length === 0 ? (
                  <div style={{
                    textAlign: 'center', padding: '2.5rem 1rem', color: '#557396',
                    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.6rem'
                  }}>
                    <LuFileText size={28} style={{ color: '#CBD5E1' }} />
                    <span style={{ fontSize: '0.875rem' }}>No notes logged for {lead.leadName} yet.</span>
                    <button
                      className="btn-secondary"
                      onClick={() => handleLogAction('Notes')}
                      style={{ fontSize: '0.75rem', padding: '0.35rem 0.8rem', display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}
                    >
                      <LuPlus size={13} /> Add Note
                    </button>
                  </div>
                ) : (
                  noteItems.map((note, idx) => (
                    <div
                      key={idx}
                      style={{
                        display: 'flex',
                        gap: '0.85rem',
                        alignItems: 'flex-start',
                        padding: '0.85rem 1rem',
                        backgroundColor: '#F8FAFC',
                        borderRadius: '8px',
                        border: '1px solid #E2E8F0',
                        transition: 'border-color 0.15s ease'
                      }}
                    >
                      {/* Icon */}
                      <div style={{
                        width: '32px', height: '32px', borderRadius: '8px',
                        backgroundColor: '#E0F2FE', flexShrink: 0,
                        display: 'flex', alignItems: 'center', justifyContent: 'center'
                      }}>
                        <LuFileText size={15} style={{ color: '#0369A1' }} />
                      </div>
                      {/* Content */}
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{
                          fontSize: '0.875rem', color: '#1E293B',
                          lineHeight: '1.6', whiteSpace: 'pre-wrap', wordBreak: 'break-word'
                        }}>
                          {note}
                        </div>
                        <div style={{
                          marginTop: '0.4rem', display: 'flex', alignItems: 'center',
                          gap: '0.6rem', flexWrap: 'wrap'
                        }}>
                          <span style={{ fontSize: '0.72rem', color: '#94A3B8' }}>
                            {lead.createdDate || 'Recent'}
                          </span>
                          <span style={{ fontSize: '0.72rem', color: '#94A3B8' }}>•</span>
                          <span style={{ fontSize: '0.72rem', fontWeight: 600, color: '#557396' }}>
                            {lead.leadOwner || 'Rajesh Sharma'}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            );
          })()
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table className="action-table">
              <thead>
                <tr>
                  <th style={{ width: '130px' }}>Type</th>
                  <th>Subject / Details</th>
                  <th style={{ width: '160px' }}>Date & Time</th>
                  <th style={{ width: '150px' }}>Logged By</th>
                  <th style={{ width: '130px' }}>Status / Outcome</th>
                  <th style={{ width: '90px' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredActivities.length === 0 ? (
                  <tr>
                    <td colSpan={6} style={{ textAlign: 'center', padding: '2.5rem 1rem', color: '#557396' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
                        <span>No {activeTab.toLowerCase()} records logged for {lead.leadName} yet.</span>
                        <button
                          className="btn-secondary"
                          onClick={() => handleLogAction(activeTab)}
                          style={{ fontSize: '0.75rem', padding: '0.35rem 0.8rem' }}
                        >
                          <LuPlus size={13} /> {getLogCtaLabel(activeTab)}
                        </button>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredActivities.map((act) => (
                    <tr
                      key={act.id}
                      onClick={() => setSelectedActivityForModal(act)}
                      style={{ cursor: 'pointer' }}
                      title="Click to view details"
                    >
                      <td>{renderTypeIcon(act.type)}</td>
                      <td>
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                          <span style={{ fontWeight: 600, color: '#063669' }}>
                            {act.subject || act.title || `${act.type} with ${lead.leadName}`}
                          </span>
                          {(act.notes || act.summary || act.shortPreview) && (
                            <span style={{
                              fontSize: '0.75rem',
                              color: '#557396',
                              whiteSpace: 'nowrap',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              maxWidth: '380px'
                            }}>
                              {act.notes || act.summary || act.shortPreview}
                            </span>
                          )}
                        </div>
                      </td>
                      <td style={{ color: '#557396', fontSize: '0.8rem', whiteSpace: 'nowrap' }}>
                        {act.date || act.dueTime || 'Recent'}
                      </td>
                      <td style={{ fontWeight: 500, color: '#063669' }}>
                        {act.owner || lead.leadOwner || 'Rajesh Sharma'}
                      </td>
                      <td>
                        <span className={`status-chip ${getStatusBadgeClass(act.status || act.outcome)}`} style={{ fontSize: '0.725rem' }}>
                          {act.status || act.outcome || 'Logged'}
                        </span>
                      </td>
                      <td>
                        <button
                          className="btn-secondary"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedActivityForModal(act);
                          }}
                          style={{
                            padding: '0.25rem 0.6rem',
                            fontSize: '0.725rem',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.2rem',
                            borderRadius: '5px'
                          }}
                          title="View details"
                        >
                          View <LuChevronRight size={12} />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

      </div>

      {/* Activity Details Inspection Modal */}
      {selectedActivityForModal && (
        <div
          className="modal-overlay"
          onClick={() => setSelectedActivityForModal(null)}
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(6, 54, 105, 0.45)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '1rem'
          }}
        >
          <div
            className="modal-card"
            onClick={(e) => e.stopPropagation()}
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '12px',
              maxWidth: (['Email', 'Mail', 'email', 'mail'].includes(selectedActivityForModal.type)) ? '680px' : '560px',
              width: '100%',
              boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
              overflow: 'hidden',
              border: '1px solid #E2E8F0',
              maxHeight: '90vh',
              display: 'flex',
              flexDirection: 'column'
            }}
          >
            {/* Modal Header */}
            <div style={{
              padding: '1.25rem 1.5rem',
              borderBottom: '1px solid #E2E8F0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              backgroundColor: '#F8FAFC',
              flexShrink: 0
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                {renderTypeIcon(selectedActivityForModal.type)}
                <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 700, color: '#063669' }}>
                  {(['Email', 'Mail', 'email', 'mail'].includes(selectedActivityForModal.type)) ? 'Email Record' : 'Activity Record'}
                </h3>
              </div>
              <button
                onClick={() => setSelectedActivityForModal(null)}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: '#64748B',
                  padding: '0.35rem',
                  borderRadius: '6px',
                  display: 'flex',
                  alignItems: 'center'
                }}
              >
                <LuX size={18} />
              </button>
            </div>

            {/* Modal Body */}
            <div style={{ overflowY: 'auto', flex: 1 }}>
              {(['Email', 'Mail', 'email', 'mail'].includes(selectedActivityForModal.type)) ? (
                /* ── Email-type: full Gmail-style corporate preview ── */
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  {/* Gmail top bar */}
                  <div style={{
                    padding: '0.6rem 1.25rem',
                    backgroundColor: '#F8FAFC',
                    borderBottom: '1px solid #E2E8F0',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }}>
                    <div style={{
                      width: '20px', height: '20px', borderRadius: '4px',
                      backgroundColor: '#EA4335', color: '#FFFFFF',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontWeight: 900, fontSize: '0.7rem',
                      boxShadow: '0 1px 3px rgba(234,67,53,0.3)'
                    }}>M</div>
                    <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#1E293B' }}>Gmail Preview</span>
                  </div>

                  {/* Thread subject row */}
                  <div style={{
                    padding: '0.85rem 1.25rem 0.55rem',
                    borderBottom: '1px solid #F1F5F9',
                    display: 'flex', alignItems: 'center', gap: '0.65rem'
                  }}>
                    <h4 style={{
                      margin: 0, fontSize: '0.975rem', fontWeight: 700,
                      color: '#1E293B', flex: 1, minWidth: 0,
                      overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'
                    }}>
                      {selectedActivityForModal.subject || selectedActivityForModal.title || '(No Subject)'}
                    </h4>
                    <span style={{
                      fontSize: '0.65rem', fontWeight: 600, color: '#475569',
                      backgroundColor: '#F1F5F9', padding: '0.1rem 0.4rem',
                      borderRadius: '4px', border: '1px solid #E2E8F0', flexShrink: 0
                    }}>Inbox</span>
                  </div>

                  {/* Sender meta row */}
                  <div style={{
                    padding: '0.8rem 1.25rem',
                    display: 'flex', alignItems: 'flex-start', gap: '0.7rem',
                    borderBottom: '1px solid #F1F5F9'
                  }}>
                    <div style={{
                      width: '36px', height: '36px', borderRadius: '50%',
                      backgroundColor: '#063669', color: '#FFFFFF',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '0.9rem', fontWeight: 700, flexShrink: 0
                    }}>
                      {(selectedActivityForModal.owner || lead.leadOwner || 'S').charAt(0).toUpperCase()}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: '0.5rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap' }}>
                          <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#1E293B' }}>
                            {selectedActivityForModal.owner || lead.leadOwner || 'System Administrator'}
                          </span>
                          <span style={{ fontSize: '0.7rem', color: '#64748B' }}>
                            &lt;admin@techgy.com&gt;
                          </span>
                        </div>
                        <span style={{ fontSize: '0.68rem', color: '#94A3B8', flexShrink: 0 }}>
                          {selectedActivityForModal.date || selectedActivityForModal.dueTime || 'Recent'}
                        </span>
                      </div>
                      <div style={{ fontSize: '0.73rem', color: '#64748B', marginTop: '0.2rem' }}>
                        to: <span style={{ fontWeight: 600, color: '#334155' }}>{lead.emailId || 'recipient@company.co.in'}</span>
                      </div>
                    </div>
                  </div>

                  {/* TechGy Corporate Banner */}
                  <div style={{
                    background: 'linear-gradient(135deg, #063669 0%, #0a4a8a 35%, #1565c0 60%, #0d47a1 80%, #063669 100%)',
                    height: '68px', position: 'relative', overflow: 'hidden'
                  }}>
                    {[
                      { bg: 'rgba(255,255,255,0.04)', width: '80px', right: '200px' },
                      { bg: 'rgba(255,255,255,0.07)', width: '70px', right: '140px' },
                      { bg: 'rgba(21,101,192,0.5)',   width: '65px', right: '85px'  },
                      { bg: 'rgba(255,255,255,0.09)', width: '55px', right: '38px'  },
                      { bg: 'rgba(255,255,255,0.06)', width: '45px', right: '0px'   },
                    ].map((s, i) => (
                      <div key={i} style={{
                        position: 'absolute', top: 0, bottom: 0,
                        right: s.right, width: s.width,
                        backgroundColor: s.bg,
                        transform: 'skewX(-12deg)', transformOrigin: 'top left'
                      }} />
                    ))}
                    <div style={{
                      position: 'relative', zIndex: 2,
                      display: 'flex', alignItems: 'center', gap: '0.6rem',
                      padding: '0 1.25rem', height: '100%'
                    }}>
                      <div style={{
                        width: '30px', height: '30px', borderRadius: '7px',
                        background: 'rgba(255,255,255,0.18)',
                        border: '1.5px solid rgba(255,255,255,0.35)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center'
                      }}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                          <path d="M12 2L2 7l10 5 10-5-10-5z" fill="white" opacity="0.9"/>
                          <path d="M2 17l10 5 10-5" stroke="white" strokeWidth="1.8" strokeLinecap="round" opacity="0.7"/>
                          <path d="M2 12l10 5 10-5" stroke="white" strokeWidth="1.8" strokeLinecap="round" opacity="0.5"/>
                        </svg>
                      </div>
                      <div>
                        <div style={{ color: '#FFFFFF', fontWeight: 800, fontSize: '0.95rem', letterSpacing: '0.02em', lineHeight: 1 }}>TechGy</div>
                        <div style={{ color: 'rgba(255,255,255,0.65)', fontSize: '0.55rem', fontWeight: 500, letterSpacing: '0.08em', marginTop: '2px' }}>ENTERPRISE CRM</div>
                      </div>
                    </div>
                  </div>

                  {/* Email white body */}
                  <div style={{ padding: '1.1rem 1.25rem', backgroundColor: '#FFFFFF' }}>
                    <div style={{ fontSize: '0.84rem', color: '#202124', marginBottom: '0.6rem', lineHeight: 1.6 }}>
                      Dear {lead.leadName},
                    </div>
                    <div style={{
                      fontSize: '0.84rem', color: '#202124', lineHeight: '1.7',
                      whiteSpace: 'pre-wrap', wordBreak: 'break-word', marginBottom: '1rem'
                    }}>
                      {selectedActivityForModal.notes || selectedActivityForModal.summary || selectedActivityForModal.shortPreview || '(No email body recorded.)'}
                    </div>
                    <div style={{ fontSize: '0.84rem', color: '#202124', marginBottom: '0.3rem', lineHeight: 1.7 }}>Thank you,</div>
                    <div style={{ fontSize: '0.84rem', fontWeight: 700, color: '#063669', marginBottom: '0.1rem' }}>
                      {selectedActivityForModal.owner || lead.leadOwner || 'System Administrator'}
                    </div>
                    <div style={{ fontSize: '0.73rem', color: '#64748B' }}>
                      This is a system generated message. Please do not reply to this email.
                    </div>
                    <div style={{ borderTop: '1px solid #E2E8F0', margin: '0.85rem 0' }} />
                    <div style={{
                      fontSize: '0.68rem', color: '#64748B', lineHeight: '1.6',
                      backgroundColor: '#F8FAFC', padding: '0.65rem 0.85rem', borderRadius: '6px'
                    }}>
                      This e-mail and any files transmitted with it are for the sole use of the intended recipient(s) and may contain confidential and privileged information. If you are not the intended recipient(s), please reply to the sender and destroy all copies of the original message. Any unauthorized review, use, disclosure, dissemination, forwarding, printing or copying of this email and/or any action taken in reliance on the contents of this e-mail is strictly prohibited and may be unlawful.
                    </div>
                    <div style={{ fontSize: '0.65rem', color: '#94A3B8', textAlign: 'center', marginTop: '0.65rem' }}>
                      © {new Date().getFullYear()} TechGy. All rights reserved.
                    </div>
                  </div>
                </div>
              ) : (
                /* ── Non-email: original activity layout ── */
                <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                  <div>
                    <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      Subject / Summary
                    </span>
                    <h4 style={{ margin: '0.35rem 0 0 0', fontSize: '1rem', fontWeight: 700, color: '#063669' }}>
                      {selectedActivityForModal.subject || selectedActivityForModal.title || `${selectedActivityForModal.type} with ${lead.leadName}`}
                    </h4>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', backgroundColor: '#F8FAFC', padding: '1rem', borderRadius: '8px', border: '1px solid #EDF2F7' }}>
                    <div>
                      <div style={{ fontSize: '0.725rem', color: '#64748B', fontWeight: 600 }}>Lead Contact</div>
                      <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#063669', marginTop: '0.2rem' }}>{lead.leadName}</div>
                    </div>
                    <div>
                      <div style={{ fontSize: '0.725rem', color: '#64748B', fontWeight: 600 }}>Company Account</div>
                      <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#063669', marginTop: '0.2rem' }}>{lead.company}</div>
                    </div>
                    <div>
                      <div style={{ fontSize: '0.725rem', color: '#64748B', fontWeight: 600 }}>Date & Time</div>
                      <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#334155', marginTop: '0.2rem' }}>{selectedActivityForModal.date || selectedActivityForModal.dueTime || 'Recent'}</div>
                    </div>
                    <div>
                      <div style={{ fontSize: '0.725rem', color: '#64748B', fontWeight: 600 }}>Logged By</div>
                      <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#334155', marginTop: '0.2rem' }}>{selectedActivityForModal.owner || lead.leadOwner || 'Rajesh Sharma'}</div>
                    </div>
                    <div>
                      <div style={{ fontSize: '0.725rem', color: '#64748B', fontWeight: 600 }}>Status / Outcome</div>
                      <div style={{ marginTop: '0.25rem' }}>
                        <span className={`status-chip ${getStatusBadgeClass(selectedActivityForModal.status || selectedActivityForModal.outcome)}`} style={{ fontSize: '0.725rem' }}>
                          {selectedActivityForModal.status || selectedActivityForModal.outcome || 'Logged'}
                        </span>
                      </div>
                    </div>
                    {selectedActivityForModal.duration && (
                      <div>
                        <div style={{ fontSize: '0.725rem', color: '#64748B', fontWeight: 600 }}>Duration</div>
                        <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#334155', marginTop: '0.2rem' }}>{selectedActivityForModal.duration}</div>
                      </div>
                    )}
                  </div>

                  {/* Full Notes / Logged Details */}
                  <div>
                    <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      Details & Notes
                    </span>
                    <div style={{
                      marginTop: '0.45rem',
                      padding: '0.85rem 1rem',
                      backgroundColor: '#FFFFFF',
                      border: '1px solid #E2E8F0',
                      borderRadius: '8px',
                      fontSize: '0.875rem',
                      lineHeight: '1.5',
                      color: '#1E293B',
                      whiteSpace: 'pre-wrap'
                    }}>
                      {selectedActivityForModal.notes || selectedActivityForModal.summary || selectedActivityForModal.shortPreview || 'No additional notes provided for this activity record.'}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div style={{
              padding: '1rem 1.5rem',
              borderTop: '1px solid #E2E8F0',
              display: 'flex',
              justifyContent: 'flex-end',
              backgroundColor: '#F8FAFC',
              flexShrink: 0
            }}>
              <button
                className="btn-secondary"
                onClick={() => setSelectedActivityForModal(null)}
                style={{ padding: '0.45rem 1.25rem', fontSize: '0.825rem', fontWeight: 600 }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}


      {/* Edit Lead Details Modal */}
      {isEditModalOpen && (
        <div
          className="modal-overlay"
          onClick={() => setIsEditModalOpen(false)}
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.65)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            padding: '1rem'
          }}
        >
          <div
            className="modal-content"
            onClick={(e) => e.stopPropagation()}
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '12px',
              width: '100%',
              maxWidth: '560px',
              maxHeight: '90vh',
              display: 'flex',
              flexDirection: 'column',
              boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.2), 0 8px 10px -6px rgba(0, 0, 0, 0.2)',
              overflow: 'hidden'
            }}
          >
            {/* Modal Header */}
            <div style={{
              padding: '1.25rem 1.5rem',
              borderBottom: '1px solid #E2E8F0',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              backgroundColor: '#F8FAFC'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <div style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '8px',
                  backgroundColor: '#E6EFF8',
                  color: '#063669',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <LuPencil size={16} />
                </div>
                <div>
                  <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 800, color: '#063669' }}>
                    Edit Lead Details
                  </h3>
                  <span style={{ fontSize: '0.75rem', color: '#64748B' }}>
                    Update contact info and assignment for {lead.leadName}
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsEditModalOpen(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#64748B',
                  cursor: 'pointer',
                  padding: '0.25rem',
                  display: 'flex',
                  alignItems: 'center',
                  borderRadius: '4px'
                }}
              >
                <LuX size={18} />
              </button>
            </div>

            {/* Modal Body / Form */}
            <form onSubmit={handleSaveEdit} style={{ display: 'flex', flexDirection: 'column', flex: 1, overflowY: 'auto' }}>
              <div style={{ padding: '1.25rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Full Name *</label>
                  <input
                    type="text"
                    className="form-input"
                    required
                    value={editForm.leadName}
                    onChange={(e) => setEditForm({ ...editForm, leadName: e.target.value })}
                    placeholder="e.g. Aarav Sharma"
                  />
                </div>

                <div className="form-grid-2">
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label">Company Name *</label>
                    <select
                      className="form-select"
                      required
                      value={editForm.company}
                      onChange={(e) => setEditForm({ ...editForm, company: e.target.value })}
                    >
                      <option value="">-- Select Company Account --</option>
                      {companyOptions.map(comp => (
                        <option key={comp} value={comp}>{comp}</option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label">Designation</label>
                    <input
                      type="text"
                      className="form-input"
                      value={editForm.designation}
                      onChange={(e) => setEditForm({ ...editForm, designation: e.target.value })}
                      placeholder="e.g. VP of Technology"
                    />
                  </div>
                </div>

                <div className="form-grid-2">
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label">Phone Number</label>
                    <input
                      type="tel"
                      className="form-input"
                      value={editForm.phoneNumber}
                      onChange={(e) => setEditForm({ ...editForm, phoneNumber: e.target.value })}
                      placeholder="+91 98765 43210"
                    />
                  </div>
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label">Email ID</label>
                    <input
                      type="email"
                      className="form-input"
                      value={editForm.emailId}
                      onChange={(e) => setEditForm({ ...editForm, emailId: e.target.value })}
                      placeholder="name@company.co.in"
                    />
                  </div>
                </div>

                <div className="form-grid-2">
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label">Lead Source</label>
                    <select
                      className="form-select"
                      value={editForm.leadSource}
                      onChange={(e) => setEditForm({ ...editForm, leadSource: e.target.value })}
                    >
                      {LEAD_SOURCES.map(src => (
                        <option key={src} value={src}>{src}</option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label">Assigned Owner</label>
                    <select
                      className="form-select"
                      value={editForm.leadOwner}
                      onChange={(e) => setEditForm({ ...editForm, leadOwner: e.target.value })}
                    >
                      {INITIAL_OWNERS.filter(o => o !== 'All Owners').map(o => (
                        <option key={o} value={o}>{o}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="form-grid-2">
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label">Priority</label>
                    <select
                      className="form-select"
                      value={editForm.priority}
                      onChange={(e) => setEditForm({ ...editForm, priority: e.target.value })}
                    >
                      <option value="High">High</option>
                      <option value="Medium">Medium</option>
                      <option value="Low">Low</option>
                    </select>
                  </div>
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label">Next Scheduled Follow-up</label>
                    <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '0.65rem' }}>
                      <FormDateSelector
                        value={editForm.followupDate}
                        onChange={(d) => setEditForm({ ...editForm, followupDate: d })}
                        placement="top"
                        align="right"
                      />
                      <select
                        className="form-select"
                        value={editForm.followupTime}
                        onChange={(e) => setEditForm({ ...editForm, followupTime: e.target.value })}
                      >
                        <option value="09:00 AM">09:00 AM</option>
                        <option value="09:30 AM">09:30 AM</option>
                        <option value="10:00 AM">10:00 AM</option>
                        <option value="10:30 AM">10:30 AM</option>
                        <option value="11:00 AM">11:00 AM</option>
                        <option value="11:30 AM">11:30 AM</option>
                        <option value="12:00 PM">12:00 PM</option>
                        <option value="01:30 PM">01:30 PM</option>
                        <option value="02:00 PM">02:00 PM</option>
                        <option value="02:30 PM">02:30 PM</option>
                        <option value="03:00 PM">03:00 PM</option>
                        <option value="03:30 PM">03:30 PM</option>
                        <option value="04:00 PM">04:00 PM</option>
                        <option value="04:30 PM">04:30 PM</option>
                        <option value="05:00 PM">05:00 PM</option>
                        <option value="05:30 PM">05:30 PM</option>
                        <option value="06:00 PM">06:00 PM</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div style={{
                padding: '1rem 1.5rem',
                borderTop: '1px solid #E2E8F0',
                display: 'flex',
                justifyContent: 'flex-end',
                gap: '0.75rem',
                backgroundColor: '#F8FAFC'
              }}>
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => setIsEditModalOpen(false)}
                  style={{ padding: '0.5rem 1.1rem', fontSize: '0.85rem' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    padding: '0.5rem 1.25rem',
                    fontSize: '0.85rem',
                    fontWeight: 700,
                    backgroundColor: '#063669',
                    color: '#FFFFFF'
                  }}
                >
                  <LuCheck size={14} />
                  <span>Save Changes</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Stage Change Confirmation Pop-up Modal */}
      <StageConfirmModal
        isOpen={isStageModalOpen}
        onClose={() => {
          setIsStageModalOpen(false);
          setPendingStage(null);
        }}
        onConfirm={handleConfirmStage}
        lead={lead}
        currentStage={lead.status}
        targetStage={pendingStage}
      />
    </div>
  );
}
