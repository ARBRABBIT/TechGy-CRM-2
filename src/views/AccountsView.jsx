import React from 'react';
import { LuBuilding2, LuGlobe, LuMapPin, LuChevronRight } from 'react-icons/lu';
import { isDateInFilter } from '../utils/dateUtils';

export default function AccountsView({
  accounts = [],
  onSelectAccount,
  searchQuery = '',
  selectedDateFilter = 'This Month',
  selectedOwnerFilter = 'All Owners',
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

    const matchesOwner = !selectedOwnerFilter || selectedOwnerFilter === 'All Owners' || acc.accountOwner === selectedOwnerFilter;

    // Company Accounts are enduring organizational records; only filter by creation date if an explicit custom range is set
    const isCustomDate = typeof selectedDateFilter === 'object' && selectedDateFilter?.type === 'custom';
    const matchesDate = isCustomDate
      ? (!acc.createdDate ? true : isDateInFilter(acc.createdDate, selectedDateFilter))
      : true;

    return matchesSearch && matchesOwner && matchesDate;
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

      {filteredAccounts.length === 0 ? (
        <div className="section-card" style={{ textAlign: 'center', padding: '3.5rem 1.5rem' }}>
          <div style={{ width: '52px', height: '52px', borderRadius: '50%', backgroundColor: '#F1F5F9', color: '#64748B', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
            <LuBuilding2 size={26} />
          </div>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#063669', marginBottom: '0.4rem' }}>
            No Company Accounts Found
          </h3>
          <p style={{ fontSize: '0.85rem', color: '#64748B', maxWidth: '420px', margin: '0 auto' }}>
            No company accounts match your active search query, date range, or selected owner filter.
          </p>
        </div>
      ) : (
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
                  View <LuChevronRight size={12} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
