import React, { useState, useRef, useEffect } from 'react';
import {
  LuSearch,
  LuBell,
  LuMenu,
  LuPlus,
  LuUsers,
  LuBuilding2,
  LuTrendingUp,
  LuFileText,
  LuContact,
  LuCalendar,
  LuX
} from 'react-icons/lu';
import { INITIAL_OWNERS, INITIAL_DATE_FILTERS } from '../data/mockData';
import NotificationsPopover from './NotificationsPopover';
import CustomDateSelector from './CustomDateSelector';

export default function GlobalHeader({
  activeModule,
  searchQuery,
  setSearchQuery,
  selectedDateFilter,
  setSelectedDateFilter,
  selectedOwnerFilter,
  setSelectedOwnerFilter,
  setMobileOpen,
  onOpenCreateModal,
  leads = [],
  accounts = [],
  opportunities = [],
  proposals = [],
  contacts = [],
  activities = [],
  onSelectSearchResult,
  notifications = [],
  onMarkAsRead,
  onMarkAllAsRead,
  onClearAll,
  onSelectNotification,
  onOpenProfile,
  onLogout
}) {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const searchContainerRef = useRef(null);

  const getModuleTitle = () => {
    switch (activeModule) {
      case 'dashboard': return 'Dashboard';
      case 'leads': return 'Leads Directory';
      case 'accounts': return 'Company Accounts';
      case 'opportunities': return 'Opportunities Pipeline';
      case 'activities': return 'Activities & Engagement';
      case 'proposals': return 'Proposals & Value';
      case 'contacts': return 'Contacts Directory';
      default: return 'Dashboard';
    }
  };

  // Close search dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target)) {
        setIsSearchOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Universal Search filtering across all 6 CRM datasets
  const q = searchQuery.toLowerCase().trim();
  const hasQuery = q.length > 0;

  const matchedLeads = hasQuery
    ? leads.filter(l => l.leadName.toLowerCase().includes(q) || l.company.toLowerCase().includes(q) || l.emailId.toLowerCase().includes(q) || l.leadOwner.toLowerCase().includes(q))
    : [];

  const matchedAccounts = hasQuery
    ? accounts.filter(a => a.companyName.toLowerCase().includes(q) || a.industry.toLowerCase().includes(q) || a.location.toLowerCase().includes(q) || a.accountOwner.toLowerCase().includes(q))
    : [];

  const matchedOpps = hasQuery
    ? opportunities.filter(o => o.opportunityName.toLowerCase().includes(q) || o.accountName.toLowerCase().includes(q) || o.owner.toLowerCase().includes(q))
    : [];

  const matchedProposals = hasQuery
    ? proposals.filter(p => p.proposalId.toLowerCase().includes(q) || p.company.toLowerCase().includes(q) || p.notes.toLowerCase().includes(q))
    : [];

  const matchedContacts = hasQuery
    ? contacts.filter(c => c.name.toLowerCase().includes(q) || c.company.toLowerCase().includes(q) || c.email.toLowerCase().includes(q))
    : [];

  const matchedActivities = hasQuery
    ? activities.filter(act => act.company.toLowerCase().includes(q) || (act.lead && act.lead.toLowerCase().includes(q)) || (act.notes && act.notes.toLowerCase().includes(q)))
    : [];

  const totalMatches = matchedLeads.length + matchedAccounts.length + matchedOpps.length + matchedProposals.length + matchedContacts.length + matchedActivities.length;

  const handleItemClick = (category, item) => {
    setIsSearchOpen(false);
    setSearchQuery('');
    if (onSelectSearchResult) {
      onSelectSearchResult(category, item);
    }
  };

  return (
    <header className="global-header">
      <div className="header-left">
        {/* Mobile Toggle */}
        <button
          className="mobile-menu-toggle"
          onClick={() => setMobileOpen(true)}
          aria-label="Toggle navigation"
        >
          <LuMenu size={22} />
        </button>

        <h1 className="page-title">{getModuleTitle()}</h1>
      </div>

      <div className="header-right">
        {/* Universal Search Container with Live Results */}
        <div className="search-box" ref={searchContainerRef}>
          <LuSearch className="search-icon" />
          <input
            type="text"
            className="search-input"
            placeholder="Universal search (Leads, Companies, Opps)..."
            value={searchQuery}
            onFocus={() => setIsSearchOpen(true)}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setIsSearchOpen(true);
            }}
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              style={{
                position: 'absolute',
                right: '0.6rem',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: '#737373',
                display: 'flex',
                alignItems: 'center'
              }}
            >
              <LuX size={14} />
            </button>
          )}

          {/* Live Universal Search Dropdown Overlay */}
          {isSearchOpen && hasQuery && (
            <div className="search-results-dropdown">
              <div style={{ padding: '0.4rem 0.6rem 0.2rem', fontSize: '0.75rem', color: '#737373', borderBottom: '1px solid #F4F4F4', display: 'flex', justifyContent: 'space-between' }}>
                <span>Search Results</span>
                <span><strong>{totalMatches}</strong> found</span>
              </div>

              {totalMatches === 0 ? (
                <div style={{ padding: '1.5rem', textAlign: 'center', color: '#737373', fontSize: '0.85rem' }}>
                  No matching records found for "{searchQuery}"
                </div>
              ) : (
                <>
                  {/* Matching Leads */}
                  {matchedLeads.length > 0 && (
                    <div>
                      <div className="search-category-title">
                        <LuUsers size={12} style={{ display: 'inline', marginRight: 4 }} /> Leads ({matchedLeads.length})
                      </div>
                      {matchedLeads.slice(0, 3).map((lead) => (
                        <div key={lead.id} className="search-result-item" onClick={() => handleItemClick('lead', lead)}>
                          <div>
                            <div className="search-result-title">{lead.leadName}</div>
                            <div className="search-result-sub">{lead.company} • {lead.designation}</div>
                          </div>
                          <span className="status-chip new" style={{ fontSize: '0.65rem', padding: '0.1rem 0.4rem' }}>{lead.status}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Matching Companies / Accounts */}
                  {matchedAccounts.length > 0 && (
                    <div>
                      <div className="search-category-title">
                        <LuBuilding2 size={12} style={{ display: 'inline', marginRight: 4 }} /> Accounts ({matchedAccounts.length})
                      </div>
                      {matchedAccounts.slice(0, 3).map((acc) => (
                        <div key={acc.id} className="search-result-item" onClick={() => handleItemClick('account', acc)}>
                          <div>
                            <div className="search-result-title">{acc.companyName}</div>
                            <div className="search-result-sub">{acc.industry} • {acc.location}</div>
                          </div>
                          <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#141414' }}>{acc.estimatedAccountValue}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Matching Opportunities */}
                  {matchedOpps.length > 0 && (
                    <div>
                      <div className="search-category-title">
                        <LuTrendingUp size={12} style={{ display: 'inline', marginRight: 4 }} /> Opportunities ({matchedOpps.length})
                      </div>
                      {matchedOpps.slice(0, 3).map((opp) => (
                        <div key={opp.id} className="search-result-item" onClick={() => handleItemClick('opportunity', opp)}>
                          <div>
                            <div className="search-result-title">{opp.opportunityName}</div>
                            <div className="search-result-sub">{opp.accountName} • Stage: {opp.currentStage}</div>
                          </div>
                          <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#141414' }}>{opp.estimatedValue}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Matching Proposals */}
                  {matchedProposals.length > 0 && (
                    <div>
                      <div className="search-category-title">
                        <LuFileText size={12} style={{ display: 'inline', marginRight: 4 }} /> Proposals ({matchedProposals.length})
                      </div>
                      {matchedProposals.slice(0, 3).map((prop) => (
                        <div key={prop.id} className="search-result-item" onClick={() => handleItemClick('proposal', prop)}>
                          <div>
                            <div className="search-result-title">{prop.proposalId} - {prop.company}</div>
                            <div className="search-result-sub">{prop.opportunity}</div>
                          </div>
                          <span className="status-chip proposal" style={{ fontSize: '0.65rem' }}>{prop.status}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Matching Contacts */}
                  {matchedContacts.length > 0 && (
                    <div>
                      <div className="search-category-title">
                        <LuContact size={12} style={{ display: 'inline', marginRight: 4 }} /> Contacts ({matchedContacts.length})
                      </div>
                      {matchedContacts.slice(0, 3).map((con) => (
                        <div key={con.id} className="search-result-item" onClick={() => handleItemClick('contact', con)}>
                          <div>
                            <div className="search-result-title">{con.name}</div>
                            <div className="search-result-sub">{con.company} • {con.phone}</div>
                          </div>
                          <span className="status-chip new" style={{ fontSize: '0.65rem' }}>Contact</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Matching Activities */}
                  {matchedActivities.length > 0 && (
                    <div>
                      <div className="search-category-title">
                        <LuCalendar size={12} style={{ display: 'inline', marginRight: 4 }} /> Activities ({matchedActivities.length})
                      </div>
                      {matchedActivities.slice(0, 3).map((act) => (
                        <div key={act.id} className="search-result-item" onClick={() => handleItemClick('activity', act)}>
                          <div>
                            <div className="search-result-title">{act.type}: {act.company}</div>
                            <div className="search-result-sub">{act.lead || act.subject || act.notes}</div>
                          </div>
                          <span style={{ fontSize: '0.7rem', color: '#737373' }}>{act.date}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>
          )}
        </div>

        {/* Custom Date Filter */}
        <CustomDateSelector
          selectedDateFilter={selectedDateFilter}
          setSelectedDateFilter={setSelectedDateFilter}
        />

        {/* Owner Filter */}
        <select
          className="select-filter"
          value={selectedOwnerFilter}
          onChange={(e) => setSelectedOwnerFilter(e.target.value)}
          title="Owner Filter"
        >
          {INITIAL_OWNERS.map((ownerOpt) => (
            <option key={ownerOpt} value={ownerOpt}>
              {ownerOpt}
            </option>
          ))}
        </select>

        {/* Primary CTA */}
        <button
          className="btn-primary"
          onClick={() => onOpenCreateModal()}
          title="Common Action: Create New Record"
        >
          <LuPlus size={16} />
          <span>Create New</span>
        </button>

        {/* Notification Icon & Popover */}
        <div style={{ position: 'relative' }}>
          <button
            className="icon-button"
            title="Notifications"
            onClick={() => setIsNotificationOpen(!isNotificationOpen)}
          >
            <LuBell size={18} />
            {notifications.filter(n => !n.isRead).length > 0 && (
              <span className="notification-badge">
                {notifications.filter(n => !n.isRead).length}
              </span>
            )}
          </button>
          <NotificationsPopover
            isOpen={isNotificationOpen}
            onClose={() => setIsNotificationOpen(false)}
            notifications={notifications}
            onMarkAsRead={onMarkAsRead}
            onMarkAllAsRead={onMarkAllAsRead}
            onClearAll={onClearAll}
            onNotificationClick={(item) => {
              setIsNotificationOpen(false);
              if (onSelectNotification) onSelectNotification(item);
            }}
          />
        </div>
      </div>
    </header>
  );
}
