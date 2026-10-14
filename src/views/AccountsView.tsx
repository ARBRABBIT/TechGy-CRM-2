import React from 'react';
import { LuBuilding2, LuGlobe, LuMapPin, LuChevronRight, LuLayers } from 'react-icons/lu';
import { isDateInFilter } from '../utils/dateUtils';
import { onKeyActivate } from '../utils/a11y';
import { EmptyState } from '../components/common/StateViews';

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
    // 1. Search Query Filter
    const matchSearch =
      !q ||
      acc.companyName.toLowerCase().includes(q) ||
      acc.industry.toLowerCase().includes(q) ||
      (acc.serviceProviding && acc.serviceProviding.toLowerCase().includes(q)) ||
      acc.location.toLowerCase().includes(q) ||
      acc.accountOwner.toLowerCase().includes(q);
    if (!matchSearch) return false;

    // 2. Date Range Filter
    if (selectedDateFilter !== 'This Month' && selectedDateFilter !== 'This Quarter' && selectedDateFilter !== 'All Time') {
      if (!isDateInFilter(acc.createdDate, selectedDateFilter)) return false;
    }

    // 3. Owner Filter
    if (selectedOwnerFilter !== 'All Owners') {
      if (acc.accountOwner !== selectedOwnerFilter) return false;
    }

    return true;
  });

  return (
    <div className="accounts-view">
      {/* Conditional Breadcrumbs when redirected from Dashboard */}
      {fromDashboard && (
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1.25rem' }}>
          <nav style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', fontWeight: 500, color: '#557396' }}>
            <span role="button" tabIndex={0} onKeyDown={onKeyActivate}
              onClick={onBackToDashboard}
              style={{ cursor: 'pointer', color: '#0F1A34' }}
              title="Go to Dashboard"
            >
              Dashboard
            </span>
            <LuChevronRight size={14} />
            <span style={{ color: '#0F1A34', fontWeight: 700 }}>
              Company Accounts
            </span>
          </nav>
        </div>
      )}

      {filteredAccounts.length === 0 ? (
        <div className="section-card">
          <EmptyState
            icon={LuBuilding2}
            title="No company accounts found"
            description="No company accounts match your search, date range or owner filter."
          />
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.25rem' }}>
          {filteredAccounts.map((acc) => (
            <div role="button" tabIndex={0} onKeyDown={onKeyActivate}
              key={acc.id}
              className="kpi-card"
              style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', cursor: 'pointer' }}
              onClick={() => onSelectAccount(acc)}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                  <div className="kpi-icon-wrap" style={{ background: '#0F1A34', color: 'white' }}>
                    <LuBuilding2 size={20} />
                  </div>
                  <span className="counter-badge tasks">
                    Est. {acc.estimatedAccountValue}
                  </span>
                </div>

                <h3 style={{ fontSize: '1.125rem', fontWeight: 700, color: '#0F1A34', marginBottom: '0.25rem' }}>
                  {acc.companyName}
                </h3>
                <div style={{ fontSize: '0.8125rem', color: '#557396', marginBottom: '0.5rem' }}>
                  {acc.industry} • {acc.companySize}
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', fontSize: '0.75rem', color: '#0F1A34', marginBottom: '0.875rem' }}>
                  <span style={{ backgroundColor: '#EBF3FA', border: '1px solid #D5E2EE', padding: '0.25rem 0.5rem', borderRadius: 'var(--radius)', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '0.375rem' }}>
                    <LuLayers size={12} /> {acc.serviceProviding || 'TechGy CRM Enterprise Suite'}
                  </span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem', fontSize: '0.8125rem', color: '#0F1A34', marginBottom: '1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                    <LuGlobe size={14} style={{ color: '#557396' }} /> {acc.website}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                    <LuMapPin size={14} style={{ color: '#557396' }} /> {acc.location}
                  </div>
                </div>
              </div>

              <div style={{ paddingTop: '0.75rem', borderTop: '1px solid #E0E6EE', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.75rem' }}>
                <span style={{ color: '#557396' }}>Owner: <strong>{acc.accountOwner}</strong></span>
                <button
                  className="btn-secondary btn-sm"
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
