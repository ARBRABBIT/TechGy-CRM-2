/**
 * Role helpers — the single place that interprets `currentUser.role`.
 *
 * Roles arrive in several spellings ('Sales Head', 'head', ...). Everything is
 * normalised to one of the ROLE keys; unknown or missing roles resolve to null
 * and are granted nothing (fail closed).
 *
 * NOTE: this only shapes the UI. Real authorization must be enforced by the API.
 */

import type { ModuleId, RoleKey, User } from '../types/crm';

export const ROLE = Object.freeze({
  ADMIN: 'admin',
  HEAD: 'head',
  EXECUTIVE: 'executive'
} as const satisfies Record<string, RoleKey>);

type UserLike = Pick<User, 'role'> | { role?: unknown } | null | undefined;

const ROLE_ALIASES: Record<string, RoleKey> = {
  'admin': ROLE.ADMIN,
  'sales admin': ROLE.ADMIN,
  'superadmin': ROLE.ADMIN,
  'super admin': ROLE.ADMIN,
  'head': ROLE.HEAD,
  'sales head': ROLE.HEAD,
  'executive': ROLE.EXECUTIVE,
  'sales executive': ROLE.EXECUTIVE
};

const ROLE_LABELS: Record<RoleKey, string> = {
  [ROLE.ADMIN]: 'Sales Admin',
  [ROLE.HEAD]: 'Sales Head',
  [ROLE.EXECUTIVE]: 'Sales Executive'
};

// Modules reachable through navigation, deep links and breadcrumbs.
// The first entry is the role's landing module.
const SHARED_MODULES: ModuleId[] = ['leads', 'accounts', 'contacts', 'activities'];
const ROLE_MODULES: Record<RoleKey, ModuleId[]> = {
  [ROLE.ADMIN]: ['dashboard', 'salesHead', 'salesExecutive', 'heatmap', 'social', 'masterData', 'integrations', ...SHARED_MODULES],
  [ROLE.HEAD]: ['salesHead', 'heatmap', 'social', ...SHARED_MODULES],
  [ROLE.EXECUTIVE]: ['salesExecutive', ...SHARED_MODULES]
};

/** Normalise a user object (or raw role string) to a ROLE key, or null. */
export function getRole(userOrRole: UserLike | string): RoleKey | null {
  const raw = typeof userOrRole === 'string' ? userOrRole : userOrRole?.role;
  if (typeof raw !== 'string') return null;
  return ROLE_ALIASES[raw.trim().toLowerCase()] || null;
}

export const hasRole = (user: UserLike, role: RoleKey): boolean => getRole(user) === role;

export const getRoleLabel = (user: UserLike): string => {
  const role = getRole(user);
  return role ? ROLE_LABELS[role] : 'Team Member';
};

export const getHomeModule = (user: UserLike): ModuleId => {
  const role = getRole(user);
  return role ? ROLE_MODULES[role][0] : 'dashboard';
};

export const canAccessModule = (user: UserLike, moduleId: string): boolean => {
  const role = getRole(user);
  return role ? (ROLE_MODULES[role] as string[]).includes(moduleId) : false;
};
