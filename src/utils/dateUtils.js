/**
 * Date Utility for TechGy CRM Internal
 * Supports parsing multiple date formats and checking if a date falls within
 * preset or custom date ranges.
 */

// Parse various date strings into standard YYYY-MM-DD format or Date object
export function parseDateString(dateStr) {
  if (!dateStr || typeof dateStr !== 'string') return null;

  const trimmed = dateStr.trim();
  if (!trimmed) return null;

  // Format 1: YYYY-MM-DD or YYYY-MM-DD HH:mm...
  const isoMatch = trimmed.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (isoMatch) {
    const [, y, m, d] = isoMatch;
    return `${y}-${m}-${d}`;
  }

  // Format 2: DD MMM YYYY (e.g., "28 Oct 2024", "10 Dec 2024")
  const textMatch = trimmed.match(/^(\d{1,2})\s+([A-Za-z]{3,9})\s+(\d{4})/);
  if (textMatch) {
    const [, day, monthStr, year] = textMatch;
    const months = {
      jan: '01', feb: '02', mar: '03', apr: '04', may: '05', jun: '06',
      jul: '07', aug: '08', sep: '09', oct: '10', nov: '11', dec: '12'
    };
    const mKey = monthStr.toLowerCase().slice(0, 3);
    const m = months[mKey] || '01';
    const d = day.padStart(2, '0');
    return `${year}-${m}-${d}`;
  }

  return null;
}

// Convert YYYY-MM-DD to timestamp for comparison
function toTimestamp(dateFormattedStr) {
  if (!dateFormattedStr) return null;
  const parts = dateFormattedStr.split('-');
  if (parts.length !== 3) return null;
  return new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10)).getTime();
}

/**
 * Filter check: determine if itemDate falls within current filterValue
 * filterValue can be a string (preset) or an object:
 * { type: 'custom', startDate: 'YYYY-MM-DD', endDate: 'YYYY-MM-DD', label: '...' }
 */
export function isDateInFilter(dateStr, filterValue) {
  if (!filterValue || filterValue === 'All Time') return true;
  if (!dateStr) return true; // Keep items with unspecified date (e.g. Company Accounts)

  const parsed = parseDateString(dateStr);
  
  // If filter is an object (custom range or custom preset object)
  if (typeof filterValue === 'object' && filterValue !== null) {
    if (filterValue.type === 'custom') {
      if (!parsed) return true; // Keep items with unspecified date
      const itemTs = toTimestamp(parsed);
      if (!itemTs) return true;

      const startTs = filterValue.startDate ? toTimestamp(filterValue.startDate) : null;
      const endTs = filterValue.endDate ? toTimestamp(filterValue.endDate) : null;

      if (startTs && itemTs < startTs) return false;
      if (endTs && itemTs > endTs + (24 * 60 * 60 * 1000 - 1)) return false; // Include full end date day
      return true;
    }
    filterValue = filterValue.preset || filterValue.label || 'All Time';
  }

  // Handle standard string presets
  if (typeof filterValue === 'string') {
    if (filterValue === 'All Time') return true;

    const rawLower = (dateStr || '').toLowerCase();
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth(); // 0-11
    const currentQuarter = Math.floor(currentMonth / 3);

    const pad = (n) => String(n).padStart(2, '0');
    const todayStr = `${currentYear}-${pad(currentMonth + 1)}-${pad(now.getDate())}`;
    
    const yest = new Date(now);
    yest.setDate(yest.getDate() - 1);
    const yesterdayStr = `${yest.getFullYear()}-${pad(yest.getMonth() + 1)}-${pad(yest.getDate())}`;

    if (filterValue === 'This Month') {
      const monthPrefix = `${currentYear}-${pad(currentMonth + 1)}`;
      if (!parsed) {
        return rawLower.includes(monthPrefix);
      }
      return parsed.startsWith(monthPrefix);
    }

    if (filterValue === 'This Quarter') {
      const qStartMonth = currentQuarter * 3;
      const qMonths = [qStartMonth + 1, qStartMonth + 2, qStartMonth + 3].map(m => `${currentYear}-${pad(m)}`);
      if (!parsed) {
        return qMonths.some(qm => rawLower.includes(qm));
      }
      return qMonths.some(qm => parsed.startsWith(qm));
    }

    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
    const endOfToday = startOfToday + 24 * 60 * 60 * 1000 - 1;

    const fyMatch = filterValue.match(/^FY\s*(\d{4})-(\d{2})$/);
    if (fyMatch) {
      const fyStartYear = parseInt(fyMatch[1], 10);
      const fyEndYear = fyStartYear + 1;
      const fyStartTs = new Date(fyStartYear, 3, 1).getTime();        // Apr 1, 00:00:00
      const fyEndTs   = new Date(fyEndYear, 2, 31).getTime() + 24 * 60 * 60 * 1000 - 1; // Mar 31, 23:59:59.999
      if (!parsed) {
        return rawLower.includes(`${fyStartYear}-04`) || rawLower.includes(`${fyEndYear}-03`);
      }
      const itemTs = toTimestamp(parsed);
      return itemTs !== null && itemTs >= fyStartTs && itemTs <= fyEndTs;
    }

    if (filterValue === 'Last 7 Days') {
      if (!parsed) return true;
      const itemTs = toTimestamp(parsed);
      if (!itemTs) return true;
      const sevenDaysAgo = startOfToday - 7 * 24 * 60 * 60 * 1000;
      return itemTs >= sevenDaysAgo && itemTs <= endOfToday;
    }

    if (filterValue === 'Last 30 Days') {
      if (!parsed) return true;
      const itemTs = toTimestamp(parsed);
      if (!itemTs) return true;
      const thirtyDaysAgo = startOfToday - 30 * 24 * 60 * 60 * 1000;
      return itemTs >= thirtyDaysAgo && itemTs <= endOfToday;
    }

    if (filterValue === 'Today') {
      if (!parsed) return rawLower.includes(todayStr);
      return parsed === todayStr;
    }

    if (filterValue === 'Yesterday') {
      if (!parsed) return rawLower.includes(yesterdayStr);
      return parsed === yesterdayStr;
    }
  }

  return true;
}

