import React from 'react';
import { 
  LuX, 
  LuPhone, 
  LuMail, 
  LuMessageSquare, 
  LuCalendar, 
  LuFileText, 
  LuArrowRightLeft, 
  LuBuilding2, 
  LuClock, 
  LuUser, 
  LuCircleCheck,
  LuTriangleAlert 
} from 'react-icons/lu';

export default function LeadDetailDrawer({ lead, onClose, onQuickAction }) {
  if (!lead) return null;

  return (
    <div className="drawer-overlay" onClick={onClose}>
      <div className="drawer-content" onClick={(e) => e.stopPropagation()}>
        {/* Drawer Header */}
        <div className="drawer-header">
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.2rem' }}>
              <span className={`status-chip ${lead.isOverdue ? 'overdue' : lead.status.toLowerCase()}`}>
                {lead.status}
              </span>
              <span className="status-chip new" style={{ fontSize: '0.7rem' }}>
                Priority: {lead.priority}
              </span>
            </div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#063669' }}>
              {lead.leadName}
            </h2>
            <div style={{ fontSize: '0.85rem', color: '#557396' }}>
              {lead.designation} at <strong>{lead.company}</strong>
            </div>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#557396' }}>
            <LuX size={20} />
          </button>
        </div>

        {/* Drawer Body */}
        <div className="drawer-body">
          {/* Quick Actions Bar */}
          <div style={{ marginBottom: '1.5rem' }}>
            <div className="field-label">Quick Actions</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem', marginTop: '0.5rem' }}>
              <button className="btn-secondary" style={{ fontSize: '0.775rem', justifyContent: 'center' }} onClick={() => onQuickAction('call', lead)}>
                <LuPhone size={14} /> Log Call
              </button>
              <button className="btn-secondary" style={{ fontSize: '0.775rem', justifyContent: 'center' }} onClick={() => onQuickAction('email', lead)}>
                <LuMail size={14} /> Send Email
              </button>
              <button className="btn-secondary" style={{ fontSize: '0.775rem', justifyContent: 'center' }} onClick={() => onQuickAction('sms', lead)}>
                <LuMessageSquare size={14} /> WhatsApp
              </button>
              <button className="btn-secondary" style={{ fontSize: '0.775rem', justifyContent: 'center' }} onClick={() => onQuickAction('addNote', lead)}>
                <LuFileText size={14} /> Add Note
              </button>
              <button className="btn-secondary" style={{ fontSize: '0.775rem', justifyContent: 'center' }} onClick={() => onQuickAction('scheduleFollowup', lead)}>
                <LuCalendar size={14} /> Follow-up
              </button>
              <button className="btn-primary" style={{ fontSize: '0.75rem', justifyContent: 'center', padding: '0.4rem 0.2rem' }} onClick={() => onQuickAction('convertOpportunity', lead)}>
                <LuArrowRightLeft size={13} /> Opportunity
              </button>
            </div>
          </div>

          {/* Section 1: Lead Identity */}
          <div className="section-card" style={{ padding: '1rem', marginBottom: '1rem' }}>
            <div style={{ fontWeight: 700, fontSize: '0.9rem', marginBottom: '0.75rem', color: '#063669' }}>
              1. Lead Identity
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.85rem' }}>
              <div className="drawer-field-group">
                <div className="field-label">Phone Number</div>
                <div className="field-value">{lead.phoneNumber}</div>
              </div>
              <div className="drawer-field-group">
                <div className="field-label">Email ID</div>
                <div className="field-value">{lead.emailId}</div>
              </div>
              <div className="drawer-field-group">
                <div className="field-label">Company</div>
                <div className="field-value" style={{ fontWeight: 700 }}>{lead.company}</div>
              </div>
              <div className="drawer-field-group">
                <div className="field-label">Designation</div>
                <div className="field-value">{lead.designation}</div>
              </div>
            </div>
          </div>

          {/* Section 2: Sales Status & Ownership */}
          <div className="section-card" style={{ padding: '1rem', marginBottom: '1rem' }}>
            <div style={{ fontWeight: 700, fontSize: '0.9rem', marginBottom: '0.75rem', color: '#063669' }}>
              2. Sales Status & Ownership
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.85rem' }}>
              <div className="drawer-field-group">
                <div className="field-label">Lead Source</div>
                <div className="field-value">{lead.leadSource}</div>
              </div>
              <div className="drawer-field-group">
                <div className="field-label">Lead Owner</div>
                <div className="field-value" style={{ fontWeight: 700, color: '#063669' }}>{lead.leadOwner}</div>
              </div>
              <div className="drawer-field-group">
                <div className="field-label">Created Date</div>
                <div className="field-value">{lead.createdDate}</div>
              </div>
              <div className="drawer-field-group">
                <div className="field-label">Next Follow-up</div>
                <div className="field-value" style={{ color: lead.isOverdue ? '#063669' : '#063669', fontWeight: 700 }}>
                  <LuClock size={12} style={{ display: 'inline', marginRight: 4 }} />
                  {lead.nextFollowup}
                </div>
              </div>
            </div>
          </div>

          {/* Section 3: Notes & Requirement Context */}
          <div className="section-card" style={{ padding: '1rem', marginBottom: '1rem' }}>
            <div style={{ fontWeight: 700, fontSize: '0.9rem', marginBottom: '0.5rem', color: '#063669' }}>
              3. Description & Notes
            </div>
            <div style={{ fontSize: '0.875rem', color: '#063669', backgroundColor: '#F9F9F9', padding: '0.75rem', borderRadius: '8px', border: '1px solid #E0E6EE', whiteSpace: 'pre-line' }}>
              {lead.notes}
            </div>
          </div>

          {/* Next Action Box */}
          <div className="section-card" style={{ padding: '1rem', border: '1px solid #063669', backgroundColor: '#F9F9F9' }}>
            <div className="field-label" style={{ color: '#063669' }}>Next Recommended Action</div>
            <div style={{ fontWeight: 700, color: '#063669', fontSize: '0.95rem', marginTop: '0.2rem' }}>
              {lead.nextAction}
            </div>
          </div>

          {/* Common UX Rule Callout (PDF Mandate) */}
          <div style={{ marginTop: '1.25rem', padding: '0.75rem', borderRadius: '8px', backgroundColor: '#F9F9F9', border: '1px solid #E0E6EE', fontSize: '0.75rem', color: '#557396' }}>
            <strong>Common UX Rule:</strong> Common actions like assigning owner, changing status, adding notes, scheduling follow-up, or creating a lead are accessible from top header and row quick actions without extra navigation.
          </div>
        </div>
      </div>
    </div>
  );
}
