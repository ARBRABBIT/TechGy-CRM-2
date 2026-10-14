import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LuSearch,
  LuPlus,
  LuChevronRight,
  LuChevronLeft,
  LuUserPlus,
  LuX,
  LuCheck,
  LuUserCheck,
  LuUpload,
  LuSlidersHorizontal,
  LuEllipsisVertical,
  LuTrash2,
  LuEye,
  LuBriefcase
} from 'react-icons/lu';
import { INITIAL_SALES_HEADS, INITIAL_SALES_EXECUTIVES } from '../data/mockData';
import { isDateInFilter } from '../utils/dateUtils';
import MultiSelectFilter from '../components/common/MultiSelectFilter';
import { ROLE, hasRole } from '../utils/roles';
import { ACTION, can, scopeLeadsForUser, scopeExecutivesForUser } from '../utils/permissions';
import { onKeyActivate } from '../utils/a11y';
import { EmptyRow } from '../components/common/StateViews';

const STATUS_OPTIONS = ['NEW LEADS', 'SITE REVISIT', 'QUALIFIED', 'DISCUSSION', 'PROPOSAL', 'NEGOTIATION'];
const SOURCE_OPTIONS = ['WHATSAPP', 'META', 'WEBSITE', 'INBOUND', 'REFERRAL', 'LINKEDIN', 'CAMPAIGN'];
const PROJECT_OPTIONS = ['All Projects', 'Farm Natura', 'Reliance Elysium', 'TechGy CRM Enterprise Suite', 'N/A'];

