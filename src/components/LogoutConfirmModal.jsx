import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LuLogOut, LuX } from 'react-icons/lu';

export default function LogoutConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  user = { name: 'Rajesh Sharma', role: 'Sales Director', email: 'rajesh@techgylink.internal' }
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

  const initials = user?.name
    ? user.name
        .split(' ')
        .map((n) => n[0])
        .slice(0, 2)
        .join('')
        .toUpperCase()
    : 'RS';

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="logout-modal-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.22, ease: 'easeOut' }}
          onClick={onClose}
          aria-modal="true"
          role="dialog"
        >
          <motion.div
            className="logout-modal-card"
            onClick={(e) => e.stopPropagation()}
            initial={{ opacity: 0, scale: 0.92, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{
              opacity: 0,
              scale: 0.95,
              y: 12,
              transition: { duration: 0.18, ease: [0.16, 1, 0.3, 1] }
            }}
            transition={{
              type: 'spring',
              damping: 25,
              stiffness: 320,
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
              <div className="logout-modal-icon-inner">
                <LuLogOut size={26} />
              </div>
            </div>

            {/* Header Content */}
            <div className="logout-modal-header-text">
              <h3 className="logout-modal-title">Confirm Log Out</h3>
              <p className="logout-modal-desc">
                Are you sure you want to end your current session? You will be safely signed out of TechGy Link.
              </p>
            </div>

            {/* Active User Badge Card */}
            <div className="logout-user-preview">
              <div className="logout-user-avatar">{initials}</div>
              <div className="logout-user-info">
                <span className="logout-user-name">{user?.name || 'Rajesh Sharma'}</span>
                <span className="logout-user-role">
                  {user?.role || 'Sales Director'} {user?.email ? `• ${user.email}` : ''}
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="logout-modal-actions">
              <button
                type="button"
                className="logout-btn-cancel"
                onClick={onClose}
                autoFocus
              >
                Cancel
              </button>
              <button
                type="button"
                className="logout-btn-confirm"
                onClick={onConfirm}
              >
                <LuLogOut size={16} />
                <span>Yes, Log Out</span>
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
