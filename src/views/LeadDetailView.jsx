import React, { useState } from 'react';
import {
  LuChevronRight,
  LuPhone,
  LuMail,
  LuClock,
  LuTriangleAlert,
  LuTrendingUp,
  LuPlus,
  LuMessageSquare
} from 'react-icons/lu';
import ConvertConfirmModal from '../components/ConvertConfirmModal';

export default function LeadDetailView({
  lead,
  onBack,
  onNavigateHome,
  onQuickAction,
  onNavigateToAccount,
  navigationSource = 'leads',
  onNavigateToActivities,
  onNavigateToProposals,
  onNavigateToContacts
}) {
  const [isConvertModalOpen, setIsConvertModalOpen] = useState(false);
  const notesList = lead.notes ? lead.notes.split('\n').filter(Boolean) : ['Initial lead inquiry received via website.'];

  const stages = ['New', 'Contacted', 'Qualified', 'Discussion', 'Proposal', 'Negotiation'];
  const currentStageIndex = stages.indexOf(lead.status) !== -1 ? stages.indexOf(lead.status) : 0;

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
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
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
            <div style={{ fontSize: '0.95rem', color: '#557396' }}>
              {lead.designation} at{' '}
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

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <button
              className="btn-primary"
              style={{ padding: '0.5rem 1.05rem', fontSize: '0.85rem', display: 'inline-flex', alignItems: 'center', gap: '0.45rem' }}
              onClick={() => setIsConvertModalOpen(true)}
              title="Convert this lead to a pipeline opportunity"
            >
              <LuTrendingUp size={16} /> Convert to Opportunity
            </button>
          </div>
        </div>

        {/* Quick Action Ribbon */}
        <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1.25rem', flexWrap: 'wrap', paddingTop: '1rem', borderTop: '1px solid #F1F5F9' }}>
          <button className="btn-secondary" style={{ fontSize: '0.8rem', padding: '0.35rem 0.75rem' }} onClick={() => onQuickAction && onQuickAction('call', lead)}>
            <LuPhone size={15} /> Log Call
          </button>
          <button className="btn-secondary" style={{ fontSize: '0.8rem', padding: '0.35rem 0.75rem' }} onClick={() => onQuickAction && onQuickAction('email', lead)}>
            <LuMail size={15} /> Send Email
          </button>
          <button className="btn-secondary" style={{ fontSize: '0.8rem', padding: '0.35rem 0.75rem' }} onClick={() => onQuickAction && onQuickAction('sms', lead)}>
            <LuMessageSquare size={15} /> WhatsApp
          </button>
        </div>
      </div>

      {/* 3. Main Content Grid */}
      <div className="lead-detail-main-grid">
        {/* Left Column - Main Details */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>

          {/* Key Contact Information Card */}
          <div className="section-card" style={{ marginBottom: 0 }}>
            <div className="section-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 className="section-title">Lead Contact Information</h3>
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
                <div className="field-value" style={{ fontWeight: 600 }}>
                  <LuPhone size={14} style={{ color: '#557396' }} /> {lead.phoneNumber}
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

          {/* Notes & Requirements History */}
          <div className="section-card" style={{ marginBottom: 0 }}>
            <div className="section-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3 className="section-title">Notes & Logged Requirements</h3>
              <button
                className="btn-primary"
                style={{ fontSize: '0.8rem', padding: '0.45rem 1.1rem', borderRadius: '20px', display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 600 }}
                onClick={() => onQuickAction('addNote', lead)}
              >
                <LuPlus size={15} /> Add Note
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: 0 }}>
              {notesList.map((noteItem, idx) => (
                <div key={idx} style={{
                  background: '#F9F9F9',
                  border: '1px solid #E0E6EE',
                  borderRadius: '8px',
                  padding: '0.875rem',
                  fontSize: '0.875rem',
                  color: '#063669'
                }}>
                  {noteItem}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Sidebar Column - Sales Pipeline Stage Progress Tracker */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>

          {/* Sales Pipeline Stage Progress Card */}
          <div className="section-card" style={{ marginBottom: 0 }}>
            <h3 className="section-title" style={{ marginBottom: '0.75rem' }}>Sales Pipeline Stage Progress</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {stages.map((stg, idx) => {
                const isPassed = idx <= currentStageIndex;
                const isCurrent = idx === currentStageIndex;
                return (
                  <div key={stg} style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.5rem 0.75rem',
                    borderRadius: '8px',
                    backgroundColor: isCurrent ? '#063669' : isPassed ? '#F9F9F9' : '#FFFFFF',
                    border: isCurrent ? '1px solid #063669' : '1px solid #E0E6EE',
                    transition: 'all 0.2s'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem' }}>
                      <div style={{
                        width: '10px',
                        height: '10px',
                        borderRadius: '50%',
                        backgroundColor: isCurrent ? '#FFFFFF' : isPassed ? '#063669' : '#C0D0E0'
                      }} />
                      <span style={{
                        fontSize: '0.8rem',
                        fontWeight: isCurrent ? 700 : 500,
                        color: isCurrent ? '#FFFFFF' : isPassed ? '#063669' : '#557396'
                      }}>
                        {stg}
                      </span>
                    </div>
                    {isCurrent && (
                      <span style={{
                        fontSize: '0.65rem',
                        fontWeight: 700,
                        color: '#FFFFFF',
                        backgroundColor: 'rgba(255, 255, 255, 0.25)',
                        padding: '0.1rem 0.45rem',
                        borderRadius: '4px'
                      }}>
                        Active
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      </div>

      {/* Convert to Opportunity Confirmation Pop-up Modal */}
      <ConvertConfirmModal
        isOpen={isConvertModalOpen}
        onClose={() => setIsConvertModalOpen(false)}
        onConfirm={() => {
          if (onQuickAction) {
            onQuickAction('convertOpportunity', lead);
          }
        }}
        lead={lead}
      />
    </div>
  );
}
