import React, { useState, useEffect, useRef } from 'react';
import {
  LuClock,
  LuArrowUpRight,
  LuChevronRight,
  LuUsers,
  LuBriefcase,
  LuUserCheck,
  LuBuilding2,
  LuTriangleAlert,
  LuCalendarCheck,
  LuCalendar,
  LuUser
} from 'react-icons/lu';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip
} from 'recharts';
import CustomDropdown from '../components/common/CustomDropdown';
import {
  INITIAL_OWNERS,
  INITIAL_DATE_FILTERS,
  INITIAL_SALES_HEADS,
  INITIAL_SALES_EXECUTIVES
} from '../data/mockData';
import { isDateInFilter, getFilterLabel } from '../utils/dateUtils';
import { animateStaggerEntrance } from '../utils/animations';

export default function DashboardView({
  leads = [],
  accounts = [],
  activities = [],
  salesHeads = INITIAL_SALES_HEADS,
  salesExecutives = INITIAL_SALES_EXECUTIVES,
  selectedOwnerFilter = 'All Owners',
  selectedDateFilter = 'This Month',
  onNavigateToLeads,
  onNavigateToAccounts,
  onNavigateToActivities,
  onNavigateToSalesHead,
  onNavigateToSalesExecutive,
  onSelectLead,
  onSelectAccount
}) {
  const dashboardRef = useRef(null);

  // Dedicated Marketing Card Filter States (As mandated in PDF: "filters by date and owner")
  const [marketingDateFilter, setMarketingDateFilter] = useState(selectedDateFilter);
  const [marketingOwnerFilter, setMarketingOwnerFilter] = useState(selectedOwnerFilter);

  useEffect(() => {
    if (dashboardRef.current) {
      animateStaggerEntrance(dashboardRef.current.querySelectorAll('.kpi-card, .counter-card, .chart-card'), 0.05);
    }
  }, [selectedDateFilter, selectedOwnerFilter]);

  // Sync global header date filter changes
  useEffect(() => {
    setMarketingDateFilter(selectedDateFilter);
  }, [selectedDateFilter]);

  // Sync global owner filter changes
  useEffect(() => {
    setMarketingOwnerFilter(selectedOwnerFilter);
  }, [selectedOwnerFilter]);

  // Filter leads/activities dynamically based on global owner filter & date filter
  const isDateMatch = (dateStr) => {
    return isDateInFilter(dateStr, selectedDateFilter);
  };

  const filteredLeads = leads.filter(l => {
    const matchOwner = selectedOwnerFilter === 'All Owners' || l.leadOwner === selectedOwnerFilter;
    const matchDate = isDateMatch(l.createdDate);
    return matchOwner && matchDate;
  });

  const isCustomDate = typeof selectedDateFilter === 'object' && selectedDateFilter?.type === 'custom';
  const filteredAccounts = accounts.filter(a => {
    const matchOwner = selectedOwnerFilter === 'All Owners' || a.accountOwner === selectedOwnerFilter;
    const matchDate = isCustomDate ? (!a.createdDate ? true : isDateInFilter(a.createdDate, selectedDateFilter)) : true;
    return matchOwner && matchDate;
  });

  const filteredActivities = activities.filter(act => {
    const matchOwner = selectedOwnerFilter === 'All Owners' || act.owner === selectedOwnerFilter;
    const matchDate = isDateMatch(act.date);
    return matchOwner && matchDate;
  });

  // Compute live counters
  const totalCompanies = filteredAccounts.length;
  const totalLeadsCount = filteredLeads.length;
  const overdueLeadsCount = leads.filter(l => {
    const matchOwner = selectedOwnerFilter === 'All Owners' || l.leadOwner === selectedOwnerFilter;
    return matchOwner && l.isOverdue;
  }).length;
  const todayFollowupsCount = filteredActivities.filter(a =>
    a.type === 'Follow-up' && (a.dueToday || isDateInFilter(a.date, 'Today'))
  ).length;

  // Active revenue data based on toggle
  // Filter follow-up action items: must match owner filter AND date filter on scheduled follow-up time
  const followUpActions = leads
    .filter(l => {
      if (!l.nextFollowup) return false;
      const matchOwner = selectedOwnerFilter === 'All Owners' || l.leadOwner === selectedOwnerFilter;
      const matchDate = isDateMatch(l.nextFollowup);
      return matchOwner && matchDate;
    })
    .sort((a, b) => Number(b.isOverdue) - Number(a.isOverdue));

  const filterKey = `${selectedOwnerFilter}_${typeof selectedDateFilter === 'object' && selectedDateFilter !== null ? `${selectedDateFilter?.startDate}_${selectedDateFilter?.endDate}_${selectedDateFilter?.label}` : selectedDateFilter}`;

  // Dynamic Marketing Lead Source Mix calculation based on Marketing Card Filters (Date & Owner)
  const leadsForMarketing = leads.filter(lead => {
    if (marketingOwnerFilter !== 'All Owners' && lead.leadOwner !== marketingOwnerFilter) {
      return false;
    }
    return isDateInFilter(lead.createdDate, marketingDateFilter);
  });

  const normalizeSource = (src) => {
    if (!src) return 'Other';
    const s = src.toString().trim().toUpperCase();
    if (s.includes('META') || s.includes('FACEBOOK')) return 'Meta';
    if (s.includes('WHATSAPP')) return 'WhatsApp';
    if (s.includes('WEBSITE') || s.includes('WEB')) return 'Website';
    if (s.includes('REFERRAL') || s.includes('REF')) return 'Referral';
    if (s.includes('LINKEDIN')) return 'LinkedIn';
    if (s.includes('CAMPAIGN')) return 'Campaign';
    if (s.includes('CALL') || s.includes('INBOUND')) return 'Inbound Call';
    if (s.includes('PARTNER')) return 'Partner';
    return src.charAt(0).toUpperCase() + src.slice(1).toLowerCase();
  };

  const sourceColors = {
    Meta: '#4F46E5',
    WhatsApp: '#0D9488',
    Website: '#0022FF',
    Referral: '#059669',
    LinkedIn: '#0284C7',
    Campaign: '#D97706',
    'Inbound Call': '#6366F1',
    Partner: '#8B5CF6',
    Other: '#64748B'
  };

  const sourceCountMap = {};
  leadsForMarketing.forEach(lead => {
    const rawSrc = lead.leadSource || lead.source || 'Website';
    const norm = normalizeSource(rawSrc);
    sourceCountMap[norm] = (sourceCountMap[norm] || 0) + 1;
  });

  const dynamicSourceMixData = Object.keys(sourceCountMap)
    .filter(source => sourceCountMap[source] > 0)
    .map(source => ({
      name: source,
      count: sourceCountMap[source],
      color: sourceColors[source] || '#0F1A34'
    }))
    .sort((a, b) => b.count - a.count);

  const marketingTotalLeads = leadsForMarketing.length;

  return (
    <div className="dashboard-view" ref={dashboardRef}>
      {/* Top 3 KPI Cards: Total Leads, Total Sales Heads, Total Sales Executives */}
      <div className="revenue-grid">
        <div className="kpi-card">
          <div className="kpi-header">
            <span className="kpi-title">Total Leads</span>
            <div className="kpi-icon-wrap">
              <LuUsers size={18} />
            </div>
          </div>
          <div className="kpi-value">{totalLeadsCount}</div>
          <div className="kpi-subtext">
            <span className="badge-success"><LuArrowUpRight size={14} /> +12.4%</span> vs last month
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-header">
            <span className="kpi-title">Total Sales Heads</span>
            <div className="kpi-icon-wrap">
              <LuBriefcase size={18} />
            </div>
          </div>
          <div className="kpi-value">{salesHeads.length}</div>
          <div className="kpi-subtext">
            <span className="badge-success"><LuArrowUpRight size={14} /> Active</span> regional heads
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-header">
            <span className="kpi-title">Total Sales Executives</span>
            <div className="kpi-icon-wrap">
              <LuUserCheck size={18} />
            </div>
          </div>
          <div className="kpi-value">{salesExecutives.length}</div>
          <div className="kpi-subtext">
            <span className="badge-success"><LuArrowUpRight size={14} /> Active</span> field reps
          </div>
        </div>
      </div>

      {/* Dual Cards Section: Marketing Donut Chart + Operational Summary Card */}
      <div className="charts-grid">
        {/* Card 1: Marketing Lead Source Mix Donut Chart */}
        <div className="chart-card">
          <div className="chart-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'nowrap', gap: '0.75rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.1rem', minWidth: 0 }}>
              <h3 className="chart-title" style={{ margin: 0, lineHeight: 1.2 }}>Marketing</h3>
              <div style={{ fontSize: '0.75rem', color: '#557396', margin: 0, lineHeight: 1.2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                Lead Source / Acquisition Mix
              </div>
            </div>

            {/* Card Specific Filters: Date & Owner Custom Dropdowns */}
            <div style={{ display: 'flex', gap: '0.45rem', alignItems: 'center', flexShrink: 0 }}>
              <CustomDropdown
                value={marketingDateFilter}
                options={INITIAL_DATE_FILTERS}
                onChange={(val) => setMarketingDateFilter(val)}
                icon={LuCalendar}
                placeholder="Date"
                minWidth="140px"
              />

              <CustomDropdown
                value={marketingOwnerFilter}
                options={INITIAL_OWNERS}
                onChange={(val) => setMarketingOwnerFilter(val)}
                icon={LuUser}
                placeholder="Owner"
                minWidth="150px"
              />
            </div>
          </div>

          {/* Chart & Legend Centered Horizontal Layout */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flex: 1,
            gap: '2.5rem',
            padding: '1rem 0'
          }}>
            {/* Left: Pie Chart */}
            <div style={{ position: 'relative', width: '210px', height: '210px', flexShrink: 0 }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={dynamicSourceMixData}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={85}
                    paddingAngle={4}
                    dataKey="count"
                    isAnimationActive={true}
                  >
                    {dynamicSourceMixData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} stroke="#FFFFFF" strokeWidth={2} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value, name) => [`${value} leads`, name]}
                    contentStyle={{
                      backgroundColor: '#FFFFFF',
                      borderRadius: '10px',
                      color: '#0F1A34',
                      border: '1px solid #E2E8F0',
                      boxShadow: '0 6px 16px rgba(6, 54, 105, 0.12)',
                      padding: '0.65rem 0.85rem'
                    }}
                    itemStyle={{ color: '#0F1A34', fontWeight: 600, fontSize: '0.85rem' }}
                    labelStyle={{ color: '#0F1A34', fontWeight: 700, fontSize: '0.9rem', marginBottom: '0.25rem' }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                textAlign: 'center',
                pointerEvents: 'none'
              }}>
                <div style={{ fontSize: '1.4rem', fontWeight: 700, color: '#0F1A34', lineHeight: 1 }}>{marketingTotalLeads}</div>
                <div style={{ fontSize: '0.68rem', color: '#557396', textTransform: 'uppercase', marginTop: '3px', fontWeight: 600 }}>Leads</div>
              </div>
            </div>

            {/* Right: Legend Points (View Only) */}
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '0.65rem',
              justifyContent: 'center',
              minWidth: '150px'
            }}>
              {dynamicSourceMixData.map((item) => (
                <div
                  key={item.name}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '1.25rem',
                    padding: '0.25rem 0.5rem',
                    borderRadius: '6px'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem' }}>
                    <span style={{ width: 9, height: 9, borderRadius: '50%', backgroundColor: item.color, flexShrink: 0 }} />
                    <span style={{ color: '#0F1A34', fontSize: '0.85rem', fontWeight: 500 }}>{item.name}</span>
                  </div>
                  <span style={{ color: '#0F1A34', fontSize: '0.9rem', fontWeight: 700 }}>{item.count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Card 2: Operations & Pipeline Summary (Combined 4 KPI Counters) */}
        <div className="chart-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div className="chart-header" style={{ marginBottom: '1.25rem' }}>
            <div>
              <h3 className="chart-title" style={{ margin: 0, lineHeight: 1.25 }}>Lead & Pipeline Summary</h3>
              <div style={{ fontSize: '0.8rem', color: '#557396', margin: 0, marginTop: '2px' }}>
                Operational counters for selected filters
              </div>
            </div>
          </div>

          {/* 2x2 Subcard Metrics Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '1.15rem',
            flex: 1
          }}>
            {/* 1. Companies */}
            <div
              className="summary-subcard"
              onClick={() => onNavigateToAccounts()}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span className="counter-title" style={{ margin: 0 }}>COMPANIES</span>
                <span className="counter-badge total">TOTAL</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginTop: '1.25rem' }}>
                <div className="counter-value" style={{ fontSize: '2rem', lineHeight: 1 }}>{totalCompanies}</div>
                <div style={{ width: '38px', height: '38px', borderRadius: '10px', backgroundColor: '#EFF6FF', color: '#2563EB', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <LuBuilding2 size={20} />
                </div>
              </div>
            </div>

            {/* 2. No. of Leads */}
            <div
              className="summary-subcard"
              onClick={() => onNavigateToLeads()}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span className="counter-title" style={{ margin: 0 }}>NO. OF LEADS</span>
                <span className="counter-badge total">TOTAL</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginTop: '1.25rem' }}>
                <div className="counter-value" style={{ fontSize: '2rem', lineHeight: 1 }}>{totalLeadsCount}</div>
                <div style={{ width: '38px', height: '38px', borderRadius: '10px', backgroundColor: '#F0FDF4', color: '#16A34A', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <LuUsers size={20} />
                </div>
              </div>
            </div>

            {/* 3. Overdue Leads */}
            <div
              className="summary-subcard alert-subcard"
              onClick={() => onNavigateToLeads('OVERDUE')}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span className="counter-title" style={{ margin: 0, color: '#DC2626' }}>OVERDUE LEADS</span>
                <span className="counter-badge alert">ALERT</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginTop: '1.25rem' }}>
                <div className="counter-value" style={{ fontSize: '2rem', lineHeight: 1, color: '#DC2626' }}>{overdueLeadsCount}</div>
                <div style={{ width: '38px', height: '38px', borderRadius: '10px', backgroundColor: '#FEE2E2', color: '#DC2626', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <LuTriangleAlert size={20} />
                </div>
              </div>
            </div>

            {/* 4. Today's Follow-ups */}
            <div
              className="summary-subcard"
              onClick={() => onNavigateToActivities('Follow-up')}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span className="counter-title" style={{ margin: 0 }}>TODAY'S FOLLOW-UPS</span>
                <span className="counter-badge tasks">TASKS</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginTop: '1.25rem' }}>
                <div className="counter-value" style={{ fontSize: '2rem', lineHeight: 1 }}>{todayFollowupsCount}</div>
                <div style={{ width: '38px', height: '38px', borderRadius: '10px', backgroundColor: '#FAF5FF', color: '#9333EA', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <LuCalendarCheck size={20} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Follow-up Action List Section */}
      <div className="section-card">
        <div className="section-header">
          <div>
            <h3 className="section-title" style={{ margin: 0, marginBottom: '2px', lineHeight: 1.25 }}>Follow-up Action List</h3>
            <div style={{ fontSize: '0.8rem', color: '#557396', margin: 0, lineHeight: 1.3 }}>
              Today's follow-ups and overdue activities requiring immediate sales action.
            </div>
          </div>
          <button
            type="button"
            onClick={() => onNavigateToLeads()}
            style={{
              background: 'none',
              border: 'none',
              padding: 0,
              font: 'inherit',
              fontWeight: 700,
              fontSize: '0.875rem',
              color: '#0F1A34',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.35rem',
              textDecoration: 'underline',
              textUnderlineOffset: '3px',
              transition: 'color 0.2s ease'
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = '#137FEC')}
            onMouseLeave={(e) => (e.currentTarget.style.color = '#0F1A34')}
            title="Navigate to All Leads"
          >
            <span>View All Leads</span>
            <LuChevronRight size={16} style={{ strokeWidth: 2.5 }} />
          </button>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table className="action-table">
            <thead>
              <tr>
                <th>Company</th>
                <th>Lead</th>
                <th>Owner</th>
                <th>Due Time</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody key={filterKey}>
              {followUpActions.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ textAlign: 'center', padding: '2.75rem 1rem', color: '#557396' }}>
                    <div style={{ fontWeight: 600, fontSize: '0.95rem', color: '#0F1A34', marginBottom: '0.25rem' }}>
                      No follow-up action items found
                    </div>
                    <div style={{ fontSize: '0.8rem', color: '#64748B' }}>
                      No follow-ups match the selected date filter or owner criteria.
                    </div>
                  </td>
                </tr>
              ) : (
                followUpActions.map((item) => (
                  <tr
                    key={item.id}
                    className={item.isOverdue ? 'overdue-row' : ''}
                    onClick={() => onSelectLead(item)}
                  >
                    <td
                      style={{
                        fontWeight: 600,
                        cursor: onSelectAccount ? 'pointer' : 'inherit',
                        transition: 'color 0.15s ease'
                      }}
                      onClick={(e) => {
                        if (onSelectAccount) {
                          e.stopPropagation();
                          onSelectAccount(item.company);
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
                      title={onSelectAccount ? `View ${item.company} company details` : undefined}
                    >
                      {item.company}
                    </td>
                    <td>{item.leadName}</td>
                    <td>{item.leadOwner}</td>
                    <td>
                      <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'nowrap' }}>
                        <span style={{
                          color: item.isOverdue ? '#D93025' : '#0F1A34',
                          fontWeight: 600,
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.25rem',
                          fontSize: '0.8rem'
                        }}>
                          <LuClock size={13} style={{ color: item.isOverdue ? '#D93025' : '#5f6368' }} /> {item.nextFollowup}
                        </span>
                        {item.isOverdue ? (
                          <span style={{
                            fontSize: '0.65rem',
                            fontWeight: 700,
                            color: '#D93025',
                            backgroundColor: '#FCE8E6',
                            border: '1px solid #FAD2CF',
                            padding: '0.1rem 0.45rem',
                            borderRadius: '4px',
                            letterSpacing: '0.04em',
                            textTransform: 'uppercase'
                          }}>
                            Overdue
                          </span>
                        ) : item.dueToday ? (
                          <span style={{
                            fontSize: '0.65rem',
                            fontWeight: 700,
                            color: '#0B57D0',
                            backgroundColor: '#E8F0FE',
                            border: '1px solid #D2E3FC',
                            padding: '0.1rem 0.45rem',
                            borderRadius: '4px',
                            letterSpacing: '0.04em',
                            textTransform: 'uppercase'
                          }}>
                            Today
                          </span>
                        ) : (
                          <span style={{
                            fontSize: '0.65rem',
                            fontWeight: 700,
                            color: '#047857',
                            backgroundColor: '#ECFDF5',
                            border: '1px solid #A7F3D0',
                            padding: '0.1rem 0.45rem',
                            borderRadius: '4px',
                            letterSpacing: '0.04em',
                            textTransform: 'uppercase'
                          }}>
                            Upcoming
                          </span>
                        )}
                      </div>
                    </td>
                  <td>
                    <span className={`status-chip ${item.status.toLowerCase()}`}>
                      {item.status}
                    </span>
                  </td>
                  <td>
                    <button
                      className="btn-secondary"
                      style={{ padding: '0.25rem 0.6rem', fontSize: '0.75rem' }}
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectLead(item);
                      }}
                    >
                      Inspect Next Action
                    </button>
                  </td>
                </tr>
              )))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