export default function LeadsView({
  leads = [],
  salesHeads = INITIAL_SALES_HEADS,
  salesExecutives = INITIAL_SALES_EXECUTIVES,
  currentUser = null,
  onUpdateLead,
  onDeleteLead,
  onTriggerToast,
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
  // Queue Tab State: 'unassigned' | 'assigned' | 'junk'
  const isSalesExecutiveUser = hasRole(currentUser, ROLE.EXECUTIVE);
  const [activeQueueTab, setActiveQueueTab] = useState(() => isSalesExecutiveUser ? 'assigned' : 'unassigned');
  const [leadToDeleteJunk, setLeadToDeleteJunk] = useState(null);

  // Search & Filters
  const [localSearch, setLocalSearch] = useState('');
  const [selectedSources, setSelectedSources] = useState(propSourceFilter || initialFilterSource ? [propSourceFilter || initialFilterSource] : []);
  const [selectedStatuses, setSelectedStatuses] = useState([]);
  const [selectedProject, setSelectedProject] = useState('All Projects');
  const [overdueOnly, setOverdueOnly] = useState(propOverdueOnlyFilter || initialOverdueOnly);
  const [showFilterDrawer, setShowFilterDrawer] = useState(false);

  // Selection & Pagination
  const [selectedLeadIds, setSelectedLeadIds] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const PAGE_SIZE = 10;
  const selectAllRef = useRef(null);

  // Active Menu Dropdown for row actions
  const [activeActionMenuId, setActiveActionMenuId] = useState(null);

  // Assign Sales Head Modal State (Admin Flow)
  const [assigningHeadLead, setAssigningHeadLead] = useState(null);
  const [assigningHeadBulkIds, setAssigningHeadBulkIds] = useState([]);
  const [selectedHeadId, setSelectedHeadId] = useState('');
  const [headSearch, setHeadSearch] = useState('');

  // Assign Sales Executive Modal State (Sales Head Flow)
  const [assigningExecLead, setAssigningExecLead] = useState(null);
  const [assigningExecBulkIds, setAssigningExecBulkIds] = useState([]);
  const [selectedExecId, setSelectedExecId] = useState('');
  const [execSearch, setExecSearch] = useState('');

  // Bulk Auto-Assign Modal State
  const [isAutoAssignModalOpen, setIsAutoAssignModalOpen] = useState(false);

  // Bulk Import Modal State
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [importFile, setImportFile] = useState(null);
  const [isImporting, setIsImporting] = useState(false);

  // Close menus when clicking outside
  useEffect(() => {
    const handleDocumentClick = () => setActiveActionMenuId(null);
    document.addEventListener('click', handleDocumentClick);
    return () => document.removeEventListener('click', handleDocumentClick);
  }, []);

  // Sync tab for sales executive if user switches role
  useEffect(() => {
    if (isSalesExecutiveUser && activeQueueTab === 'unassigned') {
      setActiveQueueTab('assigned');
    }
  }, [isSalesExecutiveUser, activeQueueTab]);

  // Current User Role Context
  const currentSalesHeadName = currentUser?.name || 'Rajesh Sharma';

  // Leads and assignable executives scoped to the active user (see utils/permissions)
  const roleScopedLeads = useMemo(
    () => scopeLeadsForUser(leads, currentUser, salesExecutives),
    [leads, currentUser, salesExecutives]
  );
  const availableExecutives = useMemo(
    () => scopeExecutivesForUser(salesExecutives, currentUser),
    [salesExecutives, currentUser]
  );

  // What this user may do on this page
  const canCreateLead = can(currentUser, ACTION.LEAD_CREATE);
  const canImportLeads = can(currentUser, ACTION.LEAD_IMPORT);
  const canAssignLeads = can(currentUser, ACTION.LEAD_ASSIGN);
  const canAssignHead = can(currentUser, ACTION.LEAD_ASSIGN_HEAD);
  const canJunkLeads = can(currentUser, ACTION.LEAD_JUNK);
  const canDeleteLeads = can(currentUser, ACTION.LEAD_DELETE);

  // Compute counts for Queue tabs
  const queueCounts = useMemo(() => {
    let unassigned = 0;
    let assigned = 0;
    let junk = 0;

    roleScopedLeads.forEach(l => {
      if (l.isJunk || l.status === 'JUNK') {
        junk++;
      } else if (
        (l.salesExecutive && l.salesExecutive !== 'Unassigned' && l.salesExecutive.trim() !== '') ||
        (l.assignedSalesExecutive && l.assignedSalesExecutive !== 'Unassigned' && l.assignedSalesExecutive.trim() !== '')
      ) {
        assigned++;
      } else {
        unassigned++;
      }
    });

    return { unassigned, assigned, junk };
  }, [roleScopedLeads]);

  // Sync prop filters
  useEffect(() => {
    const next = propSourceFilter || initialFilterSource;
    if (next) setSelectedSources([next]);
  }, [propSourceFilter, initialFilterSource]);

  useEffect(() => {
    const next = propOverdueOnlyFilter || initialOverdueOnly;
    setOverdueOnly(prev => (prev !== next ? next : prev));
  }, [propOverdueOnlyFilter, initialOverdueOnly]);

  const effectiveSearch = (searchQuery || localSearch).toLowerCase().trim();

  // Filter leads based on active tab and query
  const filteredLeads = useMemo(() => {
    return roleScopedLeads.filter((lead) => {
      // 1. Queue Tab Filtering
      const isLeadJunk = lead.isJunk === true || lead.status === 'JUNK';
      const isLeadAssigned = Boolean(
        (lead.salesExecutive && lead.salesExecutive !== 'Unassigned' && lead.salesExecutive.trim() !== '') ||
        (lead.assignedSalesExecutive && lead.assignedSalesExecutive !== 'Unassigned' && lead.assignedSalesExecutive.trim() !== '') ||
        (lead.executive && lead.executive !== 'Unassigned' && lead.executive.trim() !== '') ||
        (isSalesExecutiveUser && !isLeadJunk)
      );

      if (activeQueueTab === 'junk') {
        if (!isLeadJunk) return false;
      } else if (activeQueueTab === 'assigned') {
        if (isLeadJunk || !isLeadAssigned) return false;
      } else {
        // 'unassigned' tab
        if (isLeadJunk || isLeadAssigned) return false;
      }

      // 2. Search Query (Lead ID, Name, Phone, Email, Company)
      if (effectiveSearch) {
        const matchId = (lead.id || '').toLowerCase().includes(effectiveSearch);
        const matchName = (lead.leadName || '').toLowerCase().includes(effectiveSearch);
        const matchCompany = (lead.company || '').toLowerCase().includes(effectiveSearch);
        const matchEmail = (lead.email || lead.emailId || '').toLowerCase().includes(effectiveSearch);
        const matchPhone = (lead.phone || lead.phoneNumber || '').toLowerCase().includes(effectiveSearch);
        const matchProject = (lead.project || '').toLowerCase().includes(effectiveSearch);
        if (!matchId && !matchName && !matchCompany && !matchEmail && !matchPhone && !matchProject) {
          return false;
        }
      }

      // 3. Project Filter
      if (selectedProject !== 'All Projects' && lead.project !== selectedProject) {
        return false;
      }

      // 4. Source Filter
      if (selectedSources.length > 0) {
        const leadSrc = (lead.leadSource || '').toUpperCase();
        const matches = selectedSources.some(s => s.toUpperCase() === leadSrc);
        if (!matches) return false;
      }

      // 5. Status Filter
      if (selectedStatuses.length > 0) {
        const leadSt = (lead.status || '').toUpperCase();
        const matches = selectedStatuses.some(s => s.toUpperCase() === leadSt);
        if (!matches) return false;
      }

      // 6. Overdue Filter
      if (overdueOnly && !lead.isOverdue) {
        return false;
      }

      // 7. Global Date Filter
      if (!overdueOnly && selectedDateFilter && selectedDateFilter !== 'All Time') {
        const matchCreated = isDateInFilter(lead.createdDate || lead.creationDate, selectedDateFilter);
        if (!matchCreated) return false;
      }

      return true;
    });
  }, [roleScopedLeads, activeQueueTab, effectiveSearch, selectedProject, selectedSources, selectedStatuses, overdueOnly, selectedDateFilter, isSalesExecutiveUser]);

  // Reset pagination on filter or tab change
  useEffect(() => {
    setCurrentPage(1);
    setSelectedLeadIds([]);
  }, [activeQueueTab, effectiveSearch, selectedProject, selectedSources, selectedStatuses, overdueOnly]);

  const totalLeads = filteredLeads.length;
  const totalPages = Math.ceil(totalLeads / PAGE_SIZE) || 1;
  const currentPageSafe = Math.min(currentPage, totalPages);
  const startIndex = (currentPageSafe - 1) * PAGE_SIZE;
  const displayedLeads = filteredLeads.slice(startIndex, startIndex + PAGE_SIZE);

  // Checkbox Selection Logic
  const isAllSelected =
    displayedLeads.length > 0 &&
    displayedLeads.every((lead) => selectedLeadIds.includes(lead.id));

  const isIndeterminate =
    selectedLeadIds.length > 0 &&
    !isAllSelected &&
    displayedLeads.some((lead) => selectedLeadIds.includes(lead.id));

  useEffect(() => {
    if (selectAllRef.current) {
      selectAllRef.current.indeterminate = isIndeterminate;
    }
  }, [isIndeterminate]);

  const handleSelectAll = () => {
    if (isAllSelected) {
      const pageIds = new Set(displayedLeads.map((l) => l.id));
      setSelectedLeadIds((prev) => prev.filter((id) => !pageIds.has(id)));
    } else {
      const newIds = new Set([...selectedLeadIds, ...displayedLeads.map((l) => l.id)]);
      setSelectedLeadIds(Array.from(newIds));
    }
  };

  const handleToggleLead = (id, e) => {
    e?.stopPropagation();
    setSelectedLeadIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // Assign Sales Head Handlers
  const handleOpenAssignHeadModal = (lead, e) => {
    if (e) e.stopPropagation();
    setAssigningHeadLead(lead);
    setAssigningHeadBulkIds([]);
    const curr = salesHeads.find(sh => sh.name === lead.salesHead);
    setSelectedHeadId(curr ? curr.id : (salesHeads[0]?.id || ''));
    setHeadSearch('');
  };

  const handleConfirmAssignHead = () => {
    if (!selectedHeadId) return;
    const headObj = salesHeads.find(sh => sh.id === selectedHeadId);
    if (!headObj) return;

    if (assigningHeadBulkIds.length > 0) {
      assigningHeadBulkIds.forEach(id => {
        onUpdateLead?.(id, {
          salesHead: headObj.name,
          reportingSalesHead: headObj.name
        });
      });
      onTriggerToast?.({
        title: 'Sales Head Assigned',
        description: `"${headObj.name}" assigned to ${assigningHeadBulkIds.length} leads.`,
        type: 'success'
      });
      setSelectedLeadIds([]);
    } else if (assigningHeadLead) {
      onUpdateLead?.(assigningHeadLead.id, {
        salesHead: headObj.name,
        reportingSalesHead: headObj.name
      });
      onTriggerToast?.({
        title: 'Sales Head Assigned',
        description: `"${headObj.name}" assigned to ${assigningHeadLead.leadName}.`,
        type: 'success'
      });
    }

    setAssigningHeadLead(null);
    setAssigningHeadBulkIds([]);
  };

  // Assign Sales Executive Handlers (Moves from Unassigned -> Assigned!)
  const handleOpenAssignExecModal = (lead, e) => {
    if (e) e.stopPropagation();
    setAssigningExecLead(lead);
    setAssigningExecBulkIds([]);
    const execPool = availableExecutives.length > 0 ? availableExecutives : salesExecutives;
    const curr = execPool.find(se => se.name === (lead.salesExecutive || lead.assignedSalesExecutive));
    setSelectedExecId(curr ? curr.id : (execPool[0]?.id || ''));
    setExecSearch('');
  };

  const handleOpenBulkAssignExecModal = () => {
    if (selectedLeadIds.length === 0) return;
    const firstLead = leads.find(l => l.id === selectedLeadIds[0]);
    setAssigningExecLead(firstLead || null);
    setAssigningExecBulkIds(selectedLeadIds);
    const execPool = availableExecutives.length > 0 ? availableExecutives : salesExecutives;
    setSelectedExecId(execPool[0]?.id || '');
    setExecSearch('');
  };

  const handleConfirmAssignExec = () => {
    if (!selectedExecId) return;
    const execPool = availableExecutives.length > 0 ? availableExecutives : salesExecutives;
    const execObj = execPool.find(se => se.id === selectedExecId) || salesExecutives.find(se => se.id === selectedExecId);
    if (!execObj) return;

    if (assigningExecBulkIds.length > 0) {
      assigningExecBulkIds.forEach(id => {
        const targetLead = leads.find(l => l.id === id);
        onUpdateLead?.(id, {
          isJunk: false,
          status: targetLead?.status === 'JUNK' ? 'NEW LEADS' : (targetLead?.status || 'NEW LEADS'),
          junkReason: null,
          salesExecutive: execObj.name,
          assignedSalesExecutive: execObj.name,
          leadOwner: execObj.name,
          salesHead: targetLead?.salesHead || currentSalesHeadName
        });
      });
      onTriggerToast?.({
        title: 'Leads Allocated & Assigned',
        description: `${assigningExecBulkIds.length} leads assigned to Sales Executive "${execObj.name}". Moved to Assigned queue.`,
        type: 'success'
      });
      setSelectedLeadIds([]);
    } else if (assigningExecLead) {
      const wasJunk = assigningExecLead.isJunk || assigningExecLead.status === 'JUNK';
      onUpdateLead?.(assigningExecLead.id, {
        isJunk: false,
        status: wasJunk ? 'NEW LEADS' : (assigningExecLead.status || 'NEW LEADS'),
        junkReason: null,
        salesExecutive: execObj.name,
        assignedSalesExecutive: execObj.name,
        leadOwner: execObj.name,
        salesHead: assigningExecLead.salesHead || currentSalesHeadName
      });
      onTriggerToast?.({
        title: wasJunk ? 'Junk Lead Reassigned & Restored' : 'Lead Allocated & Assigned',
        description: `Lead ${assigningExecLead.id} assigned to Sales Executive "${execObj.name}". Moved to Assigned queue.`,
        type: 'success'
      });
    }

    setAssigningExecLead(null);
    setAssigningExecBulkIds([]);
    // Automatically switch to Assigned tab so user immediately sees the newly assigned lead
    setActiveQueueTab('assigned');
  };

  // Bulk Auto-Assign Round Robin Handler
  const handleExecuteAutoAssign = () => {
    const unassignedLeads = roleScopedLeads.filter(l => !l.isJunk && l.status !== 'JUNK' && (!l.salesExecutive || l.salesExecutive === 'Unassigned' || l.salesExecutive === ''));
    if (unassignedLeads.length === 0) {
      onTriggerToast?.({
        title: 'Queue Clear',
        description: 'No unassigned leads found in queue.',
        type: 'info'
      });
      setIsAutoAssignModalOpen(false);
      return;
    }

    const execs = availableExecutives.length > 0 ? availableExecutives : INITIAL_SALES_EXECUTIVES;
    unassignedLeads.forEach((lead, index) => {
      const assignedExec = execs[index % execs.length];
      onUpdateLead?.(lead.id, {
        salesExecutive: assignedExec.name,
        assignedSalesExecutive: assignedExec.name,
        leadOwner: assignedExec.name,
        salesHead: lead.salesHead || currentSalesHeadName
      });
    });

    onTriggerToast?.({
      title: 'Bulk Auto-Assign Complete',
      description: `Successfully distributed ${unassignedLeads.length} leads across ${execs.length} Sales Executives.`,
      type: 'success'
    });
    setIsAutoAssignModalOpen(false);
    setActiveQueueTab('assigned');
  };

  // Mark as Junk / Restore / Delete Handlers
  const handleMarkAsJunk = (lead, e) => {
    e?.stopPropagation();
    onUpdateLead?.(lead.id, {
      isJunk: true,
      status: 'JUNK',
      junkReason: 'Invalid Contact / Marked by User'
    });
    onTriggerToast?.({
      title: 'Moved to Junk',
      description: `Lead ${lead.id} moved to Manage Junks.`,
      type: 'info'
    });
    setActiveActionMenuId(null);
  };

  const handleDeleteJunkLead = (lead, e) => {
    e?.stopPropagation();
    setLeadToDeleteJunk(lead);
  };

  const handleConfirmDeleteJunk = () => {
    if (!leadToDeleteJunk) return;
    if (onDeleteLead) {
      onDeleteLead(leadToDeleteJunk.id);
    }
    onTriggerToast?.({
      title: 'Junk Lead Deleted',
      description: `Lead ${leadToDeleteJunk.id} (${leadToDeleteJunk.leadName}) was permanently deleted.`,
      type: 'info'
    });
    setLeadToDeleteJunk(null);
  };

  // Source Badge Color Helper
  const getSourceBadgeStyle = (src = '') => {
    const s = src.toUpperCase();
    if (s.includes('WHATSAPP')) {
      return { bg: '#E0F2FE', color: '#0369A1', border: '1px solid #BAE6FD' };
    }
    if (s.includes('META') || s.includes('FACEBOOK')) {
      return { bg: '#EEF2FF', color: '#4F46E5', border: '1px solid #E0E7FF' };
    }
    if (s.includes('WEBSITE')) {
      return { bg: '#EBF0FF', color: '#0022FF', border: '1px solid #D5E2EE' };
    }
    if (s.includes('REFERRAL')) {
      return { bg: '#ECFDF5', color: '#047857', border: '1px solid #A7F3D0' };
    }
    if (s.includes('LINKEDIN')) {
      return { bg: '#F0F9FF', color: '#0369A1', border: '1px solid #BAE6FD' };
    }
    return { bg: '#F1F5F9', color: '#475569', border: '1px solid #E2E8F0' };
  };

  // Status Badge Helper
  const getStatusBadgeStyle = (status = '') => {
    const s = status.toUpperCase();
    if (s.includes('SITE REVISIT')) {
      return { bg: '#E0F2FE', color: '#0369A1', border: '1px solid #BAE6FD' };
    }
    if (s.includes('NEW')) {
      return { bg: '#EEF2FF', color: '#0022FF', border: '1px solid #E0E7FF' };
    }
    if (s.includes('QUALIFIED')) {
      return { bg: '#ECFDF5', color: '#047857', border: '1px solid #A7F3D0' };
    }
    if (s.includes('DISCUSSION') || s.includes('PROPOSAL')) {
      return { bg: '#FFFBEB', color: '#B45309', border: '1px solid #FDE68A' };
    }
    if (s.includes('JUNK')) {
      return { bg: '#FEF2F2', color: '#DC2626', border: '1px solid #FECACA' };
    }
    return { bg: '#F1F5F9', color: '#475569', border: '1px solid #CBD5E1' };
  };

  return (
    <div className="leads-view" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      
      {/* Breadcrumb Navigation when coming from dashboard */}
      {fromDashboard && (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <nav style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', fontWeight: 600, color: '#557396' }}>
            <span role="button" tabIndex={0} onKeyDown={onKeyActivate}
              onClick={onBackToDashboard}
              style={{ cursor: 'pointer', color: '#0022FF' }}
              title="Return to Dashboard"
            >
              Dashboard
            </span>
            <LuChevronRight size={14} />
            <span style={{ color: '#0F1A34' }}>Lead Management Queue</span>
          </nav>
        </div>
      )}

      {/* TOP HEADER & QUEUE BAR */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0F1A34', margin: '0 0 0.25rem 0', letterSpacing: '-0.02em' }}>
            {activeQueueTab === 'junk' ? 'Manage Junks' : 'Lead Management Queue'}
          </h1>
          <p style={{ fontSize: '0.875rem', color: '#557396', margin: 0, fontWeight: 500 }}>
            {activeQueueTab === 'junk'
              ? 'Review, reassign, or permanently delete junk leads'
              : 'Manage and track your sales pipeline efficiency'}
          </p>
        </div>

        {/* Top-Right CTA: Create New Lead */}
        {canCreateLead && (
          <button
            type="button"
            className="btn-primary"
            onClick={() => onOpenCreateModal && onOpenCreateModal('createLead')}
            style={{
              boxShadow: '0 4px 14px rgba(0, 34, 255, 0.25)',
              display: 'flex',
              alignItems: 'center' }}
          >
            <LuPlus size={16} />
            <span>Create New Lead</span>
          </button>
        )}
      </div>

      {/* SEARCH AND QUEUE TABS BAR */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>
        
        {/* Search Box */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.625rem',
            background: '#FFFFFF',
            border: '1px solid #E2E8F0',
            borderRadius: '9999px',
            padding: '0.5rem 1.125rem',
            width: '380px',
            maxWidth: '100%',
            boxShadow: '0 1px 4px rgba(15, 26, 52, 0.04)'
          }}
        >
          <LuSearch size={18} color="#557396" />
          <input aria-label="Search leads"
            type="text"
            placeholder={activeQueueTab === 'junk' ? 'Search by name, ID, or reason...' : 'Search by Lead ID, Name, or Phone Num'}
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
            style={{
              border: 'none',
              outline: 'none',
              background: 'transparent',
              fontSize: '0.875rem',
              color: '#0F1A34',
              fontWeight: 500,
              width: '100%'
            }}
          />
          {localSearch && (
            <button
              type="button"
              onClick={() => setLocalSearch('')}
              style={{ border: 'none', background: 'transparent', cursor: 'pointer', padding: 0, color: '#64748B' }}
            >
              <LuX size={16} />
            </button>
          )}
        </div>

        {/* 3-Tab Segmented Queue Switcher (Unassigned | Assigned | Junk) */}
        <div className="toggle-group" role="tablist" aria-label="Lead queue">
          {!isSalesExecutiveUser && (
            <button
              type="button"
              role="tab"
              aria-selected={activeQueueTab === 'unassigned'}
              className={`toggle-btn ${activeQueueTab === 'unassigned' ? 'active' : ''}`}
              onClick={() => setActiveQueueTab('unassigned')}
              style={{
                padding: '0.5rem 1.375rem',
                fontSize: '0.8125rem',
                fontWeight: 700,
                border: 'none',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                display: 'flex',
                alignItems: 'center',
                gap: '0.375rem'
              }}
            >
              <span>Unassigned</span>
              {queueCounts.unassigned > 0 && (
                <span
                  style={{
                    fontSize: '0.6875rem',
                    padding: '0.125rem 0.5rem',
                    borderRadius: '9999px',
                    background: activeQueueTab === 'unassigned' ? '#EBF0FF' : '#E2E8F0',
                    color: activeQueueTab === 'unassigned' ? '#0022FF' : '#475569',
                    fontWeight: 800
                  }}
                >
                  {queueCounts.unassigned}
                </span>
              )}
            </button>
          )}

          <button
            type="button"
            role="tab"
            aria-selected={activeQueueTab === 'assigned'}
            className={`toggle-btn ${activeQueueTab === 'assigned' ? 'active' : ''}`}
            onClick={() => setActiveQueueTab('assigned')}
            style={{
              padding: '0.5rem 1.375rem',
              fontSize: '0.8125rem',
              fontWeight: 700,
              border: 'none',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              display: 'flex',
              alignItems: 'center',
              gap: '0.375rem'
            }}
          >
            <span>Assigned</span>
            {queueCounts.assigned > 0 && (
              <span
                style={{
                  fontSize: '0.6875rem',
                  padding: '0.125rem 0.5rem',
                  borderRadius: '9999px',
                  background: activeQueueTab === 'assigned' ? '#EBF0FF' : '#E2E8F0',
                  color: activeQueueTab === 'assigned' ? '#0022FF' : '#475569',
                  fontWeight: 800
                }}
              >
                {queueCounts.assigned}
              </span>
            )}
          </button>

          <button
            type="button"
            role="tab"
            aria-selected={activeQueueTab === 'junk'}
            className={`toggle-btn ${activeQueueTab === 'junk' ? 'active' : ''}`}
            onClick={() => setActiveQueueTab('junk')}
            style={{
              padding: '0.5rem 1.375rem',
              fontSize: '0.8125rem',
              fontWeight: 700,
              border: 'none',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              display: 'flex',
              alignItems: 'center',
              gap: '0.375rem'
            }}
          >
            <span>Junk</span>
            {queueCounts.junk > 0 && (
              <span
                style={{
                  fontSize: '0.6875rem',
                  padding: '0.125rem 0.5rem',
                  borderRadius: '9999px',
                  background: activeQueueTab === 'junk' ? '#FEE2E2' : '#E2E8F0',
                  color: activeQueueTab === 'junk' ? '#DC2626' : '#475569',
                  fontWeight: 800
                }}
              >
                {queueCounts.junk}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* FILTER DRAWER (Collapsible) */}
      <AnimatePresence>
        {showFilterDrawer && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            style={{
              background: '#FFFFFF',
              borderRadius: 'var(--radius)',
              padding: '1.25rem',
              boxShadow: '0 4px 16px rgba(15, 26, 52, 0.05)',
              display: 'flex',
              flexWrap: 'wrap',
              gap: '1rem',
              alignItems: 'center',
              border: '1px solid #E2E8F0'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700, fontSize: '0.875rem', color: '#0F1A34' }}>
              <LuSlidersHorizontal size={16} /> Filters:
            </div>

            {/* Project Select */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
              <span style={{ fontSize: '0.8125rem', color: '#557396', fontWeight: 600 }}>Project:</span>
              <select aria-label="Filter by project"
                value={selectedProject}
                onChange={(e) => setSelectedProject(e.target.value)}
                style={{
                  padding: '0.375rem 0.75rem',
                  borderRadius: '9999px',
                  border: '1px solid #CBD5E1',
                  background: '#F8FAFC',
                  fontSize: '0.8125rem',
                  fontWeight: 600,
                  color: '#0F1A34'
                }}
              >
                {PROJECT_OPTIONS.map(p => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
            </div>

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

            {/* Reset Filters */}
            <button
              type="button"
              className="btn-secondary btn-sm"
              onClick={() => {
                setSelectedSources([]);
                setSelectedStatuses([]);
                setSelectedProject('All Projects');
                setLocalSearch('');
                setOverdueOnly(false);
                if (onClearFilters) onClearFilters();
              }}
            >
              Reset Filters
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* MAIN QUEUE CARD & TABLE */}
      <div className="section-card" style={{ padding: 0, overflow: 'hidden', borderRadius: 'var(--radius)', border: '1px solid #E2E8F0', boxShadow: '0 4px 18px rgba(15, 26, 52, 0.04)' }}>
        
        {/* Table Header Action Toolbar */}
        <div
          style={{
            padding: '1.125rem 1.5rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottom: '1px solid #EDF2F7',
            backgroundColor: '#FFFFFF',
            flexWrap: 'wrap',
            gap: '0.75rem'
          }}
        >
          {/* Active Queue Title with Live Red Indicator Dot */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
            <h2 style={{ fontSize: '1.125rem', fontWeight: 800, color: '#0F1A34', margin: 0 }}>
              {activeQueueTab === 'junk' ? 'Active Junk Leads Queue' : 'Active Leads Queue'}
            </h2>
            <motion.span
              animate={{ opacity: [1, 0.35, 1], scale: [1, 1.25, 1] }}
              transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
              style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                backgroundColor: '#EF4444',
                display: 'inline-block'
              }}
              title="Live Pipeline Queue"
            />
          </div>

          {/* Action Buttons: Filter, Bulk Import, Bulk Auto-Assign */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', flexWrap: 'wrap' }}>
            
            {/* Filter Toggle Button */}
            <button
              type="button"
              className={`btn-secondary ${showFilterDrawer ? 'active' : ''}`}
              onClick={() => setShowFilterDrawer(!showFilterDrawer)}
              style={{
                padding: '0.5rem 1rem',
                fontSize: '0.8125rem',
                fontWeight: 700,
                borderRadius: '9999px',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}
            >
              <LuSlidersHorizontal size={14} />
              <span>Filter</span>
            </button>

            {/* Bulk Import Button */}
            {canImportLeads && (
              <button
                type="button"
                className="btn-secondary"
                onClick={() => setIsImportModalOpen(true)}
                style={{
                  background: '#0F1A34',
                  color: '#FFFFFF',
                  borderColor: '#0F1A34',
                  display: 'inline-flex',
                  alignItems: 'center' }}
              >
                <LuUpload size={14} />
                <span>Bulk Import</span>
              </button>
            )}

            {/* Bulk Auto-Assign Button (Visible in Unassigned queue) */}
            {activeQueueTab === 'unassigned' && canAssignLeads && (
              <button
                type="button"
                className="btn-primary"
                onClick={() => {
                  if (selectedLeadIds.length > 0) {
                    handleOpenBulkAssignExecModal();
                  } else {
                    setIsAutoAssignModalOpen(true);
                  }
                }}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center' }}
              >
                <LuUserCheck size={14} />
                <span>{selectedLeadIds.length > 0 ? `Assign Selected (${selectedLeadIds.length})` : 'Bulk Auto-Assign'}</span>
              </button>
            )}
          </div>
        </div>

        {/* TABLE CONTENT */}
        <div style={{ width: '100%', overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '1000px' }}>
            <thead>
              <tr style={{ backgroundColor: '#F8FAFC', borderBottom: '1px solid #E2E8F0' }}>
                {activeQueueTab !== 'junk' && (
                  <th style={{ padding: '0.875rem 1.25rem', width: '40px' }}>
                    <input aria-label="Select"
                      type="checkbox"
                      ref={selectAllRef}
                      checked={isAllSelected}
                      onChange={handleSelectAll}
                      style={{ cursor: 'pointer', accentColor: '#0022FF', width: '16px', height: '16px' }}
                    />
                  </th>
                )}
                <th style={{ padding: '0.875rem 1rem', fontSize: '0.75rem', fontWeight: 800, color: '#557396', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  LEAD ID
                </th>
                <th style={{ padding: '0.875rem 1rem', fontSize: '0.75rem', fontWeight: 800, color: '#557396', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  CUSTOMER NAME
                </th>
                <th style={{ padding: '0.875rem 1rem', fontSize: '0.75rem', fontWeight: 800, color: '#557396', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  CONTACT DETAILS
                </th>
                {activeQueueTab !== 'junk' && (
                  <>
                    <th style={{ padding: '0.875rem 1rem', fontSize: '0.75rem', fontWeight: 800, color: '#557396', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                      DOB
                    </th>
                    <th style={{ padding: '0.875rem 1rem', fontSize: '0.75rem', fontWeight: 800, color: '#557396', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                      INCOME
                    </th>
                    <th style={{ padding: '0.875rem 1rem', fontSize: '0.75rem', fontWeight: 800, color: '#557396', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                      CREATION DATE
                    </th>
                  </>
                )}
                <th style={{ padding: '0.875rem 1rem', fontSize: '0.75rem', fontWeight: 800, color: '#557396', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  SOURCE
                </th>
                <th style={{ padding: '0.875rem 1rem', fontSize: '0.75rem', fontWeight: 800, color: '#557396', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  PROJECT
                </th>
                {activeQueueTab !== 'junk' && (
                  <th style={{ padding: '0.875rem 1rem', fontSize: '0.75rem', fontWeight: 800, color: '#557396', textTransform: 'uppercase', letterSpacing: '0.04em', textAlign: 'center' }}>
                    ENQUIRIES
                  </th>
                )}
                <th style={{ padding: '0.875rem 1rem', fontSize: '0.75rem', fontWeight: 800, color: '#557396', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  STATUS
                </th>
                {/* Assigned Sales Head Column (Only visible to Sales Admin) */}
                {canAssignHead && (
                  <th style={{ padding: '0.875rem 1rem', fontSize: '0.75rem', fontWeight: 800, color: '#557396', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    {activeQueueTab === 'junk' ? 'ASSIGNED RM' : 'ASSIGNED SALES HEAD'}
                  </th>
                )}
                {activeQueueTab === 'junk' ? (
                  <>
                    <th style={{ padding: '0.875rem 1rem', fontSize: '0.75rem', fontWeight: 800, color: '#557396', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                      EM NAME
                    </th>
                    <th style={{ padding: '0.875rem 1rem', fontSize: '0.75rem', fontWeight: 800, color: '#557396', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                      JUNK REASON
                    </th>
                    <th style={{ padding: '0.875rem 1.25rem', fontSize: '0.75rem', fontWeight: 800, color: '#557396', textTransform: 'uppercase', letterSpacing: '0.04em', textAlign: 'right' }}>
                      ACTIONS
                    </th>
                  </>
                ) : (
                  <>
                    {!isSalesExecutiveUser && (
                      <th style={{ padding: '0.875rem 1rem', fontSize: '0.75rem', fontWeight: 800, color: '#557396', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                        ASSIGNED SALES EXECUTIVE
                      </th>
                    )}
                    {activeQueueTab === 'assigned' && !isSalesExecutiveUser && (
                      <th style={{ padding: '0.875rem 1.25rem', fontSize: '0.75rem', fontWeight: 800, color: '#557396', textTransform: 'uppercase', letterSpacing: '0.04em', textAlign: 'right' }}>
                        ACTIONS
                      </th>
                    )}
                  </>
                )}
              </tr>
            </thead>
            <tbody>
              {displayedLeads.length === 0 ? (
                <EmptyRow
                  colSpan={13}
                  icon={LuSearch}
                  title={activeQueueTab === 'junk' ? 'No junk leads' : 'No leads found'}
                  description={activeQueueTab === 'junk'
                    ? 'There are no active junk leads in the audit log.'
                    : 'No leads match your current filters or search. Try clearing a filter.'}
                />
              ) : (
                displayedLeads.map((lead) => {
                  const isChecked = selectedLeadIds.includes(lead.id);
                  const srcBadge = getSourceBadgeStyle(lead.leadSource);
                  const stBadge = getStatusBadgeStyle(lead.status);

                  return (
                    <tr
                      key={lead.id}
                      style={{
                        borderBottom: '1px solid #F1F5F9',
                        backgroundColor: isChecked ? '#F0F4FF' : '#FFFFFF',
                        transition: 'background-color 0.15s ease'
                      }}
                      onMouseEnter={(e) => {
                        if (!isChecked) e.currentTarget.style.backgroundColor = '#F8FAFC';
                      }}
                      onMouseLeave={(e) => {
                        if (!isChecked) e.currentTarget.style.backgroundColor = '#FFFFFF';
                      }}
                    >
                      {/* Checkbox */}
                      {activeQueueTab !== 'junk' && (
                        <td style={{ padding: '1rem 1.25rem' }}>
                          <input aria-label="Select"
                            type="checkbox"
                            checked={isChecked}
                            onChange={(e) => handleToggleLead(lead.id, e)}
                            style={{ cursor: 'pointer', accentColor: '#0022FF', width: '16px', height: '16px' }}
                          />
                        </td>
                      )}

                      {/* Lead ID */}
                      <td style={{ padding: '1rem', fontSize: '0.8125rem', fontWeight: 700, color: '#0022FF', whiteSpace: 'nowrap' }}>
                        {lead.id}
                      </td>

                      {/* Customer Name */}
                      <td style={{ padding: '1rem' }}>
                        <div role="button" tabIndex={0} onKeyDown={onKeyActivate}
                          onClick={() => onSelectLead && onSelectLead(lead)}
                          style={{
                            fontSize: '0.875rem',
                            fontWeight: 800,
                            color: '#0F1A34',
                            cursor: 'pointer',
                            whiteSpace: 'nowrap'
                          }}
                          title="Click to view lead details"
                        >
                          {lead.leadName}
                        </div>
                      </td>

                      {/* Contact Details (Phone bold, Email below) */}
                      <td style={{ padding: '1rem' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.125rem' }}>
                          <span style={{ fontSize: '0.8125rem', fontWeight: 800, color: '#0F1A34', whiteSpace: 'nowrap' }}>
                            {lead.phone || lead.phoneNumber || '--'}
                          </span>
                          <span style={{ fontSize: '0.75rem', color: '#64748B', whiteSpace: 'nowrap' }}>
                            {lead.email || lead.emailId || '--'}
                          </span>
                        </div>
                      </td>

                      {/* DOB */}
                      {activeQueueTab !== 'junk' && (
                        <td style={{ padding: '1rem', fontSize: '0.8125rem', color: '#475569', whiteSpace: 'nowrap' }}>
                          {lead.dob || '--'}
                        </td>
                      )}

                      {/* Income */}
                      {activeQueueTab !== 'junk' && (
                        <td style={{ padding: '1rem', fontSize: '0.8125rem', color: '#475569', whiteSpace: 'nowrap' }}>
                          {lead.income || '--'}
                        </td>
                      )}

                      {/* Creation Date */}
                      {activeQueueTab !== 'junk' && (
                        <td style={{ padding: '1rem', fontSize: '0.8125rem', color: '#475569', whiteSpace: 'nowrap' }}>
                          {lead.creationDate || lead.createdDate || '--'}
                        </td>
                      )}

                      {/* Source */}
                      <td style={{ padding: '1rem' }}>
                        <span
                          style={{
                            display: 'inline-block',
                            padding: '0.25rem 0.625rem',
                            borderRadius: '9999px',
                            fontSize: '0.6875rem',
                            fontWeight: 800,
                            letterSpacing: '0.03em',
                            backgroundColor: srcBadge.bg,
                            color: srcBadge.color,
                            border: srcBadge.border,
                            whiteSpace: 'nowrap'
                          }}
                        >
                          {(lead.leadSource || 'WEBSITE').toUpperCase()}
                        </span>
                      </td>

                      {/* Project */}
                      <td style={{ padding: '1rem', fontSize: '0.8125rem', color: '#475569', whiteSpace: 'nowrap' }}>
                        {lead.project || 'N/A'}
                      </td>

                      {/* Enquiries */}
                      {activeQueueTab !== 'junk' && (
                        <td style={{ padding: '1rem', textAlign: 'center' }}>
                          <span role="button" tabIndex={0} onKeyDown={onKeyActivate}
                            onClick={() => onSelectLead && onSelectLead(lead)}
                            style={{
                              fontSize: '0.875rem',
                              fontWeight: 800,
                              color: '#0022FF',
                              textDecoration: 'underline',
                              cursor: 'pointer'
                            }}
                          >
                            {lead.enquiries !== undefined ? lead.enquiries : 1}
                          </span>
                        </td>
                      )}

                      {/* Status */}
                      <td style={{ padding: '1rem' }}>
                        <span
                          style={{
                            display: 'inline-block',
                            padding: '0.25rem 0.75rem',
                            borderRadius: '9999px',
                            fontSize: '0.75rem',
                            fontWeight: 800,
                            backgroundColor: stBadge.bg,
                            color: stBadge.color,
                            border: stBadge.border,
                            whiteSpace: 'nowrap'
                          }}
                        >
                          {(lead.status || 'NEW LEADS').toUpperCase()}
                        </span>
                      </td>

                      {/* Assigned Sales Head (Only visible to Sales Admin) */}
                      {canAssignHead && (
                        <td style={{ padding: '1rem' }}>
                          {lead.salesHead ? (
                            <div role="button" tabIndex={0} onKeyDown={onKeyActivate}
                              onClick={(e) => handleOpenAssignHeadModal(lead, e)}
                              style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '0.5rem',
                                background: '#0F1A34',
                                color: '#FFFFFF',
                                padding: '0.25rem 0.625rem',
                                borderRadius: '9999px',
                                fontSize: '0.75rem',
                                fontWeight: 700,
                                cursor: 'pointer',
                                boxShadow: '0 2px 6px rgba(15, 26, 52, 0.15)'
                              }}
                              title="Click to change Sales Head"
                            >
                              <span
                                style={{
                                  width: '18px',
                                  height: '18px',
                                  borderRadius: '50%',
                                  background: '#0022FF',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  fontSize: '0.625rem',
                                  fontWeight: 800
                                }}
                              >
                                {lead.salesHead.slice(0, 2).toUpperCase()}
                              </span>
                              <span style={{ whiteSpace: 'nowrap' }}>{lead.salesHead}</span>
                            </div>
                          ) : (
                            <button
                              type="button"
                              className="btn-secondary btn-sm"
                              onClick={(e) => handleOpenAssignHeadModal(lead, e)}
                              style={{
                                color: '#0022FF',
                                borderColor: '#D5E2EE',
                                whiteSpace: 'nowrap' }}
                            >
                              <LuUserPlus size={14} />
                              <span>Assign Sales Head</span>
                            </button>
                          )}
                        </td>
                      )}

                      {/* Assigned Sales Executive / CTA */}
                      {activeQueueTab === 'junk' ? (
                        <>
                          {/* EM Name */}
                          <td style={{ padding: '1rem', fontSize: '0.8125rem', color: '#475569', whiteSpace: 'nowrap' }}>
                            {lead.salesExecutive || '--'}
                          </td>

                          {/* Junk Reason */}
                          <td style={{ padding: '1rem', fontSize: '0.8125rem', color: '#DC2626', fontWeight: 600 }}>
                            {lead.junkReason || 'Marked as Junk'}
                          </td>

                          {/* Junk Actions (Reassign to Sales Executive & Delete) */}
                          <td style={{ padding: '0.875rem 1rem', textAlign: 'right' }}>
                            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', justifyContent: 'flex-end', flexWrap: 'nowrap' }}>
                              {/* Reassign to Sales Executive */}
                              {canAssignLeads && (
                              <button
                                type="button"
                                className="btn-secondary btn-sm"
                                onClick={(e) => handleOpenAssignExecModal(lead, e)}
                                style={{
                                  color: '#0022FF',
                                  borderColor: '#C7D7FE',
                                  backgroundColor: '#EBF0FF',
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  cursor: 'pointer' }}
                                title="Reassign this junk lead to a Sales Executive"
                              >
                                <LuUserCheck size={14} />
                                <span>Reassign</span>
                              </button>
                              )}

                              {/* Delete CTA */}
                              {canDeleteLeads && (
                              <button
                                type="button"
                                className="btn-secondary btn-sm"
                                onClick={(e) => handleDeleteJunkLead(lead, e)}
                                style={{
                                  color: '#DC2626',
                                  borderColor: '#FECACA',
                                  backgroundColor: '#FEF2F2',
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  cursor: 'pointer' }}
                                title="Permanently delete this junk lead"
                              >
                                <LuTrash2 size={14} />
                                <span>Delete</span>
                              </button>
                              )}
                            </div>
                          </td>
                        </>
                      ) : (
                        <>
                          {!isSalesExecutiveUser && (
                            <td style={{ padding: '1rem' }}>
                              {lead.salesExecutive && lead.salesExecutive !== 'Unassigned' ? (
                                <div role="button" tabIndex={0} onKeyDown={onKeyActivate}
                                  onClick={(e) => handleOpenAssignExecModal(lead, e)}
                                  style={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '0.5rem',
                                    background: '#EBF0FF',
                                    color: '#0022FF',
                                    border: '1px solid #C7D7FE',
                                    padding: '0.25rem 0.75rem',
                                    borderRadius: '9999px',
                                    fontSize: '0.75rem',
                                    fontWeight: 700,
                                    cursor: 'pointer'
                                  }}
                                  title="Click to reassign Sales Executive"
                                >
                                  <LuBriefcase size={12} />
                                  <span style={{ whiteSpace: 'nowrap' }}>{lead.salesExecutive}</span>
                                </div>
                              ) : (
                                /* CTA: Assign Sales Executive */
                                <button
                                  type="button"
                                  className="btn-primary btn-sm"
                                  onClick={(e) => handleOpenAssignExecModal(lead, e)}
                                  style={{
                                    background: '#0022FF',
                                    color: '#FFFFFF',
                                    border: 'none',
                                    cursor: 'pointer',
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    whiteSpace: 'nowrap',
                                    boxShadow: '0 2px 8px rgba(0, 34, 255, 0.25)' }}
                                >
                                  <LuUserPlus size={14} />
                                  <span>Assign Sales Executive</span>
                                </button>
                              )}
                            </td>
                          )}

                          {/* Actions Column (Assigned queue) */}
                          {activeQueueTab === 'assigned' && !isSalesExecutiveUser && (
                            <td style={{ padding: '1rem 1.25rem', textAlign: 'right' }}>
                              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '0.5rem', position: 'relative' }}>
                                <button
                                  type="button"
                                  className="btn-secondary btn-sm"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    onSelectLead?.(lead);
                                  }}
                                  style={{
                                    color: '#0F1A34',
                                    borderColor: '#E2E8F0' }}
                                >
                                  EDIT LEAD
                                </button>

                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setActiveActionMenuId(activeActionMenuId === lead.id ? null : lead.id);
                                  }}
                                  style={{
                                    width: '28px',
                                    height: '28px',
                                    borderRadius: '50%',
                                    border: 'none',
                                    background: activeActionMenuId === lead.id ? '#E2E8F0' : 'transparent',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    cursor: 'pointer',
                                    color: '#557396'
                                  }}
                                >
                                  <LuEllipsisVertical size={16} />
                                </button>

                                {/* Action Dropdown Menu */}
                                {activeActionMenuId === lead.id && (
                                  <div
                                    onClick={(e) => e.stopPropagation()}
                                    style={{
                                      position: 'absolute',
                                      right: 0,
                                      top: '32px',
                                      background: '#FFFFFF',
                                      borderRadius: 'var(--radius)',
                                      boxShadow: '0 6px 20px rgba(15, 26, 52, 0.12)',
                                      border: '1px solid #E2E8F0',
                                      padding: '0.375rem',
                                      zIndex: 100,
                                      minWidth: '150px',
                                      display: 'flex',
                                      flexDirection: 'column',
                                      gap: '2px'
                                    }}
                                  >
                                    <button
                                      type="button"
                                      onClick={() => {
                                        onSelectLead?.(lead);
                                        setActiveActionMenuId(null);
                                      }}
                                      style={{
                                        border: 'none',
                                        background: 'transparent',
                                        padding: '0.5rem 0.75rem',
                                        fontSize: '0.75rem',
                                        fontWeight: 600,
                                        color: '#0F1A34',
                                        textAlign: 'left',
                                        borderRadius: 'var(--radius)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.5rem',
                                        cursor: 'pointer'
                                      }}
                                      onMouseEnter={(e) => e.currentTarget.style.background = '#F8FAFC'}
                                      onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                                    >
                                      <LuEye size={14} /> View Details
                                    </button>

                                    {canAssignLeads && (
                                    <button
                                      type="button"
                                      onClick={() => {
                                        handleOpenAssignExecModal(lead);
                                        setActiveActionMenuId(null);
                                      }}
                                      style={{
                                        border: 'none',
                                        background: 'transparent',
                                        padding: '0.5rem 0.75rem',
                                        fontSize: '0.75rem',
                                        fontWeight: 600,
                                        color: '#0022FF',
                                        textAlign: 'left',
                                        borderRadius: 'var(--radius)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.5rem',
                                        cursor: 'pointer'
                                      }}
                                      onMouseEnter={(e) => e.currentTarget.style.background = '#F8FAFC'}
                                      onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                                    >
                                      <LuUserPlus size={14} /> Reassign Exec
                                    </button>
                                    )}

                                    {canJunkLeads && (
                                    <button
                                      type="button"
                                      onClick={(e) => handleMarkAsJunk(lead, e)}
                                      style={{
                                        border: 'none',
                                        background: 'transparent',
                                        padding: '0.5rem 0.75rem',
                                        fontSize: '0.75rem',
                                        fontWeight: 600,
                                        color: '#DC2626',
                                        textAlign: 'left',
                                        borderRadius: 'var(--radius)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.5rem',
                                        cursor: 'pointer'
                                      }}
                                      onMouseEnter={(e) => e.currentTarget.style.background = '#FEF2F2'}
                                      onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                                    >
                                      <LuTrash2 size={14} /> Move to Junk
                                    </button>
                                    )}
                                  </div>
                                )}
                              </div>
                            </td>
                          )}
                        </>
                      )}
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* TABLE FOOTER & PAGINATION */}
        <div
          style={{
            padding: '1rem 1.5rem',
            borderTop: '1px solid #EDF2F7',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '0.75rem',
            backgroundColor: '#FFFFFF'
          }}
        >
          <div style={{ fontSize: '0.8125rem', color: '#557396', fontWeight: 600 }}>
            Showing <strong style={{ color: '#0F1A34' }}>{totalLeads > 0 ? startIndex + 1 : 0}</strong> - <strong style={{ color: '#0F1A34' }}>{Math.min(startIndex + PAGE_SIZE, totalLeads)}</strong> of <strong style={{ color: '#0F1A34' }}>{totalLeads}</strong> Records
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <button
              type="button"
              className="btn-secondary btn-sm"
              disabled={currentPageSafe <= 1}
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              style={{
                opacity: currentPageSafe <= 1 ? 0.45 : 1,
                cursor: currentPageSafe <= 1 ? 'not-allowed' : 'pointer' }}
            >
              <LuChevronLeft size={14} /> Previous
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => setCurrentPage(p)}
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: 'var(--radius)',
                  border: 'none',
                  fontSize: '0.8125rem',
                  fontWeight: 800,
                  cursor: 'pointer',
                  backgroundColor: p === currentPageSafe ? '#0022FF' : '#F1F5F9',
                  color: p === currentPageSafe ? '#FFFFFF' : '#0F1A34',
                  transition: 'all 0.15s ease'
                }}
              >
                {p}
              </button>
            ))}

            <button
              type="button"
              className="btn-secondary btn-sm"
              disabled={currentPageSafe >= totalPages}
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              style={{
                opacity: currentPageSafe >= totalPages ? 0.45 : 1,
                cursor: currentPageSafe >= totalPages ? 'not-allowed' : 'pointer' }}
            >
              Next <LuChevronRight size={14} />
            </button>
          </div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* MODAL 1: ASSIGN SALES HEAD (Sales Admin Action)          */}
      {/* ======================================================== */}
      <AnimatePresence>
        {(assigningHeadLead || assigningHeadBulkIds.length > 0) && (
          <motion.div
            className="modal-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => {
              setAssigningHeadLead(null);
              setAssigningHeadBulkIds([]);
            }}
            style={{
              position: 'fixed',
              inset: 0,
              backgroundColor: 'rgba(15, 26, 52, 0.45)',
              backdropFilter: 'blur(4px)',
              zIndex: 10000,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '1.25rem'
            }}
          >
            <motion.div role="dialog" aria-label="Assign Sales Head" aria-modal="true"
              className="modal-card"
              initial={{ scale: 0.94, opacity: 0, y: 15 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.94, opacity: 0, y: 15 }}
              onClick={(e) => e.stopPropagation()}
              style={{
                background: '#FFFFFF',
                borderRadius: 'var(--radius)',
                width: '520px',
                maxWidth: '100%',
                maxHeight: '85vh',
                display: 'flex',
                flexDirection: 'column',
                boxShadow: '0 20px 50px rgba(15, 26, 52, 0.2)',
                overflow: 'hidden'
              }}
            >
              <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid #EDF2F7', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <h3 style={{ fontSize: '1.125rem', fontWeight: 800, color: '#0F1A34', margin: 0 }}>
                    Assign Sales Head
                  </h3>
                  <div style={{ fontSize: '0.75rem', color: '#557396', marginTop: '0.25rem' }}>
                    {assigningHeadBulkIds.length > 0
                      ? `Assign ${assigningHeadBulkIds.length} selected leads to a Regional Sales Head`
                      : `Assign lead "${assigningHeadLead?.leadName}" (${assigningHeadLead?.id}) to a Sales Head`}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setAssigningHeadLead(null);
                    setAssigningHeadBulkIds([]);
                  }}
                  style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: '#64748B', padding: '4px' }}
                >
                  <LuX size={18} />
                </button>
              </div>

              <div style={{ padding: '1.25rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem', overflowY: 'auto' }}>
                <div style={{ position: 'relative' }}>
                  <LuSearch size={16} color="#557396" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                  <input aria-label="Search sales heads by name, role, email"
                    type="text"
                    placeholder="Search sales heads by name, role, email..."
                    value={headSearch}
                    onChange={(e) => setHeadSearch(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.5rem 0.875rem 0.5rem 2.25rem',
                      borderRadius: 'var(--radius)',
                      border: '1px solid #CBD5E1',
                      fontSize: '0.875rem',
                      outline: 'none',
                      color: '#0F1A34'
                    }}
                  />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', maxHeight: '280px', overflowY: 'auto' }}>
                  {salesHeads
                    .filter(sh => {
                      if (!headSearch.trim()) return true;
                      const q = headSearch.toLowerCase();
                      return (sh.name || '').toLowerCase().includes(q) || (sh.role || '').toLowerCase().includes(q);
                    })
                    .map(sh => {
                      const isSelected = selectedHeadId === sh.id;
                      return (
                        <div role="button" tabIndex={0} onKeyDown={onKeyActivate}
                          key={sh.id}
                          onClick={() => setSelectedHeadId(sh.id)}
                          style={{
                            padding: '0.75rem 1rem',
                            borderRadius: 'var(--radius)',
                            border: `1.5px solid ${isSelected ? '#0022FF' : '#E2E8F0'}`,
                            backgroundColor: isSelected ? '#F0F4FF' : '#FFFFFF',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            cursor: 'pointer',
                            transition: 'all 0.15s ease'
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                            <div
                              style={{
                                width: '36px',
                                height: '36px',
                                borderRadius: '50%',
                                background: isSelected ? '#0022FF' : '#0F1A34',
                                color: '#FFFFFF',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontWeight: 800,
                                fontSize: '0.875rem'
                              }}
                            >
                              {(sh.name || 'SH').slice(0, 2).toUpperCase()}
                            </div>
                            <div>
                              <div style={{ fontSize: '0.875rem', fontWeight: 800, color: '#0F1A34' }}>
                                {sh.name}
                              </div>
                              <div style={{ fontSize: '0.75rem', color: '#557396' }}>
                                {sh.role} • {sh.project || 'Enterprise'}
                              </div>
                            </div>
                          </div>
                          {isSelected && (
                            <div style={{ width: '22px', height: '22px', borderRadius: '50%', background: '#0022FF', color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                              <LuCheck size={14} />
                            </div>
                          )}
                        </div>
                      );
                    })}
                </div>
              </div>

              <div style={{ padding: '1rem 1.5rem', borderTop: '1px solid #EDF2F7', display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', background: '#F8FAFC' }}>
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => {
                    setAssigningHeadLead(null);
                    setAssigningHeadBulkIds([]);
                  }}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn-primary"
                  onClick={handleConfirmAssignHead}
                >
                  Confirm Assignment
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ======================================================== */}
      {/* MODAL 2: ASSIGN SALES EXECUTIVE (Sales Head Action)      */}
      {/* Moves Lead from Unassigned -> Assigned Queue             */}
      {/* ======================================================== */}
      <AnimatePresence>
        {(assigningExecLead || assigningExecBulkIds.length > 0) && (
          <motion.div
            className="modal-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => {
              setAssigningExecLead(null);
              setAssigningExecBulkIds([]);
            }}
            style={{
              position: 'fixed',
              inset: 0,
              backgroundColor: 'rgba(15, 26, 52, 0.45)',
              backdropFilter: 'blur(4px)',
              zIndex: 10000,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '1.25rem'
            }}
          >
            <motion.div role="dialog" aria-label="Assign Sales Executive" aria-modal="true"
              className="modal-card"
              initial={{ scale: 0.94, opacity: 0, y: 15 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.94, opacity: 0, y: 15 }}
              onClick={(e) => e.stopPropagation()}
              style={{
                background: '#FFFFFF',
                borderRadius: 'var(--radius)',
                width: '560px',
                maxWidth: '100%',
                maxHeight: '85vh',
                display: 'flex',
                flexDirection: 'column',
                boxShadow: '0 20px 50px rgba(15, 26, 52, 0.2)',
                overflow: 'hidden'
              }}
            >
              <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid #EDF2F7', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <h3 style={{ fontSize: '1.125rem', fontWeight: 800, color: '#0F1A34', margin: 0 }}>
                    Assign Sales Executive
                  </h3>
                  <div style={{ fontSize: '0.75rem', color: '#557396', marginTop: '0.25rem' }}>
                    {assigningExecBulkIds.length > 0
                      ? `Allocate ${assigningExecBulkIds.length} unassigned leads to a Sales Executive`
                      : `Assign "${assigningExecLead?.leadName}" (${assigningExecLead?.id}) to a Sales Executive`}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setAssigningExecLead(null);
                    setAssigningExecBulkIds([]);
                  }}
                  style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: '#64748B', padding: '4px' }}
                >
                  <LuX size={18} />
                </button>
              </div>

              <div style={{ padding: '1.25rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem', overflowY: 'auto' }}>
                {/* Lead Summary Info Badge */}
                {assigningExecLead && (
                  <div style={{ padding: '0.75rem 1rem', borderRadius: 'var(--radius)', background: '#F8FAFC', border: '1px solid #EDF2F7', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div>
                      <div style={{ fontSize: '0.875rem', fontWeight: 800, color: '#0F1A34' }}>
                        {assigningExecLead.leadName} ({assigningExecLead.id})
                      </div>
                      <div style={{ fontSize: '0.75rem', color: '#557396' }}>
                        {assigningExecLead.company} • {assigningExecLead.project || 'General Inquiry'}
                      </div>
                    </div>
                    <span style={{ fontSize: '0.75rem', fontWeight: 800, padding: '0.25rem 0.5rem', borderRadius: '9999px', background: '#E0F2FE', color: '#0369A1' }}>
                      {assigningExecLead.leadSource || 'WHATSAPP'}
                    </span>
                  </div>
                )}

                {/* Search Executive input */}
                <div style={{ position: 'relative' }}>
                  <LuSearch size={16} color="#557396" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                  <input aria-label="Search sales executives by name, email, project"
                    type="text"
                    placeholder="Search sales executives by name, email, project..."
                    value={execSearch}
                    onChange={(e) => setExecSearch(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.5rem 0.875rem 0.5rem 2.25rem',
                      borderRadius: 'var(--radius)',
                      border: '1px solid #CBD5E1',
                      fontSize: '0.875rem',
                      outline: 'none',
                      color: '#0F1A34'
                    }}
                  />
                </div>

                {/* Executive List */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', maxHeight: '280px', overflowY: 'auto' }}>
                  {availableExecutives
                    .filter(se => {
                      if (!execSearch.trim()) return true;
                      const q = execSearch.toLowerCase();
                      return (se.name || '').toLowerCase().includes(q) || (se.email || '').toLowerCase().includes(q) || (se.role || '').toLowerCase().includes(q);
                    })
                    .map(se => {
                      const isSelected = selectedExecId === se.id;
                      return (
                        <div role="button" tabIndex={0} onKeyDown={onKeyActivate}
                          key={se.id}
                          onClick={() => setSelectedExecId(se.id)}
                          style={{
                            padding: '0.75rem 1rem',
                            borderRadius: 'var(--radius)',
                            border: `1.5px solid ${isSelected ? '#0022FF' : '#E2E8F0'}`,
                            backgroundColor: isSelected ? '#F0F4FF' : '#FFFFFF',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            cursor: 'pointer',
                            transition: 'all 0.15s ease'
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                            <div
                              style={{
                                width: '38px',
                                height: '38px',
                                borderRadius: '50%',
                                background: isSelected ? '#0022FF' : (se.avatarBg || '#EBF0FF'),
                                color: isSelected ? '#FFFFFF' : (se.avatarColor || '#0022FF'),
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontWeight: 800,
                                fontSize: '0.875rem'
                              }}
                            >
                              {(se.initials || se.name.slice(0, 2)).toUpperCase()}
                            </div>
                            <div>
                              <div style={{ fontSize: '0.875rem', fontWeight: 800, color: '#0F1A34' }}>
                                {se.name}
                              </div>
                              <div style={{ fontSize: '0.75rem', color: '#557396' }}>
                                {se.role || 'Sales Executive'} • {se.email || 'exec@techgy.com'}
                              </div>
                            </div>
                          </div>

                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
                            <span style={{ fontSize: '0.75rem', color: '#557396', fontWeight: 600 }}>
                              {se.assignedLeadsCount !== undefined ? `${se.assignedLeadsCount} active leads` : 'Available'}
                            </span>
                            {isSelected && (
                              <div style={{ width: '22px', height: '22px', borderRadius: '50%', background: '#0022FF', color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <LuCheck size={14} />
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>

              <div style={{ padding: '1rem 1.5rem', borderTop: '1px solid #EDF2F7', display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', background: '#F8FAFC' }}>
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => {
                    setAssigningExecLead(null);
                    setAssigningExecBulkIds([]);
                  }}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn-primary"
                  onClick={handleConfirmAssignExec}
                >
                  Confirm & Move to Assigned
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ======================================================== */}
      {/* MODAL 3: BULK AUTO-ASSIGN MODAL                          */}
      {/* ======================================================== */}
      <AnimatePresence>
        {isAutoAssignModalOpen && (
          <motion.div
            className="modal-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsAutoAssignModalOpen(false)}
            style={{
              position: 'fixed',
              inset: 0,
              backgroundColor: 'rgba(15, 26, 52, 0.45)',
              backdropFilter: 'blur(4px)',
              zIndex: 10000,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '1.25rem'
            }}
          >
            <motion.div role="dialog" aria-label="Bulk Auto-Assign Leads" aria-modal="true"
              className="modal-card"
              initial={{ scale: 0.94, opacity: 0, y: 15 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.94, opacity: 0, y: 15 }}
              onClick={(e) => e.stopPropagation()}
              style={{
                background: '#FFFFFF',
                borderRadius: 'var(--radius)',
                width: '480px',
                maxWidth: '100%',
                padding: '1.75rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '1.25rem',
                boxShadow: '0 20px 50px rgba(15, 26, 52, 0.2)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem' }}>
                <div style={{ width: '44px', height: '44px', borderRadius: '50%', background: '#EBF0FF', color: '#0022FF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <LuUserCheck size={20} />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.125rem', fontWeight: 800, color: '#0F1A34', margin: 0 }}>
                    Bulk Auto-Assign Leads
                  </h3>
                  <div style={{ fontSize: '0.75rem', color: '#557396', marginTop: '0.125rem' }}>
                    Distribute unassigned queue round-robin
                  </div>
                </div>
              </div>

              <p style={{ fontSize: '0.875rem', color: '#475569', lineHeight: 1.5, margin: 0 }}>
                This will automatically distribute all <strong>{queueCounts.unassigned} unassigned leads</strong> evenly among active <strong>Sales Executives</strong> based on current capacity and load.
              </p>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => setIsAutoAssignModalOpen(false)}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn-primary"
                  onClick={handleExecuteAutoAssign}
                >
                  Start Auto-Assign
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ======================================================== */}
      {/* MODAL 4: BULK IMPORT CSV MODAL                           */}
      {/* ======================================================== */}
      <AnimatePresence>
        {isImportModalOpen && (
          <motion.div
            className="modal-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsImportModalOpen(false)}
            style={{
              position: 'fixed',
              inset: 0,
              backgroundColor: 'rgba(15, 26, 52, 0.45)',
              backdropFilter: 'blur(4px)',
              zIndex: 10000,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '1.25rem'
            }}
          >
            <motion.div role="dialog" aria-label="Bulk Import Leads" aria-modal="true"
              className="modal-card"
              initial={{ scale: 0.94, opacity: 0, y: 15 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.94, opacity: 0, y: 15 }}
              onClick={(e) => e.stopPropagation()}
              style={{
                background: '#FFFFFF',
                borderRadius: 'var(--radius)',
                width: '520px',
                maxWidth: '100%',
                padding: '1.75rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '1.25rem',
                boxShadow: '0 20px 50px rgba(15, 26, 52, 0.2)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#F1F5F9', color: '#0F1A34', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <LuUpload size={20} />
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1.125rem', fontWeight: 800, color: '#0F1A34', margin: 0 }}>
                      Bulk Import Leads
                    </h3>
                    <div style={{ fontSize: '0.75rem', color: '#557396', marginTop: '0.125rem' }}>
                      Upload CSV, XLSX, or TSV lead roster
                    </div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setIsImportModalOpen(false)}
                  style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: '#64748B' }}
                >
                  <LuX size={18} />
                </button>
              </div>

              {/* Drag & Drop Box */}
              <div role="button" tabIndex={0} onKeyDown={onKeyActivate}
                style={{
                  border: '2px dashed #CBD5E1',
                  borderRadius: 'var(--radius)',
                  padding: '2rem 1.5rem',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.625rem',
                  backgroundColor: '#F8FAFC',
                  cursor: 'pointer'
                }}
                onClick={() => {
                  setImportFile({ name: 'leads_campaign_batch_q3.csv', size: '48.2 KB' });
                }}
              >
                <LuUpload size={28} color="#0022FF" />
                <div style={{ fontSize: '0.875rem', fontWeight: 700, color: '#0F1A34' }}>
                  {importFile ? importFile.name : 'Click to select or drag & drop CSV file'}
                </div>
                <div style={{ fontSize: '0.75rem', color: '#557396' }}>
                  {importFile ? `${importFile.size} • Ready for verification` : 'Supports standard CRM lead exports (UTF-8)'}
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => {
                    setIsImportModalOpen(false);
                    setImportFile(null);
                  }}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn-primary"
                  disabled={!importFile || isImporting}
                  onClick={() => {
                    setIsImporting(true);
                    setTimeout(() => {
                      setIsImporting(false);
                      setIsImportModalOpen(false);
                      setImportFile(null);
                      onTriggerToast?.({
                        title: 'Import Successful',
                        description: '12 new leads imported into the Unassigned queue.',
                        type: 'success'
                      });
                    }, 600);
                  }}
                  style={{
                    opacity: !importFile ? 0.5 : 1 }}
                >
                  {isImporting ? 'Processing File...' : 'Import to Unassigned Queue'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ======================================================== */}
      {/* MODAL 5: DELETE JUNK CONFIRMATION MODAL                  */}
      {/* ======================================================== */}
      <AnimatePresence>
        {leadToDeleteJunk && (
          <motion.div
            className="modal-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setLeadToDeleteJunk(null)}
            style={{
              position: 'fixed',
              inset: 0,
              backgroundColor: 'rgba(15, 26, 52, 0.45)',
              backdropFilter: 'blur(4px)',
              zIndex: 10000,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '1.25rem'
            }}
          >
            <motion.div role="dialog" aria-label="Delete Junk Lead" aria-modal="true"
              className="modal-card"
              initial={{ scale: 0.94, opacity: 0, y: 15 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.94, opacity: 0, y: 15 }}
              onClick={(e) => e.stopPropagation()}
              style={{
                background: '#FFFFFF',
                borderRadius: 'var(--radius)',
                width: '440px',
                maxWidth: '100%',
                padding: '1.75rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '1.25rem',
                boxShadow: '0 20px 50px rgba(15, 26, 52, 0.2)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem' }}>
                <div style={{ width: '44px', height: '44px', borderRadius: '50%', background: '#FEF2F2', color: '#DC2626', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <LuTrash2 size={20} />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.125rem', fontWeight: 800, color: '#0F1A34', margin: 0 }}>
                    Delete Junk Lead
                  </h3>
                  <div style={{ fontSize: '0.75rem', color: '#557396', marginTop: '0.125rem' }}>
                    Permanent removal from CRM
                  </div>
                </div>
              </div>

              <p style={{ fontSize: '0.875rem', color: '#475569', lineHeight: 1.5, margin: 0 }}>
                Are you sure you want to permanently delete junk lead <strong>{leadToDeleteJunk.leadName}</strong> ({leadToDeleteJunk.id})? This action cannot be undone.
              </p>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => setLeadToDeleteJunk(null)}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleConfirmDeleteJunk}
                  style={{
                    padding: '0.5rem 1.375rem',
                    fontSize: '0.8125rem',
                    fontWeight: 700,
                    backgroundColor: '#DC2626',
                    color: '#FFFFFF',
                    border: 'none',
                    borderRadius: 'var(--radius)',
                    cursor: 'pointer'
                  }}
                >
                  Delete Permanently
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
