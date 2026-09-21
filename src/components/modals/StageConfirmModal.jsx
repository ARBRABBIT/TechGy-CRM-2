import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LuArrowRight, LuX, LuGitCommitVertical, LuUser } from 'react-icons/lu';

export default function StageConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  lead,
  currentStage,
  targetStage
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

  if (!lead || !targetStage) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="logout-modal-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
          onClick={onClose}
          aria-modal="true"
          role="dialog"
        >
          <motion.div
            className="logout-modal-card"
            style={{ width: '460px', maxWidth: '92vw' }}
            onClick={(e) => e.stopPropagation()}
            initial={{ opacity: 0, scale: 0.94, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{
              opacity: 0,
              scale: 0.96,
              y: 8,
              transition: { duration: 0.18, ease: [0.22, 1, 0.36, 1] }
            }}
            transition={{
              type: 'spring',
              damping: 28,
              stiffness: 280,
              mass: 0.75
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
                  boxShadow: '0 4px 14px rgba(6, 54, 105, 0.12)',
                  border: '1px solid #C4DCF2'
                }}
              >
                <LuGitCommitVertical size={26} />
              </div>
            </div>

            {/* Header Content */}
            <div className="logout-modal-header-text">
              <h3 className="logout-modal-title">Confirm Stage Change</h3>
              <p className="logout-modal-desc">
                Are you sure you want to update the pipeline status for this lead?
              </p>
            </div>

            {/* Stage Transition Visualizer Card */}
            <div
              style={{
                width: '100%',
                margin: '1.25rem 0 1.5rem 0',
                padding: '1rem',
                background: '#F8FAFC',
                border: '1px solid #E2E8F0',
                borderRadius: '12px',
                textAlign: 'left',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.85rem'
              }}
            >
              {/* Lead Info Pill */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem' }}>
                <div style={{ width: '26px', height: '26px', borderRadius: '50%', background: '#063669', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <LuUser size={14} />
                </div>
                <div>
                  <div style={{ fontWeight: 700, color: '#063669', lineHeight: 1.2 }}>
                    {lead.leadName}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#64748B' }}>
                    {lead.company}
                  </div>
                </div>
              </div>

              {/* Stage Transition Arrow */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0.75rem',
                  background: '#FFFFFF',
                  borderRadius: '8px',
                  border: '1px solid #E2E8F0'
                }}
              >
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                  <span style={{ fontSize: '0.7rem', color: '#64748B', fontWeight: 600, textTransform: 'uppercase' }}>
                    Current Stage
                  </span>
                  <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#475569' }}>
                    {currentStage || lead.status}
                  </span>
                </div>

                <div style={{ width: '30px', height: '30px', borderRadius: '50%', background: '#F1F5F9', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#063669' }}>
                  <LuArrowRight size={16} />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem', alignItems: 'flex-end' }}>
                  <span style={{ fontSize: '0.7rem', color: '#063669', fontWeight: 600, textTransform: 'uppercase' }}>
                    New Stage
                  </span>
                  <span style={{
                    fontSize: '0.85rem',
                    fontWeight: 800,
                    color: '#FFFFFF',
                    backgroundColor: '#063669',
                    padding: '0.15rem 0.55rem',
                    borderRadius: '6px'
                  }}>
                    {targetStage}
                  </span>
                </div>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="logout-modal-actions" style={{ gap: '0.75rem' }}>
              <button
                type="button"
                className="logout-btn-cancel"
                onClick={onClose}
              >
                Cancel
              </button>
              <button
                type="button"
                className="logout-btn-confirm"
                style={{
                  backgroundColor: '#063669',
                  borderColor: '#063669',
                  color: '#FFFFFF',
                  boxShadow: '0 2px 6px rgba(6, 54, 105, 0.25)'
                }}
                onClick={() => {
                  onConfirm(targetStage);
                  onClose();
                }}
              >
                Update Stage
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
