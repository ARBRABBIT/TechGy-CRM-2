import React, { useState } from 'react';
import {
  LuUser,
  LuMail,
  LuPhone,
  LuMapPin,
  LuTrendingUp,
  LuShield,
  LuCircleCheck,
  LuSave,
  LuBriefcase,
  LuChevronRight,
  LuLogOut
} from 'react-icons/lu';

export default function ProfileView({
  currentUser,
  onNavigateHome,
  accounts = [],
  opportunities = [],
  _leads = [],
  onSelectAccount,
  onLogout
}) {
  const [activeTab, setActiveTab] = useState('details');

  const userName = currentUser?.name || 'System Administrator';
  const userRole = currentUser?.role === 'admin'
    ? 'Sales Administrator'
    : currentUser?.role === 'manager'
      ? 'Sales Operations Manager'
      : (currentUser?.role || 'Senior Sales Director');
  const userEmail = currentUser?.email || 'admin@techgy.com';

  // Profile Form State
  const [profileData, setProfileData] = useState({
    fullName: userName,
    title: `${userRole} - Enterprise Accounts`,
    department: 'Enterprise Sales & Partnerships',
    email: userEmail,
    phone: '+91 98765 43210',
    location: 'Mumbai HQ, Maharashtra',
    timeZone: 'IST (UTC+05:30)',
    bio: `${userRole} with proven enterprise domain experience leading cloud solutions, CRM integrations, and strategic client accounts across PAN India.`
  });

  const [savedSuccess, setSavedSuccess] = useState(false);

  // Security & Notification Preferences State
  const [notifications, setNotifications] = useState({
    emailOverdue: true,
    emailNewLeads: true,
    smsHighValue: true,
    dailyDigest: false,
    twoFactor: true
  });

  const handleSaveProfile = (e) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const initials = (profileData.fullName || 'User')
    .split(' ')
    .filter(Boolean)
    .map(n => n[0])
    .join('')
    .substring(0, 2)
    .toUpperCase() || 'U';

  const myAccounts = accounts.filter(a =>
    a.accountOwner === profileData.fullName ||
    a.accountOwner === userName ||
    (currentUser?.role === 'admin' ? true : false)
  );

  const myOpps = opportunities.filter(o =>
    o.owner === profileData.fullName ||
    o.owner === userName ||
    (currentUser?.role === 'admin' ? true : false)
  );

  const closedWonOpps = myOpps.filter(o => o.currentStage === 'Closed Won');
  const winRate = myOpps.length > 0 ? ((closedWonOpps.length / myOpps.length) * 100).toFixed(1) + '%' : '78.4%';
  const totalClosedVal = closedWonOpps.reduce((sum, opp) => {
    const rawVal = String(opp.dealValue || '').replace(/[^0-9.]/g, '');
    const num = parseFloat(rawVal) || 0;
    return sum + num;
  }, 0);
  const ytdClosedRevenue = totalClosedVal > 0 ? `₹${(totalClosedVal / 10000000).toFixed(2)} Cr` : '₹1.82 Cr';
  const avgDealSizeVal = closedWonOpps.length > 0 ? `₹${((totalClosedVal / closedWonOpps.length) / 100000).toFixed(1)} L` : '₹42.5 L';

  return (
    <div className="profile-view" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {/* Top Breadcrumb Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <nav style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', fontWeight: 500, color: '#557396' }}>
          <span
            onClick={onNavigateHome}
            style={{ cursor: 'pointer', color: '#063669' }}
            title="Go to Dashboard"
          >
            Dashboard
          </span>
          <LuChevronRight size={14} />
          <span style={{ color: '#063669', fontWeight: 700 }}>
            User Profile & Settings
          </span>
        </nav>

        {onLogout && (
          <button
            type="button"
            onClick={onLogout}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              background: '#FEF2F2',
              color: '#EF4444',
              border: '1px solid #FCA5A5',
              padding: '0.45rem 0.95rem',
              borderRadius: '9999px',
              fontWeight: 600,
              fontSize: '0.85rem',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
            title="Sign out of TechGy Link"
          >
            <LuLogOut size={16} />
            <span>Log Out</span>
          </button>
        )}
      </div>

      {/* Hero Profile Banner Header */}
      <div
        style={{
          background: 'linear-gradient(135deg, #063669 0%, #0A4B8F 55%, #04264A 100%)',
          borderRadius: '16px',
          padding: '1.75rem',
          color: '#FFFFFF',
          position: 'relative',
          overflow: 'hidden',
          boxShadow: '0 12px 30px rgba(6, 54, 105, 0.2)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '1.5rem', flexWrap: 'wrap', position: 'relative', zIndex: 2 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
            {/* Avatar Circle */}
            <div style={{ position: 'relative' }}>
              <div
                style={{
                  width: '80px',
                  height: '80px',
                  borderRadius: '50%',
                  backgroundColor: '#FFFFFF',
                  color: '#063669',
                  fontWeight: 800,
                  fontSize: '2rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 6px 16px rgba(0, 0, 0, 0.25)',
                  border: '3px solid rgba(255, 255, 255, 0.4)'
                }}
              >
                {initials}
              </div>
              <span
                style={{
                  position: 'absolute',
                  bottom: '2px',
                  right: '2px',
                  width: '16px',
                  height: '16px',
                  backgroundColor: '#10B981',
                  borderRadius: '50%',
                  border: '2px solid #063669'
                }}
                title="Online & Active"
              />
            </div>

            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.25rem' }}>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 800, margin: 0 }}>{profileData.fullName}</h2>
                <span
                  style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.18)',
                    color: '#FFFFFF',
                    fontSize: '0.725rem',
                    fontWeight: 700,
                    padding: '0.2rem 0.6rem',
                    borderRadius: '9999px'
                  }}
                >
                  Active Staff
                </span>
              </div>
              <p style={{ fontSize: '0.9rem', color: '#D0DCEB', margin: 0, fontWeight: 500 }}>
                {profileData.title}
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1.15rem', marginTop: '0.6rem', fontSize: '0.8rem', color: '#E0E6EE', flexWrap: 'wrap' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <LuMail size={14} /> {profileData.email}
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <LuPhone size={14} /> {profileData.phone}
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <LuMapPin size={14} /> {profileData.location}
                </span>
              </div>
            </div>
          </div>

          {/* Quick Metrics Badge Group */}
          <div style={{ display: 'flex', gap: '0.85rem', flexWrap: 'wrap' }}>
            <div style={{ background: 'rgba(255, 255, 255, 0.1)', backdropFilter: 'blur(4px)', padding: '0.85rem 1.15rem', borderRadius: '12px', textAlign: 'center', border: '1px solid rgba(255, 255, 255, 0.15)' }}>
              <div style={{ fontSize: '1.25rem', fontWeight: 800 }}>{ytdClosedRevenue}</div>
              <div style={{ fontSize: '0.7rem', color: '#D0DCEB', textTransform: 'uppercase', fontWeight: 600 }}>YTD Closed Revenue</div>
            </div>
            <div style={{ background: 'rgba(255, 255, 255, 0.1)', backdropFilter: 'blur(4px)', padding: '0.85rem 1.15rem', borderRadius: '12px', textAlign: 'center', border: '1px solid rgba(255, 255, 255, 0.15)' }}>
              <div style={{ fontSize: '1.25rem', fontWeight: 800 }}>{winRate}</div>
              <div style={{ fontSize: '0.7rem', color: '#D0DCEB', textTransform: 'uppercase', fontWeight: 600 }}>Deal Win Rate</div>
            </div>
            <div style={{ background: 'rgba(255, 255, 255, 0.1)', backdropFilter: 'blur(4px)', padding: '0.85rem 1.15rem', borderRadius: '12px', textAlign: 'center', border: '1px solid rgba(255, 255, 255, 0.15)' }}>
              <div style={{ fontSize: '1.25rem', fontWeight: 800 }}>{myAccounts.length} Accounts</div>
              <div style={{ fontSize: '0.7rem', color: '#D0DCEB', textTransform: 'uppercase', fontWeight: 600 }}>Managed Portfolio</div>
            </div>
          </div>
        </div>
      </div>

      {/* Profile Navigation Tabs */}
      <div className="toggle-group" style={{ padding: '4px', alignSelf: 'flex-start' }}>
        <button
          className={`toggle-btn ${activeTab === 'details' ? 'active' : ''}`}
          onClick={() => setActiveTab('details')}
        >
          <LuUser size={14} style={{ marginRight: 4, display: 'inline' }} /> Personal Info
        </button>
        <button
          className={`toggle-btn ${activeTab === 'performance' ? 'active' : ''}`}
          onClick={() => setActiveTab('performance')}
        >
          <LuTrendingUp size={14} style={{ marginRight: 4, display: 'inline' }} /> Performance & Targets
        </button>
        <button
          className={`toggle-btn ${activeTab === 'portfolio' ? 'active' : ''}`}
          onClick={() => setActiveTab('portfolio')}
        >
          <LuBriefcase size={14} style={{ marginRight: 4, display: 'inline' }} /> Managed Portfolio ({myAccounts.length})
        </button>
        <button
          className={`toggle-btn ${activeTab === 'security' ? 'active' : ''}`}
          onClick={() => setActiveTab('security')}
        >
          <LuShield size={14} style={{ marginRight: 4, display: 'inline' }} /> Preferences & Security
        </button>
      </div>

      {/* Saved Toast Notification */}
      {savedSuccess && (
        <div className="toast-banner" style={{ width: 'fit-content', minWidth: '300px', animation: 'toastActionSlideIn 0.35s ease' }}>
          <div className="toast-icon-wrap" style={{ width: '32px', height: '32px', minWidth: '32px' }}>
            <LuCircleCheck size={16} />
          </div>
          <div className="toast-content">
            <div className="toast-title" style={{ fontSize: '0.85rem' }}>Profile settings saved successfully!</div>
          </div>
        </div>
      )}

      {/* Tab 1: Personal Info Form */}
      {activeTab === 'details' && (
        <div className="section-card">
          <div className="section-header">
            <h3 className="section-title">Edit Personal & Professional Details</h3>
          </div>
          <form onSubmit={handleSaveProfile} style={{ display: 'flex', flexDirection: 'column', gap: '1.15rem' }}>
            <div className="form-grid-2">
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <input
                  type="text"
                  className="form-input"
                  value={profileData.fullName}
                  onChange={(e) => setProfileData({ ...profileData, fullName: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Designation / Role</label>
                <input
                  type="text"
                  className="form-input"
                  value={profileData.title}
                  onChange={(e) => setProfileData({ ...profileData, title: e.target.value })}
                />
              </div>
            </div>

            <div className="form-grid-2">
              <div className="form-group">
                <label className="form-label">Email Address</label>
                <input
                  type="email"
                  className="form-input"
                  value={profileData.email}
                  onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Phone Number</label>
                <input
                  type="text"
                  className="form-input"
                  value={profileData.phone}
                  onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                />
              </div>
            </div>

            <div className="form-grid-2">
              <div className="form-group">
                <label className="form-label">Department</label>
                <input
                  type="text"
                  className="form-input"
                  value={profileData.department}
                  onChange={(e) => setProfileData({ ...profileData, department: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Office Location</label>
                <input
                  type="text"
                  className="form-input"
                  value={profileData.location}
                  onChange={(e) => setProfileData({ ...profileData, location: e.target.value })}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Professional Summary / Bio</label>
              <textarea
                className="form-textarea"
                rows={3}
                value={profileData.bio}
                onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
              <button type="submit" className="btn-primary">
                <LuSave size={16} />
                <span>Save Profile Changes</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Tab 2: Performance & Targets */}
      {activeTab === 'performance' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div className="counters-grid">
            <div className="counter-card alert-card">
              <div>
                <div className="counter-title">FY 2025-26 Target</div>
                <div className="counter-value">₹2.00 Cr</div>
              </div>
              <span className="counter-badge alert">Goal</span>
            </div>
            <div className="counter-card">
              <div>
                <div className="counter-title">Achieved YTD</div>
                <div className="counter-value" style={{ color: '#063669' }}>{ytdClosedRevenue}</div>
              </div>
              <span className="counter-badge total">Progress</span>
            </div>
            <div className="counter-card">
              <div>
                <div className="counter-title">Win Rate</div>
                <div className="counter-value" style={{ color: '#063669' }}>{winRate}</div>
              </div>
              <span className="counter-badge tasks">Efficiency</span>
            </div>
            <div className="counter-card">
              <div>
                <div className="counter-title">Avg Deal Size</div>
                <div className="counter-value" style={{ color: '#063669' }}>{avgDealSizeVal}</div>
              </div>
              <span className="counter-badge total">Enterprise</span>
            </div>
          </div>

          <div className="section-card">
            <div className="section-header">
              <h3 className="section-title">Quarterly Quota Progression</h3>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.35rem' }}>
                  <span>Q1 FY26 Target (₹40 L)</span>
                  <span style={{ color: '#063669', fontWeight: 700 }}>₹39 L (97.5%)</span>
                </div>
                <div style={{ height: '8px', backgroundColor: '#E2E8F0', borderRadius: '9999px', overflow: 'hidden' }}>
                  <div style={{ width: '97.5%', height: '100%', backgroundColor: '#063669' }} />
                </div>
              </div>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.35rem' }}>
                  <span>Q2 FY26 Target (₹42 L)</span>
                  <span style={{ color: '#063669', fontWeight: 700 }}>₹44 L (104.7%)</span>
                </div>
                <div style={{ height: '8px', backgroundColor: '#E2E8F0', borderRadius: '9999px', overflow: 'hidden' }}>
                  <div style={{ width: '100%', height: '100%', backgroundColor: '#063669' }} />
                </div>
              </div>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.35rem' }}>
                  <span>Q3 FY26 Target (₹45 L)</span>
                  <span style={{ color: '#063669', fontWeight: 700 }}>₹48.5 L (107.7%)</span>
                </div>
                <div style={{ height: '8px', backgroundColor: '#E2E8F0', borderRadius: '9999px', overflow: 'hidden' }}>
                  <div style={{ width: '100%', height: '100%', backgroundColor: '#063669' }} />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Managed Portfolio */}
      {activeTab === 'portfolio' && (
        <div className="section-card">
          <div className="section-header">
            <h3 className="section-title">Accounts Managed by {profileData.fullName} ({myAccounts.length})</h3>
          </div>
          <table className="action-table">
            <thead>
              <tr>
                <th>Account Name</th>
                <th>Industry</th>
                <th>Estimated Worth</th>
                <th>Leads</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {myAccounts.map(acc => (
                <tr key={acc.id}>
                  <td>
                    <strong>{acc.companyName}</strong>
                    <div style={{ fontSize: '0.75rem', color: '#557396' }}>{acc.location}</div>
                  </td>
                  <td>{acc.industry}</td>
                  <td style={{ fontWeight: 700, color: '#063669' }}>{acc.estimatedAccountValue}</td>
                  <td>{acc.leadsCount} Active</td>
                  <td>
                    <button
                      className="btn-secondary"
                      style={{ padding: '0.25rem 0.65rem', fontSize: '0.75rem' }}
                      onClick={() => onSelectAccount && onSelectAccount(acc)}
                    >
                      Inspect Account
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Tab 4: Security & Notification Preferences */}
      {activeTab === 'security' && (
        <div className="section-card">
          <div className="section-header">
            <h3 className="section-title">Notification & Security Preferences</h3>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.85rem', backgroundColor: '#F8FAFC', borderRadius: '10px' }}>
              <div>
                <div style={{ fontSize: '0.875rem', fontWeight: 700, color: '#063669' }}>Overdue Follow-up Email Alerts</div>
                <div style={{ fontSize: '0.775rem', color: '#557396' }}>Receive immediate notification when lead actions pass their due date.</div>
              </div>
              <input
                type="checkbox"
                checked={notifications.emailOverdue}
                onChange={(e) => setNotifications({ ...notifications, emailOverdue: e.target.checked })}
                style={{ width: '18px', height: '18px', cursor: 'pointer' }}
              />
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.85rem', backgroundColor: '#F8FAFC', borderRadius: '10px' }}>
              <div>
                <div style={{ fontSize: '0.875rem', fontWeight: 700, color: '#063669' }}>New Lead Assignment Alerts</div>
                <div style={{ fontSize: '0.775rem', color: '#557396' }}>Notify when a new lead is assigned to {profileData.fullName}.</div>
              </div>
              <input
                type="checkbox"
                checked={notifications.emailNewLeads}
                onChange={(e) => setNotifications({ ...notifications, emailNewLeads: e.target.checked })}
                style={{ width: '18px', height: '18px', cursor: 'pointer' }}
              />
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.85rem', backgroundColor: '#F8FAFC', borderRadius: '10px' }}>
              <div>
                <div style={{ fontSize: '0.875rem', fontWeight: 700, color: '#063669' }}>Two-Factor Authentication (2FA)</div>
                <div style={{ fontSize: '0.775rem', color: '#557396' }}>Secured via Authenticator App & OTP.</div>
              </div>
              <span className="status-chip won" style={{ fontSize: '0.7rem' }}>Enabled</span>
            </div>

            {onLogout && (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem', backgroundColor: '#FEF2F2', border: '1px solid #FCA5A5', borderRadius: '10px', marginTop: '0.5rem' }}>
                <div>
                  <div style={{ fontSize: '0.875rem', fontWeight: 700, color: '#991B1B' }}>Sign Out & End Session</div>
                  <div style={{ fontSize: '0.775rem', color: '#7F1D1D' }}>Disconnect from TechGy Link CRM and return to login screen.</div>
                </div>
                <button
                  type="button"
                  onClick={onLogout}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    background: '#EF4444',
                    color: '#FFFFFF',
                    border: 'none',
                    padding: '0.5rem 1.1rem',
                    borderRadius: '8px',
                    fontWeight: 700,
                    fontSize: '0.85rem',
                    cursor: 'pointer'
                  }}
                >
                  <LuLogOut size={16} />
                  <span>Log Out Now</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
