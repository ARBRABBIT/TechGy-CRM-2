import React, { useState, useEffect, useRef } from 'react';
import {
  LuArrowUpRight,
  LuDownload,
  LuChevronDown,
  LuPlay,
  LuPause,
  LuVolume2,
  LuVolumeX,
  LuPhone,
  LuCheck
} from 'react-icons/lu';

// Subtle, gentle micro-sound on dropdown opening/closing
const playAccordionTick = (willOpen) => {
  try {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.type = 'sine';
    osc.frequency.setValueAtTime(willOpen ? 540 : 360, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(willOpen ? 680 : 260, ctx.currentTime + 0.035);
    gain.gain.setValueAtTime(0.03, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.035);
    osc.start();
    osc.stop(ctx.currentTime + 0.04);
  } catch {
    // Graceful fallback if audio context is blocked
  }
};

export default function LeadCallHistory({ lead, calls = [], onLogCall }) {
  // Normalize calls into full AI intelligence models matching the screenshot
  const normalizedCalls = React.useMemo(() => {
    const rawCalls = Array.isArray(calls) ? calls : [];

    // If no calls exist, return empty array
    if (rawCalls.length === 0) {
      return [];
    }

    return rawCalls.map((c, idx) => {
      const isMissed = (c.outcome || '').toLowerCase().includes('missed') || c.duration === '00m 00s' || (idx === 0 && !c.duration?.includes('min'));
      const idNum = c.callIdNumber || c.id?.replace(/[^0-9]/g, '') || String(116 - idx);
      const dur = c.duration || (isMissed ? '00m 00s' : '18m 24s');
      const durSec = isMissed ? 0 : 1104;

      const formatCallTimestamp = (rawDate, isMissedCall) => {
        if (!rawDate) return isMissedCall ? 'Aug 25, 2026 • 04:30 PM' : 'Today • 10:30 AM';
        if (rawDate.includes('•')) return rawDate;
        const parts = rawDate.trim().split(/\s+/);
        if (parts.length >= 3 && (parts[2] === 'AM' || parts[2] === 'PM')) {
          return `${parts[0]} • ${parts[1]} ${parts[2]}`;
        }
        return isMissedCall ? `${rawDate} • 04:30 PM` : `${rawDate} • 10:30 AM`;
      };

      return {
        id: c.id || `CALL-${lead.id}-${idNum}`,
        callIdNumber: idNum,
        title: c.subject || (isMissed ? 'Outgoing Call – Missed' : 'Outgoing Call – Connected'),
        isMissed,
        date: formatCallTimestamp(c.date, isMissed),
        duration: dur,
        durationSeconds: durSec,
        moodScore: c.moodScore || (isMissed ? '7.8' : '8.4'),
        moodLabel: c.moodLabel || (isMissed ? 'Curious' : 'Positive'),
        sentimentTag: c.sentimentTag || (isMissed ? 'N/A' : 'Positive'),
        sentimentScore: c.sentimentScore || (isMissed ? 'Score: N/A' : 'Score: 86% Positive'),
        objectionsCount: c.objectionsCount ?? (isMissed ? 0 : 1),
        objections: c.objections || (isMissed ? [] : ['Evaluated competitor solution pricing last quarter, requested clear ROI comparison.']),
        checklistMet: c.checklistMet ?? (isMissed ? 0 : 4),
        checklistTotal: c.checklistTotal ?? (isMissed ? 0 : 4),
        checklistPercentage: c.checklistPercentage ?? (isMissed ? 0 : 100),
        checklistItems: c.checklistItems || (isMissed ? [] : [
          { text: 'Introduced company & validated requirements', met: true },
          { text: 'Demonstrated API architecture connectors & SLA tiers', met: true },
          { text: 'Identified budget authority & procurement stakeholder', met: true },
          { text: 'Agreed on next follow-up milestone for technical demo', met: true }
        ]),
        keyPoints: c.keyPoints || (isMissed ? [] : [
          'Client requires seamless migration from legacy on-prem CRM to cloud.',
          'Strict requirement for ISO 27001 & SOC 2 data security compliance.'
        ]),
        questions: c.questions || (isMissed ? [] : [
          'Does TechGy provide automated failover and 99.95% uptime SLA?',
          'What is the turnaround time for custom ERP webhook integration?'
        ]),
        agentEngagementLabel: 'Agent Engagement',
        engagementPercentage: c.engagementPercentage ?? (isMissed ? 92 : 68),
        engagementLevel: 'High',
        engagementCaption: isMissed
          ? 'Customer spoke for 92% of the duration.'
          : 'Customer spoke for 68% of the duration.'
      };
    });
  }, [calls, lead]);

  // Collapsible dropdown state for each call card (first call expanded by default)
  const [expandedCalls, setExpandedCalls] = useState({});

  const toggleExpand = (callId) => {
    setExpandedCalls(prev => {
      const nextState = !prev[callId];
      playAccordionTick(nextState);
      return {
        ...prev,
        [callId]: nextState
      };
    });
  };

  // Audio playback simulator
  const [playingCallId, setPlayingCallId] = useState(null);
  const [playbackProgress, setPlaybackProgress] = useState({});
  const [isMuted, setIsMuted] = useState(false);
  const timerRef = useRef(null);

  useEffect(() => {
    if (playingCallId) {
      timerRef.current = setInterval(() => {
        setPlaybackProgress(prev => {
          const current = prev[playingCallId] || 0;
          const targetCall = normalizedCalls.find(c => c.id === playingCallId);
          const maxSec = targetCall?.durationSeconds || 10;
          if (current >= maxSec) {
            setPlayingCallId(null);
            return { ...prev, [playingCallId]: 0 };
          }
          return { ...prev, [playingCallId]: current + 1 };
        });
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [playingCallId, normalizedCalls]);

  const handleTogglePlay = (call) => {
    if (playingCallId === call.id) {
      setPlayingCallId(null);
    } else {
      setPlayingCallId(call.id);
    }
  };

  const formatSeconds = (sec = 0) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  const handleDownloadTranscript = (call) => {
    const transcriptText = `========================================
TECHGY CRM - CALL RECORDING & AI ANALYSIS
========================================
Call ID: #${call.callIdNumber}
Lead Name: ${lead.leadName}
Company: ${lead.company}
Date & Time: ${call.date}
Duration: ${call.duration}
Call Type: ${call.title}

AI MOOD ANALYSIS:
Score: ${call.moodScore} / 10
Mood State: ${call.moodLabel}

SENTIMENT ANALYSIS:
Status: ${call.sentimentTag}
Details: ${call.sentimentScore}

DETECTED OBJECTIONS (${call.objectionsCount}):
${call.objections.length > 0 ? call.objections.map((o, i) => `${i + 1}. ${o}`).join('\n') : 'No objections detected on this call.'}

AGENT CHECKLIST:
${call.checklistMet}/${call.checklistTotal} Checklist Met (${call.checklistPercentage}%)
${call.checklistItems.length > 0 ? call.checklistItems.map(item => `[x] ${item.text}`).join('\n') : 'No checklist items generated.'}

SPEAKER ENGAGEMENT:
${call.agentEngagementLabel}: ${call.engagementPercentage}% ${call.engagementLevel}
${call.engagementCaption}
========================================
Generated by TechGy CRM Intelligence Engine.`;

    const blob = new Blob([transcriptText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Call_Report_${lead.leadName.replace(/\s+/g, '_')}_#${call.callIdNumber}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  if (normalizedCalls.length === 0) {
    return (
      <div style={{
        textAlign: 'center',
        padding: '3rem 1.5rem',
        backgroundColor: '#F8FAFC',
        borderRadius: '10px',
        border: '1px solid #E2E8F0',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '0.6rem'
      }}>
        <div style={{
          width: '44px',
          height: '44px',
          borderRadius: '50%',
          backgroundColor: '#EBF3FA',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#063669'
        }}>
          <LuPhone size={20} />
        </div>
        <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#063669' }}>
          No Calls Logged
        </div>
        <p style={{ fontSize: '0.825rem', color: '#557396', maxWidth: '340px', margin: 0 }}>
          No phone calls or audio recordings logged for {lead.leadName} yet.
        </p>
        {onLogCall && (
          <button
            className="btn-primary"
            onClick={onLogCall}
            style={{
              marginTop: '0.5rem',
              fontSize: '0.8rem',
              padding: '0.45rem 0.95rem',
              borderRadius: '6px',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              fontWeight: 600
            }}
          >
            <LuPhone size={14} /> Log Call
          </button>
        )}
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      {normalizedCalls.map((call) => {
        const isExpanded = !!expandedCalls[call.id];
        const isPlaying = playingCallId === call.id;
        const currentSec = playbackProgress[call.id] || 0;
        const totalSec = call.durationSeconds || 0;
        const progressPercent = totalSec > 0 ? Math.min(100, (currentSec / totalSec) * 100) : (isPlaying ? 50 : 0);

        return (
          <div
            key={call.id}
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '0.75rem'
            }}
          >
            {/* Top Card: Call Status Header + Audio Player with Dropdown Chevron */}
            <div
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '12px',
                border: '1px solid #E2E8F0',
                boxShadow: '0 1px 3px rgba(6, 54, 105, 0.04)',
                padding: isExpanded ? '1.5rem 1.25rem' : '0.95rem 1.25rem',
                display: 'flex',
                flexDirection: 'column',
                gap: 0,
                transition: 'padding 0.25s ease'
              }}
            >
              {/* Row 1: Left Call Title & Meta | Right Duration, Call ID, Download, Chevron */}
              <div
                onClick={() => toggleExpand(call.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: '0.75rem',
                  cursor: 'pointer',
                  userSelect: 'none'
                }}
              >
                {/* Left: Call Icon + Title + Date */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                  <div
                    style={{
                      width: '38px',
                      height: '38px',
                      borderRadius: '50%',
                      backgroundColor: call.isMissed ? '#DCFCE7' : '#DCFCE7',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: call.isMissed ? '#16A34A' : '#16A34A',
                      flexShrink: 0
                    }}
                  >
                    <LuArrowUpRight size={20} strokeWidth={2.4} />
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.15rem' }}>
                    <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#063669', lineHeight: 1.3 }}>
                      {call.title}
                    </div>
                    <div style={{ fontSize: '0.785rem', color: '#64748B', fontWeight: 500, lineHeight: 1.25 }}>
                      {call.date}
                    </div>
                  </div>
                </div>

                {/* Right: Actions and Meta */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                  <span style={{ fontSize: '0.875rem', fontWeight: 700, color: '#063669' }}>
                    {call.duration}
                  </span>

                  <div
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.65rem',
                      maxWidth: isExpanded ? '340px' : '0px',
                      opacity: isExpanded ? 1 : 0,
                      transform: isExpanded ? 'translateX(0)' : 'translateX(10px)',
                      pointerEvents: isExpanded ? 'auto' : 'none',
                      overflow: 'hidden',
                      transition: 'max-width 0.32s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.24s ease, transform 0.28s cubic-bezier(0.16, 1, 0.3, 1)'
                    }}
                  >
                    <span
                      style={{
                        backgroundColor: '#F8FAFC',
                        border: '1px solid #E2E8F0',
                        borderRadius: '6px',
                        padding: '0.25rem 0.65rem',
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        color: '#64748B',
                        whiteSpace: 'nowrap'
                      }}
                    >
                      Call ID: #{call.callIdNumber}
                    </span>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDownloadTranscript(call);
                      }}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.35rem',
                        backgroundColor: '#FFFFFF',
                        border: '1px solid #CBD5E1',
                        borderRadius: '6px',
                        padding: '0.35rem 0.8rem',
                        fontSize: '0.775rem',
                        fontWeight: 600,
                        color: '#063669',
                        cursor: 'pointer',
                        whiteSpace: 'nowrap',
                        transition: 'all 0.15s ease'
                      }}
                      title="Download call transcript and AI analytics"
                    >
                      <LuDownload size={14} /> Download
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleExpand(call.id);
                    }}
                    style={{
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      color: '#64748B',
                      padding: '0.25rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                    title={isExpanded ? 'Collapse call details' : 'Expand call details dropdown'}
                    aria-expanded={isExpanded}
                  >
                    <LuChevronDown
                      size={20}
                      style={{
                        color: '#64748B',
                        transition: 'transform 0.32s cubic-bezier(0.16, 1, 0.3, 1)',
                        transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)'
                      }}
                    />
                  </button>
                </div>
              </div>

              {/* Row 2: Audio Player Bar - Smooth Expansion/Collapse */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateRows: isExpanded ? '1fr' : '0fr',
                  transition: 'grid-template-rows 0.32s cubic-bezier(0.16, 1, 0.3, 1)'
                }}
              >
                <div
                  style={{
                    overflow: 'hidden',
                    minHeight: 0,
                    opacity: isExpanded ? 1 : 0,
                    transform: isExpanded ? 'translateY(0)' : 'translateY(-8px)',
                    transition: 'opacity 0.25s ease, transform 0.28s cubic-bezier(0.16, 1, 0.3, 1)'
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '1rem',
                      marginTop: '0.65rem',
                      paddingTop: '0.75rem',
                      borderTop: '1px solid #F1F5F9'
                    }}
                  >
                    <button
                      type="button"
                      onClick={() => handleTogglePlay(call)}
                      style={{
                        width: '36px',
                        height: '36px',
                        borderRadius: '50%',
                        backgroundColor: '#063669',
                        color: '#FFFFFF',
                        border: 'none',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        flexShrink: 0,
                        boxShadow: '0 2px 4px rgba(6, 54, 105, 0.2)'
                      }}
                      title={isPlaying ? 'Pause playback' : 'Play call audio'}
                    >
                      {isPlaying ? <LuPause size={15} /> : <LuPlay size={15} style={{ marginLeft: '2px' }} />}
                    </button>

                    <span style={{ fontSize: '0.775rem', fontWeight: 600, color: '#64748B', minWidth: '40px' }}>
                      {formatSeconds(currentSec)}
                    </span>

                    {/* Scrubber Progress Bar */}
                    <div
                      style={{
                        flex: 1,
                        height: '4px',
                        backgroundColor: '#E2E8F0',
                        borderRadius: '2px',
                        position: 'relative',
                        cursor: 'pointer',
                        overflow: 'hidden'
                      }}
                      onClick={(e) => {
                        if (totalSec > 0) {
                          const rect = e.currentTarget.getBoundingClientRect();
                          const clickX = e.clientX - rect.left;
                          const ratio = Math.max(0, Math.min(1, clickX / rect.width));
                          setPlaybackProgress(prev => ({ ...prev, [call.id]: Math.round(ratio * totalSec) }));
                        }
                      }}
                    >
                      <div
                        style={{
                          width: `${progressPercent}%`,
                          height: '100%',
                          backgroundColor: '#063669',
                          transition: 'width 0.2s linear'
                        }}
                      />
                    </div>

                    <span style={{ fontSize: '0.775rem', fontWeight: 600, color: '#64748B', minWidth: '40px', textAlign: 'right' }}>
                      {formatSeconds(totalSec)}
                    </span>

                    <button
                      type="button"
                      onClick={() => setIsMuted(!isMuted)}
                      style={{
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        color: '#64748B',
                        padding: 0,
                        display: 'flex',
                        alignItems: 'center'
                      }}
                      title={isMuted ? 'Unmute' : 'Mute'}
                    >
                      {isMuted ? <LuVolumeX size={17} /> : <LuVolume2 size={17} />}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Collapsible Dropdown Details - Smooth Expansion/Collapse */}
            <div
              style={{
                display: 'grid',
                gridTemplateRows: isExpanded ? '1fr' : '0fr',
                transition: 'grid-template-rows 0.36s cubic-bezier(0.16, 1, 0.3, 1)'
              }}
            >
              <div
                style={{
                  overflow: 'hidden',
                  minHeight: 0,
                  opacity: isExpanded ? 1 : 0,
                  transform: isExpanded ? 'translateY(0)' : 'translateY(-10px)',
                  transition: 'opacity 0.28s ease, transform 0.32s cubic-bezier(0.16, 1, 0.3, 1)'
                }}
              >
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', paddingTop: '0.35rem' }}>
                  {/* Card 1: Mood Analysis & Sentiment Analysis */}
                  <div
                    style={{
                      backgroundColor: '#FFFFFF',
                      borderRadius: '12px',
                      border: '1px solid #E2E8F0',
                      padding: '1.25rem 1.5rem',
                      display: 'grid',
                      gridTemplateColumns: '1fr 1fr',
                      gap: '2rem'
                    }}
                  >
                    {/* Left: Mood Analysis */}
                    <div>
                      <div style={{ fontSize: '0.7rem', fontWeight: 700, color: '#64748B', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: '0.35rem' }}>
                        MOOD ANALYSIS
                      </div>
                      <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.3rem' }}>
                        <span style={{ fontSize: '1.85rem', fontWeight: 800, color: '#063669', lineHeight: 1.1 }}>
                          {call.moodScore}
                        </span>
                        <span style={{ fontSize: '0.9rem', color: '#64748B', fontWeight: 600 }}>
                          / 10
                        </span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', marginTop: '0.35rem', fontSize: '0.85rem', fontWeight: 700, color: '#063669' }}>
                        <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#2563EB' }} />
                        {call.moodLabel}
                      </div>
                    </div>

                    {/* Right: Sentiment Analysis */}
                    <div style={{ borderLeft: '1px solid #F1F5F9', paddingLeft: '2rem' }}>
                      <div style={{ fontSize: '0.7rem', fontWeight: 700, color: '#64748B', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: '0.65rem' }}>
                        SENTIMENT ANALYSIS
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                        <span
                          style={{
                            backgroundColor: call.sentimentTag === 'N/A' ? '#FEE2E2' : '#ECFDF5',
                            color: call.sentimentTag === 'N/A' ? '#EF4444' : '#059669',
                            fontSize: '0.725rem',
                            fontWeight: 700,
                            padding: '0.2rem 0.55rem',
                            borderRadius: '5px'
                          }}
                        >
                          {call.sentimentTag}
                        </span>
                        <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#063669' }}>
                          {call.sentimentScore}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Card 2: Detected Objections */}
                  <div
                    style={{
                      backgroundColor: '#FFFFFF',
                      borderRadius: '12px',
                      border: '1px solid #E2E8F0',
                      padding: '1.25rem 1.5rem'
                    }}
                  >
                    <div style={{ fontSize: '0.7rem', fontWeight: 700, color: '#64748B', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: '0.6rem' }}>
                      DETECTED OBJECTIONS ({call.objectionsCount})
                    </div>
                    {call.objections.length === 0 ? (
                      <div style={{ fontSize: '0.825rem', color: '#64748B', fontStyle: 'italic' }}>
                        No objections detected on this call.
                      </div>
                    ) : (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                        {call.objections.map((obj, i) => (
                          <div key={i} style={{ fontSize: '0.85rem', color: '#063669', fontWeight: 500, display: 'flex', alignItems: 'flex-start', gap: '0.4rem' }}>
                            <span style={{ color: '#EF4444', fontWeight: 700 }}>•</span> {obj}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Card 3: 2-Column Row (Agent Checklist & Key Details) */}
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '1.2fr 1fr',
                      gap: '0.75rem'
                    }}
                  >
                    {/* Left: Agent Checklist */}
                    <div
                      style={{
                        backgroundColor: '#FFFFFF',
                        borderRadius: '12px',
                        border: '1px solid #E2E8F0',
                        padding: '1.25rem 1.5rem',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between'
                      }}
                    >
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                          <h4 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 800, color: '#063669' }}>
                            Agent Checklist
                          </h4>
                          <span
                            style={{
                              backgroundColor: call.checklistMet > 0 ? '#ECFDF5' : '#FEE2E2',
                              color: call.checklistMet > 0 ? '#059669' : '#EF4444',
                              fontSize: '0.725rem',
                              fontWeight: 700,
                              padding: '0.2rem 0.65rem',
                              borderRadius: '20px',
                              letterSpacing: '0.02em'
                            }}
                          >
                            {call.checklistPercentage}% • {call.checklistMet}/{call.checklistTotal} CHECKLIST MET
                          </span>
                        </div>

                        {call.checklistItems.length === 0 ? (
                          <div style={{ fontSize: '0.825rem', color: '#64748B', fontStyle: 'italic' }}>
                            No checklist items generated.
                          </div>
                        ) : (
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                            {call.checklistItems.map((item, i) => (
                              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.55rem' }}>
                                <span
                                  style={{
                                    width: '18px',
                                    height: '18px',
                                    borderRadius: '50%',
                                    backgroundColor: '#ECFDF5',
                                    color: '#059669',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    flexShrink: 0
                                  }}
                                >
                                  <LuCheck size={12} strokeWidth={2.8} />
                                </span>
                                <span style={{ fontSize: '0.825rem', color: '#063669', fontWeight: 600 }}>
                                  {item.text}
                                </span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Right: Key Points, Questions, and Speaker Engagement */}
                    <div
                      style={{
                        backgroundColor: '#FFFFFF',
                        borderRadius: '12px',
                        border: '1px solid #E2E8F0',
                        padding: '1.25rem 1.5rem',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '1rem'
                      }}
                    >
                      {/* Key Points */}
                      <div>
                        <div style={{ fontSize: '0.7rem', fontWeight: 700, color: '#64748B', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: '0.35rem' }}>
                          KEY POINTS MENTIONED
                        </div>
                        {call.keyPoints.length === 0 ? (
                          <div style={{ fontSize: '0.825rem', color: '#64748B', fontStyle: 'italic' }}>
                            No key points captured.
                          </div>
                        ) : (
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                            {call.keyPoints.map((kp, i) => (
                              <div key={i} style={{ fontSize: '0.825rem', color: '#063669', fontWeight: 500 }}>
                                • {kp}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Questions Discussed */}
                      <div>
                        <div style={{ fontSize: '0.7rem', fontWeight: 700, color: '#64748B', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: '0.35rem' }}>
                          QUESTIONS DISCUSSED
                        </div>
                        {call.questions.length === 0 ? (
                          <div style={{ fontSize: '0.825rem', color: '#64748B', fontStyle: 'italic' }}>
                            No questions captured.
                          </div>
                        ) : (
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                            {call.questions.map((q, i) => (
                              <div key={i} style={{ fontSize: '0.825rem', color: '#063669', fontWeight: 500 }}>
                                • {q}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Speaker Engagement */}
                      <div style={{ borderTop: '1px solid #F1F5F9', paddingTop: '0.85rem' }}>
                        <div style={{ fontSize: '0.7rem', fontWeight: 700, color: '#64748B', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: '0.45rem' }}>
                          SPEAKER ENGAGEMENT
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                          <span style={{ fontSize: '0.825rem', fontWeight: 700, color: '#063669' }}>
                            {call.agentEngagementLabel}
                          </span>
                          <span style={{ fontSize: '0.825rem', fontWeight: 800, color: '#063669' }}>
                            {call.engagementPercentage}% {call.engagementLevel}
                          </span>
                        </div>

                        {/* Navy Progress Bar */}
                        <div
                          style={{
                            height: '6px',
                            backgroundColor: '#E2E8F0',
                            borderRadius: '3px',
                            overflow: 'hidden',
                            marginBottom: '0.45rem'
                          }}
                        >
                          <div
                            style={{
                              width: `${call.engagementPercentage}%`,
                              height: '100%',
                              backgroundColor: '#063669',
                              borderRadius: '3px'
                            }}
                          />
                        </div>

                        <div style={{ fontSize: '0.775rem', color: '#64748B', fontStyle: 'italic' }}>
                          {call.engagementCaption}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
