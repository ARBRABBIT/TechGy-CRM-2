import React, { useState, useEffect, useRef, useMemo } from 'react';
import { LuUser, LuExternalLink, LuMessageSquare, LuPaperclip, LuDatabase, LuSend, LuFileText, LuDownload } from 'react-icons/lu';

// Helper to extract a friendly time string (e.g. "10:31 AM") from activity date
const extractMessageTime = (dateStr) => {
  if (!dateStr) return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  if (dateStr.includes('•')) {
    return dateStr.split('•')[1].trim();
  }
  const parts = dateStr.trim().split(/\s+/);
  if (parts.length >= 3 && (parts[parts.length - 1].toUpperCase() === 'AM' || parts[parts.length - 1].toUpperCase() === 'PM')) {
    return `${parts[parts.length - 2]} ${parts[parts.length - 1]}`;
  }
  if (parts.length >= 2) {
    return parts.slice(1).join(' ');
  }
  return dateStr;
};

// Subtle, gentle micro-sound on dropdown/dock opening
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

// Official WhatsApp Double Tick Vector Component matching user's image exactly
const DoubleTickIcon = ({ color = '#53BDEB', size = 15, style = {} }) => (
  <svg
    viewBox="0 0 16 15"
    width={size}
    height={(size * 15) / 16}
    fill={color}
    style={{
      display: 'inline-block',
      verticalAlign: 'middle',
      flexShrink: 0,
      marginLeft: '2px',
      ...style
    }}
    title="Read"
    aria-label="Read"
  >
    <path d="M15.01 3.316l-.478-.372a.365.365 0 0 0-.51.063L8.666 9.88a.32.32 0 0 1-.484.032l-.358-.325a.32.32 0 0 0-.484.032l-.378.48a.418.418 0 0 0 .036.54l1.32 1.267a.32.32 0 0 0 .484-.034l6.272-8.048a.366.366 0 0 0-.064-.512zm-4.1 0l-.478-.372a.365.365 0 0 0-.51.063L4.566 9.88a.32.32 0 0 1-.484.032L1.892 7.77a.366.366 0 0 0-.516.005l-.423.433a.364.364 0 0 0 .006.514l3.255 3.185a.32.32 0 0 0 .484-.033l6.272-8.048a.365.365 0 0 0-.063-.51z" />
  </svg>
);

// Helper to render text with auto-detected hyperlinks and external link icons
const renderMessageTextWithLinks = (text, explicitLink) => {
  if (explicitLink) {
    return (
      <>
        <span>{text}</span>
        <a
          href={explicitLink}
          target="_blank"
          rel="noreferrer"
          style={{
            color: '#0284C7',
            textDecoration: 'none',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.25rem',
            wordBreak: 'break-all',
            fontWeight: 600
          }}
          onMouseEnter={(e) => { e.currentTarget.style.textDecoration = 'underline'; }}
          onMouseLeave={(e) => { e.currentTarget.style.textDecoration = 'none'; }}
        >
          {explicitLink}
          <LuExternalLink size={12} style={{ flexShrink: 0 }} />
        </a>
      </>
    );
  }

  if (!text) return null;

  const urlRegex = /(https?:\/\/[^\s]+)/g;
  const parts = text.split(urlRegex);

  return parts.map((part, i) => {
    if (part.match(urlRegex)) {
      return (
        <a
          key={i}
          href={part}
          target="_blank"
          rel="noreferrer"
          style={{
            color: '#0284C7',
            textDecoration: 'none',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.25rem',
            wordBreak: 'break-all',
            fontWeight: 600
          }}
          onMouseEnter={(e) => { e.currentTarget.style.textDecoration = 'underline'; }}
          onMouseLeave={(e) => { e.currentTarget.style.textDecoration = 'none'; }}
        >
          {part}
          <LuExternalLink size={12} style={{ flexShrink: 0 }} />
        </a>
      );
    }
    return <span key={i}>{part}</span>;
  });
};

