import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LuCircleCheck, LuX, LuTriangleAlert, LuCircleAlert, LuInfo } from 'react-icons/lu';

const TOAST_TYPES = ['success', 'warning', 'error', 'info'];

const TOAST_ICONS = {
  success: LuCircleCheck,
  warning: LuTriangleAlert,
  error: LuCircleAlert,
  info: LuInfo
};

/**
 * Normalises the different call styles used across the app into one shape:
 *   createToast({ title, description, type })
 *   createToast('Title', 'warning')
 *   createToast('Title', 'Description')
 *   createToast('Title: Description')
 */
export function createToast(payload, descOrType = '') {
  let title = '';
  let description = '';
  let type = 'success';

  if (payload && typeof payload === 'object') {
    title = payload.title || '';
    description = payload.description || '';
    type = TOAST_TYPES.includes(payload.type) ? payload.type : 'success';
  } else if (typeof payload === 'string') {
    if (TOAST_TYPES.includes(descOrType)) {
      type = descOrType;
      title = payload;
    } else if (descOrType) {
      title = payload;
      description = descOrType;
    } else if (payload.includes(': ')) {
      const [t, ...rest] = payload.split(': ');
      title = t;
      description = rest.join(': ');
    } else {
      title = payload;
    }
  }

  return { id: `${Date.now()}-${Math.random().toString(36).slice(2, 6)}`, title, description, type };
}

export default function Toast({ toast, onDismiss }) {
  const Icon = toast ? (TOAST_ICONS[toast.type] || LuCircleCheck) : null;

  return (
    <div className="toast-container" aria-live="polite" role="region">
      <AnimatePresence mode="wait">
        {toast && (
          <motion.div
            key={toast.id}
            className={`toast-banner ${toast.type}`}
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.98, transition: { duration: 0.18, ease: [0.16, 1, 0.3, 1] } }}
            transition={{ type: 'spring', damping: 26, stiffness: 320, mass: 0.7 }}
            whileHover={{ y: -2, transition: { duration: 0.15 } }}
          >
            <motion.div
              className="toast-icon-wrap"
              initial={{ scale: 0.5, rotate: -12 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: 'spring', damping: 12, stiffness: 380, delay: 0.06 }}
            >
              <Icon size={18} />
            </motion.div>
            <div className="toast-content">
              <div className="toast-title">{toast.title}</div>
              {toast.description && <div className="toast-desc">{toast.description}</div>}
            </div>
            <button
              type="button"
              className="toast-dismiss-btn"
              onClick={onDismiss}
              title="Dismiss"
              aria-label="Dismiss notification"
            >
              <LuX size={16} />
            </button>
            <div className="toast-progress-bar" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
