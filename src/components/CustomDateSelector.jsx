import React, { useState, useRef, useEffect } from 'react';
import {
  LuChevronDown,
  LuChevronLeft,
  LuChevronRight,
  LuCalendar as CalendarIcon,
  LuCheck,
  LuX,
  LuRotateCcw
} from 'react-icons/lu';
import { getFilterLabel } from '../utils/dateUtils';

const PRESET_OPTIONS = [
  'This Month',
  'This Quarter',
  'FY 2025-26',
  'Last 7 Days',
  'Last 30 Days',
  'All Time'
];

const WEEKDAYS = ['SU', 'MO', 'TU', 'WE', 'TH', 'FR', 'SA'];
const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

// Helper to format Date to YYYY-MM-DD
function formatDateToISO(d) {
  if (!d) return '';
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

// Helper to parse YYYY-MM-DD into Date object
function parseISOToDate(isoStr) {
  if (!isoStr) return null;
  const parts = isoStr.split('-');
  if (parts.length !== 3) return null;
  return new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10));
}

// Format YYYY-MM-DD for readable Apple badge display (e.g., "01 Aug 2026")
function formatReadableDate(isoStr) {
  const d = parseISOToDate(isoStr);
  if (!d) return 'Select';
  const monthShort = MONTH_NAMES[d.getMonth()].slice(0, 3);
  const day = String(d.getDate()).padStart(2, '0');
  return `${day} ${monthShort} ${d.getFullYear()}`;
}

