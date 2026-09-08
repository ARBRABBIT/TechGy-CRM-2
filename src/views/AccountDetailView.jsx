import React, { useState } from 'react';
import {
  LuChevronRight,
  LuGlobe,
  LuMapPin,
  LuUsers,
  LuTrendingUp,
  LuFileText,
  LuPlus
} from 'react-icons/lu';

export default function AccountDetailView({
  account,
  onBack,
  onNavigateHome,
  leads = [],
  contacts = [],
  opportunities = [],
  proposals = [],
  onSelectLead,
  onOpenCreateModal,
  navigationSource = 'accounts',
  initialTab,
  fromDashboard = false,
  onNavigateToActivities,
  onNavigateToProposals,
  onNavigateToContacts,
  onNavigateToOpportunities,
  onNavigateToLeads
}) {
  const defaultTab = initialTab || (navigationSource === 'proposals' ? 'Proposals' : 'Leads');
  const [selectedTab, setSelectedTab] = useState(null);
  const activeTab = selectedTab !== null ? selectedTab : defaultTab;

  if (!account) {
    return (
      <div className="account-detail-page" style={{ padding: '2rem', textAlign: 'center' }}>
        <h2>Account Not Found</h2>
        <button className="btn-primary" onClick={onBack || onNavigateHome}>Back to Directory</button>
      </div>
    );
  }

  const compNameLower = (account.companyName || account.company || '').toLowerCase().trim();

  // Filter linked items safely
  const accountLeads = leads.filter(l => {
    const c = (l.company || l.companyName || '').toLowerCase().trim();
    return c && compNameLower && (c === compNameLower || c.includes(compNameLower) || compNameLower.includes(c));
  });

  const accountContacts = contacts.filter(c => {
    const comp = (c.company || c.companyName || '').toLowerCase().trim();
    return comp && compNameLower && (comp === compNameLower || comp.includes(compNameLower) || compNameLower.includes(comp));
  });

  const accountOpps = opportunities.filter(o => {
    const c = (o.accountName || o.company || o.companyName || '').toLowerCase().trim();
    return c && compNameLower && (c === compNameLower || c.includes(compNameLower) || compNameLower.includes(c));
  });

  const accountProposals = proposals.filter(p => {
    const c = (p.company || p.companyName || '').toLowerCase().trim();
    return c && compNameLower && (c === compNameLower || c.includes(compNameLower) || compNameLower.includes(c));
  });

  return (
    <div className="account-detail-page">
      {/* 1. Breadcrumbs Header */}
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
                {account.companyName}
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
                {account.companyName}
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
                {account.companyName}
              </span>
            </>
          ) : navigationSource === 'proposals' ? (
            <>
              <span
                onClick={onNavigateToProposals || onBack}
                style={{ cursor: 'pointer', color: '#063669', fontWeight: 600 }}
                title="Return to Proposals & Commercial Worth"
              >
                Proposals & Commercial Worth
              </span>
              <LuChevronRight size={14} />
              <span style={{ color: '#063669', fontWeight: 700 }}>
                {account.companyName}
              </span>
            </>
          ) : navigationSource === 'opportunities' ? (
            <>
              <span
                onClick={onNavigateToOpportunities || onBack}
                style={{ cursor: 'pointer', color: '#063669', fontWeight: 600 }}
                title="Return to Opportunities Pipeline"
              >
                Opportunities Pipeline
              </span>
              <LuChevronRight size={14} />
              <span style={{ color: '#063669', fontWeight: 700 }}>
                {account.companyName}
              </span>
            </>
          ) : navigationSource === 'leads' ? (
            <>
              <span
                onClick={onNavigateToLeads || onBack}
                style={{ cursor: 'pointer', color: '#063669', fontWeight: 600 }}
                title="Return to Leads Directory & Sales Pipeline"
              >
                Leads Directory & Sales Pipeline
              </span>
              <LuChevronRight size={14} />
              <span style={{ color: '#063669', fontWeight: 700 }}>
                {account.companyName}
              </span>
            </>
          ) : (
            <>
              {fromDashboard && (
                <>
                  <span
                    onClick={onNavigateHome}
                    style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.3rem', color: '#063669' }}
                    title="Go to Dashboard"
                  >
                    Dashboard
                  </span>
                  <LuChevronRight size={14} />
                </>
              )}
              <span
                onClick={onBack}
                style={{ cursor: 'pointer', color: '#063669', fontWeight: 600 }}
                title="Return to Company Accounts"
              >
                Company Accounts
              </span>
              <LuChevronRight size={14} />
              <span style={{ color: '#063669', fontWeight: 700 }}>
                {account.companyName}
              </span>
            </>
          )}
        </nav>
      </div>

      {/* 2. Top Header Card */}
      <div className="section-card" style={{ marginBottom: '1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', padding: '1.25rem 1.5rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.35rem' }}>
            <h2 style={{ fontSize: '1.4rem', margin: 0, color: '#063669', fontWeight: 700 }}>{account.companyName}</h2>
            <span className="counter-badge alert" style={{ background: '#E6EFF8', color: '#063669', border: '1px solid rgba(6, 54, 105, 0.15)', fontWeight: 600 }}>
              Est. Worth {account.estimatedAccountValue}
            </span>
          </div>
          <p style={{ margin: 0, color: '#557396', fontSize: '0.875rem' }}>
            {account.industry} • {account.companySize} • Owner: {account.accountOwner}
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <button
            className="btn-primary"
            onClick={() => onOpenCreateModal('createLead')}
          >
            <LuPlus size={16} /> Add Lead to Account
          </button>
        </div>
      </div>

      {/* 3. Top Metrics Row */}
      <div className="revenue-grid" style={{ marginBottom: '1.25rem' }}>
        <div className="kpi-card">
          <div className="kpi-header">
            <span className="kpi-title">Linked Leads</span>
            <div className="kpi-icon-wrap"><LuUsers size={18} /></div>
          </div>
          <div className="kpi-value">{accountLeads.length}</div>
          <div className="kpi-subtext">Active prospects</div>
        </div>

        <div className="kpi-card">
          <div className="kpi-header">
            <span className="kpi-title">Opportunities</span>
            <div className="kpi-icon-wrap"><LuTrendingUp size={18} /></div>
          </div>
          <div className="kpi-value">{accountOpps.length}</div>
          <div className="kpi-subtext">Pipeline deals</div>
        </div>

        <div className="kpi-card">
          <div className="kpi-header">
            <span className="kpi-title">Proposals</span>
            <div className="kpi-icon-wrap"><LuFileText size={18} /></div>
          </div>
          <div className="kpi-value">{accountProposals.length}</div>
          <div className="kpi-subtext">Commercial offers</div>
        </div>
      </div>

      {/* 4. Main Content Container */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>

        {/* Account Profile Summary Card */}
        <div className="section-card" style={{ marginBottom: '0.65rem', padding: '0.85rem 1.25rem' }}>
          <div className="section-header" style={{ marginBottom: '0.65rem' }}>
            <h3 className="section-title">Company Profile</h3>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem' }}>
            <div className="drawer-field-group">
              <div className="field-label">Company Name</div>
              <div className="field-value" style={{ fontWeight: 700, color: '#063669' }}>{account.companyName}</div>
            </div>

            <div className="drawer-field-group">
              <div className="field-label">Industry</div>
              <div className="field-value">{account.industry}</div>
            </div>

            <div className="drawer-field-group">
              <div className="field-label">Company Size</div>
              <div className="field-value">{account.companySize}</div>
            </div>

            <div className="drawer-field-group">
              <div className="field-label">Estimated Account Value</div>
              <div className="field-value" style={{ fontWeight: 700, color: '#063669' }}>{account.estimatedAccountValue}</div>
            </div>

            <div className="drawer-field-group">
              <div className="field-label">Website</div>
              <div className="field-value" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <LuGlobe size={14} style={{ color: '#557396' }} /> {account.website}
              </div>
            </div>

            <div className="drawer-field-group">
              <div className="field-label">Location / Headquarters</div>
              <div className="field-value" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <LuMapPin size={14} style={{ color: '#557396' }} /> {account.location}
              </div>
            </div>
          </div>
        </div>

        {/* Tabbed Relational Data Tables */}
        <div className="section-card">
          <div className="tab-header">
            {['Leads', 'Opportunities', 'Proposals', 'Contacts'].map(tab => (
              <div
                key={tab}
                className={`tab-item ${activeTab === tab ? 'active' : ''}`}
                onClick={() => setSelectedTab(tab)}
              >
                {tab} ({
                  tab === 'Leads' ? accountLeads.length :
                    tab === 'Opportunities' ? accountOpps.length :
                      tab === 'Proposals' ? accountProposals.length :
                        accountContacts.length
                })
              </div>
            ))}
          </div>

          {/* Leads Tab */}
          {activeTab === 'Leads' && (
            <div style={{ overflowX: 'auto' }}>
              <table className="action-table">
                <thead>
                  <tr>
                    <th>Lead Name</th>
                    <th>Designation</th>
                    <th>Source</th>
                    <th>Status</th>
                    <th>Next Follow-up</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {accountLeads.length === 0 ? (
                    <tr><td colSpan={6} style={{ textAlign: 'center', padding: '1.5rem', color: '#557396' }}>No leads linked to this account.</td></tr>
                  ) : (
                    accountLeads.map(l => (
                      <tr key={l.id} onClick={() => onSelectLead(l)}>
                        <td style={{ fontWeight: 700, color: '#063669' }}>{l.leadName}</td>
                        <td>{l.designation}</td>
                        <td><span className="status-chip new">{l.leadSource}</span></td>
                        <td><span className={`status-chip ${l.status.toLowerCase()}`}>{l.status}</span></td>
                        <td>{l.nextFollowup}</td>
                        <td>
                          <button className="btn-secondary" style={{ padding: '0.2rem 0.5rem', fontSize: '0.725rem' }}>
                            Inspect <LuChevronRight size={12} />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}

          {/* Opportunities Tab */}
          {activeTab === 'Opportunities' && (
            <div style={{ overflowX: 'auto' }}>
              <table className="action-table">
                <thead>
                  <tr>
                    <th>Opportunity Name</th>
                    <th>Score</th>
                    <th>Est. Value</th>
                    <th>Probability</th>
                    <th>Stage</th>
                  </tr>
                </thead>
                <tbody>
                  {accountOpps.length === 0 ? (
                    <tr><td colSpan={5} style={{ textAlign: 'center', padding: '1.5rem', color: '#557396' }}>No opportunities linked.</td></tr>
                  ) : (
                    accountOpps.map(o => (
                      <tr key={o.id}>
                        <td style={{ fontWeight: 600 }}>{o.opportunityName}</td>
                        <td style={{ fontWeight: 700 }}>{o.score}</td>
                        <td style={{ fontWeight: 700 }}>{o.estimatedValue}</td>
                        <td>{o.probability}</td>
                        <td><span className="status-chip proposal">{o.currentStage}</span></td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}

          {/* Proposals Tab */}
          {activeTab === 'Proposals' && (
            <div style={{ overflowX: 'auto' }}>
              <table className="action-table">
                <thead>
                  <tr>
                    <th>Proposal ID</th>
                    <th>Value</th>
                    <th>Validity</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {accountProposals.length === 0 ? (
                    <tr><td colSpan={4} style={{ textAlign: 'center', padding: '1.5rem', color: '#557396' }}>No proposals linked.</td></tr>
                  ) : (
                    accountProposals.map(p => (
                      <tr key={p.id}>
                        <td style={{ fontWeight: 700, color: '#063669' }}>{p.proposalId}</td>
                        <td style={{ fontWeight: 700 }}>{p.proposalValue}</td>
                        <td>{p.validityDate}</td>
                        <td><span className={`status-chip ${p.status.toLowerCase()}`}>{p.status}</span></td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}

          {/* Contacts Tab */}
          {activeTab === 'Contacts' && (
            <div style={{ overflowX: 'auto' }}>
              <table className="action-table">
                <thead>
                  <tr>
                    <th>Contact Name</th>
                    <th>Designation</th>
                    <th>Phone</th>
                    <th>Email</th>
                  </tr>
                </thead>
                <tbody>
                  {accountContacts.length === 0 ? (
                    <tr><td colSpan={4} style={{ textAlign: 'center', padding: '1.5rem', color: '#557396' }}>No contacts linked.</td></tr>
                  ) : (
                    accountContacts.map(c => (
                      <tr key={c.id}>
                        <td style={{ fontWeight: 700, color: '#063669' }}>{c.name}</td>
                        <td>{c.designation}</td>
                        <td>{c.phone}</td>
                        <td>{c.email}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
