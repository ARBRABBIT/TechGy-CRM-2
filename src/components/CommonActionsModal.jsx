import React, { useState, useEffect, useRef } from 'react';
import { LuX } from 'react-icons/lu';
import { animateModalEnter } from '../utils/animations';
import { INITIAL_OWNERS, LEAD_SOURCES } from '../data/mockData';
import FormDateSelector from './FormDateSelector';

const STAGE_DEFAULT_PROBABILITIES = {
  'Discovery': '20%',
  'Qualified': '40%',
  'Proposal Sent': '60%',
  'Negotiation': '80%',
  'Won': '100%',
  'Lost': '0%'
};

const getTodayStr = () => new Date().toISOString().split('T')[0];
const getFutureDateStr = (days = 30) => {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString().split('T')[0];
};

export default function CommonActionsModal({ isOpen, onClose, onSave, initialType = 'createLead' }) {
  const [actionType, setActionType] = useState(initialType);
  const [formData, setFormData] = useState({
    leadName: '',
    company: '',
    phone: '',
    email: '',
    designation: '',
    leadSource: 'Website',
    owner: 'Rajesh Sharma',
    status: 'New',
    priority: 'Medium',
    notes: '',
    nextAction: '',
    dueDate: getTodayStr(),
    opportunityName: '',
    estimatedValue: '',
    currentStage: 'Qualified',
    probability: '60%',
    closeDate: getFutureDateStr(30)
  });

  const overlayRef = useRef(null);
  const cardRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      if (cardRef.current) {
        animateModalEnter(cardRef.current, overlayRef.current);
      }
    }
  }, [isOpen]);

  // Sync actionType when initialType changes and modal opens
  useEffect(() => {
    if (isOpen && initialType) {
      setActionType(prev => (prev !== initialType ? initialType : prev));
    }
  }, [isOpen, initialType]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(actionType, formData);
    onClose();
  };

  return (
    <div className="modal-overlay" ref={overlayRef} onClick={onClose}>
      <div className="modal-card" ref={cardRef} onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#063669' }}>
            Common Action Workspace
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
                <option value="assignOwner">Assign Owner</option>
                <option value="changeStatus">Change Status</option>
                <option value="addNote">Add Note / Context</option>
                <option value="scheduleFollowup">Schedule Follow-up</option>
              </select>
            </div>

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

            {actionType === 'assignOwner' && (
              <div className="form-group">
                <label className="form-label">Select New Owner</label>
                <select 
                  className="form-select"
                  value={formData.owner}
                  onChange={(e) => setFormData({ ...formData, owner: e.target.value })}
                >
                  {INITIAL_OWNERS.filter(o => o !== 'All Owners').map(o => <option key={o} value={o}>{o}</option>)}
                </select>
              </div>
            )}

            {actionType === 'changeStatus' && (
              <div className="form-group">
                <label className="form-label">New Status</label>
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
              </div>
            )}

            {actionType === 'addNote' && (
              <div className="form-group">
                <label className="form-label">Note / Requirement Context</label>
                <textarea 
                  className="form-textarea" 
                  rows={4} 
                  placeholder="Enter context, conversation summary or requirement notes..."
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                />
              </div>
            )}

            {actionType === 'scheduleFollowup' && (
              <>
                <div className="form-group">
                  <label className="form-label">Follow-up Date & Time</label>
                  <input 
                    type="datetime-local" 
                    className="form-input"
                    value={formData.dueDate}
                    onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Next Action Description</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    placeholder="e.g. Call to discuss proposal approval"
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