// Get user-friendly display string for filter button
export function getFilterLabel(filterValue) {
  if (!filterValue) return 'This Month';
  if (typeof filterValue === 'string') return filterValue;
  if (typeof filterValue === 'object') {
    if (filterValue.label) return filterValue.label;
    if (filterValue.startDate && filterValue.endDate) {
      if (filterValue.startDate === filterValue.endDate) {
        return filterValue.startDate;
      }
      return `${filterValue.startDate} to ${filterValue.endDate}`;
    }
    if (filterValue.startDate) return `From ${filterValue.startDate}`;
    if (filterValue.endDate) return `Until ${filterValue.endDate}`;
  }
  return 'Custom Date';
}

// Shared calendar & date constants
export const WEEKDAYS = ['SU', 'MO', 'TU', 'WE', 'TH', 'FR', 'SA'];
export const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

export function formatDateToISO(d) {
  if (!d) return '';
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function parseISOToDate(isoStr) {
  if (!isoStr) return null;
  const parts = isoStr.split('-');
  if (parts.length !== 3) return null;
  return new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10));
}

export function formatReadableDate(isoStr) {
  const d = parseISOToDate(isoStr);
  if (!d) return 'Select Date';
  const monthShort = MONTH_NAMES[d.getMonth()].slice(0, 3);
  const day = String(d.getDate()).padStart(2, '0');
  return `${day} ${monthShort} ${d.getFullYear()}`;
}

export function getTodayISO() {
  return formatDateToISO(new Date());
}

export function getFutureISO(days = 30) {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return formatDateToISO(d);
}

export function getPastISO(days = 1) {
  const d = new Date();
  d.setDate(d.getDate() - days);
  return formatDateToISO(d);
}

export function getCurrentFiscalYear() {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth(); // 0-indexed: 3 = April
  const startYear = month >= 3 ? year : year - 1;
  const endYearShort = String(startYear + 1).slice(-2);
  return `FY ${startYear}-${endYearShort}`;
}


