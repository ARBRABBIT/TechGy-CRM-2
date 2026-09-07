import React, { useState } from 'react';
import { 
  LuX, 
  LuBuilding2, 
  LuGlobe, 
  LuMapPin, 
  LuUsers, 
  LuCalendar, 
  LuTrendingUp, 
  LuFileText, 
  LuClock,
  LuPhone,
  LuMail
} from 'react-icons/lu';

export default function AccountDetailDrawer({ 
  account, 
  onClose,
  leads = [],
  activities = [],
  contacts = [],
  opportunities = [],
  proposals = []
}) {
  const [activeTab, setActiveTab] = useState('leads');

  if (!account) return null;

  const accountLeads = leads.filter(l => l.company.toLowerCase() === account.companyName.toLowerCase());
  const accountActivities = activities.filter(a => a.company.toLowerCase() === account.companyName.toLowerCase());
  const accountContacts = contacts.filter(c => c.company.toLowerCase() === account.companyName.toLowerCase());
  const accountOpps = opportunities.filter(o => o.accountName.toLowerCase() === account.companyName.toLowerCase());
  const accountProposals = proposals.filter(p => p.company.toLowerCase() === account.companyName.toLowerCase());

  return (
    <div className="drawer-overlay" onClick={onClose}>
      <div className="drawer-content" style={{ width: '600px' }} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="drawer-header">
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.2rem' }}>
              <span className="status-chip qualified" style={{ fontSize: '0.7rem' }}>
                Est. {account.estimatedAccountValue}
              </span>
              <span className="status-chip new" style={{ fontSize: '0.7rem' }}>
                {account.industry}
              </span>
            </div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#063669' }}>
              {account.companyName}
            </h2>
            <div style={{ fontSize: '0.85rem', color: '#557396' }}>
              Owner: <strong>{account.accountOwner}</strong> • {account.location}
            </div>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#557396' }}>
            <LuX size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="drawer-body">
          {/* Company Overview Block */}
          <div className="section-card" style={{ padding: '1rem', marginBottom: '1.25rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.85rem' }}>
              <div>
                <div className="field-label">Company Size</div>
                <div className="field-value">{account.companySize}</div>
              </div>
              <div>
                <div className="field-label">Website</div>
                <div className="field-value" style={{ color: '#063669' }}>{account.website}</div>
              </div>
            </div>
          </div>

          {/* Navigation Tabs (As mandated in PDF Screen 3) */}
          <div className="tab-header">
            <div 
              className={`tab-item ${activeTab === 'leads' ? 'active' : ''}`}
              onClick={() => setActiveTab('leads')}
            >
              Leads ({accountLeads.length})
            </div>
            <div 
              className={`tab-item ${activeTab === 'timeline' ? 'active' : ''}`}
              onClick={() => setActiveTab('timeline')}
            >
              Timeline ({accountActivities.length})
            </div>
            <div 
              className={`tab-item ${activeTab === 'contacts' ? 'active' : ''}`}
              onClick={() => setActiveTab('contacts')}
            >
              Contacts ({accountContacts.length})
            </div>
            <div 
              className={`tab-item ${activeTab === 'opps' ? 'active' : ''}`}
              onClick={() => setActiveTab('opps')}
            >
              Deals ({accountOpps.length})
            </div>
          </div>

          {/* Tab Content 1: Leads under Account */}
          {activeTab === 'leads' && (
            <div className="section-card" style={{ padding: '1rem' }}>
              {accountLeads.length === 0 ? (
                <div style={{ padding: '1.5rem', textAlign: 'center', color: '#557396', fontSize: '0.85rem' }}>
                  No leads associated with this company.
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {accountLeads.map(l => (
                    <div key={l.id} style={{ padding: '0.75rem', borderRadius: '8px', border: '1px solid #E0E6EE', backgroundColor: '#F9F9F9' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.25rem' }}>
                        <span style={{ fontWeight: 700, color: '#063669' }}>{l.leadName}</span>
                        <span className={`status-chip ${l.status.toLowerCase()}`}>{l.status}</span>
                      </div>
                      <div style={{ fontSize: '0.8rem', color: '#557396' }}>{l.designation} • {l.emailId}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Tab Content 2: Account Timeline */}
          {activeTab === 'timeline' && (
            <div className="section-card" style={{ padding: '1rem' }}>
              {accountActivities.length === 0 ? (
                <div style={{ padding: '1.5rem', textAlign: 'center', color: '#557396', fontSize: '0.85rem' }}>
                  No past activity logs for this account.
                </div>
              ) : (
                <div className="timeline">
                  {accountActivities.map(act => (
                    <div key={act.id} className="timeline-item">
                      <div className="timeline-icon">
                        <LuClock size={12} />
                      </div>
                      <div className="timeline-card">
                        <div style={{ fontWeight: 700, fontSize: '0.85rem' }}>{act.type} • {act.date}</div>
                        <div style={{ fontSize: '0.8rem', color: '#063669', marginTop: '0.2rem' }}>
                          {act.notes || act.summary || act.shortPreview}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Tab Content 3: Contacts */}
          {activeTab === 'contacts' && (
            <div className="section-card" style={{ padding: '1rem' }}>
              {accountContacts.length === 0 ? (
                <div style={{ padding: '1.5rem', textAlign: 'center', color: '#557396', fontSize: '0.85rem' }}>
                  No contact directory records listed for this account.
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {accountContacts.map(con => (
                    <div key={con.id} style={{ padding: '0.75rem', borderRadius: '8px', border: '1px solid #E0E6EE', backgroundColor: '#F9F9F9' }}>
                      <div style={{ fontWeight: 700, color: '#063669' }}>{con.name}</div>
                      <div style={{ fontSize: '0.8rem', color: '#557396' }}>{con.designation}</div>
                      <div style={{ fontSize: '0.775rem', color: '#063669', marginTop: '0.25rem' }}>
                        {con.phone} • {con.email}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Tab Content 4: Opportunities & Proposals */}
          {activeTab === 'opps' && (
            <div className="section-card" style={{ padding: '1rem' }}>
              {accountOpps.length === 0 ? (
                <div style={{ padding: '1.5rem', textAlign: 'center', color: '#557396', fontSize: '0.85rem' }}>
                  No active opportunities for this account.
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {accountOpps.map(opp => (
                    <div key={opp.id} style={{ padding: '0.75rem', borderRadius: '8px', border: '1px solid #E0E6EE', backgroundColor: '#F9F9F9' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontWeight: 700, color: '#063669' }}>{opp.opportunityName}</span>
                        <span style={{ fontWeight: 700, color: '#063669' }}>{opp.estimatedValue}</span>
                      </div>
                      <div style={{ fontSize: '0.8rem', color: '#557396', marginTop: '0.25rem' }}>
                        Stage: <strong>{opp.currentStage}</strong> • Score: <strong>{opp.score}</strong>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
