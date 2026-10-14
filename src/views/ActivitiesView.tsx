import React, { useState, useEffect } from 'react';
import {
  LuPhone,
  LuMail,
  LuMessageSquare,
  LuClock,
  LuCalendar,
  LuChevronRight,
  LuCalendarX
} from 'react-icons/lu';
import { isDateInFilter } from '../utils/dateUtils';
import { onKeyActivate } from '../utils/a11y';
import { EmptyState } from '../components/common/StateViews';

export default function ActivitiesView({
  activities = [],
  searchQuery = '',
  selectedDateFilter = 'This Month',
  fromDashboard = false,
  onBackToDashboard,
  initialTab = 'All',
  onSelectLead,
  onSelectAccount
}) {
  const [activeTab, setActiveTab] = useState(initialTab);

  useEffect(() => {
    if (initialTab) {
      setActiveTab(prev => (prev !== initialTab ? initialTab : prev));
    }
  }, [initialTab]);

  const q = searchQuery.toLowerCase().trim();

  const filteredActivities = activities.filter(act => {
    if (activeTab !== 'All' && act.type !== activeTab) return false;
    if (q) {
      const matchCompany = act.company && act.company.toLowerCase().includes(q);
      const matchLead = act.lead && act.lead.toLowerCase().includes(q);
      const matchNotes = act.notes && act.notes.toLowerCase().includes(q);
      const matchOwner = act.owner && act.owner.toLowerCase().includes(q);
      const matchType = act.type && act.type.toLowerCase().includes(q);
      if (!matchCompany && !matchLead && !matchNotes && !matchOwner && !matchType) return false;
    }
    if (selectedDateFilter && selectedDateFilter !== 'All Time') {
      const matchesDate = isDateInFilter(act.date || act.dueTime, selectedDateFilter);
      if (!matchesDate) return false;
    }
    return true;
  });

  const getIcon = (type) => {
    switch (type) {
      case 'Call': return <LuPhone size={14} />;
      case 'Email': return <LuMail size={14} />;
      case 'SMS / WhatsApp': return <LuMessageSquare size={14} />;
      case 'Follow-up': return <LuClock size={14} />;
      case 'Meeting': return <LuCalendar size={14} />;
      default: return <LuClock size={14} />;
    }
  };

  const handleCardClick = (act) => {
    if (act.lead && onSelectLead) {
      onSelectLead(act.lead);
    } else if (act.company && onSelectAccount) {
      onSelectAccount(act.company);
    }
  };

  return (
    <div className="activities-view">
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
              Activities & Engagement Timeline
            </span>
          </nav>
        </div>
      )}

      <div className="section-card">
        <div className="tab-header">
          {['All', 'Call', 'Email', 'SMS / WhatsApp', 'Follow-up', 'Meeting'].map(tab => (
            <div role="button" tabIndex={0} onKeyDown={onKeyActivate}
              key={tab}
              className={`tab-item ${activeTab === tab ? 'active' : ''}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </div>
          ))}
        </div>

        <div className="timeline" key={activeTab}>
          {filteredActivities.length === 0 ? (
            <EmptyState
              icon={LuCalendarX}
              title="No activity logs found"
              description={activeTab !== 'All'
                ? `There are no ${activeTab} activities for the selected filter.`
                : 'No activities or engagement logs match your current filters.'}
            />
          ) : (
            filteredActivities.map((act) => (
              <div key={`${activeTab}-${act.id}`} className="timeline-item">
                <div className="timeline-icon">
                  {getIcon(act.type)}
                </div>
                <div role="button" tabIndex={0} onKeyDown={onKeyActivate}
                  className={`timeline-card ${act.isOverdue ? 'action-card' : ''}`}
                  onClick={() => handleCardClick(act)}
                  title={`Click to open details for ${act.lead || act.company}`}
                  style={{
                    cursor: 'pointer',
                    ...(act.isOverdue
                      ? { border: '1px solid #E2E8F0', backgroundColor: '#FFFFFF', borderRadius: 'var(--radius)' }
                      : { border: '1px solid transparent', backgroundColor: '#F8F9FA' })
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.375rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span style={{ fontWeight: 700, fontSize: '0.875rem', color: '#0F1A34' }}>{act.type}</span>
                      <span style={{ fontSize: '0.8125rem', color: '#557396' }}>with</span>
                      <span style={{ fontWeight: 700, fontSize: '0.875rem', color: '#084482', textDecoration: 'underline' }}>
                        {act.lead || act.company}
                      </span>
                    </div>
                    <span style={{ fontSize: '0.75rem', color: '#557396', fontWeight: 500 }}>{act.date}</span>
                  </div>

                  <div style={{ fontSize: '0.8125rem', color: '#0F1A34', marginBottom: '0.375rem' }}>
                    {act.notes || act.summary || act.shortPreview || act.meetingNotes}
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.75rem', color: '#557396' }}>
                    <span>Logged by: <strong>{act.owner}</strong></span>
                    <span className={`status-chip ${act.isOverdue ? 'overdue' : 'new'}`} style={{ fontSize: '0.625rem' }}>
                      {act.isOverdue ? 'OVERDUE ITEM' : act.status}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
