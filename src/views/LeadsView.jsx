import React, { useState, useEffect, useRef, useMemo } from 'react';
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
  LuRefreshCw,
  LuX,
  LuCheck,
  LuUserCheck,
  LuUpload,
  LuSlidersHorizontal,
  LuEllipsisVertical,
  LuPhone,
  LuRotateCcw,
  LuTrash2,
  LuEye,
  LuPencil,
  LuBriefcase,
  LuBuilding2
} from 'react-icons/lu';
import { LEAD_SOURCES, INITIAL_OWNERS, INITIAL_SALES_HEADS, INITIAL_SALES_EXECUTIVES } from '../data/mockData';
import { isDateInFilter } from '../utils/dateUtils';
import MultiSelectFilter from '../components/common/MultiSelectFilter';

const STATUS_OPTIONS = ['NEW LEADS', 'SITE REVISIT', 'QUALIFIED', 'DISCUSSION', 'PROPOSAL', 'NEGOTIATION'];
const SOURCE_OPTIONS = ['WHATSAPP', 'META', 'WEBSITE', 'INBOUND', 'REFERRAL', 'LINKEDIN', 'CAMPAIGN'];
const PROJECT_OPTIONS = ['All Projects', 'Farm Natura', 'Reliance Elysium', 'TechGy CRM Enterprise Suite', 'N/A'];

