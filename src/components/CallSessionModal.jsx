import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LuPhone,
  LuPhoneCall,
  LuMic,
  LuMicOff,
  LuPause,
  LuPlay,
  LuMinimize2,
  LuMaximize2,
  LuFileText,
  LuVolume2,
  LuVolumeX,
  LuLayoutGrid,
  LuSparkles
} from 'react-icons/lu';

// Pleasant Web Audio synthesizer for phone tones (SSR and browser safe)
const playTone = (type) => {
  try {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return null;
    const ctx = new AudioCtx();

    if (type === 'ring') {
      // Realistic US/International Ringback tone (440Hz + 480Hz)
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gain = ctx.createGain();

      osc1.type = 'sine';
      osc2.type = 'sine';
      osc1.frequency.value = 440;
      osc2.frequency.value = 480;

      gain.gain.setValueAtTime(0.04, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 1.2);

      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(ctx.destination);

      osc1.start();
      osc2.start();
      osc1.stop(ctx.currentTime + 1.25);
      osc2.stop(ctx.currentTime + 1.25);
      return ctx;
    }

    if (type === 'connect') {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(520, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.12);
      gain.gain.setValueAtTime(0.05, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.15);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.15);
    }

    if (type === 'hangup') {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(400, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(220, ctx.currentTime + 0.18);
      gain.gain.setValueAtTime(0.06, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.2);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.2);
    }

    if (type === 'dtmf') {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(697, ctx.currentTime);
      gain.gain.setValueAtTime(0.05, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.08);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.08);
    }
  } catch {
    // Graceful fallback if user hasn't interacted or audio is muted
  }
};

