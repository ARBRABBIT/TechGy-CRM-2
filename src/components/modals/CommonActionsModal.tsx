import React, { useState, useEffect, useRef } from 'react';
import {
  LuX,
  LuFileText,
  LuBuilding2,
  LuPaperclip,
  LuChevronDown,
  LuCheck,
  LuUser,
  LuUsers,
  LuCalendar,
  LuLayers
} from 'react-icons/lu';

export const CREATABLE_ENTITY_TYPES = [
  {
    id: 'createLead',
    label: 'Lead',
    icon: <LuUser size={16} />,
    bgColor: '#EFF6FF',
    color: '#2563EB',
    description: 'Prospective customer or sales inquiry'
  },
  {
    id: 'createAccount',
    label: 'Company / Account',
    icon: <LuBuilding2 size={16} />,
    bgColor: '#F0FDF4',
    color: '#15803D',
    description: 'Enterprise organization or corporate client'
  },
  {
    id: 'createContact',
    label: 'Contact Person',
    icon: <LuUsers size={16} />,
    bgColor: '#FFF7ED',
    color: '#C2410C',
    description: 'Key decision-maker or company point of contact'
  },
  {
    id: 'createActivity',
    label: 'Activity / Task',
    icon: <LuCalendar size={16} />,
    bgColor: '#FEF2F2',
    color: '#DC2626',
    description: 'Scheduled meeting, task, or call'
  }
];
import { animateModalEnter } from '../../utils/animations';
import { INITIAL_OWNERS, LEAD_SOURCES, INITIAL_ACCOUNTS, INITIAL_EMAIL_TEMPLATES, SERVICES_OFFERED } from '../../data/mockData';
import { getTodayISO, getFutureISO } from '../../utils/dateUtils';
import FormDateSelector from '../common/FormDateSelector';
import { can, SAVE_ACTION_PERMISSION } from '../../utils/permissions';
import useDialog from '../../hooks/useDialog';
import useSubmitGuard from '../../hooks/useSubmitGuard';
import { validate, ACTION_RULES, isEmail, findDuplicateLead } from '../../utils/validation';

