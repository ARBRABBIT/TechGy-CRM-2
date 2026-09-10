import React, { useState, useRef, useEffect } from 'react';
import { LuChevronDown, LuCheck } from 'react-icons/lu';

export default function MultiSelectFilter({
  label = 'Filter',
  allLabel = 'All',
  options = [],
  selected = [],
  onChange,
  style = {}
}) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleToggle = (opt) => {
    if (selected.includes(opt)) {
      onChange(selected.filter(item => item !== opt));
    } else {
      onChange([...selected, opt]);
    }
  };

  const isAllSelected = selected.length === 0 || selected.length === options.length;

  const getDisplayText = () => {
    if (selected.length === 0 || selected.length === options.length) {
      return allLabel;
    }
    if (selected.length === 1) {
      return selected[0];
    }
    return `${label} (${selected.length})`;
  };

  return (
    <div ref={dropdownRef} style={{ position: 'relative', display: 'inline-block', zIndex: isOpen ? 60 : 1, ...style }}>
      <button
        type="button"
        onClick={() => setIsOpen(prev => !prev)}
        className="select-filter"
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '0.5rem',
          cursor: 'pointer',
          userSelect: 'none',
          backgroundImage: 'none',
          backgroundColor: selected.length > 0 && selected.length < options.length ? '#EBF3FA' : '#FFFFFF',
          borderColor: selected.length > 0 && selected.length < options.length ? '#063669' : '#CBD5E1',
          color: selected.length > 0 && selected.length < options.length ? '#063669' : '#1E293B',
          fontWeight: selected.length > 0 && selected.length < options.length ? 700 : 500,
          padding: '0.55rem 1.1rem',
          borderRadius: '24px',
          fontSize: '0.84rem',
          minWidth: '135px'
        }}
      >
        <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '140px' }}>
          {getDisplayText()}
        </span>
        <LuChevronDown
          size={15}
          style={{
            color: '#557396',
            marginLeft: '0.35rem',
            transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: 'transform 0.15s ease',
            flexShrink: 0
          }}
        />
      </button>

      {isOpen && (
        <div
          style={{
            position: 'absolute',
            top: 'calc(100% + 4px)',
            left: 0,
            zIndex: 1000,
            backgroundColor: '#FFFFFF',
            borderRadius: '8px',
            border: '1px solid #CBD5E1',
            boxShadow: '0 12px 28px -4px rgba(6, 54, 105, 0.2), 0 8px 12px -4px rgba(6, 54, 105, 0.1)',
            minWidth: '180px',
            maxHeight: '260px',
            overflowY: 'auto',
            padding: '4px'
          }}
        >
          {/* Header option for All / Reset */}
          <div
            onClick={() => {
              onChange([]);
            }}
            style={{
              padding: '8px 12px',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '0.835rem',
              fontWeight: isAllSelected ? 700 : 500,
              color: isAllSelected ? '#063669' : '#64748B',
              backgroundColor: isAllSelected ? '#F0F5FA' : 'transparent',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '4px',
              borderBottom: '1px solid #F1F5F9'
            }}
          >
            <span>{allLabel}</span>
            {isAllSelected && <LuCheck size={14} color="#063669" />}
          </div>

          {/* Option list with checkboxes */}
          {options.map((opt) => {
            const isChecked = selected.includes(opt);
            return (
              <div
                key={opt}
                onClick={() => handleToggle(opt)}
                style={{
                  padding: '8px 12px',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '0.835rem',
                  fontWeight: isChecked ? 600 : 400,
                  color: isChecked ? '#063669' : '#1E293B',
                  backgroundColor: isChecked ? '#F0F5FA' : 'transparent',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  transition: 'background-color 0.1s ease'
                }}
                onMouseEnter={(e) => {
                  if (!isChecked) e.currentTarget.style.backgroundColor = '#F8FAFC';
                }}
                onMouseLeave={(e) => {
                  if (!isChecked) e.currentTarget.style.backgroundColor = 'transparent';
                }}
              >
                <div
                  style={{
                    width: '15px',
                    height: '15px',
                    borderRadius: '3px',
                    border: isChecked ? '1px solid #063669' : '1px solid #CBD5E1',
                    backgroundColor: isChecked ? '#063669' : '#FFFFFF',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#FFFFFF',
                    flexShrink: 0
                  }}
                >
                  {isChecked && <LuCheck size={11} strokeWidth={3} />}
                </div>
                <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {opt}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