export default function CustomDateSelector({ selectedDateFilter, setSelectedDateFilter }) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('calendar'); // 'presets' | 'calendar'
  
  // Custom range selection dates
  const [startDateStr, setStartDateStr] = useState('2026-08-01');
  const [endDateStr, setEndDateStr] = useState('2026-09-02');

  // Currently viewed month/year in the interactive calendar (defaults to Aug 2026)
  const [viewYear, setViewYear] = useState(2026);
  const [viewMonth, setViewMonth] = useState(7); // 0-indexed: 7 = August

  // Selection step: 'start' (picking start date next) or 'end' (picking end date next)
  const [pickingMode, setPickingMode] = useState('start');
  const containerRef = useRef(null);

  // Sync internal state when selectedDateFilter prop changes
  useEffect(() => {
    if (typeof selectedDateFilter === 'object' && selectedDateFilter !== null) {
      if (selectedDateFilter.startDate) setStartDateStr(selectedDateFilter.startDate);
      if (selectedDateFilter.endDate) setEndDateStr(selectedDateFilter.endDate);
    }
  }, [selectedDateFilter]);

  // Click outside to close
  useEffect(() => {
    function handleClickOutside(event) {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelectPreset = (preset) => {
    setSelectedDateFilter(preset);
    setIsOpen(false);
  };

  const handlePrevMonth = () => {
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear(prev => prev - 1);
    } else {
      setViewMonth(prev => prev - 1);
    }
  };

  const handleNextMonth = () => {
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear(prev => prev + 1);
    } else {
      setViewMonth(prev => prev + 1);
    }
  };

  // Calendar Day Click Handler
  const handleDayClick = (dayNum) => {
    const clickedISO = formatDateToISO(new Date(viewYear, viewMonth, dayNum));

    if (pickingMode === 'start' || !startDateStr || (startDateStr && endDateStr)) {
      setStartDateStr(clickedISO);
      setEndDateStr('');
      setPickingMode('end');
    } else if (pickingMode === 'end') {
      const startDt = parseISOToDate(startDateStr);
      const clickedDt = parseISOToDate(clickedISO);

      if (clickedDt < startDt) {
        setStartDateStr(clickedISO);
        setEndDateStr('');
        setPickingMode('end');
      } else {
        setEndDateStr(clickedISO);
        setPickingMode('start');
      }
    }
  };

  const handleApplyCustomRange = (e) => {
    e.preventDefault();
    if (!startDateStr && !endDateStr) {
      setSelectedDateFilter('All Time');
    } else {
      const startFormatted = startDateStr ? formatReadableDate(startDateStr) : '';
      const endFormatted = endDateStr ? formatReadableDate(endDateStr) : '';

      let label = 'Custom Range';
      if (startDateStr && endDateStr) {
        label = startDateStr === endDateStr ? startFormatted : `${startFormatted} – ${endFormatted}`;
      } else if (startDateStr) {
        label = `From ${startFormatted}`;
      } else if (endDateStr) {
        label = `Until ${endFormatted}`;
      }

      setSelectedDateFilter({
        type: 'custom',
        startDate: startDateStr,
        endDate: endDateStr || startDateStr,
        label: label
      });
    }
    setIsOpen(false);
  };

  const handleReset = () => {
    setSelectedDateFilter('This Month');
    setStartDateStr('2026-08-01');
    setEndDateStr('2026-09-02');
    setPickingMode('start');
    setIsOpen(false);
  };

  // Generate Calendar Days for viewYear & viewMonth
  const generateCalendarDays = () => {
    const firstDayIndex = new Date(viewYear, viewMonth, 1).getDay();
    const totalDays = new Date(viewYear, viewMonth + 1, 0).getDate();
    const prevMonthTotalDays = new Date(viewYear, viewMonth, 0).getDate();

    const cells = [];

    // Leading days (prev month)
    for (let i = firstDayIndex - 1; i >= 0; i--) {
      cells.push({
        type: 'prev',
        day: prevMonthTotalDays - i
      });
    }

    // Current month days
    let startISO = startDateStr;
    let endISO = endDateStr;
    if (startDateStr && endDateStr && startDateStr > endDateStr) {
      startISO = endDateStr;
      endISO = startDateStr;
    }

    for (let d = 1; d <= totalDays; d++) {
      const iso = formatDateToISO(new Date(viewYear, viewMonth, d));
      const isStart = startISO === iso;
      const isEnd = endISO === iso;

      let inRange = false;
      if (startISO && endISO && startISO !== endISO) {
        const currentTs = new Date(viewYear, viewMonth, d).getTime();
        const startTs = parseISOToDate(startISO)?.getTime();
        const endTs = parseISOToDate(endISO)?.getTime();
        if (startTs && endTs && currentTs > startTs && currentTs < endTs) {
          inRange = true;
        }
      }

      const isToday = iso === '2026-09-02';

      cells.push({
        type: 'current',
        day: d,
        iso,
        isStart,
        isEnd,
        inRange,
        isToday
      });
    }

    // Trailing days (next month) to complete 35 or 42 grid cells
    const remaining = (7 - (cells.length % 7)) % 7;
    for (let n = 1; n <= remaining; n++) {
      cells.push({
        type: 'next',
        day: n
      });
    }

    return cells;
  };

  const currentLabel = getFilterLabel(selectedDateFilter);
  const isCustomActive = typeof selectedDateFilter === 'object' && selectedDateFilter?.type === 'custom';
  const calendarCells = generateCalendarDays();

  return (
    <div className="custom-date-selector-wrapper" ref={containerRef}>
      <button
        type="button"
        className={`apple-date-btn ${isOpen ? 'active' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
        title="Select Date Filter"
      >
        <CalendarIcon size={14} className="date-icon" />
        <span className="date-label">{currentLabel}</span>
        <LuChevronDown size={14} className={`chevron-icon ${isOpen ? 'rotated' : ''}`} />
      </button>

      {isOpen && (
        <div className="apple-date-popover">
          {/* Header Segmented Pill Bar */}
          <div className="apple-segmented-bar">
            <button
              type="button"
              className={`segmented-tab ${activeTab === 'calendar' ? 'active' : ''}`}
              onClick={() => setActiveTab('calendar')}
            >
              Custom Range
            </button>
            <button
              type="button"
              className={`segmented-tab ${activeTab === 'presets' ? 'active' : ''}`}
              onClick={() => setActiveTab('presets')}
            >
              Presets
            </button>
          </div>

          {activeTab === 'presets' && (
            <div className="apple-presets-container">
              <span className="apple-section-title">Filter Presets</span>
              <div className="apple-presets-grid">
                {PRESET_OPTIONS.map((preset) => {
                  const isSelected = !isCustomActive && selectedDateFilter === preset;
                  return (
                    <button
                      key={preset}
                      type="button"
                      className={`apple-preset-item ${isSelected ? 'selected' : ''}`}
                      onClick={() => handleSelectPreset(preset)}
                    >
                      <span>{preset}</span>
                      {isSelected && <LuCheck size={14} />}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {activeTab === 'calendar' && (
            <div className="apple-calendar-container">
              {/* Range Badges Display */}
              <div className="apple-range-display">
                <div className={`range-badge ${pickingMode === 'start' ? 'active-badge' : ''}`}>
                  <span className="badge-lbl">FROM</span>
                  <span className="badge-val">{startDateStr ? formatReadableDate(startDateStr) : 'Select'}</span>
                </div>
                <span className="range-arrow">→</span>
                <div className={`range-badge ${pickingMode === 'end' ? 'active-badge' : ''}`}>
                  <span className="badge-lbl">TO</span>
                  <span className="badge-val">{endDateStr ? formatReadableDate(endDateStr) : 'Select'}</span>
                </div>
              </div>

              {/* Month Navigation Header */}
              <div className="apple-month-nav">
                <span className="month-title">
                  {MONTH_NAMES[viewMonth]} {viewYear}
                </span>
                <div className="nav-actions">
                  <button type="button" className="nav-btn" onClick={handlePrevMonth} title="Previous Month">
                    <LuChevronLeft size={16} />
                  </button>
                  <button type="button" className="nav-btn" onClick={handleNextMonth} title="Next Month">
                    <LuChevronRight size={16} />
                  </button>
                </div>
              </div>

              {/* Weekday Labels */}
              <div className="apple-weekdays-row">
                {WEEKDAYS.map((wd) => (
                  <span key={wd} className="weekday-lbl">{wd}</span>
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
                  if (cell.isStart) cellClass += ' day-start';
                  if (cell.isEnd) cellClass += ' day-end';
                  if (cell.isStart && cell.isEnd) cellClass += ' day-single-selected';
                  if (cell.inRange) cellClass += ' day-in-range';
                  if (cell.isToday) cellClass += ' day-today';

                  return (
                    <button
                      key={idx}
                      type="button"
                      className={cellClass}
                      onClick={() => handleDayClick(cell.day)}
                    >
                      {cell.day}
                    </button>
                  );
                })}
              </div>

              {/* Action Buttons */}
              <div className="apple-popover-actions">
                <button
                  type="button"
                  className="apple-btn-secondary"
                  onClick={handleReset}
                >
                  <LuRotateCcw size={12} />
                  Reset
                </button>
                <button
                  type="button"
                  className="apple-btn-primary"
                  onClick={handleApplyCustomRange}
                >
                  Apply Filter
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
