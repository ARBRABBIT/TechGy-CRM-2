import React, { useState, useRef, useEffect } from 'react';
import {
  LuChevronLeft,
  LuChevronRight,
  LuCalendar as CalendarIcon,
  LuChevronDown,
  LuRotateCcw
} from 'react-icons/lu';

import {
  WEEKDAYS,
  MONTH_NAMES,
  formatDateToISO,
  parseISOToDate,
  formatReadableDate
} from '../utils/dateUtils';


export default function FormDateSelector({
  value = '',
  onChange,
  placement = 'top',
  placeholder = 'Select Date'
}) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  // Parse initial view from value or fallback to current/default
  const initialDate = parseISOToDate(value) || new Date();
  const [viewYear, setViewYear] = useState(initialDate.getFullYear());
  const [viewMonth, setViewMonth] = useState(initialDate.getMonth());

  useEffect(() => {
    if (value) {
      const parsed = parseISOToDate(value);
      if (parsed) {
        setViewYear(prev => (prev !== parsed.getFullYear() ? parsed.getFullYear() : prev));
        setViewMonth(prev => (prev !== parsed.getMonth() ? parsed.getMonth() : prev));
      }
    }
  }, [value]);

  // Click outside to close
  useEffect(() => {
    function handleClickOutside(event) {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handlePrevMonth = (e) => {
    e.stopPropagation();
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear(prev => prev - 1);
    } else {
      setViewMonth(prev => prev - 1);
    }
  };

  const handleNextMonth = (e) => {
    e.stopPropagation();
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear(prev => prev + 1);
    } else {
      setViewMonth(prev => prev + 1);
    }
  };

  const handleDayClick = (isoStr) => {
    if (onChange) {
      onChange(isoStr);
    }
    setIsOpen(false);
  };

  const handleSetToday = (e) => {
    e.stopPropagation();
    const today = new Date();
    const iso = formatDateToISO(today);
    setViewYear(today.getFullYear());
    setViewMonth(today.getMonth());
    if (onChange) {
      onChange(iso);
    }
    setIsOpen(false);
  };

  // Generate Calendar Days for viewYear & viewMonth
  const generateCalendarDays = () => {
    const firstDayIndex = new Date(viewYear, viewMonth, 1).getDay();
    const totalDays = new Date(viewYear, viewMonth + 1, 0).getDate();
    const prevMonthTotalDays = new Date(viewYear, viewMonth, 0).getDate();
    const todayISO = formatDateToISO(new Date());

    const cells = [];

    // Leading days (prev month)
    for (let i = firstDayIndex - 1; i >= 0; i--) {
      cells.push({
        type: 'prev',
        day: prevMonthTotalDays - i
      });
    }

    // Current month days
    for (let d = 1; d <= totalDays; d++) {
      const iso = formatDateToISO(new Date(viewYear, viewMonth, d));
      const isSelected = value === iso;
      const isToday = iso === todayISO;

      cells.push({
        type: 'current',
        day: d,
        iso,
        isSelected,
        isToday
      });
    }

    // Trailing days (next month) to complete full rows
    const remaining = (7 - (cells.length % 7)) % 7;
    for (let n = 1; n <= remaining; n++) {
      cells.push({
        type: 'next',
        day: n
      });
    }

    return cells;
  };

  const calendarCells = generateCalendarDays();

  return (
    <div className="form-date-input-wrap" ref={containerRef}>
      <button
        type="button"
        className={`form-date-input-btn ${isOpen ? 'active' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Select Date"
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          <CalendarIcon size={15} style={{ color: '#063669', opacity: 0.85 }} />
          <span style={{ fontWeight: 600, color: '#063669', fontSize: '0.875rem' }}>
            {value ? formatReadableDate(value) : placeholder}
          </span>
        </div>
        <LuChevronDown
          size={15}
          style={{
            color: '#063669',
            transition: 'transform 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
            transform: isOpen ? 'rotate(180deg)' : 'none'
          }}
        />
      </button>

      {isOpen && (
        <div className={`form-date-popover placement-${placement}`}>
          {/* Month Navigation Header */}
          <div className="apple-month-nav">
            <span className="month-title">
              {MONTH_NAMES[viewMonth]} {viewYear}
            </span>
            <div className="nav-actions">
              <button
                type="button"
                className="nav-btn"
                onClick={handlePrevMonth}
                title="Previous Month"
              >
                <LuChevronLeft size={16} />
              </button>
              <button
                type="button"
                className="nav-btn"
                onClick={handleNextMonth}
                title="Next Month"
              >
                <LuChevronRight size={16} />
              </button>
            </div>
          </div>

          {/* Weekdays Row */}
          <div className="apple-weekdays-row">
            {WEEKDAYS.map((wd) => (
              <span key={wd} className="weekday-lbl">
                {wd}
              </span>
            ))}
          </div>

          {/* Calendar Grid */}
          <div className="apple-calendar-grid">
            {calendarCells.map((cell, idx) => {
              if (cell.type !== 'current') {
                return (
                  <div key={idx} className="day-cell disabled">
                    {cell.day}
                  </div>
                );
              }

              let cellClass = 'day-cell';
              if (cell.isSelected) cellClass += ' day-start day-end day-single-selected';
              if (cell.isToday) cellClass += ' day-today';

              return (
                <button
                  key={idx}
                  type="button"
                  className={cellClass}
                  onClick={() => handleDayClick(cell.iso)}
                >
                  {cell.day}
                </button>
              );
            })}
          </div>

          {/* Action Footer */}
          <div className="apple-popover-actions">
            <button
              type="button"
              className="apple-btn-secondary"
              onClick={handleSetToday}
            >
              <LuRotateCcw size={12} />
              Today
            </button>
            <button
              type="button"
              className="apple-btn-primary"
              onClick={() => setIsOpen(false)}
            >
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