export default function CallSessionModal({
  callSession,
  onConfirmCall,
  onCancelConfirm,
  onSimulatePickup,
  onToggleMinimize,
  onToggleMute,
  onToggleHold,
  onUpdateNotes,
  onEndCall
}) {
  const [showKeypad, setShowKeypad] = useState(false);
  const [showNotesDrawer, setShowNotesDrawer] = useState(false);
  const [dialedDigits, setDialedDigits] = useState('');
  const [audioEnabled, setAudioEnabled] = useState(true);
  const ringIntervalRef = useRef(null);

  const {
    lead,
    status, // 'confirming' | 'ringing' | 'connected' | 'ended'
    isMinimized = false,
    durationSeconds = 0,
    isMuted = false,
    isOnHold = false,
    notes = ''
  } = callSession || {};

  // Audio ring simulation during ringing status
  useEffect(() => {
    if (status === 'ringing' && audioEnabled) {
      playTone('ring');
      ringIntervalRef.current = setInterval(() => {
        playTone('ring');
      }, 2400);
    } else {
      if (ringIntervalRef.current) {
        clearInterval(ringIntervalRef.current);
        ringIntervalRef.current = null;
      }
    }

    return () => {
      if (ringIntervalRef.current) {
        clearInterval(ringIntervalRef.current);
      }
    };
  }, [status, audioEnabled]);

  // Play connect tone when transitioning to connected
  useEffect(() => {
    if (status === 'connected') {
      playTone('connect');
    }
  }, [status]);

  if (!callSession || !lead) return null;

  // Format MM:SS duration counter
  const formatTime = (secs) => {
    const mins = Math.floor(secs / 60);
    const remSecs = secs % 60;
    return `${String(mins).padStart(2, '0')}:${String(remSecs).padStart(2, '0')}`;
  };

  const leadInitials = (lead.leadName || 'Lead')
    .split(' ')
    .map(w => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  const handleKeypadPress = (val) => {
    setDialedDigits(prev => prev + val);
    playTone('dtmf');
  };

  return (
    <AnimatePresence mode="wait">
      {/* 1. MINIMIZED STATE (Floating Right-Side Widget) */}
      {isMinimized && (status === 'connected' || status === 'ringing') && (
        <motion.div
          key="floating-call-bar"
          className="floating-call-bar"
          initial={{ opacity: 0, scale: 0.5, x: 100, y: 100 }}
          animate={{ opacity: 1, scale: 1, x: 0, y: 0 }}
          exit={{ opacity: 0, scale: 0.5, x: 100, y: 100 }}
          transition={{ type: 'spring', damping: 24, stiffness: 320, mass: 0.75 }}
          style={{ cursor: 'pointer' }}
          onClick={onToggleMinimize}
        >
          <div className="floating-avatar">
            {leadInitials}
            <span
              className="floating-avatar-dot"
              style={{ backgroundColor: status === 'ringing' ? '#063669' : '#10B981' }}
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', flex: 1, minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
              <span style={{ fontWeight: 700, fontSize: '0.85rem', color: '#063669', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {lead.leadName}
              </span>
              <span style={{ fontSize: '0.72rem', color: '#557396' }}>
                ({lead.company})
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginTop: '0.15rem' }}>
              {status === 'ringing' ? (
                <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#063669', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                  <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#063669', display: 'inline-block', animation: 'pulseRingingDot 1.5s infinite' }} />
                  Ringing...
                </span>
              ) : (
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: isOnHold ? '#D97706' : '#059669', display: 'flex', alignItems: 'center', gap: '0.35rem', fontVariantNumeric: 'tabular-nums' }}>
                  <span style={{ width: 6, height: 6, borderRadius: '50%', background: isOnHold ? '#D97706' : '#10B981', display: 'inline-block', animation: isOnHold ? 'none' : 'pulseGreenDot 1.5s infinite' }} />
                  {isOnHold ? 'On Hold' : formatTime(durationSeconds)}
                  {isMuted && <span style={{ color: '#DC2626', fontSize: '0.7rem', fontWeight: 600 }}>(Muted)</span>}
                </span>
              )}
            </div>
          </div>

          {/* Quick action buttons in floating bar */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }} onClick={e => e.stopPropagation()}>
            {status === 'connected' && (
              <button
                type="button"
                className={`call-btn-tool ${isMuted ? 'muted-active' : ''}`}
                style={{ width: 34, height: 34 }}
                onClick={onToggleMute}
                title={isMuted ? 'Unmute' : 'Mute'}
              >
                {isMuted ? <LuMicOff size={15} /> : <LuMic size={15} />}
              </button>
            )}

            <button
              type="button"
              className="call-btn-tool"
              style={{ width: 34, height: 34 }}
              onClick={onToggleMinimize}
              title="Expand Call Window"
            >
              <LuMaximize2 size={15} />
            </button>

            <button
              type="button"
              className="call-action-btn-circle call-btn-hangup"
              style={{ width: 34, height: 34 }}
              onClick={() => {
                playTone('hangup');
                onEndCall();
              }}
              title="End Call"
            >
              <LuPhone size={15} style={{ transform: 'rotate(135deg)' }} />
            </button>
          </div>
        </motion.div>
      )}

      {/* 2. CONFIRMATION POP-UP MODAL ("Are you sure want to call?") */}
      {!isMinimized && status === 'confirming' && (
        <motion.div
          key="confirm-modal-overlay"
          className="call-modal-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            key="confirm-modal-card"
            className="call-modal-card"
            initial={{ opacity: 0, scale: 0.9, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', damping: 26, stiffness: 340, mass: 0.8 }}
            style={{ maxWidth: '420px', padding: '1.75rem 1.5rem' }}
          >
            {/* Header Icon */}
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.25rem' }}>
              <div style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                backgroundColor: '#EBF3FA',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#063669',
                boxShadow: '0 0 0 8px rgba(6, 54, 105, 0.06)'
              }}>
                <LuPhoneCall size={28} />
              </div>
            </div>

            <div style={{ textAlign: 'center', marginBottom: '1.35rem' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#063669', margin: '0 0 0.35rem 0' }}>
                Confirm Voice Call
              </h3>
              <p style={{ fontSize: '0.875rem', color: '#557396', margin: 0 }}>
                Are you sure you want to call this lead?
              </p>
            </div>

            {/* Lead Information Card */}
            <div style={{
              background: '#F8FAFC',
              border: '1px solid #E2E8F0',
              borderRadius: '12px',
              padding: '1rem',
              marginBottom: '1.5rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.65rem'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #063669 0%, #1E5B99 100%)',
                  color: '#FFFFFF',
                  fontWeight: 800,
                  fontSize: '0.9rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  {leadInitials}
                </div>
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontWeight: 800, color: '#063669', fontSize: '0.95rem' }}>
                    {lead.leadName}
                  </div>
                  <div style={{ fontSize: '0.775rem', color: '#557396' }}>
                    {lead.designation} • {lead.company}
                  </div>
                </div>
              </div>

              <div style={{ height: '1px', background: '#E2E8F0', margin: '0.15rem 0' }} />

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.8rem' }}>
                <span style={{ color: '#557396', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <LuPhone size={13} /> Phone:
                </span>
                <strong style={{ color: '#063669', letterSpacing: '0.02em' }}>
                  {lead.phoneNumber || '+91 98765 43210'}
                </strong>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.775rem' }}>
                <span style={{ color: '#557396' }}>Account Owner:</span>
                <span style={{ color: '#063669', fontWeight: 600 }}>{lead.leadOwner || 'Rajesh Sharma'}</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button
                type="button"
                className="logout-btn-cancel"
                onClick={onCancelConfirm}
                style={{ padding: '0.65rem 1rem', fontSize: '0.875rem' }}
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn-primary"
                onClick={onConfirmCall}
                style={{
                  flex: 1.25,
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                  padding: '0.65rem 1rem',
                  borderRadius: '9999px',
                  fontSize: '0.875rem',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                <LuPhoneCall size={16} /> Call Now
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* 3. RINGING & CONNECTED FULL MODAL POP-UP */}
      {!isMinimized && status !== 'confirming' && (
        <motion.div
          key="active-call-overlay"
          className="call-modal-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.22 } }}
        >
          <motion.div
            key="full-call-modal-card"
            className="call-modal-card"
            initial={{ opacity: 0, scale: 0.6, x: 220, y: 220 }}
            animate={{ opacity: 1, scale: 1, x: 0, y: 0 }}
            exit={{
              opacity: 0,
              scale: 0.35,
              x: 280,
              y: 280,
              transition: { duration: 0.26, ease: [0.16, 1, 0.3, 1] }
            }}
            transition={{ type: 'spring', damping: 26, stiffness: 300, mass: 0.75 }}
            style={{ padding: '1.5rem', maxWidth: '440px' }}
          >
            {/* Top Control Bar: Status indicator, Sound toggle, and Minimize button */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <span style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  padding: '0.2rem 0.6rem',
                  borderRadius: '9999px',
                  backgroundColor: status === 'connected' ? (isOnHold ? '#FEF3C7' : '#ECFDF5') : '#EBF3FA',
                  color: status === 'connected' ? (isOnHold ? '#D97706' : '#059669') : '#063669'
                }}>
                  <span style={{
                    width: 6,
                    height: 6,
                    borderRadius: '50%',
                    backgroundColor: status === 'connected' ? (isOnHold ? '#D97706' : '#10B981') : '#063669',
                    display: 'inline-block',
                    animation: status === 'connected' && !isOnHold ? 'pulseGreenDot 1.5s infinite' : status === 'ringing' ? 'pulseRingingDot 1.5s infinite' : 'none'
                  }} />
                  {status === 'ringing' ? 'Outgoing Call • Ringing...' : isOnHold ? 'Call On Hold' : 'Connected • Live'}
                </span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <button
                  type="button"
                  style={{
                    background: '#F0F5FA',
                    border: '1px solid #D5E2EE',
                    color: '#557396',
                    cursor: 'pointer',
                    padding: '5px 6px',
                    borderRadius: '7px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all 0.15s ease'
                  }}
                  onClick={() => setAudioEnabled(!audioEnabled)}
                  title={audioEnabled ? 'Mute tone' : 'Enable tone'}
                >
                  {audioEnabled ? <LuVolume2 size={15} /> : <LuVolumeX size={15} />}
                </button>

                {/* Dedicated Top Header Minimize Button */}
                <button
                  type="button"
                  style={{
                    background: '#F0F5FA',
                    border: '1px solid #D5E2EE',
                    color: '#063669',
                    cursor: 'pointer',
                    padding: '4px 9px',
                    borderRadius: '7px',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.35rem',
                    fontSize: '0.725rem',
                    fontWeight: 700,
                    transition: 'all 0.15s ease'
                  }}
                  onClick={onToggleMinimize}
                  title="Minimize to Dashboard"
                >
                  <LuMinimize2 size={13} /> Minimize
                </button>
              </div>
            </div>

            {/* Center Ringing / Profile Hero */}
            <div style={{ textAlign: 'center', padding: '1rem 0' }}>
              <div className="call-avatar-wrap" style={{ marginBottom: '1.25rem' }}>
                {status === 'ringing' && (
                  <>
                    <div className="call-ripple-1" />
                    <div className="call-ripple-2" />
                    <div className="call-ripple-3" />
                  </>
                )}
                <div className="call-avatar-circle">
                  {leadInitials}
                </div>
              </div>

              <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#063669', margin: '0 0 0.25rem 0' }}>
                {lead.leadName}
              </h2>
              <div style={{ fontSize: '0.85rem', color: '#557396', marginBottom: '0.35rem' }}>
                {lead.designation} • {lead.company}
              </div>
              <div style={{ fontSize: '0.8rem', color: '#063669', fontWeight: 600, letterSpacing: '0.02em' }}>
                {lead.phoneNumber || '+91 98765 43210'}
              </div>

              {/* Connected Duration Timer (Number Count) */}
              {status === 'connected' && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  style={{ marginTop: '1rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.4rem' }}
                >
                  <div style={{
                    fontFamily: 'monospace',
                    fontSize: '1.75rem',
                    fontWeight: 800,
                    color: isOnHold ? '#D97706' : '#063669',
                    letterSpacing: '0.05em',
                    fontVariantNumeric: 'tabular-nums'
                  }}>
                    {formatTime(durationSeconds)}
                  </div>

                  {/* Dynamic Animated Soundwave Frequency Bars */}
                  {!isOnHold && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', height: '28px', marginTop: '0.2rem' }}>
                      {[0.4, 0.9, 0.6, 1.2, 0.7, 1.5, 0.8, 1.1, 0.5, 1.3, 0.9, 0.4].map((scale, i) => (
                        <div
                          key={i}
                          className="call-sound-bar"
                          style={{
                            animationDuration: `${0.6 + (i % 5) * 0.2}s`,
                            animationDelay: `${i * 0.08}s`,
                            height: `${10 + (i % 4) * 5}px`
                          }}
                        />
                      ))}
                    </div>
                  )}
                </motion.div>
              )}

              {/* Quick Pickup Simulation for Ringing State */}
              {status === 'ringing' && (
                <div style={{ marginTop: '1.25rem' }}>
                  <button
                    type="button"
                    onClick={onSimulatePickup}
                    style={{
                      background: '#F0F5FA',
                      border: '1px dashed #063669',
                      borderRadius: '20px',
                      padding: '0.35rem 0.85rem',
                      fontSize: '0.75rem',
                      color: '#063669',
                      fontWeight: 600,
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.3rem'
                    }}
                  >
                    <LuSparkles size={13} /> Pick Up Now
                  </button>
                </div>
              )}
            </div>

            {/* DTMF Keypad Overlay */}
            <AnimatePresence>
              {showKeypad && status === 'connected' && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  style={{ overflow: 'hidden', background: '#F8FAFC', borderRadius: '12px', padding: '0.75rem', marginBottom: '1rem', border: '1px solid #E2E8F0' }}
                >
                  <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#063669', textAlign: 'center', minHeight: '22px', marginBottom: '0.5rem', letterSpacing: '0.15em' }}>
                    {dialedDigits || 'Press keys'}
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.4rem' }}>
                    {['1', '2', '3', '4', '5', '6', '7', '8', '9', '*', '0', '#'].map(key => (
                      <button
                        key={key}
                        type="button"
                        onClick={() => handleKeypadPress(key)}
                        style={{
                          padding: '0.5rem',
                          borderRadius: '8px',
                          border: '1px solid #CBD5E1',
                          background: '#FFFFFF',
                          fontSize: '0.95rem',
                          fontWeight: 700,
                          color: '#063669',
                          cursor: 'pointer'
                        }}
                      >
                        {key}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Quick In-Call Notes Area */}
            <AnimatePresence>
              {showNotesDrawer && status === 'connected' && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  style={{ overflow: 'hidden', marginBottom: '1rem' }}
                >
                  <textarea
                    value={notes}
                    onChange={(e) => onUpdateNotes(e.target.value)}
                    placeholder="Type live call notes here... (auto-saved to timeline on end)"
                    style={{
                      width: '100%',
                      height: '70px',
                      borderRadius: '10px',
                      border: '1px solid #CBD5E1',
                      padding: '0.55rem',
                      fontSize: '0.8rem',
                      resize: 'none',
                      fontFamily: 'inherit'
                    }}
                  />
                </motion.div>
              )}
            </AnimatePresence>

            {/* In-Call Tool Controls Row (Clean 4-Icon Stack: Mic, Hold, Dialpad, Notes) */}
            {status === 'connected' && (
              <div style={{
                display: 'flex',
                justifyContent: 'center',
                gap: '1rem',
                marginBottom: '1.5rem',
                paddingTop: '0.5rem',
                borderTop: '1px solid #E2E8F0'
              }}>
                <button
                  type="button"
                  className={`call-btn-tool ${isMuted ? 'muted-active' : ''}`}
                  onClick={onToggleMute}
                  title={isMuted ? 'Unmute microphone' : 'Mute microphone'}
                >
                  {isMuted ? <LuMicOff size={18} /> : <LuMic size={18} />}
                </button>

                <button
                  type="button"
                  className={`call-btn-tool ${isOnHold ? 'active' : ''}`}
                  onClick={onToggleHold}
                  title={isOnHold ? 'Resume Call' : 'Hold Call'}
                >
                  {isOnHold ? <LuPlay size={18} /> : <LuPause size={18} />}
                </button>

                <button
                  type="button"
                  className={`call-btn-tool ${showKeypad ? 'active' : ''}`}
                  onClick={() => setShowKeypad(!showKeypad)}
                  title="Toggle Dialpad"
                >
                  <LuLayoutGrid size={18} />
                </button>

                <button
                  type="button"
                  className={`call-btn-tool ${showNotesDrawer ? 'active' : ''}`}
                  onClick={() => setShowNotesDrawer(!showNotesDrawer)}
                  title="Add In-Call Note"
                >
                  <LuFileText size={18} />
                </button>
              </div>
            )}

            {/* Bottom Hangup / End Action Button */}
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <button
                type="button"
                className="call-action-btn-circle call-btn-hangup"
                onClick={() => {
                  playTone('hangup');
                  onEndCall();
                }}
                title="End Call"
              >
                <LuPhone size={22} style={{ transform: 'rotate(135deg)' }} />
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
