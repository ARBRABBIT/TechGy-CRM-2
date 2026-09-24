import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LuUsers,
  LuChevronDown,
  LuPhone,
  LuSearch,
  LuPlus,
  LuX,
  LuPencil,
  LuUserPlus,
  LuPhoneCall,
  LuPhoneMissed,
  LuCircleCheck,
  LuCalendar,
  LuClock,
  LuArrowUpRight,
  LuBriefcase,
  LuTrendingUp,
  LuMapPin,
  LuVideo,
  LuShieldAlert,
  LuCheck,
  LuExternalLink
} from 'react-icons/lu';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip
} from 'recharts';
import {
  SALES_HEAD_PROJECTS,
  INITIAL_SALES_HEADS,
  INITIAL_SALES_EXECUTIVES,
  SALES_EXECUTIVE_TODAY_FOLLOWUPS,
  SALES_EXECUTIVE_MISSED_FOLLOWUPS,
  SALES_EXECUTIVE_QUALITY_DISTRIBUTION,
  SALES_EXECUTIVE_LEAD_STATUSES,
  SALES_EXECUTIVE_SITE_VISITS_TODAY,
  SALES_EXECUTIVE_OBJECTIONS
} from '../data/mockData';

export default function SalesExecutiveView({
  salesExecutives = INITIAL_SALES_EXECUTIVES,
  salesHeads = INITIAL_SALES_HEADS,
  onUpdateSalesExecutives,
  onTriggerToast,
  onNavigateToLead: _onNavigateToLead
}) {
  // Current view: 'dashboard' | 'registry'
  const [currentTab, setCurrentTab] = useState('dashboard');

  // Filter States
  const [selectedExecutive, setSelectedExecutive] = useState('All Sales Executives');
  const [selectedSolution, setSelectedSolution] = useState('All Solutions');
  const [selectedTimeframe, setSelectedTimeframe] = useState('All Time');

  // Registry Search & Sort States
  const [registrySearch, setRegistrySearch] = useState('');
  const [sortField, setSortField] = useState('creationDate');
  const [sortOrder, setSortOrder] = useState('desc');

  // Modals / Drawers States
  const [isCreateDrawerOpen, setIsCreateDrawerOpen] = useState(false);
  const [isMissedFollowupsModalOpen, setIsMissedFollowupsModalOpen] = useState(false);
  const [isTodayFollowupsModalOpen, setIsTodayFollowupsModalOpen] = useState(false);
  const [isSiteVisitsModalOpen, setIsSiteVisitsModalOpen] = useState(false);
  const [isLeadStatusesModalOpen, setIsLeadStatusesModalOpen] = useState(false);
  const [isObjectionsModalOpen, setIsObjectionsModalOpen] = useState(false);
  const [isBookingsModalOpen, setIsBookingsModalOpen] = useState(false);
  const [assignedModalData, setAssignedModalData] = useState(null);
  const [editingExecutive, setEditingExecutive] = useState(null);

  // Status Search inside Statuses Modal
  const [statusSearchQuery, setStatusSearchQuery] = useState('');

  // Form State for Create / Edit Executive
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

  const handleOpenCreateDrawer = () => {
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
    setFormReportingHead(exec.reportingSalesHead || salesHeads[0]?.name || 'Rajesh Sharma');
    setFormErrors({});
    setIsCreateDrawerOpen(true);
  };

  const validateForm = () => {
    const errors = {};
    if (!formFirstName.trim()) errors.firstName = 'First name is required';
    if (!formLastName.trim()) errors.lastName = 'Last name is required';
    if (!formEmail.trim()) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formEmail)) {
      errors.email = 'Enter a valid corporate email address';
    }
    if (!formPhone.trim()) {
      errors.phone = 'Phone number is required';
    } else if (formPhone.replace(/\D/g, '').length < 10) {
      errors.phone = 'Enter a valid 10-digit phone number';
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSaveExecutive = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

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
            role: formRole.trim() || 'Enterprise Sales Executive',
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
      const palette = [
        { bg: '#E0F2FE', color: '#0369A1' },
        { bg: '#FFE4E6', color: '#E11D48' },
        { bg: '#DCFCE7', color: '#15803D' },
        { bg: '#DBEAFE', color: '#1D4ED8' },
        { bg: '#FCE7F3', color: '#BE185D' },
        { bg: '#CCFBF1', color: '#0F766E' },
        { bg: '#FEF3C7', color: '#B45309' }
      ];
      const randomTone = palette[Math.floor(Math.random() * palette.length)];

      const now = new Date();
      const dd = String(now.getDate()).padStart(2, '0');
      const mm = String(now.getMonth() + 1).padStart(2, '0');
      const yyyy = now.getFullYear();
      const creationDateStr = `${dd}-${mm}-${yyyy}`;

      const newExec = {
        id: `EXE-${Date.now().toString().slice(-4)}`,
        firstName: formFirstName.trim(),
        lastName: formLastName.trim(),
        name: fullName,
        role: formRole.trim() || 'Enterprise Sales Executive',
        initials: initials || 'SE',
        avatarBg: randomTone.bg,
        avatarColor: randomTone.color,
        phone: formPhone.trim().replace(/\D/g, ''),
        formattedPhone: formPhone.trim().startsWith('+') ? formPhone.trim() : `+91 ${formPhone.trim()}`,
        email: formEmail.trim(),
        project: formProject,
        reportingSalesHead: formReportingHead,
        creationDate: creationDateStr,
        assignedLeadsCount: 0,
        missedFollowupsCount: 0,
        avgDelayHours: '0.0 hrs',
        siteVisitsScheduled: 0,
        siteVisitsCompleted: 0,
        totalBookingsUnits: 0,
        totalBookingsValue: '₹0',
        assignedLeads: []
      };

      const updated = [newExec, ...salesExecutives];
      if (onUpdateSalesExecutives) onUpdateSalesExecutives(updated);
      if (onTriggerToast) onTriggerToast(`Sales Executive "${fullName}" registered successfully!`);
    }

    setIsCreateDrawerOpen(false);
    resetForm();
  };

  // Filtered Registry List
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
    if (!statusSearchQuery.trim()) return SALES_EXECUTIVE_LEAD_STATUSES;
    return SALES_EXECUTIVE_LEAD_STATUSES.filter(s =>
      s.name.toLowerCase().includes(statusSearchQuery.toLowerCase().trim())
    );
  }, [statusSearchQuery]);

  // Aggregate Metrics based on selected executive
  const activeExec = useMemo(() => {
    if (selectedExecutive === 'All Sales Executives') return null;
    return salesExecutives.find(e => e.name === selectedExecutive) || null;
  }, [selectedExecutive, salesExecutives]);

  const missedCount = activeExec ? activeExec.missedFollowupsCount : 34;
  const avgDelay = activeExec ? activeExec.avgDelayHours : '4.8 hrs';
  const siteScheduled = activeExec ? activeExec.siteVisitsScheduled : 5;
  const siteCompleted = activeExec ? activeExec.siteVisitsCompleted : 7;
  const bookingsCount = activeExec ? activeExec.totalBookingsUnits : 4;
  const bookingsValue = activeExec ? activeExec.totalBookingsValue : '₹1,80,00,000';

  return (
    <div className="sales-head-view">
      
      {/* ======================================================== */}
      {/* TOP COMPACT TOOLBAR                                      */}
      {/* ======================================================== */}
      <div className="sh-toolbar-card">
        
        {/* Left: Heading or Back Button */}
        {currentTab === 'dashboard' ? (
          <h2 className="sh-toolbar-heading">Sales Executive Dashboard</h2>
        ) : (
          <button
            type="button"
            className="btn-secondary"
            style={{ padding: '0.4rem 0.9rem', fontSize: '0.8rem', borderRadius: '9999px', display: 'inline-flex', alignItems: 'center', gap: '0.4rem', fontWeight: 600 }}
            onClick={() => setCurrentTab('dashboard')}
          >
            ← Overview Dashboard
          </button>
        )}

        {/* Right: Action or Filter Controls */}
        {currentTab === 'dashboard' ? (
          <div className="sh-filters-wrap">
            {/* Executive Filter */}
            <div className="sh-select-wrap">
              <select
                className="sh-select-pill"
                value={selectedExecutive}
                onChange={(e) => setSelectedExecutive(e.target.value)}
                title="Filter by Sales Executive"
              >
                <option value="All Sales Executives">All Sales Executives</option>
                {salesExecutives.map(exec => (
                  <option key={exec.id} value={exec.name}>{exec.name}</option>
                ))}
              </select>
              <LuChevronDown size={13} className="sh-select-arrow" />
            </div>

            {/* Solution Filter */}
            <div className="sh-select-wrap">
              <select
                className="sh-select-pill sh-select-pill-solution"
                value={selectedSolution}
                onChange={(e) => setSelectedSolution(e.target.value)}
                title="Filter by Solution"
              >
                {SALES_HEAD_PROJECTS.map(proj => (
                  <option key={proj} value={proj}>{proj}</option>
                ))}
              </select>
              <LuChevronDown size={13} className="sh-select-arrow" />
            </div>

            {/* Timeframe Filter */}
            <div className="sh-select-wrap">
              <select
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
              <LuChevronDown size={13} className="sh-select-arrow" />
            </div>

            {/* Switch to Registry CTA */}
            <button
              type="button"
              className="btn-primary"
              style={{ padding: '0.45rem 1rem', fontSize: '0.8rem', borderRadius: '9999px' }}
              onClick={() => setCurrentTab('registry')}
            >
              <LuUsers size={14} />
              <span>View Sales Executives</span>
            </button>
          </div>
        ) : (
          <div className="sh-filters-wrap">
            {/* Search Input for Registry */}
            <div className="search-box" style={{ width: '260px' }}>
              <LuSearch className="search-icon" />
              <input
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
        /* SUB-VIEW 1: SALES EXECUTIVE METRICS DASHBOARD            */
        /* ======================================================== */
        <>
          {/* ROW 1: Missed Follow-ups, Today's Follow-ups Due, Lead Quality Distribution */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1rem', marginBottom: '1rem' }}>
            
            {/* Card 1: Missed Follow-ups */}
            <div className="section-card" style={{ marginBottom: 0, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div className="section-header" style={{ marginBottom: '1rem' }}>
                  <div>
                    <h3 className="section-title">Missed Follow-ups</h3>
                    <div style={{ fontSize: '0.725rem', fontWeight: 700, color: '#557396', textTransform: 'uppercase', letterSpacing: '0.04em', marginTop: '0.15rem' }}>
                      SLA BREACHES & OVERDUE CALLS
                    </div>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    type="button"
                    onClick={() => setIsMissedFollowupsModalOpen(true)}
                    className="btn-secondary"
                    style={{ padding: '0.25rem 0.65rem', fontSize: '0.75rem', borderRadius: '9999px' }}
                  >
                    View All
                  </motion.button>
                </div>

                {/* Donut / Overdue Ring Centerpiece with smooth pulse animation */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '0.85rem 0 0.5rem 0' }}>
                  <motion.div
                    initial={{ scale: 0.92, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                    style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                  >
                    {/* Smooth radiating pulse halo ring */}
                    <motion.div
                      animate={{
                        scale: [1, 1.18, 1],
                        opacity: [0.35, 0.08, 0.35]
                      }}
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: 'easeInOut'
                      }}
                      style={{
                        position: 'absolute',
                        width: '136px',
                        height: '136px',
                        borderRadius: '50%',
                        border: '2px solid #EF4444',
                        pointerEvents: 'none'
                      }}
                    />

                    {/* Main Overdue Ring */}
                    <motion.div
                      whileHover={{ scale: 1.04, boxShadow: '0 8px 25px rgba(239, 68, 68, 0.28)' }}
                      whileTap={{ scale: 0.98 }}
                      transition={{ type: 'spring', stiffness: 350, damping: 22 }}
                      onClick={() => setIsMissedFollowupsModalOpen(true)}
                      style={{
                        width: '120px',
                        height: '120px',
                        borderRadius: '50%',
                        background: 'radial-gradient(circle, #FFFFFF 62%, #FEE2E2 63%, #FEF2F2 100%)',
                        border: '4px solid #EF4444',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: '0 4px 16px rgba(239, 68, 68, 0.18)',
                        cursor: 'pointer',
                        position: 'relative',
                        zIndex: 2
                      }}
                      title="Click to view missed follow-ups"
                    >
                      <motion.span
                        key={missedCount}
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                        style={{ fontSize: '1.85rem', fontWeight: 800, color: '#0F1A34', lineHeight: 1 }}
                      >
                        {missedCount}
                      </motion.span>
                      <span style={{ fontSize: '0.7rem', fontWeight: 800, color: '#DC2626', letterSpacing: '0.05em', marginTop: '0.2rem' }}>
                        OVERDUE
                      </span>
                    </motion.div>
                  </motion.div>

                  {/* Delay Pill with pulsing indicator */}
                  <motion.div
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.35, delay: 0.15 }}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.45rem',
                      background: '#F8FAFC',
                      border: '1px solid #E2E8F0',
                      padding: '0.35rem 0.85rem',
                      borderRadius: '9999px',
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      color: '#0F1A34',
                      marginTop: '0.9rem'
                    }}
                  >
                    <motion.span
                      animate={{ opacity: [1, 0.25, 1], scale: [1, 1.25, 1] }}
                      transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
                      style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#EF4444', display: 'inline-block' }}
                    />
                    <span>Avg. Delay: {avgDelay}</span>
                  </motion.div>
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.015, boxShadow: '0 4px 14px rgba(0, 34, 255, 0.3)' }}
                whileTap={{ scale: 0.985 }}
                transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                type="button"
                className="btn-primary"
                style={{
                  width: '100%',
                  padding: '0.65rem 1rem',
                  borderRadius: '9999px',
                  marginTop: '0.85rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  textAlign: 'center',
                  fontSize: '0.85rem',
                  fontWeight: 700
                }}
                onClick={() => setIsMissedFollowupsModalOpen(true)}
              >
                Resolve Now
              </motion.button>
            </div>

            {/* Card 2: Today's Follow-ups Due */}
            <div className="section-card" style={{ marginBottom: 0, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div className="section-header" style={{ marginBottom: '0.85rem' }}>
                  <div>
                    <h3 className="section-title">Today's Follow-ups Due</h3>
                    <div style={{ fontSize: '0.725rem', fontWeight: 700, color: '#557396', textTransform: 'uppercase', letterSpacing: '0.04em', marginTop: '0.15rem' }}>
                      SCHEDULED OUTREACH FOR TODAY
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsTodayFollowupsModalOpen(true)}
                    className="btn-secondary"
                    style={{ padding: '0.25rem 0.65rem', fontSize: '0.75rem', borderRadius: '9999px' }}
                  >
                    View All
                  </button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                  {SALES_EXECUTIVE_TODAY_FOLLOWUPS.slice(0, 3).map((fup) => (
                    <div
                      key={fup.id}
                      style={{
                        padding: '0.75rem',
                        background: '#F8FAFC',
                        border: '1px solid #E2E8F0',
                        borderRadius: '10px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: '0.5rem'
                      }}
                    >
                      <div style={{ minWidth: 0 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                          <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#0F1A34', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {fup.leadName}
                          </span>
                          <span style={{ fontSize: '0.7rem', padding: '0.15rem 0.45rem', borderRadius: '4px', background: fup.priority === 'Critical' ? '#FEE2E2' : '#E0F2FE', color: fup.priority === 'Critical' ? '#DC2626' : '#0369A1', fontWeight: 700 }}>
                            {fup.type}
                          </span>
                        </div>
                        <div style={{ fontSize: '0.75rem', color: '#557396', marginTop: '0.15rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {fup.company}
                        </div>
                      </div>

                      <div style={{ textAlign: 'right', flexShrink: 0 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.75rem', fontWeight: 700, color: '#0F1A34' }}>
                          <LuClock size={12} color="#557396" />
                          <span>{fup.time}</span>
                        </div>
                        <a
                          href={`tel:${fup.phone}`}
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.25rem',
                            fontSize: '0.7rem',
                            color: '#0284C7',
                            fontWeight: 700,
                            textDecoration: 'none',
                            marginTop: '0.2rem'
                          }}
                        >
                          <LuPhoneCall size={11} />
                          <span>Call</span>
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ fontSize: '0.75rem', color: '#557396', textAlign: 'center', paddingTop: '0.75rem', borderTop: '1px dashed #E2E8F0', marginTop: '0.75rem' }}>
                4 Follow-ups scheduled for today • 2 High priority
              </div>
            </div>

            {/* Card 3: Lead Quality Distribution */}
            <div className="section-card" style={{ marginBottom: 0, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100%' }}>
              <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
                <div className="section-header" style={{ marginBottom: '0.5rem' }}>
                  <div>
                    <h3 className="section-title">Lead Quality Distribution</h3>
                    <div style={{ fontSize: '0.725rem', fontWeight: 700, color: '#557396', textTransform: 'uppercase', letterSpacing: '0.04em', marginTop: '0.15rem' }}>
                      ASSIGNED LEADS SEGMENTATION
                    </div>
                  </div>
                </div>

                {/* Lead Quality Bars - flex to fill card height */}
                <div style={{ flex: 1, minHeight: '200px', width: '100%', marginTop: '0.5rem' }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={SALES_EXECUTIVE_QUALITY_DISTRIBUTION} margin={{ top: 15, right: 10, left: -25, bottom: 0 }}>
                      <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#557396', fontWeight: 600 }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fontSize: 10, fill: '#557396' }} axisLine={false} tickLine={false} />
                      <Tooltip
                        contentStyle={{ background: '#0F1A34', borderRadius: '8px', border: 'none', color: '#fff', fontSize: '0.75rem' }}
                        formatter={(val) => [`${val} Leads`, 'Count']}
                      />
                      <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                        {SALES_EXECUTIVE_QUALITY_DISTRIBUTION.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem', marginTop: '0.75rem' }}>
                  <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', padding: '0.5rem', borderRadius: '8px', textAlign: 'center' }}>
                    <div style={{ fontSize: '0.7rem', color: '#557396', fontWeight: 700 }}>Total</div>
                    <div style={{ fontSize: '1rem', fontWeight: 800, color: '#0F1A34' }}>27</div>
                  </div>
                  <div style={{ background: '#FEF2F2', border: '1px solid #FECACA', padding: '0.5rem', borderRadius: '8px', textAlign: 'center' }}>
                    <div style={{ fontSize: '0.7rem', color: '#DC2626', fontWeight: 700 }}>Hot (81%)</div>
                    <div style={{ fontSize: '1rem', fontWeight: 800, color: '#DC2626' }}>22</div>
                  </div>
                  <div style={{ background: '#EFF6FF', border: '1px solid #BFDBFE', padding: '0.5rem', borderRadius: '8px', textAlign: 'center' }}>
                    <div style={{ fontSize: '0.7rem', color: '#2563EB', fontWeight: 700 }}>Warm (19%)</div>
                    <div style={{ fontSize: '1rem', fontWeight: 800, color: '#2563EB' }}>5</div>
                  </div>
                </div>
              </div>

              <div style={{ fontSize: '0.75rem', color: '#557396', textAlign: 'center', paddingTop: '0.75rem', borderTop: '1px dashed #E2E8F0', marginTop: '0.75rem' }}>
                81% High Priority • Strong pipeline conversion readiness
              </div>
            </div>

          </div>

          {/* ROW 2: Leads by Status & Site Visit Overview */}
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
            
            {/* Card 4: Leads by Status */}
            <div className="section-card" style={{ marginBottom: 0 }}>
              <div className="section-header" style={{ marginBottom: '1rem' }}>
                <div>
                  <h3 className="section-title">Leads by Status</h3>
                  <div style={{ fontSize: '0.725rem', fontWeight: 700, color: '#557396', textTransform: 'uppercase', letterSpacing: '0.04em', marginTop: '0.15rem' }}>
                    ACTIVE PIPELINE STAGE CONVERSIONS
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setIsLeadStatusesModalOpen(true)}
                  className="btn-secondary"
                  style={{ padding: '0.25rem 0.65rem', fontSize: '0.75rem', borderRadius: '9999px' }}
                >
                  View Pipeline
                </button>
              </div>

              {/* Status Flow Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '0.65rem' }}>
                {SALES_EXECUTIVE_LEAD_STATUSES.map((st) => (
                  <div
                    key={st.id}
                    style={{
                      background: '#F8FAFC',
                      border: '1px solid #E2E8F0',
                      borderRadius: '10px',
                      padding: '0.75rem 0.65rem',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      position: 'relative',
                      overflow: 'hidden'
                    }}
                  >
                    <div style={{ width: '100%', height: '3px', background: st.color, position: 'absolute', top: 0, left: 0 }} />
                    <div style={{ fontSize: '0.675rem', fontWeight: 800, color: '#557396', textTransform: 'uppercase', letterSpacing: '0.03em' }}>
                      {st.name}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginTop: '0.5rem' }}>
                      <span style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0F1A34' }}>{st.count}</span>
                      <span style={{ fontSize: '0.7rem', fontWeight: 700, color: st.color }}>{st.percentage}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Card 5: Site Visit Overview */}
            <div className="section-card" style={{ marginBottom: 0, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div className="section-header" style={{ marginBottom: '1rem' }}>
                  <div>
                    <h3 className="section-title">Site Visit Overview</h3>
                    <div style={{ fontSize: '0.725rem', fontWeight: 700, color: '#557396', textTransform: 'uppercase', letterSpacing: '0.04em', marginTop: '0.15rem' }}>
                      DEMOS & FIELD APPOINTMENTS
                    </div>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                  <div style={{
                    background: '#F8FAFC',
                    border: '1px solid #E2E8F0',
                    borderRadius: '10px',
                    padding: '1rem',
                    textAlign: 'center'
                  }}>
                    <div style={{ fontSize: '0.7rem', fontWeight: 800, color: '#0284C7', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                      SCHEDULED
                    </div>
                    <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0F1A34', marginTop: '0.25rem' }}>
                      {siteScheduled}
                    </div>
                  </div>

                  <div style={{
                    background: '#F0FDF4',
                    border: '1px solid #DCFCE7',
                    borderRadius: '10px',
                    padding: '1rem',
                    textAlign: 'center'
                  }}>
                    <div style={{ fontSize: '0.7rem', fontWeight: 800, color: '#166534', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                      COMPLETED
                    </div>
                    <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#15803D', marginTop: '0.25rem' }}>
                      {siteCompleted}
                    </div>
                  </div>
                </div>
              </div>

              <button
                type="button"
                className="btn-secondary"
                style={{ width: '100%', padding: '0.55rem', borderRadius: '8px', fontSize: '0.8rem', marginTop: '0.75rem' }}
                onClick={() => setIsSiteVisitsModalOpen(true)}
              >
                View Visit Schedule
              </button>
            </div>

          </div>

          {/* ROW 3: Site Visits Today, Recent Objections, Total Bookings */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1rem' }}>
            
            {/* Card 6: Site Visits Today */}
            <div className="section-card" style={{ marginBottom: 0, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div className="section-header" style={{ marginBottom: '0.85rem' }}>
                  <div>
                    <h3 className="section-title">Site Visits Today</h3>
                    <div style={{ fontSize: '0.725rem', fontWeight: 700, color: '#557396', textTransform: 'uppercase', letterSpacing: '0.04em', marginTop: '0.15rem' }}>
                      FIELD VISITS & PRODUCT DEMOS
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsSiteVisitsModalOpen(true)}
                    className="btn-secondary"
                    style={{ padding: '0.25rem 0.65rem', fontSize: '0.75rem', borderRadius: '9999px' }}
                  >
                    View All
                  </button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                  {SALES_EXECUTIVE_SITE_VISITS_TODAY.map((v) => (
                    <div
                      key={v.id}
                      style={{
                        padding: '0.75rem',
                        background: '#F8FAFC',
                        border: '1px solid #E2E8F0',
                        borderRadius: '10px',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '0.35rem'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#0F1A34' }}>
                          {v.company}
                        </span>
                        <span style={{
                          fontSize: '0.675rem',
                          padding: '0.15rem 0.5rem',
                          borderRadius: '9999px',
                          fontWeight: 700,
                          background: v.status === 'Completed' ? '#DCFCE7' : '#E0F2FE',
                          color: v.status === 'Completed' ? '#15803D' : '#0369A1'
                        }}>
                          {v.status}
                        </span>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.75rem', color: '#557396' }}>
                        <LuClock size={12} />
                        <span>{v.time}</span>
                        <span>•</span>
                        <span>{v.executive}</span>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.725rem', color: '#0284C7', fontWeight: 600 }}>
                        <LuMapPin size={12} />
                        <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{v.location}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Card 7: Recent Objections */}
            <div className="section-card" style={{ marginBottom: 0, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div className="section-header" style={{ marginBottom: '0.85rem' }}>
                  <div>
                    <h3 className="section-title">Recent Objections</h3>
                    <div style={{ fontSize: '0.725rem', fontWeight: 700, color: '#557396', textTransform: 'uppercase', letterSpacing: '0.04em', marginTop: '0.15rem' }}>
                      AI BATTLECARDS & RESOLUTIONS
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsObjectionsModalOpen(true)}
                    className="btn-secondary"
                    style={{ padding: '0.25rem 0.65rem', fontSize: '0.75rem', borderRadius: '9999px' }}
                  >
                    View All
                  </button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                  {SALES_EXECUTIVE_OBJECTIONS.map((obj) => (
                    <div
                      key={obj.id}
                      style={{
                        padding: '0.75rem',
                        background: '#F8FAFC',
                        border: '1px solid #E2E8F0',
                        borderRadius: '10px',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '0.35rem'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#0F1A34' }}>
                          {obj.customer}
                        </span>
                        <span style={{
                          fontSize: '0.675rem',
                          padding: '0.15rem 0.5rem',
                          borderRadius: '9999px',
                          fontWeight: 700,
                          background: obj.status === 'Resolved' ? '#DCFCE7' : '#FEF3C7',
                          color: obj.status === 'Resolved' ? '#15803D' : '#B45309'
                        }}>
                          {obj.status}
                        </span>
                      </div>

                      <div style={{ fontSize: '0.775rem', fontWeight: 600, color: '#DC2626' }}>
                        ⚠ {obj.objection}
                      </div>

                      <div style={{ fontSize: '0.725rem', color: '#557396', background: '#FFFFFF', padding: '0.35rem 0.5rem', borderRadius: '6px', border: '1px solid #E2E8F0' }}>
                        💡 {obj.solution}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Card 8: Total Bookings (TechGy Navy Theme) */}
            <div
              style={{
                background: 'linear-gradient(135deg, #0F1A34 0%, #0022FF 100%)',
                color: '#FFFFFF',
                borderRadius: '12px',
                padding: '1.25rem',
                boxShadow: '0 4px 14px rgba(6, 54, 105, 0.25)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                position: 'relative',
                overflow: 'hidden'
              }}
            >
              <div style={{ position: 'absolute', top: '-20px', right: '-20px', width: '120px', height: '120px', borderRadius: '50%', background: 'rgba(255, 255, 255, 0.05)' }} />

              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                  <div>
                    <h3 style={{ fontSize: '1rem', fontWeight: 800, color: '#FFFFFF', margin: 0 }}>Total Bookings</h3>
                    <div style={{ fontSize: '0.7rem', fontWeight: 700, color: '#93C5FD', textTransform: 'uppercase', letterSpacing: '0.04em', marginTop: '0.15rem' }}>
                      MONTHLY QUOTA & REVENUE
                    </div>
                  </div>
                  <span style={{ fontSize: '0.7rem', background: 'rgba(255,255,255,0.15)', padding: '0.2rem 0.6rem', borderRadius: '9999px', color: '#FFFFFF', fontWeight: 700 }}>
                    FY26 Target
                  </span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '1rem 0' }}>
                  <div style={{
                    width: '110px',
                    height: '110px',
                    borderRadius: '50%',
                    border: '4px solid #38BDF8',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 0 20px rgba(56, 189, 248, 0.3)'
                  }}>
                    <span style={{ fontSize: '2.25rem', fontWeight: 800, color: '#FFFFFF', lineHeight: 1 }}>{bookingsCount}</span>
                    <span style={{ fontSize: '0.675rem', fontWeight: 800, color: '#93C5FD', letterSpacing: '0.05em', marginTop: '0.2rem' }}>UNITS</span>
                  </div>

                  <div style={{ marginTop: '0.75rem', textAlign: 'center' }}>
                    <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#FFFFFF' }}>{bookingsValue}</div>
                    <div style={{ fontSize: '0.725rem', color: '#93C5FD', fontWeight: 600 }}>Closed Enterprise Value</div>
                  </div>
                </div>
              </div>

              <button
                type="button"
                style={{
                  width: '100%',
                  padding: '0.6rem',
                  borderRadius: '8px',
                  background: '#FFFFFF',
                  color: '#0F1A34',
                  border: 'none',
                  fontWeight: 800,
                  fontSize: '0.8rem',
                  cursor: 'pointer',
                  boxShadow: '0 2px 6px rgba(0,0,0,0.1)'
                }}
                onClick={() => setIsBookingsModalOpen(true)}
              >
                View Closed Deals
              </button>
            </div>

          </div>
        </>
      ) : (
        /* ======================================================== */
        /* SUB-VIEW 2: SALES EXECUTIVES REGISTRY & DIRECTORY        */
        /* ======================================================== */
        <div className="section-card" style={{ marginBottom: 0 }}>
          <div className="section-header" style={{ marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.75rem' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <h3 className="section-title">Active Experience Managers & Sales Executives</h3>
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
              <div style={{ fontSize: '0.78rem', color: '#557396', marginTop: '0.2rem' }}>
                Manage sales executives registry, territory assignment, and monitor assigned leads.
              </div>
            </div>

            <button
              type="button"
              className="btn-primary"
              style={{ padding: '0.5rem 1.1rem', fontSize: '0.825rem', borderRadius: '8px' }}
              onClick={handleOpenCreateDrawer}
            >
              <LuPlus size={15} />
              <span>Create Sales Executive</span>
            </button>
          </div>

          {/* Table */}
          <div style={{ overflowX: 'auto', width: '100%' }}>
            <table className="action-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  <th
                    style={{ cursor: 'pointer', textAlign: 'left' }}
                    onClick={() => {
                      if (sortField === 'name') setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
                      else { setSortField('name'); setSortOrder('asc'); }
                    }}
                  >
                    EXECUTIVE NAME {sortField === 'name' ? (sortOrder === 'asc' ? '↑' : '↓') : '↕'}
                  </th>
                  <th style={{ textAlign: 'left' }}>CONTACT INFO</th>
                  <th style={{ textAlign: 'left' }}>SOLUTION / VERTICAL</th>
                  <th style={{ textAlign: 'left' }}>REPORTING SALES HEAD</th>
                  <th
                    style={{ cursor: 'pointer', textAlign: 'left' }}
                    onClick={() => {
                      if (sortField === 'creationDate') setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
                      else { setSortField('creationDate'); setSortOrder('desc'); }
                    }}
                  >
                    JOINING DATE {sortField === 'creationDate' ? (sortOrder === 'asc' ? '↑' : '↓') : '↓'}
                  </th>
                  <th style={{ textAlign: 'center' }}>ASSIGNED LEADS</th>
                  <th style={{ textAlign: 'right' }}>ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {filteredSalesExecutives.length === 0 ? (
                  <tr>
                    <td colSpan={7} style={{ padding: '3rem', textAlign: 'center', color: '#557396' }}>
                      <LuUsers size={32} style={{ marginBottom: '0.5rem', opacity: 0.4 }} />
                      <div style={{ fontWeight: 700, fontSize: '0.95rem', color: '#0F1A34' }}>No sales executives found</div>
                      <div style={{ fontSize: '0.8rem', marginTop: '0.25rem' }}>Try adjusting your search criteria or register a new sales executive.</div>
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
                              fontWeight: 800,
                              fontSize: '0.8rem',
                              flexShrink: 0
                            }}
                          >
                            {exec.initials}
                          </div>
                          <div>
                            <div style={{ fontWeight: 700, color: '#0F1A34', fontSize: '0.88rem' }}>
                              {exec.name}
                            </div>
                            <div style={{ fontSize: '0.72rem', color: '#557396' }}>
                              {exec.role}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Contact Info */}
                      <td style={{ verticalAlign: 'middle' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.15rem' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.8rem', color: '#334155' }}>
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
                        <span style={{ fontSize: '0.825rem', fontWeight: 600, color: '#0F1A34' }}>
                          {exec.project}
                        </span>
                      </td>

                      {/* Reporting Head */}
                      <td style={{ verticalAlign: 'middle' }}>
                        <span style={{ fontSize: '0.825rem', fontWeight: 700, color: '#0022FF' }}>
                          {exec.reportingSalesHead || 'Rajesh Sharma'}
                        </span>
                      </td>

                      {/* Creation Date */}
                      <td style={{ verticalAlign: 'middle' }}>
                        <span style={{ fontSize: '0.825rem', color: '#557396' }}>
                          {exec.creationDate}
                        </span>
                      </td>

                      {/* Assigned Leads */}
                      <td style={{ verticalAlign: 'middle', textAlign: 'center' }}>
                        <button
                          type="button"
                          className="btn-secondary"
                          style={{
                            padding: '0.2rem 0.65rem',
                            fontSize: '0.8rem',
                            fontWeight: 800,
                            borderRadius: '9999px',
                            color: '#0F1A34',
                            display: 'inline-flex'
                          }}
                          onClick={() => setAssignedModalData(exec)}
                          title="View Assigned Leads"
                        >
                          <span>{exec.assignedLeadsCount || (exec.assignedLeads ? exec.assignedLeads.length : 0)} Leads</span>
                        </button>
                      </td>

                      {/* Actions */}
                      <td style={{ verticalAlign: 'middle', textAlign: 'right' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '0.4rem' }}>
                          <button
                            type="button"
                            className="btn-secondary"
                            style={{ padding: '0.35rem', borderRadius: '6px' }}
                            onClick={() => handleOpenEditModal(exec)}
                            title="Edit details"
                          >
                            <LuPencil size={14} />
                          </button>
                          <button
                            type="button"
                            className="btn-secondary"
                            style={{ padding: '0.35rem', borderRadius: '6px' }}
                            onClick={() => setAssignedModalData(exec)}
                            title="View assigned leads"
                          >
                            <LuUserPlus size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* DRAWER: CREATE / EDIT SALES EXECUTIVE                    */}
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
            <motion.div
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
                    {editingExecutive ? 'Edit Sales Executive' : 'Create Sales Executive'}
                  </h3>
                  <div style={{ fontSize: '0.78rem', color: '#557396', marginTop: '0.2rem' }}>
                    {editingExecutive ? 'Update executive assignments and territory' : 'Register a new sales executive or experience manager'}
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
                    <input
                      type="text"
                      className="search-input"
                      style={{ width: '100%', padding: '0.55rem 0.75rem', borderRadius: '8px', border: formErrors.firstName ? '1px solid #DC2626' : '1px solid #D5E2EE' }}
                      placeholder="Vikram"
                      value={formFirstName}
                      onChange={(e) => setFormFirstName(e.target.value)}
                    />
                    {formErrors.firstName && <span style={{ fontSize: '0.7rem', color: '#DC2626' }}>{formErrors.firstName}</span>}
                  </div>

                  <div className="drawer-field-group" style={{ marginBottom: 0 }}>
                    <label className="field-label">LAST NAME</label>
                    <input
                      type="text"
                      className="search-input"
                      style={{ width: '100%', padding: '0.55rem 0.75rem', borderRadius: '8px', border: formErrors.lastName ? '1px solid #DC2626' : '1px solid #D5E2EE' }}
                      placeholder="Singh"
                      value={formLastName}
                      onChange={(e) => setFormLastName(e.target.value)}
                    />
                    {formErrors.lastName && <span style={{ fontSize: '0.7rem', color: '#DC2626' }}>{formErrors.lastName}</span>}
                  </div>
                </div>

                {/* Role / Designation */}
                <div className="drawer-field-group" style={{ marginBottom: 0 }}>
                  <label className="field-label">DESIGNATION / ROLE</label>
                  <input
                    type="text"
                    className="search-input"
                    style={{ width: '100%', padding: '0.55rem 0.75rem', borderRadius: '8px', border: '1px solid #D5E2EE' }}
                    placeholder="Senior Enterprise Sales Executive"
                    value={formRole}
                    onChange={(e) => setFormRole(e.target.value)}
                  />
                </div>

                {/* Email Address */}
                <div className="drawer-field-group" style={{ marginBottom: 0 }}>
                  <label className="field-label">CORPORATE EMAIL ADDRESS</label>
                  <input
                    type="email"
                    className="search-input"
                    style={{ width: '100%', padding: '0.55rem 0.75rem', borderRadius: '8px', border: formErrors.email ? '1px solid #DC2626' : '1px solid #D5E2EE' }}
                    placeholder="vikram.s@techgy.com"
                    value={formEmail}
                    onChange={(e) => setFormEmail(e.target.value)}
                  />
                  {formErrors.email && <span style={{ fontSize: '0.7rem', color: '#DC2626' }}>{formErrors.email}</span>}
                </div>

                {/* Contact Phone */}
                <div className="drawer-field-group" style={{ marginBottom: 0 }}>
                  <label className="field-label">CONTACT NUMBER</label>
                  <input
                    type="tel"
                    className="search-input"
                    style={{ width: '100%', padding: '0.55rem 0.75rem', borderRadius: '8px', border: formErrors.phone ? '1px solid #DC2626' : '1px solid #D5E2EE' }}
                    placeholder="+91 98765 43210"
                    value={formPhone}
                    onChange={(e) => setFormPhone(e.target.value)}
                  />
                  {formErrors.phone && <span style={{ fontSize: '0.7rem', color: '#DC2626' }}>{formErrors.phone}</span>}
                </div>

                {/* Solution / Vertical Dropdown */}
                <div className="drawer-field-group" style={{ marginBottom: 0 }}>
                  <label className="field-label">ASSIGNED SOLUTION / VERTICAL</label>
                  <select
                    className="select-filter"
                    style={{ width: '100%', padding: '0.55rem 0.75rem', borderRadius: '8px' }}
                    value={formProject}
                    onChange={(e) => setFormProject(e.target.value)}
                  >
                    {SALES_HEAD_PROJECTS.filter(p => p !== 'All Solutions').map(p => (
                      <option key={p} value={p}>{p}</option>
                    ))}
                  </select>
                </div>

                {/* Reporting Sales Head */}
                <div className="drawer-field-group" style={{ marginBottom: 0 }}>
                  <label className="field-label">REPORTING SALES HEAD (MANAGER)</label>
                  <select
                    className="select-filter"
                    style={{ width: '100%', padding: '0.55rem 0.75rem', borderRadius: '8px' }}
                    value={formReportingHead}
                    onChange={(e) => setFormReportingHead(e.target.value)}
                  >
                    {salesHeads.map(sh => (
                      <option key={sh.id} value={sh.name}>{sh.name} ({sh.role})</option>
                    ))}
                  </select>
                </div>

              </div>

              <div className="drawer-footer">
                <button
                  type="button"
                  className="btn-secondary"
                  style={{ padding: '0.6rem 1.25rem', fontSize: '0.85rem', borderRadius: '8px', fontWeight: 600 }}
                  onClick={() => setIsCreateDrawerOpen(false)}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn-primary"
                  style={{ padding: '0.6rem 1.5rem', fontSize: '0.85rem', borderRadius: '8px', fontWeight: 700 }}
                  onClick={handleSaveExecutive}
                >
                  {editingExecutive ? 'Save Changes' : 'Create Sales Executive'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ======================================================== */}
      {/* ======================================================== */}
      {/* MODAL: ASSIGNED LEADS DIRECTORY                          */}
      {/* ======================================================== */}
      <AnimatePresence>
        {assignedModalData && (
          <motion.div
            className="modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setAssignedModalData(null)}
            style={{ zIndex: 10000 }}
          >
            <motion.div
              className="modal-card"
              initial={{ scale: 0.95, opacity: 0, y: 10 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 10 }}
              onClick={(e) => e.stopPropagation()}
              style={{ maxWidth: '640px', width: '92%', background: '#FFFFFF', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 25px 50px -12px rgba(6, 54, 105, 0.25)', display: 'flex', flexDirection: 'column' }}
            >
              <div className="modal-header" style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid #E2E8F0', background: '#F8FAFC', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
                <div>
                  <h3 className="section-title" style={{ margin: 0 }}>
                    Assigned Leads: {assignedModalData.name}
                  </h3>
                  <div style={{ fontSize: '0.78rem', color: '#557396', marginTop: '0.2rem' }}>
                    {assignedModalData.role} • {assignedModalData.project}
                  </div>
                </div>
                <button
                  type="button"
                  className="modal-close-btn"
                  onClick={() => setAssignedModalData(null)}
                >
                  <LuX size={18} />
                </button>
              </div>

              <div className="modal-body" style={{ padding: '1.25rem 1.5rem', maxHeight: '55vh', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.75rem', background: '#FFFFFF' }}>
                {(!assignedModalData.assignedLeads || assignedModalData.assignedLeads.length === 0) ? (
                  <div style={{ textAlign: 'center', padding: '2.5rem 1rem', color: '#557396' }}>
                    <LuUsers size={32} style={{ opacity: 0.4, marginBottom: '0.5rem' }} />
                    <div style={{ fontWeight: 700, color: '#0F1A34' }}>No leads assigned yet</div>
                    <div style={{ fontSize: '0.8rem', marginTop: '0.25rem' }}>Assign active pipeline leads to this executive from the Leads module.</div>
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    {assignedModalData.assignedLeads.map((lead) => (
                      <div
                        key={lead.id}
                        style={{
                          padding: '0.85rem',
                          background: '#F8FAFC',
                          border: '1px solid #E2E8F0',
                          borderRadius: '10px',
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
                          <div style={{ fontSize: '0.75rem', color: '#557396', marginTop: '0.15rem' }}>
                            {lead.company}
                          </div>
                          <div style={{ fontSize: '0.725rem', color: '#0284C7', fontWeight: 600, marginTop: '0.2rem' }}>
                            Next: {lead.nextFollowup}
                          </div>
                        </div>

                        <div style={{ textAlign: 'right' }}>
                          <div style={{ fontSize: '0.875rem', fontWeight: 800, color: '#0F1A34' }}>
                            {lead.value}
                          </div>
                          <span style={{
                            fontSize: '0.675rem',
                            padding: '0.15rem 0.5rem',
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

              <div className="modal-footer" style={{ padding: '1rem 1.5rem', borderTop: '1px solid #E2E8F0', background: '#FFFFFF', display: 'flex', justifyContent: 'flex-end', margin: 0, flexShrink: 0 }}>
                <button
                  type="button"
                  className="btn-secondary"
                  style={{ padding: '0.5rem 1.25rem', fontSize: '0.85rem', borderRadius: '8px', fontWeight: 600 }}
                  onClick={() => setAssignedModalData(null)}
                >
                  Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ======================================================== */}
      {/* MODAL: MISSED FOLLOW-UPS RESOLUTION                      */}
      {/* ======================================================== */}
      <AnimatePresence>
        {isMissedFollowupsModalOpen && (
          <motion.div
            className="modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsMissedFollowupsModalOpen(false)}
            style={{ zIndex: 10000 }}
          >
            <motion.div
              className="modal-card"
              initial={{ scale: 0.95, opacity: 0, y: 10 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 10 }}
              onClick={(e) => e.stopPropagation()}
              style={{ maxWidth: '620px', width: '92%', background: '#FFFFFF', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 25px 50px -12px rgba(6, 54, 105, 0.25)', display: 'flex', flexDirection: 'column' }}
            >
              <div className="modal-header" style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid #E2E8F0', background: '#F8FAFC', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
                <div>
                  <h3 className="section-title" style={{ margin: 0 }}>
                    Missed Follow-ups Resolution
                  </h3>
                  <div style={{ fontSize: '0.78rem', color: '#557396', marginTop: '0.2rem' }}>
                    Priority outreach backlog requiring immediate contact
                  </div>
                </div>
                <button
                  type="button"
                  className="modal-close-btn"
                  onClick={() => setIsMissedFollowupsModalOpen(false)}
                >
                  <LuX size={18} />
                </button>
              </div>

              <div className="modal-body" style={{ padding: '1.25rem 1.5rem', maxHeight: '55vh', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.75rem', background: '#FFFFFF' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {SALES_EXECUTIVE_MISSED_FOLLOWUPS.map((item) => (
                    <div
                      key={item.id}
                      style={{
                        padding: '0.85rem',
                        background: '#FEF2F2',
                        border: '1px solid #FEE2E2',
                        borderRadius: '10px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: '0.75rem'
                      }}
                    >
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <span style={{ fontWeight: 700, color: '#0F1A34', fontSize: '0.875rem' }}>
                            {item.leadName}
                          </span>
                          <span style={{ fontSize: '0.675rem', background: '#DC2626', color: '#FFFFFF', padding: '0.1rem 0.4rem', borderRadius: '4px', fontWeight: 800 }}>
                            {item.overdueTime}
                          </span>
                        </div>
                        <div style={{ fontSize: '0.75rem', color: '#557396', marginTop: '0.15rem' }}>
                          {item.company} • Rep: {item.executive}
                        </div>
                        <div style={{ fontSize: '0.725rem', color: '#991B1B', marginTop: '0.25rem' }}>
                          {item.subject}
                        </div>
                      </div>

                      <div style={{ display: 'flex', gap: '0.4rem', flexShrink: 0 }}>
                        <a
                          href={`tel:${item.phone}`}
                          className="btn-primary"
                          style={{ padding: '0.35rem 0.75rem', fontSize: '0.75rem', borderRadius: '6px', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}
                        >
                          <LuPhoneCall size={12} />
                          <span>Call</span>
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="modal-footer" style={{ padding: '1rem 1.5rem', borderTop: '1px solid #E2E8F0', background: '#FFFFFF', display: 'flex', justifyContent: 'flex-end', margin: 0, flexShrink: 0 }}>
                <button
                  type="button"
                  className="btn-secondary"
                  style={{ padding: '0.5rem 1.25rem', fontSize: '0.85rem', borderRadius: '8px', fontWeight: 600 }}
                  onClick={() => setIsMissedFollowupsModalOpen(false)}
                >
                  Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ======================================================== */}
      {/* MODAL: TODAY'S FOLLOW-UPS MODAL                          */}
      {/* ======================================================== */}
      <AnimatePresence>
        {isTodayFollowupsModalOpen && (
          <motion.div
            className="modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsTodayFollowupsModalOpen(false)}
            style={{ zIndex: 10000 }}
          >
            <motion.div
              className="modal-card"
              initial={{ scale: 0.95, opacity: 0, y: 10 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 10 }}
              onClick={(e) => e.stopPropagation()}
              style={{ maxWidth: '620px', width: '92%', background: '#FFFFFF', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 25px 50px -12px rgba(6, 54, 105, 0.25)', display: 'flex', flexDirection: 'column' }}
            >
              <div className="modal-header" style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid #E2E8F0', background: '#F8FAFC', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
                <div>
                  <h3 className="section-title" style={{ margin: 0 }}>
                    Today's Scheduled Follow-ups
                  </h3>
                  <div style={{ fontSize: '0.78rem', color: '#557396', marginTop: '0.2rem' }}>
                    All client meetings and calls scheduled for today
                  </div>
                </div>
                <button
                  type="button"
                  className="modal-close-btn"
                  onClick={() => setIsTodayFollowupsModalOpen(false)}
                >
                  <LuX size={18} />
                </button>
              </div>

              <div className="modal-body" style={{ padding: '1.25rem 1.5rem', maxHeight: '55vh', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.75rem', background: '#FFFFFF' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {SALES_EXECUTIVE_TODAY_FOLLOWUPS.map((fup) => (
                    <div
                      key={fup.id}
                      style={{
                        padding: '0.85rem',
                        background: '#F8FAFC',
                        border: '1px solid #E2E8F0',
                        borderRadius: '10px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: '0.75rem'
                      }}
                    >
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <span style={{ fontWeight: 700, color: '#0F1A34', fontSize: '0.875rem' }}>
                            {fup.leadName}
                          </span>
                          <span style={{ fontSize: '0.675rem', background: '#E0F2FE', color: '#0369A1', padding: '0.1rem 0.4rem', borderRadius: '4px', fontWeight: 800 }}>
                            {fup.type}
                          </span>
                        </div>
                        <div style={{ fontSize: '0.75rem', color: '#557396', marginTop: '0.15rem' }}>
                          {fup.company} • Rep: {fup.executive}
                        </div>
                        <div style={{ fontSize: '0.725rem', color: '#0284C7', marginTop: '0.25rem' }}>
                          {fup.subject}
                        </div>
                      </div>

                      <div style={{ textAlign: 'right', flexShrink: 0 }}>
                        <div style={{ fontSize: '0.8rem', fontWeight: 800, color: '#0F1A34' }}>
                          {fup.time}
                        </div>
                        <a
                          href={`tel:${fup.phone}`}
                          className="btn-secondary"
                          style={{ padding: '0.25rem 0.65rem', fontSize: '0.75rem', borderRadius: '6px', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.3rem', marginTop: '0.35rem' }}
                        >
                          <LuPhoneCall size={12} />
                          <span>Call</span>
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="modal-footer" style={{ padding: '1rem 1.5rem', borderTop: '1px solid #E2E8F0', background: '#FFFFFF', display: 'flex', justifyContent: 'flex-end', margin: 0, flexShrink: 0 }}>
                <button
                  type="button"
                  className="btn-secondary"
                  style={{ padding: '0.5rem 1.25rem', fontSize: '0.85rem', borderRadius: '8px', fontWeight: 600 }}
                  onClick={() => setIsTodayFollowupsModalOpen(false)}
                >
                  Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ======================================================== */}
      {/* MODAL: SITE VISITS MODAL                                 */}
      {/* ======================================================== */}
      <AnimatePresence>
        {isSiteVisitsModalOpen && (
          <motion.div
            className="modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsSiteVisitsModalOpen(false)}
            style={{ zIndex: 10000 }}
          >
            <motion.div
              className="modal-card"
              initial={{ scale: 0.95, opacity: 0, y: 10 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 10 }}
              onClick={(e) => e.stopPropagation()}
              style={{ maxWidth: '620px', width: '92%', background: '#FFFFFF', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 25px 50px -12px rgba(6, 54, 105, 0.25)', display: 'flex', flexDirection: 'column' }}
            >
              <div className="modal-header" style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid #E2E8F0', background: '#F8FAFC', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
                <div>
                  <h3 className="section-title" style={{ margin: 0 }}>
                    Site Visits & Product Demos Schedule
                  </h3>
                  <div style={{ fontSize: '0.78rem', color: '#557396', marginTop: '0.2rem' }}>
                    Scheduled on-premise reviews and technical pilots
                  </div>
                </div>
                <button
                  type="button"
                  className="modal-close-btn"
                  onClick={() => setIsSiteVisitsModalOpen(false)}
                >
                  <LuX size={18} />
                </button>
              </div>

              <div className="modal-body" style={{ padding: '1.25rem 1.5rem', maxHeight: '55vh', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.75rem', background: '#FFFFFF' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {SALES_EXECUTIVE_SITE_VISITS_TODAY.map((v) => (
                    <div
                      key={v.id}
                      style={{
                        padding: '0.85rem',
                        background: '#F8FAFC',
                        border: '1px solid #E2E8F0',
                        borderRadius: '10px',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '0.4rem'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <span style={{ fontWeight: 700, color: '#0F1A34', fontSize: '0.9rem' }}>
                          {v.company}
                        </span>
                        <span style={{
                          fontSize: '0.675rem',
                          padding: '0.15rem 0.5rem',
                          borderRadius: '9999px',
                          fontWeight: 700,
                          background: v.status === 'Completed' ? '#DCFCE7' : '#E0F2FE',
                          color: v.status === 'Completed' ? '#15803D' : '#0369A1'
                        }}>
                          {v.status}
                        </span>
                      </div>

                      <div style={{ fontSize: '0.775rem', color: '#557396' }}>
                        Contact: <strong>{v.leadName}</strong> • Executive: <strong>{v.executive}</strong>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.75rem', color: '#0284C7', fontWeight: 600 }}>
                        <LuClock size={12} />
                        <span>{v.time}</span>
                        <span>•</span>
                        <LuMapPin size={12} />
                        <span>{v.location}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="modal-footer" style={{ padding: '1rem 1.5rem', borderTop: '1px solid #E2E8F0', background: '#FFFFFF', display: 'flex', justifyContent: 'flex-end', margin: 0, flexShrink: 0 }}>
                <button
                  type="button"
                  className="btn-secondary"
                  style={{ padding: '0.5rem 1.25rem', fontSize: '0.85rem', borderRadius: '8px', fontWeight: 600 }}
                  onClick={() => setIsSiteVisitsModalOpen(false)}
                >
                  Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ======================================================== */}
      {/* MODAL: PIPELINE LEAD STATUSES                            */}
      {/* ======================================================== */}
      <AnimatePresence>
        {isLeadStatusesModalOpen && (
          <motion.div
            className="modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsLeadStatusesModalOpen(false)}
            style={{ zIndex: 10000 }}
          >
            <motion.div
              className="modal-card"
              initial={{ scale: 0.95, opacity: 0, y: 10 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 10 }}
              onClick={(e) => e.stopPropagation()}
              style={{ maxWidth: '620px', width: '92%', background: '#FFFFFF', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 25px 50px -12px rgba(6, 54, 105, 0.25)', display: 'flex', flexDirection: 'column' }}
            >
              <div className="modal-header" style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid #E2E8F0', background: '#F8FAFC', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
                <div>
                  <h3 className="section-title" style={{ margin: 0 }}>
                    Active Pipeline Status Breakdown
                  </h3>
                  <div style={{ fontSize: '0.78rem', color: '#557396', marginTop: '0.2rem' }}>
                    Live conversion stages across assigned leads
                  </div>
                </div>
                <button
                  type="button"
                  className="modal-close-btn"
                  onClick={() => setIsLeadStatusesModalOpen(false)}
                >
                  <LuX size={18} />
                </button>
              </div>

              <div className="modal-body" style={{ padding: '1.25rem 1.5rem', maxHeight: '55vh', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.75rem', background: '#FFFFFF' }}>
                <div className="search-box" style={{ width: '100%', marginBottom: '0.5rem' }}>
                  <LuSearch className="search-icon" />
                  <input
                    type="text"
                    className="search-input"
                    placeholder="Filter status stages..."
                    value={statusSearchQuery}
                    onChange={(e) => setStatusSearchQuery(e.target.value)}
                  />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                  {filteredLeadStatuses.map((st) => (
                    <div
                      key={st.id}
                      style={{
                        padding: '0.85rem',
                        background: '#F8FAFC',
                        border: '1px solid #E2E8F0',
                        borderRadius: '10px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: '0.75rem'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                        <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: st.color }} />
                        <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#0F1A34' }}>
                          {st.name}
                        </span>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <span style={{ fontSize: '0.95rem', fontWeight: 800, color: '#0F1A34' }}>
                          {st.count} Leads
                        </span>
                        <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#557396', background: '#E2E8F0', padding: '0.15rem 0.5rem', borderRadius: '9999px' }}>
                          {st.percentage}%
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="modal-footer" style={{ padding: '1rem 1.5rem', borderTop: '1px solid #E2E8F0', background: '#FFFFFF', display: 'flex', justifyContent: 'flex-end', margin: 0, flexShrink: 0 }}>
                <button
                  type="button"
                  className="btn-secondary"
                  style={{ padding: '0.5rem 1.25rem', fontSize: '0.85rem', borderRadius: '8px', fontWeight: 600 }}
                  onClick={() => setIsLeadStatusesModalOpen(false)}
                >
                  Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ======================================================== */}
      {/* MODAL: OBJECTIONS & BATTLECARDS                          */}
      {/* ======================================================== */}
      <AnimatePresence>
        {isObjectionsModalOpen && (
          <motion.div
            className="modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsObjectionsModalOpen(false)}
            style={{ zIndex: 10000 }}
          >
            <motion.div
              className="modal-card"
              initial={{ scale: 0.95, opacity: 0, y: 10 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 10 }}
              onClick={(e) => e.stopPropagation()}
              style={{ maxWidth: '620px', width: '92%', background: '#FFFFFF', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 25px 50px -12px rgba(6, 54, 105, 0.25)', display: 'flex', flexDirection: 'column' }}
            >
              <div className="modal-header" style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid #E2E8F0', background: '#F8FAFC', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
                <div>
                  <h3 className="section-title" style={{ margin: 0 }}>
                    Client Objections & AI Battlecards
                  </h3>
                  <div style={{ fontSize: '0.78rem', color: '#557396', marginTop: '0.2rem' }}>
                    Enterprise negotiation guidance and pitch points
                  </div>
                </div>
                <button
                  type="button"
                  className="modal-close-btn"
                  onClick={() => setIsObjectionsModalOpen(false)}
                >
                  <LuX size={18} />
                </button>
              </div>

              <div className="modal-body" style={{ padding: '1.25rem 1.5rem', maxHeight: '55vh', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.75rem', background: '#FFFFFF' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {SALES_EXECUTIVE_OBJECTIONS.map((obj) => (
                    <div
                      key={obj.id}
                      style={{
                        padding: '0.85rem',
                        background: '#F8FAFC',
                        border: '1px solid #E2E8F0',
                        borderRadius: '10px',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '0.4rem'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <span style={{ fontWeight: 700, color: '#0F1A34', fontSize: '0.9rem' }}>
                          {obj.customer}
                        </span>
                        <span style={{
                          fontSize: '0.675rem',
                          padding: '0.15rem 0.5rem',
                          borderRadius: '9999px',
                          fontWeight: 700,
                          background: obj.status === 'Resolved' ? '#DCFCE7' : '#FEF3C7',
                          color: obj.status === 'Resolved' ? '#15803D' : '#B45309'
                        }}>
                          {obj.status}
                        </span>
                      </div>

                      <div style={{ fontSize: '0.8rem', fontWeight: 600, color: '#DC2626' }}>
                        Objection: {obj.objection}
                      </div>

                      <div style={{ fontSize: '0.75rem', color: '#0F1A34', background: '#FFFFFF', padding: '0.5rem', borderRadius: '6px', border: '1px solid #E2E8F0' }}>
                        <strong>Recommended Battlecard Pitch:</strong> {obj.solution}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="modal-footer" style={{ padding: '1rem 1.5rem', borderTop: '1px solid #E2E8F0', background: '#FFFFFF', display: 'flex', justifyContent: 'flex-end', margin: 0, flexShrink: 0 }}>
                <button
                  type="button"
                  className="btn-secondary"
                  style={{ padding: '0.5rem 1.25rem', fontSize: '0.85rem', borderRadius: '8px', fontWeight: 600 }}
                  onClick={() => setIsObjectionsModalOpen(false)}
                >
                  Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ======================================================== */}
      {/* MODAL: BOOKINGS DIRECTORY                                */}
      {/* ======================================================== */}
      <AnimatePresence>
        {isBookingsModalOpen && (
          <motion.div
            className="modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsBookingsModalOpen(false)}
            style={{ zIndex: 10000 }}
          >
            <motion.div
              className="modal-card"
              initial={{ scale: 0.95, opacity: 0, y: 10 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 10 }}
              onClick={(e) => e.stopPropagation()}
              style={{ maxWidth: '620px', width: '92%', background: '#FFFFFF', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 25px 50px -12px rgba(6, 54, 105, 0.25)', display: 'flex', flexDirection: 'column' }}
            >
              <div className="modal-header" style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid #E2E8F0', background: '#F8FAFC', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
                <div>
                  <h3 className="section-title" style={{ margin: 0 }}>
                    Closed Bookings & Revenue Achieved
                  </h3>
                  <div style={{ fontSize: '0.78rem', color: '#557396', marginTop: '0.2rem' }}>
                    Signed customer accounts and contractual revenue milestones
                  </div>
                </div>
                <button
                  type="button"
                  className="modal-close-btn"
                  onClick={() => setIsBookingsModalOpen(false)}
                >
                  <LuX size={18} />
                </button>
              </div>

              <div className="modal-body" style={{ padding: '1.25rem 1.5rem', maxHeight: '55vh', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.75rem', background: '#FFFFFF' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  <div style={{ padding: '0.85rem', background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <div style={{ fontWeight: 700, color: '#0F1A34', fontSize: '0.9rem' }}>Tata Consultancy Tech Ltd</div>
                      <div style={{ fontSize: '0.75rem', color: '#557396' }}>Enterprise CRM Suite (500 Seats) • Exec: Rahul Verma</div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontWeight: 800, color: '#15803D', fontSize: '0.95rem' }}>₹1,80,00,000</div>
                      <span style={{ fontSize: '0.675rem', background: '#DCFCE7', color: '#15803D', padding: '0.1rem 0.4rem', borderRadius: '4px', fontWeight: 700 }}>Signed</span>
                    </div>
                  </div>

                  <div style={{ padding: '0.85rem', background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <div style={{ fontWeight: 700, color: '#0F1A34', fontSize: '0.9rem' }}>Reliance Cloud Solutions</div>
                      <div style={{ fontSize: '0.75rem', color: '#557396' }}>Cloud Infrastructure & Security • Exec: Sneha Rao</div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontWeight: 800, color: '#15803D', fontSize: '0.95rem' }}>₹3,20,00,000</div>
                      <span style={{ fontSize: '0.675rem', background: '#DCFCE7', color: '#15803D', padding: '0.1rem 0.4rem', borderRadius: '4px', fontWeight: 700 }}>Signed</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="modal-footer" style={{ padding: '1rem 1.5rem', borderTop: '1px solid #E2E8F0', background: '#FFFFFF', display: 'flex', justifyContent: 'flex-end', margin: 0, flexShrink: 0 }}>
                <button
                  type="button"
                  className="btn-secondary"
                  style={{ padding: '0.5rem 1.25rem', fontSize: '0.85rem', borderRadius: '8px', fontWeight: 600 }}
                  onClick={() => setIsBookingsModalOpen(false)}
                >
                  Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
