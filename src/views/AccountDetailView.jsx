import React, { useState, useEffect } from 'react';
import {
  LuChevronRight,
  LuGlobe,
  LuMapPin,
  LuUsers,
  LuPlus,
  LuPencil,
  LuSave,
  LuCheck
} from 'react-icons/lu';
import { INITIAL_OWNERS } from '../data/mockData';

export default function AccountDetailView({
  account,
  onBack,
  onNavigateHome,
  leads = [],
  onSelectLead,
  onOpenCreateModal,
  onUpdateAccount,
  navigationSource = 'accounts',
  fromDashboard = false,
  onNavigateToActivities,
  onNavigateToProposals,
  onNavigateToContacts,
  onNavigateToOpportunities,
  onNavigateToLeads
}) {
  const isBlankAccount = !account?.industry && !account?.website && !account?.location;
  const [isEditing, setIsEditing] = useState(isBlankAccount);
  const [formData, setFormData] = useState({
    companyName: account?.companyName || account?.company || '',
    industry: account?.industry || '',
    companySize: account?.companySize || '',
    estimatedAccountValue: account?.estimatedAccountValue || '',
    website: account?.website || '',
    location: account?.location || '',
    accountOwner: account?.accountOwner || 'Rajesh Sharma'
  });

  useEffect(() => {
    if (!account) return;
    setFormData({
      companyName: account.companyName || account.company || '',
      industry: account.industry || '',
      companySize: account.companySize || '',
      estimatedAccountValue: account.estimatedAccountValue || '',
      website: account.website || '',
      location: account.location || '',
      accountOwner: account.accountOwner || 'Rajesh Sharma'
    });
    if (!account.industry && !account.website && !account.location) {
      setIsEditing(true);
    }
  }, [account]);

  if (!account) {
    return (
      <div className="account-detail-page" style={{ padding: '2rem', textAlign: 'center' }}>
        <h2>Account Not Found</h2>
        <button className="btn-primary" onClick={onBack || onNavigateHome}>Back to Directory</button>
      </div>
    );
  }

  const handleSaveProfile = (e) => {
    if (e) e.preventDefault();
    if (onUpdateAccount) {
      onUpdateAccount(account.id, formData);
    }
    setIsEditing(false);
  };

  const compNameLower = (formData.companyName || account.companyName || account.company || '').toLowerCase().trim();

  // Filter linked items safely
  const accountLeads = leads.filter(l => {
    const c = (l.company || l.companyName || '').toLowerCase().trim();
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
                {formData.companyName || account.companyName}
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
                {formData.companyName || account.companyName}
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
                {formData.companyName || account.companyName}
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
                {formData.companyName || account.companyName}
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
                {formData.companyName || account.companyName}
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
                {formData.companyName || account.companyName}
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
                {formData.companyName || account.companyName}
              </span>
            </>
          )}
        </nav>
      </div>

      {/* 2. Top Header Card */}
      <div className="section-card" style={{ marginBottom: '1.25rem', padding: '1.25rem 1.5rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.35rem', flexWrap: 'wrap' }}>
            <h2 style={{ fontSize: '1.4rem', margin: 0, color: '#063669', fontWeight: 700 }}>
              {formData.companyName || account.companyName}
            </h2>
            {formData.estimatedAccountValue && (
              <span className="counter-badge alert" style={{ background: '#E6EFF8', color: '#063669', border: '1px solid rgba(6, 54, 105, 0.15)', fontWeight: 600 }}>
                Est. Worth {formData.estimatedAccountValue}
              </span>
            )}
          </div>
          <p style={{ margin: 0, color: '#557396', fontSize: '0.875rem' }}>
            {formData.industry || 'No industry set'} • {formData.companySize || 'No size specified'} • Owner: {formData.accountOwner}
          </p>
        </div>
      </div>

      {/* 3. Top Metrics Row */}
      <div className="revenue-grid" style={{ marginBottom: '1.25rem', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))' }}>
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
            <span className="kpi-title">Estimated Account Value</span>
            <div className="kpi-icon-wrap" style={{ background: '#063669', color: 'white' }}><LuGlobe size={18} /></div>
          </div>
          <div className="kpi-value">{formData.estimatedAccountValue || 'Not Set'}</div>
          <div className="kpi-subtext">{formData.companySize || 'Enterprise Tier'}</div>
        </div>
      </div>

      {/* 4. Main Content Container */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>

        {/* Account Profile Summary / Editor Card */}
        <div className="section-card" style={{ marginBottom: '0.65rem', padding: '1rem 1.25rem' }}>
          <div className="section-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h3 className="section-title">Company Profile</h3>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              {isEditing ? (
                <>
                  {!isBlankAccount && (
                    <button
                      type="button"
                      className="btn-secondary"
                      onClick={() => setIsEditing(false)}
                      style={{ fontSize: '0.785rem', padding: '0.35rem 0.75rem' }}
                    >
                      Cancel
                    </button>
                  )}
                  <button
                    type="button"
                    className="btn-primary"
                    onClick={handleSaveProfile}
                    style={{ fontSize: '0.785rem', padding: '0.35rem 0.85rem', display: 'inline-flex', alignItems: 'center', gap: '0.35rem', fontWeight: 600 }}
                  >
                    <LuSave size={14} /> Save Profile
                  </button>
                </>
              ) : (
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => setIsEditing(true)}
                  style={{ fontSize: '0.785rem', padding: '0.35rem 0.75rem', display: 'inline-flex', alignItems: 'center', gap: '0.35rem', fontWeight: 600 }}
                >
                  <LuPencil size={13} /> Edit Profile
                </button>
              )}
            </div>
          </div>

          {isEditing ? (
            <form onSubmit={handleSaveProfile}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Company Name *</label>
                  <input
                    type="text"
                    className="form-input"
                    required
                    placeholder="e.g. Acme Technologies Ltd"
                    value={formData.companyName}
                    onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Industry</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. Enterprise Software, IT"
                    value={formData.industry}
                    onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Company Size</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. 100-500 employees"
                    value={formData.companySize}
                    onChange={(e) => setFormData({ ...formData, companySize: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Estimated Account Value</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. ₹1,50,00,000"
                    value={formData.estimatedAccountValue}
                    onChange={(e) => setFormData({ ...formData, estimatedAccountValue: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Website</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. www.acme.co.in"
                    value={formData.website}
                    onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Location / Headquarters</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. Mumbai, MH"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Account Owner</label>
                  <select
                    className="form-select"
                    value={formData.accountOwner}
                    onChange={(e) => setFormData({ ...formData, accountOwner: e.target.value })}
                  >
                    {INITIAL_OWNERS.filter(o => o !== 'All Owners').map(o => (
                      <option key={o} value={o}>{o}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div style={{ marginTop: '1.25rem', display: 'flex', justifyContent: 'flex-end', gap: '0.6rem' }}>
                <button
                  type="submit"
                  className="btn-primary"
                  style={{ fontSize: '0.825rem', padding: '0.45rem 1.15rem', display: 'inline-flex', alignItems: 'center', gap: '0.4rem', fontWeight: 600 }}
                >
                  <LuCheck size={15} /> Save Company Details
                </button>
              </div>
            </form>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem' }}>
              <div className="drawer-field-group">
                <div className="field-label">Company Name</div>
                <div className="field-value" style={{ fontWeight: 700, color: '#063669' }}>
                  {formData.companyName || 'Not Set'}
                </div>
              </div>

              <div className="drawer-field-group">
                <div className="field-label">Industry</div>
                <div className="field-value">{formData.industry || 'Not Set'}</div>
              </div>

              <div className="drawer-field-group">
                <div className="field-label">Company Size</div>
                <div className="field-value">{formData.companySize || 'Not Set'}</div>
              </div>

              <div className="drawer-field-group">
                <div className="field-label">Estimated Account Value</div>
                <div className="field-value" style={{ fontWeight: 700, color: '#063669' }}>
                  {formData.estimatedAccountValue || 'Not Set'}
                </div>
              </div>

              <div className="drawer-field-group">
                <div className="field-label">Website</div>
                <div className="field-value" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <LuGlobe size={14} style={{ color: '#557396' }} /> {formData.website || 'Not Set'}
                </div>
              </div>

              <div className="drawer-field-group">
                <div className="field-label">Location / Headquarters</div>
                <div className="field-value" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <LuMapPin size={14} style={{ color: '#557396' }} /> {formData.location || 'Not Set'}
                </div>
              </div>

              <div className="drawer-field-group">
                <div className="field-label">Account Owner</div>
                <div className="field-value" style={{ fontWeight: 600, color: '#063669' }}>
                  {formData.accountOwner || 'Not Set'}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Relational Leads Table */}
        <div className="section-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <h3 className="section-title">
              Leads ({accountLeads.length})
            </h3>
            <button
              className="btn-primary"
              onClick={() => onOpenCreateModal && onOpenCreateModal('createLead', account)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
                fontSize: '0.8rem',
                padding: '0.45rem 0.95rem',
                borderRadius: '6px',
                fontWeight: 600,
                cursor: 'pointer'
              }}
              title="Add a new lead to this account"
            >
              <LuPlus size={15} /> Add Lead
            </button>
          </div>

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
                          View <LuChevronRight size={12} />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