function CompanyAutocompleteInput({
  value,
  onChange,
  companies = [],
  placeholder = "e.g. Acme Technologies Ltd",
  required = false,
  className = "form-input",
  id,
  name
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const wrapperRef = useRef(null);

  const trimmedQuery = (value || '').trim().toLowerCase();

  // Filter matching companies
  const matchingCompanies = trimmedQuery.length > 0
    ? companies.filter(c => c.toLowerCase().includes(trimmedQuery))
    : [];

  useEffect(() => {
    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (companyName) => {
    onChange(companyName);
    setIsOpen(false);
    setHighlightedIndex(-1);
  };

  const handleKeyDown = (e) => {
    if (!isOpen || matchingCompanies.length === 0) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHighlightedIndex(prev => (prev + 1) % matchingCompanies.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlightedIndex(prev => (prev - 1 + matchingCompanies.length) % matchingCompanies.length);
    } else if (e.key === 'Enter') {
      if (highlightedIndex >= 0 && highlightedIndex < matchingCompanies.length) {
        e.preventDefault();
        handleSelect(matchingCompanies[highlightedIndex]);
      }
    } else if (e.key === 'Escape') {
      setIsOpen(false);
    }
  };

  const isNewCompany = trimmedQuery.length > 0 && matchingCompanies.length === 0;

  return (
    <div ref={wrapperRef} style={{ position: 'relative', width: '100%' }}>
      <input
        type="text"
        className={className}
        required={required}
        placeholder={placeholder}
        value={value}
        autoComplete="off"
        id={id}
        name={name}
        onChange={(e) => {
          onChange(e.target.value);
          setIsOpen(true);
          setHighlightedIndex(-1);
        }}
        onFocus={() => {
          if (trimmedQuery.length > 0 && matchingCompanies.length > 0) {
            setIsOpen(true);
          }
        }}
        onKeyDown={handleKeyDown}
      />
      {isNewCompany && (
        <div style={{
          fontSize: '0.75rem',
          color: '#0369A1',
          fontWeight: 600,
          display: 'flex',
          alignItems: 'center',
          gap: '0.375rem',
          marginTop: '0.375rem'
        }}>
          <span style={{
            display: 'inline-block',
            width: '6px',
            height: '6px',
            borderRadius: '50%',
            backgroundColor: '#0284C7'
          }} />
          You are creating a new company
        </div>
      )}
      {isOpen && matchingCompanies.length > 0 && (
        <div
          style={{
            position: 'absolute',
            top: 'calc(100% + 4px)',
            left: 0,
            right: 0,
            backgroundColor: '#FFFFFF',
            border: '1px solid #CBD5E1',
            borderRadius: 'var(--radius-popup, 3px)',
            boxShadow: '0 10px 25px -5px rgba(6, 54, 105, 0.15), 0 8px 10px -6px rgba(6, 54, 105, 0.1)',
            zIndex: 100,
            maxHeight: '200px',
            overflowY: 'auto',
            padding: '4px'
          }}
        >
          <div style={{
            padding: '4px 8px 6px 8px',
            fontSize: '0.75rem',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            color: '#64748B',
            borderBottom: '1px solid #F1F5F9',
            marginBottom: '2px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <span>Existing CRM Companies</span>
            <span style={{ fontSize: '0.6875rem', color: '#0F1A34', fontWeight: 600 }}>{matchingCompanies.length} found</span>
          </div>
          {matchingCompanies.map((comp, idx) => {
            const isHighlighted = idx === highlightedIndex;
            return (
              <div
                key={comp}
                onMouseDown={(e) => {
                  e.preventDefault();
                  handleSelect(comp);
                }}
                onMouseEnter={() => setHighlightedIndex(idx)}
                style={{
                  padding: '8px 10px',
                  borderRadius: 'var(--radius)',
                  cursor: 'pointer',
                  backgroundColor: isHighlighted ? '#F0F5FA' : 'transparent',
                  color: isHighlighted ? '#0F1A34' : '#1E293B',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontSize: '0.875rem',
                  fontWeight: 500,
                  transition: 'background-color 0.15s ease'
                }}
              >
                <div style={{
                  width: '24px',
                  height: '24px',
                  borderRadius: 'var(--radius)',
                  backgroundColor: isHighlighted ? '#E0ECF8' : '#F1F5F9',
                  color: '#0F1A34',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  <LuBuilding2 size={14} />
                </div>
                <div style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {comp}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}



export default function CommonActionsModal({
  isOpen,
  onClose,
  onSave,
  initialType = 'createLead',
  lockType = false,
  selectedLead = null,
  selectedAccount = null,
  bulkLeadIds = [],
  leads = [],
  accounts = [],
  currentUser = null,
  emailTemplates = []
}) {
  const [actionType, setActionType] = useState(initialType);
  // Only offer record types this user is allowed to create
  const creatableTypes = CREATABLE_ENTITY_TYPES.filter(t => can(currentUser, SAVE_ACTION_PERMISSION[t.id]));
  const [isTypeDropdownOpen, setIsTypeDropdownOpen] = useState(false);
  const typeDropdownRef = useRef(null);
  const [targetLeadId, setTargetLeadId] = useState('');
  const [emailAttachments, setEmailAttachments] = useState([]);
  const [selectedEmailTemplate, setSelectedEmailTemplate] = useState('');
  const [ccEmails, setCcEmails] = useState([]);
  const [ccInput, setCcInput] = useState('');

  useEffect(() => {
    function handleClickOutside(event) {
      if (typeDropdownRef.current && !typeDropdownRef.current.contains(event.target)) {
        setIsTypeDropdownOpen(false);
      }
    }
    function handleKeyDown(event) {
      if (event.key === 'Escape') {
        setIsTypeDropdownOpen(false);
      }
    }
    if (isTypeDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isTypeDropdownOpen]);

  const availableEmailTemplates = (emailTemplates && emailTemplates.length > 0 ? emailTemplates : INITIAL_EMAIL_TEMPLATES);

  const [formData, setFormData] = useState({
    leadName: '',
    company: '',
    companyName: '',
    industry: 'Technology & IT Services',
    companySize: '51-200 employees',
    website: '',
    location: 'Mumbai, Maharashtra',
    estimatedAccountValue: '₹50,00,000',
    primaryContact: '',
    tier: 'Strategic Enterprise',
    serviceProviding: 'TechGy CRM Enterprise Suite',
    phone: '',
    email: '',
    designation: '',
    leadSource: 'Website',
    owner: currentUser?.name || 'Unassigned',
    status: 'New',
    priority: 'Medium',
    notes: '',
    subject: '',
    outcome: 'Connected - Positive',
    duration: '15 mins',
    activityType: 'Meeting',
    nextAction: '',
    dueDate: getTodayISO(),
    followupTime: '10:30 AM',
    opportunityName: '',
    estimatedValue: '',
    currentStage: 'Qualified',
    probability: '60%',
    closeDate: getFutureISO(30)
  });

  const overlayRef = useRef(null);
  const cardRef = useRef(null);

  // Extract all existing unique company names in CRM
  const allExistingCompanies = React.useMemo(() => {
    const companiesSet = new Set();
    if (leads && Array.isArray(leads)) {
      leads.forEach(l => {
        if (l?.company && typeof l.company === 'string' && l.company.trim()) {
          companiesSet.add(l.company.trim());
        }
      });
    }
    if (accounts && Array.isArray(accounts)) {
      accounts.forEach(a => {
        const name = a?.companyName || a?.company;
        if (name && typeof name === 'string' && name.trim()) {
          companiesSet.add(name.trim());
        }
      });
    }
    if (INITIAL_ACCOUNTS && Array.isArray(INITIAL_ACCOUNTS)) {
      INITIAL_ACCOUNTS.forEach(a => {
        if (a?.companyName) companiesSet.add(a.companyName.trim());
      });
    }
    return Array.from(companiesSet).sort((a, b) => a.localeCompare(b));
  }, [leads, accounts]);

  useEffect(() => {
    if (isOpen && cardRef.current) {
      animateModalEnter(cardRef.current, overlayRef.current);
    }
  }, [isOpen]);
  useDialog(cardRef, isOpen, onClose);

  const isLeadScopedActionType = (type) => [
    'addNote',
    'assignOwner',
    'changeStatus',
    'scheduleFollowup',
    'call',
    'email',
    'sms'
  ].includes(type);

  // Errors are shown (and recomputed live) only after a failed submit; reset when the modal opens or the type changes
  const [submitAttempted, setSubmitAttempted] = useState(false);
  const { isSubmitting, run: runSubmit } = useSubmitGuard();
  useEffect(() => {
    setSubmitAttempted(false);
  }, [isOpen, actionType]);

  // Sync actionType and prefilled target lead when modal opens or initialType changes
  useEffect(() => {
    if (isOpen) {
      const type = initialType || 'createLead';
      setActionType(type);

      if (isLeadScopedActionType(type)) {
        // Always reset email-specific compose fields on every open so previous sends don't bleed through
        if (type === 'email') {
          setEmailAttachments([]);
          setSelectedEmailTemplate('');
          setCcEmails([]);
          setCcInput('');
          setFormData(prev => ({
            ...prev,
            subject: '',
            notes: '',
            cc: ''
          }));
        }

        if (selectedLead) {
          setTargetLeadId(selectedLead.id);
          setFormData(prev => ({
            ...prev,
            leadName: selectedLead.leadName || '',
            company: selectedLead.company || '',
            phone: selectedLead.phoneNumber || '',
            email: selectedLead.emailId || '',
            designation: selectedLead.designation || '',
            owner: selectedLead.leadOwner || currentUser?.name || 'Rajesh Sharma',
            status: selectedLead.status || 'New'
          }));
        } else if (leads.length > 0) {
          const defaultLead = leads[0];
          setTargetLeadId(prev => (prev && leads.some(l => l.id === prev) ? prev : defaultLead.id));
          setFormData(prev => ({
            ...prev,
            leadName: defaultLead.leadName || '',
            company: defaultLead.company || '',
            phone: defaultLead.phoneNumber || '',
            email: defaultLead.emailId || '',
            designation: defaultLead.designation || '',
            owner: defaultLead.leadOwner || currentUser?.name || 'Rajesh Sharma',
            status: defaultLead.status || 'New'
          }));
        }
      } else {
        // Entity creation actions (createLead, createOpportunity, createContact, etc.)
        // Pre-fill company name if an account is selected or active
        const prefilledCompany = selectedAccount
          ? (selectedAccount.companyName || selectedAccount.company || '')
          : (selectedLead ? (selectedLead.company || '') : '');

        const prefilledOwner = selectedAccount?.accountOwner || selectedLead?.leadOwner || currentUser?.name || 'Rajesh Sharma';

        setTargetLeadId('');
        setFormData(prev => ({
          ...prev,
          leadName: '',
          company: prefilledCompany,
          phone: '',
          email: '',
          designation: '',
          leadSource: 'Website',
          owner: prefilledOwner,
          status: 'New',
          priority: 'Medium',
          notes: '',
          subject: '',
          outcome: 'Connected - Positive',
          duration: '15 mins',
          activityType: 'Meeting',
          nextAction: '',
          dueDate: getTodayISO(),
          followupTime: '10:30 AM',
          opportunityName: prefilledCompany ? `${prefilledCompany} Opportunity` : '',
          estimatedValue: '',
          currentStage: 'Qualified',
          probability: '60%',
          closeDate: getFutureISO(30)
        }));
      }
    }
  }, [isOpen, initialType, selectedLead, selectedAccount, leads, currentUser]);


  if (!isOpen) return null;

  const isLeadScoped = isLeadScopedActionType(actionType);

  const activeTargetLead = selectedLead || leads.find(l => l.id === targetLeadId) || null;

  const handleTargetLeadChange = (chosenId) => {
    setTargetLeadId(chosenId);
    const chosen = leads.find(l => l.id === chosenId);
    if (chosen) {
      setFormData(prev => {
        let updatedSubject = prev.subject;
        let updatedNotes = prev.notes;
        if (selectedEmailTemplate) {
          const tpl = availableEmailTemplates.find(t => t.id === selectedEmailTemplate);
          if (tpl) {
            updatedSubject = tpl.subject
              .replace(/\{leadName\}/g, chosen.leadName || 'there')
              .replace(/\{company\}/g, chosen.company || 'your organization');
            updatedNotes = tpl.body
              .replace(/\{leadName\}/g, chosen.leadName || 'there')
              .replace(/\{company\}/g, chosen.company || 'your organization');
          }
        }
        return {
          ...prev,
          leadName: chosen.leadName || '',
          company: chosen.company || '',
          phone: chosen.phoneNumber || '',
          email: chosen.emailId || '',
          designation: chosen.designation || '',
          owner: chosen.leadOwner || prev.owner,
          status: chosen.status || prev.status,
          subject: updatedSubject,
          notes: updatedNotes
        };
      });
    }
  };

  const handleEmailTemplateChange = (templateId) => {
    setSelectedEmailTemplate(templateId);
    if (!templateId) return;

    const tpl = availableEmailTemplates.find(t => t.id === templateId);
    if (!tpl) return;

    const targetLeadObj = selectedLead || leads.find(l => l.id === targetLeadId);
    const leadName = formData.leadName || targetLeadObj?.leadName || 'there';
    const company = formData.company || targetLeadObj?.company || 'your organization';

    const processedSubject = tpl.subject
      .replace(/\{leadName\}/g, leadName)
      .replace(/\{company\}/g, company);

    const processedBody = tpl.body
      .replace(/\{leadName\}/g, leadName)
      .replace(/\{company\}/g, company);

    setFormData(prev => ({
      ...prev,
      subject: processedSubject,
      notes: processedBody
    }));
  };


  const handleAddCcEmail = (rawText) => {
    if (!rawText) return;
    const parts = rawText
      .split(/[,;\s]+/)
      .map(s => s.trim())
      .filter(s => s.length > 0 && s.includes('@'));

    if (parts.length > 0) {
      setCcEmails(prev => {
        const set = new Set([...prev, ...parts]);
        return Array.from(set);
      });
      setCcInput('');
    }
  };

  const handleCcKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ',' || e.key === ';') {
      e.preventDefault();
      handleAddCcEmail(ccInput);
    } else if (e.key === 'Backspace' && !ccInput && ccEmails.length > 0) {
      setCcEmails(prev => prev.slice(0, -1));
    }
  };

  const handleCcBlur = () => {
    if (ccInput.trim()) {
      handleAddCcEmail(ccInput);
    }
  };

  const handleRemoveCcEmail = (indexToRemove) => {
    setCcEmails(prev => prev.filter((_, idx) => idx !== indexToRemove));
  };

  const isBulk = bulkLeadIds && bulkLeadIds.length > 1;
  const bulkCount = bulkLeadIds ? bulkLeadIds.length : 0;

  const validateAction = () => {
    const found = validate(formData, ACTION_RULES[actionType] || {});

    if (isLeadScoped && !isBulk && !(selectedLead?.id || targetLeadId)) {
      found.targetLeadId = 'Choose a lead for this action.';
    }
    if (actionType === 'email') {
      const badCc = ccEmails.find(addr => !isEmail(addr));
      if (badCc) found.cc = `“${badCc}” isn’t a valid email address.`;
    }
    if (actionType === 'createLead' && !found.email && !found.phone) {
      const dup = findDuplicateLead(leads, formData);
      if (dup) {
        const field = formData.email && dup.emailId?.toLowerCase() === formData.email.trim().toLowerCase() ? 'email' : 'phone';
        found[field] = `Already used by lead “${dup.leadName}” (${dup.id}).`;
      }
    }
    if (actionType === 'createAccount' && !found.companyName) {
      const name = (formData.companyName || formData.company || '').trim().toLowerCase();
      if (accounts.some(a => (a.companyName || '').toLowerCase() === name)) {
        found.companyName = 'A company account with this name already exists.';
      }
    }
    return found;
  };

  const errors = submitAttempted ? validateAction() : {};

  const handleSubmit = (e) => {
    e.preventDefault();
    const found = validateAction();
    if (Object.keys(found).length > 0) {
      setSubmitAttempted(true);
      requestAnimationFrame(() => cardRef.current?.querySelector('[aria-invalid="true"]')?.focus());
      return;
    }
    runSubmit(() => submitAction());
  };

  const submitAction = () => {
    const submissionData = { ...formData };
    if (actionType === 'scheduleFollowup' && formData.followupTime) {
      submissionData.dueTime = `${formData.dueDate} ${formData.followupTime}`;
      submissionData.date = `${formData.dueDate} ${formData.followupTime}`;
    }
    if (actionType === 'email') {
      submissionData.cc = ccEmails.join(', ');
      submissionData.ccEmails = ccEmails;
    }
    onSave(actionType, {
      ...submissionData,
      targetLeadId: isLeadScoped ? (selectedLead?.id || targetLeadId) : undefined,
      bulkLeadIds: bulkLeadIds && bulkLeadIds.length > 0 ? bulkLeadIds : undefined
    });
    onClose();
  };

  const getModalTitle = () => {
    switch (actionType) {
      case 'call': return 'Log Call';
      case 'email': return isBulk ? `Send Email (${bulkCount} Leads)` : 'Send / Log Email';
      case 'sms': return 'Log WhatsApp Message';
      case 'createAccount': return 'Create Company Account';
      case 'createLead': return 'Create New Lead';
      case 'createActivity': return 'Log Activity / Task';
      case 'createContact': return 'Add Account Contact';
      case 'assignOwner': return isBulk ? `Reassign Owner (${bulkCount} Leads)` : 'Reassign Lead Owner';
      case 'changeStatus': return isBulk ? `Update Stage (${bulkCount} Leads)` : 'Change Lead Status';
      case 'addNote': return 'Add Note / Requirement Context';
      case 'scheduleFollowup': return 'Schedule Lead Follow-up';
      default: return 'Common Action Workspace';
    }
  };

  return (
    <div className="modal-overlay" ref={overlayRef} onClick={onClose}>
      <div
        className="modal-card"
        ref={cardRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="common-actions-title"
        onClick={(e) => e.stopPropagation()}
        style={{
          maxWidth: actionType === 'email' ? '1040px' : '620px',
          width: actionType === 'email' ? '95vw' : '100%',
          transition: 'max-width 0.2s ease, width 0.2s ease'
        }}
      >
        <div className="modal-header">
          <h3 id="common-actions-title" style={{ fontSize: '1.125rem', fontWeight: 700, color: '#0F1A34', margin: 0 }}>
            {getModalTitle()}
          </h3>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#557396' }}>
            <LuX size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          <div className="modal-body">
            {Object.keys(errors).length > 0 && (
              <div className="form-error-summary" role="alert">
                {Object.keys(errors).length === 1
                  ? Object.values(errors)[0]
                  : `Please fix the ${Object.keys(errors).length} highlighted fields.`}
              </div>
            )}
            {/* Target Lead Selector for non-email lead-scoped actions (email renders it inside left column) */}
            {isLeadScoped && actionType !== 'email' && (
              isBulk ? (
                <div style={{
                  marginBottom: '1.125rem',
                  padding: '0.75rem 0.875rem',
                  background: '#F0F5FA',
                  borderRadius: 'var(--radius)',
                  border: '1px solid #D5E2EE'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.375rem' }}>
                    <span style={{ fontSize: '0.8125rem', color: '#557396', fontWeight: 600 }}>
                      Selected Leads ({bulkCount}):
                    </span>
                    <span style={{
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      color: '#0F1A34',
                      background: '#E6EFF8',
                      padding: '0.125rem 0.5rem',
                      borderRadius: 'var(--radius)'
                    }}>
                      Bulk Action
                    </span>
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.375rem', maxHeight: '90px', overflowY: 'auto' }}>
                    {leads.filter(l => bulkLeadIds.includes(l.id)).map(l => (
                      <span key={l.id} style={{
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        color: '#0F1A34',
                        background: '#FFFFFF',
                        border: '1px solid #D5E2EE',
                        borderRadius: '4px',
                        padding: '0.125rem 0.5rem'
                      }}>
                        {l.leadName} ({l.company})
                      </span>
                    ))}
                  </div>
                </div>
              ) : selectedLead ? (
                <div style={{
                  marginBottom: '1.125rem',
                  padding: '0.625rem 0.875rem',
                  background: '#F0F5FA',
                  borderRadius: 'var(--radius)',
                  border: '1px solid #D5E2EE',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <span style={{ fontSize: '0.8125rem', color: '#557396', fontWeight: 500 }}>Target Lead:</span>
                  <span style={{ fontSize: '0.875rem', fontWeight: 700, color: '#0F1A34' }}>
                    {selectedLead.leadName} • {selectedLead.company}
                  </span>
                </div>
              ) : (
                <div className="form-group" style={{ marginBottom: '1.125rem' }}>
                  <label className="form-label">Target Lead *</label>
                  <select aria-invalid={errors.targetLeadId ? true : undefined} aria-describedby={errors.targetLeadId ? 'err-targetLeadId' : undefined} aria-label="Target Lead"
                    className="form-select"
                    value={targetLeadId}
                    onChange={(e) => handleTargetLeadChange(e.target.value)}
                    required
                  >
                    {leads.map(l => (
                      <option key={l.id} value={l.id}>
                        {l.leadName} – {l.company} ({l.status})
                      </option>
                    ))}
                  </select>
{errors.targetLeadId && <span id="err-targetLeadId" className="field-error">{errors.targetLeadId}</span>}
                </div>
              )
            )}

            {/* Record Type Dropdown Selector inside popup for creatable entities */}
            {!lockType && creatableTypes.length > 1 && creatableTypes.some(t => t.id === actionType) && (
              <div className="form-group">
                <label className="form-label">What would you like to create? *</label>
                <div ref={typeDropdownRef} style={{ position: 'relative', width: '100%' }}>
                  {(() => {
                    const currentOpt = creatableTypes.find(t => t.id === actionType) || creatableTypes[0];
                    return (
                      <>
                        <button
                          type="button"
                          onClick={() => setIsTypeDropdownOpen(prev => !prev)}
                          className="form-input"
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            cursor: 'pointer',
                            textAlign: 'left',
                            backgroundColor: isTypeDropdownOpen ? '#FFFFFF' : '#F8FAFC',
                            boxShadow: isTypeDropdownOpen ? '0 0 0 2px rgba(6, 54, 105, 0.15)' : 'none',
                            color: '#0F1A34',
                            fontWeight: 500,
                            fontSize: '0.875rem',
                            padding: '0.625rem 0.875rem',
                            borderRadius: '4px'
                          }}
                          aria-haspopup="listbox"
                          aria-expanded={isTypeDropdownOpen}
                        >
                          <span>{currentOpt.label}</span>
                          <LuChevronDown
                            size={16}
                            style={{
                              color: '#0F1A34',
                              transform: isTypeDropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                              transition: 'transform 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                              flexShrink: 0
                            }}
                          />
                        </button>

                        {isTypeDropdownOpen && (
                          <div
                            role="listbox"
                            style={{
                              position: 'absolute',
                              top: 'calc(100% + 6px)',
                              left: 0,
                              right: 0,
                              backgroundColor: '#FFFFFF',
                              border: '1px solid #D5E2EE',
                              borderRadius: 'var(--radius)',
                              boxShadow: '0 12px 28px -4px rgba(6, 54, 105, 0.16), 0 6px 12px -4px rgba(6, 54, 105, 0.08)',
                              padding: '0.375rem',
                              zIndex: 1050,
                              display: 'flex',
                              flexDirection: 'column',
                              gap: '2px',
                              animation: 'applePopIn 0.18s cubic-bezier(0.16, 1, 0.3, 1)'
                            }}
                          >
                            {creatableTypes.map(opt => {
                              const isSelected = opt.id === actionType;
                              return (
                                <button
                                  key={opt.id}
                                  type="button"
                                  role="option"
                                  aria-selected={isSelected}
                                  onClick={() => {
                                    setActionType(opt.id);
                                    setIsTypeDropdownOpen(false);
                                  }}
                                  style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    padding: '0.5rem 0.875rem',
                                    borderRadius: 'var(--radius)',
                                    border: 'none',
                                    backgroundColor: isSelected ? '#EBF3FA' : 'transparent',
                                    color: isSelected ? '#0F1A34' : '#334155',
                                    fontSize: '0.875rem',
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
                                  <span>{opt.label}</span>
                                  {isSelected && (
                                    <LuCheck size={16} color="#0F1A34" style={{ strokeWidth: 2.5, flexShrink: 0 }} />
                                  )}
                                </button>
                              );
                            })}
                          </div>
                        )}
                      </>
                    );
                  })()}
                </div>
              </div>
            )}

            {/* Dynamic Form Fields */}
            {actionType === 'createAccount' && (
              <>
                <div className="form-group">
                  <label className="form-label">Company / Account Name *</label>
                  <input name="companyName" aria-invalid={errors.companyName ? true : undefined} aria-describedby={errors.companyName ? 'err-companyName' : undefined} aria-label="Company / Account Name"
                    type="text"
                    className="form-input"
                    required
                    placeholder="e.g. Tata Consultancy Tech Ltd"
                    value={formData.companyName || formData.company}
                    onChange={(e) => setFormData({ ...formData, companyName: e.target.value, company: e.target.value })}
                  />
{errors.companyName && <span id="err-companyName" className="field-error">{errors.companyName}</span>}
                </div>
                <div className="form-grid-2">
                  <div className="form-group">
                    <label className="form-label">Industry *</label>
                    <select aria-label="Industry"
                      className="form-select"
                      value={formData.industry || 'Technology & IT Services'}
                      onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                    >
                      <option value="Technology & IT Services">Technology & IT Services</option>
                      <option value="Finance & Banking">Finance & Banking</option>
                      <option value="Healthcare & Pharma">Healthcare & Pharma</option>
                      <option value="Manufacturing & Industrial">Manufacturing & Industrial</option>
                      <option value="Retail & E-commerce">Retail & E-commerce</option>
                      <option value="Energy & CleanTech">Energy & CleanTech</option>
                      <option value="Consulting & Services">Consulting & Services</option>
                      <option value="Telecom & Media">Telecom & Media</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Company Size</label>
                    <select aria-label="Company Size"
                      className="form-select"
                      value={formData.companySize || '51-200 employees'}
                      onChange={(e) => setFormData({ ...formData, companySize: e.target.value })}
                    >
                      <option value="1-10 employees">1-10 employees (Startup)</option>
                      <option value="11-50 employees">11-50 employees (Small)</option>
                      <option value="51-200 employees">51-200 employees (Mid-market)</option>
                      <option value="201-500 employees">201-500 employees (Commercial)</option>
                      <option value="500+ employees">500+ employees (Enterprise)</option>
                    </select>
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Service Providing</label>
                  <select aria-label="Service Providing"
                    className="form-select"
                    value={formData.serviceProviding || 'TechGy CRM Enterprise Suite'}
                    onChange={(e) => setFormData({ ...formData, serviceProviding: e.target.value })}
                  >
                    {SERVICES_OFFERED.map(srv => <option key={srv} value={srv}>{srv}</option>)}
                  </select>
                </div>
                <div className="form-grid-2">
                  <div className="form-group">
                    <label className="form-label">Location / Headquarters</label>
                    <input aria-label="Location / Headquarters"
                      type="text"
                      className="form-input"
                      placeholder="e.g. Mumbai, Maharashtra"
                      value={formData.location || ''}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Website URL</label>
                    <input name="website" aria-invalid={errors.website ? true : undefined} aria-describedby={errors.website ? 'err-website' : undefined} aria-label="Website URL"
                      type="text"
                      className="form-input"
                      placeholder="e.g. https://www.tataconsultancy.com"
                      value={formData.website || ''}
                      onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                    />
{errors.website && <span id="err-website" className="field-error">{errors.website}</span>}
                  </div>
                </div>
                <div className="form-grid-2">
                  <div className="form-group">
                    <label className="form-label">Account Owner</label>
                    <select name="owner" aria-invalid={errors.owner ? true : undefined} aria-describedby={errors.owner ? 'err-owner' : undefined} aria-label="Account Owner"
                      className="form-select"
                      value={formData.owner}
                      onChange={(e) => setFormData({ ...formData, owner: e.target.value })}
                    >
                      {INITIAL_OWNERS.filter(o => o !== 'All Owners').map(o => (
                        <option key={o} value={o}>{o}</option>
                      ))}
                    </select>
{errors.owner && <span id="err-owner" className="field-error">{errors.owner}</span>}
                  </div>
                  <div className="form-group">
                    <label className="form-label">Account Tier</label>
                    <select aria-label="Account Tier"
                      className="form-select"
                      value={formData.tier || 'Strategic Enterprise'}
                      onChange={(e) => setFormData({ ...formData, tier: e.target.value })}
                    >
                      <option value="Strategic Enterprise">Strategic Enterprise</option>
                      <option value="High Priority">High Priority</option>
                      <option value="Standard Account">Standard Account</option>
                      <option value="Growth Tier">Growth Tier</option>
                    </select>
                  </div>
                </div>
                <div className="form-grid-2">
                  <div className="form-group">
                    <label className="form-label">Estimated Annual Value</label>
                    <input aria-label="Estimated Annual Value"
                      type="text"
                      className="form-input"
                      placeholder="e.g. ₹75,00,000"
                      value={formData.estimatedAccountValue || ''}
                      onChange={(e) => setFormData({ ...formData, estimatedAccountValue: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Primary Contact Person</label>
                    <input aria-label="Primary Contact Person"
                      type="text"
                      className="form-input"
                      placeholder="e.g. Rajiv Menon"
                      value={formData.primaryContact || ''}
                      onChange={(e) => setFormData({ ...formData, primaryContact: e.target.value })}
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Company Overview / Notes</label>
                  <textarea name="notes" aria-invalid={errors.notes ? true : undefined} aria-describedby={errors.notes ? 'err-notes' : undefined} aria-label="Company Overview / Notes"
                    className="form-input"
                    rows={2}
                    placeholder="Key strategic background, tech stack, or account notes..."
                    value={formData.notes || ''}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  />
{errors.notes && <span id="err-notes" className="field-error">{errors.notes}</span>}
                </div>
              </>
            )}


            {actionType === 'createLead' && (
              <>
                <div className="form-group">
                  <label className="form-label">Lead Name *</label>
                  <input name="leadName" aria-invalid={errors.leadName ? true : undefined} aria-describedby={errors.leadName ? 'err-leadName' : undefined} aria-label="Lead Name"
                    type="text"
                    className="form-input"
                    required
                    placeholder="e.g. Vikram Malhotra"
                    value={formData.leadName}
                    onChange={(e) => setFormData({ ...formData, leadName: e.target.value })}
                  />
{errors.leadName && <span id="err-leadName" className="field-error">{errors.leadName}</span>}
                </div>
                <div className="form-grid-2">
                  <div className="form-group">
                    <label className="form-label">Company Name *</label>
                    <CompanyAutocompleteInput name="company" aria-invalid={errors.company ? true : undefined} aria-describedby={errors.company ? 'err-company' : undefined}
                      required
                      placeholder="e.g. Acme Technologies Ltd"
                      value={formData.company}
                      onChange={(val) => setFormData({ ...formData, company: val })}
                      companies={allExistingCompanies}
                    />
{errors.company && <span id="err-company" className="field-error">{errors.company}</span>}
                  </div>
                  <div className="form-group">
                    <label className="form-label">Designation</label>
                    <input name="designation" aria-invalid={errors.designation ? true : undefined} aria-describedby={errors.designation ? 'err-designation' : undefined} aria-label="Designation"
                      type="text"
                      className="form-input"
                      placeholder="e.g. VP of Technology"
                      value={formData.designation}
                      onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                    />
{errors.designation && <span id="err-designation" className="field-error">{errors.designation}</span>}
                  </div>
                </div>
                <div className="form-grid-2">
                  <div className="form-group">
                    <label className="form-label">Phone Number</label>
                    <input name="phone" aria-invalid={errors.phone ? true : undefined} aria-describedby={errors.phone ? 'err-phone' : undefined} aria-label="Phone Number"
                      type="tel"
                      inputMode="numeric"
                      className="form-input"
                      placeholder="+91 98765 43210"
                      value={formData.phone}
                      onChange={(e) => {
                        const numericOnly = e.target.value.replace(/[^0-9+\s-]/g, '');
                        setFormData({ ...formData, phone: numericOnly });
                      }}
                    />
{errors.phone && <span id="err-phone" className="field-error">{errors.phone}</span>}
                  </div>
                  <div className="form-group">
                    <label className="form-label">Email ID</label>
                    <input name="email" aria-invalid={errors.email ? true : undefined} aria-describedby={errors.email ? 'err-email' : undefined} aria-label="Email ID"
                      type="email"
                      className="form-input"
                      placeholder="name@company.co.in"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
{errors.email && <span id="err-email" className="field-error">{errors.email}</span>}
                  </div>
                </div>
                <div className="form-grid-2">
                  <div className="form-group">
                    <label className="form-label">Lead Source</label>
                    <select aria-label="Lead Source"
                      className="form-select"
                      value={formData.leadSource}
                      onChange={(e) => setFormData({ ...formData, leadSource: e.target.value })}
                    >
                      {LEAD_SOURCES.map(src => <option key={src} value={src}>{src}</option>)}
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Assign Owner</label>
                    <select name="owner" aria-invalid={errors.owner ? true : undefined} aria-describedby={errors.owner ? 'err-owner' : undefined} aria-label="Assign Owner"
                      className="form-select"
                      value={formData.owner}
                      onChange={(e) => setFormData({ ...formData, owner: e.target.value })}
                    >
                      {INITIAL_OWNERS.filter(o => o !== 'All Owners').map(o => <option key={o} value={o}>{o}</option>)}
                    </select>
{errors.owner && <span id="err-owner" className="field-error">{errors.owner}</span>}
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Service Providing</label>
                  <select aria-label="Service Providing"
                    className="form-select"
                    value={formData.serviceProviding || 'TechGy CRM Enterprise Suite'}
                    onChange={(e) => setFormData({ ...formData, serviceProviding: e.target.value })}
                  >
                    {SERVICES_OFFERED.map(srv => <option key={srv} value={srv}>{srv}</option>)}
                  </select>
                </div>
              </>
            )}

            {actionType === 'createActivity' && (
              <>
                <div className="form-group">
                  <label className="form-label">Activity Title / Subject *</label>
                  <input name="nextAction" aria-invalid={errors.nextAction ? true : undefined} aria-describedby={errors.nextAction ? 'err-nextAction' : undefined} aria-label="Activity Title / Subject"
                    type="text"
                    className="form-input"
                    required
                    placeholder="e.g. Technical Discovery Call on Enterprise Security"
                    value={formData.nextAction}
                    onChange={(e) => setFormData({ ...formData, nextAction: e.target.value })}
                  />
{errors.nextAction && <span id="err-nextAction" className="field-error">{errors.nextAction}</span>}
                </div>
                <div className="form-grid-2">
                  <div className="form-group">
                    <label className="form-label">Activity Type</label>
                    <select aria-label="Activity Type"
                      className="form-select"
                      value={formData.activityType}
                      onChange={(e) => setFormData({ ...formData, activityType: e.target.value })}
                    >
                      <option value="Meeting">Meeting</option>
                      <option value="Call">Call</option>
                      <option value="Follow-up">Follow-up</option>
                      <option value="Email">Email</option>
                      <option value="Presentation">Presentation</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Account / Company</label>
                    <CompanyAutocompleteInput name="company" aria-invalid={errors.company ? true : undefined} aria-describedby={errors.company ? 'err-company' : undefined}
                      placeholder="e.g. Reliance Cloud Solutions"
                      value={formData.company}
                      onChange={(val) => setFormData({ ...formData, company: val })}
                      companies={allExistingCompanies}
                    />
{errors.company && <span id="err-company" className="field-error">{errors.company}</span>}
                  </div>
                </div>
                <div className="form-grid-2">
                  <div className="form-group">
                    <label className="form-label">Activity Date</label>
                    <FormDateSelector
                      value={formData.dueDate}
                      onChange={(d) => setFormData({ ...formData, dueDate: d })}
                      placement="top"
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Assign Owner</label>
                    <select name="owner" aria-invalid={errors.owner ? true : undefined} aria-describedby={errors.owner ? 'err-owner' : undefined} aria-label="Assign Owner"
                      className="form-select"
                      value={formData.owner}
                      onChange={(e) => setFormData({ ...formData, owner: e.target.value })}
                    >
                      {INITIAL_OWNERS.filter(o => o !== 'All Owners').map(o => <option key={o} value={o}>{o}</option>)}
                    </select>
{errors.owner && <span id="err-owner" className="field-error">{errors.owner}</span>}
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Notes / Agenda</label>
                  <textarea name="notes" aria-invalid={errors.notes ? true : undefined} aria-describedby={errors.notes ? 'err-notes' : undefined} aria-label="Notes / Agenda"
                    className="form-textarea"
                    rows={3}
                    placeholder="Provide discussion topics or preparation notes..."
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  />
{errors.notes && <span id="err-notes" className="field-error">{errors.notes}</span>}
                </div>
              </>
            )}

            {actionType === 'call' && (
              <>
                <div className="form-grid-2">
                  <div className="form-group">
                    <label className="form-label">Call Outcome *</label>
                    <select name="outcome" aria-invalid={errors.outcome ? true : undefined} aria-describedby={errors.outcome ? 'err-outcome' : undefined} aria-label="Call Outcome"
                      className="form-select"
                      value={formData.outcome}
                      onChange={(e) => setFormData({ ...formData, outcome: e.target.value })}
                    >
                      <option value="Connected - Positive">Connected - Positive</option>
                      <option value="Connected - Needs Follow-up">Connected - Needs Follow-up</option>
                      <option value="Connected - Not Interested">Connected - Not Interested</option>
                      <option value="Left Voicemail">Left Voicemail</option>
                      <option value="Busy / No Answer">Busy / No Answer</option>
                      <option value="Scheduled Callback">Scheduled Callback</option>
                    </select>
{errors.outcome && <span id="err-outcome" className="field-error">{errors.outcome}</span>}
                  </div>
                  <div className="form-group">
                    <label className="form-label">Call Duration</label>
                    <select aria-label="Call Duration"
                      className="form-select"
                      value={formData.duration}
                      onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                    >
                      <option value="5 mins">5 mins</option>
                      <option value="15 mins">15 mins</option>
                      <option value="30 mins">30 mins</option>
                      <option value="45 mins">45 mins</option>
                      <option value="60 mins">60 mins</option>
                    </select>
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Call Discussion Summary & Notes *</label>
                  <textarea name="notes" aria-invalid={errors.notes ? true : undefined} aria-describedby={errors.notes ? 'err-notes' : undefined} aria-label="Call Discussion Summary & Notes"
                    className="form-textarea"
                    rows={4}
                    required
                    placeholder="Key discussion points, objections raised, or agreed next steps..."
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  />
{errors.notes && <span id="err-notes" className="field-error">{errors.notes}</span>}
                </div>
              </>
            )}

            {actionType === 'email' && (
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(330px, 1fr))',
                gap: '1.5rem',
                alignItems: 'stretch'
              }}>
                {/* Left Column: Email Form Inputs */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem', height: '100%' }}>
                  {/* Target Lead Selector */}
                  {isBulk ? (
                    <div style={{
                      padding: '0.75rem 0.875rem',
                      background: '#F0F5FA',
                      borderRadius: 'var(--radius)',
                      border: '1px solid #D5E2EE'
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.375rem' }}>
                        <span style={{ fontSize: '0.8125rem', color: '#557396', fontWeight: 600 }}>
                          Selected Leads ({bulkCount}):
                        </span>
                        <span style={{
                          fontSize: '0.75rem',
                          fontWeight: 700,
                          color: '#0F1A34',
                          background: '#E6EFF8',
                          padding: '0.125rem 0.5rem',
                          borderRadius: 'var(--radius)'
                        }}>
                          Bulk Action
                        </span>
                      </div>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.375rem', maxHeight: '75px', overflowY: 'auto' }}>
                        {leads.filter(l => bulkLeadIds.includes(l.id)).map(l => (
                          <span key={l.id} style={{
                            fontSize: '0.75rem',
                            fontWeight: 600,
                            color: '#0F1A34',
                            background: '#FFFFFF',
                            border: '1px solid #D5E2EE',
                            borderRadius: '4px',
                            padding: '0.125rem 0.5rem'
                          }}>
                            {l.leadName} ({l.company})
                          </span>
                        ))}
                      </div>
                    </div>
                  ) : selectedLead ? (
                    <div style={{
                      padding: '0.625rem 0.875rem',
                      background: '#F0F5FA',
                      borderRadius: 'var(--radius)',
                      border: '1px solid #D5E2EE',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}>
                      <span style={{ fontSize: '0.8125rem', color: '#557396', fontWeight: 500 }}>Target Lead:</span>
                      <span style={{ fontSize: '0.875rem', fontWeight: 700, color: '#0F1A34' }}>
                        {selectedLead.leadName} • {selectedLead.company}
                      </span>
                    </div>
                  ) : (
                    <div className="form-group" style={{ marginBottom: 0 }}>
                      <label className="form-label">Target Lead *</label>
                      <select aria-invalid={errors.targetLeadId ? true : undefined} aria-describedby={errors.targetLeadId ? 'err-targetLeadId' : undefined} aria-label="Target Lead"
                        className="form-select"
                        value={targetLeadId}
                        onChange={(e) => handleTargetLeadChange(e.target.value)}
                        required
                      >
                        {leads.map(l => (
                          <option key={l.id} value={l.id}>
                            {l.leadName} – {l.company} ({l.status})
                          </option>
                        ))}
                      </select>
{errors.targetLeadId && <span id="err-targetLeadId" className="field-error">{errors.targetLeadId}</span>}
                    </div>
                  )}

                  {/* 1. Select a Template Dropdown Field (First Field) */}
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label">Select a Template</label>
                    <select aria-label="Select a Template"
                      className="form-select"
                      value={selectedEmailTemplate}
                      onChange={(e) => handleEmailTemplateChange(e.target.value)}
                    >
                      <option value="">-- Choose an Email Template (Optional) --</option>
                      {availableEmailTemplates.filter(t => t.status !== 'Inactive').map(tpl => (
                        <option key={tpl.id} value={tpl.id}>
                          {tpl.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label">Recipient Email *</label>
                    <input name="email" aria-invalid={errors.email ? true : undefined} aria-describedby={errors.email ? 'err-email' : undefined} aria-label="Recipient Email"
                      type="email"
                      className="form-input"
                      required
                      placeholder="contact@company.co.in"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
{errors.email && <span id="err-email" className="field-error">{errors.email}</span>}
                  </div>

                  {/* Multi-Email CC Field */}
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.25rem' }}>
                      <label className="form-label" style={{ margin: 0 }}>CC (Carbon Copy)</label>
                      {ccEmails.length > 0 && (
                        <span style={{ fontSize: '0.6875rem', color: '#0369A1', fontWeight: 600 }}>
                          {ccEmails.length} {ccEmails.length === 1 ? 'recipient' : 'recipients'}
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
                      {ccEmails.map((email, idx) => (
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
                            onClick={() => handleRemoveCcEmail(idx)}
                            title="Remove email"
                          />
                        </span>
                      ))}
                      <input aria-invalid={errors.cc ? true : undefined} aria-describedby={errors.cc ? 'err-cc' : undefined} aria-label="Add CC email"
                        type="text"
                        placeholder={ccEmails.length === 0 ? "Add CC emails (type and press Enter or comma)..." : "Add more..."}
                        value={ccInput}
                        onChange={(e) => setCcInput(e.target.value)}
                        onKeyDown={handleCcKeyDown}
                        onBlur={handleCcBlur}
                        style={{
                          flex: 1,
                          minWidth: '150px',
                          border: 'none',
                          outline: 'none',
                          fontSize: '0.8125rem',
                          color: '#1E293B',
                          padding: '0.25rem 0',
                          backgroundColor: 'transparent'
                        }}
                      />
{errors.cc && <span id="err-cc" className="field-error">{errors.cc}</span>}
                    </div>
                  </div>

                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label">Subject *</label>
                    <input name="subject" aria-invalid={errors.subject ? true : undefined} aria-describedby={errors.subject ? 'err-subject' : undefined} aria-label="Subject"
                      type="text"
                      className="form-input"
                      required
                      placeholder="e.g. Follow-up: TechGy CRM Solution Overview & Commercials"
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    />
{errors.subject && <span id="err-subject" className="field-error">{errors.subject}</span>}
                  </div>

                  <div className="form-group" style={{ marginBottom: 0, display: 'flex', flexDirection: 'column', flex: 1 }}>
                    <label className="form-label">Email Body / Summary *</label>
                    <div style={{
                      display: 'flex',
                      flexDirection: 'column',
                      flex: 1,
                      border: '1px solid #CBD5E1',
                      borderRadius: 'var(--radius)',
                      backgroundColor: '#FFFFFF',
                      overflow: 'hidden',
                      boxShadow: '0 1px 2px rgba(6, 54, 105, 0.03)',
                      transition: 'border-color 0.15s ease'
                    }}>
                      <textarea name="notes" aria-invalid={errors.notes ? true : undefined} aria-describedby={errors.notes ? 'err-notes' : undefined} aria-label="Email Body / Summary"
                        required
                        placeholder="Enter sent email body or summary notes..."
                        value={formData.notes}
                        onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                        style={{
                          flex: 1,
                          minHeight: '135px',
                          resize: 'none',
                          width: '100%',
                          border: 'none',
                          outline: 'none',
                          padding: '0.75rem 0.875rem',
                          fontSize: '0.875rem',
                          color: '#1E293B',
                          backgroundColor: 'transparent',
                          fontFamily: 'inherit',
                          boxSizing: 'border-box'
                        }}
                      />
{errors.notes && <span id="err-notes" className="field-error">{errors.notes}</span>}

                      {/* Attachment Toolbar Inside Container at Bottom */}
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '0.5rem 0.75rem',
                        borderTop: '1px solid #F1F5F9',
                        backgroundColor: '#F8FAFC',
                        gap: '0.5rem',
                        flexWrap: 'wrap'
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                          {/* Attachment Button */}
                          <label
                            style={{
                              cursor: 'pointer',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '0.375rem',
                              color: emailAttachments.length > 0 ? '#0284C7' : '#557396',
                              backgroundColor: emailAttachments.length > 0 ? '#E0F2FE' : '#FFFFFF',
                              border: '1px solid',
                              borderColor: emailAttachments.length > 0 ? '#BAE6FD' : '#E2E8F0',
                              padding: '0.25rem 0.5rem',
                              borderRadius: 'var(--radius)',
                              fontSize: '0.75rem',
                              fontWeight: 600,
                              userSelect: 'none',
                              transition: 'all 0.15s ease'
                            }}
                            title="Attach a file"
                          >
                            <LuPaperclip size={14} style={{ color: emailAttachments.length > 0 ? '#0284C7' : '#557396' }} />
                            <span>Attach</span>
                            <input
                              type="file"
                              multiple
                              style={{ display: 'none' }}
                              onChange={(e) => {
                                if (e.target.files && e.target.files.length > 0) {
                                  const newFiles = Array.from(e.target.files).map(f => ({
                                    name: f.name,
                                    size: (f.size / 1024).toFixed(1) + ' KB'
                                  }));
                                  setEmailAttachments(prev => [...prev, ...newFiles]);
                                }
                              }}
                            />
                          </label>

                          {/* Render Attached Files */}
                          {emailAttachments.map((file, idx) => (
                            <span
                              key={idx}
                              style={{
                                fontSize: '0.6875rem',
                                color: '#0369A1',
                                backgroundColor: '#E0F2FE',
                                border: '1px solid #BAE6FD',
                                padding: '0.125rem 0.5rem',
                                borderRadius: '4px',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '0.25rem',
                                maxWidth: '130px',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap'
                              }}
                              title={`${file.name} (${file.size})`}
                            >
                              <LuFileText size={12} />
                              <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>{file.name}</span>
                              <LuX
                                size={12}
                                style={{ cursor: 'pointer', flexShrink: 0, marginLeft: '2px' }}
                                onClick={(e) => {
                                  e.preventDefault();
                                  setEmailAttachments(prev => prev.filter((_, i) => i !== idx));
                                }}
                              />
                            </span>
                          ))}
                        </div>

                        <span style={{ fontSize: '0.6875rem', color: '#64748B', flexShrink: 0 }}>
                          {formData.notes.length} characters
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Column: Authentic Gmail Message Live Preview */}
                <div style={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: 'var(--radius)',
                  border: '1px solid #E2E8F0',
                  boxShadow: '0 4px 14px rgba(6, 54, 105, 0.06)',
                  display: 'flex',
                  flexDirection: 'column',
                  overflow: 'hidden',
                  minHeight: 0
                }}>
                  {/* Gmail Window Top Header Bar */}
                  <div style={{
                    padding: '0.625rem 1rem',
                    backgroundColor: '#F8FAFC',
                    borderBottom: '1px solid #E2E8F0',
                    display: 'flex',
                    alignItems: 'center',
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
                        letterSpacing: '-0.03em',
                        boxShadow: '0 1px 3px rgba(234, 67, 53, 0.3)'
                      }}>
                        M
                      </div>
                      <span style={{ fontSize: '0.875rem', fontWeight: 700, color: '#1E293B' }}>
                        Gmail Live Preview
                      </span>
                    </div>
                  </div>

                  {/* Scrollable Email Thread Wrapper */}
                  <div style={{
                    flex: 1,
                    overflowY: 'auto',
                    display: 'flex',
                    flexDirection: 'column',
                    minHeight: 0
                  }}>
                    {/* Thread Subject Row */}
                    <div style={{
                      padding: '0.875rem 1.125rem 0.625rem',
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
                        color: formData.subject.trim() ? '#1E293B' : '#94A3B8',
                        letterSpacing: '-0.01em',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                        flex: 1,
                        minWidth: 0
                      }}>
                        {formData.subject.trim() || '(No Subject)'}
                      </h4>
                      <span style={{
                        fontSize: '0.6875rem',
                        fontWeight: 600,
                        color: '#475569',
                        backgroundColor: '#F1F5F9',
                        padding: '0.125rem 0.5rem',
                        borderRadius: '4px',
                        border: '1px solid #E2E8F0',
                        flexShrink: 0
                      }}>
                        Inbox
                      </span>
                    </div>

                    {/* Sender Meta Row */}
                    <div style={{
                      padding: '0.875rem 1.125rem',
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '0.75rem',
                      borderBottom: '1px solid #F1F5F9',
                      flexShrink: 0
                    }}>
                      <div style={{
                        width: '38px',
                        height: '38px',
                        borderRadius: '50%',
                        backgroundColor: '#0F1A34',
                        color: '#FFFFFF',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '0.9375rem',
                        fontWeight: 700,
                        flexShrink: 0
                      }}>
                        {(currentUser?.name || formData.owner || 'S').charAt(0).toUpperCase()}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: '0.5rem' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', flexWrap: 'wrap' }}>
                            <span style={{ fontSize: '0.875rem', fontWeight: 700, color: '#1E293B' }}>
                              {currentUser?.name || 'System Administrator'}
                            </span>
                            <span style={{ fontSize: '0.75rem', color: '#64748B' }}>
                              &lt;{currentUser?.email || 'admin@techgy.com'}&gt;
                            </span>
                          </div>
                          <span style={{ fontSize: '0.6875rem', color: '#64748B', flexShrink: 0 }}>
                            Today, {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                        <div style={{ fontSize: '0.75rem', color: '#64748B', marginTop: '0.25rem' }}>
                          to: <span style={{ fontWeight: 600, color: '#334155' }}>
                            {formData.email.trim() || (selectedLead?.emailId || 'recipient@company.co.in')}
                          </span>
                        </div>
                        {ccEmails.length > 0 && (
                          <div style={{ fontSize: '0.75rem', color: '#64748B', marginTop: '0.125rem' }}>
                            cc: <span style={{ fontWeight: 600, color: '#0369A1' }}>
                              {ccEmails.join(', ')}
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
                        padding: '0',
                        position: 'relative',
                        overflow: 'hidden',
                        height: '72px',
                        flexShrink: 0
                      }}>
                        {/* Geometric chevron shapes (Cognizant-style facets) */}
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
                        {/* TechGy Brandmark */}
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

                      {/* White email body area */}
                      <div style={{ padding: '1.125rem 1.25rem', flex: 1, backgroundColor: '#FFFFFF' }}>

                        {/* Salutation */}
                        <div style={{ fontSize: '0.875rem', color: '#202124', marginBottom: '0.625rem', lineHeight: 1.6 }}>
                          Dear {formData.leadName || (selectedLead?.leadName) || 'Hiring Manager'},
                        </div>

                        {/* Dynamic Body Content */}
                        {formData.notes.trim() ? (
                          <div style={{
                            fontSize: '0.8125rem',
                            color: '#202124',
                            lineHeight: '1.7',
                            whiteSpace: 'pre-wrap',
                            wordBreak: 'break-word',
                            marginBottom: '1rem'
                          }}>
                            {formData.notes}
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
                            Start typing your email body in the box on the left, and it will appear here in real-time.
                          </div>
                        )}

                        {/* Sign-off */}
                        <div style={{ fontSize: '0.8125rem', color: '#202124', marginBottom: '0.375rem', lineHeight: 1.7 }}>
                          Thank you,
                        </div>
                        <div style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#0F1A34', marginBottom: '0.125rem' }}>
                          {currentUser?.name || 'System Administrator'}
                        </div>
                        <div style={{ fontSize: '0.75rem', color: '#64748B' }}>
                          This is a system generated message. Please do not reply to this email.
                        </div>

                        {/* Divider */}
                        <div style={{ borderTop: '1px solid #E2E8F0', margin: '0.875rem 0' }} />

                        {/* Legal Disclaimer Footer */}
                        <div style={{
                          fontSize: '0.6875rem',
                          color: '#64748B',
                          lineHeight: '1.6',
                          backgroundColor: '#F8FAFC',
                          padding: '0.75rem 0.875rem',
                          borderRadius: 'var(--radius)'
                        }}>
                          This e-mail and any files transmitted with it are for the sole use of the intended recipient(s) and may contain confidential and privileged information. If you are not the intended recipient(s), please reply to the sender and destroy all copies of the original message. Any unauthorized review, use, disclosure, dissemination, forwarding, printing or copying of this email and/or any action taken in reliance on the contents of this e-mail is strictly prohibited and may be unlawful.
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
            )}

            {actionType === 'sms' && (
              <>
                <div className="form-group">
                  <label className="form-label">WhatsApp / Phone Number *</label>
                  <input name="phone" aria-invalid={errors.phone ? true : undefined} aria-describedby={errors.phone ? 'err-phone' : undefined} aria-label="WhatsApp / Phone Number"
                    type="tel"
                    className="form-input"
                    required
                    placeholder="+91 98765 00000"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
{errors.phone && <span id="err-phone" className="field-error">{errors.phone}</span>}
                </div>
                <div className="form-group">
                  <label className="form-label">WhatsApp Message Context *</label>
                  <textarea name="notes" aria-invalid={errors.notes ? true : undefined} aria-describedby={errors.notes ? 'err-notes' : undefined} aria-label="WhatsApp Message Context"
                    className="form-textarea"
                    rows={4}
                    required
                    placeholder="Briefly describe message sent or conversation summary..."
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  />
{errors.notes && <span id="err-notes" className="field-error">{errors.notes}</span>}
                </div>
              </>
            )}



            {actionType === 'createContact' && (
              <>
                <div className="form-grid-2">
                  <div className="form-group">
                    <label className="form-label">Contact Name *</label>
                    <input name="leadName" aria-invalid={errors.leadName ? true : undefined} aria-describedby={errors.leadName ? 'err-leadName' : undefined} aria-label="Contact Name"
                      type="text"
                      className="form-input"
                      required
                      placeholder="e.g. Rajesh Khurana"
                      value={formData.leadName}
                      onChange={(e) => setFormData({ ...formData, leadName: e.target.value })}
                    />
{errors.leadName && <span id="err-leadName" className="field-error">{errors.leadName}</span>}
                  </div>
                  <div className="form-group">
                    <label className="form-label">Designation</label>
                    <input name="designation" aria-invalid={errors.designation ? true : undefined} aria-describedby={errors.designation ? 'err-designation' : undefined} aria-label="Designation"
                      type="text"
                      className="form-input"
                      placeholder="e.g. VP Operations"
                      value={formData.designation}
                      onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                    />
{errors.designation && <span id="err-designation" className="field-error">{errors.designation}</span>}
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Company Name *</label>
                  <CompanyAutocompleteInput name="company" aria-invalid={errors.company ? true : undefined} aria-describedby={errors.company ? 'err-company' : undefined}
                    required
                    placeholder="e.g. Infosys Digital Systems"
                    value={formData.company}
                    onChange={(val) => setFormData({ ...formData, company: val })}
                    companies={allExistingCompanies}
                  />
{errors.company && <span id="err-company" className="field-error">{errors.company}</span>}
                </div>
                <div className="form-grid-2">
                  <div className="form-group">
                    <label className="form-label">Email</label>
                    <input name="email" aria-invalid={errors.email ? true : undefined} aria-describedby={errors.email ? 'err-email' : undefined} aria-label="Email"
                      type="email"
                      className="form-input"
                      placeholder="r.khurana@infosys.co.in"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
{errors.email && <span id="err-email" className="field-error">{errors.email}</span>}
                  </div>
                  <div className="form-group">
                    <label className="form-label">Phone Number</label>
                    <input name="phone" aria-invalid={errors.phone ? true : undefined} aria-describedby={errors.phone ? 'err-phone' : undefined} aria-label="Phone Number"
                      type="tel"
                      className="form-input"
                      placeholder="+91 98765 11111"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    />
{errors.phone && <span id="err-phone" className="field-error">{errors.phone}</span>}
                  </div>
                </div>
              </>
            )}

            {actionType === 'assignOwner' && (
              <div className="form-group">
                <label className="form-label">Select New Owner *</label>
                <select name="owner" aria-invalid={errors.owner ? true : undefined} aria-describedby={errors.owner ? 'err-owner' : undefined} aria-label="Select New Owner"
                  className="form-select"
                  value={formData.owner}
                  onChange={(e) => setFormData({ ...formData, owner: e.target.value })}
                >
                  {INITIAL_OWNERS.filter(o => o !== 'All Owners').map(o => <option key={o} value={o}>{o}</option>)}
                </select>
{errors.owner && <span id="err-owner" className="field-error">{errors.owner}</span>}
                {activeTargetLead && (
                  <div style={{ fontSize: '0.75rem', color: '#557396', marginTop: '0.375rem' }}>
                    Currently assigned to: <strong>{activeTargetLead.leadOwner}</strong>
                  </div>
                )}
              </div>
            )}

            {actionType === 'changeStatus' && (
              <div className="form-group">
                <label className="form-label">New Status *</label>
                <select name="status" aria-invalid={errors.status ? true : undefined} aria-describedby={errors.status ? 'err-status' : undefined} aria-label="New Status"
                  className="form-select"
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                >
                  <option value="New">New</option>
                  <option value="Contacted">Contacted</option>
                  <option value="Qualified">Qualified</option>
                  <option value="Discussion">Discussion</option>
                  <option value="Proposal">Proposal</option>
                  <option value="Negotiation">Negotiation</option>
                  <option value="Won">Won</option>
                  <option value="Lost">Lost</option>
                </select>
{errors.status && <span id="err-status" className="field-error">{errors.status}</span>}
                {activeTargetLead && (
                  <div style={{ fontSize: '0.75rem', color: '#557396', marginTop: '0.375rem' }}>
                    Current status: <strong>{activeTargetLead.status}</strong>
                  </div>
                )}
              </div>
            )}

            {actionType === 'addNote' && (
              <div className="form-group">
                <label className="form-label">Note / Requirement Context *</label>
                <textarea name="notes" aria-invalid={errors.notes ? true : undefined} aria-describedby={errors.notes ? 'err-notes' : undefined} aria-label="Note / Requirement Context"
                  className="form-textarea"
                  rows={4}
                  required
                  placeholder="Enter context, conversation summary or requirement notes..."
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                />
{errors.notes && <span id="err-notes" className="field-error">{errors.notes}</span>}
              </div>
            )}

            {actionType === 'scheduleFollowup' && (
              <>
                <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '0.875rem' }}>
                  <div className="form-group">
                    <label className="form-label">Follow-up Date *</label>
                    <FormDateSelector
                      value={formData.dueDate}
                      onChange={(d) => setFormData({ ...formData, dueDate: d })}
                      placement="bottom"
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Follow-up Time</label>
                    <select aria-label="Follow-up Time"
                      className="form-select"
                      value={formData.followupTime || '10:30 AM'}
                      onChange={(e) => setFormData({ ...formData, followupTime: e.target.value })}
                    >
                      <option value="09:00 AM">09:00 AM (Morning)</option>
                      <option value="09:30 AM">09:30 AM</option>
                      <option value="10:00 AM">10:00 AM</option>
                      <option value="10:30 AM">10:30 AM</option>
                      <option value="11:00 AM">11:00 AM</option>
                      <option value="11:30 AM">11:30 AM</option>
                      <option value="12:00 PM">12:00 PM (Noon)</option>
                      <option value="01:30 PM">01:30 PM</option>
                      <option value="02:00 PM">02:00 PM</option>
                      <option value="02:30 PM">02:30 PM</option>
                      <option value="03:00 PM">03:00 PM</option>
                      <option value="03:30 PM">03:30 PM</option>
                      <option value="04:00 PM">04:00 PM</option>
                      <option value="04:30 PM">04:30 PM</option>
                      <option value="05:00 PM">05:00 PM</option>
                      <option value="05:30 PM">05:30 PM</option>
                      <option value="06:00 PM">06:00 PM (Evening)</option>
                    </select>
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Next Action Description *</label>
                  <input name="nextAction" aria-invalid={errors.nextAction ? true : undefined} aria-describedby={errors.nextAction ? 'err-nextAction' : undefined} aria-label="Next Action Description"
                    type="text"
                    className="form-input"
                    required
                    placeholder="e.g. Call to discuss proposal approval and contract terms"
                    value={formData.nextAction}
                    onChange={(e) => setFormData({ ...formData, nextAction: e.target.value })}
                  />
{errors.nextAction && <span id="err-nextAction" className="field-error">{errors.nextAction}</span>}
                </div>
              </>
            )}

          </div>

          <div className="modal-footer">
            <button type="button" className="btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-primary" disabled={isSubmitting} aria-busy={isSubmitting || undefined}>
              {isSubmitting ? 'Saving…' : isBulk ? `Apply to ${bulkCount} Leads` : (
                actionType === 'createLead' ? 'Create Lead' :
                actionType === 'createAccount' ? 'Create Company Account' :
                actionType === 'createContact' ? 'Add Contact' :
                actionType === 'createActivity' ? 'Schedule Activity' :
                'Confirm Action'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
