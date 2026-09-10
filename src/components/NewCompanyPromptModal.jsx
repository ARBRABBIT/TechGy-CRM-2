import React, { useEffect, useRef } from 'react';
import { LuBuilding2, LuX, LuArrowRight } from 'react-icons/lu';
import { animateModalEnter } from '../utils/animations';

export default function NewCompanyPromptModal({
  isOpen,
  companyName,
  onConfirm,
  onClose
}) {
  const overlayRef = useRef(null);
  const cardRef = useRef(null);

  useEffect(() => {
    if (isOpen && cardRef.current) {
      animateModalEnter(cardRef.current, overlayRef.current);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" ref={overlayRef} onClick={onClose}>
      <div
        className="modal-card"
        ref={cardRef}
        onClick={(e) => e.stopPropagation()}
        style={{
          maxWidth: '480px',
          width: '90%',
          padding: '1.75rem',
          borderRadius: '14px',
          textAlign: 'center'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'flex-end', margin: '-0.5rem -0.5rem 0.5rem 0' }}>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: '#94A3B8',
              padding: '4px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <LuX size={20} />
          </button>
        </div>

        <div style={{
          width: '56px',
          height: '56px',
          borderRadius: '50%',
          backgroundColor: '#EBF3FA',
          color: '#063669',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 1.15rem auto'
        }}>
          <LuBuilding2 size={28} />
        </div>

        <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#063669', margin: '0 0 0.5rem 0' }}>
          New Company Created
        </h3>

        <p style={{ fontSize: '0.875rem', color: '#557396', lineHeight: 1.55, margin: '0 0 1.5rem 0' }}>
          You have created a record for <strong>{companyName}</strong>. Please enter the required company details (Industry, Website, Location, Estimated Worth) to complete the profile.
        </p>

        <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
          <button
            type="button"
            className="btn-secondary"
            onClick={onClose}
            style={{ padding: '0.55rem 1.15rem', borderRadius: '8px', fontSize: '0.85rem', fontWeight: 600 }}
          >
            Skip for Now
          </button>
          <button
            type="button"
            className="btn-primary"
            onClick={onConfirm}
            style={{
              padding: '0.55rem 1.25rem',
              borderRadius: '8px',
              fontSize: '0.85rem',
              fontWeight: 700,
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.45rem'
            }}
          >
            <span>Enter Company Details</span>
            <LuArrowRight size={15} />
          </button>
        </div>
      </div>
    </div>
  );
}
