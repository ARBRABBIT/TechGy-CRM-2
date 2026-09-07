import React, { useState, useEffect, useRef } from 'react';
import {
  LuUsers,
  LuSearch,
  LuFilter,
  LuPlus,
  LuBuilding2,
  LuPhone,
  LuMail,
  LuClock,
  LuTriangleAlert,
  LuChevronRight,
  LuArrowLeft
} from 'react-icons/lu';
import { LEAD_SOURCES, INITIAL_OWNERS } from '../data/mockData';
import { isDateInFilter } from '../utils/dateUtils';
import { animateStaggerEntrance } from '../utils/animations';

export default function LeadsView({
  leads = [],
  onSelectLead,
  onOpenCreateModal,
  sourceFilter: propSourceFilter = '',
  overdueOnlyFilter: propOverdueOnlyFilter = false,
  initialFilterSource = '',
  initialOverdueOnly = false,
  searchQuery = '',
  selectedDateFilter = 'This Month',
  fromDashboard = false,
  onBackToDashboard,
  onClearFilters
}) {
  const effectiveInitialSource = propSourceFilter || initialFilterSource;
  const effectiveInitialOverdue = propOverdueOnlyFilter || initialOverdueOnly;

  const [localSearch, setLocalSearch] = useState('');
  const [sourceFilter, setSourceFilter] = useState(effectiveInitialSource);
  const [statusFilter, setStatusFilter] = useState('All Statuses');
  const [ownerFilter, setOwnerFilter] = useState('All Owners');
  const [overdueOnly, setOverdueOnly] = useState(effectiveInitialOverdue);
  const [selectedLeadIds, setSelectedLeadIds] = useState([]);
  const selectAllRef = useRef(null);

  useEffect(() => {
    setSourceFilter(propSourceFilter || initialFilterSource);
  }, [propSourceFilter, initialFilterSource]);

  useEffect(() => {
    setOverdueOnly(propOverdueOnlyFilter || initialOverdueOnly);
  }, [propOverdueOnlyFilter, initialOverdueOnly]);

  const effectiveSearch = (searchQuery || localSearch).toLowerCase().trim();

  // Multi-field Lead filtering
  const filteredLeads = leads.filter((lead) => {
    // 1. Search Query
    if (effectiveSearch) {
      const matchName = lead.leadName.toLowerCase().includes(effectiveSearch);
      const matchCompany = lead.company.toLowerCase().includes(effectiveSearch);
      const matchEmail = lead.emailId.toLowerCase().includes(effectiveSearch);
      const matchPhone = lead.phoneNumber.toLowerCase().includes(effectiveSearch);
      const matchDesignation = lead.designation.toLowerCase().includes(effectiveSearch);
      if (!matchName && !matchCompany && !matchEmail && !matchPhone && !matchDesignation) {
        return false;
      }
    }

    // 2. Source Filter
    if (sourceFilter && lead.leadSource !== sourceFilter) {
      return false;
    }

    // 3. Status Filter
    if (statusFilter !== 'All Statuses' && lead.status !== statusFilter) {
      return false;
    }

    // 4. Owner Filter
    if (ownerFilter !== 'All Owners' && lead.leadOwner !== ownerFilter) {
      return false;
    }

    // 5. Overdue Only
    if (overdueOnly && !lead.isOverdue) {
      return false;
    }

    // 6. Global Date Filter
    if (selectedDateFilter && selectedDateFilter !== 'All Time') {
      const matchCreated = isDateInFilter(lead.createdDate, selectedDateFilter);
      const matchFollowup = isDateInFilter(lead.nextFollowup, selectedDateFilter);
      if (!matchCreated && !matchFollowup) return false;
    }

    return true;
  });

  const isAllSelected =
    filteredLeads.length > 0 &&
    filteredLeads.every((lead) => selectedLeadIds.includes(lead.id));

  const isIndeterminate =
    selectedLeadIds.length > 0 &&
    !isAllSelected &&
    filteredLeads.some((lead) => selectedLeadIds.includes(lead.id));

  useEffect(() => {
    if (selectAllRef.current) {
      selectAllRef.current.indeterminate = isIndeterminate;
    }
  }, [isIndeterminate]);

  const handleSelectAll = () => {
    if (isAllSelected) {
      const filteredIdSet = new Set(filteredLeads.map((l) => l.id));
      setSelectedLeadIds((prev) => prev.filter((id) => !filteredIdSet.has(id)));
    } else {
      const newIds = new Set([...selectedLeadIds, ...filteredLeads.map((l) => l.id)]);
      setSelectedLeadIds(Array.from(newIds));
    }
  };

  const handleToggleLead = (id, e) => {
    e?.stopPropagation();
    setSelectedLeadIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  return (
    <div className="leads-view">
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
              Leads Directory & Sales Pipeline
            </span>
          </nav>
        </div>
      )}

      {/* Filter & Control Bar */}
      <div className="section-card" style={{ padding: '1rem' }}>
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>

          {/* Search Box */}
          <div className="search-box" style={{ width: '240px' }}>
            <LuSearch className="search-icon" />
            <input
              type="text"
              className="search-input"
              placeholder="Search leads..."
              value={localSearch || searchQuery}
              onChange={(e) => setLocalSearch(e.target.value)}
            />
          </div>

          {/* Filter Dropdowns */}
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
            {/* Source Filter */}
            <select
              className="select-filter"
              value={sourceFilter}
              onChange={(e) => setSourceFilter(e.target.value)}
            >
              <option value="">All Sources</option>
              {LEAD_SOURCES.map((src) => (
                <option key={src} value={src}>{src}</option>
              ))}
            </select>

            {/* Status Filter */}
            <select
              className="select-filter"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="All Statuses">All Statuses</option>
              <option value="New">New</option>
              <option value="Contacted">Contacted</option>
              <option value="Qualified">Qualified</option>
              <option value="Discussion">Discussion</option>
              <option value="Proposal">Proposal</option>
              <option value="Negotiation">Negotiation</option>
            </select>

            {/* Owner Filter */}
            <select
              className="select-filter"
              value={ownerFilter}
              onChange={(e) => setOwnerFilter(e.target.value)}
            >
              {INITIAL_OWNERS.map((o) => (
                <option key={o} value={o}>{o}</option>
              ))}
            </select>

            {/* Overdue Alert Filter Toggle */}
            <button
              className={`btn-secondary ${overdueOnly ? 'active' : ''}`}
              style={overdueOnly ? { background: '#063669', color: 'white', borderColor: '#063669' } : {}}
              onClick={() => setOverdueOnly(!overdueOnly)}
            >
              <LuTriangleAlert size={14} /> Overdue Only ({leads.filter(l => l.isOverdue).length})
            </button>

            {/* Reset Filters */}
            {(sourceFilter || statusFilter !== 'All Statuses' || ownerFilter !== 'All Owners' || overdueOnly || localSearch) && (
              <button
                className="btn-secondary"
                style={{ fontSize: '0.75rem' }}
                onClick={() => {
                  setSourceFilter('');
                  setStatusFilter('All Statuses');
                  setOwnerFilter('All Owners');
                  setOverdueOnly(false);
                  setLocalSearch('');
                  if (onClearFilters) onClearFilters();
                }}
              >
                Reset Filters
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Leads Main Table */}
      <div className="section-card">
        <div className="section-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <h3 className="section-title">
              Lead Records ({filteredLeads.length})
            </h3>
            {selectedLeadIds.length > 0 && (
              <span
                style={{
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  padding: '0.2rem 0.65rem',
                  borderRadius: '12px',
                  background: '#E6EFF8',
                  color: '#063669',
                  border: '1px solid rgba(6, 54, 105, 0.15)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.4rem'
                }}
              >
                {selectedLeadIds.length} selected
                <button
                  type="button"
                  onClick={() => setSelectedLeadIds([])}
                  style={{
                    background: 'none',
                    border: 'none',
                    padding: 0,
                    cursor: 'pointer',
                    color: '#063669',
                    fontSize: '0.85rem',
                    fontWeight: 700,
                    lineHeight: 1
                  }}
                  title="Clear selection"
                  aria-label="Clear selection"
                >
                  ✕
                </button>
              </span>
            )}
          </div>
          <button
            className="btn-primary"
            onClick={() => onOpenCreateModal('createLead')}
            style={{ padding: '0.35rem 0.75rem', fontSize: '0.8rem' }}
          >
            <LuPlus size={15} /> Create Lead
          </button>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table className="action-table">
            <thead>
              <tr>
                <th className="th-checkbox">
                  <input
                    ref={selectAllRef}
                    type="checkbox"
                    className="table-checkbox"
                    checked={isAllSelected}
                    onChange={handleSelectAll}
                    aria-label="Select all leads"
                  />
                </th>
                <th>Lead Name</th>
                <th>Company</th>
                <th>Designation</th>
                <th>Lead Source</th>
                <th>Status</th>
                <th>Lead Owner</th>
                <th>Next Follow-up</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredLeads.length === 0 ? (
                <tr>
                  <td colSpan={9} style={{ textAlign: 'center', padding: '2rem', color: '#557396' }}>
                    No leads found matching current filter criteria.
                  </td>
                </tr>
              ) : (
                filteredLeads.map((lead) => {
                  const isSelected = selectedLeadIds.includes(lead.id);
                  return (
                    <tr
                      key={lead.id}
                      className={`${lead.isOverdue ? 'overdue-row' : ''} ${isSelected ? 'selected-row' : ''}`}
                      onClick={() => onSelectLead(lead)}
                    >
                      <td
                        className="td-checkbox"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <input
                          type="checkbox"
                          className="table-checkbox"
                          checked={isSelected}
                          onChange={(e) => handleToggleLead(lead.id, e)}
                          aria-label={`Select ${lead.leadName}`}
                        />
                      </td>
                      <td style={{ fontWeight: 700, color: '#063669' }}>
                        {lead.leadName}
                      </td>
                      <td style={{ fontWeight: 600 }}>{lead.company}</td>
                      <td>{lead.designation}</td>
                      <td>
                        <span className="status-chip new" style={{ fontSize: '0.7rem' }}>
                          {lead.leadSource}
                        </span>
                      </td>
                      <td>
                        <span className={`status-chip ${lead.status.toLowerCase()}`}>
                          {lead.status}
                        </span>
                      </td>
                      <td>{lead.leadOwner}</td>
                      <td>
                        <span style={{ color: lead.isOverdue ? '#063669' : '#063669', fontWeight: 600 }}>
                          <LuClock size={12} style={{ display: 'inline', marginRight: 4 }} />
                          {lead.nextFollowup}
                        </span>
                      </td>
                      <td>
                        <button
                          className="btn-secondary"
                          style={{ padding: '0.2rem 0.5rem', fontSize: '0.725rem' }}
                          onClick={(e) => {
                            e.stopPropagation();
                            onSelectLead(lead);
                          }}
                        >
                          Inspect <LuChevronRight size={12} />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
