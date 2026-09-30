import React, { useState, useRef, useEffect } from 'react';
import { LuChevronDown, LuCheck } from 'react-icons/lu';

export default function CustomDropdown({
  value,
  options = [],
  onChange,
  icon: Icon,
  placeholder = 'Select',
  minWidth = '145px'
}) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  const displayLabel =
    typeof value === 'object' && value !== null
      ? value.label || 'Custom'
      : value || placeholder;

  return (
    <div ref={containerRef} style={{ position: 'relative', display: 'inline-block' }}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.4rem',
          padding: '0.35rem 0.7rem',
          backgroundColor: '#FFFFFF',
          border: '1px solid rgba(0, 0, 0, 0.08)',
          borderRadius: '8px',
          fontSize: '0.785rem',
          fontWeight: 600,
          color: '#0F1A34',
          cursor: 'pointer',
          outline: 'none',
          height: '32px',
          transition: 'border-color 0.15s ease, background-color 0.15s ease'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.borderColor = 'rgba(0, 0, 0, 0.18)';
          e.currentTarget.style.backgroundColor = '#F8FAFC';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor = isOpen ? '#0022FF' : 'rgba(0, 0, 0, 0.08)';
          e.currentTarget.style.backgroundColor = '#FFFFFF';
        }}
      >
        {Icon && <Icon size={13} style={{ color: '#557396', flexShrink: 0 }} />}
        <span style={{ whiteSpace: 'nowrap', maxWidth: '110px', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {displayLabel}
        </span>
        <LuChevronDown
          size={12}
          style={{
            color: '#557396',
            flexShrink: 0,
            transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: 'transform 0.2s ease'
          }}
        />
      </button>

      {isOpen && (
        <div
          style={{
            position: 'absolute',
            top: 'calc(100% + 5px)',
            right: 0,
            zIndex: 150,
            minWidth: minWidth,
            backgroundColor: '#FFFFFF',
            borderRadius: '10px',
            border: '1px solid #E2E8F0',
            boxShadow: '0 10px 25px -5px rgba(6, 54, 105, 0.12), 0 8px 10px -6px rgba(6, 54, 105, 0.08)',
            padding: '0.35rem',
            maxHeight: '260px',
            overflowY: 'auto'
          }}
        >
          {options.map((option) => {
            const optVal = typeof option === 'object' ? option.value : option;
            const optLabel = typeof option === 'object' ? option.label : option;
            const isSelected = optVal === value || (typeof value === 'object' && value?.label === optLabel);

            return (
              <div
                key={optVal}
                onClick={() => {
                  onChange(optVal);
                  setIsOpen(false);
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0.45rem 0.65rem',
                  borderRadius: '6px',
                  fontSize: '0.785rem',
                  fontWeight: isSelected ? 700 : 500,
                  color: isSelected ? '#0022FF' : '#0F1A34',
                  backgroundColor: isSelected ? '#EBF0FF' : 'transparent',
                  cursor: 'pointer',
                  transition: 'background-color 0.12s ease'
                }}
                onMouseEnter={(e) => {
                  if (!isSelected) e.currentTarget.style.backgroundColor = '#F8FAFC';
                }}
                onMouseLeave={(e) => {
                  if (!isSelected) e.currentTarget.style.backgroundColor = 'transparent';
                }}
              >
                <span>{optLabel}</span>
                {isSelected && <LuCheck size={13} style={{ color: '#0022FF', flexShrink: 0 }} />}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
