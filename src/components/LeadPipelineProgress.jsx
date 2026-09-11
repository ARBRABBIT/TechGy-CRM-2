import React, { useMemo } from 'react';
import {
  LuCalendar,
  LuArrowRight
} from 'react-icons/lu';
import { getInitialStageHistory, formatStageDateTime, PIPELINE_STAGES } from '../utils/pipelineUtils';

export default function LeadPipelineProgress({
  lead,
  sortOrder = 'desc'
}) {

  // Retrieve existing recorded stageHistory on the lead, or generate dynamic baseline
  const historyEvents = useMemo(() => {
    if (!lead) return [];

    const rawEvents = Array.isArray(lead.stageHistory) && lead.stageHistory.length > 0
      ? [...lead.stageHistory]
      : getInitialStageHistory(lead);

    const stages = PIPELINE_STAGES;
    let prevStage = null;

    const normalized = rawEvents
      .filter(item => item && (item.title || item.stage || item.toStage || item.fromStage))
      .map((item, idx) => {
        const toStage = item.toStage || item.stage || 'New';
        let fromStage = item.fromStage;

        if (!fromStage && idx > 0 && prevStage) {
          fromStage = prevStage;
        } else if (!fromStage && idx === 0 && toStage !== 'New') {
          const sIdx = stages.indexOf(toStage);
          fromStage = sIdx > 0 ? stages[sIdx - 1] : 'New';
        }

        prevStage = toStage;

        const isCreation = item.type === 'initial_creation' || (!fromStage && toStage === 'New');
        const title = item.title || (isCreation
          ? 'Lead created with status New'
          : `Lead status changed ${fromStage ? `${fromStage} → ` : ''}${toStage}`);

        return {
          ...item,
          fromStage,
          toStage,
          isCreation,
          title,
          date: item.date || (item.timestamp ? formatStageDateTime(item.timestamp) : 'Recent')
        };
      })
      .filter(item => !item.fromStage || item.fromStage !== item.toStage || item.isCreation);

    if (sortOrder === 'desc') {
      return [...normalized].reverse();
    }
    return normalized;
  }, [lead, sortOrder]);


  // Helper to format relative time tag
  const getRelativeTimeBadge = (timestamp) => {
    if (!timestamp) return null;
    try {
      const now = new Date().getTime();
      const eventTime = new Date(timestamp).getTime();
      if (isNaN(eventTime)) return null;

      const diffMs = now - eventTime;
      const diffMins = Math.floor(diffMs / (1000 * 60));
      const diffHours = Math.floor(diffMins / 60);
      const diffDays = Math.floor(diffHours / 24);

      if (diffMins < 2) return 'Just now';
      if (diffMins < 60) return `${diffMins} mins ago`;
      if (diffHours < 24) return `${diffHours} hr${diffHours > 1 ? 's' : ''} ago`;
      if (diffDays === 1) return 'Yesterday';
      if (diffDays < 7) return `${diffDays} days ago`;
      return null;
    } catch {
      return null;
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>

      {/* Vertical Pipeline Stream of Status Change Containers */}
      <div
        style={{
          position: 'relative',
          paddingLeft: '52px',
          paddingTop: '0.25rem',
          paddingBottom: '0.5rem'
        }}
      >
        {/* Continuous Vertical Pipeline Track */}
        {historyEvents.length > 1 && (
          <div
            style={{
              position: 'absolute',
              left: '20px',
              top: '35px',
              bottom: '35px',
              width: '3px',
              backgroundColor: '#CBD5E1',
              borderRadius: '2px',
              zIndex: 0
            }}
          />
        )}

        {historyEvents.length === 0 ? (
          <div
            style={{
              textAlign: 'center',
              padding: '3rem 1rem',
              color: '#557396',
              backgroundColor: '#F8FAFC',
              borderRadius: '12px',
              border: '1px dashed #E2E8F0',
              marginLeft: '-52px'
            }}
          >
            No pipeline stage changes recorded yet. Click any stage in the Sales Pipeline Stage Progress card on the right to advance the stage.
          </div>
        ) : (
          historyEvents.map((item, index) => {
            const isCreation = item.type === 'initial_creation';
            const eventNumber = sortOrder === 'desc' ? historyEvents.length - index : index + 1;
            const isLatest = index === 0 && sortOrder === 'desc';
            const relativeTime = getRelativeTimeBadge(item.timestamp);

            return (
              <div
                key={item.id || `${item.toStage}-${index}`}
                style={{
                  position: 'relative',
                  marginBottom: index === historyEvents.length - 1 ? 0 : '1.25rem'
                }}
              >
                {/* Pipeline Node Centered on Track with Number */}
                <div
                  style={{
                    position: 'absolute',
                    left: '-50px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    width: '38px',
                    height: '38px',
                    borderRadius: '50%',
                    backgroundColor: '#FFFFFF',
                    color: '#063669',
                    fontSize: '0.95rem',
                    fontWeight: 800,
                    border: '2px solid #E2E8F0',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: isLatest
                      ? '0 0 0 4px #EBF3FA, 0 2px 6px rgba(6, 54, 105, 0.08)'
                      : '0 0 0 4px #F1F5F9, 0 1px 3px rgba(6, 54, 105, 0.04)',
                    zIndex: 2,
                    userSelect: 'none',
                    transition: 'all 0.18s ease'
                  }}
                  title={`Step ${eventNumber}: ${item.title}`}
                >
                  {eventNumber}
                </div>

                {/* Horizontal Connector Arm */}
                <div
                  style={{
                    position: 'absolute',
                    left: '-12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    width: '12px',
                    height: '2px',
                    backgroundColor: isLatest ? '#063669' : '#CBD5E1',
                    zIndex: 1
                  }}
                />

                {/* Dynamic Stage Activity Container */}
                <div
                  style={{
                    backgroundColor: '#FFFFFF',
                    borderRadius: '12px',
                    border: '1px solid #E2E8F0',
                    padding: '0.95rem 1.35rem',
                    boxShadow: '0 1px 3px rgba(6, 54, 105, 0.04)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: '0.75rem',
                    position: 'relative'
                  }}
                >
                  {/* Left: Action Title (Line 1) + Stage Transition starting on next line */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                    <span style={{ fontSize: '0.95rem', fontWeight: 700, color: '#063669' }}>
                      {isCreation ? 'Lead created with status' : 'Lead status changed'}
                    </span>

                    {/* From -> To Transition starting from next line */}
                    {isCreation ? (
                      <div style={{ display: 'inline-flex', alignItems: 'center' }}>
                        <span
                          style={{
                            fontSize: '0.75rem',
                            fontWeight: 700,
                            color: '#063669',
                            backgroundColor: '#EBF3FA',
                            padding: '0.15rem 0.55rem',
                            borderRadius: '4px',
                            border: '1px solid #C4DCF2'
                          }}
                        >
                          {item.toStage || 'New'}
                        </span>
                      </div>
                    ) : (
                      <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                        <span
                          style={{
                            fontSize: '0.75rem',
                            fontWeight: 600,
                            color: '#64748B',
                            backgroundColor: '#F1F5F9',
                            padding: '0.15rem 0.55rem',
                            borderRadius: '4px',
                            border: '1px solid #E2E8F0'
                          }}
                        >
                          {item.fromStage || 'New'}
                        </span>
                        <LuArrowRight size={12} style={{ color: '#063669' }} />
                        <span
                          style={{
                            fontSize: '0.75rem',
                            fontWeight: 700,
                            color: '#063669',
                            backgroundColor: '#EBF3FA',
                            padding: '0.15rem 0.55rem',
                            borderRadius: '4px',
                            border: '1px solid #C4DCF2'
                          }}
                        >
                          {item.toStage}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Right: Timestamp, relative badge, and latest action tag */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                    <span
                      style={{
                        fontSize: '0.785rem',
                        fontWeight: 600,
                        color: '#557396',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.35rem'
                      }}
                    >
                      <LuCalendar size={13} style={{ color: '#557396' }} />
                      {item.date}
                    </span>

                    {relativeTime && (
                      <span
                        style={{
                          fontSize: '0.7rem',
                          fontWeight: 600,
                          color: isLatest ? '#063669' : '#64748B',
                          backgroundColor: isLatest ? '#EBF3FA' : '#F1F5F9',
                          padding: '0.15rem 0.5rem',
                          borderRadius: '10px'
                        }}
                      >
                        {relativeTime}
                      </span>
                    )}

                    {isLatest && (
                      <span
                        style={{
                          fontSize: '0.7rem',
                          fontWeight: 700,
                          color: '#16A34A',
                          backgroundColor: '#DCFCE7',
                          padding: '0.15rem 0.55rem',
                          borderRadius: '10px',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.3rem'
                        }}
                      >
                        <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#16A34A' }} />
                        Latest Action
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
