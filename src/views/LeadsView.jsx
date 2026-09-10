import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LuSearch,
  LuPlus,
  LuClock,
  LuTriangleAlert,
  LuChevronRight,
  LuChevronLeft,
  LuUserPlus,
  LuMail,
  LuRefreshCw
} from 'react-icons/lu';
import { LEAD_SOURCES, INITIAL_OWNERS } from '../data/mockData';
import { isDateInFilter } from '../utils/dateUtils';
import MultiSelectFilter from '../components/MultiSelectFilter';

const STATUS_OPTIONS = ['New', 'Contacted', 'Qualified', 'Discussion', 'Proposal', 'Negotiation'];
const OWNER_OPTIONS = INITIAL_OWNERS.filter(o => o !== 'All Owners');
const SOURCE_OPTIONS = LEAD_SOURCES;

export default function LeadsView({
  leads = [],
  onSelectLead,
  onSelectAccount,
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
  const [selectedSources, setSelectedSources] = useState(effectiveInitialSource ? [effectiveInitialSource] : []);
  const [selectedStatuses, setSelectedStatuses] = useState([]);
  const [selectedOwners, setSelectedOwners] = useState([]);
  const [overdueOnly, setOverdueOnly] = useState(effectiveInitialOverdue);
  const [selectedLeadIds, setSelectedLeadIds] = useState([]);
  const selectAllRef = useRef(null);

  useEffect(() => {
    const next = propSourceFilter || initialFilterSource;
    if (next) {
      setSelectedSources([next]);
    }
  }, [propSourceFilter, initialFilterSource]);

  useEffect(() => {
    const next = propOverdueOnlyFilter || initialOverdueOnly;
    setOverdueOnly(prev => (prev !== next ? next : prev));
  }, [propOverdueOnlyFilter, initialOverdueOnly]);

  const [currentPage, setCurrentPage] = useState(1);
  const PAGE_SIZE = 10;

  const effectiveSearch = (searchQuery || localSearch).toLowerCase().trim();
  const dateFilterKey = typeof selectedDateFilter === 'object' && selectedDateFilter !== null
    ? `${selectedDateFilter?.startDate}_${selectedDateFilter?.endDate}_${selectedDateFilter?.label}`
    : selectedDateFilter;
  const filterKey = `${selectedSources.join(',')}_${selectedStatuses.join(',')}_${selectedOwners.join(',')}_${overdueOnly}_${localSearch}_${searchQuery}_${dateFilterKey}`;

  useEffect(() => {
    setCurrentPage(1);
  }, [filterKey]);

  // Multi-field Lead filtering
  const filteredLeads = leads.filter((lead) => {
    // 1. Search Query
    if (effectiveSearch) {
      const matchName = lead.leadName.toLowerCase().includes(effectiveSearch);
      const matchCompany = lead.company.toLowerCase().includes(effectiveSearch);
      const matchEmail = (lead.email || lead.emailId || '').toLowerCase().includes(effectiveSearch);
      const matchPhone = (lead.phone || lead.phoneNumber || '').toLowerCase().includes(effectiveSearch);
      const matchDesignation = (lead.designation || '').toLowerCase().includes(effectiveSearch);
      if (!matchName && !matchCompany && !matchEmail && !matchPhone && !matchDesignation) {
        return false;
      }
    }

    // 2. Lead Source (Multi-Select)
    if (selectedSources.length > 0 && !selectedSources.includes(lead.leadSource)) {
      return false;
    }

    // 3. Status Pipeline (Multi-Select)
    if (selectedStatuses.length > 0 && !selectedStatuses.includes(lead.status)) {
      return false;
    }

    // 4. Owner (Multi-Select)
    if (selectedOwners.length > 0 && !selectedOwners.includes(lead.leadOwner)) {
      return false;
    }

    // 5. Overdue Only
    if (overdueOnly && !lead.isOverdue) {
      return false;
    }

    // 6. Global Date Filter
    if (!overdueOnly && selectedDateFilter && selectedDateFilter !== 'All Time') {
      const matchCreated = isDateInFilter(lead.createdDate, selectedDateFilter);
      if (!matchCreated) return false;
    }

    return true;
  });

  const totalLeads = filteredLeads.length;
  const totalPages = Math.ceil(totalLeads / PAGE_SIZE) || 1;
  const currentPageSafe = Math.min(currentPage, totalPages);
  const startIndex = (currentPageSafe - 1) * PAGE_SIZE;
  const displayedLeads = totalLeads > PAGE_SIZE
    ? filteredLeads.slice(startIndex, startIndex + PAGE_SIZE)
    : filteredLeads;

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

  const handleBulkAction = (actionType) => {
    if (selectedLeadIds.length === 0) return;
    const firstSelected = leads.find((l) => l.id === selectedLeadIds[0]) || null;
    if (onOpenCreateModal) {
      onOpenCreateModal(actionType, firstSelected, selectedLeadIds, () => {
        setSelectedLeadIds([]);
      });
    }
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
      <div className="section-card" style={{ padding: '1rem', overflow: 'visible', position: 'relative', zIndex: 20 }}>
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

          {/* Multi-Select Filter Dropdowns */}
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
            {/* Source Multi-Select Filter */}
            <MultiSelectFilter
              label="Source"
              allLabel="All Sources"
              options={SOURCE_OPTIONS}
              selected={selectedSources}
              onChange={setSelectedSources}
            />

            {/* Status Multi-Select Filter */}
            <MultiSelectFilter
              label="Status"
              allLabel="All Statuses"
              options={STATUS_OPTIONS}
              selected={selectedStatuses}
              onChange={setSelectedStatuses}
            />

            {/* Owner Multi-Select Filter */}
            <MultiSelectFilter
              label="Owner"
              allLabel="All Owners"
              options={OWNER_OPTIONS}
              selected={selectedOwners}
              onChange={setSelectedOwners}
            />

            {/* Overdue Alert Filter Toggle */}
            <button
              className={`btn-secondary ${overdueOnly ? 'active' : ''}`}
              style={overdueOnly ? { background: '#ef4444', color: 'white', borderColor: '#ef4444' } : {}}
              onClick={() => setOverdueOnly(!overdueOnly)}
            >
              <LuTriangleAlert size={14} /> Overdue Only ({leads.filter(l => l.isOverdue).length})
            </button>

            {/* Reset Filters */}
            <AnimatePresence>
              {(selectedSources.length > 0 || selectedStatuses.length > 0 || selectedOwners.length > 0 || overdueOnly || localSearch) && (
                <motion.button
                  initial={{ opacity: 0, scale: 0.9, x: -4 }}
                  animate={{ opacity: 1, scale: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0.9, x: -4 }}
                  transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
                  className="btn-secondary"
                  style={{ fontSize: '0.75rem' }}
                  onClick={() => {
                    setSelectedSources([]);
                    setSelectedStatuses([]);
                    setSelectedOwners([]);
                    setOverdueOnly(false);
                    setLocalSearch('');
                    if (onClearFilters) onClearFilters();
                  }}
                >
                  Reset Filters
                </motion.button>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Leads Main Table */}
      <div className="section-card">
        <div className="section-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <h3 className="section-title" style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
              <span>Lead Records</span>
              <motion.span
                key={filteredLeads.length}
                initial={{ scale: 0.82, opacity: 0.6 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
                style={{
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  padding: '0.12rem 0.5rem',
                  borderRadius: '12px',
                  background: '#E6EFF8',
                  color: '#063669',
                  display: 'inline-block'
                }}
              >
                {filteredLeads.length}
              </motion.span>
            </h3>
            <AnimatePresence>
              {selectedLeadIds.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -8 }}
                  transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '0.65rem', flexWrap: 'wrap' }}
                >
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

                  <div className="table-cta-divider" />

                  <div className="table-cta-bar">
                    <button
                      type="button"
                      className="table-cta-btn"
                      onClick={() => handleBulkAction('assignOwner')}
                      title="Assign Owner to selected leads"
                    >
                      <LuUserPlus size={18} />
                      <span>Assign Owner</span>
                    </button>

                    <button
                      type="button"
                      className="table-cta-btn"
                      onClick={() => handleBulkAction('email')}
                      title="Send email to selected leads"
                    >
                      <LuMail size={18} />
                      <span>Email</span>
                    </button>

                    <button
                      type="button"
                      className="table-cta-btn"
                      onClick={() => handleBulkAction('changeStatus')}
                      title="Update pipeline stage for selected leads"
                    >
                      <LuRefreshCw size={18} />
                      <span>Update Stage</span>
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          <button
            className="btn-primary"
            onClick={() => onOpenCreateModal('createLead')}
            style={{ padding: '0.55rem 1rem', fontSize: '0.825rem', borderRadius: '20px', display: 'inline-flex', alignItems: 'center', gap: '0.35rem', fontWeight: 600 }}
          >
            <LuPlus size={15} /> Create Lead
          </button>
        </div>

        <div className="table-responsive-wrapper" style={{ overflowX: 'auto', overflowY: 'hidden', scrollbarWidth: 'none' }}>
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
            <motion.tbody
              key={`${filterKey}_page_${currentPageSafe}`}
              initial={{ opacity: 0.35 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.28, ease: [0.25, 1, 0.5, 1] }}
            >
              {displayedLeads.length === 0 ? (
                <motion.tr
                  key="no-leads"
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.22, ease: [0.25, 1, 0.5, 1] }}
                >
                  <td colSpan={9} style={{ textAlign: 'center', padding: '2.5rem 1rem', color: '#557396' }}>
                    No leads found matching current filter criteria.
                  </td>
                </motion.tr>
              ) : (
                displayedLeads.map((lead, idx) => {
                  const isSelected = selectedLeadIds.includes(lead.id);
                  return (
                    <motion.tr
                      key={lead.id}
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{
                        duration: 0.28,
                        ease: [0.25, 1, 0.5, 1],
                        delay: Math.min(idx * 0.022, 0.1)
                      }}
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
                      <td
                        style={{
                          fontWeight: 600,
                          cursor: onSelectAccount ? 'pointer' : 'inherit',
                          transition: 'color 0.15s ease'
                        }}
                        onClick={(e) => {
                          if (onSelectAccount) {
                            e.stopPropagation();
                            onSelectAccount(lead.company);
                          }
                        }}
                        onMouseEnter={(e) => {
                          if (onSelectAccount) {
                            e.currentTarget.style.color = '#0B57D0';
                            e.currentTarget.style.textDecoration = 'underline';
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (onSelectAccount) {
                            e.currentTarget.style.color = 'inherit';
                            e.currentTarget.style.textDecoration = 'none';
                          }
                        }}
                        title={onSelectAccount ? `View ${lead.company} account details` : undefined}
                      >
                        {lead.company}
                      </td>
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
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', flexWrap: 'nowrap' }}>
                          <span style={{ color: lead.isOverdue ? '#DC2626' : '#063669', fontWeight: 600, fontSize: '0.8rem', display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                            <LuClock size={12} style={{ color: lead.isOverdue ? '#DC2626' : '#5f6368' }} />
                            {lead.nextFollowup}
                          </span>
                          {lead.isOverdue ? (
                            <span style={{
                              fontSize: '0.62rem',
                              fontWeight: 700,
                              color: '#DC2626',
                              backgroundColor: '#FEE2E2',
                              border: '1px solid #FECACA',
                              padding: '1px 5px',
                              borderRadius: '4px',
                              textTransform: 'uppercase',
                              letterSpacing: '0.03em'
                            }}>
                              Overdue
                            </span>
                          ) : lead.dueToday ? (
                            <span style={{
                              fontSize: '0.62rem',
                              fontWeight: 700,
                              color: '#0B57D0',
                              backgroundColor: '#E8F0FE',
                              border: '1px solid #D2E3FC',
                              padding: '1px 5px',
                              borderRadius: '4px',
                              textTransform: 'uppercase',
                              letterSpacing: '0.03em'
                            }}>
                              Today
                            </span>
                          ) : null}
                        </div>
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
                          View <LuChevronRight size={12} />
                        </button>
                      </td>
                    </motion.tr>
                  );
                })
              )}
            </motion.tbody>
          </table>
        </div>

        {/* Table Footer & Pagination (shown only if leads exceed 10) */}
        {totalLeads > PAGE_SIZE && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingTop: '1.25rem',
            marginTop: '0.75rem',
            borderTop: '1px solid #F1F5F9',
            flexWrap: 'wrap',
            gap: '1rem'
          }}>
            {/* Left Counter Text */}
            <div style={{ fontSize: '0.85rem', color: '#64748B', fontWeight: 500 }}>
              Showing <strong style={{ color: '#063669' }}>{totalLeads > 0 ? startIndex + 1 : 0} – {Math.min(startIndex + PAGE_SIZE, totalLeads)}</strong> of <strong style={{ color: '#063669' }}>{totalLeads}</strong> Leads
            </div>

            {/* Right Pagination Buttons */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <button
                type="button"
                disabled={currentPageSafe <= 1}
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  padding: '6px 14px',
                  borderRadius: '9999px',
                  border: '1px solid #E2E8F0',
                  background: '#FFFFFF',
                  color: currentPageSafe <= 1 ? '#CBD5E1' : '#64748B',
                  fontSize: '0.8rem',
                  fontWeight: 500,
                  cursor: currentPageSafe <= 1 ? 'not-allowed' : 'pointer',
                  transition: 'all 0.15s ease'
                }}
              >
                <LuChevronLeft size={14} />
                Previous
              </button>

              {Array.from({ length: totalPages }).map((_, i) => {
                const pageNum = i + 1;
                const isActive = pageNum === currentPageSafe;
                return (
                  <button
                    type="button"
                    key={pageNum}
                    onClick={() => setCurrentPage(pageNum)}
                    style={{
                      width: '28px',
                      height: '28px',
                      borderRadius: '50%',
                      border: 'none',
                      background: isActive ? '#063669' : 'transparent',
                      color: isActive ? '#FFFFFF' : '#475569',
                      fontSize: '0.8rem',
                      fontWeight: isActive ? 700 : 500,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    {pageNum}
                  </button>
                );
              })}

              <button
                type="button"
                disabled={currentPageSafe >= totalPages}
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  padding: '6px 14px',
                  borderRadius: '9999px',
                  border: '1px solid #E2E8F0',
                  background: '#FFFFFF',
                  color: currentPageSafe >= totalPages ? '#CBD5E1' : '#64748B',
                  fontSize: '0.8rem',
                  fontWeight: 500,
                  cursor: currentPageSafe >= totalPages ? 'not-allowed' : 'pointer',
                  transition: 'all 0.15s ease'
                }}
              >
                Next
                <LuChevronRight size={14} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
