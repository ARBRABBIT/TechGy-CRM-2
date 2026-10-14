/**
 * Form validation shared by the CRM's create / edit forms.
 * Each validator returns an error message, or '' when the value is fine.
 */

import type { Lead } from '../types/crm';

/** A rule receives the field value and all form values; returns an error message or ''. */
export type Validator = (value: unknown, all: Record<string, unknown>) => string;
export type Rules = Record<string, Validator[]>;
export type FieldErrors = Record<string, string>;

const str = (v: unknown): string => (typeof v === 'string' ? v.trim() : v == null ? '' : String(v).trim());

export const isEmail = (v: unknown): boolean => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(str(v));

// 7–15 digits, optionally with + ( ) - . and spaces
export const isPhone = (v: unknown): boolean => {
  const s = str(v);
  return /^\+?[\d\s().-]+$/.test(s) && s.replace(/\D/g, '').length >= 7 && s.replace(/\D/g, '').length <= 15;
};

export const isUrl = (v: unknown): boolean => {
  try {
    const url = new URL(/^https?:\/\//i.test(str(v)) ? str(v) : `https://${str(v)}`);
    return url.hostname.includes('.');
  } catch {
    return false;
  }
};

export const required = (label: string): Validator => (v) => (str(v) ? '' : `${label} is required.`);
export const minLength = (label: string, n: number): Validator => (v) => (!str(v) || str(v).length >= n ? '' : `${label} must be at least ${n} characters.`);
export const maxLength = (label: string, n: number): Validator => (v) => (str(v).length <= n ? '' : `${label} must be ${n} characters or fewer.`);
export const email = (label = 'Email'): Validator => (v) => (!str(v) || isEmail(v) ? '' : `Enter a valid ${label.toLowerCase()} address.`);
export const phone = (label = 'Phone number'): Validator => (v) => (!str(v) || isPhone(v) ? '' : `Enter a valid ${label.toLowerCase()} (7–15 digits).`);
export const url = (label = 'Website'): Validator => (v) => (!str(v) || isUrl(v) ? '' : `Enter a valid ${label.toLowerCase()} URL.`);
export const notInPast = (label: string): Validator => (v) => {
  const s = str(v).slice(0, 10);
  if (!s) return '';
  const today = new Date();
  const todayIso = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
  return s >= todayIso ? '' : `${label} can’t be in the past.`;
};

/** Run `{ field: [validators] }` against `values`; returns `{ field: message }` for failures. */
export function validate(values: object, rules: Rules): FieldErrors {
  const all = values as Record<string, unknown>;
  const errors: FieldErrors = {};
  for (const [field, validators] of Object.entries(rules)) {
    for (const check of validators) {
      const message = check(all[field], all);
      if (message) {
        errors[field] = message;
        break;
      }
    }
  }
  return errors;
}

const norm = (v: unknown): string => str(v).toLowerCase();
const digits = (v: unknown): string => str(v).replace(/\D/g, '');

/** Existing lead that shares an email or phone number with `candidate`, if any. */
export function findDuplicateLead(leads: Lead[], candidate: { email?: unknown; phone?: unknown }): Lead | null {
  const mail = norm(candidate.email);
  const tel = digits(candidate.phone);
  return leads.find(l =>
    (mail && norm(l.emailId) === mail) ||
    (tel.length >= 7 && digits(l.phoneNumber).endsWith(tel.slice(-10)))
  ) || null;
}

const NAME = [required('Name'), minLength('Name', 2), maxLength('Name', 80)];

/** Rules for each CommonActionsModal action type. */
export const ACTION_RULES: Record<string, Rules> = {
  createLead: {
    leadName: [required('Lead name'), minLength('Lead name', 2), maxLength('Lead name', 80)],
    company: [required('Company name'), maxLength('Company name', 120)],
    email: [email()],
    phone: [phone()],
    designation: [maxLength('Designation', 80)],
    notes: [maxLength('Notes', 2000)]
  },
  createAccount: {
    companyName: [(v, all) => required('Company name')(v || all.company, all), maxLength('Company name', 120)],
    website: [url()],
    notes: [maxLength('Notes', 2000)]
  },
  createContact: {
    leadName: NAME,
    company: [required('Company name')],
    email: [email()],
    phone: [phone()]
  },
  createActivity: {
    nextAction: [(v, all) => required('Activity title or notes')(v || all.notes, all), maxLength('Title', 160)],
    dueDate: [required('Date')]
  },
  addNote: { notes: [required('Note'), maxLength('Note', 2000)] },
  email: {
    subject: [required('Subject'), maxLength('Subject', 200)],
    notes: [required('Message'), maxLength('Message', 10000)]
  },
  sms: { notes: [required('Message'), maxLength('Message', 1000)] },
  call: { outcome: [required('Call outcome')], notes: [maxLength('Notes', 2000)] },
  scheduleFollowup: {
    dueDate: [required('Follow-up date'), notInPast('Follow-up date')],
    nextAction: [maxLength('Next action', 300)]
  },
  changeStatus: { status: [required('Status')] },
  assignOwner: { owner: [required('Owner')] }
};