export default function LeadChatHistory({ lead, activities = [], onSendMessage, onStartChat }) {
  const [isChatActive, setIsChatActive] = useState(false);
  const [inputText, setInputText] = useState('');
  const [showTemplatePicker, setShowTemplatePicker] = useState(false);
  const [localMessages, setLocalMessages] = useState([]);

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const templateMenuRef = useRef(null);
  const fileInputRef = useRef(null);

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    files.forEach((file, index) => {
      const sizeStr = file.size < 1024 * 1024
        ? `${(file.size / 1024).toFixed(1)} KB`
        : `${(file.size / (1024 * 1024)).toFixed(1)} MB`;

      const newMsg = {
        id: `local-file-${Date.now()}-${index}`,
        sender: 'company',
        text: file.name,
        fileName: file.name,
        fileSize: sizeStr,
        fileType: file.type || 'DOCUMENT',
        isFile: true,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        status: 'read'
      };

      setLocalMessages(prev => [...prev, newMsg]);

      if (onSendMessage) {
        onSendMessage(`[Attached Document: ${file.name} (${sizeStr})]`);
      }
    });

    e.target.value = '';
  };

  // Pre-approved WhatsApp Business Templates
  const templates = useMemo(() => [
    {
      id: 'tpl-1',
      name: 'project_selection_template_one',
      title: 'Project Selection Template 1',
      text: 'project_selection_template_one'
    },
    {
      id: 'tpl-2',
      name: 'rm_assignment',
      title: 'Relationship Manager Assigned',
      text: `RM01 FN has been assigned as your Relationship Manager. Contact: ${lead?.phoneNumber || '8374390802'}`
    },
    {
      id: 'tpl-3',
      name: 'experience_manager',
      title: 'Experience Manager Assigned',
      text: 'Hello, Your Experience Manager has been assigned. Name: EM01 DC Phone Number: 7995976617 They will contact you shortly.'
    },
    {
      id: 'tpl-4',
      name: 'site_visit_scheduled',
      title: 'Site Visit Confirmation',
      text: `Your visit is scheduled. EM: EM01 DC, Phone: 7995976617, Date/Time: 13 Aug 2026 03:00 PM, Map: https://planet-green-crm-v2-enhanced.netlify.app/leads/${lead?.id || 'lead'}?tab=visits`
    },
    {
      id: 'tpl-5',
      name: 'brochure_link',
      title: 'Product Brochure & Pricing',
      text: `Hi ${lead?.leadName?.split(' ')[0] || ''}, here is the enterprise brochure & pricing calculator for ${lead?.company || 'your organization'}: https://planet-green-crm-v2-enhanced.netlify.app/docs/pricing`
    }
  ], [lead]);

  // Build dynamic messages from CRM activities and local interactive messages
  const messages = useMemo(() => {
    // Filter actual SMS/WhatsApp activities for this lead
    const realChatActivities = (activities || []).filter(
      act => act && !String(act.id || '').includes('ACT-GEN') && (
        String(act.type || '').toLowerCase().includes('chat') ||
        String(act.type || '').toLowerCase().includes('whatsapp') ||
        String(act.type || '').toLowerCase().includes('sms') ||
        String(act.title || '').toLowerCase().includes('whatsapp') ||
        String(act.subject || '').toLowerCase().includes('whatsapp')
      )
    );

    // Sort in chronological order so newly added messages appear at the bottom
    const sorted = realChatActivities.slice().sort((a, b) => {
      const tsA = new Date(a.date).getTime();
      const tsB = new Date(b.date).getTime();
      if (!isNaN(tsA) && !isNaN(tsB) && tsA !== tsB) return tsA - tsB;
      const idNumA = parseInt(String(a.id || '').replace(/\D/g, '')) || 0;
      const idNumB = parseInt(String(b.id || '').replace(/\D/g, '')) || 0;
      return idNumA - idNumB;
    });

    const extraFromProps = sorted.map((act, index) => ({
      id: `real-msg-${act.id || index}`,
      sender: 'company',
      text: act.notes || act.message || act.subject || act.shortPreview || 'WhatsApp conversation logged.',
      time: extractMessageTime(act.date),
      status: 'read'
    }));

    // Merge without duplicating if already in props
    const propTextSet = new Set(extraFromProps.map(m => m.text));
    const uniqueLocals = localMessages.filter(lm => !propTextSet.has(lm.text));

    return [...extraFromProps, ...uniqueLocals];
  }, [activities, localMessages]);

  // Smoothly scroll down whenever new messages are added or input activated
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages.length, isChatActive]);

  // Close template menu on click outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (templateMenuRef.current && !templateMenuRef.current.contains(e.target)) {
        setShowTemplatePicker(false);
      }
    };
    if (showTemplatePicker) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showTemplatePicker]);

  const handleActivateChat = () => {
    playAccordionTick(true);
    setIsChatActive(true);
    setTimeout(() => {
      inputRef.current?.focus();
    }, 150);
  };

  const handleSend = () => {
    const trimmed = inputText.trim();
    if (!trimmed) return;

    const newMsg = {
      id: `local-msg-${Date.now()}`,
      sender: 'company',
      text: trimmed,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'read'
    };

    setLocalMessages(prev => [...prev, newMsg]);
    setInputText('');
    setShowTemplatePicker(false);

    // Persist to parent / CRM activities
    if (onSendMessage) {
      onSendMessage(trimmed);
    } else if (onStartChat) {
      onStartChat();
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleSelectTemplate = (tplText) => {
    setInputText(tplText);
    setShowTemplatePicker(false);
    setTimeout(() => {
      inputRef.current?.focus();
    }, 50);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {/* WhatsApp Chat Window Container */}
      <div
        style={{
          borderRadius: '10px',
          overflow: 'hidden',
          border: '1px solid #E2E8F0',
          boxShadow: '0 1px 4px rgba(6, 54, 105, 0.05)',
          backgroundColor: '#FFFFFF',
          position: 'relative'
        }}
      >
        {/* Top Header: Dark Green / Teal Bar */}
        <div
          style={{
            backgroundColor: '#075E54',
            padding: '0.85rem 1.25rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.9rem'
          }}
        >
          {/* Avatar */}
          <div
            style={{
              width: '38px',
              height: '38px',
              borderRadius: '50%',
              backgroundColor: '#CBD5E1',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#475569',
              flexShrink: 0
            }}
          >
            <LuUser size={22} strokeWidth={2.2} />
          </div>

          {/* Title & Status */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.1rem' }}>
            <div
              style={{
                color: '#FFFFFF',
                fontSize: '0.95rem',
                fontWeight: 700,
                letterSpacing: '0.01em'
              }}
            >
              Company Number Chat
            </div>
            <div
              style={{
                color: '#A7F3D0',
                fontSize: '0.735rem',
                fontStyle: 'italic',
                fontWeight: 500,
                opacity: 0.95
              }}
            >
              End-to-end encrypted
            </div>
          </div>
        </div>

        {/* Chat Canvas: Official WhatsApp Doodle Wallpaper */}
        <div
          style={{
            backgroundColor: '#EFEAE2',
            backgroundImage: "url('/whatsapp-bg.png')",
            backgroundRepeat: 'repeat',
            backgroundSize: '410px auto',
            backgroundBlendMode: 'multiply',
            padding: '1.5rem 1.35rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.85rem',
            minHeight: '380px',
            maxHeight: '490px',
            overflowY: 'auto'
          }}
        >
          {messages.length === 0 ? (
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              margin: 'auto',
              backgroundColor: '#FFFFFF',
              borderRadius: '10px',
              padding: '1.75rem 2rem',
              maxWidth: '380px',
              textAlign: 'center',
              boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
              border: '1px solid #E2E8F0'
            }}>
              <div style={{
                width: '42px',
                height: '42px',
                borderRadius: '50%',
                backgroundColor: '#DCF8C6',
                color: '#075E54',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '0.6rem'
              }}>
                <LuMessageSquare size={20} />
              </div>
              <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#1E293B', marginBottom: '0.35rem' }}>
                No Chat History
              </div>
              <p style={{ fontSize: '0.8rem', color: '#64748B', margin: 0, lineHeight: '1.5' }}>
                No WhatsApp messages exchanged with {lead?.leadName || 'this lead'} yet. Type a message below or select a template to start chatting.
              </p>
            </div>
          ) : (
            messages.map((msg) => {
            const isCompany = msg.sender === 'company';

            return (
              <div
                key={msg.id}
                style={{
                  display: 'flex',
                  justifyContent: isCompany ? 'flex-end' : 'flex-start',
                  width: '100%'
                }}
              >
                <div
                  style={{
                    backgroundColor: isCompany ? '#D9FDD3' : '#FFFFFF',
                    borderRadius: isCompany ? '8px 2px 8px 8px' : '2px 8px 8px 8px',
                    padding: '0.55rem 0.85rem 0.4rem 0.85rem',
                    maxWidth: '82%',
                    boxShadow: '0 1px 1px rgba(0, 0, 0, 0.08)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.25rem',
                    position: 'relative'
                  }}
                >
                  {/* Message Content */}
                  {msg.isFile ? (
                    <div
                      style={{
                        backgroundColor: 'rgba(255, 255, 255, 0.85)',
                        borderRadius: '6px',
                        padding: '0.5rem 0.75rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.65rem',
                        border: '1px solid rgba(0, 0, 0, 0.06)',
                        minWidth: '200px'
                      }}
                    >
                      <div
                        style={{
                          width: '32px',
                          height: '32px',
                          borderRadius: '6px',
                          backgroundColor: '#E2E8F0',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: '#075E54',
                          flexShrink: 0
                        }}
                      >
                        <LuFileText size={18} />
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', flex: 1, minWidth: 0 }}>
                        <span
                          style={{
                            fontSize: '0.825rem',
                            fontWeight: 600,
                            color: '#0F172A',
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis'
                          }}
                          title={msg.fileName || msg.text}
                        >
                          {msg.fileName || msg.text}
                        </span>
                        <span style={{ fontSize: '0.7rem', color: '#64748B' }}>
                          {msg.fileSize || 'DOCUMENT'}
                        </span>
                      </div>
                      <LuDownload size={15} style={{ color: '#64748B', flexShrink: 0 }} />
                    </div>
                  ) : (
                    <div
                      style={{
                        fontSize: '0.85rem',
                        lineHeight: '1.42',
                        color: '#111827',
                        wordBreak: 'break-word'
                      }}
                    >
                      {renderMessageTextWithLinks(msg.text, msg.link)}
                    </div>
                  )}

                  {/* Message Footer: Time + Blue Double Check */}
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'flex-end',
                      gap: '0.25rem',
                      alignSelf: 'flex-end',
                      marginTop: '0.1rem'
                    }}
                  >
                    <span
                      style={{
                        fontSize: '0.675rem',
                        color: '#667781',
                        fontWeight: 500,
                        lineHeight: 1
                      }}
                    >
                      {msg.time}
                    </span>
                    {isCompany && (
                      <DoubleTickIcon size={15} color="#53BDEB" />
                    )}
                  </div>
                </div>
              </div>
            );
          }))}
          <div ref={messagesEndRef} />
        </div>

        {/* Sub-Footer: WhatsApp API Disclaimer */}
        <div
          style={{
            backgroundColor: '#F8FAFC',
            borderTop: '1px solid #E2E8F0',
            padding: '0.5rem 1rem',
            textAlign: 'center',
            color: '#64748B',
            fontSize: '0.735rem',
            fontWeight: 500
          }}
        >
          Interaction logged from Official WhatsApp Business API
        </div>

        {/* In-Canvas WhatsApp Reply / Template Input Dock with Smooth Animation */}
        <div
          style={{
            display: 'grid',
            gridTemplateRows: isChatActive ? '1fr' : '0fr',
            transition: 'grid-template-rows 0.35s cubic-bezier(0.16, 1, 0.3, 1)'
          }}
        >
          <div
            style={{
              overflow: isChatActive ? 'visible' : 'hidden',
              minHeight: 0,
              opacity: isChatActive ? 1 : 0,
              transform: isChatActive ? 'translateY(0)' : 'translateY(14px)',
              transition: 'opacity 0.28s cubic-bezier(0.16, 1, 0.3, 1), transform 0.35s cubic-bezier(0.16, 1, 0.3, 1)'
            }}
          >
            <div
              style={{
                backgroundColor: '#F0F2F5',
                borderTop: '1px solid #E2E8F0',
                padding: '0.65rem 1rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                position: 'relative'
              }}
            >
            {/* Hidden File Input */}
            <input
              ref={fileInputRef}
              type="file"
              style={{ display: 'none' }}
              onChange={handleFileSelect}
              multiple
              accept="*/*"
            />

            {/* Clip / Attachment Button */}
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: '#54656F',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '0.35rem',
                borderRadius: '50%',
                transition: 'background-color 0.15s ease'
              }}
              onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'rgba(0,0,0,0.05)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
              title="Attach files from computer"
            >
              <LuPaperclip size={20} />
            </button>

            {/* Master Data / Template Picker Button */}
            <button
              type="button"
              onClick={() => setShowTemplatePicker(!showTemplatePicker)}
              style={{
                background: showTemplatePicker ? '#E2E8F0' : 'none',
                border: 'none',
                cursor: 'pointer',
                color: showTemplatePicker ? '#00A884' : '#54656F',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '0.35rem',
                borderRadius: '6px',
                transition: 'all 0.15s ease'
              }}
              onMouseEnter={(e) => { if (!showTemplatePicker) e.currentTarget.style.backgroundColor = 'rgba(0,0,0,0.05)'; }}
              onMouseLeave={(e) => { if (!showTemplatePicker) e.currentTarget.style.backgroundColor = 'transparent'; }}
              title="Select Master Data / WhatsApp Template"
            >
              <LuDatabase size={19} />
            </button>

            {/* Template Selector Dropdown Popover */}
            {showTemplatePicker && (
              <div
                ref={templateMenuRef}
                style={{
                  position: 'absolute',
                  bottom: '100%',
                  left: '1rem',
                  marginBottom: '0.5rem',
                  width: '360px',
                  maxWidth: 'calc(100% - 2rem)',
                  backgroundColor: '#FFFFFF',
                  borderRadius: '10px',
                  boxShadow: '0 4px 16px rgba(0, 0, 0, 0.15)',
                  border: '1px solid #E2E8F0',
                  padding: '0.65rem 0',
                  zIndex: 20,
                  animation: 'fadeIn 0.15s ease-out'
                }}
              >
                <div
                  style={{
                    padding: '0.35rem 1rem 0.5rem 1rem',
                    fontSize: '0.725rem',
                    fontWeight: 700,
                    color: '#64748B',
                    textTransform: 'uppercase',
                    letterSpacing: '0.04em',
                    borderBottom: '1px solid #F1F5F9'
                  }}
                >
                  Official WhatsApp Templates
                </div>

                <div style={{ maxHeight: '240px', overflowY: 'auto' }}>
                  {templates.map((tpl) => (
                    <div
                      key={tpl.id}
                      onClick={() => handleSelectTemplate(tpl.text)}
                      style={{
                        padding: '0.65rem 1rem',
                        cursor: 'pointer',
                        transition: 'background-color 0.15s ease',
                        borderBottom: '1px solid #F8FAFC'
                      }}
                      onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#F0FDF4'; }}
                      onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
                    >
                      <div style={{ fontSize: '0.825rem', fontWeight: 600, color: '#063669' }}>
                        {tpl.title}
                      </div>
                      <div
                        style={{
                          fontSize: '0.75rem',
                          color: '#64748B',
                          marginTop: '0.15rem',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis'
                        }}
                      >
                        {tpl.text}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Input Field */}
            <div style={{ flex: 1, position: 'relative' }}>
              <input
                ref={inputRef}
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Select a template above to reply"
                style={{
                  width: '100%',
                  backgroundColor: '#FFFFFF',
                  border: '1px solid #E2E8F0',
                  borderRadius: '8px',
                  padding: '0.6rem 0.95rem',
                  fontSize: '0.875rem',
                  color: '#111827',
                  outline: 'none',
                  boxSizing: 'border-box',
                  boxShadow: 'inset 0 1px 2px rgba(0, 0, 0, 0.02)'
                }}
                onFocus={(e) => { e.target.style.borderColor = '#7AC7A5'; }}
                onBlur={(e) => { e.target.style.borderColor = '#E2E8F0'; }}
              />
            </div>

            {/* Send Button: Mint green when empty, switches to Dark Green (#075E54) when typing */}
            {(() => {
              const hasText = inputText.trim().length > 0;
              const activeBg = hasText ? '#075E54' : '#7AC7A5';
              const hoverBg = hasText ? '#054840' : '#62B892';

              return (
                <button
                  type="button"
                  onClick={handleSend}
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '50%',
                    backgroundColor: activeBg,
                    color: '#FFFFFF',
                    border: 'none',
                    padding: 0,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: hasText ? 'pointer' : 'default',
                    flexShrink: 0,
                    boxShadow: hasText ? '0 2px 4px rgba(7, 94, 84, 0.3)' : '0 1px 3px rgba(0, 0, 0, 0.12)',
                    transition: 'background-color 0.2s ease, transform 0.15s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = hoverBg;
                    if (hasText) e.currentTarget.style.transform = 'scale(1.05)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = activeBg;
                    e.currentTarget.style.transform = 'scale(1)';
                  }}
                  title={hasText ? 'Send message' : 'Type a message to send'}
                >
                  <LuSend size={16} style={{ display: 'block', transform: 'translate(-1.5px, 1px)' }} />
                </button>
              );
            })()}
          </div>
        </div>
      </div>
      </div>

      {/* Action Row: START CHAT button on bottom right with Smooth Transition */}
      <div
        style={{
          display: 'grid',
          gridTemplateRows: !isChatActive ? '1fr' : '0fr',
          transition: 'grid-template-rows 0.32s cubic-bezier(0.16, 1, 0.3, 1), margin-top 0.28s ease',
          marginTop: !isChatActive ? '0' : '-0.75rem'
        }}
      >
        <div
          style={{
            overflow: 'hidden',
            minHeight: 0,
            opacity: !isChatActive ? 1 : 0,
            transform: !isChatActive ? 'translateY(0) scale(1)' : 'translateY(-6px) scale(0.96)',
            transition: 'opacity 0.22s ease, transform 0.28s cubic-bezier(0.16, 1, 0.3, 1)',
            pointerEvents: !isChatActive ? 'auto' : 'none',
            display: 'flex',
            justifyContent: 'flex-end'
          }}
        >
          <button
            type="button"
            onClick={handleActivateChat}
            style={{
              backgroundColor: '#075E54',
              color: '#FFFFFF',
              border: 'none',
              borderRadius: '6px',
              padding: '0.6rem 1.35rem',
              fontSize: '0.8rem',
              fontWeight: 700,
              letterSpacing: '0.04em',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              cursor: 'pointer',
              boxShadow: '0 2px 4px rgba(7, 94, 84, 0.25)',
              transition: 'background-color 0.15s ease, transform 0.1s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#054840';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#075E54';
            }}
            title={`Start official WhatsApp conversation with ${lead?.leadName || 'lead'}`}
          >
            <LuMessageSquare size={16} />
            START CHAT
          </button>
        </div>
      </div>
    </div>
  );
}
