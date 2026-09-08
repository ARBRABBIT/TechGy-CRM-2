import React, { useState, useMemo, useEffect } from 'react';
import {
  LuSearch,
  LuList,
  LuLayoutGrid,
  LuFilter,
  LuPlus,
  LuPhone,
  LuMail,
  LuMessageSquare,
  LuChevronLeft,
  LuChevronRight,
  LuX,
  LuGripVertical
} from 'react-icons/lu';
import { isDateInFilter } from '../utils/dateUtils';
import { INITIAL_OWNERS } from '../data/mockData';

export default function OpportunitiesView({
  opportunities = [],
  onUpdateOpportunityStage,
  onSelectAccount,
  searchQuery: globalSearchQuery = '',
  selectedDateFilter = 'This Month',
  selectedOwnerFilter = 'All Owners',
  onOpenCreateModal,
  onTriggerToast
}) {
  // Local View States
  const [localSearch, setLocalSearch] = useState('');
  const [viewMode, setViewMode] = useState('list'); // 'list' | 'kanban'
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  // Filter Drawer / Popover State
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [selectedStage, setSelectedStage] = useState('All');
  const [selectedOwner, setSelectedOwner] = useState('All');

  // Drag and Drop State
  const [draggingOppId, setDraggingOppId] = useState(null);
  const [dragOverStage, setDragOverStage] = useState(null);

  // Combined Search Query (Global Header + Local Page Search)
  const activeSearch = (localSearch || globalSearchQuery).toLowerCase().trim();

  // Reset to page 1 on search / filter change
  useEffect(() => {
    setCurrentPage(1);
  }, [activeSearch, selectedStage, selectedOwner]);

  // Filtered Opportunities List
  const filteredOpps = useMemo(() => {
    return opportunities.filter(opp => {
      const matchesSearch = !activeSearch ||
        opp.opportunityName.toLowerCase().includes(activeSearch) ||
        opp.accountName.toLowerCase().includes(activeSearch) ||
        opp.owner.toLowerCase().includes(activeSearch) ||
        opp.currentStage.toLowerCase().includes(activeSearch);

      const matchesStage = selectedStage === 'All' || opp.currentStage === selectedStage;
      const matchesOwner = selectedOwner === 'All' || opp.owner === selectedOwner;
      const matchesGlobalOwner = selectedOwnerFilter === 'All Owners' || opp.owner === selectedOwnerFilter;
      const matchesDate = isDateInFilter(opp.expectedClosureDate || opp.createdDate, selectedDateFilter);

      return matchesSearch && matchesStage && matchesOwner && matchesGlobalOwner && matchesDate;
    });
  }, [opportunities, activeSearch, selectedStage, selectedOwner, selectedOwnerFilter, selectedDateFilter]);

  // Pagination Slice
  const totalItems = filteredOpps.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const currentPageSafe = Math.min(currentPage, totalPages);
  const startIndex = (currentPageSafe - 1) * pageSize;
  const paginatedOpps = filteredOpps.slice(startIndex, startIndex + pageSize);

  // Quick Action Notification Toast helper
  const triggerLocalToast = (msg) => {
    if (onTriggerToast) {
      onTriggerToast(msg);
    }
  };

  // Stage change handler
  const handleMoveStage = (oppId, newStage) => {
    if (onUpdateOpportunityStage) {
      onUpdateOpportunityStage(oppId, newStage);
    }
  };

  // Helper for owner avatar styling and initials
  const getOwnerBadge = (ownerName) => {
    if (!ownerName) return { initials: 'OP', bg: '#063669' };
    const parts = ownerName.split(' ');
    const initials = parts.length >= 2 ? `${parts[0][0]}${parts[1][0]}` : ownerName.substring(0, 2).toUpperCase();
    return { initials, bg: '#063669' };
  };

  // Helper for stage badge styling
  const getStageBadgeStyle = (stage) => {
    switch (stage) {
      case 'Proposal Sent':
      case 'Proposal':
        return { background: '#FFF3E0', color: '#E65100', border: '1px solid #FFE0B2' };
      case 'Negotiation':
        return { background: '#E8F5E9', color: '#2E7D32', border: '1px solid #C8E6C9' };
      case 'Discovery':
        return { background: '#E3F2FD', color: '#1565C0', border: '1px solid #BBDEFB' };
      case 'Qualified':
        return { background: '#EDE7F6', color: '#512DA8', border: '1px solid #D1C4E9' };
      case 'Closed Won':
        return { background: '#DCFCE7', color: '#15803D', border: '1px solid #86EFAC' };
      default:
        return { background: '#F1F5F9', color: '#475569', border: '1px solid #E2E8F0' };
    }
  };

  // Helper for probability color
  const getProbabilityColor = (probStr) => {
    const val = parseInt(probStr, 10) || 0;
    if (val >= 80) return '#10B981';
    if (val >= 50) return '#F59E0B';
    return '#3B82F6';
  };

  // Kanban Board Columns
  const kanbanColumns = ['Discovery', 'Proposal Sent', 'Negotiation', 'Qualified', 'Closed Won'];

  return (
    <div className="opportunities-view-container" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {/* Main Opportunities Queue Card */}
      <div className="section-card" style={{ background: '#FFFFFF', borderRadius: '16px', border: '1px solid #F1F5F9', boxShadow: '0 4px 20px rgba(6, 54, 105, 0.03)', padding: '1.25rem 1.5rem', overflow: 'hidden' }}>

        {/* Card Control Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.25rem' }}>

          {/* Card Title with Red Indicator Dot */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#063669', margin: 0 }}>
              Active Opportunities Queue
            </h3>
            <span style={{
              width: '7px',
              height: '7px',
              backgroundColor: '#EF4444',
              borderRadius: '50%',
              display: 'inline-block'
            }} />
          </div>

          {/* Right Action Controls */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>

            {/* Search Accounts / Opportunities Input Box */}
            <div style={{ position: 'relative', width: '220px' }}>
              <LuSearch size={15} color="#64748B" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
              <input
                type="text"
                placeholder="Search Accounts..."
                value={localSearch}
                onChange={(e) => setLocalSearch(e.target.value)}
                style={{
                  width: '100%',
                  padding: '7px 14px 7px 34px',
                  borderRadius: '9999px',
                  border: '1px solid #E2E8F0',
                  background: '#FFFFFF',
                  fontSize: '0.825rem',
                  outline: 'none',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
                  transition: 'all 0.2s ease',
                  color: '#063669'
                }}
              />
              {localSearch && (
                <button
                  onClick={() => setLocalSearch('')}
                  style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#94A3B8' }}
                  title="Clear search"
                  aria-label="Clear search"
                >
                  <LuX size={13} />
                </button>
              )}
            </div>

            {/* View Mode Segmented Switcher */}
            <div style={{ display: 'flex', background: '#F1F5F9', borderRadius: '10px', padding: '3px', gap: '2px' }}>
              <button
                onClick={() => setViewMode('list')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '6px 14px',
                  borderRadius: '8px',
                  border: 'none',
                  fontSize: '0.85rem',
                  fontWeight: viewMode === 'list' ? 600 : 500,
                  background: viewMode === 'list' ? '#FFFFFF' : 'transparent',
                  color: viewMode === 'list' ? '#063669' : '#64748B',
                  boxShadow: viewMode === 'list' ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
              >
                <LuList size={15} />
                List
              </button>
              <button
                onClick={() => setViewMode('kanban')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '6px 14px',
                  borderRadius: '8px',
                  border: 'none',
                  fontSize: '0.85rem',
                  fontWeight: viewMode === 'kanban' ? 600 : 500,
                  background: viewMode === 'kanban' ? '#FFFFFF' : 'transparent',
                  color: viewMode === 'kanban' ? '#063669' : '#64748B',
                  boxShadow: viewMode === 'kanban' ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
              >
                <LuLayoutGrid size={15} />
                Kanban
              </button>
            </div>

            {/* Apply Filters Button */}
            <button
              onClick={() => setShowFilterModal(!showFilterModal)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '8px 18px',
                borderRadius: '9999px',
                border: showFilterModal || selectedStage !== 'All' || selectedOwner !== 'All' ? '1px solid #063669' : '1px solid #E2E8F0',
                background: showFilterModal || selectedStage !== 'All' || selectedOwner !== 'All' ? '#F0F7FF' : '#FFFFFF',
                color: '#063669',
                fontSize: '0.875rem',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              <LuFilter size={15} />
              Apply Filters
              {(selectedStage !== 'All' || selectedOwner !== 'All') && (
                <span style={{ background: '#063669', color: '#FFFFFF', borderRadius: '50%', width: '16px', height: '16px', fontSize: '0.65rem', display: 'flex', alignItems: 'center', justifyContent: 'center', marginLeft: '4px' }}>
                  !
                </span>
              )}
            </button>

            {/* + New Opportunity Button */}
            <button
              onClick={() => {
                if (onOpenCreateModal) {
                  onOpenCreateModal('createOpportunity');
                } else {
                  triggerLocalToast('Opened New Opportunity Workspace');
                }
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '8px 20px',
                borderRadius: '9999px',
                border: 'none',
                background: '#063669',
                color: '#FFFFFF',
                fontSize: '0.875rem',
                fontWeight: 600,
                cursor: 'pointer',
                boxShadow: '0 2px 8px rgba(6, 54, 105, 0.25)',
                transition: 'all 0.2s ease'
              }}
            >
              <LuPlus size={16} />
              New Opportunity
            </button>
          </div>
        </div>

        {/* Filter Popover Dropdown Panel */}
        {showFilterModal && (
          <div style={{
            background: '#F8FAFC',
            border: '1px solid #E2E8F0',
            borderRadius: '12px',
            padding: '1rem 1.25rem',
            marginBottom: '1.25rem',
            display: 'flex',
            alignItems: 'center',
            gap: '1.5rem',
            flexWrap: 'wrap'
          }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#475569', marginBottom: '4px', textTransform: 'uppercase' }}>
                Filter by Stage
              </label>
              <select
                value={selectedStage}
                onChange={(e) => setSelectedStage(e.target.value)}
                style={{ padding: '6px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', background: '#FFFFFF', fontSize: '0.85rem', color: '#0F172A', outline: 'none' }}
              >
                <option value="All">All Stages</option>
                <option value="Proposal Sent">Proposal Sent</option>
                <option value="Negotiation">Negotiation</option>
                <option value="Discovery">Discovery</option>
                <option value="Qualified">Qualified</option>
                <option value="Closed Won">Closed Won</option>
                <option value="New">New</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#475569', marginBottom: '4px', textTransform: 'uppercase' }}>
                Filter by Owner
              </label>
              <select
                value={selectedOwner}
                onChange={(e) => setSelectedOwner(e.target.value)}
                style={{ padding: '6px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', background: '#FFFFFF', fontSize: '0.85rem', color: '#0F172A', outline: 'none' }}
              >
                <option value="All">All Owners</option>
                {INITIAL_OWNERS.filter(o => o !== 'All Owners').map(o => (
                  <option key={o} value={o}>{o}</option>
                ))}
              </select>
            </div>

            {(selectedStage !== 'All' || selectedOwner !== 'All') && (
              <button
                onClick={() => { setSelectedStage('All'); setSelectedOwner('All'); }}
                style={{ marginTop: 'auto', padding: '6px 12px', background: '#E2E8F0', border: 'none', borderRadius: '8px', color: '#334155', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer' }}
              >
                Reset Filters
              </button>
            )}
          </div>
        )}

        {/* View Mode: List Table */}
        {viewMode === 'list' ? (
          <div style={{ overflowX: 'auto' }}>
            <table className="action-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #F1F5F9', textAlign: 'left' }}>
                  <th style={{ padding: '12px 14px', fontSize: '0.725rem', fontWeight: 700, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    OPPORTUNITY / ACCOUNT
                  </th>
                  <th style={{ padding: '12px 14px', fontSize: '0.725rem', fontWeight: 700, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    EXPECTED VALUE
                  </th>
                  <th style={{ padding: '12px 14px', fontSize: '0.725rem', fontWeight: 700, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    STAGE
                  </th>
                  <th style={{ padding: '12px 14px', fontSize: '0.725rem', fontWeight: 700, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    PROBABILITY
                  </th>
                  <th style={{ padding: '12px 14px', fontSize: '0.725rem', fontWeight: 700, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    CLOSE DATE
                  </th>
                  <th style={{ padding: '12px 14px', fontSize: '0.725rem', fontWeight: 700, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    OWNER
                  </th>
                  <th style={{ padding: '12px 14px', fontSize: '0.725rem', fontWeight: 700, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.05em', textAlign: 'right' }}>
                    ACTIONS
                  </th>
                </tr>
              </thead>
              <tbody>
                {paginatedOpps.length > 0 ? (
                  paginatedOpps.map((opp) => {
                    const badge = getOwnerBadge(opp.owner);
                    const stageStyle = getStageBadgeStyle(opp.currentStage);
                    const probColor = getProbabilityColor(opp.probability);
                    const probNum = parseInt(opp.probability, 10) || 0;

                    return (
                      <tr
                        key={opp.id}
                        style={{ borderBottom: '1px solid #F8FAFC', transition: 'background-color 0.15s ease' }}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#F8FAFC'}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                      >
                        {/* Col 1: Opportunity / Account */}
                        <td style={{ padding: '14px' }}>
                          <div
                            onClick={() => {
                              if (onSelectAccount) onSelectAccount(opp.accountName);
                            }}
                            style={{ fontWeight: 600, color: '#0B57D0', fontSize: '0.925rem', cursor: 'pointer', display: 'inline-block' }}
                            title={`Open ${opp.accountName} company account`}
                          >
                            {opp.opportunityName}
                          </div>
                          <div
                            onClick={(e) => {
                              e.stopPropagation();
                              if (onSelectAccount) onSelectAccount(opp.accountName);
                            }}
                            style={{
                              color: '#64748B',
                              fontSize: '0.825rem',
                              marginTop: '3px',
                              cursor: 'pointer',
                              display: 'inline-block',
                              transition: 'color 0.15s ease, text-decoration 0.15s ease'
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.color = '#0B57D0';
                              e.currentTarget.style.textDecoration = 'underline';
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.color = '#64748B';
                              e.currentTarget.style.textDecoration = 'none';
                            }}
                            title={`Open ${opp.accountName} company account`}
                          >
                            {opp.accountName}
                          </div>
                        </td>

                        {/* Col 2: Expected Value */}
                        <td style={{ padding: '14px', fontWeight: 700, color: '#0F172A', fontSize: '0.9rem' }}>
                          {opp.estimatedValue}
                        </td>

                        {/* Col 3: Stage */}
                        <td style={{ padding: '14px' }}>
                          <span style={{
                            padding: '4px 12px',
                            borderRadius: '9999px',
                            fontSize: '0.75rem',
                            fontWeight: 600,
                            display: 'inline-block',
                            whiteSpace: 'nowrap',
                            ...stageStyle
                          }}>
                            {opp.currentStage}
                          </span>
                        </td>

                        {/* Col 4: Probability */}
                        <td style={{ padding: '14px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#334155', minWidth: '32px' }}>
                              {opp.probability}
                            </span>
                            <div style={{ width: '56px', height: '6px', background: '#E2E8F0', borderRadius: '9999px', overflow: 'hidden' }}>
                              <div style={{ width: `${probNum}%`, height: '100%', background: probColor, borderRadius: '9999px' }} />
                            </div>
                          </div>
                        </td>

                        {/* Col 5: Close Date */}
                        <td style={{ padding: '14px', fontSize: '0.875rem', color: '#334155', fontWeight: 500, whiteSpace: 'nowrap' }}>
                          {opp.expectedClosureDate}
                        </td>

                        {/* Col 6: Owner */}
                        <td style={{ padding: '14px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <div style={{
                              width: '26px',
                              height: '26px',
                              borderRadius: '50%',
                              background: badge.bg,
                              color: '#FFFFFF',
                              fontSize: '0.7rem',
                              fontWeight: 700,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center'
                            }}>
                              {badge.initials}
                            </div>
                            <span style={{ fontSize: '0.85rem', color: '#334155', fontWeight: 500 }}>
                              {opp.owner}
                            </span>
                          </div>
                        </td>

                        {/* Col 7: Actions */}
                        <td style={{ padding: '14px', textAlign: 'right' }}>
                          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', color: '#64748B' }}>
                            <button
                              title={`Call ${opp.owner}`}
                              onClick={() => triggerLocalToast(`Initiating call with ${opp.owner} (${opp.accountName})...`)}
                              style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748B', padding: '4px', borderRadius: '6px', transition: 'all 0.15s' }}
                              onMouseEnter={(e) => e.currentTarget.style.color = '#063669'}
                              onMouseLeave={(e) => e.currentTarget.style.color = '#64748B'}
                            >
                              <LuPhone size={15} />
                            </button>
                            <button
                              title={`Email ${opp.accountName}`}
                              onClick={() => triggerLocalToast(`Drafting email for ${opp.accountName}...`)}
                              style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748B', padding: '4px', borderRadius: '6px', transition: 'all 0.15s' }}
                              onMouseEnter={(e) => e.currentTarget.style.color = '#063669'}
                              onMouseLeave={(e) => e.currentTarget.style.color = '#64748B'}
                            >
                              <LuMail size={15} />
                            </button>
                            <button
                              title={`Add Note for ${opp.opportunityName}`}
                              onClick={() => triggerLocalToast(`Opened notes for ${opp.opportunityName}`)}
                              style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748B', padding: '4px', borderRadius: '6px', transition: 'all 0.15s' }}
                              onMouseEnter={(e) => e.currentTarget.style.color = '#063669'}
                              onMouseLeave={(e) => e.currentTarget.style.color = '#64748B'}
                            >
                              <LuMessageSquare size={15} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={7} style={{ textAlign: 'center', padding: '3rem 1rem', color: '#64748B' }}>
                      No opportunities match your current filters or search terms.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        ) : (
          /* View Mode: Interactive Drag-and-Drop Kanban Board */
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))',
            gap: '1.25rem',
            paddingTop: '0.5rem',
            alignItems: 'start'
          }}>
            {kanbanColumns.map((stg) => {
              const colOpps = filteredOpps.filter(o =>
                o.currentStage === stg ||
                (stg === 'Proposal Sent' && o.currentStage === 'Proposal')
              );

              const isTargetColumn = dragOverStage === stg;

              return (
                <div
                  key={stg}
                  onDragOver={(e) => {
                    e.preventDefault();
                    e.dataTransfer.dropEffect = 'move';
                    if (dragOverStage !== stg) setDragOverStage(stg);
                  }}
                  onDragLeave={(e) => {
                    if (!e.currentTarget.contains(e.relatedTarget)) {
                      setDragOverStage(null);
                    }
                  }}
                  onDrop={(e) => {
                    e.preventDefault();
                    setDragOverStage(null);
                    const droppedId = e.dataTransfer.getData('text/plain') || draggingOppId;
                    if (droppedId) {
                      handleMoveStage(droppedId, stg);
                      setDraggingOppId(null);
                    }
                  }}
                  style={{
                    background: isTargetColumn ? '#EFF6FF' : '#F8FAFC',
                    borderRadius: '14px',
                    padding: '1rem',
                    border: isTargetColumn ? '2px dashed #063669' : '1px solid #E2E8F0',
                    transition: 'all 0.2s ease',
                    minHeight: '420px',
                    display: 'flex',
                    flexDirection: 'column'
                  }}
                >
                  {/* Column Header */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.85rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontWeight: 700, color: '#063669', fontSize: '0.9rem' }}>
                        {stg}
                      </span>
                      <span style={{
                        background: isTargetColumn ? '#063669' : '#E2E8F0',
                        color: isTargetColumn ? '#FFFFFF' : '#334155',
                        borderRadius: '9999px',
                        padding: '2px 8px',
                        fontSize: '0.75rem',
                        fontWeight: 700
                      }}>
                        {colOpps.length}
                      </span>
                    </div>

                    {isTargetColumn && (
                      <span style={{ fontSize: '0.7rem', color: '#2563EB', fontWeight: 600 }}>
                        Drop Here
                      </span>
                    )}
                  </div>

                  {/* Column Cards Container */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', flex: 1 }}>
                    {colOpps.length > 0 ? (
                      colOpps.map((opp) => {
                        const badge = getOwnerBadge(opp.owner);
                        const isDragging = draggingOppId === opp.id;
                        const probColor = getProbabilityColor(opp.probability);
                        const probNum = parseInt(opp.probability, 10) || 0;

                        return (
                          <div
                            key={opp.id}
                            draggable={true}
                            onDragStart={(e) => {
                              e.dataTransfer.setData('text/plain', opp.id);
                              e.dataTransfer.effectAllowed = 'move';
                              setDraggingOppId(opp.id);
                            }}
                            onDragEnd={() => {
                              setDraggingOppId(null);
                              setDragOverStage(null);
                            }}
                            style={{
                              background: '#FFFFFF',
                              borderRadius: '12px',
                              padding: '0.9rem 1rem',
                              boxShadow: isDragging ? '0 10px 25px rgba(0,0,0,0.15)' : '0 2px 8px rgba(6, 54, 105, 0.04)',
                              border: isDragging ? '1px dashed #063669' : '1px solid #F1F5F9',
                              opacity: isDragging ? 0.45 : 1,
                              cursor: 'grab',
                              userSelect: 'none',
                              transition: 'transform 0.15s ease, box-shadow 0.15s ease'
                            }}
                            onMouseEnter={(e) => {
                              if (!isDragging) e.currentTarget.style.transform = 'translateY(-2px)';
                            }}
                            onMouseLeave={(e) => {
                              if (!isDragging) e.currentTarget.style.transform = 'translateY(0)';
                            }}
                          >
                            {/* Card Header: Drag Handle & Title */}
                            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '6px', marginBottom: '4px' }}>
                              <div
                                onClick={() => {
                                  if (onSelectAccount) onSelectAccount(opp.accountName);
                                }}
                                style={{ fontWeight: 700, color: '#0B57D0', fontSize: '0.875rem', cursor: 'pointer', lineHeight: 1.3 }}
                              >
                                {opp.opportunityName}
                              </div>
                              <LuGripVertical size={16} color="#94A3B8" style={{ cursor: 'grab', flexShrink: 0, marginTop: '2px' }} />
                            </div>

                            {/* Account Name */}
                            <div
                              onClick={(e) => {
                                e.stopPropagation();
                                if (onSelectAccount) onSelectAccount(opp.accountName);
                              }}
                              style={{
                                fontSize: '0.785rem',
                                color: '#64748B',
                                marginBottom: '8px',
                                cursor: 'pointer',
                                display: 'inline-block',
                                transition: 'color 0.15s ease, text-decoration 0.15s ease'
                              }}
                              onMouseEnter={(e) => {
                                e.currentTarget.style.color = '#0B57D0';
                                e.currentTarget.style.textDecoration = 'underline';
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.color = '#64748B';
                                e.currentTarget.style.textDecoration = 'none';
                              }}
                              title={`Open ${opp.accountName} company account`}
                            >
                              {opp.accountName}
                            </div>

                            {/* Expected Value & Probability */}
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                              <span style={{ fontWeight: 700, color: '#0F172A', fontSize: '0.875rem' }}>
                                {opp.estimatedValue}
                              </span>

                              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748B' }}>
                                  {opp.probability}
                                </span>
                                <div style={{ width: '40px', height: '5px', background: '#E2E8F0', borderRadius: '9999px', overflow: 'hidden' }}>
                                  <div style={{ width: `${probNum}%`, height: '100%', background: probColor, borderRadius: '9999px' }} />
                                </div>
                              </div>
                            </div>

                            {/* Card Footer: Owner & Stage Quick Switch Dropdown */}
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '6px', borderTop: '1px solid #F8FAFC' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                <div style={{ width: '22px', height: '22px', borderRadius: '50%', background: badge.bg, color: '#FFF', fontSize: '0.65rem', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                  {badge.initials}
                                </div>
                                <span style={{ fontSize: '0.75rem', color: '#475569', fontWeight: 500 }}>
                                  {opp.owner.split(' ')[0]}
                                </span>
                              </div>

                              {/* Interactive Quick Stage Dropdown */}
                              <select
                                value={opp.currentStage === 'Proposal' ? 'Proposal Sent' : opp.currentStage}
                                onChange={(e) => handleMoveStage(opp.id, e.target.value)}
                                style={{
                                  padding: '2px 6px',
                                  borderRadius: '6px',
                                  border: '1px solid #E2E8F0',
                                  background: '#F8FAFC',
                                  fontSize: '0.7rem',
                                  color: '#063669',
                                  fontWeight: 600,
                                  cursor: 'pointer',
                                  outline: 'none'
                                }}
                              >
                                {kanbanColumns.map(stageName => (
                                  <option key={stageName} value={stageName}>
                                    {stageName}
                                  </option>
                                ))}
                              </select>
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <div style={{
                        border: '1px dashed #CBD5E1',
                        borderRadius: '10px',
                        padding: '2rem 1rem',
                        textAlign: 'center',
                        color: '#94A3B8',
                        fontSize: '0.8rem'
                      }}>
                        Drag cards here
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Table Footer & Pagination */}
        {viewMode === 'list' && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingTop: '1.25rem',
            marginTop: '0.75rem',
            borderTop: '1px solid #F8FAFC',
            flexWrap: 'wrap',
            gap: '1rem'
          }}>

            {/* Left Counter Text */}
            <div style={{ fontSize: '0.85rem', color: '#64748B', fontWeight: 500 }}>
              Showing <strong style={{ color: '#0F172A' }}>{totalItems > 0 ? startIndex + 1 : 0} – {Math.min(startIndex + pageSize, totalItems)}</strong> of <strong style={{ color: '#0F172A' }}>{totalItems}</strong> Opportunities
            </div>

            {/* Right Pagination Buttons */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <button
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
