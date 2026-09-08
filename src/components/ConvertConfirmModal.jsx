import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LuTrendingUp, LuX } from 'react-icons/lu';

export default function ConvertConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  lead
}) {
  // Handle ESC key press
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!lead) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="logout-modal-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
          onClick={onClose}
          aria-modal="true"
          role="dialog"
        >
          <motion.div
            className="logout-modal-card"
            style={{ width: '460px' }}
            onClick={(e) => e.stopPropagation()}
            initial={{ opacity: 0, scale: 0.94, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{
              opacity: 0,
              scale: 0.96,
              y: 8,
              transition: { duration: 0.2, ease: [0.22, 1, 0.36, 1] }
            }}
            transition={{
              type: 'spring',
              damping: 28,
              stiffness: 260,
              mass: 0.8
            }}
          >
            {/* Top Close Button */}
            <button
              type="button"
              className="logout-modal-close-btn"
              onClick={onClose}
              title="Close dialog"
              aria-label="Close dialog"
            >
              <LuX size={18} />
            </button>

            {/* Icon Header */}
            <div className="logout-modal-icon-wrap">
              <div
                className="logout-modal-icon-inner"
                style={{
                  background: 'linear-gradient(135deg, #EBF3FA 0%, #D8E7F6 100%)',
                  color: '#063669',
                  boxShadow: '0 4px 14px rgba(6, 54, 105, 0.15)',
                  border: '1px solid #C4DCF2'
                }}
              >
                <LuTrendingUp size={26} />
              </div>
            </div>

            {/* Header Content */}
            <div className="logout-modal-header-text">
              <h3 className="logout-modal-title">Convert to Opportunity</h3>
              <p className="logout-modal-desc">
                Are you sure you want to convert this lead into an active sales pipeline opportunity?
              </p>
            </div>

            {/* Opportunity Preview Card */}
            <div
              style={{
                width: '100%',
                margin: '1.25rem 0 1.5rem 0',
                padding: '0.85rem 1rem',
                background: '#F8FAFC',
                border: '1px solid #E2E8F0',
                borderRadius: '12px',
                textAlign: 'left',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.55rem'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: 500 }}>Lead & Company</span>
                <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#063669' }}>
                  {lead.leadName} • {lead.company}
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: 500 }}>Projected Value</span>
                <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#047857' }}>
                  ₹1,20,00,000
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: 500 }}>Initial Stage</span>
                <span style={{ fontSize: '0.825rem', fontWeight: 600, color: '#063669' }}>
                  Qualified (60% Probability)
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: 500 }}>Assigned Owner</span>
                <span style={{ fontSize: '0.825rem', fontWeight: 600, color: '#063669' }}>
                  {lead.leadOwner || 'Rajesh Sharma'}
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="logout-modal-actions">
              <button
                type="button"
                className="logout-btn-cancel"
                onClick={onClose}
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn-primary"
                style={{
                  flex: 1.35,
                  padding: '0.75rem 1rem',
                  fontSize: '0.9rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.45rem'
                }}
                onClick={() => {
                  onConfirm();
                  onClose();
                }}
              >
                <LuTrendingUp size={16} /> Confirm & Convert
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
