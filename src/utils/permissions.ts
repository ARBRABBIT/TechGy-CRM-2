import { ROLE, getRole } from './roles';
import type { Activity, Lead, RoleKey, SalesExecutive, User } from '../types/crm';

/**
 * Action-level permissions — the single source of truth for "who may do what".
 * UI uses `can()` to hide controls; App handlers call it again before mutating
 * state, so a hidden control can't be bypassed from another entry point.
 *
 * NOTE: client-side only. A real backend must enforce the same rules.
 */

export const ACTION = Object.freeze({
  LEAD_CREATE: 'lead.create',
  LEAD_EDIT: 'lead.edit',               // edit contact details / lead fields
  LEAD_STATUS: 'lead.status',           // move through pipeline stages
  LEAD_ENGAGE: 'lead.engage',           // notes, follow-ups, calls, email, WhatsApp
  LEAD_ASSIGN: 'lead.assign',           // assign / reassign sales executives, auto-assign
  LEAD_ASSIGN_HEAD: 'lead.assignHead',  // assign a lead to a sales head
  LEAD_JUNK: 'lead.junk',               // move to / restore from junk
  LEAD_DELETE: 'lead.delete',           // permanent delete
  LEAD_IMPORT: 'lead.import',           // bulk import
  ACCOUNT_CREATE: 'account.create',
  ACCOUNT_EDIT: 'account.edit',
  CONTACT_CREATE: 'contact.create',
  ACTIVITY_CREATE: 'activity.create',
  TEAM_MANAGE: 'team.manage',           // create / edit sales heads & executives
  MASTER_DATA_MANAGE: 'masterData.manage',
  INTEGRATIONS_MANAGE: 'integrations.manage' // lead connectors (Meta, Google Ads, LinkedIn, webhooks)
} as const);

export type Action = typeof ACTION[keyof typeof ACTION];
type UserLike = Pick<User, 'name' | 'role'> | null | undefined;

const ALL: Action[] = Object.values(ACTION);

const ROLE_PERMISSIONS: Record<RoleKey, Set<Action>> = {
  [ROLE.ADMIN]: new Set(ALL),
  [ROLE.HEAD]: new Set([
    ACTION.LEAD_CREATE,
    ACTION.LEAD_EDIT,
    ACTION.LEAD_STATUS,
    ACTION.LEAD_ENGAGE,
    ACTION.LEAD_ASSIGN,
    ACTION.LEAD_JUNK,
    ACTION.ACCOUNT_CREATE,
    ACTION.ACCOUNT_EDIT,
    ACTION.CONTACT_CREATE,
    ACTION.ACTIVITY_CREATE
  ]),
  [ROLE.EXECUTIVE]: new Set([
    ACTION.LEAD_STATUS,
    ACTION.LEAD_ENGAGE
  ])
};

export const can = (user: UserLike, action: Action | undefined): boolean => {
  const role = getRole(user);
  return Boolean(role && action && ROLE_PERMISSIONS[role].has(action));
};

/** Permission required by each CommonActionsModal / quick-action save type. */
export const SAVE_ACTION_PERMISSION: Partial<Record<string, Action>> = {
  createLead: ACTION.LEAD_CREATE,
  createAccount: ACTION.ACCOUNT_CREATE,
  createContact: ACTION.CONTACT_CREATE,
  createActivity: ACTION.ACTIVITY_CREATE,
  addNote: ACTION.LEAD_ENGAGE,
  scheduleFollowup: ACTION.LEAD_ENGAGE,
  call: ACTION.LEAD_ENGAGE,
  email: ACTION.LEAD_ENGAGE,
  sms: ACTION.LEAD_ENGAGE,
  changeStatus: ACTION.LEAD_STATUS,
  assignOwner: ACTION.LEAD_ASSIGN
};

const HEAD_FIELDS: (keyof Lead)[] = ['salesHead', 'reportingSalesHead'];
const EXEC_FIELDS: (keyof Lead)[] = ['salesExecutive', 'assignedSalesExecutive', 'executive', 'leadOwner'];
const STATUS_FIELDS: (keyof Lead)[] = ['status', 'stageHistory'];

/**
 * Which action a partial lead update represents, based on the fields it actually
 * changes (fields resent with their current value are ignored).
 */
export function actionForLeadUpdate(fields: Partial<Lead> = {}, currentLead: Lead | null = null): Action {
  const keys = (Object.keys(fields) as (keyof Lead)[]).filter(k => !currentLead || fields[k] !== currentLead[k]);
  // Executive assignment may sync the sales head too; that's still an exec assignment
  if (keys.some(k => EXEC_FIELDS.includes(k))) return ACTION.LEAD_ASSIGN;
  if (keys.some(k => HEAD_FIELDS.includes(k))) return ACTION.LEAD_ASSIGN_HEAD;
  if (keys.includes('isJunk')) return ACTION.LEAD_JUNK;
  if (keys.length > 0 && keys.every(k => STATUS_FIELDS.includes(k))) return ACTION.LEAD_STATUS;
  return ACTION.LEAD_EDIT;
}

// ---------------------------------------------------------------------------
// Data visibility
// ---------------------------------------------------------------------------

const norm = (v: unknown): string => (typeof v === 'string' ? v.toLowerCase().trim() : '');

/** Leads a user may see: admins see all, heads their team's, executives their own. */
export function scopeLeadsForUser(leads: Lead[], user: UserLike, salesExecutives: SalesExecutive[] = []): Lead[] {
  const role = getRole(user);
  if (role === ROLE.ADMIN) return leads;

  const me = norm(user?.name);
  if (!me) return [];

  if (role === ROLE.HEAD) {
    const teamExecNames = new Set(
      salesExecutives.filter(se => norm(se.reportingSalesHead) === me).map(se => se.name)
    );
    return leads.filter(l =>
      norm(l.salesHead) === me ||
      norm(l.reportingSalesHead) === me ||
      norm(l.leadOwner) === me ||
      teamExecNames.has(l.salesExecutive ?? '') ||
      teamExecNames.has(l.assignedSalesExecutive ?? '')
    );
  }

  if (role === ROLE.EXECUTIVE) {
    return leads.filter(l =>
      norm(l.salesExecutive) === me ||
      norm(l.assignedSalesExecutive) === me ||
      norm(l.executive) === me ||
      norm(l.leadOwner) === me
    );
  }

  return [];
}

/** Activities a user may see: admins all; others those tied to their visible leads or owned by them. */
export function scopeActivitiesForUser(activities: Activity[], user: UserLike, visibleLeads: Lead[]): Activity[] {
  if (getRole(user) === ROLE.ADMIN) return activities;
  const me = norm(user?.name);
  const leadNames = new Set(visibleLeads.map(l => norm(l.leadName)));
  const leadIds = new Set(visibleLeads.map(l => l.id));
  return activities.filter(a =>
    leadIds.has(a.leadId ?? '') ||
    leadNames.has(norm(a.lead)) ||
    (me && norm(a.owner) === me)
  );
}

/** Executives a user may assign leads to: heads only their own team. */
export function scopeExecutivesForUser(salesExecutives: SalesExecutive[], user: UserLike): SalesExecutive[] {
  if (getRole(user) !== ROLE.HEAD) return salesExecutives;
  const me = norm(user?.name);
  return salesExecutives.filter(se => norm(se.reportingSalesHead) === me);
}
