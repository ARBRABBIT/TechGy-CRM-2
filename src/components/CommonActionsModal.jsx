import React, { useState, useEffect, useRef } from 'react';
import { LuX } from 'react-icons/lu';
import { animateModalEnter } from '../utils/animations';
import { INITIAL_OWNERS, LEAD_SOURCES } from '../data/mockData';
import { getTodayISO, getFutureISO } from '../utils/dateUtils';
import FormDateSelector from './FormDateSelector';

const STAGE_DEFAULT_PROBABILITIES = {
  'Discovery': '20%',
  'Qualified': '40%',
  'Proposal Sent': '60%',
  'Negotiation': '80%',
  'Won': '100%',
  'Lost': '0%'
};

export default function CommonActionsModal({
  isOpen,
  onClose,
  onSave,
  initialType = 'createLead',
  selectedLead = null,
  leads = [],
  currentUser = null
}) {
  const [actionType, setActionType] = useState(initialType);
  const [targetLeadId, setTargetLeadId] = useState('');

  const [formData, setFormData] = useState({
    leadName: '',
    company: '',
    phone: '',
    email: '',
    designation: '',
    leadSource: 'Website',
    owner: currentUser?.name || 'Rajesh Sharma',
    status: 'New',
    priority: 'Medium',
    notes: '',
    subject: '',
    outcome: 'Connected - Positive',
    duration: '15 mins',
    activityType: 'Meeting',
    nextAction: '',
    dueDate: getTodayISO(),
    opportunityName: '',
    estimatedValue: '',
    currentStage: 'Qualified',
    probability: '60%',
    closeDate: getFutureISO(30)
  });

  const overlayRef = useRef(null);
  const cardRef = useRef(null);

  useEffect(() => {
    if (isOpen && cardRef.current) {
      animateModalEnter(cardRef.current, overlayRef.current);
    }
  }, [isOpen]);

  // Sync actionType and prefilled target lead when modal opens or initialType changes
  useEffect(() => {
    if (isOpen) {
      if (initialType) {
        setActionType(initialType);
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
    }
  }, [isOpen, initialType, selectedLead, leads, currentUser]);

  if (!isOpen) return null;

  const isLeadScoped = [
    'addNote',
    'assignOwner',
    'changeStatus',
    'scheduleFollowup',
    'call',
    'email',
    'sms'
  ].includes(actionType);

  const activeTargetLead = selectedLead || leads.find(l => l.id === targetLeadId) || null;

  const handleTargetLeadChange = (chosenId) => {
    setTargetLeadId(chosenId);
    const chosen = leads.find(l => l.id === chosenId);
    if (chosen) {
      setFormData(prev => ({
        ...prev,
        leadName: chosen.leadName || '',
        company: chosen.company || '',
        phone: chosen.phoneNumber || '',
        email: chosen.emailId || '',
        designation: chosen.designation || '',
        owner: chosen.leadOwner || prev.owner,
        status: chosen.status || prev.status
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(actionType, {
      ...formData,
      targetLeadId: isLeadScoped ? (selectedLead?.id || targetLeadId) : undefined
    });
    onClose();
  };

  const getModalTitle = () => {
    switch (actionType) {
      case 'call': return 'Log Call';
      case 'email': return 'Send / Log Email';
      case 'sms': return 'Log WhatsApp Message';
      case 'createOpportunity': return 'Create Pipeline Opportunity';
      case 'createLead': return 'Create New Lead';
      case 'createActivity': return 'Log Activity / Task';
      case 'createProposal': return 'Draft Commercial Proposal';
      case 'createContact': return 'Add Account Contact';
      case 'assignOwner': return 'Reassign Lead Owner';
      case 'changeStatus': return 'Change Lead Status';
      case 'addNote': return 'Add Note / Requirement Context';
      case 'scheduleFollowup': return 'Schedule Lead Follow-up';
      default: return 'Common Action Workspace';
    }
  };

  return (
    <div className="modal-overlay" ref={overlayRef} onClick={onClose}>
      <div className="modal-card" ref={cardRef} onClick={(e) => e.stopPropagation()} style={{ maxWidth: '620px' }}>
        <div className="modal-header">
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#063669', margin: 0 }}>
            {getModalTitle()}
          </h3>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#557396' }}>
            <LuX size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            {/* Action Type Selector */}
            <div className="form-group">
              <label className="form-label">Select Action</label>
              <select 
                className="form-select" 
                value={actionType} 
                onChange={(e) => setActionType(e.target.value)}
              >
                <option value="createOpportunity">Create New Opportunity</option>
                <option value="createLead">Create New Lead</option>
                <option value="createActivity">Log Activity / Task</option>
                <option value="call">Log Call</option>
                <option value="email">Send / Log Email</option>
                <option value="sms">Log WhatsApp Message</option>
                <option value="createProposal">Draft Proposal</option>
                <option value="createContact">Add Contact</option>
                <option value="assignOwner">Assign Owner</option>
                <option value="changeStatus">Change Status</option>
                <option value="addNote">Add Note / Context</option>
                <option value="scheduleFollowup">Schedule Follow-up</option>
              </select>
            </div>

            {/* Target Lead Selector for lead-scoped actions */}
            {isLeadScoped && (
              selectedLead ? (
                <div style={{
                  marginBottom: '1.15rem',
                  padding: '0.65rem 0.85rem',
                  background: '#F0F5FA',
                  borderRadius: '8px',
                  border: '1px solid #D5E2EE',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <span style={{ fontSize: '0.8rem', color: '#557396', fontWeight: 500 }}>Target Lead:</span>
                  <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#063669' }}>
                    {selectedLead.leadName} • {selectedLead.company}
                  </span>
                </div>
              ) : (
                <div className="form-group" style={{ marginBottom: '1.15rem' }}>
                  <label className="form-label">Target Lead *</label>
                  <select
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
                </div>
              )
            )}

            {/* Dynamic Form Fields */}
            {actionType === 'createOpportunity' && (
              <>
                <div className="form-group">
                  <label className="form-label">Opportunity Name *</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    required 
                    placeholder="e.g. Tata Tech – Cloud ERP Integration"
                    value={formData.opportunityName}
                    onChange={(e) => setFormData({ ...formData, opportunityName: e.target.value })}
                  />
                </div>
                <div className="form-grid-2">
                  <div className="form-group">
                    <label className="form-label">Company / Account Name *</label>
                    <input 
                      type="text" 
                      className="form-input" 
                      required 
                      placeholder="e.g. Tata Consultancy Tech Ltd"
                      value={formData.company}
                      onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Estimated Value *</label>
                    <input 
                      type="text" 
                      className="form-input" 
                      required
                      placeholder="e.g. ₹75.00 Lakh or ₹1.20 Cr"
                      value={formData.estimatedValue}
                      onChange={(e) => setFormData({ ...formData, estimatedValue: e.target.value })}
                    />
                  </div>
                </div>
                <div className="form-grid-2">
                  <div className="form-group">
                    <label className="form-label">Current Stage</label>
                    <select 
                      className="form-select" 
                      value={formData.currentStage}
                      onChange={(e) => {
                        const newStage = e.target.value;
                        setFormData(prev => ({
                          ...prev,
                          currentStage: newStage,
                          probability: STAGE_DEFAULT_PROBABILITIES[newStage] !== undefined ? STAGE_DEFAULT_PROBABILITIES[newStage] : prev.probability
                        }));
                      }}
                    >
                      <option value="Discovery">Discovery</option>
                      <option value="Qualified">Qualified</option>
                      <option value="Proposal Sent">Proposal Sent</option>
                      <option value="Negotiation">Negotiation</option>
                      <option value="Won">Won</option>
                      <option value="Lost">Lost</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <label className="form-label">Probability (%)</label>
                      <span style={{ fontSize: '0.875rem', fontWeight: 700, color: '#063669' }}>
                        {Math.min(100, Math.max(0, parseInt(formData.probability, 10) || 0))}%
                      </span>
                    </div>
                    <div className="probability-slider-wrapper">
                      <input 
                        type="range" 
                        min="0" 
                        max="100" 
                        step="5"
                        value={Math.min(100, Math.max(0, parseInt(formData.probability, 10) || 0))}
                        onChange={(e) => setFormData({ ...formData, probability: `${e.target.value}%` })}
                        className="probability-range-slider"
                        style={{
                          background: `linear-gradient(to right, #063669 ${Math.min(100, Math.max(0, parseInt(formData.probability, 10) || 0))}%, #E2E8F0 ${Math.min(100, Math.max(0, parseInt(formData.probability, 10) || 0))}%)`
                        }}
                        aria-label="Probability percentage slider"
                      />
                    </div>
                  </div>
                </div>
                <div className="form-grid-2">
                  <div className="form-group">
                    <label className="form-label">Expected Close Date</label>
                    <FormDateSelector 
                      value={formData.closeDate}
                      onChange={(newDate) => setFormData({ ...formData, closeDate: newDate })}
                      placement="top"
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Opportunity Owner</label>
                    <select 
                      className="form-select"
                      value={formData.owner}
                      onChange={(e) => setFormData({ ...formData, owner: e.target.value })}
                    >
                      {INITIAL_OWNERS.filter(o => o !== 'All Owners').map(o => <option key={o} value={o}>{o}</option>)}
                    </select>
                  </div>
                </div>
              </>
            )}

            {actionType === 'createLead' && (
              <>
                <div className="form-group">
                  <label className="form-label">Lead Name *</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    required 
                    placeholder="e.g. Vikram Malhotra"
                    value={formData.leadName}
                    onChange={(e) => setFormData({ ...formData, leadName: e.target.value })}
                  />
                </div>
                <div className="form-grid-2">
                  <div className="form-group">
                    <label className="form-label">Company Name *</label>
                    <input 
                      type="text" 
                      className="form-input" 
                      required 
                      placeholder="e.g. Tata Consultancy Tech Ltd"
                      value={formData.company}
                      onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Designation</label>
                    <input 
                      type="text" 
                      className="form-input" 
                      placeholder="e.g. General Manager"
                      value={formData.designation}
                      onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                    />
                  </div>
                </div>
                <div className="form-grid-2">
                  <div className="form-group">
                    <label className="form-label">Phone Number</label>
                    <input 
                      type="tel"
                      inputMode="numeric"
                      className="form-input" 
                      placeholder="+91 98765 00000"
                      value={formData.phone}
                      onChange={(e) => {
                        const numericOnly = e.target.value.replace(/[^0-9+\s-]/g, '');
                        setFormData({ ...formData, phone: numericOnly });
                      }}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Email ID</label>
                    <input 
                      type="email" 
                      className="form-input" 
                      placeholder="name@company.co.in"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                  </div>
                </div>
                <div className="form-grid-2">
                  <div className="form-group">
                    <label className="form-label">Lead Source</label>
                    <select 
                      className="form-select"
                      value={formData.leadSource}
                      onChange={(e) => setFormData({ ...formData, leadSource: e.target.value })}
                    >
                      {LEAD_SOURCES.map(src => <option key={src} value={src}>{src}</option>)}
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Assign Owner</label>
                    <select 
                      className="form-select"
                      value={formData.owner}
                      onChange={(e) => setFormData({ ...formData, owner: e.target.value })}
                    >
                      {INITIAL_OWNERS.filter(o => o !== 'All Owners').map(o => <option key={o} value={o}>{o}</option>)}
                    </select>
                  </div>
                </div>
              </>
            )}

            {actionType === 'createActivity' && (
              <>
                <div className="form-group">
                  <label className="form-label">Activity Title / Subject *</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    required 
                    placeholder="e.g. Technical Discovery Call on Enterprise Security"
                    value={formData.nextAction}
                    onChange={(e) => setFormData({ ...formData, nextAction: e.target.value })}
                  />
                </div>
                <div className="form-grid-2">
                  <div className="form-group">
                    <label className="form-label">Activity Type</label>
                    <select 
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
                    <input 
                      type="text" 
                      className="form-input" 
                      placeholder="e.g. Reliance Cloud Solutions"
                      value={formData.company}
                      onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    />
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
                    <select 
                      className="form-select"
                      value={formData.owner}
                      onChange={(e) => setFormData({ ...formData, owner: e.target.value })}
                    >
                      {INITIAL_OWNERS.filter(o => o !== 'All Owners').map(o => <option key={o} value={o}>{o}</option>)}
                    </select>
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Notes / Agenda</label>
                  <textarea 
                    className="form-textarea" 
                    rows={3} 
                    placeholder="Provide discussion topics or preparation notes..."
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  />
                </div>
              </>
            )}

            {actionType === 'call' && (
              <>
                <div className="form-grid-2">
                  <div className="form-group">
                    <label className="form-label">Call Outcome *</label>
                    <select 
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
                  </div>
                  <div className="form-group">
                    <label className="form-label">Call Duration</label>
                    <select 
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
                  <textarea 
                    className="form-textarea" 
                    rows={4} 
                    required
                    placeholder="Key discussion points, objections raised, or agreed next steps..."
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  />
                </div>
              </>
            )}

            {actionType === 'email' && (
              <>
                <div className="form-group">
                  <label className="form-label">Recipient Email *</label>
                  <input 
                    type="email" 
                    className="form-input" 
                    required
                    placeholder="contact@company.co.in"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Subject *</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    required
                    placeholder="e.g. Follow-up: TechGy CRM Solution Overview & Commercials"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Email Body / Summary *</label>
                  <textarea 
                    className="form-textarea" 
                    rows={4} 
                    required
                    placeholder="Enter sent email body or summary notes..."
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  />
                </div>
              </>
            )}

            {actionType === 'sms' && (
              <>
                <div className="form-group">
                  <label className="form-label">WhatsApp / Phone Number *</label>
                  <input 
                    type="tel" 
                    className="form-input" 
                    required
                    placeholder="+91 98765 00000"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">WhatsApp Message Context *</label>
                  <textarea 
                    className="form-textarea" 
                    rows={4} 
                    required
                    placeholder="Briefly describe message sent or conversation summary..."
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  />
                </div>
              </>
            )}

            {actionType === 'createProposal' && (
              <>
                <div className="form-group">
                  <label className="form-label">Proposal Title *</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    required 
                    placeholder="e.g. Enterprise Cloud ERP Implementation Proposal"
                    value={formData.opportunityName}
                    onChange={(e) => setFormData({ ...formData, opportunityName: e.target.value })}
                  />
                </div>
                <div className="form-grid-2">
                  <div className="form-group">
                    <label className="form-label">Company / Account Name *</label>
                    <input 
                      type="text" 
                      className="form-input" 
                      required 
                      placeholder="e.g. Tata Consultancy Tech Ltd"
                      value={formData.company}
                      onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Proposal Amount *</label>
                    <input 
                      type="text" 
                      className="form-input" 
                      required 
                      placeholder="e.g. ₹45,00,000"
                      value={formData.estimatedValue}
                      onChange={(e) => setFormData({ ...formData, estimatedValue: e.target.value })}
                    />
                  </div>
                </div>
                <div className="form-grid-2">
                  <div className="form-group">
                    <label className="form-label">Valid Until Date</label>
                    <FormDateSelector 
                      value={formData.closeDate}
                      onChange={(d) => setFormData({ ...formData, closeDate: d })}
                      placement="top"
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Owner</label>
                    <select 
                      className="form-select"
                      value={formData.owner}
                      onChange={(e) => setFormData({ ...formData, owner: e.target.value })}
                    >
                      {INITIAL_OWNERS.filter(o => o !== 'All Owners').map(o => <option key={o} value={o}>{o}</option>)}
                    </select>
                  </div>
                </div>
              </>
            )}

            {actionType === 'createContact' && (
              <>
                <div className="form-grid-2">
                  <div className="form-group">
                    <label className="form-label">Contact Name *</label>
                    <input 
                      type="text" 
                      className="form-input" 
                      required 
                      placeholder="e.g. Rajesh Khurana"
                      value={formData.leadName}
                      onChange={(e) => setFormData({ ...formData, leadName: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Designation</label>
                    <input 
                      type="text" 
                      className="form-input" 
                      placeholder="e.g. VP Operations"
                      value={formData.designation}
                      onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Company Name *</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    required 
                    placeholder="e.g. Infosys Digital Systems"
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  />
                </div>
                <div className="form-grid-2">
                  <div className="form-group">
                    <label className="form-label">Email</label>
                    <input 
                      type="email" 
                      className="form-input" 
                      placeholder="r.khurana@infosys.co.in"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Phone Number</label>
                    <input 
                      type="tel" 
                      className="form-input" 
                      placeholder="+91 98765 11111"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    />
                  </div>
                </div>
              </>
            )}

            {actionType === 'assignOwner' && (
              <div className="form-group">
                <label className="form-label">Select New Owner *</label>
                <select 
                  className="form-select"
                  value={formData.owner}
                  onChange={(e) => setFormData({ ...formData, owner: e.target.value })}
                >
                  {INITIAL_OWNERS.filter(o => o !== 'All Owners').map(o => <option key={o} value={o}>{o}</option>)}
                </select>
                {activeTargetLead && (
                  <div style={{ fontSize: '0.775rem', color: '#557396', marginTop: '0.35rem' }}>
                    Currently assigned to: <strong>{activeTargetLead.leadOwner}</strong>
                  </div>
                )}
              </div>
            )}

            {actionType === 'changeStatus' && (
              <div className="form-group">
                <label className="form-label">New Status *</label>
                <select 
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
                {activeTargetLead && (
                  <div style={{ fontSize: '0.775rem', color: '#557396', marginTop: '0.35rem' }}>
                    Current status: <strong>{activeTargetLead.status}</strong>
                  </div>
                )}
              </div>
            )}

            {actionType === 'addNote' && (
              <div className="form-group">
                <label className="form-label">Note / Requirement Context *</label>
                <textarea 
                  className="form-textarea" 
                  rows={4} 
                  required
                  placeholder="Enter context, conversation summary or requirement notes..."
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                />
              </div>
            )}

            {actionType === 'scheduleFollowup' && (
              <>
                <div className="form-group">
                  <label className="form-label">Follow-up Date & Time *</label>
                  <input 
                    type="datetime-local" 
                    className="form-input"
                    required
                    value={formData.dueDate}
                    onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Next Action Description *</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    required
                    placeholder="e.g. Call to discuss proposal approval and contract terms"
                    value={formData.nextAction}
                    onChange={(e) => setFormData({ ...formData, nextAction: e.target.value })}
                  />
                </div>
              </>
            )}

          </div>

          <div className="modal-footer">
            <button type="button" className="btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              Confirm Action
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
