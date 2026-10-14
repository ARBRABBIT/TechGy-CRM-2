import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LuUsers,
  LuChevronDown,
  LuPhone,
  LuSearch,
  LuX,
  LuPencil,
  LuUserPlus,
  LuPhoneCall,
  LuPhoneMissed,
  LuCircleCheck,
  LuArrowLeft
} from 'react-icons/lu';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer
} from 'recharts';
import {
  SALES_HEAD_PROJECTS,
  INITIAL_SALES_HEADS,
  INITIAL_SALES_EXECUTIVES,
  SALES_HEAD_PERFORMERS,
  SALES_HEAD_CALLS_SUMMARY,
  SALES_HEAD_LEAD_STATUSES,
  SALES_HEAD_QUALITY_DISTRIBUTION,
  SALES_HEAD_ESCALATIONS,
  SALES_HEAD_STALE_LEADS,
  SALES_HEAD_OBJECTIONS,
  SALES_HEAD_BOOKINGS
} from '../data/mockData';
import { ACTION, can } from '../utils/permissions';
import { isEmail, isPhone } from '../utils/validation';
import { EmptyState } from '../components/common/StateViews';

export default function SalesHeadView({
  salesHeads = INITIAL_SALES_HEADS,
  salesExecutives = INITIAL_SALES_EXECUTIVES,
  onUpdateSalesExecutives,
  onTriggerToast,
  onNavigateToLead: _onNavigateToLead,
  currentUser
}) {
  // Team registry management (create / edit people) is admin-only
  const isAdmin = can(currentUser, ACTION.TEAM_MANAGE);

  // Current tab: 'dashboard' | 'registry'
  const [currentTab, setCurrentTab] = useState('dashboard');

  // Filter States
  const [selectedManager, setSelectedManager] = useState('All Sales Heads');
  const [selectedSolution, setSelectedSolution] = useState('All Solutions');
  const [selectedTimeframe, setSelectedTimeframe] = useState('All Time');

  // Registry Search & Sort States
  const [registrySearch, setRegistrySearch] = useState('');
  const [sortField, setSortField] = useState('creationDate');
  const [sortOrder, setSortOrder] = useState('desc');

  // Modals / Drawers States
  const [isCreateDrawerOpen, setIsCreateDrawerOpen] = useState(false);
  const [isLeadStatusesModalOpen, setIsLeadStatusesModalOpen] = useState(false);
  const [isLeaderboardModalOpen, setIsLeaderboardModalOpen] = useState(false);
  const [isEscalationsModalOpen, setIsEscalationsModalOpen] = useState(false);
  const [isStaleLeadsModalOpen, setIsStaleLeadsModalOpen] = useState(false);
  const [isBookingsModalOpen, setIsBookingsModalOpen] = useState(false);
  const [assignedModalData, setAssignedModalData] = useState(null);
  const [editingExecutive, setEditingExecutive] = useState(null);

  // Status Search inside Statuses Modal
  const [statusSearchQuery, setStatusSearchQuery] = useState('');

  // Form State for Editing/Creating Sales Executive
  const [formFirstName, setFormFirstName] = useState('');
  const [formLastName, setFormLastName] = useState('');
  const [formRole, setFormRole] = useState('Enterprise Sales Executive');
  const [formEmail, setFormEmail] = useState('');
  const [formPhone, setFormPhone] = useState('');
  const [formProject, setFormProject] = useState('TechGy CRM Enterprise Suite');
  const [formReportingHead, setFormReportingHead] = useState(salesHeads[0]?.name || 'Rajesh Sharma');
  const [formErrors, setFormErrors] = useState({});

  const resetForm = () => {
    setFormFirstName('');
    setFormLastName('');
    setFormRole('Enterprise Sales Executive');
    setFormEmail('');
    setFormPhone('');
    setFormProject('TechGy CRM Enterprise Suite');
    setFormReportingHead(salesHeads[0]?.name || 'Rajesh Sharma');
    setFormErrors({});
    setEditingExecutive(null);
  };

  const handleOpenCreateModal = () => {
    resetForm();
    setIsCreateDrawerOpen(true);
  };

  const handleOpenEditModal = (exec) => {
    setEditingExecutive(exec);
    setFormFirstName(exec.firstName || exec.name.split(' ')[0] || '');
    setFormLastName(exec.lastName || exec.name.split(' ').slice(1).join(' ') || '');
    setFormRole(exec.role || 'Enterprise Sales Executive');
    setFormEmail(exec.email || '');
    setFormPhone(exec.phone || '');
    setFormProject(exec.project || 'TechGy CRM Enterprise Suite');
    setFormReportingHead(exec.reportingSalesHead || (salesHeads[0]?.name || 'Rajesh Sharma'));
    setFormErrors({});
    setIsCreateDrawerOpen(true);
  };

  // Form Submission
  const handleSubmitForm = (e) => {
    if (e) e.preventDefault();
    const errors = {};
    if (!formFirstName.trim()) errors.firstName = 'First name is required';
    if (!formLastName.trim()) errors.lastName = 'Last name is required';
    if (!formEmail.trim()) {
      errors.email = 'Corporate email is required';
    } else if (!isEmail(formEmail)) {
      errors.email = 'Please enter a valid email address';
    } else if (salesExecutives.some(x => (x.email || '').toLowerCase() === formEmail.trim().toLowerCase() && x.id !== editingExecutive?.id)) {
      errors.email = 'This email is already registered to another executive';
    }
    if (!formPhone.trim()) {
      errors.phone = 'Contact number is required';
    } else if (!isPhone(formPhone) || formPhone.replace(/\D/g, '').length < 10) {
      errors.phone = 'Enter a valid 10-digit contact number';
    }

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    const fullName = `${formFirstName.trim()} ${formLastName.trim()}`;
    const initials = `${formFirstName.trim()[0] || ''}${formLastName.trim()[0] || ''}`.toUpperCase();

    if (editingExecutive) {
      const updated = salesExecutives.map(item => {
        if (item.id === editingExecutive.id) {
          return {
            ...item,
            firstName: formFirstName.trim(),
            lastName: formLastName.trim(),
            name: fullName,
            role: formRole.trim(),
            initials: initials || item.initials,
            email: formEmail.trim(),
            phone: formPhone.trim().replace(/\D/g, ''),
            formattedPhone: formPhone.trim().startsWith('+') ? formPhone.trim() : `+91 ${formPhone.trim()}`,
            project: formProject,
            reportingSalesHead: formReportingHead
          };
        }
        return item;
      });
      if (onUpdateSalesExecutives) onUpdateSalesExecutives(updated);
      if (onTriggerToast) onTriggerToast(`Sales Executive "${fullName}" updated successfully!`);
    } else {
      const newExec = {
        id: `EXEC-${Date.now()}`,
        firstName: formFirstName.trim(),
        lastName: formLastName.trim(),
        name: fullName,
        role: formRole.trim(),
        initials: initials || 'SE',
        email: formEmail.trim(),
        phone: formPhone.trim().replace(/\D/g, ''),
        formattedPhone: formPhone.trim().startsWith('+') ? formPhone.trim() : `+91 ${formPhone.trim()}`,
        project: formProject,
        creationDate: new Date().toISOString().split('T')[0],
        reportingSalesHead: formReportingHead,
        assignedLeadsCount: 0,
        assignedLeads: [],
        avatarBg: '#E0F2FE',
        avatarColor: '#0369A1'
      };
      const updated = [newExec, ...salesExecutives];
      if (onUpdateSalesExecutives) onUpdateSalesExecutives(updated);
      if (onTriggerToast) onTriggerToast(`Sales Executive "${fullName}" created successfully!`);
    }

    setIsCreateDrawerOpen(false);
    resetForm();
  };

  // Filtered Registry List for Sales Executives
  const filteredSalesExecutives = useMemo(() => {
    return salesExecutives.filter(exec => {
      const q = registrySearch.toLowerCase().trim();
      if (!q) return true;
      return (
        exec.name.toLowerCase().includes(q) ||
        (exec.role && exec.role.toLowerCase().includes(q)) ||
        exec.email.toLowerCase().includes(q) ||
        exec.phone.includes(q) ||
        exec.project.toLowerCase().includes(q) ||
        (exec.reportingSalesHead && exec.reportingSalesHead.toLowerCase().includes(q))
      );
    }).sort((a, b) => {
      if (sortField === 'name') {
        return sortOrder === 'asc'
          ? a.name.localeCompare(b.name)
          : b.name.localeCompare(a.name);
      }
      if (sortField === 'creationDate') {
        return sortOrder === 'asc'
          ? a.creationDate.localeCompare(b.creationDate)
          : b.creationDate.localeCompare(a.creationDate);
      }
      return 0;
    });
  }, [salesExecutives, registrySearch, sortField, sortOrder]);

  // Lead Statuses filtered by modal search
  const filteredLeadStatuses = useMemo(() => {
    if (!statusSearchQuery.trim()) return SALES_HEAD_LEAD_STATUSES;
    return SALES_HEAD_LEAD_STATUSES.filter(s =>
      s.name.toLowerCase().includes(statusSearchQuery.toLowerCase().trim())
    );
  }, [statusSearchQuery]);

  return (
    <div className="sales-head-view">
      
      {/* ======================================================== */}
      {/* TOP COMPACT TOOLBAR (Seamless integration with Header)   */}
      {/* ======================================================== */}
      <div className="sh-toolbar-card">
        
        {/* Left: Heading or Back Button */}
        {currentTab === 'dashboard' ? (
          <h2 className="sh-toolbar-heading">Overview Dashboard</h2>
        ) : (
          <button
            type="button"
            className="btn-secondary"
            style={{ display: 'inline-flex', alignItems: 'center' }}
            onClick={() => setCurrentTab('dashboard')}
          >
            <LuArrowLeft size={16} /> Overview Dashboard
          </button>
        )}

        {/* Right: Action or Filter Controls */}
        {currentTab === 'dashboard' ? (
          <div className="sh-filters-wrap">
            {/* Manager Filter (Admin Only) */}
            {isAdmin && (
              <div className="sh-select-wrap">
                <select aria-label="Filter by sales head"
                  className="sh-select-pill"
                  value={selectedManager}
                  onChange={(e) => setSelectedManager(e.target.value)}
                  title="Filter by Sales Head"
                >
                  <option value="All Sales Heads">All Sales Heads</option>
                  {salesHeads.map(sh => (
                    <option key={sh.id} value={sh.name}>{sh.name}</option>
                  ))}
                </select>
                <LuChevronDown size={14} className="sh-select-arrow" />
              </div>
            )}

            {/* Solution Filter */}
            <div className="sh-select-wrap">
              <select aria-label="Filter by solution"
                className="sh-select-pill sh-select-pill-solution"
                value={selectedSolution}
                onChange={(e) => setSelectedSolution(e.target.value)}
                title="Filter by Solution"
              >
                {SALES_HEAD_PROJECTS.map(proj => (
                  <option key={proj} value={proj}>{proj}</option>
                ))}
              </select>
              <LuChevronDown size={14} className="sh-select-arrow" />
            </div>

            {/* Timeframe Filter */}
            <div className="sh-select-wrap">
              <select aria-label="Filter by timeframe"
                className="sh-select-pill"
                value={selectedTimeframe}
                onChange={(e) => setSelectedTimeframe(e.target.value)}
                title="Filter by Period"
              >
                <option value="All Time">All Time</option>
                <option value="This Month">This Month</option>
                <option value="This Quarter">This Quarter</option>
                <option value="FY26">FY26</option>
              </select>
              <LuChevronDown size={14} className="sh-select-arrow" />
            </div>

            {/* Quick Switch to Registry CTA */}
            <button
              type="button"
              className="btn-primary"
              onClick={() => setCurrentTab('registry')}
            >
              <LuUsers size={14} />
              <span>View Registry</span>
            </button>
          </div>
        ) : (
          <div className="sh-filters-wrap">
            {/* Search Input for Registry */}
            <div className="search-box" style={{ width: '280px' }}>
              <LuSearch className="search-icon" />
              <input aria-label="Search sales executives"
                type="text"
                className="search-input"
                placeholder="Search sales executives..."
                value={registrySearch}
                onChange={(e) => setRegistrySearch(e.target.value)}
              />
            </div>
          </div>
        )}
      </div>

      {currentTab === 'dashboard' ? (
        /* ======================================================== */
        /* SUB-VIEW 1: SALES HEAD METRICS DASHBOARD                 */
        /* ======================================================== */
        <>
          {/* ROW 1: Top Performer Leaderboard & Team Calls Summary */}
          <div className="sh-grid-top">
            
            {/* Card 1: Top Performer Leaderboard */}
            <div className="section-card" style={{ marginBottom: 0, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div className="section-header" style={{ marginBottom: '1rem' }}>
                  <div>
                    <h3 className="section-title">Top Performer Leaderboard</h3>
                    <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#557396', textTransform: 'uppercase', letterSpacing: '0.04em', marginTop: '0.125rem' }}>
                      Sales Executives — Performance Rank
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsLeaderboardModalOpen(true)}
                    className="btn-secondary btn-sm"
                  >
                    View All
                  </button>
                </div>

                {/* Performer Rows */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {SALES_HEAD_PERFORMERS.slice(0, 2).map((item) => (
                    <div key={item.id} className="sh-perf-row">
                      {/* Left: Rank & Executive Details */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', minWidth: 0 }}>
                        <span
                          style={{
                            fontSize: '0.75rem',
                            fontWeight: 800,
                            color: '#0F1A34',
                            backgroundColor: '#E6EFF8',
                            borderRadius: '9999px',
                            padding: '0.25rem 0.5rem',
                            flexShrink: 0
                          }}
                        >
                          #{item.rank}
                        </span>

                        <div
                          style={{
                            width: '36px',
                            height: '36px',
                            borderRadius: '50%',
                            backgroundColor: item.avatarBg,
                            color: item.avatarColor,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '0.8125rem',
                            fontWeight: 800,
                            flexShrink: 0
                          }}
                        >
                          {item.avatarText}
                        </div>

                        <div style={{ minWidth: 0 }}>
                          <div style={{ fontSize: '0.875rem', fontWeight: 800, color: '#0F1A34', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {item.displayName}
                          </div>
                          <div style={{ fontSize: '0.75rem', color: '#557396', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {item.role}
                          </div>
                        </div>
                      </div>

                      {/* Right: Metrics Columns */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', flexShrink: 0 }}>
                        <div style={{ textAlign: 'center', minWidth: '45px' }}>
                          <div style={{ fontSize: '0.625rem', fontWeight: 700, color: '#64748B', textTransform: 'uppercase' }}>LEADS</div>
                          <div style={{ fontSize: '0.9375rem', fontWeight: 800, color: '#0F1A34' }}>{item.leads}</div>
                        </div>
                        <div style={{ textAlign: 'center', minWidth: '60px' }}>
                          <div style={{ fontSize: '0.625rem', fontWeight: 700, color: '#64748B', textTransform: 'uppercase' }}>FOLLOW-UP</div>
                          <div style={{ fontSize: '0.9375rem', fontWeight: 800, color: '#0F1A34' }}>{item.followupRate}</div>
                        </div>
                        <div style={{ textAlign: 'center', minWidth: '45px' }}>
                          <div style={{ fontSize: '0.625rem', fontWeight: 700, color: '#64748B', textTransform: 'uppercase' }}>DEMOS</div>
                          <div style={{ fontSize: '0.9375rem', fontWeight: 800, color: '#0F1A34' }}>{item.visits}</div>
                        </div>
                        <div style={{ textAlign: 'center', minWidth: '60px' }}>
                          <div style={{ fontSize: '0.625rem', fontWeight: 700, color: '#64748B', textTransform: 'uppercase' }}>CONV. RATE</div>
                          <div style={{ fontSize: '0.9375rem', fontWeight: 800, color: '#047857' }}>{item.conversionRate}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Card 2: Team Calls Summary (Deep Navy Enterprise Card) */}
            <div className="sh-navy-card">
              <div>
                <span style={{ fontSize: '0.75rem', fontWeight: 800, letterSpacing: '0.06em', color: '#93C5FD', textTransform: 'uppercase' }}>
                  TEAM CALLS SUMMARY
                </span>
                
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.75rem', marginTop: '0.625rem', marginBottom: '1.25rem' }}>
                  <span style={{ fontSize: '3rem', fontWeight: 800, lineHeight: 1 }}>
                    {SALES_HEAD_CALLS_SUMMARY.totalCalls}
                  </span>
                  <span style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#93C5FD', letterSpacing: '0.05em' }}>
                    TOTAL ENTERPRISE CALLS
                  </span>
                </div>
              </div>

              {/* Two Nested Inner Stat Blocks */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div className="sh-inner-stat">
                  <div style={{ fontSize: '0.6875rem', fontWeight: 700, color: '#BFDBFE', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                    <LuPhoneCall size={12} />
                    <span>CONNECTED CALLS</span>
                  </div>
                  <div style={{ fontSize: '1.5rem', fontWeight: 800, marginTop: '0.25rem' }}>
                    {SALES_HEAD_CALLS_SUMMARY.connectedCalls}
                  </div>
                </div>

                <div className="sh-inner-stat">
                  <div style={{ fontSize: '0.6875rem', fontWeight: 700, color: '#BFDBFE', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                    <LuPhoneMissed size={12} />
                    <span>MISSED / PENDING</span>
                  </div>
                  <div style={{ fontSize: '1.5rem', fontWeight: 800, marginTop: '0.25rem' }}>
                    {SALES_HEAD_CALLS_SUMMARY.missedCalls}
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* ROW 2: Status Wise Leads Count & Lead Quality Distribution */}
          <div className="sh-grid-middle">
            
            {/* Card 3: Status wise Leads count */}
            <div className="section-card" style={{ marginBottom: 0, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div className="section-header" style={{ marginBottom: '1.25rem' }}>
                <div>
                  <h3 className="section-title">Status wise Leads count</h3>
                  <div style={{ fontSize: '0.75rem', color: '#557396', marginTop: '0.125rem' }}>
                    Active pipeline progression across customer lifecycle
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setIsLeadStatusesModalOpen(true)}
                  className="btn-secondary btn-sm"
                >
                  View All
                </button>
              </div>

              {/* Status Rows with Equal Spacing */}
              <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', flex: 1, paddingBottom: '0.25rem' }}>
                {SALES_HEAD_LEAD_STATUSES.slice(0, 4).map((status) => (
                  <div
                    key={status.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '0.625rem 0'
                    }}
                  >
                    <span style={{ fontSize: '0.8125rem', fontWeight: 800, color: '#0F1A34', letterSpacing: '0.02em', textTransform: 'uppercase' }}>
                      {status.name}
                    </span>
                    <span style={{ fontSize: '0.875rem', fontWeight: 800, color: '#0F1A34' }}>
                      {status.count}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Card 4: Lead Quality Distribution */}
            <div className="section-card" style={{ marginBottom: 0, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div className="section-header" style={{ marginBottom: '0.75rem' }}>
                  <div>
                    <h3 className="section-title">Lead Quality Distribution</h3>
                    <div style={{ fontSize: '0.75rem', color: '#557396', marginTop: '0.125rem' }}>
                      Qualification readiness of current pipeline
                    </div>
                  </div>
                </div>

                {/* Donut Chart with Center Text */}
                <div style={{ position: 'relative', width: '100%', height: '135px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <ResponsiveContainer width="100%" height={135}>
                    <PieChart>
                      <Pie
                        data={SALES_HEAD_QUALITY_DISTRIBUTION}
                        innerRadius={44}
                        outerRadius={62}
                        paddingAngle={3}
                        dataKey="percentage"
                        startAngle={90}
                        endAngle={-270}
                      >
                        {SALES_HEAD_QUALITY_DISTRIBUTION.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>

                  {/* Cutout Label */}
                  <div
                    style={{
                      position: 'absolute',
                      top: '50%',
                      left: '50%',
                      transform: 'translate(-50%, -50%)',
                      textAlign: 'center',
                      pointerEvents: 'none'
                    }}
                  >
                    <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0F1A34', lineHeight: 1.1 }}>
                      100%
                    </div>
                    <div style={{ fontSize: '0.625rem', fontWeight: 800, color: '#557396', letterSpacing: '0.04em' }}>
                      ACTIVE
                    </div>
                  </div>
                </div>

                {/* Legend Below Chart */}
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(2, 1fr)',
                    gap: '0.625rem 1.25rem',
                    marginTop: '0.875rem',
                    padding: '0 0.5rem'
                  }}
                >
                  {SALES_HEAD_QUALITY_DISTRIBUTION.map((item) => (
                    <div key={item.name} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: item.color }} />
                        <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#334155' }}>
                          {item.name}
                        </span>
                      </div>
                      <span style={{ fontSize: '0.8125rem', fontWeight: 800, color: '#0F1A34' }}>
                        {item.percentage}%
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

          </div>

          {/* ROW 3: Stale Leads & Top Objections */}
          <div className="sh-grid-bottom">
            
            {/* Card: Stale Leads */}
            <div className="section-card" style={{ marginBottom: 0, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.875rem' }}>
                  <h3 className="section-title" style={{ fontSize: '0.8125rem', letterSpacing: '0.04em', textTransform: 'uppercase', margin: 0 }}>
                    Stale Leads
                  </h3>
                  <button
                    type="button"
                    onClick={() => setIsStaleLeadsModalOpen(true)}
                    className="btn-secondary btn-sm"
                  >
                    View All ({SALES_HEAD_STALE_LEADS.length})
                  </button>
                </div>

                <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem', marginTop: '0.375rem', marginBottom: '0.875rem' }}>
                  <span style={{ fontSize: '2.25rem', fontWeight: 800, color: '#0022FF', lineHeight: 1 }}>
                    {SALES_HEAD_STALE_LEADS.length}
                  </span>
                  <span style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#0F1A34' }}>
                    &gt; 14 Days Idle without touchpoint
                  </span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {SALES_HEAD_STALE_LEADS.slice(0, 3).map((stale) => (
                    <div
                      key={stale.id}
                      style={{
                        padding: '0.625rem 0.875rem',
                        borderRadius: 'var(--radius)',
                        backgroundColor: '#F8FAFC',
                        border: '1px solid #EDF2F7',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between'
                      }}
                    >
                      <div style={{ minWidth: 0, paddingRight: '0.5rem' }}>
                        <div style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#0F1A34', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {stale.company}
                        </div>
                        <div style={{ fontSize: '0.6875rem', color: '#557396' }}>
                          {stale.executive} • {stale.status}
                        </div>
                      </div>
                      <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#DC2626', flexShrink: 0 }}>
                        {stale.idleDays}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Card: TOP OBJECTIONS */}
            <div className="section-card" style={{ marginBottom: 0, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <h3 className="section-title" style={{ fontSize: '0.8125rem', letterSpacing: '0.04em', textTransform: 'uppercase', marginBottom: '1rem' }}>
                  TOP OBJECTIONS
                </h3>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
                  {SALES_HEAD_OBJECTIONS.map((obj) => (
                    <div key={obj.title}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                        <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#1E293B', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', paddingRight: '0.5rem' }}>
                          {obj.title}
                        </span>
                        <span style={{ fontSize: '0.8125rem', fontWeight: 800, color: '#0F1A34', flexShrink: 0 }}>
                          {obj.percentage}%
                        </span>
                      </div>
                      
                      <div className="sh-progress-track">
                        <div
                          className="sh-progress-fill"
                          style={{
                            width: `${obj.percentage}%`,
                            backgroundColor: obj.color || '#0022FF'
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

          </div>
        </>
      ) : (
        /* ======================================================== */
        /* SUB-VIEW 2: SALES EXECUTIVES REGISTRY                    */
        /* ======================================================== */
        <div className="section-card" style={{ marginBottom: 0 }}>
          <div className="section-header" style={{ marginBottom: '1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <h3 className="section-title">Active Sales Executives</h3>
                <span
                  style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    backgroundColor: '#10B981',
                    boxShadow: '0 0 6px rgba(16, 185, 129, 0.6)'
                  }}
                  title="Live Registry Active"
                />
              </div>
              <div style={{ fontSize: '0.75rem', color: '#557396', marginTop: '0.25rem' }}>
                Monitor enterprise sales executives, solution alignment, and reporting sales heads.
              </div>
            </div>

            {isAdmin && (
              <button
                type="button"
                className="btn-primary"
                style={{ display: 'inline-flex', alignItems: 'center' }}
                onClick={handleOpenCreateModal}
              >
                <LuUserPlus size={14} />
                <span>Create Sales Executive</span>
              </button>
            )}
          </div>

          {/* Table */}
          <div style={{ overflowX: 'auto', width: '100%' }}>
            <table className="action-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  <th
                    onClick={() => {
                      setSortField('name');
                      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
                    }}
                    style={{ cursor: 'pointer' }}
                  >
                    EXECUTIVE NAME {sortField === 'name' ? (sortOrder === 'asc' ? '↑' : '↓') : '↕'}
                  </th>
                  <th>CONTACT INFO</th>
                  <th>SOLUTION / VERTICAL</th>
                  {isAdmin && <th>ASSIGNED SALES HEAD</th>}
                  <th
                    onClick={() => {
                      setSortField('creationDate');
                      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
                    }}
                    style={{ cursor: 'pointer' }}
                  >
                    JOINING DATE {sortField === 'creationDate' ? (sortOrder === 'asc' ? '↑' : '↓') : '↓'}
                  </th>
                  <th style={{ textAlign: isAdmin ? 'left' : 'right' }}>ASSIGNED LEADS</th>
                  {isAdmin && <th style={{ textAlign: 'right' }}>ACTIONS</th>}
                </tr>
              </thead>

              <tbody>
                {filteredSalesExecutives.length === 0 ? (
                  <tr>
                    <td colSpan={isAdmin ? 7 : 5} style={{ padding: '3rem', textAlign: 'center', color: '#557396' }}>
                      No sales executives found matching your search.
                    </td>
                  </tr>
                ) : (
                  filteredSalesExecutives.map((exec) => (
                    <tr key={exec.id} style={{ transition: 'background-color 0.15s ease' }}>
                      {/* Name & Avatar */}
                      <td style={{ verticalAlign: 'middle' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                          <div
                            style={{
                              width: '36px',
                              height: '36px',
                              borderRadius: '50%',
                              backgroundColor: exec.avatarBg || '#E0F2FE',
                              color: exec.avatarColor || '#0369A1',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontSize: '0.8125rem',
                              fontWeight: 800,
                              flexShrink: 0
                            }}
                          >
                            {exec.initials}
                          </div>
                          <div>
                            <div style={{ fontSize: '0.875rem', fontWeight: 700, color: '#0F1A34' }}>
                              {exec.name}
                            </div>
                            <div style={{ fontSize: '0.75rem', color: '#557396' }}>
                              {exec.role}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Contact Info */}
                      <td style={{ verticalAlign: 'middle' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.125rem' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', fontSize: '0.8125rem', color: '#334155' }}>
                            <LuPhone size={12} style={{ color: '#557396' }} />
                            <span>{exec.formattedPhone || exec.phone}</span>
                          </div>
                          <div style={{ fontSize: '0.75rem', color: '#557396' }}>
                            {exec.email}
                          </div>
                        </div>
                      </td>

                      {/* Project / Vertical */}
                      <td style={{ verticalAlign: 'middle' }}>
                        <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#0F1A34' }}>
                          {exec.project}
                        </span>
                      </td>

                      {/* Assigned Sales Head (Admin Only) */}
                      {isAdmin && (
                        <td style={{ verticalAlign: 'middle' }}>
                          <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#0F1A34' }}>
                            {exec.reportingSalesHead || 'Rajesh Sharma'}
                          </span>
                        </td>
                      )}

                      {/* Creation Date */}
                      <td style={{ verticalAlign: 'middle' }}>
                        <span style={{ fontSize: '0.8125rem', color: '#557396' }}>
                          {exec.creationDate}
                        </span>
                      </td>

                      {/* Assigned Leads */}
                      <td style={{ verticalAlign: 'middle', textAlign: isAdmin ? 'left' : 'right' }}>
                        <button
                          type="button"
                          onClick={() => setAssignedModalData(exec)}
                          className="btn-secondary"
                          style={{
                            color: '#0F1A34',
                            display: 'inline-flex' }}
                          title="Click to view assigned leads"
                        >
                          {exec.assignedLeadsCount !== undefined ? exec.assignedLeadsCount : (exec.assignedLeads ? exec.assignedLeads.length : 0)} Leads
                        </button>
                      </td>

                      {/* Actions (Admin Only) */}
                      {isAdmin && (
                        <td style={{ verticalAlign: 'middle', textAlign: 'right' }}>
                          <button
                            type="button"
                            className="btn-secondary btn-sm"
                            onClick={() => handleOpenEditModal(exec)}
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center' }}
                            title="Edit Sales Executive"
                          >
                            <LuPencil size={12} />
                            <span>Edit</span>
                          </button>
                        </td>
                      )}
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* DRAWER: EDIT SALES EXECUTIVE                             */}
      {/* ======================================================== */}
      <AnimatePresence>
        {isCreateDrawerOpen && (
          <motion.div
            className="drawer-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsCreateDrawerOpen(false)}
            style={{ zIndex: 10000 }}
          >
            <motion.div role="dialog" aria-label={editingExecutive ? 'Edit Sales Executive' : 'Create New Sales Executive'} aria-modal="true"
              className="drawer-content"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="drawer-header">
                <div>
                  <h3 className="section-title" style={{ margin: 0 }}>
                    {editingExecutive ? 'Edit Sales Executive' : 'Create New Sales Executive'}
                  </h3>
                  <div style={{ fontSize: '0.75rem', color: '#557396', marginTop: '0.25rem' }}>
                    {editingExecutive
                      ? 'Update account, vertical, and reporting sales head assignments'
                      : 'Add a new sales executive with solution and reporting sales head assignments'}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setIsCreateDrawerOpen(false)}
                  style={{ background: 'none', border: 'none', color: '#557396', cursor: 'pointer', padding: '0.25rem' }}
                >
                  <LuX size={18} />
                </button>
              </div>

              <div className="drawer-body" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                
                {/* First & Last Name */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                  <div className="drawer-field-group" style={{ marginBottom: 0 }}>
                    <label className="field-label">FIRST NAME</label>
                    <input aria-label="FIRST NAME"
                      type="text"
                      className="search-input"
                      style={{ width: '100%', padding: '0.5rem 0.75rem', borderRadius: 'var(--radius)', border: formErrors.firstName ? '1px solid #DC2626' : '1px solid #D5E2EE' }}
                      placeholder="Rahul"
                      value={formFirstName}
                      onChange={(e) => setFormFirstName(e.target.value)}
                    />
                    {formErrors.firstName && <span style={{ fontSize: '0.6875rem', color: '#DC2626' }}>{formErrors.firstName}</span>}
                  </div>

                  <div className="drawer-field-group" style={{ marginBottom: 0 }}>
                    <label className="field-label">LAST NAME</label>
                    <input aria-label="LAST NAME"
                      type="text"
                      className="search-input"
                      style={{ width: '100%', padding: '0.5rem 0.75rem', borderRadius: 'var(--radius)', border: formErrors.lastName ? '1px solid #DC2626' : '1px solid #D5E2EE' }}
                      placeholder="Verma"
                      value={formLastName}
                      onChange={(e) => setFormLastName(e.target.value)}
                    />
                    {formErrors.lastName && <span style={{ fontSize: '0.6875rem', color: '#DC2626' }}>{formErrors.lastName}</span>}
                  </div>
                </div>

                {/* Role / Designation */}
                <div className="drawer-field-group" style={{ marginBottom: 0 }}>
                  <label className="field-label">DESIGNATION / ROLE</label>
                  <input aria-label="DESIGNATION / ROLE"
                    type="text"
                    className="search-input"
                    style={{ width: '100%', padding: '0.5rem 0.75rem', borderRadius: 'var(--radius)', border: '1px solid #D5E2EE' }}
                    placeholder="Senior Enterprise Sales Executive"
                    value={formRole}
                    onChange={(e) => setFormRole(e.target.value)}
                  />
                </div>

                {/* Email Address */}
                <div className="drawer-field-group" style={{ marginBottom: 0 }}>
                  <label className="field-label">CORPORATE EMAIL ADDRESS</label>
                  <input aria-label="CORPORATE EMAIL ADDRESS"
                    type="email"
                    className="search-input"
                    style={{ width: '100%', padding: '0.5rem 0.75rem', borderRadius: 'var(--radius)', border: formErrors.email ? '1px solid #DC2626' : '1px solid #D5E2EE' }}
                    placeholder="rahul.v@techgy.com"
                    value={formEmail}
                    onChange={(e) => setFormEmail(e.target.value)}
                  />
                  {formErrors.email && <span style={{ fontSize: '0.6875rem', color: '#DC2626' }}>{formErrors.email}</span>}
                </div>

                {/* Contact Phone */}
                <div className="drawer-field-group" style={{ marginBottom: 0 }}>
                  <label className="field-label">CONTACT NUMBER</label>
                  <input aria-label="CONTACT NUMBER"
                    type="tel"
                    className="search-input"
                    style={{ width: '100%', padding: '0.5rem 0.75rem', borderRadius: 'var(--radius)', border: formErrors.phone ? '1px solid #DC2626' : '1px solid #D5E2EE' }}
                    placeholder="+91 98765 11001"
                    value={formPhone}
                    onChange={(e) => setFormPhone(e.target.value)}
                  />
                  {formErrors.phone && <span style={{ fontSize: '0.6875rem', color: '#DC2626' }}>{formErrors.phone}</span>}
                </div>

                {/* Solution / Vertical Dropdown */}
                <div className="drawer-field-group" style={{ marginBottom: 0 }}>
                  <label className="field-label">ASSIGNED SOLUTION / VERTICAL</label>
                  <select aria-label="ASSIGNED SOLUTION / VERTICAL"
                    className="select-filter"
                    style={{ width: '100%', padding: '0.5rem 0.75rem', borderRadius: 'var(--radius)' }}
                    value={formProject}
                    onChange={(e) => setFormProject(e.target.value)}
                  >
                    {SALES_HEAD_PROJECTS.filter(p => p !== 'All Solutions').map(proj => (
                      <option key={proj} value={proj}>{proj}</option>
                    ))}
                  </select>
                </div>

                {/* Reporting Sales Head */}
                <div className="drawer-field-group" style={{ marginBottom: 0 }}>
                  <label className="field-label">REPORTING SALES HEAD</label>
                  <select aria-label="REPORTING SALES HEAD"
                    className="select-filter"
                    style={{ width: '100%', padding: '0.5rem 0.75rem', borderRadius: 'var(--radius)' }}
                    value={formReportingHead}
                    onChange={(e) => setFormReportingHead(e.target.value)}
                  >
                    {salesHeads.map(h => (
                      <option key={h.id || h.name} value={h.name}>{h.name}</option>
                    ))}
                  </select>
                </div>

              </div>

              <div style={{ padding: '1.25rem 1.5rem', borderTop: '1px solid #E5EBF2', background: '#F8FAFC' }}>
                <button
                  type="button"
                  onClick={handleSubmitForm}
                  className="btn-primary"
                  style={{ width: '100%', justifyContent: 'center' }}
                >
                  <LuCircleCheck size={16} />
                  <span>{editingExecutive ? 'Save Changes' : 'Create Sales Executive'}</span>
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ======================================================== */}
      {/* MODAL: ALL LEAD STATUSES (Matches Screenshot 5)          */}
      {/* ======================================================== */}
      <AnimatePresence>
        {isLeadStatusesModalOpen && (
          <motion.div
            className="modal-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsLeadStatusesModalOpen(false)}
            style={{
              position: 'fixed',
              inset: 0,
              backgroundColor: 'rgba(6, 54, 105, 0.45)',
              backdropFilter: 'blur(4px)',
              zIndex: 10000,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '1.25rem'
            }}
          >
            <motion.div role="dialog" aria-label="All Lead Statuses" aria-modal="true"
              className="modal-card"
              initial={{ scale: 0.95, opacity: 0, y: 15 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 15 }}
              onClick={(e) => e.stopPropagation()}
              style={{ width: '560px', maxWidth: '100%', maxHeight: '85vh', display: 'flex', flexDirection: 'column' }}
            >
              <div className="modal-header">
                <div>
                  <h3 className="section-title" style={{ margin: 0 }}>All Lead Statuses</h3>
                  <div style={{ fontSize: '0.75rem', color: '#557396' }}>Pipeline status distribution across all enterprise leads</div>
                </div>
                <button
                  type="button"
                  onClick={() => setIsLeadStatusesModalOpen(false)}
                  style={{ background: 'none', border: 'none', color: '#557396', cursor: 'pointer', padding: '0.25rem' }}
                >
                  <LuX size={18} />
                </button>
              </div>

              <div style={{ padding: '0.75rem 1.25rem 0.25rem' }}>
                <div className="search-box" style={{ width: '100%' }}>
                  <LuSearch className="search-icon" />
                  <input aria-label="Search status"
                    type="text"
                    className="search-input"
                    placeholder="Search status..."
                    value={statusSearchQuery}
                    onChange={(e) => setStatusSearchQuery(e.target.value)}
                  />
                </div>
              </div>

              <div className="modal-body" style={{ overflowY: 'auto', flex: 1, display: 'flex', flexDirection: 'column', gap: '1rem', padding: '1rem 1.25rem 1.5rem' }}>
                {filteredLeadStatuses.length === 0 ? (
                  <div style={{ textAlign: 'center', color: '#557396', padding: '2rem' }}>
                    No status found matching "{statusSearchQuery}"
                  </div>
                ) : (
                  filteredLeadStatuses.map((st) => (
                    <div key={st.id}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.375rem' }}>
                        <span style={{ fontSize: '0.8125rem', fontWeight: 800, color: '#0F1A34' }}>
                          {st.name}
                        </span>
                        <span style={{ fontSize: '0.8125rem', fontWeight: 800, color: '#0F1A34' }}>
                          {st.count}
                        </span>
                      </div>
                      
                      <div className="sh-progress-track">
                        <div
                          className="sh-progress-fill"
                          style={{
                            width: `${Math.max(st.percentage, st.count > 0 && st.percentage === 0 ? 2 : 0)}%`,
                            backgroundColor: st.color || '#0F1A34'
                          }}
                        />
                      </div>
                    </div>
                  ))
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ======================================================== */}
      {/* MODAL: TOP PERFORMERS LEADERBOARD VIEW ALL               */}
      {/* ======================================================== */}
      <AnimatePresence>
        {isLeaderboardModalOpen && (
          <motion.div
            className="modal-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsLeaderboardModalOpen(false)}
            style={{
              position: 'fixed',
              inset: 0,
              backgroundColor: 'rgba(6, 54, 105, 0.45)',
              backdropFilter: 'blur(4px)',
              zIndex: 10000,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '1.25rem'
            }}
          >
            <motion.div role="dialog" aria-label="Executive Leaderboard" aria-modal="true"
              className="modal-card"
              initial={{ scale: 0.95, opacity: 0, y: 15 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 15 }}
              onClick={(e) => e.stopPropagation()}
              style={{ width: '640px', maxWidth: '100%', maxHeight: '85vh', display: 'flex', flexDirection: 'column' }}
            >
              <div className="modal-header">
                <div>
                  <h3 className="section-title" style={{ margin: 0 }}>Executive Leaderboard</h3>
                  <div style={{ fontSize: '0.75rem', color: '#557396' }}>Ranked by enterprise deals, demos conducted, and conversion rate</div>
                </div>
                <button
                  type="button"
                  onClick={() => setIsLeaderboardModalOpen(false)}
                  style={{ background: 'none', border: 'none', color: '#557396', cursor: 'pointer', padding: '0.25rem' }}
                >
                  <LuX size={18} />
                </button>
              </div>

              <div className="modal-body" style={{ overflowY: 'auto', flex: 1, display: 'flex', flexDirection: 'column', gap: '0.75rem', padding: '1.25rem' }}>
                {SALES_HEAD_PERFORMERS.map((item) => (
                  <div key={item.id} className="sh-perf-row">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', minWidth: 0 }}>
                      <span
                        style={{
                          fontSize: '0.75rem',
                          fontWeight: 800,
                          color: '#0F1A34',
                          backgroundColor: '#E6EFF8',
                          borderRadius: '9999px',
                          padding: '0.25rem 0.5rem'
                        }}
                      >
                        #{item.rank}
                      </span>
                      <div
                        style={{
                          width: '36px',
                          height: '36px',
                          borderRadius: '50%',
                          backgroundColor: item.avatarBg,
                          color: item.avatarColor,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '0.8125rem',
                          fontWeight: 800
                        }}
                      >
                        {item.avatarText}
                      </div>
                      <div style={{ minWidth: 0 }}>
                        <div style={{ fontSize: '0.875rem', fontWeight: 800, color: '#0F1A34' }}>
                          {item.displayName}
                        </div>
                        <div style={{ fontSize: '0.75rem', color: '#557396' }}>
                          {item.role} · {item.project}
                        </div>
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', flexShrink: 0 }}>
                      <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: '0.625rem', fontWeight: 700, color: '#64748B' }}>LEADS</div>
                        <div style={{ fontSize: '0.875rem', fontWeight: 800, color: '#0F1A34' }}>{item.leads}</div>
                      </div>
                      <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: '0.625rem', fontWeight: 700, color: '#64748B' }}>DEMOS</div>
                        <div style={{ fontSize: '0.875rem', fontWeight: 800, color: '#0F1A34' }}>{item.visits}</div>
                      </div>
                      <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: '0.625rem', fontWeight: 700, color: '#64748B' }}>CONV.</div>
                        <div style={{ fontSize: '0.875rem', fontWeight: 800, color: '#047857' }}>{item.conversionRate}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ======================================================== */}
      {/* MODAL: ESCALATIONS VIEW ALL                              */}
      {/* ======================================================== */}
      <AnimatePresence>
        {isEscalationsModalOpen && (
          <motion.div
            className="modal-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsEscalationsModalOpen(false)}
            style={{
              position: 'fixed',
              inset: 0,
              backgroundColor: 'rgba(6, 54, 105, 0.45)',
              backdropFilter: 'blur(4px)',
              zIndex: 10000,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '1.25rem'
            }}
          >
            <motion.div role="dialog" aria-label="Active Escalations" aria-modal="true"
              className="modal-card"
              initial={{ scale: 0.95, opacity: 0, y: 15 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 15 }}
              onClick={(e) => e.stopPropagation()}
              style={{ width: '600px', maxWidth: '100%', maxHeight: '85vh', display: 'flex', flexDirection: 'column' }}
            >
              <div className="modal-header">
                <div>
                  <h3 className="section-title" style={{ margin: 0 }}>Active Escalations</h3>
                  <div style={{ fontSize: '0.75rem', color: '#DC2626', fontWeight: 700 }}>Critical SLA, pricing, and compliance blockers requiring leadership sign-off</div>
                </div>
                <button
                  type="button"
                  onClick={() => setIsEscalationsModalOpen(false)}
                  style={{ background: 'none', border: 'none', color: '#557396', cursor: 'pointer', padding: '0.25rem' }}
                >
                  <LuX size={18} />
                </button>
              </div>

              <div className="modal-body" style={{ overflowY: 'auto', flex: 1, display: 'flex', flexDirection: 'column', gap: '0.75rem', padding: '1.25rem' }}>
                {SALES_HEAD_ESCALATIONS.map((esc) => (
                  <div
                    key={esc.id}
                    style={{
                      padding: '0.875rem 1rem',
                      borderRadius: 'var(--radius)',
                      backgroundColor: '#FEF2F2',
                      border: '1px solid #FECACA',
                      display: 'flex',
                      alignItems: 'flex-start',
                      justifyContent: 'space-between',
                      gap: '0.75rem'
                    }}
                  >
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span style={{ fontSize: '0.875rem', fontWeight: 800, color: '#991B1B' }}>
                          {esc.leadName}
                        </span>
                        <span style={{ fontSize: '0.6875rem', fontWeight: 800, color: '#DC2626', backgroundColor: '#FEE2E2', padding: '0.125rem 0.5rem', borderRadius: '4px' }}>
                          {esc.priority}
                        </span>
                      </div>
                      <div style={{ fontSize: '0.75rem', color: '#7F1D1D', marginTop: '0.25rem' }}>
                        {esc.reason}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: '#991B1B', marginTop: '0.25rem' }}>
                        Owner: <strong>{esc.executive}</strong> · Vertical: <strong>{esc.project}</strong>
                      </div>
                    </div>

                    <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#DC2626', flexShrink: 0 }}>
                      {esc.days}d open
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ======================================================== */}
      {/* MODAL: STALE LEADS VIEW ALL                              */}
      {/* ======================================================== */}
      <AnimatePresence>
        {isStaleLeadsModalOpen && (
          <motion.div
            className="modal-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsStaleLeadsModalOpen(false)}
            style={{
              position: 'fixed',
              inset: 0,
              backgroundColor: 'rgba(6, 54, 105, 0.45)',
              backdropFilter: 'blur(4px)',
              zIndex: 10000,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '1.25rem'
            }}
          >
            <motion.div role="dialog" aria-label="Stale Leads (&gt; 14 Days Idle)" aria-modal="true"
              className="modal-card"
              initial={{ scale: 0.95, opacity: 0, y: 15 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 15 }}
              onClick={(e) => e.stopPropagation()}
              style={{ width: '600px', maxWidth: '100%', maxHeight: '85vh', display: 'flex', flexDirection: 'column' }}
            >
              <div className="modal-header">
                <div>
                  <h3 className="section-title" style={{ margin: 0 }}>Stale Leads (&gt; 14 Days Idle)</h3>
                  <div style={{ fontSize: '0.75rem', color: '#2563EB', fontWeight: 700 }}>Accounts requiring immediate re-engagement or re-assignment</div>
                </div>
                <button
                  type="button"
                  onClick={() => setIsStaleLeadsModalOpen(false)}
                  style={{ background: 'none', border: 'none', color: '#557396', cursor: 'pointer', padding: '0.25rem' }}
                >
                  <LuX size={18} />
                </button>
              </div>

              <div className="modal-body" style={{ overflowY: 'auto', flex: 1, display: 'flex', flexDirection: 'column', gap: '0.75rem', padding: '1.25rem' }}>
                {SALES_HEAD_STALE_LEADS.map((lead) => (
                  <div
                    key={lead.id}
                    style={{
                      padding: '0.875rem 1rem',
                      borderRadius: 'var(--radius)',
                      backgroundColor: '#EFF6FF',
                      border: '1px solid #BFDBFE',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between'
                    }}
                  >
                    <div>
                      <div style={{ fontSize: '0.875rem', fontWeight: 800, color: '#1E40AF' }}>
                        {lead.leadName}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: '#2563EB', marginTop: '0.125rem' }}>
                        Phone: {lead.phone} · Solution: {lead.project}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: '#557396', marginTop: '0.25rem' }}>
                        Assigned: <strong>{lead.executive}</strong> · Last touchpoint: {lead.lastContact}
                      </div>
                    </div>

                    <span
                      style={{
                        fontSize: '0.75rem',
                        fontWeight: 800,
                        color: '#1D4ED8',
                        backgroundColor: '#DBEAFE',
                        padding: '0.25rem 0.625rem',
                        borderRadius: '9999px'
                      }}
                    >
                      {lead.idleDays}d idle
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ======================================================== */}
      {/* MODAL: TOP BOOKINGS VIEW ALL                             */}
      {/* ======================================================== */}
      <AnimatePresence>
        {isBookingsModalOpen && (
          <motion.div
            className="modal-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsBookingsModalOpen(false)}
            style={{
              position: 'fixed',
              inset: 0,
              backgroundColor: 'rgba(6, 54, 105, 0.45)',
              backdropFilter: 'blur(4px)',
              zIndex: 10000,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '1.25rem'
            }}
          >
            <motion.div role="dialog" aria-label="Closed Enterprise Bookings" aria-modal="true"
              className="modal-card"
              initial={{ scale: 0.95, opacity: 0, y: 15 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 15 }}
              onClick={(e) => e.stopPropagation()}
              style={{ width: '600px', maxWidth: '100%', maxHeight: '85vh', display: 'flex', flexDirection: 'column' }}
            >
              <div className="modal-header">
                <div>
                  <h3 className="section-title" style={{ margin: 0 }}>Closed Enterprise Bookings</h3>
                  <div style={{ fontSize: '0.75rem', color: '#047857', fontWeight: 700 }}>Signed enterprise license contracts and multi-year renewals</div>
                </div>
                <button
                  type="button"
                  onClick={() => setIsBookingsModalOpen(false)}
                  style={{ background: 'none', border: 'none', color: '#557396', cursor: 'pointer', padding: '0.25rem' }}
                >
                  <LuX size={18} />
                </button>
              </div>

              <div className="modal-body" style={{ overflowY: 'auto', flex: 1, display: 'flex', flexDirection: 'column', gap: '0.75rem', padding: '1.25rem' }}>
                {SALES_HEAD_BOOKINGS.map((bkg) => (
                  <div
                    key={bkg.id}
                    style={{
                      padding: '0.875rem 1rem',
                      borderRadius: 'var(--radius)',
                      backgroundColor: '#ECFDF5',
                      border: '1px solid #A7F3D0',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between'
                    }}
                  >
                    <div>
                      <div style={{ fontSize: '0.875rem', fontWeight: 800, color: '#065F46' }}>
                        {bkg.company}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: '#047857', marginTop: '0.125rem' }}>
                        {bkg.plan}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: '#557396', marginTop: '0.25rem' }}>
                        Executive: <strong>{bkg.executive}</strong> · Signed on {bkg.date}
                      </div>
                    </div>

                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '1rem', fontWeight: 800, color: '#047857' }}>
                        {bkg.value}
                      </div>
                      <span style={{ fontSize: '0.6875rem', fontWeight: 700, color: '#065F46', backgroundColor: '#D1FAE5', padding: '0.125rem 0.5rem', borderRadius: '4px' }}>
                        {bkg.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ======================================================== */}
      {/* MODAL: ASSIGNED LEADS DIRECTORY                          */}
      {/* ======================================================== */}
      <AnimatePresence>
        {assignedModalData && (
          <motion.div
            className="modal-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setAssignedModalData(null)}
            style={{
              position: 'fixed',
              inset: 0,
              backgroundColor: 'rgba(6, 54, 105, 0.45)',
              backdropFilter: 'blur(4px)',
              zIndex: 10000,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '1.25rem'
            }}
          >
            <motion.div role="dialog" aria-label={`Assigned Leads: ${assignedModalData.name}`} aria-modal="true"
              className="modal-card"
              initial={{ scale: 0.95, opacity: 0, y: 15 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 15 }}
              onClick={(e) => e.stopPropagation()}
              style={{ width: '640px', maxWidth: '100%', maxHeight: '85vh', display: 'flex', flexDirection: 'column' }}
            >
              <div className="modal-header">
                <div>
                  <h3 className="section-title" style={{ margin: 0 }}>
                    Assigned Leads: {assignedModalData.name}
                  </h3>
                  <div style={{ fontSize: '0.75rem', color: '#557396', marginTop: '0.25rem' }}>
                    {assignedModalData.role} • {assignedModalData.project} • Reporting to {assignedModalData.reportingSalesHead || 'Rajesh Sharma'}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setAssignedModalData(null)}
                  style={{ background: 'none', border: 'none', color: '#557396', cursor: 'pointer', padding: '0.25rem' }}
                >
                  <LuX size={18} />
                </button>
              </div>

              <div className="modal-body" style={{ overflowY: 'auto', flex: 1, display: 'flex', flexDirection: 'column', gap: '0.75rem', padding: '1.25rem' }}>
                {(!assignedModalData.assignedLeads || assignedModalData.assignedLeads.length === 0) ? (
                  <EmptyState compact icon={LuUsers} title="No leads assigned yet" description="Assign pipeline leads to this executive from the Leads module." />
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    {assignedModalData.assignedLeads.map((lead) => (
                      <div
                        key={lead.id}
                        style={{
                          padding: '0.875rem',
                          background: '#F8FAFC',
                          border: '1px solid #E2E8F0',
                          borderRadius: 'var(--radius)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          gap: '0.75rem'
                        }}
                      >
                        <div>
                          <div style={{ fontWeight: 700, color: '#0F1A34', fontSize: '0.875rem' }}>
                            {lead.name}
                          </div>
                          <div style={{ fontSize: '0.75rem', color: '#557396', marginTop: '0.125rem' }}>
                            {lead.company}
                          </div>
                          <div style={{ fontSize: '0.75rem', color: '#0369A1', fontWeight: 600, marginTop: '0.25rem' }}>
                            Next: {lead.nextFollowup}
                          </div>
                        </div>

                        <div style={{ textAlign: 'right' }}>
                          <div style={{ fontSize: '0.875rem', fontWeight: 800, color: '#0F1A34' }}>
                            {lead.value}
                          </div>
                          <span style={{
                            fontSize: '0.6875rem',
                            padding: '0.125rem 0.5rem',
                            borderRadius: '9999px',
                            fontWeight: 700,
                            background: lead.quality === 'Hot' ? '#FEE2E2' : '#EFF6FF',
                            color: lead.quality === 'Hot' ? '#DC2626' : '#2563EB',
                            display: 'inline-block',
                            marginTop: '0.25rem'
                          }}>
                            {lead.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
