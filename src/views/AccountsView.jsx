import React from 'react';
import { LuBuilding2, LuGlobe, LuMapPin, LuChevronRight } from 'react-icons/lu';
import { isDateInFilter } from '../utils/dateUtils';

export default function AccountsView({
  accounts = [],
  onSelectAccount,
  searchQuery = '',
  selectedDateFilter = 'This Month',
  fromDashboard = false,
  onBackToDashboard
}) {
  const q = searchQuery.toLowerCase().trim();
  const filteredAccounts = accounts.filter(acc => {
    const matchesSearch = !q ||
      acc.companyName.toLowerCase().includes(q) ||
      acc.industry.toLowerCase().includes(q) ||
      acc.location.toLowerCase().includes(q) ||
      acc.accountOwner.toLowerCase().includes(q);

    const dateToCheck = acc.createdDate || acc.lastContacted;
    const matchesDate = !dateToCheck ? true : isDateInFilter(dateToCheck, selectedDateFilter);

    return matchesSearch && matchesDate;
  });

  return (
    <div className="accounts-view">
      {/* Conditional Breadcrumbs when redirected from Dashboard */}
      {fromDashboard && (
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1.25rem' }}>
          <nav style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', fontWeight: 500, color: '#557396' }}>
            <span
              onClick={onBackToDashboard}
              style={{ cursor: 'pointer', color: '#063669' }}
              title="Go to Dashboard"
            >
              Dashboard
            </span>
            <LuChevronRight size={14} />
            <span style={{ color: '#063669', fontWeight: 700 }}>
              Company Accounts
            </span>
          </nav>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.25rem' }}>
        {filteredAccounts.map((acc) => (
          <div
            key={acc.id}
            className="kpi-card"
            style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}
            onClick={() => onSelectAccount(acc)}
          >
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                <div className="kpi-icon-wrap" style={{ background: '#063669', color: 'white' }}>
                  <LuBuilding2 size={20} />
                </div>
                <span className="counter-badge tasks">
                  Est. {acc.estimatedAccountValue}
                </span>
              </div>

              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#063669', marginBottom: '0.25rem' }}>
                {acc.companyName}
              </h3>
              <div style={{ fontSize: '0.8rem', color: '#557396', marginBottom: '0.75rem' }}>
                {acc.industry} • {acc.companySize}
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', fontSize: '0.8rem', color: '#063669', marginBottom: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <LuGlobe size={14} style={{ color: '#557396' }} /> {acc.website}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <LuMapPin size={14} style={{ color: '#557396' }} /> {acc.location}
                </div>
              </div>
            </div>

            <div style={{ paddingTop: '0.75rem', borderTop: '1px solid #E0E6EE', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.775rem' }}>
              <span style={{ color: '#557396' }}>Owner: <strong>{acc.accountOwner}</strong></span>
              <button
                className="btn-secondary"
                style={{ padding: '0.2rem 0.5rem', fontSize: '0.725rem' }}
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectAccount(acc);
                }}
              >
                Inspect Account <LuChevronRight size={12} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
