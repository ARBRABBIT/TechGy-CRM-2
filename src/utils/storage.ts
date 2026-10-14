import { STORAGE_KEYS } from '../constants/storageKeys';
import { getRole } from './roles';
import type { User } from '../types/crm';

/**
 * Safe localStorage helpers. Every read tolerates missing, blocked or corrupted
 * storage and falls back instead of throwing.
 */

const hasStorage = () => typeof window !== 'undefined' && Boolean(window.localStorage);

export function readJSON<T>(key: string, fallback: T): T {
  if (!hasStorage()) return fallback;
  try {
    const raw = localStorage.getItem(key);
    if (raw === null) return fallback;
    const parsed: unknown = JSON.parse(raw);
    // Reject values whose shape no longer matches (e.g. a list overwritten by an object)
    if (Array.isArray(fallback) && !Array.isArray(parsed)) return fallback;
    return parsed as T;
  } catch {
    return fallback;
  }
}

export function writeJSON(key: string, value: unknown): void {
  if (!hasStorage()) return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Quota exceeded or storage disabled — keep running with in-memory state
  }
}

export function removeKeys(keys: string[]): void {
  if (!hasStorage()) return;
  try {
    keys.forEach(k => localStorage.removeItem(k));
  } catch {
    // ignore
  }
}

/** Drop cached CRM records whenever the bundled mock data schema changes. */
export function migrateStoredData(version: string): void {
  if (!hasStorage()) return;
  if (readJSON(STORAGE_KEYS.DATA_VERSION, null) === version) return;
  removeKeys([
    STORAGE_KEYS.LEADS,
    STORAGE_KEYS.ACCOUNTS,
    STORAGE_KEYS.ACTIVITIES,
    STORAGE_KEYS.CONTACTS,
    STORAGE_KEYS.NOTIFICATIONS,
    STORAGE_KEYS.SALES_HEADS,
    STORAGE_KEYS.SALES_EXECUTIVES,
    'techgy_opportunities',
    'techgy_proposals'
  ]);
  writeJSON(STORAGE_KEYS.DATA_VERSION, version);
}

// ---------------------------------------------------------------------------
// Session
// ---------------------------------------------------------------------------

const isNonEmptyString = (v: unknown): v is string => typeof v === 'string' && v.trim().length > 0;

/** A stored user is only trusted if it has the expected shape and a known role. */
function isValidSessionUser(user: unknown): user is User {
  if (!user || typeof user !== 'object') return false;
  const u = user as Record<string, unknown>;
  return isNonEmptyString(u.name) && isNonEmptyString(u.email) && typeof u.role === 'string' && getRole(u.role) !== null;
}

export function loadSession(): User | null {
  const user = readJSON<unknown>(STORAGE_KEYS.CURRENT_USER, null);
  return isValidSessionUser(user) ? user : null;
}

export function saveSession(user: User): void {
  writeJSON(STORAGE_KEYS.CURRENT_USER, {
    name: user.name,
    email: user.email,
    role: user.role
  });
}

export function clearSession(): void {
  removeKeys([STORAGE_KEYS.CURRENT_USER, STORAGE_KEYS.AUTHENTICATED, STORAGE_KEYS.AUTH_TOKEN]);
}