export default function LeadsView({
  leads = [],
  salesHeads = INITIAL_SALES_HEADS,
  salesExecutives = INITIAL_SALES_EXECUTIVES,
  currentUser = null,
  onUpdateLead,
  onTriggerToast,
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
  // Queue Tab State: 'unassigned' | 'assigned' | 'junk'
  const [activeQueueTab, setActiveQueueTab] = useState('unassigned');

  // Search & Filters
  const [localSearch, setLocalSearch] = useState('');
  const [selectedSources, setSelectedSources] = useState(propSourceFilter || initialFilterSource ? [propSourceFilter || initialFilterSource] : []);
  const [selectedStatuses, setSelectedStatuses] = useState([]);
  const [selectedProject, setSelectedProject] = useState('All Projects');
  const [selectedOwners, setSelectedOwners] = useState([]);
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

  // Current User Role Context
  const isSalesHeadUser = currentUser?.role === 'Sales Head' || currentUser?.role === 'head';
  const currentSalesHeadName = currentUser?.name || 'Rajesh Sharma';

  // Leads scoped to active user role
  const roleScopedLeads = useMemo(() => {
    if (isSalesHeadUser) {
      const teamExecNames = new Set(
        salesExecutives
          .filter(se => se.reportingSalesHead === currentSalesHeadName)
          .map(se => se.name)
      );
      return leads.filter(l => {
        if (l.salesHead && l.salesHead.toLowerCase() === currentSalesHeadName.toLowerCase()) return true;
        if (l.reportingSalesHead && l.reportingSalesHead.toLowerCase() === currentSalesHeadName.toLowerCase()) return true;
        if (l.leadOwner && l.leadOwner.toLowerCase() === currentSalesHeadName.toLowerCase()) return true;
        if (l.salesExecutive && teamExecNames.has(l.salesExecutive)) return true;
        if (l.assignedSalesExecutive && teamExecNames.has(l.assignedSalesExecutive)) return true;
        return false;
      });
    }
    return leads;
  }, [leads, isSalesHeadUser, currentSalesHeadName, salesExecutives]);

  // Sales Executives scoped to this Sales Head
  const availableExecutives = useMemo(() => {
    if (isSalesHeadUser) {
      const teamExecs = salesExecutives.filter(se => se.reportingSalesHead === currentSalesHeadName);
      return teamExecs.length > 0 ? teamExecs : salesExecutives;
    }
    return salesExecutives;
  }, [salesExecutives, isSalesHeadUser, currentSalesHeadName]);

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
        (lead.assignedSalesExecutive && lead.assignedSalesExecutive !== 'Unassigned' && lead.assignedSalesExecutive.trim() !== '')
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
  }, [roleScopedLeads, activeQueueTab, effectiveSearch, selectedProject, selectedSources, selectedStatuses, overdueOnly, selectedDateFilter]);

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
        onUpdateLead && onUpdateLead(id, {
          salesHead: headObj.name,
          reportingSalesHead: headObj.name
        });
      });
      onTriggerToast && onTriggerToast({
        title: 'Sales Head Assigned',
        description: `"${headObj.name}" assigned to ${assigningHeadBulkIds.length} leads.`,
        type: 'success'
      });
      setSelectedLeadIds([]);
    } else if (assigningHeadLead) {
      onUpdateLead && onUpdateLead(assigningHeadLead.id, {
        salesHead: headObj.name,
        reportingSalesHead: headObj.name
      });
      onTriggerToast && onTriggerToast({
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
        onUpdateLead && onUpdateLead(id, {
          salesExecutive: execObj.name,
          assignedSalesExecutive: execObj.name,
          leadOwner: execObj.name,
          salesHead: targetLead?.salesHead || currentSalesHeadName
        });
      });
      onTriggerToast && onTriggerToast({
        title: 'Leads Allocated & Assigned',
        description: `${assigningExecBulkIds.length} leads assigned to Sales Executive "${execObj.name}". Moved to Assigned queue.`,
        type: 'success'
      });
      setSelectedLeadIds([]);
    } else if (assigningExecLead) {
      onUpdateLead && onUpdateLead(assigningExecLead.id, {
        salesExecutive: execObj.name,
        assignedSalesExecutive: execObj.name,
        leadOwner: execObj.name,
        salesHead: assigningExecLead.salesHead || currentSalesHeadName
      });
      onTriggerToast && onTriggerToast({
        title: 'Lead Allocated & Assigned',
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
      onTriggerToast && onTriggerToast({
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
      onUpdateLead && onUpdateLead(lead.id, {
        salesExecutive: assignedExec.name,
        assignedSalesExecutive: assignedExec.name,
        leadOwner: assignedExec.name,
        salesHead: lead.salesHead || currentSalesHeadName
      });
    });

    onTriggerToast && onTriggerToast({
      title: 'Bulk Auto-Assign Complete',
      description: `Successfully distributed ${unassignedLeads.length} leads across ${execs.length} Sales Executives.`,
      type: 'success'
    });
    setIsAutoAssignModalOpen(false);
    setActiveQueueTab('assigned');
  };

  // Mark as Junk / Restore Handlers
  const handleMarkAsJunk = (lead, e) => {
    e?.stopPropagation();
    onUpdateLead && onUpdateLead(lead.id, {
      isJunk: true,
      status: 'JUNK',
      junkReason: 'Invalid Contact / Marked by User'
    });
    onTriggerToast && onTriggerToast({
      title: 'Moved to Junk',
      description: `Lead ${lead.id} moved to Manage Junks.`,
      type: 'info'
    });
    setActiveActionMenuId(null);
  };

  const handleRestoreLead = (lead, e) => {
    e?.stopPropagation();
    onUpdateLead && onUpdateLead(lead.id, {
      isJunk: false,
      status: 'NEW LEADS',
      junkReason: null
    });
    onTriggerToast && onTriggerToast({
      title: 'Lead Restored',
      description: `Lead ${lead.id} restored to active queue.`,
      type: 'success'
    });
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
      return { bg: '#ECFDF5', color: '#059669', border: '1px solid #A7F3D0' };
    }
    if (s.includes('LINKEDIN')) {
      return { bg: '#F0F9FF', color: '#0284C7', border: '1px solid #BAE6FD' };
    }
    return { bg: '#F1F5F9', color: '#475569', border: '1px solid #E2E8F0' };
  };

  // Status Badge Helper
  const getStatusBadgeStyle = (status = '') => {
    const s = status.toUpperCase();
    if (s.includes('SITE REVISIT')) {
      return { bg: '#E0F2FE', color: '#0284C7', border: '1px solid #BAE6FD' };
    }
    if (s.includes('NEW')) {
      return { bg: '#EEF2FF', color: '#0022FF', border: '1px solid #E0E7FF' };
    }
    if (s.includes('QUALIFIED')) {
      return { bg: '#ECFDF5', color: '#059669', border: '1px solid #A7F3D0' };
    }
    if (s.includes('DISCUSSION') || s.includes('PROPOSAL')) {
      return { bg: '#FFFBEB', color: '#D97706', border: '1px solid #FDE68A' };
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
            <span
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
          <h1 style={{ fontSize: '1.65rem', fontWeight: 800, color: '#0F1A34', margin: '0 0 0.25rem 0', letterSpacing: '-0.02em' }}>
            {activeQueueTab === 'junk' ? 'Manage Junks' : 'Lead Management Queue'}
          </h1>
          <p style={{ fontSize: '0.875rem', color: '#557396', margin: 0, fontWeight: 500 }}>
            {activeQueueTab === 'junk'
              ? 'Streamline and audit the junk lead restoration process'
              : 'Manage and track your sales pipeline efficiency'}
          </p>
        </div>

        {/* Top-Right CTA: Create New Lead */}
        <button
          type="button"
          className="btn-primary"
          onClick={() => onOpenCreateModal && onOpenCreateModal('createLead')}
          style={{
            padding: '0.6rem 1.35rem',
            fontSize: '0.875rem',
            fontWeight: 700,
            borderRadius: '9999px',
            boxShadow: '0 4px 14px rgba(0, 34, 255, 0.25)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.45rem'
          }}
        >
          <LuPlus size={16} />
          <span>Create New Lead</span>
        </button>
      </div>

      {/* SEARCH AND QUEUE TABS BAR */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>
        
        {/* Search Box */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.65rem',
            background: '#FFFFFF',
            border: '1px solid #E2E8F0',
            borderRadius: '9999px',
            padding: '0.55rem 1.15rem',
            width: '380px',
            maxWidth: '100%',
            boxShadow: '0 1px 4px rgba(15, 26, 52, 0.04)'
          }}
        >
          <LuSearch size={17} color="#557396" />
          <input
            type="text"
            placeholder={activeQueueTab === 'junk' ? 'Search by name, ID, or reason...' : 'Search by Lead ID, Name, or Phone Num'}
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
            style={{
              border: 'none',
              outline: 'none',
              background: 'transparent',
              fontSize: '0.85rem',
              color: '#0F1A34',
              fontWeight: 500,
              width: '100%'
            }}
          />
          {localSearch && (
            <button
              type="button"
              onClick={() => setLocalSearch('')}
              style={{ border: 'none', background: 'transparent', cursor: 'pointer', padding: 0, color: '#94A3B8' }}
            >
              <LuX size={15} />
            </button>
          )}
        </div>

        {/* 3-Tab Segmented Queue Switcher (Unassigned | Assigned | Junk) */}
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            background: '#F1F5F9',
            padding: '4px',
            borderRadius: '9999px',
            gap: '4px'
          }}
        >
          <button
            type="button"
            className={`toggle-btn ${activeQueueTab === 'unassigned' ? 'active' : ''}`}
            onClick={() => setActiveQueueTab('unassigned')}
            style={{
              padding: '0.45rem 1.35rem',
              fontSize: '0.825rem',
              fontWeight: 700,
              borderRadius: '9999px',
              border: 'none',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              background: activeQueueTab === 'unassigned' ? '#FFFFFF' : 'transparent',
              color: activeQueueTab === 'unassigned' ? '#0022FF' : '#556987',
              boxShadow: activeQueueTab === 'unassigned' ? '0 2px 8px rgba(0,0,0,0.08)' : 'none'
            }}
          >
            <span>Unassigned</span>
            {queueCounts.unassigned > 0 && (
              <span
                style={{
                  fontSize: '0.7rem',
                  padding: '0.1rem 0.45rem',
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

          <button
            type="button"
            className={`toggle-btn ${activeQueueTab === 'assigned' ? 'active' : ''}`}
            onClick={() => setActiveQueueTab('assigned')}
            style={{
              padding: '0.45rem 1.35rem',
              fontSize: '0.825rem',
              fontWeight: 700,
              borderRadius: '9999px',
              border: 'none',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              background: activeQueueTab === 'assigned' ? '#FFFFFF' : 'transparent',
              color: activeQueueTab === 'assigned' ? '#0022FF' : '#556987',
              boxShadow: activeQueueTab === 'assigned' ? '0 2px 8px rgba(0,0,0,0.08)' : 'none'
            }}
          >
            <span>Assigned</span>
            {queueCounts.assigned > 0 && (
              <span
                style={{
                  fontSize: '0.7rem',
                  padding: '0.1rem 0.45rem',
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
            className={`toggle-btn ${activeQueueTab === 'junk' ? 'active' : ''}`}
            onClick={() => setActiveQueueTab('junk')}
            style={{
              padding: '0.45rem 1.35rem',
              fontSize: '0.825rem',
              fontWeight: 700,
              borderRadius: '9999px',
              border: 'none',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              background: activeQueueTab === 'junk' ? '#FFFFFF' : 'transparent',
              color: activeQueueTab === 'junk' ? '#0022FF' : '#556987',
              boxShadow: activeQueueTab === 'junk' ? '0 2px 8px rgba(0,0,0,0.08)' : 'none'
            }}
          >
            <span>Junk</span>
            {queueCounts.junk > 0 && (
              <span
                style={{
                  fontSize: '0.7rem',
                  padding: '0.1rem 0.45rem',
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
              borderRadius: '12px',
              padding: '1.25rem',
              boxShadow: '0 4px 16px rgba(15, 26, 52, 0.05)',
              display: 'flex',
              flexWrap: 'wrap',
              gap: '1rem',
              alignItems: 'center',
              border: '1px solid #E2E8F0'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700, fontSize: '0.85rem', color: '#0F1A34' }}>
              <LuSlidersHorizontal size={16} /> Filters:
            </div>

            {/* Project Select */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <span style={{ fontSize: '0.8rem', color: '#557396', fontWeight: 600 }}>Project:</span>
              <select
                value={selectedProject}
                onChange={(e) => setSelectedProject(e.target.value)}
                style={{
                  padding: '0.35rem 0.75rem',
                  borderRadius: '9999px',
                  border: '1px solid #CBD5E1',
                  background: '#F8FAFC',
                  fontSize: '0.8rem',
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
              className="btn-secondary"
              onClick={() => {
                setSelectedSources([]);
                setSelectedStatuses([]);
                setSelectedProject('All Projects');
                setLocalSearch('');
                setOverdueOnly(false);
                if (onClearFilters) onClearFilters();
              }}
              style={{ fontSize: '0.75rem', padding: '0.35rem 0.75rem' }}
            >
              Reset Filters
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* MAIN QUEUE CARD & TABLE */}
      <div className="section-card" style={{ padding: 0, overflow: 'hidden', borderRadius: '14px', border: '1px solid #E2E8F0', boxShadow: '0 4px 18px rgba(15, 26, 52, 0.04)' }}>
        
        {/* Table Header Action Toolbar */}
        <div
          style={{
            padding: '1.15rem 1.5rem',
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
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <h2 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0F1A34', margin: 0 }}>
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
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', flexWrap: 'wrap' }}>
            
            {/* Filter Toggle Button */}
            <button
              type="button"
              className={`btn-secondary ${showFilterDrawer ? 'active' : ''}`}
              onClick={() => setShowFilterDrawer(!showFilterDrawer)}
              style={{
                padding: '0.45rem 1rem',
                fontSize: '0.8rem',
                fontWeight: 700,
                borderRadius: '9999px',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.45rem'
              }}
            >
              <LuSlidersHorizontal size={14} />
              <span>Filter</span>
            </button>

            {/* Bulk Import Button */}
            <button
              type="button"
              className="btn-secondary"
              onClick={() => setIsImportModalOpen(true)}
              style={{
                padding: '0.45rem 1.15rem',
                fontSize: '0.8rem',
                fontWeight: 700,
                borderRadius: '9999px',
                background: '#0F1A34',
                color: '#FFFFFF',
                borderColor: '#0F1A34',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.45rem'
              }}
            >
              <LuUpload size={14} />
              <span>Bulk Import</span>
            </button>

            {/* Bulk Auto-Assign Button (Visible in Unassigned queue) */}
            {activeQueueTab === 'unassigned' && (
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
                  padding: '0.45rem 1.15rem',
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  borderRadius: '9999px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.45rem'
                }}
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
                  <th style={{ padding: '0.85rem 1.25rem', width: '40px' }}>
                    <input
                      type="checkbox"
                      ref={selectAllRef}
                      checked={isAllSelected}
                      onChange={handleSelectAll}
                      style={{ cursor: 'pointer', accentColor: '#0022FF', width: '16px', height: '16px' }}
                    />
                  </th>
                )}
                <th style={{ padding: '0.85rem 1rem', fontSize: '0.72rem', fontWeight: 800, color: '#557396', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  LEAD ID
                </th>
                <th style={{ padding: '0.85rem 1rem', fontSize: '0.72rem', fontWeight: 800, color: '#557396', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  CUSTOMER NAME
                </th>
                <th style={{ padding: '0.85rem 1rem', fontSize: '0.72rem', fontWeight: 800, color: '#557396', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  CONTACT DETAILS
                </th>
                {activeQueueTab !== 'junk' && (
                  <>
                    <th style={{ padding: '0.85rem 1rem', fontSize: '0.72rem', fontWeight: 800, color: '#557396', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                      DOB
                    </th>
                    <th style={{ padding: '0.85rem 1rem', fontSize: '0.72rem', fontWeight: 800, color: '#557396', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                      INCOME
                    </th>
                    <th style={{ padding: '0.85rem 1rem', fontSize: '0.72rem', fontWeight: 800, color: '#557396', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                      CREATION DATE
                    </th>
                  </>
                )}
                <th style={{ padding: '0.85rem 1rem', fontSize: '0.72rem', fontWeight: 800, color: '#557396', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  SOURCE
                </th>
                <th style={{ padding: '0.85rem 1rem', fontSize: '0.72rem', fontWeight: 800, color: '#557396', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  PROJECT
                </th>
                {activeQueueTab !== 'junk' && (
                  <th style={{ padding: '0.85rem 1rem', fontSize: '0.72rem', fontWeight: 800, color: '#557396', textTransform: 'uppercase', letterSpacing: '0.04em', textAlign: 'center' }}>
                    ENQUIRIES
                  </th>
                )}
                <th style={{ padding: '0.85rem 1rem', fontSize: '0.72rem', fontWeight: 800, color: '#557396', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  STATUS
                </th>
                {/* Assigned Sales Head Column (Only visible to Sales Admin) */}
                {!isSalesHeadUser && (
                  <th style={{ padding: '0.85rem 1rem', fontSize: '0.72rem', fontWeight: 800, color: '#557396', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    {activeQueueTab === 'junk' ? 'ASSIGNED RM' : 'ASSIGNED SALES HEAD'}
                  </th>
                )}
                {activeQueueTab === 'junk' ? (
                  <>
                    <th style={{ padding: '0.85rem 1rem', fontSize: '0.72rem', fontWeight: 800, color: '#557396', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                      EM NAME
                    </th>
                    <th style={{ padding: '0.85rem 1rem', fontSize: '0.72rem', fontWeight: 800, color: '#557396', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                      JUNK REASON
                    </th>
                    <th style={{ padding: '0.85rem 1.25rem', fontSize: '0.72rem', fontWeight: 800, color: '#557396', textTransform: 'uppercase', letterSpacing: '0.04em', textAlign: 'right' }}>
                      ACTIONS
                    </th>
                  </>
                ) : (
                  <>
                    <th style={{ padding: '0.85rem 1rem', fontSize: '0.72rem', fontWeight: 800, color: '#557396', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                      ASSIGNED SALES EXECUTIVE
                    </th>
                    {activeQueueTab === 'assigned' && (
                      <th style={{ padding: '0.85rem 1.25rem', fontSize: '0.72rem', fontWeight: 800, color: '#557396', textTransform: 'uppercase', letterSpacing: '0.04em', textAlign: 'right' }}>
                        ACTIONS
                      </th>
                    )}
                  </>
                )}
              </tr>
            </thead>
            <tbody>
              {displayedLeads.length === 0 ? (
                <tr>
                  <td colSpan={13} style={{ padding: '4rem 2rem', textAlign: 'center' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '0.75rem' }}>
                      <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: '#F1F5F9', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94A3B8' }}>
                        <LuSearch size={22} />
                      </div>
                      <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#0F1A34' }}>
                        No records found.
                      </div>
                      <div style={{ fontSize: '0.8rem', color: '#557396' }}>
                        {activeQueueTab === 'junk'
                          ? 'There are no active junk leads in the audit log.'
                          : 'No leads currently match your active filters or search parameters.'}
                      </div>
                    </div>
                  </td>
                </tr>
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
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={(e) => handleToggleLead(lead.id, e)}
                            style={{ cursor: 'pointer', accentColor: '#0022FF', width: '16px', height: '16px' }}
                          />
                        </td>
                      )}

                      {/* Lead ID */}
                      <td style={{ padding: '1rem', fontSize: '0.825rem', fontWeight: 700, color: '#0022FF', whiteSpace: 'nowrap' }}>
                        {lead.id}
                      </td>

                      {/* Customer Name */}
                      <td style={{ padding: '1rem' }}>
                        <div
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
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.15rem' }}>
                          <span style={{ fontSize: '0.825rem', fontWeight: 800, color: '#0F1A34', whiteSpace: 'nowrap' }}>
                            {lead.phone || lead.phoneNumber || '--'}
                          </span>
                          <span style={{ fontSize: '0.725rem', color: '#64748B', whiteSpace: 'nowrap' }}>
                            {lead.email || lead.emailId || '--'}
                          </span>
                        </div>
                      </td>

                      {/* DOB */}
                      {activeQueueTab !== 'junk' && (
                        <td style={{ padding: '1rem', fontSize: '0.8rem', color: '#475569', whiteSpace: 'nowrap' }}>
                          {lead.dob || '--'}
                        </td>
                      )}

                      {/* Income */}
                      {activeQueueTab !== 'junk' && (
                        <td style={{ padding: '1rem', fontSize: '0.8rem', color: '#475569', whiteSpace: 'nowrap' }}>
                          {lead.income || '--'}
                        </td>
                      )}

                      {/* Creation Date */}
                      {activeQueueTab !== 'junk' && (
                        <td style={{ padding: '1rem', fontSize: '0.8rem', color: '#475569', whiteSpace: 'nowrap' }}>
                          {lead.creationDate || lead.createdDate || '--'}
                        </td>
                      )}

                      {/* Source */}
                      <td style={{ padding: '1rem' }}>
                        <span
                          style={{
                            display: 'inline-block',
                            padding: '0.2rem 0.65rem',
                            borderRadius: '9999px',
                            fontSize: '0.7rem',
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
                      <td style={{ padding: '1rem', fontSize: '0.8rem', color: '#475569', whiteSpace: 'nowrap' }}>
                        {lead.project || 'N/A'}
                      </td>

                      {/* Enquiries */}
                      {activeQueueTab !== 'junk' && (
                        <td style={{ padding: '1rem', textAlign: 'center' }}>
                          <span
                            onClick={() => onSelectLead && onSelectLead(lead)}
                            style={{
                              fontSize: '0.85rem',
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
                            fontSize: '0.72rem',
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
                      {!isSalesHeadUser && (
                        <td style={{ padding: '1rem' }}>
                          {lead.salesHead ? (
                            <div
                              onClick={(e) => handleOpenAssignHeadModal(lead, e)}
                              style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '0.45rem',
                                background: '#0F1A34',
                                color: '#FFFFFF',
                                padding: '0.25rem 0.65rem',
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
                              className="btn-secondary"
                              onClick={(e) => handleOpenAssignHeadModal(lead, e)}
                              style={{
                                padding: '0.3rem 0.75rem',
                                fontSize: '0.75rem',
                                fontWeight: 700,
                                borderRadius: '9999px',
                                color: '#0022FF',
                                borderColor: '#D5E2EE',
                                whiteSpace: 'nowrap'
                              }}
                            >
                              <LuUserPlus size={13} />
                              <span>Assign Sales Head</span>
                            </button>
                          )}
                        </td>
                      )}

                      {/* Assigned Sales Executive / CTA */}
                      {activeQueueTab === 'junk' ? (
                        <>
                          {/* EM Name */}
                          <td style={{ padding: '1rem', fontSize: '0.8rem', color: '#475569', whiteSpace: 'nowrap' }}>
                            {lead.salesExecutive || '--'}
                          </td>

                          {/* Junk Reason */}
                          <td style={{ padding: '1rem', fontSize: '0.8rem', color: '#DC2626', fontWeight: 600 }}>
                            {lead.junkReason || 'Marked as Junk'}
                          </td>

                          {/* Restore CTA */}
                          <td style={{ padding: '1rem 1.25rem', textAlign: 'right' }}>
                            <button
                              type="button"
                              className="btn-secondary"
                              onClick={(e) => handleRestoreLead(lead, e)}
                              style={{
                                padding: '0.35rem 0.85rem',
                                fontSize: '0.75rem',
                                fontWeight: 700,
                                borderRadius: '9999px',
                                color: '#059669',
                                borderColor: '#A7F3D0',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '0.35rem'
                              }}
                            >
                              <LuRotateCcw size={13} />
                              <span>Restore Lead</span>
                            </button>
                          </td>
                        </>
                      ) : (
                        <>
                          <td style={{ padding: '1rem' }}>
                            {lead.salesExecutive && lead.salesExecutive !== 'Unassigned' ? (
                              <div
                                onClick={(e) => handleOpenAssignExecModal(lead, e)}
                                style={{
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: '0.45rem',
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
                                className="btn-primary"
                                onClick={(e) => handleOpenAssignExecModal(lead, e)}
                                style={{
                                  padding: '0.4rem 0.95rem',
                                  fontSize: '0.775rem',
                                  fontWeight: 700,
                                  borderRadius: '9999px',
                                  background: '#0022FF',
                                  color: '#FFFFFF',
                                  border: 'none',
                                  cursor: 'pointer',
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: '0.4rem',
                                  whiteSpace: 'nowrap',
                                  boxShadow: '0 2px 8px rgba(0, 34, 255, 0.25)'
                                }}
                              >
                                <LuUserPlus size={13} />
                                <span>Assign Sales Executive</span>
                              </button>
                            )}
                          </td>

                          {/* Actions Column (Assigned queue) */}
                          {activeQueueTab === 'assigned' && (
                            <td style={{ padding: '1rem 1.25rem', textAlign: 'right' }}>
                              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '0.5rem', position: 'relative' }}>
                                <button
                                  type="button"
                                  className="btn-secondary"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    onSelectLead && onSelectLead(lead);
                                  }}
                                  style={{
                                    padding: '0.3rem 0.75rem',
                                    fontSize: '0.725rem',
                                    fontWeight: 700,
                                    borderRadius: '9999px',
                                    color: '#0F1A34',
                                    borderColor: '#E2E8F0'
                                  }}
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
                                      borderRadius: '10px',
                                      boxShadow: '0 6px 20px rgba(15, 26, 52, 0.12)',
                                      border: '1px solid #E2E8F0',
                                      padding: '0.35rem',
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
                                        onSelectLead && onSelectLead(lead);
                                        setActiveActionMenuId(null);
                                      }}
                                      style={{
                                        border: 'none',
                                        background: 'transparent',
                                        padding: '0.45rem 0.75rem',
                                        fontSize: '0.775rem',
                                        fontWeight: 600,
                                        color: '#0F1A34',
                                        textAlign: 'left',
                                        borderRadius: '6px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.45rem',
                                        cursor: 'pointer'
                                      }}
                                      onMouseEnter={(e) => e.currentTarget.style.background = '#F8FAFC'}
                                      onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                                    >
                                      <LuEye size={14} /> View Details
                                    </button>

                                    <button
                                      type="button"
                                      onClick={() => {
                                        handleOpenAssignExecModal(lead);
                                        setActiveActionMenuId(null);
                                      }}
                                      style={{
                                        border: 'none',
                                        background: 'transparent',
                                        padding: '0.45rem 0.75rem',
                                        fontSize: '0.775rem',
                                        fontWeight: 600,
                                        color: '#0022FF',
                                        textAlign: 'left',
                                        borderRadius: '6px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.45rem',
                                        cursor: 'pointer'
                                      }}
                                      onMouseEnter={(e) => e.currentTarget.style.background = '#F8FAFC'}
                                      onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                                    >
                                      <LuUserPlus size={14} /> Reassign Exec
                                    </button>

                                    <button
                                      type="button"
                                      onClick={(e) => handleMarkAsJunk(lead, e)}
                                      style={{
                                        border: 'none',
                                        background: 'transparent',
                                        padding: '0.45rem 0.75rem',
                                        fontSize: '0.775rem',
                                        fontWeight: 600,
                                        color: '#DC2626',
                                        textAlign: 'left',
                                        borderRadius: '6px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.45rem',
                                        cursor: 'pointer'
                                      }}
                                      onMouseEnter={(e) => e.currentTarget.style.background = '#FEF2F2'}
                                      onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                                    >
                                      <LuTrash2 size={14} /> Move to Junk
                                    </button>
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
          <div style={{ fontSize: '0.8rem', color: '#557396', fontWeight: 600 }}>
            Showing <strong style={{ color: '#0F1A34' }}>{totalLeads > 0 ? startIndex + 1 : 0}</strong> - <strong style={{ color: '#0F1A34' }}>{Math.min(startIndex + PAGE_SIZE, totalLeads)}</strong> of <strong style={{ color: '#0F1A34' }}>{totalLeads}</strong> Records
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <button
              type="button"
              className="btn-secondary"
              disabled={currentPageSafe <= 1}
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              style={{
                padding: '0.35rem 0.85rem',
                fontSize: '0.775rem',
                fontWeight: 700,
                borderRadius: '9999px',
                opacity: currentPageSafe <= 1 ? 0.45 : 1,
                cursor: currentPageSafe <= 1 ? 'not-allowed' : 'pointer'
              }}
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
                  borderRadius: '8px',
                  border: 'none',
                  fontSize: '0.8rem',
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
              className="btn-secondary"
              disabled={currentPageSafe >= totalPages}
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              style={{
                padding: '0.35rem 0.85rem',
                fontSize: '0.775rem',
                fontWeight: 700,
                borderRadius: '9999px',
                opacity: currentPageSafe >= totalPages ? 0.45 : 1,
                cursor: currentPageSafe >= totalPages ? 'not-allowed' : 'pointer'
              }}
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
            <motion.div
              className="modal-card"
              initial={{ scale: 0.94, opacity: 0, y: 15 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.94, opacity: 0, y: 15 }}
              onClick={(e) => e.stopPropagation()}
              style={{
                background: '#FFFFFF',
                borderRadius: '16px',
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
                  <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0F1A34', margin: 0 }}>
                    Assign Sales Head
                  </h3>
                  <div style={{ fontSize: '0.775rem', color: '#557396', marginTop: '0.2rem' }}>
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
                  style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: '#94A3B8', padding: '4px' }}
                >
                  <LuX size={18} />
                </button>
              </div>

              <div style={{ padding: '1.25rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem', overflowY: 'auto' }}>
                <div style={{ position: 'relative' }}>
                  <LuSearch size={16} color="#557396" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                  <input
                    type="text"
                    placeholder="Search sales heads by name, role, email..."
                    value={headSearch}
                    onChange={(e) => setHeadSearch(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.55rem 0.85rem 0.55rem 2.25rem',
                      borderRadius: '8px',
                      border: '1px solid #CBD5E1',
                      fontSize: '0.85rem',
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
                        <div
                          key={sh.id}
                          onClick={() => setSelectedHeadId(sh.id)}
                          style={{
                            padding: '0.75rem 1rem',
                            borderRadius: '10px',
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
                                fontSize: '0.85rem'
                              }}
                            >
                              {(sh.name || 'SH').slice(0, 2).toUpperCase()}
                            </div>
                            <div>
                              <div style={{ fontSize: '0.875rem', fontWeight: 800, color: '#0F1A34' }}>
                                {sh.name}
                              </div>
                              <div style={{ fontSize: '0.725rem', color: '#557396' }}>
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
                  style={{ padding: '0.5rem 1.15rem', fontSize: '0.825rem' }}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn-primary"
                  onClick={handleConfirmAssignHead}
                  style={{ padding: '0.5rem 1.35rem', fontSize: '0.825rem', fontWeight: 700 }}
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
            <motion.div
              className="modal-card"
              initial={{ scale: 0.94, opacity: 0, y: 15 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.94, opacity: 0, y: 15 }}
              onClick={(e) => e.stopPropagation()}
              style={{
                background: '#FFFFFF',
                borderRadius: '16px',
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
                  <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0F1A34', margin: 0 }}>
                    Assign Sales Executive
                  </h3>
                  <div style={{ fontSize: '0.775rem', color: '#557396', marginTop: '0.2rem' }}>
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
                  style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: '#94A3B8', padding: '4px' }}
                >
                  <LuX size={18} />
                </button>
              </div>

              <div style={{ padding: '1.25rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem', overflowY: 'auto' }}>
                {/* Lead Summary Info Badge */}
                {assigningExecLead && (
                  <div style={{ padding: '0.75rem 1rem', borderRadius: '10px', background: '#F8FAFC', border: '1px solid #EDF2F7', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div>
                      <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#0F1A34' }}>
                        {assigningExecLead.leadName} ({assigningExecLead.id})
                      </div>
                      <div style={{ fontSize: '0.75rem', color: '#557396' }}>
                        {assigningExecLead.company} • {assigningExecLead.project || 'General Inquiry'}
                      </div>
                    </div>
                    <span style={{ fontSize: '0.75rem', fontWeight: 800, padding: '0.2rem 0.55rem', borderRadius: '9999px', background: '#E0F2FE', color: '#0369A1' }}>
                      {assigningExecLead.leadSource || 'WHATSAPP'}
                    </span>
                  </div>
                )}

                {/* Search Executive input */}
                <div style={{ position: 'relative' }}>
                  <LuSearch size={16} color="#557396" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                  <input
                    type="text"
                    placeholder="Search sales executives by name, email, project..."
                    value={execSearch}
                    onChange={(e) => setExecSearch(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.55rem 0.85rem 0.55rem 2.25rem',
                      borderRadius: '8px',
                      border: '1px solid #CBD5E1',
                      fontSize: '0.85rem',
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
                        <div
                          key={se.id}
                          onClick={() => setSelectedExecId(se.id)}
                          style={{
                            padding: '0.75rem 1rem',
                            borderRadius: '10px',
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
                                fontSize: '0.85rem'
                              }}
                            >
                              {(se.initials || se.name.slice(0, 2)).toUpperCase()}
                            </div>
                            <div>
                              <div style={{ fontSize: '0.875rem', fontWeight: 800, color: '#0F1A34' }}>
                                {se.name}
                              </div>
                              <div style={{ fontSize: '0.725rem', color: '#557396' }}>
                                {se.role || 'Sales Executive'} • {se.email || 'exec@techgy.com'}
                              </div>
                            </div>
                          </div>

                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                            <span style={{ fontSize: '0.72rem', color: '#557396', fontWeight: 600 }}>
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
                  style={{ padding: '0.5rem 1.15rem', fontSize: '0.825rem' }}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn-primary"
                  onClick={handleConfirmAssignExec}
                  style={{ padding: '0.5rem 1.35rem', fontSize: '0.825rem', fontWeight: 700 }}
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
            <motion.div
              className="modal-card"
              initial={{ scale: 0.94, opacity: 0, y: 15 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.94, opacity: 0, y: 15 }}
              onClick={(e) => e.stopPropagation()}
              style={{
                background: '#FFFFFF',
                borderRadius: '16px',
                width: '480px',
                maxWidth: '100%',
                padding: '1.75rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '1.25rem',
                boxShadow: '0 20px 50px rgba(15, 26, 52, 0.2)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                <div style={{ width: '44px', height: '44px', borderRadius: '50%', background: '#EBF0FF', color: '#0022FF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <LuUserCheck size={22} />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0F1A34', margin: 0 }}>
                    Bulk Auto-Assign Leads
                  </h3>
                  <div style={{ fontSize: '0.775rem', color: '#557396', marginTop: '0.15rem' }}>
                    Distribute unassigned queue round-robin
                  </div>
                </div>
              </div>

              <p style={{ fontSize: '0.85rem', color: '#475569', lineHeight: 1.5, margin: 0 }}>
                This will automatically distribute all <strong>{queueCounts.unassigned} unassigned leads</strong> evenly among active <strong>Sales Executives</strong> based on current capacity and load.
              </p>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => setIsAutoAssignModalOpen(false)}
                  style={{ padding: '0.5rem 1.15rem', fontSize: '0.825rem' }}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn-primary"
                  onClick={handleExecuteAutoAssign}
                  style={{ padding: '0.5rem 1.35rem', fontSize: '0.825rem', fontWeight: 700 }}
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
            <motion.div
              className="modal-card"
              initial={{ scale: 0.94, opacity: 0, y: 15 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.94, opacity: 0, y: 15 }}
              onClick={(e) => e.stopPropagation()}
              style={{
                background: '#FFFFFF',
                borderRadius: '16px',
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
                    <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0F1A34', margin: 0 }}>
                      Bulk Import Leads
                    </h3>
                    <div style={{ fontSize: '0.775rem', color: '#557396', marginTop: '0.15rem' }}>
                      Upload CSV, XLSX, or TSV lead roster
                    </div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setIsImportModalOpen(false)}
                  style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: '#94A3B8' }}
                >
                  <LuX size={18} />
                </button>
              </div>

              {/* Drag & Drop Box */}
              <div
                style={{
                  border: '2px dashed #CBD5E1',
                  borderRadius: '12px',
                  padding: '2rem 1.5rem',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.65rem',
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
                  style={{ padding: '0.5rem 1.15rem', fontSize: '0.825rem' }}
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
                      onTriggerToast && onTriggerToast({
                        title: 'Import Successful',
                        description: '12 new leads imported into the Unassigned queue.',
                        type: 'success'
                      });
                    }, 600);
                  }}
                  style={{
                    padding: '0.5rem 1.35rem',
                    fontSize: '0.825rem',
                    fontWeight: 700,
                    opacity: !importFile ? 0.5 : 1
                  }}
                >
                  {isImporting ? 'Processing File...' : 'Import to Unassigned Queue'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}